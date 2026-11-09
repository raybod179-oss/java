// API مدیریت (فقط یک مدیر): /api/admin/*
import crypto from "node:crypto";
import { sameOrigin, getSecret, sign, verify, getCookie, setCookie, normPhone, newCode, codeKey, encCode, decCode, credHash, credEq, ID_RE, FREE, clientIp, lockedUntil, addFail, clearFails, sleep, json } from "../lib/auth.mjs";
import { stores } from "../lib/store.mjs";
import { DEFAULT_ADMIN } from "../lib/admin-cred.mjs";
import { contentRoot, listDir } from "../lib/content.mjs";
import { getSite, cleanSite, parseVideo, pricingOf, countCodes, parseImage, IMG_KINDS } from "../lib/site.mjs";

export const config = { path: "/api/admin/*" };
const AP = "/api/admin";
const HOURS = 12;
const MAX_ADMINS = 3; // حداکثر ۳ نفر هم‌زمان با یک شماره و رمز؛ نفر چهارم رد می‌شود
const authed = new WeakSet(); // درخواست‌هایی که مدیر واردشده دارند (فقط برای آن‌ها جزئیات خطا نشان داده می‌شود)
const POST_ONLY = new Set(["logout", "create", "toggle", "reset", "regen", "update", "bulk", "delete", "password", "siteimg", "kick", "revmod"]);
// برچسب نسخه‌ی رمز: بعد از تغییر رمز، نشست‌های قدیمی خودکار باطل می‌شوند
const credTag = (cred) => crypto.createHash("sha256").update(JSON.stringify(cred.hash)).digest("hex").slice(0, 16);
// اجرای موازی با سقف تعداد (برای اینکه با صدها کد، تابع Netlify تایم‌اوت نشود)
async function pool(items, n, fn) {
  const out = new Array(items.length); let i = 0;
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => { while (i < items.length) { const k = i++; out[k] = await fn(items[k]); } }));
  return out;
}
const cleanPhone = (v) => { const ph = normPhone(String(v ?? "")); return ph.length >= 10 && ph.length <= 13 ? ph : String(v ?? "").trim().slice(0, 20); };
const safeDec = (enc, key) => { try { return decCode(enc, key); } catch { return ""; } }; // یک رکورد خراب کل لیست را خراب نکند

// نوشتن «فقط اگر وجود ندارد». روی نسخه‌های قدیمی @netlify/blobs مقدار برگشتی undefined است
// (علت اصلی خطای «ساخت کد انجام نشد») ← اینجا هر دو حالت درست مدیریت می‌شود.
async function putNew(store, key, val) {
  if (await store.get(key, { type: "json" })) return false;
  const r = await store.setJSON(key, val, { onlyIfNew: true });
  return !(r && r.modified === false);
}
const DAY = 86400000;
const SUPPORT_DEFAULT = 3; // ماه پشتیبانی پیش‌فرض (۳ ماه، بدون تمدید)
const cleanPrice = (v) => { const n = Math.floor(Number(String(v ?? "").replace(/[^\d]/g, ""))); return Number.isFinite(n) && n > 0 ? Math.min(n, 2_000_000_000) : 0; };
const cleanMonths = (v, d = SUPPORT_DEFAULT) => { const n = Math.floor(Number(v)); return Number.isFinite(n) && n >= 0 ? Math.min(n, 36) : d; };
const cleanSource = (v) => String(v ?? "").trim().slice(0, 30);
const defaultSettings = { goalCount: 10, goalRevenue: 0, defaultPrice: 0, defaultSupport: SUPPORT_DEFAULT, ver: 70 };
// تنظیمات قدیمی (قبل از v70) پشتیبانی پیش‌فرض ۴ ماه داشتند؛ تا اولین ذخیره‌ی جدید، ۳ ماه اعمال می‌شود
async function getSettings(locks) { const o = await locks.get("_settings", { type: "json" }).catch(() => null); const st = { ...defaultSettings, ...(o || {}) }; if (!o || o.ver !== 70) st.defaultSupport = SUPPORT_DEFAULT; return st; }
const cleanDays = (v) => { const n = Math.floor(Number(v)); return Number.isFinite(n) && n > 0 ? Math.min(n, 3650) : 0; };
function deviceOf(ua = "") {
  const os = /Windows/i.test(ua) ? "Windows" : /Android/i.test(ua) ? "Android" : /iPhone|iPad|iPod/i.test(ua) ? "iOS" : /Mac OS X|Macintosh/i.test(ua) ? "macOS" : /Linux/i.test(ua) ? "Linux" : "";
  const br = /Edg\//i.test(ua) ? "Edge" : /OPR\/|Opera/i.test(ua) ? "Opera" : /Firefox|FxiOS/i.test(ua) ? "Firefox" : /SamsungBrowser/i.test(ua) ? "Samsung Internet" : /Chrome|CriOS/i.test(ua) ? "Chrome" : /Safari/i.test(ua) ? "Safari" : "";
  return [br, os].filter(Boolean).join(" · ");
}
const view = (id, r, key, bound, ips7 = 0) => {
  const c = bound.get(id), days = r.days > 0 ? r.days : 0, at = c ? c.at || 0 : 0;
  const expiresAt = c && days ? at + days * DAY : 0, expired = !!(expiresAt && Date.now() > expiresAt);
  const status = !r.active ? "inactive" : expired ? "expired" : c ? "in_use" : "unused";
  const sm = r.supportMonths == null ? SUPPORT_DEFAULT : r.supportMonths;
  const supportEndsAt = c && sm ? at + sm * 30 * DAY : 0;
  const supportLeft = supportEndsAt ? Math.ceil((supportEndsAt - Date.now()) / DAY) : null;
  const supportStatus = !sm ? "none" : !c ? "pending" : supportLeft <= 0 ? "ended" : supportLeft <= 14 ? "soon" : "active";
  return { id, price: r.price || 0, source: r.source || "", supportMonths: sm, supportEndsAt, supportLeft, supportStatus, code: safeDec(r.enc || "", key), name: r.name, phone: r.phone || "", note: r.note || "", active: !!r.active, createdAt: r.createdAt || 0, used: !!c, usedAt: at, days, expiresAt, expired, status, devices: c ? 1 : 0, device: c ? deviceOf(c.ua) : "", ips7 };
};

async function handle(req, context) {
  const url = new URL(req.url);
  const route = url.pathname.replace(/\/+$/, "").slice(AP.length + 1);
  let key;
  try { key = await getSecret(); } catch { return json({ error: "سرور آماده نیست؛ چند ثانیه بعد دوباره امتحان کن." }, 503); }
  const { codes, claims, locks } = stores();
  const ip = clientIp(req, context);

  if (req.method !== "GET" && !sameOrigin(req)) return json({ error: "درخواست نامعتبر" }, 403);
  if (route === "ping") return json({ ok: true, t: Date.now() });
  if (route === "login") return login(req, key, locks, ip);

  const sess = verify(getCookie(req, "rv_admin"), key);
  if (!sess || sess.role !== "admin") return json({ error: "نیاز به ورود" }, 401);
  if (sess.v !== credTag(await adminCred(locks))) return json({ error: "نیاز به ورود" }, 401); // رمز عوض شده → نشست قدیمی باطل
  if (!(await slotOk(locks, sess))) return json({ error: "نیاز به ورود" }, 401); // نشست خارج‌شده یا باطل‌شده
  authed.add(req);
  if (POST_ONLY.has(route) && req.method !== "POST") return json({ error: "Method Not Allowed" }, 405);
  if (req.method !== "GET" && req.headers.get("x-rv") !== "1") return json({ error: "درخواست نامعتبر" }, 400);

  let body = {};
  if (req.method === "POST") { try { body = await req.json(); } catch {} }
  if (!body || typeof body !== "object" || Array.isArray(body)) body = {};
  const id = String(body.id || "");
  const needId = () => (ID_RE.test(id) ? null : json({ error: "شناسه نامعتبر" }, 400));

  switch (route) {
    case "logout":
      await freeSlot(locks, sess);
      return json({ ok: true }, 200, { "Set-Cookie": setCookie("rv_admin", "", { maxAge: 0, path: AP, sameSite: "Strict" }) });

    case "list": {
      const [cl, ml] = await Promise.all([codes.list(), claims.list()]);
      const bound = new Map();
      await pool(ml.blobs, 20, async (b) => { const c = await claims.get(b.key, { type: "json" }).catch(() => null); if (c) bound.set(b.key, { at: c.at || 0, ua: c.ua || "" }); });
      const rows = (await pool(cl.blobs.filter((b) => ID_RE.test(b.key)), 20, async (b) => {
        const r = await codes.get(b.key, { type: "json" }).catch(() => null);
        if (!r) return null;
        const seen = bound.has(b.key) ? await locks.get("seen_" + b.key, { type: "json" }).catch(() => null) : null;
        const week = Date.now() - 7 * DAY;
        const ips7 = seen && seen.ips ? Object.values(seen.ips).filter((t) => t > week).length : 0;
        return view(b.key, r, key, bound, ips7);
      })).filter(Boolean).sort((a, b) => b.createdAt - a.createdAt);
      return json({ students: rows, settings: await getSettings(locks), now: Date.now() });
    }

    case "create": {
      const name = String(body.name || "").trim().slice(0, 80);
      if (!name) return json({ error: "نام را بنویس" }, 400);
      const phone = cleanPhone(body.phone);
      const note = String(body.note || "").trim().slice(0, 300);
      const nonce = /^[a-z0-9]{8,40}$/i.test(String(body.nonce || "")) ? "n_" + body.nonce : "";
      if (nonce) { // تکرار امن درخواست (وقتی پاسخ در مسیر گم شده)
        const prev = await locks.get(nonce, { type: "json" });
        const pr = prev && (await codes.get(prev.rid, { type: "json" }));
        if (pr) return json({ ok: true, student: view(prev.rid, pr, key, new Map()) });
      }
      for (let i = 0; i < 8; i++) {
        const code = newCode();
        const rid = codeKey(code, key);
        const st = await getSettings(locks);
        const rec = { name, phone, note, days: cleanDays(body.days), price: cleanPrice(body.price) || st.defaultPrice || 0, source: cleanSource(body.source), supportMonths: cleanMonths(body.supportMonths, st.defaultSupport), active: true, createdAt: Date.now(), enc: encCode(code, key), tail: code.slice(-4) };
        if (await putNew(codes, rid, rec)) {
          if (nonce) await locks.setJSON(nonce, { rid, at: Date.now() });
          return json({ ok: true, student: view(rid, rec, key, new Map()) });
        }
      }
      return json({ error: "ساخت کد انجام نشد؛ دوباره امتحان کن" }, 500);
    }

    case "toggle": {
      const bad = needId(); if (bad) return bad;
      const r = await codes.get(id, { type: "json" });
      if (!r) return json({ error: "پیدا نشد" }, 404);
      r.active = !!body.active;
      await codes.setJSON(id, r);
      return json({ ok: true, active: r.active });
    }

    case "reset": {
      const bad = needId(); if (bad) return bad;
      await claims.delete(id);
      await locks.delete("seen_" + id);
      return json({ ok: true });
    }

    case "regen": {
      const bad = needId(); if (bad) return bad;
      const r = await codes.get(id, { type: "json" });
      if (!r) return json({ error: "پیدا نشد" }, 404);
      for (let i = 0; i < 6; i++) {
        const code = newCode();
        const rid = codeKey(code, key);
        if (await putNew(codes, rid, { ...r, enc: encCode(code, key), tail: code.slice(-4) })) {
          await codes.delete(id);
          await claims.delete(id);
          await locks.delete("seen_" + id);
          return json({ ok: true, id: rid, code });
        }
      }
      return json({ error: "ساخت کد انجام نشد" }, 500);
    }

    case "update": {
      const bad = needId(); if (bad) return bad;
      const r = await codes.get(id, { type: "json" });
      if (!r) return json({ error: "پیدا نشد" }, 404);
      const name = String(body.name ?? r.name).trim().slice(0, 80);
      if (!name) return json({ error: "نام خالی است" }, 400);
      await codes.setJSON(id, { ...r, days: body.days === undefined ? r.days || 0 : cleanDays(body.days), name, phone: body.phone === undefined ? r.phone || "" : cleanPhone(body.phone), note: String(body.note ?? r.note ?? "").trim().slice(0, 300), price: body.price === undefined ? r.price || 0 : cleanPrice(body.price), source: body.source === undefined ? r.source || "" : cleanSource(body.source), supportMonths: body.supportMonths === undefined ? (r.supportMonths == null ? SUPPORT_DEFAULT : r.supportMonths) : cleanMonths(body.supportMonths) });
      return json({ ok: true });
    }

    case "bulk": {
      const ids = (Array.isArray(body.ids) ? body.ids : []).map(String).filter((x) => ID_RE.test(x)).slice(0, 100);
      const act = String(body.action || "");
      if (!ids.length || !["activate", "deactivate", "delete", "reset"].includes(act)) return json({ error: "درخواست نامعتبر" }, 400);
      await Promise.all(ids.map(async (x) => {
        if (act === "delete") { await codes.delete(x); await claims.delete(x); await locks.delete("seen_" + x); await locks.delete("rev_" + x); }
        else if (act === "reset") { await claims.delete(x); await locks.delete("seen_" + x); }
        else { const r = await codes.get(x, { type: "json" }); if (r) await codes.setJSON(x, { ...r, active: act === "activate" }); }
      }));
      return json({ ok: true, n: ids.length });
    }

    case "delete": {
      const bad = needId(); if (bad) return bad;
      await codes.delete(id);
      await claims.delete(id);
      await locks.delete("seen_" + id);
      await locks.delete("rev_" + id);
      return json({ ok: true });
    }

    case "password": {
      const next = String(body.next || "");
      const phone = String(body.phone ?? ""), current = String(body.current ?? "");
      if (next.length < 10 || next.length > 200) return json({ error: "رمز جدید باید بین ۱۰ تا ۲۰۰ حرف باشد" }, 400);
      if (await lockedUntil(locks, "p", ip)) return json({ error: "تلاش‌های اشتباه زیاد بود؛ بعداً دوباره امتحان کن." }, 429);
      const cur = await adminCred(locks);
      // ۴۰۳ (نه ۴۰۱): ۴۰۱ یعنی «نشست تمام شده» و پنل را به صفحه‌ی ورود می‌برد
      if (!credEq(credHash(phone, current, cur.salt), cur.hash)) { await addFail(locks, "p", ip, 5, 30 * 60 * 1000); await sleep(900); return json({ error: "شماره یا رمز فعلی درست نیست" }, 403); }
      const salt = crypto.randomBytes(16).toString("hex");
      const fresh = { salt, hash: credHash(phone, next, salt), at: Date.now() };
      await locks.setJSON("_admin", fresh);
      await clearFails(locks, "p", ip);
      // نشست همین دستگاه با رمز جدید ادامه پیدا می‌کند؛ بقیه‌ی نشست‌ها باطل می‌شوند
      const left = Math.max(60, Math.floor(((sess.exp || 0) - Date.now()) / 1000));
      for (let i = 0; i < MAX_ADMINS; i++) if (i !== sess.k) await locks.delete(slotKey(i)).catch(() => {}); // بقیه بیرون می‌روند و ظرفیت آزاد می‌شود
      const tok = sign({ role: "admin", exp: sess.exp, sid: sess.sid, k: sess.k, v: credTag(fresh) }, key);
      return json({ ok: true }, 200, { "Set-Cookie": setCookie("rv_admin", tok, { maxAge: left, path: AP, sameSite: "Strict" }) });
    }

    case "settings": {
      if (req.method === "GET") return json({ settings: await getSettings(locks) });
      const cur = await getSettings(locks);
      const next = {
        goalCount: Math.min(1000, Math.max(0, Math.floor(Number(body.goalCount ?? cur.goalCount)) || 0)),
        goalRevenue: cleanPrice(body.goalRevenue ?? cur.goalRevenue),
        defaultPrice: cleanPrice(body.defaultPrice ?? cur.defaultPrice),
        defaultSupport: cleanMonths(body.defaultSupport ?? cur.defaultSupport),
        ver: 70,
      };
      await locks.setJSON("_settings", next);
      return json({ ok: true, settings: next });
    }

    case "sessions": {
      const now = Date.now(), out = [];
      for (let i = 0; i < MAX_ADMINS; i++) {
        const c = await locks.get(slotKey(i), { type: "json" }).catch(() => null);
        if (c && c.exp > now) out.push({ k: i, at: c.at || 0, exp: c.exp, device: deviceOf(c.ua), me: i === sess.k });
      }
      return json({ max: MAX_ADMINS, sessions: out });
    }

    case "kick": {
      const k = Math.floor(Number(body.k));
      if (!Number.isInteger(k) || k < 0 || k >= MAX_ADMINS) return json({ error: "نامعتبر" }, 400);
      await locks.delete(slotKey(k)).catch(() => {});
      return json({ ok: true });
    }

    case "reviews": {
      const l = await locks.list({ prefix: "rev_" });
      const rows = (await pool(l.blobs.slice(0, 300), 20, async (b) => locks.get(b.key, { type: "json" }).catch(() => null))).filter(Boolean).sort((a, b) => b.at - a.at);
      return json({ reviews: rows.map((r) => ({ id: r.id, name: r.name, text: r.text, rating: r.rating || 0, at: r.at, status: r.status })) });
    }

    case "revmod": {
      const bad = needId(); if (bad) return bad;
      const act = String(body.act || "");
      const rk = "rev_" + id, r = await locks.get(rk, { type: "json" }).catch(() => null);
      if (!r) return json({ error: "نظر پیدا نشد" }, 404);
      if (act === "delete") await locks.delete(rk);
      else if (act === "approve" || act === "hide") await locks.setJSON(rk, { ...r, status: act === "approve" ? "ok" : "hidden" });
      else return json({ error: "نامعتبر" }, 400);
      return json({ ok: true });
    }

    case "site": {
      if (req.method === "POST") {
        let next;
        try { next = cleanSite(await getSite(locks), body); } catch (e) { return json({ error: e.status ? e.message : "داده نامعتبر" }, 400); }
        await locks.setJSON("_site", next);
      }
      return json(await siteView(codes, locks));
    }

    case "siteimg": {
      const kind = String(body.kind || "");
      if (!IMG_KINDS.includes(kind)) return json({ error: "نوع عکس نامعتبر" }, 400);
      const cur = await getSite(locks);
      if (body.data === null || body.data === "") {
        await locks.delete("_img_" + kind);
        cur.img[kind] = 0;
      } else {
        const img = parseImage(body.data);
        if (!img) return json({ error: "عکس نامعتبر یا بیش‌ازحد بزرگ است (JPG/PNG/WebP، حداکثر ۴۰۰ کیلوبایت)" }, 400);
        await locks.setJSON("_img_" + kind, img);
        cur.img[kind] = Date.now();
      }
      await locks.setJSON("_site", cur);
      return json({ ok: true, at: cur.img[kind] });
    }

    case "status":
      return json({ checks: await status(codes, claims, locks) });

    default:
      return json({ error: "Not Found" }, 404);
  }
}

export default async (req, context) => {
  try { return await handle(req, context); }
  catch (e) {
    console.error("admin error", e);
    // جزئیات خطا فقط برای مدیر واردشده؛ بقیه پیام کلی می‌بینند
    return json({ error: authed.has(req) ? "خطای سرور: " + String((e && e.message) || e).slice(0, 200) : "خطای موقت سرور؛ دوباره امتحان کن." }, 500);
  }
};

async function siteView(codes, locks) {
  const site = await getSite(locks);
  const v = parseVideo(site.teaser.url);
  return { site, video: v ? v.kind : "", pricing: pricingOf(site.pricing, await countCodes(codes)) };
}

// ---- ظرفیت ورود هم‌زمان مدیر (۳ جا). هر جا یک کلید جدا دارد و فقط با ورودِ آزاد/منقضی پر می‌شود
const slotKey = (i) => "_asess_" + i;
async function takeSlot(locks, sid, exp, ua) {
  const now = Date.now();
  for (let i = 0; i < MAX_ADMINS; i++) {
    const cur = await locks.get(slotKey(i), { type: "json" }).catch(() => null);
    if (cur && cur.exp > now) continue;
    if (cur) await locks.delete(slotKey(i)).catch(() => {});
    if (await putNew(locks, slotKey(i), { sid, exp, at: now, ua: String(ua || "").slice(0, 200) })) return i;
  }
  return -1;
}
async function slotOk(locks, sess) {
  if (!Number.isInteger(sess.k) || sess.k < 0 || sess.k >= MAX_ADMINS || !sess.sid) return false;
  const c = await locks.get(slotKey(sess.k), { type: "json" }).catch(() => null);
  return !!c && c.sid === sess.sid && c.exp > Date.now();
}
async function freeSlot(locks, sess) {
  if (!Number.isInteger(sess.k) || sess.k < 0 || sess.k >= MAX_ADMINS) return;
  const c = await locks.get(slotKey(sess.k), { type: "json" }).catch(() => null);
  if (c && c.sid === sess.sid) await locks.delete(slotKey(sess.k)).catch(() => {});
}

async function adminCred(locks) {
  const o = await locks.get("_admin", { type: "json" });
  return o && o.salt && o.hash ? o : DEFAULT_ADMIN;
}

async function login(req, key, locks, ip) {
  if (req.method !== "POST") return json({ error: "Method Not Allowed" }, 405);
  if (await lockedUntil(locks, "a", ip)) return json({ error: "به‌خاطر تلاش اشتباه، ۳۰ دقیقه قفل شده‌ای." }, 429);
  let b = {};
  try { b = await req.json(); } catch {}
  if (!b || typeof b !== "object") b = {};
  const phone = String(b.phone ?? ""), password = String(b.password ?? "");
  if (!phone || !password || phone.length > 40 || password.length > 200) { await sleep(400); return json({ error: "شماره یا رمز درست نیست" }, 400); }
  const cred = await adminCred(locks);
  const ok = credEq(credHash(phone, password, cred.salt), cred.hash);
  if (!ok) {
    await addFail(locks, "a", ip, 5, 30 * 60 * 1000);
    await sleep(900);
    return json({ error: "شماره یا رمز درست نیست" }, 401);
  }
  await clearFails(locks, "a", ip);
  const exp = Date.now() + HOURS * 3600 * 1000, sid = crypto.randomBytes(12).toString("hex");
  const k = await takeSlot(locks, sid, exp, req.headers.get("user-agent"));
  if (k < 0) return json({ error: "ظرفیت ورود هم‌زمان مدیر (۳ نفر) پر است. یکی از نفرات باید از پنل خارج شود، یا بعد از پایان نشست او (حداکثر ۱۲ ساعت) دوباره امتحان کن." }, 409);
  const tok = sign({ role: "admin", exp, sid, k, v: credTag(cred) }, key);
  return json({ ok: true }, 200, { "Set-Cookie": setCookie("rv_admin", tok, { maxAge: HOURS * 3600, path: AP, sameSite: "Strict" }) });
}

async function status(codes, claims, locks) {
  const out = [];
  const add = (name, ok, detail = "") => out.push({ name, ok, detail });
  try {
    const k = "_selftest_" + Date.now();
    await codes.setJSON(k, { t: 1 });
    const back = await codes.get(k, { type: "json" });
    await codes.delete(k);
    add("Netlify Blobs (ذخیره‌ی کدها)", !!back && back.t === 1, "نوشتن/خواندن/حذف");
    const k2 = "_selftest2_" + Date.now();
    const w1 = await claims.setJSON(k2, { a: 1 }, { onlyIfNew: true });
    const w2 = await claims.setJSON(k2, { a: 2 }, { onlyIfNew: true });
    await claims.delete(k2);
    const atomic = !!w1 && w1.modified !== false && !!w2 && w2.modified === false;
    add("قفل یک‌بار مصرف", true, atomic ? "اتمیک (کامل)" : "نسخه‌ی blobs نوشتن شرطی ندارد؛ حالت جایگزین امن فعال است");
    const s = await locks.get("_secret", { type: "json" });
    add("کلید امنیتی سرور", !!s && !!s.s && s.s.length >= 32, "ساخته و ذخیره شده");
  } catch (e) { add("Netlify Blobs", false, String((e && e.message) || e).slice(0, 200)); }
  const root = contentRoot();
  add("پوشه‌ی content روی سرور", !!root, root ? "پیدا شد" : "پیدا نشد");
  const L = listDir("lessons"), D = listDir("downloads");
  add("درس‌ها", !!L && L.size > 10, L ? L.size + " فایل" : "خوانده نشد");
  add("zip پروژه‌ها", !!D, D ? (D.size > 1 ? (D.size - 1) + " فایل" : "هنوز پروژه‌ای اضافه نشده (پروژه‌ها مرحله‌ای می‌آیند)") : "خوانده نشد");
  add("درس‌های رایگان", !!L && FREE.every((f) => L.has(f)), L ? FREE.filter((f) => !L.has(f)).join("، ") || "همه هستند" : "");
  return out;
}
