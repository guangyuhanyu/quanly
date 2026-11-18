/* MỤC TIÊU NĂM & THÁNG — lưu trong cai_dat 'muc_tieu' (mảng), không cần sửa Supabase.
   Mục tiêu có thể tự tính tiến độ từ dữ liệu web: buổi đã dạy, thực nhận, doanh thu, thói quen, lộ trình HSK 7–9. */

const MT_NHOM = {
  'Công việc': 'todo', 'Học tập': 'study', 'Tài chính': 'progress', 'Sức khoẻ': 'exercise', 'Cá nhân': 'selflove',
};
const MT_DO = {
  tay: 'Tự nhập số', tich: 'Đánh dấu hoàn thành', buoi_day: 'Số buổi đã dạy (tự tính)', thuc_nhan: 'Thực nhận học phí (tự tính)',
  doanh_thu: 'Doanh thu đã dạy (tự tính)', tq_ngay: 'Thói quen: số ngày đạt (tự tính)', tq_tong: 'Thói quen: tổng cộng (tự tính)', lo_trinh: 'Lộ trình HSK 7–9: % bài đã làm (tự tính)', quy: 'Quỹ tiết kiệm: số dư (tự tính)', quy_gop: 'Quỹ tiết kiệm: số tiền góp trong kỳ (tự tính)',
};
const MT = { ky: 'thang', nam: Number(homNay().slice(0, 4)), thang: Number(homNay().slice(5, 7)), tuan: dauTuan(homNay()) };
const nhanTuan = t => `${ngayNgan(t)} – ${ngayNgan(congNgay(t, 6))}`;
const thangCuaTuan = t => { const d = congNgay(t, 3); return [Number(d.slice(0, 4)), Number(d.slice(5, 7))]; };
const mtIcon = n => `<img class="ic ic-anh" src="assets/icons/${MT_NHOM[n] || 'goals'}.webp?v=5.6" alt="">`;
const dsMT = () => caiDat('muc_tieu', []) || [];
async function luuDsMT(a) { await luuCaiDat('muc_tieu', a); }
const pad2 = n => String(n).padStart(2, '0');
function khoangMT(g) {
  if (g.ky === 'nam') return [`${g.nam}-01-01`, `${g.nam}-12-31`];
  if (g.ky === 'tuan') return [g.tuan, congNgay(g.tuan, 6)];
  const ym = `${g.nam}-${pad2(g.thang)}`; return [`${ym}-01`, congNgay(`${g.thang === 12 ? g.nam + 1 : g.nam}-${pad2(g.thang === 12 ? 1 : g.thang + 1)}-01`, -1)];
}
function giaTriMT(g) {
  const [tu, den] = khoangMT(g), hn = homNay(), den2 = den < hn ? den : hn;
  switch (g.do) {
    case 'tich': return g.xong ? 1 : 0;
    case 'buoi_day': return S.buoi_hoc.filter(b => b.trang_thai === 'da_day' && b.ngay >= tu && b.ngay <= den).length;
    case 'thuc_nhan': return tongKy(tu, den).thucNhan;
    case 'doanh_thu': return tongKy(tu, den).doanhThu;
    case 'tq_ngay': { const h = S.thoi_quen.find(x => x.id === Number(g.tq_id)); if (!h) return 0; let n = 0; for (let d = tu; d <= den2; d = congNgay(d, 1)) if (datTQ(h, giaTriTQ(h.id, d))) n++; return n; }
    case 'tq_tong': return S.thoi_quen_nhat_ky.filter(x => x.thoi_quen_id === Number(g.tq_id) && x.ngay >= tu && x.ngay <= den).reduce((a, x) => a + Number(x.gia_tri), 0);
    case 'lo_trinh': return l79TkKhoang(tu, den).pt;
    case 'quy': { const q = dsQuy().find(x => x.id === g.quy_id); return q ? soDuQuy(q) : 0; }
    case 'quy_gop': { const q = dsQuy().find(x => x.id === g.quy_id); return q ? (q.ghi || []).filter(x => x.ngay >= tu && x.ngay <= den && x.so_tien > 0).reduce((a, x) => a + Number(x.so_tien), 0) : 0; }
    default: return Number(g.hien_tai) || 0;
  }
}
const dichMT = g => g.do === 'tich' ? 1 : g.do === 'lo_trinh' ? (Number(g.dich) || 100) : (Number(g.dich) || 1);
const laTien = g => g.do === 'thuc_nhan' || g.do === 'quy' || g.do === 'quy_gop' || g.do === 'doanh_thu' || (g.do === 'tq_tong' && (S.thoi_quen.find(x => x.id === Number(g.tq_id)) || {}).don_vi === 'đ') || g.don_vi === 'đ';
function donViMT(g) {
  if (g.do === 'buoi_day') return 'buổi'; if (g.do === 'tq_ngay') return 'ngày'; if (g.do === 'lo_trinh') return '%';
  if (g.do === 'tq_tong') return (S.thoi_quen.find(x => x.id === Number(g.tq_id)) || {}).don_vi || ''; return g.don_vi || '';
}
const soMT = (g, v) => laTien(g) ? tienGon(v) : `${NF.format(v)}${donViMT(g) && donViMT(g) !== '%' ? ' ' + donViMT(g) : donViMT(g)}`;
function thoiGianDaQua(g) {   // phần kỳ đã trôi qua (0–1)
  const [tu, den] = khoangMT(g), hn = homNay();
  if (hn < tu) return 0; if (hn > den) return 1;
  return (l79Lech(tu, hn) + 1) / (l79Lech(tu, den) + 1);
}
function trangThaiMT(g) {
  const v = giaTriMT(g), p = Math.min(1, v / dichMT(g)), t = thoiGianDaQua(g);
  if (p >= 1) return { v, p, t, nhan: 'Đạt', lop: 'mt-dat' };
  if (t >= 1) return { v, p, t, nhan: 'Chưa đạt', lop: 'mt-truot' };
  if (g.do === 'tich') return { v, p, t, nhan: 'Đang làm', lop: '' };
  if (p + 0.05 >= t) return { v, p, t, nhan: 'Đúng tiến độ', lop: 'mt-tot' };
  return { v, p, t, nhan: 'Hơi chậm', lop: 'mt-cham' };
}

function theMT(g, gon) {
  const s = trangThaiMT(g), con = dsMT().filter(x => x.cha === g.id);
  const cha = g.cha ? dsMT().find(x => x.id === g.cha) : null;
  return `<div class="mt-the ${s.lop}">
    <div class="mt-dau"><span class="mt-icon">${mtIcon(g.nhom)}</span>
      <div class="mt-ten"><b>${esc(g.ten)}</b><small>${esc(g.nhom || '')}${cha ? ` · thuộc “${esc(cha.ten)}”` : ''}${g.do !== 'tay' && g.do !== 'tich' ? ' · tự tính' : ''}</small></div>
      <span class="the mt-nhan ${s.lop}">${s.nhan}</span>
      ${gon ? '' : `<button class="nut-x" data-act="mt-sua" data-id="${g.id}" title="Sửa">⋯</button>`}</div>
    ${g.do === 'tich'
      ? `<button class="tq-tich ${g.xong ? 'on' : ''}" data-act="mt-tich" data-id="${g.id}">${g.xong ? '✓ Đã hoàn thành' : 'Đánh dấu hoàn thành'}</button>`
      : `<div class="mt-so"><b>${soMT(g, s.v)}</b><span>/ ${soMT(g, dichMT(g))}</span>${g.do === 'tay' && !gon ? `<span class="mt-cong"><button data-act="mt-cong" data-id="${g.id}" data-v="1">+1</button><button data-act="mt-nhap" data-id="${g.id}">✎</button></span>` : ''}</div>
         <div class="mt-thanh"><i style="width:${(s.p * 100).toFixed(1)}%"></i>${s.t > 0 && s.t < 1 ? `<em style="left:${(s.t * 100).toFixed(1)}%" title="Mốc thời gian đã qua"></em>` : ''}</div>
         <div class="mt-chan"><span>đạt ${Math.round(s.p * 100)}% đích</span>${s.t > 0 && s.t < 1 ? `<span>đã qua ${Math.round(s.t * 100)}% thời gian</span>` : ''}</div>`}
    ${!gon && g.ghi_chu ? `<p class="mt-ghi">${esc(g.ghi_chu)}</p>` : ''}
    ${!gon && con.length ? `<div class="mt-con">${con.map(c => { const t = trangThaiMT(c); return `<span class="${t.lop}">${c.ky === 'tuan' ? 'Tuần ' + ngayNgan(c.tuan) : 'T' + c.thang}: ${Math.round(t.p * 100)}%</span>`; }).join('')}</div>` : ''}
  </div>`;
}

function vMucTieu() {
  const ds = dsMT();
  const nam = ds.filter(g => g.ky === 'nam' && g.nam === MT.nam);
  const thang = ds.filter(g => g.ky === 'thang' && g.nam === MT.nam && g.thang === MT.thang);
  const tuan = ds.filter(g => g.ky === 'tuan' && g.tuan === MT.tuan);
  const ptTB = a => a.length ? Math.round(a.reduce((s, g) => s + trangThaiMT(g).p, 0) / a.length * 100) : 0;
  const dat = a => a.filter(g => trangThaiMT(g).p >= 1).length;
  const ds12 = [...Array(12)].map((_, i) => { const a = ds.filter(g => g.ky === 'thang' && g.nam === MT.nam && g.thang === i + 1); return `<button class="mt-o-thang ${i + 1 === MT.thang ? 'on' : ''} ${a.length ? 'co' : ''}" data-act="mt-chon-thang" data-v="${i + 1}"><b>T${i + 1}</b><small>${a.length ? `${dat(a)}/${a.length}` : '—'}</small>${a.length ? `<i style="width:${ptTB(a)}%"></i>` : ''}</button>`; }).join('');
  const vongTron = (pt, nhan) => `<div class="mt-vong" style="--p:${pt}"><b>${pt}%</b><small>${nhan}</small></div>`;
  const goiY = goiYTuan(MT.tuan).filter(x => !tuan.some(g => g.nguon_goi_y === x.key));
  const homNayTrongTuan = homNay() >= MT.tuan && homNay() <= congNgay(MT.tuan, 6);
  const conNgay = homNayTrongTuan ? stSoNgay(homNay(), congNgay(MT.tuan, 6)) + 1 : null;
  return `
  <header class="dau-trang gon"><div><p class="mat-tren">Đặt đích để đi xa</p><h1>${ICON.goals} Mục tiêu</h1></div>
    <div class="nhom-nut"><div class="vien-thang"><button class="nut-tron" data-act="mt-nam" data-d="-1">${ICON.trai}</button><span>Năm ${MT.nam}</span><button class="nut-tron" data-act="mt-nam" data-d="1">${ICON.phai}</button></div>
    <button class="nut" data-act="mt-moi" data-ky="nam">${ICON.cong} Năm</button><button class="nut" data-act="mt-moi" data-ky="thang">${ICON.cong} Tháng ${MT.thang}</button><button class="nut chinh" data-act="mt-moi" data-ky="tuan">${ICON.cong} Tuần này</button></div></header>
  <div class="mt-tong">
    ${vongTron(ptTB(nam), `Năm ${MT.nam} · ${dat(nam)}/${nam.length} đạt`)}
    ${vongTron(ptTB(thang), `Tháng ${MT.thang} · ${dat(thang)}/${thang.length} đạt`)}
    ${vongTron(ptTB(tuan), `Tuần ${ngayNgan(MT.tuan)} · ${dat(tuan)}/${tuan.length} đạt`)}
    <div class="mt-12">${ds12}</div>
  </div>
  <div class="mt-luoi3">
    <section class="the-giay"><div class="dau-muc"><h2 class="co-icon">${mtIcon('')}Năm ${MT.nam}</h2></div>
      ${nam.length ? `<div class="mt-ds">${nam.map(g => theMT(g)).join('')}</div>` : oTrong('Chưa có mục tiêu năm.', `<button class="nut" data-act="mt-moi" data-ky="nam">${ICON.cong} Thêm</button>`)}
    </section>
    <section class="the-giay"><div class="dau-muc"><h2 class="co-icon">${ICON.lich}Tháng ${MT.thang}/${MT.nam}</h2></div>
      ${thang.length ? `<div class="mt-ds">${thang.map(g => theMT(g)).join('')}</div>` : oTrong(`Chưa có mục tiêu tháng ${MT.thang}.`, `<button class="nut" data-act="mt-moi" data-ky="thang">${ICON.cong} Thêm</button> <button class="nut" data-act="mt-chep">Chép từ tháng trước</button>`)}
    </section>
    <section class="the-giay mt-cot-tuan"><div class="dau-muc"><h2 class="co-icon">${ICON.todo}Tuần</h2>
      <div class="vien-thang nho"><button class="nut-tron" data-act="mt-tuan" data-d="-7">${ICON.trai}</button><span>${nhanTuan(MT.tuan)}</span><button class="nut-tron" data-act="mt-tuan" data-d="7">${ICON.phai}</button></div></div>
      ${conNgay ? `<p class="mo nho">Còn ${conNgay} ngày trong tuần${MT.tuan !== dauTuan(homNay()) ? '' : ''}.</p>` : MT.tuan !== dauTuan(homNay()) ? `<p class="mo nho"><a href="#/muc-tieu" data-act="mt-tuan" data-d="0">Về tuần này</a></p>` : ''}
      ${tuan.length ? `<div class="mt-ds">${tuan.map(g => theMT(g)).join('')}</div>` : oTrong('Chưa có mục tiêu cho tuần này.', `<button class="nut" data-act="mt-moi" data-ky="tuan">${ICON.cong} Thêm</button>`)}
      ${goiY.length ? `<div class="mt-goi-y"><h4>Gợi ý từ mục tiêu tháng & quỹ</h4>${goiY.map((x, i) => `<div><span>${x.ten}<small>${x.ly}</small></span><button class="nut nho" data-act="mt-them-goi-y" data-i="${i}">+ Thêm</button></div>`).join('')}</div>` : ''}
    </section>
  </div>`;
}

/* Tự tách mục tiêu tháng (và quỹ có hạn) ra mục tiêu cho một tuần */
function goiYTuan(tuan) {
  const [y, m] = thangCuaTuan(tuan), kq = [];
  const cuoiThang = khoangMT({ ky: 'thang', nam: y, thang: m })[1];
  let soTuanCon = 0; for (let t = tuan; t <= cuoiThang; t = congNgay(t, 7)) soTuanCon++;
  soTuanCon = Math.max(1, soTuanCon);
  dsMT().filter(g => g.ky === 'thang' && g.nam === y && g.thang === m && g.do !== 'tich').forEach(g => {
    const v = g.do === 'lo_trinh' || g.do === 'quy' ? 0 : giaTriMT(g), con = dichMT(g) - v;
    if (g.do !== 'lo_trinh' && g.do !== 'quy' && con <= 0) return;
    let dich, ly;
    if (g.do === 'lo_trinh') { dich = dichMT(g); ly = `giữ ${dich}% bài như mục tiêu tháng`; }
    else if (g.do === 'quy') return;
    else if (g.do === 'tq_ngay') { dich = Math.min(7, Math.ceil(con / soTuanCon)); ly = `tháng còn thiếu ${con} ngày, ${soTuanCon} tuần`; }
    else { dich = Math.ceil(con / soTuanCon); if (laTien(g)) dich = Math.ceil(dich / 10000) * 10000; ly = `tháng còn thiếu ${soMT(g, con)}, chia ${soTuanCon} tuần`; }
    kq.push({ key: 'mt:' + g.id, ten: `${g.ten} · tuần này ${soMT(g, dich)}`, ly, g: { ten: `${g.ten} · phần tuần ${soMT(g, dich)}`, nhom: g.nhom, do: g.do, tq_id: g.tq_id, quy_id: g.quy_id, don_vi: g.don_vi, dich, cha: g.id } });
  });
  if (typeof dsQuy === 'function') dsQuy().forEach(q => {
    const c = typeof canGop === 'function' ? canGop(q) : null; if (!c || c.qua) return;
    kq.push({ key: 'qy:' + q.id, ten: `Góp ${q.ten} ${tienGon(c.tuan)}`, ly: `còn ${c.ngay} ngày tới hạn, thiếu ${tienGon(c.con)}`, g: { ten: `Góp ${q.ten}`, nhom: 'Tài chính', do: 'quy_gop', quy_id: q.id, dich: Math.ceil(c.tuan / 10000) * 10000, cha: null } });
  });
  return kq;
}

function mtHomNay() {
  const hn = homNay(), y = Number(hn.slice(0, 4)), m = Number(hn.slice(5, 7)), t = dauTuan(hn);
  const tuan = dsMT().filter(g => g.ky === 'tuan' && g.tuan === t);
  const thang = dsMT().filter(g => g.ky === 'thang' && g.nam === y && g.thang === m);
  if (!tuan.length && !thang.length) return '';
  const con = stSoNgay(hn, congNgay(t, 6)) + 1;
  return `<section class="the-giay"><div class="dau-muc"><h2 class="co-icon">${mtIcon('')}Mục tiêu</h2><a href="#/muc-tieu">Mở →</a></div>
    ${tuan.length ? `<p class="mt-nhom-hn">Tuần này · còn ${con} ngày</p><div class="mt-ds gon">${tuan.map(g => theMT(g, true)).join('')}</div>` : ''}
    ${thang.length ? `<p class="mt-nhom-hn">Tháng ${m}</p><div class="mt-ds gon">${thang.slice(0, tuan.length ? 3 : 5).map(g => theMT(g, true)).join('')}</div>` : ''}
  </section>`;
}

function moMT(id, ky) {
  const ds = dsMT(), g = id ? ds.find(x => x.id === id) : { ky, nam: MT.nam, thang: MT.thang, tuan: MT.tuan, nhom: 'Công việc', do: 'tay' };
  const tqOpt = S.thoi_quen.map(h => `<option value="${h.id}" ${Number(g.tq_id) === h.id ? 'selected' : ''}>${esc(h.ten)}</option>`).join('');
  const quyDs = typeof dsQuy === 'function' ? dsQuy() : [];
  const chaNam = ds.filter(x => x.ky === 'nam');
  const chaThang = ds.filter(x => x.ky === 'thang');
  moHop({
    tieuDe: id ? 'Sửa mục tiêu' : g.ky === 'nam' ? `Mục tiêu năm ${g.nam}` : g.ky === 'tuan' ? `Mục tiêu tuần ${nhanTuan(g.tuan)}` : `Mục tiêu tháng ${g.thang}/${g.nam}`,
    noiDung: `<div class="form luoi-form mt-form">
      <label class="ca-dong">Mục tiêu<input name="ten" value="${esc(g.ten || '')}" placeholder="VD: Dạy 12 buổi, Anki đủ 7 ngày, Góp Quỹ Tết 800k…" required></label>
      <label>Kỳ<select name="ky"><option value="tuan" ${g.ky === 'tuan' ? 'selected' : ''}>Tuần</option><option value="thang" ${g.ky === 'thang' ? 'selected' : ''}>Tháng</option><option value="nam" ${g.ky === 'nam' ? 'selected' : ''}>Năm</option></select></label>
      <label class="mt-chi-tuan">Tuần (chọn một ngày bất kỳ trong tuần)<input type="date" name="tuan" value="${g.tuan || MT.tuan}"></label>
      <label class="mt-chi-thang">Tháng<select name="thang">${[...Array(12)].map((_, i) => `<option value="${i + 1}" ${g.thang === i + 1 ? 'selected' : ''}>Tháng ${i + 1}</option>`).join('')}</select></label>
      <label class="mt-chi-nam">Năm<input type="number" name="nam" value="${g.nam || MT.nam}"></label>
      <label>Nhóm<select name="nhom">${Object.keys(MT_NHOM).map(n => `<option ${g.nhom === n ? 'selected' : ''}>${n}</option>`).join('')}</select></label>
      <label class="ca-dong">Cách đo tiến độ<select name="do">${Object.entries(MT_DO).map(([k, v]) => `<option value="${k}" ${g.do === k ? 'selected' : ''}>${v}</option>`).join('')}</select></label>
      <label class="mt-chi-tq ca-dong">Thói quen<select name="tq_id">${tqOpt || '<option value="">(chưa có thói quen)</option>'}</select></label>
      <label class="mt-chi-quy ca-dong">Quỹ<select name="quy_id">${quyDs.map(q => `<option value="${q.id}" ${g.quy_id === q.id ? 'selected' : ''}>${esc(q.ten)}</option>`).join('') || '<option value="">(chưa có quỹ)</option>'}</select></label>
      <label class="mt-chi-dich">Đích cần đạt<input ${g.don_vi === 'đ' || ['thuc_nhan', 'doanh_thu', 'quy', 'quy_gop'].includes(g.do) ? 'data-so' : 'type="number"'} name="dich" value="${g.dich || ''}" placeholder="VD: 12"></label>
      <label class="mt-chi-tay">Đơn vị<input name="don_vi" value="${esc(g.don_vi || '')}" placeholder="buổi, bài, cuốn, đ…"></label>
      <label class="mt-chi-tay">Đã đạt hiện tại<input type="number" name="hien_tai" value="${g.hien_tai || ''}"></label>
      <label class="mt-chi-cha-nam ca-dong">Thuộc mục tiêu năm<select name="cha_nam"><option value="">— không —</option>${chaNam.map(c => `<option value="${c.id}" ${g.cha === c.id ? 'selected' : ''}>${c.nam} · ${esc(c.ten)}</option>`).join('')}</select></label>
      <label class="mt-chi-cha-thang ca-dong">Thuộc mục tiêu tháng<select name="cha_thang"><option value="">— không —</option>${chaThang.map(c => `<option value="${c.id}" data-thang="${c.nam}-${c.thang}" ${g.cha === c.id ? 'selected' : ''}>T${c.thang}/${c.nam} · ${esc(c.ten)}</option>`).join('')}</select></label>
      <label class="ca-dong">Ghi chú<textarea name="ghi_chu" rows="2" placeholder="Vì sao mục tiêu này quan trọng, cách làm…">${esc(g.ghi_chu || '')}</textarea></label>
    </div>`,
    khiMo: n => {
      ganOTien(n);
      const cap = () => {
        const f = docForm(n), an = (sel, hien) => n.querySelectorAll(sel).forEach(e => e.style.display = hien ? '' : 'none');
        an('.mt-chi-tuan', f.ky === 'tuan'); an('.mt-chi-thang', f.ky === 'thang'); an('.mt-chi-nam', f.ky !== 'tuan');
        an('.mt-chi-cha-nam', f.ky === 'thang'); an('.mt-chi-cha-thang', f.ky === 'tuan');
        an('.mt-chi-tq', f.do === 'tq_ngay' || f.do === 'tq_tong'); an('.mt-chi-quy', f.do === 'quy' || f.do === 'quy_gop');
        an('.mt-chi-tay', f.do === 'tay'); an('.mt-chi-dich', f.do !== 'tich');
        if (f.ky === 'tuan' && f.tuan) { const [yy, mm] = thangCuaTuan(dauTuan(f.tuan)); n.querySelectorAll('[name=cha_thang] option[data-thang]').forEach(o => o.hidden = o.dataset.thang !== `${yy}-${mm}`); }
      };
      n.addEventListener('change', cap); cap();
    },
    nut: [
      ...(id ? [{ chu: 'Xoá', kieu: 'nguy', trai: true, bam: async () => { if (!(await hoi(`Xoá mục tiêu "${esc(g.ten)}"?`, 'Xoá', 'nguy'))) return false; await luuDsMT(dsMT().filter(x => x.id !== id).map(x => x.cha === id ? { ...x, cha: null } : x)); ve(); } }] : []),
      { chu: 'Huỷ', bam: () => { } },
      { chu: 'Lưu', kieu: 'chinh', bam: async n => {
        const f = docForm(n); if (!f.ten) return false;
        const tuan = f.ky === 'tuan' ? dauTuan(f.tuan || MT.tuan) : null;
        const [ty, tm] = tuan ? thangCuaTuan(tuan) : [Number(f.nam) || MT.nam, Number(f.thang)];
        const moi = { ...g, id: id || 'mt' + Date.now(), ten: f.ten, ky: f.ky, nam: f.ky === 'tuan' ? ty : Number(f.nam) || MT.nam, thang: f.ky === 'thang' ? Number(f.thang) : f.ky === 'tuan' ? tm : null, tuan,
          nhom: f.nhom, do: f.do, tq_id: f.tq_id ? Number(f.tq_id) : null, quy_id: f.quy_id || null,
          dich: f.do === 'tich' ? 1 : Number(f.dich) || (f.do === 'lo_trinh' ? 100 : 1), don_vi: f.don_vi || '', hien_tai: Number(f.hien_tai) || 0,
          cha: f.ky === 'thang' ? (f.cha_nam || null) : f.ky === 'tuan' ? (f.cha_thang || null) : null, ghi_chu: f.ghi_chu || '' };
        const a = dsMT().filter(x => x.id !== moi.id); a.push(moi); await luuDsMT(a);
        MT.nam = moi.nam; if (moi.thang) MT.thang = moi.thang; if (moi.tuan) MT.tuan = moi.tuan; ve();
      } }],
  });
}
async function suaMT(id, ham) { const a = dsMT().map(x => x.id === id ? ham({ ...x }) : x); await luuDsMT(a); ve(); }
async function themMTTuan(ds, tuan) {   // ds: [{ten, ...}] → mục tiêu tuần
  const [y, m] = thangCuaTuan(tuan), t = Date.now();
  const moi = ds.map((x, i) => ({ id: 'mt' + (t + i), ky: 'tuan', tuan, nam: y, thang: m, nhom: 'Cá nhân', do: 'tich', dich: 1, hien_tai: 0, ghi_chu: '', ...x }));
  await luuDsMT([...dsMT(), ...moi]);
}

const HD_MT = {
  'mt-moi': el => moMT(null, el.dataset.ky),
  'mt-sua': el => moMT(el.dataset.id),
  'mt-tich': el => suaMT(el.dataset.id, g => ({ ...g, xong: !g.xong })),
  'mt-cong': el => suaMT(el.dataset.id, g => ({ ...g, hien_tai: (Number(g.hien_tai) || 0) + Number(el.dataset.v) })),
  'mt-nhap': el => { const g = dsMT().find(x => x.id === el.dataset.id); moHop({ tieuDe: esc(g.ten), noiDung: `<div class="form"><label>Đã đạt (${esc(g.don_vi || 'số')})<input type="number" name="v" value="${g.hien_tai || 0}"></label></div>`, nut: [{ chu: 'Huỷ', bam: () => { } }, { chu: 'Lưu', kieu: 'chinh', bam: async n => { await suaMT(g.id, x => ({ ...x, hien_tai: Number(docForm(n).v) || 0 })); } }] }); },
  'mt-nam': el => { MT.nam += Number(el.dataset.d); ve(); },
  'mt-chon-thang': el => { MT.thang = Number(el.dataset.v); const t = dauTuan(`${MT.nam}-${pad2(MT.thang)}-04`); MT.tuan = t; ve(); },
  'mt-tuan': el => { const d = Number(el.dataset.d); MT.tuan = d === 0 ? dauTuan(homNay()) : congNgay(MT.tuan, d); const [y, m] = thangCuaTuan(MT.tuan); MT.nam = y; MT.thang = m; ve(); },
  'mt-them-goi-y': async el => {
    const tuan = vMucTieuGoiY()[Number(el.dataset.i)]; if (!tuan) return;
    await themMTTuan([{ ...tuan.g, nguon_goi_y: tuan.key }], MT.tuan); toast('Đã thêm mục tiêu tuần ✓'); ve();
  },
  'mt-chep': async () => {
    const pt = MT.thang === 1 ? 12 : MT.thang - 1, pn = MT.thang === 1 ? MT.nam - 1 : MT.nam;
    const cu = dsMT().filter(g => g.ky === 'thang' && g.nam === pn && g.thang === pt);
    if (!cu.length) return toast(`Tháng ${pt} chưa có mục tiêu để chép`);
    const moi = cu.map((g, i) => ({ ...g, id: 'mt' + (Date.now() + i), nam: MT.nam, thang: MT.thang, xong: false, hien_tai: 0 }));
    await luuDsMT([...dsMT(), ...moi]); toast(`Đã chép ${moi.length} mục tiêu từ tháng ${pt} ✓`); ve();
  },
};
const vMucTieuGoiY = () => { const tuan = dsMT().filter(g => g.ky === 'tuan' && g.tuan === MT.tuan); return goiYTuan(MT.tuan).filter(x => !tuan.some(g => g.nguon_goi_y === x.key)); };
