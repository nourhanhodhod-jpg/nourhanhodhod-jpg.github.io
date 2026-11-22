/* 🌸 صفحة مهارة: الجذور التربيعية (الهيكل + مرحلة «افتكري»)
   كود المهارة في skills.js هو s1k6 (السادسة في القسم الأول: «الجذور التربيعية»). لو عايزة تغيّريه غيّري السطر اللي تحت.
   الملفات المكمّلة: s1k6-b.js (الشرح التفاعلي) و s1k6-bank.js (الأسئلة) و s1k6-c.js (الأمثلة والتدريب والاختبار والملخص). */
(function () {
  const { dig, fmt, qcard } = FR;
  const SKILL_ID = 's1k6', TITLE = 'الجذور التربيعية';
  
  const ORDER = [['r1', 0, 'مراجعة الضرب'], ['r2', 0, 'المربعات الكاملة'], ['r3', 0, 'قواعد الإشارات'],
    ['l1', 1, 'يعني إيه جذر تربيعي؟'], ['l2', 1, 'جذر المربعات الكاملة'], ['l3', 1, 'الأعداد غير المربعة الكاملة'], ['l4', 1, 'تبسيط الجذور'], ['l5', 1, 'جذور فيها متغيرات'], ['l6', 1, 'ضرب الجذور'], ['l7', 1, 'قسمة الجذور'], ['l8', 1, 'جمع وطرح الجذور'], ['l9', 1, 'مقارنة الجذور'], ['l10', 1, 'ترشيد المقام'],
    ['ex', 2, 'أمثلة محلولة'], ['pr1', 3, 'المستوى الأول: سهل'], ['pr2', 3, 'المستوى الثاني: متوسط'], ['pr3', 3, 'المستوى الثالث: متقدم'], ['quiz', 4, 'الاختبار النهائي'], ['sum', 5, 'ملخص المعلومة']];
  const STG = ['افتكري', 'افهمي', 'شوفي الحل', 'جربي', 'اختبري نفسك', 'الملخص'], ICO = ['🌱', '💡', '✏️', '🎮', '🧠', '🎀'];
  const PG = RO.pg = {}; RO.ORDER = ORDER; RO.SKILL_ID = SKILL_ID;

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
<section class="card pink"><div class="bow">√</div><h2>${TITLE}</h2></section>
<nav class="stg" aria-label="مراحل المهارة">${STG.map((s, i) => `<button data-st="${i}" class="${i === stg ? 'on' : i < stg ? 'dn' : ''}" ${i === stg ? 'aria-current="step"' : ''}><span>${ICO[i]}</span><small>${s}</small></button>`).join('')}</nav>
<div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round((P.page + 1) / n * 100)}"><i style="width:${(P.page + 1) / n * 100}%"></i></div>
<small>الصفحة ${dig(P.page + 1)} من ${dig(n)} · ${title}</small>
<div id="s6c"></div>
<div class="s1nav"><button class="btn" data-p ${P.page ? '' : 'disabled'}>➡️ السابق</button><button class="btn" data-n ${P.page < n - 1 ? '' : 'hidden'}>التالي ⬅️</button></div>`;
      const c = root.querySelector('#s6c');
      try { PG[id](c, ctx); } catch (e) { c.innerHTML = '<section class="card"><p>حصلت مشكلة بسيطة في عرض الصفحة 💗 جرّبي ترجعي للمهارات وتفتحيها تاني.</p></section>'; if (window.console) console.error(e); }
      root.querySelector('[data-p]').onclick = () => go(P.page - 1);
      root.querySelector('[data-n]').onclick = () => go(P.page + 1);
      root.querySelectorAll('[data-st]').forEach(b => b.onclick = () => go(ORDER.findIndex(x => x[1] === +b.dataset.st)));
      root.querySelectorAll('[data-x]').forEach(b => b.onclick = () => api.go(b.dataset.x, SKILL_ID));
    }
    draw();
  };

  const W = { sqtable: s => RO.sqtable(s), simp: (s, a) => RO.simp(s, a), between: (s, a) => RO.between(s, a) };
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
  RO.lesson = parts => { parts = RO.deep(parts); return (c, x) => {
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
  const I = (t, a, w) => ({ type: 'int5', t, a, w, kind: K }), Rd = (t, tm, a, w) => ({ type: 'rad', t, tm, a, w, kind: K });
  RO.mk = { M, T, I, Rd };
  const L = RO.lesson;
  /* ---------- أولًا: افتكري المعلومة (٣ دروس) ---------- */
  PG.r1 = L([
    { t: '✖️ الضرب وتكراره', html: 'الضرب هو جمع نفس العدد عدة مرات. لو ضربنا عدد في نفسه بنقول إننا <b>ربّعناه</b>.' },
    { t: '📚 أمثلة', html: '{{4 × 4 = 16}} ، {{7 × 7 = 49}} ، {{10 × 10 = 100}}. العدد اتضرب في نفسه.', qs: [I('احسبي {{6 × 6}}', 36, '{{6 × 6 = 36}}.'), I('احسبي {{9 × 9}}', 81, '{{9 × 9 = 81}}.')] },
    { t: '🤔 فكري', qs: [M('إيه ناتج {{8 × 8}}؟', ['{{16}}', '{{64}}', '{{88}}'], 1, '{{8 × 8 = 64}}. الرقم {{16}} هو {{8 + 8}} (جمع مش ضرب).')] }
  ]);
  PG.r2 = L([
    { t: '🟦 يعني إيه مربع كامل؟', html: 'المربع الكامل هو عدد صحيح ناتج من ضرب <b>عدد صحيح في نفسه</b>. مثال: {{9 = 3 × 3 = 3^2}} فـ {{9}} مربع كامل، أما {{10}} فمش مربع كامل لأنه مفيش عدد صحيح مربعه {{10}}.' },
    { t: '🔢 جدول المربعات', html: 'اضغطي على أي عدد وشوفي مربعه. الجدول ده هيساعدك طول المهارة، فحاولي تحفظي أول ١٥ مربع:', wd: 'sqtable' },
    { t: '🎮 جرّبي', qs: [M('أي عدد من دول مربع كامل؟', ['{{50}}', '{{64}}', '{{72}}'], 1, '{{8 × 8 = 64}}، أما {{50}} و{{72}} مفيش عدد صحيح مربعه بيطلعهم.'), I('احسبي {{13^2}}', 169, '{{13 × 13 = 169}}.')] }
  ]);
  PG.r3 = L([
    { t: '➕➖ قواعد الإشارات في الضرب', html: '{{(+) × (+) = (+)}} ، {{(-) × (-) = (+)}} ، {{(+) × (-) = (-)}}. يعني الإشارتان المتشابهتان تدّيان موجب، والمختلفتان تدّيان سالب.' },
    { t: '⚠️ الأقواس بتفرق!', html: '{{(-3)^2 = (-3) × (-3) = 9}} لكن {{-3^2 = -(3 × 3) = -9}}. في الأولى الأس بيشمل السالب (بسبب القوس)، وفي التانية الأس على {{3}} بس والسالب بيتحط بعد كده.', rule: 'مربع أي عدد (موجب أو سالب) <b>موجب أو صفر</b> دايمًا. يعني مفيش عدد حقيقي مربعه سالب.', qs: [I('احسبي {{(-4)^2}}', 16, '{{(-4) × (-4) = 16}}.'), I('احسبي {{-4^2}}', -16, 'الأس على {{4}} بس: {{4^2 = 16}} وبعدين السالب: {{-16}}.')] }
  ]);

})();
                                                                                                                        
