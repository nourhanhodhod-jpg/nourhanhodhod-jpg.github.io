/* 🌸 صفحة مهارة: المتغيرات والتعويض (الهيكل + مرحلة «افتكري»)
   كود المهارة بيتحسب لوحده من ترتيبها في قسم التعبيرات الجبرية في skills.js (بيدوّر على عنوان «المتغيرات والتعويض»)، فمش محتاجة تغيّريه (هو s2k1).
   الملفات المكمّلة: s2k1-ui.js (الأدوات) و s2k1-b.js (الشرح) و s2k1-bank.js (الأسئلة) و s2k1-c.js (الأمثلة والتدريب والاختبار والملخص). */
(function () {
  const { dig, fmt, qcard } = FR;
  const TITLE = 'المتغيرات والتعويض', SKILL_ID = 's2k' + ((typeof SECTIONS !== 'undefined' && SECTIONS[1].skills.indexOf(TITLE) + 1) || 1);
  
  const ORDER = [['r1', 0, 'العمليات الأساسية وترتيبها'], ['r2', 0, 'الأعداد الموجبة والسالبة'], ['r3', 0, 'الأسس البسيطة'],
    ['l1', 1, 'يعني إيه متغير؟'], ['l2', 1, 'الثابت والمتغير'], ['l3', 1, 'كيف نكتب التعبير الجبري؟'], ['l4', 1, 'معنى التعويض'], ['l5', 1, 'التعويض في تعبيرات بسيطة'], ['l6', 1, 'أكثر من متغير'], ['l7', 1, 'التعويض بالأعداد السالبة'], ['l8', 1, 'الكسور والأعداد العشرية'],
    ['ex', 2, 'أمثلة محلولة'], ['pr1', 3, 'المستوى الأول: سهل'], ['pr2', 3, 'المستوى الثاني: متوسط'], ['pr3', 3, 'المستوى الثالث: متقدم'], ['quiz', 4, 'الاختبار النهائي'], ['sum', 5, 'ملخص المعلومة']];
  const STG = ['افتكري', 'افهمي', 'شوفي الحل', 'جربي', 'اختبري نفسك', 'الملخص'], ICO = ['🌱', '💡', '✏️', '🎮', '🧠', '🎀'];
  const VR = window.VR = {}, PG = VR.pg = {}; VR.ORDER = ORDER; VR.SKILL_ID = SKILL_ID;

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
<section class="card pink"><div class="bow">🔤</div><h2>${TITLE}</h2></section>
<nav class="stg" aria-label="مراحل المهارة">${STG.map((s, i) => `<button data-st="${i}" class="${i === stg ? 'on' : i < stg ? 'dn' : ''}" ${i === stg ? 'aria-current="step"' : ''}><span>${ICO[i]}</span><small>${s}</small></button>`).join('')}</nav>
<div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round((P.page + 1) / n * 100)}"><i style="width:${(P.page + 1) / n * 100}%"></i></div>
<small>الصفحة ${dig(P.page + 1)} من ${dig(n)} · ${title}</small>
<div id="s2c"></div>
<div class="s1nav"><button class="btn" data-p ${P.page ? '' : 'disabled'}>➡️ السابق</button><button class="btn" data-n ${P.page < n - 1 ? '' : 'hidden'}>التالي ⬅️</button></div>`;
      const c = root.querySelector('#s2c');
      try { PG[id](c, ctx); } catch (e) { c.innerHTML = '<section class="card"><p>حصلت مشكلة بسيطة في عرض الصفحة 💗 جرّبي ترجعي للمهارات وتفتحيها تاني.</p></section>'; if (window.console) console.error(e); }
      root.querySelector('[data-p]').onclick = () => go(P.page - 1);
      root.querySelector('[data-n]').onclick = () => go(P.page + 1);
      root.querySelectorAll('[data-st]').forEach(b => b.onclick = () => go(ORDER.findIndex(x => x[1] === +b.dataset.st)));
      root.querySelectorAll('[data-x]').forEach(b => b.onclick = () => api.go(b.dataset.x, SKILL_ID));
    }
    draw();
  };

  const W = { subst: (s, a) => VS.subst(s, a), vc: (s, a) => VS.vc(s, a) };
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
  VR.lesson = parts => { parts = VS.deep(parts); return (c, x) => {
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
  const V = (t, a, w) => ({ type: 'val', t, a, w, kind: K }), E = (t, a, w) => ({ type: 'expr', t, a, w, kind: K });
  const O = (t, items, w) => ({ type: 'order', t, items, w, kind: K });
  VR.mk = { M, T, V, E, O };
  const L = VR.lesson;

  /* ---------- أولًا: افتكري المعلومة (٣ دروس) ---------- */
  PG.r1 = L([
    { t: '🔢 العمليات الأربعة', html: 'الجمع والطرح والضرب والقسمة هي أساس كل حاجة هتعمليها في الجبر. أمثلة: {{7 + 5 = 12}} و{{15 - 8 = 7}} و{{4 × 6 = 24}} و{{20 ÷ 5 = 4}}. القسمة هي عكس الضرب، والطرح هو عكس الجمع.', qs: [V('احسبي {{9 + 6}}', 15, '{{9 + 6 = 15}}.'), V('احسبي {{7 × 8}}', 56, '{{7 × 8 = 56}}.'), V('احسبي {{20 ÷ 4}}', 5, 'لأن {{4 × 5 = 20}}.')] },
    { t: '📋 ترتيب العمليات الحسابية', html: 'لما يكون في التعبير أكتر من عملية، لازم نمشي بترتيب ثابت عشان الكل يوصل لنفس الناتج:', rule: '١. الأقواس<br>٢. الأسس<br>٣. الضرب والقسمة (من اليسار لليمين)<br>٤. الجمع والطرح (من اليسار لليمين)' },
    { t: '✏️ مثال: {{2 + 3 × 4}}', html: 'كتير بيجمعوا الأول ويطلع {{20}}، وده غلط! خلينا نمشي بالترتيب:', steps: ['مفيش أقواس ولا أسس، فنبدأ بالضرب: {{3 × 4 = 12}}.', 'بعدها الجمع: {{2 + 12 = 14}}.', 'الناتج الصح {{14}}.'], qs: [V('احسبي {{5 + 2 × 3}}', 11, 'الضرب الأول: {{2 × 3 = 6}} ثم {{5 + 6 = 11}}.'), V('احسبي {{(5 + 2) × 3}}', 21, 'الأقواس الأول: {{5 + 2 = 7}} ثم {{7 × 3 = 21}}.')] },
    { t: '⚖️ الضرب والقسمة في مستوى واحد', html: 'الضرب والقسمة في <b>نفس المستوى</b>، يعني مفيش واحدة منهم بتسبق التانية دايمًا، وبنحلهم بالترتيب من اليسار لليمين. ونفس الكلام للجمع والطرح. مثال: {{24 ÷ 4 × 2}} نبدأ بالقسمة لأنها الأولى من اليسار: {{6 × 2 = 12}}. ومثال: {{10 - 3 + 2}}: {{7 + 2 = 9}} (مش {{10 - 5 = 5}}).', qs: [V('احسبي {{24 ÷ 4 × 2}}', 12, 'من اليسار: {{24 ÷ 4 = 6}} ثم {{6 × 2 = 12}}.'), V('احسبي {{10 - 3 + 2}}', 9, 'من اليسار: {{10 - 3 = 7}} ثم {{7 + 2 = 9}}.'), O('رتّبي خطوات حساب {{18 - 2 × 3 + 1}}', ['2 × 3 = 6', '18 - 6 = 12', '12 + 1 = 13'], 'الضرب الأول، ثم الطرح والجمع من اليسار لليمين.')] }
  ]);
  PG.r2 = L([
    { t: '➕➖ الموجب والسالب والصفر', html: 'العدد الموجب أكبر من الصفر ({{3}} ، {{10}}). والسالب أصغر من الصفر ({{-3}} ، {{-10}}) وبنكتب قدامه إشارة −. والصفر لا موجب ولا سالب.', qs: [M('أي الأعداد دي سالب؟', ['{{4}}', '{{-7}}', '{{0}}'], 1, '{{-7}} عليه إشارة سالب.')] },
    { t: '📏 خط الأعداد', html: 'كل ما نمشي <b>يمين</b> العدد بيكبر، وكل ما نمشي <b>شمال</b> بيصغر: {{-4 < -1 < 0 < 3}}. العدد السالب الأبعد عن الصفر هو الأصغر، فـ {{-5 < -2}}.', qs: [M('أيهما أصغر: {{-5}} أم {{-2}}؟', ['{{-5}}', '{{-2}}', 'متساويان'], 0, '{{-5}} أبعد عن الصفر ناحية الشمال فهو الأصغر.'), O('رتّبي تصاعديًا: {{2}} ، {{-3}} ، {{0}} ، {{-1}}', ['-3', '-1', '0', '2'], 'من الأصغر للأكبر: {{-3 < -1 < 0 < 2}}.')] },
    { t: '➕ الجمع والطرح', html: '{{-3 + 5 = 2}} (نمشي ٥ يمين من −٣). {{5 - 8 = -3}}. {{-4 - 2 = -6}}. {{-2 + (-3) = -5}}. وطرح السالب = جمع الموجب: {{3 - (-2) = 3 + 2 = 5}}.', qs: [V('احسبي {{-6 + 2}}', -4, 'نمشي ٢ يمين من {{-6}} فنوصل {{-4}}.'), V('احسبي {{5 - (-3)}}', 8, 'طرح السالب جمع: {{5 + 3 = 8}}.'), V('احسبي {{-7 - 2}}', -9, '{{-7 - 2 = -9}}.')] },
    { t: '✖️➗ الضرب والقسمة وقواعد الإشارات', html: '<table class="t2"><tr><th>الإشارتان</th><th>الناتج</th><th>مثال</th></tr><tr><td>موجب × موجب</td><td>موجب</td><td>{{3 × 4 = 12}}</td></tr><tr><td>سالب × سالب</td><td>موجب</td><td>{{-5 × (-2) = 10}}</td></tr><tr><td>مختلفتان</td><td>سالب</td><td>{{-3 × 4 = -12}}</td></tr></table>وقواعد القسمة نفس قواعد الضرب: {{-12 ÷ 3 = -4}} و{{-12 ÷ (-4) = 3}}.', qs: [V('احسبي {{-6 × 3}}', -18, 'إشارتان مختلفتان فالناتج سالب: {{-18}}.'), V('احسبي {{-4 × (-5)}}', 20, 'سالب × سالب = موجب.'), V('احسبي {{-20 ÷ 4}}', -5, 'مختلفتان فالناتج سالب.')] }
  ]);
  PG.r3 = L([
    { t: '🔺 معنى الأس', html: 'الأس بيقول عدد مرات ضرب العدد في نفسه: {{2^2 = 2 × 2 = 4}} ، {{3^2 = 3 × 3 = 9}} ، {{2^3 = 2 × 2 × 2 = 8}} ، {{5^2 = 5 × 5 = 25}}.', qs: [V('احسبي {{4^2}}', 16, '{{4 × 4 = 16}}.'), V('احسبي {{2^3}}', 8, '{{2 × 2 × 2 = 8}}.'), V('احسبي {{10^2}}', 100, '{{10 × 10 = 100}}.')] },
    { t: '⚠️ الأس مش ضرب', html: 'انتبهي للفرق: {{3^2 = 3 × 3 = 9}} لكن {{3 × 2 = 6}}. الأس ما بيضربش العدد في الأس!', qs: [T('{{5^2 = 10}}', false, '{{5^2 = 5 × 5 = 25}} مش {{5 × 2}}.'), M('{{3^3}} =', ['{{9}}', '{{27}}', '{{6}}'], 1, '{{3 × 3 × 3 = 27}}.')] },
    { t: '📋 الأس وترتيب العمليات', html: 'الأس بييجي بعد الأقواس وقبل الضرب والجمع: {{2 + 3^2 = 2 + 9 = 11}}. أما {{(2 + 3)^2 = 5^2 = 25}} لأن الأقواس الأول.', qs: [V('احسبي {{2 + 3^2}}', 11, 'الأس الأول: {{3^2 = 9}} ثم {{2 + 9 = 11}}.'), V('احسبي {{(2 + 3)^2}}', 25, 'الأقواس الأول: {{5^2 = 25}}.'), V('احسبي {{2 × 3^2}}', 18, 'الأس الأول: {{3^2 = 9}} ثم {{2 × 9 = 18}}.')] }
  ]);
})();
      
