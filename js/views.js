/* =========================================================
   Các trang: Hôm nay · Lịch dạy · Lớp học · Học viên · Tài chính · Công việc · Cài đặt
   ========================================================= */
const TRANG_THAI = {
  du_kien: { chu: 'Dự kiến', zh: '待上' }, da_day: { chu: 'Đã dạy', zh: '已上' },
  nghi: { chu: 'Nghỉ', zh: '请假' }, huy: { chu: 'Huỷ', zh: '取消' },
};
const LICH = { kieu: 'thang', moc: homNay(), loai: 'tat_ca', tab: 'lop', loc: null, moRong: {} };
const LOC_LOP = { tim: '', trang: 'dang_hoc' };
const LOC_HV = { tim: '' };
const TC = { ky: 'thang', moc: homNay() };
const CV = { nhom: 'Tất cả', hienXong: false };
const CHON_KHOA = {};
const NHOM_VIEC = ['Dạy học', 'Soạn bài', 'Tuyển sinh', 'Quản lý', 'Cá nhân'];
let bieuDo = null;

function chamMau(L) { return `<i class="cham" style="--mau:${esc((L && L.mau) || '#7C2C20')}"></i>`; }
function tenLop(L, link = true) { return link ? `<a href="#/lop/${L.id}" class="ten-lop">${chamMau(L)}${esc(L.ten)}</a>` : `${chamMau(L)}${esc(L.ten)}`; }
function the(chu, kieu = '') { return `<span class="the ${kieu}">${chu}</span>`; }
function thanhTienDo(t) {
  const p = t.tong > 0 ? Math.min(100, Math.max(0, t.daHoc / t.tong * 100)) : 0;
  return `<div class="tien-do"><div class="tien-do-cot"><i style="width:${p}%"></i></div><span>${luongNgan(t, t.daHoc)}/${luongNgan(t, t.tong)}</span></div>`;
}
function thuTuBuoi(b) {
  const k = khoaTheoId(b.khoa_id); if (!k) return '';
  const t = tk(k);
  if (tinhBuoi(b)) return `${t.daDay.findIndex(x => x.id === b.id) + 1}${t.theoGio ? '' : '/' + t.tong}`;
  if (b.trang_thai === 'du_kien') { const i = t.duKien.findIndex(x => x.id === b.id); return t.theoGio ? `${t.soBuoiDay + i + 1}` : `${t.daHoc + i + 1}/${t.tong}`; }
  return '';
}
function oTrong(chu, nut = '') { return `<div class="o-trong"><p>${chu}</p>${nut}</div>`; }

/* ================= VIỆC WEB TỰ NHẮC ================= */
function viecTuNhac() {
  const ds = []; const hn = homNay(); const batDau = caiDat('ngay_dung_web', hn);
  S.lop.filter(L => L.dang_hoat_dong).forEach(L => {
    const k = khoaHienTai(L.id); if (!k) return; const t = tk(k);
    const coKhoaSau = khoaCuaLop(L.id).some(x => x.id > k.id);
    if (coKhoaSau) return;
    if (t.conLai <= 0) ds.push({ muc: 1, icon: '◆', chu: `${esc(L.ten)}: hết ${t.theoGio ? 'giờ học' : 'buổi'} – gợi ý khoá tiếp theo`, lop: L, act: `data-act="tin-gia-han" data-lop="${L.id}"`, nut: 'Soạn tin' });
    else if (t.conLai <= nguongGiaHan()) ds.push({ muc: 2, icon: '◇', chu: `${esc(L.ten)}: còn ${luongChu(t, t.conLai)} – gợi ý khoá tiếp theo`, lop: L, act: `data-act="tin-gia-han" data-lop="${L.id}"`, nut: 'Soạn tin' });
  });
  S.khoa_hoc.filter(k => !k.ket_thuc && lopTheoId(k.lop_id)).forEach(k => {
    const t = tk(k); const L = lopTheoId(k.lop_id); if (!L || t.conNo <= 0) return;
    ds.push({ muc: 2, icon: '₫', chu: `${esc(L.ten)}: chưa thu ${tien(t.conNo)} (khoá ${k.ma})`, lop: L, act: `data-act="thanh-toan" data-lop="${L.id}" data-khoa="${k.id}"`, nut: 'Ghi đã thu' });
    if (!k.khoa_truoc_id && !k.da_gui_thong_tin && (k.created_at || '').slice(0, 10) >= batDau)
      ds.push({ muc: 2, icon: '✉', chu: `${esc(L.ten)}: lớp mới – gửi PNG Thông tin lớp học`, lop: L, act: `data-act="xuat-png" data-lop="${L.id}" data-mau="01"`, nut: 'Xuất PNG' });
  });
  S.hoc_vien.forEach(h => { const n = sinhNhatSap(h); if (n == null || n > 3) return;
    ds.push({ muc: n === 0 ? 0 : 3, icon: '🎂', chu: n === 0 ? `Hôm nay sinh nhật <b>${esc(h.ten_goi || h.ho_ten)}</b> – gửi lời chúc nhé` : `${esc(h.ten_goi || h.ho_ten)} sắp sinh nhật (${ngayNgan(congNgay(homNay(), n))}, còn ${n} ngày)`, act: `data-act="chuc-sn" data-id="${h.id}"`, nut: 'Soạn lời chúc' }); });
  const gioNay = new Date().getHours() * 60 + new Date().getMinutes();
  S.buoi_hoc.filter(b => b.trang_thai === 'du_kien' && (b.ngay < hn || (b.ngay === hn && b.gio_bat_dau && gio2phut(b.gio_bat_dau) + (b.thoi_luong_phut || 90) <= gioNay)))
    .sort(soBuoi).forEach(b => { const L = lopTheoId(b.lop_id); if (L) ds.push({ muc: 1, icon: '◷', chu: `${esc(L.ten)}: buổi ${ngayNgan(b.ngay)} chưa xác nhận đã dạy hay nghỉ`, lop: L, act: `data-act="mo-buoi" data-id="${b.id}"`, nut: 'Xác nhận' }); });
  S.buoi_hoc.filter(b => b.trang_thai === 'da_day' && !b.noi_dung && b.ngay >= batDau && b.ngay >= congNgay(hn, -14))
    .forEach(b => { const L = lopTheoId(b.lop_id); if (L) ds.push({ muc: 3, icon: '✎', chu: `${esc(L.ten)}: chưa ghi nội dung buổi ${ngayNgan(b.ngay)}`, lop: L, act: `data-act="mo-buoi" data-id="${b.id}"`, nut: 'Ghi' }); });
  return ds.sort((a, b) => a.muc - b.muc);
}
function dongViecTuNhac(v) {
  return `<li class="viec tu-nhac m${v.muc}"><span class="viec-icon">${v.icon}</span><span class="viec-chu">${v.chu}</span><button class="nut nho" ${v.act}>${v.nut}</button></li>`;
}
function dongViec(c) {
  const L = c.lop_id ? lopTheoId(c.lop_id) : null; const hn = homNay();
  const han = c.han ? `<span class="han ${!c.xong && c.han < hn ? 'tre' : c.han === hn ? 'nay' : ''}">${c.han === hn ? 'Hôm nay' : ngayNgan(c.han)}</span>` : '';
  return `<li class="viec ${c.xong ? 'xong' : ''} ut${c.uu_tien || 2}">
    <label class="hop-chon"><input type="checkbox" data-act="xong-viec" data-id="${c.id}" ${c.xong ? 'checked' : ''}><i></i></label>
    <span class="viec-chu" data-act="sua-viec" data-id="${c.id}">${esc(c.tieu_de)}${L ? ` <small>· ${esc(L.ten)}</small>` : ''}${c.ghi_chu ? `<small class="mo"> — ${esc(c.ghi_chu)}</small>` : ''}</span>
    <span class="nhom-viec">${esc(c.nhom || '')}</span>${han}</li>`;
}

/* ================= HÔM NAY ================= */
function vHomNay() {
  const hn = homNay(); const d = new Date();
  const buoiNay = S.buoi_hoc.filter(b => b.ngay === hn && b.trang_thai !== 'huy').sort(soBuoi);
  const tuan = dauTuan(hn);
  const soTuan = S.buoi_hoc.filter(b => b.ngay >= tuan && b.ngay <= congNgay(tuan, 6) && b.trang_thai !== 'huy' && b.trang_thai !== 'nghi').length;
  const thang = tongKy(hn.slice(0, 8) + '01', hn.slice(0, 8) + '31');
  const ht = tongHienTai();
  const tuNhac = viecTuNhac();
  const viec = S.cong_viec.filter(c => !c.xong).sort((a, b) => (a.han || '9999') < (b.han || '9999') ? -1 : 1);
  const toi = [];
  for (let i = 1; i <= 7; i++) { const n = congNgay(hn, i); const bs = S.buoi_hoc.filter(b => b.ngay === n && b.trang_thai === 'du_kien').sort(soBuoi); if (bs.length) toi.push([n, bs]); }
  return `
  <header class="dau-trang">
    <div><p class="mat-tren">${THU[d.getDay()]}, ${ngayVN(hn)}</p>${(() => { try { const nh = AL.nhac(hn); return `<p class="am-lich">☾ Âm lịch ${AL.chu(hn)}${nh ? ` <span class="al-nhac ${nh.hom}">${nh.hom === 'nay' ? '🪷' : '🕯'} ${nh.chu}</span>` : ''}</p>`; } catch (e) { return ''; } })()}<h1>${loiChao().chu} <span class="chao-zh">${loiChao().zh}</span></h1><p class="phu">${ngayOff(hn) ? `🏮 Hôm nay Thầy off: <b>${esc(ngayOff(hn).ten)}</b>. ` : ''}Hôm nay có ${buoiNay.filter(b => b.trang_thai !== 'nghi').length} buổi dạy và ${tuNhac.length + viec.length} việc cần để ý.</p></div>

    <div class="nhom-nut">${typeof nutMuaNhanh === 'function' ? nutMuaNhanh() : ''}<button class="nut" data-act="them-viec">＋ Việc</button><button class="nut chinh" data-act="them-buoi" data-ngay="${hn}">＋ Đặt buổi học</button></div>
  </header>
  ${theDemNguoc()}
    <section class="the-giay lich-hom-nay">
      <div class="dau-muc"><h2 class="co-icon">${ICON.lich}Lịch dạy hôm nay</h2><a href="#/lich">Mở lịch →</a></div>
      <div class="lhn-luoi"><div>
      ${buoiNay.length ? `<ul class="ds-buoi">${buoiNay.map(theBuoiHomNay).join('')}</ul>` : oTrong('Hôm nay chưa có buổi nào trên lịch.', `<button class="nut" data-act="them-buoi" data-ngay="${hn}">＋ Đặt buổi</button>`)}
      </div><div class="lhn-toi">
      ${toi.length ? `<div class="dau-muc nho"><h3>7 ngày tới</h3></div><ul class="ds-toi">${toi.map(([n, bs]) => `<li><span class="ngay-toi">${THU_NGAN[s2d(n).getDay()]} ${ngayNgan(n)}</span><span>${bs.map(b => { const L = lopTheoId(b.lop_id); return `<button class="chip" data-act="mo-buoi" data-id="${b.id}">${b.gio_bat_dau || '—'} ${chamMau(L)}${esc(L ? L.ten : '')}</button>`; }).join('')}</span></li>`).join('')}</ul>` : '<p class="mo nho">7 ngày tới chưa có buổi nào.</p>'}
      </div></div>
    </section>
  ${theTongKetHomNay()}
  ${typeof hsHomNay === 'function' ? hsHomNay() : ''}
  ${theChiemTinhHomNay()}
  <div class="o-so">
    <div class="o-so-the bam" data-act="chi-tiet-so" data-loai="buoi_tuan" data-tu="${tuan}" data-den="${congNgay(tuan, 6)}"><i class="o-so-icon">${ICON['den-long']}</i><span>Buổi dạy tuần này</span><b>${soTuan}</b><small>${ngayNgan(tuan)} – ${ngayNgan(congNgay(tuan, 6))}</small></div>
    <div class="o-so-the bam" data-act="chi-tiet-so" data-loai="thuc_nhan" data-tu="${hn.slice(0, 8)}01" data-den="${hn.slice(0, 8)}31" data-ten="Tháng ${d.getMonth() + 1}"><i class="o-so-icon">${ICON['tai-chinh']}</i><span>Thực nhận tháng ${d.getMonth() + 1}</span><b>${tienGon(thang.thucNhan)}</b><small>${tien(thang.thucNhan)}</small></div>
    <div class="o-so-the bam" data-act="chi-tiet-so" data-loai="doanh_thu" data-tu="${hn.slice(0, 8)}01" data-den="${hn.slice(0, 8)}31" data-ten="Tháng ${d.getMonth() + 1}"><i class="o-so-icon">${ICON['ban-tinh']}</i><span>Doanh thu đã dạy tháng ${d.getMonth() + 1}</span><b>${tienGon(thang.doanhThu)}</b><small>${thang.buoi.length} buổi</small></div>
    <div class="o-so-the canh bam" data-act="chi-tiet-so" data-loai="chua_thu"><i class="o-so-icon">${ICON['tui-gam']}</i><span>Học phí chưa thu</span><b>${tienGon(ht.chuaThu)}</b><small>${tien(ht.chuaThu)}</small></div>
  </div>
  <div class="luoi-2">
    <section class="the-giay">
      <div class="dau-muc"><h2 class="co-icon">${ICON['cong-viec']}Việc cần làm</h2><a href="#/cong-viec">Tất cả →</a></div>
      <form class="them-nhanh" data-form="viec-nhanh"><input name="tieu_de" placeholder="Thêm việc nhanh… (Enter)" autocomplete="off"><input type="date" name="han" value="${hn}"></form>
      <ul class="ds-viec">${tuNhac.slice(0, 12).map(dongViecTuNhac).join('')}${viec.slice(0, 10).map(dongViec).join('')}</ul>
      ${!tuNhac.length && !viec.length ? oTrong('Không còn việc nào. Thầy nghỉ ngơi nhé!') : ''}
    </section>
    ${khoiCaNhanHomNay(true)}
  </div>`;
}
function theBuoiHomNay(b) {
  const L = lopTheoId(b.lop_id); const k = khoaTheoId(b.khoa_id);
  const truoc = S.buoi_hoc.filter(x => x.lop_id === b.lop_id && x.trang_thai === 'da_day' && soBuoi(x, b) < 0).sort(soBuoi).pop();
  return `<li class="buoi-the st-${b.trang_thai}" style="--chu:${mauChu(L ? L.mau : '')};--mau:${esc(L ? L.mau : '')}">
    <div class="buoi-gio"><b>${b.gio_bat_dau || '—'}</b><small>${thoiLuongChu(b.thoi_luong_phut)}</small></div>
    <div class="buoi-noi">
      <div>${L ? tenLop(L) : ''} ${the(TRANG_THAI[b.trang_thai].chu, 'st-' + b.trang_thai)} ${k ? `<small class="mo">Buổi ${thuTuBuoi(b)} · ${k.ma}</small>` : ''}</div>
      ${b.noi_dung ? `<p>${esc(b.noi_dung)}</p>` : truoc && truoc.noi_dung ? `<p class="mo">Bài trước (${ngayNgan(truoc.ngay)}): ${esc(truoc.noi_dung)}</p>` : ''}
      ${(() => { const dy = hvCuaLop(b.lop_id).filter(h => h.diem_yeu); return dy.length ? `<p class="diem-yeu nho">⚠ ${dy.map(h => (dy.length > 1 ? esc(h.ten_goi || h.ho_ten) + ': ' : '') + esc(h.diem_yeu)).join(' · ')}</p>` : ''; })()}
    </div>
    <div class="buoi-nut">${b.trang_thai === 'du_kien' ? `<button class="nut nho chinh" data-act="mo-buoi" data-id="${b.id}" data-dat="da_day">Đã dạy</button><button class="nut nho" data-act="mo-buoi" data-id="${b.id}" data-dat="nghi">Nghỉ</button>` : `<button class="nut nho" data-act="mo-buoi" data-id="${b.id}">Sửa</button>`}</div>
  </li>`;
}

/* ================= LỊCH DẠY ================= */
const GIO_DAU = 7 * 60, GIO_CUOI = 23 * 60, O = 22; // 1 ô = 30 phút
function vLich() {
  const thang = Number(LICH.moc.slice(5, 7)), nam = LICH.moc.slice(0, 4);
  const tieuDe = LICH.kieu === 'tuan'
    ? (() => { const a = dauTuan(LICH.moc), b = congNgay(a, 6); return `${ngayNgan(a)} – ${ngayVN(b)}`; })()
    : `Tháng ${thang}, ${nam}`;
  const Lloc = LICH.loc ? lopTheoId(LICH.loc) : null;
  return `<div class="lich-bo">
    ${lichBen()}
    <div class="lich-chinh">
      <div class="lich-dau">
        <h1>${tieuDe}</h1>
        <div class="nhom-nut">
          <div class="phan-doan">${[['buoi', 'Buổi học'], ['viec', 'Công việc'], ['tat_ca', 'Tất cả']].map(([v, c]) => `<button data-act="lich-loai" data-v="${v}" class="${LICH.loai === v ? 'on' : ''}">${c}</button>`).join('')}</div>
          <div class="vien-thang"><button class="nut-tron" data-act="lich-lui" aria-label="Trước">${ICON.trai}</button><span>${LICH.kieu === 'tuan' ? 'Tuần ' + ngayNgan(dauTuan(LICH.moc)) : 'Tháng ' + thang}</span><button class="nut-tron" data-act="lich-toi" aria-label="Sau">${ICON.phai}</button></div>
          <button class="nut" data-act="lich-nay">Hôm nay</button>
          <div class="phan-doan"><button data-act="lich-kieu" data-v="tuan" class="${LICH.kieu === 'tuan' ? 'on' : ''}">Tuần</button><button data-act="lich-kieu" data-v="thang" class="${LICH.kieu === 'thang' ? 'on' : ''}">Tháng</button></div>
          <button class="nut" data-act="ngay-off" data-ngay="${LICH.kieu === 'tuan' ? homNay() : LICH.moc}">🏮 Ngày off</button>
          <button class="nut-tron vien" data-act="lich-apple" title="Lịch Apple & cài đặt">${ICON['cai-dat']}</button>
          <button class="nut chinh" data-act="them-buoi" data-ngay="${LICH.kieu === 'tuan' ? homNay() : LICH.moc}" data-lop="${LICH.loc || ''}">${ICON.cong} Đặt buổi</button>
        </div>
      </div>
      ${Lloc ? `<div class="dang-loc">${ICON.loc} Đang xem riêng lớp ${chamMau(Lloc)}<b>${esc(Lloc.ten)}</b><button data-act="lich-bo-loc">Bỏ lọc ×</button></div>` : ''}
      ${LICH.kieu === 'tuan' ? lichTuan() : lichThang()}
    </div>
  </div>`;
}
const hienBuoi = () => LICH.loai !== 'viec';
const hienViec = () => LICH.loai !== 'buoi';
function buoiNgay(n, coGio) {
  if (!hienBuoi()) return [];
  return S.buoi_hoc.filter(b => b.ngay === n && (!LICH.loc || b.lop_id === LICH.loc) && (coGio == null || !!b.gio_bat_dau === coGio)).sort(soBuoi);
}
function viecNgay(n) {
  if (!hienViec()) return [];
  return S.cong_viec.filter(c => !c.xong && c.han === n && (!LICH.loc || c.lop_id === LICH.loc));
}
function theHan(c) {
  return `<div class="ev-han" data-act="sua-viec" data-id="${c.id}" title="${esc(c.tieu_de)}"><i>!</i><span><small>Hạn việc</small>${esc(c.tieu_de)}</span></div>`;
}
function chipBuoi(b, coGio = true) {
  const L = lopTheoId(b.lop_id);
  return `<div class="ev ev-${b.trang_thai}" draggable="true" data-act="mo-buoi" data-id="${b.id}" style="--chu:${mauChu(L ? L.mau : '')};--mau:${esc(L ? L.mau : '#56707A')}" title="${esc((L ? L.ten : '') + (b.noi_dung ? ' — ' + b.noi_dung : ''))}">${coGio && b.gio_bat_dau ? `<b>${b.gio_bat_dau}</b> ` : ''}${esc(L ? L.ten : '')}${b.trang_thai === 'nghi' ? ' · nghỉ' : ''}</div>`;
}

/* ---------- Bảng bên trái của lịch ---------- */
function nhomBen(khoa, ten, mau, items, hang) {
  if (!items.length) return '';
  const mo = LICH.moRong[khoa]; const toiDa = 5;
  return `<div class="ben-nhom"><h4><i class="cham-to" style="--mau:${mau}"></i>${ten}<small>· ${items.length}</small></h4>
    ${(mo ? items : items.slice(0, toiDa)).map(hang).join('')}
    ${items.length > toiDa ? `<button class="xem-them" data-act="ben-mo" data-k="${khoa}">${mo ? 'Thu gọn' : `Xem thêm ${items.length - toiDa}`}</button>` : ''}</div>`;
}
function lichBen() {
  const hn = homNay(); let than = '';
  if (LICH.tab === 'lop') {
    const dang = S.lop.filter(L => L.dang_hoat_dong).sort((a, b) => a.ten.localeCompare(b.ten, 'vi'));
    const can = dang.filter(L => ['het', 'sap_het'].includes(tinhTrangLop(L).ma));
    const gioNay = new Date().getHours() * 60 + new Date().getMinutes();
    const cho = S.buoi_hoc.filter(b => b.trang_thai === 'du_kien' && (b.ngay < hn || (b.ngay === hn && b.gio_bat_dau && gio2phut(b.gio_bat_dau) + (b.thoi_luong_phut || 90) <= gioNay))).sort(soBuoi);
    const conLai = dang.filter(L => !can.includes(L));
    const hangLop = L => { const k = khoaHienTai(L.id); const t = tk(k); const tt = tinhTrangLop(L);
      return `<button class="ben-muc ${LICH.loc === L.id ? 'on' : ''}" data-act="lich-loc" data-lop="${L.id}"><b>${chamMau(L)}${esc(L.ten)}</b><small>${t ? `${luongNgan(t, t.daHoc)}/${luongNgan(t, t.tong)}${t.theoGio ? '' : ' buổi'}` : 'chưa có khoá'}${tt.ma === 'het' || tt.ma === 'sap_het' ? ' · ' + tt.chu : k && k.lich_hoc ? ' · ' + esc(k.lich_hoc) : ''}</small></button>`; };
    than = nhomBen('can', 'Cần gia hạn', '#7C2C20', can, hangLop)
      + nhomBen('cho', 'Chờ xác nhận', '#A9792B', cho, b => { const L = lopTheoId(b.lop_id); return `<button class="ben-muc" data-act="mo-buoi" data-id="${b.id}"><b>${chamMau(L)}${esc(L ? L.ten : '')}</b><small>${THU_NGAN[s2d(b.ngay).getDay()]} ${ngayNgan(b.ngay)}${b.gio_bat_dau ? ' · ' + b.gio_bat_dau : ''} · chưa ghi đã dạy/nghỉ</small></button>`; })
      + nhomBen('dang', 'Đang học', '#56707A', conLai, hangLop);
    if (!than) than = oTrong('Chưa có lớp đang học.');
  } else {
    const ds = S.cong_viec.filter(c => !c.xong);
    const hang = c => { const L = c.lop_id ? lopTheoId(c.lop_id) : null; return `<div class="ben-muc viec-ben"><label class="hop-chon"><input type="checkbox" data-act="xong-viec" data-id="${c.id}"><i></i></label><button data-act="sua-viec" data-id="${c.id}"><b>${esc(c.tieu_de)}</b><small>${esc(c.nhom || '')}${c.han ? ' · ' + ngayNgan(c.han) : ''}${L ? ' · ' + esc(L.ten) : ''}</small></button></div>`; };
    than = nhomBen('qh', 'Quá hạn', '#7C2C20', ds.filter(c => c.han && c.han < hn), hang)
      + nhomBen('hn', 'Hôm nay', '#A9792B', ds.filter(c => c.han === hn), hang)
      + nhomBen('st', 'Sắp tới', '#56707A', ds.filter(c => c.han && c.han > hn).sort((a, b) => a.han < b.han ? -1 : 1), hang)
      + nhomBen('kh', 'Chưa đặt hạn', '#9C8E70', ds.filter(c => !c.han), hang);
    than = (than || oTrong('Không còn việc nào ✓')) + `<button class="nut nho rong" data-act="them-viec">${ICON.cong} Thêm việc</button>`;
  }
  return `<aside class="lich-ben">
    <div class="phan-doan rong dam"><button data-act="lich-tab" data-v="lop" class="${LICH.tab === 'lop' ? 'on' : ''}">${ICON.lop} Lớp học</button><button data-act="lich-tab" data-v="viec" class="${LICH.tab === 'viec' ? 'on' : ''}">${ICON['cong-viec']} Việc cần làm</button></div>
    <div class="ben-than">${than}</div>
    <div class="ben-hac">${ICON.hac}</div>
  </aside>`;
}
function xepLan(bs) {
  const ev = bs.map(b => ({ b, s: gio2phut(b.gio_bat_dau), e: gio2phut(b.gio_bat_dau) + (b.thoi_luong_phut || 90) })).sort((a, c) => a.s - c.s);
  let cum = [], ketThuc = -1; const ra = [];
  const xong = () => { const lanCuoi = []; cum.forEach(x => { let i = lanCuoi.findIndex(e => e <= x.s); if (i < 0) { i = lanCuoi.length; lanCuoi.push(0); } lanCuoi[i] = x.e; x.lan = i; }); cum.forEach(x => { x.soLan = lanCuoi.length; ra.push(x); }); cum = []; };
  ev.forEach(x => { if (x.s >= ketThuc && cum.length) xong(); cum.push(x); ketThuc = Math.max(ketThuc, x.e); });
  if (cum.length) xong(); return ra;
}
function suKien(b, top, h, lan = 0, soLan = 1) {
  const L = lopTheoId(b.lop_id); const k = khoaTheoId(b.khoa_id);
  return `<div class="su-kien st-${b.trang_thai}" draggable="true" data-act="mo-buoi" data-id="${b.id}" title="${esc(L ? L.ten : '')}${b.noi_dung ? ' — ' + esc(b.noi_dung) : ''}"
    style="--chu:${mauChu(L ? L.mau : '')};--mau:${esc(L ? L.mau : '#777')};top:${top}px;height:${h}px;left:calc(${lan * 100 / soLan}% + 2px);width:calc(${100 / soLan}% - 4px)">
    <b>${b.gio_bat_dau} ${esc(L ? L.ten : '')}</b>${h > 30 ? `<small>${k ? 'Buổi ' + thuTuBuoi(b) : ''}${b.noi_dung ? ' · ' + esc(b.noi_dung) : ''}</small>` : ''}</div>`;
}
function lichTuan() {
  const a = dauTuan(LICH.moc); const ngay = [...Array(7)].map((_, i) => congNgay(a, i)); const hn = homNay();
  const cao = (GIO_CUOI - GIO_DAU) / 30 * O;
  const gio = []; for (let m = GIO_DAU; m < GIO_CUOI; m += 60) gio.push(`<span style="top:${(m - GIO_DAU) / 30 * O}px">${pad(m / 60)}:00</span>`);
  const now = new Date(); const phutNay = now.getHours() * 60 + now.getMinutes();
  return `<div class="lich-tuan">
    <div class="lt-dau"><div></div>${ngay.map(n => { const d = s2d(n); const off = ngayOff(n); return `<div class="lt-ngay ${n === hn ? 'nay' : ''} ${off ? 'off' : ''}" data-act="lich-den" data-ngay="${n}"><small>${THU_NGAN[d.getDay()]}</small><b>${d.getDate()}</b>${off ? `<em title="${esc(off.ten)}">🏮 ${esc(off.ten)}</em>` : ''}</div>`; }).join('')}</div>
    <div class="lt-ca-ngay"><div class="lt-nhan">Chưa giờ<br>/ hạn việc</div>${ngay.map(n => `<div class="lt-o-ca-ngay" data-tha="${n}" data-ca-ngay="1">${viecNgay(n).map(theHan).join('')}${buoiNgay(n, false).map(b => chipBuoi(b, false)).join('')}</div>`).join('')}</div>
    <div class="lt-than"><div class="lt-gio" style="height:${cao}px">${gio.join('')}</div>
      ${ngay.map(n => `<div class="lt-cot ${n === hn ? 'nay' : ''}" data-tha="${n}" data-cot="${n}" style="height:${cao}px">
        ${xepLan(buoiNgay(n, true)).map(x => suKien(x.b, (x.s - GIO_DAU) / 30 * O, Math.max(18, (x.e - x.s) / 30 * O - 2), x.lan, x.soLan)).join('')}
        ${n === hn && phutNay > GIO_DAU && phutNay < GIO_CUOI ? `<i class="vach-nay" style="top:${(phutNay - GIO_DAU) / 30 * O}px"></i>` : ''}
      </div>`).join('')}
    </div></div>`;
}
function lichThang() {
  const y = Number(LICH.moc.slice(0, 4)), m = Number(LICH.moc.slice(5, 7));
  const dau = dauTuan(`${y}-${pad(m)}-01`); const hn = homNay();
  const cuoiThang = `${y}-${pad(m)}-${pad(new Date(y, m, 0).getDate())}`;
  const soO = congNgay(dau, 35) <= cuoiThang ? 42 : 35;
  let o = '';
  for (let i = 0; i < soO; i++) {
    const n = congNgay(dau, i); const ngoai = Number(n.slice(5, 7)) !== m;
    const muc = [...buoiNgay(n).map(b => chipBuoi(b)), ...viecNgay(n).map(theHan)];
    const toiDa = 3; const hien = muc.length > toiDa ? muc.slice(0, toiDa - 1) : muc;
    const off = ngayOff(n);
    o += `<div class="lm-o ${ngoai ? 'ngoai' : ''} ${n === hn ? 'nay' : ''} ${off ? 'off' : ''}" data-tha="${n}" data-ca-ngay="1" data-o-thang="${n}">
      <button class="lm-so" data-act="mo-ngay" data-ngay="${n}">${Number(n.slice(8))}</button>${off ? `<span class="lm-off" title="${esc(off.ten)}">🏮<span class="dai"> ${esc(off.ten)}</span></span>` : ''}
      ${hien.join('')}
      ${muc.length > hien.length ? `<button class="lm-them" data-act="mo-ngay" data-ngay="${n}">+${muc.length - hien.length}<span class="dai"> mục khác</span></button>` : ''}
    </div>`;
  }
  return `<div class="lich-thang" style="--so-hang:${soO / 7}"><div class="lm-dau">${['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật'].map((x, i) => `<div><span class="dai">${x}</span><span class="ngan">${['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'][i]}</span></div>`).join('')}</div><div class="lm-luoi">${o}</div></div>`;
}
function ganLich(goc) {
  $$('.lt-cot', goc).forEach(cot => cot.addEventListener('click', e => {
    if (e.target.closest('.su-kien')) return;
    const r = cot.getBoundingClientRect(); const m = GIO_DAU + Math.floor((e.clientY - r.top) / O) * 30;
    moBuoi({ ngay: cot.dataset.cot, gio: phut2gio(m) });
  }));
  $$('[data-o-thang]', goc).forEach(o => o.addEventListener('click', e => { if (e.target === o) moBuoi({ ngay: o.dataset.oThang }); }));
  let keo = null;
  $$('[draggable=true]', goc).forEach(el => {
    el.addEventListener('dragstart', e => { keo = { id: Number(el.dataset.id), dy: e.offsetY }; e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', el.dataset.id); el.classList.add('dang-keo'); });
    el.addEventListener('dragend', () => el.classList.remove('dang-keo'));
  });
  $$('[data-tha]', goc).forEach(o => {
    o.addEventListener('dragover', e => { e.preventDefault(); o.classList.add('tha-vao'); });
    o.addEventListener('dragleave', () => o.classList.remove('tha-vao'));
    o.addEventListener('drop', async e => {
      e.preventDefault(); o.classList.remove('tha-vao'); if (!keo) return;
      const b = S.buoi_hoc.find(x => x.id === keo.id); if (!b) return;
      const moi = { ngay: o.dataset.tha };
      if (o.dataset.cot) { const r = o.getBoundingClientRect(); const m = GIO_DAU + Math.max(0, Math.round(((e.clientY - r.top - keo.dy) / O) * 2)) * 15; moi.gio_bat_dau = phut2gio(Math.min(m, GIO_CUOI - 30)); }
      keo = null;
      const trung = trungLich({ ...b, ...moi }, b.id);
      if (trung.length && !(await hoi(`Giờ mới bị trùng với <b>${trung.map(x => esc(lopTheoId(x.lop_id).ten) + ' ' + x.gio_bat_dau).join(', ')}</b>. Vẫn đổi?`, 'Vẫn đổi'))) return;
      await luu('buoi_hoc', moi, b.id); toast(`Đã dời buổi ${esc(lopTheoId(b.lop_id).ten)} sang ${ngayNgan(moi.ngay)}${moi.gio_bat_dau ? ' ' + moi.gio_bat_dau : ''}`); ve();
    });
  });
}
function trungLich(b, boQua) {
  if (!b.gio_bat_dau || b.trang_thai === 'nghi' || b.trang_thai === 'huy') return [];
  const s = gio2phut(b.gio_bat_dau), e = s + (b.thoi_luong_phut || 90);
  return S.buoi_hoc.filter(x => x.id !== boQua && x.ngay === b.ngay && x.gio_bat_dau && x.trang_thai !== 'nghi' && x.trang_thai !== 'huy')
    .filter(x => { const s2 = gio2phut(x.gio_bat_dau), e2 = s2 + (x.thoi_luong_phut || 90); return s < e2 && s2 < e; });
}

/* ---------- Hộp thoại buổi học ---------- */
function luaChonLop(chon, chiDangHoc = true) {
  const ds = S.lop.filter(L => !chiDangHoc || L.dang_hoat_dong || L.id === chon).sort((a, b) => a.ten.localeCompare(b.ten, 'vi'));
  return `<option value="">— Chọn lớp —</option>` + ds.map(L => `<option value="${L.id}" ${L.id === chon ? 'selected' : ''}>${esc(L.ten)} · ${L.ma}</option>`).join('');
}
function moBuoi({ id, ngay, gio, lopId, dat } = {}) {
  const b = id ? S.buoi_hoc.find(x => x.id === id) : null;
  const L0 = b ? lopTheoId(b.lop_id) : lopId ? lopTheoId(lopId) : null;
  const k0 = b ? khoaTheoId(b.khoa_id) : L0 ? khoaHienTai(L0.id) : null;
  const truoc = L0 ? S.buoi_hoc.filter(x => x.lop_id === L0.id && x.gio_bat_dau).sort(soBuoi).pop() : null;
  const st = dat || (b ? b.trang_thai : 'du_kien');
  const v = b || { ngay: ngay || homNay(), gio_bat_dau: gio || (truoc ? truoc.gio_bat_dau : ''), thoi_luong_phut: (k0 && k0.thoi_luong_phut) || 90, tinh_phi: true };
  const khoaChon = L0 ? khoaCuaLop(L0.id).reverse() : [];
  const { nen } = moHop({
    tieuDe: b ? `Buổi học ${b.ma}` : 'Đặt buổi học',
    noiDung: `<div class="form luoi-form">
      <label class="ca-dong">Lớp<select name="lop_id" ${b ? 'disabled' : ''}>${luaChonLop(L0 && L0.id)}</select></label>
      <div class="ca-dong thong-tin-khoa" id="tt-khoa"></div>
      <label>Ngày<input type="date" name="ngay" value="${esc(v.ngay)}" required></label>
      <label>Giờ bắt đầu<input type="time" name="gio_bat_dau" value="${esc(v.gio_bat_dau || '')}" step="300"></label>
      <label>Thời lượng (phút)<input type="number" name="thoi_luong_phut" value="${v.thoi_luong_phut || 90}" min="15" step="15"></label>
      ${b && khoaChon.length > 1 ? `<label>Thuộc khoá<select name="khoa_id">${khoaChon.map(k => `<option value="${k.id}" ${k.id === b.khoa_id ? 'selected' : ''}>${k.ma} (${ngayNgan(k.ngay_bat_dau || '')})</option>`).join('')}</select></label>` : '<span></span>'}
      <div class="ca-dong"><span class="nhan">Trạng thái</span><div class="phan-doan rong" id="chon-tt">${Object.entries(TRANG_THAI).map(([k, x]) => `<label><input type="radio" name="trang_thai" value="${k}" ${st === k ? 'checked' : ''}><span class="st-${k}">${x.chu}</span></label>`).join('')}</div>
        <p class="giai-thich" id="gt-tt"></p></div>
      <label class="ca-dong dong-tinh-phi"><input type="checkbox" name="tinh_phi" ${v.tinh_phi !== false ? 'checked' : ''}> Trừ buổi &amp; tính học phí cho buổi này</label>
      <label class="ca-dong">Nội dung bài học<textarea name="noi_dung" rows="3" placeholder="VD: Bài 5 – 我的家 · từ vựng + ngữ pháp 有/没有">${esc(v.noi_dung || '')}</textarea></label>
      <label class="ca-dong">Bài tập về nhà <small class="mo">(hiện trên trang học viên)</small><textarea name="bai_tap" rows="2" placeholder="VD: Làm bài 1–3 trang 45 · chép từ mới 3 lần">${esc(v.bai_tap || '')}</textarea></label>
      <label class="ca-dong">Link bài giảng <small class="mo">(học viên bấm để ôn lại)</small><input name="link_bai" type="url" list="ds-link-bai" value="${esc(v.link_bai || '')}" placeholder="https://guangyuhanyu.github.io/q1/…"><datalist id="ds-link-bai">${[...new Set(S.buoi_hoc.filter(x => x.link_bai && (!v.lop_id || x.lop_id === v.lop_id)).sort(soBuoi).reverse().map(x => x.link_bai))].slice(0, 8).map(u => `<option value="${esc(u)}">`).join('')}</datalist></label>
      <label class="ca-dong">Ghi chú<input name="ghi_chu" value="${esc(v.ghi_chu || '')}" placeholder="VD: học bù cho buổi 12/11"></label>
      ${!b ? `<label class="ca-dong lap">Lặp lại hằng tuần <input type="number" name="lap" value="1" min="1" max="30" style="width:70px"> lần <small class="mo">(VD: 8 → đặt luôn 8 tuần cùng giờ)</small></label>` : ''}
    </div>`,
    nut: [
      ...(b ? [{ chu: 'Xoá buổi', kieu: 'nguy', trai: true, bam: async () => { if (!(await hoi('Xoá hẳn buổi học này?', 'Xoá', 'nguy'))) return false; await xoa('buoi_hoc', b.id); toast('Đã xoá buổi học'); ve(); } }] : [{ chu: '🏮 Set ngày off', trai: true, bam: n => { const d = $('[name=ngay]', n).value; setTimeout(() => moNgayOff(d), 60); } }]),
      { chu: 'Huỷ', bam: () => {} },
      { chu: 'Lưu', kieu: 'chinh', bam: async (n) => {
        const f = docForm(n); const lop_id = b ? b.lop_id : Number(f.lop_id);
        if (!lop_id) { toast('Thầy chọn lớp giúp em', 'loi'); return false; }
        if (!f.ngay) { toast('Thiếu ngày học', 'loi'); return false; }
        const row = { ngay: f.ngay, gio_bat_dau: f.gio_bat_dau, thoi_luong_phut: f.thoi_luong_phut || 90, trang_thai: f.trang_thai, tinh_phi: f.trang_thai === 'da_day' ? f.tinh_phi : true, noi_dung: f.noi_dung, ghi_chu: f.ghi_chu };
        const coCot = S.buoi_hoc.some(x => 'bai_tap' in x);
        if (coCot || f.bai_tap) row.bai_tap = f.bai_tap || null;
        if (coCot || f.link_bai) row.link_bai = f.link_bai || null;
        if (f.khoa_id) row.khoa_id = Number(f.khoa_id);
        const off = ngayOff(row.ngay);
        if (off && row.trang_thai === 'du_kien' && (!b || b.ngay !== row.ngay) && !(await hoi(`${ngayVN(row.ngay)} là ngày off (<b>${esc(off.ten)}</b>). Vẫn đặt buổi?`, 'Vẫn đặt'))) return false;
        const trung = trungLich({ ...row }, b && b.id);
        if (trung.length && !(await hoi(`Giờ này trùng với <b>${trung.map(x => esc(lopTheoId(x.lop_id).ten) + ' ' + x.gio_bat_dau).join(', ')}</b>. Vẫn lưu?`, 'Vẫn lưu'))) return false;
        if (b) {
          await luu('buoi_hoc', row, b.id);
        } else {
          const lap = Math.max(1, Math.min(30, f.lap || 1));
          let daDat = 0, boOff = [];
          for (let i = 0; daDat < lap && i < lap + 20; i++) {
            const ng = congNgay(row.ngay, 7 * i);
            if (i > 0 && ngayOff(ng)) { boOff.push(ngayNgan(ng)); continue; }
            const k = khoaHienTai(lop_id);
            await luu('buoi_hoc', { ...row, lop_id, khoa_id: k ? k.id : null, ngay: ng }); daDat++;
          }
          if (boOff.length) setTimeout(() => toast(`Đã né ngày off: ${boOff.join(', ')}`), 900);
        }
        const kk = khoaTheoId(b ? (row.khoa_id || b.khoa_id) : (khoaHienTai(lop_id) || {}).id);
        if (row.trang_thai === 'da_day' && kk) {
          const t = tk(kk);
          if (t.conLai < 0) toast(`Khoá ${kk.ma} đã vượt ${luongChu(t, -t.conLai)} – Thầy nhớ gia hạn nhé`, 'canh');
          else if (t.conLai <= nguongGiaHan()) toast(`Lớp ${esc(lopTheoId(kk.lop_id).ten)} còn ${luongChu(t, t.conLai)}`, 'canh');
          else toast('Đã ghi buổi học ✓');
        } else toast(b ? 'Đã lưu' : 'Đã đặt lịch ✓');
        ve();
      } },
    ],
    khiMo: (n) => {
      const cap = () => {
        const lid = b ? b.lop_id : Number($('[name=lop_id]', n).value);
        const k = lid ? (b ? khoaTheoId(b.khoa_id) : khoaHienTai(lid)) : null;
        const box = $('#tt-khoa', n);
        if (!lid) { box.innerHTML = ''; return; }
        const L = lopTheoId(lid);
        if (!k) { box.innerHTML = `<p class="canh-bao">Lớp này chưa có khoá học. Buổi vẫn được lưu nhưng chưa tính học phí. <a href="#/lop/${lid}" data-dong>Mở khoá →</a></p>`; return; }
        const t = tk(k);
        box.innerHTML = `<p class="mo">Khoá ${k.ma}: đã học <b>${luongNgan(t, t.daHoc)}/${luongNgan(t, t.tong)}</b>${t.theoGio ? '' : ' buổi'} · còn <b>${luongChu(t, t.conLai)}</b> · ${tien(t.donGiaBuoi)}/buổi${L.loai === 'nhom' ? ` · lớp nhóm ${hvCuaLop(lid).length} học viên` : ''}</p>`;
        if (!b) { const tl = $('[name=thoi_luong_phut]', n); if (!tl.dataset.sua) tl.value = k.thoi_luong_phut || 90; }
      };
      const capTT = () => {
        const v = ($('[name=trang_thai]:checked', n) || {}).value;
        $('.dong-tinh-phi', n).style.display = v === 'da_day' ? '' : 'none';
        $('#gt-tt', n).textContent = { du_kien: 'Buổi đã lên lịch, chưa dạy.', da_day: 'Trừ 1 buổi của khoá và tính vào doanh thu ngày dạy.', nghi: 'Học viên/Thầy nghỉ: không trừ buổi, không tính phí. Nhớ đặt buổi bù.', huy: 'Huỷ buổi: không trừ buổi.' }[v] || '';
      };
      $('[name=thoi_luong_phut]', n).addEventListener('input', e => e.target.dataset.sua = 1);
      const sel = $('[name=lop_id]', n); sel && sel.addEventListener('change', cap);
      $$('[name=trang_thai]', n).forEach(r => r.addEventListener('change', capTT));
      cap(); capTT();
      if (dat === 'da_day') setTimeout(() => $('[name=noi_dung]', n).focus(), 40);
    },
  });
}

/* ================= LỚP HỌC ================= */
function vLop() {
  const q = LOC_LOP.tim.toLowerCase().trim();
  let ds = S.lop.slice();
  if (LOC_LOP.trang === 'dang_hoc') ds = ds.filter(L => L.dang_hoat_dong);
  if (LOC_LOP.trang === 'tam_dung') ds = ds.filter(L => !L.dang_hoat_dong);
  if (q) ds = ds.filter(L => [L.ten, L.ma, L.trinh_do, ...hvCuaLop(L.id).flatMap(h => [h.ho_ten, h.ten_goi, h.sdt, h.ma])].some(x => x && String(x).toLowerCase().includes(q)));
  const uu = { het: 0, sap_het: 1, moi: 2, dang_hoc: 3, tam_dung: 4 };
  ds.sort((a, b) => uu[tinhTrangLop(a).ma] - uu[tinhTrangLop(b).ma] || a.ten.localeCompare(b.ten, 'vi'));
  const dem = { dang_hoc: S.lop.filter(L => L.dang_hoat_dong).length, tam_dung: S.lop.filter(L => !L.dang_hoat_dong).length, tat_ca: S.lop.length };
  return `
  <header class="dau-trang gon">
    <div><p class="mat-tren">Danh sách lớp</p><h1>Lớp học</h1></div>
    <div class="nhom-nut"><button class="nut chinh" data-act="lop-moi">＋ Lớp mới</button></div>
  </header>
  <div class="thanh-loc">
    <div class="o-tim"><input id="tim-lop" placeholder="Tìm theo tên lớp, tên học viên, số điện thoại, mã…" value="${esc(LOC_LOP.tim)}"></div>
    <div class="phan-doan">${[['dang_hoc', 'Đang học'], ['tam_dung', 'Tạm dừng / bảo lưu'], ['tat_ca', 'Tất cả']].map(([k, c]) => `<button data-act="loc-lop" data-v="${k}" class="${LOC_LOP.trang === k ? 'on' : ''}">${c} <small>${dem[k]}</small></button>`).join('')}</div>
  </div>
  <section class="the-giay khong-dem">
  ${ds.length ? `<table class="bang">
    <thead><tr><th>Mã</th><th>Lớp</th><th>Trình độ</th><th>Khoá hiện tại</th><th class="phai">Học phí</th><th>Thanh toán</th><th>Buổi gần nhất</th><th>Tình trạng</th><th></th></tr></thead>
    <tbody>${ds.map(L => {
      const k = khoaHienTai(L.id); const t = tk(k); const tt = tinhTrangLop(L); const hv = hvCuaLop(L.id);
      return `<tr>
        <td class="ma">${L.ma}</td>
        <td>${tenLop(L)} ${L.loai === 'nhom' ? `<button class="nut-hv" data-act="ds-hv-lop" data-lop="${L.id}" title="Xem danh sách học viên">👥 ${hv.length}</button>` : hv[0] && hv[0].sdt ? `<small class="mo">${esc(hv[0].sdt)}</small>` : ''}</td>
        <td>${esc(trinhDoCua(L, k))}</td>
        <td>${k ? `${thanhTienDo(t)}<small class="mo">${k.ma}</small>` : '—'}</td>
        <td class="phai">${k ? tien(k.hoc_phi) : ''}</td>
        <td>${!k ? '' : t.conNo <= 0 ? the('Đã đóng ✓', 'xanh') : t.daDong > 0 ? the('Còn ' + tienGon(t.conNo), 'vang') : the('Chưa đóng', 'do')}</td>
        <td>${t && t.ngayCuoi ? ngayNgan(t.ngayCuoi) : ''}</td>
        <td>${the(tt.chu, 'tt-' + tt.ma)}</td>
        <td class="phai nowrap"><button class="nut nho" data-act="them-buoi" data-lop="${L.id}" title="Ghi / đặt buổi">＋ Buổi</button> <button class="nut nho" data-act="xuat-png" data-lop="${L.id}" data-mau="02" title="Xuất PNG báo buổi học">PNG</button></td>
      </tr>`;
    }).join('')}</tbody></table>` : oTrong(q ? 'Không tìm thấy lớp phù hợp.' : 'Chưa có lớp nào.', '<button class="nut chinh" data-act="lop-moi">＋ Tạo lớp đầu tiên</button>')}
  </section>`;
}
function hienDsHvLop(lopId, nutEl) {
  $$('.bong-hv').forEach(x => x.remove());
  const L = lopTheoId(lopId); const hv = hvCuaLop(lopId);
  const el = document.createElement('div'); el.className = 'bong-hv';
  el.innerHTML = `<div class="bong-dau"><b>${esc(L.ten)}</b> · ${hv.length} học viên</div>
    ${hv.length ? `<ul>${hv.map(h => `<li><span class="ma">${h.ma}</span> <a href="#/hoc-vien" data-act="sua-hv" data-id="${h.id}">${esc(h.ten_goi || h.ho_ten)}</a> <small class="mo">${esc(h.sdt || '')}</small></li>`).join('')}</ul>` : '<p class="mo">Chưa có học viên nào trong lớp.</p>'}
    <a href="#/lop/${lopId}" class="nut nho">Quản lý học viên →</a>`;
  document.body.appendChild(el);
  const r = nutEl.getBoundingClientRect();
  el.style.top = (r.bottom + window.scrollY + 6) + 'px'; el.style.left = Math.min(r.left + window.scrollX, window.innerWidth - 300) + 'px';
  setTimeout(() => document.addEventListener('click', function dong(e) { if (!el.contains(e.target)) { el.remove(); document.removeEventListener('click', dong); } }), 0);
}

/* ---------- Chi tiết lớp ---------- */
function vChiTietLop(id) {
  const L = lopTheoId(id); if (!L) return oTrong('Không tìm thấy lớp.', '<a class="nut" href="#/lop">← Danh sách lớp</a>');
  const ks = khoaCuaLop(L.id); const kht = khoaHienTai(L.id);
  const k = khoaTheoId(CHON_KHOA[L.id]) || kht; const t = tk(k); const hv = hvCuaLop(L.id); const tt = tinhTrangLop(L);
  const bg = bgTheoId(L.bang_gia_id);
  return `
  <a href="#/lop" class="quay-lai">← Danh sách lớp</a>
  <header class="dau-trang gon">
    <div><p class="mat-tren">${L.ma} · ${L.loai === 'nhom' ? 'Lớp nhóm' : 'Lớp 1-1'}${bg ? ' · ' + esc(bg.nhom + ' – ' + bg.ten) : ''}</p>
      <h1>${chamMau(L)}${esc(L.ten)} ${the(tt.chu, 'tt-' + tt.ma)}</h1>
      <p class="phu">${esc(L.trinh_do || '')}${L.ghi_chu ? ' · ' + esc(L.ghi_chu) : ''} · Báo cáo bằng ${L.ngon_ngu === 'zh' ? 'tiếng Trung' : 'tiếng Việt'}</p></div>
    <div class="nhom-nut"><button class="nut" data-act="sua-lop" data-lop="${L.id}">Sửa lớp</button>
      <button class="nut" data-act="xuat-png" data-lop="${L.id}" data-mau="01">PNG Thông tin lớp</button>
      <button class="nut chinh" data-act="xuat-png" data-lop="${L.id}" data-mau="02">PNG Buổi học & học phí</button></div>
  </header>
  ${theLichLop(L)}
  ${typeof theCongLop === 'function' ? theCongLop(L) : ''}
  ${k ? `
  <section class="the-giay khoa-the">
    <div class="dau-muc"><h2>Khoá ${k.ma} ${k === kht ? '<small class="mo">(đang học)</small>' : k.ket_thuc ? '<small class="mo">(đã đóng)</small>' : ''}</h2>
      <div class="nhom-nut">
        ${ks.length > 1 ? `<select data-act-change="chon-khoa" data-lop="${L.id}">${ks.slice().reverse().map(x => `<option value="${x.id}" ${x.id === k.id ? 'selected' : ''}>${x.ma} · ${x.ngay_bat_dau ? ngayNgan(x.ngay_bat_dau) + '/' + x.ngay_bat_dau.slice(2, 4) : 'chưa học'} · ${luongNgan(tk(x), tk(x).daHoc)}/${luongNgan(tk(x), tk(x).tong)}</option>`).join('')}</select>` : ''}
        <button class="nut nho ${t.theoGio ? 'chinh' : ''}" data-act="lop-theo-gio" data-lop="${L.id}" title="Buổi dài ngắn khác nhau thì trừ theo số phút thực tế">⏱ Tính theo giờ: ${t.theoGio ? 'Bật' : 'Tắt'}</button>
        <button class="nut nho" data-act="sua-khoa" data-id="${k.id}">Sửa khoá</button>
      </div></div>
    ${k.ghi_chu && k.ghi_chu.startsWith('⚠') ? `<p class="canh-bao">${esc(k.ghi_chu)}</p>` : ''}
    <div class="o-so nho">
      <div class="o-so-the"><span>Đã học</span><b>${luongNgan(t, t.daHoc)}<small>/${luongNgan(t, t.tong)}</small></b>${thanhTienDo(t)}</div>
      <div class="o-so-the ${t.conLai <= nguongGiaHan() ? 'canh' : ''}"><span>Còn lại</span><b>${luongNgan(t, t.conLai)}</b><small>${t.theoGio ? `${t.soBuoiDay} buổi đã dạy · ≈ ${String(lam2(Math.max(t.conLai, 0))).replace(".", ",")} buổi ${thoiLuongChu(t.tl)}` : k.buoi_chuyen_sang ? `gồm ${k.buoi_chuyen_sang > 0 ? '+' : ''}${k.buoi_chuyen_sang} buổi từ khoá trước` : thoiLuongChu(k.thoi_luong_phut) + '/buổi'}</small></div>
      <div class="o-so-the"><span>Học phí khoá</span><b>${tienGon(k.hoc_phi)}</b><small>${k.so_buoi} buổi · ${tien(t.donGiaBuoi)}/buổi</small></div>
      <div class="o-so-the ${t.conNo > 0 ? 'canh' : ''}"><span>Đã đóng</span><b>${tienGon(t.daDong)}</b><small>${t.conNo > 0 ? 'Còn thiếu ' + tien(t.conNo) : t.conNo < 0 ? 'Dư ' + tien(-t.conNo) : 'Đủ ✓'}</small></div>
      <div class="o-so-the"><span>Doanh thu đã dạy</span><b>${tienGon(t.daThucHien)}</b><small>chưa thực hiện ${tienGon(t.chuaThucHien)}</small></div>
    </div>
    <div class="nhom-nut trai">
      <button class="nut chinh" data-act="them-buoi" data-lop="${L.id}" data-dat="da_day">＋ Ghi buổi đã dạy</button>
      <button class="nut" data-act="them-buoi" data-lop="${L.id}">＋ Đặt lịch</button>
      <button class="nut" data-act="thanh-toan" data-lop="${L.id}" data-khoa="${k.id}">₫ Ghi thanh toán</button>
      <button class="nut" data-act="gia-han" data-lop="${L.id}">↻ Gia hạn / khoá mới</button>
      <button class="nut" data-act="tin-gia-han" data-lop="${L.id}">✉ Soạn tin nhắn gia hạn</button>
    </div>
    <h3 class="tieu-de-nho">Nhật ký buổi học</h3>
    ${t.buoi.length ? `<table class="bang gon">
      <thead><tr><th>#</th><th>Ngày</th><th>Giờ</th><th>Thời lượng</th><th>Trạng thái</th><th>Nội dung bài học</th><th>Ghi chú</th><th></th></tr></thead>
      <tbody>${t.buoi.map(b => `<tr class="st-dong-${b.trang_thai}">
        <td class="ma">${tinhBuoi(b) || b.trang_thai === 'du_kien' ? thuTuBuoi(b).split('/')[0] : '–'}</td>
        <td class="nowrap">${THU_NGAN[s2d(b.ngay).getDay()]} ${ngayVN(b.ngay)}</td><td>${b.gio_bat_dau || ''}</td><td>${thoiLuongChu(b.thoi_luong_phut)}</td>
        <td>${the(TRANG_THAI[b.trang_thai].chu + (b.trang_thai === 'da_day' && b.tinh_phi === false ? ' (không tính phí)' : ''), 'st-' + b.trang_thai)}</td>
        <td class="noi-dung" data-act="mo-buoi" data-id="${b.id}">${b.noi_dung ? esc(b.noi_dung) : '<span class="mo">＋ ghi nội dung</span>'}</td>
        <td><small class="mo">${esc(b.ghi_chu || '')}</small></td>
        <td class="phai"><button class="nut nho" data-act="mo-buoi" data-id="${b.id}">Sửa</button></td></tr>`).join('')}</tbody></table>` : oTrong('Khoá này chưa có buổi nào.')}
  </section>` : `<section class="the-giay">${oTrong('Lớp chưa có khoá học nào.', `<button class="nut chinh" data-act="gia-han" data-lop="${L.id}">＋ Mở khoá học</button>`)}</section>`}
  <div class="luoi-2">
    <section class="the-giay">
      <div class="dau-muc"><h2>Học viên (${hv.length})</h2><button class="nut nho" data-act="sua-lop" data-lop="${L.id}">Thêm / bớt</button></div>
      ${hv.length ? `<div class="ds-hv-the">${hv.map(h => `<div class="hv-the" data-act="sua-hv" data-id="${h.id}"><div><b>${esc(h.ten_goi || h.ho_ten)}</b> <span class="ma">${h.ma}</span>${h.ngon_ngu === 'zh' ? ' ' + the('中文') : ''}<small class="mo">${esc(h.sdt || '')}${h.email ? ' · ' + esc(h.email) : ''}${h.ngay_sinh ? ' · 🎂 ' + ngayNgan(h.ngay_sinh) : ''}</small></div>
        ${h.muc_tieu ? `<p>🎯 ${esc(h.muc_tieu)}</p>` : ''}${h.diem_yeu ? `<p class="diem-yeu">⚠ ${esc(h.diem_yeu)}</p>` : ''}${!h.muc_tieu && !h.diem_yeu ? '<p class="mo nho">Bấm để thêm sinh nhật, mục tiêu, điểm yếu</p>' : ''}</div>`).join('')}</div>` : oTrong('Chưa có học viên.')}
    </section>
    <section class="the-giay">
      <div class="dau-muc"><h2>Thanh toán</h2><button class="nut nho" data-act="thanh-toan" data-lop="${L.id}">＋ Ghi</button></div>
      ${(() => { const tts = S.thanh_toan.filter(x => x.lop_id === L.id).sort((a, b) => a.ngay < b.ngay ? 1 : -1); return tts.length ? `<table class="bang gon"><tbody>${tts.map(x => `<tr><td class="ma">${x.ma}</td><td>${ngayVN(x.ngay)}</td><td class="phai"><b>${tien(x.so_tien)}</b></td><td><small class="mo">${(khoaTheoId(x.khoa_id) || {}).ma || ''} · ${esc(x.hinh_thuc || '')}</small></td><td class="phai"><button class="nut nho" data-act="sua-tt" data-id="${x.id}">Sửa</button></td></tr>`).join('')}</tbody></table>` : oTrong('Chưa có giao dịch.'); })()}
    </section>
  </div>
  <section class="the-giay">
    <div class="dau-muc"><h2>Lịch sử khoá học</h2></div>
    <table class="bang gon"><thead><tr><th>Khoá</th><th>Bắt đầu</th><th>Giáo trình</th><th>Số buổi</th><th>Đã học</th><th class="phai">Học phí</th><th>Đóng</th><th></th></tr></thead>
    <tbody>${ks.slice().reverse().map(x => { const y = tk(x); return `<tr><td class="ma">${x.ma}</td><td>${ngayVN(y.ngayDau || x.ngay_bat_dau)}</td><td>${esc(x.giao_trinh || '')}</td><td>${x.so_buoi}${x.buoi_chuyen_sang ? ` (${x.buoi_chuyen_sang > 0 ? '+' : ''}${x.buoi_chuyen_sang})` : ''}</td><td>${luongNgan(y, y.daHoc)}/${luongNgan(y, y.tong)}</td><td class="phai">${tien(x.hoc_phi)}</td><td>${y.conNo <= 0 ? '✓' : the('thiếu ' + tienGon(y.conNo), 'do')}</td><td class="phai"><button class="nut nho" data-act="chon-khoa-nut" data-lop="${L.id}" data-id="${x.id}">Xem</button></td></tr>`; }).join('')}</tbody></table>
  </section>`;
}

/* ---------- Form lớp ---------- */
function luaChonBangGia(chon) {
  const nhom = [...new Set(S.bang_gia.map(b => b.nhom))];
  return `<option value="">— Không theo bảng giá —</option>` + nhom.map(n => `<optgroup label="${esc(n)}">${S.bang_gia.filter(b => b.nhom === n && b.dang_dung !== false).sort((a, b) => a.thu_tu - b.thu_tu).map(b => `<option value="${b.id}" ${b.id === chon ? 'selected' : ''}>${esc(b.ten)}${b.mo_ta ? ' – ' + esc(b.mo_ta) : ''} · ${tienGon(b.don_gia_gio)}/giờ</option>`).join('')}</optgroup>`).join('');
}
const MAU_LOP = ['#7C2C20', '#56707A', '#A0703A', '#4F6B4A', '#7A4E6E', '#3F6E8C', '#9A5B3C', '#5B6B2E', '#8C3B4A', '#2F5D62', '#B08A3E', '#6A5A8C'];
function moFormLop(id) {
  const L = id ? lopTheoId(id) : null;
  const daChon = L ? hvCuaLop(L.id).map(h => h.id) : [];
  const hvDs = S.hoc_vien.slice().sort((a, b) => (a.ten_goi || a.ho_ten).localeCompare(b.ten_goi || b.ho_ten, 'vi'));
  const mau = L ? L.mau : MAU_LOP[S.lop.length % MAU_LOP.length];
  moHop({
    tieuDe: L ? `Sửa lớp ${L.ma}` : 'Tạo lớp mới', rong: true,
    noiDung: `<div class="form luoi-form ba">
      <label class="hai-cot">Tên lớp<input name="ten" value="${esc(L ? L.ten : '')}" placeholder="VD: Chị Thuỳ, HSK2 nhóm tối T3-T5" required></label>
      <label>Hình thức<select name="loai"><option value="1-1">Kèm 1-1</option><option value="nhom" ${L && L.loai === 'nhom' ? 'selected' : ''}>Nhóm 2–4 người</option></select></label>
      <label class="hai-cot">Chương trình (bảng giá)<select name="bang_gia_id">${luaChonBangGia(L && L.bang_gia_id)}</select></label>
      <label>Trình độ in trên PNG<input name="trinh_do" value="${esc(L ? L.trinh_do || '' : '')}" placeholder="VD: HSK 2"></label>
      <label>Báo cáo bằng<select name="ngon_ngu"><option value="vi">Tiếng Việt</option><option value="zh" ${L && L.ngon_ngu === 'zh' ? 'selected' : ''}>中文 (tiếng Trung)</option></select></label>
      <label>Màu trên lịch<input type="color" name="mau" value="${esc(mau)}"></label>
      ${L ? `<label class="hop-chon-dong"><input type="checkbox" name="dang_hoat_dong" ${L.dang_hoat_dong ? 'checked' : ''}> Đang học (bỏ chọn nếu tạm dừng / bảo lưu)</label>` : '<span></span>'}
      <label class="ca-dong">Ghi chú<input name="ghi_chu" value="${esc(L ? L.ghi_chu || '' : '')}"></label>
      <fieldset class="ca-dong"><legend>Học viên trong lớp</legend>
        <input class="tim-nho" placeholder="Lọc học viên…" data-loc-hv>
        <div class="ds-chon-hv">${hvDs.map(h => `<label data-ten="${esc((h.ten_goi || '') + ' ' + h.ho_ten + ' ' + (h.sdt || '')).toLowerCase()}"><input type="checkbox" name="hv_${h.id}" ${daChon.includes(h.id) ? 'checked' : ''}> ${esc(h.ten_goi || h.ho_ten)} <small class="mo">${h.ma}${h.sdt ? ' · ' + esc(h.sdt) : ''}</small></label>`).join('') || '<p class="mo">Chưa có học viên – thêm ở ô bên dưới.</p>'}</div>
        <label>Thêm học viên mới <small class="mo">(mỗi dòng 1 người: Tên – SĐT)</small><textarea name="hv_moi" rows="2" placeholder="Chị Lan – 0912 345 678&#10;Anh Minh"></textarea></label>
      </fieldset>
      ${L ? '' : `<fieldset class="ca-dong"><legend>Khoá học đầu tiên</legend><div class="luoi-form ba">
        <label>Ngày bắt đầu<input type="date" name="k_ngay" value="${homNay()}"></label>
        <label>Số buổi<input type="number" name="k_so_buoi" value="8" min="1"></label>
        <label>Thời lượng / buổi (phút)<input type="number" name="k_tl" value="90" step="15"></label>
        <label class="hai-cot">Học phí khoá <small class="mo" id="goi-y-hp"></small><input data-so name="k_hp" placeholder="Tự tính theo bảng giá"></label>
        <label class="hop-chon-dong"><input type="checkbox" name="k_da_dong"> Đã nhận học phí</label>
        <label class="hai-cot">Giáo trình / tài liệu<input name="k_gt" placeholder="VD: HSK 2 标准教程"></label>
        <label>Lịch học<input name="k_lich" placeholder="VD: T3 – T5, 20:00"></label>
        <label class="ca-dong">Mục tiêu khoá học<input name="k_mt" placeholder="VD: Giao tiếp cơ bản, đọc hiểu bài khoá, thi HSK 2"></label>
      </div></fieldset>`}
    </div>`,
    nut: [
      ...(L ? [{ chu: 'Xoá lớp', kieu: 'nguy', trai: true, bam: async () => { if (!(await hoi(`Xoá lớp <b>${esc(L.ten)}</b> cùng toàn bộ khoá, buổi học, thanh toán của lớp? Không hoàn tác được.`, 'Xoá hẳn', 'nguy'))) return false; await DBX.remove('lop', L.id); await taiLai(); location.hash = '#/lop'; toast('Đã xoá lớp'); } }] : []),
      { chu: 'Huỷ', bam: () => {} },
      { chu: L ? 'Lưu' : 'Tạo lớp', kieu: 'chinh', bam: async (n) => {
        const f = docForm(n);
        if (!f.ten) { toast('Thầy đặt tên lớp giúp em', 'loi'); return false; }
        const row = { ten: f.ten, loai: f.loai, bang_gia_id: f.bang_gia_id ? Number(f.bang_gia_id) : null, trinh_do: f.trinh_do || (bgTheoId(Number(f.bang_gia_id)) || {}).ten || null, ngon_ngu: f.ngon_ngu, mau: f.mau, ghi_chu: f.ghi_chu };
        if (L) row.dang_hoat_dong = f.dang_hoat_dong; else row.dang_hoat_dong = true;
        const lop = await luu('lop', row, L && L.id);
        // học viên
        const muon = Object.keys(f).filter(k => k.startsWith('hv_') && k !== 'hv_moi' && f[k]).map(k => Number(k.slice(3)));
        for (const dong of (f.hv_moi || '').split('\n').map(x => x.trim()).filter(Boolean)) {
          const [ten, sdt] = dong.split(/\s+[–-]\s+/);
          const h = await luu('hoc_vien', { ho_ten: ten.replace(/^(Chị|Anh|Cô|Chú|Em)\s+/i, ''), ten_goi: ten, sdt: sdt || null, ngon_ngu: f.ngon_ngu });
          muon.push(h.id);
        }
        const co = hvCuaLop(lop.id).map(h => h.id);
        for (const hid of muon.filter(x => !co.includes(x))) { await DBX.insert('lop_hoc_vien', { lop_id: lop.id, hoc_vien_id: hid }); S.lop_hoc_vien.push({ lop_id: lop.id, hoc_vien_id: hid }); }
        for (const hid of co.filter(x => !muon.includes(x))) { await DBX.removeWhere('lop_hoc_vien', { lop_id: lop.id, hoc_vien_id: hid }); S.lop_hoc_vien = S.lop_hoc_vien.filter(x => !(x.lop_id === lop.id && x.hoc_vien_id === hid)); }
        if (!L) {
          const hp = f.k_hp != null ? f.k_hp : goiYHocPhi(f.bang_gia_id, f.k_tl || 90, f.k_so_buoi || 8);
          const k = await luu('khoa_hoc', { lop_id: lop.id, ngay_bat_dau: f.k_ngay, so_buoi: f.k_so_buoi || 8, thoi_luong_phut: f.k_tl || 90, hoc_phi: hp || 0, don_gia_gio: (bgTheoId(Number(f.bang_gia_id)) || {}).don_gia_gio || null, giao_trinh: f.k_gt || row.trinh_do, lich_hoc: f.k_lich, muc_tieu: f.k_mt });
          if (f.k_da_dong && hp) await luu('thanh_toan', { khoa_id: k.id, lop_id: lop.id, ngay: homNay(), so_tien: hp, hinh_thuc: 'Chuyển khoản' });
          toast(`Đã tạo lớp ${lop.ma} và khoá ${k.ma} ✓`);
          location.hash = '#/lop/' + lop.id;
        } else toast('Đã lưu lớp');
        lamMoi(); ve();
      } },
    ],
    khiMo: (n) => {
      const loc = $('[data-loc-hv]', n); loc.addEventListener('input', () => $$('.ds-chon-hv label', n).forEach(l => l.style.display = l.dataset.ten.includes(loc.value.toLowerCase()) ? '' : 'none'));
      ganOTien(n);
      const capGoiY = () => {
        const el = $('#goi-y-hp', n); if (!el) return;
        const bgid = $('[name=bang_gia_id]', n).value; const nhom = $('[name=loai]', n).value === 'nhom';
        const g = goiYHocPhi(bgid, Number($('[name=k_tl]', n).value) || 90, Number($('[name=k_so_buoi]', n).value) || 8);
        el.textContent = nhom ? '(lớp nhóm: nhập học phí cả lớp)' : g ? `gợi ý theo bảng giá: ${tien(g)}` : '';
        const o = $('[name=k_hp]', n); if (!o.dataset.sua && !nhom && g) o.value = NF.format(g);
        const bg = bgTheoId(Number(bgid)); const td = $('[name=trinh_do]', n); if (bg && !td.dataset.sua) td.value = bg.ten;
      };
      $('[name=trinh_do]', n).addEventListener('input', e => e.target.dataset.sua = 1);
      const hp = $('[name=k_hp]', n); hp && hp.addEventListener('input', () => hp.dataset.sua = 1);
      ['bang_gia_id', 'loai', 'k_tl', 'k_so_buoi'].forEach(x => { const e = $(`[name=${x}]`, n); e && e.addEventListener('input', capGoiY); });
      capGoiY();
    },
  });
}

/* ---------- Gia hạn / khoá mới ---------- */
function moGiaHan(lopId) {
  const L = lopTheoId(lopId); const cu = khoaHienTai(lopId); const t = tk(cu);
  const bg = bgTheoId(L.bang_gia_id);
  const chuyen = cu && !cu.ket_thuc ? t.conLai : 0;
  moHop({
    tieuDe: `${cu ? 'Gia hạn khoá mới' : 'Mở khoá học'} – ${esc(L.ten)}`,
    noiDung: `<div class="form luoi-form ba">
      ${cu ? `<p class="ca-dong mo">Khoá hiện tại ${cu.ma}: đã học ${luongNgan(t, t.daHoc)}/${luongNgan(t, t.tong)}${t.theoGio ? '' : ' buổi'}, còn <b>${luongChu(t, t.conLai)}</b>${t.conNo > 0 ? `, còn thiếu ${tien(t.conNo)}` : ''}.</p>` : ''}
      <label>Ngày bắt đầu<input type="date" name="ngay" value="${homNay()}"></label>
      <label>Số buổi đóng tiền<input type="number" name="so_buoi" value="${cu ? cu.so_buoi : 8}" min="1"></label>
      <label>Thời lượng / buổi (phút)<input type="number" name="tl" value="${cu ? cu.thoi_luong_phut || 90 : 90}" step="15"></label>
      <label class="hai-cot">Học phí khoá mới <small class="mo" id="goi-y-hp"></small><input data-so name="hoc_phi" value="${cu ? cu.hoc_phi : ''}"></label>
      <label class="hop-chon-dong"><input type="checkbox" name="da_dong"> Đã nhận học phí hôm nay</label>
      ${cu && !cu.ket_thuc && chuyen !== 0 ? `<label class="ca-dong hop-chon-dong noi-bat"><input type="checkbox" name="chuyen" checked> ${chuyen > 0 ? `Chuyển <b>${luongChu(t, chuyen)} còn lại</b> (trị giá ${tien(chuyen * t.donGiaBuoi)}) sang khoá mới` : `Khoá cũ đã học vượt <b>${luongChu(t, -chuyen)}</b> – trừ vào khoá mới`}</label>` : ''}
      <label class="hai-cot">Giáo trình / tài liệu<input name="giao_trinh" value="${esc(cu ? cu.giao_trinh || '' : L.trinh_do || '')}"></label>
      <label>Lịch học<input name="lich_hoc" value="${esc(cu ? cu.lich_hoc || '' : '')}"></label>
      <label class="ca-dong">Mục tiêu khoá<input name="muc_tieu" value="${esc(cu ? cu.muc_tieu || '' : '')}"></label>
    </div>`,
    nut: [{ chu: 'Huỷ', bam: () => {} }, { chu: 'Tạo khoá', kieu: 'chinh', bam: async (n) => {
      const f = docForm(n);
      const c0 = f.chuyen ? chuyen : 0, c = t && t.theoGio && Number(f.tl) && Number(f.tl) !== t.tl ? lam2(c0 * t.tl / Number(f.tl)) : c0;
      const moi = await luu('khoa_hoc', { lop_id: L.id, ngay_bat_dau: f.ngay, so_buoi: f.so_buoi, thoi_luong_phut: f.tl, hoc_phi: f.hoc_phi || 0, don_gia_gio: bg ? bg.don_gia_gio : null, buoi_chuyen_sang: c, gia_tri_chuyen_sang: Math.round(c0 * (t ? t.donGiaBuoi : 0)), khoa_truoc_id: cu ? cu.id : null, giao_trinh: f.giao_trinh, lich_hoc: f.lich_hoc, muc_tieu: f.muc_tieu });
      if (cu && !cu.ket_thuc) {
        await luu('khoa_hoc', { ket_thuc: true, buoi_chuyen_di: c0 }, cu.id);
        for (const b of S.buoi_hoc.filter(b => b.khoa_id === cu.id && b.trang_thai === 'du_kien')) await luu('buoi_hoc', { khoa_id: moi.id }, b.id);
      }
      if (f.da_dong && f.hoc_phi) await luu('thanh_toan', { khoa_id: moi.id, lop_id: L.id, ngay: homNay(), so_tien: f.hoc_phi, hinh_thuc: 'Chuyển khoản' });
      if (!L.dang_hoat_dong) await luu('lop', { dang_hoat_dong: true }, L.id);
      CHON_KHOA[L.id] = moi.id; toast(`Đã tạo khoá ${moi.ma} ✓`); location.hash = '#/lop/' + L.id; ve(); setTimeout(() => goiYXepSauGiaHan(L.id), 500);
    } }],
    khiMo: n => {
      ganOTien(n);
      const cap = () => { const g = goiYHocPhi(L.bang_gia_id, Number($('[name=tl]', n).value) || 90, Number($('[name=so_buoi]', n).value) || 8); $('#goi-y-hp', n).textContent = g && L.loai !== 'nhom' ? `bảng giá: ${tien(g)}` : ''; };
      ['tl', 'so_buoi'].forEach(x => $(`[name=${x}]`, n).addEventListener('input', cap)); cap();
    },
  });
}
function moSuaKhoa(id) {
  const k = khoaTheoId(id); const L = lopTheoId(k.lop_id); const t = tk(k);
  moHop({
    tieuDe: `Sửa khoá ${k.ma} – ${esc(L.ten)}`,
    noiDung: `<div class="form luoi-form ba">
      <label>Ngày bắt đầu<input type="date" name="ngay_bat_dau" value="${esc(k.ngay_bat_dau || '')}"></label>
      <label>Số buổi đóng tiền<input type="number" name="so_buoi" value="${k.so_buoi}"></label>
      <label>Thời lượng / buổi (phút)<input type="number" name="thoi_luong_phut" value="${k.thoi_luong_phut || 90}" step="15"></label>
      <label>Học phí khoá<input data-so name="hoc_phi" value="${k.hoc_phi}"></label>
      <label>Buổi chuyển từ khoá trước<input type="number" step="any" name="buoi_chuyen_sang" value="${k.buoi_chuyen_sang || 0}"></label>
      <label>Giá trị buổi chuyển sang<input data-so name="gia_tri_chuyen_sang" value="${k.gia_tri_chuyen_sang || 0}"></label>
      <label class="hai-cot">Giáo trình<input name="giao_trinh" value="${esc(k.giao_trinh || '')}"></label>
      <label>Lịch học<input name="lich_hoc" value="${esc(k.lich_hoc || '')}"></label>
      <label class="ca-dong">Mục tiêu khoá<input name="muc_tieu" value="${esc(k.muc_tieu || '')}"></label>
      <label class="ca-dong">Ghi chú<input name="ghi_chu" value="${esc(k.ghi_chu || '')}"></label>
      <label class="hop-chon-dong ca-dong"><input type="checkbox" name="ket_thuc" ${k.ket_thuc ? 'checked' : ''}> Đã đóng khoá (không tính "chưa thực hiện", không nhắc nợ)</label>
      <p class="ca-dong mo">Đã học ${luongNgan(t, t.daHoc)}/${luongNgan(t, t.tong)} · ${t.buoi.length} buổi trong nhật ký.</p>
    </div>`,
    nut: [
      { chu: 'Xoá khoá', kieu: 'nguy', trai: true, bam: async () => { if (!(await hoi(`Xoá khoá ${k.ma}? Các buổi học vẫn giữ nhưng không thuộc khoá nào.`, 'Xoá', 'nguy'))) return false; await DBX.remove('khoa_hoc', k.id); await taiLai(); toast('Đã xoá khoá'); } },
      { chu: 'Huỷ', bam: () => {} },
      { chu: 'Lưu', kieu: 'chinh', bam: async n => { const f = docForm(n); await luu('khoa_hoc', f, k.id); toast('Đã lưu khoá'); ve(); } }],
    khiMo: ganOTien,
  });
}

/* ---------- Thanh toán ---------- */
function moThanhToan({ lopId, khoaId, id } = {}) {
  const x = id ? S.thanh_toan.find(t => t.id === id) : null;
  const L = lopTheoId(x ? x.lop_id : lopId); const ks = khoaCuaLop(L.id).reverse();
  const k = khoaTheoId(x ? x.khoa_id : khoaId) || ks.find(k => tk(k).conNo > 0) || khoaHienTai(L.id);
  moHop({
    tieuDe: (x ? `Sửa giao dịch ${x.ma}` : 'Ghi thanh toán') + ' – ' + esc(L.ten),
    noiDung: `<div class="form luoi-form">
      <label class="ca-dong">Cho khoá<select name="khoa_id">${ks.map(y => `<option value="${y.id}" ${k && y.id === k.id ? 'selected' : ''}>${y.ma} · ${tien(y.hoc_phi)} · ${tk(y).conNo > 0 ? 'thiếu ' + tien(tk(y).conNo) : 'đủ'}</option>`).join('')}</select></label>
      <label>Ngày nhận tiền<input type="date" name="ngay" value="${x ? x.ngay : homNay()}"></label>
      <label>Số tiền<input data-so name="so_tien" value="${x ? x.so_tien : k ? Math.max(tk(k).conNo, 0) : ''}"></label>
      <label>Hình thức<select name="hinh_thuc">${['Chuyển khoản', 'Tiền mặt', 'Khác'].map(h => `<option ${x && x.hinh_thuc === h ? 'selected' : ''}>${h}</option>`).join('')}</select></label>
      <label>Ghi chú<input name="ghi_chu" value="${esc(x ? x.ghi_chu || '' : '')}"></label>
    </div>`,
    nut: [
      ...(x ? [{ chu: 'Xoá', kieu: 'nguy', trai: true, bam: async () => { if (!(await hoi('Xoá giao dịch này?', 'Xoá', 'nguy'))) return false; await xoa('thanh_toan', x.id); toast('Đã xoá'); ve(); } }] : []),
      { chu: 'Huỷ', bam: () => {} },
      { chu: 'Lưu', kieu: 'chinh', bam: async n => { const f = docForm(n); if (!f.so_tien) { toast('Thiếu số tiền', 'loi'); return false; } await luu('thanh_toan', { ...f, khoa_id: Number(f.khoa_id), lop_id: L.id }, x && x.id); toast('Đã ghi ' + tien(f.so_tien) + ' ✓'); ve(); } }],
    khiMo: ganOTien,
  });
}

/* ================= HỌC VIÊN ================= */
function vHocVien() {
  const q = LOC_HV.tim.toLowerCase().trim();
  let ds = S.hoc_vien.slice().sort((a, b) => a.id - b.id);
  if (q) ds = ds.filter(h => [h.ma, h.ho_ten, h.ten_goi, h.sdt, ...lopCuaHv(h.id).map(L => L.ten)].some(x => x && String(x).toLowerCase().includes(q)));
  return `
  <header class="dau-trang gon"><div><p class="mat-tren">Hồ sơ</p><h1>Học viên</h1></div>
    <div class="nhom-nut"><button class="nut chinh" data-act="hv-moi">＋ Học viên mới</button></div></header>
  <div class="thanh-loc"><div class="o-tim"><input id="tim-hv" placeholder="Tìm theo tên, số điện thoại, tên lớp, mã HV…" value="${esc(LOC_HV.tim)}"></div><span class="mo">${ds.length} học viên</span></div>
  <section class="the-giay khong-dem">${ds.length ? `<table class="bang"><thead><tr><th>Mã</th><th>Tên gọi</th><th>Số điện thoại</th><th>Lớp</th><th>Sinh nhật</th><th>Mục tiêu · điểm yếu</th><th></th></tr></thead>
    <tbody>${ds.map(h => `<tr><td class="ma">${h.ma}</td><td><b>${esc(h.ten_goi || h.ho_ten)}</b>${h.ten_goi && h.ten_goi !== h.ho_ten ? `<small class="mo">${esc(h.ho_ten)}</small>` : ''}${h.ngon_ngu === 'zh' ? ' ' + the('中文') : ''}</td><td>${esc(h.sdt || '')}</td>
      <td>${lopCuaHv(h.id).map(L => tenLop(L)).join(', ')}</td><td class="nowrap">${h.ngay_sinh ? `${sinhNhatSap(h) === 0 ? '🎂 ' : ''}${ngayNgan(h.ngay_sinh)}` : '<span class="mo">—</span>'}</td>
      <td class="ghi-chu-hv">${h.muc_tieu ? `<span>🎯 ${esc(h.muc_tieu)}</span>` : ''}${h.diem_yeu ? `<span>⚠ ${esc(h.diem_yeu)}</span>` : ''}${!h.muc_tieu && !h.diem_yeu ? '<span class="mo">Chưa có ghi chú</span>' : ''}</td>
      <td class="phai"><button class="nut nho" data-act="sua-hv" data-id="${h.id}">Sửa</button></td></tr>`).join('')}</tbody></table>` : oTrong('Chưa có học viên phù hợp.')}</section>`;
}
function moHocVien(id) {
  const h = id ? hvTheoId(id) : null;
  const lopCo = h ? lopCuaHv(h.id).map(L => L.id) : [];
  moHop({
    tieuDe: h ? `Học viên ${h.ma}` : 'Học viên mới',
    noiDung: `<div class="form luoi-form">
      <label>Tên gọi (cách Thầy gọi)<input name="ten_goi" value="${esc(h ? h.ten_goi || '' : '')}" placeholder="VD: Chị Thuỳ"></label>
      <label>Họ và tên<input name="ho_ten" value="${esc(h ? h.ho_ten : '')}" placeholder="VD: Nguyễn Thị Thuỳ"></label>
      <label>Số điện thoại / Zalo<input name="sdt" value="${esc(h ? h.sdt || '' : '')}"></label>
      <label>Gmail<input name="email" type="email" value="${esc(h ? h.email || '' : '')}" placeholder="ten@gmail.com"></label>
      <label>Ngôn ngữ báo cáo<select name="ngon_ngu"><option value="vi">Tiếng Việt</option><option value="zh" ${h && h.ngon_ngu === 'zh' ? 'selected' : ''}>中文</option></select></label>
      <label class="ca-dong">Thuộc lớp<select name="lop_them"><option value="">— Không thêm vào lớp nào —</option>${S.lop.filter(L => L.dang_hoat_dong && !lopCo.includes(L.id)).map(L => `<option value="${L.id}">${esc(L.ten)} · ${L.ma}</option>`).join('')}</select>
        ${lopCo.length ? `<small class="mo">Đang ở: ${lopCo.map(i => esc(lopTheoId(i).ten)).join(', ')}</small>` : ''}</label>
      <label>Sinh nhật <small class="mo">(không nhớ năm thì chọn năm bất kỳ)</small><input type="date" name="ngay_sinh" value="${esc(h ? h.ngay_sinh || '' : '')}"></label>
      <span></span>
      <label class="ca-dong">Mục tiêu học<input name="muc_tieu" value="${esc(h ? h.muc_tieu || '' : '')}" placeholder="VD: Thi HSK 3 tháng 6/2027, giao tiếp khi đi công tác Quảng Châu"></label>
      <label class="ca-dong">Điểm yếu hay mắc<textarea name="diem_yeu" rows="2" placeholder="VD: Nhầm thanh 2 – thanh 3, quên lượng từ 个/本, phát âm zh – z">${esc(h ? h.diem_yeu || '' : '')}</textarea></label>
      <label class="ca-dong">Ghi chú khác<textarea name="ghi_chu" rows="2" placeholder="VD: Thích học qua bài hát, hay đi công tác cuối tháng">${esc(h ? h.ghi_chu || '' : '')}</textarea></label>
      ${h ? '' : '<p class="ca-dong mo">Mã học viên (HV0001…) được tạo tự động.</p>'}
    </div>`,
    nut: [
      ...(h ? [{ chu: 'Xoá', kieu: 'nguy', trai: true, bam: async () => { if (!(await hoi(`Xoá học viên ${esc(h.ten_goi || h.ho_ten)}? (Lớp và khoá học vẫn giữ.)`, 'Xoá', 'nguy'))) return false; await DBX.remove('hoc_vien', h.id); await taiLai(); toast('Đã xoá'); } }] : []),
      { chu: 'Huỷ', bam: () => {} },
      { chu: 'Lưu', kieu: 'chinh', bam: async n => {
        const f = docForm(n); if (!f.ho_ten && !f.ten_goi) { toast('Thiếu tên học viên', 'loi'); return false; }
        const rowHV = { ho_ten: f.ho_ten || f.ten_goi, ten_goi: f.ten_goi || f.ho_ten, sdt: f.sdt, ngon_ngu: f.ngon_ngu, ghi_chu: f.ghi_chu, ngay_sinh: f.ngay_sinh, muc_tieu: f.muc_tieu, diem_yeu: f.diem_yeu };
        if (S.hoc_vien.some(x => 'email' in x) || f.email) rowHV.email = f.email || null;
        const r = await luu('hoc_vien', rowHV, h && h.id);
        if (f.lop_them) { await DBX.insert('lop_hoc_vien', { lop_id: Number(f.lop_them), hoc_vien_id: r.id }); S.lop_hoc_vien.push({ lop_id: Number(f.lop_them), hoc_vien_id: r.id }); }
        toast(h ? 'Đã lưu' : `Đã thêm ${r.ma} ✓`); ve();
      } }],
  });
}

/* ================= TÀI CHÍNH ================= */
function khoangKy(ky, moc) {
  const d = s2d(moc);
  if (ky === 'ngay') return [moc, moc, `${THU[d.getDay()]}, ${ngayVN(moc)}`];
  if (ky === 'tuan') { const a = dauTuan(moc); return [a, congNgay(a, 6), `Tuần ${ngayNgan(a)} – ${ngayVN(congNgay(a, 6))}`]; }
  if (ky === 'thang') { const y = d.getFullYear(), m = d.getMonth() + 1; return [`${y}-${pad(m)}-01`, `${y}-${pad(m)}-${pad(new Date(y, m, 0).getDate())}`, `Tháng ${m}/${y}`]; }
  const y = d.getFullYear(); return [`${y}-01-01`, `${y}-12-31`, `Năm ${y}`];
}
function dichKy(ky, moc, n) {
  const d = s2d(moc);
  if (ky === 'ngay') return congNgay(moc, n);
  if (ky === 'tuan') return congNgay(moc, 7 * n);
  if (ky === 'thang') { d.setDate(1); d.setMonth(d.getMonth() + n); return d2s(d); }
  d.setFullYear(d.getFullYear() + n); return d2s(d);
}
function vTaiChinh() {
  const [tu, den, ten] = khoangKy(TC.ky, TC.moc);
  const k = tongKy(tu, den); const ht = tongHienTai();
  const theoLop = {};
  k.buoi.forEach(b => { const o = theoLop[b.lop_id] = theoLop[b.lop_id] || { buoi: 0, dt: 0, tn: 0 }; o.buoi++; o.dt += doanhThuBuoi(b); });
  k.tt.forEach(t => { const o = theoLop[t.lop_id] = theoLop[t.lop_id] || { buoi: 0, dt: 0, tn: 0 }; o.tn += t.so_tien; });
  const no = S.khoa_hoc.filter(x => !x.ket_thuc && lopTheoId(x.lop_id) && tk(x).conNo > 0);
  return `
  <header class="dau-trang gon"><div><p class="mat-tren">Tài chính · Tổng kết thu nhập</p><h1>${ten}</h1></div>
    <div class="nhom-nut">
      <div class="phan-doan">${[['ngay', 'Ngày'], ['tuan', 'Tuần'], ['thang', 'Tháng'], ['nam', 'Năm']].map(([v, c]) => `<button data-act="tc-ky" data-v="${v}" class="${TC.ky === v ? 'on' : ''}">${c}</button>`).join('')}</div>
      <button class="nut" data-act="tc-lui">‹</button><button class="nut" data-act="tc-nay">Hiện tại</button><button class="nut" data-act="tc-toi">›</button>
      <button class="nut chinh" data-act="tong-ket" data-thang="${TC.moc.slice(0, 7)}">${ICON.lich} Tổng kết tháng</button>
    </div></header>
  <div class="o-so">
    <div class="o-so-the xanh bam" data-act="chi-tiet-so" data-loai="thuc_nhan" data-tu="${tu}" data-den="${den}" data-ten="${esc(ten)}"><i class="o-so-icon">${ICON['tai-chinh']}</i><span>Tiền thực nhận</span><b>${tien(k.thucNhan)}</b><small>${k.tt.length} giao dịch – tính theo ngày nhận tiền</small></div>
    <div class="o-so-the bam" data-act="chi-tiet-so" data-loai="doanh_thu" data-tu="${tu}" data-den="${den}" data-ten="${esc(ten)}"><i class="o-so-icon">${ICON['ban-tinh']}</i><span>Doanh thu đã dạy</span><b>${tien(k.doanhThu)}</b><small>${k.buoi.length} buổi × đơn giá từng khoá</small></div>
    <div class="o-so-the vang bam" data-act="chi-tiet-so" data-loai="chua_thuc_hien"><i class="o-so-icon">${ICON.lich}</i><span>Học phí chưa thực hiện</span><b>${tien(ht.chuaThucHien)}</b><small>đã đóng tiền nhưng chưa dạy (hiện tại)</small></div>
    <div class="o-so-the canh bam" data-act="chi-tiet-so" data-loai="chua_thu"><i class="o-so-icon">${ICON['tui-gam']}</i><span>Học phí chưa thu</span><b>${tien(ht.chuaThu)}</b><small>${no.length} khoá còn nợ (hiện tại)</small></div>
  </div>
  <p class="goi-y">Bấm vào từng ô để xem chi tiết và cách tính. Tiền học viên đóng trước cả khoá chỉ tính vào <b>thực nhận</b>; <b>doanh thu</b> cộng dần theo từng buổi Thầy đã dạy.</p>
  <section class="the-giay"><div class="dau-muc"><h2>Biểu đồ thu nhập</h2><small class="mo">${{ ngay: '14 ngày gần nhất', tuan: '12 tuần gần nhất', thang: '12 tháng gần nhất', nam: 'Theo năm' }[TC.ky]}</small></div>
    <div class="khung-bieu-do"><canvas id="bieu-do"></canvas></div></section>
  <div class="luoi-2">
    <section class="the-giay"><div class="dau-muc"><h2>Theo lớp trong kỳ</h2></div>
      ${Object.keys(theoLop).length ? `<table class="bang gon"><thead><tr><th>Lớp</th><th>Buổi dạy</th><th class="phai">Doanh thu</th><th class="phai">Thực nhận</th></tr></thead><tbody>
      ${Object.entries(theoLop).sort((a, b) => b[1].dt - a[1].dt).map(([id, o]) => { const L = lopTheoId(Number(id)); return `<tr><td>${L ? tenLop(L) : ''}</td><td>${o.buoi}</td><td class="phai">${tien(o.dt)}</td><td class="phai">${o.tn ? tien(o.tn) : ''}</td></tr>`; }).join('')}</tbody></table>` : oTrong('Không có số liệu trong kỳ.')}
    </section>
    <section class="the-giay"><div class="dau-muc"><h2>Lịch sử giao dịch</h2></div>
      ${k.tt.length ? `<table class="bang gon"><tbody>${k.tt.sort((a, b) => a.ngay < b.ngay ? 1 : -1).map(t => { const L = lopTheoId(t.lop_id); return `<tr><td class="ma">${t.ma}</td><td>${ngayVN(t.ngay)}</td><td>${L ? tenLop(L) : ''}</td><td class="phai"><b>${tien(t.so_tien)}</b></td><td><button class="nut nho" data-act="sua-tt" data-id="${t.id}">Sửa</button></td></tr>`; }).join('')}</tbody></table>` : oTrong('Chưa có giao dịch trong kỳ.')}
    </section>
  </div>
  <section class="the-giay"><div class="dau-muc"><h2>Học phí chưa thu</h2></div>
    ${no.length ? `<table class="bang gon"><thead><tr><th>Lớp</th><th>Khoá</th><th class="phai">Học phí</th><th class="phai">Đã đóng</th><th class="phai">Còn thiếu</th><th></th></tr></thead><tbody>${no.map(x => { const L = lopTheoId(x.lop_id); const y = tk(x); return `<tr><td>${tenLop(L)}</td><td class="ma">${x.ma}</td><td class="phai">${tien(x.hoc_phi)}</td><td class="phai">${tien(y.daDong)}</td><td class="phai"><b class="chu-do">${tien(y.conNo)}</b></td><td class="phai"><button class="nut nho" data-act="thanh-toan" data-lop="${L.id}" data-khoa="${x.id}">Ghi đã thu</button></td></tr>`; }).join('')}</tbody></table>` : oTrong('Không còn khoản nào chưa thu ✓')}
  </section>`;
}
function veBieuDo() {
  const cv = $('#bieu-do'); if (!cv || !window.Chart) return;
  const nhan = [], tn = [], dt = [];
  const them = (tu, den, chu) => { const k = tongKy(tu, den); nhan.push(chu); tn.push(k.thucNhan); dt.push(Math.round(k.doanhThu)); };
  if (TC.ky === 'ngay') for (let i = 13; i >= 0; i--) { const n = congNgay(TC.moc, -i); them(n, n, ngayNgan(n)); }
  else if (TC.ky === 'tuan') for (let i = 11; i >= 0; i--) { const a = dauTuan(congNgay(TC.moc, -7 * i)); them(a, congNgay(a, 6), ngayNgan(a)); }
  else if (TC.ky === 'thang') for (let i = 11; i >= 0; i--) { const [a, b] = khoangKy('thang', dichKy('thang', TC.moc, -i)); them(a, b, `T${Number(a.slice(5, 7))}/${a.slice(2, 4)}`); }
  else { const ys = [...new Set([...S.buoi_hoc.map(b => b.ngay.slice(0, 4)), ...S.thanh_toan.map(t => t.ngay.slice(0, 4))])].sort(); ys.forEach(y => them(`${y}-01-01`, `${y}-12-31`, y)); }
  if (bieuDo) bieuDo.destroy();
  bieuDo = new Chart(cv, {
    type: 'bar',
    data: { labels: nhan, datasets: [
      { label: 'Tiền thực nhận', data: tn, backgroundColor: '#56707A', borderRadius: 4, maxBarThickness: 26 },
      { label: 'Doanh thu đã dạy', data: dt, backgroundColor: '#7C2C20', borderRadius: 4, maxBarThickness: 26 }] },
    options: { responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'top', align: 'end', labels: { font: { family: 'Be Vietnam Pro' }, boxWidth: 12 } },
        tooltip: { callbacks: { label: c => `${c.dataset.label}: ${tien(c.raw)}` } } },
      scales: { y: { ticks: { callback: v => tienGon(v), font: { family: 'Be Vietnam Pro' } }, grid: { color: 'rgba(92,78,54,.12)' } }, x: { grid: { display: false }, ticks: { font: { family: 'Be Vietnam Pro' } } } } },
  });
}

/* ================= CÔNG VIỆC ================= */
function vCongViec() {
  const hn = homNay(); const tuNhac = viecTuNhac();
  let ds = S.cong_viec.slice(); if (CV.nhom !== 'Tất cả') ds = ds.filter(c => c.nhom === CV.nhom);
  const chua = ds.filter(c => !c.xong).sort((a, b) => (a.han || '9999') < (b.han || '9999') ? -1 : (a.han || '9999') > (b.han || '9999') ? 1 : (a.uu_tien || 2) - (b.uu_tien || 2));
  const nhom = [['Quá hạn', chua.filter(c => c.han && c.han < hn)], ['Hôm nay', chua.filter(c => c.han === hn)], ['Sắp tới', chua.filter(c => c.han && c.han > hn)], ['Không đặt hạn', chua.filter(c => !c.han)]];
  const xong = ds.filter(c => c.xong);
  return `
  <header class="dau-trang gon"><div><p class="mat-tren">Quản lý công việc</p><h1>Công việc</h1></div>
    <div class="nhom-nut"><button class="nut chinh" data-act="them-viec">＋ Việc mới</button></div></header>
  <form class="them-nhanh lon" data-form="viec-nhanh">
    <input name="tieu_de" placeholder="Gõ việc cần làm rồi Enter… (VD: Soạn bài 6 HSK2)" autocomplete="off">
    <select name="nhom">${NHOM_VIEC.map(x => `<option>${x}</option>`).join('')}</select>
    <input type="date" name="han" value="${hn}">
    <select name="uu_tien"><option value="1">Gấp</option><option value="2" selected>Vừa</option><option value="3">Thấp</option></select>
    <button class="nut chinh">Thêm</button>
  </form>
  <div class="phan-doan chip-loc">${['Tất cả', ...NHOM_VIEC].map(x => `<button data-act="loc-viec" data-v="${x}" class="${CV.nhom === x ? 'on' : ''}">${x}</button>`).join('')}</div>
  <div class="luoi-2 rong-trai">
    <section class="the-giay">
      ${nhom.filter(([, d]) => d.length).map(([t, d]) => `<h3 class="tieu-de-nho ${t === 'Quá hạn' ? 'chu-do' : ''}">${t} <small>${d.length}</small></h3><ul class="ds-viec">${d.map(dongViec).join('')}</ul>`).join('') || oTrong('Chưa có việc nào. Thêm ở ô phía trên nhé.')}
      ${xong.length ? `<button class="nut-chu" data-act="hien-xong">${CV.hienXong ? '▾' : '▸'} Đã xong (${xong.length})</button>${CV.hienXong ? `<ul class="ds-viec">${xong.sort((a, b) => b.id - a.id).map(dongViec).join('')}</ul>` : ''}` : ''}
    </section>
    <section class="the-giay"><div class="dau-muc"><h2>Web tự nhắc</h2><small class="mo">${tuNhac.length}</small></div>
      <p class="mo nho">Các việc này tự mất khi Thầy xử lý xong (gia hạn, ghi thu tiền, ghi nội dung…).</p>
      ${tuNhac.length ? `<ul class="ds-viec">${tuNhac.map(dongViecTuNhac).join('')}</ul>` : oTrong('Mọi thứ đều ổn ✓')}
    </section>
  </div>`;
}
function moViec(id) {
  const c = id ? S.cong_viec.find(x => x.id === id) : null;
  moHop({
    tieuDe: c ? 'Sửa việc' : 'Việc mới',
    noiDung: `<div class="form luoi-form">
      <label class="ca-dong">Việc cần làm<input name="tieu_de" value="${esc(c ? c.tieu_de : '')}"></label>
      <label>Nhóm<select name="nhom">${NHOM_VIEC.map(x => `<option ${c && c.nhom === x ? 'selected' : ''}>${x}</option>`).join('')}</select></label>
      <label>Hạn<input type="date" name="han" value="${c ? c.han || '' : homNay()}"></label>
      <label>Ưu tiên<select name="uu_tien"><option value="1" ${c && c.uu_tien === 1 ? 'selected' : ''}>Gấp</option><option value="2" ${!c || c.uu_tien === 2 ? 'selected' : ''}>Vừa</option><option value="3" ${c && c.uu_tien === 3 ? 'selected' : ''}>Thấp</option></select></label>
      <label>Gắn với lớp<select name="lop_id">${luaChonLop(c && c.lop_id, false).replace('— Chọn lớp —', '— Không —')}</select></label>
      <label class="ca-dong">Ghi chú<textarea name="ghi_chu" rows="2">${esc(c ? c.ghi_chu || '' : '')}</textarea></label>
    </div>`,
    nut: [
      ...(c ? [{ chu: 'Xoá', kieu: 'nguy', trai: true, bam: async () => { await xoa('cong_viec', c.id); ve(); } }] : []),
      { chu: 'Huỷ', bam: () => {} },
      { chu: 'Lưu', kieu: 'chinh', bam: async n => { const f = docForm(n); if (!f.tieu_de) return false; await luu('cong_viec', { ...f, uu_tien: Number(f.uu_tien), lop_id: f.lop_id ? Number(f.lop_id) : null }, c && c.id); ve(); } }],
  });
}

/* ================= CÀI ĐẶT ================= */
function vCaiDat() {
  const ics = caiDat('ics_token', null);
  const conn = JSON.parse(localStorage.getItem('gyq_ket_noi') || 'null');
  const lan = caiDat('lan_sao_luu', null);
  return `
  <header class="dau-trang gon"><div><p class="mat-tren">Cấu hình</p><h1>Cài đặt</h1></div></header>
  <div class="luoi-2">
    <section class="the-giay"><div class="dau-muc"><h2>Bảng giá học phí</h2><button class="nut nho" data-act="bg-them">＋ Dòng</button></div>
      <p class="mo nho">Đơn giá tính theo giờ. Khi mở khoá, web gợi ý học phí = đơn giá × số giờ/buổi × số buổi (Thầy vẫn sửa được).</p>
      <table class="bang gon bang-gia"><thead><tr><th>Nhóm</th><th>Tên</th><th>Ghi chú</th><th>Tên tiếng Trung</th><th class="phai">Đơn giá / giờ</th><th></th></tr></thead>
      <tbody>${S.bang_gia.slice().sort((a, b) => a.thu_tu - b.thu_tu).map(b => `<tr data-bg="${b.id}">
        <td><input value="${esc(b.nhom)}" data-f="nhom"></td><td><input value="${esc(b.ten)}" data-f="ten"></td><td><input value="${esc(b.mo_ta || '')}" data-f="mo_ta"></td>
        <td><input value="${esc(b.ten_zh || '')}" data-f="ten_zh" class="zh"></td><td><input data-so value="${b.don_gia_gio}" data-f="don_gia_gio" class="phai"></td>
        <td><button class="nut-x" data-act="bg-xoa" data-id="${b.id}" title="Xoá">×</button></td></tr>`).join('')}</tbody></table>
    </section>
    <section class="the-giay"><div class="dau-muc"><h2>Nhắc việc</h2></div>
      <label class="dong-cai">Nhắc gia hạn khi khoá còn ≤ <input type="number" min="0" max="10" value="${nguongGiaHan()}" data-cai="nguong_gia_han" style="width:64px"> buổi</label>
      <div class="dau-muc"><h2>  Lịch Apple (iPhone / MacBook)</h2></div>
      ${DBX.mode === 'supabase' ? `
        <p class="mo nho">Đăng ký 1 lần, lịch dạy trên web sẽ tự hiện trong ứng dụng Lịch và nhắc trước 15 phút. Cần cài "Edge Function lich-apple" theo hướng dẫn.</p>
        ${ics ? `<div class="o-link"><input readonly value="${esc(linkLichApple(conn, ics))}" id="link-ics"><button class="nut nho" data-act="chep-ics">Sao chép</button></div>
          <div class="nhom-nut trai"><a class="nut" href="${esc(linkLichApple(conn, ics).replace(/^https/, 'webcal'))}">Mở trong Lịch Apple</a><button class="nut nho" data-act="tao-ics">Đổi mã bảo mật</button></div>` : `<button class="nut" data-act="tao-ics">Tạo link lịch Apple</button>`}`
      : `<p class="mo nho">Đang dùng dữ liệu trên máy này nên chưa có link đồng bộ tự động. Thầy vẫn tải được file .ics để nhập 1 lần.</p>`}
      <button class="nut" data-act="tai-ics">Tải file .ics (nhập 1 lần)</button>
    </section>
  </div>
  <div class="luoi-2">
    <section class="the-giay"><div class="dau-muc"><h2>Sao lưu dữ liệu</h2></div>
      <p class="mo nho">${lan ? `Lần sao lưu gần nhất: ${ngayVN(lan.slice(0, 10))}` : 'Chưa sao lưu lần nào.'} Nên tải bản sao lưu mỗi tháng và cất vào Google Drive.</p>
      <div class="nhom-nut trai"><button class="nut chinh" data-act="sao-luu">⤓ Tải bản sao lưu (.json)</button><button class="nut" data-act="sao-luu-csv">⤓ Xuất Excel (.csv)</button>
        <label class="nut">⤒ Khôi phục từ file<input type="file" accept=".json,application/json" hidden data-change="khoi-phuc"></label></div>
      <p class="mo nho">Dữ liệu Excel 2026 đã chuyển sẵn: <button class="nut-chu" data-act="nap-excel">nạp vào web</button> (sẽ thay toàn bộ dữ liệu hiện có).</p>
    </section>
    <section class="the-giay"><div class="dau-muc"><h2>Kết nối</h2></div>
      <p>${DBX.mode === 'supabase' ? `Đang lưu online trên <b>Supabase</b><br><small class="mo">${esc(conn ? conn.url : '')}</small>` : 'Đang lưu <b>trên trình duyệt của máy này</b> (bản dùng thử). Dữ liệu không đồng bộ sang máy khác.'}</p>
      <div class="nhom-nut trai">${DBX.mode === 'supabase' ? '<button class="nut" data-act="dang-xuat">Đăng xuất</button>' : ''}<button class="nut" data-act="doi-ket-noi">Đổi kết nối</button></div>
    </section>
  </div>`;
}
function linkLichApple(conn, token) { return conn ? `${conn.url.replace(/\/$/, '')}/functions/v1/lich-apple?token=${token}` : ''; }
