/* 🌸 صفحة مهارة: الكسور والعمليات الحسابية عليها (الهيكل + مرحلة «افتكري»)
   كود المهارة في skills.js هو s1k3 (التالتة في القسم الأول). لو عايزة تغيّريه غيّري السطر اللي تحت.
   الملفات المكمّلة: s1k3-b.js (الشرح التفاعلي) و s1k3-c.js (الأمثلة والتدريب والاختبار والملخص). */
(function () {
  const SKILL_ID = 's1k3', TITLE = 'الكسور والعمليات الحسابية عليها';
  const { dig, fmt, pie, bars, fig, gcd, qcard } = FR;
  const ORDER = [['f1', 0, 'يعني إيه كسر؟'], ['f2', 0, 'أنواع الكسور'], ['f3', 0, 'الكسور المتكافئة'], ['f4', 0, 'تبسيط الكسور'], ['f5', 0, 'مقارنة الكسور وترتيبها'], ['f6', 0, 'توحيد المقامات'],
    ['add', 1, 'جمع الكسور'], ['sub', 1, 'طرح الكسور'], ['mul', 1, 'ضرب الكسور'], ['div', 1, 'قسمة الكسور'], ['mix', 1, 'العمليات المركبة'],
    ['ex', 2, 'أمثلة محلولة'], ['pr1', 3, 'المستوى الأول: سهل'], ['pr2', 3, 'المستوى الثاني: متوسط'], ['pr3', 3, 'المستوى الثالث: متقدم'], ['quiz', 4, 'الاختبار النهائي'], ['sum', 5, 'ملخص المعلومة']];
  const STG = ['افتكري', 'افهمي', 'شوفي الحل', 'جربي', 'اختبري نفسك', 'الملخص'], ICO = ['🌱', '💡', '✏️', '🎮', '🧠', '🎀'];
  FR.ORDER = ORDER; FR.pg = {}; FR.SKILL_ID = SKILL_ID;

  const css = document.createElement('style');
  css.textContent = `.stps{padding-right:24px}.stps li{margin:6px 0}.fgb{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;direction:ltr;margin:8px 0}.wd{background:#fff8f2;border-radius:16px;padding:10px;margin-top:10px;text-align:center}
.wd .stp2{display:flex;gap:10px;justify-content:center;align-items:center;flex-wrap:wrap;direction:ltr;margin:6px 0}.wd .stp2 button,.mlist button{font:inherit;font-weight:800;border:0;border-radius:50%;width:42px;height:42px;background:var(--s);color:var(--deep);cursor:pointer;font-size:1.3rem}
.mlist{display:grid;gap:6px;margin:8px 0;direction:ltr}.mlist div{display:flex;gap:6px;flex-wrap:wrap;justify-content:center}.mlist span{background:#fff;border:2px solid var(--p);border-radius:12px;padding:0 10px;font-weight:700}.mlist span.cm{background:#fff3d6;border-color:#e0a526}
.wd .btn.sm2{padding:6px 16px;font-size:.95rem;margin:4px}.wd .chain{font-size:1.4rem;direction:ltr}`;
  document.head.appendChild(css);

  /* ---------- هيكل الصفحة ---------- */
  window.SKILL_PAGES = window.SKILL_PAGES || {};
  SKILL_PAGES[SKILL_ID] = function (root, api) {
    const P = api.get(SKILL_ID + '_prog') || {};
    P.page = P.page || 0; P.mx = P.mx || 0; ['ans', 'ex', 'pi', 'rv', 'st'].forEach(k => P[k] = P[k] || {});
    const save = () => api.set(SKILL_ID + '_prog', P);
    const go = i => { if (typeof i === 'string') i = ORDER.findIndex(x => x[0] === i); P.page = Math.max(0, Math.min(ORDER.length - 1, i)); P.mx = Math.max(P.mx, P.page); save(); draw(); window.scrollTo(0, 0); };
    const ask = (c, q, o) => {
      o = o || {}; const el = qcard(q, P.ans[q.id], { nm: api.nm(), head: o.head, nohint: o.nohint, onAnswer: (a, r, why) => { P.ans[q.id] = { a, r, why }; save(); if (o.after) o.after(a, r, el); } });
      c.appendChild(el); return el;
    };
    const ctx = { P, save, api, go, ask, gate: ok => { const b = root.querySelector('[data-n]'); if (b) b.disabled = !ok; } };
    function draw() {
      const [id, stg, title] = ORDER[P.page], n = ORDER.length;
      root.innerHTML = `<div class="crumb"><button class="sm" data-x="home">🏠 الأقسام</button><button class="sm" data-x="sec">⬅️ المهارات</button></div>
<section class="card pink"><div class="bow">🍕</div><h2>${TITLE}</h2></section>
<nav class="stg" aria-label="مراحل المهارة">${STG.map((s, i) => `<button data-st="${i}" class="${i === stg ? 'on' : i < stg ? 'dn' : ''}" ${i === stg ? 'aria-current="step"' : ''}><span>${ICO[i]}</span><small>${s}</small></button>`).join('')}</nav>
<div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round((P.page + 1) / n * 100)}"><i style="width:${(P.page + 1) / n * 100}%"></i></div>
<small>الصفحة ${dig(P.page + 1)} من ${dig(n)} · ${title}</small>
<div id="s3c"></div>
<div class="s1nav"><button class="btn" data-p ${P.page ? '' : 'disabled'}>➡️ السابق</button><button class="btn" data-n ${P.page < n - 1 ? '' : 'hidden'}>التالي ⬅️</button></div>`;
      const c = root.querySelector('#s3c');
      try { FR.pg[id](c, ctx); } catch (e) { c.innerHTML = '<section class="card"><p>حصلت مشكلة بسيطة في عرض الصفحة 💗 جرّبي ترجعي للمهارات وتفتحيها تاني.</p></section>'; if (window.console) console.error(e); }
      root.querySelector('[data-p]').onclick = () => go(P.page - 1);
      root.querySelector('[data-n]').onclick = () => go(P.page + 1);
      root.querySelectorAll('[data-st]').forEach(b => b.onclick = () => go(ORDER.findIndex(x => x[1] === +b.dataset.st)));
      root.querySelectorAll('[data-x]').forEach(b => b.onclick = () => api.go(b.dataset.x, SKILL_ID));
    }
    draw();
  };

  /* ---------- محرك الدروس: أجزاء بتظهر واحدة واحدة ---------- */
  function part(box, x, p, id) {
    const s = document.createElement('section'); s.className = 'card'; box.appendChild(s);
    s.innerHTML = `<h3>${p.t}</h3>${p.html ? '<p>' + fmt(p.html) + '</p>' : ''}${p.rule ? `<div class="rule">📌 ${fmt(p.rule)}</div>` : ''}${p.fig ? fig(p.fig) : ''}`;
    if (p.wd) W[p.wd](s, p.wa);
    if (p.steps) {
      const ol = document.createElement('ol'); ol.className = 'stps'; s.appendChild(ol);
      const b = document.createElement('button'); b.className = 'btn sm2'; b.textContent = 'الخطوة التالية ⬇️'; s.appendChild(b);
      const draw = () => { const k = x.P.st[id] || 0; ol.innerHTML = p.steps.slice(0, k).map(t => `<li>${fmt(t)}</li>`).join(''); b.hidden = k >= p.steps.length; };
      b.onclick = () => { x.P.st[id] = (x.P.st[id] || 0) + 1; x.save(); draw(); }; draw();
    }
    (p.qs || []).forEach((q, j) => x.ask(s, Object.assign({}, q, { id: id + '_' + j })));
    return s;
  }
  FR.lesson = parts => (c, x) => {
    const key = ORDER[x.P.page][0], box = document.createElement('div'); c.appendChild(box);
    let k = x.P.rv[key] || 1; const nb = document.createElement('button'); nb.className = 'btn'; nb.style.display = 'block'; nb.style.margin = '0 auto';
    const end = () => { nb.remove(); if (k < parts.length) { nb.textContent = 'كمّلي ⬇️ (' + dig(k) + ' من ' + dig(parts.length) + ')'; c.appendChild(nb); } else { const d = document.createElement('p'); d.className = 'sc'; d.style.textAlign = 'center'; d.textContent = '🎀 خلصتي الدرس! كمّلي للصفحة اللي بعدها'; c.appendChild(d); } };
    for (let i = 0; i < k; i++) part(box, x, parts[i], key + i);
    nb.onclick = () => { const s = part(box, x, parts[k], key + k); k++; x.P.rv[key] = k; x.save(); end(); s.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
    end();
  };

  /* ---------- أدوات تفاعلية ---------- */
  const W = FR.W = {
    builder(s) {
      let n = 1, d = 4; const w = document.createElement('div'); w.className = 'wd'; s.appendChild(w);
      const draw = () => {
        w.innerHTML = `<b>🎛️ غيّري البسط والمقام</b><div class="stp2"><div>المقام<br><button data-a="d-" aria-label="نقص المقام">−</button> <button data-a="d+" aria-label="زيادة المقام">+</button></div><div>${pie(n, d, 130)}</div><div>البسط<br><button data-a="n-" aria-label="نقص البسط">−</button> <button data-a="n+" aria-label="زيادة البسط">+</button></div></div><p class="qt">${fmt('{{' + n + '/' + d + '}}')}</p><p>قسمنا الكل لـ ${dig(d)} أجزاء متساوية وأخدنا ${dig(n)} ${n === 1 ? 'جزء' : 'أجزاء'}.</p>`;
        w.querySelectorAll('[data-a]').forEach(b => b.onclick = () => { const a = b.dataset.a; if (a === 'd+') d = Math.min(12, d + 1); if (a === 'd-') d = Math.max(1, d - 1); if (a === 'n+') n = Math.min(d, n + 1); if (a === 'n-') n = Math.max(0, n - 1); n = Math.min(n, d); draw(); });
      };
      draw();
    },
    equiv(s, [n0, d0]) {
      let k = 2; const w = document.createElement('div'); w.className = 'wd'; s.appendChild(w);
      const draw = () => {
        w.innerHTML = `<b>✖️ اضربي البسط والمقام في نفس العدد</b><div class="stp2"><button data-a="-" aria-label="نقص">−</button><b>× ${dig(k)}</b><button data-a="+" aria-label="زيادة">+</button></div><div class="figrow"><div class="fig">${bars(n0, d0, 120)}</div><div class="fig">${bars(n0 * k, d0 * k, 120)}</div></div><p class="chain">${fmt('{{' + n0 + '/' + d0 + ' = ' + (n0 * k) + '/' + (d0 * k) + '}}')}</p><p>الجزء المظلل في الشريطين نفسه تمامًا، يعني الكسرين نفس القيمة ✨</p>`;
        w.querySelectorAll('[data-a]').forEach(b => b.onclick = () => { k = Math.max(1, Math.min(6, k + (b.dataset.a === '+' ? 1 : -1))); draw(); });
      };
      draw();
    },
    simp(s, [n0, d0]) {
      let n = n0, d = d0; const w = document.createElement('div'); w.className = 'wd'; s.appendChild(w);
      const draw = () => {
        const ds = []; for (let k = 2; k <= Math.min(n, d); k++) if (n % k === 0 && d % k === 0) ds.push(k);
        w.innerHTML = `<b>➗ بسّطي الكسر بنفسك</b><p class="qt">${fmt('{{' + n + '/' + d + '}}')}</p>${ds.length ? '<p>اختاري عدد يقسم البسط والمقام:</p>' + ds.map(k => `<button class="btn sm2" data-k="${k}">÷ ${dig(k)}</button>`).join('') : '<p class="fb good">✅ ده أبسط صورة! مفيش عدد أكبر من ١ يقسم البسط والمقام معًا.</p>'}<br><button class="sm" data-r>↩️ ابدئي من الأول</button>`;
        w.querySelectorAll('[data-k]').forEach(b => b.onclick = () => { const k = +b.dataset.k; n /= k; d /= k; draw(); });
        w.querySelector('[data-r]').onclick = () => { n = n0; d = d0; draw(); };
      };
      draw();
    },
    mult(s, [a, b]) {
      let k = 1; const w = document.createElement('div'); w.className = 'wd'; s.appendChild(w);
      const draw = () => {
        const mx = a * k, A = [...Array(k)].map((_, i) => a * (i + 1)), B = []; for (let v = b; v <= Math.max(mx, b); v += b) B.push(v);
        let l = 0; for (let v = 1; v <= 200; v++) if (v % a === 0 && v % b === 0) { l = v; break; }
        const sh = (L, o) => L.map(v => `<span class="${v % o === 0 && v % (o === a ? b : a) === 0 ? 'cm' : ''}">${dig(v)}</span>`).join('');
        const found = mx >= l;
        w.innerHTML = `<b>🔢 مضاعفات ${dig(a)} و${dig(b)}</b><div class="mlist"><div>${dig(a)}: ${sh(A, a)}</div><div>${dig(b)}: ${sh(B, b)}</div></div>${found ? `<p class="fb good">⭐ أول رقم مشترك هو ${dig(l)}، وده <b>المضاعف المشترك الأصغر</b>.</p>` : `<button class="btn sm2" data-m>المضاعف اللي بعده ➕</button>`}`;
        const m = w.querySelector('[data-m]'); if (m) m.onclick = () => { k++; draw(); };
      };
      draw();
    }
  };

  /* ---------- مساعدات الأسئلة الصغيرة ---------- */
  const M = (t, o, c, w) => ({ type: 'mcq', t, o, c, w, kind: 'نشاط صغير' }), T = (t, c, w) => ({ type: 'tf', t, c, w, kind: 'نشاط صغير' });
  const N = (t, a, w) => ({ type: 'num', t, a, w, kind: 'نشاط صغير' }), Fq = (t, a, w, form) => ({ type: 'frac', t, a, w, form, kind: 'نشاط صغير' });
  FR.mk = { M, T, N, F: Fq };

  /* ---------- أولًا: افتكري المعلومة (٦ دروس) ---------- */
  const PG = FR.pg, L = FR.lesson;
  PG.f1 = L([
    { t: '🍕 الكسر هو جزء من كل', html: 'لو عندنا بيتزا اتقسمت لـ {{4}} أجزاء <b>متساوية</b> وأخدنا جزء واحد، يبقى أخدنا «واحد من أربعة» وبنكتبها {{1/4}}. الكسر طريقة نعبّر بيها عن <b>جزء من كل</b>.', fig: ['pie', 1, 4] },
    { t: '🔍 البسط والمقام', html: 'في أي كسر في عددين:', rule: '<b>البسط</b>: العدد اللي فوق خط الكسر، وبيقول عدد الأجزاء اللي معانا.<br><b>المقام</b>: العدد اللي تحت الخط، وبيقول الكل اتقسم لكام جزء متساوي.', fig: ['pie', 3, 5], qs: [M('في الكسر {{3/5}}: الكل اتقسم لكام جزء متساوي؟', ['3 أجزاء', '5 أجزاء', '8 أجزاء'], 1, 'المقام {{5}} بيقول إن الكل اتقسم لـ {{5}} أجزاء، والبسط {{3}} عدد الأجزاء اللي معانا.')] },
    { t: '🎛️ جرّبي بنفسك', html: 'غيّري البسط والمقام وشوفي الرسم والكسر بيتغيروا:', wd: 'builder' },
    { t: '⚠️ معلومة مهمة', html: '<b>المقام مش ممكن يبقى صفر</b>، لأنه مفيش حاجة اسمها نقسّم الكل لصفر أجزاء.', qs: [T('هل ممكن نكتب كسر مقامه {{0}}؟', false, 'مستحيل، لأن المقام هو عدد الأجزاء المتساوية، ومينفعش يكون صفر.'), N('ما بسط الكسر {{4/9}}؟', 4, 'البسط هو العدد اللي فوق: {{4}}.')] }
  ]);
  PG.f2 = L([
    { t: '🔹 الكسر الفعلي', html: 'البسط فيه <b>أصغر</b> من المقام، مثل {{2/5}}. قيمته أقل من الواحد الصحيح.', fig: ['bars', 2, 5] },
    { t: '🔹 الكسر غير الفعلي', html: 'البسط <b>أكبر من المقام أو يساويه</b>، مثل {{7/4}} و{{5/5}}. قيمته أكبر من الواحد الصحيح أو تساويه.', fig: ['bars', 7, 4], qs: [M('أي الكسور دي كسر غير فعلي؟', ['{{3/4}}', '{{5/5}}', '{{1/2}}'], 1, '{{5/5}} بسطه يساوي مقامه، فهو كسر غير فعلي. الباقي بسطهم أصغر من مقامهم.')] },
    { t: '🔹 العدد الكسري', html: 'عدد صحيح ومعاه كسر فعلي، مثل {{2~1/3}} (يعني اتنين وتلت).', fig: ['bars', 7, 3] },
    { t: '🔁 من عدد كسري لكسر غير فعلي', html: 'مثال: {{2~1/3}}', steps: ['نضرب العدد الصحيح في المقام: {{2 * 3 = 6}}.', 'نضيف البسط: {{6 + 1 = 7}}.', 'نحط الناتج في البسط ونحتفظ بنفس المقام: {{7/3}}.'], qs: [Fq('حوّلي {{3~1/4}} إلى كسر غير فعلي.', '13/4', '{{3 * 4 + 1 = 13}} فالكسر {{13/4}}.', 'improper')] },
    { t: '🔁 من كسر غير فعلي لعدد كسري', html: 'مثال: {{11/4}}', steps: ['نقسم البسط على المقام: {{11 ÷ 4}} الناتج {{2}} والباقي {{3}}.', 'الناتج {{2}} هو العدد الصحيح.', 'الباقي {{3}} هو البسط الجديد والمقام زي ما هو: {{2~3/4}}.'], qs: [Fq('حوّلي {{7/3}} إلى عدد كسري.', '2 1/3', '{{7 ÷ 3}} الناتج {{2}} والباقي {{1}} فالعدد الكسري {{2~1/3}}.', 'mixed')] }
  ]);
  PG.f3 = L([
    { t: '🟰 نفس القيمة بأشكال مختلفة', html: 'الكسور المتكافئة مختلفة في الشكل لكن <b>نفس القيمة</b>: {{1/2 = 2/4 = 3/6}}. شوفي الجزء المظلل في كل رسم:', fig: ['row', [1, 2], [2, 4], [3, 6]] },
    { t: '✖️ إزاي نعمل كسر مكافئ؟', rule: 'نضرب البسط والمقام في <b>نفس العدد</b> (غير الصفر)، أو نقسمهما على نفس العدد المشترك.', html: 'مثال: {{2/3 = 4/6}} (ضربنا في {{2}}).', wd: 'equiv', wa: [1, 2] },
    { t: '🎮 جرّبي', qs: [M('أي الكسور يكافئ {{3/5}}؟', ['{{6/10}}', '{{6/8}}', '{{3/10}}'], 0, 'ضربنا البسط والمقام في {{2}}: {{3/5 = 6/10}}.'), N('أكملي: {{2/5 = ▢/15}}', 6, 'المقام اتضرب في {{3}} فالبسط كمان: {{2 * 3 = 6}}.')] }
  ]);
  PG.f4 = L([
    { t: '✂️ يعني إيه نبسّط؟', html: 'تبسيط الكسر يعني نكتبه في <b>أبسط صورة</b> بقسمة البسط والمقام على نفس العدد. مثال: {{8/12}}', steps: ['نبحث عن عدد يقسم {{8}} و{{12}} معًا: {{4}}.', 'نقسم البسط: {{8 ÷ 4 = 2}}.', 'نقسم المقام: {{12 ÷ 4 = 3}}.', 'أبسط صورة هي {{2/3}}.'] },
    { t: '🔑 العامل المشترك الأكبر', html: 'هو أكبر عدد يقسم العددين معًا. عوامل {{8}}: 1 ، 2 ، 4 ، 8. وعوامل {{12}}: 1 ، 2 ، 3 ، 4 ، 6 ، 12. أكبر عامل مشترك هو {{4}}.', rule: 'الكسر في أبسط صورة لما <b>مفيش عدد أكبر من ١</b> يقسم البسط والمقام معًا.' },
    { t: '🎛️ جرّبي بنفسك', html: 'بسّطي الكسر خطوة بخطوة:', wd: 'simp', wa: [12, 18] },
    { t: '🎮 جرّبي', qs: [Fq('بسّطي الكسر {{9/12}}.', '3/4', 'نقسم على {{3}}: {{9/12 = 3/4}}.'), M('أي الكسور دي في أبسط صورة؟', ['{{4/6}}', '{{3/7}}', '{{5/10}}'], 1, '{{3}} و{{7}} مفيش عدد أكبر من ١ يقسمهم معًا. {{4/6}} بتتبسط لـ {{2/3}} و{{5/10}} لـ {{1/2}}.')] }
  ]);
  PG.f5 = L([
    { t: '⚖️ نفس المقام', html: 'لو المقامات متساوية بنقارن <b>البسطين</b>: الأكبر بسطًا هو الأكبر. {{3/7}} أصغر من {{5/7}}.', fig: ['row', [3, 7], [5, 7]], qs: [M('أيهما أكبر: {{4/9}} أم {{7/9}}؟', ['{{4/9}}', '{{7/9}}'], 1, 'المقامان متساويان، فنقارن البسطين: {{7 > 4}} فـ {{7/9}} أكبر.')] },
    { t: '⚖️ نفس البسط', html: 'لو البسطين متساويين، الكسر ذو <b>المقام الأصغر</b> هو الأكبر (لأن أجزاءه أكبر). {{2/3}} أكبر من {{2/5}}.', fig: ['row', [2, 3], [2, 5]] },
    { t: '⚖️ مقامات مختلفة', html: 'نوحّد المقامات أو نستخدم الضرب التبادلي. مثال: {{1/2}} و{{2/5}}', steps: ['<b>توحيد المقامات:</b> {{1/2 = 5/10}} و{{2/5 = 4/10}}.', 'بما إن {{5 > 4}} فـ {{1/2}} أكبر من {{2/5}}.', '<b>الضرب التبادلي:</b> {{1 * 5 = 5}} و{{2 * 2 = 4}}.', '{{5 > 4}} يبقى {{1/2}} هو الأكبر.'] },
    { t: '📊 ترتيب الكسور', html: 'نرتّب {{1/2}} ، {{1/3}} ، {{3/4}} تصاعديًا:', steps: ['نوحّد المقامات على {{12}}: {{6/12}} ، {{4/12}} ، {{9/12}}.', 'نرتّب البسطين: {{4}} ثم {{6}} ثم {{9}}.', 'الترتيب التصاعدي: {{1/3}} ثم {{1/2}} ثم {{3/4}}.'], qs: [{ type: 'order', kind: 'نشاط صغير', t: 'رتّبي تصاعديًا: {{2/3}} ، {{1/6}} ، {{1/2}}', items: ['1/6', '1/2', '2/3'], w: 'بتوحيد المقامات على {{6}}: {{4/6}} ، {{1/6}} ، {{3/6}} ← {{1/6}} ثم {{1/2}} ثم {{2/3}}.' }] }
  ]);
  PG.f6 = L([
    { t: '🤝 ليه نوحّد المقامات؟', html: 'توحيد المقامات يعني نحوّل الكسور لكسور مكافئة <b>ليها نفس المقام</b>، عشان نقدر نجمعها ونطرحها بسهولة. مثال: {{1/2}} و{{1/3}}.' },
    { t: '🔢 المضاعفات المشتركة', html: 'اضغطي واكتشفي أول مضاعف مشترك للعددين {{2}} و{{3}}:', wd: 'mult', wa: [2, 3] },
    { t: '🔄 نحوّل الكسور', html: 'المضاعف المشترك الأصغر لـ {{2}} و{{3}} هو {{6}}.', steps: ['{{1/2 = 3/6}} (ضربنا في {{3}}).', '{{1/3 = 2/6}} (ضربنا في {{2}}).', 'بعد التوحيد الكسران هما {{3/6}} و{{2/6}}.'], qs: [N('ما المضاعف المشترك الأصغر لـ {{4}} و{{6}}؟', 12, 'مضاعفات {{4}}: 4 ، 8 ، 12. ومضاعفات {{6}}: 6 ، 12. أول رقم مشترك {{12}}.'), N('وحّدي المقام: {{1/4 = ▢/12}}', 3, '{{12 ÷ 4 = 3}} فنضرب البسط في {{3}}: {{1 * 3 = 3}}.')] }
  ]);
})();
    
