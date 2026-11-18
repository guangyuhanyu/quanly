/* MỤC TIÊU NĂM & THÁNG — lưu trong cai_dat 'muc_tieu' (mảng), không cần sửa Supabase.
   Mục tiêu có thể tự tính tiến độ từ dữ liệu web: buổi đã dạy, thực nhận, doanh thu, thói quen, lộ trình HSK 7–9. */

const MT_NHOM = {
  'Công việc': 'todo', 'Học tập': 'study', 'Tài chính': 'progress', 'Sức khoẻ': 'exercise', 'Cá nhân': 'selflove',
};
const MT_DO = {
  tay: 'Tự nhập số', tich: 'Đánh dấu hoàn thành', buoi_day: 'Số buổi đã dạy (tự tính)', thuc_nhan: 'Thực nhận học phí (tự tính)',
  doanh_thu: 'Doanh thu đã dạy (tự tính)', tq_ngay: 'Thói quen: số ngày đạt (tự tính)', tq_tong: 'Thói quen: tổng cộng (tự tính)', lo_trinh: 'Lộ trình HSK 7–9: % bài đã làm (tự tính)',
};
const MT = { ky: 'thang', nam: Number(homNay().slice(0, 4)), thang: Number(homNay().slice(5, 7)) };
const mtIcon = n => `<img class="ic ic-anh" src="assets/icons/${MT_NHOM[n] || 'goals'}.webp?v=4.9" alt="">`;
const dsMT = () => caiDat('muc_tieu', []) || [];
async function luuDsMT(a) { await luuCaiDat('muc_tieu', a); }
const pad2 = n => String(n).padStart(2, '0');
function khoangMT(g) {
  if (g.ky === 'nam') return [`${g.nam}-01-01`, `${g.nam}-12-31`];
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
    default: return Number(g.hien_tai) || 0;
  }
}
const dichMT = g => g.do === 'tich' ? 1 : g.do === 'lo_trinh' ? (Number(g.dich) || 100) : (Number(g.dich) || 1);
const laTien = g => g.do === 'thuc_nhan' || g.do === 'doanh_thu' || (g.do === 'tq_tong' && (S.thoi_quen.find(x => x.id === Number(g.tq_id)) || {}).don_vi === 'đ') || g.don_vi === 'đ';
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
    ${!gon && con.length ? `<div class="mt-con">${con.map(c => { const t = trangThaiMT(c); return `<span class="${t.lop}">T${c.thang}: ${Math.round(t.p * 100)}%</span>`; }).join('')}</div>` : ''}
  </div>`;
}

function vMucTieu() {
  const ds = dsMT();
  const nam = ds.filter(g => g.ky === 'nam' && g.nam === MT.nam);
  const thang = ds.filter(g => g.ky === 'thang' && g.nam === MT.nam && g.thang === MT.thang);
  const ptTB = a => a.length ? Math.round(a.reduce((s, g) => s + trangThaiMT(g).p, 0) / a.length * 100) : 0;
  const dat = a => a.filter(g => trangThaiMT(g).p >= 1).length;
  const ds12 = [...Array(12)].map((_, i) => { const a = ds.filter(g => g.ky === 'thang' && g.nam === MT.nam && g.thang === i + 1); return `<button class="mt-o-thang ${i + 1 === MT.thang ? 'on' : ''} ${a.length ? 'co' : ''}" data-act="mt-chon-thang" data-v="${i + 1}"><b>T${i + 1}</b><small>${a.length ? `${dat(a)}/${a.length}` : '—'}</small>${a.length ? `<i style="width:${ptTB(a)}%"></i>` : ''}</button>`; }).join('');
  const vongTron = (pt, nhan) => `<div class="mt-vong" style="--p:${pt}"><b>${pt}%</b><small>${nhan}</small></div>`;
  return `
  <header class="dau-trang gon"><div><p class="mat-tren">Đặt đích để đi xa</p><h1>${ICON.goals || mtIcon('')} Mục tiêu</h1></div>
    <div class="nhom-nut"><div class="vien-thang"><button class="nut-tron" data-act="mt-nam" data-d="-1">${ICON.trai}</button><span>Năm ${MT.nam}</span><button class="nut-tron" data-act="mt-nam" data-d="1">${ICON.phai}</button></div>
    <button class="nut" data-act="mt-moi" data-ky="nam">${ICON.cong} Mục tiêu năm</button><button class="nut chinh" data-act="mt-moi" data-ky="thang">${ICON.cong} Mục tiêu tháng ${MT.thang}</button></div></header>
  <div class="mt-tong">
    ${vongTron(ptTB(nam), `Năm ${MT.nam} · ${dat(nam)}/${nam.length} đạt`)}
    ${vongTron(ptTB(thang), `Tháng ${MT.thang} · ${dat(thang)}/${thang.length} đạt`)}
    <div class="mt-12">${ds12}</div>
  </div>
  <div class="luoi-2 mt-luoi">
    <section class="the-giay"><div class="dau-muc"><h2 class="co-icon">${mtIcon('')}Mục tiêu năm ${MT.nam}</h2></div>
      ${nam.length ? `<div class="mt-ds">${nam.map(g => theMT(g)).join('')}</div>` : oTrong('Chưa có mục tiêu năm.', `<button class="nut" data-act="mt-moi" data-ky="nam">${ICON.cong} Thêm mục tiêu năm</button>`)}
    </section>
    <section class="the-giay"><div class="dau-muc"><h2 class="co-icon">${ICON.lich}Tháng ${MT.thang}/${MT.nam}</h2></div>
      ${thang.length ? `<div class="mt-ds">${thang.map(g => theMT(g)).join('')}</div>` : oTrong(`Chưa có mục tiêu cho tháng ${MT.thang}.`, `<button class="nut" data-act="mt-moi" data-ky="thang">${ICON.cong} Thêm mục tiêu tháng</button>${MT.thang > 1 || MT.nam > 2000 ? ` <button class="nut" data-act="mt-chep">Chép từ tháng trước</button>` : ''}`)}
    </section>
  </div>`;
}

function mtHomNay() {
  const hn = homNay(), y = Number(hn.slice(0, 4)), m = Number(hn.slice(5, 7));
  const a = dsMT().filter(g => g.ky === 'thang' && g.nam === y && g.thang === m);
  if (!a.length) return '';
  return `<section class="the-giay"><div class="dau-muc"><h2 class="co-icon">${mtIcon('')}Mục tiêu tháng ${m}</h2><a href="#/muc-tieu">Mở →</a></div>
    <div class="mt-ds gon">${a.slice(0, 5).map(g => theMT(g, true)).join('')}</div></section>`;
}

function moMT(id, ky) {
  const ds = dsMT(), g = id ? ds.find(x => x.id === id) : { ky, nam: MT.nam, thang: MT.thang, nhom: 'Công việc', do: 'tay' };
  const chaDs = ds.filter(x => x.ky === 'nam' && x.nam === (g.nam || MT.nam));
  const tqOpt = S.thoi_quen.map(h => `<option value="${h.id}" ${Number(g.tq_id) === h.id ? 'selected' : ''}>${esc(h.ten)}</option>`).join('');
  moHop({
    tieuDe: id ? 'Sửa mục tiêu' : g.ky === 'nam' ? `Mục tiêu năm ${g.nam}` : `Mục tiêu tháng ${g.thang}/${g.nam}`,
    noiDung: `<div class="form luoi-form mt-form">
      <label class="ca-dong">Mục tiêu<input name="ten" value="${esc(g.ten || '')}" placeholder="VD: Dạy 80 buổi, Thu 15 triệu, Ôn xong 40% lộ trình HSK 7…" required></label>
      <label>Kỳ<select name="ky"><option value="thang" ${g.ky === 'thang' ? 'selected' : ''}>Tháng</option><option value="nam" ${g.ky === 'nam' ? 'selected' : ''}>Năm</option></select></label>
      <label class="mt-chi-thang">Tháng<select name="thang">${[...Array(12)].map((_, i) => `<option value="${i + 1}" ${g.thang === i + 1 ? 'selected' : ''}>Tháng ${i + 1}</option>`).join('')}</select></label>
      <label>Năm<input type="number" name="nam" value="${g.nam}"></label>
      <label>Nhóm<select name="nhom">${Object.keys(MT_NHOM).map(n => `<option ${g.nhom === n ? 'selected' : ''}>${n}</option>`).join('')}</select></label>
      <label class="ca-dong">Cách đo tiến độ<select name="do">${Object.entries(MT_DO).map(([k, v]) => `<option value="${k}" ${g.do === k ? 'selected' : ''}>${v}</option>`).join('')}</select></label>
      <label class="mt-chi-tq ca-dong">Thói quen<select name="tq_id">${tqOpt || '<option value="">(chưa có thói quen)</option>'}</select></label>
      <label class="mt-chi-dich">Đích cần đạt<input ${g.don_vi === 'đ' || ['thuc_nhan', 'doanh_thu'].includes(g.do) ? 'data-so' : 'type="number"'} name="dich" value="${g.dich || ''}" placeholder="VD: 80"></label>
      <label class="mt-chi-tay">Đơn vị<input name="don_vi" value="${esc(g.don_vi || '')}" placeholder="buổi, bài, cuốn, đ…"></label>
      <label class="mt-chi-tay">Đã đạt hiện tại<input type="number" name="hien_tai" value="${g.hien_tai || ''}"></label>
      <label class="mt-chi-cha ca-dong">Thuộc mục tiêu năm<select name="cha"><option value="">— không —</option>${chaDs.map(c => `<option value="${c.id}" ${g.cha === c.id ? 'selected' : ''}>${esc(c.ten)}</option>`).join('')}</select></label>
      <label class="ca-dong">Ghi chú<textarea name="ghi_chu" rows="2" placeholder="Vì sao mục tiêu này quan trọng, cách làm…">${esc(g.ghi_chu || '')}</textarea></label>
    </div>`,
    khiMo: n => {
      ganOTien(n);
      const cap = () => { const f = docForm(n); n.querySelectorAll('.mt-chi-thang,.mt-chi-cha').forEach(e => e.style.display = f.ky === 'thang' ? '' : 'none');
        n.querySelectorAll('.mt-chi-tq').forEach(e => e.style.display = f.do === 'tq_ngay' || f.do === 'tq_tong' ? '' : 'none');
        n.querySelectorAll('.mt-chi-tay').forEach(e => e.style.display = f.do === 'tay' ? '' : 'none');
        n.querySelectorAll('.mt-chi-dich').forEach(e => e.style.display = f.do === 'tich' ? 'none' : ''); };
      n.addEventListener('change', cap); cap();
    },
    nut: [
      ...(id ? [{ chu: 'Xoá', kieu: 'nguy', trai: true, bam: async () => { if (!(await hoi(`Xoá mục tiêu "${esc(g.ten)}"?`, 'Xoá', 'nguy'))) return false; await luuDsMT(dsMT().filter(x => x.id !== id).map(x => x.cha === id ? { ...x, cha: null } : x)); ve(); } }] : []),
      { chu: 'Huỷ', bam: () => { } },
      { chu: 'Lưu', kieu: 'chinh', bam: async n => {
        const f = docForm(n); if (!f.ten) return false;
        const moi = { ...g, id: id || 'mt' + Date.now(), ten: f.ten, ky: f.ky, nam: Number(f.nam) || MT.nam, thang: f.ky === 'thang' ? Number(f.thang) : null, nhom: f.nhom, do: f.do,
          tq_id: f.tq_id ? Number(f.tq_id) : null, dich: f.do === 'tich' ? 1 : Number(f.dich) || (f.do === 'lo_trinh' ? 100 : 1), don_vi: f.don_vi || '', hien_tai: Number(f.hien_tai) || 0,
          cha: f.ky === 'thang' && f.cha ? f.cha : null, ghi_chu: f.ghi_chu || '' };
        const a = dsMT().filter(x => x.id !== moi.id); a.push(moi); await luuDsMT(a);
        MT.nam = moi.nam; if (moi.thang) MT.thang = moi.thang; ve();
      } }],
  });
}
async function suaMT(id, ham) { const a = dsMT().map(x => x.id === id ? ham({ ...x }) : x); await luuDsMT(a); ve(); }

const HD_MT = {
  'mt-moi': el => moMT(null, el.dataset.ky),
  'mt-sua': el => moMT(el.dataset.id),
  'mt-tich': el => suaMT(el.dataset.id, g => ({ ...g, xong: !g.xong })),
  'mt-cong': el => suaMT(el.dataset.id, g => ({ ...g, hien_tai: (Number(g.hien_tai) || 0) + Number(el.dataset.v) })),
  'mt-nhap': el => { const g = dsMT().find(x => x.id === el.dataset.id); moHop({ tieuDe: esc(g.ten), noiDung: `<div class="form"><label>Đã đạt (${esc(g.don_vi || 'số')})<input type="number" name="v" value="${g.hien_tai || 0}"></label></div>`, nut: [{ chu: 'Huỷ', bam: () => { } }, { chu: 'Lưu', kieu: 'chinh', bam: async n => { await suaMT(g.id, x => ({ ...x, hien_tai: Number(docForm(n).v) || 0 })); } }] }); },
  'mt-nam': el => { MT.nam += Number(el.dataset.d); ve(); },
  'mt-chon-thang': el => { MT.thang = Number(el.dataset.v); ve(); },
  'mt-chep': async () => {
    const pt = MT.thang === 1 ? 12 : MT.thang - 1, pn = MT.thang === 1 ? MT.nam - 1 : MT.nam;
    const cu = dsMT().filter(g => g.ky === 'thang' && g.nam === pn && g.thang === pt);
    if (!cu.length) return toast(`Tháng ${pt} chưa có mục tiêu để chép`);
    const moi = cu.map((g, i) => ({ ...g, id: 'mt' + (Date.now() + i), nam: MT.nam, thang: MT.thang, xong: false, hien_tai: 0 }));
    await luuDsMT([...dsMT(), ...moi]); toast(`Đã chép ${moi.length} mục tiêu từ tháng ${pt} ✓`); ve();
  },
};
