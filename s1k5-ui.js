/* 🌸 أدوات مهارة القوى والأسس والمتطابقات الجبرية
   (بتضيف أنواع أسئلة جديدة وأدوات تفاعلية على محرك الكسور من غير ما تعدّل فيه)
   كتابة الرياضيات بين {{ }} :  الأس بعد ^  مثل  س^2  و  2^-3  ، والأس المركّب بين [ ]  مثل  أ^[ن+م]
   الكسر الحرفي: ⟦البسط|المقام⟧  مثل  ⟦س|ص⟧  ، الأعداد تتكتب لاتيني وبتتحول لعربي هندي تلقائيًا */
(function () {
  const { dig, fmt, gcd } = FR, AR = '٠١٢٣٤٥٦٧٨٩';
  const SUPRE = /\^\[([^\]]*)\]|\^(-?(?:\d+|[a-zA-Zء-ي]))/g;
  const sup = s => s.replace(SUPRE, (m, a, b) => `<sup>${a !== undefined ? a : b}</sup>`);
  const fr = (n, d) => `<span class="fr"><span class="fn">${n}</span><span class="fd">${d}</span></span>`;
  const pwE = e => sup(e.replace(/⟦(.+?)\|(.+?)⟧/g, (m, a, b) => fr(sup(a), sup(b))));
  const D = s => s.replace(/\{\{(.+?)\}\}/g, (m, e) => '{{' + pwE(e) + '}}');
  const SKIP = { a: 1, v: 1, c: 1, wa: 1, type: 1, id: 1, form: 1, topic: 1, lv: 1, pw: 1 };
  const deep = o => typeof o === 'string' ? D(o) : Array.isArray(o) ? o.map(deep) : o && typeof o === 'object' ? Object.fromEntries(Object.entries(o).map(([k, v]) => [k, SKIP[k] ? v : k === 'items' ? v.map(pwE) : deep(v)])) : o;
  const nrm = s => String(s).replace(/[٠-٩]/g, d => AR.indexOf(d)).replace(/[−–—‒]/g, '-').replace(/[\s+]/g, '');
  const F = s => fmt(D('{{' + s + '}}'));

  /* صيغة كثير الحدود من المعاملات: polyStr([1,0,-9],[2,1,0],'س') ← "س^2 - 9" */
  function polyStr(a, pw, v) {
    v = v || 'س'; let s = '';
    a.forEach((c, i) => {
      if (!c) return; const p = pw[i], ab = Math.abs(c), body = (p === 0 ? String(ab) : (ab === 1 ? '' : ab) + v + (p === 1 ? '' : '^' + p));
      s += (s ? (c < 0 ? ' - ' : ' + ') : (c < 0 ? '-' : '')) + body;
    });
    return s || '0';
  }

  /* ---------- نوع سؤال: عدد صحيح (يقبل سالب) ---------- */
  const minus = '<button class="sm" data-neg type="button" aria-label="إشارة سالب">− إشارة</button>';
  FR.TY.int5 = {
    tag: 'اكتبي الناتج',
    build: () => `<div class="inrow"><input class="ans" dir="ltr" inputmode="text" autocomplete="off" placeholder="اكتبي العدد" aria-label="الإجابة">${minus}<button class="btn" data-ok type="button">تحقّقي ✔️</button></div><small>لو العدد سالب اكتبي إشارة − قبله.</small>`,
    check: (q, a) => ({ r: nrm(a) === String(q.a) }),
    corr: q => fmt('{{' + q.a + '}}'),
    bind(el, q, go) {
      const i = el.querySelector('.ans'), f = () => /^-?\d+$/.test(nrm(i.value)) ? go(i.value) : i.focus();
      el.querySelector('[data-ok]').onclick = f; i.onkeydown = e => { if (e.key === 'Enter') f(); };
      el.querySelector('[data-neg]').onclick = () => { const v = i.value.trim(); i.value = /^[-−]/.test(v) ? v.slice(1) : '-' + v; i.focus(); };
    },
    paint(el, q, a, r) { const i = el.querySelector('.ans'); i.value = dig(String(a).replace(/-/g, '−')); i.disabled = true; i.classList.add(r ? 'ok' : 'no'); el.querySelectorAll('.inrow button').forEach(b => b.disabled = true); }
  };

  /* ---------- نوع سؤال: اكتبي معاملات المقدار الجبري ---------- */
  FR.TY.poly = {
    tag: 'اكتبي الناتج',
    build(q) {
      const v = q.v || 'س';
      return `<div class="pf" dir="ltr">${q.pw.map((p, i) => `${i ? '<span class="pl2">+</span>' : ''}<span class="pc"><input class="pcf" inputmode="text" autocomplete="off" aria-label="معامل ${p === 0 ? 'الحد الثابت' : v + (p > 1 ? ' أس ' + p : '')}">${p === 0 ? '' : '<b>' + F(v + (p === 1 ? '' : '^' + p)) + '</b>'}</span>`).join('')}</div><div class="inrow">${minus}<button class="btn" data-ok type="button">تحقّقي ✔️</button></div><small>اكتبي معامل كل حد بإشارته (مثلًا −٤)، ولو الحد مش موجود اكتبي ٠.</small>`;
    },
    check: (q, a) => ({ r: a.length === q.a.length && a.every((x, i) => +x === q.a[i]) }),
    corr: q => F(polyStr(q.a, q.pw, q.v)),
    bind(el, q, go) {
      const ins = [...el.querySelectorAll('.pcf')]; let last = ins[0];
      ins.forEach(i => { i.onfocus = () => last = i; i.onkeydown = e => { if (e.key === 'Enter') f(); }; });
      const f = () => { const v = ins.map(i => nrm(i.value)); const bad = v.findIndex(x => !/^-?\d+$/.test(x)); if (bad >= 0) ins[bad].focus(); else go(v.map(Number)); };
      el.querySelector('[data-ok]').onclick = f;
      el.querySelector('[data-neg]').onclick = () => { const v = last.value.trim(); last.value = /^[-−]/.test(v) ? v.slice(1) : '-' + v; last.focus(); };
    },
    paint(el, q, a, r) { el.querySelectorAll('.pcf').forEach((i, k) => { i.value = dig(String(a[k]).replace(/-/g, '−')); i.disabled = true; i.classList.add(+a[k] === q.a[k] ? 'ok' : 'no'); }); el.querySelectorAll('.inrow button').forEach(b => b.disabled = true); }
  };

  /* ---------- أداة: القوة = ضرب متكرر ---------- */
  function pow(sec) {
    let b = 2, n = 3; const w = document.createElement('div'); w.className = 'wd'; sec.appendChild(w);
    const draw = () => {
      const v = Math.pow(b, n), alt = b * n;
      w.innerHTML = `<b>🎛️ غيّري الأساس والأس</b><div class="stp2"><div>الأساس<br><button data-a="b-" aria-label="نقص الأساس">−</button> <button data-a="b+" aria-label="زيادة الأساس">+</button></div><div>الأس<br><button data-a="n-" aria-label="نقص الأس">−</button> <button data-a="n+" aria-label="زيادة الأس">+</button></div></div>
<p class="chain">${F(Array(n).fill(b).join(' * ') + ' = ' + b + '^' + n + ' = ' + v)}</p><p>الأساس ${dig(b)} اتكرر في الضرب ${dig(n)} ${n < 3 ? 'مرتين' : 'مرات'}.</p><p class="fb ${n === 1 ? '' : 'good'}">${n === 1 ? 'الأس ١ يعني الأساس زي ما هو.' : `لاحظي: ${F(b + '^' + n + ' = ' + v)} لكن ${F(b + ' * ' + n + ' = ' + alt)} 👀 مش نفس الشيء!`}</p>`;
      w.querySelectorAll('[data-a]').forEach(x => x.onclick = () => { const a = x.dataset.a; if (a === 'b+') b = Math.min(9, b + 1); if (a === 'b-') b = Math.max(2, b - 1); if (a === 'n+') n = Math.min(6, n + 1); if (a === 'n-') n = Math.max(1, n - 1); draw(); });
    };
    draw();
  }

  /* ---------- أداة: بطاقات القوانين (اضغطي على القانون يظهر مثال) ---------- */
  const LAWS = [['أ^ن × أ^م = أ^[ن+م]', '2^2 × 2^3 = 2^[2+3] = 2^5 = 32', 'نجمع الأسس عند الضرب (نفس الأساس).'], ['أ^ن ÷ أ^م = أ^[ن-م]', '2^5 ÷ 2^2 = 2^[5-2] = 2^3 = 8', 'نطرح الأسس عند القسمة (نفس الأساس).'], ['(أ^ن)^م = أ^[ن×م]', '(2^3)^2 = 2^[3×2] = 2^6 = 64', 'نضرب الأسس في قوة القوة.'], ['(أ × ب)^ن = أ^ن × ب^ن', '(2 × 3)^2 = 2^2 × 3^2 = 36', 'القوة بتتوزع على كل عامل.'], ['(⟦أ|ب⟧)^ن = ⟦أ^ن|ب^ن⟧', '(⟦2|3⟧)^2 = ⟦4|9⟧', 'القوة بتتوزع على البسط والمقام.'], ['أ^0 = 1', '5^0 = 1', 'أي عدد (غير الصفر) أسّه صفر يساوي واحد.'], ['أ^-ن = ⟦1|أ^ن⟧', '3^-2 = ⟦1|9⟧', 'الأس السالب معناه مقلوب القوة.']];
  function laws(sec) {
    const w = document.createElement('div'); w.className = 'wd'; sec.appendChild(w);
    w.innerHTML = `<b>🃏 اضغطي على أي قانون</b><div class="lw">${LAWS.map((l, i) => `<button class="opt" data-i="${i}" dir="ltr">${dig(i + 1)}. ${F(l[0])}</button>`).join('')}</div><div class="lwm" aria-live="polite"></div>`;
    w.querySelectorAll('[data-i]').forEach(b => b.onclick = () => { const l = LAWS[+b.dataset.i]; w.querySelectorAll('[data-i]').forEach(x => x.classList.remove('sel')); b.classList.add('sel'); w.querySelector('.lwm').innerHTML = `<p class="chain">${F(l[1])}</p><p class="fb good">${l[2]}</p>`; });
  }

  /* ---------- أداة: نموذج المساحة لمربع مجموع حدين (س + ب)² ---------- */
  function area(sec, [b]) {
    const w = document.createElement('div'); w.className = 'wd'; sec.appendChild(w);
    const A = 130, B = Math.max(40, b * 22), T = A + B, P = [[0, 0, A, A, 'س²', 'مربع طول ضلعه س، مساحته س²'], [A, 0, B, A, b + 'س', 'مستطيل أبعاده س و' + dig(b) + '، مساحته ' + dig(b) + 'س'], [0, A, A, B, b + 'س', 'مستطيل أبعاده ' + dig(b) + ' و س، مساحته ' + dig(b) + 'س'], [A, A, B, B, String(b * b), 'مربع طول ضلعه ' + dig(b) + '، مساحته ' + dig(b * b)]];
    w.innerHTML = `<b>🟪 مساحة مربع ضلعه ${F('(س + ' + b + ')')}</b><p>اضغطي على كل جزء:</p><svg viewBox="0 0 ${T + 20} ${T + 20}" class="ar5" role="img" aria-label="نموذج المساحة" style="max-width:260px;width:100%;display:block;margin:auto">${P.map((p, i) => `<g data-i="${i}" class="pc5"><rect x="${p[0] + 10}" y="${p[1] + 10}" width="${p[2]}" height="${p[3]}" rx="6"/><text x="${p[0] + 10 + p[2] / 2}" y="${p[1] + 10 + p[3] / 2 + 6}" text-anchor="middle">${p[4].replace(/\d+/g, dig).replace('²', '²')}</text></g>`).join('')}</svg><p class="am" aria-live="polite">المساحة الكلية = مجموع الأجزاء الأربعة.</p><p class="chain">${F('(س + ' + b + ')^2 = س^2 + ' + 2 * b + 'س + ' + b * b)}</p>`;
    w.querySelectorAll('.pc5').forEach(g => g.onclick = () => { w.querySelectorAll('.pc5').forEach(x => x.classList.remove('on')); g.classList.add('on'); w.querySelector('.am').innerHTML = P[+g.dataset.i][5].replace(/\d+/g, dig); });
  }

  /* ---------- أداة: جدول الضرب (كل حد × كل حد) بالضغط ---------- */
  function boxm(sec, s) {
    const w = document.createElement('div'); w.className = 'wd'; sec.appendChild(w); let k = 0; const N = s.cells.length * s.cells[0].length;
    const draw = () => {
      let i = 0; const rows = s.cells.map((row, r) => `<tr><th>${F(s.r[r])}</th>${row.map((c, cc) => `<td class="${i++ < k ? 'sh' : ''}">${(i - 1) < k ? F(c) : '؟'}</td>`).join('')}</tr>`).join('');
      w.innerHTML = `<b>✖️ كل حد في القوس الأول × كل حد في القوس الثاني</b><table class="bx" dir="ltr"><tr><th></th>${s.c.map(c => `<th>${F(c)}</th>`).join('')}</tr>${rows}</table>${k < N ? `<button class="btn sm2" data-bx>اضربي الخانة التالية ✖️ (${dig(k + 1)} من ${dig(N)})</button>` : `<p class="fb good">${F(s.sum)}</p><p>بعد ما ضربنا كل الخانات، بنجمع الحدود المتشابهة ✨</p>`}`;
      const b = w.querySelector("[data-bx]"); if (b) b.onclick = () => { k++; draw(); };
    };
    draw();
  }

  const css = document.createElement('style');
  css.textContent = `.ex sup{font-size:.72em;vertical-align:.45em;line-height:0;margin-inline-start:1px}.pf{display:flex;gap:6px;align-items:flex-end;justify-content:center;flex-wrap:wrap;margin:10px 0}.pc{display:inline-flex;align-items:center;gap:2px}.pc b{font-size:1.2rem;color:var(--deep)}.pl2{font-size:1.3rem;font-weight:800;color:var(--deep);padding:0 2px}
.pcf{font:inherit;font-size:1.1rem;font-weight:800;text-align:center;border:2px solid var(--p);border-radius:12px;padding:6px 2px;min-height:46px;width:62px;background:#fff;color:var(--ink)}.pcf.ok{background:#dff3e4;border-color:#2e8b57}.pcf.no{background:#fde0e6;border-color:#c0392b}
.lw{display:grid;gap:6px;margin:8px 0}.lw .opt{text-align:center}.lwm{margin-top:8px}.bx{border-collapse:separate;border-spacing:6px;margin:8px auto;font-size:1.2rem;font-weight:700}.bx th{color:var(--deep);padding:4px 8px}.bx td{background:#fff;border:2px solid var(--p);border-radius:12px;padding:8px 14px;min-width:64px;text-align:center;color:var(--ink)}.bx td.sh{background:#fff3d6;border-color:#e0a526}
.pc5 rect{fill:#fff;stroke:var(--p);stroke-width:3;cursor:pointer}.pc5 text{font-size:20px;font-weight:800;fill:var(--deep);pointer-events:none}.pc5.on rect{fill:#fff3d6;stroke:#e0a526}`;
  document.head.appendChild(css);
  window.AL = { D, deep, pwE, F, polyStr, nrm, pow, laws, area, boxm };
})();
                                                                  
