/* Dùng chung cho 2 template: chụp .sheet thành PNG nét cao */
async function chupAnh() {
  if (document.activeElement) document.activeElement.blur();
  document.body.classList.add('dang-chup');
  try {
    await document.fonts.ready;
    await Promise.all([...document.images].map(i => i.complete ? i.decode().catch(() => {}) : new Promise(r => { i.onload = i.onerror = r; })));
    const el = document.querySelector('.sheet');
    const opt = { scale: 3, backgroundColor: '#ffffff', type: 'image/png' };
    // Safari đôi khi thiếu ảnh/font ở lần chụp đầu → chụp nháp 1 lần
    const safari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (safari) await modernScreenshot.domToBlob(el, opt);
    return await modernScreenshot.domToBlob(el, opt);
  } finally { document.body.classList.remove('dang-chup'); }
}
function datChu(sel, v, html) { document.querySelectorAll(sel).forEach(e => { if (html) e.innerHTML = v; else e.textContent = v; }); }
function escH(v) { return String(v == null ? '' : v).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
