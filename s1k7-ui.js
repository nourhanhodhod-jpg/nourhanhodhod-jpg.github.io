/* 🌸 أدوات مهارة النسبة والتناسب (بتعتمد على s1k5-ui.js اللي فيه نظام الأس والكسور الحرفية ونوع الأسئلة int5)
   كتابة النسبة بين {{ }} :  {{2 : 3}}  ، الكسر الحرفي ⟦البسط|المقام⟧ مثل {{⟦3|4⟧ = ⟦س|8⟧}} ، الأعداد لاتيني وبتتحول لعربي. */
(function () {
  const { dig, fmt } = FR, gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  const F = s => AL.F(s), digs = s => String(s).replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));

  /* ---------- نوع سؤال: اكتبي النسبة في أبسط صورة (▢ : ▢) ---------- */
  FR.TY.ratio = {
    tag: 'اكتبي النسبة',
    build: () => '<div class="pf" dir="ltr"><input class="pcf ra" inputmode="numeric" autocomplete="off" aria-label="الحد الأول"><span class="pl2">:</span><input class="pcf rb2" inputmode="numeric" autocomplete="off" aria-label="الحد الثاني"></div><div class="inrow"><button class="btn" data-ok type="button">تحقّقي ✔️</button></div><small>اكتبي النسبة في أبسط صورة.</small>',
    check: (q, a) => ({ r: +a[0] === q.a[0] && +a[1] === q.a[1] }),
    corr: q => F(q.a[0] + ' : ' + q.a[1]),
    bind(el, q, go) {
      const ins = [...el.querySelectorAll('.pcf')];
      const f = () => { const v = ins.map(i => digs(i.value).trim()); const bad = v.findIndex(x => !/^\d+$/.test(x)); if (bad >= 0) ins[bad].focus(); else go(v.map(Number)); };
      ins.forEach(i => i.onkeydown = e => { if (e.key === 'Enter') f(); }); el.querySelector('[data-ok]').onclick = f;
    },
    paint(el, q, a) { el.querySelectorAll('.pcf').forEach((i, k) => { i.value = dig(String(a[k])); i.disabled = true; i.classList.add(+a[k] === q.a[k] ? 'ok' : 'no'); }); el.querySelector('[data-ok]').disabled = true; }
  };

  /* ---------- نوع سؤال: اكتبي العوامل الأولية (بينهم مسافة) ---------- */
  FR.TY.fac = {
    tag: 'حلّلي العدد',
    build: () => '<div class="inrow"><input class="ans" dir="ltr" inputmode="numeric" autocomplete="off" placeholder="مثال: ٢ ٢ ٣" aria-label="العوامل الأولية"><button class="btn" data-ok type="button">تحقّقي ✔️</button></div><small>اكتبي العوامل الأولية وبينها مسافة (مثلًا ٢ ٢ ٣). مش لازم الترتيب.</small>',
    check: (q, a) => ({ r: JSON.stringify(a.slice().sort((x, y) => x - y)) === JSON.stringify(q.a) }),
    corr: q => F(q.a.join(' × ')),
    bind(el, q, go) {
      const i = el.querySelector('.ans'), f = () => { const m = digs(i.value).match(/\d+/g); m ? go(m.map(Number)) : i.focus(); };
      el.querySelector('[data-ok]').onclick = f; i.onkeydown = e => { if (e.key === 'Enter') f(); };
    },
    paint(el, q, a, r) { const i = el.querySelector('.ans'); i.value = a.map(dig).join(' × '); i.disabled = true; i.classList.add(r ? 'ok' : 'no'); el.querySelector('[data-ok]').disabled = true; }
  };

  const mk = sec => { const w = document.createElement('div'); w.className = 'wd'; sec.appendChild(w); return w; };

  /* ---------- أداة: شجرة العوامل ---------- */
  function tree(sec, [n]) {
    const w = mk(sec); let fs = [n]; const P = [2, 3, 5, 7, 11, 13], isP = x => { if (x < 2) return false; for (let d = 2; d * d <= x; d++) if (x % d === 0) return false; return true; };
    const draw = () => {
      const done = fs.every(isP);
      w.innerHTML = `<b>🌳 حلّلي ${F(n)} لعوامله الأولية</b><p>اضغطي على عدد أولي يقسم أحد العوامل:</p><div class="sqg">${P.filter(p => fs.some(f => !isP(f) && f % p === 0)).map(p => `<button class="sm" data-p="${p}">${F('÷ ' + p)}</button>`).join('')}${fs.length > 1 ? '<button class="sm" data-r>🔄 من الأول</button>' : ''}</div><p class="chain">${F(n + ' = ' + fs.join(' × '))}</p>${done ? `<p class="fb good">✅ كلهم أوليين! تحققي بالضرب: ${F(fs.join(' × ') + ' = ' + n)}</p>` : '<p>لسه فيه عامل مش أولي، كمّلي التحليل 👆</p>'}`;
      w.querySelectorAll('[data-p]').forEach(b => b.onclick = () => { const p = +b.dataset.p, i = fs.findIndex(f => !isP(f) && f % p === 0); fs.splice(i, 1, p, fs[i] / p); draw(); });
      const r = w.querySelector('[data-r]'); if (r) r.onclick = () => { fs = [n]; draw(); };
    };
    draw();
  }

  /* ---------- أداة: تبسيط النسبة بالقسمة على عامل مشترك ---------- */
  function simp2(sec, [a, b]) {
    const w = mk(sec); let x = a, y = b;
    const draw = () => {
      const g = gcd(x, y), ds = []; for (let d = 2; d <= g; d++) if (g % d === 0) ds.push(d);
      w.innerHTML = `<b>✂️ بسّطي النسبة</b><p class="chain">${F(x + ' : ' + y)}</p>${g === 1 ? `<p class="fb good">✅ مفيش عامل مشترك تاني، النسبة في أبسط صورة (${F(x + ' : ' + y)}).</p>` : `<p>اقسمي الطرفين على عامل مشترك:</p><div class="sqg">${ds.map(d => `<button class="sm" data-d="${d}">${F('÷ ' + d)}</button>`).join('')}</div>`}${x !== a ? '<button class="sm" data-r>🔄 من الأول</button>' : ''}`;
      w.querySelectorAll('[data-d]').forEach(bn => bn.onclick = () => { const d = +bn.dataset.d; x /= d; y /= d; draw(); });
      const r = w.querySelector('[data-r]'); if (r) r.onclick = () => { x = a; y = b; draw(); };
    };
    draw();
  }

  /* ---------- أداة: الطرفان والوسطان وحاصل الضرب ---------- */
  function means(sec, [a, b, c, d]) {
    const w = mk(sec); let m = '';
    const draw = () => {
      w.innerHTML = `<b>🎯 في التناسب ${F('⟦' + a + '|' + b + '⟧ = ⟦' + c + '|' + d + '⟧')}</b><div class="sqg"><button class="sm${m === 'e' ? ' on' : ''}" data-m="e">الطرفان</button><button class="sm${m === 'm' ? ' on' : ''}" data-m="m">الوسطان</button></div>${m === 'e' ? `<p class="chain">الطرفان: ${F(a)} و${F(d)}<br>${F(a + ' × ' + d + ' = ' + a * d)}</p>` : m === 'm' ? `<p class="chain">الوسطان: ${F(b)} و${F(c)}<br>${F(b + ' × ' + c + ' = ' + b * c)}</p>` : '<p>اضغطي على الطرفين أو الوسطين…</p>'}${a * d === b * c ? '<p class="fb good">لاحظي إن حاصل ضرب الطرفين = حاصل ضرب الوسطين ✨</p>' : ''}`;
      w.querySelectorAll('[data-m]').forEach(bn => bn.onclick = () => { m = bn.dataset.m; draw(); });
    };
    draw();
  }

  /* ---------- أداة: تقسيم كمية بنسبة (شريط) ---------- */
  function share(sec, [total, a, b]) {
    const w = mk(sec); let st = 0; const parts = a + b, unit = total / parts;
    const draw = () => {
      w.innerHTML = `<b>🍰 قسّمي ${F(total)} بنسبة ${F(a + ' : ' + b)}</b><div class="shb" dir="ltr">${Array.from({ length: parts }, (_, i) => `<i class="${i < a ? 'sa' : 'sb'}">${st >= 2 ? F(unit) : ''}</i>`).join('')}</div>${st >= 1 ? `<p class="chain">مجموع الأجزاء: ${F(a + ' + ' + b + ' = ' + parts)}</p>` : ''}${st >= 2 ? `<p class="chain">قيمة الجزء: ${F(total + ' ÷ ' + parts + ' = ' + unit)}</p>` : ''}${st >= 3 ? `<p class="fb good">${F(a + ' × ' + unit + ' = ' + a * unit)} و${F(b + ' × ' + unit + ' = ' + b * unit)}</p>` : ''}${st < 3 ? `<button class="btn sm2" data-n>${['اجمعي أجزاء النسبة ➕', 'احسبي قيمة الجزء الواحد ➗', 'احسبي نصيب كل واحد ✖️'][st]}</button>` : ''}`;
      const n = w.querySelector('[data-n]'); if (n) n.onclick = () => { st++; draw(); };
    };
    draw();
  }

  /* ---------- أداة: طردي ولا عكسي؟ ---------- */
  function rel(sec) {
    const w = mk(sec); let n = 2; const NS = [1, 2, 3, 4, 6, 8, 12];
    const draw = () => {
      w.innerHTML = `<b>🔀 قارني الطردي بالعكسي</b><p>اختاري عدد (الكراسات / العمال):</p><div class="sqg">${NS.map(k => `<button class="sm${k === n ? ' on' : ''}" data-k="${k}">${dig(k)}</button>`).join('')}</div>
<div class="cmp2"><div><h4>📒 طردي</h4><p>الكراس بـ ${dig(5)} جنيه</p><p class="chain">${F(n + ' × 5 = ' + n * 5)} جنيه</p><p>كل ما العدد يزيد، الثمن يزيد (النسبة ثابتة).</p></div><div><h4>👷 عكسي</h4><p>شغل يخلصه عامل واحد في ${dig(24)} يوم</p><p class="chain">${F('24 ÷ ' + n + ' = ' + 24 / n)} يوم</p><p>كل ما العمال يزيدوا، الأيام تقل (حاصل الضرب ثابت: ${F(n + ' × ' + 24 / n + ' = 24')}).</p></div></div>`;
      w.querySelectorAll('[data-k]').forEach(bn => bn.onclick = () => { n = +bn.dataset.k; draw(); });
    };
    draw();
  }

  const css = document.createElement('style');
  css.textContent = `.shb{display:flex;gap:3px;margin:10px 0;height:44px}.shb i{flex:1;border-radius:8px;font-style:normal;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:.85rem;color:#fff}.shb .sa{background:#d6648b}.shb .sb{background:#7aa7d9}
.cmp2{display:grid;gap:10px;margin-top:8px}.cmp2>div{background:#fff;border:2px solid var(--p);border-radius:14px;padding:8px 12px}.cmp2 h4{margin:0 0 4px;color:var(--deep)}table.cmpt{width:100%;border-collapse:collapse;margin:8px 0}table.cmpt th,table.cmpt td{border:1.5px solid var(--p);padding:6px;text-align:center}table.cmpt th{background:#fde8ef;color:var(--deep)}.ra,.rb2{width:70px}`;
  document.head.appendChild(css);
  /* الفاصلة العشرية العربية: أي 2.5 بين {{ }} بتتعرض ٢،٥ */
  const SKIPK = { a: 1, v: 1, c: 1, type: 1, id: 1, form: 1, topic: 1, lv: 1, wa: 1 };
  const dcs = s => s.replace(/\{\{(.+?)\}\}/g, (m, e) => '{{' + e.replace(/(\d)\.(\d)/g, '$1،$2') + '}}');
  const walk = (o, k) => typeof o === 'string' ? (SKIPK[k] ? o : k === 'items' ? o.replace(/(\d)\.(\d)/g, '$1،$2') : dcs(o)) : Array.isArray(o) ? o.map(x => walk(x, k)) : o && typeof o === 'object' ? Object.fromEntries(Object.entries(o).map(([kk, v]) => [kk, walk(v, kk)])) : o;
  const deep = o => AL.deep(walk(o));
  window.NS = { deep, F, tree, simp2, means, share, rel, gcd };
})();
                                                                                                                                      
