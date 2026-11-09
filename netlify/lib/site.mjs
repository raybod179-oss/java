// تنظیمات عمومی صفحه‌ی فروش (مدرس، تیزر، قیمت و تخفیف) — فقط مدیر می‌نویسد، همه می‌خوانند
import { ID_RE } from "./auth.mjs";

export const DEFAULT_SITE = {
  instructor: { show: true, name: "رایبد اکبرلو", title: "", bio: "", specs: [] },
  teaser: { show: true, title: "", text: "", url: "" },
  // قیمت پیشنهادی بر اساس مقایسه با دوره‌های ویدیویی رقبا؛ از پنل مدیر قابل تغییر است
  pricing: { show: true, base: 1000000, n1: 10, p1: 35, n2: 5, p2: 25, adjust: 0 },
  img: { photo: 0, poster: 0 },
};

const ctl = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u200E\u200F\u202A-\u202E\u2066-\u2069]/g;
const str = (v, max) => String(v ?? "").replace(ctl, "").trim().slice(0, max);
const int = (v, min, max, d) => { const n = Math.floor(Number(String(v ?? "").replace(/[^\d.-]/g, ""))); return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : d; };

export function mergeSite(o) {
  o = o && typeof o === "object" ? o : {};
  const D = DEFAULT_SITE;
  return {
    instructor: { ...D.instructor, ...(o.instructor || {}), specs: Array.isArray(o.instructor?.specs) ? o.instructor.specs : [] },
    teaser: { ...D.teaser, ...(o.teaser || {}) },
    pricing: { ...D.pricing, ...(o.pricing || {}) },
    img: { ...D.img, ...(o.img || {}) },
  };
}
export async function getSite(locks) { return mergeSite(await locks.get("_site", { type: "json" }).catch(() => null)); }

// ورودی مدیر → نسخه‌ی پاک‌شده (هر بخش فقط اگر فرستاده شده باشد عوض می‌شود)
export function cleanSite(cur, b) {
  const out = mergeSite(cur);
  b = b && typeof b === "object" ? b : {};
  if (b.instructor && typeof b.instructor === "object") {
    const i = b.instructor;
    const specs = (Array.isArray(i.specs) ? i.specs : String(i.specs ?? "").split("\n")).map((x) => str(x, 60)).filter(Boolean).slice(0, 8);
    out.instructor = { show: i.show !== false, name: str(i.name, 60), title: str(i.title, 80), bio: str(i.bio, 700), specs };
  }
  if (b.teaser && typeof b.teaser === "object") {
    const t = b.teaser, url = str(t.url, 1200);
    if (url && !parseVideo(url)) throw Object.assign(new Error("لینک تیزر معتبر نیست؛ لینک آپارات، یوتیوب یا فایل mp4/webm بده."), { status: 400 });
    out.teaser = { show: t.show !== false, title: str(t.title, 80), text: str(t.text, 300), url };
  }
  if (b.pricing && typeof b.pricing === "object") {
    const p = b.pricing;
    out.pricing = { show: p.show !== false, base: int(p.base, 0, 2_000_000_000, 0), n1: int(p.n1, 0, 1000, 10), p1: int(p.p1, 0, 90, 30), n2: int(p.n2, 0, 1000, 5), p2: int(p.p2, 0, 90, 10), adjust: int(p.adjust, -500, 5000, 0) };
  }
  return out;
}

// تشخیص لینک ویدیو → فقط سه نوع امن: آپارات، یوتیوب (nocookie)، فایل mp4/webm
// ورودی می‌تواند لینک ساده یا «کد امبد» (iframe یا script آپارات) باشد؛ فقط آدرس داخل آن برداشته می‌شود
function pullUrl(raw) {
  const t = String(raw || "").trim();
  if (!/[<>]/.test(t)) return t;
  const m = /(?:src|href)\s*=\s*["']([^"']+)["']/i.exec(t) || /(https?:\/\/[^\s"'<>]+)/i.exec(t);
  return m ? m[1].replace(/&amp;/g, "&").trim() : "";
}
export function parseVideo(raw) {
  let u0 = pullUrl(raw);
  if (!u0) return null;
  if (u0.startsWith("//")) u0 = "https:" + u0;
  if (u0.startsWith("/") && !u0.startsWith("//")) return /^\/assets\/[\w\-./]+\.(mp4|webm)$/i.test(u0) && !u0.includes("..") ? { kind: "file", src: u0 } : null;
  let u; try { u = new URL(u0); } catch { return null; }
  if (u.protocol !== "https:" || u.username || u.password) return null;
  const host = u.hostname.toLowerCase().replace(/^www\./, "");
  const seg = u.pathname.split("/").filter(Boolean);
  const yt = (id) => (/^[\w-]{11}$/.test(id || "") ? { kind: "youtube", src: "https://www.youtube-nocookie.com/embed/" + id } : null);
  if (host === "youtu.be") return yt(seg[0]);
  if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
    if (u.pathname === "/watch") return yt(u.searchParams.get("v"));
    if (["shorts", "embed", "live"].includes(seg[0])) return yt(seg[1]);
    return null;
  }
  if (host === "aparat.com") {
    let h = "";
    if (seg[0] === "v" || seg[0] === "embed") h = seg[1] || "";
    else { const i = seg.indexOf("videohash"); if (i >= 0) h = seg[i + 1] || ""; }
    return /^[A-Za-z0-9]{3,24}$/.test(h) ? { kind: "aparat", src: "https://www.aparat.com/video/video/embed/videohash/" + h + "/vt/frame" } : null;
  }
  return /\.(mp4|webm)$/i.test(u.pathname) ? { kind: "file", src: u.href } : null;
}

// قیمت و مرحله‌های تخفیف بر اساس تعداد خریداران
const rnd = (x) => Math.round(x / 1000) * 1000;
export function pricingOf(p, count) {
  const base = p.base | 0, sold = Math.max(0, (count | 0) + (p.adjust | 0));
  const tiers = [];
  let from = 1;
  for (const [n, pct] of [[p.n1, p.p1], [p.n2, p.p2]]) {
    if (n > 0) {
      const to = from + n - 1;
      tiers.push({ from, to, n, pct, price: rnd(base * (1 - pct / 100)), left: Math.max(0, Math.min(n, to - sold)) });
      from = to + 1;
    }
  }
  let active = -1;
  tiers.forEach((t, i) => { t.state = t.left === 0 ? "soldout" : active < 0 ? ((active = i), "active") : "upcoming"; });
  const cur = active >= 0 ? { tier: active + 1, price: tiers[active].price, pct: tiers[active].pct } : { tier: 0, price: base, pct: 0 };
  return { base, sold, tiers, current: cur, fullFrom: from };
}

export async function countCodes(codes) {
  const l = await codes.list();
  return l.blobs.filter((b) => ID_RE.test(b.key)).length;
}

// ---- عکس‌ها (مدرس و پوستر تیزر)
export const IMG_KINDS = ["photo", "poster"];
const MAGIC = { "image/jpeg": [0xff, 0xd8, 0xff], "image/png": [0x89, 0x50, 0x4e, 0x47] };
export function parseImage(dataUrl) {
  const m = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/]+={0,2})$/.exec(String(dataUrl || ""));
  if (!m || m[2].length > 600_000) return null;
  const buf = Buffer.from(m[2], "base64");
  if (buf.length < 100 || buf.length > 450_000) return null;
  const mime = m[1];
  const ok = mime === "image/webp" ? buf.subarray(0, 4).toString("latin1") === "RIFF" && buf.subarray(8, 12).toString("latin1") === "WEBP" : MAGIC[mime].every((b, i) => buf[i] === b);
  return ok ? { m: mime, b: m[2] } : null;
}
