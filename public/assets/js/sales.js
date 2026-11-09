// صفحه‌ی فروش و ورود: تم، ورود با کد، حالت خریدار، ترمینال زنده، سؤالات متداول، انیمیشن اسکرول
(function () {
  "use strict";
  var d = document, root = d.documentElement, $ = function (s, r) { return (r || d).querySelector(s); }, $$ = function (s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); };
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  root.classList.add("js");

  /* ---------- تم (پیش‌فرض تیره) ---------- */
  var t = $("#themeBtn");
  if (t) t.addEventListener("click", function () {
    var v = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", v);
    try { localStorage.setItem("rayvo:theme", v); } catch (e) {}
    var m = $('meta[name="theme-color"]'); if (m) m.setAttribute("content", v === "dark" ? "#06080f" : "#f6f9fd");
  });

  /* ---------- ورود با کد ---------- */
  var f = $("#f");
  if (f) f.addEventListener("submit", function (e) {
    e.preventDefault();
    var b = f.querySelector("button"), er = $("#err"), c = $("#code");
    er.textContent = ""; b.disabled = true;
    fetch("/api/login", { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code: c.value.trim() }) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (x) { return [r.ok, x]; }); })
      .then(function (x) {
        if (x[0]) { location.href = "/lessons/00-index.html"; }
        else { er.textContent = x[1].error || "کد معتبر نیست"; b.disabled = false; }
      })
      .catch(function () { er.textContent = "خطا در ارتباط؛ دوباره تلاش کن"; b.disabled = false; });
  });

  /* ---------- حالت خریدار: اگر وارد شده، «مشاهده‌ی کل دوره» نشان بده ---------- */
  if ($("#navCourse") && window.fetch) {
    fetch("/api/me", { credentials: "same-origin", cache: "no-store" })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (u) {
        if (!u) return;
        root.classList.add("is-buyer");
        ["#navCourse", "#drCourse"].forEach(function (s) { var el = $(s); if (el) el.hidden = false; });
        ["#navLogin", "#navBuy", "#drLogin", "#drBuy"].forEach(function (s) { var el = $(s); if (el) el.hidden = true; });
        var eb = $("#enterBox"), wb = $("#welcomeBox");
        if (eb && wb) { eb.hidden = true; wb.hidden = false; var n = $("#welcomeName"); if (n && u.name) n.textContent = "سلام " + u.name + " 👋 خوش آمدی"; }
      }).catch(function () {});
  }

  /* ---------- منوی موبایل ---------- */
  var mb = $("#menuBtn"), dr = $("#drawer");
  function menu(open) {
    if (!mb || !dr) return;
    mb.setAttribute("aria-expanded", open ? "true" : "false");
    mb.classList.toggle("on", open);
    if (open) { dr.hidden = false; requestAnimationFrame(function () { dr.classList.add("open"); }); }
    else { dr.classList.remove("open"); setTimeout(function () { if (!dr.classList.contains("open")) dr.hidden = true; }, 260); }
  }
  if (mb) {
    mb.addEventListener("click", function () { menu(mb.getAttribute("aria-expanded") !== "true"); });
    if (dr) dr.addEventListener("click", function (e) { if (e.target.closest("a")) menu(false); });
    d.addEventListener("keydown", function (e) { if (e.key === "Escape") menu(false); });
    window.addEventListener("resize", function () { if (window.innerWidth > 900) menu(false); });
  }

  /* ---------- هدر: نوار پیشرفت اسکرول + فشرده‌شدن + اسکرول‌اسپای ---------- */
  var nav = $("#nav"), bar = $("#sProg"), ticking = false;
  var spy = $$("[data-sp]").filter(function (a, i, arr) { return arr.findIndex(function (x) { return x.dataset.sp === a.dataset.sp; }) === i; });
  var secs = spy.map(function (a) { return d.getElementById(a.dataset.sp); }).filter(Boolean);
  function onScroll() {
    ticking = false;
    var y = window.pageYOffset || 0, h = (d.body.scrollHeight - window.innerHeight) || 1;
    if (bar) bar.style.transform = "scaleX(" + Math.min(1, y / h).toFixed(4) + ")";
    if (nav) nav.classList.toggle("scrolled", y > 12);
    var cur = "";
    for (var i = 0; i < secs.length; i++) { if (secs[i].getBoundingClientRect().top < window.innerHeight * 0.38) cur = secs[i].id; }
    $$("[data-sp]").forEach(function (a) { a.classList.toggle("on", a.dataset.sp === cur); });
  }
  window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* ---------- نمایش نرم بخش‌ها هنگام اسکرول (با اسکرول به بالا هم دوباره انیمیت می‌شود) ---------- */
  if ("IntersectionObserver" in window && !reduce) {
    var els = $$(".s-sec > .s-wrap, .s-hero-txt, .s-visual, .s-card, .s-lv, .s-enter-in, .s-fq, .s-cover, .s-week, .s-box, .s-price, .s-free > *");
    els.forEach(function (el, i) { el.classList.add("rv-rev"); el.style.setProperty("--d", ((i % 4) * 70) + "ms"); });
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (en.isIntersecting) en.target.classList.add("in");
        else if (en.boundingClientRect.top > 0 || en.boundingClientRect.bottom < 0) en.target.classList.remove("in"); // کاملاً خارج شد → دفعه‌ی بعد دوباره بیاید
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -6% 0px" });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- سؤالات متداول: همیشه فقط یکی باز ---------- */
  var fqs = $$(".s-fq");
  function setFq(it, open) {
    it.classList.toggle("open", open);
    var b = $(".s-fq-h", it); if (b) b.setAttribute("aria-expanded", open ? "true" : "false");
  }
  fqs.forEach(function (it) {
    var b = $(".s-fq-h", it);
    b.addEventListener("click", function () {
      var wasOpen = it.classList.contains("open");
      fqs.forEach(function (o) { setFq(o, false); });
      if (!wasOpen) setFq(it, true);
    });
  });

  /* ---------- ترمینال زنده: مدام کد جاوااسکریپت می‌نویسد؛ بعد از ۱ دقیقه پاک و از اول ---------- */
  var out = $("#termOut");
  if (out) {
    var SCRIPT = [
      ["$", "node --version"],
      ["o", "v22.12.0"],
      ["$", "mkdir rayvo-js && cd rayvo-js"],
      ["$", "node hello.js"],
      ["o", "سلام Rayvo!"],
      ["$", "node -e \"console.log([1, 2, 3].map(n => n * 2))\""],
      ["o", "[ 2, 4, 6 ]"],
      ["$", "node -e \"const sum = (...n) => n.reduce((a, b) => a + b, 0); console.log(sum(1, 2, 3, 4))\""],
      ["o", "10"],
      ["$", "node -e \"class User { #id = 7; get id() { return this.#id } } console.log(new User().id)\""],
      ["o", "7"],
      ["$", "npm init -y"],
      ["i", "Wrote to [package.json]"],
      ["$", "node -e \"Promise.resolve('Promise OK').then(console.log)\""],
      ["o", "Promise OK"],
      ["$", "node -e \"fetch('https://jsonplaceholder.typicode.com/todos/1').then(r => r.json()).then(console.log)\""],
      ["o", "{ userId: 1, id: 1, title: 'delectus aut autem', completed: false }"],
      ["$", "git init"],
      ["i", "Initialized empty Git repository in [rayvo-js/.git/]"],
      ["$", "npx serve ."],
      ["i", "Accepting connections at [http://localhost:3000]"]
    ];
    var esc = function (x) { return x.replace(/&/g, "&amp;").replace(/</g, "&lt;"); };
    var render = function (done, typing) {
      var h = "";
      done.forEach(function (l) {
        if (l[0] === "$") h += '<span class="c">$</span> ' + esc(l[1]) + "\n";
        else if (l[0] === "i") h += '<span class="o">INFO</span>  ' + esc(l[1]).replace(/(\[[^\]]+\])/g, '<span class="u">$1</span>') + "\n";
        else h += '<span class="k">' + esc(l[1]) + "</span>\n";
      });
      if (typing != null) h += '<span class="c">$</span> ' + esc(typing);
      out.innerHTML = h;
      var pre = out.parentNode; pre.scrollTop = pre.scrollHeight;
    };
    if (reduce) { render(SCRIPT.slice(0, 8)); }
    else {
      var run = 0;
      (function start() {
        var my = ++run, t0 = Date.now(), done = [], i = 0;
        render([]);
        function sleep(ms, fn) { setTimeout(function () { if (my === run) fn(); }, ms); }
        function next() {
          if (Date.now() - t0 > 60000 || i >= SCRIPT.length) { return sleep(1800, function () { start(); }); } // بعد از ۱ دقیقه (یا پایان) پاک و از اول
          var L = SCRIPT[i++];
          if (L[0] !== "$") { done.push(L); render(done); return sleep(220 + Math.random() * 380, next); }
          var n = 0;
          (function ty() {
            if (n <= L[1].length) { render(done, L[1].slice(0, n++)); sleep(26 + Math.random() * 55, ty); }
            else { done.push(L); render(done); sleep(300 + Math.random() * 420, next); }
          })();
        }
        sleep(500, next);
      })();
    }
  }
})();


/* ===== v70: تصویر سطح‌ها، مدرس، تیزر و قیمت مرحله‌ای ===== */
(function () {
  "use strict";
  var d = document, $ = function (s, r) { return (r || d).querySelector(s); };
  var fa = function (n) { return Number(n).toLocaleString("fa-IR"); };
  function el(tag, cls, txt) { var e = d.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }

  /* تصویر هر سطح/پروژه: webp ← jpg ← png ← نشان شماره (اگر فایل هنوز گذاشته نشده) */
  Array.prototype.forEach.call(d.querySelectorAll(".s-lvimg img[data-fb]"), function (img) {
    var fb = (img.getAttribute("data-fb") || "").split(",").filter(Boolean), base = (img.getAttribute("src") || "").replace(/\.[a-z0-9]+$/i, ""), i = 0;
    function fail() { if (i < fb.length) { img.src = base + fb[i++]; } else { img.parentNode.classList.add("noimg"); } }
    img.addEventListener("error", fail);
    if (img.complete && img.naturalWidth === 0 && img.getAttribute("src")) fail();
  });

  if (!window.fetch) return;
  fetch("/api/site", { credentials: "same-origin" }).then(function (r) { return r.ok ? r.json() : null; }).then(function (s) {
    if (!s) return;
    teacher(s.instructor); teaser(s.teaser); price(s.pricing);
  }).catch(function () {});

  function teacher(t) {
    var sec = $("#teacher"); if (!sec || !t) return;
    var name = (t.name || "").trim();
    $("#tcName").textContent = name || "مدرس دوره";
    $("#tcTitle").textContent = t.title || "";
    $("#tcBio").textContent = t.bio || "";
    var ph = $("#tcPhoto"); ph.textContent = "";
    if (t.photo) { var im = el("img"); im.alt = name; im.width = 140; im.height = 140; im.decoding = "async"; im.loading = "lazy"; im.src = t.photo; im.addEventListener("error", function () { ph.textContent = (name || "؟").charAt(0); }); ph.appendChild(im); }
    else ph.textContent = (name || "؟").charAt(0);
    var ul = $("#tcSpecs"); ul.textContent = "";
    (t.specs || []).forEach(function (x) { ul.appendChild(el("li", "", x)); });
    sec.hidden = false;
  }

  function teaser(t) {
    var sec = $("#teaser"); if (!sec || !t || !t.src) return;
    if (t.title) $("#tzTitle").textContent = t.title;
    $("#tzText").textContent = t.text || "چند دقیقه‌ی کوتاه ببین دوره چطور پیش می‌رود و چه چیزی یاد می‌گیری.";
    var box = $("#tzBox"); box.textContent = "";
    if (t.kind === "file") {
      var v = el("video"); v.controls = true; v.preload = "metadata"; v.setAttribute("playsinline", ""); if (t.poster) v.poster = t.poster; v.src = t.src; box.appendChild(v);
    } else {
      var b = el("button", "s-vplay"); b.type = "button"; b.setAttribute("aria-label", "پخش تیزر دوره");
      if (t.poster) b.style.backgroundImage = "url(" + JSON.stringify(t.poster) + ")";
      b.appendChild(el("i")); b.appendChild(el("span", "", "پخش تیزر دوره"));
      b.addEventListener("click", function () {
        var f = el("iframe"); f.title = "تیزر دوره";
        f.src = t.src + (t.src.indexOf("?") < 0 ? "?" : "&") + (t.kind === "youtube" ? "autoplay=1&rel=0" : "autoplay=true");
        f.allow = "autoplay; fullscreen; picture-in-picture"; f.setAttribute("allowfullscreen", ""); f.referrerPolicy = "strict-origin-when-cross-origin";
        box.textContent = ""; box.appendChild(f);
      });
      box.appendChild(b);
    }
    sec.hidden = false;
  }

  function price(p) {
    var box = $("#tiers"); if (!box || !p || !p.base) return;
    var T = function (n) { return fa(n) + " تومان"; }, tiers = p.tiers || [];
    box.textContent = "";
    var cur = p.current || { tier: 0, price: p.base, pct: 0 }, act = null;
    tiers.forEach(function (t) { if (t.state === "active") act = t; });
    var now = el("div", "s-now");
    if (cur.pct > 0) now.appendChild(el("span", "badge", fa(cur.pct) + "٪ تخفیف ویژه"));
    if (cur.pct > 0) { var o = el("div", "old"); o.appendChild(d.createTextNode("قیمت اصلی: ")); o.appendChild(el("s", "", T(p.base))); now.appendChild(o); }
    var big = el("div", "big", fa(cur.price)); big.appendChild(el("small", "", "تومان")); now.appendChild(big);
    if (act) now.appendChild(el("div", "left", "فقط " + fa(act.left) + " جا با این قیمت باقی مانده"));
    box.appendChild(now);
    tiers.forEach(function (t) {
      var on = t.state === "active", off = t.state === "soldout";
      var r = el("div", "s-tier" + (on ? " on" : "") + (off ? " off" : ""));
      r.appendChild(el("span", "pct", fa(t.pct) + "٪ تخفیف"));
      r.appendChild(el("span", "who", t.from === 1 ? fa(t.n) + " نفر اول" : "نفر " + fa(t.from) + " تا " + fa(t.to)));
      r.appendChild(el("span", "amt", T(t.price)));
      r.appendChild(el("span", "left", off ? "ظرفیت تکمیل شد" : (on ? "در حال فروش · " + fa(t.left) + " جا باقی مانده" : fa(t.left) + " جا · بعد از تکمیل مرحله‌ی قبل")));
      box.appendChild(r);
    });
    var full = el("div", "s-tier full" + (cur.tier === 0 ? " on" : ""));
    full.appendChild(el("span", "pct", "قیمت اصلی"));
    full.appendChild(el("span", "who", tiers.length ? "از نفر " + fa(p.fullFrom) + " به بعد" : "قیمت دوره"));
    full.appendChild(el("span", "amt", T(p.base)));
    full.appendChild(el("span", "left", cur.tier === 0 ? "قیمت فعلی دوره" : "بدون تخفیف"));
    box.appendChild(full);
  }

  /* ----- نظرات دانشجوها ----- */
  var rvRating = 0;
  function stars(n) { var t = ""; for (var i = 1; i <= 5; i++) t += i <= n ? "★" : "☆"; return t; }
  function reviews() {
    var sec = $("#reviews"); if (!sec) return;
    var logged = false;
    function paint(data) {
      var list = $("#rvList"); list.textContent = "";
      var rs = (data && data.reviews) || [];
      rs.forEach(function (r) {
        var c = el("article", "s-rev"), top = el("div", "rt");
        top.appendChild(el("b", "", r.name || "دانشجو"));
        if (r.rating) top.appendChild(el("span", "st", stars(r.rating)));
        c.appendChild(top); c.appendChild(el("p", "", r.text)); list.appendChild(c);
      });
      $("#rvSum").textContent = rs.length ? (data.avg ? "میانگین امتیاز " + fa(data.avg) + " از ۵، بر اساس نظر " + fa(rs.length) + " دانشجو" : "نظر " + fa(rs.length) + " دانشجوی دوره") : "هنوز نظری ثبت نشده؛ اولین نظر را دانشجوهای دوره اینجا می‌نویسند.";
      sec.hidden = !(rs.length || logged);
    }
    function load() { return fetch("/api/reviews", { credentials: "same-origin" }).then(function (r) { return r.ok ? r.json() : null; }).then(paint).catch(function () {}); }
    var form = $("#rvForm"), msg = $("#rvMsg"), starBox = $("#rvStars");
    for (var i = 1; i <= 5; i++) (function (n) {
      var b = el("button", "", "★"); b.type = "button"; b.setAttribute("role", "radio"); b.setAttribute("aria-label", fa(n) + " ستاره");
      b.addEventListener("click", function () { rvRating = rvRating === n ? 0 : n; Array.prototype.forEach.call(starBox.children, function (x, k) { x.classList.toggle("on", k < rvRating); }); });
      starBox.appendChild(b);
    })(i);
    form.addEventListener("submit", function (e) {
      e.preventDefault(); msg.className = "s-rvmsg"; msg.textContent = "";
      var text = $("#rvText").value.trim();
      if (text.length < 10) { msg.className = "s-rvmsg bad"; msg.textContent = "نظرت را حداقل در ۱۰ حرف بنویس."; return; }
      var btn = $("#rvSend"); btn.disabled = true;
      fetch("/api/reviews", { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json", "x-rv": "1" }, body: JSON.stringify({ text: text, name: $("#rvName").value, rating: rvRating }) })
        .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
        .then(function (x) { msg.className = "s-rvmsg " + (x.ok ? "ok" : "bad"); msg.textContent = x.ok ? "ممنون! نظرت بعد از بررسی مدیر نمایش داده می‌شود." : (x.j.error || "ثبت نشد"); })
        .catch(function () { msg.className = "s-rvmsg bad"; msg.textContent = "ارتباط برقرار نشد؛ دوباره امتحان کن."; })
        .then(function () { btn.disabled = false; });
    });
    fetch("/api/reviews?mine=1", { credentials: "same-origin", cache: "no-store" }).then(function (r) { return r.ok ? r.json() : null; }).then(function (m) {
      if (m) {
        logged = true; form.hidden = false; $("#rvName").value = (m.review && m.review.name) || m.defaultName || "";
        if (m.review) { $("#rvText").value = m.review.text; rvRating = m.review.rating || 0; Array.prototype.forEach.call(starBox.children, function (x, k) { x.classList.toggle("on", k < rvRating); }); msg.textContent = m.review.status === "ok" ? "نظر تو منتشر شده است؛ اگر ویرایش کنی دوباره بررسی می‌شود." : "نظر تو در انتظار بررسی مدیر است."; }
      }
    }).catch(function () {}).then(load);
  }
  reviews();
})();
