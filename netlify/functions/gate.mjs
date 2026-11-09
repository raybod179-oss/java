// دروازه‌ی محتوا: /lessons/* و /downloads/*
import { FREE, clientIp } from "../lib/auth.mjs";
import { stores } from "../lib/store.mjs";
import { studentSession } from "../lib/session.mjs";
import { listDir, readFile } from "../lib/content.mjs";
import { SEC } from "../lib/headers.mjs";

export const config = { path: ["/lessons", "/lessons/*", "/downloads", "/downloads/*"] };

const HOME = "/lessons/00-index.html";
const TYPES = { ".html": "text/html; charset=utf-8", ".zip": "application/zip" };
const nf = () => new Response("Not Found", { status: 404, headers: { "Cache-Control": "no-store" } });
const goLogin = (url) => new Response(null, { status: 302, headers: { Location: new URL("/login.html?locked=1", url).toString(), "Cache-Control": "no-store" } });


// ---- لایه‌ی ضد‌خزنده: دانشجوی واقعی در یک دقیقه چند صفحه‌ی محدود باز می‌کند؛ اسکریپت ده‌ها صفحه.
const LIMITS = { lessons: { max: 30, win: 60 * 1000 }, downloads: { max: 8, win: 10 * 60 * 1000 } };
async function throttled(section, sid) {
  const lim = LIMITS[section];
  try {
    const { locks } = stores();
    const k = `rl_${section}_${sid}`;
    const now = Date.now();
    let r = await locks.get(k, { type: "json" });
    if (!r || now - r.w > lim.win) r = { w: now, n: 0 };
    r.n++;
    await locks.setJSON(k, r);
    if (r.n > lim.max) {
      if (r.n === lim.max + 1) await locks.setJSON(`abuse_${sid}`, { at: now, section, n: r.n }); // نشانه برای بررسی مدیر
      return true;
    }
  } catch { /* خطای انبار نباید دانشجوی واقعی را قفل کند */ }
  return false;
}
// مرورگر خودش مبدأ درخواست را می‌گوید؛ محتوای پولی فقط برای باز کردن مستقیم صفحه در همین سایت.
function crossSiteEmbed(req) {
  const site = req.headers.get("sec-fetch-site");
  const dest = req.headers.get("sec-fetch-dest");
  if (dest && ["iframe", "frame", "embed", "object", "script", "style", "image", "audio", "video", "worker", "fetch"].includes(dest) && site && site !== "same-origin" ) return true;
  if (site === "cross-site" && dest && dest !== "document") return true;
  return false;
}

export default async (req, context) => {
  if (req.method !== "GET" && req.method !== "HEAD") return new Response("Method Not Allowed", { status: 405 });
  const url = new URL(req.url);
  let segs;
  try { segs = url.pathname.split("/").filter(Boolean).map((s) => decodeURIComponent(s).normalize("NFC")); }
  catch { return nf(); }

  const section = segs[0];
  if (section !== "lessons" && section !== "downloads") return nf();
  if (segs.length === 1) {
    return section === "lessons" ? new Response(null, { status: 302, headers: { Location: new URL(HOME, url).toString() } }) : nf();
  }
  if (segs.length !== 2) return nf();
  const name = segs[1];

  const free = section === "lessons" && FREE.includes(name);
  if (!free) {
    if (crossSiteEmbed(req)) return new Response("Forbidden", { status: 403, headers: { "Cache-Control": "no-store" } });
    const s = await studentSession(req);
    if (!s) return goLogin(url);
    if (await throttled(section, s.sid)) return new Response("درخواست‌های بیش از حد؛ چند دقیقه بعد دوباره امتحان کن.", { status: 429, headers: { "Retry-After": "120", "Cache-Control": "no-store", "Content-Type": "text/plain; charset=utf-8" } });
  }

  const files = listDir(section);
  if (!files) return new Response("محتوا روی سرور پیدا نشد؛ در پنل مدیریت «وضعیت سیستم» را بزنید.", { status: 500 });
  const real = files.get(name);
  if (!real) return nf();

  const ext = real.slice(real.lastIndexOf(".")).toLowerCase();
  const headers = {
    ...SEC,
    "Content-Type": TYPES[ext] || "application/octet-stream",
    "Cache-Control": free ? "public, max-age=0, must-revalidate" : "private, no-store, max-age=0",
  };
  // فقط سه درس رایگان برای سئو قابل‌ایندکس‌اند؛ فهرست و درس‌های قفل‌شده و دانلودها هرگز
  if (!(free && name !== "00-index.html" && ext === ".html")) headers["X-Robots-Tag"] = "noindex, noarchive, nosnippet";
  if (ext === ".zip") headers["Content-Disposition"] = `attachment; filename="${encodeURIComponent(real)}"`;
  const body = readFile(section, real);
  headers["Content-Length"] = String(body.length);
  return new Response(req.method === "HEAD" ? null : body, { status: 200, headers });
};
