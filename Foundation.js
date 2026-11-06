/* 🌸 محرك قسم التأسيس — مش محتاجة تعدّلي فيه حاجة. المحتوى كله في skills.js */
(function () {
  const g = id => document.getElementById(id);
  const ld = k => { try { return JSON.parse(localStorage.getItem(k)) || {}; } catch (e) { return {}; } };
  const sv = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  let FD = ld('fnd'), FQ = ld('fq'), FC = ld('fc'), sec = null, sk = null;
  const nm = () => name ? 'يا ' + name : 'يا بطلة';
  const skl = s => s.skills.map((t, i) => ({ id: s.id + 'k' + (i + 1), title: t }));
  const has = id => !!CONTENT[id];
  const ok = id => (FD[id] || 0) >= 2;
  const stat = s => { const a = skl(s).filter(k => has(k.id)); return { n: a.length, d: a.filter(k => ok(k.id)).length }; };
  const pct = (d, n) => n ? Math.round(d / n * 100) : 0;
  const bar = (d, n) => `<div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct(d, n)}"><i style="width:${pct(d, n)}%"></i></div>`;

  const st = document.createElement('style');
  st.textContent = `.fgrid{display:grid;gap:12px;margin:16px 0}@media(min-width:600px){.fgrid{grid-template-columns:1fr 1fr}}
.fsec{font:inherit;text-align:center;border:2px solid var(--p);background:#fff;border-radius:22px;padding:16px;cursor:pointer;color:var(--ink);box-shadow:0 6px 18px rgba(199,126,156,.18);transition:transform .2s}
.fsec:hover{transform:translateY(-3px)}.fsec .ic{font-size:2.4rem;display:block}.fsec b{color:var(--deep);display:block;line-height:1.5;margin-bottom:6px}.fsec small{display:block;margin-top:4px}
.skrow{display:flex;justify-content:space-between;align-items:center;gap:8px;width:100%;font:inherit;text-align:right;border:2px solid var(--p);background:#fff;color:var(--ink);border-radius:16px;padding:10px 14px;margin:8px 0;cursor:pointer;min-height:54px}
.skrow:disabled{opacity:.6;cursor:default;border-style:dashed}.skrow.ok{background:#dff3e4;border-color:#2e8b57}
.crumb{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}
.fq{background:#fff;border:1px solid var(--s);border-radius:18px;padding:12px;margin:12px 0}`;
  document.head.appendChild(st);

  const root = document.createElement('main');
  root.id = 'found'; root.hidden = true;
  document.body.appendChild(root);

  function homeView() {
    let n = 0, d = 0;
    SECTIONS.forEach(s => { const x = stat(s); n += x.n; d += x.d; });
    root.innerHTML = `<section class="card pink"><div class="bow">🌸</div><h2>تأسيس الرياضيات</h2><p>اختاري قسم وابدئي مهارة مهارة. كل مهارة فيها شرح بسيط وأمثلة وتدريب واختبار قصير.</p>${bar(d, n)}<small>أتقنتي ${d} من ${n} مهارات متاحة</small></section>
<div class="fgrid">${SECTIONS.map(s => { const x = stat(s); return `<button class="fsec" data-a="open" data-id="${s.id}"><span class="ic">${s.icon}</span><b>${s.title}</b>${bar(x.d, x.n)}<small>${x.n ? x.d + ' من ' + x.n + ' مهارات' : 'قريباً 🎀'}</small></button>`; }).join('')}</div>`;
  }

  function skillsView(s) {
    const x = stat(s);
    root.innerHTML = `<div class="crumb"><button class="sm" data-a="home">⬅️ الأقسام</button></div>
<section class="card pink"><div class="bow">${s.icon}</div><h2>${s.title}</h2>${bar(x.d, x.n)}<small>${x.n ? 'أتقنتي ' + x.d + ' من ' + x.n + ' مهارات متاحة' : 'المهارات جاية قريباً 🎀'}</small></section>
${skl(s).map(k => `<button class="skrow${ok(k.id) ? ' ok' : ''}" ${has(k.id) ? `data-a="go" data-id="${k.id}"` : 'disabled'}><span>${k.title}</span><span>${ok(k.id) ? '✅ أتقنتيها' : has(k.id) ? '📖 ابدئي' : 'قريباً 🔒'}</span></button>`).join('')}`;
  }

  const qb = (q, qid, sid, p) => `<div class="fq" data-q="${qid}" data-c="${q.c}" data-p="${p}" data-s="${sid}"><p class="qt">${q.t}</p><div class="opts">${q.o.map((o, i) => `<button class="opt" data-a="pick" data-i="${i}">${o}</button>`).join('')}</div><p class="fb" aria-live="polite"></p><div class="exp" hidden><b>ليه؟</b> ${q.w}</div></div>`;

  function paintQ(card, i) {
    const c = +card.dataset.c;
    card.dataset.done = 1;
    card.querySelectorAll('.opt').forEach((o, k) => {
      o.disabled = true;
      if (k === c) { o.classList.add('ok'); o.insertAdjacentHTML('afterbegin', '✓ '); }
      else if (k === i) { o.classList.add('no'); o.insertAdjacentHTML('afterbegin', '✗ '); }
      else o.classList.add('dim');
    });
    const f = card.querySelector('.fb');
    f.textContent = i === c ? 'برافو ' + nm() + '! إجابتك صحيحة 💗' : 'ولا يهمك ' + nm() + '، كل غلطة بتعلمنا 💗 الإجابة الصحيحة معلّمة بـ ✓ وباللون الأخضر.';
    f.className = 'fb ' + (i === c ? 'good' : 'bad');
    card.querySelector('.exp').hidden = false;
  }

  function skillPage(id) {
    const s = SECTIONS.find(x => id.startsWith(x.id + 'k')), k = skl(s).find(x => x.id === id), c = CONTENT[id];
    root.innerHTML = `<div class="crumb"><button class="sm" data-a="home">🏠 الأقسام</button><button class="sm" data-a="open" data-id="${s.id}">⬅️ المهارات</button></div>
<section class="card pink"><div class="bow">${s.icon}</div><h2>${k.title}</h2></section>
<section class="card"><h3>📖 الشرح</h3>${c.explain}</section>
${c.examples.map((x, i) => `<section class="card step"><h3>✏️ مثال ${i + 1}</h3><p>${x.t}</p><ol>${x.steps.map((t, j) => `<li${j ? ' hidden' : ''}>${t}</li>`).join('')}</ol>${x.steps.length > 1 ? '<button class="sm" data-a="step">الخطوة التالية ⬇️</button>' : ''}</section>`).join('')}
<section class="card"><h3>🎮 تدريب (من غير درجات)</h3>${c.practice.map((q, i) => qb(q, id + 'p' + i, id, 0)).join('')}</section>
<section class="card"><h3>🧠 اختبار قصير</h3>${c.quiz.map((q, i) => qb(q, id + 'q' + i, id, 1)).join('')}<div id="fres"></div></section>`;
    c.quiz.forEach((q, i) => {
      const v = FQ[id + 'q' + i];
      if (v !== undefined) paintQ(root.querySelector(`[data-q="${id}q${i}"]`), v);
    });
    result(id);
  }

  function result(sid) {
    const c = CONTENT[sid], el = g('fres');
    if (!el) return;
    let a = 0, r = 0;
    c.quiz.forEach((q, i) => { const v = FQ[sid + 'q' + i]; if (v !== undefined) { a++; if (v === q.c) r++; } });
    if (a < c.quiz.length) { el.innerHTML = ''; return; }
    FD[sid] = r; sv('fnd', FD);
    const pass = r >= 2, n = name ? 'يا ' + name.replace(/[&<>"]/g, '') : 'يا بطلة';
    el.innerHTML = `<div class="card pink"><div class="bow">${pass ? '🏆' : '🌷'}</div><h3>${pass ? 'برافو ' + n + '! أتقنتي المهارة' : 'مفيش مشكلة ' + n + ' 💗'}</h3><p>جاوبتي صح على ${r} من ${c.quiz.length}.</p>${pass
      ? `<button class="btn" data-a="next" data-id="${sid}">المهارة التالية ⬅️</button>`
      : `<p>راجعي الشرح والأمثلة وجرّبي الاختبار تاني.</p><button class="btn" data-a="retry" data-id="${sid}">إعادة الاختبار 🔄</button>`}</div>`;
  }

  function pick(b) {
    const card = b.closest('.fq'), i = +b.dataset.i;
    if (card.dataset.done) return;
    paintQ(card, i);
    rm(card);
    if (card.dataset.p !== '1') return;
    const q = card.dataset.q, right = i === +card.dataset.c, first = right && !FC[q];
    FQ[q] = i; sv('fq', FQ);
    if (first) { FC[q] = 1; sv('fc', FC); coins += 5; LS.s('coins', coins); upd(); celebrate(); }
    else if (!right) wrongEffect();
    result(card.dataset.s);
  }

  function retry(sid) {
    CONTENT[sid].quiz.forEach((q, i) => delete FQ[sid + 'q' + i]);
    sv('fq', FQ); delete FD[sid]; sv('fnd', FD);
    sk = sid; render();
  }

  function next(sid) {
    const s = SECTIONS.find(x => sid.startsWith(x.id + 'k')), l = skl(s), i = l.findIndex(x => x.id === sid);
    const n = l.slice(i + 1).find(x => has(x.id));
    if (n) sk = n.id; else { sec = s; sk = null; }
    render();
  }

  function render() {
    if (sk) skillPage(sk); else if (sec) skillsView(sec); else homeView();
    rm(root);
    window.scrollTo(0, 0);
  }

  root.addEventListener('click', e => {
    const b = e.target.closest('[data-a]');
    if (!b || b.disabled) return;
    const a = b.dataset.a, id = b.dataset.id;
    if (a === 'open') { sec = SECTIONS.find(s => s.id === id); sk = null; render(); }
    else if (a === 'home') { sec = sk = null; render(); }
    else if (a === 'go') { sk = id; render(); }
    else if (a === 'step') { const c = b.parentNode, li = c.querySelector('li[hidden]'); if (li) li.hidden = false; if (!c.querySelector('li[hidden]')) b.hidden = true; }
    else if (a === 'pick') pick(b);
    else if (a === 'retry') retry(id);
    else if (a === 'next') next(id);
  });

  const _show = window.show;
  window.show = function (v) {
    if (v === 'found') {
      if (!name) { _show('home'); return; }
      g('home').hidden = true; g('lessons').hidden = true; root.hidden = false;
      LS.s('view', 'found'); render(); return;
    }
    root.hidden = true; _show(v);
  };

  const nav = document.querySelector('header nav');
  if (nav) nav.insertAdjacentHTML('beforeend', `<button class="nb" onclick="show('found')">التأسيس 🌸</button>`);
  const grid = document.querySelector('#home .grid');
  if (grid) grid.insertAdjacentHTML('beforebegin', `<section class="card pink"><div class="bow">🌸</div><h2>تأسيس الرياضيات</h2><p>راجعي الأساسيات اللي بتفرق في أولى ثانوي، خطوة بخطوة.</p><button class="btn" onclick="show('found')">ابدئي التأسيس</button></section>`);
  if (LS.g('view') === 'found') window.show('found');
})();
    
