/* 🎀 واجهة Playful Premium — طبقة عرض فقط.
   بتقرأ نفس البيانات القديمة (fnd / fq / fc / coins / name) ولا بتكتب أي مفتاح منهم. */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const rd = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) || d; } catch (e) { return d; } };
  const rw = k => { try { return localStorage.getItem(k) || ''; } catch (e) { return ''; } };
  const AR = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
  const RM = () => window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches;
  const esc = s => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  const math = el => { try { if (typeof rm === 'function') rm(el); } catch (e) {} };

  /* ---------- بيانات ---------- */
  const SECS = () => (typeof SECTIONS !== 'undefined' ? SECTIONS : []);
  const skills = () => SECS().flatMap((s, si) => s.skills.map((t, i) => ({ id: s.id + 'k' + (i + 1), title: t, sec: s, si })));
  const CT = () => { try { return typeof CONTENT !== 'undefined' ? CONTENT : null; } catch (e) { return null; } };
  const has = id => { try { return !!(CT() && CT()[id]) || !!(window.SKILL_PAGES && SKILL_PAGES[id]); } catch (e) { return false; } };
  const stateOf = id => { const f = (rd('fnd', {})[id] || 0); return !has(id) ? 'lock' : f >= 2 ? 'ok' : f === 1 ? 'prog' : 'new'; };
  const coins = () => parseInt(rw('coins')) || 0;
  const nameV = () => rw('name');
  const stats = () => {
    const all = skills(), c = { ok: 0, prog: 0, new: 0, lock: 0 };
    all.forEach(k => c[stateOf(k.id)]++);
    const open = c.ok + c.prog + c.new;
    return { c, open, total: all.length, pct: open ? Math.round(c.ok / open * 100) : 0 };
  };
  const nextSkill = () => {
    const a = skills().filter(k => has(k.id));
    return a.find(k => stateOf(k.id) === 'prog') || a.find(k => stateOf(k.id) === 'new') || a[0];
  };
  const MSGS = ['خطوة صغيرة النهارده بتفرق كتير 🌱', 'إنتي أقدر مما بتفتكري 💪', 'الغلطة بتعلّمك، مش بتحكم عليكي ✨', 'كل مهارة بتتقن بتفتح اللي بعدها 🔑', 'مش لازم تكوني سريعة، المهم تفهمي 🎀', 'ركّزي على الفهم والباقي هييجي 🌷'];
  const msg = () => MSGS[Math.floor(Date.now() / 864e5) % MSGS.length];
  const FLASH = [['ترتيب العمليات الحسابية', 'أقواس ← قوى ← × ÷ ← + −'], ['مجموع زوايا المثلث', '$180°$'], ['نظرية فيثاغورس', 'في المثلث القائم: $c^2 = a^2 + b^2$'], ['مساحة المستطيل', 'الطول × العرض'], ['مساحة المثلث', '$\\frac{1}{2} \\times$ القاعدة × الارتفاع'], ['القانون العام للمعادلة التربيعية', '$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$'], ['جا ، جتا ، ظا', 'جا = المقابل÷الوتر ، جتا = المجاور÷الوتر ، ظا = المقابل÷المجاور'], ['$(a + b)^2$', '$a^2 + 2ab + b^2$'], ['$a^2 - b^2$', '$(a - b)(a + b)$'], ['ضرب عددين سالبين', 'الناتج موجب'], ['ضرب طرفي متباينة في عدد سالب', 'اتجاه المتباينة بينعكس']];

  /* ---------- أيقونات + ماسكوت ---------- */
  const IC = {
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h5v-6h4v6h5V10"/></svg>',
    journey: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="19" r="2.2"/><circle cx="18" cy="5" r="2.2"/><path d="M8 18c6 0 2-6 6-8s2-3 2-3"/></svg>',
    review: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12a8 8 0 1 1-2.4-5.7"/><path d="M20 4v5h-5"/><path d="M9.5 12.5l2 2 3.5-4"/></svg>',
    library: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5"/><path d="M9 8h6"/></svg>',
    trophy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H4v1a3 3 0 0 0 4 3M16 6h4v1a3 3 0 0 1-4 3"/><path d="M12 13v4M8 20h8M10 17h4"/></svg>'
  };
  const mascot = (cls) => `<svg class="mas ${cls || ''}" viewBox="0 0 130 150" role="img" aria-label="ماسكوت الآلة الحاسبة">
  <defs><linearGradient id="mg${cls ? 1 : 0}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#f7dcec"/></linearGradient></defs>
  <ellipse cx="65" cy="143" rx="36" ry="5" fill="rgba(120,60,110,.15)"/>
  <rect x="22" y="30" width="86" height="108" rx="24" fill="url(#mg${cls ? 1 : 0})" stroke="#e9b5cf" stroke-width="3"/>
  <rect x="32" y="42" width="66" height="36" rx="12" fill="#d9f0e6" stroke="#b6dcc9" stroke-width="2"/>
  <ellipse class="eye" cx="52" cy="58" rx="4.5" ry="6" fill="#4a2a52"/><ellipse class="eye" cx="78" cy="58" rx="4.5" ry="6" fill="#4a2a52"/>
  <path d="M57 67q8 7 16 0" fill="none" stroke="#4a2a52" stroke-width="3" stroke-linecap="round"/>
  <circle cx="42" cy="66" r="4.5" fill="#f9a8c6" opacity=".7"/><circle cx="88" cy="66" r="4.5" fill="#f9a8c6" opacity=".7"/>
  <g><circle cx="44" cy="96" r="7" fill="#F8C9DB"/><circle cx="65" cy="96" r="7" fill="#DDCDF6"/><circle cx="86" cy="96" r="7" fill="#FFEDB8"/>
  <circle cx="44" cy="116" r="7" fill="#CBEFDF"/><circle cx="65" cy="116" r="7" fill="#D2E6F9"/><circle cx="86" cy="116" r="7" fill="#FFD9C4"/></g>
  <g transform="translate(88 24) rotate(14)"><path d="M0 0L-24 -13Q-30 0 -24 13Z" fill="#e0679b"/><path d="M0 0L24 -13Q30 0 24 13Z" fill="#e0679b"/><circle r="6" fill="#c24a82"/></g>
  <path class="spk" d="M14 28l2.5 6 6 2.5-6 2.5-2.5 6-2.5-6-6-2.5 6-2.5z" fill="#FFD66B"/>
  <path class="spk" d="M118 84l2 4.5 4.5 2-4.5 2-2 4.5-2-4.5-4.5-2 4.5-2z" fill="#B79BE8"/>
  <path class="spk" d="M116 20l1.6 3.6 3.6 1.6-3.6 1.6-1.6 3.6-1.6-3.6-3.6-1.6 3.6-1.6z" fill="#F08FB5"/></svg>`;

  /* ---------- التنقل ---------- */
  const NAV = [['home', 'الرئيسية', 'home'], ['journey', 'رحلتي', 'journey'], ['review', 'المراجعة', 'review'], ['library', 'المكتبة', 'library'], ['rewards', 'إنجازاتي', 'trophy']];
  let cur = 'home', arg = null, navIdx = 0;
  const pos = {};

  function buildShell() {
    const app = document.createElement('div'); app.id = 'app';
    const hdr = document.querySelector('header');
    app.innerHTML = '<nav id="nav" aria-label="التنقل الرئيسي"><div class="brandbox">' + mascot('') + '<span>موقعي التعليمي</span></div><div class="items"><i class="ind" aria-hidden="true"></i>' +
      NAV.map(n => `<button data-go="${n[0]}" aria-label="${n[1]}">${IC[n[2]]}<span>${n[1]}</span></button>`).join('') + '</div></nav><div id="stage" tabindex="-1"></div>';
    document.body.insertBefore(app, document.body.firstChild);
    if (hdr) app.insertBefore(hdr, app.firstChild);
    ['home', 'lessons', 'found', 'hub'].forEach(id => { const e = $(id); if (e) e.hidden = true; });
    document.body.addEventListener('click', onClick);
    addEventListener('resize', moveInd);
    addEventListener('popstate', e => { const s = e.state || { v: 'home' }; go(s.v, s.a, { pop: true }); });
  }
  function moveInd() {
    const items = document.querySelector('#nav .items'), ind = items && items.querySelector('.ind'); if (!ind) return;
    const on = items.querySelector('button.on'); if (!on) { ind.style.opacity = 0; return; }
    ind.style.opacity = 1; ind.style.top = on.offsetTop + 'px'; ind.style.left = on.offsetLeft + 'px'; ind.style.width = on.offsetWidth + 'px'; ind.style.height = on.offsetHeight + 'px';
  }
  function mark(v) {
    const vv = (v === 'skill' || v === 'lesson') ? (v === 'lesson' ? 'library' : 'journey') : v;
    document.querySelectorAll('#nav button').forEach(b => { const on = b.dataset.go === vv; b.classList.toggle('on', on); if (on) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); });
    moveInd();
  }

  function stash() { ['found', 'lessons'].forEach(id => { const e = $(id); if (e && e.parentNode !== document.body) { e.hidden = true; document.body.appendChild(e); } }); const ns = $('nameCard'), tm = document.querySelector('.team'); [ns, tm].forEach(e => { if (e && e.parentNode && e.parentNode.id !== 'home') { const h = $('home'); if (h) h.appendChild(e); } }); }

  function go(v, a, o) {
    o = o || {};
    if (v === 'skill' && !a) v = 'journey';
    const run = () => {
      pos[cur + (arg || '')] = window.scrollY;
      const back = !!o.pop;
      stash(); cur = v; arg = a || null;
      const st = $('stage'); st.innerHTML = '';
      const view = document.createElement('div'); view.className = 'view' + (back ? ' back' : ''); view.id = 'v-' + v; st.appendChild(view);
      (R[v] || R.home)(view, a);
      [...view.children].forEach((c, i) => c.style.setProperty('--i', Math.min(i, 9)));
      mark(v); math(view);
      const y = back ? (pos[v + (a || '')] || 0) : 0; window.scrollTo(0, y);
      if (!o.pop && !o.noPush) { try { history.pushState({ v, a }, ''); } catch (e) {} }
      try { localStorage.setItem('ui_last', v); } catch (e) {}
    };
    if (!RM() && document.startViewTransition && !o.instant) { try { document.startViewTransition(run); } catch (e) { run(); } } else run();
  }

  function onClick(e) {
    const g = e.target.closest('[data-go]');
    if (g) { e.preventDefault(); const sh = g.closest('[data-share]'); if (sh) g.style.viewTransitionName = 'skillhero'; go(g.dataset.go, g.dataset.arg); return; }
    const op = e.target.closest('[data-open]');
    if (op) { e.preventDefault(); op.style.viewTransitionName = 'skillhero'; go('skill', op.dataset.open); return; }
    const fl = e.target.closest('.flash'); if (fl) { fl.classList.toggle('open'); fl.setAttribute('aria-expanded', fl.classList.contains('open')); return; }
    const rv = e.target.closest('.rv [data-reveal]'); if (rv) { rv.closest('.rv').classList.toggle('open'); return; }
    const bk = e.target.closest('[data-back]');
    if (bk) { if (history.state && history.state.v !== 'home' || history.length > 1) history.back(); else go('journey'); return; }
    const bd = e.target.closest('.badge'); if (bd) { bd.classList.toggle('show'); const d = bd.querySelector('small'); if (d) d.hidden = false; }
  }

  /* ---------- الصفحات ---------- */
  const R = {};
  const secHead = (t, b, goTo) => `<div class="secthead"><h2>${t}</h2>${b ? `<button data-go="${goTo}">${b} ←</button>` : ''}</div>`;

  R.home = view => {
    const S = stats(), n = nameV(), nx = nextSkill();
    const ns = $('nameCard'); if (ns) ns.hidden = !!n;
    const hero = document.createElement('section'); hero.className = 'hero2';
    hero.innerHTML = `<div class="mascol">${mascot('')}</div><div><div class="hi">${n ? 'أهلاً بيكي يا ' + esc(n) + ' 🎀' : 'أهلاً بيكي 🎀'}</div><h1>${n ? 'جاهزة نكمّل؟' : 'نبدأ رحلتنا مع الرياضيات'}</h1><p class="msg">${msg()}</p></div>
    <div><div class="prog"><div class="rg" style="--v:${S.pct}"><b>${AR(S.pct)}٪</b></div><small>أتقنتي ${AR(S.c.ok)} من ${AR(S.open)} مهارة<br>${S.c.prog ? 'وفي ' + AR(S.c.prog) + ' قيد التقدم' : 'كل مهارة بتفتح اللي بعدها'}</small></div>
    ${n && nx ? `<button class="btn" data-open="${nx.id}">${S.c.prog ? 'كمّلي من حيث وقفتي' : 'ابدئي المذاكرة'} ✨</button>` : '<div class="nameslot"></div>'}</div>`;
    view.appendChild(hero);
    if (!n && ns) hero.querySelector('.nameslot').appendChild(ns);
    // رحلتي المصغّرة
    const cs = nx ? nx.sec : SECS()[0];
    const sc = cs ? SECS().indexOf(cs) + 1 : 1;
    const j = document.createElement('div');
    j.innerHTML = secHead('رحلتي', 'كل الرحلة', 'journey') + '<div class="strip">' + (cs ? cs.skills.map((t, i) => { const id = cs.id + 'k' + (i + 1), st = stateOf(id); return `<button class="mini c${sc}" ${st === 'lock' ? 'disabled style="opacity:.55"' : `data-open="${id}"`}><span class="ic">${st === 'ok' ? '✅' : st === 'prog' ? '⏳' : st === 'lock' ? '🔒' : '🌷'}</span>${esc(t)}</button>`; }).join('') : '') + '</div>';
    view.appendChild(j);
    // مراجعة + عملات
    const rv = reviewData();
    const d = document.createElement('div'); d.className = 'duo';
    d.innerHTML = `<button class="tile2 t-rev" data-go="review"><span class="em">🔁</span><h3>المراجعة الذكية</h3><div class="num">${AR(rv.items.length + rv.weak.length)}</div><small>${rv.items.length + rv.weak.length ? 'حاجة محتاجة مراجعة' : 'مفيش حاجة متأخرة 🎉'}</small></button>
    <button class="tile2 t-coin" data-go="rewards"><span class="em">🪙</span><h3>العملات</h3><div class="num">${AR(coins())}</div><small>إنجازاتي وشاراتي</small></button>`;
    view.appendChild(d);
    const f = FLASH[Math.floor(Date.now() / 864e5) % FLASH.length];
    const fc = document.createElement('button'); fc.className = 'flashcard'; fc.setAttribute('data-go', 'library');
    fc.innerHTML = `<small>📚 من المكتبة</small><b>${f[0]}</b><span>${f[1]}</span>`; view.appendChild(fc);
    const tm = document.querySelector('.team'); if (tm) { const w = document.createElement('div'); w.className = 'credits'; w.appendChild(tm); view.appendChild(w); }
  };

  R.journey = (view, a) => {
    const S = stats(), nx = nextSkill();
    const cur0 = a || (nx ? nx.sec.id : SECS()[0].id);
    const idx = Math.max(0, SECS().findIndex(s => s.id === cur0)), sec = SECS()[idx], sc = idx + 1;
    const ph = document.createElement('div'); ph.className = 'pagehead';
    ph.innerHTML = `<h1>رحلتي في الرياضيات</h1><p>اختاري القسم وكمّلي خطوة بخطوة</p>`; view.appendChild(ph);
    const k = document.createElement('div'); k.className = 'kpis';
    k.innerHTML = [['أتقنتي', S.c.ok], ['قيد التقدم', S.c.prog], ['متاحة', S.c.new], ['قريباً', S.c.lock]].map(x => `<div class="kpi"><b>${AR(x[1])}</b>${x[0]}</div>`).join(''); view.appendChild(k);
    const ch = document.createElement('div'); ch.className = 'chips'; ch.setAttribute('role', 'tablist');
    ch.innerHTML = SECS().map((s, i) => { const on = i === idx; return `<button role="tab" aria-selected="${on}" class="chipx ${on ? 'on c' + (i + 1) : ''}" data-go="journey" data-arg="${s.id}"><span>${s.icon || ''}</span>${esc(s.title)}</button>`; }).join(''); view.appendChild(ch);
    const done = sec.skills.filter((t, i) => stateOf(sec.id + 'k' + (i + 1)) === 'ok').length, avail = sec.skills.filter((t, i) => has(sec.id + 'k' + (i + 1))).length;
    const lane = document.createElement('section'); lane.className = 'lane c' + sc;
    lane.innerHTML = `<div class="lanehead"><div class="rg" style="--v:${avail ? Math.round(done / avail * 100) : 0}"><b>${AR(avail ? Math.round(done / avail * 100) : 0)}٪</b></div><div><h2>${sec.icon || ''} ${esc(sec.title)}</h2><small>${AR(done)} من ${AR(avail)} مهارة متاحة · ${AR(sec.skills.length)} في القسم</small></div></div>
    <ol class="path">${sec.skills.map((t, i) => { const id = sec.id + 'k' + (i + 1), st = stateOf(id); const lab = { ok: 'أتقنتيها ✓', prog: 'قيد التقدم', new: 'ابدئي دلوقتي', lock: 'قريباً' }[st]; const dot = { ok: '✓', prog: '…', new: AR(i + 1), lock: '🔒' }[st];
      return `<li class="pn ${st}"><span class="dot" aria-hidden="true">${dot}</span><button class="nodecard" ${st === 'lock' ? 'disabled' : `data-open="${id}"`}>${esc(t)}<small>${lab}</small></button></li>`; }).join('')}</ol>`;
    view.appendChild(lane);
    const lg = document.createElement('div'); lg.className = 'legend'; lg.innerHTML = '<span>✓ أتقنتيها</span><span>… قيد التقدم</span><span>رقم: متاحة</span><span>🔒 قريباً</span>'; view.appendChild(lg);
  };

  function reviewData() {
    const fq = rd('fq', {}), items = [], weak = [];
    try { if (CT()) Object.keys(CT()).forEach(sid => (CT()[sid].quiz || []).forEach((q, i) => { const v = fq[sid + 'q' + i]; if (v !== undefined && v !== q.c) items.push({ sid, t: q.t, o: q.o, c: q.c, w: q.w }); })); } catch (e) {}
    try { if (typeof Q !== 'undefined' && typeof done !== 'undefined') Q.forEach(q => { if (done[q.id] !== undefined && done[q.id] !== q.c) items.push({ sid: 'lesson', t: q.t, o: q.o, c: q.c, w: q.w }); }); } catch (e) {}
    skills().forEach(k => { if (stateOf(k.id) === 'prog') weak.push(k); });
    return { items, weak, mastered: skills().filter(k => stateOf(k.id) === 'ok') };
  }
  R.review = view => {
    const r = reviewData(), tot = r.items.length + r.weak.length;
    const ph = document.createElement('div'); ph.className = 'pagehead'; ph.innerHTML = '<h1>المراجعة الذكية</h1><p>الحاجات اللي محتاجة نرجعلها عشان تثبت</p>'; view.appendChild(ph);
    if (!tot) {
      const e = document.createElement('div'); e.className = 'card empty'; e.innerHTML = mascot('') + '<h2>مفيش حاجة متأخرة! 🎉</h2><p>لما تغلطي في سؤال أو تقفي في نص مهارة هتظهرلك هنا.</p><button class="btn" data-go="journey">كمّلي رحلتك</button>'; view.appendChild(e);
    }
    if (r.weak.length) { const s = document.createElement('div'); s.innerHTML = secHead('مهارات محتاجة تثبيت', '', '') + r.weak.map(k => `<button class="rvrow" data-open="${k.id}"><span>${esc(k.title)}<small>${esc(k.sec.title)} · ما اتقنتهاش لسه</small></span><span>⏳</span></button>`).join(''); view.appendChild(s); }
    if (r.items.length) { const s = document.createElement('div'); s.innerHTML = secHead('أسئلة غلطتي فيها', '', '') + r.items.map(q => `<div class="rv"><p class="qt">${q.t}</p><button class="sm" data-reveal>اعرضي الإجابة</button><div class="ans"><b>الإجابة الصح:</b> ${q.o[q.c]}<br>${q.w || ''}</div></div>`).join(''); view.appendChild(s); }
    if (r.mastered.length) { const s = document.createElement('div'); s.innerHTML = secHead('مراجعة سريعة لمهارات أتقنتيها', '', '') + r.mastered.map(k => `<button class="rvrow" data-open="${k.id}"><span>${esc(k.title)}<small>${esc(k.sec.title)}</small></span><span>✅</span></button>`).join(''); view.appendChild(s); }
  };

  R.library = view => {
    const ph = document.createElement('div'); ph.className = 'pagehead'; ph.innerHTML = '<h1>مكتبة الرياضيات</h1><p>قوانين وملخصات سريعة ودروس تقدري ترجعيلها</p>'; view.appendChild(ph);
    const a = document.createElement('div'); a.innerHTML = secHead('📌 قوانين سريعة', '', '') + FLASH.map(f => `<button class="flash" aria-expanded="false"><h3>${f[0]}</h3><small>اضغطي علشان تشوفي القاعدة</small><div class="back">${f[1]}</div></button>`).join(''); view.appendChild(a);
    const b = document.createElement('div');
    b.innerHTML = secHead('📖 الدروس المشروحة', '', '') + SECS().map((s, si) => { const ks = skills().filter(k => k.sec === s && has(k.id)); return ks.length ? `<div class="card"><h3>${s.icon || ''} ${esc(s.title)}</h3>${ks.map(k => `<button class="rvrow" data-open="${k.id}"><span>${esc(k.title)}</span><span>←</span></button>`).join('')}</div>` : ''; }).join('') +
      `<div class="card pink"><h3>📐 درس خاص: المعادلة التربيعية</h3><p>شرح خطوة بخطوة مع اختبار صغير.</p><button class="btn" data-go="lesson">افتحي الدرس</button></div>`;
    view.appendChild(b);
  };

  const BADGES = () => {
    const S = stats(), fc = Object.keys(rd('fc', {})).length, c = coins(), sections = SECS().filter(s => { const ks = s.skills.map((t, i) => s.id + 'k' + (i + 1)).filter(has); return ks.length && ks.every(k => stateOf(k) === 'ok'); }).length;
    return [['🌱', 'أول مهارة', 'أتقنتي مهارة كاملة', S.c.ok >= 1], ['🌷', 'ثلاث مهارات', 'أتقنتي ٣ مهارات', S.c.ok >= 3], ['🏅', 'قسم كامل', 'خلّصتي كل مهارات قسم', sections >= 1], ['✅', 'عشر إجابات صح', 'إجابات صح في أسئلة المهارات', fc >= 10], ['🪙', 'مية عملة', 'جمعتي ١٠٠ عملة', c >= 100], ['💎', 'خمسمية عملة', 'جمعتي ٥٠٠ عملة', c >= 500]];
  };
  R.rewards = view => {
    const ph = document.createElement('div'); ph.className = 'pagehead'; ph.innerHTML = '<h1>إنجازاتي</h1><p>كل عملة وشارة هي تعبك إنتي</p>'; view.appendChild(ph);
    const v = document.createElement('section'); v.className = 'vault'; v.innerHTML = `<span class="coin">🪙</span><div class="bal" id="balN">٠</div><p>عملة · كل إجابة صح لأول مرة بتكسّبك ٥</p>`; view.appendChild(v);
    const b = BADGES(), got = b.filter(x => x[3]).length;
    const w = document.createElement('div'); w.innerHTML = secHead('الشارات (' + AR(got) + ' من ' + AR(b.length) + ')', '', '') + '<div class="badges">' + b.map(x => `<button class="badge ${x[3] ? 'on' : 'off'}" aria-label="${x[1]}"><i>${x[0]}</
