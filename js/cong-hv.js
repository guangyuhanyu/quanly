/* TRANG HỌC VIÊN (bản 6.5)
   - Mỗi lớp 1 mã tra cứu (cai_dat 'cong_lop' = { [lopId]: { ma, bat, zoom } }), địa chỉ trang: cai_dat 'cong_url'.
   - Web quản lý tự soạn bản tóm tắt từng lớp → đăng vào bảng tra_cuu_lop (học viên chỉ đọc được qua hàm xem_lop).
   - Hồ sơ học viên gửi vào ho_so_gui → Thầy duyệt ở trang Hôm nay rồi mới ghi vào hoc_vien.
   Cần chạy supabase/6-trang-hoc-vien.sql một lần. */
const CONG = { cuoi: {}, hen: null, loi: '', luc: null, hs: [], hsLuc: 0, daKiem: false };
const CONG_URL_MD = 'https://guangyuhanyu.github.io/lop/';
const congCD = () => caiDat('cong_lop', {}) || {};
const congUrl = () => caiDat('cong_url', '') || CONG_URL_MD;
const coSupa = () => !!(DBX && DBX.sb);
const maDep = m => m ? m.slice(0, 4) + '-' + m.slice(4) : '';
function taoMaLop() {
  const chu = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789', a = new Uint32Array(8); crypto.getRandomValues(a);
  return [...a].map(x => chu[x % chu.length]).join('');
}
const LUU_Y_LOP = [
  'Lớp học trực tuyến qua Zoom. Link phòng học cố định ở nút "Vào lớp Zoom" phía trên.',
  'Chuẩn bị giáo trình, vở ghi; cố gắng làm bài tập và ôn từ vựng sau mỗi buổi.',
  'Cần xin nghỉ hoặc dời lịch, anh/chị/bạn nhắn Thầy trước ít nhất 4 tiếng. Báo quá sát giờ (trừ trường hợp bất khả kháng), thời lượng buổi đó sẽ được chia nhỏ và cộng vào các buổi sau.',
  'Thầy bận đột xuất thì buổi học được dạy bù theo lịch thống nhất.',
  'Lớp nhóm: bạn vắng mặt sẽ được Thầy gửi bản ghi buổi học để xem lại.',
  'Học phí đóng vào đầu mỗi khoá bằng chuyển khoản, nội dung ghi Tên học viên + Lớp, rồi gửi Thầy ảnh giao dịch.',
  'Dừng học giữa khoá được bảo lưu số buổi còn lại trong 6–12 tháng. Học phí đã đóng không hoàn lại.',
];

/* ---------- bản tóm tắt công khai của 1 lớp ---------- */
function banTomTat(L) {
  const c = congCD()[L.id] || {}, k = khoaHienTai(L.id), t = k ? tk(k) : null, hn = homNay();
  const hv = hvCuaLop(L.id).map(h => ({ id: h.id, ten: h.ten_goi || h.ho_ten, thieu: [!h.sdt && 'sdt', !h.email && 'email', !h.ngay_sinh && 'ngay_sinh'].filter(Boolean) }));
  let khoa = null, buoi = [];
  if (k) {
    let hp;
    if (t.conNo <= 0) { const cuoi = t.tt[t.tt.length - 1]; hp = { xong: true, chu: `Đã nhận ✓${cuoi ? ` ngày ${ngayVN(cuoi.ngay)}` : ''}` }; }
    else if (t.daDong > 0) hp = { xong: false, chu: `Đã nhận ${tien(t.daDong)} – còn ${tien(t.conNo)}` };
    else hp = { xong: false, chu: `Chưa đóng (${tien(k.hoc_phi)})` };
    const sau = t.conLai <= nguongGiaHan() ? (() => { const so = k.so_buoi || 8; return { so, tl: k.thoi_luong_phut || 90, hp: tien(goiYHocPhi(L.bang_gia_id, k.thoi_luong_phut || 90, so) || k.hoc_phi) }; })() : null;
    buoi = S.buoi_hoc.filter(b => b.lop_id === L.id && (b.khoa_id === k.id || (b.trang_thai === 'du_kien' && b.ngay >= hn)) && b.trang_thai !== 'huy').sort(soBuoi)
      .map(b => ({ id: b.id, ngay: b.ngay, gio: b.gio_bat_dau || '', phut: b.thoi_luong_phut || k.thoi_luong_phut || 90, tt: b.trang_thai, tinh: b.trang_thai === 'da_day' ? tinhBuoi(b) : undefined, nd: b.noi_dung || '', bt: b.bai_tap || '', link: b.link_bai || '', lydo: b.trang_thai === 'nghi' ? (b.ghi_chu || '').replace(/^Nghỉ:\s*/, '').split(' · ')[0] : '', tl: tlCuaLop(L.id).filter(t => t.buoi === b.id).map(t => t.id) }));
    const duKien = buoi.filter(b => b.tt === 'du_kien');
    khoa = { ma: k.ma, giao_trinh: k.giao_trinh || '', muc_tieu: k.muc_tieu || '', bd: k.ngay_bat_dau || (t.ngayDau || ''), kt: duKien.length ? duKien[duKien.length - 1].ngay : (t.ngayCuoi || ''), tong: t.tong, da_hoc: t.daHoc, con_lai: Math.max(0, t.conLai), vuot: t.conLai < 0 ? -t.conLai : 0, tl: k.thoi_luong_phut || 90, hoc_phi: tien(k.hoc_phi), hp, sau, lich: k.lich_hoc || (typeof chuLichLop === 'function' && lichLop(L.id).kieu === 'co_dinh' ? chuLichLop(lichLop(L.id)) : '') };
  }
  const off = (typeof dsOff === 'function' ? dsOff() : []).filter(o => (o.den || o.tu) >= hn).sort((a, b) => a.tu.localeCompare(b.tu)).slice(0, 6).map(o => ({ ten: o.ten, tu: o.tu, den: o.den || o.tu }));
  return { bat: c.bat !== false, lop: L.ten, loai: L.loai, trinh_do: trinhDoCua(L, k) || '', hoc_vien: hv, khoa, buoi, off, zoom: c.zoom || '', zalo: '0358840411', tk: typeof TK_NGAN_HANG !== 'undefined' ? TK_NGAN_HANG : '', luu_y: LUU_Y_LOP, nguong: nguongGiaHan(), tai_lieu: tlCuaLop(L.id).map(t => ({ id: t.id, ten: t.ten, loai: t.loai, url: t.url, ghi: t.ghi || '', ngay: t.ngay, buoi: t.buoi || null })) };
}

/* ---------- đăng bản tóm tắt (tự động, sau mỗi thay đổi) ---------- */
function henDongBo(nhanh) { clearTimeout(CONG.hen); CONG.hen = setTimeout(dongBoCong, nhanh ? 50 : 2500); }
async function dongBoCong() {
  if (!coSupa() || (typeof CHI_DOC !== 'undefined' && CHI_DOC)) return;
  const cd = congCD();
  for (const [id, c] of Object.entries(cd)) {
    const L = lopTheoId(Number(id)); if (!L || !c.ma) continue;
    const du = banTomTat(L), chuoi = JSON.stringify(du);
    if (CONG.cuoi[id] === c.ma + chuoi) continue;
    const { error } = await DBX.sb.from('tra_cuu_lop').upsert({ lop_id: L.id, ma: c.ma, du_lieu: du, cap_nhat: new Date().toISOString() }, { onConflict: 'lop_id' });
    if (error) { CONG.loi = /tra_cuu_lop|relation|schema cache/i.test(error.message) ? 'chua_sql' : error.message; return; }
    CONG.cuoi[id] = c.ma + chuoi; CONG.loi = ''; CONG.luc = new Date();
  }
}
/* bọc lamMoi / luuCaiDat để tự đồng bộ sau khi Thầy sửa dữ liệu */
(() => {
  const g = window;
  if (typeof g.lamMoi === 'function') { const goc = g.lamMoi; g.lamMoi = function () { const r = goc.apply(this, arguments); henDongBo(); return r; }; }
  if (typeof g.luuCaiDat === 'function') { const goc2 = g.luuCaiDat; g.luuCaiDat = async function (k) { const r = await goc2.apply(this, arguments); if (k === 'ngay_off' || k === 'cong_lop' || k === 'lich_lop' || k === 'kho_tl') henDongBo(); return r; }; }
})();

/* ---------- hồ sơ học viên gửi lên ---------- */
async function taiHoSo(ep) {
  if (!coSupa() || (!ep && Date.now() - CONG.hsLuc < 120000)) return;
  CONG.hsLuc = Date.now();
  const { data, error } = await DBX.sb.from('ho_so_gui').select('*').eq('xu_ly', false).order('tao_luc');
  if (error) return; const truoc = CONG.hs.length; CONG.hs = data || [];
  if (CONG.hs.length !== truoc && location.hash.startsWith('#/hom-nay')) ve();
}
function hsHomNay() {
  if (!CONG.hs.length) return '';
  const ds = CONG.hs.map(h => hvTheoId(h.hoc_vien_id)).filter(Boolean);
  return `<section class="the-giay hs-moi"><div class="dau-muc"><h2 class="co-icon">${ICON['hoc-vien'] || ''}Hồ sơ học viên mới gửi</h2><button class="nut chinh nho" data-act="hs-duyet">Xem & cập nhật (${CONG.hs.length})</button></div>
    <p class="mo">${[...new Set(ds.map(h => h.ten_goi || h.ho_ten))].map(esc).join(', ')} vừa tự điền thông tin trên trang học viên.</p></section>`;
}
function moDuyetHoSo() {
  const TRUONG = [['ho_ten', 'Họ tên'], ['sdt', 'SĐT'], ['email', 'Gmail'], ['ngay_sinh', 'Ngày sinh'], ['muc_tieu', 'Mục tiêu']];
  const dong = CONG.hs.map(g => {
    const h = hvTheoId(g.hoc_vien_id); if (!h) return '';
    const doi = TRUONG.filter(([k]) => g[k] && String(g[k]) !== String(h[k] || ''));
    return `<div class="hs-dong" data-id="${g.id}"><div class="hs-dau"><b>${esc(h.ten_goi || h.ho_ten)}</b><small>${esc((lopTheoId(g.lop_id) || {}).ten || '')} · gửi ${new Date(g.tao_luc).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}</small></div>
      ${doi.length ? doi.map(([k, n]) => `<label class="hs-truong"><input type="checkbox" name="${g.id}_${k}" checked><span>${n}</span><span class="hs-cu">${h[k] ? esc(k === 'ngay_sinh' ? ngayVN(h[k]) : h[k]) : '<i>trống</i>'}</span><span>→</span><b>${esc(k === 'ngay_sinh' ? ngayVN(g[k]) : g[k])}</b></label>`).join('') : '<p class="mo nho">Không có gì mới so với hồ sơ hiện tại.</p>'}</div>`;
  }).join('');
  moHop({
    tieuDe: 'Hồ sơ học viên gửi lên', rong: true,
    noiDung: `<p class="mo nho">Tick những thông tin muốn ghi vào hồ sơ. Bỏ tick nếu thấy chưa đúng.</p><div class="hs-ds">${dong}</div>`,
    nut: [{ chu: 'Bỏ qua tất cả', trai: true, bam: async () => { await danhDauHS(CONG.hs.map(g => g.id)); ve(); } }, { chu: 'Để sau', bam: () => { } },
      { chu: 'Cập nhật hồ sơ', kieu: 'chinh', bam: async n => {
        const f = docForm(n); let so = 0;
        for (const g of CONG.hs) {
          const h = hvTheoId(g.hoc_vien_id); if (!h) continue; const patch = {};
          TRUONG.forEach(([k]) => { if (f[`${g.id}_${k}`] && g[k]) patch[k] = g[k]; });
          if (Object.keys(patch).length) { await luu('hoc_vien', patch, h.id); so++; }
        }
        await danhDauHS(CONG.hs.map(g => g.id)); toast(`Đã cập nhật hồ sơ ${so} học viên ✓`); ve();
      } }],
  });
}
async function danhDauHS(ids) { if (!ids.length) return; await DBX.sb.from('ho_so_gui').update({ xu_ly: true }).in('id', ids); CONG.hs = CONG.hs.filter(g => !ids.includes(g.id)); }

/* ---------- thẻ "Trang học viên" trong trang Lớp ---------- */
function theCongLop(L) {
  const c = congCD()[L.id], link = c ? `${congUrl()}?ma=${c.ma}` : '';
  const hv = hvCuaLop(L.id), thieu = hv.filter(h => !h.sdt || !h.email || !h.ngay_sinh);
  return `<section class="the-giay cong-lop">
    <div class="dau-muc"><h2 class="co-icon">🔑 Trang học viên</h2>${c ? `<span class="the ${c.bat !== false ? 'xanh' : ''}">${c.bat !== false ? 'Đang mở' : 'Đã tắt'}</span>` : ''}</div>
    ${!coSupa() ? '<p class="mo">Cần dùng chế độ Supabase (online) để học viên tra cứu được.</p>' : CONG.loi === 'chua_sql' ? '<p class="canh-bao">Supabase chưa có phần trang học viên. Thầy chạy file <b>supabase/6-trang-hoc-vien.sql</b> một lần (hướng dẫn trong tin nhắn em gửi), rồi tải lại trang.</p>' : ''}
    ${c ? `<div class="cong-ma"><span>Mã lớp</span><b>${maDep(c.ma)}</b><button class="nut nho" data-act="cong-chep" data-lop="${L.id}">📋 Chép tin nhắn gửi Zalo</button></div>
      <p class="mo nho cong-link">${esc(link)}</p>
      <label class="cong-zoom">Link gửi học viên mở ở <select data-act-change="cong-url"><option value="">Trang lớp riêng (guangyuhanyu.github.io/lop)</option><option value="https://guangyuhanyu.github.io/" ${caiDat('cong_url', '') === 'https://guangyuhanyu.github.io/' ? 'selected' : ''}>Trang chủ, lớp hiện thành lớp phủ</option></select></label>
      <label class="cong-zoom">Link Zoom của lớp <input data-act-change="cong-zoom" data-lop="${L.id}" type="url" value="${esc(c.zoom || '')}" placeholder="https://zoom.us/j/…"></label>
      <p class="mo nho">${thieu.length ? `Còn thiếu SĐT / Gmail / ngày sinh: ${thieu.map(h => esc(h.ten_goi || h.ho_ten)).join(', ')}, học viên tự điền được trên trang.` : 'Hồ sơ học viên đã đủ SĐT, Gmail và ngày sinh ✓'}${CONG.luc ? ` · Đồng bộ lúc ${CONG.luc.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}` : ''}</p>
      <div class="nhom-nut trai"><button class="nut nho" data-act="tl-kho" data-lop="${L.id}">📚 Kho tài liệu (${tlCuaLop(L.id).length})</button><a class="nut nho" href="${esc(link)}" target="_blank" rel="noopener">👁 Xem như học viên</a><button class="nut nho" data-act="cong-doi-ma" data-lop="${L.id}">↻ Đổi mã</button><button class="nut nho" data-act="cong-bat" data-lop="${L.id}">${c.bat !== false ? 'Tắt tra cứu' : 'Mở lại tra cứu'}</button></div>`
    : `<p class="mo">Tạo mã để học viên tự xem số buổi còn lại, lịch học, bài tập, học phí và tự điền hồ sơ.</p><button class="nut chinh" data-act="cong-tao" data-lop="${L.id}" ${coSupa() ? '' : 'disabled'}>＋ Tạo mã tra cứu cho lớp</button>`}
  </section>`;
}
async function luuCong(id, patch) { const cd = { ...congCD() }; cd[id] = { ...(cd[id] || {}), ...patch }; await luuCaiDat('cong_lop', cd); henDongBo(true); }
function tinGuiHV(L) {
  const c = congCD()[L.id], hv = hvCuaLop(L.id), nhom = L.loai === 'nhom' || hv.length > 1;
  const g = nhom ? 'cả nhóm' : (typeof cachGoi === 'function' && hv[0] ? cachGoi(hv[0]).ngoi : 'anh/chị/bạn');
  return `Thầy gửi ${g} trang theo dõi lớp học ${L.ten} 🌿\n${congUrl()}?ma=${c.ma}\nMã lớp: ${maDep(c.ma)}\nTrên trang có số buổi còn lại, lịch học, bài tập về nhà, bài giảng, kho tài liệu và tình trạng học phí. ${hoaDau(g)} vào điền giúp Thầy số điện thoại, Gmail và ngày sinh ở mục "Hồ sơ học viên" nhé!`;
}
const HD_CONG = {
  'cong-tao': async el => { await luuCong(el.dataset.lop, { ma: taoMaLop(), bat: true, zoom: '' }); toast('Đã tạo mã tra cứu ✓'); ve(); },
  'cong-doi-ma': async el => { if (!(await hoi('Đổi mã mới? Mã cũ sẽ không vào được nữa, Thầy cần gửi lại mã mới cho học viên.', 'Đổi mã'))) return; await luuCong(el.dataset.lop, { ma: taoMaLop() }); toast('Đã đổi mã ✓'); ve(); },
  'cong-bat': async el => { const c = congCD()[el.dataset.lop]; await luuCong(el.dataset.lop, { bat: c.bat === false }); ve(); },
  'cong-chep': async el => { const L = lopTheoId(Number(el.dataset.lop)); try { await navigator.clipboard.writeText(tinGuiHV(L)); toast('Đã chép tin nhắn, dán vào Zalo là xong ✓'); } catch (e) { moHop({ tieuDe: 'Tin nhắn gửi học viên', noiDung: `<textarea rows="8" style="width:100%">${esc(tinGuiHV(L))}</textarea>`, nut: [{ chu: 'Đóng', kieu: 'chinh', bam: () => { } }] }); } },
  'hs-duyet': () => moDuyetHoSo(),
  'tl-kho': el => moKhoTL(Number(el.dataset.lop)),
};
const HD_CONG_DOI = { 'cong-url': async el => { await luuCaiDat('cong_url', el.value); toast(el.value ? 'Link gửi học viên sẽ mở trang chủ ✓' : 'Link gửi học viên sẽ mở trang lớp riêng ✓'); ve(); }, 'cong-zoom': async el => { await luuCong(el.dataset.lop, { zoom: el.value.trim() }); toast('Đã lưu link Zoom ✓'); } };

/* khởi động: đồng bộ 1 lần + tải hồ sơ chờ duyệt, rồi kiểm tra định kỳ */
setTimeout(() => { henDongBo(true); taiHoSo(true); }, 2500);
setInterval(() => taiHoSo(), 5 * 60 * 1000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) taiHoSo(); });

/* ---------- KHO TÀI LIỆU (bản 6.6) ----------
   cai_dat 'kho_tl' = [{ id, ten, loai, url, ghi, lop: 'all' | [lopId], buoi: buoiId|null, ngay }] */
const LOAI_TL = { gt: ['📘', 'Giáo trình'], audio: ['🎧', 'Audio'], tv: ['🗂', 'Từ vựng'], de: ['📝', 'Đề luyện'], video: ['🎬', 'Video'], khac: ['📎', 'Khác'] };
const khoTL = () => caiDat('kho_tl', []) || [];
const tlCuaLop = id => khoTL().filter(t => t.lop === 'all' || (Array.isArray(t.lop) && t.lop.includes(id)));
function nhanBuoi(b, L) {
  if (!b) return '';
  const ds = S.buoi_hoc.filter(x => x.lop_id === b.lop_id && x.khoa_id === b.khoa_id && x.trang_thai !== 'huy' && x.trang_thai !== 'nghi').sort(soBuoi);
  const i = ds.findIndex(x => x.id === b.id);
  return `${i >= 0 ? `Buổi ${i + 1} · ` : ''}${ngayNgan(b.ngay)}${b.noi_dung ? ' · ' + b.noi_dung : ''}`;
}
function moKhoTL(lopId) {
  const L = lopTheoId(lopId), ds = tlCuaLop(lopId).slice().sort((a, b) => (b.ngay || '').localeCompare(a.ngay || ''));
  const h = moHop({
    tieuDe: `📚 Kho tài liệu · ${esc(L.ten)}`, rong: true,
    noiDung: `<p class="mo nho">Tài liệu hiện ở mục "Tài liệu" trên trang học viên. Gắn vào một buổi thì học viên thấy nút 📎 ngay trong lịch học của buổi đó. Tài liệu thêm trong 14 ngày gần nhất có nhãn "Mới".</p>
      ${ds.length ? `<div class="tl-ds">${ds.map(t => { const b = t.buoi ? S.buoi_hoc.find(x => x.id === t.buoi) : null; return `<div class="tl-dong"><span class="tl-ic">${(LOAI_TL[t.loai] || LOAI_TL.khac)[0]}</span>
        <div><b>${esc(t.ten)}</b><small class="mo">${t.lop === 'all' ? 'Tất cả lớp' : 'Riêng lớp này'}${b ? ' · 📎 ' + esc(nhanBuoi(b)) : ''}${t.ghi ? ' · ' + esc(t.ghi) : ''}</small></div>
        <button class="nut nho" data-tl-sua="${t.id}">Sửa</button></div>`; }).join('')}</div>` : '<p class="mo">Chưa có tài liệu nào.</p>'}`,
    nut: [{ chu: 'Đóng', bam: () => { } }, { chu: '＋ Thêm tài liệu', kieu: 'chinh', bam: (n, dong) => { dong(); moSuaTL(lopId); return false; } }],
  });
  h.nen.querySelectorAll('[data-tl-sua]').forEach(b => b.onclick = () => { h.dong(); moSuaTL(lopId, b.dataset.tlSua); });
}
function moSuaTL(lopId, id) {
  const L = lopTheoId(lopId), t = id ? khoTL().find(x => x.id === id) : null, v = t || { loai: 'gt', lop: [lopId] };
  const k = khoaHienTai(lopId);
  const bs = S.buoi_hoc.filter(b => b.lop_id === lopId && (!k || b.khoa_id === k.id || b.trang_thai === 'du_kien') && b.trang_thai !== 'huy' && b.trang_thai !== 'nghi').sort(soBuoi);
  moHop({
    tieuDe: t ? 'Sửa tài liệu' : 'Thêm tài liệu',
    noiDung: `<form class="form">
      <label>Tên tài liệu<input name="ten" required value="${esc(v.ten || '')}" placeholder="VD: Audio bài 1–10"></label>
      <label>Loại<select name="loai">${Object.entries(LOAI_TL).map(([k2, [ic, n]]) => `<option value="${k2}" ${v.loai === k2 ? 'selected' : ''}>${ic} ${n}</option>`).join('')}</select></label>
      <label>Link <small class="mo">(Google Drive, web bài giảng, YouTube…)</small><input name="url" type="url" required value="${esc(v.url || '')}" placeholder="https://"></label>
      <label>Ghi chú ngắn <small class="mo">(không bắt buộc)</small><input name="ghi" value="${esc(v.ghi || '')}" placeholder="VD: PDF · in A4 · có đáp án"></label>
      <label>Dùng cho<select name="pham_vi"><option value="lop">Riêng lớp ${esc(L.ten)}</option><option value="all" ${v.lop === 'all' ? 'selected' : ''}>Tất cả lớp</option></select></label>
      <label>Gắn vào buổi <small class="mo">(không bắt buộc)</small><select name="buoi"><option value="">— Không gắn —</option>${bs.map(b => `<option value="${b.id}" ${v.buoi === b.id ? 'selected' : ''}>${esc(nhanBuoi(b))}</option>`).join('')}</select></label>
    </form>`,
    nut: [...(t ? [{ chu: 'Xoá', trai: true, bam: async () => { if (!(await hoi(`Xoá tài liệu "${esc(t.ten)}"?`, 'Xoá', 'nguy'))) return false; await luuCaiDat('kho_tl', khoTL().filter(x => x.id !== t.id)); toast('Đã xoá ✓'); moKhoTL(lopId); } }] : []),
      { chu: 'Huỷ', bam: () => moKhoTL(lopId) },
      { chu: 'Lưu', kieu: 'chinh', bam: async n => {
        const f = docForm(n);
        if (!f.ten || !f.url) { toast('Thầy nhập tên và link nhé'); return false; }
        if (!/^https?:\/\//i.test(f.url)) f.url = 'https://' + f.url;
        const moi = { id: t ? t.id : 't' + Date.now().toString(36), ten: f.ten, loai: f.loai, url: f.url, ghi: f.ghi || '', ngay: t ? t.ngay : homNay(),
          lop: f.pham_vi === 'all' ? 'all' : (t && Array.isArray(t.lop) ? [...new Set([...t.lop, lopId])] : [lopId]), buoi: f.buoi ? Number(f.buoi) : null };
        const ds = khoTL().filter(x => x.id !== moi.id); ds.push(moi);
        await luuCaiDat('kho_tl', ds); toast(t ? 'Đã lưu ✓' : 'Đã thêm tài liệu ✓'); moKhoTL(lopId);
      } }],
  });
}
