// نظرات دانشجویان: خواندن عمومی (فقط تأییدشده‌ها) و ثبت نظر توسط دانشجوی واردشده
import { json, sameOrigin, ID_RE } from "../lib/auth.mjs";
import { studentSession } from "../lib/session.mjs";
import { stores } from "../lib/store.mjs";
import { SEC } from "../lib/headers.mjs";

export const config = { path: "/api/reviews" };

const ctl = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u200E\u200F\u202A-\u202E\u2066-\u2069]/g;
const clean = (v, max) => String(v ?? "").replace(ctl, "").replace(/[ \t]+/g, " ").trim().slice(0, max);
const pub = (r) => ({ name: r.name, text: r.text, rating: r.rating || 0, at: r.at });

export default async (req) => {
  try {
    const { locks } = stores();

    if (req.method === "GET") {
      const mine = new URL(req.url).searchParams.get("mine");
      if (mine) { // نظر خود دانشجو (هر وضعیتی)
        const s = await studentSession(req);
        if (!s) return json({}, 401);
        const r = await locks.get("rev_" + s.id, { type: "json" }).catch(() => null);
        return json({ review: r ? { ...pub(r), status: r.status } : null, defaultName: clean(s.name, 60).split(" ")[0] || "" }, 200, { "Cache-Control": "no-store" });
      }
      const l = await locks.list({ prefix: "rev_" });
      const rows = (await Promise.all(l.blobs.slice(0, 200).map((b) => locks.get(b.key, { type: "json" }).catch(() => null))))
        .filter((r) => r && r.status === "ok").sort((a, b) => b.at - a.at).slice(0, 30);
      const rated = rows.filter((r) => r.rating > 0);
      const avg = rated.length ? Math.round((rated.reduce((a, r) => a + r.rating, 0) / rated.length) * 10) / 10 : 0;
      return json({ count: rows.length, avg, reviews: rows.map(pub) }, 200, { "Cache-Control": "public, max-age=30" });
    }

    if (req.method === "POST") {
      if (!sameOrigin(req) || req.headers.get("x-rv") !== "1") return json({ error: "درخواست نامعتبر" }, 403);
      const s = await studentSession(req);
      if (!s || !ID_RE.test(s.id)) return json({ error: "برای ثبت نظر باید با کد دسترسی وارد شده باشی." }, 401);
      let b = {}; try { b = await req.json(); } catch {}
      if (!b || typeof b !== "object") b = {};
      const text = clean(b.text, 500);
      if (text.length < 10) return json({ error: "نظرت را حداقل در ۱۰ حرف بنویس." }, 400);
      const name = clean(b.name, 30) || clean(s.name, 60).split(" ")[0] || "دانشجو";
      const rating = Math.min(5, Math.max(0, Math.floor(Number(b.rating)) || 0));
      const prev = await locks.get("rev_" + s.id, { type: "json" }).catch(() => null);
      if (prev && Date.now() - (prev.at || 0) < 30000) return json({ error: "کمی صبر کن و دوباره امتحان کن." }, 429);
      // هر کد فقط یک نظر دارد؛ ویرایش یا ثبت دوباره، نظر را دوباره برای تأیید مدیر می‌فرستد
      await locks.setJSON("rev_" + s.id, { id: s.id, name, text, rating, at: Date.now(), status: "pending" });
      return json({ ok: true, status: "pending" });
    }
    return json({ error: "Method Not Allowed" }, 405);
  } catch (e) {
    console.error("reviews error", e);
    return json({ error: "خطای موقت" }, 500);
  }
};
