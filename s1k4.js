/* 🌸 صفحة مهارة: الأعداد العشرية والأعداد النسبية (الهيكل + مرحلة «افتكري»)
   كود المهارة في skills.js هو s1k4 (الرابعة في القسم الأول). لو عايزة تغيّريه غيّري السطر اللي تحت.
   الملفات المكمّلة: s1k4-b.js (الشرح التفاعلي) و s1k4-c.js (الأمثلة والتدريب والاختبار والملخص). */
(function () {
  const SKILL_ID = 's1k4', TITLE = 'الأعداد العشرية والأعداد النسبية';
  const { dig, fmt, qcard } = FR;
  const ORDER = [['d1', 0, 'يعني إيه عدد عشري؟'], ['d2', 0, 'أنواع الأعداد العشرية'], ['d3', 0, 'مقارنة وترتيب العشرية'], ['d4', 0, 'من كسر لعشري والعكس'], ['d5', 0, 'الأعداد النسبية'], ['d6', 0, 'النسبية على خط الأعداد'],
    ['add', 1, 'جمع الأعداد العشرية'], ['sub', 1, 'طرح الأعداد العشرية'], ['mul', 1, 'ضرب الأعداد العشرية'], ['div', 1, 'قسمة الأعداد العشرية'], ['sgn', 1, 'العمليات على الأعداد النسبية'], ['rf', 1, 'الكسور الموجبة والسالبة'], ['mix', 1, 'العمليات المركبة'],
    ['ex', 2, 'أمثلة محلولة'], ['pr1', 3, 'المستوى الأول: سهل'], ['pr2', 3, 'المستوى الثاني: متوسط'], ['pr3', 3, 'المستوى الثالث: متقدم'], ['quiz', 4, 'الاختبار النهائي'], ['sum', 5, 'ملخص المعلومة']];
  const STG = ['افتكري', 'افهمي', 'شوفي الحل', 'جربي', 'اختبري نفسك', 'الملخص'], ICO = ['🌱', '💡', '✏️', '🎮', '🧠', '🎀'];
  const PG = DR.pg = {}; DR.ORDER = ORDER; DR.SKILL_ID = SKILL_ID;

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
<section class="card pink"><div class="bow">🔢</div><h2>${TITLE}</h2></section>
<nav class="stg" aria-label="مراحل المهارة">${STG.map((s, i) => `<button data-st="${i}" class="${i === stg ? 'on' : i < stg ? 'dn' : ''}" ${i === stg ? 'aria-current="step"' : ''}><span>${ICO[i]}</span><small>${s}</small></button>`).join('')}</nav>
<div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round((P.page + 1) / n * 100)}"><i style="width:${(P.page + 1) / n * 100}%"></i></div>
<small>الصفحة ${dig(P.page + 1)} من ${dig(n)} · ${title}</small>
<div id="s4c"></div>
<div class="s1nav"><button class="btn" data-p ${P.page ? '' : 'disabled'}>➡️ السابق</button><button class="btn" data-n ${P.page < n - 1 ? '' : 'hidden'}>التالي ⬅️</button></div>`;
      const c = root.querySelector('#s4c');
      try { PG[id](c, ctx); } catch (e) { c.innerHTML = '<section class="card"><p>حصلت مشكلة بسيطة في عرض الصفحة 💗 جرّبي ترجعي للمهارات وتفتحيها تاني.</p></section>'; if (window.console) console.error(e); }
      root.querySelector('[data-p]').onclick = () => go(P.page - 1);
      root.querySelector('[data-n]').onclick = () => go(P.page + 1);
      root.querySelectorAll('[data-st]').forEach(b => b.onclick = () => go(ORDER.findIndex(x => x[1] === +b.dataset.st)));
      root.querySelectorAll('[data-x]').forEach(b => b.onclick = () => api.go(b.dataset.x, SKILL_ID));
    }
    draw();
  };

  /* ---------- أدوات تفاعلية ---------- */
  const W = DR.W = {
    place: (s, a) => DR.place(s, a[0]),
    rline: (s, a, x, id) => DR.rline(s, x, id),
    /* جدول يوضّح تحريك الفاصلة في القسمة */
    shift(s, [a, b]) {
      let k = 0; const w = document.createElement('div'); w.className = 'wd'; s.appendChild(w);
      const mv = (v, n) => { let t = (parseFloat(v) * Math.pow(10, n)); return String(Math.round(t * 1e6) / 1e6); };
      const draw = () => {
        const A = mv(a, k), B = mv(b, k);
        w.innerHTML = `<b>↔️ حرّكي الفاصلة في العددين معًا</b><div class="stp2"><button data-a="-" aria-label="رجوع">−</button><b>${dig(k)} خانة</b><button data-a="+" aria-label="تحريك">+</button></div><p class="chain">${fmt('{{' + DR.dc(A) + ' ÷ ' + DR.dc(B) + '}}')}</p><p>${Number.isInteger(+B) ? '✅ المقسوم عليه بقى عدد صحيح، تقدري تقسمي بسهولة.' : 'لسه المقسوم عليه فيه فاصلة، حرّكيها أكتر.'}</p>`;
        w.querySelectorAll('[data-a]').forEach(b => b.onclick = () => { k = Math.max(0, Math.min(3, k + (b.dataset.a === '+' ? 1 : -1))); draw(); });
      };
      draw();
    }
  };

  /* ---------- محرك الدروس: أجزاء بتظهر واحدة واحدة ---------- */
  function part(box, x, p, id) {
    const s = document.createElement('section'); s.className = 'card'; box.appendChild(s);
    s.innerHTML = `<h3>${fmt(p.t)}</h3>${p.html ? '<p>' + fmt(p.html) + '</p>' : ''}${p.rule ? `<div class="rule">📌 ${fmt(p.rule)}</div>` : ''}${p.vt ? DR.vert(...p.vt) : ''}`;
    if (p.wd) W[p.wd](s, p.wa, x, id);
    if (p.steps) {
      const ol = document.createElement('ol'); ol.className = 'stps'; s.appendChild(ol);
      const b = document.createElement('button'); b.className = 'btn sm2'; b.textContent = 'الخطوة التالية ⬇️'; s.appendChild(b);
      const draw = () => { const k = x.P.st[id] || 0; ol.innerHTML = p.steps.slice(0, k).map(t => `<li>${fmt(t)}</li>`).join(''); b.hidden = k >= p.steps.length; };
      b.onclick = () => { x.P.st[id] = (x.P.st[id] || 0) + 1; x.save(); draw(); }; draw();
    }
    (p.qs || []).forEach((q, j) => x.ask(s, Object.assign({}, q, { id: id + '_' + j })));
    return s;
  }
  DR.lesson = parts => { parts = DR.deep(parts); return (c, x) => {
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
  const Nd = (t, a, w) => ({ type: 'dec', t, a, w, kind: K }), Rq = (t, a, w) => ({ type: 'rat', t, a, w, kind: K });
  DR.mk = { M, T, Nd, Rq };
  const L = DR.lesson, OV = s => `<span class="ov">${s}</span>`;

  /* ---------- أولًا: افتكري المعلومة (٦ دروس) ---------- */
  PG.d1 = L([
    { t: '🔢 يعني إيه عدد عشري؟', html: 'العدد العشري هو عدد فيه <b>فاصلة</b> بتفصل الجزء الصحيح عن الجزء الكسري. مثال: {{3.5}} بنقرأه «ثلاثة وخمسة أعشار» يعني ٣ كاملة ونص.', rule: 'الأرقام على <b>يمين</b> الفاصلة بتمثّل أجزاء من الواحد: أعشار ثم أجزاء من مائة ثم أجزاء من ألف.' },
    { t: '🔍 جدول القيمة المكانية', html: 'اضغطي على كل رقم في العدد واكتشفي خانته وقيمته:', wd: 'place', wa: ['34.257'] },
    { t: '➗ العشري والكسر', html: 'كل رقم عشري ليه كسر يعبّر عنه: {{0.7 = 7/10}} (منزلة واحدة والمقام {{10}}) ، {{0.25 = 25/100}} (منزلتان والمقام {{100}}) ، {{0.125 = 125/1000}} (٣ منازل والمقام {{1000}}).', qs: [Nd('اكتبي {{9/10}} في صورة عدد عشري.', '0.9', '{{9/10}} تسعة أعشار = {{0.9}}.'), M('ما قيمة الرقم {{2}} في العدد {{5.62}}؟', ['{{2/10}}', '{{2/100}}', '{{2}}'], 1, 'الرقم {{2}} في الخانة الثانية بعد الفاصلة، وهي الأجزاء من مائة: {{2/100}}.')] }
  ]);
  PG.d2 = L([
    { t: '🟢 عشري منتهٍ', html: 'له عدد <b>محدود</b> من الأرقام بعد الفاصلة، مثل {{0.5}} و{{2.75}} و{{3.125}}.', qs: [M('أي الأعداد دي عشري منتهٍ؟', ['{{1.25}}', '{{0.666}}… (٦ بتتكرر)', '{{√2}}'], 0, '{{1.25}} ينتهي عند رقمين بعد الفاصلة.')] },
    { t: '🔁 عشري دوري', html: `أرقامه بتتكرر للأبد. مثال: {{0.333}}… بنكتبه ٠،${OV('٣')} (٣ دوري) و{{0.121212}}… بنكتبه ٠،${OV('١٢')}. الخط فوق الرقم بيدل على الجزء المتكرر.`, rule: 'العدد الدوري هو <b>عدد نسبي</b> لأنه ممكن نكتبه على صورة كسر، مثلًا {{0.333… = 1/3}}.' },
    { t: '🚫 لا ينتهي ولا يتكرر', html: 'فيه أعداد أرقامها بعد الفاصلة <b>مبتنتهيش ومفيهاش نمط متكرر</b>، زي {{√2 ≈ 1.41421356}}… و{{π ≈ 3.14159265}}…', rule: 'العدد ده <b>مش نسبي</b> (بنسميه غير نسبي) لأنه مينفعش يتكتب على صورة كسر.', qs: [M('{{0.121212}}… (١٢ بتتكرر للأبد) نوعه إيه؟', ['منتهٍ', 'دوري', 'لا ينتهي ولا يتكرر'], 1, 'الرقمان ١٢ بيتكررا بشكل منتظم للأبد، فهو عشري دوري.')] }
  ]);
  PG.d3 = L([
    { t: '⚖️ قاعدة المقارنة', html: 'لمقارنة عددين عشريين:', steps: ['نقارن <b>الجزء الصحيح</b> (على يسار الفاصلة): الأكبر هو الأكبر.', 'لو متساويين، نقارن الرقم بعد الفاصلة (الأعشار)، ثم اللي بعده، من الشمال لليمين.', 'أول خانة مختلفة تحدد الأكبر. مثال: {{2.35}} و{{2.4}} ← الجزء الصحيح {{2}} ، والأعشار {{3 < 4}} فـ {{2.35 < 2.4}}.'] },
    { t: '⭕ الأصفار على اليمين', html: 'إضافة أصفار على يمين العدد العشري (بعد آخر رقم) <b>مبتغيّرش قيمته</b>: {{0.5 = 0.50 = 0.500}}. لكن الصفر بين الفاصلة والرقم بيفرق: {{0.05 ≠ 0.5}}!', qs: [T('{{0.7 > 0.65}}', true, 'نساوي المنازل: {{0.70 > 0.65}} لأن {{70 > 65}}.'), M('أي العددين أكبر: {{0.3}} أم {{0.25}}؟', ['{{0.3}}', '{{0.25}}'], 0, '{{0.3 = 0.30}} و{{30 > 25}} فـ {{0.3}} أكبر (حتى لو ٢٥ شكلها أكبر من ٣).')] },
    { t: '📊 الترتيب', html: 'ساوي المنازل العشرية بإضافة أصفار، وبعدين قارني كأنها أعداد صحيحة.', qs: [{ type: 'order', kind: K, t: 'رتّبي تصاعديًا: {{0.5}} ، {{0.45}} ، {{0.6}}', items: ['0.45', '0.5', '0.6'], w: 'بالمنازل المتساوية: {{0.50}} ، {{0.45}} ، {{0.60}} ← {{0.45 < 0.5 < 0.6}}.' }] }
  ]);
  PG.d4 = L([
    { t: '🔁 من كسر إلى عشري', html: 'الكسر معناه قسمة: {{1/2 = 1 ÷ 2 = 0.5}} ، {{3/4 = 0.75}} ، {{1/5 = 0.2}} ، {{1/8 = 0.125}}. مثال: {{3/8}}', steps: ['نقسم البسط على المقام: {{3 ÷ 8}}.', '{{3}} أصغر من {{8}} فنكتب {{0}} وفاصلة ونضيف أصفارًا للبسط: {{30 ÷ 8 = 3}} والباقي {{6}}.', 'نكمّل: {{60 ÷ 8 = 7}} والباقي {{4}} ثم {{40 ÷ 8 = 5}}.', 'الناتج: {{3/8 = 0.375}}.'], qs: [Nd('حوّلي {{3/4}} إلى عدد عشري.', '0.75', '{{3 ÷ 4 = 0.75}}.')] },
    { t: '🔁 من عشري إلى كسر', html: 'نكتب العدد من غير فاصلة في البسط، والمقام {{10}} أو {{100}} أو {{1000}} حسب عدد المنازل. مثال: {{0.25}}', steps: ['منزلتان عشريتان، فالمقام {{100}}: {{0.25 = 25/100}}.', 'نبحث عن العامل المشترك الأكبر لـ {{25}} و{{100}}: {{25}}.', 'نقسم: {{25/100 = 1/4}}.'], rule: 'لازم نكتب الكسر في <b>أبسط صورة</b> دايمًا، لأن {{25/100}} و{{1/4}} نفس القيمة لكن الأخير هو الصورة النهائية.', qs: [Rq('اكتبي {{1.25}} في صورة كسر في أبسط صورة (غير فعلي).', '5/4', '{{1.25 = 125/100}} نقسم على {{25}}: {{5/4}}.'), Rq('اكتبي {{0.8}} في صورة كسر في أبسط صورة.', '4/5', '{{0.8 = 8/10 = 4/5}}.')] }
  ]);
  PG.d5 = L([
    { t: '🧮 يعني إيه عدد نسبي؟', html: 'العدد النسبي هو أي عدد نقدر نكتبه على صورة <b>كسر {{a/b}}</b> حيث {{a}} و{{b}} عددان صحيحان و<b>{{b ≠ 0}}</b>. أمثلة: {{3 = 3/1}} ، {{0.5 = 1/2}} ، {{-2 = -2/1}} ، {{3/4}} ، {{0.333… = 1/3}}.' },
    { t: '✅ مين نسبي؟', html: 'كل ده أعداد نسبية:', rule: 'كل <b>عدد صحيح</b> ، وكل <b>كسر</b> ، وكل <b>عشري منتهٍ</b> ، وكل <b>عشري دوري</b>.' , qs: [T('كل عدد عشري منتهٍ هو عدد نسبي.', true, 'مثلًا {{0.25 = 25/100}} يعني نقدر نكتبه على صورة كسر.'), M('أي الأعداد دي نسبي؟', ['{{-5}}', '{{√2}}', '{{π}}'], 0, '{{-5 = -5/1}} نسبي. {{√2}} و{{π}} مش بينفع يتكتبوا على صورة كسر.')] },
    { t: '❌ مين مش نسبي؟', html: 'العدد العشري اللي <b>لا ينتهي ولا يتكرر</b> مش نسبي، زي {{√2}} و{{π}}. لكن انتبهي: {{√4 = 2}} نسبي لأن الجذر طلع عدد صحيح!', qs: [T('{{√4}} عدد نسبي.', true, '{{√4 = 2 = 2/1}} فهو نسبي.'), T('{{√3}} عدد نسبي.', false, '{{√3}} مش مربع كامل، فأرقامه لا تنتهي ولا تتكرر، يبقى غير نسبي.')] }
  ]);
  PG.d6 = L([
    { t: '📏 خط الأعداد', html: 'الأعداد الموجبة على <b>يمين</b> الصفر، والسالبة على <b>يساره</b>، والصفر في النص (لا موجب ولا سالب). وكل ما رحنا يمين العدد بيكبر: {{-1 < 0 < 1}}.' },
    { t: '🎯 حطي العدد في مكانه', html: 'اضغطي على مكان كل عدد على خط الأعداد (من {{-2}} لـ {{2}}، وكل علامة صغيرة نصف):', wd: 'rline' },
    { t: '🎮 جرّبي', qs: [M('أي العددين على يمين التاني: {{-0.5}} أم {{-1.5}}؟', ['{{-0.5}}', '{{-1.5}}'], 0, '{{-0.5}} أقرب للصفر، فهو على يمين {{-1.5}} وأكبر منه.'), T('{{-1/2 < 0}}', true, 'أي عدد سالب أصغر من الصفر.')] }
  ]);
})();
  
