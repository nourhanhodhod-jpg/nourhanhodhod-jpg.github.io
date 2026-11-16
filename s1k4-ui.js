/* 🌸 أدوات مهارة الأعداد العشرية والنسبية (بتضيف أنواع أسئلة جديدة على محرك الكسور من غير ما تعدّل فيه)
   الأعداد العشرية بتتكتب بين {{ }} بنقطة عادية مثلًا {{2.5 + 1.3}} والموقع بيعرضها بالفاصلة العربية ٢،٥ */
(function () {
  const { dig, fmt, gcd } = FR, AR = '٠١٢٣٤٥٦٧٨٩';
  const dc = s => s.replace(/(\d)\.(\d)/g, '$1،$2');
  const D = s => s.replace(/\{\{(.+?)\}\}/g, (m, e) => '{{' + dc(e) + '}}');
  const SKIP = { a: 1, v: 1, c: 1, ans: 1, wa: 1, type: 1, id: 1, form: 1, topic: 1, lv: 1 };
  const deep = o => typeof o === 'string' ? D(o) : Array.isArray(o) ? o.map(deep) : o && typeof o === 'object' ? Object.fromEntries(Object.entries(o).map(([k, v]) => [k, SKIP[k] ? v : k === 'items' ? v.map(dc) : deep(v)])) : o;
  const nrm = s => String(s).replace(/[٠-٩]/g, d => AR.indexOf(d)).replace(/[−–—‒]/g, '-').replace(/[٫،,]/g, '.').replace(/[\s+]/g, '');
  const show = v => '{{' + String(v).replace('.', '،') + '}}';

  /* ---------- نوع سؤال: عدد عشري أو صحيح (يقبل سالب وفاصلة) ---------- */
  const keys = (sep, neg) => `<button class="sm" data-neg type="button" aria-label="إشارة سالب">− إشارة</button><button class="sm" data-sep type="button" aria-label="${neg}">${sep}</button>`;
  function bindIn(el, q, go, ok) {
    const i = el.querySelector('.ans'), f = () => ok(i.value) ? go(i.value) : i.focus();
    el.querySelector('[data-ok]').onclick = f; i.onkeydown = e => { if (e.key === 'Enter') f(); };
    el.querySelector('[data-neg]').onclick = () => { const v = i.value.trim(); i.value = v.startsWith('-') || v.startsWith('−') ? v.slice(1) : '-' + v; i.focus(); };
    el.querySelector('[data-sep]').onclick = () => { i.value += el.querySelector('[data-sep]').dataset.ch; i.focus(); };
  }
  const paintIn = (el, a, r) => { const i = el.querySelector('.ans'); i.value = dig(String(a).replace(/-/g, '−')); i.disabled = true; i.classList.add(r ? 'ok' : 'no'); el.querySelectorAll('.inrow button').forEach(b => b.disabled = true); };
  FR.TY.dec = {
    tag: 'اكتبي الناتج',
    build: () => `<div class="inrow"><input class="ans" dir="ltr" inputmode="text" autocomplete="off" placeholder="اكتبي الناتج" aria-label="الإجابة">${keys('،', 'فاصلة عشرية').replace('data-sep', 'data-sep data-ch="،"')}<button class="btn" data-ok type="button">تحقّقي ✔️</button></div><small>الأعداد العشرية بفاصلة مثل ٣،٧ والسالبة بإشارة − قبل العدد.</small>`,
    check: (q, a) => ({ r: Math.abs(parseFloat(nrm(a)) - parseFloat(q.a)) < 1e-9 }),
    corr: q => fmt(show(q.a)),
    bind: (el, q, go) => bindIn(el, q, go, v => /^-?\d+(\.\d+)?$/.test(nrm(v))),
    paint: (el, q, a, r) => paintIn(el, a, r)
  };
  /* ---------- نوع سؤال: كسر موجب أو سالب (مثال: −٣/٢) ---------- */
  FR.TY.rat = {
    tag: 'اكتبي الكسر',
    build: () => `<div class="inrow"><input class="ans" dir="ltr" inputmode="text" autocomplete="off" placeholder="مثال: ٣/٤ أو −١/٢" aria-label="الإجابة">${keys('/', 'خط الكسر').replace('data-sep', 'data-sep data-ch="/"')}<button class="btn" data-ok type="button">تحقّقي ✔️</button></div><small>اكتبي الكسر هكذا: البسط/المقام، وفي أبسط صورة.</small>`,
    check(q, a) {
      const s = nrm(a), m = s.match(/^(-?\d+)\/(\d+)$/); if (!m) return { r: false, why: 'اكتبي الكسر بالشكل ده: بسط/مقام، مثلًا ٣/٤.' };
      const n = +m[1], d = +m[2]; if (!d) return { r: false, why: 'المقام مش ممكن يبقى صفر.' };
      const [qn, qd] = q.a.includes('/') ? q.a.split('/').map(Number) : [+q.a, 1];
      if (n * qd !== qn * d) return { r: false };
      if (gcd(Math.abs(n), d) > 1) return { r: false, why: 'القيمة صح، لكن لازم تكتبي الكسر في أبسط صورة.' };
      return { r: true };
    },
    corr: q => fmt('{{' + q.a + '}}'),
    bind: (el, q, go) => bindIn(el, q, go, v => /^-?\d+\/\d+$/.test(nrm(v))),
    paint: (el, q, a, r) => paintIn(el, a, r)
  };

  /* ---------- جدول القيمة المكانية التفاعلي ---------- */
  const IP = ['آحاد', 'عشرات', 'مئات', 'آلاف'], DP = ['أعشار', 'أجزاء من مائة', 'أجزاء من ألف', 'أجزاء من عشرة آلاف'];
  function place(sec, num) {
    const [ip, dp = ''] = num.split('.'), w = document.createElement('div'); w.className = 'wd'; sec.appendChild(w);
    const cells = [...ip].map((d, i) => ({ d, n: IP[ip.length - 1 - i], v: d + '0'.repeat(ip.length - 1 - i), frac: false })).concat([...dp].map((d, i) => ({ d, n: DP[i], v: d + '/1' + '0'.repeat(i + 1), frac: true, dec: '0.' + '0'.repeat(i) + d })));
    w.innerHTML = `<b>🔍 اضغطي على أي رقم في العدد ${fmt(show(num))}</b><div class="pl" dir="ltr">${cells.map((c, i) => (i === ip.length ? '<span class="pt">،</span>' : '') + `<button data-i="${i}"><b>${dig(c.d)}</b><small>${c.n}</small></button>`).join('')}</div><p class="hint pm" aria-live="polite">الأرقام على يمين الفاصلة بتمثّل أجزاء من الواحد.</p>`;
    w.querySelectorAll('[data-i]').forEach(b => b.onclick = () => {
      const c = cells[+b.dataset.i]; w.querySelectorAll('.pl button').forEach(x => x.classList.remove('on')); b.classList.add('on');
      w.querySelector('.pm').innerHTML = fmt(c.frac ? `الرقم {{${c.d}}} في خانة ${c.n}، وقيمته {{${c.v} = ${dc(c.dec)}}}.` : `الرقم {{${c.d}}} في خانة ${c.n}، وقيمته {{${c.v}}}.`);
    });
  }

  /* ---------- جمع/طرح عمودي بفواصل متحاذية ---------- */
  function vert(a, b, op, r) {
    const dp = Math.max(...[a, b, r].map(x => (x.split('.')[1] || '').length)), fix = x => { const [i, f = ''] = x.split('.'); return i + (dp ? '.' + f.padEnd(dp, '0') : ''); };
    const A = fix(a), B = fix(b), R = fix(r), W = Math.max(A.length, B.length, R.length), cell = (s, k) => { const c = s[s.length - W + k]; return `<td>${c === undefined ? '' : c === '.' ? '،' : dig(c)}</td>`; };
    const row = (s, o, cls) => `<tr class="${cls || ''}"><td class="op">${o || ''}</td>${[...Array(W)].map((_, k) => cell(s, k)).join('')}</tr>`;
    return `<table class="vt" dir="ltr">${row(A, '')}${row(B, op)}${row(R, '', 'rs')}</table>`;
  }

  /* ---------- خط الأعداد للأعداد النسبية (من −٢ إلى ٢، كل نصف) ---------- */
  const RX = v => 26 + (v + 2) * 160;
  function rsvg(marks, click) {
    let s = `<svg class="nl" viewBox="0 0 692 104" aria-label="خط الأعداد"><rect x="0" y="14" width="${RX(0)}" height="72" rx="14" class="zn"/><rect x="${RX(0)}" y="14" width="${692 - RX(0)}" height="72" rx="14" class="zp"/><line x1="6" y1="50" x2="686" y2="50" class="ax"/><path d="M6 50l10-6v12zM686 50l-10-6v12z" class="ar"/>`;
    for (let k = -4; k <= 4; k++) { const v = k / 2, x = RX(v), whole = k % 2 === 0; s += `<line x1="${x}" x2="${x}" y1="${whole ? 41 : 44}" y2="${whole ? 59 : 56}" class="tk${v === 0 ? ' z' : ''}"/>` + (whole ? `<text x="${x}" y="88" class="lb ${v < 0 ? 'n' : v > 0 ? 'p' : 'z'}">${dig(v < 0 ? '−' + (-v) : v)}</text>` : ''); }
    marks.forEach(m => { s += `<circle cx="${RX(m.v)}" cy="50" r="11" class="mk ${m.cls}"/>`; });
    if (click) for (let k = -4; k <= 4; k++) s += `<circle class="hit" data-v="${k / 2}" cx="${RX(k / 2)}" cy="50" r="22"/>`;
    return s + '</svg>';
  }
  const RT = [[-0.5, '{{-1/2}}'], [0, '{{0}}'], [0.5, '{{1/2}}'], [1.5, '{{1.5}}']];
  function rline(sec, x, key) {
    const st = x.P.rl = x.P.rl || {}; const S = st[key] = st[key] || { i: 0, h: [] };
    const box = document.createElement('div'); box.className = 'wd'; sec.appendChild(box);
    const paint = () => {
      const i = S.i;
      if (i >= RT.length) { const k = RT.filter((t, j) => S.h[j] === t[0]).length; box.innerHTML = `<b>📍 خلصتي النشاط</b><p class="qt">مكان ${dig(k)} من ${dig(RT.length)} أعداد كان صح من أول مرة.</p><button class="sm" data-re>إعادة النشاط 🔄</button>`; box.querySelector('[data-re]').onclick = () => { S.i = 0; S.h = []; x.save(); paint(); }; return; }
      const t = RT[i], a = S.h[i], done = a !== undefined, ok = a === t[0];
      box.innerHTML = `<b>📍 حطي العدد في مكانه (${dig(i + 1)} من ${dig(RT.length)})</b><p class="qt">اضغطي على مكان العدد ${fmt(t[1])}</p>${rsvg(done ? [{ v: t[0], cls: 'ok' }].concat(ok ? [] : [{ v: a, cls: 'no' }]) : [], !done)}<p class="fb ${done ? (ok ? 'good' : 'bad') : ''}">${done ? (ok ? 'برافو! 💗' : 'العلامة الخضراء هي مكان العدد الصح. افتكري: السالب على يسار الصفر، والأكبر على يمين الأصغر.') : ''}</p>${done ? `<button class="btn sm2" data-nx>${i < RT.length - 1 ? 'العدد اللي بعده ⬅️' : 'شوفي النتيجة 🌟'}</button>` : ''}`;
      box.querySelectorAll('.hit').forEach(b => b.onclick = () => { S.h[i] = +b.dataset.v; x.save(); paint(); });
      const nx = box.querySelector('[data-nx]'); if (nx) nx.onclick = () => { S.i++; x.save(); paint(); };
    };
    paint();
  }

  const css = document.createElement('style');
  css.textContent = `.ov{text-decoration:overline}.pl{display:flex;justify-content:center;gap:6px;align-items:center;flex-wrap:wrap;margin:8px 0}.pl button{font:inherit;border:2px solid var(--p);background:#fff;color:var(--ink);border-radius:14px;padding:4px 6px;min-width:56px;min-height:64px;cursor:pointer}.pl button b{display:block;font-size:1.4rem;color:var(--deep)}.pl button small{display:block;font-size:.6rem;line-height:1.2}.pl button.on{background:#fff3d6;border-color:#e0a526}.pl .pt{font-size:2rem;font-weight:800;color:var(--deep)}
.vt{margin:8px auto;border-collapse:collapse;font-size:1.5rem;font-weight:800;color:var(--deep)}.vt td{width:1.2em;text-align:center;padding:0 2px}.vt td.op{width:1.4em;color:var(--btn)}.vt tr.rs td{border-top:3px solid var(--deep)}.nl .hit{fill:transparent;cursor:pointer}.nl .hit:hover{fill:rgba(179,86,127,.15)}`;
  document.head.appendChild(css);
  window.DR = { dc, D, deep, show, place, vert, rline, nrm };
})();
                                 
