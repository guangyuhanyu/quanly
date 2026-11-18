/* =========================================================
   Cá nhân: Rút thăm · Thói quen · Chi tiêu
   + Chi tiết các ô số liệu · Hộp xem một ngày
   ========================================================= */

/* ================= CHI TIẾT Ô SỐ LIỆU ================= */
const GIAI_THICH = {
  thuc_nhan: 'Tổng số tiền học viên đã <b>chuyển cho Thầy</b> trong kỳ, tính theo <b>ngày nhận tiền</b> (mục "Ghi thanh toán"). Đóng trước cả khoá thì cả khoản được tính vào ngày nhận.',
  doanh_thu: 'Giá trị các buổi Thầy <b>thực sự đã dạy</b> trong kỳ. Mỗi buổi được tính bằng <b>học phí khoá ÷ số buổi của khoá</b>. Tiền đóng trước nhưng chưa dạy thì chưa tính vào đây.',
  chua_thuc_hien: 'Phần học phí <b>học viên ĐÃ ĐÓNG nhưng Thầy chưa dạy</b>, tính tới hôm nay: <b>(tiền đã đóng − giá trị các buổi đã dạy)</b>, không vượt quá số buổi còn lại × đơn giá. Khoá chưa đóng tiền không tính vào đây (xem ô Học phí chưa thu). Gồm cả lớp đang bảo lưu buổi.',
  chua_thu: 'Các khoá <b>chưa đóng đủ học phí</b>, tính tới hôm nay: <b>học phí khoá − số tiền đã ghi nhận</b>.',
  buoi_tuan: 'Các buổi đã lên lịch hoặc đã dạy trong tuần này (không tính buổi nghỉ / huỷ).',
};
function moChiTietSo(loai, tu, den, tenKy) {
  let tieuDe = '', bang = '', tong = 0;
  if (loai === 'thuc_nhan') {
    const ds = S.thanh_toan.filter(t => t.ngay >= tu && t.ngay <= den).sort((a, b) => a.ngay < b.ngay ? 1 : -1);
    tong = ds.reduce((s, t) => s + t.so_tien, 0); tieuDe = 'Tiền thực nhận';
    bang = `<table class="bang gon"><thead><tr><th>Ngày nhận</th><th>Mã</th><th>Lớp</th><th>Khoá</th><th class="phai">Số tiền</th><th></th></tr></thead><tbody>
      ${ds.map(t => { const L = lopTheoId(t.lop_id); return `<tr><td>${ngayVN(t.ngay)}</td><td class="ma">${t.ma}</td><td>${L ? tenLop(L) : ''}</td><td class="ma">${(khoaTheoId(t.khoa_id) || {}).ma || ''}</td><td class="phai"><b>${tien(t.so_tien)}</b></td><td class="phai"><button class="nut nho" data-act="sua-tt" data-id="${t.id}">Sửa</button></td></tr>`; }).join('')}</tbody></table>`;
  } else if (loai === 'doanh_thu') {
    const nhom = {};
    S.buoi_hoc.filter(b => tinhBuoi(b) && b.ngay >= tu && b.ngay <= den).forEach(b => { const k = b.khoa_id || 0; (nhom[k] = nhom[k] || { lop: b.lop_id, buoi: [] }).buoi.push(b); });
    const dong = Object.entries(nhom).map(([kid, o]) => { const k = khoaTheoId(Number(kid)); const dg = k ? tk(k).donGiaBuoi : 0; return { L: lopTheoId(o.lop), k, n: o.buoi.length, dg, tt: dg * o.buoi.length }; }).sort((a, b) => b.tt - a.tt);
    tong = dong.reduce((s, x) => s + x.tt, 0); tieuDe = 'Doanh thu đã dạy';
    bang = `<table class="bang gon"><thead><tr><th>Lớp</th><th>Khoá</th><th class="phai">Buổi đã dạy</th><th class="phai">Đơn giá / buổi</th><th class="phai">Thành tiền</th></tr></thead><tbody>
      ${dong.map(x => `<tr><td>${x.L ? tenLop(x.L) : ''}</td><td class="ma">${x.k ? x.k.ma : '—'}</td><td class="phai">${x.n}</td><td class="phai">${tien(x.dg)}</td><td class="phai"><b>${tien(x.tt)}</b></td></tr>`).join('')}</tbody></table>`;
  } else if (loai === 'chua_thuc_hien') {
    const dong = S.khoa_hoc.filter(k => lopTheoId(k.lop_id) && !k.ket_thuc && tk(k).chuaThucHien > 0).map(k => ({ k, L: lopTheoId(k.lop_id), t: tk(k) })).sort((a, b) => b.t.chuaThucHien - a.t.chuaThucHien);
    tong = dong.reduce((s, x) => s + x.t.chuaThucHien, 0); tieuDe = 'Học phí chưa thực hiện';
    bang = `<table class="bang gon"><thead><tr><th>Lớp</th><th>Khoá</th><th class="phai">Đã đóng</th><th class="phai">Buổi đã đóng chưa dạy</th><th class="phai">Đơn giá / buổi</th><th class="phai">Giá trị</th><th>Tình trạng</th><th></th></tr></thead><tbody>
      ${dong.map(x => `<tr><td>${tenLop(x.L)}</td><td class="ma">${x.k.ma}</td><td class="phai">${tien(x.t.daDong)}</td><td class="phai">${(x.t.chuaThucHien / (x.t.donGiaBuoi || 1)).toLocaleString('vi-VN', { maximumFractionDigits: 1 })} / ${x.t.conLai} buổi</td><td class="phai">${tien(x.t.donGiaBuoi)}</td><td class="phai"><b>${tien(x.t.chuaThucHien)}</b></td><td>${x.L.dang_hoat_dong ? the('Đang học', 'xanh') : the('Bảo lưu', 'tt-tam_dung')}</td><td class="phai"><button class="nut nho" data-act="sua-khoa" data-id="${x.k.id}">Sửa khoá</button></td></tr>`).join('')}</tbody></table>
      <p class="mo nho">Lớp nào đã nghỉ hẳn và không học tiếp: Thầy bấm "Sửa khoá" → tick "Đã đóng khoá" để không tính vào đây nữa.</p>`;
  } else if (loai === 'chua_thu') {
    const dong = S.khoa_hoc.filter(k => lopTheoId(k.lop_id) && !k.ket_thuc && tk(k).conNo > 0).map(k => ({ k, L: lopTheoId(k.lop_id), t: tk(k) }));
    tong = dong.reduce((s, x) => s + x.t.conNo, 0); tieuDe = 'Học phí chưa thu';
    bang = `<table class="bang gon"><thead><tr><th>Lớp</th><th>Khoá</th><th class="phai">Học phí</th><th class="phai">Đã đóng</th><th class="phai">Còn thiếu</th><th></th></tr></thead><tbody>
      ${dong.map(x => `<tr><td>${tenLop(x.L)}</td><td class="ma">${x.k.ma}</td><td class="phai">${tien(x.k.hoc_phi)}</td><td class="phai">${tien(x.t.daDong)}</td><td class="phai"><b class="chu-do">${tien(x.t.conNo)}</b></td><td class="phai"><button class="nut nho" data-act="thanh-toan" data-lop="${x.L.id}" data-khoa="${x.k.id}">Ghi đã thu</button></td></tr>`).join('')}</tbody></table>`;
  } else if (loai === 'buoi_tuan') {
    const ds = S.buoi_hoc.filter(b => b.ngay >= tu && b.ngay <= den && b.trang_thai !== 'nghi' && b.trang_thai !== 'huy').sort(soBuoi);
    tong = null; tieuDe = `Buổi dạy tuần này (${ds.length})`;
    bang = `<table class="bang gon"><tbody>${ds.map(b => { const L = lopTheoId(b.lop_id); return `<tr><td class="nowrap">${THU_NGAN[s2d(b.ngay).getDay()]} ${ngayNgan(b.ngay)}</td><td>${b.gio_bat_dau || ''}</td><td>${L ? tenLop(L) : ''}</td><td>${the(TRANG_THAI[b.trang_thai].chu, 'st-' + b.trang_thai)}</td><td class="phai"><button class="nut nho" data-act="mo-buoi" data-id="${b.id}">Mở</button></td></tr>`; }).join('')}</tbody></table>`;
  }
  moHop({
    tieuDe: `${tieuDe}${tenKy ? ` <small class="mo">· ${tenKy}</small>` : ''}`, rong: true,
    noiDung: `<p class="giai-thich-so">${GIAI_THICH[loai]}</p>
      ${tong != null ? `<div class="tong-so"><span>Tổng</span><b>${tien(tong)}</b></div>` : ''}
      <div class="cuon-bang">${bang}</div>`,
    nut: [{ chu: 'Đóng', bam: () => { } }],
    khiMo: n => n.addEventListener('click', e => { if (e.target.closest('[data-act]')) n.querySelector('[data-dong]').click(); }),
  });
}

/* ================= HỘP XEM MỘT NGÀY ================= */
function moNgay(n) {
  const bs = S.buoi_hoc.filter(b => b.ngay === n).sort(soBuoi);
  const vs = S.cong_viec.filter(c => c.han === n);
  const d = s2d(n);
  moHop({
    tieuDe: `${THU[d.getDay()]}, ${ngayVN(n)}`,
    noiDung: `${bs.length ? `<ul class="ds-ngay">${bs.map(b => { const L = lopTheoId(b.lop_id); return `<li data-act="mo-buoi" data-id="${b.id}" style="--mau:${esc(L ? L.mau : '')}"><b>${b.gio_bat_dau || '—'}</b><span>${L ? esc(L.ten) : ''}${b.noi_dung ? `<small>${esc(b.noi_dung)}</small>` : ''}</span>${the(TRANG_THAI[b.trang_thai].chu, 'st-' + b.trang_thai)}</li>`; }).join('')}</ul>` : '<p class="mo">Chưa có buổi học.</p>'}
      ${vs.length ? `<h4 class="tieu-de-nho">Hạn việc</h4><ul class="ds-viec">${vs.map(dongViec).join('')}</ul>` : ''}`,
    nut: [{ chu: 'Xem cả tuần', trai: true, bam: () => { LICH.moc = n; LICH.kieu = 'tuan'; location.hash = '#/lich'; ve(); } },
      { chu: `${ICON.cong} Đặt buổi ngày này`, kieu: 'chinh', bam: () => { setTimeout(() => moBuoi({ ngay: n }), 50); } }],
    khiMo: nn => nn.addEventListener('click', e => { if (e.target.closest('[data-act=mo-buoi],[data-act=sua-viec]')) nn.querySelector('[data-dong]').click(); }),
  });
}

/* ================= RÚT THĂM ================= */
const CHU_DE_THAM = ['Tất cả', 'Dạy học', 'Học tập', 'Sức khoẻ', 'Tài chính', 'Tâm an', 'Của Thầy'];
const RT = { cd: 'Tất cả', dangLac: false, tab: 'la', xemCung: null, ngayCT: null, doiCung: false };
const laRieng = () => caiDat('la_tham_rieng', []) || [];
const tatCaLa = () => [...LA_THAM.map((x, i) => ({ ...x, so: i + 1 })), ...laRieng().map((x, i) => ({ ...x, cd: 'Của Thầy', so: LA_THAM.length + i + 1, rieng: i }))];
function laHomNay() { const r = caiDat('la_tham_hom_nay', null); return r && r.ngay === homNay() ? tatCaLa().find(x => x.so === r.so) : null; }
function theLaTham(la) {
  if (!la) return '';
  return `<div class="la-tham">
    <div class="lt-dau"><span class="lt-so">第 ${String(la.so).padStart(2, '0')} 签</span><span class="the">${esc(la.cd)}</span></div>
    <p class="lt-zh">${esc(la.zh)}</p>
    ${la.py ? `<p class="lt-py">${esc(la.py)}</p>` : ''}
    ${la.nghia ? `<p class="lt-nghia">${esc(la.nghia)}</p>` : ''}
    <div class="lt-kh"><small>Lời khuyên hôm nay</small>${esc(la.kh)}</div>
    <div class="lt-triện">光余</div>
  </div>`;
}
function ongTham() {
  return `<svg viewBox="0 0 200 240" class="ong-tham ${RT.dangLac ? 'lac' : ''}" aria-hidden="true">
    <g class="que">${[30, 52, 74, 96, 118, 140].map((x, i) => `<rect x="${x + 6}" y="${18 + (i % 3) * 8}" width="12" height="130" rx="4" fill="${i === 3 ? 'var(--nhan)' : '#D9B87A'}" stroke="#8A6A3A" stroke-width="1.2" transform="rotate(${(i - 2.5) * 4} ${x + 12} 160)"/>`).join('')}</g>
    <path d="M38 96h124l-10 120a14 14 0 0 1-14 12H62a14 14 0 0 1-14-12z" fill="#7A5A32"/>
    <path d="M38 96h124l-10 120a14 14 0 0 1-14 12H62a14 14 0 0 1-14-12z" fill="url(#tre)"/>
    <defs><linearGradient id="tre" x1="0" x2="1"><stop offset="0" stop-color="#5E4122"/><stop offset=".35" stop-color="#A07A44"/><stop offset=".6" stop-color="#8A6436"/><stop offset="1" stop-color="#4E361C"/></linearGradient></defs>
    <path d="M44 130h112M47 176h106" stroke="#4E361C" stroke-width="3" opacity=".6"/>
    <rect x="78" y="140" width="44" height="34" rx="3" fill="var(--nhan)" opacity=".92"/>
    <text x="100" y="164" text-anchor="middle" font-family="Noto Serif SC, serif" font-size="18" fill="#FBF6E9" font-weight="700">灵签</text>
    <ellipse cx="100" cy="96" rx="62" ry="9" fill="#4E361C"/>
  </svg>`;
}
function vRutTham() {
  return `
  <header class="dau-trang gon"><div><p class="mat-tren">Mỗi ngày một lời khuyên</p><h1>${ICON['chiem-tinh']} Chiêm tinh 星座</h1></div></header>
  ${RT.doiCung ? chonCungHTML() : vChiemTinh()}`;
}
async function rutTham() {
  if (RT.dangLac) return;
  const ds = tatCaLa().filter(x => RT.cd === 'Tất cả' || x.cd === RT.cd);
  if (!ds.length) { toast('Chủ đề này chưa có lá thăm nào', 'loi'); return; }
  const cu = laHomNay();
  let la = ds[Math.floor(Math.random() * ds.length)];
  if (cu && ds.length > 1 && la.so === cu.so) la = ds[(ds.indexOf(la) + 1) % ds.length];
  RT.dangLac = true; $('.ong-tham').classList.add('lac');
  $('#khung-la').innerHTML = '<div class="dang-rut"><p>Đang lắc ống thăm…</p></div>';
  await new Promise(r => setTimeout(r, 1300));
  RT.dangLac = false;
  await luuCaiDat('la_tham_hom_nay', { ngay: homNay(), so: la.so });
  ve(); const k = $('.la-tham'); if (k) k.classList.add('lat');
}
function moThemLa() {
  moHop({
    tieuDe: 'Thêm lá thăm của Thầy',
    noiDung: `<div class="form luoi-form">
      <label class="ca-dong">Câu (tiếng Trung hoặc tiếng Việt)<input name="zh" placeholder="VD：路遥知马力，日久见人心。"></label>
      <label class="ca-dong">Pinyin <small class="mo">(không bắt buộc)</small><input name="py"></label>
      <label class="ca-dong">Nghĩa<input name="nghia"></label>
      <label class="ca-dong">Lời khuyên<textarea name="kh" rows="2"></textarea></label></div>`,
    nut: [{ chu: 'Huỷ', bam: () => { } }, { chu: 'Thêm', kieu: 'chinh', bam: async n => { const f = docForm(n); if (!f.zh || !f.kh) { toast('Cần có câu và lời khuyên', 'loi'); return false; } await luuCaiDat('la_tham_rieng', [...laRieng(), f]); toast('Đã thêm lá thăm ✓'); ve(); } }],
  });
}

/* ================= THÓI QUEN ================= */
const TQ = { ngay: homNay(), chon: null };
const ICON_TQ = ['tai-chinh', 'chay', 'sach', 'nuoc', 'trang', 'tra', 'cong-viec', 'thoi-quen', 'den-long', 'hac', 'lua', 'hoc-vien'];
const MAU_TQ = ['#7C2C20', '#B08A3E', '#3F6B4F', '#2F5D86', '#6A4C93', '#A3445C', '#2F7A73', '#9A5B1F'];
const TQ_GOI_Y = [
  { ten: 'Tiết kiệm', loai: 'so', don_vi: 'đ', muc_tieu: 50000, icon: 'tai-chinh', mau: '#B08A3E' },
  { ten: 'Tập thể dục', loai: 'so', don_vi: 'phút', muc_tieu: 30, icon: 'chay', mau: '#3F6B4F' },
  { ten: 'Học từ mới', loai: 'so', don_vi: 'từ', muc_tieu: 5, icon: 'cong-viec', mau: '#7C2C20' },
  { ten: 'Đọc sách', loai: 'so', don_vi: 'trang', muc_tieu: 10, icon: 'sach', mau: '#6A4C93' },
  { ten: 'Uống đủ nước', loai: 'tich', don_vi: null, muc_tieu: null, icon: 'nuoc', mau: '#2F5D86' },
  { ten: 'Ngủ trước 23h', loai: 'tich', don_vi: null, muc_tieu: null, icon: 'trang', mau: '#2F7A73' },
];
const nkTQ = (hid, ngay) => S.thoi_quen_nhat_ky.find(x => x.thoi_quen_id === hid && x.ngay === ngay);
const giaTriTQ = (hid, ngay) => { const r = nkTQ(hid, ngay); return r ? Number(r.gia_tri) : 0; };
const datTQ = (h, v) => h.loai === 'tich' ? v > 0 : v >= (Number(h.muc_tieu) || 1);
const soTQ = (h, v) => h.don_vi === 'đ' ? tien(v) : `${NF.format(v)}${h.don_vi ? ' ' + h.don_vi : ''}`;
function chuoiTQ(h) {
  let n = 0, d = homNay();
  if (!datTQ(h, giaTriTQ(h.id, d))) d = congNgay(d, -1);
  while (datTQ(h, giaTriTQ(h.id, d)) && n < 999) { n++; d = congNgay(d, -1); }
  return n;
}
async function ghiTQ(h, ngay, v) {
  const r = nkTQ(h.id, ngay);
  if (!v) { if (r) await xoa('thoi_quen_nhat_ky', r.id); }
  else if (r) await luu('thoi_quen_nhat_ky', { gia_tri: v }, r.id);
  else await luu('thoi_quen_nhat_ky', { thoi_quen_id: h.id, ngay, gia_tri: v });
}
function vThoiQuen() {
  if (DBX.thieuBang && DBX.thieuBang.length) return canSQL();
  const ds = S.thoi_quen.filter(h => h.dang_dung !== false).sort((a, b) => (a.thu_tu || 0) - (b.thu_tu || 0) || a.id - b.id);
  const n = TQ.ngay; const hn = homNay();
  const xong = ds.filter(h => datTQ(h, giaTriTQ(h.id, n))).length;
  const thang = n.slice(0, 7);
  const tienTK = ds.filter(h => h.don_vi === 'đ').reduce((s, h) => s + S.thoi_quen_nhat_ky.filter(x => x.thoi_quen_id === h.id && x.ngay.startsWith(thang)).reduce((a, x) => a + Number(x.gia_tri), 0), 0);
  const chuoiMax = ds.reduce((m, h) => Math.max(m, chuoiTQ(h)), 0);
  const h0 = ds.find(h => h.id === TQ.chon) || ds[0];
  return `
  <header class="dau-trang gon"><div><p class="mat-tren">Mỗi ngày một chút</p><h1>${ICON['thoi-quen']} Thói quen</h1></div>
    <div class="nhom-nut"><div class="vien-thang"><button class="nut-tron" data-act="tq-lui">${ICON.trai}</button><span>${n === hn ? 'Hôm nay' : `${THU_NGAN[s2d(n).getDay()]} ${ngayNgan(n)}`}</span><button class="nut-tron" data-act="tq-toi" ${n >= hn ? 'disabled' : ''}>${ICON.phai}</button></div>
    <button class="nut chinh" data-act="tq-moi">${ICON.cong} Thói quen mới</button></div></header>
  ${ds.length ? `
  <div class="o-so">
    <div class="o-so-the"><i class="o-so-icon">${ICON['thoi-quen']}</i><span>Hoàn thành ${n === hn ? 'hôm nay' : ngayNgan(n)}</span><b>${xong}<small>/${ds.length}</small></b><div class="tien-do"><div class="tien-do-cot"><i style="width:${ds.length ? xong / ds.length * 100 : 0}%"></i></div></div></div>
    <div class="o-so-the"><i class="o-so-icon">${ICON.lua}</i><span>Chuỗi dài nhất hiện tại</span><b>${chuoiMax}<small> ngày</small></b><small>giữ lửa mỗi ngày nhé</small></div>
    <div class="o-so-the"><i class="o-so-icon">${ICON['tai-chinh']}</i><span>Đã tiết kiệm tháng ${Number(thang.slice(5))}</span><b>${tienGon(tienTK)}</b><small>${tien(tienTK)}</small></div>
    <div class="o-so-the"><i class="o-so-icon">${ICON['chiem-tinh']}</i><span>Chiêm tinh hôm nay</span>${cungThay() != null ? `<small class="lt-mini">${esc(laSoNgay(cungThay(), homNay()).khuyen)}</small>` : `<a href="#/chiem-tinh">Chọn cung →</a>`}</div>
  </div>
  <div class="luoi-tq">${ds.map(h => theTQ(h, n)).join('')}</div>
  ${h0 ? `<section class="the-giay"><div class="dau-muc"><h2>Lịch sử: ${esc(h0.ten)}</h2><select data-act-change="tq-chon">${ds.map(h => `<option value="${h.id}" ${h.id === h0.id ? 'selected' : ''}>${esc(h.ten)}</option>`).join('')}</select></div>${banDoTQ(h0)}</section>` : ''}`
  : `<section class="the-giay">${oTrong('Thầy chưa có thói quen nào để theo dõi.', `<button class="nut chinh" data-act="tq-goi-y">Tạo 6 thói quen gợi ý</button> <button class="nut" data-act="tq-moi">Tự tạo</button>`)}<p class="mo nho giua">Gợi ý gồm: Tiết kiệm (50.000đ/ngày) · Tập thể dục (30 phút) · Học từ mới (5 từ) · Đọc sách (10 trang) · Uống đủ nước · Ngủ trước 23h</p></section>`}`;
}
function theTQ(h, n) {
  const v = giaTriTQ(h.id, n); const dat = datTQ(h, v); const ch = chuoiTQ(h);
  const p = h.loai === 'tich' ? (v ? 100 : 0) : Math.min(100, v / (Number(h.muc_tieu) || 1) * 100);
  const dai = [...Array(14)].map((_, i) => { const d = congNgay(n, i - 13); const g = giaTriTQ(h.id, d); return `<i class="${datTQ(h, g) ? 'dat' : g ? 'mot-phan' : ''}" title="${ngayNgan(d)}${g ? ': ' + soTQ(h, g) : ''}"></i>`; }).join('');
  const buoc = h.don_vi === 'đ' ? [10000, 20000, 50000] : h.don_vi === 'phút' ? [10, 15, 30] : [1, 5, 10];
  return `<div class="tq-the ${dat ? 'xong' : ''}" style="--mau:${esc(h.mau || '#7C2C20')}">
    <div class="tq-dau"><span class="tq-icon">${ICON[h.icon] || ICON['thoi-quen']}</span><div><b>${esc(h.ten)}</b><small>${h.loai === 'tich' ? 'Đánh dấu mỗi ngày' : `Mục tiêu ${soTQ(h, Number(h.muc_tieu) || 0)}/ngày`}</small></div>
      <button class="nut-x" data-act="tq-sua" data-id="${h.id}" title="Sửa">⋯</button></div>
    ${h.loai === 'tich'
      ? `<button class="tq-tich ${v ? 'on' : ''}" data-act="tq-tich" data-id="${h.id}">${v ? '✓ Đã làm' : 'Đánh dấu đã làm'}</button>`
      : `<div class="tq-nhap"><b>${soTQ(h, v)}</b><div class="tq-buoc">${buoc.map(x => `<button data-act="tq-cong" data-id="${h.id}" data-v="${x}">+${h.don_vi === 'đ' ? tienGon(x) : x}</button>`).join('')}<button data-act="tq-nhap" data-id="${h.id}" title="Nhập số">✎</button></div></div>
         <div class="tien-do"><div class="tien-do-cot"><i style="width:${p}%"></i></div><span>${Math.round(p)}%</span></div>`}
    <div class="tq-chan"><div class="tq-dai">${dai}</div><span class="tq-lua ${ch ? '' : 'tat'}">${ICON.lua}${ch}</span></div>
  </div>`;
}
function banDoTQ(h) {
  const hn = homNay(); const dau = congNgay(dauTuan(hn), -7 * 15);
  let o = ''; let tong = 0, soNgay = 0;
  for (let w = 0; w < 16; w++) {
    o += '<div class="bd-cot">';
    for (let d = 0; d < 7; d++) {
      const n = congNgay(dau, w * 7 + d); const g = giaTriTQ(h.id, n);
      if (g) { tong += g; soNgay++; }
      const muc = n > hn ? 'tuong-lai' : !g ? '' : datTQ(h, g) ? 'm3' : g >= (Number(h.muc_tieu) || 1) / 2 ? 'm2' : 'm1';
      o += `<i class="${muc}" title="${ngayVN(n)}${g ? ': ' + soTQ(h, g) : ''}"></i>`;
    }
    o += '</div>';
  }
  return `<div class="ban-do" style="--mau:${esc(h.mau)}"><div class="bd-thu"><span>T2</span><span></span><span>T4</span><span></span><span>T6</span><span></span><span>CN</span></div>${o}</div>
    <p class="mo nho">16 tuần gần nhất · ${soNgay} ngày có ghi nhận${h.loai === 'so' ? ` · tổng ${soTQ(h, tong)}` : ''}</p>`;
}
function moTQ(id) {
  const h = id ? S.thoi_quen.find(x => x.id === id) : null;
  moHop({
    tieuDe: h ? 'Sửa thói quen' : 'Thói quen mới',
    noiDung: `<div class="form luoi-form">
      <label class="ca-dong">Tên thói quen<input name="ten" value="${esc(h ? h.ten : '')}" placeholder="VD: Luyện chữ Hán, Thiền 10 phút…"></label>
      <label>Cách ghi<select name="loai"><option value="so">Nhập số (tiền, phút, số từ…)</option><option value="tich" ${h && h.loai === 'tich' ? 'selected' : ''}>Chỉ đánh dấu có / không</option></select></label>
      <label>Đơn vị<input name="don_vi" value="${esc(h ? h.don_vi || '' : '')}" placeholder="đ, phút, từ, trang…"></label>
      <label>Mục tiêu mỗi ngày<input type="number" name="muc_tieu" value="${h ? h.muc_tieu || '' : ''}"></label>
      <span></span>
      <div class="ca-dong"><span class="nhan">Biểu tượng</span><div class="chon-icon">${ICON_TQ.map(k => `<label><input type="radio" name="icon" value="${k}" ${(h ? h.icon : 'thoi-quen') === k ? 'checked' : ''}><span>${ICON[k]}</span></label>`).join('')}</div></div>
      <div class="ca-dong"><span class="nhan">Màu</span><div class="gd-mau">${MAU_TQ.map(m => `<label class="o-mau" style="--m:${m}"><input type="radio" name="mau" value="${m}" ${(h ? h.mau : MAU_TQ[S.thoi_quen.length % MAU_TQ.length]) === m ? 'checked' : ''}><span></span></label>`).join('')}</div></div>
    </div>`,
    nut: [
      ...(h ? [{ chu: 'Xoá', kieu: 'nguy', trai: true, bam: async () => { if (!(await hoi(`Xoá thói quen "${esc(h.ten)}" và toàn bộ lịch sử?`, 'Xoá', 'nguy'))) return false; await xoa('thoi_quen', h.id); S.thoi_quen_nhat_ky = S.thoi_quen_nhat_ky.filter(x => x.thoi_quen_id !== h.id); ve(); } }] : []),
      { chu: 'Huỷ', bam: () => { } },
      { chu: 'Lưu', kieu: 'chinh', bam: async n => { const f = docForm(n); if (!f.ten) return false; await luu('thoi_quen', { ten: f.ten, loai: f.loai, don_vi: f.loai === 'tich' ? null : f.don_vi, muc_tieu: f.loai === 'tich' ? null : f.muc_tieu, icon: f.icon, mau: f.mau, dang_dung: true, thu_tu: h ? h.thu_tu : S.thoi_quen.length }, h && h.id); ve(); } }],
  });
}
function nhapTQ(h) {
  const v = giaTriTQ(h.id, TQ.ngay);
  moHop({
    tieuDe: `${esc(h.ten)} · ${TQ.ngay === homNay() ? 'hôm nay' : ngayVN(TQ.ngay)}`,
    noiDung: `<div class="form"><label>Số ${esc(h.don_vi || '')}<input ${h.don_vi === 'đ' ? 'data-so' : 'type="number"'} name="v" value="${v || ''}"></label></div>`,
    nut: [{ chu: 'Huỷ', bam: () => { } }, { chu: 'Lưu', kieu: 'chinh', bam: async n => { const f = docForm(n); await ghiTQ(h, TQ.ngay, f.v || 0); ve(); } }],
    khiMo: ganOTien,
  });
}
function canSQL() {
  return `<section class="the-giay">${oTrong('Mục này cần thêm bảng dữ liệu mới trên Supabase.', '')}
    <p class="giua">Thầy mở Supabase → <b>SQL Editor</b>, dán file <code>supabase/3-cap-nhat-ca-nhan.sql</code> rồi bấm <b>Run</b>, sau đó tải lại trang. Dữ liệu lớp học cũ không bị ảnh hưởng.</p></section>`;
}

/* ================= CHI TIÊU ================= */
const CT = { thang: homNay().slice(0, 7), loai: 'chi', locDm: null };
const DM_CHI_MD = ['Ăn uống', 'Đi lại', 'Nhà cửa', 'Hoá đơn', 'Mua sắm', 'Sức khoẻ', 'Học tập', 'Gia đình', 'Giải trí', 'Quà tặng', 'Khác'];
const DM_THU_MD = ['Thu khác', 'Thưởng', 'Đầu tư', 'Được tặng'];
const MAU_DM = ['#7C2C20', '#B08A3E', '#3F6B4F', '#2F5D86', '#6A4C93', '#A3445C', '#2F7A73', '#9A5B1F', '#56707A', '#C0582E', '#8A7F76'];
const dmChi = () => caiDat('danh_muc_chi', DM_CHI_MD) || DM_CHI_MD;
const dmThu = () => caiDat('danh_muc_thu', DM_THU_MD) || DM_THU_MD;
const mauDm = dm => MAU_DM[Math.max(0, dmChi().indexOf(dm)) % MAU_DM.length];
function vChiTieu() {
  if (DBX.thieuBang && DBX.thieuBang.length) return canSQL();
  const th = CT.thang; const [y, m] = th.split('-').map(Number);
  const tu = `${th}-01`, den = `${th}-${pad(new Date(y, m, 0).getDate())}`;
  const ds = S.chi_tieu.filter(x => x.ngay >= tu && x.ngay <= den).sort((a, b) => a.ngay < b.ngay ? 1 : a.ngay > b.ngay ? -1 : b.id - a.id);
  const chi = ds.filter(x => x.loai === 'chi'), thu = ds.filter(x => x.loai === 'thu');
  const tongChi = chi.reduce((s, x) => s + x.so_tien, 0), tongThu = thu.reduce((s, x) => s + x.so_tien, 0);
  const day = tongKy(tu, den).thucNhan;
  const conLai = day + tongThu - tongChi;
  const ns = Number(caiDat('ngan_sach_thang', 0)) || 0;
  const theoDm = {}; chi.forEach(x => theoDm[x.danh_muc || 'Khác'] = (theoDm[x.danh_muc || 'Khác'] || 0) + x.so_tien);
  const dmSap = Object.entries(theoDm).sort((a, b) => b[1] - a[1]);
  const hienDs = CT.locDm ? ds.filter(x => (x.danh_muc || 'Khác') === CT.locDm) : ds;
  const theoNgay = {}; hienDs.forEach(x => (theoNgay[x.ngay] = theoNgay[x.ngay] || []).push(x));
  const dmHien = CT.loai === 'chi' ? dmChi() : dmThu();
  return `
  <header class="dau-trang gon"><div><p class="mat-tren">Sổ thu chi cá nhân</p><h1>${ICON['chi-tieu']} Chi tiêu</h1></div>
    <div class="nhom-nut"><div class="vien-thang"><button class="nut-tron" data-act="ct-lui">${ICON.trai}</button><span>Tháng ${m}/${y}</span><button class="nut-tron" data-act="ct-toi">${ICON.phai}</button></div></div></header>
  <div class="o-so">
    <div class="o-so-the xanh" data-act="chi-tiet-so" data-loai="thuc_nhan" data-tu="${tu}" data-den="${den}" data-ten="Tháng ${m}/${y}"><i class="o-so-icon">${ICON['tai-chinh']}</i><span>Thu từ dạy học</span><b>${tien(day)}</b><small>tự lấy từ mục Tài chính</small></div>
    <div class="o-so-the"><i class="o-so-icon">${ICON['tui-gam']}</i><span>Thu khác</span><b>${tien(tongThu)}</b><small>${thu.length} khoản</small></div>
    <div class="o-so-the canh"><i class="o-so-icon">${ICON['chi-tieu']}</i><span>Đã chi</span><b>${tien(tongChi)}</b>${ns ? `<div class="tien-do ${tongChi > ns ? 'vuot' : ''}"><div class="tien-do-cot"><i style="width:${Math.min(100, tongChi / ns * 100)}%"></i></div><span>${Math.round(tongChi / ns * 100)}%</span></div><small>ngân sách ${tien(ns)}</small>` : `<small>${chi.length} khoản</small>`}</div>
    <div class="o-so-the ${conLai < 0 ? 'canh' : 'xanh'}"><i class="o-so-icon">${ICON['ban-tinh']}</i><span>Còn lại tháng này</span><b>${tien(conLai)}</b><small>thu dạy + thu khác − chi</small></div>
  </div>
  <form class="them-nhanh lon ct-form" data-form="chi-tieu">
    <div class="phan-doan"><button type="button" data-act="ct-loai" data-v="chi" class="${CT.loai === 'chi' ? 'on' : ''}">Chi</button><button type="button" data-act="ct-loai" data-v="thu" class="${CT.loai === 'thu' ? 'on' : ''}">Thu</button></div>
    <input data-so name="so_tien" placeholder="Số tiền" autocomplete="off" inputmode="numeric">
    <select name="danh_muc">${dmHien.map(d => `<option>${esc(d)}</option>`).join('')}</select>
    <input name="ghi_chu" placeholder="Ghi chú (VD: cà phê với bạn)">
    <input type="date" name="ngay" value="${th === homNay().slice(0, 7) ? homNay() : tu}">
    <button class="nut chinh">Ghi</button>
  </form>
  <div class="luoi-2 rong-trai">
    <section class="the-giay"><div class="dau-muc"><h2>Giao dịch${CT.locDm ? ` · ${esc(CT.locDm)} <button class="nut nho" data-act="ct-bo-loc">Bỏ lọc ×</button>` : ''}</h2><small class="mo">${hienDs.length} khoản</small></div>
      ${Object.keys(theoNgay).length ? Object.entries(theoNgay).map(([n, xs]) => `<div class="ct-ngay"><h4>${THU[s2d(n).getDay()]}, ${ngayNgan(n)}<span>${tien(xs.reduce((s, x) => s + (x.loai === 'chi' ? -x.so_tien : x.so_tien), 0))}</span></h4>
        ${xs.map(x => `<div class="ct-dong" data-act="ct-sua" data-id="${x.id}"><i class="cham" style="--mau:${x.loai === 'thu' ? '#3F6B4F' : mauDm(x.danh_muc)}"></i><span><b>${esc(x.danh_muc || '')}</b>${x.ghi_chu ? `<small>${esc(x.ghi_chu)}</small>` : ''}</span><b class="${x.loai === 'thu' ? 'chu-xanh' : ''}">${x.loai === 'thu' ? '+' : '−'}${tien(x.so_tien)}</b></div>`).join('')}</div>`).join('') : oTrong('Tháng này chưa ghi khoản nào.')}
    </section>
    <section class="the-giay"><div class="dau-muc"><h2>Chi theo mục</h2><button class="nut nho" data-act="ct-cai">Ngân sách & danh mục</button></div>
      ${dmSap.length ? `<div class="ct-dm">${dmSap.map(([d, v]) => `<button class="ct-dm-dong ${CT.locDm === d ? 'on' : ''}" data-act="ct-loc" data-v="${esc(d)}"><span><i class="cham" style="--mau:${mauDm(d)}"></i>${esc(d)}</span><b>${tien(v)}</b><div class="tien-do-cot"><i style="width:${v / dmSap[0][1] * 100}%;background:${mauDm(d)}"></i></div><small>${Math.round(v / tongChi * 100)}%</small></button>`).join('')}</div>` : oTrong('Chưa có khoản chi.')}
    </section>
  </div>`;
}
function moCT(id) {
  const x = S.chi_tieu.find(c => c.id === id);
  const dms = x.loai === 'chi' ? dmChi() : dmThu();
  moHop({
    tieuDe: x.loai === 'chi' ? 'Sửa khoản chi' : 'Sửa khoản thu',
    noiDung: `<div class="form luoi-form">
      <label>Số tiền<input data-so name="so_tien" value="${x.so_tien}"></label>
      <label>Ngày<input type="date" name="ngay" value="${x.ngay}"></label>
      <label>Danh mục<select name="danh_muc">${[...new Set([...dms, x.danh_muc].filter(Boolean))].map(d => `<option ${d === x.danh_muc ? 'selected' : ''}>${esc(d)}</option>`).join('')}</select></label>
      <label>Ghi chú<input name="ghi_chu" value="${esc(x.ghi_chu || '')}"></label></div>`,
    nut: [{ chu: 'Xoá', kieu: 'nguy', trai: true, bam: async () => { await xoa('chi_tieu', x.id); ve(); } }, { chu: 'Huỷ', bam: () => { } },
      { chu: 'Lưu', kieu: 'chinh', bam: async n => { const f = docForm(n); await luu('chi_tieu', f, x.id); ve(); } }],
    khiMo: ganOTien,
  });
}
function moCaiCT() {
  moHop({
    tieuDe: 'Ngân sách & danh mục',
    noiDung: `<div class="form">
      <label>Ngân sách chi mỗi tháng <small class="mo">(để trống nếu không cần)</small><input data-so name="ns" value="${caiDat('ngan_sach_thang', '') || ''}"></label>
      <label>Danh mục chi <small class="mo">(mỗi dòng một mục)</small><textarea name="chi" rows="6">${esc(dmChi().join('\n'))}</textarea></label>
      <label>Danh mục thu<textarea name="thu" rows="3">${esc(dmThu().join('\n'))}</textarea></label></div>`,
    nut: [{ chu: 'Huỷ', bam: () => { } }, { chu: 'Lưu', kieu: 'chinh', bam: async n => {
      const f = docForm(n); const tach = s => (s || '').split('\n').map(x => x.trim()).filter(Boolean);
      await luuCaiDat('ngan_sach_thang', f.ns || 0); await luuCaiDat('danh_muc_chi', tach(f.chi)); await luuCaiDat('danh_muc_thu', tach(f.thu)); ve();
    } }],
    khiMo: ganOTien,
  });
}

/* ================= KHỐI NHỎ TRÊN TRANG CHỦ ================= */
function khoiCaNhanHomNay() {
  const hs = S.thoi_quen.filter(h => h.dang_dung !== false).sort((a, b) => (a.thu_tu || 0) - (b.thu_tu || 0) || a.id - b.id);
  const hn = homNay();
  return `<div class="luoi-2">
    <section class="the-giay"><div class="dau-muc"><h2 class="co-icon">${ICON['thoi-quen']}Thói quen hôm nay</h2><a href="#/thoi-quen">Mở →</a></div>
      ${hs.length ? `<div class="tq-nhanh">${hs.map(h => { const v = giaTriTQ(h.id, hn); const dat = datTQ(h, v); return `<button class="tq-chip ${dat ? 'on' : ''}" style="--mau:${esc(h.mau)}" data-act="${h.loai === 'tich' ? 'tq-tich' : 'tq-nhap'}" data-id="${h.id}" data-nhanh="1"><span>${ICON[h.icon] || ICON['thoi-quen']}</span>${esc(h.ten)}${h.loai === 'so' ? `<small>${v ? soTQ(h, v) : '—'}</small>` : dat ? '<small>✓</small>' : ''}</button>`; }).join('')}</div>`
        : `<p class="mo">Chưa có thói quen. <a href="#/thoi-quen">Tạo ngay →</a></p>`}
    </section>
    <section class="the-giay"><div class="dau-muc"><h2 class="co-icon">${ICON['chiem-tinh']}Chiêm tinh hôm nay</h2><a href="#/chiem-tinh">Mở →</a></div>
      ${cungThay() != null ? theCTHomNay() : `<p class="mo">Thầy chưa chọn cung hoàng đạo.</p><a class="nut" href="#/chiem-tinh">Chọn cung</a>`}
    </section>
  </div>`;
}
