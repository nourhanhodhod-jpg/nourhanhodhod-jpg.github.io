/* =====================================================
   🔐 حسابات الطالبات — بتحفظ العملات والتقدم على النت
   القيم الأربعة اللي تحت هي بتاعة مشروع Firebase بتاعك (nour-15d84).
   لو غيرتي المشروع، بدّليها من Project settings ← Your apps.
   ===================================================== */
const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyAHuXjNBDqbKb0nyIEpikuIYD-ps0NVrE0',
  authDomain: 'nour-15d84.firebaseapp.com',
  projectId: 'nour-15d84',
  appId: '1:701858503374:web:13ad53467a0ca0e520ce9f'
};

/* ============ لا تعدّلي ما بعد هذا السطر ============ */
(function () {
  if (!FIREBASE_CONFIG.apiKey || FIREBASE_CONFIG.apiKey.indexOf('ضعي') === 0) return;
  const g = id => document.getElementById(id);
  if (/[?&]reset/.test(location.search)) history.replaceState(null, '', location.pathname);
  const rel = () => {
    try {
      const now = Date.now(), c = now - (+sessionStorage.getItem('rt') || 0) < 15000 ? (+sessionStorage.getItem('rl') || 0) + 1 : 1;
      sessionStorage.setItem('rl', c); sessionStorage.setItem('rt', now);
      if (c > 3) return;
    } catch (e) {}
    location.reload();
  };
  const V = 'https://www.gstatic.com/firebasejs/10.12.2/';
  const load = u => new Promise((ok, no) => { const s = document.createElement('script'); s.src = u; s.onload = ok; s.onerror = no; document.head.appendChild(s); });
  const KEYS = ['coins', 'done', 'fnd', 'fq', 'fc', 'fx'], WIPE = KEYS.concat(['name', 'cls', 'view', 'uid']);
  let auth, db, uid = null, busy = false, mode = 'new', last = '';

  const css = document.createElement('style');
  css.textContent = '.editb,#greetCard .link{display:none!important}#pwIn{width:100%;font:inherit;font-size:1.1rem;padding:12px 16px;border:2px solid var(--p);border-radius:18px;text-align:center;background:#fff;color:var(--ink);margin-top:10px}.mode{display:flex;gap:8px;justify-content:center;margin:8px 0}.mode button{font:inherit;font-weight:700;border:2px solid var(--p);background:#fff;color:var(--deep);border-radius:20px;padding:4px 16px;min-height:40px;cursor:pointer}.mode button.on{background:var(--btn);color:#fff;border-color:var(--btn)}';
  document.head.appendChild(css);

  const norm = s => String(s).toLowerCase().replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/[\u064B-\u065F\u0670\u0640\s]/g, '').replace(/[\u0623\u0625\u0622]/g, '\u0627').replace(/\u0649/g, '\u064A').replace(/\u0629/g, '\u0647');
  async function emailOf(name, cls) {
    const h = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(norm(name) + '|' + cls));
    return 'u' + Array.from(new Uint8Array(h)).map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 40) + '@mathsite.app';
  }
  const wipe = () => WIPE.forEach(k => { try { localStorage.removeItem(k); } catch (e) {} });
  const fill = d => {
    try {
      localStorage.setItem('name', d.name || ''); localStorage.setItem('cls', d.cls || '');
      localStorage.setItem('coins', String(d.coins || 0));
      ['done', 'fnd', 'fq', 'fc', 'fx'].forEach(k => localStorage.setItem(k, d[k] || '{}'));
    } catch (e) {}
  };

  async function push() {
    if (!uid) return;
    const s = {}; KEYS.concat(['name', 'cls']).forEach(k => { s[k] = localStorage.getItem(k) || ''; });
    const j = JSON.stringify(s); if (j === last) return; last = j;
    let sk = 0; try { sk = Object.values(JSON.parse(s.fnd || '{}')).filter(v => v >= 2).length; } catch (e) {}
    db.collection('users').doc(uid).set({ name: s.name, cls: s.cls, coins: parseInt(s.coins) || 0, skills: sk, done: s.done, fnd: s.fnd, fq: s.fq, fc: s.fc, fx: s.fx, updated: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true }).catch(() => { last = ''; });
  }

  function ui() {
    const card = g('nameCard'); if (!card) return;
    card.querySelector('p').textContent = 'اكتبي اسمك وفصلك ورقمك السري علشان نبدأ!';
    g('nameIn').insertAdjacentHTML('beforebegin', '<div class="mode"><button id="mNew" class="on">أول مرة</button><button id="mLog">عندي حساب</button></div>');
    g('clsIn').insertAdjacentHTML('afterend', '<input id="pwIn" type="password" maxlength="30" placeholder="رقمك السري (6 رموز على الأقل)" aria-label="الرقم السري" autocomplete="off" onkeydown="if(event.key===\'Enter\')saveName()"><small>افتكري رقمك السري كويس، هتحتاجيه كل ما تدخلي من أي جهاز 💗</small>');
    const btn = card.querySelector('.btn'), set = m => { mode = m; g('mNew').classList.toggle('on', m === 'new'); g('mLog').classList.toggle('on', m === 'log'); btn.textContent = m === 'new' ? 'سجّلي حسابي ✨' : 'دخول ✨'; };
    g('mNew').onclick = () => set('new'); g('mLog').onclick = () => set('log'); set('new');
    const lo = document.createElement('button');
    lo.className = 'ib'; lo.id = 'logout'; lo.textContent = '🚪'; lo.setAttribute('aria-label', 'تسجيل الخروج'); lo.hidden = true;
    lo.onclick = () => { if (!confirm('تسجيل الخروج؟')) return; push(); auth.signOut().then(() => { wipe(); rel(); }); };
    document.querySelector('header .tools').appendChild(lo);
  }

  const MSG = {
    'auth/email-already-in-use': 'فيه حساب بنفس الاسم والفصل. اختاري «عندي حساب»، أو غيّري الاسم شوية 💗',
    'auth/invalid-credential': 'الاسم أو الفصل أو الرقم السري مش مظبوطين 💗',
    'auth/wrong-password': 'الاسم أو الفصل أو الرقم السري مش مظبوطين 💗',
    'auth/user-not-found': 'مفيش حساب بالاسم والفصل دول. اختاري «أول مرة» 💗',
    'auth/weak-password': 'الرقم السري لازم يكون 6 رموز على الأقل 💗',
    'auth/network-request-failed': 'النت ضعيف.. جرّبي تاني 💗',
    'auth/too-many-requests': 'محاولات كتير، استني شوية وجرّبي تاني 💗'
  };

  window.saveName = async function () {
    const w = g('nameWarn'), btn = g('nameCard').querySelector('.btn');
    const name = g('nameIn').value.trim(), pw = g('pwIn').value;
    const cls = g('clsIn').value.trim().replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/\s+/g, '').replace(/[\\\-]/g, '/');
    if (!name) { w.textContent = 'اكتبي اسمك الأول علشان نبدأ 💗'; return g('nameIn').focus(); }
    if (!/^\d{1,2}\/\d{1,2}$/.test(cls)) { w.textContent = 'اكتبي فصلك بالشكل ده: 1/10 💗'; return g('clsIn').focus(); }
    if (pw.length < 6) { w.textContent = 'الرقم السري لازم يكون 6 رموز على الأقل 💗'; return g('pwIn').focus(); }
    w.textContent = ''; btn.disabled = true; busy = true;
    try {
      const em = await emailOf(name, cls);
      if (mode === 'new') {
        const r = await auth.createUserWithEmailAndPassword(em, pw);
        uid = r.user.uid;
        await db.collection('users').doc(uid).set({ name: name, cls: cls, coins: 0, skills: 0, done: '{}', fnd: '{}', fq: '{}', fc: '{}', fx: '{}', created: firebase.firestore.FieldValue.serverTimestamp() });
        fill({ name: name, cls: cls });
      } else {
        const r = await auth.signInWithEmailAndPassword(em, pw);
        uid = r.user.uid;
        const d = await db.collection('users').doc(uid).get();
        fill(d.exists ? d.data() : { name: name, cls: cls });
      }
      localStorage.setItem('uid', uid); localStorage.setItem('view', 'hub');
      rel();
    } catch (e) {
      busy = false; btn.disabled = false;
      w.textContent = MSG[e.code] || 'حصلت مشكلة بسيطة، جرّبي تاني 💗';
    }
  };

  (async function () {
    try {
      await load(V + 'firebase-app-compat.js'); await load(V + 'firebase-auth-compat.js'); await load(V + 'firebase-firestore-compat.js');
    } catch (e) { return; }
    firebase.initializeApp(FIREBASE_CONFIG);
    auth = firebase.auth(); db = firebase.firestore();
    ui();
    auth.onAuthStateChanged(async u => {
      if (busy) return;
      if (u) {
        uid = u.uid;
        if (localStorage.getItem('uid') !== uid) {
          try { const d = await db.collection('users').doc(uid).get(); if (d.exists) fill(d.data()); localStorage.setItem('uid', uid); rel(); } catch (e) {}
          return;
        }
        g('logout').hidden = false;
        setInterval(push, 8000);
        addEventListener('pagehide', push);
        document.addEventListener('visibilitychange', () => { if (document.hidden) push(); });
        const _u = window.upd; window.upd = function () { _u(); push(); };
      } else if (localStorage.getItem('name') || localStorage.getItem('uid')) { wipe(); rel(); }
    });
  })();
})();
       
