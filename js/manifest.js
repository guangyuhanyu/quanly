/* MANIFEST — bảng tầm nhìn · thẻ WOOP · đã thành hiện thực · ghi nhận buổi tối · thư gửi tương lai (bản 5.7)
   cai_dat 'manifest'      = [{ id, ten, mang, khang_dinh, han, w, o, ob, p, mt_ids:[], quy_id, so_anh, trang_thai:'dang'|'thanh', ngay_thanh, ghi_thanh, tao }]
   cai_dat 'manifest_ghi'  = { 'yyyy-mm-dd': { biet_on:[..3], dau_hieu, uoc_id } }
   cai_dat 'thu_tuong_lai' = [{ id, tieu_de, noi_dung, ngay_viet, ngay_mo, da_mo }]
   Ảnh: cai_dat 'anh:mf_<id>_<i>'. Không cần sửa Supabase. */

const MF_MANG = {
  'Dạy học & thương hiệu': ['study', '#A98199'], 'HSK 7–9': ['growth', '#8EA888'], 'Tài chính': ['progress', '#D19A2A'],
  'Sức khoẻ': ['exercise', '#7FB0A8'], 'Style': ['youtime', '#C9A0A6'], 'Du lịch': ['travel', '#7F9BB5'],
  'Các mối quan hệ': ['selflove', '#E7B7C8'], 'Khác': ['inspiration', '#9AA2AB'],
};
const MF_NHOM_MT = { 'Dạy học & thương hiệu': 'Công việc', 'HSK 7–9': 'Học tập', 'Tài chính': 'Tài chính', 'Sức khoẻ': 'Sức khoẻ' };
const MF = { tab: 'bang', loc: 'Tất cả', mo: null, ngay: null };
const dsUoc = () => caiDat('manifest', []) || [];
async function luuUoc(a) { await luuCaiDat('manifest', a); }
const ghiMF = () => caiDat('manifest_ghi', {}) || {};
const dsThu = () => caiDat('thu_tuong_lai', []) || [];
async function luuThu(a) { await luuCaiDat('thu_tuong_lai', a); }
const mfIcon = (m, co = '') => `<img class="ic ic-anh ${co}" src="assets/icons/${(MF_MANG[m] || MF_MANG['Khác'])[0]}.webp?v=6.6" alt="">`;
const mfMau = m => (MF_MANG[m] || MF_MANG['Khác'])[1];
const mfAnh = (x, i = 0) => layAnhCache(`anh:mf_${x.id}_${i}`);
const mfMung = () => { try { HIEU_UNG.hac(); AM.datMucTieu(); } catch (e) { } };

/* tiến độ thật của điều ước: trung bình các mục tiêu gắn + quỹ gắn */
function tienDoUoc(x) {
  const mts = (x.mt_ids || []).map(id => dsMT().find(g => g.id === id)).filter(Boolean).map(g => ({ g, t: trangThaiMT(g) }));
  const q = x.quy_id ? dsQuy().find(k => k.id === x.quy_id) : null;
  const phan = mts.map(m => m.t.p); if (q && q.dich) phan.push(Math.min(1, soDuQuy(q) / q.dich));
  return { mts, q, p: phan.length ? phan.reduce((a, b) => a + b, 0) / phan.length : null, du: phan.length > 0 && phan.every(v => v >= 1) };
}

/* ====================== TRANG ====================== */
function vManifest() {
  const tabs = [['bang', 'Bảng tầm nhìn'], ['thanh', 'Đã thành hiện thực'], ['ghi', 'Ghi nhận buổi tối'], ['thu', 'Thư gửi tương lai']];
  const ds = dsUoc(), dang = ds.filter(x => x.trang_thai !== 'thanh'), thanh = ds.filter(x => x.trang_thai === 'thanh');
  const g = ghiMF(), soNgayGhi = Object.keys(g).length, thuKhoa = dsThu().filter(t => !t.da_mo).length;
  let than = '';
  if (MF.tab === 'thanh') than = vThanh(thanh);
  else if (MF.tab === 'ghi') than = vGhiNhan();
  else if (MF.tab === 'thu') than = vThu();
  else than = vBang(dang);
  return `
  <header class="dau-trang gon"><div><p class="mat-tren">Thấy trước điều mình muốn · 显化</p><h1>${ICON.manifest} Manifest</h1></div>
    <button class="nut chinh" data-act="${MF.tab === 'thu' ? 'mf-thu-moi' : MF.tab === 'ghi' ? 'mf-ghi' : 'mf-moi'}">${ICON.cong} ${MF.tab === 'thu' ? 'Viết thư' : MF.tab === 'ghi' ? 'Ghi tối nay' : 'Thêm điều ước'}</button></header>
  <div class="st-tk">
    <div><small>Đang hướng tới</small><b>${dang.length}</b><span>điều ước</span></div>
    <div><small>Đã thành hiện thực</small><b>${thanh.length}</b><span>điều ✦</span></div>
    <div><small>Chuỗi ghi nhận</small><b>${chuoiGhi()}</b><span>ngày liên tiếp · tổng ${soNgayGhi}</span></div>
    <div><small>Thư đang niêm phong</small><b>${thuKhoa}</b><span>lá thư</span></div>
  </div>
  <div class="st-tabs">${tabs.map(([v, c]) => `<button data-act="mf-tab" data-v="${v}" class="${MF.tab === v ? 'on' : ''}">${c}</button>`).join('')}</div>
  ${than}`;
}

/* ----- 1. bảng tầm nhìn ----- */
function vBang(dang) {
  const mangCo = Object.keys(MF_MANG).filter(m => dang.some(x => x.mang === m));
  const ds = dang.filter(x => MF.loc === 'Tất cả' || x.mang === MF.loc).sort((a, b) => (a.han || '9999').localeCompare(b.han || '9999'));
  if (!dang.length) return `<section class="the-giay">${oTrong('Chưa có điều ước nào. Thầy viết điều đầu tiên mình muốn có trong năm tới nhé: lớp học, điểm HSK, chuyến đi, khoản tiết kiệm…', `<button class="nut chinh" data-act="mf-moi">${ICON.cong} Thêm điều ước</button>`)}</section>`;
  return `
  ${mangCo.length > 1 ? `<div class="loc-chip">${['Tất cả', ...mangCo].map(m => `<button class="${MF.loc === m ? 'on' : ''}" data-act="mf-loc" data-v="${m}">${m}</button>`).join('')}</div>` : ''}
  <div class="mf-bang">${ds.map(x => theUoc(x)).join('')}</div>
  ${MF.mo && dang.some(x => x.id === MF.mo) ? chiTietUoc(dang.find(x => x.id === MF.mo)) : ''}
  <p class="mf-chu-thich">Mỗi điều ước nên có kế hoạch "Nếu… thì…" và ít nhất một mục tiêu gắn kèm, để điều mình hình dung biến thành việc mình làm.</p>`;
}
function theUoc(x) {
  const td = tienDoUoc(x), anh = x.so_anh ? mfAnh(x) : null, con = x.han ? stSoNgay(homNay(), x.han) : null;
  return `<button class="mf-the ${MF.mo === x.id ? 'on' : ''} ${td.du ? 'du' : ''}" style="--m:${mfMau(x.mang)}" data-act="mf-mo" data-id="${x.id}">
    <span class="mf-anh">${anh ? `<img src="${anh}" alt="" loading="lazy">` : x.so_anh ? '<i class="kn-dang-tai">…</i>' : `<i class="mf-anh-trong">${mfIcon(x.mang)}</i>`}<em>${esc(x.mang || 'Khác')}</em></span>
    <span class="mf-chu"><b>${esc(x.ten)}</b>${x.khang_dinh ? `<q>${esc(x.khang_dinh)}</q>` : ''}
      ${td.p != null ? `<span class="mf-thanh"><i style="width:${Math.round(td.p * 100)}%"></i></span><small>${Math.round(td.p * 100)}% · ${td.mts.length} mục tiêu${td.q ? ' · 1 quỹ' : ''}</small>` : `<small class="mf-nhac">Chưa gắn mục tiêu</small>`}
      ${con != null ? `<small>${con >= 0 ? `còn ${con} ngày · ${ngayVN(x.han)}` : `quá hạn ${-con} ngày`}</small>` : ''}
      ${td.du ? '<small class="mf-du">✦ Mục tiêu đã đạt, mở để đưa lên tường</small>' : ''}</span></button>`;
}
function chiTietUoc(x) {
  const td = tienDoUoc(x), anh = [...Array(x.so_anh || 0)].map((_, i) => mfAnh(x, i));
  const o = (nhan, zh, v, lop) => `<div class="mf-woop-o ${lop}"><small>${nhan} · ${zh}</small><p>${v ? esc(v).replace(/\n/g, '<br>') : '<span class="mo">Chưa viết</span>'}</p></div>`;
  return `<section class="the-giay mf-chi-tiet" id="mf-chi-tiet" style="--m:${mfMau(x.mang)}">
    <div class="dau-muc"><h2 class="co-icon">${mfIcon(x.mang)}${esc(x.ten)}</h2><span class="nhom-nut"><button class="nut nho" data-act="mf-sua" data-id="${x.id}">Sửa</button><button class="nut-x" data-act="mf-mo" data-id="">×</button></span></div>
    ${x.khang_dinh ? `<p class="mf-khang-dinh">${esc(x.khang_dinh)}</p>` : ''}
    ${anh.length ? `<div class="kn-anh-luoi">${anh.map(u => `<span>${u ? `<img src="${u}" alt="" loading="lazy">` : '<span class="kn-dang-tai">…</span>'}</span>`).join('')}</div>` : ''}
    <div class="mf-woop">${o('Mong muốn', '愿望', x.w, 'w')}${o('Kết quả đẹp nhất', '结果', x.o, 'o')}${o('Trở ngại bên trong', '障碍', x.ob, 'ob')}${o('Kế hoạch Nếu… thì…', '计划', x.p, 'p')}</div>
    <h4 class="mf-h4">Việc cụ thể</h4>
    ${td.mts.length ? td.mts.map(({ g, t }) => `<div class="tk-mt"><span>${esc(g.ten)} <small class="mo">${g.ky === 'nam' ? 'năm ' + g.nam : g.ky === 'tuan' ? 'tuần ' + ngayNgan(g.tuan) : `T${g.thang}/${g.nam}`}</small></span><div class="mt-thanh"><i style="width:${(t.p * 100).toFixed(0)}%"></i></div><span class="the mt-nhan ${t.lop}">${t.nhan}</span><button class="nut-x" data-act="mf-bo-mt" data-id="${x.id}" data-mt="${g.id}" title="Bỏ liên kết">×</button></div>`).join('') : '<p class="mo nho">Chưa có mục tiêu nào. Biến điều ước thành mục tiêu để web tự theo dõi tiến độ.</p>'}
    ${td.q ? `<div class="tk-mt"><span>Quỹ: ${esc(td.q.ten)}</span><div class="mt-thanh"><i style="width:${td.q.dich ? Math.min(100, soDuQuy(td.q) / td.q.dich * 100).toFixed(0) : 0}%"></i></div><span class="the">${tienGon(soDuQuy(td.q))}${td.q.dich ? ' / ' + tienGon(td.q.dich) : ''}</span><button class="nut-x" data-act="mf-bo-quy" data-id="${x.id}" title="Bỏ liên kết">×</button></div>` : ''}
    <div class="nhom-nut mf-nut">
      <button class="nut nho" data-act="mf-thanh-mt" data-id="${x.id}">🎯 Biến thành mục tiêu</button>
      <button class="nut nho" data-act="mf-gan-mt" data-id="${x.id}">🔗 Gắn mục tiêu có sẵn</button>
      ${td.q ? '' : `<button class="nut nho" data-act="mf-quy" data-id="${x.id}">💰 Gắn / tạo quỹ</button>`}
      <button class="nut chinh nho" data-act="mf-dat" data-id="${x.id}">✦ Đã thành hiện thực</button>
    </div>
  </section>`;
}

/* ----- 3. đã thành hiện thực ----- */
function vThanh(thanh) {
  if (!thanh.length) return `<section class="the-giay">${oTrong('Bức tường còn trống. Khi một điều ước thành thật, Thầy bấm "Đã thành hiện thực" để nó lên đây nhé ✦')}</section>`;
  const ds = thanh.slice().sort((a, b) => (b.ngay_thanh || '').localeCompare(a.ngay_thanh || ''));
  return `<div class="mf-tuong">${ds.map(x => { const anh = x.so_anh ? mfAnh(x) : null; const ngayDu = x.tao && x.ngay_thanh ? stSoNgay(x.tao, x.ngay_thanh) : null; return `<div class="mf-tuong-the" style="--m:${mfMau(x.mang)}">
      <span class="mf-dau">成</span>${anh ? `<img src="${anh}" alt="" loading="lazy">` : `<i class="mf-anh-trong">${mfIcon(x.mang)}</i>`}
      <b>${esc(x.ten)}</b><small>${x.ngay_thanh ? ngayVN(x.ngay_thanh) : ''}${ngayDu != null ? ` · sau ${ngayDu} ngày từ lúc viết` : ''}</small>
      ${x.ghi_thanh ? `<p>${esc(x.ghi_thanh)}</p>` : ''}
      <button class="nut nho" data-act="mf-tra-lai" data-id="${x.id}">Đưa về bảng</button></div>`; }).join('')}</div>`;
}

/* ----- 4. ghi nhận buổi tối ----- */
function chuoiGhi() {
  const g = ghiMF(); let d = g[homNay()] ? homNay() : congNgay(homNay(), -1), n = 0;
  while (g[d]) { n++; d = congNgay(d, -1); } return n;
}
function vGhiNhan() {
  const g = ghiMF(), hn = homNay(), nay = g[hn];
  const ngay = Object.keys(g).sort().reverse().slice(0, 30);
  return `
  <section class="the-giay mf-ghi-nay"><div class="dau-muc"><h2 class="co-icon">${ICON.gratitude}Tối nay · ${ngayVN(hn)}</h2>${nay ? `<button class="nut nho" data-act="mf-ghi" data-n="${hn}">Sửa</button>` : ''}</div>
    ${nay ? dongGhi(hn, nay, true) : `<p class="mo">Ba điều biết ơn hôm nay và một dấu hiệu Thầy đang đến gần điều ước. Chỉ mất 2 phút.</p><button class="nut chinh" data-act="mf-ghi" data-n="${hn}">${ICON.cong} Ghi tối nay</button>`}
  </section>
  <section class="the-giay"><div class="dau-muc"><h2>Những ngày trước</h2></div>
    ${ngay.filter(d => d !== hn).length ? ngay.filter(d => d !== hn).map(d => `<div class="mf-ghi-dong"><div class="mf-ghi-ngay"><b>${ngayNgan(d)}</b><small>${['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][s2d(d).getDay()]}</small></div>${dongGhi(d, g[d])}<button class="nut-x" data-act="mf-ghi" data-n="${d}" title="Sửa">✎</button></div>`).join('') : '<p class="mo nho">Chưa có ngày nào.</p>'}
  </section>`;
}
function dongGhi(d, x, lon) {
  const u = x.uoc_id ? dsUoc().find(k => k.id === x.uoc_id) : null;
  return `<div class="mf-ghi-than ${lon ? 'lon' : ''}"><ol>${(x.biet_on || []).filter(Boolean).map(t => `<li>${esc(t)}</li>`).join('')}</ol>
    ${x.dau_hieu ? `<p class="mf-dau-hieu">✦ ${esc(x.dau_hieu)}${u ? ` <small>· ${esc(u.ten)}</small>` : ''}</p>` : ''}</div>`;
}
function moGhi(ngay) {
  const n0 = ngay || homNay(), x = ghiMF()[n0] || { biet_on: ['', '', ''] }, uoc = dsUoc().filter(u => u.trang_thai !== 'thanh');
  moHop({
    tieuDe: `Ghi nhận · ${ngayVN(n0)}`,
    noiDung: `<div class="form">
      <p class="mo nho">Hôm nay Thầy biết ơn điều gì? Càng cụ thể càng tốt: một học viên tiến bộ, bữa cơm ngon, cuộc gọi về nhà…</p>
      ${[0, 1, 2].map(i => `<label>${i + 1}.<input name="b${i}" value="${esc((x.biet_on || [])[i] || '')}" placeholder="${['VD: Chị Lan đọc trôi bài khoá đầu tiên', 'VD: Trời Sài Gòn mát, đi bộ dễ chịu', 'VD: Ôn xong flashcard đúng giờ'][i]}"></label>`).join('')}
      <label>Dấu hiệu mình đang đến gần điều ước<textarea name="dau_hieu" rows="2" placeholder="VD: Có 2 người nhắn hỏi lớp HSK 4…">${esc(x.dau_hieu || '')}</textarea></label>
      ${uoc.length ? `<label>Thuộc điều ước<select name="uoc_id"><option value="">— không —</option>${uoc.map(u => `<option value="${u.id}" ${x.uoc_id === u.id ? 'selected' : ''}>${esc(u.ten)}</option>`).join('')}</select></label>` : ''}
    </div>`,
    nut: [
      ...(ghiMF()[n0] ? [{ chu: 'Xoá', kieu: 'nguy', trai: true, bam: async () => { const g = { ...ghiMF() }; delete g[n0]; await luuCaiDat('manifest_ghi', g); ve(); } }] : []),
      { chu: 'Huỷ', bam: () => { } },
      { chu: 'Lưu', kieu: 'chinh', bam: async n => {
        const f = docForm(n), b = [f.b0, f.b1, f.b2].map(s => (s || '').trim());
        if (!b.some(Boolean) && !(f.dau_hieu || '').trim()) { toast('Thầy ghi ít nhất một điều nhé'); return false; }
        const moi = !ghiMF()[n0];
        await luuCaiDat('manifest_ghi', { ...ghiMF(), [n0]: { biet_on: b, dau_hieu: (f.dau_hieu || '').trim(), uoc_id: f.uoc_id || '' } });
        if (moi) { try { HIEU_UNG.hoaDao(); AM.hoa(); } catch (e) { } toast(`Đã ghi ✓ · chuỗi ${chuoiGhi()} ngày`); }
        ve();
      } }],
  });
}

/* ----- 5. thư gửi tương lai ----- */
function vThu() {
  const hn = homNay(), ds = dsThu().slice().sort((a, b) => a.ngay_mo.localeCompare(b.ngay_mo));
  const khoa = ds.filter(t => !t.da_mo && t.ngay_mo > hn), den = ds.filter(t => !t.da_mo && t.ngay_mo <= hn), mo = ds.filter(t => t.da_mo).reverse();
  if (!ds.length) return `<section class="the-giay">${oTrong('Viết một lá thư cho chính mình của 6 tháng hay 1 năm sau. Thư được niêm phong, tới đúng ngày mới mở được.', `<button class="nut chinh" data-act="mf-thu-moi">${ICON.cong} Viết thư</button>`)}</section>`;
  return `
  ${den.length ? `<section class="the-giay mf-thu-den"><div class="dau-muc"><h2 class="co-icon">${ICON.messages}Thư đã tới ngày mở</h2></div>${den.map(t => `<button class="mf-phong-bi den" data-act="mf-thu-mo" data-id="${t.id}"><span class="mf-sap">封</span><b>${esc(t.tieu_de || 'Thư gửi tương lai')}</b><small>Viết ngày ${ngayVN(t.ngay_viet)} · bấm để mở</small></button>`).join('')}</section>` : ''}
  ${khoa.length ? `<section class="the-giay"><div class="dau-muc"><h2>Đang niêm phong</h2></div><div class="mf-thu-luoi">${khoa.map(t => `<div class="mf-phong-bi"><span class="mf-sap">封</span><b>${esc(t.tieu_de || 'Thư gửi tương lai')}</b><small>Mở ngày ${ngayVN(t.ngay_mo)}</small><em>còn ${stSoNgay(hn, t.ngay_mo)} ngày</em><button class="nut-x" data-act="mf-thu-xoa" data-id="${t.id}" title="Xoá thư">×</button></div>`).join('')}</div></section>` : ''}
  ${mo.length ? `<section class="the-giay"><div class="dau-muc"><h2>Thư đã mở</h2></div>${mo.map(t => `<details class="mf-thu-doc"><summary><b>${esc(t.tieu_de || 'Thư gửi tương lai')}</b><small>viết ${ngayVN(t.ngay_viet)} · mở ${ngayVN(t.ngay_mo)}</small></summary><p>${esc(t.noi_dung).replace(/\n/g, '<br>')}</p></details>`).join('')}</section>` : ''}`;
}
function moVietThu() {
  const goiY = ['Lúc viết thư này, mình đang lo điều gì nhất?', 'Mình hy vọng tới ngày mở thư đã làm được…', 'Lớp học, học viên của mình lúc này ra sao?', 'Điều mình muốn nhắc bản thân khi mệt mỏi…'];
  const lanToi = n => congNgay(homNay(), n);
  moHop({
    tieuDe: 'Thư gửi tương lai', rong: true,
    noiDung: `<div class="form luoi-form">
      <label class="ca-dong">Tiêu đề<input name="tieu_de" placeholder="VD: Gửi Thầy của Tết 2028"></label>
      <label>Ngày mở thư<input type="date" name="ngay_mo" value="${lanToi(365)}" min="${lanToi(1)}"></label>
      <div class="nhom-nut ca-dong">${[[30, '1 tháng'], [182, '6 tháng'], [365, '1 năm'], [730, '2 năm']].map(([d, c]) => `<button type="button" class="nut nho" data-ngay="${lanToi(d)}">${c}</button>`).join('')}</div>
      <label class="ca-dong">Nội dung<textarea name="noi_dung" rows="10" placeholder="Thầy của tương lai thân mến…"></textarea></label>
      <div class="ca-dong mf-goi-y"><small class="mo">Gợi ý, chạm để chèn:</small>${goiY.map(c => `<button type="button" class="nut nho" data-chen="${esc(c)}">${esc(c)}</button>`).join('')}</div>
      <p class="ca-dong mo nho">Sau khi niêm phong, thư không xem lại được cho tới ngày mở. Ngày mở sẽ có trong danh sách mốc đếm ngược ở trang Hôm nay.</p>
    </div>`,
    khiMo: n => {
      n.querySelectorAll('[data-ngay]').forEach(b => b.onclick = () => n.querySelector('[name=ngay_mo]').value = b.dataset.ngay);
      n.querySelectorAll('[data-chen]').forEach(b => b.onclick = () => { const t = n.querySelector('[name=noi_dung]'); t.value += (t.value && !t.value.endsWith('\n') ? '\n\n' : '') + b.dataset.chen + '\n'; t.focus(); });
    },
    nut: [{ chu: 'Huỷ', bam: () => { } }, { chu: '封 Niêm phong', kieu: 'chinh', bam: async n => {
      const f = docForm(n); if (!(f.noi_dung || '').trim()) { toast('Thư còn trống'); return false; }
      if (!f.ngay_mo || f.ngay_mo <= homNay()) { toast('Ngày mở phải sau hôm nay', 'canh'); return false; }
      await luuThu([...dsThu(), { id: 'th' + Date.now(), tieu_de: f.tieu_de || '', noi_dung: f.noi_dung, ngay_viet: homNay(), ngay_mo: f.ngay_mo, da_mo: false }]);
      MF.tab = 'thu'; toast(`Đã niêm phong · mở ngày ${ngayVN(f.ngay_mo)}`); ve();
    } }],
  });
}
async function moThu(id) {
  const t = dsThu().find(x => x.id === id); if (!t || t.ngay_mo > homNay()) return;
  await luuThu(dsThu().map(x => x.id === id ? { ...x, da_mo: true } : x));
  try { HIEU_UNG.hoaDao(); AM.hoa(); } catch (e) { }
  moHop({ tieuDe: esc(t.tieu_de || 'Thư từ quá khứ'), rong: true, noiDung: `<div class="mf-thu-mo"><small class="mo">Thầy viết ngày ${ngayVN(t.ngay_viet)} · ${stSoNgay(t.ngay_viet, homNay())} ngày trước</small><p>${esc(t.noi_dung).replace(/\n/g, '<br>')}</p></div>`, nut: [{ chu: 'Đóng', kieu: 'chinh', bam: () => { MF.tab = 'thu'; ve(); } }] });
}

/* ====================== FORM ĐIỀU ƯỚC ====================== */
function moUoc(id) {
  const cu = id ? dsUoc().find(x => x.id === id) : null;
  const x = cu ? { ...cu } : { mang: MF.loc !== 'Tất cả' ? MF.loc : 'Dạy học & thương hiệu', so_anh: 0, mt_ids: [] };
  const ctx = { anh: [...Array(x.so_anh || 0)].map((_, i) => mfAnh(x, i)), doi: false };
  const veAnh = n => { n.querySelector('#mf-anh-xem').innerHTML = ctx.anh.map((u, i) => `<span><img src="${u || ''}"><button type="button" data-xoa-anh="${i}">×</button>${i === 0 ? '<em>ảnh bìa</em>' : ''}</span>`).join(''); };
  moHop({
    tieuDe: id ? 'Sửa điều ước' : 'Điều ước mới', rong: true,
    noiDung: `<div class="form luoi-form mf-form">
      <label class="ca-dong">Điều ước<input name="ten" value="${esc(x.ten || '')}" placeholder="VD: Có 20 học viên kèm ổn định, Đạt HSK 7, Đi Trương Gia Giới…" required></label>
      <label>Mảng<select name="mang">${Object.keys(MF_MANG).map(m => `<option ${x.mang === m ? 'selected' : ''}>${m}</option>`).join('')}</select></label>
      <label>Mong đạt trước ngày <small class="mo">(không bắt buộc)</small><input type="date" name="han" value="${esc(x.han || '')}"></label>
      <label class="ca-dong">Câu khẳng định <small class="mo">(viết như đã xảy ra)</small><input name="khang_dinh" value="${esc(x.khang_dinh || '')}" placeholder="VD: Lớp học của mình luôn kín lịch với những học viên quý mến mình."></label>
      <div class="ca-dong"><span class="nhan">Ảnh tầm nhìn <small class="mo">(tối đa 3 tấm: nơi muốn đến, căn phòng muốn có…)</small></span><input type="file" accept="image/*" multiple id="mf-file"><div id="mf-anh-xem" class="kn-anh-xem"></div></div>
      <p class="ca-dong mf-woop-tieu">Thẻ WOOP · nghĩ cho kỹ 4 ô này là phần giúp điều ước thành thật</p>
      <label class="ca-dong">W · Mong muốn cụ thể<textarea name="w" rows="2" placeholder="Muốn điều gì, đo được thì càng tốt">${esc(x.w || '')}</textarea></label>
      <label class="ca-dong">O · Kết quả đẹp nhất<textarea name="o" rows="2" placeholder="Khi đạt được, cuộc sống mình thay đổi ra sao, cảm giác thế nào?">${esc(x.o || '')}</textarea></label>
      <label class="ca-dong">O · Trở ngại bên trong mình<textarea name="ob" rows="2" placeholder="Điều gì trong chính mình hay cản lại? VD: tối mệt là lướt điện thoại, ngại đăng bài…">${esc(x.ob || '')}</textarea></label>
      <label class="ca-dong">P · Kế hoạch Nếu… thì…<textarea name="p" rows="2" placeholder="Nếu [trở ngại] xuất hiện, thì mình sẽ [hành động cụ thể].">${esc(x.p || '')}</textarea></label>
    </div>`,
    khiMo: n => {
      veAnh(n);
      n.querySelector('#mf-file').addEventListener('change', async e => {
        const fs = [...e.target.files].slice(0, 3 - ctx.anh.length); if (!fs.length) return toast('Tối đa 3 ảnh');
        for (const f of fs) ctx.anh.push(await nenAnhKN(f, 900)); ctx.doi = true; e.target.value = ''; veAnh(n);
      });
      n.querySelector('#mf-anh-xem').addEventListener('click', e => { const b = e.target.closest('[data-xoa-anh]'); if (b) { ctx.anh.splice(Number(b.dataset.xoaAnh), 1); ctx.doi = true; veAnh(n); } });
    },
    nut: [
      ...(id ? [{ chu: 'Xoá', kieu: 'nguy', trai: true, bam: async () => { if (!(await hoi(`Xoá điều ước "${esc(x.ten)}"? Mục tiêu và quỹ đã gắn vẫn giữ nguyên.`, 'Xoá', 'nguy'))) return false; for (let i = 0; i < (x.so_anh || 0); i++) await luuCaiDat(`anh:mf_${id}_${i}`, ''); await luuUoc(dsUoc().filter(k => k.id !== id)); MF.mo = null; ve(); } }] : []),
      { chu: 'Huỷ', bam: () => { } },
      { chu: 'Lưu', kieu: 'chinh', bam: async n => {
        const f = docForm(n); if (!f.ten) { toast('Thầy viết điều ước nhé'); return false; }
        const moiId = id || 'mf' + Date.now();
        if (ctx.doi) { for (let i = 0; i < Math.max(ctx.anh.length, x.so_anh || 0); i++) await luuCaiDat(`anh:mf_${moiId}_${i}`, ctx.anh[i] || ''); ctx.anh.forEach((u, i) => ANH[`anh:mf_${moiId}_${i}`] = u); }
        const moi = { ...x, id: moiId, ten: f.ten, mang: f.mang, han: f.han || '', khang_dinh: f.khang_dinh || '', w: f.w || '', o: f.o || '', ob: f.ob || '', p: f.p || '', so_anh: ctx.anh.length, trang_thai: x.trang_thai || 'dang', tao: x.tao || homNay(), mt_ids: x.mt_ids || [] };
        await luuUoc([...dsUoc().filter(k => k.id !== moiId), moi]); MF.mo = moiId; MF.tab = 'bang'; ve();
        setTimeout(() => document.getElementById('mf-chi-tiet')?.scrollIntoView({ behavior: 'smooth' }), 250);
      } }],
  });
}
async function suaUoc(id, ham) { await luuUoc(dsUoc().map(x => x.id === id ? ham({ ...x }) : x)); ve(); }

/* biến điều ước thành mục tiêu (tạo mục tiêu mới, gắn sẵn) */
function moThanhMT(id) {
  const x = dsUoc().find(k => k.id === id), hn = homNay();
  moHop({
    tieuDe: 'Biến thành mục tiêu',
    noiDung: `<div class="form luoi-form">
      <label class="ca-dong">Tên mục tiêu<input name="ten" value="${esc(x.ten)}"></label>
      <label>Kỳ<select name="ky"><option value="nam">Năm ${hn.slice(0, 4)}</option><option value="thang" selected>Tháng ${Number(hn.slice(5, 7))}</option><option value="tuan">Tuần này</option></select></label>
      <label>Cách đo<select name="do"><option value="tich">Đánh dấu hoàn thành</option><option value="tay">Tự nhập số</option></select></label>
      <label class="mf-chi-so">Đích cần đạt<input type="number" name="dich" placeholder="VD: 20"></label>
      <label class="mf-chi-so">Đơn vị<input name="don_vi" placeholder="học viên, bài, đ…"></label>
      <p class="ca-dong mo nho">Muốn web tự tính (buổi dạy, thực nhận, lộ trình HSK…) thì Thầy tạo ở mục Mục tiêu rồi bấm "Gắn mục tiêu có sẵn".</p>
    </div>`,
    khiMo: n => { const cap = () => n.querySelectorAll('.mf-chi-so').forEach(e => e.style.display = docForm(n).do === 'tay' ? '' : 'none'); n.addEventListener('change', cap); cap(); },
    nut: [{ chu: 'Huỷ', bam: () => { } }, { chu: 'Tạo mục tiêu', kieu: 'chinh', bam: async n => {
      const f = docForm(n); if (!f.ten) return false;
      const y = Number(hn.slice(0, 4)), m = Number(hn.slice(5, 7)), tuan = dauTuan(hn);
      const g = { id: 'mt' + Date.now(), ten: f.ten, ky: f.ky, nam: f.ky === 'tuan' ? thangCuaTuan(tuan)[0] : y, thang: f.ky === 'thang' ? m : f.ky === 'tuan' ? thangCuaTuan(tuan)[1] : null, tuan: f.ky === 'tuan' ? tuan : null,
        nhom: MF_NHOM_MT[x.mang] || 'Cá nhân', do: f.do, dich: f.do === 'tich' ? 1 : Number(f.dich) || 1, don_vi: f.don_vi || '', hien_tai: 0, cha: null, ghi_chu: x.p ? `Kế hoạch: ${x.p}` : '', uoc_id: x.id };
      await luuDsMT([...dsMT(), g]);
      await suaUoc(id, u => ({ ...u, mt_ids: [...new Set([...(u.mt_ids || []), g.id])] })); toast('Đã tạo mục tiêu ✓');
    } }],
  });
}
function moGanMT(id) {
  const x = dsUoc().find(k => k.id === id), cs = dsMT().slice().sort((a, b) => (b.nam - a.nam) || ((b.thang || 0) - (a.thang || 0)));
  if (!cs.length) return toast('Chưa có mục tiêu nào. Thầy bấm "Biến thành mục tiêu" nhé');
  const nhan = g => g.ky === 'nam' ? `Năm ${g.nam}` : g.ky === 'tuan' ? `Tuần ${ngayNgan(g.tuan)}` : `T${g.thang}/${g.nam}`;
  moHop({
    tieuDe: 'Gắn mục tiêu có sẵn',
    noiDung: `<div class="mf-chon-mt">${cs.map(g => `<label><input type="checkbox" value="${g.id}" ${(x.mt_ids || []).includes(g.id) ? 'checked' : ''}><span>${esc(g.ten)}<small>${nhan(g)} · ${g.nhom}</small></span></label>`).join('')}</div>`,
    nut: [{ chu: 'Huỷ', bam: () => { } }, { chu: 'Lưu', kieu: 'chinh', bam: async n => { const ids = [...n.querySelectorAll('input:checked')].map(i => i.value); await suaUoc(id, u => ({ ...u, mt_ids: ids })); } }],
  });
}
function moGanQuy(id) {
  const x = dsUoc().find(k => k.id === id), qs = dsQuy();
  moHop({
    tieuDe: 'Gắn quỹ tiết kiệm',
    noiDung: `<div class="form luoi-form">
      ${qs.length ? `<label class="ca-dong">Chọn quỹ có sẵn<select name="quy_id"><option value="">— tạo quỹ mới —</option>${qs.map(q => `<option value="${q.id}">${esc(q.ten)} · ${tienGon(soDuQuy(q))}${q.dich ? ' / ' + tienGon(q.dich) : ''}</option>`).join('')}</select></label>` : ''}
      <label class="ca-dong mf-quy-moi">Tên quỹ mới<input name="ten" value="Quỹ ${esc(x.ten)}"></label>
      <label class="mf-quy-moi">Đích cần đạt (đ)<input data-so name="dich"></label>
      <label class="mf-quy-moi">Hạn<input type="date" name="han" value="${esc(x.han || '')}"></label>
    </div>`,
    khiMo: n => { ganOTien(n); const cap = () => n.querySelectorAll('.mf-quy-moi').forEach(e => e.style.display = docForm(n).quy_id ? 'none' : ''); n.addEventListener('change', cap); cap(); },
    nut: [{ chu: 'Huỷ', bam: () => { } }, { chu: 'Lưu', kieu: 'chinh', bam: async n => {
      const f = docForm(n); let qid = f.quy_id;
      if (!qid) { if (!f.ten) return false; qid = 'qy' + Date.now(); await luuQuy([...dsQuy(), { id: qid, ten: f.ten, icon: 'Khác', dich: Number(f.dich) || 0, han: f.han || '', mau: mfMau(x.mang), ghi: [] }]); }
      await suaUoc(id, u => ({ ...u, quy_id: qid })); toast('Đã gắn quỹ ✓');
    } }],
  });
}
function moDat(id) {
  const x = dsUoc().find(k => k.id === id);
  moHop({
    tieuDe: `✦ ${esc(x.ten)}`,
    noiDung: `<div class="form"><label>Ngày thành hiện thực<input type="date" name="ngay" value="${homNay()}"></label>
      <label>Ghi lại khoảnh khắc này<textarea name="ghi" rows="3" placeholder="Chuyện gì đã xảy ra, mình cảm thấy thế nào…"></textarea></label></div>`,
    nut: [{ chu: 'Huỷ', bam: () => { } }, { chu: 'Đưa lên tường 成', kieu: 'chinh', bam: async n => {
      const f = docForm(n); await luuUoc(dsUoc().map(u => u.id === id ? { ...u, trang_thai: 'thanh', ngay_thanh: f.ngay || homNay(), ghi_thanh: f.ghi || '' } : u));
      MF.mo = null; MF.tab = 'thanh'; mfMung(); toast('Chúc mừng Thầy ✦'); ve();
    } }],
  });
}

/* ====================== NỐI VỚI CÁC MỤC KHÁC ====================== */
/* trang Hôm nay: thư tới ngày mở · nhắc ghi nhận buổi tối (sau 18h) · điều ước có mục tiêu vừa đạt */
function mfHomNay() {
  const hn = homNay(), den = dsThu().filter(t => !t.da_mo && t.ngay_mo <= hn);
  const gio = new Date().getHours(), chuaGhi = !ghiMF()[hn];
  const du = dsUoc().filter(x => x.trang_thai !== 'thanh' && tienDoUoc(x).du);
  if (!den.length && !(gio >= 18 && chuaGhi && (dsUoc().length || Object.keys(ghiMF()).length)) && !du.length) return '';
  return `<section class="the-giay mf-hom-nay"><div class="dau-muc"><h2 class="co-icon">${ICON.manifest}Manifest</h2><a href="#/manifest">Mở →</a></div>
    ${den.map(t => `<button class="mf-phong-bi den nho" data-act="mf-thu-mo" data-id="${t.id}"><span class="mf-sap">封</span><b>Có thư từ quá khứ</b><small>${esc(t.tieu_de || '')} · viết ${ngayVN(t.ngay_viet)}</small></button>`).join('')}
    ${du.map(x => `<button class="mf-dong-du" data-act="mf-dat" data-id="${x.id}">✦ <b>${esc(x.ten)}</b><small>Mục tiêu gắn kèm đã đạt hết. Đưa lên tường "Đã thành hiện thực"?</small></button>`).join('')}
    ${gio >= 18 && chuaGhi ? `<button class="mf-dong-ghi" data-act="mf-ghi" data-n="${hn}">${ICON.gratitude}<span><b>Ghi nhận tối nay</b><small>3 điều biết ơn + 1 dấu hiệu · chuỗi hiện tại ${chuoiGhi()} ngày</small></span></button>` : ''}
  </section>`;
}
/* Tổng kết tuần: gom ghi nhận trong tuần */
function mfTongKet(dau, cuoi) {
  const g = ghiMF(), ngay = Object.keys(g).filter(d => d >= dau && d <= cuoi).sort();
  const thanh = dsUoc().filter(x => x.trang_thai === 'thanh' && x.ngay_thanh >= dau && x.ngay_thanh <= cuoi);
  if (!ngay.length && !thanh.length && !dsUoc().length) return '';
  const bo = ngay.flatMap(d => (g[d].biet_on || []).filter(Boolean)), dh = ngay.map(d => g[d].dau_hieu).filter(Boolean);
  return `<section class="the-giay"><div class="dau-muc"><h2 class="co-icon">${ICON.manifest}Ghi nhận & Manifest</h2><span class="the">${ngay.length}/7 tối</span></div>
    ${thanh.length ? `<p class="tk-dong">✦ Thành hiện thực tuần này: ${thanh.map(x => `<b>${esc(x.ten)}</b>`).join(', ')}</p>` : ''}
    ${bo.length ? `<p class="tk-dong">Biết ơn (${bo.length} điều):</p><ul class="mf-tk-ds">${bo.slice(0, 8).map(t => `<li>${esc(t)}</li>`).join('')}${bo.length > 8 ? `<li class="mo">… và ${bo.length - 8} điều nữa</li>` : ''}</ul>` : '<p class="mo">Tuần này chưa ghi nhận tối nào. <a href="#/manifest">Ghi tối nay →</a></p>'}
    ${dh.length ? `<p class="tk-dong">Dấu hiệu:</p><ul class="mf-tk-ds dh">${dh.map(t => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}
  </section>`;
}
/* mốc đếm ngược: ngày mở thư */
function mfMocThu() { const hn = homNay(); return dsThu().filter(t => !t.da_mo && t.ngay_mo >= hn).map(t => ({ khoa: 'thu_' + t.id, ten: `Mở thư: ${t.tieu_de || 'gửi tương lai'}`, ngay: t.ngay_mo, icon: 'messages', zh: '来信', nguon: 'he_thong' })); }

const HD_MF = {
  'mf-tab': el => { MF.tab = el.dataset.v; ve(); },
  'mf-loc': el => { MF.loc = el.dataset.v; ve(); },
  'mf-moi': () => moUoc(null),
  'mf-sua': el => moUoc(el.dataset.id),
  'mf-mo': el => { MF.mo = el.dataset.id || null; MF.tab = 'bang'; ve(); if (MF.mo) setTimeout(() => document.getElementById('mf-chi-tiet')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200); },
  'mf-thanh-mt': el => moThanhMT(el.dataset.id),
  'mf-gan-mt': el => moGanMT(el.dataset.id),
  'mf-bo-mt': el => suaUoc(el.dataset.id, u => ({ ...u, mt_ids: (u.mt_ids || []).filter(i => i !== el.dataset.mt) })),
  'mf-quy': el => moGanQuy(el.dataset.id),
  'mf-bo-quy': el => suaUoc(el.dataset.id, u => ({ ...u, quy_id: null })),
  'mf-dat': el => moDat(el.dataset.id),
  'mf-tra-lai': el => suaUoc(el.dataset.id, u => ({ ...u, trang_thai: 'dang', ngay_thanh: '', ghi_thanh: '' })),
  'mf-ghi': el => moGhi(el.dataset.n),
  'mf-thu-moi': () => moVietThu(),
  'mf-thu-mo': el => moThu(el.dataset.id),
  'mf-thu-xoa': async el => { if (!(await hoi('Xoá lá thư này? Thư chưa mở sẽ mất luôn.', 'Xoá', 'nguy'))) return; await luuThu(dsThu().filter(t => t.id !== el.dataset.id)); ve(); },
};
