/* Ridge Line Supply Co. store. Products come from products.json. Details come from site-config.js. */
(function(){
'use strict';
function $(id){return document.getElementById(id);}
var SITE=window.SITE||{};
var INK='#1D2327',STORE='ridgeline-bag-v1';
var PRODUCTS=[],byId={};

function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function money(c){return '$'+(c/100).toFixed(2);}
function lum(h){
  var n=parseInt(h.slice(1),16),c=[(n>>16)&255,(n>>8)&255,n&255].map(function(v){v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4);});
  return 0.2126*c[0]+0.7152*c[1]+0.0722*c[2];
}
function shade(h,t){
  var n=parseInt(h.slice(1),16),c=[(n>>16)&255,(n>>8)&255,n&255].map(function(v){return Math.round(v*(1-t));});
  return '#'+c.map(function(v){return ('0'+v.toString(16)).slice(-2);}).join('');
}

/* garment drawings, 200 x 220 */
var uid=0;
function steps(n,fn){var s='';for(var i=0;i<=n;i++)s+=fn(i/n);return s;}
function waistRibs(){return steps(20,function(t){var x=(50+100*t).toFixed(1);return 'M'+x+' 199 L'+x+' 210 ';});}
function cuffRibs(side,w){
  return steps(6,function(t){
    var x=2+w*t,y=172+w*0.26*t,x2=x+2.8,y2=y-13.6;
    if(side==='r'){x=200-x;x2=200-x2;}
    return 'M'+x.toFixed(1)+' '+y.toFixed(1)+' L'+x2.toFixed(1)+' '+y2.toFixed(1)+' ';
  });
}
var NECK_IN='M72 22 Q100 12 128 22 Q100 50 72 22 Z';
function collar(h,e){
  return '<path d="M74 23 Q100 49 126 23" fill="none" stroke="'+e+'" stroke-width="8"/>'+
    '<path d="M74 23 Q100 49 126 23" fill="none" stroke="'+shade(h,0.12)+'" stroke-width="6"/>'+
    '<path d="M76 27 Q100 53 124 27" fill="none" stroke="'+e+'" stroke-width="1" stroke-dasharray="2.5 2"/>';
}
var GARMENT={
  tee:function(h,e){
    return {
      shapes:[{d:'M72 22 L24 38 Q12 42 8 54 L2 94 L38 108 L50 86 L46 206 Q46 211 52 211 L148 211 Q154 211 154 206 L150 86 L162 108 L198 94 L192 54 Q188 42 176 38 L128 22 Q100 50 72 22 Z'}],
      folds:['M68 76 Q76 112 70 160','M134 84 Q126 126 134 172','M56 92 Q70 104 84 98','M144 92 Q130 104 116 98','M14 58 Q22 74 28 92','M186 58 Q178 74 172 92','M60 196 Q100 204 140 196'],
      highs:['M96 60 Q104 120 98 190','M16 54 L8 86','M184 54 L192 86'],
      inside:'<path d="'+NECK_IN+'" fill="'+shade(h,0.42)+'"/>',
      seams:['M50 201 L150 201','M5 88 L38 101','M195 88 L162 101','M72 25 L26 41','M128 25 L174 41','M50 88 Q40 62 26 40','M150 88 Q160 62 174 40'],
      over:collar(h,e)
    };
  },
  long:function(h,e){
    return {
      shapes:[{d:'M72 22 L26 38 Q16 42 14 52 L2 170 Q1 176 8 178 L22 182 Q28 183 30 177 L48 100 L46 206 Q46 211 52 211 L148 211 Q154 211 154 206 L152 100 L170 177 Q172 183 178 182 L192 178 Q199 176 198 170 L186 52 Q184 42 174 38 L128 22 Q100 50 72 22 Z'}],
      folds:['M16 76 Q14 120 8 160','M38 118 Q32 150 26 168','M184 76 Q186 120 192 160','M162 118 Q168 150 174 168','M68 90 Q76 130 70 170','M132 96 Q126 136 132 176','M60 100 Q78 112 92 106','M12 114 Q22 120 36 114','M188 114 Q178 120 164 114','M60 198 Q100 206 140 198'],
      highs:['M98 60 Q106 120 98 190','M12 60 L6 150','M188 60 L194 150'],
      inside:'<path d="'+NECK_IN+'" fill="'+shade(h,0.42)+'"/>',
      seams:['M50 201 L150 201','M72 25 L28 40','M128 25 L172 40','M26 41 Q38 70 48 100','M174 41 Q162 70 152 100','M5 159 L31 166','M195 159 L169 166'],
      over:collar(h,e)
    };
  },
  hoodie:function(h,e,ink){
    var inner=shade(h,0.55);
    return {
      shapes:[
        {d:'M58 40 L26 46 Q14 50 12 62 L2 170 Q1 177 8 179 L24 184 Q31 185 33 178 L50 104 L46 205 Q46 211 52 211 L148 211 Q154 211 154 205 L150 104 L167 178 Q169 185 176 184 L192 179 Q199 177 198 170 L188 62 Q186 50 174 46 L142 40 Q100 76 58 40 Z'},
        {d:'M54 42 C42 -2 158 -2 146 42 Q100 82 54 42 Z'}
      ],
      folds:['M20 80 Q16 130 10 170','M40 120 Q34 156 30 176','M180 80 Q184 130 190 170','M160 120 Q166 156 170 176','M64 106 Q74 150 66 192','M136 106 Q126 150 134 192','M58 96 Q80 112 98 104','M142 96 Q120 112 102 104','M62 152 Q100 162 138 152','M58 34 Q50 16 62 6','M142 34 Q150 16 138 6'],
      highs:['M100 112 Q106 160 100 196','M14 70 L6 160','M186 70 L194 160','M72 14 Q100 2 128 14'],
      inside:'<path d="M68 40 Q100 72 132 40 Q130 12 100 12 Q70 12 68 40 Z" fill="'+inner+'"/>'+
        '<path d="M62 150 L56 176 M138 150 L144 176" fill="none" stroke="rgba(0,0,0,.35)" stroke-width="3" stroke-linecap="round"/>'+
        '<path d="'+waistRibs()+cuffRibs('l',31)+cuffRibs('r',31)+'" fill="none" stroke="'+e+'" stroke-width=".9" stroke-opacity=".55"/>',
      seams:['M62 150 L138 150 L148 192 L52 192 Z','M50 197 L150 197','M58 42 L28 48','M142 42 L172 48','M28 48 Q40 82 50 104','M172 48 Q160 82 150 104','M6 166 L33 173','M194 166 L167 173'],
      over:'<path d="M68 40 Q100 72 132 40 Q130 12 100 12 Q70 12 68 40 Z" fill="none" stroke="'+e+'" stroke-width="1.6"/>'+
        '<path d="M82 58 Q79 80 81 102 M118 58 Q121 80 119 102" fill="none" stroke="'+ink+'" stroke-opacity=".7" stroke-width="2.4" stroke-linecap="round"/>'+
        '<rect x="79.6" y="100" width="3.4" height="8" rx="1.2" fill="'+ink+'" fill-opacity=".85"/><rect x="117" y="100" width="3.4" height="8" rx="1.2" fill="'+ink+'" fill-opacity=".85"/>'+
        '<circle cx="84" cy="54" r="2" fill="'+inner+'" stroke="'+e+'" stroke-width=".8"/><circle cx="116" cy="54" r="2" fill="'+inner+'" stroke="'+e+'" stroke-width=".8"/>'
    };
  },
  cap:function(h,e){
    return {
      shapes:[
        {d:'M36 142 C32 84 60 50 100 50 C140 50 168 84 164 142 Z'},
        {d:'M30 142 C64 133 136 133 170 142 C186 148 190 160 178 165 C146 173 54 173 22 165 C10 160 14 148 30 142 Z'}
      ],
      folds:['M60 88 Q64 110 62 132','M140 88 Q136 110 138 132'],
      highs:['M84 56 Q70 80 72 112','M72 150 Q100 158 128 150'],
      inside:'<path d="M30 142 C62 124 138 124 170 142 L170 154 L30 154 Z" fill="rgba(0,0,0,.28)" filter="url(#b'+'CAPN'+')"/>',
      seams:['M100 52 L100 140','M100 52 C82 68 74 102 76 138','M100 52 C118 68 126 102 124 138','M24 160 C62 168 138 168 176 160'],
      over:'<path d="M38 140 C70 130 130 130 162 140" fill="none" stroke="'+e+'" stroke-width="1.2"/>'+
        '<circle cx="100" cy="50" r="4.6" fill="'+h+'" stroke="'+e+'" stroke-width="1.2"/>'+
        '<circle cx="80" cy="66" r="1.5" fill="'+shade(h,0.4)+'"/><circle cx="120" cy="66" r="1.5" fill="'+shade(h,0.4)+'"/>'
    };
  }
};
function printFor(p,ink,cap){
  function m(x,y,w,h){return '<use href="#rl-mark-cc" x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" style="color:'+ink+';--cap:'+cap+'"/>';}
  function t(y,size,txt,len,ls,adj){return '<text class="pt" x="100" y="'+y+'" font-size="'+size+'" fill="'+ink+'" letter-spacing="'+(ls||0)+'" textLength="'+len+'" lengthAdjust="'+(adj||'spacingAndGlyphs')+'">'+txt+'</text>';}
  function r(y){return '<rect x="58.5" y="'+y+'" width="83" height="2.6" fill="'+cap+'"/>';}
  if(p.print==='mark'){
    if(p.kind==='cap')return m(82,72,36,31);
    if(p.kind==='hoodie')return m(84,94,32,28)+t(139,13.5,'Ridge Line',64,1.1);
    return m(78,56,44,38)+t(112,15,'Ridge Line',71,1.2);
  }
  if(p.print==='quote')return t(86,12.4,'Weather tests',83,0.7)+t(106,16.6,'Every roof.',83,0.5)+r(113);
  if(p.print==='climb')return t(96,18.4,'Climb high',83,0.9)+r(103)+t(116,6.4,'Ridge Line Supply Co.',83,1.4,'spacing');
  return '';
}
function art(p,hex,label,decor){
  var n=++uid,dk=lum(hex)<0.3,ink=dk?'#F1F3F3':INK,edge=dk?'rgba(255,255,255,.34)':'rgba(0,0,0,.36)';
  var cap=hex.toUpperCase()==='#F26B1D'?ink:'#EE5A12';
  var g=GARMENT[p.kind](hex,edge,ink,dk);
  var fold=dk?'rgba(0,0,0,.26)':'rgba(0,0,0,.085)',hi=dk?'rgba(255,255,255,.07)':'rgba(255,255,255,.26)';
  var clip='',fills='',shading='';
  g.shapes.forEach(function(s){
    clip+='<path d="'+s.d+'"/>';
    fills+='<path d="'+s.d+'" fill="'+(s.fill||hex)+'" stroke="'+edge+'" stroke-width="1.4" stroke-linejoin="round"/>';
    shading+='<path d="'+s.d+'" fill="url(#x'+n+')"/><path d="'+s.d+'" fill="url(#y'+n+')"/>';
  });
  var inside=(g.inside||'').replace('CAPN',n);
  var aria=decor?'aria-hidden="true"':'role="img" aria-label="'+esc(p.name+', '+label)+'"';
  return '<svg viewBox="0 0 200 220" '+aria+'><defs>'+
    '<clipPath id="c'+n+'">'+clip+'</clipPath>'+
    '<linearGradient id="x'+n+'" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity="'+(dk?.45:.26)+'"/><stop offset=".22" stop-color="#000" stop-opacity="0"/><stop offset=".76" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="'+(dk?.5:.3)+'"/></linearGradient>'+
    '<linearGradient id="y'+n+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="'+(dk?.10:.24)+'"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="'+(dk?.26:.13)+'"/></linearGradient>'+
    '<filter id="s'+n+'" filterUnits="userSpaceOnUse" x="-10" y="-10" width="220" height="245"><feDropShadow dx="0" dy="4" stdDeviation="4.5" flood-color="#000" flood-opacity=".3"/></filter>'+
    '<filter id="b'+n+'" filterUnits="userSpaceOnUse" x="-10" y="-10" width="220" height="245"><feGaussianBlur stdDeviation="3"/></filter>'+
    '</defs>'+
    '<g filter="url(#s'+n+')">'+fills+'</g>'+
    '<g clip-path="url(#c'+n+')">'+printFor(p,ink,cap)+shading+
    '<g filter="url(#b'+n+')" fill="none" stroke-linecap="round"><path d="'+g.folds.join(' ')+'" stroke="'+fold+'" stroke-width="5"/><path d="'+g.highs.join(' ')+'" stroke="'+hi+'" stroke-width="12"/></g>'+
    inside+
    '<path d="'+g.seams.join(' ')+'" fill="none" stroke="'+edge+'" stroke-width=".9" stroke-opacity=".7" stroke-dasharray="3 2.6"/></g>'+
    (g.over||'')+'</svg>';
}

/* shop grid */
var sel={};
function card(p){
  var sw=p.colors.map(function(c,i){
    return '<button type="button" class="sw" data-pid="'+esc(p.id)+'" data-ci="'+i+'" aria-pressed="'+(i===0)+'" aria-label="'+esc(p.name+' color: '+c[0])+'" title="'+esc(c[0])+'" style="background:'+esc(c[1])+'"></button>';
  }).join('');
  var opts=p.sizes.map(function(s){return '<option>'+esc(s)+'</option>';}).join('');
  return '<article class="card" data-pid="'+esc(p.id)+'" data-cat="'+esc(p.cat)+'">'+
    '<div class="art" id="art-'+esc(p.id)+'">'+art(p,p.colors[0][1],p.colors[0][0])+'</div>'+
    '<div class="meta"><div class="row"><h3>'+esc(p.name)+'</h3><span class="price">'+money(p.price)+'</span></div>'+
    '<p class="desc">'+esc(p.desc)+'</p>'+
    '<div class="colors"><div class="sws" role="group" aria-label="Color for '+esc(p.name)+'">'+sw+'</div><span class="cname" id="cn-'+esc(p.id)+'">'+esc(p.colors[0][0])+'</span></div>'+
    '<div class="buy"><label class="vh" for="sz-'+esc(p.id)+'">Size for '+esc(p.name)+'</label><select id="sz-'+esc(p.id)+'">'+opts+'</select>'+
    '<button type="button" class="btn" data-add="'+esc(p.id)+'">Add to bag</button></div></div></article>';
}
function renderChips(){
  var cats=['All'];
  PRODUCTS.forEach(function(p){if(cats.indexOf(p.cat)<0)cats.push(p.cat);});
  $('chips').innerHTML=cats.map(function(c,i){
    return '<button class="chip" type="button" data-cat="'+esc(c)+'" aria-pressed="'+(i===0)+'">'+esc(c)+'</button>';
  }).join('');
}
$('grid').addEventListener('click',function(e){
  var sw=e.target.closest('.sw'),add=e.target.closest('[data-add]');
  if(sw){
    var pid=sw.getAttribute('data-pid'),ci=+sw.getAttribute('data-ci'),p=byId[pid];
    sel[pid]=ci;
    $('art-'+pid).innerHTML=art(p,p.colors[ci][1],p.colors[ci][0]);
    $('cn-'+pid).textContent=p.colors[ci][0];
    Array.prototype.forEach.call(sw.parentNode.children,function(b){b.setAttribute('aria-pressed',String(b===sw));});
  } else if(add){addToBag(add.getAttribute('data-add'),add);}
});
$('chips').addEventListener('click',function(e){
  var b=e.target.closest('.chip');if(!b)return;
  var cat=b.getAttribute('data-cat');
  Array.prototype.forEach.call($('chips').children,function(c){c.setAttribute('aria-pressed',String(c===b));});
  Array.prototype.forEach.call($('grid').children,function(c){c.hidden=!(cat==='All'||c.getAttribute('data-cat')===cat);});
});

/* bag */
var bag=[];
function loadBag(){
  bag=[];
  try{
    var raw=JSON.parse(localStorage.getItem(STORE)||'[]');
    if(Array.isArray(raw))raw.forEach(function(it){
      var p=byId[it&&it.pid];
      if(p&&p.colors[it.ci]&&p.sizes.indexOf(it.size)>=0&&it.qty>0)bag.push({key:it.pid+'|'+it.ci+'|'+it.size,pid:it.pid,ci:it.ci,size:it.size,qty:Math.min(99,Math.floor(it.qty))});
    });
  }catch(x){}
}
function persist(){try{localStorage.setItem(STORE,JSON.stringify(bag));}catch(x){}}
function addToBag(pid,btn){
  var ci=sel[pid]||0,size=$('sz-'+pid).value,key=pid+'|'+ci+'|'+size;
  var f=bag.filter(function(i){return i.key===key;})[0];
  if(f)f.qty=Math.min(99,f.qty+1);else bag.push({key:key,pid:pid,ci:ci,size:size,qty:1});
  persist();renderBag();
  var p=byId[pid];
  $('live').textContent='Added '+p.name+', '+p.colors[ci][0]+', '+size+' to your bag.';
  if(btn){var old=btn.textContent;btn.textContent='Added';setTimeout(function(){btn.textContent=old;},1200);}
}
function renderBag(){
  var n=0,sub=0;
  $('bagList').innerHTML=bag.map(function(it){
    var p=byId[it.pid],c=p.colors[it.ci];n+=it.qty;sub+=p.price*it.qty;
    return '<li class="bi" data-key="'+esc(it.key)+'"><div class="bthumb">'+art(p,c[1],c[0],true)+'</div>'+
      '<div class="binfo"><b>'+esc(p.name)+'</b><span>'+esc(c[0])+' / '+esc(it.size)+'</span>'+
      '<div class="qty"><button type="button" data-q="-1" aria-label="One less '+esc(p.name)+'">&minus;</button><span>'+it.qty+'</span><button type="button" data-q="1" aria-label="One more '+esc(p.name)+'">+</button></div></div>'+
      '<div class="bprice"><span>'+money(p.price*it.qty)+'</span><button type="button" class="lnk" data-rm="1">Remove</button></div></li>';
  }).join('');
  $('bagCount').textContent=n;
  $('bagSub').textContent=money(sub);
  $('bagEmpty').hidden=bag.length>0;
  $('bagFoot').hidden=bag.length===0;
  $('oDone').hidden=true;
}
$('bagList').addEventListener('click',function(e){
  var li=e.target.closest('.bi');if(!li)return;
  var key=li.getAttribute('data-key'),it=bag.filter(function(i){return i.key===key;})[0];if(!it)return;
  var q=e.target.closest('[data-q]'),rm=e.target.closest('[data-rm]');
  if(q){it.qty=Math.min(99,it.qty+(+q.getAttribute('data-q')));}
  if(rm||it.qty<1)bag=bag.filter(function(i){return i.key!==key;});
  persist();renderBag();
});

/* drawer */
var lastFocus=null;
function openBag(){
  lastFocus=document.activeElement;
  $('scrim').hidden=false;$('bag').hidden=false;
  document.body.style.overflow='hidden';
  $('bagClose').focus();
}
function closeBag(){
  $('scrim').hidden=true;$('bag').hidden=true;
  document.body.style.overflow='';
  if(lastFocus&&lastFocus.focus)lastFocus.focus();else $('bagBtn').focus();
}
$('bagBtn').addEventListener('click',openBag);
$('bagClose').addEventListener('click',closeBag);
$('scrim').addEventListener('click',closeBag);
document.addEventListener('keydown',function(e){
  if($('bag').hidden)return;
  if(e.key==='Escape'){closeBag();return;}
  if(e.key==='Tab'){
    var f=$('bag').querySelectorAll('button,input,select,textarea,summary,a[href]');
    f=Array.prototype.filter.call(f,function(x){return !x.disabled&&x.offsetParent!==null;});
    if(!f.length)return;
    var first=f[0],last=f[f.length-1];
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
  }
});

/* shared helpers */
function showErr(el,msg,field){el.textContent=msg;el.hidden=false;if(field)field.focus();}
function wireCopy(btn,out,msg){
  btn.addEventListener('click',function(){
    var txt=out.textContent;
    function fallback(){
      var r=document.createRange();r.selectNodeContents(out);
      var s=window.getSelection();s.removeAllRanges();s.addRange(r);
      msg.textContent='Selected. Press Ctrl+C or Copy from your menu.';
    }
    try{
      if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(txt).then(function(){msg.textContent='Copied.';},fallback);}
      else fallback();
    }catch(x){fallback();}
  });
}
function goodEmail(v){return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);}
function banner(t){$('bannerText').textContent=t;$('banner').hidden=false;}
$('bannerClose').addEventListener('click',function(){$('banner').hidden=true;});

/* checkout (Stripe, through the Netlify function) */
$('checkoutBtn').addEventListener('click',function(){
  var btn=this,err=$('coErr'),old=btn.textContent;
  err.hidden=true;
  if(!bag.length)return;
  btn.disabled=true;btn.textContent='Starting checkout';
  fetch('/.netlify/functions/checkout',{
    method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({items:bag.map(function(i){return {pid:i.pid,ci:i.ci,size:i.size,qty:i.qty};})})
  }).then(function(r){
    return r.json().then(function(j){return {ok:r.ok,j:j};},function(){return {ok:false,j:{}};});
  }).then(function(x){
    if(x.ok&&x.j&&x.j.url){window.location.href=x.j.url;return;}
    throw new Error((x.j&&x.j.error)||'failed');
  }).catch(function(){
    btn.disabled=false;btn.textContent=old;
    showErr(err,'Checkout is not available right now. You can send your order as a request below.');
    $('altOrder').open=true;
  });
});

/* order request from the bag (no payment) */
$('orderForm').addEventListener('submit',function(e){
  e.preventDefault();
  var err=$('oErr'),name=$('oName').value.trim(),contact=$('oContact').value.trim();
  err.hidden=true;$('oDone').hidden=true;
  if(!bag.length){showErr(err,'Your bag is empty. Add something first.');return;}
  if(!name){showErr(err,'Add your name so we know who the order is for.',$('oName'));return;}
  if(!contact){showErr(err,'Add a phone number or email so we can reach you.',$('oContact'));return;}
  var lines=['Order request for Ridge Line Supply Co.','','Name: '+name,'Contact: '+contact,'','Items:'],sub=0;
  bag.forEach(function(it){
    var p=byId[it.pid];sub+=p.price*it.qty;
    lines.push(it.qty+' x '+p.name+', '+p.colors[it.ci][0]+', '+it.size+'  '+money(p.price*it.qty));
  });
  lines.push('','Subtotal: '+money(sub));
  $('oText').textContent=lines.join('\n');$('oCopyMsg').textContent='';
  $('oDone').hidden=false;$('oDoneTitle').focus();
});
wireCopy($('oCopy'),$('oText'),$('oCopyMsg'));

/* crew order (Netlify Forms, with a copy-and-send fallback) */
function showCrew(sent){
  $('cDoneTitle').textContent=sent?'Request sent':'Request ready';
  $('cSent').hidden=!sent;$('cFallback').hidden=sent;
  $('cCopyMsg').textContent='';
  $('cDone').hidden=false;
  try{$('cDone').scrollIntoView({behavior:'smooth',block:'nearest'});}catch(x){}
  $('cDoneTitle').focus({preventScroll:true});
}
$('crewForm').addEventListener('submit',function(e){
  e.preventDefault();
  var err=$('cErr'),name=$('cName').value.trim(),phone=$('cPhone').value.trim(),email=$('cEmail').value.trim();
  err.hidden=true;$('cDone').hidden=true;
  if(!name){showErr(err,'Add your name so we know who to ask for.',$('cName'));return;}
  if(!phone&&!email){showErr(err,'Add a phone number or an email so we can reach you.',$('cPhone'));return;}
  if(email&&!goodEmail(email)){showErr(err,'That email address looks incomplete. Check it and try again.',$('cEmail'));return;}
  var lines=['Crew order request for Ridge Line Supply Co.','','Name: '+name];
  if($('cOrg').value.trim())lines.push('Company or crew: '+$('cOrg').value.trim());
  if(phone)lines.push('Phone: '+phone);
  if(email)lines.push('Email: '+email);
  if($('cQty').value)lines.push('People: '+$('cQty').value);
  lines.push('Wants: '+$('cItems').value);
  if($('cMsg').value.trim()){lines.push('');lines.push($('cMsg').value.trim());}
  $('cText').textContent=lines.join('\n');
  if(SITE.forms===false){showCrew(false);return;}
  var body=new URLSearchParams();
  new FormData(this).forEach(function(v,k){body.append(k,v);});
  fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:body.toString()})
    .then(function(r){showCrew(r.ok);},function(){showCrew(false);});
});
wireCopy($('cCopy'),$('cText'),$('cCopyMsg'));

/* site details from site-config.js */
function fillSite(){
  var map={phone:SITE.phone,email:SITE.email,address:SITE.address,policy:SITE.policy};
  Array.prototype.forEach.call(document.querySelectorAll('[data-site]'),function(el){
    var k=el.getAttribute('data-site'),v=String(map[k]||'').trim();
    if(!v)return;
    el.classList.remove('ph');el.textContent='';
    if(k==='phone'||k==='email'){
      var a=document.createElement('a');
      a.href=(k==='phone'?'tel:'+v.replace(/[^\d+]/g,''):'mailto:'+v);
      a.textContent=v;el.appendChild(a);
    } else el.textContent=v;
  });
  $('sampleNote').hidden=SITE.sampleNote===false;
  if(SITE.checkout===false){$('checkoutBtn').hidden=true;$('altOrder').open=true;$('altSummary').hidden=true;}
}

/* return from Stripe */
function handleReturn(){
  var o='';
  try{o=new URLSearchParams(window.location.search).get('order')||'';}catch(x){}
  if(!o)return;
  if(o==='success'){bag=[];persist();renderBag();banner('Thank you. Your payment went through, and we will be in touch about your order.');}
  else if(o==='cancelled'){banner('Checkout was cancelled. Your bag is still here.');}
  try{history.replaceState(null,'',window.location.pathname+window.location.hash);}catch(x){}
}

/* start */
function start(list){
  PRODUCTS=list;byId={};
  list.forEach(function(p){byId[p.id]=p;});
  var tee=list.filter(function(p){return p.kind==='tee';})[0]||list[0];
  var cap=list.filter(function(p){return p.kind==='cap';})[0];
  renderChips();
  $('grid').innerHTML=list.map(card).join('');
  $('heroArt').innerHTML='<div class="h-main">'+art(tee,tee.colors[0][1],tee.colors[0][0],false)+'</div>'+
    (cap?'<div class="h-cap">'+art(cap,cap.colors[1]?cap.colors[1][1]:cap.colors[0][1],'cap',true)+'</div>':'');
  loadBag();renderBag();handleReturn();
}
fillSite();
fetch('products.json',{cache:'no-cache'}).then(function(r){
  if(!r.ok)throw new Error('products');
  return r.json();
}).then(start).catch(function(){
  $('grid').innerHTML='<p class="empty">The shop could not load. Refresh the page, or try again in a minute.</p>';
});
})();
