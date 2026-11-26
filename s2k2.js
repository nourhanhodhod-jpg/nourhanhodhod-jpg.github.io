/* 🌸 صفحة مهارة: الحدود الجبرية والمعاملات (الهيكل + مرحلة «افتكري»)
   كود المهارة بيتحسب لوحده من ترتيبها في قسم التعبيرات الجبرية في skills.js (بيدوّر على عنوان «الحدود الجبرية والمعاملات»)، فمش محتاجة تغيّريه (هو s2k2).
   الملفات المكمّلة: s2k2-ui.js (الأدوات) و s2k2-b.js (الشرح) و s2k2-bank.js (الأسئلة) و s2k2-c.js (الأمثلة والتدريب والاختبار والملخص). */
(function () {
  const { dig, fmt, qcard } = FR;
  const TITLE = 'الحدود الجبرية والمعاملات', SKILL_ID = 's2k' + ((typeof SECTIONS !== 'undefined' && SECTIONS[1].skills.indexOf(TITLE) + 1) || 2);
  
  const ORDER = [['r1', 0, 'المتغير والتعبير الجبري'], ['r2', 0, 'العدد جنب المتغير والثابت'], ['r3', 0, 'ترتيب العمليات'],
    ['l1', 1, 'ما هو الحد الجبري؟'], ['l2', 1, 'مكونات الحد الجبري'], ['l3', 1, 'ما هو المعامل العددي؟'], ['l4', 1, 'المعاملات في الحدود متعددة المتغيرات'], ['l5', 1, 'الحد الثابت'], ['l6', 1, 'عدد الحدود في المقدار'], ['l7', 1, 'تحليل مقدار جبري كامل'],
    ['ex', 2, 'أمثلة محلولة'], ['pr1', 3, 'المستوى الأول: سهل'], ['pr2', 3, 'المستوى الثاني: متوسط'], ['pr3', 3, 'المستوى الثالث: متقدم'], ['quiz', 4, 'الاختبار النهائي'], ['sum', 5, 'ملخص المعلومة']];
  const STG = ['افتكري', 'افهمي', 'شوفي الحل', 'جربي', 'اختبري نفسك', 'الملخص'], ICO = ['🌱', '💡', '✏️', '🎮', '🧠', '🎀'];
  const TM = window.TM = {}, PG = TM.pg = {}; TM.ORDER = ORDER; TM.SKILL_ID = SKILL_ID;

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
<section class="card pink"><div class="bow">🧩</div><h2>${TITLE}</h2></section>
<nav class="stg" aria-label="مراحل المهارة">${STG.map((s, i) => `<button data-st="${i}" class="${i === stg ? 'on' : i < stg ? 'dn' : ''}" ${i === stg ? 'aria-current="step"' : ''}><span>${ICO[i]}</span><small>${s}</small></button>`).join('')}</nav>
<div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round((P.page + 1) / n * 100)}"><i style="width:${(P.page + 1) / n * 100}%"></i></div>
<small>الصفحة ${dig(P.page + 1)} من ${dig(n)} · ${title}</small>
<div id="s2t"></div>
<div class="s1nav"><button class="btn" data-p ${P.page ? '' : 'disabled'}>➡️ السابق</button><button class="btn" data-n ${P.page < n - 1 ? '' : 'hidden'}>التالي ⬅️</button></div>`;
      const c = root.querySelector('#s2t');
      try { PG[id](c, ctx); } catch (e) { c.innerHTML = '<section class="card"><p>حصلت مشكلة بسيطة في عرض الصفحة 💗 جرّبي ترجعي للمهارات وتفتحيها تاني.</p></section>'; if (window.console) console.error(e); }
      root.querySelector('[data-p]').onclick = () => go(P.page - 1);
      root.querySelector('[data-n]').onclick = () => go(P.page + 1);
      root.querySelectorAll('[data-st]').forEach(b => b.onclick = () => go(ORDER.findIndex(x => x[1] === +b.dataset.st)));
      root.querySelectorAll('[data-x]').forEach(b => b.onclick = () => api.go(b.dataset.x, SKILL_ID));
    }
    draw();
  };

  const W = { anat: (s, a) => TS.anat(s, a), coefw: (s, a) => TS.coefw(s, a), count: (s, a) => TS.count(s, a) };
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
  TM.lesson = parts => { parts = VS.deep(parts); return (c, x) => {
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
  const V = (t, a, w) => ({ type: 'val', t, a, w, kind: K });
  const kd = q => Object.assign(q, { kind: K });
  TM.mk = { M, T, V, kd };

  /* ---------- أولًا: افتكري المعلومة (بطاقات صغيرة) ---------- */
  const L = TM.lesson;
  PG.r1 = L([
    { t: '🔤 بطاقة: المتغير', html: 'المتغير رمز (غالبًا حرف زي {{س}} أو {{ص}}) بيمثل <b>عددًا</b> ممكن تتغير قيمته.', qs: [M('أي الآتي متغير؟', ['{{س}}', '{{5}}', '{{+}}'], 0, 'الحرف {{س}} بيمثل عددًا قيمته ممكن تتغير.')] },
    { t: '🧮 بطاقة: التعبير الجبري', html: 'التعبير الجبري تعبير رياضي فيه <b>أعداد ومتغيرات وعمليات حسابية</b>، زي {{3س + 5}}.', qs: [M('أي الآتي تعبير جبري؟', ['{{4ص - 1}}', '{{4 + 1}}', '{{=}}'], 0, 'فيه عدد ومتغير وعملية، يعني تعبير جبري.'), T('{{2س + 7}} تعبير جبري.', true, 'فيه عدد ومتغير وعملية جمع.')] }
  ]);
  PG.r2 = L([
    { t: '✖️ بطاقة: العدد جنب المتغير', html: 'العدد المكتوب جنب المتغير معناه <b>ضرب</b>: {{5س}} تعني {{5 × س}} (مش {{5 + س}}).', qs: [M('{{7ص}} تعني:', ['{{7 × ص}}', '{{7 + ص}}', '{{ص^7}}'], 0, 'العدد جنب المتغير بيضرب فيه.'), V('لو {{س = 3}} فقيمة {{5س}} =', 15, '{{5 × 3 = 15}}.')] },
    { t: '📌 بطاقة: العدد الثابت', html: 'العدد اللي مفيهوش متغير بنسميه <b>عدد ثابت</b>، زي {{7}} في {{2س + 7}}.', qs: [M('في {{4س + 9}} العدد الثابت هو:', ['{{4}}', '{{9}}', '{{س}}'], 1, '{{9}} مفيش جنبه حرف.'), T('{{س}} عدد ثابت.', false, '{{س}} متغير مش ثابت.')] }
  ]);
  PG.r3 = L([
    { t: '📋 بطاقة: ترتيب العمليات', html: 'الأقواس ← الأسس ← الضرب والقسمة ← الجمع والطرح (من اليسار لليمين).', qs: [V('احسبي {{3 + 2 × 4}}', 11, 'الضرب الأول: {{2 × 4 = 8}} ثم {{3 + 8 = 11}}.'), V('احسبي {{2 × 3^2}}', 18, 'الأس الأول: {{3^2 = 9}} ثم {{2 × 9 = 18}}.'), V('احسبي {{(3 + 2) × 4}}', 20, 'الأقواس الأول: {{5 × 4 = 20}}.')] }
  ]);
})();
    
