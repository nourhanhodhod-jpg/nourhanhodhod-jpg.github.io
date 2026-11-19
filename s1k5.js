/* 🌸 صفحة مهارة: القوى والأسس وفك الأقواس والمتطابقات الجبرية (الهيكل + مرحلة «افتكري»)
   كود المهارة في skills.js هو s1k5 (الخامسة في القسم الأول: «القوى والأسس وقوانينها»). لو عايزة تغيّريه غيّري السطر اللي تحت.
   الملفات المكمّلة: s1k5-b.js (الشرح التفاعلي) و s1k5-bank.js (الأسئلة) و s1k5-c.js (الأمثلة والتدريب والاختبار والملخص). */
(function () {
  const { dig, fmt, qcard } = FR;
  const SKILL_ID = 's1k5', TITLE = 'القوى والأسس وفك الأقواس والمتطابقات الجبرية';
  
  const ORDER = [['r1', 0, 'يعني إيه قوة أو أس؟'], ['r2', 0, 'الأسس الموجبة'], ['r3', 0, 'الأس صفر'], ['r4', 0, 'الأس السالب'], ['r5', 0, 'مراجعة العمليات الجبرية'],
    ['l1', 1, 'ضرب القوى (نفس الأساس)'], ['l2', 1, 'قسمة القوى (نفس الأساس)'], ['l3', 1, 'قوة القوة'], ['l4', 1, 'قوة حاصل الضرب'], ['l5', 1, 'قوة حاصل القسمة'], ['l6', 1, 'قوانين الأسس كلها'], ['l7', 1, 'فك الأقواس بالتوزيع'], ['l8', 1, 'مربع مجموع حدين'], ['l9', 1, 'مربع الفرق بين حدين'], ['l10', 1, 'ضرب قوسين في بعض'], ['l11', 1, 'ضرب القوسين المترافقين'], ['l12', 1, 'الفرق بين مربعين'], ['l13', 1, 'تبسيط المقادير الجبرية'],
    ['ex', 2, 'أمثلة محلولة'], ['pr1', 3, 'المستوى الأول: سهل'], ['pr2', 3, 'المستوى الثاني: متوسط'], ['pr3', 3, 'المستوى الثالث: متقدم'], ['quiz', 4, 'الاختبار النهائي'], ['sum', 5, 'ملخص المعلومة']];
  const STG = ['افتكري', 'افهمي', 'شوفي الحل', 'جربي', 'اختبري نفسك', 'الملخص'], ICO = ['🌱', '💡', '✏️', '🎮', '🧠', '🎀'];
  const PG = AL.pg = {}; AL.ORDER = ORDER; AL.SKILL_ID = SKILL_ID;

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
<section class="card pink"><div class="bow">🚀</div><h2>${TITLE}</h2></section>
<nav class="stg" aria-label="مراحل المهارة">${STG.map((s, i) => `<button data-st="${i}" class="${i === stg ? 'on' : i < stg ? 'dn' : ''}" ${i === stg ? 'aria-current="step"' : ''}><span>${ICO[i]}</span><small>${s}</small></button>`).join('')}</nav>
<div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round((P.page + 1) / n * 100)}"><i style="width:${(P.page + 1) / n * 100}%"></i></div>
<small>الصفحة ${dig(P.page + 1)} من ${dig(n)} · ${title}</small>
<div id="s5c"></div>
<div class="s1nav"><button class="btn" data-p ${P.page ? '' : 'disabled'}>➡️ السابق</button><button class="btn" data-n ${P.page < n - 1 ? '' : 'hidden'}>التالي ⬅️</button></div>`;
      const c = root.querySelector('#s5c');
      try { PG[id](c, ctx); } catch (e) { c.innerHTML = '<section class="card"><p>حصلت مشكلة بسيطة في عرض الصفحة 💗 جرّبي ترجعي للمهارات وتفتحيها تاني.</p></section>'; if (window.console) console.error(e); }
      root.querySelector('[data-p]').onclick = () => go(P.page - 1);
      root.querySelector('[data-n]').onclick = () => go(P.page + 1);
      root.querySelectorAll('[data-st]').forEach(b => b.onclick = () => go(ORDER.findIndex(x => x[1] === +b.dataset.st)));
      root.querySelectorAll('[data-x]').forEach(b => b.onclick = () => api.go(b.dataset.x, SKILL_ID));
    }
    draw();
  };

  const W = { pow: s => AL.pow(s), laws: s => AL.laws(s), area: (s, a) => AL.area(s, a), boxm: (s, a) => AL.boxm(s, a) };
  /* ---------- محرك الدروس: أجزاء بتظهر واحدة واحدة ---------- */
  function part(box, x, p, id) {
    const s = document.createElement('section'); s.className = 'card'; box.appendChild(s);
    s.innerHTML = `<h3>${fmt(p.t)}</h3>${p.html ? '<p>' + fmt(p.html) + '</p>' : ''}${p.rule ? `<div class="rule">📌 ${fmt(p.rule)}</div>` : ''}`;
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
  AL.lesson = parts => { parts = AL.deep(parts); return (c, x) => {
    const key = ORDER[x.P.page][0], box = document.createElement('div'); c.appendChild(box);
    let k = x.P.rv[key] || 1; const nb = document.createElement('button'); nb.className = 'btn'; nb.style.display = 'block'; nb.style.margin = '0 auto';
    const end = () => { nb.remove(); if (k < parts.length) { nb.textContent = 'كمّلي ⬇️ (' + dig(k) + ' من ' + dig(parts.length) + ')'; c.appendChild(nb); } else { const d = document.createElement('p'); d.className = 'sc'; d.style.textAlign = 'center'; d.textContent = '🎀 خلصتي الدرس! كمّلي للصفحة اللي بعدها'; c.appendChild(d); } };
    for (let i = 0; i < k; i++) part(box, x, parts[i], key + i);
    nb.onclick = () => { const s = part(box, x, parts[k], key + k); k++; x.P.rv[key] = k; x.save(); end(); s.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
    end();
  }; };

  /* ---------- مساعدات الأسئلة الصغيرة ---------- */
  const K = 'نشاط صغير';
  const M = (t, o, c, w) => ({ type: 'mcq', t, o, c, w, kind: K }), T = (t, c, w) => ({ type: 'tf', t, c, w, kind: K });
  const I = (t, a, w) => ({ type: 'int5', t, a, w, kind: K }), Pl = (t, pw, a, w, v) => ({ type: 'poly', t, pw, a, w, v, kind: K }), Fq = (t, a, w) => ({ type: 'frac', t, a, w, kind: K });
  AL.mk = { M, T, I, Pl, Fq };
  const L = AL.lesson;
  /* ---------- أولًا: افتكري المعلومة (٥ دروس) ---------- */
  PG.r1 = L([
    { t: '✖️ تكرار الضرب', html: 'لو عايزين نضرب {{2}} في نفسها تلات مرات، بدل ما نكتب {{2 × 2 × 2}} بنكتبها بشكل مختصر: {{2^3}}. وده بنسميه <b>قوة</b>. {{2 × 2 × 2 = 2^3 = 8}}.' },
    { t: '🔍 الأساس والأس', html: 'في القوة {{2^3}}:', rule: '<b>الأساس</b>: العدد اللي بيتكرر ضربه في نفسه (هنا {{2}}).<br><b>الأس</b>: العدد الصغير فوق، وبيقول الأساس اتكرر كام مرة (هنا {{3}}).', qs: [M('في القوة {{5^2}} ما الأساس؟', ['{{5}}', '{{2}}', '{{25}}'], 0, 'الأساس هو العدد الكبير اللي بيتكرر ضربه: {{5}}.')] },
    { t: '🎛️ جرّبي بنفسك', html: 'غيّري الأساس والأس وشوفي الضرب المتكرر:', wd: 'pow' },
    { t: '📚 أمثلة متنوعة', html: '{{3^2 = 3 × 3 = 9}} ، {{5^3 = 5 × 5 × 5 = 125}} ، {{4^2 = 16}} ، {{10^2 = 100}}.' },
    { t: '⚠️ مش نفس الشيء!', html: '{{3^2}} معناها {{3 × 3 = 9}}، لكن {{3 × 2}} معناها {{6}}. الأس <b>مش</b> بيتضرب في الأساس.', qs: [T('{{3^2 = 6}}', false, '{{3^2 = 3 × 3 = 9}} وليس {{6}}.'), I('احسبي {{4^2}}', 16, '{{4 × 4 = 16}}.')] }
  ]);
  PG.r2 = L([
    { t: '🔢 الأس الموجب', html: 'الأس الموجب بيقول أضرب الأساس في نفسه كام مرة. {{2^4 = 2 × 2 × 2 × 2 = 16}}.' },
    { t: '📚 أمثلة', html: '{{3^3 = 3 × 3 × 3 = 27}} ، {{5^2 = 25}} ، {{10^3 = 10 × 10 × 10 = 1000}}.', rule: 'الأس يحدد <b>عدد مرات ضرب الأساس في نفسه</b>، وليس ضرب الأساس في الأس.', qs: [I('احسبي {{2^3}}', 8, '{{2 × 2 × 2 = 8}}.'), I('احسبي {{10^3}}', 1000, '{{10 × 10 × 10 = 1000}}.')] },
    { t: '🤔 فكري', qs: [M('إيه قيمة {{2^4}}؟', ['{{8}}', '{{16}}', '{{6}}'], 1, '{{2 × 2 × 2 × 2 = 16}}. القيمة {{8}} هي {{2 × 4}} وده غلط.')] }
  ]);
  PG.r3 = L([
    { t: '0️⃣ الأس صفر'.replace('0️⃣', '⭕'), html: 'أي عدد غير الصفر مرفوع للأس صفر يساوي <b>واحد</b>.', rule: '{{أ^0 = 1}} بشرط {{أ ≠ 0}}.' },
    { t: '📚 أمثلة', html: '{{5^0 = 1}} ، {{10^0 = 1}} ، {{(-3)^0 = 1}}.', qs: [I('احسبي {{7^0}}', 1, 'أي عدد غير صفري أسّه صفر يساوي {{1}}.'), I('احسبي {{(-3)^0}}', 1, '{{(-3)^0 = 1}} لأن العدد مش صفر.')] },
    { t: '🚫 حالة خاصة', html: '{{0^0}} حالة <b>غير معرّفة</b> في مستوانا، فمنقولش إنها {{1}}.', qs: [T('{{0^0 = 1}} دايمًا في مستوانا.', false, '{{0^0}} غير معرّفة، فمنتعاملش معاها على إنها {{1}}.')] }
  ]);
  PG.r4 = L([
    { t: '🔄 الأس السالب', html: 'الأس السالب بيعني <b>المقلوب</b>: نكتب {{1}} على القوة ذات الأس الموجب.', rule: '{{أ^-ن = ⟦1|أ^ن⟧}} بشرط {{أ ≠ 0}}.' },
    { t: '📚 أمثلة', html: '{{2^-1 = ⟦1|2⟧}} ، {{3^-2 = ⟦1|3^2⟧ = ⟦1|9⟧}} ، {{5^-2 = ⟦1|25⟧}} ، {{(⟦1|2⟧)^-2 = 2^2 = 4}}.', qs: [Fq('احسبي {{2^-2}} (اكتبيها كسر).', '1/4', '{{2^-2 = ⟦1|2^2⟧ = ⟦1|4⟧}}.')] },
    { t: '⚠️ مهم جدًا', html: 'الأس السالب <b>مش</b> معناه إن الناتج سالب! {{3^-2 = ⟦1|9⟧}} موجب، هو بس مقلوب.', qs: [T('{{2^-3}} عدد سالب.', false, '{{2^-3 = ⟦1|8⟧}} موجب. الإشارة السالبة في الأس معناها المقلوب فقط.'), M('إيه قيمة {{5^-2}}؟', ['{{-25}}', '{{⟦1|25⟧}}', '{{-10}}'], 1, '{{5^-2 = ⟦1|5^2⟧ = ⟦1|25⟧}}.')] }
  ]);
  PG.r5 = L([
    { t: '🧩 أجزاء الحد الجبري', html: 'خدي الحد {{3س^2}}:', rule: '<b>المعامل</b> = {{3}} (العدد اللي قدام المتغير).<br><b>المتغير</b> = {{س}} (الحرف).<br><b>الأس</b> = {{2}}.<br><b>الثابت</b> هو حد من غير متغير، مثل {{7}}.', qs: [M('في الحد {{5س^3}} ما المعامل؟', ['{{5}}', '{{3}}', '{{س}}'], 0, 'المعامل هو العدد قدام المتغير: {{5}}، والأس هو {{3}}.')] },
    { t: '👯 الحدود المتشابهة', html: 'الحدود المتشابهة لها <b>نفس المتغير ونفس الأس</b>. {{3س}} و{{5س}} متشابهان، {{2س^2}} و{{7س^2}} متشابهان. لكن {{3س}} و{{3س^2}} <b>غير</b> متشابهين، و{{4س}} و{{4ص}} غير متشابهين.', qs: [T('{{3س}} و{{3س^2}} حدان متشابهان.', false, 'الأس مختلف ({{1}} و{{2}}) فهما غير متشابهين.')] },
    { t: '➕ جمع وطرح المتشابهة', html: 'بنجمع أو نطرح <b>المعاملات</b> بس، والمتغير والأس بيفضلوا زي ما هم: {{3س + 5س = 8س}} ، {{7س^2 - 2س^2 = 5س^2}}. أما {{3س + 2ص}} فمنقدرش نجمعهم في حد واحد.', qs: [Pl('بسّطي {{4س + 3س}}', [1], [7], '{{4 + 3 = 7}} فالناتج {{7س}}.'), M('أي الحدود دي ينفع نجمعها مع {{2س}}؟', ['{{5س}}', '{{5س^2}}', '{{5ص}}'], 0, 'لازم نفس المتغير ونفس الأس: {{2س + 5س = 7س}}.')] }
  ]);

})();
                                                                                          
