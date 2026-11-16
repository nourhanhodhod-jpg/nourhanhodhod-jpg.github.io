/* 🌸 مراحل: شوفي الحل / جربي بنفسك / اختبري نفسك / الملخص (مهارة الكسور) */
(function () {
  const { dig, fmt } = FR, PG = DR.pg, ID = DR.SKILL_ID, S3 = S4;
  const css = document.createElement('style');
  css.textContent = `.res3{background:#dff3e4;border:2px solid #2e8b57;border-radius:16px;padding:6px 14px;text-align:center;font-size:1.3rem;font-weight:800;color:#14532d;margin:10px 0}.sc3{font-size:1.4rem;font-weight:800;color:var(--deep)}
.miss{background:#fff8f2;border:2px solid var(--p);border-radius:16px;padding:8px 14px;margin:10px 0}.miss p{margin:4px 0}.warn{background:#fff3d6;border:2px dashed #e0a526;border-radius:16px;padding:6px 16px;margin:10px 0}`;
  document.head.appendChild(css);
  const ansHtml = a => fmt(a);

  /* ---------- ثالثًا: شوفي الحل ---------- */
  PG.ex = (c, x) => {
    const EX = S3.examples, S = x.P.ex; S.cur = S.cur || 0; S.d = S.d || {};
    const box = document.createElement('div'); c.appendChild(box);
    const paint = () => {
      const i = S.cur, e = EX[i], n = S.d[i] || 0, fin = k => (S.d[k] || 0) >= EX[k].steps.length;
      box.innerHTML = `<section class="card"><h3>✏️ أمثلة محلولة خطوة بخطوة</h3><p>اختاري مثال واضغطي «الخطوة التالية» لحد ما الحل يكتمل. كل خطوة معاها سبب.</p><div class="tabs">${EX.map((_, k) => `<button class="sm${k === i ? ' on' : ''}" data-t="${k}" aria-label="مثال ${dig(k + 1)}">${fin(k) ? '✅' : dig(k + 1)}</button>`).join('')}</div></section>
<section class="card step"><h3>مثال ${dig(i + 1)} من ${dig(EX.length)}</h3><p class="qt">${fmt(e.t)}</p><ol class="stps">${e.steps.slice(0, n).map(s => `<li>${fmt(s)}</li>`).join('')}</ol>
${n >= e.steps.length && e.warn ? `<div class="warn">⚠️ ${fmt(e.warn)}</div>` : ''}${n >= e.steps.length ? `<div class="res3">✅ الناتج النهائي: ${ansHtml(e.ans)}</div>${i < EX.length - 1 ? '<button class="btn" data-nx>المثال التالي ⬅️</button>' : '<p>🎉 خلصتي كل الأمثلة! كمّلي للتدريب.</p>'}` : '<button class="btn" data-stp>الخطوة التالية ⬇️</button>'}</section>`;
      box.querySelectorAll('[data-t]').forEach(b => b.onclick = () => { S.cur = +b.dataset.t; x.save(); paint(); });
      const s = box.querySelector('[data-stp]'); if (s) s.onclick = () => { S.d[i] = n + 1; x.save(); paint(); };
      const nx = box.querySelector('[data-nx]'); if (nx) nx.onclick = () => { S.cur = i + 1; x.save(); paint(); window.scrollTo(0, 0); };
    };
    paint();
  };

  /* ---------- رابعًا: جربي بنفسك ---------- */
  const LV = { 1: ['المستوى الأول: سهل', 'أسئلة على المفاهيم الأساسية.'], 2: ['المستوى الثاني: متوسط', 'العمليات على العشرية والنسبية.'], 3: ['المستوى الثالث: متقدم', 'عمليات مركبة ومسائل لفظية وتفكير.'] };
  const prac = lv => (c, x) => {
    const qs = S3.practice.filter(q => q.lv === lv), key = 'l' + lv, A = x.P.ans, N = qs.length;
    const right = () => qs.filter(q => A[q.id] && A[q.id].r).length, answered = () => qs.filter(q => A[q.id]).length;
    if (x.P.pi[key] === undefined) { const f = qs.findIndex(q => !A[q.id]); x.P.pi[key] = f < 0 ? N : f; }
    const box = document.createElement('div'); c.appendChild(box);
    const paint = () => {
      const i = x.P.pi[key], ans = answered();
      box.innerHTML = `<section class="card pink"><h3>🎮 ${LV[lv][0]}</h3><p>${LV[lv][1]} (فيه تلميح 💡 قبل ما تجاوبي)</p><div class="bar"><i style="width:${ans / N * 100}%"></i></div><small>أجبتي على ${dig(ans)} من ${dig(N)} · صح: ${dig(right())}</small></section><div id="qb"></div>`;
      const qb = box.querySelector('#qb');
      if (i >= N) {
        const p = Math.round(right() / N * 100);
        qb.innerHTML = `<section class="card pink"><div class="bow">${p >= 80 ? '🏆' : '🌷'}</div><h3>خلصتي المستوى!</h3><p class="sc3">${dig(right())} من ${dig(N)}</p><p>${p >= 80 ? 'ممتاز! إنتي فاهمة العشرية والنسبية كويس 💗' : p >= 50 ? 'كويس! راجعي الأسئلة اللي غلطتي فيها وشوفي التفسير.' : 'مفيش مشكلة، ارجعي لصفحات الشرح وجرّبي تاني 💗'}</p><button class="sm" data-rv>راجعي الأسئلة 🔄</button></section>`;
        qb.querySelector('[data-rv]').onclick = () => { x.P.pi[key] = 0; x.save(); paint(); }; return;
      }
      x.ask(qb, qs[i], { head: 'سؤال ' + dig(i + 1) + ' من ' + dig(N), after: () => { nav(); } });
      nav();
    };
    const nav = () => {
      const i = x.P.pi[key], q = qs[i]; box.querySelectorAll('.pnav').forEach(e => e.remove());
      const d = document.createElement('div'); d.className = 'inrow pnav';
      d.innerHTML = `${i > 0 ? '<button class="sm" data-pp>➡️ السؤال السابق</button>' : ''}${A[q.id] ? `<button class="btn" data-pn>${i < N - 1 ? 'السؤال التالي ⬅️' : 'شوفي النتيجة 🌟'}</button>` : ''}`;
      box.querySelector('#qb').appendChild(d);
      const pp = d.querySelector('[data-pp]'), pn = d.querySelector('[data-pn]');
      if (pp) pp.onclick = () => { x.P.pi[key] = i - 1; x.save(); paint(); };
      if (pn) pn.onclick = () => { x.P.pi[key] = i + 1; x.save(); paint(); window.scrollTo(0, 0); };
    };
    paint();
  };
  PG.pr1 = prac(1); PG.pr2 = prac(2); PG.pr3 = prac(3);

  /* ---------- خامسًا: اختبري نفسك ---------- */
  const TOP = { place: ['القيمة المكانية', 'd1', 'الأرقام بعد الفاصلة: أعشار ثم أجزاء من مائة ثم أجزاء من ألف.'], types: ['أنواع العشرية', 'd2', 'المنتهي له عدد محدود من الأرقام، والدوري بيتكرر، وغير النسبي لا ينتهي ولا يتكرر.'], f2d: ['من كسر إلى عشري', 'd4', 'اقسمي البسط على المقام وكمّلي بإضافة أصفار.'], d2f: ['من عشري إلى كسر', 'd4', 'اكتبي الرقم من غير فاصلة على {{10}} أو {{100}} أو {{1000}} ثم بسّطي.'], rat: ['الأعداد النسبية', 'd5', 'النسبي هو اللي نقدر نكتبه على صورة كسر، والعشري اللي لا ينتهي ولا يتكرر غير نسبي.'], cmp: ['المقارنة', 'd3', 'ساوي المنازل العشرية بالأصفار وبعدين قارني.'], ops: ['العمليات العشرية', 'add', 'رتّبي الفواصل تحت بعض في الجمع والطرح، وعدّي المنازل في الضرب.'], sign: ['قواعد الإشارات', 'sgn', 'في الجمع: مختلفتان نطرح. في الضرب: متشابهتان موجب.'], mix: ['العمليات المركبة', 'mix', 'الأقواس أولًا ثم الضرب والقسمة ثم الجمع والطرح.'], word: ['المسائل اللفظية', 'mix', 'حدّدي العملية من الكلمات: «تبقّى» طرح، «ثمن» ضرب.'] };
  const disp = (q, a) => q.type === 'mcq' ? fmt(q.o[a]) : fmt('{{' + DR.dc(DR.nrm(a)) + '}}');
  const corr = q => q.type === 'mcq' ? fmt(q.o[q.c]) : q.type === 'dec' ? fmt(DR.show(q.a)) : fmt('{{' + q.a + '}}');
  PG.quiz = (c, x) => {
    const Q = S3.quiz, A = x.P.ans, box = document.createElement('div'); c.appendChild(box);
    let i = Q.findIndex(q => !A[q.id]); if (i < 0) i = Q.length;
    const paint = () => {
      box.innerHTML = ''; if (i >= Q.length) return results(); x.gate(false);
      const done = Q.filter(q => A[q.id]).length;
      box.insertAdjacentHTML('beforeend', `<section class="card pink"><h3>🧠 اختبري نفسك</h3><p>١٠ أسئلة متنوعة من كل أجزاء المهارة، سؤال في كل مرة. الإجابة الصحيحة والتفسير بيظهروا بعد ما تجاوبي.</p><div class="bar"><i style="width:${done / Q.length * 100}%"></i></div><small>سؤال ${dig(i + 1)} من ${dig(Q.length)}</small></section>`);
      const q = Q[i]; x.ask(box, q, { nohint: true, after: (a, r) => { if (r) x.api.coin(ID + q.id); else x.api.wrong(); nx(); } });
    };
    const nx = () => {
      const b = document.createElement('button'); b.className = 'btn'; b.textContent = i < Q.length - 1 ? 'السؤال التالي ⬅️' : 'شوفي نتيجتك 🌟';
      b.onclick = () => { i++; paint(); window.scrollTo(0, 0); }; box.appendChild(b); b.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    };
    const results = () => {
      const sc = Q.filter(q => A[q.id] && A[q.id].r).length, wrong = Q.filter(q => !A[q.id].r), pass = sc >= 7, nm = x.api.nm();
      x.api.done(ID, sc, pass); x.gate(true);
      const msg = sc === 10 ? 'ممتاز جدًا! درجة كاملة 🌟' : sc >= 7 ? 'أداء رائع! إنتي متقنة المهارة 💗' : sc >= 4 ? 'محاولة كويسة! راجعي النقاط الضعيفة وجرّبي تاني، وهتتحسني بسرعة 🌷' : 'مفيش مشكلة خالص، ده معناه إننا محتاجين نراجع الأساس سوا. ارجعي للشرح وجرّبي تاني 💪';
      box.innerHTML = `<section class="card pink"><div class="bow">${pass ? '🏆' : '🌷'}</div><h3>${pass ? 'برافو ' + nm + '! أتقنتي المهارة' : 'مفيش مشكلة ' + nm + ' 💗'}</h3><p class="sc3">${dig(sc)} من ${dig(Q.length)}</p><p>✅ إجابات صحيحة: ${dig(sc)} · ❌ إجابات خاطئة: ${dig(wrong.length)} · النسبة: ${dig(Math.round(sc / Q.length * 100))}٪</p><p>${msg}</p><p>${pass ? 'عدّيتي الاختبار (٧ من ١٠) ✅' : 'محتاجة ٧ من ١٠ عشان نعتبر المهارة متقنة.'}</p></section>`
        + (wrong.length ? '<section class="card"><h3>📚 الأسئلة اللي محتاجة مراجعة</h3>' + wrong.map(q => `<div class="miss"><p><b>${fmt(q.t)}</b></p><p>إجابتك: ${disp(q, A[q.id].a)}</p><p>الإجابة الصحيحة: ${corr(q)}</p><p>${fmt(q.w)}</p><p>💡 سبب الخطأ المحتمل: ${fmt(TOP[q.topic][2])}</p></div>`).join('') + `<p>ارجعي للدروس دي:</p><div class="tabs">${[...new Set(wrong.map(q => q.topic))].map(t => `<button class="sm" data-g="${TOP[t][1]}">${TOP[t][0]} ⬅️</button>`).join('')}</div></section>` : '<section class="card"><p>مفيش أي نقطة ضعف ظاهرة، شغل ممتاز 🎀</p></section>')
        + '<button class="btn" data-rt>إعادة الاختبار 🔄</button>';
      box.querySelectorAll('[data-g]').forEach(b => b.onclick = () => x.go(b.dataset.g));
      box.querySelector('[data-rt]').onclick = () => { Q.forEach(q => delete A[q.id]); x.save(); i = 0; paint(); window.scrollTo(0, 0); };
    };
    paint();
  };

  /* ---------- سادسًا: ملخص المعلومة ---------- */
  PG.sum = (c, x) => {
    const ok = x.api.mastered(ID), R = DR.deep([['🔢 القيمة المكانية', 'بعد الفاصلة: أعشار ثم أجزاء من مائة ثم أجزاء من ألف. {{0.25 = 25/100 = 1/4}}'], ['🔁 أنواع العشرية', 'منتهٍ ({{0.5}}) ، دوري ({{0.333}}…) ، لا ينتهي ولا يتكرر ({{√2}}). الأول والثاني نسبيان والثالث غير نسبي.'], ['⚖️ المقارنة', 'نقارن الجزء الصحيح ثم الأعشار ثم ما بعدها. الأصفار على اليمين لا تغيّر القيمة: {{0.5 = 0.50}}.'], ['➕➖ جمع وطرح العشرية', 'نرتّب الفاصلة تحت الفاصلة ونساوي المنازل بالأصفار. {{2.3 + 1.75 = 4.05}}'], ['✖️ ضرب العشرية', 'نضرب من غير الفواصل ثم نعدّ مجموع المنازل العشرية. {{1.2 * 0.3 = 0.36}}'], ['➗ قسمة العشرية', 'نحرّك الفاصلة في العددين معًا حتى يصبح المقسوم عليه صحيحًا. {{3.6 ÷ 0.6 = 36 ÷ 6 = 6}}'], ['🧮 العدد النسبي', 'كل عدد يمكن كتابته {{a/b}} حيث {{b ≠ 0}}: الصحيحة والكسور والعشرية المنتهية والدورية.'], ['➕✖️ قواعد الإشارات', 'الجمع: متشابهتان نجمع ونحتفظ بالإشارة، مختلفتان نطرح ونأخذ إشارة الأكبر. الضرب والقسمة: متشابهتان موجب، مختلفتان سالب.'], ['📋 ترتيب العمليات', 'الأقواس، ثم الضرب والقسمة، ثم الجمع والطرح.']]);
    c.insertAdjacentHTML('beforeend', `<section class="card pink"><div class="bow">🎀</div><h3>ملخص المعلومة: قبل ما تمشي</h3></section>${R.map(r => `<section class="card"><h3>${r[0]}</h3><p>${fmt(r[1])}</p></section>`).join('')}
<section class="warn"><h3>⚠️ أشهر الأخطاء</h3><ul class="pts"><li>عدم محاذاة الفواصل في الجمع والطرح.</li><li>وضع الفاصلة في مكان غلط في الضرب (لازم نعدّ منازل العددين).</li><li>تحريك الفاصلة في المقسوم فقط عند القسمة (لازم في العددين).</li><li>الخلط بين قاعدة إشارات الجمع وقاعدة إشارات الضرب.</li><li>الاعتقاد إن كل عدد عشري لا ينتهي هو غير نسبي (الدوري نسبي!).</li><li>الظن إن ٠،٥٩ أكبر من ٠،٦ لأن ٥٩ أكبر من ٦ (لازم نساوي المنازل الأول).</li></ul></section>
<section class="card ${ok ? 'pink' : ''}"><h3>${ok ? '✅ أتقنتي المهارة!' : '🎯 لسه فاضل الاختبار'}</h3><p>${ok ? 'مهارتك اتسجلت، وتقدري تكملي للمهارة اللي بعدها.' : 'عدّي الاختبار النهائي بـ ٧ من ١٠ عشان نسجّل المهارة ✅'}</p>${ok ? '<button class="btn" data-nx>المهارة التالية ⬅️</button>' : '<button class="btn" data-q>روحي للاختبار 🧠</button>'}<button class="link" data-bk>رجوع لقائمة المهارات</button></section>`);
    const n = c.querySelector('[data-nx]'), q = c.querySelector('[data-q]');
    if (n) n.onclick = () => x.api.go('next', ID); if (q) q.onclick = () => x.go('quiz');
    c.querySelector('[data-bk]').onclick = () => x.api.go('sec', ID);
  };
})();
      
