(function(){
  // Mobile menu
  var btn=document.getElementById('mobile-menu-btn'),menu=document.getElementById('mobile-menu');
  if(btn&&menu){
    var set=function(open){menu.classList.toggle('hidden',!open);btn.setAttribute('aria-expanded',String(open));
      btn.querySelector('i').className=open?'fa-solid fa-xmark text-lg':'fa-solid fa-bars text-lg';};
    btn.addEventListener('click',function(){set(menu.classList.contains('hidden'));});
    menu.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){set(false);});});
  }
  // Active nav link
  var page=location.pathname.split('/').pop()||'index.html';
  document.querySelectorAll('.nav-link').forEach(function(a){
    if(a.getAttribute('href')===page)a.setAttribute('aria-current','page');
  });
  // Free download button (URL lấy từ assets/config.js)
  var dl=document.getElementById('free-download-btn');
  if(dl){
    var cfg=window.SITE_CONFIG||{};
    dl.textContent='Nhận bản Free →';
    dl.href=cfg.FREE_DOWNLOAD_URL||'#';
    dl.target='_blank';dl.rel='noopener noreferrer';
  }
})();

/* ===== Motion layer ===== */
(function(){
  var root=document.documentElement,reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.classList.add('js');
  // scroll progress + header state
  var bar=document.createElement('div');bar.id='scroll-bar';document.body.appendChild(bar);
  var hdr=document.querySelector('header.sticky');
  function onScroll(){
    var h=document.documentElement,max=h.scrollHeight-h.clientHeight;
    bar.style.transform='scaleX('+(max>0?h.scrollTop/max:0)+')';
    if(hdr)hdr.classList.toggle('scrolled',h.scrollTop>8);
  }
  addEventListener('scroll',onScroll,{passive:true});onScroll();
  // reveal with stagger
  var groups=['section .grid','main .space-y-4','section ol','section ul.max-w-xl','#faq .space-y-3'];
  var seen=new Set();
  document.querySelectorAll(groups.join(',')).forEach(function(g){
    Array.prototype.forEach.call(g.children,function(c,i){c.classList.add('reveal');c.style.setProperty('--d',(i*90)+'ms');seen.add(c);});
  });
  document.querySelectorAll('section h2, section > div > .text-center, main h1, main h2, #pointcloud-comparison .comparison-slider, main > .bg-white').forEach(function(e){
    if(!seen.has(e)&&!e.closest('.reveal')){e.classList.add('reveal');}
  });
  var io=new IntersectionObserver(function(es){es.forEach(function(e){
    if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}
  });},{threshold:.12,rootMargin:'0px 0px -6% 0px'});
  document.querySelectorAll('.reveal').forEach(function(e){io.observe(e);});
  // spotlight cards
  document.querySelectorAll('.rounded-2xl.border, .rounded-xl.border').forEach(function(c){
    if(c.querySelector('video,img'))return;
    c.classList.add('spot');
    c.addEventListener('mousemove',function(ev){var r=c.getBoundingClientRect();
      c.style.setProperty('--mx',(ev.clientX-r.left)+'px');c.style.setProperty('--my',(ev.clientY-r.top)+'px');});
  });
  // buttons
  document.querySelectorAll('a.bg-blue-600,a.bg-cyan-600,a.bg-indigo-600').forEach(function(b){b.classList.add('btn-shine');});
  // counters
  document.querySelectorAll('[data-count]').forEach(function(el){
    var to=+el.dataset.count,suf=el.dataset.suffix||'';
    var co=new IntersectionObserver(function(es){if(!es[0].isIntersecting)return;co.disconnect();
      if(reduce){el.textContent=to+suf;return;}
      var t0=null;(function f(t){t0=t0||t;var p=Math.min((t-t0)/1400,1),e=1-Math.pow(1-p,3);
        el.textContent=Math.round(to*e)+suf;if(p<1)requestAnimationFrame(f);})(performance.now());
    },{threshold:.6});co.observe(el);
  });
})();

/* ===== Media presentation ===== */
(function(){
  function bar(title){var b=document.createElement('div');b.className='win-bar';b.innerHTML='<span></span><span></span><span></span><b>'+title+'</b>';return b;}
  function wrap(el,title){var w=document.createElement('div');w.className='win';el.parentNode.insertBefore(w,el);w.appendChild(bar(title));w.appendChild(el);return w;}
  function strip(el){el.classList.remove('rounded-2xl','rounded-xl','border','border-slate-200','shadow-xl','shadow-sm');}
  // hero carousel -> window + live caption + lightbox
  var hc=document.getElementById('hero-carousel');
  if(hc){
    var box=hc.parentElement;strip(box);
    var w=wrap(box,'Revit — ScanToBIM Tools');
    var cap=document.createElement('div');cap.className='win-cap';w.appendChild(cap);
    var slides=hc.querySelectorAll('.hero-slide');
    var upd=function(){slides.forEach(function(s,i){if(s.classList.contains('opacity-100'))
      cap.innerHTML='<span class="n">0'+(i+1)+' / 0'+slides.length+'</span><span>'+s.alt+'</span>';});};
    var mo=new MutationObserver(upd);slides.forEach(function(s){mo.observe(s,{attributes:true,attributeFilter:['class']});});upd();
    if(slides[0])slides[0].setAttribute('fetchpriority','high');
    var lb=document.createElement('div');lb.id='lb';
    lb.innerHTML='<button class="lb-close" aria-label="Đóng">&times;</button>'+
      '<button class="lb-prev" aria-label="Ảnh trước"><i class="fa-solid fa-chevron-left"></i></button>'+
      '<button class="lb-next" aria-label="Ảnh sau"><i class="fa-solid fa-chevron-right"></i></button>'+
      '<img alt="">';
    document.body.appendChild(lb);
    var lbImg=lb.querySelector('img');
    var lbIndex=0;
    var close=function(){lb.classList.remove('open');};
    var openLb=function(index){
      lbIndex=(index+slides.length)%slides.length;
      var s=slides[lbIndex];
      lbImg.src=s.src;lbImg.alt=s.alt;
      lb.classList.add('open');
    };
    hc.addEventListener('click',function(){
      slides.forEach(function(s,i){if(s.classList.contains('opacity-100'))openLb(i);});
    });
    lb.querySelector('.lb-close').addEventListener('click',function(e){e.stopPropagation();close();});
    lb.querySelector('.lb-prev').addEventListener('click',function(e){e.stopPropagation();openLb(lbIndex-1);});
    lb.querySelector('.lb-next').addEventListener('click',function(e){e.stopPropagation();openLb(lbIndex+1);});
    lb.addEventListener('click',function(e){if(e.target===lb)close();});
    addEventListener('keydown',function(e){
      if(!lb.classList.contains('open'))return;
      if(e.key==='Escape')close();
      else if(e.key==='ArrowLeft')openLb(lbIndex-1);
      else if(e.key==='ArrowRight')openLb(lbIndex+1);
    });
  }
  // comparison slider -> window
  var cs=document.getElementById('comparison-slider');
  if(cs){var cw=wrap(cs,'Point Cloud ↔ BIM Model');
    var cc=document.createElement('div');cc.className='win-cap';cc.innerHTML='<span class="n">SO SÁNH</span><span>Cùng một góc nhìn: dữ liệu quét laser và mô hình Revit sau khi dựng.</span>';cw.appendChild(cc);
    var helper=cw.nextElementSibling;if(helper&&helper.classList.contains('mt-4'))helper.remove();
    cs.querySelectorAll('img').forEach(function(i){i.loading='lazy';i.decoding='async';});
  }
  // product-page video: title bar on its container
  document.querySelectorAll('main > div > video').forEach(function(v){
    var p=v.parentElement;strip(p);p.classList.add('win');p.insertBefore(bar('Video — '+document.title.split(' - ')[0]),p.firstChild);
  });
  // custom video overlay
  var n=0;
  document.querySelectorAll('video').forEach(function(v){
    n++;var w=document.createElement('div');w.className='vwrap';v.parentNode.insertBefore(w,v);w.appendChild(v);
    v.removeAttribute('controls');v.preload='metadata';
    var t=document.createElement('span');t.className='vtag';t.textContent='VIDEO '+(v.closest('#demo-videos')?String(n).padStart(2,'0'):'');w.appendChild(t);
    var b=document.createElement('button');b.className='vplay';b.setAttribute('aria-label','Phát video');b.innerHTML='<i class="fa-solid fa-play"></i>';w.appendChild(b);
    b.addEventListener('click',function(){v.controls=true;v.play();});
    v.addEventListener('play',function(){b.classList.add('hide');t.style.opacity=0;});
    v.addEventListener('ended',function(){v.controls=false;b.classList.remove('hide');t.style.opacity=1;});
  });
})();
