// تست خودکار کل سیستم (با انبار شبیه‌سازی‌شده). اجرا:
//   ADMIN_PHONE=09xxxxxxxxx ADMIN_PASS='رمز' node tools/e2e-test.mjs
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
process.chdir(ROOT);
class Mem {
  m = new Map();
  async get(k, o) { const v = this.m.get(k); return v === undefined ? null : (o && o.type === "json" ? JSON.parse(v) : v); }
  async setJSON(k, v, o = {}) { if (o.onlyIfNew && this.m.has(k)) return { modified: false }; this.m.set(k, JSON.stringify(v)); return { modified: true }; }
  async set(k, v, o = {}) { if (o.onlyIfNew && this.m.has(k)) return { modified: false }; this.m.set(k, v); return { modified: true }; }
  async delete(k) { this.m.delete(k); }
  async list() { return { blobs: [...this.m.keys()].map((key) => ({ key })), directories: [] }; }
}
globalThis.__rvTestStores = { codes: new Mem(), claims: new Mem(), locks: new Mem() };
const imp = (f) => import(pathToFileURL(path.join(ROOT, f)).href);
const gate = (await imp("netlify/functions/gate.mjs")).default;
const me = (await imp("netlify/functions/me.mjs")).default;
const login = (await imp("netlify/functions/login.mjs")).default;
const admin = (await imp("netlify/functions/admin.mjs")).default;
const siteFn = (await imp("netlify/functions/site.mjs")).default;
const H = "https://t.test";
const PHONE = process.env.ADMIN_PHONE, PASS = process.env.ADMIN_PASS;
let bad = 0;
const ok = (c, m) => { if (!c) { bad++; console.log("FAIL:", m); } else console.log("ok  :", m); };
const ck = (res) => (res.headers.getSetCookie ? res.headers.getSetCookie() : []).map((c) => c.split(";")[0]).join("; ");
const rq = (p, o = {}) => new Request(H + p, { ...o, headers: { "content-type": "application/json", ...(o.headers || {}) } });
const ADM = (act, body, cookie, ip = "2.2.2.2") => admin(rq("/api/admin/" + act, { method: act === "list" || act === "status" ? "GET" : "POST", body: body && JSON.stringify(body), headers: { ...(cookie ? { cookie } : {}), "x-rv": "1" } }), { ip });
const LOGIN = (code, cookie, ip = "3.3.3.3") => login(rq("/api/login", { method: "POST", body: JSON.stringify({ code }), headers: cookie ? { cookie } : {} }), { ip });
const LESSON = (f, cookie) => gate(new Request(H + "/lessons/" + f, { headers: cookie ? { cookie } : {} }));

// --- قیمت‌ها
let r = await (await siteFn(new Request(H + "/api/site"), { ip: "1.1.1.1" })).json();
const tiers = r.pricing && r.pricing.tiers;
ok(r.pricing.base === 1000000, "قیمت اصلی ۱٬۰۰۰٬۰۰۰ تومان");
ok(tiers && tiers[0].pct === 35 && tiers[0].price === 650000 && tiers[0].n === 10, "۱۰ نفر اول: ۳۵٪ = ۶۵۰٬۰۰۰");
ok(tiers && tiers[1].pct === 25 && tiers[1].price === 750000 && tiers[1].n === 5, "نفر ۱۱ تا ۱۵: ۲۵٪ = ۷۵۰٬۰۰۰");

// --- ادمین
r = await ADM("login", { phone: PHONE, password: "wrong-pass-123" }); ok(r.status === 401, "رمز اشتباه ادمین رد می‌شود");
const adm = [];
for (let i = 0; i < 3; i++) { r = await ADM("login", { phone: PHONE, password: PASS }, null, "9.9.9." + i); ok(r.status === 200, "ورود ادمین " + (i + 1)); adm.push(ck(r)); }
r = await ADM("login", { phone: PHONE, password: PASS }, null, "9.9.9.9"); ok(r.status === 409, "ادمین چهارم رد می‌شود (حداکثر ۳)");
r = await ADM("list", null, null); ok(r.status === 401, "لیست بدون ورود ممنوع");

// --- ساخت کد و ورود دانشجو
r = await ADM("create", { name: "علی تست", phone: "09120000000", price: 650000 }, adm[0]);
const st = (await r.json()).student; ok(!!st && /^RV-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(st.code), "ساخت کد دسترسی");
ok((await LESSON("01-intro.html")).status === 200 && (await LESSON("00-index.html")).status === 200, "درس‌های رایگان بدون ورود باز است");
r = await LESSON("08-scope.html"); ok(r.status === 302, "درس پولی بدون ورود قفل (ریدایرکت به ورود)");
r = await LESSON("32-fetch-crud.html"); ok(r.status === 302, "درس‌های ۳۲ هم قفل است");
r = await LOGIN("RV-AAAA-BBBB-CCCC"); ok(r.status === 401, "کد اشتباه رد می‌شود");
r = await LOGIN(st.code); ok(r.status === 200, "ورود با کد درست"); const stu = ck(r);
r = await LESSON("08-scope.html", stu); const html = await r.text(); ok(r.status === 200 && html.includes("Closure") && html.includes("demo-code"), "درس پولی با کد باز است و قالب جدید دارد");
r = await LESSON("project-counter.html", stu); ok(r.status === 200 && (await r.text()).includes("data-live"), "درس پروژه برای دانشجو باز است");
r = await LESSON("project-counter.html"); ok(r.status === 302, "درس پروژه بدون ورود قفل است");
r = await gate(new Request(H + "/downloads/project-counter.zip", { headers: { cookie: stu } })); const zb = new Uint8Array(await r.arrayBuffer()); ok(r.status === 200 && zb[0] === 0x50 && zb[1] === 0x4b, "دانلود zip پروژه با کد معتبر (فایل zip واقعی)");
r = await gate(new Request(H + "/downloads/project-counter.zip")); ok(r.status === 302 || r.status === 404, "دانلود zip بدون ورود ممنوع");
r = await me(rq("/api/me", { headers: { cookie: stu } }), { ip: "3.3.3.3" }); ok(r.status === 200 && (await r.json()).name === "علی تست", "me نام دانشجو را برای واترمارک می‌دهد");
r = await LOGIN(st.code, null, "4.4.4.4"); ok(r.status === 403 || r.status === 409, "مرورگر دوم با همان کد رد می‌شود");
r = await LOGIN(st.code, stu); ok(r.status === 200, "همان مرورگر دوباره وارد می‌شود");
// --- غیرفعال، ریست، حذف
await ADM("toggle", { id: st.id, active: false }, adm[1]);
r = await LESSON("08-scope.html", stu); ok(r.status === 302, "غیرفعال‌سازی فوراً دسترسی را قطع می‌کند");
await ADM("toggle", { id: st.id, active: true }, adm[1]);
r = await LESSON("08-scope.html", stu); ok(r.status === 200, "فعال‌سازی دوباره");
await ADM("reset", { id: st.id }, adm[1]);
r = await LESSON("08-scope.html", stu); ok(r.status === 302, "ریست مرورگر: کوکی قبلی بی‌اعتبار");
r = await LOGIN(st.code, null, "5.5.5.5"); ok(r.status === 200, "بعد از ریست، مرورگر جدید وارد می‌شود");
await ADM("delete", { id: st.id }, adm[1]);
r = await LOGIN(st.code, null, "6.6.6.6"); ok(r.status === 401, "کد حذف‌شده کار نمی‌کند");
// --- مسیرهای مخرب
for (const bad of ["..%2F..%2Fpackage.json", "nope.html", "%2e%2e/netlify.toml"]) { r = await LESSON(bad); ok(r.status === 404 || r.status === 302, "مسیر مخرب/ناموجود رد می‌شود: " + bad); }
r = await gate(new Request(H + "/downloads/x.zip")); ok(r.status === 302 || r.status === 404, "دانلود بدون ورود ممنوع");
r = await ADM("status", null, adm[2]); const stt = await r.json(); const arr = Array.isArray(stt) ? stt : (stt.checks || stt.items || []); ok(r.status === 200 && arr.length > 3 && arr.every((c) => c.ok), "وضعیت سیستم سالم است " + JSON.stringify(arr.filter((c) => !c.ok)));
console.log(bad ? "FAILED " + bad : "ALL PASSED"); process.exit(bad ? 1 : 0);
