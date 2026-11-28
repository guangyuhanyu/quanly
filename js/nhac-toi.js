/* =========================================================
   NHẮC BUỔI TỐI (bản 7.0)
   Từ khoảng 21:00 (đổi được), trang Hôm nay hiện thẻ nhắc cập nhật
   thói quen còn chưa tick + chi tiêu trong ngày. Tick ngay trên thẻ.
   - cai_dat 'nhac_toi'      = { bat, gio }
   - cai_dat 'nhac_toi_ngay' = { ngay, khong_chi, an }   (đồng bộ Mac ↔ iPhone)
   Khi trang đang mở và Thầy đã cho phép, máy hiện thêm thông báo 1 lần/ngày.
   ========================================================= */
const NT_MD = { bat: true, gio: '21:00' };
const ntCD = () => ({ ...NT_MD, ...(caiDat('nhac_toi', {}) || {}) });
const ntNgay = () => { const r = caiDat('nhac_toi_ngay', null); return r && r.ngay === homNay() ? r : { ngay: homNay() }; };
const ntPhutNay = () => { const d = new Date(); return d.getHours() * 60 + d.getMinutes(); };
function ntTinh() {
  const hn = homNay();
  const hs = S.thoi_quen.filter(h => h.dang_dung !== false).sort((a, b) => (a.thu_tu || 0) - (b.thu_tu || 0) || a.id - b.id);
  const chua = hs.filter(h => !datTQ(h, giaTriTQ(h.id, hn)));
  const chiHN = (S.chi_tieu || []).filter(x => x.ngay === hn && x.loai === 'chi');
  const r = ntNgay();
  return { hs, chua, chiHN, xongChi: chiHN.length > 0 || !!r.khong_chi, r };
}
const ntDenGio = () => { const cd = ntCD(); return cd.bat && ntPhutNay() >= gio2phut(cd.gio); };
function nhacToiHomNay() {
  if (!ntDenGio()) return '';
  const x = ntTinh(); if (x.r.an) return '';
  if (!x.chua.length && x.xongChi) return `<section class="the-giay nt nt-xong"><span>🌙 Hôm nay Thầy đã cập nhật đủ thói quen và chi tiêu. Ngủ ngon nhé!</span></section>`;
  const tongChi = x.chiHN.reduce((s, c) => s + c.so_tien, 0);
  return `<section class="the-giay nt">
    <div class="nt-dau"><h2>🌙 Cuối ngày rồi, Thầy cập nhật nhanh nhé</h2>
      <div class="nt-nut"><button class="nut nho" data-act="nt-cai" title="Đổi giờ nhắc">⚙ ${ntCD().gio}</button><button class="nut nho" data-act="nt-an">Để mai</button></div></div>
    <div class="nt-luoi">
      <div class="nt-o ${x.chua.length ? '' : 'xong'}"><b>${ICON['thoi-quen']} Thói quen</b>
        ${x.hs.length ? (x.chua.length ? `<p class="mo nho">Còn ${x.chua.length}/${x.hs.length} chưa tick – bấm để cập nhật:</p>
          <div class="tq-nhanh">${x.chua.map(h => `<button class="tq-chip" style="--mau:${esc(h.mau)}" data-act="${h.loai === 'tich' ? 'tq-tich' : 'tq-nhap'}" data-id="${h.id}" data-nhanh="1">${esc(h.icon || '')} ${esc(h.ten)}</button>`).join('')}</div>`
          : '<p class="mo nho">✓ Đã tick đủ hôm nay</p>') : '<p class="mo nho">Chưa có thói quen. <a href="#/thoi-quen">Tạo →</a></p>'}
      </div>
      <div class="nt-o ${x.xongChi ? 'xong' : ''}"><b>${ICON['chi-tieu']} Chi tiêu hôm nay</b>
        ${x.chiHN.length ? `<p class="mo nho">✓ Đã ghi ${x.chiHN.length} khoản · ${tien(tongChi)}</p><button class="nut nho" data-act="nt-ghi-chi">＋ Ghi thêm</button>`
          : x.r.khong_chi ? '<p class="mo nho">✓ Hôm nay không chi gì</p><button class="nut nho" data-act="nt-ghi-chi">＋ Vẫn ghi chi tiêu</button>'
          : `<p class="mo nho">Chưa ghi khoản chi nào hôm nay.</p><div class="nt-nut"><button class="nut chinh nho" data-act="nt-ghi-chi">＋ Ghi chi tiêu</button><button class="nut nho" data-act="nt-khong-chi">Hôm nay không chi</button></div>`}
      </div>
    </div>
    ${'Notification' in window && Notification.permission === 'default' ? '<p class="nt-tb"><button class="lien-ket" data-act="nt-tb">🔔 Cho máy hiện thông báo lúc đến giờ (khi web đang mở)</button></p>' : ''}
  </section>`;
}
async function ntLuuNgay(them) { await luuCaiDat('nhac_toi_ngay', { ...ntNgay(), ...them }); ve(); }
const HD_NT = {
  'nt-an': () => ntLuuNgay({ an: true }),
  'nt-khong-chi': () => ntLuuNgay({ khong_chi: true }),
  'nt-ghi-chi': () => { CT.thang = homNay().slice(0, 7); CT.loai = 'chi'; location.hash = '#/chi-tieu'; setTimeout(() => { const o = $('[data-form=chi-tieu] [name=so_tien]'); if (o) { o.scrollIntoView({ block: 'center' }); o.focus(); } }, 250); },
  'nt-tb': async () => { try { const p = await Notification.requestPermission(); toast(p === 'granted' ? 'Đã bật thông báo ✓' : 'Thầy chưa cho phép thông báo'); } catch (e) { } ve(); },
  'nt-cai': () => {
    const cd = ntCD();
    moHop({
      tieuDe: '🌙 Nhắc cập nhật buổi tối', noiDung: `<div class="form luoi-form">
        <label class="hop-chon-dong ca-dong"><input type="checkbox" name="bat" ${cd.bat ? 'checked' : ''}> Bật nhắc cuối ngày</label>
        <label>Nhắc từ lúc<input type="time" name="gio" value="${cd.gio}"></label>
        <p class="mo nho">Thẻ nhắc hiện trên trang Hôm nay từ giờ này tới hết ngày, cho tới khi Thầy cập nhật xong hoặc bấm "Để mai".</p></div>`,
      nut: [{ chu: 'Huỷ' }, { chu: 'Lưu', kieu: 'chinh', bam: async n => { await luuCaiDat('nhac_toi', { bat: $('[name=bat]', n).checked, gio: $('[name=gio]', n).value || '21:00' }); toast('Đã lưu giờ nhắc ✓'); ve(); } }],
    });
  },
};
/* thông báo trên máy: 1 lần/ngày, khi web đang mở */
setInterval(() => {
  try {
    if (!window.S || !S.thoi_quen || !ntDenGio()) return;
    const hn = homNay(); if (localStorage.getItem('gy-nt-bao') === hn) return;
    const x = ntTinh(); if (x.r.an || (!x.chua.length && x.xongChi)) return;
    localStorage.setItem('gy-nt-bao', hn);
    if ('Notification' in window && Notification.permission === 'granted') {
      const n = new Notification('🌙 Guangyu Hanyu · Cuối ngày rồi', { body: [x.chua.length ? `${x.chua.length} thói quen chưa tick` : '', x.xongChi ? '' : 'chưa ghi chi tiêu hôm nay'].filter(Boolean).join(' · '), icon: 'assets/apple-touch-icon.png', tag: 'gy-nhac-toi' });
      n.onclick = () => { window.focus(); location.hash = '#/hom-nay'; n.close(); };
    }
    if (location.hash === '' || location.hash === '#/hom-nay') ve();
  } catch (e) { }
}, 30000);
