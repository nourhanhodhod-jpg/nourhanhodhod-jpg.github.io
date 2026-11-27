/* لوحة الرئيسية + شريط التنقل السفلي — قراءة فقط من بيانات الموقع، لا تكتب أي مفتاح */
(function(){
  const g=id=>document.getElementById(id);
  const rd=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))||d}catch(e){return d}};
  const ar=n=>String(n).replace(/\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[d]);
  function build(){
    const dock=document.createElement('div');dock.id='dock';dock.setAttribute('role','navigation');dock.setAttribute('aria-label','التنقل');
    dock.innerHTML='<button data-v="home"><span>🏠</span>الرئيسية</button><button data-v="lessons"><span>📚</span>الدروس</button>';
    dock.onclick=e=>{const b=e.target.closest('button');if(b)window.show(b.dataset.v)};
    document.body.appendChild(dock);
  }
  function upd(){
    let total=0,open=0,mast=0;
    try{
      const fd=rd('fnd',{});
      SECTIONS.forEach(sec=>sec.skills.forEach((t,i)=>{total++;const id=sec.id+'k'+(i+1);
        const has=!!(window.CONTENT&&CONTENT[id])||!!(window.SKILL_PAGES&&SKILL_PAGES[id]);
        if(has){open++;if((fd[id]||0)>=2)mast++}}));
    }catch(e){}
    const pct=open?Math.round(mast/open*100):0;
    const set=(id,v)=>{const e=g(id);if(e)e.textContent=v};
    set('dCoins',ar(parseInt(localStorage.getItem('coins'))||0));
    set('dStars',ar(document.getElementById('starCount')?document.getElementById('starCount').textContent:0));
    set('dOpen',ar(open));set('dProg',ar(mast)+' من '+ar(open));set('dRingTxt',ar(pct)+'٪');
    const r=g('dRing');if(r)r.style.setProperty('--v',pct);
    const nm=(()=>{try{return localStorage.getItem('name')||''}catch(e){return''}})();
    const hr=document.querySelector('.hero');if(hr)hr.hidden=!!nm;
    set('dWide',mast?'كمّلي من حيث وقفتي':'ابدئي أول مهارة');
    const v='home';
    const hb=g('hubbar'),dk=g('dock');if(dk)dk.hidden=!!(hb&&!hb.hidden);document.querySelectorAll('#dock button').forEach(b=>b.classList.toggle('on',b.dataset.v===v));
  }
  function init(){
    build();
    const o=window.show;if(typeof o==='function')window.show=function(){const r=o.apply(this,arguments);upd();return r};
    upd();setInterval(upd,1500);document.addEventListener('visibilitychange',upd);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
