/* الجزء 2: الصفحات + الربط */
(function () {
  'use strict';
  const A = window.APP;
  if (!A) return;
  const { $, rd, rw, AR, RM, esc, math, SECS, skills, has, stateOf, coins, nameV, stats, nextSkill, msg, FLASH, mascot, go, mark, R } = A;
  const CT = () => { try { return typeof CONTENT !== 'undefined' ? CONTENT : null; } catch (e) { return null; } };
  /* ---------- الصفحات ---------- */
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
    const w = document.createElement('div'); w.innerHTML = secHead('الشارات (' + AR(got) + ' من ' + AR(b.length) + ')', '', '') + '<div class="badges">' + b.map(x => `<button class="badge ${x[3] ? 'on' : 'off'}" aria-label="${x[1]}"><i>${x[0]}</i>${x[1]}<small ${x[3] ? 'hidden' : ''}>${x[2]}</small></button>`).join('') + '</div>'; view.appendChild(w);
    const t = coins(), bal = v.querySelector('#balN');
    if (RM() || !t) bal.textContent = AR(t); else { const t0 = performance.now(); (function f(n) { const k = Math.min(1, (n - t0) / 900); bal.textContent = AR(Math.round(t * (1 - Math.pow(1 - k, 3)))); if (k < 1) requestAnimationFrame(f); })(t0); }
  };

  /* ---------- مهارة ---------- */
  let skillObs = null;
  function skillBarHTML() {
    const s = (window.FND && FND.state && FND.state()) || {}, sec = SECS().find(x => x.id === s.sec), sc = SECS().indexOf(sec) + 1;
    if (!sec) return '';
    const sid = s.sk, title = sid ? sec.skills[+sid.split('k')[1] - 1] : sec.title, st = sid ? stateOf(sid) : '';
    const lab = { ok: 'أتقنتيها ✓', prog: 'قيد التقدم', new: 'جديدة', '': '' }[st] || '';
    const dots = sec.skills.map((t, i) => { const id = sec.id + 'k' + (i + 1); return `<i class="${id === sid ? 'cur' : stateOf(id) === 'ok' ? 'ok' : ''}"></i>`; }).join('');
    return `<div class="skillbar c${sc}" style="view-transition-name:skillhero"><button class="back" data-back aria-label="رجوع">→</button><div class="tt"><small>${sec.icon || ''} ${esc(sec.title)}</small><b>${esc(title)}</b></div>${lab ? `<span class="st">${lab}</span>` : ''}</div><div class="dots" aria-hidden="true">${dots}</div>`;
  }
  R.skill = (view, id) => {
    const bar = document.createElement('div'); bar.id = 'skillbarwrap'; view.appendChild(bar);
    const root = $('found'); root.hidden = false; view.appendChild(root);
    if (window.FND) FND.open(id);
    bar.innerHTML = skillBarHTML();
    if (skillObs) skillObs.disconnect();
    if (window.MutationObserver) { skillObs = new MutationObserver(() => { const h = skillBarHTML(); if (h && bar.innerHTML !== h) { const keep = bar.querySelector('.skillbar'); bar.innerHTML = h; } }); skillObs.observe(root, { childList: true }); }
  };
  R.lesson = view => {
    const bar = document.createElement('div'); bar.innerHTML = '<div class="skillbar c5"><button class="back" data-back aria-label="رجوع">→</button><div class="tt"><small>📚 المكتبة</small><b>المعادلة التربيعية</b></div></div>'; view.appendChild(bar);
    const l = $('lessons'); l.hidden = false; view.appendChild(l);
  };

  /* ---------- الافتتاحية ---------- */
  function splash() {
    const sp = $('splash'); if (!sp) return;
    const stars = [[8, 16], [86, 12], [14, 74], [80, 70], [48, 8], [92, 44], [6, 46]].map((p, i) => `<span class="st" style="left:${p[0]}%;top:${p[1]}%;animation-delay:${i * .3}s" aria-hidden="true">${['✨', '⭐', '💗', '✨', '🌷', '⭐', '✨'][i]}</span>`).join('');
    sp.innerHTML = stars + '<button class="skip" aria-label="تخطي الافتتاحية">تخطّي</button><div class="sp">' + mascot('sp') + '<h1>موقعي التعليمي</h1><p>الرياضيات بتبقى أسهل خطوة بخطوة 🎀</p></div>';
    let gone = false;
    const end = () => { if (gone) return; gone = true; sp.classList.add('off'); setTimeout(() => sp.remove(), 700); };
    sp.addEventListener('click', end); addEventListener('keydown', e => { if (e.key === 'Escape' || e.key === 'Enter') end(); }, { once: true });
    setTimeout(end, RM() ? 1400 : 2600);
  }

  /* ---------- ربط بالنظام القديم ---------- */
  function hook() {
    // show() القديمة تتحول للتنقل الجديد
    window.show = function (v) { const m = { home: 'home', lessons: 'journey', hub: 'journey', found: 'journey' }; go(m[v] || 'home', null, { instant: true, noPush: true }); };
    const rh = window.renderHome;
    if (typeof rh === 'function') window.renderHome = function () { const r = rh.apply(this, arguments); if (A.cur === 'home' && $('v-home')) { const keep = window.scrollY; go('home', null, { instant: true, noPush: true }); window.scrollTo(0, keep); } return r; };
    // عدّاد العملات: حركة صغيرة عند التغيير
    const cc = $('coinCount');
    if (cc && window.MutationObserver) new MutationObserver(() => { const c = $('coins'); if (c && !RM()) { c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump'); } }).observe(cc, { childList: true, characterData: true, subtree: true });
  }

  function init() {
    A.buildShell(); hook(); splash(); window.__APP = true;
    let v = 'home';
    try { history.replaceState({ v: 'home' }, ''); } catch (e) {}
    go(v, null, { instant: true, noPush: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
      
