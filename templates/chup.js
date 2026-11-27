/* Dùng chung cho 2 template: chụp .sheet thành PNG nét cao */
async function chupAnh() {
  if (document.activeElement) document.activeElement.blur();
  document.body.classList.add('dang-chup');
  // Safari: ô sửa được bị tô nền xám + gạch chính tả khi chụp → tạm tắt
  const sua = [...document.querySelectorAll('[contenteditable]')], tatFont = [];
  sua.forEach(e => { e.dataset.ce = e.getAttribute('contenteditable'); e.setAttribute('contenteditable', 'false'); e.setAttribute('spellcheck', 'false'); });
  try {
    try { await Promise.all(['400', '600', '700'].map(w => document.fonts.load(`${w} 16px "Noto Serif"`, 'Ạàđươ')).concat([document.fonts.load('italic 400 16px "Noto Serif"', 'Ạàđ')])); } catch (e) { }
    await document.fonts.ready;
    await Promise.all([...document.images].map(i => i.complete ? i.decode().catch(() => {}) : new Promise(r => { i.onload = i.onerror = r; })));
    const el = document.querySelector('.sheet');
    const opt = { scale: 3, backgroundColor: '#ffffff', type: 'image/png' };
    // Safari đôi khi thiếu ảnh/font ở lần chụp đầu → chụp nháp 1 lần
    const safari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (safari) {
      // Font Trung của Google rất nặng (hàng trăm mảnh) → Safari nhúng không kịp và rơi về Times.
      // Lúc chụp chỉ dùng font Noto Serif tự lưu (tiếng Việt) + font Trung có sẵn của máy (Songti / PingFang).
      document.querySelectorAll('link[href*="fonts.googleapis"]').forEach(l => { l.disabled = true; tatFont.push(l); });
      await new Promise(r => setTimeout(r, 120));
      await modernScreenshot.domToBlob(el, opt);
      await new Promise(r => setTimeout(r, 200));
      await modernScreenshot.domToBlob(el, opt);
    }
    return await modernScreenshot.domToBlob(el, opt);
  } finally { document.body.classList.remove('dang-chup'); sua.forEach(e => e.setAttribute('contenteditable', e.dataset.ce || 'true')); tatFont.forEach(l => { l.disabled = false; }); }
}
function datChu(sel, v, html) { document.querySelectorAll(sel).forEach(e => { if (html) e.innerHTML = v; else e.textContent = v; }); }
function escH(v) { return String(v == null ? '' : v).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
