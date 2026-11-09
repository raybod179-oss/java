// خواندن عمومی تنظیمات صفحه‌ی فروش: GET /api/site و عکس‌ها (/api/site/photo , /api/site/poster)
import { stores } from "../lib/store.mjs";
import { getSite, parseVideo, pricingOf, countCodes, IMG_KINDS } from "../lib/site.mjs";
import { SEC } from "../lib/headers.mjs";

export const config = { path: ["/api/site", "/api/site/photo", "/api/site/poster"] };

const J = (obj, status = 200, cache = "public, max-age=15") =>
  new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": cache, "X-Content-Type-Options": "nosniff", ...SEC } });

export default async (req) => {
  try {
    if (req.method !== "GET") return J({ error: "Method Not Allowed" }, 405, "no-store");
    const route = new URL(req.url).pathname.replace(/\/+$/, "").split("/").pop();
    const { codes, locks } = stores();

    if (IMG_KINDS.includes(route)) {
      const o = await locks.get("_img_" + route, { type: "json" }).catch(() => null);
      if (!o || !o.b) return new Response("Not Found", { status: 404, headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } });
      const versioned = new URL(req.url).searchParams.has("v");
      return new Response(Buffer.from(o.b, "base64"), { headers: { "Content-Type": o.m, "Cache-Control": versioned ? "public, max-age=31536000, immutable" : "public, max-age=300", "X-Content-Type-Options": "nosniff", "Content-Security-Policy": "default-src 'none'", "Cross-Origin-Resource-Policy": "same-origin" } });
    }

    const s = await getSite(locks);
    const i = s.instructor, hasIns = i.show && (i.name || i.title || i.bio || i.specs.length || s.img.photo);
    const v = s.teaser.show ? parseVideo(s.teaser.url) : null;
    const pr = s.pricing.show ? pricingOf(s.pricing, await countCodes(codes)) : null;
    return J({
      instructor: hasIns ? { name: i.name, title: i.title, bio: i.bio, specs: i.specs, photo: s.img.photo ? "/api/site/photo?v=" + s.img.photo : "" } : null,
      teaser: v ? { title: s.teaser.title, text: s.teaser.text, kind: v.kind, src: v.src, poster: s.img.poster ? "/api/site/poster?v=" + s.img.poster : "" } : null,
      pricing: pr ? { base: pr.base, sold: pr.sold, tiers: pr.tiers, current: pr.current, fullFrom: pr.fullFrom } : null,
    });
  } catch (e) {
    console.error("site error", e);
    return J({ error: "خطای موقت" }, 500, "no-store");
  }
};
