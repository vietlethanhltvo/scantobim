(function(){
  var CFG = window.SITE_CONFIG || {};
  var PRODUCTS = {mep:'Scan for MEP', structural:'Scan for Structural'};
  var PLANS = {trial:'Dùng thử 7 ngày', pro:'Gói Pro', ultra:'Gói Ultra', quote:'Báo giá công ty'};
  var TITLES = {
    trial:['Dùng thử 7 ngày','Dùng thử 7 ngày','Dùng đầy đủ Scan to MEP và Scan to MEP (Multi) cùng toàn bộ tool Free. Không cần thanh toán.'],
    pro:['Gói Pro','Đăng ký gói Pro','Điền thông tin, chúng tôi sẽ liên hệ hướng dẫn thanh toán và cấp quyền sử dụng.'],
    ultra:['Gói Ultra','Đăng ký gói Ultra','Điền thông tin, chúng tôi sẽ liên hệ hướng dẫn thanh toán và cấp quyền sử dụng.'],
    quote:['Gói công ty','Nhận báo giá công ty','Cho chúng tôi biết số lượng seat để nhận báo giá phù hợp cho cả nhóm.']
  };
  var $ = function(id){return document.getElementById(id);};
  var form=$('reg-form'), selProduct=$('f-product'), selPlan=$('f-plan');
  if(!form) return;

  var q = new URLSearchParams(location.search);
  var initProduct = PRODUCTS[q.get('product')] ? q.get('product') : 'mep';
  var initPlan = PLANS[q.get('plan')] ? q.get('plan') : 'pro';

  function fillPlans(keep){
    var list = selProduct.value==='mep' ? ['trial','pro','ultra','quote'] : ['pro','ultra','quote'];
    selPlan.innerHTML='';
    list.forEach(function(k){var o=document.createElement('option');o.value=k;o.textContent=PLANS[k];selPlan.appendChild(o);});
    selPlan.value = list.indexOf(keep)>=0 ? keep : list[0];
  }
  function refresh(){
    var p = selPlan.value, prod = selProduct.value, t = TITLES[p];
    $('reg-eyebrow').textContent = t[0] + ' · ' + PRODUCTS[prod];
    $('reg-title').textContent = t[1];
    $('reg-desc').textContent = t[2];
    $('reg-note').classList.toggle('hidden', prod!=='structural');
    var showSeats = p==='quote' || p==='pro' || p==='ultra';
    $('seats-wrap').classList.toggle('hidden', !showSeats);
    $('seats-req').classList.toggle('hidden', p!=='quote');
    $('f-seats').required = (p==='quote');
    $('quote-hint').classList.toggle('hidden', p!=='quote');
    document.title = t[1] + ' - ScanToBIM Tools';
  }
  selProduct.value = initProduct;
  fillPlans(initPlan);
  refresh();
  selProduct.addEventListener('change', function(){fillPlans(selPlan.value);refresh();});
  selPlan.addEventListener('change', refresh);

  function showError(msg, fallbackHref){
    var box=$('reg-error'); box.innerHTML='';
    box.appendChild(document.createTextNode(msg));
    if(fallbackHref){
      var a=document.createElement('a'); a.href=fallbackHref; a.className='font-semibold underline ml-1';
      a.textContent='Gửi bằng ứng dụng email'; box.appendChild(a); box.appendChild(document.createTextNode('.'));
    }
    box.classList.remove('hidden');
  }
  function data(){
    var d={}; ['name','email','phone','company','revit','seats','message'].forEach(function(k){d[k]=(form.elements[k].value||'').trim();});
    d.product=PRODUCTS[selProduct.value]; d.plan=PLANS[selPlan.value];
    return d;
  }
  function mailtoFallback(d){
    var body=['Sản phẩm: '+d.product,'Nội dung: '+d.plan,'Họ tên: '+d.name,'Email: '+d.email,'SĐT / Zalo: '+d.phone,
      'Công ty: '+d.company,'Revit: '+d.revit,'Số seat: '+d.seats,'Ghi chú: '+d.message].join('\n');
    return 'mailto:'+encodeURIComponent(CFG.FORM_EMAIL||'')+'?subject='+encodeURIComponent(d.plan+' - '+d.product)+'&body='+encodeURIComponent(body);
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    $('reg-error').classList.add('hidden');
    if(form.elements._honey.value) return;               // bot
    if(!form.checkValidity()){form.reportValidity();return;}
    var d=data();
    if(!CFG.FORM_EMAIL){showError('Chưa cấu hình email nhận đăng ký (assets/config.js).');return;}
    var btn=$('reg-submit'), lbl=$('reg-submit-label');
    btn.disabled=true; lbl.innerHTML='<i class="fa-solid fa-spinner fa-spin mr-2"></i>Đang gửi...';
    var payload={
      _subject:'[ScanToBIM] '+d.plan+' - '+d.product+' - '+d.name,
      _template:'table', _captcha:'false',
      'Sản phẩm':d.product, 'Nội dung đăng ký':d.plan, 'Họ tên':d.name, email:d.email, 'SĐT / Zalo':d.phone||'-',
      'Công ty':d.company||'-', 'Phiên bản Revit':d.revit||'-', 'Số seat':d.seats||'-', 'Ghi chú':d.message||'-'
    };
    fetch('https://formsubmit.co/ajax/'+encodeURIComponent(CFG.FORM_EMAIL),{
      method:'POST', headers:{'Content-Type':'application/json','Accept':'application/json'}, body:JSON.stringify(payload)
    }).then(function(r){return r.json().catch(function(){return {};}).then(function(j){return {ok:r.ok,j:j};});})
    .then(function(res){
      if(!res.ok || String(res.j.success)==='false') throw new Error('send');
      $('ok-name').textContent=d.name; $('ok-plan').textContent=d.plan+' · '+d.product;
      form.classList.add('hidden'); $('reg-note').classList.add('hidden');
      $('reg-success').classList.remove('hidden'); window.scrollTo({top:0,behavior:'smooth'});
    }).catch(function(){
      btn.disabled=false; lbl.textContent='Gửi đăng ký →';
      showError('Chưa gửi được đăng ký. Vui lòng thử lại, hoặc', mailtoFallback(d));
    });
  });
})();
