/* 🌸 أدوات مهارة الكسور: عرض الكسر (بسط فوق مقام)، الرسومات، وبطاقات الأسئلة
   الكسر بيتكتب بين {{ }} كده: 3/5 ، والعدد الكسري: 2~1/3 ، والضرب * ، والقسمة ÷ */
(function () {
  const AR = '٠١٢٣٤٥٦٧٨٩', dig = s => String(s).replace(/[0-9]/g, d => AR[d]);
  const fr = (n, d) => `<span class="fr"><span class="fn">${n}</span><span class="fd">${d}</span></span>`;
  const fx = e => e.replace(/\*/g, '×').replace(/-/g, '−').replace(/(\d+)~([\d▢]+)\/([\d▢]+)/g, (m, w, n, d) => `<b class="mx">${w}</b>${fr(n, d)}`).replace(/([\d▢]+)\/([\d▢]+)/g, (m, n, d) => fr(n, d));
  const fmt = s => dig(String(s).replace(/\{\{(.+?)\}\}/g, (m, e) => `<bdi class="ex" dir="ltr">${fx(e)}</bdi>`));
  const nn = s => String(s).replace(/[٠-٩]/g, d => AR.indexOf(d)).replace(/\D/g, '');
  const gcd = (a, b) => b ? gcd(b, a % b) : a;
  const shuf = (n, id) => {
    let h = 7; for (const c of id) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    const a = [...Array(n).keys()];
    for (let t = 0; t < 8; t++) { for (let i = n - 1; i > 0; i--) { h = (h * 1103515245 + 12345) >>> 0; const j = h % (i + 1); [a[i], a[j]] = [a[j], a[i]]; } if (a.some((x, i) => x !== i)) return a; }
    return a.reverse();
  };

  /* ---------- رسومات ---------- */
  const pie = (n, d, sz) => {
    let s = `<svg class="pie" viewBox="-50 -50 100 100" width="${sz || 96}" height="${sz || 96}" role="img" aria-label="رسم كسر">`;
    if (d === 1) s += `<circle r="46" class="${n ? 'on' : 'off'}"/>`;
    else for (let i = 0; i < d; i++) {
      const a = i / d * 2 * Math.PI - Math.PI / 2, b = (i + 1) / d * 2 * Math.PI - Math.PI / 2;
      s += `<path d="M0 0L${(46 * Math.cos(a)).toFixed(2)} ${(46 * Math.sin(a)).toFixed(2)}A46 46 0 ${d === 2 ? 0 : 0} 1 ${(46 * Math.cos(b)).toFixed(2)} ${(46 * Math.sin(b)).toFixed(2)}Z" class="${i < n ? 'on' : 'off'}"/>`;
    }
    return s + '</svg>';
  };
  const bars = (n, d, w) => {
    const k = Math.max(1, Math.ceil(n / d)); let s = '<span class="bars">';
    for (let j = 0; j < k; j++) {
      const f = Math.max(0, Math.min(d, n - j * d)); s += `<svg viewBox="0 0 120 26" width="${w || 150}" role="img" aria-label="شريط كسر">`;
      for (let i = 0; i < d; i++) s += `<rect x="${i * 120 / d + 1}" y="1" width="${120 / d - 2}" height="24" rx="3" class="${i < f ? 'on' : 'off'}"/>`;
      s += '</svg>';
    }
    return s + '</span>';
  };
  const fig = f => {
    if (f[0] === 'pie') return `<div class="fig">${pie(f[1], f[2])}<div>${fmt('{{' + f[1] + '/' + f[2] + '}}')}</div></div>`;
    if (f[0] === 'bars') return `<div class="fig">${bars(f[1], f[2])}<div>${fmt('{{' + f[1] + '/' + f[2] + '}}')}</div></div>`;
    if (f[0] === 'row') return '<div class="figrow">' + f.slice(1).map(x => `<div class="fig">${bars(x[0], x[1], 120)}<div>${fmt('{{' + x[0] + '/' + x[1] + '}}')}</div></div>`).join('') + '</div>';
    return '';
  };

  /* ---------- أنواع الأسئلة ---------- */
  const parseA = a => { const p = String(a).split(' '); let w = 0, n = 0, d = 1; if (p.length === 2) { w = +p[0]; [n, d] = p[1].split('/').map(Number); } else if (p[0].includes('/')) { [n, d] = p[0].split('/').map(Number); } else w = +p[0]; return [w * d + n, d]; };
  const paintBtns = (el, a, sel, right) => el.querySelectorAll(sel).forEach((b, k) => { b.disabled = true; if (right(k)) { b.classList.add('ok'); b.insertAdjacentHTML('afterbegin', '✓ '); } else if (k === a) { b.classList.add('no'); b.insertAdjacentHTML('afterbegin', '✗ '); } else b.classList.add('dim'); });
  const TY = {
    mcq: { tag: 'اختيار من متعدد', build: q => `<div class="opts">${q.o.map((o, i) => `<button class="opt" data-i="${i}">${fmt(o)}</button>`).join('')}</div>`, check: (q, a) => ({ r: a === q.c }), bind: (el, q, go) => el.querySelectorAll('.opt').forEach(b => b.onclick = () => go(+b.dataset.i)), paint: (el, q, a) => paintBtns(el, a, '.opt', k => k === q.c) },
    tf: { tag: 'صح أو خطأ', build: () => '<div class="opts"><button class="opt" data-i="1">✔️ صح</button><button class="opt" data-i="0">✖️ غلط</button></div>', check: (q, a) => ({ r: a === q.c }), bind: (el, q, go) => el.querySelectorAll('.opt').forEach(b => b.onclick = () => go(b.dataset.i === '1')), paint: (el, q, a) => paintBtns(el, a ? 1 : 0, '.opt', k => k === (q.c ? 1 : 0)) },
    num: {
      tag: 'اكتبي الناتج', build: () => '<div class="inrow"><input class="ans" dir="ltr" inputmode="numeric" autocomplete="off" placeholder="اكتبي العدد" aria-label="الإجابة"><button class="btn" data-ok type="button">تحقّقي ✔️</button></div>',
      check: (q, a) => ({ r: [].concat(q.a).map(String).includes(nn(a)) }), corr: q => fmt('{{' + [].concat(q.a)[0] + '}}'),
      bind(el, q, go) { const i = el.querySelector('.ans'), f = () => nn(i.value) ? go(i.value) : i.focus(); el.querySelector('[data-ok]').onclick = f; i.onkeydown = e => { if (e.key === 'Enter') f(); }; },
      paint(el, q, a, r) { const i = el.querySelector('.ans'); i.value = dig(a); i.disabled = true; i.classList.add(r ? 'ok' : 'no'); el.querySelector('[data-ok]').disabled = true; }
    },
    frac: {
      tag: 'اكتبي الكسر', corr: q => fmt('{{' + q.a.replace(' ', '~') + '}}'),
      build: () => '<div class="fin" dir="ltr"><input class="fw" inputmode="numeric" placeholder="صحيح" aria-label="العدد الصحيح (لو في)"><span class="fr fe"><input class="fnn" inputmode="numeric" placeholder="بسط" aria-label="البسط"><input class="fdd" inputmode="numeric" placeholder="مقام" aria-label="المقام"></span><button class="btn" data-ok type="button">تحقّقي ✔️</button></div><small>لو الناتج عدد صحيح اكتبيه في خانة «صحيح» بس.</small>',
      check(q, a) {
        const w = +a.w || 0, n = +a.n || 0, d = +a.d || (n ? 0 : 1); if (!d) return { r: false, why: 'المقام مش ممكن يبقى صفر.' };
        const [N, D] = parseA(q.a), val = (w * d + n) * D === N * d;
        if (!val) return { r: false };
        if (n && gcd(n, d) > 1) return { r: false, why: 'القيمة صح، لكن لازم تكتبي الكسر في أبسط صورة.' };
        if (q.form === 'improper' && w) return { r: false, why: 'المطلوب كسر غير فعلي (من غير عدد صحيح).' };
        if (q.form === 'mixed' && (!w || n >= d)) return { r: false, why: 'المطلوب عدد كسري: عدد صحيح وكسر فعلي.' };
        if (w && n >= d) return { r: false, why: 'الكسر جنب العدد الصحيح لازم يكون فعلي (البسط أصغر من المقام).' };
        return { r: true };
      },
      bind(el, q, go) { const g = c => el.querySelector(c), f = () => { const a = { w: nn(g('.fw').value), n: nn(g('.fnn').value), d: nn(g('.fdd').value) }; if (!a.w && !a.n && !a.d) g('.fw').focus(); else go(a); }; g('[data-ok]').onclick = f; el.querySelectorAll('.fin input').forEach(i => i.onkeydown = e => { if (e.key === 'Enter') f(); }); },
      paint(el, q, a, r) { const v = { '.fw': a.w, '.fnn': a.n, '.fdd': a.d }; for (const k in v) { const i = el.querySelector(k); i.value = dig(v[k] || ''); i.disabled = true; i.classList.add(r ? 'ok' : 'no'); } el.querySelector('[data-ok]').disabled = true; }
    },
    order: {
      tag: 'رتّبي', corr: q => q.items.map(t => fmt('{{' + t + '}}')).join(' ، '),
      build: q => { const p = shuf(q.items.length, q.id); return `<div class="ord nums"><div class="slot" aria-live="polite"></div><div class="pool">${p.map(k => `<button class="chip2" data-k="${k}">${fmt('{{' + q.items[k] + '}}')}</button>`).join('')}</div><div class="inrow"><button class="sm" data-reset type="button">↩️ مسح</button><button class="btn" data-ok type="button" disabled>تحقّقي ✔️</button></div></div>`; },
      check: (q, a) => ({ r: a.every((x, i) => x === i) }),
      bind(el, q, go) {
        let ch = []; const slot = el.querySelector('.slot'), ok = el.querySelector('[data-ok]');
        const draw = () => { slot.innerHTML = ch.length ? ch.map(k => `<span class="pick">${fmt('{{' + q.items[k] + '}}')}</span>`).join('') : '<em>اضغطي على الكسور بالترتيب المطلوب 👇</em>'; ok.disabled = ch.length < q.items.length; };
        el.querySelectorAll('.chip2').forEach(b => b.onclick = () => { ch.push(+b.dataset.k); b.hidden = true; draw(); });
        el.querySelector('[data-reset]').onclick = () => { ch = []; el.querySelectorAll('.chip2').forEach(b => b.hidden = false); draw(); };
        ok.onclick = () => go(ch.slice()); draw();
      },
      paint(el, q, a) { el.querySelector('.pool').hidden = true; el.querySelector('.inrow').hidden = true; el.querySelector('.slot').innerHTML = a.map((k, i) => `<span class="pick ${k === i ? 'ok' : 'no'}">${fmt('{{' + q.items[k] + '}}')}</span>`).join(''); }
    },
    match: {
      tag: 'وصّلي', build: q => { const p = shuf(q.pairs.length, q.id + 'm'); return `<div class="mt"><div>${q.pairs.map((x, i) => `<button class="opt" data-l="${i}">${fmt(x[0])}</button>`).join('')}</div><div>${p.map(j => `<button class="opt" data-r="${j}">${fmt(q.pairs[j][1])}</button>`).join('')}</div></div>`; },
      check: (q, a) => ({ r: a === 0 }),
      bind(el, q, go) {
        let sel = null, wr = 0, n = 0;
        el.querySelectorAll('[data-l]').forEach(b => b.onclick = () => { el.querySelectorAll('[data-l]').forEach(x => x.classList.remove('sel')); sel = +b.dataset.l; b.classList.add('sel'); });
        el.querySelectorAll('[data-r]').forEach(b => b.onclick = () => {
          if (sel === null) return; const l = el.querySelector(`[data-l="${sel}"]`);
          if (+b.dataset.r === sel) { [l, b].forEach(x => { x.classList.remove('sel'); x.classList.add('ok'); x.disabled = true; }); sel = null; if (++n === q.pairs.length) go(wr); } else { wr++; b.classList.add('no'); setTimeout(() => b.classList.remove('no'), 700); }
        });
      },
      paint(el) { el.querySelectorAll('.mt .opt').forEach(b => { b.disabled = true; b.classList.add('ok'); b.classList.remove('sel'); }); }
    }
  };

  function qcard(q, st, o) {
    o = o || {}; const T = TY[q.type], el = document.createElement('div'); el.className = 'fq'; el.dataset.id = q.id;
    const hint = q.h && !o.nohint;
    el.innerHTML = `${o.head ? `<div class="qh">${o.head}</div>` : ''}<span class="qtag">${q.kind || T.tag}</span><p class="qt">${fmt(q.t)}</p>${q.fig ? fig(q.fig) : ''}${hint ? `<button class="sm" data-hint type="button">💡 تلميح</button><p class="hint" hidden>${fmt(q.h)}</p>` : ''}${T.build(q)}<p class="fb" aria-live="polite"></p><div class="exp" hidden><b>ليه؟</b> ${fmt(q.w)}</div>`;
    const nm = o.nm || 'يا بطلة';
    if (hint) el.querySelector('[data-hint]').onclick = () => { el.querySelector('.hint').hidden = false; };
    const show = (a, r, why) => {
      el.dataset.done = 1; T.paint(el, q, a, r); const f = el.querySelector('.fb');
      f.innerHTML = r ? 'برافو ' + nm + '! إجابتك صحيحة 💗' : 'ولا يهمك ' + nm + '، كل غلطة بتعلمنا 💗' + (why ? '<br>' + why : '') + (T.corr ? '<br>الإجابة الصحيحة: ' + T.corr(q) : ' الإجابة الصحيحة معلّمة بـ ✓ وباللون الأخضر.');
      f.className = 'fb ' + (r ? 'good' : 'bad'); el.querySelector('.exp').hidden = false;
      const h = el.querySelector('[data-hint]'); if (h) h.hidden = true;
    };
    T.bind(el, q, a => { if (el.dataset.done) return; const c = T.check(q, a); show(a, c.r, c.why); if (o.onAnswer) o.onAnswer(a, c.r, c.why); });
    if (st) show(st.a, st.r, st.why);
    return el;
  }

  const css = document.createElement('style');
  css.textContent = `#found ol{list-style-type:arabic-indic}.ex{font-weight:800;color:var(--deep);unicode-bidi:isolate}.opt .ex,.chip2 .ex{color:inherit}
.fr{display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;margin:0 4px;line-height:1.3;font-size:.95em}.fr .fn{border-bottom:2px solid currentColor;padding:0 5px}.fr .fd{padding:0 5px}.mx{font-size:1.15em;margin-left:3px}
.fin{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin:10px 0}.fin input{font:inherit;font-size:1.15rem;font-weight:800;text-align:center;border:2px solid var(--p);border-radius:12px;padding:6px 4px;min-height:46px;width:78px;background:#fff;color:var(--ink)}.fin .fw{width:84px}.fin .fe{gap:4px;margin:0}.fin .fnn{border-radius:12px 12px 0 0}.fin .fdd{border-radius:0 0 12px 12px}.fin input.ok{background:#dff3e4;border-color:#2e8b57}.fin input.no{background:#fde0e6;border-color:#c0392b}.fin .btn{margin:0;padding:8px 20px;font-size:1rem}
.pie .on{fill:var(--btn);stroke:#fff;stroke-width:2}.pie .off{fill:var(--s);stroke:#fff;stroke-width:2}.bars{display:inline-flex;flex-direction:column;gap:4px}.bars .on{fill:var(--btn)}.bars .off{fill:var(--s)}
.fig{display:inline-block;text-align:center;margin:6px 10px;font-size:1.2rem}.figrow{direction:ltr;display:flex;flex-wrap:wrap;justify-content:center;gap:4px;align-items:flex-end}
.fq{background:#fff;border:1px solid var(--s);border-radius:18px;padding:14px;margin:14px 0}.qh{font-weight:800;color:var(--deep);font-size:.9rem}.qtag{display:inline-block;background:var(--s);color:var(--deep);border-radius:12px;padding:0 12px;font-size:.8rem;font-weight:700;margin:2px 0}
.inrow{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin:10px 0}.ans{flex:1;min-width:120px;font:inherit;font-size:1.2rem;font-weight:800;text-align:center;padding:8px 12px;border:2px solid var(--p);border-radius:16px;min-height:50px}.ans.ok{background:#dff3e4;border-color:#2e8b57}.ans.no{background:#fde0e6;border-color:#c0392b}.inrow .btn{margin:0;padding:8px 20px;font-size:1rem}.opt.sel{background:#fff3d6;border-color:#e0a526}
.ord .slot{min-height:56px;background:#fff8f2;border:2px dashed var(--p);border-radius:16px;padding:8px;display:flex;flex-wrap:wrap;gap:8px;direction:ltr;justify-content:center;align-items:center}.ord .slot em{opacity:.7;direction:rtl}.pick{background:var(--s);border-radius:12px;padding:4px 12px;font-weight:700}.pick.ok{background:#dff3e4}.pick.no{background:#fde0e6}
.pool{display:flex;flex-wrap:wrap;gap:8px;margin:10px 0;direction:ltr;justify-content:center}.chip2{font:inherit;font-weight:700;border:2px solid var(--p);background:#fff;color:var(--ink);border-radius:14px;padding:6px 14px;min-height:50px;cursor:pointer}
.mt{display:grid;grid-template-columns:1fr 1fr;gap:12px}.mt>div{display:grid;gap:10px;align-content:start}.mt .opt{width:100%}`;
  document.head.appendChild(css);
  window.FR = { dig, fmt, fr, pie, bars, fig, gcd, qcard, TY };
})();
