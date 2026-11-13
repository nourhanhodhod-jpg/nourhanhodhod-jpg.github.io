/* 🌸 صفحة مهارة: العمليات الحسابية على الأعداد الموجبة والسالبة (الهيكل + مرحلة «افتكري»)
   الملفات المكمّلة: s1k1-b.js (الشرح) و s1k1-c.js (الأمثلة والتدريب والاختبار والملخص). */
(function () {
  const { dig, fmt, nl, qcard } = S1K;
  S1K.pg = {};
  const ORDER = [['intro', 0, 'سؤال البداية'], ['line', 0, 'خط الأعداد'], ['place', 0, 'مكان العدد'], ['cmp', 0, 'المقارنة'],
    ['add1', 1, 'الجمع: نفس الإشارة'], ['add2', 1, 'الجمع: إشارتان مختلفتان'], ['sub', 1, 'الطرح'], ['mul', 1, 'الضرب'], ['div', 1, 'القسمة'], ['props', 1, 'معلومات متنسيهاش'],
    ['ex', 2, 'أمثلة محلولة'], ['pr1', 3, 'المستوى الأول: أتذكر القاعدة'], ['pr2', 3, 'المستوى الثاني: بدأت أفهم'], ['pr3', 3, 'المستوى الثالث: أتحدى نفسي'],
    ['quiz', 4, 'الاختبار النهائي'], ['sum', 5, 'ملخص المعلومة']];
  const STG = ['افتكري', 'افهمي', 'شوفي الحل', 'جربي', 'اختبري نفسك', 'الملخص'], ICO = ['🌱', '💡', '✏️', '🎮', '🧠', '🎀'];
  const TITLE = 'العمليات الحسابية على الأعداد الموجبة والسالبة';
  S1K.ORDER = ORDER;

  const css = document.createElement('style');
  css.textContent = `.stg{display:grid;grid-template-columns:repeat(6,1fr);gap:4px;margin:10px 0}.stg button{font:inherit;border:2px solid var(--s);background:#fff;border-radius:14px;padding:4px 2px;cursor:pointer;color:var(--ink);min-height:56px;line-height:1.2}
.stg button small{display:block;font-size:.62rem;font-weight:700}.stg .on{border-color:var(--btn);background:var(--s)}.stg .dn{background:#dff3e4;border-color:#2e8b57}
.s1nav{display:flex;justify-content:space-between;gap:10px;margin:18px 0}.s1nav .btn{margin:0;padding:10px 22px;font-size:1rem}.s1nav .btn:disabled{opacity:.45;cursor:default}
.rule{background:var(--s);border:2px dashed var(--a);border-radius:16px;padding:8px 14px;margin:10px 0;font-weight:700}.pts{padding-right:22px;margin:8px 0}.dirs{display:flex;justify-content:space-between;font-size:.8rem;font-weight:700;color:var(--deep)}
.exs{display:grid;gap:6px;margin:8px 0}.exs div{background:#fff8f2;border-radius:12px;padding:2px 12px;text-align:center;font-size:1.15rem}`;
  document.head.appendChild(css);

  window.SKILL_PAGES = window.SKILL_PAGES || {};
  SKILL_PAGES.s1k1 = function (root, api) {
    const P = api.get('s1k1_prog') || {};
    P.page = P.page || 0; P.mx = P.mx || 0; ['ans', 'ex', 'pi', 'pl'].forEach(k => P[k] = P[k] || {});
    const save = () => api.set('s1k1_prog', P);
    const go = i => { if (typeof i === 'string') i = ORDER.findIndex(x => x[0] === i); P.page = Math.max(0, Math.min(ORDER.length - 1, i)); P.mx = Math.max(P.mx, P.page); save(); draw(); window.scrollTo(0, 0); };
    const ask = (c, q, o) => {
      o = o || {};
      const el = qcard(q, P.ans[q.id], { nm: api.nm(), head: o.head, onAnswer: (a, r) => { P.ans[q.id] = { a, r }; save(); if (o.after) o.after(a, r, el); } });
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
<div id="s1c"></div>
<div class="s1nav"><button class="btn" data-p ${P.page ? '' : 'disabled'}>➡️ السابق</button><button class="btn" data-n ${P.page < n - 1 ? '' : 'hidden'}>التالي ⬅️</button></div>`;
      const c = root.querySelector('#s1c');
      try { S1K.pg[id](c, ctx); } catch (e) { c.innerHTML = '<section class="card"><p>حصلت مشكلة بسيطة في عرض الصفحة 💗 جرّبي ترجعي للمهارات وتفتحيها تاني.</p></section>'; if (window.console) console.error(e); }
      root.querySelector('[data-p]').onclick = () => go(P.page - 1);
      root.querySelector('[data-n]').onclick = () => go(P.page + 1);
      root.querySelectorAll('[data-st]').forEach(b => b.onclick = () => go(ORDER.findIndex(x => x[1] === +b.dataset.st)));
      root.querySelectorAll('[data-x]').forEach(b => b.onclick = () => api.go(b.dataset.x, 's1k1'));
    }
    draw();
  };

  /* ---------- أولًا: افتكري المعلومة ---------- */
  S1K.pg.intro = (c, x) => {
    c.insertAdjacentHTML('beforeend', '<section class="card"><h3>🌱 افتكري المعلومة</h3><p>الأعداد السالبة حواليكي في كل حتة: درجة الحرارة تحت الصفر، أو فلوس عليكي لحد. هنبدأ بسؤال سريع نشوف إيه اللي فاكراه. ولو جاوبتي غلط مفيش مشكلة، إحنا هنا نراجع سوا 💗</p></section>');
    x.ask(c, { id: 'i1', type: 'mcq', kind: 'سؤال البداية', t: 'مدينتان جبليتان: درجة الحرارة في الأولى {{-5}} درجات وفي الثانية {{-2}} درجة. أي مدينة أبرد؟', o: ['الأولى ({{-5}})', 'الثانية ({{-2}})', 'الاتنين نفس البرودة'], c: 0, w: 'كل ما نزلنا ناحية السالب زادت البرودة. {{-5}} أبعد عن الصفر ناحية السالب من {{-2}}، فهو الأصغر، يعني الأبرد.' });
    c.insertAdjacentHTML('beforeend', '<section class="card"><p>🎀 في الصفحات الجاية هنراجع خط الأعداد وبعدين العمليات الأربع واحدة واحدة. خدي وقتك، ومفيش استعجال.</p></section>');
  };

  S1K.pg.line = c => {
    c.insertAdjacentHTML('beforeend', `<section class="card"><h3>📏 خط الأعداد</h3><p>اضغطي على أي رقم على الخط وشوفي مكانه:</p><div id="lnh"></div><div class="dirs" dir="ltr"><span>⬅️ يسار: القيمة بتقل</span><span>يمين: القيمة بتزيد ➡️</span></div><p id="lnm" class="hint" aria-live="polite">اضغطي على أي رقم 👆</p>
<ul class="pts"><li>الأعداد الموجبة على <b>يمين</b> الصفر.</li><li>الأعداد السالبة على <b>يسار</b> الصفر.</li><li>الصفر <b>لا موجب ولا سالب</b>.</li><li>كل ما اتجهنا <b>يمينًا</b> القيمة تزيد، وكل ما اتجهنا <b>يسارًا</b> القيمة تقل.</li></ul></section>`);
    const h = c.querySelector('#lnh'), m = c.querySelector('#lnm');
    const draw = v => {
      h.innerHTML = nl({ min: -8, max: 8, click: true, marks: v === undefined ? [] : [{ v }] });
      h.querySelectorAll('.hit').forEach(b => b.onclick = () => {
        const v = +b.dataset.v; draw(v);
        m.innerHTML = fmt(v > 0 ? `{{${v}}} عدد <b>موجب</b>، مكانه على يمين الصفر بعد ${v} خطوات، وهو أكبر من كل الأعداد اللي على يساره.`
          : v < 0 ? `{{${v}}} عدد <b>سالب</b>، مكانه على يسار الصفر بعد ${-v} خطوات، وهو أصغر من الصفر.` : 'الصفر هو نقطة البداية في نص الخط، <b>لا موجب ولا سالب</b>.');
      });
    };
    draw();
  };

  const PL = [[4, '{{4}} عدد موجب، فمكانه على يمين الصفر بعد 4 خطوات.'], [-3, '{{-3}} عدد سالب، فمكانه على يسار الصفر بعد 3 خطوات.'], [0, 'الصفر هو نقطة البداية في نص الخط، لا موجب ولا سالب.'], [-7, '{{-7}} عدد سالب: 7 خطوات ناحية اليسار، وهو أبعد عن الصفر من {{-3}} فهو أصغر منه.'], [5, '{{5}} عدد موجب: 5 خطوات ناحية اليمين، وهو أكبر من {{4}}.']];
  S1K.pg.place = (c, x) => {
    const pl = x.P.pl; pl.i = pl.i || 0; pl.h = pl.h || [];
    const box = document.createElement('section'); box.className = 'card'; c.appendChild(box);
    const paint = () => {
      const i = pl.i;
      if (i >= PL.length) {
        const k = PL.filter((t, j) => pl.h[j] === t[0]).length;
        box.innerHTML = `<h3>📍 خلصتي النشاط</h3><p class="qt">مكان ${dig(k)} من ${dig(PL.length)} أعداد كان صح من أول مرة.</p><p>${k === PL.length ? 'ممتاز 💗' : 'مفيش مشكلة، افتكري: الموجب يمين والسالب يسار.'}</p><button class="sm" data-re>إعادة النشاط 🔄</button>`;
        box.querySelector('[data-re]').onclick = () => { pl.i = 0; pl.h = []; x.save(); paint(); }; return;
      }
      const [t, w] = PL[i], a = pl.h[i], done = a !== undefined, right = a === t;
      const marks = done ? [{ v: t, cls: 'ok' }].concat(right ? [] : [{ v: a, cls: 'no' }]) : [];
      box.innerHTML = `<h3>📍 حطي العدد في مكانه (${dig(i + 1)} من ${dig(PL.length)})</h3><p class="qt">اضغطي على مكان العدد ${fmt('{{' + t + '}}')} على خط الأعداد:</p>${nl({ min: -8, max: 8, click: !done, marks })}<p class="fb ${done ? (right ? 'good' : 'bad') : ''}" aria-live="polite">${done ? (right ? 'برافو ' + x.api.nm() + '! ' : fmt('اللي ضغطتي عليه هو مكان {{' + a + '}} (العلامة الحمرا). مكان {{' + t + '}} هو العلامة الخضراء. ')) + fmt(w) : ''}</p>${done ? `<button class="btn" data-nx>${i < PL.length - 1 ? 'العدد اللي بعده ⬅️' : 'شوفي النتيجة 🌟'}</button>` : ''}`;
      box.querySelectorAll('.hit').forEach(b => b.onclick = () => { pl.h[i] = +b.dataset.v; x.save(); paint(); });
      const nx = box.querySelector('[data-nx]'); if (nx) nx.onclick = () => { pl.i++; x.save(); paint(); };
    };
    paint();
  };

  const CP = [[-3, 2, '{{-3}} سالب و {{2}} موجب، والسالب دايمًا أصغر من الموجب.'], [-7, -2, 'الاتنين سالبين: الأبعد عن الصفر ناحية اليسار هو الأصغر. {{-7}} أبعد من {{-2}} فهو أصغر (حتى لو ٧ أكبر من ٢).'], [0, -1, 'الصفر على يمين {{-1}} على خط الأعداد، فهو أكبر من أي عدد سالب.'], [-5, -5, 'العددان متساويان ومكانهما واحد على خط الأعداد.']];
  S1K.pg.cmp = (c, x) => {
    c.insertAdjacentHTML('beforeend', '<section class="card"><h3>⚖️ أكبر ولا أصغر؟</h3><p>الأكبر هو اللي على يمين التاني على خط الأعداد. قارني بين كل عددين:</p></section>');
    CP.forEach(([a, b, w], k) => x.ask(c, { id: 'cp' + (k + 1), type: 'mcq', kind: 'قارني', t: `قارني بين {{${a}}} و {{${b}}} : العدد {{${a}}} ... العدد {{${b}}}`, o: ['أكبر من {{&gt;}}', 'أصغر من {{&lt;}}', 'يساوي {{=}}'], c: a > b ? 0 : a < b ? 1 : 2, w }, { head: 'مقارنة ' + dig(k + 1) + ' من ' + dig(CP.length) }));
  };
})();
