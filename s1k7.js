/* 🌸 صفحة مهارة: النسبة والتناسب (الهيكل + مرحلة «افتكري»)
   كود المهارة بيتحسب لوحده من ترتيبها في skills.js (بيدوّر على عنوان «النسبة والتناسب»)، فمش محتاجة تغيّريه.
   الملفات المكمّلة: s1k7-ui.js (الأدوات) و s1k7-b.js (الشرح) و s1k7-bank.js (الأسئلة) و s1k7-c.js (الأمثلة والتدريب والاختبار والملخص). */
(function () {
  const { dig, fmt, qcard } = FR;
  const TITLE = 'النسبة والتناسب', SKILL_ID = 's1k' + ((typeof SECTIONS !== 'undefined' && SECTIONS[0].skills.indexOf(TITLE) + 1) || 8);
  
  const ORDER = [['r1', 0, 'مراجعة الكسور'], ['r2', 0, 'الضرب والقسمة'], ['r3', 0, 'المعكوس الجمعي والضربي'], ['r4', 0, 'معامل المقدار الجبري'], ['r5', 0, 'العوامل الأولية'], ['r6', 0, 'تكوين الأعداد من عواملها'], ['r7', 0, 'القسمة على ٢'],
    ['l1', 1, 'مفهوم النسبة'], ['l2', 1, 'تبسيط النسبة'], ['l3', 1, 'النسب المتكافئة'], ['l4', 1, 'مقارنة النسب'], ['l5', 1, 'مفهوم التناسب'], ['l6', 1, 'إيجاد الحد المجهول'], ['l7', 1, 'خواص التناسب'], ['l8', 1, 'التناسب الطردي'], ['l9', 1, 'التناسب العكسي'], ['l10', 1, 'مسائل لفظية وتطبيقات'],
    ['ex', 2, 'أمثلة محلولة'], ['pr1', 3, 'المستوى الأول: سهل'], ['pr2', 3, 'المستوى الثاني: متوسط'], ['pr3', 3, 'المستوى الثالث: متقدم'], ['quiz', 4, 'الاختبار النهائي'], ['sum', 5, 'ملخص المعلومة']];
  const STG = ['افتكري', 'افهمي', 'شوفي الحل', 'جربي', 'اختبري نفسك', 'الملخص'], ICO = ['🌱', '💡', '✏️', '🎮', '🧠', '🎀'];
  const NP = window.NP = {}, PG = NP.pg = {}; NP.ORDER = ORDER; NP.SKILL_ID = SKILL_ID;

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
<section class="card pink"><div class="bow">⚖️</div><h2>${TITLE}</h2></section>
<nav class="stg" aria-label="مراحل المهارة">${STG.map((s, i) => `<button data-st="${i}" class="${i === stg ? 'on' : i < stg ? 'dn' : ''}" ${i === stg ? 'aria-current="step"' : ''}><span>${ICO[i]}</span><small>${s}</small></button>`).join('')}</nav>
<div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round((P.page + 1) / n * 100)}"><i style="width:${(P.page + 1) / n * 100}%"></i></div>
<small>الصفحة ${dig(P.page + 1)} من ${dig(n)} · ${title}</small>
<div id="s7c"></div>
<div class="s1nav"><button class="btn" data-p ${P.page ? '' : 'disabled'}>➡️ السابق</button><button class="btn" data-n ${P.page < n - 1 ? '' : 'hidden'}>التالي ⬅️</button></div>`;
      const c = root.querySelector('#s7c');
      try { PG[id](c, ctx); } catch (e) { c.innerHTML = '<section class="card"><p>حصلت مشكلة بسيطة في عرض الصفحة 💗 جرّبي ترجعي للمهارات وتفتحيها تاني.</p></section>'; if (window.console) console.error(e); }
      root.querySelector('[data-p]').onclick = () => go(P.page - 1);
      root.querySelector('[data-n]').onclick = () => go(P.page + 1);
      root.querySelectorAll('[data-st]').forEach(b => b.onclick = () => go(ORDER.findIndex(x => x[1] === +b.dataset.st)));
      root.querySelectorAll('[data-x]').forEach(b => b.onclick = () => api.go(b.dataset.x, SKILL_ID));
    }
    draw();
  };

  const W = { tree: (s, a) => NS.tree(s, a), simp2: (s, a) => NS.simp2(s, a), means: (s, a) => NS.means(s, a), share: (s, a) => NS.share(s, a), rel: s => NS.rel(s) };
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
  NP.lesson = parts => { parts = NS.deep(parts); return (c, x) => {
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
  const I = (t, a, w) => ({ type: 'int5', t, a, w, kind: K }), Fq = (t, a, w) => ({ type: 'frac', t, a, w, kind: K });
  const Rt = (t, a, w) => ({ type: 'ratio', t, a, w, kind: K }), Fc = (t, a, w) => ({ type: 'fac', t, a, w, kind: K });
  NP.mk = { M, T, I, Fq, Rt, Fc };
  const L = NP.lesson;
  /* ---------- أولًا: افتكري المعلومة (٧ دروس) ---------- */
  PG.r1 = L([
    { t: '🍕 مكونات الكسر', html: 'الكسر {{3/4}} معناه ٣ أجزاء من ٤ أجزاء متساوية. العدد اللي فوق خط الكسر هو <b>البسط</b> (عدد الأجزاء المأخوذة)، واللي تحت هو <b>المقام</b> (عدد الأجزاء الكلي).', qs: [M('في الكسر {{5/8}} ما المقام؟', ['{{5}}', '{{8}}', '{{13}}'], 1, 'المقام هو العدد اللي تحت خط الكسر: {{8}}.')] },
    { t: '🟰 الكسور المتكافئة والتبسيط', html: 'الكسور المتكافئة لها نفس القيمة، بنجيبها بضرب أو قسمة البسط والمقام في نفس العدد. مثال: {{6/8}}', steps: ['نبحث عن عدد يقسم {{6}} و{{8}} معًا: {{2}}.', 'نقسم البسط والمقام على {{2}}: {{6 ÷ 2 = 3}} و{{8 ÷ 2 = 4}}.', 'الناتج {{6/8 = 3/4}}، ومفيش عامل مشترك تاني فهي أبسط صورة.'], qs: [Fq('بسّطي {{4/10}}', '2/5', 'نقسم على {{2}}: {{4/10 = 2/5}}.')] },
    { t: '✖️ ضرب الكسور', html: 'بنضرب البسط في البسط والمقام في المقام (ونختصر لو أمكن). {{2/3 × 3/4 = 6/12 = 1/2}}.', qs: [Fq('احسبي {{2/5 × 5/6}}', '1/3', '{{10/30 = 1/3}}.')] },
    { t: '➗ قسمة الكسور', html: 'بنقلب الكسر التاني ونضرب: {{2/5 ÷ 4/5 = 2/5 × 5/4 = 10/20 = 1/2}}.', qs: [Fq('احسبي {{3/4 ÷ 3/8}}', '2/1', '{{3/4 × 8/3 = 24/12 = 2}}.')] },
    { t: '🔄 العدد الكسري', html: 'لتحويل العدد الكسري {{2~1/3}} لكسر غير فعلي: نضرب العدد الصحيح في المقام ونجمع البسط: {{2 × 3 + 1 = 7}} فيبقى {{7/3}}.', qs: [Fq('حوّلي {{1~1/2}} إلى كسر غير فعلي.', '3/2', '{{1 × 2 + 1 = 3}} فالناتج {{3/2}}.')] }
  ]);
  PG.r2 = L([
    { t: '✖️ الضرب', html: 'الضرب بيختصر الجمع المتكرر. جدول الضرب أساس كل حاجة هتعمليها في النسبة والتناسب.', qs: [I('احسبي {{7 × 8}}', 56, '{{7 × 8 = 56}}.'), I('احسبي {{12 × 5}}', 60, '{{12 × 5 = 60}}.')] },
    { t: '➗ القسمة', html: 'القسمة هي عكس الضرب: لو {{6 × 4 = 24}} يبقى {{24 ÷ 6 = 4}}.', qs: [I('احسبي {{72 ÷ 8}}', 9, 'لأن {{8 × 9 = 72}}.')] },
    { t: '🔢 الأعداد العشرية', html: 'في الضرب العشري بنضرب من غير الفاصلة وبعدين نعدّ المنازل العشرية. {{0.5 × 6 = 3}} و{{1.5 × 4 = 6}}. والقسمة: {{6 ÷ 0.5 = 12}}.', qs: [M('إيه ناتج {{2.5 × 4}}؟', ['{{10}}', '{{1}}', '{{8.5}}'], 0, '{{25 × 4 = 100}} ومنزلة عشرية واحدة: {{10.0 = 10}}.')] }
  ]);
  PG.r3 = L([
    { t: '➕ المعكوس الجمعي', html: 'المعكوس الجمعي للعدد هو العدد اللي لما نجمعه عليه الناتج <b>صفر</b>. {{5 + (-5) = 0}} فمعكوس ٥ هو {{-5}}، ومعكوس {{-35}} هو {{35}}، ومعكوس {{0}} هو {{0}}.', qs: [I('ما المعكوس الجمعي للعدد {{9}}؟', -9, '{{9 + (-9) = 0}}.'), I('ما المعكوس الجمعي للعدد {{-12}}؟', 12, '{{-12 + 12 = 0}}.')] },
    { t: '✖️ المعكوس الضربي', html: 'المعكوس الضربي للعدد هو العدد اللي لما نضربه فيه الناتج <b>١</b> (بشرط العدد ≠ ٠). معكوس {{4}} هو {{1/4}}، ومعكوس {{4/3}} هو {{3/4}}، ومعكوس {{-5}} هو {{-1/5}}. والصفر <b>ملوش</b> معكوس ضربي.', qs: [Fq('ما المعكوس الضربي للعدد {{5/2}}؟', '2/5', '{{5/2 × 2/5 = 1}}.'), T('للصفر معكوس ضربي.', false, 'مفيش عدد نضربه في {{0}} ويدّي {{1}}.')] },
    { t: '⚖️ الفرق بينهم', html: '<table class="cmpt"><tr><th></th><th>الجمعي</th><th>الضربي</th></tr><tr><th>العملية</th><td>جمع</td><td>ضرب</td></tr><tr><th>الناتج</th><td>صفر</td><td>واحد</td></tr><tr><th>معكوس {{3}}</th><td>{{-3}}</td><td>{{1/3}}</td></tr></table>', qs: [M('ما المعكوس الضربي للعدد {{-5}}؟', ['{{5}}', '{{-1/5}}', '{{1/5}}'], 1, '{{-5 × (-1/5) = 1}}. العدد {{5}} هو المعكوس الجمعي مش الضربي.')] }
  ]);
  PG.r4 = L([
    { t: '🧩 أجزاء المقدار الجبري', html: 'في المقدار {{3س + 6}}: الحد {{3س}} فيه <b>متغير</b> هو {{س}} و<b>معامله</b> {{3}} (العدد المضروب في المتغير)، والحد {{6}} <b>عدد ثابت</b> (من غير متغير).' },
    { t: '📚 أمثلة', html: '{{5ص - 2}}: معامل {{ص}} هو {{5}}. {{-4س + 7}}: معامل {{س}} هو {{-4}}. {{س + 8}}: معامل {{س}} هو {{1}} (لأن {{س = 1س}}). {{-س + 3}}: معامل {{س}} هو {{-1}}.', qs: [I('ما معامل {{س}} في {{3س + 6}}؟', 3, 'العدد المضروب في {{س}}.'), I('ما معامل {{س}} في {{-4س + 7}}؟', -4, 'بنحتفظ بإشارة المعامل.'), I('ما معامل {{س}} في {{س + 8}}؟', 1, '{{س}} معناها {{1 × س}}.')] }
  ]);
  PG.r5 = L([
    { t: '⭐ الأعداد الأولية', html: 'العدد الأولي هو عدد صحيح أكبر من {{1}} مبيقبلش القسمة إلا على {{1}} وعلى نفسه: {{2}} ، {{3}} ، {{5}} ، {{7}} ، {{11}} ، {{13}} ، {{17}} ، {{19}}. والعدد المركب هو اللي بيقبل القسمة على أعداد تانية، زي {{12}}.', qs: [M('أي الأعداد دي أولي؟', ['{{9}}', '{{13}}', '{{15}}'], 1, '{{13}} مبيقبلش القسمة إلا على {{1}} و{{13}}.')] },
    { t: '🌳 شجرة العوامل', html: 'نحلل العدد لعوامله الأولية بتقسيمه على أعداد أولية لحد ما كل العوامل تبقى أولية. جرّبي مع {{72}}:', wd: 'tree', wa: [72] },
    { t: '📚 أمثلة', html: '{{40 = 2 × 2 × 2 × 5}} ، {{36 = 2 × 2 × 3 × 3}} ، {{60 = 2 × 2 × 3 × 5}} ، {{72 = 2 × 2 × 2 × 3 × 3}}. للتأكد: اضربي العوامل تاني ولازم ترجعي للعدد.', qs: [Fc('حلّلي {{12}} إلى عوامله الأولية.', [2, 2, 3], '{{12 = 2 × 2 × 3}}.'), Fc('حلّلي {{30}} إلى عوامله الأولية.', [2, 3, 5], '{{30 = 2 × 3 × 5}}.')] }
  ]);
  PG.r6 = L([
    { t: '🧱 نبني العدد من عوامله', html: 'لو عرفنا العوامل الأولية نضربهم نرجع للعدد: العوامل {{2}} و{{3}} و{{5}} يدّوا {{2 × 3 × 5 = 30}}. والتحليل {{2 × 2 × 3}} يدّي {{12}}.' },
    { t: '⚠️ فرق مهم', html: 'كتابة العوامل الأولية ({{2 × 2 × 3}}) <b>مش</b> هي نفس كتابة العدد ({{12}}). الاتنين نفس القيمة، لكن الأولى هي التحليل والتانية هي الناتج.', qs: [I('ما العدد الذي تحليله {{2 × 2 × 5}}؟', 20, '{{2 × 2 × 5 = 20}}.'), I('ما العدد الذي عوامله الأولية {{2}} و{{3}} و{{7}}؟', 42, '{{2 × 3 × 7 = 42}}.')] }
  ]);
  PG.r7 = L([
    { t: '2️⃣ القسمة على ٢'.replace('2️⃣', '✂️'), html: 'العدد بيقبل القسمة على {{2}} لو رقم آحاده {{0}} أو {{2}} أو {{4}} أو {{6}} أو {{8}} (يعني عدد زوجي). {{24}} يقبل، {{100}} يقبل، {{65}} و{{37}} لا يقبلا.', qs: [M('أي الأعداد دي يقبل القسمة على ٢؟', ['{{65}}', '{{37}}', '{{58}}'], 2, 'رقم الآحاد {{8}} زوجي.'), T('العدد {{130}} يقبل القسمة على ٢.', true, 'رقم الآحاد {{0}}.'), M('أي الأعداد دي لا يقبل القسمة على ٢؟', ['{{46}}', '{{91}}', '{{200}}'], 1, 'رقم آحاد {{91}} هو {{1}} (فردي).')] }
  ]);

})();
                                                                              
