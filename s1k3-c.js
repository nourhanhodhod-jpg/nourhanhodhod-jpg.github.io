/* 🌸 مراحل: شوفي الحل / جربي بنفسك / اختبري نفسك / الملخص (مهارة الكسور) */
(function () {
  const { dig, fmt } = FR, PG = FR.pg, ID = FR.SKILL_ID;
  const css = document.createElement('style');
  css.textContent = `.res3{background:#dff3e4;border:2px solid #2e8b57;border-radius:16px;padding:6px 14px;text-align:center;font-size:1.3rem;font-weight:800;color:#14532d;margin:10px 0}.sc3{font-size:1.4rem;font-weight:800;color:var(--deep)}
.miss{background:#fff8f2;border:2px solid var(--p);border-radius:16px;padding:8px 14px;margin:10px 0}.miss p{margin:4px 0}.warn{background:#fff3d6;border:2px dashed #e0a526;border-radius:16px;padding:6px 16px;margin:10px 0}`;
  document.head.appendChild(css);
  const ansHtml = a => /^[\d ]+(\/\d+)?$/.test(a) ? fmt('{{' + a.replace(' ', '~') + '}}') : fmt(a.replace(/(\d+\/\d+)/g, '{{$1}}'));

  /* ---------- ثالثًا: شوفي الحل ---------- */
  PG.ex = (c, x) => {
    const EX = S3.examples, S = x.P.ex; S.cur = S.cur || 0; S.d = S.d || {};
    const box = document.createElement('div'); c.appendChild(box);
    const paint = () => {
      const i = S.cur, e = EX[i], n = S.d[i] || 0, fin = k => (S.d[k] || 0) >= EX[k].steps.length;
      box.innerHTML = `<section class="card"><h3>✏️ أمثلة محلولة خطوة بخطوة</h3><p>اختاري مثال واضغطي «الخطوة التالية» لحد ما الحل يكتمل. كل خطوة معاها سبب.</p><div class="tabs">${EX.map((_, k) => `<button class="sm${k === i ? ' on' : ''}" data-t="${k}" aria-label="مثال ${dig(k + 1)}">${fin(k) ? '✅' : dig(k + 1)}</button>`).join('')}</div></section>
<section class="card step"><h3>مثال ${dig(i + 1)} من ${dig(EX.length)}</h3><p class="qt">${fmt(e.t)}</p><ol class="stps">${e.steps.slice(0, n).map(s => `<li>${fmt(s)}</li>`).join('')}</ol>
${n >= e.steps.length ? `<div class="res3">✅ الناتج النهائي: ${ansHtml(e.ans)}</div>${i < EX.length - 1 ? '<button class="btn" data-nx>المثال التالي ⬅️</button>' : '<p>🎉 خلصتي كل الأمثلة! كمّلي للتدريب.</p>'}` : '<button class="btn" data-stp>الخطوة التالية ⬇️</button>'}</section>`;
      box.querySelectorAll('[data-t]').forEach(b => b.onclick = () => { S.cur = +b.dataset.t; x.save(); paint(); });
      const s = box.querySelector('[data-stp]'); if (s) s.onclick = () => { S.d[i] = n + 1; x.save(); paint(); };
      const nx = box.querySelector('[data-nx]'); if (nx) nx.onclick = () => { S.cur = i + 1; x.save(); paint(); window.scrollTo(0, 0); };
    };
    paint();
  };

  /* ---------- رابعًا: جربي بنفسك ---------- */
  const LV = { 1: ['المستوى الأول: سهل', 'أسئلة على المفاهيم الأساسية.'], 2: ['المستوى الثاني: متوسط', 'العمليات الحسابية على الكسور.'], 3: ['المستوى الثالث: متقدم', 'عمليات مركبة ومسائل لفظية وتفكير.'] };
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
        qb.innerHTML = `<section class="card pink"><div class="bow">${p >= 80 ? '🏆' : '🌷'}</div><h3>خلصتي المستوى!</h3><p class="sc3">${dig(right())} من ${dig(N)}</p><p>${p >= 80 ? 'ممتاز! إنتي فاهمة الكسور كويس 💗' : p >= 50 ? 'كويس! راجعي الأسئلة اللي غلطتي فيها وشوفي التفسير.' : 'مفيش مشكلة، ارجعي لصفحات الشرح وجرّبي تاني 💗'}</p><button class="sm" data-rv>راجعي الأسئلة 🔄</button></section>`;
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
  const TOP = { comp: ['مكونات الكسر', 'f1', 'راجعي معنى البسط (الأجزاء اللي معانا) والمقام (عدد الأجزاء المتساوية للكل).'], equiv: ['الكسور المتكافئة', 'f3', 'افتكري إننا بنضرب البسط والمقام في نفس العدد.'], simp: ['التبسيط', 'f4', 'ابحثي عن عامل مشترك أكبر واقسمي عليه البسط والمقام.'], cmp: ['المقارنة', 'f5', 'وحّدي المقامات أو استخدمي الضرب التبادلي.'],
    add: ['الجمع', 'add', 'وحّدي المقامات الأول وبعدين اجمعي البسطين بس، ومتجمعيش المقامات.'], sub: ['الطرح', 'sub', 'وحّدي المقامات الأول وبعدين اطرحي البسطين وبسّطي الناتج.'], mul: ['الضرب', 'mul', 'اضربي البسط في البسط والمقام في المقام، واختصري لو أمكن.'], div: ['القسمة', 'div', 'اقلبي الكسر التاني فقط وحوّلي القسمة لضرب.'], mix: ['العمليات المركبة', 'mix', 'الأقواس أولًا، ثم الضرب والقسمة، ثم الجمع والطرح.'], word: ['المسائل اللفظية', 'sub', 'حدّدي العملية من الكلمات: «مجموع» جمع، «تبقّى» طرح، «نصف» ضرب.'] };
  const disp = (q, a) => q.type === 'mcq' ? fmt(q.o[a]) : q.type === 'num' ? dig(a) : q.type === 'frac' ? fmt('{{' + ((+a.w ? a.w + '~' : '') + ((+a.n && +a.d) ? a.n + '/' + a.d : '') || '0').replace(/~$/, '') + '}}') : '';
  const corr = q => q.type === 'mcq' ? fmt(q.o[q.c]) : q.type === 'num' ? dig(q.a) : fmt('{{' + q.a.replace(' ', '~') + '}}');
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
        + (wrong.length ? '<section class="card"><h3>📚 الأسئلة اللي محتاجة مراجعة</h3>' + wrong.map(q => `<div class="miss"><p><b>${fmt(q.t)}</b></p><p>إجابتك: ${disp(q, A[q.id].a)}</p><p>الإجابة الصحيحة: ${corr(q)}</p><p>${fmt(q.w)}</p><p>💡 سبب الخطأ المحتمل: ${TOP[q.topic][2]}</p></div>`).join('') + `<p>ارجعي للدروس دي:</p><div class="tabs">${[...new Set(wrong.map(q => q.topic))].map(t => `<button class="sm" data-g="${TOP[t][1]}">${TOP[t][0]} ⬅️</button>`).join('')}</div></section>` : '<section class="card"><p>مفيش أي نقطة ضعف ظاهرة، شغل ممتاز 🎀</p></section>')
        + '<button class="btn" data-rt>إعادة الاختبار 🔄</button>';
      box.querySelectorAll('[data-g]').forEach(b => b.onclick = () => x.go(b.dataset.g));
      box.querySelector('[data-rt]').onclick = () => { Q.forEach(q => delete A[q.id]); x.save(); i = 0; paint(); window.scrollTo(0, 0); };
    };
    paint();
  };

  /* ---------- سادسًا: ملخص المعلومة ---------- */
  PG.sum = (c, x) => {
    const ok = x.api.mastered(ID), R = [['✂️ تبسيط الكسور', 'نقسم البسط والمقام على نفس العدد المشترك. {{8/12 = 2/3}}'], ['➕➖ جمع وطرح الكسور', 'نوحّد المقامات أولًا، ثم نجمع أو نطرح البسطين ونحتفظ بالمقام. {{1/2 + 1/3 = 3/6 + 2/6 = 5/6}}'], ['✖️ ضرب الكسور', 'البسط × البسط، والمقام × المقام. {{2/3 * 3/5 = 6/15 = 2/5}}'], ['➗ قسمة الكسور', 'نثبّت الكسر الأول، نقلب الثاني، ونحوّل القسمة إلى ضرب. {{1/2 ÷ 3/4 = 1/2 * 4/3 = 2/3}}'], ['🟰 الكسور المتكافئة', 'نضرب أو نقسم البسط والمقام في نفس العدد غير الصفري. {{1/2 = 2/4}}'], ['⚖️ مقارنة الكسور', 'نوحّد المقامات أو نستخدم الضرب التبادلي.'], ['📋 ترتيب العمليات', 'الأقواس، ثم الضرب والقسمة، ثم الجمع والطرح.']];
    c.insertAdjacentHTML('beforeend', `<section class="card pink"><div class="bow">🎀</div><h3>ملخص المعلومة: قبل ما تمشي</h3></section>${R.map(r => `<section class="card"><h3>${r[0]}</h3><p>${fmt(r[1])}</p></section>`).join('')}
<section class="warn"><h3>⚠️ أشهر الأخطاء</h3><ul class="pts"><li>جمع المقامات عند جمع الكسور (الصح: المقام بيفضل زي ما هو).</li><li>نسيان توحيد المقامات في الجمع والطرح.</li><li>قلب الكسر الأول بدل الثاني عند القسمة.</li><li>نسيان تبسيط الناتج.</li><li>تجاهل ترتيب العمليات.</li></ul></section>
<section class="card ${ok ? 'pink' : ''}"><h3>${ok ? '✅ أتقنتي المهارة!' : '🎯 لسه فاضل الاختبار'}</h3><p>${ok ? 'مهارتك اتسجلت، وتقدري تكملي للمهارة اللي بعدها.' : 'عدّي الاختبار النهائي بـ ٧ من ١٠ عشان نسجّل المهارة ✅'}</p>${ok ? '<button class="btn" data-nx>المهارة التالية ⬅️</button>' : '<button class="btn" data-q>روحي للاختبار 🧠</button>'}<button class="link" data-bk>رجوع لقائمة المهارات</button></section>`);
    const n = c.querySelector('[data-nx]'), q = c.querySelector('[data-q]');
    if (n) n.onclick = () => x.api.go('next', ID); if (q) q.onclick = () => x.go('quiz');
    c.querySelector('[data-bk]').onclick = () => x.api.go('sec', ID);
  };
})();
        
