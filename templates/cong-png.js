/* Khối "Trang theo dõi lớp học" trong PNG gửi học viên: mã QR + địa chỉ + mã lớp.
   Gọi veCong(d.cong, lang) trong dien(); d.cong = { link, dia_chi, ma } (bỏ trống thì ẩn khối). */
(function () {
  const css = `
  .cong-band{background:var(--sky-deepest);display:flex;align-items:center;gap:13px;padding:12px 20px 11px;border-bottom:1px solid rgba(203,167,101,.28)}
  .cong-qr{width:66px;height:66px;flex:none;border-radius:7px;border:3px solid #FBF6E9;background:#FBF6E9;display:block;image-rendering:pixelated}
  .cong-chu{flex:1;min-width:0}
  .cong-tieu{font-family:'Noto Serif','Noto Serif SC','Songti SC','STSong',serif;font-weight:700;font-size:8.8px;letter-spacing:.08em;text-transform:uppercase;color:var(--gold-soft);margin:0 0 3px}
  .cong-mo{font-size:9.6px;line-height:1.5;color:rgba(251,246,233,.88);margin:0 0 5px}
  .cong-dong{display:flex;flex-wrap:wrap;gap:4px 8px;margin:0}
  .cong-the{font-size:9.8px;font-weight:700;color:#FBF6E9;background:rgba(251,246,233,.12);border:1px solid rgba(203,167,101,.45);border-radius:99px;padding:2px 9px;white-space:nowrap}
  .cong-the i{font-style:normal;font-weight:400;color:var(--gold-soft);margin-right:3px}
  @media (max-width:480px){.cong-band{padding:12px 12px 11px;gap:10px}.cong-qr{width:70px;height:70px}}`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  const CHU = {
    vi: { tieu: 'Trang theo dõi lớp học', mo: 'Anh/chị/bạn quét mã QR hoặc truy cập địa chỉ bên dưới để xem lịch học, số buổi còn lại, bài tập và tài liệu của lớp.', dc: 'Địa chỉ', ma: 'Mã lớp' },
    zh: { tieu: '班级学习主页', mo: '扫描二维码或访问以下网址，即可查看课表、剩余课时、作业和学习资料。', dc: '网址', ma: '班级代码' },
  };
  function anhQR(text) {
    const qr = qrcode(0, 'M'); qr.addData(text); qr.make();
    const n = qr.getModuleCount(), o = 2, s = 8, cv = document.createElement('canvas');
    cv.width = cv.height = (n + o * 2) * s; const c = cv.getContext('2d');
    c.fillStyle = '#FBF6E9'; c.fillRect(0, 0, cv.width, cv.height); c.fillStyle = '#1E3446';
    for (let r = 0; r < n; r++) for (let k = 0; k < n; k++) if (qr.isDark(r, k)) c.fillRect((k + o) * s, (r + o) * s, s, s);
    return cv.toDataURL('image/png');
  }
  const esc = v => String(v == null ? '' : v).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  window.veCong = function (cong, lang) {
    let el = document.getElementById('cong-band');
    if (!cong || !cong.link || typeof qrcode !== 'function') { if (el) el.remove(); return; }
    const C = CHU[lang] || CHU.vi;
    if (!el) { el = document.createElement('div'); el.id = 'cong-band'; el.className = 'cong-band'; const f = document.querySelector('.qr-footer'); f.parentNode.insertBefore(el, f); }
    el.innerHTML = `<img class="cong-qr" alt="QR trang lớp" src="${anhQR(cong.link)}">
      <div class="cong-chu"><p class="cong-tieu">${C.tieu}</p><p class="cong-mo">${C.mo}</p>
      <p class="cong-dong"><span class="cong-the"><i>${C.dc}</i>${esc(cong.dia_chi)}</span>${cong.ma ? `<span class="cong-the"><i>${C.ma}</i>${esc(cong.ma)}</span>` : ''}</p></div>`;
  };
})();
