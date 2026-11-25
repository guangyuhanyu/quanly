/* HIỆU ỨNG THEO MÙA (bản 6.2): đông tuyết rơi · xuân hoa đào · hạ lá xanh · thu lá vàng.
   Cài đặt theo từng máy trong HU (localStorage 'gyq_hieu_ung'): HU.mua = 'tu_dong'|'xuan'|'ha'|'thu'|'dong'|'tat', HU.muaDay = 'nhe'|'vua'|'day'. */
const MUA_TEN = { xuan: ['Xuân', '🌸', 'hoa đào rơi'], ha: ['Hạ', '🍃', 'lá xanh rơi'], thu: ['Thu', '🍂', 'lá vàng rơi'], dong: ['Đông', '❄️', 'tuyết rơi'] };
const MUA_SO = { nhe: 14, vua: 26, day: 42 };
function muaTheoThang(d = new Date()) { const m = d.getMonth() + 1; return m >= 2 && m <= 4 ? 'xuan' : m >= 5 && m <= 7 ? 'ha' : m >= 8 && m <= 10 ? 'thu' : 'dong'; }
function muaHienTai() { const c = (typeof HU !== 'undefined' && HU.mua) || 'tu_dong'; return c === 'tat' ? null : c === 'tu_dong' ? muaTheoThang() : c; }
const MUA_HAT = {
  dong: () => Math.random() < .3
    ? `<svg viewBox="0 0 24 24"><g stroke="#B9CCE0" stroke-width="1.6" stroke-linecap="round" fill="none"><path d="M12 2v20M3.3 7l17.4 10M3.3 17L20.7 7"/><path d="M12 5l-2-2M12 5l2-2M12 19l-2 2M12 19l2 2"/></g></svg>`
    : `<b class="mua-tuyet"></b>`,
  xuan: () => `<svg viewBox="0 0 20 20"><path d="M10 1c3 3 5 6 4 10-1 3-3 5-4 8-1-3-3-5-4-8-1-4 1-7 4-10z" fill="${['#F4B9C6', '#F7CBD5', '#EDA6B8', '#FADDE4', '#F2A7BA'][Math.floor(Math.random() * 5)]}"/><path d="M10 4v12" stroke="#fff" stroke-width=".6" opacity=".6"/></svg>`,
  ha: () => `<svg viewBox="0 0 30 16"><path d="M2 8C8 1 20 0 28 8 20 15 8 15 2 8z" fill="${['#8DB58A', '#A9C98F', '#7FA97C', '#B8D39A'][Math.floor(Math.random() * 4)]}"/><path d="M4 8h22" stroke="#5F8A5C" stroke-width=".8"/></svg>`,
  thu: () => Math.random() < .45
    ? `<svg viewBox="0 0 24 24"><path d="M12 2l2 5 4-2-1 5 5 1-4 3 2 4-5-1-1 5-2-4-2 4-1-5-5 1 2-4-4-3 5-1-1-5 4 2z" fill="${['#E0A042', '#D9822B', '#C96A2B', '#E6B85C'][Math.floor(Math.random() * 4)]}"/><path d="M12 22V10" stroke="#8A5A24" stroke-width=".8"/></svg>`
    : `<svg viewBox="0 0 30 16"><path d="M2 8C8 1 20 0 28 8 20 15 8 15 2 8z" fill="${['#E2B04A', '#D79A3A', '#C98E45', '#E8C36A', '#B9773A'][Math.floor(Math.random() * 5)]}"/><path d="M4 8h22" stroke="#8A6A2E" stroke-width=".8"/></svg>`,
};
let _muaDang = null;
function veMua() {
  let L = document.getElementById('mua-lop');
  const mua = muaHienTai(), tat = !mua || (typeof giamDong === 'function' && giamDong());
  if (tat) { if (L) L.remove(); _muaDang = null; return; }
  const n = MUA_SO[(HU && HU.muaDay) || 'vua'] || 26, khoa = mua + n;
  if (L && _muaDang === khoa) return;
  if (L) L.remove();
  L = document.createElement('div'); L.id = 'mua-lop'; L.className = 'mua-' + mua; L.setAttribute('aria-hidden', 'true');
  const nho = window.innerWidth < 700, so = nho ? Math.round(n * .6) : n;
  let h = '';
  for (let i = 0; i < so; i++) {
    const tuyet = mua === 'dong', kt = tuyet ? 6 + Math.random() * 10 : 12 + Math.random() * 12;
    const roi = (tuyet ? 11 : 13) + Math.random() * 10, tre = -Math.random() * roi, lac = 2.5 + Math.random() * 3;
    h += `<i class="mua-hat" style="left:${(Math.random() * 100).toFixed(2)}vw;width:${kt.toFixed(1)}px;animation-duration:${roi.toFixed(1)}s;animation-delay:${tre.toFixed(1)}s;opacity:${(.55 + Math.random() * .4).toFixed(2)}"><span style="animation-duration:${lac.toFixed(1)}s;animation-delay:${(-Math.random() * lac).toFixed(1)}s;--lac:${(15 + Math.random() * 35).toFixed(0)}px;--xoay:${((Math.random() < .5 ? -1 : 1) * (tuyet ? 90 : 200 + Math.random() * 200)).toFixed(0)}deg">${MUA_HAT[mua]()}</span></i>`;
  }
  L.innerHTML = h; document.body.appendChild(L); _muaDang = khoa;
}
/* đổi mùa giữa chừng (để web mở qua đêm) */
setInterval(() => { if ((HU.mua || 'tu_dong') === 'tu_dong') { _muaDang = null; veMua(); } }, 6 * 3600 * 1000);
document.addEventListener('visibilitychange', () => { const L = document.getElementById('mua-lop'); if (L) L.style.animationPlayState = document.hidden ? 'paused' : ''; });

/* khung chọn mùa: dùng trong Giao diện */
function khungMua() {
  const c = HU.mua || 'tu_dong', d = HU.muaDay || 'vua', tu = MUA_TEN[muaTheoThang()];
  return `<h4>Hiệu ứng theo mùa</h4>
    <div class="mua-chon">${[['tu_dong', `✨ Tự động <small>(nay: ${tu[1]} ${tu[0]})</small>`], ['xuan', '🌸 Xuân'], ['ha', '🍃 Hạ'], ['thu', '🍂 Thu'], ['dong', '❄️ Đông'], ['tat', 'Tắt']].map(([v, ch]) => `<button type="button" class="${c === v ? 'on' : ''}" data-mua="${v}">${ch}</button>`).join('')}</div>
    <div class="mua-chon nho"><span class="mo nho">Độ dày:</span>${[['nhe', 'Thưa'], ['vua', 'Vừa'], ['day', 'Dày']].map(([v, ch]) => `<button type="button" class="${d === v ? 'on' : ''}" data-mua-day="${v}">${ch}</button>`).join('')}</div>
    <p class="mo nho">Tự động: tháng 2–4 hoa đào, 5–7 lá xanh, 8–10 lá vàng, 11–1 tuyết rơi.</p>`;
}
function ganKhungMua(k) {
  k.addEventListener('click', e => {
    const b = e.target.closest('[data-mua],[data-mua-day]'); if (!b) return;
    if (b.dataset.mua) HU.mua = b.dataset.mua; else HU.muaDay = b.dataset.muaDay;
    luuHU(); _muaDang = null; veMua(); k.innerHTML = khungMua();
  });
}
/* nút nhanh trên trang Hôm nay */
function nutMuaNhanh() {
  const m = muaHienTai(), t = m ? MUA_TEN[m] : null;
  return `<button class="mua-nut" data-act="mua-doi" title="Đổi hiệu ứng mùa">${t ? t[1] : '○'}<span>${t ? t[0] : 'Tắt'}</span></button>`;
}
const HD_MUA = {
  'mua-doi': () => {
    const thu = ['tu_dong', 'xuan', 'ha', 'thu', 'dong', 'tat'], c = HU.mua || 'tu_dong';
    HU.mua = thu[(thu.indexOf(c) + 1) % thu.length]; luuHU(); _muaDang = null; veMua();
    const m = muaHienTai(); toast(HU.mua === 'tat' ? 'Đã tắt hiệu ứng mùa' : `${HU.mua === 'tu_dong' ? 'Tự động theo mùa · ' : ''}${MUA_TEN[m][1]} ${MUA_TEN[m][0]}: ${MUA_TEN[m][2]}`);
    document.querySelectorAll('.mua-nut').forEach(n => n.outerHTML = nutMuaNhanh());
  },
};
