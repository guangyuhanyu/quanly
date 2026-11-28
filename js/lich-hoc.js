/* NGÀY OFF + LỊCH HỌC CỦA LỚP (bản 5.8)
   cai_dat 'ngay_off' = [{ id, tu, den, ten }]
   cai_dat 'lich_lop' = { [lopId]: { kieu: 'co_dinh' | 'linh_hoat', slots: [{ thu: 0-6 (0 = CN), gio: '19:00', phut: 90 }] } } */

/* ====================== NGÀY OFF ====================== */
const dsOff = () => caiDat('ngay_off', []) || [];
const ngayOff = ymd => dsOff().find(o => ymd >= o.tu && ymd <= (o.den || o.tu)) || null;
function goiYLe(nam) {
  const tim = (thang, ngay, tu) => { for (let i = 0; i < 70; i++) { const d = congNgay(tu, i); const a = AL.cua(d); if (a.thang === thang && a.ngay === ngay && !a.nhuan) return d; } return null; };
  const tet = tim(1, 1, `${nam}-01-15`), gio = tim(3, 10, `${nam}-03-10`);
  return [
    { ten: 'Tết Dương lịch', tu: `${nam}-01-01`, den: `${nam}-01-01` },
    ...(tet ? [{ ten: 'Tết Nguyên đán', tu: congNgay(tet, -1), den: congNgay(tet, 4) }] : []),
    ...(gio ? [{ ten: 'Giỗ Tổ Hùng Vương', tu: gio, den: gio }] : []),
    { ten: '30/4 – 1/5', tu: `${nam}-04-30`, den: `${nam}-05-01` },
    { ten: 'Quốc khánh', tu: `${nam}-09-02`, den: `${nam}-09-02` },
  ].filter(x => (x.den || x.tu) >= homNay());
}
function chuOff(o) { return o.den && o.den !== o.tu ? `${ngayNgan(o.tu)} – ${ngayVN(o.den)}` : `${THU_NGAN[s2d(o.tu).getDay()]} ${ngayVN(o.tu)}`; }

function moNgayOff(ngay) {
  const hn = homNay(), nam = Number(hn.slice(0, 4));
  const goiY = [...goiYLe(nam), ...goiYLe(nam + 1)].filter(g => !dsOff().some(o => o.tu === g.tu)).slice(0, 6);
  const sap = dsOff().slice().sort((a, b) => a.tu.localeCompare(b.tu)), toi = sap.filter(o => (o.den || o.tu) >= hn), cu = sap.filter(o => (o.den || o.tu) < hn).reverse().slice(0, 5);
  const { nen } = moHop({
    tieuDe: '🏮 Ngày off · ngày lễ', rong: true,
    noiDung: `<div class="form luoi-form">
      <label class="ca-dong">Tên dịp<input name="ten" placeholder="VD: Tết Nguyên đán, về quê, đi du lịch…"></label>
      <label>Từ ngày<input type="date" name="tu" value="${ngay || hn}" required></label>
      <label>Đến ngày <small class="mo">(nghỉ 1 ngày thì để trống)</small><input type="date" name="den"></label>
      ${goiY.length ? `<div class="ca-dong off-goi-y"><small class="mo">Gợi ý ngày lễ:</small>${goiY.map(g => `<button type="button" class="nut nho" data-ten="${esc(g.ten)}" data-tu="${g.tu}" data-den="${g.den}">${esc(g.ten)} · ${g.tu === g.den ? ngayNgan(g.tu) : ngayNgan(g.tu) + '–' + ngayNgan(g.den)}</button>`).join('')}</div>` : ''}
      <div class="ca-dong off-ds">${toi.length ? `<h4>Ngày off sắp tới</h4>${toi.map(o => `<div class="off-dong"><span>🏮 <b>${esc(o.ten || 'Nghỉ')}</b><small>${chuOff(o)}</small></span><button type="button" class="nut-x" data-xoa-off="${o.id}" title="Bỏ ngày off">×</button></div>`).join('')}` : '<p class="mo nho">Chưa có ngày off nào sắp tới.</p>'}
        ${cu.length ? `<details><summary class="mo nho">Đã qua (${cu.length})</summary>${cu.map(o => `<div class="off-dong cu"><span><b>${esc(o.ten || 'Nghỉ')}</b><small>${chuOff(o)}</small></span><button type="button" class="nut-x" data-xoa-off="${o.id}">×</button></div>`).join('')}</details>` : ''}</div>
    </div>`,
    khiMo: n => {
      n.querySelectorAll('[data-tu]').forEach(b => { if (b.tagName !== 'BUTTON') return; b.onclick = () => { n.querySelector('[name=ten]').value = b.dataset.ten; n.querySelector('[name=tu]').value = b.dataset.tu; n.querySelector('[name=den]').value = b.dataset.den !== b.dataset.tu ? b.dataset.den : ''; }; });
      n.querySelectorAll('[data-xoa-off]').forEach(b => b.onclick = async () => { await luuCaiDat('ngay_off', dsOff().filter(o => o.id !== b.dataset.xoaOff)); b.closest('.off-dong').remove(); toast('Đã bỏ ngày off. Các buổi đã chuyển sang Nghỉ vẫn giữ nguyên.'); ve(); });
    },
    nut: [{ chu: 'Đóng', bam: () => { } }, { chu: 'Set off', kieu: 'chinh', bam: async n => {
      const f = docForm(n); if (!f.tu) { toast('Thầy chọn ngày giúp em', 'loi'); return false; }
      const den = f.den && f.den > f.tu ? f.den : f.tu;
      const o = { id: 'off' + Date.now(), tu: f.tu, den, ten: f.ten || 'Nghỉ' };
      await luuCaiDat('ngay_off', [...dsOff(), o]);
      const bs = S.buoi_hoc.filter(b => b.ngay >= o.tu && b.ngay <= den && b.trang_thai === 'du_kien').sort(soBuoi);
      if (bs.length) setTimeout(() => moXuLyBuoiOff(o, bs), 80); else { toast(`Đã set off ${chuOff(o)} ✓`); ve(); }
    } }],
  });
}
/* hỏi từng lần: mỗi buổi rơi vào ngày off chọn Nghỉ + bù / Chỉ nghỉ / Vẫn dạy */
function moXuLyBuoiOff(o, bs) {
  const goiYBu = {}; const daDung = [];
  bs.forEach(b => { const n = ngayBu(b, daDung); goiYBu[b.id] = n; if (n) daDung.push({ lop: b.lop_id, ngay: n.ngay, gio: n.gio }); });
  moHop({
    tieuDe: `${bs.length} buổi rơi vào ngày off`, rong: true,
    noiDung: `<p class="mo">🏮 <b>${esc(o.ten)}</b> · ${chuOff(o)}. Thầy chọn cách xử lý từng buổi:</p>
      <div class="off-buoi">${bs.map(b => { const L = lopTheoId(b.lop_id), g = goiYBu[b.id]; return `<div class="off-buoi-dong">
        <div><b>${chamMau(L)}${esc(L ? L.ten : '')}</b><small>${THU_NGAN[s2d(b.ngay).getDay()]} ${ngayVN(b.ngay)} · ${b.gio_bat_dau || 'chưa giờ'}</small></div>
        <select name="xl_${b.id}"><option value="bu">Nghỉ + đặt bù${g ? ` ${THU_NGAN[s2d(g.ngay).getDay()]} ${ngayNgan(g.ngay)} ${g.gio || ''}` : ''}</option><option value="nghi">Chỉ nghỉ</option><option value="giu">Vẫn dạy</option></select></div>`; }).join('')}</div>
      <p class="mo nho">Buổi nghỉ không trừ buổi, không tính phí. Buổi bù được xếp sau buổi cuối của lớp, cùng thứ cùng giờ (theo lịch cố định nếu lớp có), né các ngày off.</p>`,
    nut: [{ chu: 'Để sau', bam: () => { ve(); } }, { chu: 'Áp dụng', kieu: 'chinh', bam: async n => {
      const f = docForm(n); let soNghi = 0, soBu = 0;
      for (const b of bs) {
        const x = f['xl_' + b.id]; if (x === 'giu') continue;
        await luu('buoi_hoc', { trang_thai: 'nghi', ghi_chu: `Nghỉ: ${o.ten}${b.ghi_chu ? ' · ' + b.ghi_chu : ''}` }, b.id); soNghi++;
        if (x === 'bu' && goiYBu[b.id]) { const g = goiYBu[b.id]; await luu('buoi_hoc', { lop_id: b.lop_id, khoa_id: b.khoa_id, ngay: g.ngay, gio_bat_dau: g.gio, thoi_luong_phut: g.phut || b.thoi_luong_phut, trang_thai: 'du_kien', tinh_phi: true, ghi_chu: `Bù buổi ${ngayNgan(b.ngay)} (${o.ten})` }); soBu++; }
      }
      toast(`Đã set off ✓ · ${soNghi} buổi nghỉ${soBu ? `, ${soBu} buổi bù` : ''}`); ve();
    } }],
  });
}
/* tìm ngày bù cho buổi b: sau buổi cuối của lớp */
function ngayBu(b, daDung = []) {
  const ll = lichLop(b.lop_id);
  const cuoi = [...S.buoi_hoc.filter(x => x.lop_id === b.lop_id && x.trang_thai !== 'huy' && x.trang_thai !== 'nghi' && x.id !== b.id).map(x => x.ngay), ...daDung.filter(d => d.lop === b.lop_id).map(d => d.ngay), b.ngay].sort().pop();
  if (ll.kieu === 'co_dinh' && ll.slots.length) { const r = sinhNgay(ll.slots, congNgay(cuoi, 1), 1, b.lop_id); return r[0] || null; }
  let n = congNgay(cuoi, 7); const thu = s2d(b.ngay).getDay();
  while (s2d(n).getDay() !== thu) n = congNgay(n, 1);
  for (let i = 0; i < 20 && ngayOff(n); i++) n = congNgay(n, 7);
  return { ngay: n, gio: b.gio_bat_dau, phut: b.thoi_luong_phut };
}

/* ====================== LỊCH HỌC CỦA LỚP ====================== */
const THU_TEN = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
const lichLop = id => ((caiDat('lich_lop', {}) || {})[id]) || { kieu: 'linh_hoat', slots: [] };
async function luuLichLop(id, v) { await luuCaiDat('lich_lop', { ...(caiDat('lich_lop', {}) || {}), [id]: v }); }
function chuLichLop(ll) {
  if (ll.kieu !== 'co_dinh' || !ll.slots.length) return 'Lịch linh hoạt';
  return ll.slots.slice().sort((a, b) => ((a.thu || 7) - (b.thu || 7))).map(s => `${THU_TEN[s.thu]} ${s.gio || ''}`).join(' · ');
}
/* sinh n buổi theo slots từ ngày tu, né ngày off và những ngày lớp đã có buổi */
function sinhNgay(slots, tu, n, lopId, boQuaIds = []) {
  const kq = [], co = new Set(S.buoi_hoc.filter(b => b.lop_id === lopId && b.trang_thai !== 'huy' && !boQuaIds.includes(b.id)).map(b => b.ngay + ' ' + (b.gio_bat_dau || '')));
  const sx = slots.slice().sort((a, b) => (a.gio || '').localeCompare(b.gio || ''));
  for (let i = 0; kq.length < n && i < 800; i++) {
    const d = congNgay(tu, i), thu = s2d(d).getDay(); if (ngayOff(d)) continue;
    for (const s of sx) if (s.thu === thu && kq.length < n && !co.has(d + ' ' + (s.gio || ''))) kq.push({ ngay: d, gio: s.gio || '', phut: s.phut || 90 });
  }
  return kq;
}
function soCanXep(lopId) {
  const k = khoaHienTai(lopId); if (!k) return { k: null, can: 0 };
  const t = tk(k); return { k, t, can: Math.max(0, Math.ceil(t.conLai) - t.duKien.length) };
}
function theLichLop(L) {
  const ll = lichLop(L.id), { k, t, can } = soCanXep(L.id), hn = homNay();
  const sapToi = S.buoi_hoc.filter(b => b.lop_id === L.id && b.trang_thai === 'du_kien' && b.ngay >= hn).sort(soBuoi);
  const offToi = dsOff().filter(o => (o.den || o.tu) >= hn).slice(0, 2);
  return `<section class="the-giay lich-lop">
    <div class="dau-muc"><h2 class="co-icon">${ICON.lich}Lịch học</h2><span class="the ${ll.kieu === 'co_dinh' ? 'xanh' : ''}">${ll.kieu === 'co_dinh' ? 'Cố định' : 'Linh hoạt'}</span></div>
    <p class="ll-chu">${ll.kieu === 'co_dinh' && ll.slots.length ? ll.slots.slice().sort((a, b) => ((a.thu || 7) - (b.thu || 7))).map(s => `<span class="ll-slot"><b>${THU_TEN[s.thu]}</b> ${s.gio || '—'} <small>${thoiLuongChu(s.phut || 90)}</small></span>`).join('') : '<span class="mo">Chưa có lịch cố định. Lớp học giờ thay đổi thì bấm "Chọn lại lịch" để xếp từng buổi.</span>'}</p>
    <p class="mo nho">${k ? `Khoá ${k.ma}: còn ${luongChu(t, t.conLai)} chưa dạy${t.theoGio ? ` (≈ ${Math.max(0, Math.ceil(t.conLai))} buổi ${thoiLuongChu(t.tl)})` : ''} · đã xếp ${t.duKien.length}${can ? ` · <b class="chu-cam">còn ${can} buổi chưa có ngày</b>` : ' ✓'}` : 'Lớp chưa có khoá học.'}${sapToi.length ? ` · buổi tới: ${THU_NGAN[s2d(sapToi[0].ngay).getDay()]} ${ngayNgan(sapToi[0].ngay)} ${sapToi[0].gio_bat_dau || ''}` : ''}${offToi.length ? ` · 🏮 off: ${offToi.map(o => esc(o.ten) + ' ' + ngayNgan(o.tu)).join(', ')}` : ''}</p>
    <div class="nhom-nut trai">
      <button class="nut ${ll.kieu === 'co_dinh' ? '' : 'chinh'}" data-act="ll-chon-lai" data-lop="${L.id}">✎ Chọn lại lịch</button>
      <button class="nut ${ll.kieu === 'co_dinh' ? 'chinh' : ''}" data-act="ll-co-dinh" data-lop="${L.id}">${ll.kieu === 'co_dinh' ? '↻ Đổi lịch cố định' : '＋ Đặt lịch cố định'}</button>
      ${ll.kieu === 'co_dinh' && can ? `<button class="nut" data-act="ll-xep" data-lop="${L.id}">Xếp ${can} buổi còn lại</button>` : ''}
    </div>
  </section>`;
}

/* --- lịch cố định: chọn thứ + giờ, xếp tự động --- */
function moLichCoDinh(lopId, chiXep) {
  const L = lopTheoId(lopId), ll = lichLop(lopId), k = khoaHienTai(lopId), hn = homNay();
  const truoc = S.buoi_hoc.filter(b => b.lop_id === lopId && b.gio_bat_dau).sort(soBuoi).pop();
  const phutMD = (k && k.thoi_luong_phut) || (truoc && truoc.thoi_luong_phut) || 90;
  const slot = t => ll.slots.find(s => s.thu === t);
  const thuTu = [1, 2, 3, 4, 5, 6, 0];
  const coDuKien = S.buoi_hoc.some(b => b.lop_id === lopId && b.trang_thai === 'du_kien' && b.ngay > hn);
  const { nen } = moHop({
    tieuDe: `Lịch cố định · ${esc(L.ten)}`, rong: true,
    noiDung: `<div class="form">
      <div class="ll-thu">${thuTu.map(t => { const s = slot(t); return `<label class="ll-thu-dong ${s ? 'on' : ''}"><input type="checkbox" name="c${t}" ${s ? 'checked' : ''}><b>${THU_TEN[t]}</b>
        <input type="time" name="g${t}" value="${s ? s.gio : (truoc ? truoc.gio_bat_dau : '19:00')}" step="300"><input type="number" name="p${t}" value="${s ? s.phut : phutMD}" min="15" step="15"><small>phút</small></label>`; }).join('')}</div>
      <label>Áp dụng từ ngày<input type="date" name="tu" value="${congNgay(hn, 1)}"></label>
      ${coDuKien ? `<label class="st-chk"><input type="checkbox" name="xep_lai" ${chiXep ? '' : 'checked'}> Xếp lại các buổi dự kiến từ ngày này theo lịch mới</label>` : ''}
      <label class="st-chk"><input type="checkbox" name="them" checked> Xếp đủ số buổi còn lại của khoá${k ? ` ${k.ma}` : ''}</label>
      <div class="ll-xem" id="ll-xem"></div>
    </div>`,
    khiMo: n => {
      const cap = () => {
        n.querySelectorAll('.ll-thu-dong').forEach(r => r.classList.toggle('on', r.querySelector('[type=checkbox]').checked));
        const p = tinhKeHoach(n); const box = n.querySelector('#ll-xem');
        if (!p) { box.innerHTML = '<p class="mo nho">Thầy tick ít nhất 1 thứ trong tuần.</p>'; return; }
        box.innerHTML = `<p class="mo nho">${p.xoa.length ? `Bỏ ${p.xoa.length} buổi dự kiến cũ · ` : ''}${p.moi.length ? `Sẽ xếp <b>${p.moi.length}</b> buổi:` : 'Không cần xếp thêm buổi nào.'}</p>
          ${p.moi.length ? `<div class="ll-chip">${p.moi.map(x => `<span>${THU_NGAN[s2d(x.ngay).getDay()]} ${ngayNgan(x.ngay)} · ${x.gio}</span>`).join('')}</div>` : ''}
          ${p.boOff.length ? `<p class="mo nho">🏮 Né ngày off: ${p.boOff.map(d => ngayNgan(d)).join(', ')}</p>` : ''}
          ${p.trung.length ? `<p class="canh-bao">Trùng giờ lớp khác: ${p.trung.map(x => `${ngayNgan(x.ngay)} ${x.gio} (${esc(x.lop)})`).join(', ')}</p>` : ''}`;
      };
      n.addEventListener('input', cap); n.addEventListener('change', cap); cap();
    },
    nut: [{ chu: 'Huỷ', bam: () => { } }, { chu: 'Lưu & xếp lịch', kieu: 'chinh', bam: async n => {
      const p = tinhKeHoach(n); if (!p) { toast('Thầy chọn ít nhất 1 thứ', 'loi'); return false; }
      await luuLichLop(lopId, { kieu: 'co_dinh', slots: p.slots });
      for (const b of p.xoa) await xoa('buoi_hoc', b.id);
      const kk = khoaHienTai(lopId);
      for (const x of p.moi) await luu('buoi_hoc', { lop_id: lopId, khoa_id: kk ? kk.id : null, ngay: x.ngay, gio_bat_dau: x.gio, thoi_luong_phut: x.phut, trang_thai: 'du_kien', tinh_phi: true });
      toast(`Đã lưu lịch cố định ✓${p.moi.length ? ` · xếp ${p.moi.length} buổi` : ''}`); ve();
    } }],
  });
  function tinhKeHoach(n) {
    const f = docForm(n), slots = thuTu.filter(t => f['c' + t]).map(t => ({ thu: t, gio: f['g' + t] || '', phut: Number(f['p' + t]) || 90 }));
    if (!slots.length) return null;
    const tu = f.tu || congNgay(hn, 1);
    const xoa = f.xep_lai ? S.buoi_hoc.filter(b => b.lop_id === lopId && b.trang_thai === 'du_kien' && b.ngay >= tu) : [];
    const kk = khoaHienTai(lopId), t = kk ? tk(kk) : null;
    const conDuKien = t ? t.duKien.filter(b => !xoa.includes(b)).length : 0;
    let soMoi = f.them ? Math.max(0, (t ? Math.ceil(t.conLai) : 0) - conDuKien) : xoa.length;
    if (!kk && f.them) soMoi = xoa.length;
    const moi = sinhNgay(slots, tu, soMoi, lopId, xoa.map(b => b.id));
    const cuoi = moi.length ? moi[moi.length - 1].ngay : tu;
    const boOff = []; for (let d = tu; d <= cuoi; d = congNgay(d, 1)) if (ngayOff(d) && slots.some(s => s.thu === s2d(d).getDay())) boOff.push(d);
    const trung = moi.filter(x => trungLich({ ngay: x.ngay, gio_bat_dau: x.gio, thoi_luong_phut: x.phut }, null).some(b => b.lop_id !== lopId)).map(x => ({ ...x, lop: trungLich({ ngay: x.ngay, gio_bat_dau: x.gio, thoi_luong_phut: x.phut }, null).filter(b => b.lop_id !== lopId).map(b => (lopTheoId(b.lop_id) || {}).ten).join(', ') }));
    return { slots, xoa, moi, boOff, trung };
  }
}

/* --- chọn lại lịch từng buổi (lớp không cố định) --- */
function moChonLaiLich(lopId) {
  const L = lopTheoId(lopId), hn = homNay(), { k, t } = soCanXep(lopId);
  const cu = S.buoi_hoc.filter(b => b.lop_id === lopId && b.trang_thai === 'du_kien' && b.ngay >= hn).sort(soBuoi);
  const truoc = S.buoi_hoc.filter(b => b.lop_id === lopId && b.gio_bat_dau).sort(soBuoi).pop();
  const phutMD = (k && k.thoi_luong_phut) || 90;
  const dong = (b, i) => `<div class="cl-dong" data-id="${b.id || ''}">
      <span class="cl-so">${i + 1}</span><input type="date" value="${b.ngay}" class="cl-ngay"><input type="time" value="${b.gio_bat_dau || ''}" step="300" class="cl-gio"><input type="number" value="${b.thoi_luong_phut || phutMD}" min="15" step="15" class="cl-phut"><small class="cl-thu"></small><button type="button" class="nut-x" data-bo title="Bỏ buổi này">×</button></div>`;
  const { nen } = moHop({
    tieuDe: `Chọn lại lịch · ${esc(L.ten)}`, rong: true,
    noiDung: `<p class="mo nho">${k ? `Khoá ${k.ma} còn <b>${luongChu(t, t.conLai)}</b> chưa dạy. ` : ''}Sửa ngày, giờ từng buổi sắp tới; thêm hoặc bỏ buổi. Buổi đã dạy không bị ảnh hưởng.</p>
      <div class="cl-ds" id="cl-ds">${cu.map(dong).join('')}</div>
      <div class="nhom-nut trai"><button type="button" class="nut nho" id="cl-them">＋ Thêm buổi</button>${k && t.conLai > cu.length ? `<button type="button" class="nut nho" id="cl-du">＋ Thêm cho đủ ${Math.ceil(t.conLai)} buổi</button>` : ''}</div>
      <p class="mo nho" id="cl-tom"></p>`,
    khiMo: n => {
      const ds = n.querySelector('#cl-ds');
      const capSo = () => { const r = [...ds.querySelectorAll('.cl-dong')]; r.forEach((d, i) => { d.querySelector('.cl-so').textContent = i + 1; const v = d.querySelector('.cl-ngay').value; const o = v && ngayOff(v); d.querySelector('.cl-thu').innerHTML = v ? `${THU_NGAN[s2d(v).getDay()]}${o ? ` · <b class="chu-do">🏮 ${esc(o.ten)}</b>` : ''}` : ''; }); n.querySelector('#cl-tom').textContent = `Đang xếp ${r.length} buổi${k ? ` / còn ${t.conLai} buổi của khoá` : ''}.`; };
      const themMot = () => {
        const r = [...ds.querySelectorAll('.cl-dong')], cuoi = r.length ? r[r.length - 1] : null;
        let ng = cuoi ? congNgay(cuoi.querySelector('.cl-ngay').value || hn, 7) : congNgay(hn, 1);
        for (let i = 0; i < 20 && ngayOff(ng); i++) ng = congNgay(ng, 7);
        ds.insertAdjacentHTML('beforeend', dong({ ngay: ng, gio_bat_dau: cuoi ? cuoi.querySelector('.cl-gio').value : (truoc ? truoc.gio_bat_dau : ''), thoi_luong_phut: cuoi ? cuoi.querySelector('.cl-phut').value : phutMD }, r.length));
        capSo();
      };
      n.querySelector('#cl-them').onclick = themMot;
      const du = n.querySelector('#cl-du'); if (du) du.onclick = () => { while (ds.querySelectorAll('.cl-dong').length < t.conLai) themMot(); du.remove(); };
      ds.addEventListener('click', e => { if (e.target.closest('[data-bo]')) { e.target.closest('.cl-dong').remove(); capSo(); } });
      ds.addEventListener('input', capSo); capSo();
    },
    nut: [{ chu: 'Huỷ', bam: () => { } }, { chu: 'Lưu lịch', kieu: 'chinh', bam: async n => {
      const r = [...n.querySelectorAll('.cl-dong')].map(d => ({ id: Number(d.dataset.id) || null, ngay: d.querySelector('.cl-ngay').value, gio: d.querySelector('.cl-gio').value, phut: Number(d.querySelector('.cl-phut').value) || phutMD }));
      if (r.some(x => !x.ngay)) { toast('Còn buổi chưa chọn ngày', 'loi'); return false; }
      const off = r.filter(x => ngayOff(x.ngay));
      if (off.length && !(await hoi(`${off.length} buổi rơi vào ngày off (${off.map(x => ngayNgan(x.ngay)).join(', ')}). Vẫn lưu?`, 'Vẫn lưu'))) return false;
      const giu = new Set(r.map(x => x.id).filter(Boolean)); let doi = 0;
      for (const b of cu) if (!giu.has(b.id)) { await xoa('buoi_hoc', b.id); doi++; }
      const kk = khoaHienTai(lopId);
      for (const x of r) {
        if (x.id) { const b = cu.find(y => y.id === x.id); if (b.ngay !== x.ngay || (b.gio_bat_dau || '') !== x.gio || b.thoi_luong_phut !== x.phut) { await luu('buoi_hoc', { ngay: x.ngay, gio_bat_dau: x.gio, thoi_luong_phut: x.phut }, x.id); doi++; } }
        else { await luu('buoi_hoc', { lop_id: lopId, khoa_id: kk ? kk.id : null, ngay: x.ngay, gio_bat_dau: x.gio, thoi_luong_phut: x.phut, trang_thai: 'du_kien', tinh_phi: true }); doi++; }
      }
      if (lichLop(lopId).kieu !== 'co_dinh') await luuLichLop(lopId, { kieu: 'linh_hoat', slots: [] });
      toast(doi ? `Đã cập nhật ${doi} buổi ✓` : 'Không có gì thay đổi'); ve();
    } }],
  });
}
/* sau khi gia hạn / mở khoá mới: lớp có lịch cố định → hỏi xếp luôn */
async function goiYXepSauGiaHan(lopId) {
  const ll = lichLop(lopId), { can } = soCanXep(lopId);
  if (ll.kieu !== 'co_dinh' || !ll.slots.length || !can) return;
  if (await hoi(`Lớp có lịch cố định (${chuLichLop(ll)}). Xếp luôn ${can} buổi của khoá mới?`, 'Xếp lịch')) moLichCoDinh(lopId, true);
}

const HD_LH = {
  'ngay-off': el => moNgayOff(el.dataset.ngay),
  'll-co-dinh': el => moLichCoDinh(Number(el.dataset.lop)),
  'll-xep': el => moLichCoDinh(Number(el.dataset.lop), true),
  'll-chon-lai': el => moChonLaiLich(Number(el.dataset.lop)),
};
