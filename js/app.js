/* =========================================================
   Điều hướng · sự kiện · xuất PNG · lịch Apple · sao lưu · khởi động
   ========================================================= */
const MENU = [
  ['hom-nay', 'Hôm nay', '今日'], ['lich', 'Lịch dạy', '课表'], ['lop', 'Lớp học', '班级'], ['hoc-vien', 'Học viên', '学员'],
  ['tai-chinh', 'Tài chính', '财务'], ['cong-viec', 'Công việc', '事务'],
  ['-', 'Cá nhân'], ['rut-tham', 'Rút thăm', '灵签'], ['thoi-quen', 'Thói quen', '习惯'], ['chi-tieu', 'Chi tiêu', '记账'],
  ['-', ''], ['cai-dat', 'Cài đặt', '设置'],
];
const NAV_DUOI = ['hom-nay', 'lich', 'lop', 'thoi-quen'];
function ve() {
  const [trang, id] = (location.hash.replace(/^#\/?/, '') || 'hom-nay').split('/');
  $$('.menu a, #nav-duoi a').forEach(a => a.classList.toggle('on', a.dataset.trang === trang));
  const main = $('#main'); const cuon = main.scrollTop;
  const giuCuon = main.dataset.trang === location.hash;
  let html;
  switch (trang) {
    case 'lich': html = vLich(); break;
    case 'lop': html = id ? vChiTietLop(Number(id)) : vLop(); break;
    case 'hoc-vien': html = vHocVien(); break;
    case 'tai-chinh': html = vTaiChinh(); break;
    case 'cong-viec': html = vCongViec(); break;
    case 'cai-dat': html = vCaiDat(); break;
    case 'rut-tham': html = vRutTham(); break;
    case 'thoi-quen': html = vThoiQuen(); break;
    case 'chi-tieu': html = vChiTieu(); break;
    default: html = vHomNay();
  }
  main.innerHTML = `<div class="noi-dung-trang">${html}</div>`;
  main.dataset.trang = location.hash;
  if (giuCuon) main.scrollTop = cuon; else main.scrollTop = 0;
  if (trang === 'lich') { ganLich(main); const than = $('.lt-than', main); const khoaCuon = LICH.kieu + LICH.moc; if (than && (!giuCuon || LICH._cuon !== khoaCuon)) { LICH._cuon = khoaCuon; const tops = $$('.lt-cot .su-kien', main).map(e => parseInt(e.style.top)); than.scrollTop = tops.length ? Math.max(0, Math.min(...tops) - 2 * O) : (17 - 7) * 2 * O; } }
  if (trang === 'tai-chinh') veBieuDo();
  const tim = $('#tim-lop'); if (tim) { tim.oninput = () => { LOC_LOP.tim = tim.value; const p = tim.selectionStart; ve(); const t2 = $('#tim-lop'); t2.focus(); t2.setSelectionRange(p, p); }; }
  const timhv = $('#tim-hv'); if (timhv) { timhv.oninput = () => { LOC_HV.tim = timhv.value; const p = timhv.selectionStart; ve(); const t2 = $('#tim-hv'); t2.focus(); t2.setSelectionRange(p, p); }; }
  $$('.bang-gia input', main).forEach(inp => inp.onchange = async () => {
    const id = Number(inp.closest('tr').dataset.bg); const f = inp.dataset.f;
    let v = inp.value.trim(); if (f === 'don_gia_gio') v = Number(v.replace(/\D/g, '')) || 0;
    await luu('bang_gia', { [f]: v || null }, id); toast('Đã lưu bảng giá');
  });
  ganOTien(main);
  $$('[data-cai]', main).forEach(inp => inp.onchange = async () => { await luuCaiDat(inp.dataset.cai, Number(inp.value)); lamMoi(); toast('Đã lưu'); });
  $('#dem-viec').textContent = viecTuNhac().length + S.cong_viec.filter(c => !c.xong && c.han && c.han <= homNay()).length || '';
}
window.addEventListener('hashchange', ve);

const HD = {
  'them-buoi': el => moBuoi({ ngay: el.dataset.ngay, lopId: el.dataset.lop ? Number(el.dataset.lop) : null, dat: el.dataset.dat }),
  'mo-buoi': el => moBuoi({ id: Number(el.dataset.id), dat: el.dataset.dat }),
  'lich-kieu': el => { LICH.kieu = el.dataset.v; ve(); },
  'lich-lui': () => { LICH.moc = LICH.kieu === 'tuan' ? congNgay(LICH.moc, -7) : dichKy('thang', LICH.moc, -1); ve(); },
  'lich-toi': () => { LICH.moc = LICH.kieu === 'tuan' ? congNgay(LICH.moc, 7) : dichKy('thang', LICH.moc, 1); ve(); },
  'lich-nay': () => { LICH.moc = homNay(); ve(); },
  'lich-den': el => { LICH.moc = el.dataset.ngay; LICH.kieu = 'tuan'; ve(); },
  'lich-apple': () => { location.hash = '#/cai-dat'; },
  'mo-ngay': el => moNgay(el.dataset.ngay),
  'tin-gia-han': el => moTinGiaHan(Number(el.dataset.lop)),
  'chuc-sn': el => moChucSN(Number(el.dataset.id)),
  'tong-ket': el => moTongKet(el.dataset.thang),
  'chi-tiet-so': el => moChiTietSo(el.dataset.loai, el.dataset.tu, el.dataset.den, el.dataset.ten),
  'giao-dien': () => moGiaoDien(),
  'mo-menu': () => moMenu(),
  'rt-cd': el => { RT.cd = el.dataset.v; ve(); },
  'rut-tham': () => rutTham(),
  'di-rut-tham': () => { location.hash = '#/rut-tham'; setTimeout(rutTham, 300); },
  'them-la': () => moThemLa(),
  'xoa-la': async el => { const ds = laRieng().slice(); ds.splice(Number(el.dataset.i), 1); await luuCaiDat('la_tham_rieng', ds); ve(); },
  'tham-thanh-viec': async () => { const la = laHomNay(); if (!la) return; await luu('cong_viec', { tieu_de: la.kh, nhom: 'Cá nhân', han: homNay(), uu_tien: 2, xong: false, ghi_chu: la.zh }); toast('Đã thêm vào việc hôm nay ✓'); },
  'tq-lui': () => { TQ.ngay = congNgay(TQ.ngay, -1); ve(); },
  'tq-toi': () => { if (TQ.ngay < homNay()) { TQ.ngay = congNgay(TQ.ngay, 1); ve(); } },
  'tq-moi': () => moTQ(),
  'tq-sua': el => moTQ(Number(el.dataset.id)),
  'tq-goi-y': async () => { for (const [i, h] of TQ_GOI_Y.entries()) await luu('thoi_quen', { ...h, thu_tu: i, dang_dung: true }); toast('Đã tạo 6 thói quen ✓'); ve(); },
  'tq-tich': async el => { if (el.dataset.nhanh) TQ.ngay = homNay(); const h = S.thoi_quen.find(x => x.id === Number(el.dataset.id)); await ghiTQ(h, TQ.ngay, giaTriTQ(h.id, TQ.ngay) ? 0 : 1); ve(); },
  'tq-cong': async el => { const h = S.thoi_quen.find(x => x.id === Number(el.dataset.id)); await ghiTQ(h, TQ.ngay, giaTriTQ(h.id, TQ.ngay) + Number(el.dataset.v)); ve(); },
  'tq-nhap': el => { if (el.dataset.nhanh) TQ.ngay = homNay(); nhapTQ(S.thoi_quen.find(x => x.id === Number(el.dataset.id))); },
  'ct-lui': () => { const d = s2d(CT.thang + '-01'); d.setMonth(d.getMonth() - 1); CT.thang = d2s(d).slice(0, 7); ve(); },
  'ct-toi': () => { const d = s2d(CT.thang + '-01'); d.setMonth(d.getMonth() + 1); CT.thang = d2s(d).slice(0, 7); ve(); },
  'ct-loai': el => { CT.loai = el.dataset.v; ve(); setTimeout(() => { const o = $('[data-form=chi-tieu] [name=so_tien]'); o && o.focus(); }, 30); },
  'ct-sua': el => moCT(Number(el.dataset.id)),
  'ct-loc': el => { CT.locDm = CT.locDm === el.dataset.v ? null : el.dataset.v; ve(); },
  'ct-bo-loc': () => { CT.locDm = null; ve(); },
  'ct-cai': () => moCaiCT(),
  'lich-loai': el => { LICH.loai = el.dataset.v; ve(); },
  'lich-tab': el => { LICH.tab = el.dataset.v; ve(); },
  'lich-loc': el => { const id = Number(el.dataset.lop); LICH.loc = LICH.loc === id ? null : id; ve(); },
  'lich-bo-loc': () => { LICH.loc = null; ve(); },
  'ben-mo': el => { LICH.moRong[el.dataset.k] = !LICH.moRong[el.dataset.k]; ve(); },
  'loc-lop': el => { LOC_LOP.trang = el.dataset.v; ve(); },
  'ds-hv-lop': (el, e) => { e.stopPropagation(); hienDsHvLop(Number(el.dataset.lop), el); },
  'lop-moi': () => moFormLop(),
  'sua-lop': el => moFormLop(Number(el.dataset.lop)),
  'gia-han': el => moGiaHan(Number(el.dataset.lop)),
  'sua-khoa': el => moSuaKhoa(Number(el.dataset.id)),
  'chon-khoa-nut': el => { CHON_KHOA[Number(el.dataset.lop)] = Number(el.dataset.id); ve(); $('#main').scrollTop = 0; },
  'thanh-toan': el => moThanhToan({ lopId: Number(el.dataset.lop), khoaId: el.dataset.khoa ? Number(el.dataset.khoa) : null }),
  'sua-tt': el => moThanhToan({ id: Number(el.dataset.id) }),
  'hv-moi': () => moHocVien(),
  'sua-hv': (el, e) => { e.preventDefault(); moHocVien(Number(el.dataset.id)); },
  'tc-ky': el => { TC.ky = el.dataset.v; ve(); },
  'tc-lui': () => { TC.moc = dichKy(TC.ky, TC.moc, -1); ve(); },
  'tc-toi': () => { TC.moc = dichKy(TC.ky, TC.moc, 1); ve(); },
  'tc-nay': () => { TC.moc = homNay(); ve(); },
  'them-viec': () => moViec(),
  'sua-viec': el => moViec(Number(el.dataset.id)),
  'xong-viec': async el => { await luu('cong_viec', { xong: el.checked }, Number(el.dataset.id)); setTimeout(ve, 250); },
  'loc-viec': el => { CV.nhom = el.dataset.v; ve(); },
  'hien-xong': () => { CV.hienXong = !CV.hienXong; ve(); },
  'xuat-png': el => moXuatPNG(Number(el.dataset.lop), el.dataset.mau || '02'),
  'bg-them': async () => { await luu('bang_gia', { nhom: 'Khác', ten: 'Mới', don_gia_gio: 0, thu_tu: 99, dang_dung: true }); ve(); },
  'bg-xoa': async el => { if (await hoi('Xoá dòng bảng giá này?', 'Xoá', 'nguy')) { await xoa('bang_gia', Number(el.dataset.id)); ve(); } },
  'tao-ics': async () => { const t = [...crypto.getRandomValues(new Uint8Array(16))].map(x => x.toString(16).padStart(2, '0')).join(''); await luuCaiDat('ics_token', t); ve(); toast('Đã tạo link lịch'); },
  'chep-ics': async () => { await navigator.clipboard.writeText($('#link-ics').value); toast('Đã sao chép link'); },
  'tai-ics': () => taiFile(taoICS(), 'lich-day-guangyu.ics', 'text/calendar'),
  'sao-luu': () => saoLuu(),
  'sao-luu-csv': () => xuatCSV(),
  'nap-excel': () => napExcel(),
  'dang-xuat': async () => { await DBX.logout(); location.reload(); },
  'doi-ket-noi': async () => { if (await hoi('Đổi kết nối sẽ đưa Thầy về màn hình chọn nơi lưu dữ liệu. Dữ liệu hiện có không bị xoá.', 'Tiếp tục')) { localStorage.removeItem('gyq_che_do'); location.reload(); } },
};
document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]'); if (!el) return;
  const f = HD[el.dataset.act]; if (!f) return;
  if (el.tagName === 'INPUT' && el.type === 'checkbox') { f(el, e); return; }
  e.preventDefault(); f(el, e);
});
document.addEventListener('change', e => {
  const el = e.target;
  if (el.dataset.actChange === 'chon-khoa') { CHON_KHOA[Number(el.dataset.lop)] = Number(el.value); ve(); }
  if (el.dataset.change === 'khoi-phuc' && el.files[0]) khoiPhuc(el.files[0]);
  if (el.dataset.actChange === 'tq-chon') { TQ.chon = Number(el.value); ve(); }
});
document.addEventListener('submit', async e => {
  const f = e.target;
  if (f.dataset.form === 'chi-tieu') {
    e.preventDefault(); const d = docForm(f); if (!d.so_tien) { toast('Thầy nhập số tiền giúp em', 'loi'); return; }
    await luu('chi_tieu', { ngay: d.ngay || homNay(), so_tien: d.so_tien, loai: CT.loai, danh_muc: d.danh_muc, ghi_chu: d.ghi_chu });
    toast(`Đã ghi ${CT.loai === 'chi' ? 'chi' : 'thu'} ${tien(d.so_tien)} ✓`); ve(); const o = $('[data-form=chi-tieu] [name=so_tien]'); o && o.focus(); return;
  }
  if (f.dataset.form !== 'viec-nhanh') return; e.preventDefault();
  const d = docForm(f); if (!d.tieu_de) return;
  await luu('cong_viec', { tieu_de: d.tieu_de, han: d.han, nhom: d.nhom || 'Dạy học', uu_tien: d.uu_tien ? Number(d.uu_tien) : 2, xong: false });
  toast('Đã thêm việc'); ve(); const o = $('[data-form=viec-nhanh] [name=tieu_de]'); o && o.focus();
});
document.addEventListener('keydown', e => {
  if (e.target.matches('input,textarea,select') || $('.hop-nen')) return;
  if (e.key === 'n') { e.preventDefault(); moBuoi({}); }
});

/* ================= XUẤT PNG ================= */
const TEN_THU_ZH = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
const tienZh = n => new Intl.NumberFormat('en-US').format(Math.round(n || 0)) + ' 越南盾';
const ngayZh = s => { const [y, m, d] = s.split('-').map(Number); return `${y}年${m}月${d}日`; };
function duLieuPNG(L, k, mau, opt) {
  const t = tk(k); const zh = opt.lang === 'zh'; const bg = bgTheoId(L.bang_gia_id);
  const money = zh ? tienZh : tien;
  const trinhDo = zh ? ((bg && bg.ten_zh) || trinhDoCua(L, k)) : trinhDoCua(L, k);
  const hv = hvCuaLop(L.id);
  let ttHocPhi;
  if (t.conNo <= 0) { const cuoi = t.tt[t.tt.length - 1]; ttHocPhi = zh ? `已收齐 ✓${cuoi ? `（${ngayZh(cuoi.ngay)}）` : ''}` : `Đã nhận ✓${cuoi ? ` ngày ${ngayVN(cuoi.ngay)}` : ''}`; }
  else if (t.daDong > 0) ttHocPhi = zh ? `已收 ${money(t.daDong)}，尚欠 ${money(t.conNo)}` : `Đã nhận ${money(t.daDong)} – còn ${money(t.conNo)}`;
  else ttHocPhi = zh ? `待缴 ${money(k.hoc_phi)}` : `Chưa đóng (${money(k.hoc_phi)})`;
  if (mau === '01') {
    return {
      lop: L.ten, so_hv: zh ? `${Math.max(hv.length, 1)} 人` : `${Math.max(hv.length, 1)} học viên`,
      ngay_bd: k.ngay_bat_dau ? (zh ? ngayZh(k.ngay_bat_dau) : ngayVN(k.ngay_bat_dau)) : '',
      so_buoi: zh ? `${t.tong} 次课 × ${k.thoi_luong_phut || 90} 分钟` : `${t.tong} buổi × ${k.thoi_luong_phut || 90} phút`,
      lich: k.lich_hoc || '', tai_lieu: k.giao_trinh || trinhDo, muc_tieu: k.muc_tieu || '',
      hoc_phi: money(k.hoc_phi) + (k.buoi_chuyen_sang > 0 ? (zh ? `（含上期转入 ${k.buoi_chuyen_sang} 次课）` : ` (cộng thêm ${k.buoi_chuyen_sang} buổi chuyển từ khoá trước)`) : ''),
      tinh_trang: ttHocPhi,
    };
  }
  const daDay = t.daDay;
  return {
    lop: L.ten, trinh_do: trinhDo, tong: String(t.daHoc), con_lai: String(Math.max(t.conLai, 0)) + (t.conLai < 0 ? (zh ? `（超出 ${-t.conLai}）` : ` (vượt ${-t.conLai})`) : ''),
    hoc_phi: money(k.hoc_phi),
    ngay_list: daDay.map(b => zh ? `${Number(b.ngay.slice(5, 7))}月${Number(b.ngay.slice(8))}日` : ngayNgan(b.ngay)).join(zh ? '、' : ', '),
    buoi: daDay.map((b, i) => ({ stt: i + 1, ngay: zh ? `${Number(b.ngay.slice(5, 7))}月${Number(b.ngay.slice(8))}日（${TEN_THU_ZH[s2d(b.ngay).getDay()]}）` : `${THU_NGAN[s2d(b.ngay).getDay()]} ${ngayVN(b.ngay)}`, noi_dung: b.noi_dung || '', tl: b.thoi_luong_phut !== (k.thoi_luong_phut || 90) ? (zh ? `${b.thoi_luong_phut}分钟` : thoiLuongChu(b.thoi_luong_phut)) : '' })),
    hien_noi_dung: opt.noiDung, tinh_trang: ttHocPhi,
    khoa_sau: opt.khoaSau ? (zh ? `${opt.soBuoiSau} 次课：${money(opt.hpSau)}` : `${opt.soBuoiSau} buổi: ${money(opt.hpSau)}`) : '',
  };
}
function moXuatPNG(lopId, mau) {
  const L = lopTheoId(lopId); const ks = khoaCuaLop(lopId).reverse();
  if (!ks.length) { toast('Lớp chưa có khoá học', 'loi'); return; }
  const k0 = khoaTheoId(CHON_KHOA[lopId]) || khoaHienTai(lopId);
  const t0 = tk(k0);
  const st = { mau, lang: L.ngon_ngu === 'zh' ? 'zh' : 'vi', khoa: k0.id, noiDung: false, khoaSau: t0.conLai <= nguongGiaHan(), soBuoiSau: k0.so_buoi, hpSau: k0.hoc_phi };
  const { nen } = moHop({
    tieuDe: `Xuất PNG – ${esc(L.ten)}`, rong: true,
    noiDung: `<div class="xuat-png">
      <aside class="xp-ben">
        <div class="phan-doan rong"><button data-xp="mau" data-v="01">PNG 01 · Thông tin lớp</button><button data-xp="mau" data-v="02">PNG 02 · Buổi học & học phí</button></div>
        <div class="phan-doan rong"><button data-xp="lang" data-v="vi">Tiếng Việt</button><button data-xp="lang" data-v="zh">中文</button></div>
        <label>Khoá<select data-xp-in="khoa">${ks.map(k => `<option value="${k.id}" ${k.id === k0.id ? 'selected' : ''}>${k.ma} · ${tk(k).daHoc}/${tk(k).tong} buổi</option>`).join('')}</select></label>
        <div data-chi="02">
          <label class="hop-chon-dong"><input type="checkbox" data-xp-in="khoaSau" ${st.khoaSau ? 'checked' : ''}> Báo học phí khoá tiếp theo</label>
          <div class="luoi-form" data-khoa-sau><label>Số buổi<input type="number" data-xp-in="soBuoiSau" value="${st.soBuoiSau}"></label><label>Học phí<input data-so data-xp-in="hpSau" value="${st.hpSau}"></label></div>
        </div>
        <p class="mo nho">Có thể bấm thẳng vào ảnh bên phải để sửa chữ trước khi tải.</p>
        <button class="nut chinh rong" data-xp="tai">⤓ Tải ảnh PNG</button>
        <button class="nut rong" data-xp="chep">⧉ Sao chép ảnh (dán vào Zalo)</button>
        <p class="mo nho" id="xp-tt"></p>
      </aside>
      <div class="xp-xem"><iframe id="xp-khung" title="Xem trước"></iframe></div>
    </div>`,
    khiMo: (n) => {
      const khung = $('#xp-khung', n);
      const nap = () => {
        $$('[data-xp=mau]', n).forEach(b => b.classList.toggle('on', b.dataset.v === st.mau));
        $$('[data-xp=lang]', n).forEach(b => b.classList.toggle('on', b.dataset.v === st.lang));
        $('[data-chi="02"]', n).style.display = st.mau === '02' ? '' : 'none';
        $('[data-khoa-sau]', n).style.display = st.khoaSau ? '' : 'none';
        const src = `templates/png${st.mau}.html`;
        const dien = () => { const w = khung.contentWindow; if (!w.dien) return setTimeout(dien, 60); w.dien(duLieuPNG(L, khoaTheoId(st.khoa), st.mau, st), st.lang); setTimeout(() => { khung.style.height = w.document.documentElement.scrollHeight + 'px'; }, 120); };
        if (!khung.src.endsWith(src)) { khung.onload = dien; khung.src = src; } else dien();
      };
      n.addEventListener('click', async e => {
        const b = e.target.closest('[data-xp]'); if (!b) return;
        const a = b.dataset.xp;
        if (a === 'mau' || a === 'lang') { st[a] = b.dataset.v; nap(); return; }
        const ttEl = $('#xp-tt', n); b.disabled = true; ttEl.textContent = 'Đang tạo ảnh…';
        try {
          const ten = `${st.mau === '01' ? 'thong-tin-lop' : 'theo-doi-buoi-hoc'}-${L.ten.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/gi, 'd').replace(/[^a-z0-9]+/gi, '-').toLowerCase()}${st.lang === 'zh' ? '-zh' : ''}.png`;
          if (a === 'tai') { const blob = await khung.contentWindow.chupAnh(); taiFile(blob, ten, 'image/png'); ttEl.textContent = 'Đã tải ảnh ✓'; }
          else {
            // Safari cần gọi clipboard.write ngay trong cú bấm, ảnh truyền vào dạng Promise
            const hua = khung.contentWindow.chupAnh().then(x => new Blob([x], { type: 'image/png' }));
            await navigator.clipboard.write([new ClipboardItem({ 'image/png': hua })]);
            ttEl.textContent = 'Đã chép ảnh – mở Zalo và dán (⌘V) ✓';
          }
          if (st.mau === '01') { const k = khoaTheoId(st.khoa); if (!k.da_gui_thong_tin) await luu('khoa_hoc', { da_gui_thong_tin: true }, k.id); }
        } catch (err) { ttEl.textContent = 'Lỗi tạo ảnh: ' + err.message; console.error(err); }
        finally { b.disabled = false; }
      });
      $$('[data-xp-in]', n).forEach(inp => inp.addEventListener(inp.type === 'checkbox' ? 'change' : 'input', () => {
        const k = inp.dataset.xpIn;
        st[k] = inp.type === 'checkbox' ? inp.checked : inp.dataset.so != null ? Number(inp.value.replace(/\D/g, '')) : Number(inp.value);
        if (k === 'khoa') { const kk = khoaTheoId(st.khoa); st.soBuoiSau = kk.so_buoi; st.hpSau = kk.hoc_phi; $('[data-xp-in=soBuoiSau]', n).value = kk.so_buoi; $('[data-xp-in=hpSau]', n).value = NF.format(kk.hoc_phi); }
        nap();
      }));
      ganOTien(n);
      nap();
    },
  });
  nen.querySelector('.hop').classList.add('hop-xuat');
}
function taiFile(du, ten, loai) {
  const blob = typeof du === 'string' ? new Blob([du], { type: loai + ';charset=utf-8' }) : new Blob([du], { type: loai });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = ten; document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
}

/* ================= LỊCH APPLE (.ics) ================= */
function taoICS() {
  const tu = congNgay(homNay(), -30);
  const dong = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Guangyu Hanyu//Lich day//VI', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'X-WR-CALNAME:Lịch dạy Guangyu', 'X-WR-TIMEZONE:Asia/Ho_Chi_Minh'];
  const utc = (ngay, phut) => { const d = new Date(Date.UTC(...ngay.split('-').map((x, i) => i === 1 ? x - 1 : +x), 0, phut - 7 * 60)); return d.toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z'; };
  const thoat = s => String(s || '').replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/[,;]/g, m => '\\' + m);
  S.buoi_hoc.filter(b => b.ngay >= tu && b.gio_bat_dau && (b.trang_thai === 'du_kien' || b.trang_thai === 'da_day')).forEach(b => {
    const L = lopTheoId(b.lop_id); if (!L) return; const s = gio2phut(b.gio_bat_dau);
    dong.push('BEGIN:VEVENT', `UID:buoi-${b.id}@guangyu`, `DTSTAMP:${utc(homNay(), 0)}`, `DTSTART:${utc(b.ngay, s)}`, `DTEND:${utc(b.ngay, s + (b.thoi_luong_phut || 90))}`,
      `SUMMARY:${thoat('📚 ' + L.ten + (b.trang_thai === 'da_day' ? ' ✓' : ''))}`, `DESCRIPTION:${thoat([`Buổi ${thuTuBuoi(b)}`, b.noi_dung, b.ghi_chu].filter(Boolean).join('\n'))}`,
      'BEGIN:VALARM', 'TRIGGER:-PT15M', 'ACTION:DISPLAY', 'DESCRIPTION:Sắp đến giờ dạy', 'END:VALARM', 'END:VEVENT');
  });
  dong.push('END:VCALENDAR'); return dong.join('\r\n');
}

/* ================= SAO LƯU ================= */
async function saoLuu() {
  const du = { phien_ban: 1, ung_dung: 'guangyu-quanly', xuat_luc: new Date().toISOString() };
  BANG.forEach(t => du[t] = S[t]);
  taiFile(JSON.stringify(du, null, 1), `sao-luu-guangyu-${homNay()}.json`, 'application/json');
  await luuCaiDat('lan_sao_luu', new Date().toISOString()); ve();
}
function xuatCSV() {
  const dongs = [['Mã buổi', 'Ngày', 'Giờ', 'Lớp', 'Mã lớp', 'Khoá', 'Trạng thái', 'Tính phí', 'Thời lượng', 'Doanh thu', 'Nội dung', 'Ghi chú']];
  S.buoi_hoc.slice().sort(soBuoi).forEach(b => { const L = lopTheoId(b.lop_id) || {}; const k = khoaTheoId(b.khoa_id) || {}; dongs.push([b.ma, b.ngay, b.gio_bat_dau || '', L.ten, L.ma, k.ma || '', TRANG_THAI[b.trang_thai].chu, tinhBuoi(b) ? 'x' : '', b.thoi_luong_phut, tinhBuoi(b) ? Math.round(doanhThuBuoi(b)) : 0, b.noi_dung || '', b.ghi_chu || '']); });
  const csv = '\ufeff' + dongs.map(r => r.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
  taiFile(csv, `buoi-hoc-guangyu-${homNay()}.csv`, 'text/csv');
}
async function apDungSaoLuu(du) {
  if (!du || du.ung_dung !== 'guangyu-quanly') throw new Error('File không phải bản sao lưu của web này');
  $('#man-cho').classList.add('hien'); $('#man-cho p').textContent = 'Đang ghi dữ liệu…';
  try {
    await DBX.replaceAll(du);
    await DBX.setCaiDat('ngay_dung_web', caiDat('ngay_dung_web', homNay()));
    await taiLai(); toast('Đã khôi phục dữ liệu ✓');
  } finally { $('#man-cho').classList.remove('hien'); }
}
async function khoiPhuc(file) {
  try {
    const du = JSON.parse(await file.text());
    if (!(await hoi(`Khôi phục từ <b>${esc(file.name)}</b>? Toàn bộ dữ liệu hiện tại sẽ được thay bằng dữ liệu trong file (${(du.lop || []).length} lớp, ${(du.buoi_hoc || []).length} buổi).`, 'Khôi phục', 'nguy'))) return;
    await apDungSaoLuu(du);
  } catch (e) { baoLoi(e); }
}
async function napExcel() {
  if (!(await hoi('Nạp dữ liệu Excel 2026 đã chuyển sẵn (27 lớp, 96 khoá, 989 buổi)? Dữ liệu hiện có trong web sẽ bị thay thế.', 'Nạp dữ liệu', 'nguy'))) return;
  try { const du = await (await fetch('data/du-lieu-excel-2026.json', { cache: 'no-store' })).json(); await apDungSaoLuu(du); location.hash = '#/lop'; } catch (e) { baoLoi(e); }
}

/* ================= KHỞI ĐỘNG ================= */
async function taiLai() {
  const d = await DBX.loadAll(); Object.assign(S, d); lamMoi(); ve();
}
function manHinhDau(loi) {
  const conn = JSON.parse(localStorage.getItem('gyq_ket_noi') || 'null');
  const che = localStorage.getItem('gyq_che_do');
  const o = $('#man-dau'); o.classList.add('hien');
  const dangNhap = che === 'supabase' && conn;
  o.innerHTML = `<div class="md-the">
    <img src="assets/logo.webp" alt="" class="md-logo"><p class="md-cn">光余汉语</p><h1>GUANGYU HANYU</h1><p class="md-phu">Sổ quản lý lớp học</p><div class="vach-vang"></div>
    ${loi ? `<p class="canh-bao">${esc(loi)}</p>` : ''}
    ${dangNhap ? `
      <form id="f-dang-nhap" class="form"><label>Email<input name="email" type="email" autocomplete="username" required></label>
        <label>Mật khẩu<input name="mk" type="password" autocomplete="current-password" required></label>
        <button class="nut chinh rong">Đăng nhập</button></form>
      <button class="nut-chu" id="doi-kn">Đổi kết nối Supabase</button>`
    : `
      <form id="f-ket-noi" class="form">
        <p class="mo nho">Dán 2 thông tin lấy từ Supabase (nút <b>Connect</b> trên đầu trang project, hoặc Settings → API Keys):</p>
        <label>Project URL<input name="url" placeholder="https://xxxx.supabase.co" value="${esc(conn ? conn.url : '')}" required autocapitalize="off" autocorrect="off"></label>
        <label>Publishable key<input name="key" placeholder="sb_publishable_…" value="${esc(conn ? conn.key : '')}" required autocapitalize="off" autocorrect="off"></label>
        <button class="nut chinh rong">Kết nối</button></form>
      <div class="hoac"><span>hoặc</span></div>
      <button class="nut rong" id="dung-thu">Dùng thử trên máy này (chưa cần Supabase)</button>`}
  </div>`;
  const fk = $('#f-ket-noi'); if (fk) fk.onsubmit = e => { e.preventDefault(); const f = docForm(fk); let url = f.url.trim().replace(/\/+$/, '').replace(/\/rest\/v1$/, ''); if (!/^https?:\/\//.test(url)) url = 'https://' + url; localStorage.setItem('gyq_ket_noi', JSON.stringify({ url, key: f.key.trim() })); localStorage.setItem('gyq_che_do', 'supabase'); location.reload(); };
  const dt = $('#dung-thu'); if (dt) dt.onclick = () => { localStorage.setItem('gyq_che_do', 'local'); location.reload(); };
  const dk = $('#doi-kn'); if (dk) dk.onclick = () => { localStorage.removeItem('gyq_che_do'); manHinhDau(); };
  const fd = $('#f-dang-nhap'); if (fd) fd.onsubmit = async e => {
    e.preventDefault(); const f = docForm(fd); const btn = $('button', fd); btn.disabled = true; btn.textContent = 'Đang đăng nhập…';
    try { await DBX.login(f.email, f.mk); o.classList.remove('hien'); await vaoApp(); } catch (er) { manHinhDau(er.message); }
  };
}
async function vaoApp() {
  $('#menu').innerHTML = MENU.map(([k, c, z]) => k === '-' ? `<p class="menu-nhom">${c}</p>` : `<a href="#/${k}" data-trang="${k}"><i class="mi">${ICON[k]}</i><span>${c}</span><small>${z}</small>${k === 'cong-viec' ? '<em id="dem-viec"></em>' : ''}</a>`).join('');
  $('#nav-duoi').innerHTML = NAV_DUOI.map(k => { const m = MENU.find(x => x[0] === k); return `<a href="#/${k}" data-trang="${k}"><i>${ICON[k]}</i><span>${m[1]}</span></a>`; }).join('') + `<button data-act="mo-menu"><i>${ICON.menu}</i><span>Thêm</span></button>`;
  $('#nut-giao-dien').innerHTML = `${ICON['giao-dien']}<span>Giao diện</span>`;
  $('#che-do').innerHTML = DBX.mode === 'supabase' ? '<i class="cham" style="--mau:#4F8A5B"></i>Đang lưu online' : '<i class="cham" style="--mau:#B08A3E"></i>Bản dùng thử (lưu trên máy)';
  $('#man-cho').classList.add('hien');
  try {
    await taiLai();
    if (!caiDat('ngay_dung_web', null)) await luuCaiDat('ngay_dung_web', homNay());
    if (!S.lop.length && !location.hash) location.hash = '#/cai-dat';
    if (DBX.thieuBang && DBX.thieuBang.length) toast('Có mục mới (Thói quen, Chi tiêu): Thầy chạy file SQL số 3 trên Supabase để dùng nhé', 'canh');
  } catch (e) { manHinhDau('Không tải được dữ liệu: ' + e.message + ' – Thầy kiểm tra đã chạy file SQL chưa nhé.'); }
  finally { $('#man-cho').classList.remove('hien'); }
  setInterval(() => { if (!$('.hop-nen') && document.visibilityState === 'visible' && !document.activeElement.matches('input,textarea,select')) ve(); }, 60000);
}
async function khoiDong() {
  const che = localStorage.getItem('gyq_che_do');
  const conn = JSON.parse(localStorage.getItem('gyq_ket_noi') || 'null');
  if (che === 'local') { DBX = LocalDB; await DBX.init(); return vaoApp(); }
  if (che === 'supabase' && conn) {
    DBX = SupaDB;
    try { const co = await DBX.init(conn); if (co) return vaoApp(); } catch (e) { return manHinhDau('Kết nối Supabase lỗi: ' + e.message); }
  }
  manHinhDau();
}
khoiDong();
