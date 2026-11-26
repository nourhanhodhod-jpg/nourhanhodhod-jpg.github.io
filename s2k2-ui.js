/* 🌸 أدوات مهارة الحدود الجبرية والمعاملات (بتعتمد على s2k1-ui.js + s1k3-ui.js + s1k5-ui.js)
   كتابة الحد بين {{ }} :  {{5س}}  {{-4س^2ص}}  {{3سص}}  — الأس ^ بعد الحرف مباشرة.
   مولّدات أسئلة وأمثلة بتحسب الإجابة لوحدها من المقدار (TS.mk / TS.ex) فمفيش خطأ حسابي.
   أنواع أسئلة جديدة: pick (اختاري كل الحدود المطلوبة) و an (حلّلي المقدار: كذا خانة).
   أدوات: anat (مكونات الحد) و coefw (اختاري المعامل) و count (عدّي الحدود). */
(function () {
  const { dig, fmt } = FR;
  const F = VS.F;

  /* ---------- تحليل الحدود ---------- */
  const norm = s => String(s).replace(/\s+/g, '').replace(/[−–]/g, '-');
  const splitT = e => norm(e).match(/[+-]?[^+-]+/g) || [];
  const parse = t => {
    t = norm(t); const m = t.match(/^([+-]?)(\d+(?:\.\d+)?)?((?:[سصع](?:\^\d+)?)*)$/); if (!m) throw new Error('حد غير مفهوم: ' + t);
    const sg = m[1] === '-' ? -1 : 1, has = m[2] !== undefined, num = has ? +m[2] : 1;
    return { term: t.replace(/^\+/, ''), sg, has, num, coef: sg * num, lit: m[3], vars: [...m[3].matchAll(/([سصع])(?:\^(\d+))?/g)].map(x => [x[1], +(x[2] || 1)]) };
  };
  const T = e => splitT(e).map(parse);
  const sh = t => t.replace(/^\+/, '');
  const uniqVars = e => [...new Set(T(e).flatMap(p => p.vars.map(v => v[0])))];
  const dg = n => '{{' + n + '}}';

  const whyCoef = p => !p.lit ? 'ده حد ثابت: مفيش فيه متغير.' : !p.has ? 'مفيش عدد مكتوب قدام ' + dg(p.lit) + (p.sg < 0 ? ' وفيه إشارة سالبة، فالمعامل ' + dg(-1) + '.' : '، فالمعامل ' + dg(1) + ' (واحد ضمنيًا).') : 'الحد ' + dg(p.term) + ' = ' + dg(p.coef + ' × ' + p.lit) + '، فالمعامل ' + dg(p.coef) + '.';
  const hintCoef = 'المعامل هو العدد المكتوب قدام الجزء الحرفي (بإشارته). ولو مفيش عدد يبقى ١ (أو −١ لو فيه إشارة سالب).';

  /* ---------- مولّدات الأسئلة ---------- */
  const mk = {
    coef(t, v) {
      const p = parse(t), a = p.coef;
      return { type: 'val', t: [`ما معامل {{${t}}}؟`, `اكتبي المعامل العددي للحد {{${t}}}.`, `في الحد {{${t}}}، حددي العدد المضروب في الجزء الحرفي (بإشارته).`][(v || 0) % 3], a, w: whyCoef(p), h: hintCoef };
    },
    coefIn(e, lit, v) {
      const ts = T(e), p = ts.find(x => x.lit === lit), a = p.coef;
      return { type: 'val', t: [`ما معامل {{${lit}}} في {{${e}}}؟`, `حددي معامل {{${lit}}} في المقدار {{${e}}}.`, `في المقدار {{${e}}}، ما العدد المضروب في {{${lit}}}؟`][(v || 0) % 3], a, w: 'الحد اللي جزؤه الحرفي ' + dg(lit) + ' هو ' + dg(p.term) + '. ' + whyCoef(p), h: hintCoef + ' دوّري على الحد اللي فيه ' + lit.replace(/\^2/, '²') + ' بالظبط.' };
    },
    konst(e, v) {
      const p = T(e).find(x => !x.lit);
      return { type: 'val', t: [`ما الحد الثابت في {{${e}}}؟`, `اكتبي الحد الثابت (بإشارته) في المقدار {{${e}}}.`][(v || 0) % 2], a: p.coef, w: 'الحد الثابت هو الحد اللي مفيهوش متغير: ' + dg(p.term) + '.', h: 'الحد الثابت عدد من غير حروف، وخدي إشارته معاه.' };
    },
    count(e, v) {
      const n = T(e).length;
      return { type: 'val', t: [`كم عدد حدود {{${e}}}؟`, `عدد الحدود في المقدار {{${e}}} هو:`][(v || 0) % 2], a: n, w: 'الحدود: ' + T(e).map(p => dg(p.term)).join(' ، ') + ' فعددها ' + dg(n) + '.', h: 'الحدود بيفصل بينها + أو −، والإشارة جزء من الحد اللي بعدها.' };
    },
    lit(t) {
      const p = parse(t);
      return { type: 'expr', t: `اكتبي الجزء الحرفي في الحد {{${t}}}.`, a: p.lit, w: 'الجزء الحرفي هو الحروف (بأسّها) من غير المعامل: ' + dg(p.lit) + '، والمعامل ' + dg(p.coef) + '.', h: 'الجزء الحرفي = الحد من غير العدد اللي قدامه.' };
    },
    pick(e, mode) {
      const ts = T(e); let opts, a, txt, w;
      const idx = f => ts.map((p, i) => f(p) ? i : -1).filter(i => i >= 0);
      if (mode === 'all') {
        const fl = ts.slice(0, 2).map(p => (p.sg > 0 ? '-' : '') + p.term.replace(/^-/, ''));
        const extra = fl.filter(x => !ts.some(p => p.term === x));
        const pool = ts.map(p => p.term).concat(extra), ord = pool.map((s, i) => [s, (i * 7 + 3) % pool.length, i]).sort((x, y) => x[1] - y[1] || x[2] - y[2]).map(x => x[0]);
        opts = ord; a = ts.map(p => ord.indexOf(p.term)); txt = `اختاري كل الحدود الموجودة في المقدار {{${e}}} (مع إشارة كل حد).`; w = 'نقسم المقدار عند كل + أو − ونحتفظ بالإشارة: ' + ts.map(p => dg(p.term)).join(' ، ') + '.';
      } else {
        opts = ts.map(p => p.term);
        const f = { var: p => !!p.lit, neg: p => p.sg < 0, multi: p => p.vars.length > 1, exp: p => p.vars.some(v => v[1] > 1), const: p => !p.lit }[mode];
        a = idx(f);
        txt = { var: `اختاري الحدود اللي فيها متغير في {{${e}}}.`, neg: `اختاري الحدود اللي معاملها سالب في {{${e}}}.`, multi: `اختاري الحدود اللي فيها أكتر من متغير في {{${e}}}.`, exp: `اختاري الحدود اللي فيها أس أكبر من ١ في {{${e}}}.`, const: `اختاري الحد الثابت في {{${e}}}.` }[mode];
        w = 'الحدود المطلوبة: ' + a.map(i => dg(opts[i])).join(' ، ') + '.';
      }
      return { type: 'pick', t: txt, o: opts.map(s => '{{' + s + '}}'), a, w, h: 'قسّمي المقدار الأول إلى حدود عند علامات + و−، وبعدين افحصي كل حد.' };
    },
    an(e, specs) {
      const ts = T(e), f = [{ l: 'عدد الحدود', a: ts.length }];
      specs.forEach(s => { if (s === 'c') f.push({ l: 'الحد الثابت', a: ts.find(p => !p.lit).coef }); else f.push({ l: 'معامل ' + s.replace(/\^2/g, '²').replace(/\^3/g, '³'), a: ts.find(p => p.lit === s).coef }); });
      return { type: 'an', t: `حلّلي المقدار {{${e}}}:`, f, w: 'الحدود: ' + ts.map(p => dg(p.term)).join(' ، ') + '. ' + f.slice(1).map(x => x.l + ' = ' + dg(x.a)).join('، ') + '.', h: 'قسّمي المقدار لحدود أولًا، وبعدين حددي معامل كل جزء حرفي.' };
    }
  };

  /* ---------- مولّدات الأمثلة المحلولة ---------- */
  const ex = {
    coef(t) {
      const p = parse(t);
      const wr = !p.has ? 'خطأ شائع: اعتبار المعامل صفر أو غير موجود، والصح ' + (p.sg < 0 ? '−١' : '١') + '.' : p.sg < 0 ? 'خطأ شائع: نسيان الإشارة السالبة.' : p.vars.length > 1 ? 'تلميح: المعامل بيضرب في الجزء الحرفي كله.' : 'تلميح: المعامل هو العدد قدام الحروف.';
      const st = ['نفصل الجزء الحرفي (الحروف بأسّها): ' + dg(p.lit) + '.', !p.has ? 'مفيش عدد مكتوب قدام ' + dg(p.lit) + '، فنفهم إن ' + dg(p.term) + ' = ' + dg((p.sg < 0 ? '-1' : '1') + ' × ' + p.lit) + '.' : 'نكتب الحد على صورة (معامل × جزء حرفي): ' + dg(p.term) + ' = ' + dg(p.coef + ' × ' + p.lit) + '.', 'المعامل هو العدد اللي بيضرب في الجزء الحرفي (بإشارته): ' + dg(p.coef) + '.'];
      return { t: `حددي معامل {{${t}}}.`, ans: dg(p.coef), warn: wr, steps: st };
    },
    coefIn(e, lit) {
      const ts = T(e), p = ts.find(x => x.lit === lit), q = mk.coefIn(e, lit);
      return { t: `ما معامل {{${lit}}} في {{${e}}}؟`, ans: dg(p.coef), warn: !p.has ? 'خطأ شائع: كتابة ٠ بدل ' + (p.sg < 0 ? '−١' : '١') + '.' : 'تلميح: ما تتلخبطيش بين ' + 'س وس² أو بين المتغيرات المختلفة.', steps: ['نقسم المقدار لحدود: ' + ts.map(x => dg(x.term)).join(' ، ') + '.', 'نلاقي الحد اللي جزؤه الحرفي ' + dg(lit) + ': هو ' + dg(p.term) + '.', whyCoef(p)] };
    },
    konst(e) {
      const ts = T(e), p = ts.find(x => !x.lit);
      return { t: `حددي الحد الثابت في {{${e}}}.`, ans: dg(p.coef), warn: p.sg < 0 ? 'خطأ شائع: نسيان إشارة الحد الثابت.' : 'تلميح: الحد الثابت مفيهوش حروف.', steps: ['نقسم المقدار لحدود: ' + ts.map(x => dg(x.term)).join(' ، ') + '.', 'الحد الثابت هو الحد اللي مفيش فيه متغير: ' + dg(p.term) + '.', p.sg < 0 ? 'ونأخد إشارته معاه (سالبة).' : 'إشارته موجبة.'] };
    },
    count(e) {
      const ts = T(e);
      return { t: `حددي عدد الحدود في {{${e}}}.`, ans: dg(ts.length) + ' حدود', warn: 'تلميح: الإشارة بتفضل مع الحد اللي بعدها.', steps: ['الحدود بيفصل بينها علامتا + و−.', 'نقسم المقدار: ' + ts.map(x => dg(x.term)).join(' ، ') + '.', 'نعدّ الحدود: ' + dg(ts.length) + '.'] };
    },
    terms(e) {
      const ts = T(e);
      return { t: `استخرجي الحدود من {{${e}}}.`, ans: ts.map(p => dg(p.term)).join(' ، '), warn: 'خطأ شائع: نسيان إشارة الحد (الإشارة جزء منه).', steps: ['نعلّم مكان كل علامة + أو −.', 'كل حد يبدأ من إشارته لحد الإشارة اللي بعده.', 'الحدود: ' + ts.map(p => dg(p.term)).join(' ، ') + '.'] };
    },
    lit(t) {
      const p = parse(t);
      return { t: `حددي المعامل العددي والجزء الحرفي في {{${t}}}.`, ans: 'المعامل ' + dg(p.coef) + ' والجزء الحرفي ' + dg(p.lit), warn: 'تلميح: الأس بيفضل مع حرفه في الجزء الحرفي.', steps: ['العدد اللي قدام الحروف هو المعامل: ' + dg(p.coef) + '.', 'الحروف بأسّها هي الجزء الحرفي: ' + dg(p.lit) + '.', 'الحد = المعامل × الجزء الحرفي: ' + dg(p.term) + '.'] };
    },
    an(e, title) {
      const ts = T(e), vs = uniqVars(e), nc = ts.filter(p => p.lit), c = ts.find(p => !p.lit);
      return { t: title || `حلّلي مكونات {{${e}}}.`, ans: dg(ts.length) + ' حدود' + (c ? ' والثابت ' + dg(c.coef) : ''), warn: 'تلميح: خدي كل حد بإشارته.', steps: ['عدد الحدود: ' + dg(ts.length) + '.', 'الحدود: ' + ts.map(p => dg(p.term)).join(' ، ') + '.'].concat(nc.map(p => 'معامل ' + dg(p.lit) + ' هو ' + dg(p.coef) + '.'), [c ? 'الحد الثابت: ' + dg(c.coef) + '.' : 'مفيش حد ثابت.', 'المتغيرات: ' + vs.join(' ، ') + '.']) };
    }
  };

  /* ---------- نوع سؤال: اختاري كل الحدود المطلوبة ---------- */
  FR.TY.pick = {
    tag: 'اختاري كل الإجابات الصحيحة',
    build: q => `<div class="vg">${q.o.map((s, i) => `<button class="sm" data-pk="${i}" type="button">${fmt(s)}</button>`).join('')}</div><div class="inrow"><button class="btn" data-ok type="button">تحقّقي ✔️</button></div><small>ممكن تختاري أكتر من حد، واضغطي مرة تانية للإلغاء.</small>`,
    check: (q, a) => ({ r: JSON.stringify([...a].sort((x, y) => x - y)) === JSON.stringify([...q.a].sort((x, y) => x - y)) }),
    corr: q => q.a.map(i => fmt(q.o[i])).join(' ، '),
    bind(el, q, go) {
      const sel = new Set();
      el.querySelectorAll('[data-pk]').forEach(b => b.onclick = () => { const i = +b.dataset.pk; sel.has(i) ? sel.delete(i) : sel.add(i); b.classList.toggle('on', sel.has(i)); });
      el.querySelector('[data-ok]').onclick = () => sel.size ? go([...sel]) : 0;
    },
    paint(el, q, a) { el.querySelectorAll('[data-pk]').forEach(b => { const i = +b.dataset.pk, s = a.includes(i), c = q.a.includes(i); b.disabled = true; b.classList.toggle('on', s); if (s) b.classList.add(c ? 'ok' : 'no'); else if (c) b.classList.add('ok'); }); el.querySelectorAll('.inrow button').forEach(b => b.disabled = true); }
  };

  /* ---------- نوع سؤال: حلّلي المقدار (كذا خانة رقمية) ---------- */
  FR.TY.an = {
    tag: 'حلّلي المقدار',
    build: q => `<div class="anf">${q.f.map((f, i) => `<label class="anr"><span>${dig(f.l)}</span><input class="pcf anv" dir="ltr" inputmode="text" autocomplete="off" aria-label="${f.l}"></label>`).join('')}</div><div class="inrow"><button class="sm" data-neg type="button" aria-label="إشارة سالب">− إشارة</button><button class="btn" data-ok type="button">تحقّقي ✔️</button></div><small>اكتبي رقمًا في كل خانة (والمعامل السالب بإشارة −).</small>`,
    check: (q, a) => ({ r: a.length === q.f.length && q.f.every((f, i) => VS.parseV(a[i]) === f.a) }),
    corr: q => q.f.map(f => dig(f.l) + ': ' + fmt('{{' + f.a + '}}')).join(' ، '),
    bind(el, q, go) {
      const ins = [...el.querySelectorAll('.anv')]; let last = ins[0];
      ins.forEach(i => { i.onfocus = () => last = i; i.onkeydown = e => { if (e.key === 'Enter') f(); }; });
      const f = () => { const bad = ins.findIndex(i => isNaN(VS.parseV(i.value))); if (bad >= 0) ins[bad].focus(); else go(ins.map(i => i.value)); };
      el.querySelector('[data-ok]').onclick = f;
      el.querySelector('[data-neg]').onclick = () => { const v = last.value.trim(); last.value = /^[-−]/.test(v) ? v.slice(1) : '-' + v; last.focus(); };
    },
    paint(el, q, a) { el.querySelectorAll('.anv').forEach((i, k) => { i.value = dig(String(a[k]).replace(/-/g, '−')); i.disabled = true; i.classList.add(VS.parseV(a[k]) === q.f[k].a ? 'ok' : 'no'); }); el.querySelectorAll('.inrow button').forEach(b => b.disabled = true); }
  };

  const mkw = sec => { const w = document.createElement('div'); w.className = 'wd'; sec.appendChild(w); return w; };

  /* ---------- أداة: مكونات الحد (اختاري حد ثم اضغطي على الجزء) ---------- */
  function anat(sec, [terms]) {
    const w = mkw(sec); let cur = 0, part = -1;
    const info = p => [
      ['الإشارة', p.sg < 0 ? 'سالبة (−)' : 'موجبة (+)'],
      ['المعامل العددي', F(p.coef) + (p.lit && !p.has ? ' (واحد ضمنيًا)' : '')],
      ['المتغيرات', p.vars.length ? p.vars.map(v => F(v[0])).join(' ، ') : 'مفيش (حد ثابت)'],
      ['الأسس', p.vars.length ? p.vars.map(v => 'أس ' + F(v[0]) + ': ' + F(v[1]) + (/\^/.test(p.lit) && p.lit.includes(v[0] + '^') ? '' : ' (ضمنيًا)')).join(' ، ') : '—'],
      ['الجزء الحرفي', p.lit ? F(p.lit) : '—']
    ];
    const draw = () => {
      const p = parse(terms[cur]), inf = info(p);
      w.innerHTML = `<b>🔬 اختاري حدًا وشوفي مكوناته</b><div class="vg">${terms.map((t, i) => `<button class="sm${i === cur ? ' on' : ''}" data-t="${i}">${F(t)}</button>`).join('')}</div><p class="chain" style="font-size:1.6rem">${F(p.term)}</p><div class="vg">${inf.map((x, i) => `<button class="sm${i === part ? ' on' : ''}" data-pt="${i}">${x[0]}</button>`).join('')}</div><p class="fb good" aria-live="polite">${part < 0 ? 'اضغطي على جزء لتشوفي قيمته 👆' : inf[part][0] + ': ' + inf[part][1]}</p>`;
      w.querySelectorAll('[data-t]').forEach(b => b.onclick = () => { cur = +b.dataset.t; part = -1; draw(); });
      w.querySelectorAll('[data-pt]').forEach(b => b.onclick = () => { part = +b.dataset.pt; draw(); });
    };
    draw();
  }

  /* ---------- أداة: اختاري معامل كل حد ---------- */
  function coefw(sec, [terms]) {
    const w = mkw(sec), st = {};
    const opts = terms.map((t, i) => { const p = parse(t); let o = [p.coef, -p.coef === p.coef ? p.coef + 1 : -p.coef, p.vars.reduce((s, v) => s + v[1], 0) + (p.coef === 1 || p.coef === -1 ? 2 : 0)]; o = [...new Set(o)]; for (let k = 2; o.length < 3; k++) if (!o.includes(k)) o.push(k); return o.sort((x, y) => ((x * 7 + i) % 5) - ((y * 7 + i) % 5)); });
    const draw = () => {
      w.innerHTML = `<b>🎯 اضغطي على معامل كل حد</b>${terms.map((t, i) => { const p = parse(t); return `<div class="vcr"><span class="vt">${F(p.term)}</span>${st[i] === undefined ? opts[i].map(o => `<button class="sm" data-c="${i}" data-o="${o}">${F(o)}</button>`).join('') : `<span class="${st[i] ? 'vok' : 'vno'}">${st[i] ? '✅ ' : '❌ المعامل '}${F(p.coef)}</span>`}</div>`; }).join('')}<p>${Object.keys(st).length === terms.length ? '🎀 خلصتي كل الحدود!' : 'اختاري المعامل الصح لكل حد.'}</p>`;
      w.querySelectorAll('[data-c]').forEach(b => b.onclick = () => { const i = +b.dataset.c; st[i] = +b.dataset.o === parse(terms[i]).coef ? 1 : 0; draw(); });
    };
    draw();
  }

  /* ---------- أداة: علّمي كل حد وعدّي الحدود ---------- */
  function count(sec, [exprs]) {
    const w = mkw(sec), st = {};
    const draw = () => {
      w.innerHTML = exprs.map((e, ei) => { const ts = T(e), n = ts.filter((p, i) => st[ei + '_' + i]).length; return `<div class="cnt"><b>${F(e)}</b><div class="vg">${ts.map((p, i) => `<button class="sm${st[ei + '_' + i] ? ' on' : ''}" data-e="${ei}" data-i="${i}">${F(p.term)}</button>`).join('')}</div><p class="${n === ts.length ? 'fb good' : ''}">${n === ts.length ? '✅ عدد الحدود = ' + F(n) : 'علّمي كل حد بالضغط عليه (الإشارة جزء من الحد): ' + F(n)}</p></div>`; }).join('');
      w.querySelectorAll('[data-e]').forEach(b => b.onclick = () => { const k = b.dataset.e + '_' + b.dataset.i; st[k] = !st[k]; draw(); });
    };
    draw();
  }

  const css = document.createElement('style');
  css.textContent = `.anf{display:flex;flex-direction:column;gap:8px;margin:8px 0}.anr{display:flex;align-items:center;justify-content:space-between;gap:8px}.anr .pcf{width:90px;text-align:center}.cnt{margin-bottom:10px}.vg .sm.ok{background:#e4f6e9;border-color:#3a9b57}.vg .sm.no{background:#fde8e6;border-color:#d24a3e}`;
  document.head.appendChild(css);
  window.TS = { mk, ex, T, parse, anat, coefw, count };
})();
    
