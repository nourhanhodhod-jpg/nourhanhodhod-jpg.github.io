/* 🎀 مميزات المراجعة: لوحة الطالبة، خريطة الرحلة، التحدي اليومي، دفتر الأخطاء، المساعدة الذكية، المراجعة المتباعدة */
(function () {
  const g = id => document.getElementById(id);
  const rd = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) || d; } catch (e) { return d; } };
  let X = rd('fx', {});
  ['s', 'm', 'seen', 'fix', 't', 'dl'].forEach(k => X[k] = X[k] || {});
  X.days = X.days || []; X.n = X.n || 0; X.ok = X.ok || 0; X.st = X.st || 0;
  const save = () => { try { localStorage.setItem('fx', JSON.stringify(X)); } catch (e) {} };
  const today = () => new Date().toLocaleDateString('en-CA');
  const dn = s => Math.floor(Date.parse(s + 'T00:00:00Z') / 864e5);
  const nm = () => name ? 'يا ' + name : 'يا بطلة';
  const GOAL = 5;
  const MSG = ['كل مرة بتراجعي فيها بتبقي أقوى 💗', 'خمس دقايق النهارده كفاية 🌷', 'الغلطة بتعلّمنا، مش بتحكم علينا 🎀', 'خطوة صغيرة كل يوم بتفرق ✨', 'إنتِ أقوى من إمبارح 🌸', 'المراجعة المنتظمة بتثبّت المعلومة 💫', 'لو نسيتي حاجة، نراجعها تاني 🤍', 'برافو على إصرارك 🏅'];
  const HINTS = { s1k2p0: 'مين الأول: الضرب ولا الطرح؟', s1k2p1: 'ابدئي بالأقواس.', s1k2q0: 'القسمة قبل الجمع.', s1k2q1: 'القوى قبل الجمع.', s1k2q2: 'ابدئي بالأقواس، وبعدها الضرب.', s3k1p0: 'اعملي العكس: الطرح بيتحول لجمع.', s3k1p1: 'اقسمي الطرفين على الرقم اللي جنب x.', s3k1q0: 'اطرحي 8 من الطرفين.', s3k1q1: 'اطرحي 1 الأول، وبعدين اقسمي.', s3k1q2: 'اجمعي 10 للطرفين، وبعدين اقسمي على 5.' };
  const SIMPLE = { s1k2: 'تخيلي ترتيب الأولويات: الأقواس أهم حاجة، وبعدها القوى، وبعدها × و ÷، وآخر حاجة + و −.', s3k1: 'المعادلة زي الميزان: أي حاجة نعملها في كفة نعملها في الكفة التانية، لحد ما x يفضل لوحده.' };

  const POOL = [];
  Object.keys(CONTENT).forEach(sid => ['practice', 'quiz'].forEach(k => CONTENT[sid][k].forEach((q, i) => POOL.push({ id: sid + (k === 'quiz' ? 'q' : 'p') + i, sid, q }))));
  const byId = id => POOL.find(p => p.id === id);
  const stitle = sid => { const s = SECTIONS.find(x => sid.startsWith(x.id + 'k')); return s.skills[+sid.split('k')[1] - 1]; };
  const wrongFQ = id => { const f = rd('fq', {}), it = byId(id); return it && f[id] !== undefined && f[id] !== it.q.c; };

  function rec(it, i, right) {
    const d = today(), s = X.s[it.id] || { b: 0 };
    X.n++; if (right) X.ok++;
    X.t[d] = (X.t[d] || 0) + 1; if (X.days.indexOf(d) < 0) X.days.push(d);
    s.b = right ? Math.min(s.b + 1, 4) : 0; s.d = dn(d) + [1, 2, 4, 7, 14][s.b]; X.s[it.id] = s;
    if (!right) { X.m[it.id] = { ch: i, dt: d }; delete X.fix[it.id]; } else if (X.m[it.id] || wrongFQ(it.id)) X.fix[it.id] = 1;
    X.last = it.sid; save();
  }
  function sync() {
    const f = rd('fq', {}); let ch = false;
    Object.keys(f).forEach(id => { const it = byId(id); if (!it || X.seen[id] === f[id]) return; X.seen[id] = f[id]; rec(it, f[id], f[id] === it.q.c); ch = true; });
    if (ch) save();
  }
  function streak() {
    const set = new Set(X.days.map(dn)); let c = 0, d = dn(today());
    if (!set.has(d)) d--;
    while (set.has(d)) { c++; d--; }
    return c;
  }
  const due = () => { const d = dn(today()); return POOL.filter(p => X.s[p.id] && X.s[p.id].d <= d); };

  function qcard(it, o) {
    const d = document.createElement('div'); d.className = 'fq'; d.dataset.q = it.id; d.dataset.s = it.sid; d.dataset.c = it.q.c;
    d.innerHTML = `<p class="qt">${it.q.t}</p><div class="opts">${it.q.o.map((x, i) => `<button class="opt" data-i="${i}">${x}</button>`).join('')}</div><p class="fb" aria-live="polite"></p><div class="exp" hidden><b>ليه؟</b> ${it.q.w}</div>`;
    const paint = (i, right) => {
      d.dataset.done = 1;
      d.querySelectorAll('.opt').forEach((b, k) => {
        b.disabled = true;
        if (k === it.q.c) { b.classList.add('ok'); b.insertAdjacentHTML('afterbegin', '✓ '); }
        else if (k === i) { b.classList.add('no'); b.insertAdjacentHTML('afterbegin', '✗ '); }
        else b.classList.add('dim');
      });
      const f = d.querySelector('.fb');
      f.textContent = right ? 'برافو ' + nm() + '! إجابتك صحيحة 💗' : 'ولا يهمك ' + nm() + '، الغلطة بتعلّمنا 💗 الإجابة الصح معلّمة بـ ✓';
      f.className = 'fb ' + (right ? 'good' : 'bad');
      d.querySelector('.exp').hidden = false;
    };
    d.addEventListener('click', e => {
      const b = e.target.closest('.opt'); if (!b || d.dataset.done) return;
      const i = +b.dataset.i, right = i === it.q.c;
      paint(i, right); rm(d); if (o.on) o.on(i, right, d);
    });
    if (o.done !== undefined) paint(o.done, o.done === it.q.c);
    return d;
  }

  function dcard(it, D) {
    const retry = card => {
      if (card.dataset.done && D.r[it.id] !== it.q.c) {
        const r = document.createElement('button'); r.className = 'sm'; r.textContent = 'جرّبي تاني 🔄';
        r.onclick = () => { delete D.r[it.id]; save(); const n = dcard(it, D); card.replaceWith(n); rm(n); };
        card.appendChild(r);
      }
    };
    const c = qcard(it, {
      done: D.r[it.id],
      on: (i, right, card) => {
        D.r[it.id] = i;
        if (right && !D.s[it.id]) { D.s[it.id] = 1; X.st++; const e = g('stN'); if (e) e.textContent = X.st; card.querySelector('.fb').textContent += ' ⭐ +1'; }
        rec(it, i, right); save(); retry(card);
      }
    });
    retry(c);
    return c;
  }

  function renderReview(el) {
    const L = due().slice(0, 5);
    if (!L.length) { el.innerHTML = '<h3>🔁 مراجعة ذكية</h3><p>مفيش حاجة مستحقة للمراجعة دلوقتي 🌸 الأسئلة اللي بتجاوبي عليها بتظهر تاني بعد يوم، وبعدين بعد كام يوم، لحد ما تتثبت.</p>'; return; }
    el.innerHTML = `<h3>🔁 مراجعة ذكية</h3><p>${L.length} أسئلة جه وقت مراجعتها 💗</p>`;
    L.forEach(it => el.appendChild(qcard(it, { on: (i, right) => rec(it, i, right) })));
  }

  function renderDaily() {
    const v = g('daily'), t = today(), n = POOL.length, a = (dn(t) * 7) % n, b = (a + Math.floor(n / 2) + 1) % n;
    const items = a === b ? [POOL[a]] : [POOL[a], POOL[b]], D = X.dl[t] = X.dl[t] || { r: {}, s: {} };
    v.innerHTML = `<section class="card pink"><div class="bow">🎯</div><h2>تحدّي اليوم</h2><p>سؤالين بس من الأساسيات، وخمس دقايق كفاية 🌷</p><small>⭐ نجومك: <b id="stN">${X.st}</b></small></section><div id="dq"></div><section class="card" id="rv"></section>`;
    items.forEach(it => v.querySelector('#dq').appendChild(dcard(it, D)));
    renderReview(v.querySelector('#rv')); rm(v);
  }

  function renderNotebook() {
    const v = g('notebook'), f = rd('fq', {}), ids = {};
    Object.keys(X.m).forEach(k => ids[k] = X.m[k].ch);
    Object.keys(f).forEach(k => { const it = byId(k); if (it && f[k] !== it.q.c && ids[k] === undefined) ids[k] = f[k]; });
    const L = Object.keys(ids).map(k => ({ it: byId(k), ch: ids[k] })).filter(x => x.it);
    v.innerHTML = `<section class="card pink"><div class="bow">📒</div><h2>دفتر أخطائي</h2><p>${L.length ? 'هنا الأسئلة اللي محتاجة مراجعة. الغلطة خطوة للفهم 💗' : 'مفيش أخطاء لسه 🎀 أي سؤال محتاج مراجعة هيتسجل هنا.'}</p></section>` +
      L.map(x => `<section class="card" data-id="${x.it.id}"><span class="lv">${stitle(x.it.sid)}</span> ${X.fix[x.it.id] ? '<span class="lv">✅ اتصلحت</span>' : ''}<p class="qt">${x.it.q.t}</p><p class="bad">✗ إجابتك: ${x.it.q.o[x.ch]}</p><p class="good">✓ الصح: ${x.it.q.o[x.it.q.c]}</p><div class="exp"><b>سبب الخطأ:</b> ${x.it.q.w}</div><button class="sm" data-n="${x.it.id}">تدريب على سؤال مشابه</button><div class="sim"></div></section>`).join('');
    rm(v);
  }

  function goSkill(sid) {
    window.show('found');
    const b = document.createElement('button'); b.dataset.a = 'go'; b.dataset.id = sid;
    g('found').appendChild(b); b.click(); b.remove();
  }

  function dash() {
    const t = today(), fnd = rd('fnd', {}), mastered = Object.keys(fnd).filter(k => fnd[k] >= 2).length;
    const seen = new Set(Object.keys(X.s).map(k => k.replace(/[pq]\d+$/, ''))).size, nd = due().length, c = X.t[t] || 0;
    const el = document.createElement('section'); el.className = 'card dash';
    el.innerHTML = `<h3>🎀 مهمّتك النهارده</h3><p class="msg">${MSG[dn(t) % MSG.length]}</p>
<p>هدف اليوم: <b>${Math.min(c, GOAL)}</b> من ${GOAL} أسئلة ${c >= GOAL ? '🏅' : ''}</p><div class="bar"><i style="width:${Math.min(100, c / GOAL * 100)}%"></i></div>
<div class="tiles"><div class="tile"><b>${seen}</b><small>مهارات راجعتيها</small></div><div class="tile"><b>${mastered}</b><small>مهارات أتقنتيها</small></div><div class="tile"><b>🔥 ${streak()}</b><small>أيام متتالية</small></div></div>
${X.last ? `<button class="btn wide" data-x="last">كمّلي: ${stitle(X.last)} ⬅️</button>` : ''}
<button class="sm wide" data-x="daily">${nd ? '🔁 ' + nd + ' أسئلة جاهزة للمراجعة' : '🎯 تحدّي اليوم'}</button>`;
    const h = g('hub').querySelector('.hubcard'); if (h) h.after(el);
  }

  function help(card) {
    card.dataset.h = 1;
    const bx = document.createElement('div'); bx.className = 'hp';
    bx.innerHTML = '<button class="sm hb">🆘 مساعدة</button><div class="hm" hidden><button data-k="law">📏 فكّريني بالقانون</button><button data-k="easy">🧸 اشرحي بطريقة أبسط</button><button data-k="ex">🔁 وريني مثال مشابه</button><button data-k="hint">💡 تلميح من غير الإجابة</button><button data-k="where">🔍 أنا غلطت فين؟</button></div><div class="hx" hidden></div>';
    card.querySelector('.opts').after(bx);
  }

  document.addEventListener('click', e => {
    const hb = e.target.closest('.hb');
    if (hb) { const m = hb.parentNode.querySelector('.hm'); m.hidden = !m.hidden; return; }
    const k = e.target.closest('.hm [data-k]');
    if (k) {
      const card = k.closest('.fq'), sid = card.dataset.s, id = card.dataset.q, c = CONTENT[sid], it = byId(id), box = card.querySelector('.hx'), ex = c.examples[0];
      let h = '';
      if (k.dataset.k === 'law') h = c.explain;
      else if (k.dataset.k === 'easy') h = '<p>' + (SIMPLE[sid] || '') + '</p>' + (SIMPLE[sid] ? '' : c.explain);
      else if (k.dataset.k === 'ex') h = `<p><b>مثال:</b> ${ex.t}</p><ol>${ex.steps.map(s => '<li>' + s + '</li>').join('')}</ol>`;
      else if (k.dataset.k === 'hint') h = '<p>' + (HINTS[id] || 'اقري السؤال تاني وابدئي بأول خطوة في المثال.') + '</p>';
      else if (!card.dataset.done) h = '<p>جاوبي الأول وبعدها أوضحلك 💗</p>';
      else { const no = card.querySelector('.opt.no'); h = no ? `<p>اخترتي إجابة غلط، والصح هو الإجابة اللي جنبها ✓.</p><p>${it.q.w}</p>` : '<p>إجابتك كانت صح 🎉</p>'; }
      box.innerHTML = h; box.hidden = false; k.closest('.hm').hidden = true; rm(box);
    }
    const n = e.target.closest('[data-n]');
    if (n) {
      const id = n.dataset.n, it = byId(id), L = POOL.filter(p => p.sid === it.sid && p.id !== id), sim = L[(X.n + id.length) % L.length], box = n.parentNode.querySelector('.sim');
      box.innerHTML = ''; box.appendChild(qcard(sim, { on: (i, right) => { rec(sim, i, right); if (right) { X.fix[id] = 1; save(); } } })); rm(box);
    }
    const x = e.target.closest('[data-x]');
    if (x) { if (x.dataset.x === 'last') goSkill(X.last); else window.show('daily'); }
  });

  const st = document.createElement('style');
  st.textContent = `.fgrid{counter-reset:st;position:relative;grid-template-columns:1fr!important;padding-right:40px;gap:14px}
.fgrid::before{content:'';position:absolute;right:17px;top:14px;bottom:14px;border-right:3px dotted var(--p)}
.fsec{counter-increment:st;position:relative;text-align:right!important}
.fsec::before{content:counter(st);position:absolute;right:-41px;top:50%;margin-top:-16px;width:32px;height:32px;border-radius:50%;background:var(--btn);color:#fff;display:grid;place-items:center;font-weight:800;border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.2)}
.fsec:has([aria-valuenow="100"])::after{content:'🏅';position:absolute;left:12px;top:10px;font-size:1.4rem}
#hubbar button{font-size:.8rem;line-height:1.5;padding:6px 2px}#daily,#notebook{padding-bottom:96px}
.dash{text-align:right}.dash .msg{background:var(--s);border-radius:14px;padding:6px 12px;font-weight:700;color:var(--deep)}
.btn.wide,.sm.wide{display:block;width:100%;margin-top:10px}
.hp{margin:6px 0}.hm{display:grid;gap:6px;margin-top:6px}.hm button{font:inherit;text-align:right;border:1.5px solid var(--p);background:#fff;color:var(--ink);border-radius:14px;padding:6px 12px;min-height:44px;cursor:pointer}
.hx{background:#eaf2fb;border-radius:14px;padding:6px 14px;margin:8px 0}.sim{margin-top:8px}`;
  document.head.appendChild(st);

  ['daily', 'notebook'].forEach(id => { const m = document.createElement('main'); m.id = id; m.hidden = true; document.body.appendChild(m); });
  g('hubbar').innerHTML = [['hub', '🏠', 'الرئيسية'], ['found', '🌸', 'التأسيس'], ['daily', '🎯', 'التحدي'], ['notebook', '📒', 'دفتري']].map(t => `<button data-t="${t[0]}">${t[1]}<br>${t[2]}</button>`).join('');

  const _s = window.show, MINE = ['daily', 'notebook'];
  window.show = function (v) {
    if (MINE.indexOf(v) >= 0) {
      if (!name || !localStorage.getItem('cls')) return _s('hub');
      ['home', 'lessons', 'hub', 'found'].forEach(i => g(i).hidden = true);
      g('hubbar').hidden = false; g('coins').hidden = false;
      MINE.forEach(m => g(m).hidden = m !== v);
      g('hubbar').querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.t === v));
      LS.s('view', v); sync(); if (v === 'daily') renderDaily(); else renderNotebook();
      window.scrollTo(0, 0); return;
    }
    MINE.forEach(m => g(m).hidden = true); _s(v);
  };
  const _u = window.upd; window.upd = function () { _u(); sync(); };

  function tick() {
    document.querySelectorAll('.fq:not([data-h])').forEach(help);
    const q = g('found').querySelector('.fq[data-s]');
    if (q && X.last !== q.dataset.s) { X.last = q.dataset.s; save(); }
    if (!g('hub').hidden && !g('hub').querySelector('.dash')) dash();
  }
  new MutationObserver(tick).observe(document.body, { childList: true, subtree: true });
  sync(); tick();
  const lv = LS.g('view'); if (lv === 'daily' || lv === 'notebook') window.show(lv);
})();
    
