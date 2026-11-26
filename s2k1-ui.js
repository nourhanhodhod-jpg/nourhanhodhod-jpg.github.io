/* 🌸 أدوات مهارة المتغيرات والتعويض (بتعتمد على s1k3-ui.js و s1k5-ui.js: نظام الأسئلة والأس والكسور الحرفية)
   كتابة المقدار بين {{ }} :  {{3س + 5}}  ،  الأس {{س^2}}  ،  الكسر {{1/2}} أو {{⟦س|2⟧}}  ،  الأعداد العشرية {{0.5}} بتتعرض ٠،٥
   أنواع أسئلة جديدة: val (اكتبي قيمة: عدد صحيح أو سالب أو عشري أو كسر) و expr (اكتبي التعبير الجبري بنفسك).
   أدوات: subst (جرّبي قيم المتغير) و vc (متغير ولا ثابت؟). */
(function () {
  const { dig, fmt } = FR, AR = '٠١٢٣٤٥٦٧٨٩';
  const F = s => AL.F(String(s).replace(/(\d)\.(\d)/g, '$1،$2'));
  const digs = s => String(s).replace(/[٠-٩]/g, d => AR.indexOf(d));

  /* ---------- حاسبة صغيرة للتعبيرات (س ص ع) ---------- */
  const LT = { 'س': 'x', 'ص': 'y', 'ع': 'z' };
  const prep = s => {
    s = digs(s).replace(/[−–—‒]/g, '-').replace(/[×·✕]/g, '*').replace(/÷/g, '/').replace(/[٫،]/g, '.').replace(/²/g, '^2').replace(/³/g, '^3').replace(/\s+/g, '').replace(/[سصع]/g, c => LT[c]);
    for (let k = 0; k < 2; k++) s = s.replace(/(\d|\)|[xyz])(?=[xyz(])/g, '$1*').replace(/([xyz])(?=\d)/g, '$1*').replace(/\)(?=\d)/g, ')*');
    return s;
  };
  const ev = (str, vars) => {
    try {
      let s = prep(str); if (!s || !/^[0-9xyz+\-*\/().^]+$/.test(s)) return NaN;
      const pw = /([xyz]|\d+(?:\.\d+)?|\([^()]*\))\^(-?\d+(?:\.\d+)?|[xyz]|\([^()]*\))/g;
      for (let k = 0; k < 6 && pw.test(s); k++) { pw.lastIndex = 0; s = s.replace(pw, 'Math.pow($1,$2)'); pw.lastIndex = 0; }
      const v = vars || {}; return new Function('x', 'y', 'z', 'return ' + s)(v.x || 0, v.y || 0, v.z || 0);
    } catch (e) { return NaN; }
  };
  const PTS = [[1, 2, 3], [2, -3, 5], [-4, 3, 2], [0.5, 7, -1], [3, 1, -2]];
  const same = (a, b) => PTS.every(p => { const o = { x: p[0], y: p[1], z: p[2] }, u = ev(a, o), w = ev(b, o); return isFinite(u) && isFinite(w) && Math.abs(u - w) < 1e-6; });
  const pv = s => typeof s === 'number' ? s : String(s).includes('/') ? s.split('/')[0] / s.split('/')[1] : +s;
  const vstr = v => { if (Number.isInteger(v)) return String(v); for (let d = 2; d <= 12; d++) { const n = Math.round(v * d); if (Math.abs(n / d - v) < 1e-9) return n + '/' + d; } return String(+v.toFixed(4)).replace('.', '،'); };
  const dv = s => String(s).replace(/(\d)\.(\d)/g, '$1،$2');

  /* ---------- نوع سؤال: اكتبي قيمة (عدد صحيح / سالب / عشري / كسر مثل ٧/٣) ---------- */
  const minus = '<button class="sm" data-neg type="button" aria-label="إشارة سالب">− إشارة</button>';
  const parseV = t => { t = digs(t).replace(/[−–—‒]/g, '-').replace(/[٫،,]/g, '.').replace(/\s/g, ''); if (/^-?\d+(\.\d+)?$/.test(t)) return +t; const m = t.match(/^(-?\d+)\/(\d+)$/); return m && +m[2] ? m[1] / m[2] : NaN; };
  FR.TY.val = {
    tag: 'اكتبي الناتج',
    build: () => `<div class="inrow"><input class="ans" dir="ltr" inputmode="text" autocomplete="off" placeholder="اكتبي القيمة" aria-label="الإجابة">${minus}<button class="btn" data-ok type="button">تحقّقي ✔️</button></div><small>لو سالب اكتبي إشارة −. ولو كسر اكتبيه كده: ٧/٣. والعشري بنقطة أو فاصلة: ٢٫٥</small>`,
    check: (q, a) => ({ r: Math.abs(parseV(a) - pv(q.a)) < 1e-9 }),
    corr: q => fmt('{{' + dv(q.a) + '}}'),
    bind(el, q, go) {
      const i = el.querySelector('.ans'), f = () => isNaN(parseV(i.value)) ? i.focus() : go(i.value);
      el.querySelector('[data-ok]').onclick = f; i.onkeydown = e => { if (e.key === 'Enter') f(); };
      el.querySelector('[data-neg]').onclick = () => { const v = i.value.trim(); i.value = /^[-−]/.test(v) ? v.slice(1) : '-' + v; i.focus(); };
    },
    paint(el, q, a, r) { const i = el.querySelector('.ans'); i.value = dig(String(a).replace(/-/g, '−')); i.disabled = true; i.classList.add(r ? 'ok' : 'no'); el.querySelectorAll('.inrow button').forEach(b => b.disabled = true); }
  };

  /* ---------- نوع سؤال: اكتبي التعبير الجبري (بيتقبل أي صورة مكافئة) ---------- */
  const keys = ['س', 'ص', 'ع', '+', '−', '×', '÷', '^', '(', ')'];
  FR.TY.expr = {
    tag: 'اكتبي التعبير',
    build: () => `<div class="inrow"><input class="ans ex" dir="ltr" inputmode="text" autocomplete="off" placeholder="اكتبي التعبير" aria-label="التعبير الجبري"><button class="btn" data-ok type="button">تحقّقي ✔️</button></div><div class="kp">${keys.map(k => `<button class="sm" data-ins="${k}" type="button">${k}</button>`).join('')}<button class="sm" data-del type="button" aria-label="مسح حرف">⌫</button></div><small>استخدمي الأزرار (س ، ص ، ^ للأس). مثال: ٣س + ٥ أو س^٢.</small>`,
    check: (q, a) => ({ r: same(a, q.a) }),
    corr: q => F(q.a),
    bind(el, q, go) {
      const i = el.querySelector('.ans'), f = () => { const t = i.value.trim(); t ? go(t) : i.focus(); };
      el.querySelector('[data-ok]').onclick = f; i.onkeydown = e => { if (e.key === 'Enter') f(); };
      el.querySelectorAll('[data-ins]').forEach(b => b.onclick = () => { const p = i.selectionStart == null ? i.value.length : i.selectionStart; i.value = i.value.slice(0, p) + b.dataset.ins + i.value.slice(i.selectionEnd == null ? p : i.selectionEnd); i.focus(); try { i.setSelectionRange(p + 1, p + 1); } catch (e) { } });
      el.querySelector('[data-del]').onclick = () => { i.value = i.value.slice(0, -1); i.focus(); };
    },
    paint(el, q, a, r) { const i = el.querySelector('.ans'); i.value = dig(a); i.disabled = true; i.classList.add(r ? 'ok' : 'no'); el.querySelectorAll('.inrow button,.kp button').forEach(b => b.disabled = true); }
  };

  const mk = sec => { const w = document.createElement('div'); w.className = 'wd'; sec.appendChild(w); return w; };

  /* ---------- أداة: اختاري قيمة للمتغير وشوفي الناتج ---------- */
  function subst(sec, [tpl, vars, title]) {
    const w = mk(sec), names = Object.keys(vars), pick = {};
    const draw = () => {
      const all = names.every(n => pick[n] !== undefined);
      let line = '', res = '';
      if (all) {
        const o = {}; names.forEach(n => o[LT[n]] = pv(pick[n]));
        line = tpl.replace(/(\d)(?=[سصع])/g, '$1 × ').replace(/([سصع])(?=[سصع])/g, '$1 × ');
        line = line.replace(/[سصع]/g, c => { const t = pick[c]; if (t === undefined) return c; const x = pv(t); return x < 0 ? '(' + t + ')' : String(t); });
        res = vstr(ev(tpl, o));
      }
      w.innerHTML = `<b>${title || '🎛️ غيّري قيمة المتغير وشوفي الناتج'}</b><p class="chain">${F(tpl)}</p>${names.map(n => `<div><small>${F(n)} =</small><div class="vg">${vars[n].map((v, i) => `<button class="sm${pick[n] === v ? ' on' : ''}" data-s="${n}" data-i="${i}">${F(String(v).includes('-') ? '(' + v + ')' : String(v))}</button>`).join('')}</div></div>`).join('')}${all ? `<p class="chain" aria-live="polite">${F(line)}</p><p class="fb good">✅ قيمة التعبير = ${F(res)}</p>` : '<p>اختاري قيمة (أو قيمتين) من الأزرار 👆</p>'}`;
      w.querySelectorAll('[data-s]').forEach(b => b.onclick = () => { pick[b.dataset.s] = vars[b.dataset.s][+b.dataset.i]; draw(); });
    };
    draw();
  }

  /* ---------- أداة: متغير ولا ثابت؟ ---------- */
  function vc(sec, [terms]) {
    const w = mk(sec), st = {};
    const draw = () => {
      const n = Object.values(st).filter(x => x === 1).length;
      w.innerHTML = `<b>🔎 كل حد من دول متغير ولا ثابت؟</b>${terms.map((t, i) => `<div class="vcr"><span class="vt">${F(t)}</span>${st[i] === undefined ? `<button class="sm" data-c="${i}" data-k="v">فيه متغير</button><button class="sm" data-c="${i}" data-k="c">ثابت</button>` : `<span class="${st[i] ? 'vok' : 'vno'}">${st[i] ? '✅ ' : '❌ '}${/[سصع]/.test(t) ? 'حد فيه متغير' : 'عدد ثابت'}</span>`}</div>`).join('')}<p>${n === terms.length ? '🎀 برافو! جاوبتي الكل صح.' : 'اضغطي على الاختيار المناسب لكل حد.'}</p>`;
      w.querySelectorAll('[data-c]').forEach(b => b.onclick = () => { const i = +b.dataset.c; st[i] = (b.dataset.k === 'v') === /[سصع]/.test(terms[i]) ? 1 : 0; draw(); });
    };
    draw();
  }

  const css = document.createElement('style');
  css.textContent = `.vg{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0 10px;justify-content:center}.vg .sm.on{background:#fff3d6;border-color:#e0a526}
.kp{display:flex;flex-wrap:wrap;gap:5px;margin:8px 0;justify-content:center}.kp .sm{min-width:38px}.ans.ex{min-width:150px}
.vcr{display:flex;align-items:center;justify-content:space-between;gap:8px;border-bottom:1.5px dashed var(--p);padding:6px 2px;flex-wrap:wrap}.vt{font-size:1.2rem;min-width:60px}.vok{color:#14532d;font-weight:700}.vno{color:#b3261e;font-weight:700}
table.t2{width:100%;border-collapse:collapse;margin:8px 0}table.t2 th,table.t2 td{border:1.5px solid var(--p);padding:6px;text-align:center}table.t2 th{background:#fde8ef;color:var(--deep)}`;
  document.head.appendChild(css);

  /* الفاصلة العشرية العربية: أي 2.5 بين {{ }} بتتعرض ٢،٥ */
  const SKIPK = { a: 1, v: 1, c: 1, type: 1, id: 1, form: 1, topic: 1, lv: 1, wa: 1 };
  const dcs = s => s.replace(/\{\{(.+?)\}\}/g, (m, e) => '{{' + e.replace(/(\d)\.(\d)/g, '$1،$2') + '}}');
  const walk = (o, k) => typeof o === 'string' ? (SKIPK[k] ? o : k === 'items' ? o.replace(/(\d)\.(\d)/g, '$1،$2') : dcs(o)) : Array.isArray(o) ? o.map(x => walk(x, k)) : o && typeof o === 'object' ? Object.fromEntries(Object.entries(o).map(([kk, v]) => [kk, walk(v, kk)])) : o;
  const deep = o => AL.deep(walk(o));
  window.VS = { deep, F, ev, same, subst, vc, vstr, parseV, pv };
})();
      
