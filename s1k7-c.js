/* 🌸 مراحل: شوفي الحل / جربي بنفسك / اختبري نفسك / الملخص (مهارة النسبة والتناسب) */
(function () {
  const { dig, fmt } = FR, PG = NP.pg, ID = NP.SKILL_ID, S3 = S7;
  const css = document.createElement('style');
  css.textContent = `.res3{background:#dff3e4;border:2px solid #2e8b57;border-radius:16px;padding:6px 14px;text-align:center;font-size:1.3rem;font-weight:800;color:#14532d;margin:10px 0}.sc3{font-size:1.4rem;font-weight:800;color:var(--deep)}
.miss{background:#fff8f2;border:2px solid var(--p);border-radius:16px;padding:8px 14px;margin:10px 0}.miss p{margin:4px 0}.warn{background:#fff3d6;border:2px dashed #e0a526;border-radius:16px;padding:6px 16px;margin:10px 0}`;
  document.head.appendChild(css);
  const ansHtml = a => fmt(a);

  /* ---------- ثالثًا: شوفي الحل ---------- */
  PG.ex = (c, x) => {
    const EX = S3.examples, S = x.P.ex; S.cur = S.cur || 0; S.d = S.d || {}; S.h = S.h || {};
    const box = document.createElement('div'); c.appendChild(box);
    const paint = () => {
      const i = S.cur, e = EX[i], n = S.d[i] || 0, fin = k => (S.d[k] || 0) >= EX[k].steps.length;
      box.innerHTML = `<section class="card"><h3>✏️ أمثلة محلولة خطوة بخطوة</h3><p>اختاري مثال واضغطي «الخطوة التالية» لحد ما الحل يكتمل. كل خطوة معاها سبب.</p><div class="tabs">${EX.map((_, k) => `<button class="sm${k === i ? ' on' : ''}" data-t="${k}" aria-label="مثال ${dig(k + 1)}">${fin(k) ? '✅' : dig(k + 1)}</button>`).join('')}</div></section>
<section class="card step"><h3>مثال ${dig(i + 1)} من ${dig(EX.length)}</h3><p class="qt">${fmt(e.t)}</p><button class="sm" data-hd>${S.h[i] ? '👁️ إظهار الحل' : '🙈 إخفاء الحل'}</button><ol class="stps" ${S.h[i] ? 'hidden' : ''}>${e.steps.slice(0, n).map(s => `<li>${fmt(s)}</li>`).join('')}</ol>
${n >= e.steps.length && e.warn ? `<div class="warn">⚠️ ${fmt(e.warn)}</div>` : ''}${n >= e.steps.length ? `<div class="res3">✅ الناتج النهائي: ${ansHtml(e.ans)}</div>${i < EX.length - 1 ? '<button class="btn" data-nx>المثال التالي ⬅️</button>' : '<p>🎉 خلصتي كل الأمثلة! كمّلي للتدريب.</p>'}` : '<button class="btn" data-stp>الخطوة التالية ⬇️</button>'}</section>`;
      box.querySelectorAll('[data-t]').forEach(b => b.onclick = () => { S.cur = +b.dataset.t; x.save(); paint(); });
      box.querySelector('[data-hd]').onclick = () => { S.h[i] = !S.h[i]; x.save(); paint(); };
      const s = box.querySelector('[data-stp]'); if (s) s.onclick = () => { S.d[i] = n + 1; x.save(); paint(); };
      const nx = box.querySelector('[data-nx]'); if (nx) nx.onclick = () => { S.cur = i + 1; x.save(); paint(); window.scrollTo(0, 0); };
    };
    paint();
  };

  /* ---------- رابعًا: جربي بنفسك ---------- */
  const LV = { 1: ['المستوى الأول: سهل', 'أسئلة على النسبة والمفاهيم الأساسية.'], 2: ['المستوى الثاني: متوسط', 'التناسب والمسائل الطردية والعكسية.'], 3: ['المستوى الثالث: متقدم', 'عمليات مركبة ومسائل لفظية وتفكير.'] };
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
        qb.innerHTML = `<section class="card pink"><div class="bow">${p >= 80 ? '🏆' : '🌷'}</div><h3>خلصتي المستوى!</h3><p class="sc3">${dig(right())} من ${dig(N)}</p><p>${p >= 80 ? 'ممتاز! إنتي فاهمة النسبة والتناسب كويس 💗' : p >= 50 ? 'كويس! راجعي الأسئلة اللي غلطتي فيها وشوفي التفسير.' : 'مفيش مشكلة، ارجعي لصفحات الشرح وجرّبي تاني 💗'}</p><button class="sm" data-rv>راجعي الأسئلة 🔄</button></section>`;
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
  const TOP = { simp: ['تبسيط النسبة', 'l2', 'اقسمي الحدّين على العامل المشترك الأكبر، ووحّدي الوحدات الأول.'], equiv: ['النسب المتكافئة', 'l3', 'اضربي أو اقسمي الحدّين في نفس العدد.'], cmp: ['مقارنة النسب', 'l4', 'وحّدي المقامات أو استخدمي الضرب التبادلي وانتبهي للاتجاه.'], unk: ['إيجاد المجهول', 'l6', 'ضرب الطرفين = ضرب الوسطين، وبعدها اقسمي على معامل س.'], prop: ['خواص التناسب', 'l7', 'اقلبي كل كسر أو بدّلي الوسطين أو الطرفين مع الحفاظ على التساوي.'], dir: ['التناسب الطردي', 'l8', 'النسبة بين الكميتين ثابتة: ص ÷ س = ك.'], inv: ['التناسب العكسي', 'l9', 'حاصل ضرب الكميتين ثابت: س × ص = ك.'], word: ['تقسيم كمية بنسبة', 'l10', 'اجمعي أجزاء النسبة، واقسمي الكمية على المجموع، ثم اضربي في كل جزء.'], adv1: ['تناسب فيه تعبير جبري', 'l6', 'اضربي بالتبادل وفكّي القوس بالتوزيع قبل ما تحلي.'], adv2: ['مسائل الأعداد بالنسبة', 'l10', 'اجمعي أجزاء النسبة، واقسمي المجموع عليها.'] };
  const disp = (q, a) => q.type === 'mcq' ? fmt(q.o[a]) : q.type === 'int5' ? fmt('{{' + a + '}}') : q.type === 'ratio' ? NS.F(a[0] + ' : ' + a[1]) : '';
  const corr = q => q.type === 'mcq' ? fmt(q.o[q.c]) : q.type === 'int5' ? fmt('{{' + q.a + '}}') : NS.F(q.a[0] + ' : ' + q.a[1]);
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
        + (wrong.length ? '<section class="card"><h3>📚 الأسئلة اللي محتاجة مراجعة</h3>' + wrong.map(q => `<div class="miss"><p><b>${fmt(q.t)}</b></p><p>إجابتك: ${disp(q, A[q.id].a)}</p><p>الإجابة الصحيحة: ${corr(q)}</p><p>${fmt(q.w)}</p><p>💡 سبب الخطأ المحتمل: ${fmt(NS.deep(TOP[q.topic][2]))}</p></div>`).join('') + `<p>ارجعي للدروس دي:</p><div class="tabs">${[...new Set(wrong.map(q => q.topic))].map(t => `<button class="sm" data-g="${TOP[t][1]}">${TOP[t][0]} ⬅️</button>`).join('')}</div></section>` : '<section class="card"><p>مفيش أي نقطة ضعف ظاهرة، شغل ممتاز 🎀</p></section>')
        + '<button class="btn" data-rt>إعادة الاختبار 🔄</button>';
      box.querySelectorAll('[data-g]').forEach(b => b.onclick = () => x.go(b.dataset.g));
      box.querySelector('[data-rt]').onclick = () => { Q.forEach(q => delete A[q.id]); x.save(); i = 0; paint(); window.scrollTo(0, 0); };
    };
    paint();
  };

  /* ---------- سادسًا: ملخص المعلومة ---------- */
  PG.sum = (c, x) => {
    const ok = x.api.mastered(ID), R = NS.deep([['📏 النسبة', 'مقارنة بين كميتين من نفس النوع: {{3 : 5}} أو {{3/5}}. الترتيب مهم، ولازم الوحدات تتوحّد، والنسبة بتتبسّط بالقسمة على العامل المشترك الأكبر.'], ['🟰 النسب المتكافئة', 'نضرب أو نقسم الحدّين في نفس العدد (غير الصفر): {{2 : 3 = 4 : 6 = 6 : 9}}.'], ['⚖️ المقارنة', 'نوحّد المقامات أو نستخدم الضرب التبادلي: {{⟦أ|ب⟧ > ⟦ج|د⟧}} إذا كان {{أ × د > ب × ج}}.'], ['🔗 التناسب', 'تساوي نسبتين: {{⟦أ|ب⟧ = ⟦ج|د⟧}}. الطرفان {{أ}} و{{د}} والوسطان {{ب}} و{{ج}}، وحاصل ضرب الطرفين = حاصل ضرب الوسطين: {{أ × د = ب × ج}}.'], ['🔍 إيجاد المجهول', '{{⟦3|4⟧ = ⟦س|8⟧ ⟹ 3 × 8 = 4 × س ⟹ س = 6}}'], ['🔄 خواص التناسب', 'مقلوب النسبتين، وتبديل الوسطين، وتبديل الطرفين، والجمع والطرح، وكلها بتحافظ على التناسب.'], ['➡️ التناسب الطردي', 'لو زادت كمية زادت التانية بنفس النسبة: {{⟦ص|س⟧ = ك}} أي {{ص = ك × س}}، وتمثيله خط مستقيم بيمر بنقطة الأصل.'], ['⬅️ التناسب العكسي', 'لو زادت كمية قلّت التانية: {{س × ص = ك}} (حاصل الضرب ثابت).'], ['🧩 تقسيم كمية بنسبة', 'نجمع أجزاء النسبة، نقسم الكمية على المجموع، ونضرب ناتج الجزء الواحد في كل جزء.']]);
    c.insertAdjacentHTML('beforeend', `<section class="card pink"><div class="bow">🎀</div><h3>ملخص المعلومة: قبل ما تمشي</h3></section>${R.map(r => `<section class="card"><h3>${r[0]}</h3><p>${fmt(r[1])}</p></section>`).join('')}
<section class="warn"><h3>⚠️ أشهر الأخطاء</h3><ul class="pts"><li>عكس ترتيب حدّي النسبة (٣ : ٥ مش ٥ : ٣).</li><li>عدم توحيد الوحدات قبل كتابة النسبة.</li><li>ترك النسبة من غير تبسيط.</li><li>الخلط بين المعكوس الجمعي والمعكوس الضربي.</li><li>الضرب التبادلي الغلط (ضرب الأعداد في نفس الصف).</li><li>الخلط بين الطردي والعكسي: في الطردي النسبة ثابتة وفي العكسي حاصل الضرب ثابت.</li><li>نسيان ضرب القوس كله عند الضرب التبادلي (مثلًا س + ١ لازم يتضرب كله).</li><li>تقسيم الكمية على أجزاء النسبة مباشرة بدل جمعها الأول.</li></ul></section>
<section class="card ${ok ? 'pink' : ''}"><h3>${ok ? '✅ أتقنتي المهارة!' : '🎯 لسه فاضل الاختبار'}</h3><p>${ok ? 'مهارتك اتسجلت، وتقدري تكملي للمهارة اللي بعدها.' : 'عدّي الاختبار النهائي بـ ٧ من ١٠ عشان نسجّل المهارة ✅'}</p>${ok ? '<button class="btn" data-nx>المهارة التالية ⬅️</button>' : '<button class="btn" data-q>روحي للاختبار 🧠</button>'}<button class="link" data-bk>رجوع لقائمة المهارات</button></section>`);
    const n = c.querySelector('[data-nx]'), q = c.querySelector('[data-q]');
    if (n) n.onclick = () => x.api.go('next', ID); if (q) q.onclick = () => x.go('quiz');
    c.querySelector('[data-bk]').onclick = () => x.api.go('sec', ID);
  };
})();
                                                                                                                                                                                                                                                  
