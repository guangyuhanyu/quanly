/* ĐẾM NGƯỢC tới các mốc quan trọng — hiện trên trang Hôm nay (bản 5.5)
   Mốc của Thầy: cai_dat 'moc' = [{ id, ten, ngay, gio, icon, hang_nam, ghim }]
   Mốc tự có: lễ Tết Việt Nam, 20/11, sinh nhật Thầy (từ lá số), ngày xong lộ trình HSK 7–9, hạn các quỹ tiết kiệm.
   Ẩn mốc tự có: cai_dat 'moc_an' = [khoá]. Không cần sửa Supabase. */

const TET_AM = { 2026: '2026-02-17', 2027: '2027-02-06', 2028: '2028-01-26', 2029: '2029-02-13', 2030: '2030-02-03', 2031: '2031-01-23', 2032: '2032-02-11' };
const TRUNG_THU = { 2026: '2026-09-25', 2027: '2027-09-15', 2028: '2028-10-03', 2029: '2029-09-22', 2030: '2030-09-12' };
const MOC_ICON = ['important', 'celebrate', 'event', 'travel', 'study', 'goals', 'selflove', 'mood', 'gratitude', 'memories', 'milestone', 'positive'];
const dsMoc = () => caiDat('moc', []) || [];
const mocAn = () => caiDat('moc_an', []) || [];

function lanToi(md, tu) {   // 'mm-dd' → lần gần nhất từ hôm nay trở đi
  const y = Number(tu.slice(0, 4)); const d = `${y}-${md}`; return d >= tu ? d : `${y + 1}-${md}`;
}
function cacMoc() {
  const hn = homNay(), y = Number(hn.slice(0, 4)), ds = [];
  const them = (khoa, ten, ngay, icon, zh, nguon = 'he_thong') => { if (ngay && ngay >= hn) ds.push({ khoa, ten, ngay, icon, zh, nguon }); };
  const tet = [y, y + 1].map(n => TET_AM[n]).find(d => d && d >= hn); them('tet', 'Tết Nguyên đán', tet, 'event', '春节');
  them('tet_duong', 'Tết Dương lịch', lanToi('01-01', hn), 'celebrate', '元旦');
  them('20_11', 'Ngày Nhà giáo Việt Nam', lanToi('11-20', hn), 'study', '教师节');
  them('8_3', 'Quốc tế Phụ nữ', lanToi('03-08', hn), 'selflove', '妇女节');
  them('30_4', 'Lễ 30/4 – 1/5', lanToi('04-30', hn), 'travel', '五一');
  them('2_9', 'Quốc khánh 2/9', lanToi('09-02', hn), 'positive', '国庆');
  them('giang_sinh', 'Giáng sinh', lanToi('12-25', hn), 'celebrate', '圣诞');
  const tt = [y, y + 1].map(n => TRUNG_THU[n]).find(d => d && d >= hn); them('trung_thu', 'Tết Trung thu', tt, 'mood', '中秋');
  const ls = caiDat('la_so_goc', null); if (ls && ls.ngay) them('sinh_nhat', 'Sinh nhật Thầy', lanToi(ls.ngay.slice(5), hn), 'celebrate', '生日');
  try { const s = caiDat('lo_trinh_hsk79', null); if (s && s.start) them('hsk79', 'Xong lộ trình ôn HSK 7–9', congNgay(dauTuan(s.start), 35 * 7 - 1), 'study', '考试'); } catch (e) { }
  try { dsQuy().filter(q => q.han && q.dich && soDuQuy(q) < q.dich).forEach(q => them('quy_' + q.id, `Hạn ${q.ten}`, q.han, 'goals', '存钱')); } catch (e) { }
  try { mfMocThu().forEach(m => ds.push(m)); } catch (e) { }
  const an = mocAn(); const kq = ds.filter(m => !an.includes(m.khoa));
  dsMoc().forEach(m => { const ngay = m.hang_nam ? lanToi(m.ngay.slice(5), hn) : m.ngay; if (ngay >= hn) kq.push({ khoa: m.id, ten: m.ten, ngay, gio: m.gio, icon: m.icon || 'important', ghim: m.ghim, nguon: 'thay', id: m.id }); });
  return kq.sort((a, b) => (b.ghim ? 1 : 0) - (a.ghim ? 1 : 0) || (a.ngay + (a.gio || '')).localeCompare(b.ngay + (b.gio || '')));
}
const mocIcon = (i, co = '') => `<img class="ic ic-anh ${co}" src="assets/icons/${i}.webp?v=5.8" alt="">`;
function conLai(m) {
  const dich = new Date(`${m.ngay}T${m.gio || '00:00'}:00+07:00`).getTime(), ms = Math.max(0, dich - Date.now());
  return { ms, ngay: Math.floor(ms / 864e5), gio: Math.floor(ms / 36e5) % 24, phut: Math.floor(ms / 6e4) % 60, giay: Math.floor(ms / 1e3) % 60 };
}
const p2 = n => String(n).padStart(2, '0');
function mocDangChon() {
  const ds = cacMoc(), k = caiDat('moc_chon', null);
  return ds.find(m => m.khoa === k) || ds.find(m => m.ghim) || ds[0] || null;
}
function theDemNguoc() {
  const m = mocDangChon(), t = thanhNguNgay();
  const n = m ? stSoNgay(homNay(), m.ngay) : 0;
  return `<section class="dn">
    <button class="dn-o the-giay" data-act="dn-chon" title="Bấm để chọn mốc khác">
      ${m ? `${mocIcon(m.icon, 'dn-ic')}<span class="dn-so-ngay">${m.ngay === homNay() ? '🎉' : n}</span><span class="dn-chu"><small>${m.ngay === homNay() ? 'Chính là hôm nay' : 'ngày nữa'}</small><b>${esc(m.ten)}</b><em>${ngayVN(m.ngay)}</em></span>`
        : `<span class="dn-so-ngay">＋</span><b>Chọn mốc đếm ngược</b>`}
    </button>
    <div class="tn the-giay">
      <div class="tn-dau"><small>成语 · Thành ngữ hôm nay</small><button class="nut-chu" data-act="tn-doi" title="Câu khác">↻</button></div>
      <div class="tn-than"><b class="tn-zh">${t.zh}</b><div><p class="tn-py">${t.py}</p><p class="tn-vi">${t.vi}</p></div></div>
      <p class="tn-vd">${t.vd}<small>${t.dich}</small></p>
    </div>
  </section>`;
}
function moChonMoc() {
  const ds = cacMoc(), chon = (mocDangChon() || {}).khoa;
  const { nen, dong } = moHop({
    tieuDe: '⏳ Đếm ngược đến mốc nào?', rong: true,
    noiDung: `<div class="dn-ds">${ds.map(m => `<button class="dn-chon-dong ${m.khoa === chon ? 'on' : ''}" data-k="${m.khoa}">${mocIcon(m.icon)}<span><b>${esc(m.ten)}</b><small>${ngayVN(m.ngay)}${m.nguon === 'thay' ? ' · mốc của Thầy' : ''}</small></span><em>${stSoNgay(homNay(), m.ngay)} ngày</em>${m.nguon === 'thay' ? `<i data-sua="${m.id}" title="Sửa">✎</i>` : ''}</button>`).join('')}</div>`,
    nut: [{ chu: '+ Thêm mốc của Thầy', trai: true, bam: () => { setTimeout(() => moMoc(null), 50); } }, { chu: 'Ẩn bớt mốc có sẵn', bam: () => { setTimeout(moQuanLyMoc, 50); } }, { chu: 'Xong', kieu: 'chinh', bam: () => { } }],
  });
  nen.querySelector('.dn-ds').addEventListener('click', async e => {
    const s = e.target.closest('[data-sua]'); if (s) { e.stopPropagation(); dong(); moMoc(s.dataset.sua); return; }
    const b = e.target.closest('[data-k]'); if (!b) return; await luuCaiDat('moc_chon', b.dataset.k); dong(); ve();
  });
}
function moMoc(id) {
  const m = id ? dsMoc().find(x => x.id === id) : { icon: 'important', hang_nam: false, ghim: false };
  moHop({
    tieuDe: id ? 'Sửa mốc' : 'Thêm mốc đếm ngược',
    noiDung: `<div class="form luoi-form">
      <label class="ca-dong">Tên mốc<input name="ten" value="${esc(m.ten || '')}" placeholder="VD: Thi HSK 7, Về quê ăn Tết, Kỷ niệm 5 năm dạy học…" required></label>
      <label>Ngày<input type="date" name="ngay" value="${esc(m.ngay || '')}" required></label>
      <label>Giờ <small class="mo">(không bắt buộc)</small><input type="time" name="gio" value="${esc(m.gio || '')}"></label>
      <label class="st-chk"><input type="checkbox" name="hang_nam" ${m.hang_nam ? 'checked' : ''}> Lặp lại hằng năm</label>
      <label class="st-chk"><input type="checkbox" name="ghim" ${m.ghim ? 'checked' : ''}> 📌 Ghim lên đầu (đếm từng giây)</label>
      <div class="ca-dong"><span class="nhan">Biểu tượng</span><div class="chon-icon">${MOC_ICON.map(k => `<label><input type="radio" name="icon" value="${k}" ${m.icon === k ? 'checked' : ''}><span>${mocIcon(k)}</span></label>`).join('')}</div></div>
    </div>`,
    nut: [
      ...(id ? [{ chu: 'Xoá', kieu: 'nguy', trai: true, bam: async () => { await luuCaiDat('moc', dsMoc().filter(x => x.id !== id)); ve(); } }] : []),
      { chu: 'Huỷ', bam: () => { } },
      { chu: 'Lưu', kieu: 'chinh', bam: async n => {
        const f = docForm(n); if (!f.ten || !f.ngay) return false;
        const ghim = !!n.querySelector('[name=ghim]').checked;
        const moi = { id: id || 'moc' + Date.now(), ten: f.ten, ngay: f.ngay, gio: f.gio || '', icon: f.icon || 'important', hang_nam: !!n.querySelector('[name=hang_nam]').checked, ghim };
        await luuCaiDat('moc', [...dsMoc().filter(x => x.id !== moi.id).map(x => ghim ? { ...x, ghim: false } : x), moi]); if (!id) await luuCaiDat('moc_chon', moi.id); ve();
      } }],
  });
}
function moQuanLyMoc() {
  const veDs = n => {
    const an = mocAn(), heThong = cacMocHeThong();
    n.querySelector('.dn-ql').innerHTML = `<h4>Mốc của Thầy</h4>${dsMoc().length ? dsMoc().map(m => `<div class="sm-dong"><label>${mocIcon(m.icon)}${esc(m.ten)} <small class="mo">${ngayVN(m.ngay)}${m.hang_nam ? ' · hằng năm' : ''}${m.ghim ? ' · 📌' : ''}</small></label><span><button type="button" data-sua="${m.id}">✎</button></span></div>`).join('') : '<p class="mo nho">Chưa có mốc riêng.</p>'}
      <h4>Mốc có sẵn <small class="mo">(bỏ tick để ẩn)</small></h4>${heThong.map(m => `<div class="sm-dong ${an.includes(m.khoa) ? 'tat' : ''}"><label><input type="checkbox" data-an="${m.khoa}" ${an.includes(m.khoa) ? '' : 'checked'}>${mocIcon(m.icon)}${esc(m.ten)} <small class="mo">${ngayVN(m.ngay)}</small></label></div>`).join('')}`;
  };
  moHop({
    tieuDe: '⏳ Mốc đếm ngược', rong: true,
    noiDung: `<div class="dn-ql"></div>`,
    nut: [{ chu: `+ Thêm mốc`, trai: true, bam: () => { setTimeout(() => moMoc(null), 50); } }, { chu: 'Xong', kieu: 'chinh', bam: () => { ve(); } }],
    khiMo: n => {
      veDs(n);
      n.addEventListener('change', async e => { const k = e.target.dataset.an; if (!k) return; const an = new Set(mocAn()); e.target.checked ? an.delete(k) : an.add(k); await luuCaiDat('moc_an', [...an]); veDs(n); });
      n.addEventListener('click', e => { const s = e.target.closest('[data-sua]'); if (s) { n.querySelector('[data-dong]').click(); moMoc(s.dataset.sua); } });
    },
  });
}
function cacMocHeThong() { const an = mocAn(); const luu = caiDat('moc_an', []); return (() => { const tam = [...an]; try { S.cai_dat.find(r => r.khoa === 'moc_an') && (S.cai_dat.find(r => r.khoa === 'moc_an').gia_tri = []); return cacMoc().filter(m => m.nguon === 'he_thong'); } finally { const r = S.cai_dat.find(r => r.khoa === 'moc_an'); if (r) r.gia_tri = tam; } })(); }

const HD_DN = {
  'dn-chon': () => moChonMoc(),
  'tn-doi': () => { TN.lech++; ve(); },
  'dn-quan-ly': () => moQuanLyMoc(),
  'dn-sua': el => moMoc(el.dataset.id),
};
