/* =========================================================
   Lõi: trạng thái, tính toán học phí, tiện ích giao diện
   ========================================================= */
const S = { bang_gia: [], hoc_vien: [], lop: [], lop_hoc_vien: [], khoa_hoc: [], buoi_hoc: [], thanh_toan: [], cong_viec: [], cai_dat: [], thoi_quen: [], thoi_quen_nhat_ky: [], chi_tieu: [] };
let DBX = null;            // LocalDB hoặc SupaDB
let CACHE = new Map();

/* ---------- tiện ích chung ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = v => v == null ? '' : String(v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const NF = new Intl.NumberFormat('vi-VN');
const tien = n => NF.format(Math.round(n || 0)) + 'đ';
const tienGon = n => { n = Math.round(n || 0); const a = Math.abs(n); return a >= 1e6 ? (n / 1e6).toLocaleString('vi-VN', { maximumFractionDigits: 1 }) + ' tr' : a >= 1e3 ? Math.round(n / 1e3) + 'k' : String(n); };
const pad = n => String(n).padStart(2, '0');
const d2s = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const s2d = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const homNay = () => d2s(new Date());
const congNgay = (s, n) => { const d = s2d(s); d.setDate(d.getDate() + n); return d2s(d); };
const THU = ['Chủ nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
const THU_NGAN = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const ngayVN = s => { if (!s) return ''; const [y, m, d] = s.split('-'); return `${d}/${m}/${y}`; };
const ngayNgan = s => { if (!s) return ''; const [, m, d] = s.split('-'); return `${d}/${m}`; };
const dauTuan = s => { const d = s2d(s); const w = (d.getDay() + 6) % 7; d.setDate(d.getDate() - w); return d2s(d); };
const phut2gio = p => `${pad(Math.floor(p / 60))}:${pad(p % 60)}`;
const gio2phut = g => { if (!g) return null; const [h, m] = g.split(':').map(Number); return h * 60 + m; };
const thoiLuongChu = p => !p ? '' : p % 60 === 0 ? `${p / 60} tiếng` : p > 60 ? `${Math.floor(p / 60)}h${pad(p % 60)}` : `${p} phút`;
const caiDat = (k, mac) => { const r = S.cai_dat.find(x => x.khoa === k); return r ? r.gia_tri : mac; };

/* màu chữ tự động: nền sáng → chữ mực, nền đậm → chữ trắng */
function mauChu(hex) {
  const m = String(hex || '').replace('#', ''); if (m.length < 6) return '#fff';
  const [r, g, b] = [0, 2, 4].map(i => parseInt(m.slice(i, i + 2), 16) / 255).map(c => c <= .03928 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4);
  return .2126 * r + .7152 * g + .0722 * b > .4 ? '#2B2013' : '#fff';
}
/* ---------- tra cứu ---------- */
const lopTheoId = id => S.lop.find(x => x.id === id);
const khoaTheoId = id => S.khoa_hoc.find(x => x.id === id);
const hvTheoId = id => S.hoc_vien.find(x => x.id === id);
const bgTheoId = id => S.bang_gia.find(x => x.id === id);
const hvCuaLop = lopId => S.lop_hoc_vien.filter(x => x.lop_id === lopId).map(x => hvTheoId(x.hoc_vien_id)).filter(Boolean);
const lopCuaHv = hvId => S.lop_hoc_vien.filter(x => x.hoc_vien_id === hvId).map(x => lopTheoId(x.lop_id)).filter(Boolean);
const khoaCuaLop = lopId => S.khoa_hoc.filter(k => k.lop_id === lopId).sort((a, b) => a.id - b.id);
const buoiCuaKhoa = kid => S.buoi_hoc.filter(b => b.khoa_id === kid).sort(soBuoi);
const soBuoi = (a, b) => a.ngay < b.ngay ? -1 : a.ngay > b.ngay ? 1 : (a.gio_bat_dau || '') < (b.gio_bat_dau || '') ? -1 : (a.gio_bat_dau || '') > (b.gio_bat_dau || '') ? 1 : a.id - b.id;
const tinhBuoi = b => b.trang_thai === 'da_day' && b.tinh_phi !== false;
/* ---------- tính theo giờ: lớp có buổi dài ngắn khác nhau (cai_dat 'lop_theo_gio' = [lopId]) ----------
   Khoá vẫn mua theo "số buổi × thời lượng chuẩn"; mỗi buổi đã dạy trừ đúng số phút thực tế.
   daHoc / conLai lúc đó là số buổi QUY ĐỔI (có thể lẻ), chỉ hiển thị ra giờ. */
const lopTheoGio = id => (caiDat('lop_theo_gio', []) || []).includes(id);
const lam2 = x => Math.round(x * 100) / 100;
function gioChu(ph, zh) {
  ph = Math.round(ph); const am = ph < 0, a = Math.abs(ph), h = Math.floor(a / 60), m = a % 60;
  const s = zh ? ((h ? h + ' 小时' : '') + (m ? (h ? ' ' : '') + m + ' 分钟' : '') || '0 分钟') : ([h ? h + ' tiếng' : '', m ? m + ' phút' : ''].filter(Boolean).join(' ') || '0 phút');
  return (am ? '−' : '') + s;
}
function gioNgan(ph) { ph = Math.round(ph); const a = Math.abs(ph), h = Math.floor(a / 60), m = a % 60; return (ph < 0 ? '−' : '') + (h ? h + 'h' + (m ? String(m).padStart(2, '0') : '') : m ? m + 'p' : '0h'); }
/* n: số buổi (quy đổi) của khoá t → chữ: "3 buổi" hoặc "4 tiếng 30 phút" */
function luongChu(t, n, zh) { return t && t.theoGio ? gioChu(n * t.tl, zh) : (zh ? `${n} 次课` : `${n} buổi`); }
/* đọc ô nhập giờ: "12", "12,5", "1h30", "1:30", "90p", "-1h" → số phút (NaN nếu sai) */
function docGio(v) {
  v = String(v == null ? '' : v).trim().toLowerCase().replace(/\s+/g, '').replace('−', '-'); if (!v) return 0;
  const am = v.startsWith('-') ? -1 : 1; v = v.replace(/^[-+]/, ''); let m;
  if ((m = v.match(/^(\d+)(?:h|:|g|giờ|gio|tiếng|tieng)(\d{1,2})?(?:p|ph|phút|phut)?$/))) return am * (Number(m[1]) * 60 + Number(m[2] || 0));
  if ((m = v.match(/^(\d+)(?:p|ph|phút|phut)$/))) return am * Number(m[1]);
  const n = Number(v.replace(',', '.')); return isNaN(n) ? NaN : am * Math.round(n * 60);
}
/* số phút → chữ điền sẵn vào ô giờ: 750 → "12h30", 720 → "12" */
function gioO(ph) { ph = Math.round(ph || 0); const am = ph < 0 ? '-' : '', a = Math.abs(ph), h = Math.floor(a / 60), m = a % 60; return am + (m ? `${h}h${String(m).padStart(2, '0')}` : `${h}`); }
async function datTheoGio(lopId, bat) {
  if (bat === lopTheoGio(lopId)) return;
  const ds = (caiDat('lop_theo_gio', []) || []).filter(x => x !== lopId); if (bat) ds.push(lopId);
  await luuCaiDat('lop_theo_gio', ds); lamMoi();
}
/* nút chọn Theo buổi / Theo giờ trong form khoá */
function chonCheDo(gio) {
  return `<div class="ca-dong che-tinh"><span class="mo nho">Tính khoá học:</span><div class="phan-doan"><button type="button" data-che="buoi" class="${gio ? '' : 'on'}">Theo buổi</button><button type="button" data-che="gio" class="${gio ? 'on' : ''}">Theo giờ</button></div>
    <input type="hidden" name="_che" value="${gio ? 'gio' : 'buoi'}"><small class="mo nho" data-chi="gio">Mỗi buổi trừ đúng số phút thực tế · gõ giờ kiểu 12 · 12,5 · 1h30</small></div>`;
}
function ganCheDo(n, khiDoi) {
  const ap = v => { $('[name=_che]', n).value = v; $$('[data-che]', n).forEach(b => b.classList.toggle('on', b.dataset.che === v)); $$('[data-chi]', n).forEach(e => { e.style.display = e.dataset.chi === v ? '' : 'none'; }); if (khiDoi) khiDoi(v); };
  $$('[data-che]', n).forEach(b => b.onclick = () => ap(b.dataset.che)); ap($('[name=_che]', n).value);
}
const boKhoaTam = f => { Object.keys(f).forEach(k => { if (k.startsWith('_')) delete f[k]; }); return f; };
function luongNgan(t, n) { return t && t.theoGio ? gioNgan(n * t.tl) : String(n); }

/* ---------- tính toán khoá học ---------- */
function tk(k) {
  if (!k) return null;
  const key = 'k' + k.id; if (CACHE.has(key)) return CACHE.get(key);
  const buoi = buoiCuaKhoa(k.id);
  const daDay = buoi.filter(tinhBuoi);
  const goc = (k.so_buoi || 0) + (k.buoi_chuyen_sang || 0);
  const giaTriGoc = (k.hoc_phi || 0) + (k.gia_tri_chuyen_sang || 0);
  const donGiaBuoi = goc > 0 ? giaTriGoc / goc : 0;
  const tong = goc - (k.buoi_chuyen_di || 0);
  const tl = k.thoi_luong_phut || 90, theoGio = lopTheoGio(k.lop_id);
  const daPhut = daDay.reduce((s, b) => s + (b.thoi_luong_phut || tl), 0);
  const daHoc = theoGio ? lam2(daPhut / tl) : daDay.length;
  const conLai = lam2(tong - daHoc);
  const daDong = S.thanh_toan.filter(t => t.khoa_id === k.id).reduce((s, t) => s + (t.so_tien || 0), 0);
  const conNo = (k.hoc_phi || 0) - daDong;
  const duKien = buoi.filter(b => b.trang_thai === 'du_kien');
  const r = {
    buoi, daDay, tong, daHoc, conLai, donGiaBuoi, daDong, conNo, duKien, theoGio, tl, daPhut, soBuoiDay: daDay.length,
    daThucHien: daHoc * donGiaBuoi,
    // chỉ tính phần ĐÃ ĐÓNG TIỀN mà chưa dạy (tiền khoá trước chuyển sang coi như đã đóng)
    chuaThucHien: k.ket_thuc ? 0 : Math.max(0, Math.min(Math.max(conLai, 0) * donGiaBuoi, daDong + (k.gia_tri_chuyen_sang || 0) - daHoc * donGiaBuoi)),
    ngayCuoi: daDay.length ? daDay[daDay.length - 1].ngay : null,
    ngayDau: daDay.length ? daDay[0].ngay : k.ngay_bat_dau,
    tt: S.thanh_toan.filter(t => t.khoa_id === k.id).sort((a, b) => a.ngay < b.ngay ? -1 : 1),
  };
  CACHE.set(key, r); return r;
}
/* khoá đang chạy của một lớp: khoá chưa đóng sớm nhất còn buổi, nếu không thì khoá chưa đóng mới nhất, nếu không thì khoá mới nhất */
function khoaHienTai(lopId) {
  const ks = khoaCuaLop(lopId); if (!ks.length) return null;
  const mo = ks.filter(k => !k.ket_thuc);
  return mo.find(k => tk(k).conLai > 0) || mo[mo.length - 1] || ks[ks.length - 1];
}
const nguongGiaHan = () => Number(caiDat('nguong_gia_han', 2));
function tinhTrangLop(L) {
  const k = khoaHienTai(L.id); const t = tk(k);
  if (!L.dang_hoat_dong) return { ma: 'tam_dung', chu: t && t.conLai > 0 && !k.ket_thuc ? `Bảo lưu ${luongChu(t, t.conLai)}` : 'Tạm dừng' };
  if (!k) return { ma: 'moi', chu: 'Chưa có khoá' };
  if (t.conLai <= 0) return { ma: 'het', chu: `Hết ${t.theoGio ? 'giờ học' : 'buổi'} – cần gia hạn` };
  if (t.conLai <= nguongGiaHan()) return { ma: 'sap_het', chu: `Còn ${luongChu(t, t.conLai)}` };
  return { ma: 'dang_hoc', chu: 'Đang học' };
}
function goiYHocPhi(bgId, thoiLuong, soBuoi) {
  const bg = bgTheoId(Number(bgId)); if (!bg) return 0;
  return Math.round(bg.don_gia_gio * (thoiLuong / 60) * soBuoi / 1000) * 1000;
}
function trinhDoCua(L, k) { return (k && k.giao_trinh) || L.trinh_do || (bgTheoId(L.bang_gia_id) || {}).ten || ''; }

/* ---------- tiền theo kỳ ---------- */
function doanhThuBuoi(b) { const k = khoaTheoId(b.khoa_id); return k ? tk(k).donGiaBuoi : 0; }
function tongKy(tu, den) {   // [tu, den] chuỗi ngày
  const buoi = S.buoi_hoc.filter(b => tinhBuoi(b) && b.ngay >= tu && b.ngay <= den);
  const tt = S.thanh_toan.filter(t => t.ngay >= tu && t.ngay <= den);
  return { buoi, tt, doanhThu: buoi.reduce((s, b) => s + doanhThuBuoi(b), 0), thucNhan: tt.reduce((s, t) => s + t.so_tien, 0) };
}
function tongHienTai() {
  let chuaThucHien = 0, chuaThu = 0;
  S.khoa_hoc.filter(k => lopTheoId(k.lop_id)).forEach(k => { const t = tk(k); chuaThucHien += t.chuaThucHien; if (!k.ket_thuc && t.conNo > 0) chuaThu += t.conNo; });
  return { chuaThucHien, chuaThu };
}

/* ---------- lưu dữ liệu ---------- */
function lamMoi() { CACHE = new Map(); }
async function luu(t, row, id) {
  try {
    let r;
    if (id != null) { r = await DBX.update(t, id, row); const i = S[t].findIndex(x => x.id === id); S[t][i] = r; }
    else { r = await DBX.insert(t, row); S[t].push(r); }
    lamMoi(); return r;
  } catch (e) { baoLoi(e); throw e; }
}
async function xoa(t, id) { try { await DBX.remove(t, id); S[t] = S[t].filter(x => x.id !== id); lamMoi(); } catch (e) { baoLoi(e); throw e; } }
async function luuCaiDat(k, v) {
  await DBX.setCaiDat(k, v);
  const r = S.cai_dat.find(x => x.khoa === k); if (r) r.gia_tri = v; else S.cai_dat.push({ khoa: k, gia_tri: v });
}

/* ---------- thông báo ---------- */
function toast(msg, kieu = '') {
  const el = document.createElement('div'); el.className = 'toast ' + kieu; el.innerHTML = msg;
  $('#toasts').appendChild(el); setTimeout(() => el.classList.add('hien'), 10);
  setTimeout(() => { el.classList.remove('hien'); setTimeout(() => el.remove(), 300); }, kieu === 'loi' ? 6000 : 3200);
}
function baoLoi(e) { console.error(e); toast('Lỗi: ' + esc(e.message || e), 'loi'); }

/* ---------- hộp thoại ---------- */
function moHop({ tieuDe, noiDung, rong = false, nut = [], khiMo }) {
  const nen = document.createElement('div'); nen.className = 'hop-nen';
  nen.innerHTML = `<div class="hop ${rong ? 'rong' : ''}" role="dialog" aria-modal="true">
    <div class="hop-dau"><h3>${tieuDe}</h3><button class="nut-x" data-dong aria-label="Đóng">×</button></div>
    <div class="hop-than">${noiDung}</div>
    ${nut.length ? `<div class="hop-chan">${nut.map((n, i) => `<button class="nut ${n.kieu || ''}" data-nut="${i}" ${n.trai ? 'style="margin-right:auto"' : ''}>${n.chu}</button>`).join('')}</div>` : ''}
  </div>`;
  document.body.appendChild(nen);
  const dong = () => { nen.remove(); document.removeEventListener('keydown', esc_); };
  const esc_ = e => { if (e.key === 'Escape') dong(); };
  document.addEventListener('keydown', esc_);
  nen.addEventListener('mousedown', e => { if (e.target === nen) nen._down = true; });
  nen.addEventListener('mouseup', e => { if (e.target === nen && nen._down) dong(); nen._down = false; });
  nen.addEventListener('click', e => { if (e.target.closest('[data-dong]')) dong(); });
  nut.forEach((n, i) => nen.querySelector(`[data-nut="${i}"]`).onclick = async (ev) => {
    const btn = ev.currentTarget; if (btn.disabled) return;
    btn.disabled = true;
    try { const kq = await n.bam(nen, dong); if (kq !== false) dong(); } catch (e) { if (e && e.message) baoLoi(e); }
    finally { btn.disabled = false; }
  });
  if (khiMo) khiMo(nen, dong);
  const f = nen.querySelector('input:not([type=hidden]):not([readonly]),textarea,select'); if (f && !rong) setTimeout(() => f.focus(), 30);
  return { nen, dong };
}
function hoi(cauHoi, chuDongY = 'Đồng ý', kieu = 'chinh') {
  return new Promise(res => {
    moHop({ tieuDe: 'Xác nhận', noiDung: `<p class="hoi">${cauHoi}</p>`, nut: [
      { chu: 'Thôi', bam: () => res(false) },
      { chu: chuDongY, kieu, bam: () => res(true) }] });
    // nếu đóng bằng × hoặc Esc thì coi như Thôi
    const nen = $$('.hop-nen').pop(); new MutationObserver((m, o) => { if (!document.body.contains(nen)) { o.disconnect(); res(false); } }).observe(document.body, { childList: true });
  });
}
function docForm(nen) {
  const o = {};
  $$('[name]', nen).forEach(el => {
    if (el.type === 'checkbox') o[el.name] = el.checked;
    else if (el.type === 'radio') { if (el.checked) o[el.name] = el.value; }
    else if (el.dataset.so != null) { const v = tinhBieuThuc(el.value); o[el.name] = el.value === '' ? null : v == null ? NaN : Math.round(v); }
    else if (el.type === 'number') o[el.name] = el.value === '' ? null : Number(String(el.value).replace(/[.\s]/g, ''));
    else o[el.name] = el.value.trim() === '' ? null : el.value.trim();
  });
  return o;
}
/* ô nhập tiền: tự thêm dấu chấm */
/* máy tính trong ô tiền: 50k+35.000*2, 1,5tr-200k, (120+80)/2 … (bản 5.8) */
function tinhBieuThuc(s) {
  let t = String(s == null ? '' : s).toLowerCase().replace(/\s/g, '').replace(/[×x]/g, '*').replace(/[÷:]/g, '/').replace(/[−–]/g, '-');
  if (!t) return null;
  while (/(\d)\.(\d{3})(?!\d)/.test(t)) t = t.replace(/(\d)\.(\d{3})(?!\d)/g, '$1$2');
  t = t.replace(/,/g, '.').replace(/(\d+(?:\.\d+)?)(tr|k|m|t)/g, (_, n, u) => String(Number(n) * (u === 'k' ? 1e3 : 1e6)));
  if (!/^[\d.+\-*/()]+$/.test(t)) return null;
  let i = 0;
  const so = () => { const m = /^\d+(\.\d+)?|^\.\d+/.exec(t.slice(i)); if (!m) throw 0; i += m[0].length; return Number(m[0]); };
  const yeuTo = () => { if (t[i] === '-') { i++; return -yeuTo(); } if (t[i] === '+') { i++; return yeuTo(); } if (t[i] === '(') { i++; const v = cong(); if (t[i] === ')') i++; return v; } return so(); };
  const nhan = () => { let v = yeuTo(); while (t[i] === '*' || t[i] === '/') { const o = t[i++]; const r = yeuTo(); v = o === '*' ? v * r : v / r; } return v; };
  const cong = () => { let v = nhan(); while (t[i] === '+' || t[i] === '-') { const o = t[i++]; const r = nhan(); v = o === '+' ? v + r : v - r; } return v; };
  try { const v = cong(); return i === t.length && isFinite(v) ? v : null; } catch (e) { return null; }
}
const laBieuThuc = v => /[+\-*/×x÷:()]|\d(k|tr|m)\b/i.test(String(v).replace(/^-/, ''));
function ganOTien(goc) {
  $$('input[data-so]', goc).forEach(el => {
    if (el.dataset.ganTien) return; el.dataset.ganTien = 1;
    let goiY = null;
    if (el.dataset.tinh != null) {
      el.setAttribute('inputmode', 'decimal'); el.setAttribute('autocomplete', 'off');
      goiY = document.createElement('span'); goiY.className = 'tinh-goi-y'; el.insertAdjacentElement('afterend', goiY);
      const bo = document.createElement('span'); bo.className = 'tinh-phim';
      bo.innerHTML = ['+', '−', '×', '÷', '000', 'k', '='].map(k => `<button type="button" tabindex="-1" data-k="${k}">${k}</button>`).join('');
      goiY.insertAdjacentElement('afterend', bo);
      bo.addEventListener('mousedown', e => e.preventDefault());
      bo.addEventListener('click', e => {
        const b = e.target.closest('[data-k]'); if (!b) return; const k = b.dataset.k;
        if (k === '=') chot(); else { el.value += k; capGoiY(); }
        el.focus();
      });
      el.addEventListener('focus', () => bo.classList.add('hien'));
      el.addEventListener('blur', () => { setTimeout(() => bo.classList.remove('hien'), 120); chot(); });
      el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === '=') { if (e.key === '=') e.preventDefault(); chot(); } });
    }
    function capGoiY() { if (!goiY) return; const v = laBieuThuc(el.value) ? tinhBieuThuc(el.value) : null; goiY.textContent = v != null ? '= ' + NF.format(Math.round(v)) : ''; }
    function chot() { if (!laBieuThuc(el.value)) return; const v = tinhBieuThuc(el.value); if (v != null) { el.value = NF.format(Math.max(0, Math.round(v))); capGoiY(); } }
    const fmt = () => {
      if (laBieuThuc(el.value)) { capGoiY(); return; }
      const v = el.value.replace(/\D/g, ''); el.value = v ? NF.format(Number(v)) : ''; capGoiY();
    };
    el.addEventListener('input', fmt); fmt();
  });
}
