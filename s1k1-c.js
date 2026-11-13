/* 🌸 مراحل: شوفي الحل / جربي بنفسك / اختبري نفسك / الملخص */
(function () {
  const { dig, fmt } = S1K, PG = S1K.pg;
  const RULES = ['جمع عددين لهما نفس الإشارة', 'جمع عددين إشارتاهما مختلفتان', 'طرح (نحوّله لجمع)', 'ضرب أو قسمة'];
  const EX = [
    { e: '(-7) + (+3)', r: 1, ans: '-4', steps: ['الإشارتان مختلفتان (سالب وموجب)، فهنطرح القيمتين المطلقتين.', 'القيمتان المطلقتان {{7}} و {{3}} ← {{7 - 3 = 4}}.', 'الأكبر في القيمة المطلقة هو {{-7}} (سالب)، فالناتج بإشارة سالبة.'] },
    { e: '(+9) + (-12)', r: 1, ans: '-3', steps: ['الإشارتان مختلفتان (موجب وسالب) ← نطرح.', 'نطرح الأصغر من الأكبر: {{12 - 9 = 3}}.', 'الأكبر في القيمة المطلقة هو {{-12}} (سالب)، فالناتج سالب.'] },
    { e: '(-6) + (-8)', r: 0, ans: '-14', steps: ['الإشارتان متشابهتان (سالب وسالب) ← نجمع.', 'نجمع القيمتين المطلقتين: {{6 + 8 = 14}}.', 'نحتفظ بالإشارة السالبة.'] },
    { e: '10 - (-5)', r: 2, ans: '15', steps: ['ده طرح، فنحوّله لجمع معكوس العدد المطروح.', 'معكوس {{-5}} هو {{+5}} ← {{10 + (+5)}}.', 'الإشارتان موجبتان ← نجمع {{10 + 5 = 15}}.'] },
    { e: '(-4) - (+7)', r: 2, ans: '-11', steps: ['طرح ← نحوّله لجمع: معكوس {{+7}} هو {{-7}}.', 'نكتبها {{(-4) + (-7)}}.', 'الإشارتان سالبتان ← نجمع {{4 + 7 = 11}} ونحتفظ بالسالب.'] },
    { e: '(-5) * (-6)', r: 3, ans: '30', steps: ['ضرب: الإشارتان سالب وسالب (متشابهتان) ← الناتج موجب.', 'نضرب القيمتين المطلقتين: {{5 * 6 = 30}}.', 'الناتج موجب: {{+30}}.'] },
    { e: '(+8) * (-3)', r: 3, ans: '-24', steps: ['ضرب: الإشارتان موجب وسالب (مختلفتان) ← الناتج سالب.', 'نضرب القيمتين المطلقتين: {{8 * 3 = 24}}.', 'الناتج سالب: {{-24}}.'] },
    { e: '(-36) / (+6)', r: 3, ans: '-6', steps: ['قسمة: الإشارتان سالب وموجب (مختلفتان) ← الناتج سالب.', 'نقسم القيمتين المطلقتين: {{36 / 6 = 6}}.', 'الناتج سالب: {{-6}}.'] }
  ];
  S1K.EX = EX;
  const css = document.createElement('style');
  css.textContent = `.tabs{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0}.tabs .sm{min-width:44px}.tabs .on{background:var(--p)}.big{font-size:1.8rem;text-align:center;margin:6px 0}
.res{background:#dff3e4;border:2px solid #2e8b57;border-radius:16px;padding:6px 14px;text-align:center;font-size:1.3rem;font-weight:800;color:#14532d;margin:10px 0}.sc{font-size:1.4rem;font-weight:800;color:var(--deep)}`;
  document.head.appendChild(css);

  /* ---------- ثالثًا: شوفي الحل ---------- */
  PG.ex = (c, x) => {
    const S = x.P.ex; S.cur = S.cur || 0; S.d = S.d || {};
    const box = document.createElement('div'); c.appendChild(box);
    const paint = () => {
      const i = S.cur, e = EX[i], st = S.d[i] || (S.d[i] = {}), nm = x.api.nm(), picked = st.c !== undefined, n = st.n || 0;
      const fin = k => S.d[k] && (S.d[k].n || 0) >= EX[k].steps.length;
      box.innerHTML = `<section class="card"><h3>✏️ أمثلة محلولة خطوة بخطوة</h3><p>اختاري مثال، فكري في القاعدة الأول، وبعدين اضغطي «الخطوة التالية» وشوفي الحل بيتكشف واحدة واحدة.</p><div class="tabs">${EX.map((_, k) => `<button class="sm${k === i ? ' on' : ''}" data-t="${k}" aria-label="مثال ${dig(k + 1)}">${fin(k) ? '✅' : dig(k + 1)}</button>`).join('')}</div></section>
<section class="card step"><h3>مثال ${dig(i + 1)} من ${dig(EX.length)}</h3><p class="big">${fmt('{{' + e.e + '}}')}</p><p><b>🤔 فكري لحظة: إيه القاعدة المناسبة؟</b></p>
<div class="opts">${RULES.map((r, k) => `<button class="opt${picked ? (k === e.r ? ' ok' : k === st.c ? ' no' : ' dim') : ''}" data-r="${k}" ${picked ? 'disabled' : ''}>${r}</button>`).join('')}</div>
${picked ? `<p class="fb ${st.c === e.r ? 'good' : 'bad'}">${st.c === e.r ? 'برافو ' + nm + '! القاعدة صح 💗' : 'ولا يهمك ' + nm + '، القاعدة الأنسب هي: ' + RULES[e.r] + ' 💗'}</p>
<ol>${e.steps.slice(0, n).map(s => `<li>${fmt(s)}</li>`).join('')}</ol>
${n >= e.steps.length ? `<div class="res">✅ الناتج النهائي: ${fmt('{{' + e.ans + '}}')}</div>${i < EX.length - 1 ? '<button class="btn" data-nx>المثال التالي ⬅️</button>' : '<p>🎉 خلصتي كل الأمثلة! كمّلي للتدريب.</p>'}` : '<button class="btn" data-stp>الخطوة التالية ⬇️</button>'}` : ''}</section>`;
      box.querySelectorAll('[data-t]').forEach(b => b.onclick = () => { S.cur = +b.dataset.t; x.save(); paint(); });
      box.querySelectorAll('[data-r]').forEach(b => b.onclick = () => { st.c = +b.dataset.r; x.save(); paint(); });
      const s = box.querySelector("[data-stp]"); if (s) s.onclick = () => { st.n = n + 1; x.save(); paint(); };
      const nx = box.querySelector('[data-nx]'); if (nx) nx.onclick = () => { S.cur = i + 1; x.save(); paint(); window.scrollTo(0, 0); };
    };
    paint();
  };

  /* ---------- رابعًا: جربي بنفسك ---------- */
  const LV = { 1: ['المستوى الأول: أتذكر القاعدة', 'أسئلة مباشرة وسهلة تفكّرك بالقواعد.'], 2: ['المستوى الثاني: بدأت أفهم', 'أسئلة فيها أكتر من خطوة وشوية تفكير.'], 3: ['المستوى الثالث: أتحدى نفسي', 'أسئلة محتاجة فهم أعمق، خدي وقتك.'] };
  const prac = lv => (c, x) => {
    const qs = S1K1.practice.filter(q => q.lv === lv), key = 'l' + lv, A = x.P.ans, N = qs.length;
    const right = () => qs.filter(q => A[q.id] && A[q.id].r).length, answered = () => qs.filter(q => A[q.id]).length;
    if (x.P.pi[key] === undefined) { const f = qs.findIndex(q => !A[q.id]); x.P.pi[key] = f < 0 ? N : f; }
    const box = document.createElement('div'); c.appendChild(box);
    const paint = () => {
      const i = x.P.pi[key], ans = answered();
      box.innerHTML = `<section class="card pink"><h3>🎮 ${LV[lv][0]}</h3><p>${LV[lv][1]}</p><div class="bar"><i style="width:${ans / N * 100}%"></i></div><small>أجبتي على ${dig(ans)} من ${dig(N)} · صح: ${dig(right())}</small></section><div id="qb"></div>`;
      const qb = box.querySelector('#qb');
      if (i >= N) {
        const p = Math.round(right() / N * 100);
        qb.innerHTML = `<section class="card pink"><div class="bow">${p >= 80 ? '🏆' : '🌷'}</div><h3>خلصتي المستوى!</h3><p class="sc">${dig(right())} من ${dig(N)}</p><p>${p >= 80 ? 'ممتاز! إنتي فاهمة القواعد كويس 💗' : p >= 50 ? 'كويس! راجعي الأسئلة اللي غلطتي فيها وشوفي التفسير.' : 'مفيش مشكلة، ارجعي لصفحات الشرح وجرّبي تاني 💗'}</p><button class="sm" data-rv>راجعي الأسئلة 🔄</button></section>`;
        qb.querySelector('[data-rv]').onclick = () => { x.P.pi[key] = 0; x.save(); paint(); }; return;
      }
      const q = qs[i];
      x.ask(qb, q, { head: 'سؤال ' + dig(i + 1) + ' من ' + dig(N), after: () => { paint2(); const b = box.querySelector('[data-pn]'); if (b) b.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } });
      paint2();
    };
    const paint2 = () => {
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
  const TOP = { line: ['خط الأعداد والمقارنة', 'line'], add: ['الجمع', 'add1'], sub: ['الطرح', 'sub'], mul: ['الضرب', 'mul'], div: ['القسمة', 'div'], props: ['قواعد الصفر', 'props'] };
  PG.quiz = (c, x) => {
    const Q = S1K1.quiz, A = x.P.ans, box = document.createElement('div'); c.appendChild(box);
    let i = Q.findIndex(q => !A[q.id]); if (i < 0) i = Q.length;
    const paint = () => {
      box.innerHTML = '';
      if (i >= Q.length) return results();
      x.gate(false);
      const done = Q.filter(q => A[q.id]).length;
      box.insertAdjacentHTML('beforeend', `<section class="card pink"><h3>🧠 اختبري نفسك</h3><p>١٠ أسئلة متنوعة. الإجابة الصحيحة والتفسير بيظهروا بعد ما تجاوبي.</p><div class="bar"><i style="width:${done / Q.length * 100}%"></i></div><small>سؤال ${dig(i + 1)} من ${dig(Q.length)}</small></section>`);
      const q = Q[i];
      x.ask(box, q, { after: (a, r) => { if (r) x.api.coin('s1k1' + q.id); else x.api.wrong(); next(); } });
    };
    const next = () => {
      const b = document.createElement('button'); b.className = 'btn'; b.textContent = i < Q.length - 1 ? 'السؤال التالي ⬅️' : 'شوفي نتيجتك 🌟';
      b.onclick = () => { i++; paint(); window.scrollTo(0, 0); }; box.appendChild(b);
      b.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    };
    const results = () => {
      const sc = Q.filter(q => A[q.id] && A[q.id].r).length, pass = sc >= 7, nm = x.api.nm();
      x.api.done('s1k1', sc, pass); x.gate(true);
      const weak = [...new Set(Q.filter(q => !A[q.id].r).map(q => q.topic))];
      box.innerHTML = `<section class="card pink"><div class="bow">${pass ? '🏆' : '🌷'}</div><h3>${pass ? 'برافو ' + nm + '! أتقنتي المهارة' : 'مفيش مشكلة ' + nm + ' 💗'}</h3><p class="sc">${dig(sc)} من ${dig(Q.length)}</p><p>نسبة الإجابات الصحيحة: ${dig(Math.round(sc / Q.length * 100))}٪</p><p>${pass ? 'لازم ٧ من ١٠ عشان نعتبر المهارة متقنة، وإنتي عدّيتي ✅' : 'محتاجة ٧ من ١٠ عشان نعتبر المهارة متقنة. راجعي وجرّبي تاني.'}</p></section>
${weak.length ? `<section class="card"><h3>📚 محتاجة مراجعة</h3><p>غلطتي في أسئلة من:</p><div class="tabs">${weak.map(t => `<button class="sm" data-g="${TOP[t][1]}">${TOP[t][0]} ⬅️</button>`).join('')}</div></section>` : '<section class="card"><p>مفيش أي نقطة ضعف ظاهرة، شغل ممتاز 🎀</p></section>'}
<button class="btn" data-rt>إعادة الاختبار 🔄</button>`;
      box.querySelectorAll('[data-g]').forEach(b => b.onclick = () => x.go(b.dataset.g));
      box.querySelector('[data-rt]').onclick = () => { Q.forEach(q => delete A[q.id]); x.save(); i = 0; paint(); window.scrollTo(0, 0); };
    };
    paint();
  };

  /* ---------- سادسًا: ملخص المعلومة ---------- */
  PG.sum = (c, x) => {
    const ok = x.api.mastered('s1k1');
    c.insertAdjacentHTML('beforeend', `<section class="card pink"><div class="bow">🎀</div><h3>ملخص المعلومة: قبل ما تمشي</h3></section>
<section class="card"><h3>➕ الجمع</h3><ul class="pts"><li><b>نفس الإشارة:</b> نجمع القيمتين المطلقتين ونحتفظ بالإشارة.</li><li><b>إشارتان مختلفتان:</b> نطرح، ونأخذ إشارة العدد الأكبر في القيمة المطلقة.</li></ul>
<h3>➖ الطرح</h3><ul class="pts"><li>نحوّل الطرح لجمع معكوس العدد المطروح: ${fmt('{{7 - (-3) = 7 + (+3) = 10}}')}</li></ul>
<h3>✖️ ➗ الضرب والقسمة</h3><ul class="pts"><li><b>إشارتان متشابهتان:</b> الناتج موجب.</li><li><b>إشارتان مختلفتان:</b> الناتج سالب.</li></ul>
<h3>⭕ الصفر</h3><ul class="pts"><li>جمع الصفر وطرحه لا يغيّران العدد، والعدد ناقص نفسه = صفر.</li><li>أي عدد × صفر = صفر، وأي عدد × ١ = نفسه.</li><li>القسمة على صفر مستحيلة، والصفر ليس له معكوس ضربي.</li></ul></section>
<section class="card ${ok ? 'pink' : ''}"><h3>${ok ? '✅ أتقنتي المهارة!' : '🎯 لسه فاضل الاختبار'}</h3><p>${ok ? 'مهارتك اتسجلت، وتقدر تكملي للمهارة اللي بعدها.' : 'عدّي الاختبار النهائي بـ ٧ من ١٠ عشان نسجّل المهارة ✅'}</p>
${ok ? '<button class="btn" data-nx>المهارة التالية ⬅️</button>' : '<button class="btn" data-q>روحي للاختبار 🧠</button>'}<button class="link" data-bk>رجوع لقائمة المهارات</button></section>`);
    const n = c.querySelector('[data-nx]'), q = c.querySelector('[data-q]');
    if (n) n.onclick = () => x.api.go('next', 's1k1'); if (q) q.onclick = () => x.go('quiz');
    c.querySelector('[data-bk]').onclick = () => x.api.go('sec', 's1k1');
  };
})();
