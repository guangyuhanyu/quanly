/* =========================================================
   GIỜ TRỐNG TRONG TUẦN (bản 6.9)
   - Lịch → nút "Giờ trống": mỗi ngày trong tuần hiện các khung còn trống
     (trong giờ làm việc, trừ buổi học đã xếp/đã dạy + thời gian nghỉ giữa buổi, trừ ngày off).
   - Bấm một khung trống → đặt buổi ngay giờ đó.
   - "Chép gửi học viên": danh sách khung trống để nhắn lớp lịch linh hoạt chọn.
   Cài đặt lưu ở cai_dat 'khung_trong' = { tu, den, it, dem, nghi:[thứ] }.
   ========================================================= */
const KT_MD = { tu: '08:00', den: '22:00', it: 60, dem: 15, nghi: [] };
const ktCD = () => ({ ...KT_MD, ...(caiDat('khung_trong', {}) || {}) });
const p2g = m => `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
function khungTrongNgay(n, cd = ktCD()) {
  const d = s2d(n).getDay(), tu = gio2phut(cd.tu), den = gio2phut(cd.den);
  const ban = S.buoi_hoc.filter(b => b.ngay === n && b.gio_bat_dau && ['du_kien', 'da_day'].includes(b.trang_thai))
    .map(b => { const s = gio2phut(b.gio_bat_dau); return { s, e: s + (b.thoi_luong_phut || 90), b }; }).sort((a, b) => a.s - b.s);
  const off = ngayOff(n);
  if (off || (cd.nghi || []).includes(d)) return { ban, trong: [], off: off ? off.ten : 'Ngày nghỉ hằng tuần' };
  const trong = []; let c = tu;
  ban.forEach(x => { const s = x.s - cd.dem; if (s - c >= cd.it) trong.push([c, Math.min(s, den)]); c = Math.max(c, x.e + cd.dem); });
  if (den - c >= cd.it) trong.push([c, den]);
  return { ban, trong: trong.filter(([a, b]) => b - a >= cd.it), off: null };
}
function lichTrong() {
  const cd = ktCD(), a = dauTuan(LICH.moc), hn = homNay();
  const ngay = [...Array(7)].map((_, i) => congNgay(a, i));
  let tongTrong = 0;
  const cot = ngay.map(n => {
    const d = s2d(n), k = khungTrongNgay(n, cd), qua = n < hn;
    k.trong.forEach(([x, y]) => { if (!qua) tongTrong += y - x; });
    return `<div class="gt-ngay ${n === hn ? 'nay' : ''} ${qua ? 'qua' : ''}">
      <div class="gt-dau"><small>${THU_NGAN[d.getDay()]}</small><b>${d.getDate()}/${d.getMonth() + 1}</b></div>
      <div class="gt-ds">${k.off ? `<p class="gt-off">🏮 ${esc(k.off)}</p>` : ''}
      ${!k.off && !k.trong.length ? '<p class="gt-kin">Kín lịch</p>' : ''}
      ${[...k.trong.map(([x, y]) => ({ s: x, h: `<button class="gt-trong" ${qua ? 'disabled' : `data-act="them-buoi" data-ngay="${n}" data-gio="${p2g(x)}"`} title="Bấm để đặt buổi lúc ${p2g(x)}"><b>${p2g(x)} – ${p2g(y)}</b><small>trống ${gioNgan(y - x)}</small></button>` })),
         ...k.ban.map(x => { const L = lopTheoId(x.b.lop_id); return { s: x.s, h: `<div class="gt-ban" data-act="mo-buoi" data-id="${x.b.id}" style="--mau:${L ? L.mau || 'var(--maroon)' : 'var(--maroon)'}" title="${esc(L ? L.ten : '')}"><b>${p2g(x.s)}–${p2g(x.e)}</b> ${esc(L ? L.ten : '')}</div>` }; })]
        .sort((a, b) => a.s - b.s).map(x => x.h).join('')}</div>
    </div>`;
  }).join('');
  return `<section class="the-giay gt">
    <div class="gt-cd">
      <label>Giờ làm từ<input type="time" value="${cd.tu}" data-act-change="kt-cd" data-k="tu"></label>
      <label>đến<input type="time" value="${cd.den}" data-act-change="kt-cd" data-k="den"></label>
      <label>Khung ngắn nhất<select data-act-change="kt-cd" data-k="it">${[45, 60, 75, 90, 120].map(m => `<option value="${m}" ${cd.it === m ? 'selected' : ''}>${thoiLuongChu(m)}</option>`).join('')}</select></label>
      <label>Nghỉ giữa 2 buổi<select data-act-change="kt-cd" data-k="dem">${[0, 10, 15, 30, 45, 60].map(m => `<option value="${m}" ${cd.dem === m ? 'selected' : ''}>${m ? m + ' phút' : 'Không'}</option>`).join('')}</select></label>
      <div class="gt-thu"><span>Nghỉ hằng tuần</span>${[1, 2, 3, 4, 5, 6, 0].map(t => `<button class="${(cd.nghi || []).includes(t) ? 'on' : ''}" data-act="kt-nghi" data-v="${t}">${THU_NGAN[t]}</button>`).join('')}</div>
    </div>
    <div class="gt-tom"><span>Tuần này còn trống <b>${gioChu(tongTrong)}</b> (chưa tính các ngày đã qua) · bấm khung xanh để đặt buổi</span>
      <button class="nut nho" data-act="kt-chep">⧉ Chép khung trống gửi học viên</button></div>
    <div class="gt-luoi">${cot}</div>
  </section>`;
}
function tinKhungTrong() {
  const cd = ktCD(), a = dauTuan(LICH.moc), hn = homNay(), ds = [];
  for (let i = 0; i < 7; i++) {
    const n = congNgay(a, i); if (n < hn) continue;
    const k = khungTrongNgay(n, cd); if (!k.trong.length) continue;
    ds.push(`• ${['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'][s2d(n).getDay()]} (${ngayNgan(n)}): ${k.trong.map(([x, y]) => `${p2g(x)}–${p2g(y)}`).join(', ')}`);
  }
  if (!ds.length) return '';
  return `Thầy gửi các khung giờ Thầy còn trống tuần ${ngayNgan(a)} – ${ngayVN(congNgay(a, 6))} 🌿\n${ds.join('\n')}\nAnh/chị/bạn chọn giúp Thầy buổi học phù hợp (ngày + giờ bắt đầu) rồi nhắn lại nhé, Thầy xếp lịch ngay!`;
}
const HD_KT = {
  'kt-nghi': async el => { const cd = ktCD(), t = Number(el.dataset.v), ds = (cd.nghi || []).filter(x => x !== t); if (!(cd.nghi || []).includes(t)) ds.push(t); await luuCaiDat('khung_trong', { ...cd, nghi: ds }); ve(); },
  'kt-chep': async () => { const t = tinKhungTrong(); if (!t) return toast('Tuần này không còn khung trống', 'canh'); await navigator.clipboard.writeText(t); toast('Đã chép – dán vào Zalo nhé ✓'); },
};
const HD_KT_DOI = {
  'kt-cd': async el => { const cd = ktCD(), k = el.dataset.k; cd[k] = k === 'tu' || k === 'den' ? el.value : Number(el.value); if (gio2phut(cd.den) <= gio2phut(cd.tu)) return toast('Giờ kết thúc phải sau giờ bắt đầu', 'canh'); await luuCaiDat('khung_trong', cd); ve(); },
};
