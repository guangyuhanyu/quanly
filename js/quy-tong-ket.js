/* QUỸ TIẾT KIỆM + TỔNG KẾT TUẦN (bản 5.2)
   cai_dat: 'quy' = [{ id, ten, icon, mau, dich, han, ghi: [{ id, ngay, so_tien, nguon, ghi_chu }] }]
            'tong_ket_tuan' = { 'yyyy-mm-dd (thứ Hai)': { tot, sua, uu_tien, diem } }
   Không cần sửa Supabase. */

/* ================= QUỸ TIẾT KIỆM ================= */
const QUY_ICON = { 'Quỹ Tết': 'celebrate', 'Lệ phí thi HSK': 'study', 'Du lịch': 'travel', 'Quỹ khẩn cấp': 'priorities', 'Khác': 'goals' };
const QUY_MAU = ['#C9A0A6', '#7F9BB5', '#8EA888', '#C7BEE3', '#D19A2A', '#A98199'];
const QY = { mo: null };
const dsQuy = () => caiDat('quy', []) || [];
async function luuQuy(a) { await luuCaiDat('quy', a); }
const soDuQuy = q => (q.ghi || []).reduce((s, g) => s + Number(g.so_tien), 0);
const quyIcon = q => `<img class="ic ic-anh" src="assets/icons/${QUY_ICON[q.icon] || q.icon || 'goals'}.webp?v=6.8" alt="">`;

function chiTieuTB3Thang() {
  const hn = homNay(), tu = congNgay(hn, -90);
  const tong = (S.chi_tieu || []).filter(c => c.loai !== 'thu' && c.ngay >= tu && c.ngay <= hn).reduce((s, c) => s + c.so_tien, 0);
  return Math.round(tong / 3);
}
function nguonChuaChia() {
  const tqTien = S.thoi_quen.filter(h => h.don_vi === 'đ').map(h => h.id);
  const tuThoiQuen = (S.thoi_quen_nhat_ky || []).filter(x => tqTien.includes(x.thoi_quen_id)).reduce((s, x) => s + Number(x.gia_tri), 0);
  const tuNhin = (caiDat('style_nhin', { tong: 0 }) || {}).tong || 0;
  const daChia = n => dsQuy().reduce((s, q) => s + (q.ghi || []).filter(g => g.nguon === n).reduce((a, g) => a + Number(g.so_tien), 0), 0);
  return { tq: Math.max(0, tuThoiQuen - daChia('tq')), nhin: Math.max(0, tuNhin - daChia('nhin')) };
}
function canGop(q) {
  const con = Math.max(0, (Number(q.dich) || 0) - soDuQuy(q)); if (!con || !q.han) return null;
  const ngay = stSoNgay(homNay(), q.han); if (ngay <= 0) return { qua: true, con };
  return { con, ngay, thang: Math.round(con / Math.max(1, ngay / 30.44)), tuan: Math.round(con / Math.max(1, ngay / 7)), ngayTien: Math.round(con / ngay) };
}

function vQuy() {
  const ds = dsQuy(), tong = ds.reduce((s, q) => s + soDuQuy(q), 0), dich = ds.reduce((s, q) => s + (Number(q.dich) || 0), 0);
  const ng = nguonChuaChia();
  const thang = homNay().slice(0, 7);
  const gopThang = ds.reduce((s, q) => s + (q.ghi || []).filter(g => g.ngay.startsWith(thang) && g.so_tien > 0).reduce((a, g) => a + Number(g.so_tien), 0), 0);
  return `
  <header class="dau-trang gon"><div><p class="mat-tren">Tích tiểu thành đại · 积少成多</p><h1>${ICON.celebrate} Quỹ tiết kiệm</h1></div>
    <button class="nut chinh" data-act="qy-moi">${ICON.cong} Quỹ mới</button></header>
  <div class="st-tk">
    <div><small>Tổng trong các quỹ</small><b>${tienGon(tong)}</b><span>${dich ? `/ ${tienGon(dich)}` : ''}</span></div>
    <div><small>Đã góp tháng ${Number(thang.slice(5))}</small><b>${tienGon(gopThang)}</b><span>&nbsp;</span></div>
    <div><small>Từ thói quen tiết kiệm</small><b>${tienGon(ng.tq)}</b><span>chưa chia vào quỹ</span></div>
    <div><small>Từ nhịn mua đồ</small><b>${tienGon(ng.nhin)}</b><span>chưa chia vào quỹ</span></div>
  </div>
  ${ng.tq || ng.nhin ? `<p class="st-meo">💡 Thầy còn <b>${tien(ng.tq + ng.nhin)}</b> tiết kiệm được nhưng chưa chia vào quỹ nào. Bấm <b>+ Góp</b> ở một quỹ và chọn nguồn "Thói quen tiết kiệm" hoặc "Tiền nhịn mua đồ".</p>` : ''}
  ${ds.length ? `<div class="qy-luoi">${ds.map(q => theQuy(q)).join('')}</div>`
    : `<section class="the-giay">${oTrong('Chưa có quỹ nào.', `<button class="nut chinh" data-act="qy-mau">Tạo 4 quỹ gợi ý</button> <button class="nut" data-act="qy-moi">Tự tạo</button>`)}<p class="mo nho giua">Gợi ý: Quỹ Tết (hạn trước Tết) · Lệ phí thi HSK · Du lịch · Quỹ khẩn cấp (bằng 3 tháng chi tiêu, web tự tính từ mục Chi tiêu)</p></section>`}
  ${QY.mo ? lichSuQuy(ds.find(q => q.id === QY.mo)) : ''}`;
}
function theQuy(q) {
  const sd = soDuQuy(q), d = Number(q.dich) || 0, p = d ? Math.min(100, sd / d * 100) : 0, c = canGop(q);
  return `<div class="qy-the" style="--m:${esc(q.mau || '#7F9BB5')}">
    <div class="qy-dau"><span class="qy-icon">${quyIcon(q)}</span><div><b>${esc(q.ten)}</b><small>${q.han ? `Hạn ${ngayVN(q.han)}` : 'Không đặt hạn'}</small></div><button class="nut-x" data-act="qy-sua" data-id="${q.id}">⋯</button></div>
    <div class="qy-vong" style="--p:${p.toFixed(1)}"><b>${Math.round(p)}%</b></div>
    <div class="qy-so"><b>${tien(sd)}</b>${d ? `<span>/ ${tien(d)}</span>` : ''}</div>
    ${c ? (c.qua ? `<p class="qy-goi chu-do">Đã quá hạn, còn thiếu ${tien(c.con)}</p>` : `<p class="qy-goi">Còn ${c.ngay} ngày, thiếu ${tienGon(c.con)} → góp <b>${tienGon(c.tuan)}/tuần</b> (≈ ${tienGon(c.ngayTien)}/ngày)</p>`) : d && sd >= d ? '<p class="qy-goi chu-xanh">🎉 Đã đủ đích!</p>' : ''}
    <div class="nhom-nut"><button class="nut nho chinh" data-act="qy-gop" data-id="${q.id}">+ Góp</button><button class="nut nho" data-act="qy-rut" data-id="${q.id}">− Rút</button><button class="nut nho" data-act="qy-xem" data-id="${q.id}">Lịch sử</button></div>
  </div>`;
}
function lichSuQuy(q) {
  if (!q) return '';
  const g = [...(q.ghi || [])].sort((a, b) => b.ngay.localeCompare(a.ngay));
  const nguon = { tay: '', tq: ' · từ thói quen tiết kiệm', nhin: ' · từ tiền nhịn mua đồ' };
  return `<section class="the-giay"><div class="dau-muc"><h2>Lịch sử: ${esc(q.ten)}</h2><button class="nut-x" data-act="qy-xem" data-id="">×</button></div>
    ${g.length ? g.map(x => `<div class="ct-dong"><span><b>${ngayVN(x.ngay)}</b><small>${esc(x.ghi_chu || '')}${nguon[x.nguon] || ''}</small></span><b class="${x.so_tien > 0 ? 'chu-xanh' : ''}">${x.so_tien > 0 ? '+' : '−'}${tien(Math.abs(x.so_tien))}</b><button class="nut-x" data-act="qy-xoa-ghi" data-id="${q.id}" data-g="${x.id}">×</button></div>`).join('') : '<p class="mo">Chưa có lần góp nào.</p>'}</section>`;
}
function moQuy(id) {
  const q = id ? dsQuy().find(x => x.id === id) : { ten: '', icon: 'Khác', mau: QUY_MAU[dsQuy().length % QUY_MAU.length] };
  const tb = chiTieuTB3Thang();
  moHop({
    tieuDe: id ? 'Sửa quỹ' : 'Quỹ mới',
    noiDung: `<div class="form luoi-form">
      <label class="ca-dong">Tên quỹ<input name="ten" value="${esc(q.ten)}" placeholder="VD: Quỹ Tết 2027, Mua máy tính mới…"></label>
      <label>Loại / biểu tượng<select name="icon">${Object.keys(QUY_ICON).map(k => `<option ${q.icon === k ? 'selected' : ''}>${k}</option>`).join('')}</select></label>
      <label>Đích cần đạt (đ)<input data-so name="dich" value="${q.dich || ''}"></label>
      <label>Hạn (không bắt buộc)<input type="date" name="han" value="${esc(q.han || '')}"></label>
      <div class="ca-dong"><span class="nhan">Màu</span><div class="gd-mau">${QUY_MAU.map(m => `<label class="o-mau" style="--m:${m}"><input type="radio" name="mau" value="${m}" ${q.mau === m ? 'checked' : ''}><span></span></label>`).join('')}</div></div>
      ${tb ? `<p class="ca-dong mo nho">Gợi ý quỹ khẩn cấp: 3 tháng chi tiêu ≈ <b>${tien(tb * 3)}</b> (trung bình ${tienGon(tb)}/tháng theo mục Chi tiêu 90 ngày qua).</p>` : ''}
    </div>`,
    khiMo: ganOTien,
    nut: [
      ...(id ? [{ chu: 'Xoá quỹ', kieu: 'nguy', trai: true, bam: async () => { if (!(await hoi(`Xoá "${esc(q.ten)}" và lịch sử góp?`, 'Xoá', 'nguy'))) return false; await luuQuy(dsQuy().filter(x => x.id !== id)); QY.mo = null; ve(); } }] : []),
      { chu: 'Huỷ', bam: () => { } },
      { chu: 'Lưu', kieu: 'chinh', bam: async n => { const f = docForm(n); if (!f.ten) return false; const moi = { ...q, id: id || 'qy' + Date.now(), ten: f.ten, icon: f.icon, dich: Number(f.dich) || 0, han: f.han || '', mau: f.mau || q.mau, ghi: q.ghi || [] }; await luuQuy([...dsQuy().filter(x => x.id !== moi.id), moi]); ve(); } }],
  });
}
function moGop(id, rut) {
  const q = dsQuy().find(x => x.id === id), ng = nguonChuaChia();
  moHop({
    tieuDe: `${rut ? 'Rút khỏi' : 'Góp vào'} ${esc(q.ten)}`,
    noiDung: `<div class="form luoi-form">
      <label>Số tiền (đ)<input data-so name="so" required></label>
      <label>Ngày<input type="date" name="ngay" value="${homNay()}"></label>
      ${rut ? '' : `<label class="ca-dong">Nguồn<select name="nguon"><option value="tay">Tiền riêng</option><option value="tq">Thói quen tiết kiệm (còn ${tienGon(ng.tq)})</option><option value="nhin">Tiền nhịn mua đồ (còn ${tienGon(ng.nhin)})</option></select></label>`}
      <label class="ca-dong">Ghi chú<input name="ghi_chu" placeholder="${rut ? 'Rút để mua vé xe về quê…' : ''}"></label>
      ${rut ? '' : `<div class="ca-dong nhom-nut">${[50000, 100000, 200000, 500000].map(v => `<button type="button" class="nut nho" data-dien="${v}">${tienGon(v)}</button>`).join('')}</div>`}
    </div>`,
    khiMo: n => { ganOTien(n); n.querySelectorAll('[data-dien]').forEach(b => b.onclick = () => { const o = n.querySelector('[name=so]'); o.value = NF.format(Number(b.dataset.dien)); }); },
    nut: [{ chu: 'Huỷ', bam: () => { } }, { chu: rut ? 'Rút' : 'Góp', kieu: 'chinh', bam: async n => {
      const f = docForm(n), so = Number(f.so) || 0; if (!so) return false;
      if (rut && so > soDuQuy(q)) { toast('Số rút lớn hơn số dư quỹ', 'loi'); return false; }
      if (!rut && f.nguon && f.nguon !== 'tay' && so > ng[f.nguon]) { toast(`Nguồn này chỉ còn ${tien(ng[f.nguon])} chưa chia`, 'loi'); return false; }
      const g = { id: 'g' + Date.now(), ngay: f.ngay || homNay(), so_tien: rut ? -so : so, nguon: rut ? 'tay' : (f.nguon || 'tay'), ghi_chu: f.ghi_chu || '' };
      await luuQuy(dsQuy().map(x => x.id === id ? { ...x, ghi: [...(x.ghi || []), g] } : x));
      const sd = soDuQuy({ ghi: [...(q.ghi || []), g] });
      toast(!rut && q.dich && sd >= q.dich ? `🎉 ${q.ten} đã đủ đích!` : `${rut ? 'Đã rút' : 'Đã góp'} ${tien(so)} ✓`); ve();
    } }],
  });
}
const HD_QY = {
  'qy-moi': () => moQuy(null),
  'qy-sua': el => moQuy(el.dataset.id),
  'qy-gop': el => moGop(el.dataset.id, false),
  'qy-rut': el => moGop(el.dataset.id, true),
  'qy-xem': el => { QY.mo = el.dataset.id || null; ve(); },
  'qy-xoa-ghi': async el => { if (!(await hoi('Xoá lần góp/rút này?', 'Xoá', 'nguy'))) return; await luuQuy(dsQuy().map(q => q.id === el.dataset.id ? { ...q, ghi: q.ghi.filter(g => g.id !== el.dataset.g) } : q)); ve(); },
  'qy-mau': async () => {
    const y = Number(homNay().slice(0, 4)), tetHan = homNay() < `${y}-02-01` ? `${y}-01-25` : `${y + 1}-01-25`, tb = chiTieuTB3Thang(), t = Date.now();
    await luuQuy([
      { id: 'qy' + t, ten: 'Quỹ Tết', icon: 'Quỹ Tết', mau: '#C9A0A6', dich: 10000000, han: tetHan, ghi: [] },
      { id: 'qy' + (t + 1), ten: 'Lệ phí thi HSK', icon: 'Lệ phí thi HSK', mau: '#7F9BB5', dich: 2000000, han: '', ghi: [] },
      { id: 'qy' + (t + 2), ten: 'Du lịch', icon: 'Du lịch', mau: '#8EA888', dich: 8000000, han: '', ghi: [] },
      { id: 'qy' + (t + 3), ten: 'Quỹ khẩn cấp', icon: 'Quỹ khẩn cấp', mau: '#C7BEE3', dich: Math.max(10000000, Math.round(tb * 3 / 100000) * 100000), han: '', ghi: [] },
    ]); toast('Đã tạo 4 quỹ. Thầy bấm ⋯ để sửa đích và hạn cho đúng ý nhé'); ve();
  },
};
function quyHomNay() {
  const ds = dsQuy().filter(q => q.dich && q.han && soDuQuy(q) < q.dich).sort((a, b) => a.han.localeCompare(b.han));
  if (!ds.length) return '';
  const q = ds[0], c = canGop(q), p = Math.min(100, soDuQuy(q) / q.dich * 100);
  return `<section class="the-giay"><div class="dau-muc"><h2 class="co-icon">${ICON.celebrate}Quỹ tiết kiệm</h2><a href="#/quy">Mở →</a></div><div class="qy-mini"><span>${quyIcon(q)}<b>${esc(q.ten)}</b> ${Math.round(p)}%</span><div class="mt-thanh"><i style="width:${p}%"></i></div>${c && !c.qua ? `<small>Còn ${c.ngay} ngày · nên góp ${tienGon(c.tuan)}/tuần</small>` : ''}</div></section>`;
}

/* ================= TỔNG KẾT TUẦN ================= */
const TK = { tuan: null };
function soLieuTuan(dau) {
  const cuoi = congNgay(dau, 6), hn = homNay(), cuoiThat = cuoi < hn ? cuoi : hn, truoc = congNgay(dau, -7);
  const trongTuan = d => d >= dau && d <= cuoi;
  // dạy học
  const buoi = S.buoi_hoc.filter(b => trongTuan(b.ngay));
  const k = tongKy(dau, cuoi), kTruoc = tongKy(truoc, congNgay(dau, -1));
  const day = { da: buoi.filter(b => b.trang_thai === 'da_day').length, nghi: buoi.filter(b => b.trang_thai === 'nghi' || b.trang_thai === 'huy').length, cho: buoi.filter(b => b.trang_thai === 'du_kien').length, thuc: k.thucNhan, dt: k.doanhThu, dtTruoc: kTruoc.doanhThu };
  // thói quen
  const soNgayQua = Math.max(0, stSoNgay(dau, cuoiThat) + 1);
  const tq = S.thoi_quen.filter(h => h.dang_dung !== false).map(h => { const o = [...Array(7)].map((_, i) => { const d = congNgay(dau, i); return d > hn ? null : datTQ(h, giaTriTQ(h.id, d)); }); const dat = o.filter(Boolean).length; return { h, o, dat, pt: soNgayQua ? Math.round(dat / soNgayQua * 100) : 0 }; }).sort((a, b) => b.pt - a.pt);
  // HSK 7–9
  const hsk = caiDat('lo_trinh_hsk79', null) ? l79TkKhoang(dau, cuoi) : null;
  const hskPhut = hsk ? [...Array(7)].reduce((s, _, i) => { const d = congNgay(dau, i); return d > hn ? s : s + l79BaiNgay(d).filter(b => l79Xong(d, b)).reduce((a, b) => a + b.min, 0); }, 0) : 0;
  // chi tiêu
  const chi = (S.chi_tieu || []).filter(c => c.loai !== 'thu' && trongTuan(c.ngay)), chiTruoc = (S.chi_tieu || []).filter(c => c.loai !== 'thu' && c.ngay >= truoc && c.ngay < dau);
  const tongChi = chi.reduce((s, c) => s + c.so_tien, 0), tongChiTruoc = chiTruoc.reduce((s, c) => s + c.so_tien, 0);
  const dm = {}; chi.forEach(c => dm[c.danh_muc || 'Khác'] = (dm[c.danh_muc || 'Khác'] || 0) + c.so_tien);
  const dmTop = Object.entries(dm).sort((a, b) => b[1] - a[1]).slice(0, 3);
  const ym = cuoiThat.slice(0, 7), ns = Number(caiDat('ngan_sach_thang', 0)) || 0;
  const chiThang = (S.chi_tieu || []).filter(c => c.loai !== 'thu' && c.ngay.startsWith(ym)).reduce((s, c) => s + c.so_tien, 0);
  // quỹ
  const gop = dsQuy().reduce((s, q) => s + (q.ghi || []).filter(g => trongTuan(g.ngay) && g.so_tien > 0).reduce((a, g) => a + Number(g.so_tien), 0), 0);
  // mục tiêu tháng
  const y = Number(cuoiThat.slice(0, 4)), m = Number(cuoiThat.slice(5, 7));
  const mt = (typeof dsMT === 'function' ? dsMT() : []).filter(g => g.ky === 'thang' && g.nam === y && g.thang === m).map(g => ({ g, t: trangThaiMT(g) }));
  const mtTuan = (typeof dsMT === 'function' ? dsMT() : []).filter(g => g.ky === 'tuan' && g.tuan === dau).map(g => ({ g, t: trangThaiMT(g) }));
  // style + skincare
  const tu = typeof tuDo === 'function' ? tuDo() : [];
  const ngayCoOutfit = new Set(tu.flatMap(x => (x.mac || []).filter(trongTuan))).size;
  const muaMoi = tu.filter(x => x.ngay_mua && trongTuan(x.ngay_mua));
  const sk = caiDat('skincare', null); let skDu = 0;
  if (sk) for (let i = 0; i < 7; i++) { const d = congNgay(dau, i); ['sang', 'toi'].forEach(b => { if ((sk.log || {})[`${d}|${b}`] && sk.log[`${d}|${b}`].length >= (sk[b] || []).length) skDu++; }); }
  // chiêm tinh tuần tới
  let ct = null;
  if (typeof laSoGoc === 'function' && window.Astronomy && laSoGoc()) {
    const dauToi = congNgay(dau, 7);
    const ngay = [...Array(7)].map((_, i) => { const d = congNgay(dauToi, i); const v = vanTrinh(d); return { d, v }; });
    const tot = ngay.slice().sort((a, b) => b.v.tong - a.v.tong)[0], xau = ngay.slice().sort((a, b) => a.v.tong - b.v.tong)[0];
    const sk2 = []; ngay.forEach(({ d, v }) => v.suKien.forEach(s => { if (!sk2.some(x => x.tieu === s.tieu)) sk2.push({ ...s, d }); }));
    ct = { tot, xau, sk: sk2.slice(0, 4) };
  }
  return { dau, cuoi, mtTuan, day, tq, hsk, hskPhut, tongChi, tongChiTruoc, dmTop, chiThang, ns, gop, mt, ngayCoOutfit, muaMoi, skDu, coSk: !!sk, ct, xong: cuoi < hn };
}

function vTongKetTuan() {
  const hn = homNay();
  if (!TK.tuan) TK.tuan = dauTuan(hn);
  const s = soLieuTuan(TK.tuan), luu = (caiDat('tong_ket_tuan', {}) || {})[TK.tuan] || {};
  const lech = (a, b) => b ? `${a >= b ? '↑' : '↓'} ${Math.abs(Math.round((a - b) / b * 100))}% so với tuần trước` : '';
  const sao = n => `<span class="ct-sao">${'★'.repeat(n)}<i>${'★'.repeat(5 - n)}</i></span>`;
  const lichSu = Object.entries(caiDat('tong_ket_tuan', {}) || {}).sort((a, b) => b[0].localeCompare(a[0])).slice(0, 8);
  return `
  <header class="dau-trang gon"><div><p class="mat-tren">Nhìn lại để đi tiếp · 回顾</p><h1>${ICON.notes} Tổng kết tuần</h1></div>
    <div class="vien-thang"><button class="nut-tron" data-act="tk-tuan" data-d="-7">${ICON.trai}</button><span>${ngayNgan(s.dau)} – ${ngayNgan(s.cuoi)}</span><button class="nut-tron" data-act="tk-tuan" data-d="7" ${s.cuoi >= hn ? 'disabled' : ''}>${ICON.phai}</button></div></header>
  ${!s.xong ? `<p class="st-meo">Tuần đang diễn ra, số liệu tính đến hôm nay. Tối Chủ nhật là lúc đẹp nhất để viết tổng kết.</p>` : ''}
  <div class="tk-luoi">
    <section class="the-giay"><div class="dau-muc"><h2 class="co-icon">${ICON.lop}Dạy học</h2></div>
      <div class="tk-so"><div><b>${s.day.da}</b><small>buổi đã dạy</small></div><div><b>${s.day.nghi}</b><small>buổi nghỉ/huỷ</small></div><div><b>${s.day.cho}</b><small>chưa điểm danh</small></div></div>
      <p class="tk-dong">Doanh thu đã dạy <b>${tien(s.day.dt)}</b> <small>${lech(s.day.dt, s.day.dtTruoc)}</small></p>
      <p class="tk-dong">Thực nhận <b>${tien(s.day.thuc)}</b></p>
      ${s.day.cho ? `<p class="st-meo nhac">Còn ${s.day.cho} buổi trong tuần chưa điểm danh. Thầy vào Lịch dạy để cập nhật nhé.</p>` : ''}
    </section>
    <section class="the-giay"><div class="dau-muc"><h2 class="co-icon">${ICON['thoi-quen']}Thói quen</h2></div>
      ${s.tq.length ? `<div class="tk-tq">${s.tq.map(o => `<div><span>${esc(o.h.ten)}</span><div class="tk-7">${o.o.map(v => `<i class="${v === null ? 'tl' : v ? 'on' : ''}" style="--m:${esc(o.h.mau || '#8EA888')}"></i>`).join('')}</div><b>${o.pt}%</b></div>`).join('')}</div>
        <p class="tk-dong">Giữ tốt nhất: <b>${esc(s.tq[0].h.ten)}</b>${s.tq.length > 1 && s.tq.slice(-1)[0].pt < 50 ? ` · cần chú ý: <b>${esc(s.tq.slice(-1)[0].h.ten)}</b>` : ''}</p>` : '<p class="mo">Chưa có thói quen.</p>'}
      ${s.hsk ? `<p class="tk-dong">Ôn HSK 7–9: <b>${s.hsk.ok}/${s.hsk.tong} bài</b> (${s.hsk.pt}%) · khoảng <b>${s.hskPhut} phút</b></p>` : ''}
      ${s.coSk ? `<p class="tk-dong">Skincare: <b>${s.skDu}/14</b> buổi đủ bước</p>` : ''}
    </section>
    <section class="the-giay"><div class="dau-muc"><h2 class="co-icon">${ICON['chi-tieu']}Tiền bạc</h2></div>
      <p class="tk-dong">Chi tiêu tuần <b>${tien(s.tongChi)}</b> <small>${lech(s.tongChi, s.tongChiTruoc)}</small></p>
      ${s.dmTop.length ? `<p class="tk-dong">Chi nhiều nhất: ${s.dmTop.map(([d, v]) => `${esc(d)} <b>${tienGon(v)}</b>`).join(' · ')}</p>` : ''}
      ${s.ns ? `<p class="tk-dong">Ngân sách tháng: đã dùng <b>${tienGon(s.chiThang)}</b> / ${tienGon(s.ns)}${s.chiThang > s.ns ? ' <span class="chu-do">vượt rồi</span>' : ` · còn <b>${tienGon(s.ns - s.chiThang)}</b>`}</p>` : ''}
      <p class="tk-dong">Góp vào quỹ tiết kiệm: <b>${tien(s.gop)}</b></p>
      ${s.muaMoi.length ? `<p class="tk-dong">Đồ mới mua: ${s.muaMoi.map(x => esc(x.ten)).join(', ')}</p>` : ''}
      ${s.ngayCoOutfit ? `<p class="tk-dong">Ghi outfit <b>${s.ngayCoOutfit}</b> ngày</p>` : ''}
    </section>
    ${mfTongKet(s.dau, s.cuoi)}
    <section class="the-giay"><div class="dau-muc"><h2 class="co-icon">${ICON.todo}Mục tiêu tuần</h2>${s.mtTuan.length ? `<span class="the">${s.mtTuan.filter(x => x.t.p >= 1).length}/${s.mtTuan.length} đạt</span>` : ''}</div>
      ${s.mtTuan.length ? s.mtTuan.map(({ g, t }) => `<div class="tk-mt"><span>${esc(g.ten)}</span><div class="mt-thanh"><i style="width:${(t.p * 100).toFixed(0)}%"></i></div><span class="the mt-nhan ${t.lop}">${t.nhan}</span></div>`).join('') : '<p class="mo">Tuần này chưa đặt mục tiêu. <a href="#/muc-tieu">Đặt mục tiêu tuần →</a></p>'}
    </section>
    <section class="the-giay"><div class="dau-muc"><h2 class="co-icon">${ICON.goals}Mục tiêu tháng</h2><a href="#/muc-tieu">Mở →</a></div>
      ${s.mt.length ? s.mt.map(({ g, t }) => `<div class="tk-mt"><span>${esc(g.ten)}</span><div class="mt-thanh"><i style="width:${(t.p * 100).toFixed(0)}%"></i></div><span class="the mt-nhan ${t.lop}">${t.nhan}</span></div>`).join('') : '<p class="mo">Tháng này chưa đặt mục tiêu.</p>'}
    </section>
    ${s.ct ? `<section class="the-giay"><div class="dau-muc"><h2 class="co-icon">${ICON['chiem-tinh']}Tuần tới theo chiêm tinh</h2></div>
      <p class="tk-dong">Ngày thuận nhất: <b>${THU[s2d(s.ct.tot.d).getDay()]} ${ngayNgan(s.ct.tot.d)}</b> ${sao(s.ct.tot.v.tong)}, hợp xếp việc quan trọng.</p>
      <p class="tk-dong">Ngày nên nhẹ nhàng: <b>${THU[s2d(s.ct.xau.d).getDay()]} ${ngayNgan(s.ct.xau.d)}</b> ${sao(s.ct.xau.v.tong)}</p>
      ${s.ct.sk.map(x => `<p class="tk-dong"><span class="ky-ht">${x.ky}</span> ${x.tieu} <small>(${ngayNgan(x.d)})</small></p>`).join('')}
    </section>` : ''}
    <section class="the-giay tk-viet"><div class="dau-muc"><h2 class="co-icon">${ICON.journal}Thầy tự nhìn lại</h2>${luu.luc ? `<small class="mo">đã lưu</small>` : ''}</div>
      <form class="form" data-form="tk-luu">
        <label>Tuần này Thầy chấm mình mấy điểm?<div class="tk-diem">${[1, 2, 3, 4, 5].map(n => `<label><input type="radio" name="diem" value="${n}" ${Number(luu.diem) === n ? 'checked' : ''}><span>${n}</span></label>`).join('')}</div></label>
        <label>Điều làm tốt / đáng vui<textarea name="tot" rows="2">${esc(luu.tot || '')}</textarea></label>
        <label>Điều muốn cải thiện<textarea name="sua" rows="2">${esc(luu.sua || '')}</textarea></label>
        <label>3 ưu tiên tuần tới <small class="mo">(mỗi dòng một việc)</small><textarea name="uu_tien" rows="3">${esc(luu.uu_tien || '')}</textarea></label>
        <div class="nhom-nut"><button class="nut chinh">Lưu tổng kết</button><label class="st-chk"><input type="checkbox" name="them_mt" ${luu.luc ? '' : 'checked'}> Biến 3 ưu tiên thành mục tiêu tuần tới</label><label class="st-chk"><input type="checkbox" name="them_viec"> Thêm vào Công việc</label></div>
      </form>
    </section>
  </div>
  ${lichSu.length ? `<section class="the-giay"><div class="dau-muc"><h2>Các tuần trước</h2></div><div class="tk-ls">${lichSu.map(([d, v]) => `<button data-act="tk-mo" data-d="${d}" class="${d === TK.tuan ? 'on' : ''}"><b>${ngayNgan(d)}</b><span>${v.diem ? '★'.repeat(v.diem) : '—'}</span><small>${esc((v.tot || '').split('\n')[0].slice(0, 40))}</small></button>`).join('')}</div></section>` : ''}`;
}
async function luuTongKet(f) {
  const d = docForm(f), ds = { ...(caiDat('tong_ket_tuan', {}) || {}) };
  ds[TK.tuan] = { diem: Number(d.diem) || 0, tot: d.tot || '', sua: d.sua || '', uu_tien: d.uu_tien || '', luc: new Date().toISOString() };
  await luuCaiDat('tong_ket_tuan', ds);
  const viecUT = (d.uu_tien || '').split('\n').map(x => x.trim()).filter(Boolean).slice(0, 5);
  if (f.querySelector('[name=them_mt]')?.checked && viecUT.length && typeof themMTTuan === 'function') {
    const tuanSau = congNgay(TK.tuan, 7), daCo = dsMT().filter(g => g.ky === 'tuan' && g.tuan === tuanSau).map(g => g.ten);
    await themMTTuan(viecUT.filter(x => !daCo.includes(x)).map(x => ({ ten: x, ghi_chu: 'Ưu tiên từ tổng kết tuần' })), tuanSau);
  }
  if (f.querySelector('[name=them_viec]')?.checked) {
    const viec = (d.uu_tien || '').split('\n').map(x => x.trim()).filter(Boolean).slice(0, 5), han = congNgay(TK.tuan, 13);
    for (const t of viec) await luu('cong_viec', { tieu_de: t, nhom: 'Cá nhân', han, uu_tien: 1, xong: false, ghi_chu: 'Ưu tiên từ tổng kết tuần' });
    toast(viec.length ? `Đã lưu và thêm ${viec.length} ưu tiên vào Công việc ✓` : 'Đã lưu tổng kết ✓');
  } else toast('Đã lưu tổng kết ✓');
  ve();
}
const HD_TK = {
  'tk-tuan': el => { TK.tuan = congNgay(TK.tuan || dauTuan(homNay()), Number(el.dataset.d)); ve(); },
  'tk-mo': el => { TK.tuan = el.dataset.d; if (!location.hash.startsWith('#/tong-ket')) location.hash = '#/tong-ket'; else ve(); window.scrollTo({ top: 0, behavior: 'smooth' }); },
};
function tongKetHomNay() {
  const d = new Date().getDay(); if (d !== 0 && d !== 1) return '';
  const tuan = d === 0 ? dauTuan(homNay()) : congNgay(dauTuan(homNay()), -7);
  if (((caiDat('tong_ket_tuan', {}) || {})[tuan] || {}).luc) return '';
  return `<section class="the-giay tk-nhac"><div class="dau-muc"><h2 class="co-icon">${ICON.notes}Tổng kết tuần</h2></div>
    <p class="mo">${d === 0 ? 'Chủ nhật rồi, dành 5 phút nhìn lại tuần này nhé Thầy.' : 'Tuần trước chưa được tổng kết.'}</p>
    <a class="nut chinh" href="#/tong-ket" data-act="tk-mo" data-d="${tuan}">Viết tổng kết</a></section>`;
}

/* ================= NHẮC SAO LƯU HẰNG TUẦN ================= */
function nhacSaoLuu() {
  if (DBX.mode !== 'supabase') return '';
  const lan = caiDat('lan_sao_luu', null), bd = caiDat('ngay_dung_web', homNay());
  const ngay = lan ? Math.floor((Date.now() - new Date(lan).getTime()) / 864e5) : stSoNgay(bd, homNay());
  if (ngay < 7) return '';
  return `<section class="the-giay tk-nhac"><div class="dau-muc"><h2 class="co-icon">${ICON.notes}Sao lưu dữ liệu</h2></div>
    <p class="mo">${lan ? `Đã ${ngay} ngày Thầy chưa tải bản sao lưu.` : 'Thầy chưa tải bản sao lưu nào.'} Một chạm là xong, file .json nên cất vào Google Drive.</p>
    <button class="nut chinh" data-act="sao-luu">⤓ Tải bản sao lưu</button></section>`;
}
