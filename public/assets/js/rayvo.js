/* Rayvo course shell — منو، پیشرفت، کپی کد، تم، فهرست (تولیدشده از curriculum.py) */
(function(){
"use strict";
var BRAND={name:"Rayvo",author:"رایبد اکبرلو",authorLatin:"Raybod Akbarlou",course:"دوره‌ی جامع جاوااسکریپت",tagline:"از صفر تا ۲۲ پروژه‌ی واقعی",
  links:[["وب‌سایت","https://rayvo.vercel.app/"],["تلگرام","https://t.me/Rayvoak"],["بله","https://ble.ir/rayvo"],["یوتیوب","https://www.youtube.com/@raybod-akbarlou-Rayvo"],["آپارات","https://www.aparat.com/Rayvo"],["گیت‌هاب","https://github.com/raybod179"]]};
var LEVELS=[{"k":"level","n":1,"title":"شروع از صفر","sub":"متغیر، انواع داده، شرط، حلقه، تابع، Scope و Closure","items":[["01-intro.html","معرفی جاوااسکریپت و اولین کد",25],["02-variables.html","متغیرها: let و const",30],["03-datatypes.html","انواع داده",30],["04-operators.html","عملگرها",35],["05-conditions.html","شرط‌ها: if و switch",35],["06-loops.html","حلقه‌ها",40],["07-functions.html","توابع و Arrow Function",45],["08-scope.html","Scope، Hoisting و Closure",45]]},{"k":"level","n":2,"title":"رشته، عدد و آرایه","sub":"متدهای String و Array، Destructuring، Map، Set، Regex و Date","items":[["09-strings.html","متدهای String",40],["10-numbers.html","عدد، تبدیل نوع و Math",35],["11-array-basics.html","آرایه‌ها: افزودن، حذف و جستجو",40],["12-array-methods.html","map، filter، reduce و sort",50],["13-destructuring.html","Destructuring، Spread و Rest",40],["14-map-set.html","Map، Set و متدهای Object",35],["15-regex-date.html","Regex و Date",45]]},{"k":"level","n":3,"title":"شیء‌گرایی","sub":"this، کلاس، ارث‌بری، Polymorphism، Encapsulation","items":[["16-this.html","آبجکت‌ها و کلمه‌ی this",40],["17-call-bind.html","call، apply و bind",30],["18-classes.html","کلاس‌ها و Constructor",50],["19-inheritance.html","ارث‌بری (Inheritance)",45],["20-poly-encap.html","Polymorphism و Encapsulation",45],["21-getter-static.html","Getter، Setter و Static",40]]},{"k":"level","n":4,"title":"DOM و رویدادها","sub":"ساخت صفحه‌ی زنده: المنت‌ها، رویدادها، تایمر و LocalStorage","items":[["22-dom-basics.html","DOM: انتخاب و تغییر المنت‌ها",45],["23-dom-create.html","ساخت، جابجایی و حذف المنت",45],["24-events.html","رویدادها: موس، کیبورد و فرم",50],["25-event-flow.html","Event Delegation، target و dataset",40],["26-timers.html","تایمرها: setTimeout و setInterval",30],["27-bom-storage.html","BOM، LocalStorage و JSON",45]]},{"k":"level","n":5,"title":"ناهمزمانی و API","sub":"Event Loop، Promise، Async/Await، Fetch و Axios","items":[["28-async-basics.html","ناهمزمانی و Event Loop",40],["29-promises.html","Promise",45],["30-async-await.html","Async و Await",45],["31-fetch-get.html","API و درخواست GET با Fetch",50],["32-fetch-crud.html","POST، PUT، PATCH و DELETE",50],["33-axios-optimize.html","Axios و بهینه‌سازی درخواست‌ها",45],["34-modules.html","ماژول‌ها: import و export",40],["35-errors-debug.html","مدیریت خطا و دیباگ حرفه‌ای",40]]},{"k":"level","n":6,"title":"پروژه‌های مبتدی","sub":"۷ پروژه‌ی اول: از شمارنده تا بازی","items":[["project-counter.html","پروژه‌ی شمارنده‌ی عدد",35],["project-modal.html","پروژه‌ی مودال باکس",40],["project-accordion.html","پروژه‌ی منوی آکاردئون",40],["project-theme.html","پروژه‌ی دارک و لایت",40],["project-countdown.html","پروژه‌ی شمارش معکوس سال نو",40],["project-slider.html","پروژه‌ی اسلایدر نظرات",45],["project-dino.html","پروژه‌ی بازی دایناسور",50]]},{"k":"level","n":7,"title":"پروژه‌های متوسط","sub":"۷ پروژه‌ی فرم، API و ذخیره‌سازی","items":[["project-sticky-header.html","پروژه‌ی هدر چسبان با اسکرول نرم",40],["project-auth-form.html","پروژه‌ی فرم ورود و ثبت‌نام",45],["project-form-validation.html","پروژه‌ی اعتبارسنجی فرم",50],["project-local-json.html","پروژه‌ی API محلی با JSON",45],["project-real-api.html","پروژه‌ی API واقعی با Fetch",45],["project-image-slider.html","پروژه‌ی اسلایدر تصاویر",45],["project-todo-storage.html","پروژه‌ی تودولیست با LocalStorage",55]]},{"k":"level","n":8,"title":"پروژه‌های پیشرفته","sub":"۸ پروژه‌ی بزرگ و کامل","items":[["project-music-player.html","پروژه‌ی موزیک پلیر",55],["project-menu-filter.html","پروژه‌ی جستجو و فیلتر منو",50],["project-shop-cart.html","پروژه‌ی فروشگاه با سبد خرید",60],["project-movie-api.html","پروژه‌ی Movie API",60],["project-image-gallery.html","پروژه‌ی گالری تصاویر با Image API",55],["project-weather-app.html","پروژه‌ی برنامه‌ی آب‌وهوا",60],["project-one-page-site.html","پروژه‌ی سایت تک‌صفحه‌ای",65],["project-calculator.html","پروژه‌ی ماشین حساب",60]]},{"k":"level","n":9,"title":"هدیه: پلاگین‌های پرکاربرد","sub":"کتابخانه‌هایی که در پروژه‌های واقعی هر روز می‌بینی","items":[["plugin-clipboard.html","Clipboard.js: کپی با یک کلیک",25],["plugin-sweetalert.html","SweetAlert2: پیام‌های زیبا",30],["plugin-typed.html","Typed.js: افکت تایپ",25],["plugin-aos.html","AOS: انیمیشن با اسکرول",25],["plugin-zoom.html","Medium Zoom: بزرگ‌نمایی تصویر",20],["plugin-videojs.html","Video.js: پخش‌کننده‌ی ویدیو",30],["plugin-swiper.html","Swiper: اسلایدر لمسی حرفه‌ای",35]]},{"k":"level","n":10,"title":"کار و درآمد","sub":"پورتفولیو، فریلنس و مصاحبه‌ی جاوااسکریپت","items":[["career-portfolio.html","ساخت پورتفولیو و GitHub",45],["career-freelance.html","شروع فریلنسری و قیمت‌گذاری پروژه",40],["career-interview.html","آمادگی مصاحبه‌ی جاوااسکریپت",60]]}];
var doc=document,body=doc.body,root=doc.documentElement;
var path=decodeURIComponent(location.pathname.split("/").pop()||"");
var IMG="../assets/img/";
var LS={get:function(k){try{return localStorage.getItem(k)}catch(e){return null}},set:function(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
function el(t,c,h){var e=doc.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e}
function fa(n){return String(n).replace(/\d/g,function(d){return "۰۱۲۳۴۵۶۷۸۹"[d]})}
function isDone(f){return LS.get("rayvo:done:"+f)==="1"}
function setTheme(t){root.setAttribute("data-theme",t)}
setTheme(LS.get("rayvo:theme")||"light");

/* ---- مدل داده ---- */
var FLAT=[];           // فقط درس‌های موجود، به ترتیب
var INFO={};           // file -> {level, idx, title, min}
LEVELS.forEach(function(L,li){L.items.forEach(function(it,ii){
  if(it[0]){var r={file:it[0],title:it[1],min:it[2],level:L,idx:ii};FLAT.push(r);INFO[it[0]]=r}
})});
var PROJECT_BASE={6:0,7:7,8:14};
function labelOf(r){if(r.level.n===9)return "هدیه · درس "+fa(r.idx+1);if(r.level.n===10)return "کار و درآمد · درس "+fa(r.idx+1);if(PROJECT_BASE[r.level.n]!==undefined)return "پروژه‌ی "+fa(PROJECT_BASE[r.level.n]+r.idx+1);return r.level.k==="project"?("پروژه‌ی "+fa(r.level.n)):("سطح "+fa(r.level.n)+" · درس "+fa(r.idx+1))}
function doneCount(){return FLAT.filter(function(r){return isDone(r.file)}).length}
function firstTodo(){for(var i=0;i<FLAT.length;i++){if(!isDone(FLAT[i].file))return FLAT[i]}return FLAT[0]}
var CUR=INFO[path]||null;

/* ---- آیکن صفحه ---- */
if(!doc.querySelector('link[rel="icon"]')){var ic=doc.createElement("link");ic.rel="icon";ic.href=IMG+"favicon.png";doc.head.appendChild(ic)}

function levelLabel(L){return L.k==="project"?(" "+L.title):("سطح "+fa(L.n)+" · "+L.title)}

function build(){
  body.classList.add("rv-has-side");
  var top=el("header","rv-top");
  top.innerHTML='<button class="rv-btn rv-menu" aria-label="منوی دوره"> <span>فهرست</span></button>'+
   '<a class="rv-logo" href="00-index.html"><img class="rv-mark" src="'+IMG+'rayvo-logo-96.png" alt="Rayvo" width="38" height="38"><span><b>'+BRAND.name+'</b><small>'+BRAND.course+'</small></span></a>'+
   '<span class="rv-spacer"></span>'+
   '<a class="rv-btn rv-hide-sm" href="'+BRAND.links[3][1]+'" target="_blank" rel="noopener">یوتیوب</a>'+
   '<button class="rv-btn rv-theme" aria-label="تغییر تم"></button><div class="rv-bar"><i></i></div>';
  body.insertBefore(top,body.firstChild);

  var side=el("aside","rv-side");side.setAttribute("aria-label","فهرست دوره");
  var n=doneCount(),pct=FLAT.length?Math.round(n/FLAT.length*100):0;
  var h='<div class="rv-prog"><div class="t"><span>پیشرفت شما</span><b>'+fa(pct)+'٪</b></div><div class="track"><i style="width:'+pct+'%"></i></div><div class="t sm"><span>'+fa(n)+' از '+fa(FLAT.length)+' درس</span></div></div>';
  LEVELS.forEach(function(L){
    var avail=L.items.filter(function(i){return i[0]}).length;
    var open=CUR&&CUR.level===L;
    if(L.k==="project"){
      var it=L.items[0];
      h+= it[0] ? '<a class="rv-proj'+(open?" on":"")+'" href="'+encodeURI(it[0])+'"> <span>'+L.title+'</span></a>'
                : '<span class="rv-proj soon"> <span>'+L.title+'</span><em>به‌زودی</em></span>';
    }else{
      var dn=L.items.filter(function(i){return i[0]&&isDone(i[0])}).length;
      h+='<details class="rv-lvl"'+(open?" open":"")+'><summary><span>'+levelLabel(L)+'</span><small>'+(avail?fa(dn)+"/"+fa(avail):"به‌زودی")+'</small></summary><ul class="rv-list">';
      L.items.forEach(function(it,i){
        if(it[0]){var on=it[0]===path,d=isDone(it[0]);
          h+='<li><a href="'+encodeURI(it[0])+'" class="'+(on?"on ":"")+(d?"done":"")+'"><span class="n">'+(d?"":fa(i+1))+'</span><span>'+it[1]+'</span></a></li>'}
        else h+='<li><span class="soon"><span class="n">'+fa(i+1)+'</span><span>'+it[1]+'</span></span></li>';
      });
      h+='</ul></details>';
    }
  });
  h+='<div class="rv-side-foot">تهیه‌شده توسط <b>'+BRAND.name+'</b> — '+BRAND.author+'<br><a href="'+BRAND.links[0][1]+'" target="_blank" rel="noopener">rayvo.vercel.app</a></div>';
  side.innerHTML=h;body.appendChild(side);
  var cur=side.querySelector("a.on");if(cur&&cur.offsetTop>520){side.scrollTop=cur.offsetTop-220}

  var menu=top.querySelector(".rv-menu");
  menu.addEventListener("click",function(){body.classList.toggle("rv-open")});
  doc.addEventListener("click",function(e){if(body.classList.contains("rv-open")&&!side.contains(e.target)&&!menu.contains(e.target))body.classList.remove("rv-open")});
  side.addEventListener("click",function(e){if(e.target.closest("a"))body.classList.remove("rv-open")});
  top.querySelector(".rv-theme").addEventListener("click",function(){var t=root.getAttribute("data-theme")==="dark"?"light":"dark";setTheme(t);LS.set("rayvo:theme",t)});

  var bar=top.querySelector(".rv-bar i");
  var up=el("button","rv-top-btn","↑");up.setAttribute("aria-label","بازگشت به بالا");body.appendChild(up);
  up.addEventListener("click",function(){window.scrollTo({top:0,behavior:"smooth"})});
  function onScroll(){var h=root.scrollHeight-root.clientHeight;bar.style.width=(h>0?Math.min(100,root.scrollTop/h*100):0)+"%";up.classList.toggle("show",root.scrollTop>700)}
  window.addEventListener("scroll",onScroll,{passive:true});onScroll();
}

function heroMeta(){
  var hdr=doc.querySelector(".course-header");if(!hdr||!CUR)return;
  var badge=hdr.querySelector(".badge");if(badge)badge.textContent=labelOf(CUR);
  var meta=el("div","rv-meta");
  meta.innerHTML='<span class="rv-chip">حدود '+fa(CUR.min)+' دقیقه مطالعه و تمرین</span>';
  hdr.appendChild(meta);
}

function dynamicNav(){
  var nav=doc.querySelector(".lesson-nav");if(!nav||!CUR)return;
  var i=FLAT.indexOf(CUR),p=FLAT[i-1],nx=FLAT[i+1];
  nav.innerHTML='<a href="00-index.html">فهرست دوره</a>'+
    (p?'<a href="'+encodeURI(p.file)+'">→ '+p.title+'</a>':'<span></span>')+
    (nx?'<a href="'+encodeURI(nx.file)+'">'+nx.title+' ←</a>':'<a href="00-index.html">به‌زودی: درس‌های بعدی ←</a>');
}

function copyButtons(){
  doc.querySelectorAll(".demo-code").forEach(function(box){
    var pre=box.querySelector("pre");if(!pre||box.querySelector(".rv-copy"))return;
    var b=el("button","rv-copy","کپی");b.type="button";
    b.addEventListener("click",function(){
      var text=pre.innerText;
      function ok(){b.textContent="کپی شد";b.classList.add("ok");setTimeout(function(){b.textContent="کپی";b.classList.remove("ok")},1500)}
      function fb(){var t=doc.createElement("textarea");t.value=text;t.style.position="fixed";t.style.opacity="0";body.appendChild(t);t.select();try{doc.execCommand("copy");ok()}catch(e){}body.removeChild(t)}
      if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(text).then(ok,fb)}else{fb()}
    });
    var lab=box.querySelector(".demo-label");(lab||box).appendChild(b);
  });
}

function refreshProgress(){
  var n=doneCount(),pct=FLAT.length?Math.round(n/FLAT.length*100):0;
  var p=doc.querySelector(".rv-prog");
  if(p){p.querySelector("b").textContent=fa(pct)+"٪";p.querySelector(".track i").style.width=pct+"%";p.querySelector(".t.sm span").textContent=fa(n)+" از "+fa(FLAT.length)+" درس"}
  doc.querySelectorAll(".rv-list a").forEach(function(a){
    var f=decodeURIComponent(a.getAttribute("href"));var d=isDone(f);a.classList.toggle("done",d);
    var r=INFO[f];if(r)a.querySelector(".n").textContent=d?"":fa(r.idx+1);
  });
}
function doneButton(){
  var nav=doc.querySelector(".lesson-nav");if(!CUR||!nav)return;
  var wrap=el("div","rv-done"),b=el("button","");
  function paint(){var d=isDone(path);b.className=d?"is-done":"";b.textContent=d?"✓ تمام شد":"این درس را تمام کردم"}
  b.addEventListener("click",function(){LS.set("rayvo:done:"+path,isDone(path)?"0":"1");paint();refreshProgress()});
  paint();wrap.appendChild(b);nav.parentNode.insertBefore(wrap,nav);
}

/* ---- صفحه‌ی فهرست ---- */
function renderIndex(){
  var box=doc.getElementById("rv-index");if(!box)return;
  var t=firstTodo(),n=doneCount();
  var totalMin=FLAT.reduce(function(s,r){return s+r.min},0);
  var allItems=0,projects=0;LEVELS.forEach(function(L){allItems+=L.items.length;if(L.k==="project")projects++});
  var go=doc.getElementById("rv-go");
  if(go){go.href=encodeURI(t.file);go.textContent=n? "ادامه‌ی دوره: "+t.title : "شروع دوره ←"}
  var st=doc.getElementById("rv-stats");
  if(st)st.innerHTML='<div><b>'+fa(allItems-projects)+'</b><span>درس و پروژه در مسیر کامل</span></div><div><b>۲۲</b><span>پروژه‌ی عملی</span></div><div><b>'+fa(FLAT.length)+'</b><span>درس آماده‌ی مطالعه</span></div><div><b>'+fa(Math.round(totalMin/60))+'</b><span>ساعت مطالعه و تمرین آماده</span></div>';
  var h='';
  LEVELS.forEach(function(L){
    var avail=L.items.filter(function(i){return i[0]}).length;
    if(L.k==="project"){
      var it=L.items[0];
      h+='<'+(it[0]?'a href="'+encodeURI(it[0])+'"':'div')+' class="ix-proj'+(it[0]?'':' soon')+'"><span class="ix-star"></span><span class="ix-body"><b>'+L.title+'</b><small>'+L.sub+'</small></span><span class="ix-tag">'+(it[0]?(' '+fa(it[2])+' دقیقه'):'به‌زودی')+'</span></'+(it[0]?'a':'div')+'>';
    }else{
      h+='<details class="ix-level"'+(avail?' open':'')+'><summary><span class="ix-num">'+fa(L.n)+'</span><span class="ix-body"><b>سطح '+fa(L.n)+' · '+L.title+'</b><small>'+L.sub+'</small></span><span class="ix-tag">'+(avail?fa(avail)+' درس آماده':'به‌زودی')+'</span></summary><ul>';
      L.items.forEach(function(it,i){
        if(it[0])h+='<li><a href="'+encodeURI(it[0])+'"><span class="n">'+(isDone(it[0])?"":fa(i+1))+'</span><span class="tt">'+it[1]+'</span><span class="mn">'+fa(it[2])+' دقیقه</span></a></li>';
        else h+='<li class="soon"><span class="n">'+fa(i+1)+'</span><span class="tt">'+it[1]+'</span><span class="mn">به‌زودی</span></li>';
      });
      h+='</ul></details>';
    }
  });
  box.innerHTML=h;
}

function footer(){
  var f=el("footer","rv-footer");
  f.innerHTML='<div class="by">این دوره با ❤️ توسط <b>'+BRAND.name+'</b> تهیه و طراحی شده است</div>'+
   '<div class="sub">نویسنده و مدرس: '+BRAND.author+' ('+BRAND.authorLatin+') · '+BRAND.tagline+'</div>'+
   '<div class="rv-soc"><a href="https://www.youtube.com/@raybod-akbarlou-Rayvo" target="_blank" rel="noopener" aria-label="یوتیوب" title="یوتیوب"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.6 7.2a2.5 2.5 0 00-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 002.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 001.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 001.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8zM10 15V9l5.2 3L10 15z"/></svg><span>یوتیوب</span></a><a href="https://t.me/Rayvoak" target="_blank" rel="noopener" aria-label="تلگرام" title="تلگرام"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.5 4.3 2.9 11.4c-.9.3-.9 1.2-.2 1.5l4.7 1.5 1.8 5.5c.2.6.9.8 1.4.4l2.6-2.1 4.7 3.5c.6.4 1.4.1 1.6-.7l3.2-15.2c.2-.9-.6-1.6-1.5-1.2zM9.4 13.8l8.2-5.1c.4-.2.7.1.4.3l-6.6 6.1-.3 3.3-1.7-4.6z"/></svg><span>تلگرام</span></a><a href="https://ble.ir/rayvo" target="_blank" rel="noopener" aria-label="بله" title="بله"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3C6.8 3 3 6.6 3 11.2c0 2.4 1 4.5 2.7 6l-.8 3.4c-.1.5.4.8.8.6l3.5-1.9c.9.2 1.8.3 2.8.3 5.2 0 9-3.6 9-8.4S17.2 3 12 3zm-3.2 9.6a1.2 1.2 0 110-2.4 1.2 1.2 0 010 2.4zm3.2 0a1.2 1.2 0 110-2.4 1.2 1.2 0 010 2.4zm3.2 0a1.2 1.2 0 110-2.4 1.2 1.2 0 010 2.4z"/></svg><span>بله</span></a><a href="https://www.aparat.com/Rayvo" target="_blank" rel="noopener" aria-label="آپارات" title="آپارات"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-1.8 6.2l6 3.8-6 3.8V8.2zM6.5 6.8a1.3 1.3 0 110 2.600 1.3 1.3 0 010-2.600z"/></svg><span>آپارات</span></a><a href="https://github.com/raybod179" target="_blank" rel="noopener" aria-label="گیت‌هاب" title="گیت‌هاب"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 00-3.2 19.5c.5.1.7-.2.7-.5v-1.8c-2.800.6-3.400-1.300-3.400-1.300-.5-1.200-1.100-1.500-1.100-1.500-.9-.6.1-.6.1-.6 1 .1 1.500 1 1.500 1 .9 1.500 2.300 1.100 2.900.8.1-.7.3-1.100.6-1.300-2.200-.3-4.600-1.100-4.600-5 0-1.100.4-2 1-2.700-.1-.3-.4-1.300.1-2.700 0 0 .8-.3 2.800 1a9.600 9.600 0 015 0c1.900-1.300 2.800-1 2.800-1 .5 1.400.2 2.400.1 2.700.6.700 1 1.600 1 2.700 0 3.900-2.400 4.700-4.600 5 .4.3.7.9.7 1.900v2.800c0 .3.2.6.7.5A10 10 0 0012 2z"/></svg><span>گیت‌هاب</span></a><a href="https://rayvo.vercel.app/" target="_blank" rel="noopener" aria-label="وب‌سایت" title="وب‌سایت"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm6.900 9h-3a15 15 0 00-1.200-5A8 8 0 0118.900 11zM12 4c.8 1 1.700 3 2 7H10c.3-4 1.200-6 2-7zM4.100 13h3a15 15 0 001.200 5A8 8 0 014.100 13zm3-2h-3A8 8 0 019.300 6a15 15 0 00-1.200 5zM12 20c-.8-1-1.700-3-2-7h4c-.3 4-1.200 6-2 7zm2.700-2a15 15 0 001.200-5h3A8 8 0 0114.700 18z"/></svg><span>وب‌سایت</span></a></div>'+'<div class="rv-links"><a href="/terms.html">قوانین و بازگشت وجه</a><a href="'+LV_URL+'" target="_blank" rel="noopener">دوره‌ی Laravel (فول‌استک)</a><a href="'+HC_URL+'" target="_blank" rel="noopener">دوره‌ی رایگان HTML و CSS</a></div>'+
   '<div class="rv-copy-right">© '+BRAND.name+' — کپی و بازنشر محتوای دوره بدون اجازه ممنوع است.</div>';
  var page=doc.querySelector(".course-page");(page&&page.parentNode?page.parentNode:body).appendChild(f);
}

/* ---- محافظت: واترمارک اختصاصی هر خریدار + جلوگیری از کپی ساده ---- */
var FREE=["00-index.html","01-intro.html","02-variables.html","03-datatypes.html"];
var BUY="https://t.me/RayvoSupport";
function guestMode(){
  if(location.protocol==="file:"||/[?&]dev\b/.test(location.search))return;
  fetch("/api/me",{credentials:"same-origin"}).then(function(r){
    if(r.ok)return;
    body.classList.add("rv-guest");
    doc.querySelectorAll(".rv-list a,.ix-level li a,.rv-proj,a.ix-proj").forEach(function(a){
      var f=decodeURIComponent((a.getAttribute("href")||"").split("/").pop());
      if(f&&FREE.indexOf(f)<0){a.classList.add("lock");a.setAttribute("href","../login.html")}
    });
    var up=doc.querySelector(".course-page");
    if(up&&CUR&&FREE.indexOf(path)>=0&&path!=="00-index.html"){
      var b=el("div","rv-guest-bar",'<span>این درس رایگان است. برای دسترسی به همه‌ی درس‌ها، پروژه‌ها و سورس‌ها دوره را بخر.</span><span><a class="rv-btn" href="'+BUY+'" target="_blank" rel="noopener">خرید از تلگرام</a><a class="rv-btn" href="../login.html">ورود با کد</a></span>');
      up.insertBefore(b,up.firstChild);
    }
  }).catch(function(){});
}

function protect(){
  if(location.protocol==="file:"||/[?&]dev\b/.test(location.search))return;
  root.classList.add("rv-protect");
  function inCode(n){while(n&&n.nodeType!==1)n=n.parentNode;return !!(n&&n.closest&&n.closest("pre,.demo-code"))}
  doc.addEventListener("contextmenu",function(e){if(!inCode(e.target))e.preventDefault()});
  doc.addEventListener("copy",function(e){var sel=window.getSelection();if(sel&&sel.rangeCount&&!inCode(sel.anchorNode))e.preventDefault()});
  doc.addEventListener("dragstart",function(e){e.preventDefault()});
  doc.addEventListener("keydown",function(e){if((e.ctrlKey||e.metaKey)&&/^[spu]$/i.test(e.key))e.preventDefault()});
  fetch("/api/me",{credentials:"same-origin"}).then(function(r){return r.ok?r.json():null}).then(function(d){
    if(!d||!d.name)return;
    var c=doc.createElement("canvas");c.width=420;c.height=260;var x=c.getContext("2d");
    x.translate(210,130);x.rotate(-Math.PI/9);x.textAlign="center";x.font="600 15px Vazirmatn,Tahoma,sans-serif";
    x.fillStyle="rgba(128,128,128,.16)";x.fillText(d.name+" · Rayvo",0,-8);x.font="12px Vazirmatn,Tahoma,sans-serif";x.fillText(d.id||"",0,16);
    var w=el("div","rv-wm");w.style.backgroundImage="url("+c.toDataURL()+")";body.appendChild(w);
  }).catch(function(){});
}


/* ---- رنگ‌آمیزی کد، اجرای زنده و دکمه‌ی «اجرا» (مخصوص دوره‌ی جاوااسکریپت) ---- */
function hl(c){return c.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/(\/\/.*$)|(`[^`]*`|'[^'\n]*'|"[^"\n]*")|\b(const|let|var|function|return|if|else|for|while|do|of|in|new|class|extends|super|static|async|await|try|catch|finally|throw|switch|case|break|continue|default|true|false|null|undefined|typeof|instanceof|this)\b|\b(\d+\.?\d*)\b|\b([a-zA-Z_$][\w$]*)(?=\()/gm,function(m,a,b,k,n,f){return a?'<span class="tk c">'+m+'</span>':b?'<span class="tk s">'+m+'</span>':k?'<span class="tk k">'+m+'</span>':n?'<span class="tk n">'+m+'</span>':'<span class="tk f">'+m+'</span>'})}
function runners(){
  doc.querySelectorAll(".demo[data-run],.demo[data-live]").forEach(function(box){
    var code=box.querySelector("pre code");if(!code||box.querySelector(".rv-run"))return;
    var src=code.textContent,live=box.hasAttribute("data-live"),dc=box.querySelector(".demo-code");
    var b=el("button","rv-run",live?"اجرای زنده ▶":"اجرا ▶");b.type="button";
    var area=el("div",live?"rv-live-wrap":"rv-out");area.hidden=true;dc.appendChild(area);
    b.addEventListener("click",function(){
      area.hidden=false;
      if(live){
        var fr=area.querySelector("iframe");if(!fr){fr=doc.createElement("iframe");fr.className="rv-live";fr.title="پیش‌نمایش زنده";fr.setAttribute("sandbox","allow-scripts");area.appendChild(fr)}
        if(box.dataset.h)fr.style.height=box.dataset.h+"px";
        var base=box.hasAttribute("data-bare")?"":'<style>body{font:16px Tahoma,sans-serif;padding:14px;color:#111;line-height:1.8}button,input,textarea{font:inherit;padding:6px 12px;margin:2px}</style>';
        fr.srcdoc='<!doctype html><html dir="rtl" lang="fa"><meta charset="utf-8">'+base+src;
        return;
      }
      var L=[];function show(){area.textContent=L.join("\n")||"(خروجی ندارد)"}
      function fmt(a){return a.map(function(x){if(x&&typeof x==="object"){try{return JSON.stringify(x)}catch(e){return String(x)}}return String(x)}).join(" ")}
      var fake={log:function(){L.push(fmt([].slice.call(arguments)));show()},error:function(){L.push("خطا: "+fmt([].slice.call(arguments)));show()},warn:function(){L.push(fmt([].slice.call(arguments)));show()}};
      show();
      try{Promise.resolve(new Function("console","return (async()=>{"+src+"\n})()")(fake)).catch(function(e){L.push("خطا: "+e.message);show()})}catch(e){L.push("خطا: "+e.message);show()}
    });
    var lab=box.querySelector(".demo-label");(lab||dc).appendChild(b);
  });
}
function colorize(){
  doc.querySelectorAll(".demo-code pre code").forEach(function(c){
    var tag=c.closest(".demo-code").querySelector(".demo-tag");var t=tag?tag.textContent:"";
    if(t==="js"||t==="html"&&c.closest(".demo[data-live]")){c.innerHTML=hl(c.textContent)}
  });
}


/* ---- تبلیغ دوره‌ی Laravel (مسیر فول‌استک): پایان دوره، فهرست و فوتر درس‌ها ---- */
var LV_URL="https://rayvo-laravel.netlify.app",HC_URL="https://rayvo-html-css.vercel.app/";
function lvPromoHTML(){
  return '<div class="lv-promo-top"><b>قدم بعدی تو</b><span>جاوااسکریپت را تمام کردی؛ حالا سمت سرور را هم یاد بگیر</span><span class="tag">مسیر فول‌استک</span></div>'+
  '<div class="lv-promo-body"><div>'+
   '<h3>از فرانت‌اند به <em>فول‌استک</em> با لاراول</h3>'+
   '<p>تا اینجا صفحه‌ها را زنده کردی و با API کار کردی. با دوره‌ی <b>Laravel از 0 تا 1000</b> خودت همان API را می‌نویسی: دیتابیس، ورود و ثبت‌نام، پنل مدیریت و انتشار روی سرور. یعنی یک وب‌سایت کامل، از دکمه‌ی صفحه تا ذخیره در دیتابیس.</p>'+
   '<ul><li>۴۵ درس و ۴ پروژه‌ی کامل با سورس</li><li>PHP، SQL، Composer و Git از صفر</li><li>API، Sanctum، صف، تست‌نویسی و انتشار روی VPS</li><li>۳ ماه پشتیبانی مستقیم مدرس در تلگرام</li></ul>'+
   '<div class="acts"><a class="lv-btn" href="'+LV_URL+'" target="_blank" rel="noopener">دیدن دوره‌ی Laravel ←</a><a class="lv-btn ghost" href="'+LV_URL+'/#free" target="_blank" rel="noopener">درس‌های رایگان لاراول</a></div>'+
  '</div><div>'+
   '<div class="lv-code" aria-hidden="true"><span class="c">// جاوااسکریپت (این دوره)</span>\n<span class="k">const</span> res = <span class="k">await</span> <span class="f">fetch</span>(<span class="s">"/api/products"</span>);\n<span class="k">const</span> items = <span class="k">await</span> res.<span class="f">json</span>();\n\n<span class="c">// لاراول (دوره‌ی بعدی)</span>\nRoute::<span class="f">get</span>(<span class="s">"/api/products"</span>, <span class="k">fn</span>() =&gt;\n    Product::<span class="f">all</span>()\n);</div>'+
   '<div class="lv-pre" style="margin-top:12px"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/></svg><span><b>پیش‌نیاز: HTML و CSS.</b> اگر هنوز بلد نیستی، اول دوره‌ی رایگان <a href="'+HC_URL+'" target="_blank" rel="noopener">HTML و CSS رایو</a> را ببین و بعد به لاراول برسی.</span></div>'+
  '</div></div>';
}
function laravelPromo(){
  var done=function(n){return n};
  var last=FLAT.length?FLAT[FLAT.length-1]:null;
  var isLast=CUR&&last&&CUR===last;
  var idx=doc.getElementById("rv-index");
  if(idx&&!doc.querySelector(".lv-promo")){var b=el("section","lv-promo",lvPromoHTML());b.id="laravel";idx.insertAdjacentElement("afterend",b)}
  else if(isLast){
    var nav=doc.querySelector(".lesson-nav");
    if(nav&&!doc.querySelector(".lv-promo")){var b2=el("section","lv-promo",lvPromoHTML());nav.parentNode.insertBefore(b2,nav)}
  }
}

function init(){colorize();build();runners();heroMeta();dynamicNav();copyButtons();doneButton();renderIndex();laravelPromo();footer();protect();guestMode()}
if(doc.readyState==="loading")doc.addEventListener("DOMContentLoaded",init);else init();
})();
