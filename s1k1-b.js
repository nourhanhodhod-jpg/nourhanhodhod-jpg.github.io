/* 🌸 مرحلة «افهمي»: شرح العمليات الأربع، كل قاعدة معاها نشاط صغير */
(function () {
  const { dig, fmt, nl, X, sgn } = S1K, PG = S1K.pg;
  const card = (t, h) => `<section class="card"><h3>${t}</h3>${h}</section>`;
  const exs = a => '<div class="exs">' + a.map(e => `<div>${fmt('{{' + e + '}}')}</div>`).join('') + '</div>';
  const rule = t => `<div class="rule">📌 ${t}</div>`;
  const css = document.createElement('style');
  css.textContent = `.mv{background:#fff8f2;border-radius:16px;padding:10px;margin-top:10px}.mvr{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;direction:ltr;margin-bottom:6px}
.stp{display:flex;align-items:center;gap:6px;background:#fff;border:2px solid var(--p);border-radius:16px;padding:2px 8px}.stp b{min-width:44px;text-align:center;font-size:1.3rem;color:var(--deep)}.stp button{font:inherit;font-size:1.4rem;font-weight:800;width:42px;height:42px;border:0;border-radius:50%;background:var(--s);color:var(--deep);cursor:pointer}
.stp small{font-weight:700}.mv .btn{display:block;margin:6px auto}.mvt{text-align:center;font-weight:700;min-height:3em}
.flips{display:grid;gap:10px;margin:10px 0}@media(min-width:600px){.flips{grid-template-columns:1fr 1fr}}.flip{font:inherit;text-align:right;border:2px solid var(--p);background:#fff;color:var(--ink);border-radius:16px;padding:10px 14px;cursor:pointer;min-height:64px;width:100%}.flip.open{background:#fff8e6;border-color:#e0a526}.flip i{display:block;font-style:normal;margin-top:6px;font-weight:400}`;
  document.head.appendChild(css);

  /* خط الأعداد المتحرك: اضبطي العددين واضغطي انطلقي */
  function mover(c, a0, b0) {
    const o = { min: -10, max: 10, step: 40, every: 2 }; let a = a0, b = b0;
    const m = document.createElement('div'); m.className = 'mv';
    m.innerHTML = `<b>🚶‍♀️ جرّبي بنفسك على خط الأعداد</b><div class="mvr">${['a', 'b'].map(k => `<div class="stp"><button data-k="${k}" data-d="-1" aria-label="نقص">−</button><b id="v${k}"></b><button data-k="${k}" data-d="1" aria-label="زيادة">+</button></div>`).join('')}</div><div class="mvl"></div><button class="btn" data-go>انطلقي 🚶‍♀️</button><p class="mvt" aria-live="polite"></p>`;
    c.appendChild(m);
    const L = m.querySelector('.mvl'), T = m.querySelector('.mvt');
    const draw = () => { m.querySelector('#va').textContent = sgn(a); m.querySelector('#vb').textContent = sgn(b); L.innerHTML = nl({ ...o, dot: a }); T.innerHTML = fmt(`المسألة: {{(${a < 0 ? a : '+' + a}) + (${b < 0 ? b : '+' + b})}} . اضبطي العددين بالأزرار ثم اضغطي «انطلقي».`); };
    m.querySelectorAll('.stp button').forEach(x => x.onclick = () => { const k = x.dataset.k, d = +x.dataset.d; if (k === 'a') a = Math.max(-5, Math.min(5, a + d)); else b = Math.max(-5, Math.min(5, b + d)); draw(); });
    m.querySelector('[data-go]').onclick = () => {
      L.innerHTML = nl({ ...o, dot: a, arc: b ? { from: a, to: a + b } : null });
      const g = L.querySelector('.dg'); requestAnimationFrame(() => requestAnimationFrame(() => { g.style.transform = `translateX(${X(o, a + b)}px)`; }));
      T.innerHTML = fmt(b === 0 ? `الجمع على صفر مبيحرّكش: الناتج {{${a}}}.` : `نبدأ من {{${a}}} ونتحرك ${Math.abs(b)} خطوات ${b > 0 ? 'لليمين ➡️ (عدد موجب)' : 'لليسار ⬅️ (عدد سالب)'} فنوصل لـ {{${a + b}}}.`);
    };
    draw();
  }

  PG.add1 = (c, x) => {
    c.insertAdjacentHTML('beforeend', card('➕ ١) الجمع: عددان لهما نفس الإشارة', `<p>تخيلي إن عليكي ديون ${dig(4)} جنيه، وبعدين استلفتي ${dig(6)} كمان. ديونك بقت ${dig(10)}. يعني بنجمع الأرقام والإشارة مبتتغيرش.</p>${rule('نجمع القيمتين المطلقتين ونحتفظ بنفس الإشارة.')}${exs(['(+5) + (+3) = +8', '(-4) + (-6) = -10'])}`));
    mover(c, -4, -5);
    x.ask(c, { id: 'm1', type: 'mcq', kind: 'نشاط صغير', t: 'احسبي: {{(-2) + (-9)}}', o: ['{{-11}}', '{{-7}}', '{{11}}'], c: 0, w: 'الإشارتان سالبتان ← نجمع {{2 + 9 = 11}} ونحتفظ بالسالب: {{-11}}.' });
  };
  PG.add2 = (c, x) => {
    c.insertAdjacentHTML('beforeend', card('➕ ٢) الجمع: عدد موجب وعدد سالب', `<p>الموجب بيحركنا يمين والسالب بيحركنا شمال، فالاتنين بيشدّوا في اتجاهين متعاكسين، والأقوى هو اللي يكسب.</p>${rule('نطرح القيمة المطلقة الأصغر من الأكبر، ونضع إشارة العدد الأكبر في القيمة المطلقة.')}${exs(['(+8) + (-3) = +5', '(-9) + (+4) = -5'])}<p>في {{(-9) + (+4)}}: القيمتان ${dig(9)} و ${dig(4)} ← نطرح ${dig(9)} − ${dig(4)} = ${dig(5)}. والأكبر هو {{-9}} (سالب) فالناتج {{-5}}.</p>`.replace(/\{\{(.+?)\}\}/g, (m, e) => fmt(m))));
    mover(c, 3, -5);
    x.ask(c, { id: 'm2', type: 'mcq', kind: 'نشاط صغير', t: 'احسبي: {{(-7) + (+10)}}', o: ['{{-3}}', '{{3}}', '{{17}}'], c: 1, w: 'الإشارتان مختلفتان ← نطرح {{10 - 7 = 3}} والأكبر في القيمة المطلقة {{+10}} (موجب)، فالناتج {{+3}}.' });
  };
  PG.sub = (c, x) => {
    c.insertAdjacentHTML('beforeend', card('➖ الطرح', `<p>مفيش قاعدة جديدة للطرح! بنحوّله لجمع.</p>${rule('طرح عدد = جمع معكوسه الجمعي (نغيّر إشارة العدد المطروح ونجمع).')}${exs(['7 - 3 = 7 + (-3) = 4', '7 - (-3) = 7 + (+3) = 10', '-5 - 2 = -5 + (-2) = -7', '-5 - (-2) = -5 + (+2) = -3'])}`));
    [['9 - (-2)', ['9 + (-2)', '9 + (+2)', '9 - (+2)'], 1, '{{9 - (-2) = 9 + (+2) = 11}}'], ['-6 - 4', ['-6 + 4', '-6 + (-4)', '6 + (-4)'], 1, '{{-6 - 4 = -6 + (-4) = -10}}'], ['-3 - (-8)', ['-3 + (-8)', '-3 + 8', '3 + 8'], 1, '{{-3 - (-8) = -3 + 8 = 5}}']].forEach(([e, o, k, w], i) =>
      x.ask(c, { id: 'e' + (i + 1), type: 'mcq', kind: 'اختاري العملية المكافئة', t: `حوّلي الطرح لجمع: {{${e}}} تساوي...`, o: o.map(v => '{{' + v + '}}'), c: k, w: 'نحوّل الطرح لجمع معكوس العدد المطروح: ' + w + '.' }));
  };
  PG.mul = (c, x) => {
    c.insertAdjacentHTML('beforeend', card('✖️ الضرب', `<p>الأول الموجب في الموجب: {{(+3) * (+4) = +12}} زي ما عرفنا. وللإشارات قاعدة سهلة:</p>${rule('إشارتان متشابهتان ← الناتج موجب. إشارتان مختلفتان ← الناتج سالب.')}<p>اضغطي على كل بطاقة وشوفي الناتج:</p>`.replace(/\{\{(.+?)\}\}/g, (m) => fmt(m))));
    flips(c, [['(+) × (+)', 'موجب ✅ مثال: {{(+3) * (+4) = +12}}'], ['(−) × (−)', 'موجب ✅ مثال: {{(-3) * (-4) = +12}}'], ['(+) × (−)', 'سالب ✅ مثال: {{(+3) * (-4) = -12}}'], ['(−) × (+)', 'سالب ✅ مثال: {{(-3) * (+4) = -12}}']]);
    c.insertAdjacentHTML('beforeend', '<section class="card"><p>💡 ليه سالب × سالب = موجب؟ لأن {{(-3) * (+4) = -12}} ولما نعكس إشارة العدد {{4}} لـ {{-4}} بتتعكس إشارة الناتج: يبقى {{(-3) * (-4) = +12}}.</p></section>'.replace(/\{\{(.+?)\}\}/g, m => fmt(m)));
    x.ask(c, { id: 'm3', type: 'mcq', kind: 'نشاط صغير', t: 'احسبي: {{(-6) * (+3)}}', o: ['{{18}}', '{{-18}}', '{{-9}}'], c: 1, w: 'إشارتان مختلفتان ← سالب. {{6 * 3 = 18}} فالناتج {{-18}}.' });
  };
  PG.div = (c, x) => {
    c.insertAdjacentHTML('beforeend', card('➗ القسمة', `<p>أحلى خبر: قواعد الإشارات في القسمة هي <b>نفس</b> قواعد الضرب بالظبط.</p>${rule('متشابهتان ← موجب، مختلفتان ← سالب.')}${exs(['(+20) / (+5) = +4', '(-20) / (-5) = +4', '(+20) / (-5) = -4', '(-20) / (+5) = -4'])}<p>⚠️ <b>القسمة على صفر غير ممكنة.</b> لكن صفر مقسوم على أي عدد غير صفر يساوي صفر: {{0 / 5 = 0}}.</p>`.replace(/\{\{(.+?)\}\}/g, m => fmt(m))));
    x.ask(c, { id: 'm4', type: 'mcq', kind: 'نشاط صغير', t: 'احسبي: {{(-20) / (+5)}}', o: ['{{4}}', '{{-4}}', '{{-15}}'], c: 1, w: 'إشارتان مختلفتان ← سالب. {{20 / 5 = 4}} فالناتج {{-4}}.' });
    x.ask(c, { id: 'm5', type: 'tf', kind: 'نشاط صغير', t: 'صح ولا غلط؟ {{0 / (-5) = 0}}', c: true, w: 'صفر مقسوم على أي عدد غير صفر = صفر. الممنوع هو القسمة <b>على</b> صفر.' });
  };
  PG.props = (c, x) => {
    c.insertAdjacentHTML('beforeend', card('🧠 معلومات متنسيهاش', '<p>اضغطي على كل معلومة عشان تشوفي مثال عليها:</p>'));
    flips(c, [['جمع الصفر لا يغيّر قيمة العدد', 'مثال: {{7 + 0 = 7}} و {{-7 + 0 = -7}}'], ['طرح العدد من نفسه يساوي صفرًا', 'مثال: {{9 - 9 = 0}} و {{-4 - (-4) = 0}}'], ['ضرب أي عدد في صفر يساوي صفرًا', 'مثال: {{(-8) * 0 = 0}}'], ['ضرب أي عدد في ١ لا يغيّر قيمته', 'مثال: {{(-5) * 1 = -5}}'], ['لا يمكن القسمة على صفر', 'مثال: {{5 / 0}} مستحيلة'], ['الصفر ليس له معكوس ضربي', 'معكوس {{2}} الضربي هو النصف، لأن حاصل ضرب {{2}} في النصف يساوي {{1}}. لكن مفيش عدد لما نضربه في {{0}} يطلع {{1}}']]);
    x.ask(c, { id: 'm6', type: 'tf', kind: 'نشاط صغير', t: 'صح ولا غلط؟ {{(-9) * 1 = 9}}', c: false, w: 'الضرب في ١ لا يغيّر العدد: {{(-9) * 1 = -9}}.' });
  };

  function flips(c, a) {
    const d = document.createElement('div'); d.className = 'flips';
    d.innerHTML = a.map(([q, r]) => `<button class="flip"><b>${fmt(q)}</b><i hidden>${fmt(r)}</i></button>`).join('');
    d.querySelectorAll('.flip').forEach(b => b.onclick = () => { const i = b.querySelector('i'); i.hidden = !i.hidden; b.classList.toggle('open', !i.hidden); });
    c.appendChild(d);
  }
})();
      
