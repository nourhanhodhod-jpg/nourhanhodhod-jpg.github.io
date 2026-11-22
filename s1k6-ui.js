/* 🌸 أدوات مهارة الجذور التربيعية (بتعتمد على s1k5-ui.js اللي فيه نظام الأس والكسور الحرفية)
   كتابة الجذر بين {{ }} :  {{√49}}  أو للتعبير الأطول  {{√[4 × 3]}}  ، المعامل قدام الجذر مباشرة  {{2√3}}
   القيمة المطلقة {{|س|}} ، الأس ^ والكسر الحرفي ⟦البسط|المقام⟧ زي المهارة السابقة. */
(function () {
  const { dig, fmt } = FR;
  const rtHtml = i => `<span class="rt"><span class="rs">√</span><span class="rb">${i}</span></span>`;
  const rt = e => e.replace(/√\[([^\]]*)\]/g, (m, i) => '\u0001' + i + '\u0002').replace(/√(\d+(?:\.\d+)?|[ء-ي])/g, (m, i) => '\u0001' + i + '\u0002').replace(/\u0001([^\u0002]*)\u0002/g, (m, i) => rtHtml(i));
  const D = s => s.replace(/\{\{(.+?)\}\}/g, (m, e) => '{{' + AL.pwE(rt(e)) + '}}');
  const SKIP = { a: 1, v: 1, c: 1, wa: 1, type: 1, id: 1, form: 1, topic: 1, lv: 1, pw: 1, tm: 1 };
  const deep = o => typeof o === 'string' ? D(o) : Array.isArray(o) ? o.map(deep) : o && typeof o === 'object' ? Object.fromEntries(Object.entries(o).map(([k, v]) => [k, SKIP[k] ? v : k === 'items' ? v.map(s => AL.pwE(rt(s))) : deep(v)])) : o;
  const F = s => fmt(D('{{' + s + '}}'));
  const nrm = AL.nrm;

  /* صيغة الإجابة: tm أنواع الحدود ('r' جذر: معامل + ما تحت الجذر ، 'n' عدد) و a الأرقام بالترتيب */
  function radStr(tm, a) {
    let s = '', k = 0;
    tm.forEach(t => {
      let c, r = 1; if (t === 'r') { c = a[k++]; r = a[k++]; } else c = a[k++];
      if (!c) return; const ab = Math.abs(c), body = r === 1 || t === 'n' ? String(ab) : (ab === 1 ? '' : ab) + '√' + r;
      s += (s ? (c < 0 ? ' - ' : ' + ') : (c < 0 ? '-' : '')) + body;
    });
    return s || '0';
  }

  /* ---------- نوع سؤال: اكتبي الناتج على صورة (معامل √ ما تحت الجذر) ---------- */
  const minus = '<button class="sm" data-neg type="button" aria-label="إشارة سالب">− إشارة</button>';
  FR.TY.rad = {
    tag: 'اكتبي الناتج',
    build(q) {
      return `<div class="pf" dir="ltr">${q.tm.map((t, i) => `${i ? '<span class="pl2">+</span>' : ''}<span class="pc">${t === 'r' ? '<input class="pcf rc" inputmode="text" autocomplete="off" aria-label="المعامل"><b class="rsym">√</b><input class="pcf rr" inputmode="text" autocomplete="off" aria-label="العدد تحت الجذر">' : '<input class="pcf rc" inputmode="text" autocomplete="off" aria-label="العدد">'}</span>`).join('')}</div><div class="inrow">${minus}<button class="btn" data-ok type="button">تحقّقي ✔️</button></div><small>اكتبي «المعامل» ثم «العدد تحت الجذر». لو المعامل ١ اكتبي ١. ${q.tm.length > 1 ? 'رتّبي الحدود كما في الصورة (العدد الصحيح أخيرًا).' : ''}</small>`;
    },
    check: (q, a) => ({ r: a.length === q.a.length && a.every((x, i) => +x === q.a[i]) }),
    corr: q => F(radStr(q.tm, q.a)),
    bind(el, q, go) {
      const ins = [...el.querySelectorAll('.pcf')]; let last = ins[0];
      ins.forEach(i => { i.onfocus = () => last = i; i.onkeydown = e => { if (e.key === 'Enter') f(); }; });
      const f = () => { const v = ins.map(i => nrm(i.value)); const bad = v.findIndex(x => !/^-?\d+$/.test(x)); if (bad >= 0) ins[bad].focus(); else go(v.map(Number)); };
      el.querySelector('[data-ok]').onclick = f;
      el.querySelector('[data-neg]').onclick = () => { const v = last.value.trim(); last.value = /^[-−]/.test(v) ? v.slice(1) : '-' + v; last.focus(); };
    },
    paint(el, q, a) { el.querySelectorAll('.pcf').forEach((i, k) => { i.value = dig(String(a[k]).replace(/-/g, '−')); i.disabled = true; i.classList.add(+a[k] === q.a[k] ? 'ok' : 'no'); }); el.querySelectorAll('.inrow button').forEach(b => b.disabled = true); }
  };

  /* ---------- أداة: جدول المربعات الكاملة (اضغطي على العدد) ---------- */
  function sqtable(sec) {
    const w = document.createElement('div'); w.className = 'wd'; sec.appendChild(w);
    w.innerHTML = `<b>🔢 اضغطي على أي عدد من ١ لـ ٢٠ وشوفي مربعه</b><div class="sqg">${Array.from({ length: 20 }, (_, i) => `<button class="sm" data-k="${i + 1}">${dig(i + 1)}</button>`).join('')}</div><p class="chain sqm" aria-live="polite">اختاري عددًا…</p><p class="sqn"></p>`;
    w.querySelectorAll('[data-k]').forEach(b => b.onclick = () => { const k = +b.dataset.k; w.querySelectorAll('[data-k]').forEach(x => x.classList.remove('on')); b.classList.add('on'); w.querySelector('.sqm').innerHTML = F(k + ' × ' + k + ' = ' + k + '^2 = ' + k * k); w.querySelector('.sqn').innerHTML = F('√' + k * k + ' = ' + k) + ' ← الجذر هو العكس 🔁'; });
  }

  /* ---------- أداة: اختاري المربع الكامل المناسب لتبسيط الجذر ---------- */
  function simp(sec, [n]) {
    const w = document.createElement('div'); w.className = 'wd'; sec.appendChild(w);
    const ks = []; for (let k = 2; k * k <= n; k++) if (n % (k * k) === 0) ks.push(k);
    const big = ks[ks.length - 1];
    w.innerHTML = `<b>🔍 فكّي ${F('√' + n)}: اختاري مربعًا كاملًا بيقسم ${dig(n)}</b><div class="sqg">${ks.map(k => `<button class="sm" data-k="${k}">${F(k * k)}</button>`).join('')}</div><p class="chain sqm" aria-live="polite">اضغطي على مربع كامل…</p>`;
    w.querySelectorAll('[data-k]').forEach(b => b.onclick = () => { const k = +b.dataset.k, r = n / (k * k); w.querySelectorAll('[data-k]').forEach(x => x.classList.remove('on')); b.classList.add('on'); w.querySelector('.sqm').innerHTML = F('√' + n + ' = √[' + k * k + ' × ' + r + '] = √' + k * k + ' × √' + r + ' = ' + k + '√' + r) + (k === big ? (r === 1 ? '' : '<br>✅ ده أكبر مربع كامل، فالجذر اتبسّط خلاص.') : '<br>🤔 فيه مربع كامل أكبر! جرّبي مربع تاني عشان نبسّط لآخر حاجة.'); });
  }

  /* ---------- أداة: الجذر بين أي عددين صحيحين؟ ---------- */
  function between(sec, [n]) {
    const w = document.createElement('div'); w.className = 'wd'; sec.appendChild(w); const seen = new Set(), top = Math.ceil(Math.sqrt(n)) + 1;
    const draw = () => {
      const lo = Math.floor(Math.sqrt(n)); const msg = [...seen].sort((a, b) => a - b).map(k => F(k + '^2 = ' + k * k) + (k * k <= n ? ' ✅ أصغر من ' + dig(n) : ' ⬆️ أكبر من ' + dig(n))).join('<br>');
      const done = seen.has(lo) && seen.has(lo + 1);
      w.innerHTML = `<b>📍 فين ${F('√' + n)}؟ اضغطي على أعداد وقارني مربعها بـ ${dig(n)}</b><div class="sqg">${Array.from({ length: top }, (_, i) => `<button class="sm${seen.has(i + 1) ? ' on' : ''}" data-k="${i + 1}">${dig(i + 1)}</button>`).join('')}</div><p class="chain">${msg || 'اضغطي على عدد…'}</p>${done ? `<p class="fb good">${F(lo + ' < √' + n + ' < ' + (lo + 1))} ✨ لأن ${F(lo * lo + ' < ' + n + ' < ' + (lo + 1) * (lo + 1))}</p>` : ''}`;
      w.querySelectorAll('[data-k]').forEach(b => b.onclick = () => { seen.add(+b.dataset.k); draw(); });
    };
    draw();
  }

  const css = document.createElement('style');
  css.textContent = `.rt{display:inline-flex;align-items:flex-start;direction:ltr}.rs{font-size:1.15em;line-height:1}.rb{border-top:1.6px solid currentColor;padding:1px 3px 0 2px;margin-top:3px;line-height:1.15}.rb sup{font-size:.7em}.rsym{font-size:1.4rem;color:var(--deep);margin:0 2px}
.sqg{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0;justify-content:center}.sqg .sm.on{background:#fff3d6;border-color:#e0a526}.sqn{text-align:center}`;
  document.head.appendChild(css);
  const F2 = a => nrm(a);
  window.RO = { D, deep, F, F2, rt, radStr, sqtable, simp, between };
})();
                                                               
