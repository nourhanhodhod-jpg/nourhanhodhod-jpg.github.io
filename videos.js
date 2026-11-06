/* =====================================================
   🎀 فيديوهات الشرح
   لإضافة أو تغيير فيديو: عدّلي القائمة اللي تحت بس (VIDEOS)،
   ومتلمسيش أي حاجة بعد سطر "لا تعدّلي ما بعد هذا السطر".

   لكل درس اكتبي واحدة من التلات طرق (واحدة بس):
     src     = مسار ملف MP4 اللي رفعتيه على GitHub   مثال: 'videos/lesson1.mp4'
     drive   = رابط مشاركة Google Drive (أو الـ ID بتاعه)
     youtube = رابط فيديو يوتيوب (Unlisted) أو الـ ID بتاعه
   وبعدين اختياري: poster (صورة الغلاف)، title، desc، duration.
   خلّي الخانة اللي مش هتستخدميها فاضية '' .
   ===================================================== */

const VIDEOS = {
  l1: {
    title: 'شرح المعادلة التربيعية',
    desc: 'شرح بسيط خطوة بخطوة للقانون العام وحل مثال.',
    duration: '',
    src: '',
    poster: '',
    drive: '',
    youtube: ''
  }
};

/* ============ لا تعدّلي ما بعد هذا السطر ============ */
(function () {
  const st = document.createElement('style');
  st.textContent =
    '.vwrap{position:relative;aspect-ratio:16/9;border-radius:20px;overflow:hidden;border:3px solid var(--p);box-shadow:0 8px 24px rgba(199,126,156,.3);background:#000;margin-top:8px}' +
    '.vwrap video,.vwrap iframe{width:100%;height:100%;border:0;display:block;background:#000}' +
    '.vcover{position:absolute;inset:0;width:100%;height:100%;border:0;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;font:inherit;color:#fff;background:linear-gradient(135deg,var(--p),var(--a)) center/cover no-repeat}' +
    '.vplay{width:76px;height:76px;border-radius:50%;background:rgba(255,255,255,.95);color:var(--btn);font-size:2rem;display:grid;place-items:center;box-shadow:0 6px 18px rgba(0,0,0,.3);transition:transform .2s}' +
    '.vcover:hover .vplay{transform:scale(1.1)}' +
    '.vlabel{background:rgba(74,42,58,.7);padding:2px 16px;border-radius:20px;font-weight:800}' +
    '.vmeta{margin:10px 0 0;font-size:1.05rem}' +
    '.vdur{background:var(--s);color:var(--deep);padding:2px 10px;border-radius:12px;font-size:.85rem;font-weight:700;white-space:nowrap}' +
    '.vdesc{margin:2px 0 0}' +
    '.verr{height:100%;display:grid;place-items:center;text-align:center;padding:16px;background:var(--s);color:var(--ink);font-weight:700}';
  document.head.appendChild(st);

  const e = s => String(s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const u = s => String(s).trim().replace(/['"<>\s]/g, c => '%' + c.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0'));
  const driveId = s => { const m = String(s || '').match(/[-\w]{25,}/); return m ? m[0] : ''; };
  const ytId = s => {
    s = String(s || '');
    const m = s.match(/(?:v=|youtu\.be\/|embed\/|shorts\/|live\/)([\w-]{11})/) || s.match(/^([\w-]{11})$/);
    return m ? m[1] : '';
  };
  const has = v => v && (String(v.src || '').trim() || driveId(v.drive) || ytId(v.youtube));

  function play(v, wrap) {
    let h;
    if (String(v.src || '').trim()) {
      h = '<video controls autoplay playsinline preload="auto"' + (v.poster ? ' poster="' + u(v.poster) + '"' : '') + ' src="' + u(v.src) + '"></video>';
    } else if (driveId(v.drive)) {
      h = '<iframe src="https://drive.google.com/file/d/' + driveId(v.drive) + '/preview" allow="autoplay; fullscreen" allowfullscreen></iframe>';
    } else {
      h = '<iframe src="https://www.youtube-nocookie.com/embed/' + ytId(v.youtube) + '?autoplay=1&rel=0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>';
    }
    wrap.innerHTML = h;
    const vd = wrap.querySelector('video');
    if (vd) vd.addEventListener('error', () => {
      wrap.innerHTML = '<div class="verr">😢 الفيديو مش راضي يشتغل.<br>اتأكدي إن اسم الملف مكتوب صح وإن الملف اتحمّل على GitHub.</div>';
    });
  }

  function render() {
    document.querySelectorAll('.vbox').forEach(box => {
      box.innerHTML = '';
      [].concat(VIDEOS[box.dataset.lesson] || []).filter(has).forEach(v => {
        const c = document.createElement('section');
        c.className = 'card vcard';
        c.innerHTML =
          '<h3>شاهدي الشرح بالفيديو 🎀</h3>' +
          '<div class="vwrap"><button class="vcover" type="button" aria-label="تشغيل فيديو الشرح"' +
          (v.poster ? ' style="background-image:url(\'' + u(v.poster) + '\')"' : '') +
          '><span class="vplay">▶</span><span class="vlabel">اضغطي للتشغيل</span></button></div>' +
          '<p class="vmeta"><b>' + e(v.title) + '</b>' + (v.duration ? ' <span class="vdur">⏱ ' + e(v.duration) + '</span>' : '') + '</p>' +
          (v.desc ? '<p class="vdesc">' + e(v.desc) + '</p>' : '');
        c.querySelector('.vcover').addEventListener('click', () => play(v, c.querySelector('.vwrap')));
        box.appendChild(c);
      });
    });
  }

  const ls = document.getElementById('lessons');
  if (ls) new MutationObserver(() => { if (ls.hidden) render(); }).observe(ls, { attributes: true, attributeFilter: ['hidden'] });
  render();
})();
  
