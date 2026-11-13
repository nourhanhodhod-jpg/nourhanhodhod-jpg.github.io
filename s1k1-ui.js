/* 🌸 أدوات مهارة الأعداد الموجبة والسالبة: الأرقام العربية، خط الأعداد، وبطاقات الأسئلة
   مش محتاجة تعدّلي فيه حاجة. */
(function () {
  const AR = '٠١٢٣٤٥٦٧٨٩';
  const dig = s => String(s).replace(/[0-9]/g, d => AR[d]);
  const fmt = s => dig(String(s).replace(/\{\{(.+?)\}\}/g, (m, e) => '<bdi class="ex" dir="ltr">' + e.replace(/-/g, '−').replace(/\*/g, '×').replace(/\//g, '÷') + '</bdi>'));
  const norm = s => String(s).replace(/[٠-٩]/g, d => AR.indexOf(d)).replace(/[−–—‒]/g, '-').replace(/[\s+()‎‏]/g, '');
  const sgn = v => dig(v < 0 ? '−' + (-v) : v);
  const shuf = (n, id) => {
    let h = 7; for (const c of id) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    const a = [...Array(n).keys()];
    for (let t = 0; t < 8; t++) {
      for (let i = n - 1; i > 0; i--) { h = (h * 1103515245 + 12345) >>> 0; const j = h % (i + 1); [a[i], a[j]] = [a[j], a[i]]; }
      if (a.some((x, i) => x !== i)) return a;
    }
    return a.reverse();
  };

  /* ---------- خط الأعداد ---------- */
  const X = (o, v) => 26 + (v - o.min) * (o.step || 44);
  function nl(o) {
    const st = o.step || 44, W = (o.max - o.min) * st + 52, y = 50, x0 = X(o, 0);
    let s = `<svg class="nl" id="${o.id || ''}" viewBox="0 0 ${W} 104" aria-label="خط الأعداد"><rect x="0" y="14" width="${x0}" height="72" rx="14" class="zn"/><rect x="${x0}" y="14" width="${W - x0}" height="72" rx="14" class="zp"/><line x1="6" y1="${y}" x2="${W - 6}" y2="${y}" class="ax"/><path d="M6 ${y}l10-6v12zM${W - 6} ${y}l-10-6v12z" class="ar"/>`;
    for (let v = o.min; v <= o.max; v++) {
      const x = X(o, v);
      s += `<line x1="${x}" x2="${x}" y1="${y - 9}" y2="${y + 9}" class="tk${v === 0 ? ' z' : ''}"/>${v % (o.every || 1) === 0 ? `<text x="${x}" y="${y + 38}" class="lb ${v < 0 ? 'n' : v > 0 ? 'p' : 'z'}">${sgn(v)}</text>` : ''}`;
    }
    (o.marks || []).forEach(m => { s += `<circle cx="${X(o, m.v)}" cy="${y}" r="11" class="mk ${m.cls || ''}"/>`; });
    if (o.arc) { const a = X(o, o.arc.from), b = X(o, o.arc.to); s += `<path d="M${a} ${y - 14}Q${(a + b) / 2} ${y - 70} ${b} ${y - 14}" class="arc"/>`; }
    if (o.dot !== undefined) s += `<g class="dg" style="transform:translateX(${X(o, o.dot)}px)"><circle cx="0" cy="${y}" r="13" class="dt"/></g>`;
    if (o.click) for (let v = o.min; v <= o.max; v++) s += `<circle class="hit" data-v="${v}" cx="${X(o, v)}" cy="${y}" r="20" role="button" aria-label="${sgn(v)}"/>`;
    return s + '</svg>';
  }

  /* ---------- أنواع الأسئلة ---------- */
  const btnPaint = (el, q, a, sel, right) => el.querySelectorAll(sel).forEach((b, k) => {
    b.disabled = true;
    if (right(k)) { b.classList.add('ok'); b.insertAdjacentHTML('afterbegin', '✓ '); }
    else if (k === a) { b.classList.add('no'); b.insertAdjacentHTML('afterbegin', '✗ '); }
    else b.classList.add('dim');
  });
  const inputType = (tag, ph) => ({
    tag,
    build: () => `<div class="inrow"><input class="ans" dir="ltr" autocomplete="off" inputmode="text" placeholder="${ph}" aria-label="${ph}"><button class="sm" data-neg type="button" aria-label="تبديل الإشارة">± إشارة</button><button class="btn" data-ok type="button">تحقّقي ✔️</button></div>`,
    check: (q, a) => [].concat(q.a).map(norm).includes(norm(a)),
    corr: q => fmt('{{' + [].concat(q.a)[0] + '}}'),
    bind(el, q, go) {
      const i = el.querySelector('.ans');
      el.querySelector('[data-neg]').onclick = () => { i.value = i.value.trim().startsWith('-') ? i.value.trim().slice(1) : '-' + i.value.trim(); i.focus(); };
      const f = () => { if (norm(i.value)) go(i.value); else i.focus(); };
      el.querySelector('[data-ok]').onclick = f; i.onkeydown = e => { if (e.key === 'Enter') f(); };
    },
    paint(el, q, a, r) { const i = el.querySelector('.ans'); i.value = dig(a); i.disabled = true; i.classList.add(r ? 'ok' : 'no'); el.querySelectorAll('.inrow button').forEach(b => b.disabled = true); }
  });
  const TYPES = {
    mcq: {
      tag: 'اختيار من متعدد',
      build: q => `<div class="opts">${q.o.map((o, i) => `<button class="opt" data-i="${i}">${fmt(o)}</button>`).join('')}</div>`,
      check: (q, a) => a === q.c,
      bind: (el, q, go) => el.querySelectorAll('.opt').forEach(b => b.onclick = () => go(+b.dataset.i)),
      paint: (el, q, a) => btnPaint(el, q, a, '.opt', k => k === q.c)
    },
    tf: {
      tag: 'صح أو خطأ',
      build: () => '<div class="opts"><button class="opt" data-i="1">✔️ صح</button><button class="opt" data-i="0">✖️ غلط</button></div>',
      check: (q, a) => a === q.c,
      bind: (el, q, go) => el.querySelectorAll('.opt').forEach(b => b.onclick = () => go(b.dataset.i === '1')),
      paint: (el, q, a) => btnPaint(el, q, a ? 1 : 0, '.opt', k => k === (q.c ? 1 : 0))
    },
    input: inputType('اكتبي الناتج', 'اكتبي الناتج'),
    fill: inputType('أكملي العدد الناقص', 'العدد الناقص'),
    order: {
      tag: 'رتّبي',
      build: q => { const p = shuf(q.items.length, q.id); return `<div class="ord${q.nums ? ' nums' : ''}"><div class="slot" aria-live="polite"></div><div class="pool">${p.map(k => `<button class="chip2" data-k="${k}">${fmt(q.items[k])}</button>`).join('')}</div><div class="inrow"><button class="sm" data-reset type="button">↩️ مسح</button><button class="btn" data-ok type="button" disabled>تحقّقي ✔️</button></div></div>`; },
      check: (q, a) => a.every((x, i) => x === i),
      corr: q => q.items.map((t, i) => dig(i + 1) + '- ' + fmt(t)).join('<br>'),
      bind(el, q, go) {
        let ch = []; const slot = el.querySelector('.slot'), ok = el.querySelector('[data-ok]');
        const draw = () => { slot.innerHTML = ch.length ? ch.map((k, i) => `<span class="pick">${dig(i + 1)}- ${fmt(q.items[k])}</span>`).join('') : '<em>اضغطي على العناصر بالترتيب الصحيح 👇</em>'; ok.disabled = ch.length < q.items.length; };
        el.querySelectorAll('.chip2').forEach(b => b.onclick = () => { ch.push(+b.dataset.k); b.hidden = true; draw(); });
        el.querySelector('[data-reset]').onclick = () => { ch = []; el.querySelectorAll('.chip2').forEach(b => b.hidden = false); draw(); };
        ok.onclick = () => go(ch.slice()); draw();
      },
      paint(el, q, a, r) {
        el.querySelector('.pool').hidden = true; el.querySelector('.inrow').hidden = true;
        el.querySelector('.slot').innerHTML = a.map((k, i) => `<span class="pick ${k === i ? 'ok' : 'no'}">${dig(i + 1)}- ${fmt(q.items[k])}</span>`).join('');
      }
    },
    match: {
      tag: 'وصّلي',
      build: q => { const p = shuf(q.pairs.length, q.id + 'm'); return `<div class="mt"><div>${q.pairs.map((x, i) => `<button class="opt" data-l="${i}">${fmt(x[0])}</button>`).join('')}</div><div>${p.map(j => `<button class="opt" data-r="${j}">${fmt(q.pairs[j][1])}</button>`).join('')}</div></div>`; },
      check: (q, a) => a === 0,
      bind(el, q, go) {
        let sel = null, wr = 0, n = 0;
        el.querySelectorAll('[data-l]').forEach(b => b.onclick = () => { el.querySelectorAll('[data-l]').forEach(x => x.classList.remove('sel')); sel = +b.dataset.l; b.classList.add('sel'); });
        el.querySelectorAll('[data-r]').forEach(b => b.onclick = () => {
          if (sel === null) return;
          const l = el.querySelector(`[data-l="${sel}"]`);
          if (+b.dataset.r === sel) { [l, b].forEach(x => { x.classList.remove('sel'); x.classList.add('ok'); x.disabled = true; }); sel = null; if (++n === q.pairs.length) go(wr); }
          else { wr++; b.classList.add('no'); setTimeout(() => b.classList.remove('no'), 700); }
        });
      },
      paint(el, q, a) { el.querySelectorAll('.mt .opt').forEach(b => { b.disabled = true; b.classList.add('ok'); b.classList.remove('sel'); }); }
    }
  };

  /* بطاقة سؤال: st = إجابة محفوظة (لو موجودة)، o.onAnswer(a, r) بيتنادى مرة واحدة */
  function qcard(q, st, o) {
    o = o || {}; const T = TYPES[q.type], el = document.createElement('div');
    el.className = 'fq'; el.dataset.id = q.id;
    el.innerHTML = `${o.head ? `<div class="qh">${o.head}</div>` : ''}<span class="qtag">${q.kind || T.tag}</span><p class="qt">${fmt(q.t)}</p>${T.build(q)}<p class="fb" aria-live="polite"></p><div class="exp" hidden><b>ليه؟</b> ${fmt(q.w)}</div>`;
    const nm = o.nm || 'يا بطلة';
    const show = (a, r) => {
      el.dataset.done = 1; T.paint(el, q, a, r);
      const f = el.querySelector('.fb');
      f.innerHTML = r ? 'برافو ' + nm + '! إجابتك صحيحة 💗' : 'ولا يهمك ' + nm + '، كل غلطة بتعلمنا 💗' + (T.corr ? '<br>الإجابة الصحيحة: ' + T.corr(q) : ' الإجابة الصحيحة معلّمة بـ ✓ وباللون الأخضر.');
      f.className = 'fb ' + (r ? 'good' : 'bad'); el.querySelector('.exp').hidden = false;
    };
    T.bind(el, q, a => { if (el.dataset.done) return; const r = T.check(q, a); show(a, r); if (o.onAnswer) o.onAnswer(a, r); });
    if (st) show(st.a, st.r);
    return el;
  }

  const css = document.createElement('style');
  css.textContent = `.ex{font-weight:800;color:var(--deep);unicode-bidi:isolate}.opt .ex{color:inherit}
.nl{width:100%;height:auto;display:block;direction:ltr;margin:6px 0;touch-action:manipulation}.nl .zn{fill:#e9f1fb}.nl .zp{fill:var(--s)}.nl .ax{stroke:var(--deep);stroke-width:3}.nl .ar{fill:var(--deep)}.nl .tk{stroke:var(--deep);stroke-width:2}.nl .tk.z{stroke-width:4}
.nl .lb{font:700 28px Cairo,sans-serif;text-anchor:middle;fill:var(--ink)}.nl .lb.n{fill:#3f6aa0}.nl .lb.p{fill:var(--deep)}.nl .lb.z{font-size:32px}
.nl .mk{fill:var(--btn);stroke:#fff;stroke-width:3}.nl .mk.ok{fill:#2e8b57}.nl .mk.no{fill:#c0392b}.nl .mk.sel{fill:#e0a526}.nl .hit{fill:transparent;cursor:pointer}.nl .hit:hover{fill:rgba(179,86,127,.15)}
.nl .dg{transition:transform .8s ease}.nl .dt{fill:var(--btn);stroke:#fff;stroke-width:3}.nl .arc{fill:none;stroke:var(--btn);stroke-width:4;stroke-dasharray:8 6}
.fq{background:#fff;border:1px solid var(--s);border-radius:18px;padding:14px;margin:14px 0}.qh{font-weight:800;color:var(--deep);font-size:.9rem}.qtag{display:inline-block;background:var(--s);color:var(--deep);border-radius:12px;padding:0 12px;font-size:.8rem;font-weight:700;margin:2px 0}
.inrow{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin:10px 0}.ans{flex:1;min-width:120px;font:inherit;font-size:1.2rem;font-weight:800;text-align:center;padding:8px 12px;border:2px solid var(--p);border-radius:16px;min-height:50px}.ans.ok{background:#dff3e4;border-color:#2e8b57}.ans.no{background:#fde0e6;border-color:#c0392b}
.inrow .btn{margin:0;padding:8px 20px;font-size:1rem}.opt.sel{background:#fff3d6;border-color:#e0a526}
.ord .slot{min-height:56px;background:#fff8f2;border:2px dashed var(--p);border-radius:16px;padding:8px;display:flex;flex-direction:column;gap:6px}.ord.nums .slot{flex-direction:row;flex-wrap:wrap;direction:ltr;justify-content:center}.ord .slot em{opacity:.7}
.pick{background:var(--s);border-radius:12px;padding:4px 12px;font-weight:700}.pick.ok{background:#dff3e4}.pick.no{background:#fde0e6}
.pool{display:flex;flex-wrap:wrap;gap:8px;margin:10px 0}.ord.nums .pool{direction:ltr;justify-content:center}.chip2{font:inherit;font-weight:700;border:2px solid var(--p);background:#fff;color:var(--ink);border-radius:14px;padding:6px 14px;min-height:46px;cursor:pointer;text-align:right}
.mt{display:grid;grid-template-columns:1fr 1fr;gap:12px}.mt>div{display:grid;gap:10px;align-content:start}.mt .opt{width:100%}`;
  document.head.appendChild(css);

  window.S1K = { dig, fmt, norm, sgn, nl, X, qcard, shuf };
})();
      
