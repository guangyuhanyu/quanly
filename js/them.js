/* =========================================================
   Bản 4: lời chào & câu chữ Hán mỗi ngày · sinh nhật học viên
          · tin nhắn gợi ý khoá tiếp theo · tổng kết tháng
   ========================================================= */
const TK_NGAN_HANG = '1098 7076 3995 · Chi Quang Vy · VietinBank';

/* ---------- lời chào + câu của ngày ---------- */
function loiChao() {
  const h = new Date().getHours();
  if (h >= 5 && h < 11) return { chu: 'Chào buổi sáng, Thầy', zh: '早上好' };
  if (h >= 11 && h < 13) return { chu: 'Buổi trưa an lành, Thầy', zh: '中午好' };
  if (h >= 13 && h < 18) return { chu: 'Chào buổi chiều, Thầy', zh: '下午好' };
  if (h >= 18 && h < 23) return { chu: 'Chào buổi tối, Thầy', zh: '晚上好' };
  return { chu: 'Khuya rồi, Thầy nghỉ sớm nhé', zh: '夜深了' };
}
function cauCuaNgay(n = homNay()) {
  const d = s2d(n); const dauNam = new Date(d.getFullYear(), 0, 0);
  const so = Math.floor((d - dauNam) / 864e5) + d.getFullYear() * 7;
  return LA_THAM[so % LA_THAM.length];
}
function theCauNgay() {
  const c = cauCuaNgay();
  return `<div class="cau-ngay" title="Câu chữ Hán của hôm nay"><span class="cn-nhan">今日一句</span><p class="cn-zh">${esc(c.zh)}</p><p class="cn-py">${esc(c.py)}</p><p class="cn-nghia">${esc(c.nghia)}</p></div>`;
}

/* ---------- sinh nhật ---------- */
function sinhNhatSap(h) {   // số ngày nữa tới sinh nhật (0 = hôm nay), null nếu chưa có
  if (!h || !h.ngay_sinh) return null;
  const hn = s2d(homNay()); const [, m, d] = h.ngay_sinh.split('-').map(Number);
  let sn = new Date(hn.getFullYear(), m - 1, d); if (sn < hn) sn = new Date(hn.getFullYear() + 1, m - 1, d);
  return Math.round((sn - hn) / 864e5);
}
function cachGoi(h) {   // → { goi: 'chị Thuỳ', dai: 'Chị Thuỳ', ngoi: 'chị' }
  const ten = (h && (h.ten_goi || h.ho_ten)) || '';
  const m = ten.match(/^(Anh|Chị|Cô|Chú|Em|Bạn)\s+(.+)$/i);
  if (m) { const ngoi = m[1].toLowerCase(); return { goi: `${ngoi} ${m[2]}`, ngoi, ten: m[2] }; }
  return { goi: `bạn ${ten}`, ngoi: 'bạn', ten };
}
const hoaDau = s => s ? s[0].toUpperCase() + s.slice(1) : s;
function mauLoiChuc(h, lang, i) {
  const g = cachGoi(h); const ten = g.ten;
  const vi = [
    `Chúc mừng sinh nhật ${g.goi}! 🎂\nThầy chúc ${g.ngoi} tuổi mới thật nhiều sức khoẻ, luôn vui vẻ và học tiếng Trung ngày càng tiến bộ.\n生日快乐！`,
    `Hôm nay là ngày đặc biệt của ${g.goi} 🎉\nThầy chúc ${g.ngoi} một tuổi mới bình an, mọi dự định đều suôn sẻ${h.muc_tieu ? `, và sớm đạt được mục tiêu "${h.muc_tieu}"` : ''}.\n祝你生日快乐，万事如意！`,
    `生日快乐！🌸\nChúc ${g.goi} có một ngày sinh nhật thật ấm áp bên người thân. Cảm ơn ${g.ngoi} đã luôn chăm chỉ học cùng Thầy, chúc ${g.ngoi} tuổi mới học đâu nhớ đó, nói tiếng Trung thật trôi chảy!`,
  ];
  const zh = [
    `${ten}，祝你生日快乐！🎂\n新的一岁身体健康、万事如意，中文越来越好！\n—— 光余老师`,
    `生日快乐！🎉\n愿你新的一年平安喜乐，心想事成。谢谢你一直认真学习，老师为你骄傲！\n—— 光余老师`,
    `${ten}，今天是你的生日，祝你笑口常开，天天开心！🌸\n希望新的一年我们继续一起加油学中文！\n—— 光余老师`,
  ];
  return (lang === 'zh' ? zh : vi)[i % 3];
}
function moChucSN(hid) {
  const h = hvTheoId(hid); let lang = h.ngon_ngu === 'zh' ? 'zh' : 'vi', i = 0;
  const n = sinhNhatSap(h);
  moHop({
    tieuDe: `🎂 Lời chúc sinh nhật · ${esc(h.ten_goi || h.ho_ten)}`,
    noiDung: `<p class="mo nho">${n === 0 ? 'Sinh nhật hôm nay' : `Sinh nhật ngày ${ngayNgan(h.ngay_sinh)} (còn ${n} ngày)`}${h.sdt ? ' · Zalo ' + esc(h.sdt) : ''}</p>
      <div class="nhom-nut"><div class="phan-doan"><button data-l="vi">Tiếng Việt</button><button data-l="zh">中文</button></div><button class="nut nho" data-doi>↻ Mẫu khác</button></div>
      <textarea class="o-tin" rows="6"></textarea>`,
    nut: [
      ...(h.sdt ? [{ chu: 'Mở Zalo', trai: true, bam: () => { window.open('https://zalo.me/' + h.sdt.replace(/\D/g, ''), '_blank'); return false; } }] : []),
      { chu: '⧉ Sao chép lời chúc', kieu: 'chinh', bam: async n => { await navigator.clipboard.writeText($('.o-tin', n).value); toast('Đã chép – dán vào Zalo nhé ✓'); } }],
    khiMo: n => {
      const ve_ = () => { $('.o-tin', n).value = mauLoiChuc(h, lang, i); $$('[data-l]', n).forEach(b => b.classList.toggle('on', b.dataset.l === lang)); };
      $$('[data-l]', n).forEach(b => b.onclick = () => { lang = b.dataset.l; ve_(); });
      $('[data-doi]', n).onclick = () => { i++; ve_(); };
      ve_();
    },
  });
}

/* ---------- tin nhắn gợi ý khoá tiếp theo ---------- */
function soanTinGiaHan(L, k, o) {
  const t = tk(k); const hv = hvCuaLop(L.id); const nhom = L.loai === 'nhom' || hv.length > 1;
  const g = nhom ? { goi: `cả nhóm ${L.ten}`, ngoi: 'cả nhóm' } : cachGoi(hv[0] || { ten_goi: L.ten });
  const carry = o.chuyen ? t.conLai : 0;
  const noiDungCK = `${nhom ? L.ten : (hv[0] ? cachGoi(hv[0]).ten : L.ten)} ${trinhDoCua(L, k) || L.ten}`.trim();
  if (o.lang === 'zh') {
    const tienZ = n => new Intl.NumberFormat('en-US').format(n) + ' 越南盾';
    return `${nhom ? '各位同学好！' : '您好！'}我是光余老师。\n${nhom ? '我们' : '您'}目前的课程${t.conLai > 0 ? `还剩 ${t.conLai} 次课` : '已经全部完成'}（已上 ${t.daHoc}/${t.tong} 次）。为了不中断学习，下期课程信息如下：\n· 课时：${o.so} 次 × ${o.tl} 分钟${carry > 0 ? `（另加本期剩余的 ${carry} 次课）` : carry < 0 ? `（扣除本期多上的 ${-carry} 次课）` : ''}\n· 学费：${tienZ(o.hp)}${nhom ? '（全组合计）' : ''}\n请在新课程第一次上课前完成转账，转账备注请写：学员姓名＋班级。\n· 账户：${TK_NGAN_HANG}\n感谢${nhom ? '大家' : '您'}一直以来的支持！`;
  }
  return `Chào ${g.goi}, Thầy Guangyu đây ạ 🌿\nKhoá học hiện tại của ${g.ngoi} ${t.conLai > 0 ? `còn ${t.conLai} buổi nữa là hoàn thành` : 'đã hoàn thành'} (đã học ${t.daHoc}/${t.tong} buổi). Để việc học không bị gián đoạn, Thầy gửi ${g.ngoi} thông tin khoá tiếp theo:\n• Số buổi: ${o.so} buổi × ${o.tl} phút${carry > 0 ? ` (cộng thêm ${carry} buổi còn lại của khoá này)` : carry < 0 ? ` (trừ ${-carry} buổi đã học vượt ở khoá này)` : ''}\n• Học phí: ${tien(o.hp)}${nhom ? ' (cả nhóm)' : ''}\n${hoaDau(g.ngoi)} vui lòng chuyển khoản trước buổi học đầu tiên của khoá mới giúp Thầy nhé.\n• Nội dung chuyển khoản: ${noiDungCK}\n• Tài khoản: ${TK_NGAN_HANG}\nCảm ơn ${g.ngoi} đã luôn đồng hành cùng Thầy!`;
}
function moTinGiaHan(lopId) {
  const L = lopTheoId(lopId); const k = khoaHienTai(lopId);
  if (!k) { moGiaHan(lopId); return; }
  const t = tk(k); const hv = hvCuaLop(L.id);
  const giaBG = L.loai === 'nhom' ? 0 : goiYHocPhi(L.bang_gia_id, k.thoi_luong_phut || 90, k.so_buoi);
  const o = { so: k.so_buoi, tl: k.thoi_luong_phut || 90, hp: k.hoc_phi, chuyen: t.conLai !== 0, lang: L.ngon_ngu === 'zh' || (hv[0] && hv[0].ngon_ngu === 'zh') ? 'zh' : 'vi' };
  let suaTay = false;
  const sdt = (hv.find(h => h.sdt) || {}).sdt;
  moHop({
    tieuDe: `✉ Gợi ý khoá tiếp theo · ${esc(L.ten)}`, rong: true,
    noiDung: `<div class="tin-gh">
      <aside class="form">
        <p class="mo nho">Khoá ${k.ma}: đã học ${t.daHoc}/${t.tong} buổi, còn <b>${t.conLai}</b> buổi.</p>
        <label>Số buổi khoá mới<input type="number" name="so" value="${o.so}"></label>
        <label>Thời lượng (phút)<input type="number" name="tl" value="${o.tl}" step="15"></label>
        <label>Học phí khoá mới<input data-so name="hp" value="${o.hp}"></label>
        <div class="goi-y-gia">
          <button type="button" class="chip" data-hp="${k.hoc_phi}">Giữ như khoá này: ${tien(k.hoc_phi)}</button>
          ${giaBG && giaBG !== k.hoc_phi ? `<button type="button" class="chip" data-hp="${giaBG}">Theo bảng giá mới: ${tien(giaBG)}</button>` : ''}
        </div>
        ${t.conLai !== 0 ? `<label class="hop-chon-dong"><input type="checkbox" name="chuyen" ${o.chuyen ? 'checked' : ''}> ${t.conLai > 0 ? `Nhắc cộng ${t.conLai} buổi còn lại` : `Nhắc trừ ${-t.conLai} buổi học vượt`}</label>` : ''}
        <div class="phan-doan rong"><button type="button" data-l="vi">Tiếng Việt</button><button type="button" data-l="zh">中文</button></div>
      </aside>
      <div><textarea class="o-tin" rows="14"></textarea><p class="mo nho">Thầy sửa thẳng trong ô này được. Đổi số buổi / học phí bên trái thì tin nhắn tự cập nhật.</p></div>
    </div>`,
    nut: [
      { chu: '↻ Tạo khoá mới luôn', trai: true, bam: () => { setTimeout(() => moGiaHan(lopId), 60); } },
      ...(sdt ? [{ chu: 'Mở Zalo', bam: () => { window.open('https://zalo.me/' + sdt.replace(/\D/g, ''), '_blank'); return false; } }] : []),
      { chu: 'Gửi kèm PNG', bam: () => { setTimeout(() => moXuatPNG(lopId, '02'), 60); } },
      { chu: '⧉ Sao chép tin nhắn', kieu: 'chinh', bam: async n => { await navigator.clipboard.writeText($('.o-tin', n).value); toast('Đã chép tin nhắn – dán vào Zalo nhé ✓'); return false; } }],
    khiMo: n => {
      ganOTien(n);
      const tin = $('.o-tin', n); tin.addEventListener('input', () => suaTay = true);
      const cap = (ep) => {
        o.so = Number($('[name=so]', n).value) || o.so; o.tl = Number($('[name=tl]', n).value) || o.tl;
        o.hp = Number($('[name=hp]', n).value.replace(/\D/g, '')) || 0; const c = $('[name=chuyen]', n); o.chuyen = c ? c.checked : false;
        $$('[data-l]', n).forEach(b => b.classList.toggle('on', b.dataset.l === o.lang));
        if (!suaTay || ep) { tin.value = soanTinGiaHan(L, k, o); suaTay = false; }
      };
      $$('input', n).forEach(i => i.addEventListener('input', () => cap()));
      $$('[data-l]', n).forEach(b => b.onclick = () => { o.lang = b.dataset.l; cap(true); });
      $$('[data-hp]', n).forEach(b => b.onclick = () => { $('[name=hp]', n).value = NF.format(Number(b.dataset.hp)); cap(); });
      cap(true);
    },
  });
}

/* ---------- tổng kết tháng ---------- */
function soLieuThang(th) {
  const [y, m] = th.split('-').map(Number);
  const tu = `${th}-01`, den = `${th}-${pad(new Date(y, m, 0).getDate())}`;
  const k = tongKy(tu, den);
  const nghi = S.buoi_hoc.filter(b => b.trang_thai === 'nghi' && b.ngay >= tu && b.ngay <= den).length;
  const gio = k.buoi.reduce((s, b) => s + (b.thoi_luong_phut || 90), 0) / 60;
  const theoLop = {}; k.buoi.forEach(b => theoLop[b.lop_id] = (theoLop[b.lop_id] || 0) + 1);
  const topLop = Object.entries(theoLop).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([id, n]) => ({ L: lopTheoId(Number(id)), n }));
  const thu = [0, 0, 0, 0, 0, 0, 0]; k.buoi.forEach(b => thu[s2d(b.ngay).getDay()]++);
  const thuDong = thu.indexOf(Math.max(...thu));
  const lopMoi = S.khoa_hoc.filter(x => !x.khoa_truoc_id && (tk(x).ngayDau || x.ngay_bat_dau || '') >= tu && (tk(x).ngayDau || x.ngay_bat_dau || '') <= den).length;
  const giaHan = S.khoa_hoc.filter(x => x.khoa_truoc_id && (x.ngay_bat_dau || '') >= tu && (x.ngay_bat_dau || '') <= den).length;
  const hn = homNay(); const cuoi = den < hn ? den : hn; const soNgay = Math.max(1, Math.round((s2d(cuoi) - s2d(tu)) / 864e5) + 1);
  const tq = S.thoi_quen.filter(h => h.dang_dung !== false).map(h => { let dat = 0, tong = 0; for (let i = 0; i < soNgay; i++) { const g = giaTriTQ(h.id, congNgay(tu, i)); tong += g; if (datTQ(h, g)) dat++; } return { h, dat, tong, pt: Math.round(dat / soNgay * 100) }; }).sort((a, b) => b.pt - a.pt);
  const chi = S.chi_tieu.filter(x => x.loai === 'chi' && x.ngay >= tu && x.ngay <= den);
  const tongChi = chi.reduce((s, x) => s + x.so_tien, 0);
  const dm = {}; chi.forEach(x => dm[x.danh_muc || 'Khác'] = (dm[x.danh_muc || 'Khác'] || 0) + x.so_tien);
  const dmTop = Object.entries(dm).sort((a, b) => b[1] - a[1])[0];
  return { th, y, m, tu, den, k, nghi, gio, topLop, thuDong, thuSo: thu[thuDong], lopMoi, giaHan, tq, soNgay, tongChi, dmTop, xong: den < hn };
}
function soSanh(a, b) { if (!b) return ''; const p = Math.round((a - b) / b * 100); return `<span class="ss ${p >= 0 ? 'len' : 'xuong'}">${p >= 0 ? '▲' : '▼'} ${Math.abs(p)}% so với tháng trước</span>`; }
function baoCaoThang(th) {
  const d = soLieuThang(th);
  const tr = new Date(d.y, d.m - 2, 1); const tt = soLieuThang(`${tr.getFullYear()}-${pad(tr.getMonth() + 1)}`);
  const cau = cauCuaNgay(d.xong ? d.den : homNay());
  const tqTot = d.tq[0];
  return `<div class="bao-cao" id="bao-cao">
    <div class="bc-dau"><img src="assets/logo.webp" alt=""><div><p class="bc-cn">月度总结 · ${d.y}年${d.m}月</p><h2>Tổng kết tháng ${d.m}/${d.y}</h2><p class="mo">${d.xong ? 'Gửi riêng Thầy Guangyu' : `Tạm tính tới hôm nay (${ngayNgan(homNay())})`}</p></div></div>
    <div class="bc-luoi">
      <div class="bc-o"><span>Buổi đã dạy</span><b>${d.k.buoi.length}</b><small>${d.gio.toLocaleString('vi-VN', { maximumFractionDigits: 1 })} giờ đứng lớp${d.nghi ? ` · ${d.nghi} buổi nghỉ` : ''}</small>${soSanh(d.k.buoi.length, tt.k.buoi.length)}</div>
      <div class="bc-o"><span>Tiền thực nhận</span><b>${tien(d.k.thucNhan)}</b><small>${d.k.tt.length} lần học viên chuyển khoản</small>${soSanh(d.k.thucNhan, tt.k.thucNhan)}</div>
      <div class="bc-o"><span>Doanh thu đã dạy</span><b>${tien(d.k.doanhThu)}</b><small>trung bình ${tien(d.k.buoi.length ? d.k.doanhThu / d.k.buoi.length : 0)}/buổi</small>${soSanh(d.k.doanhThu, tt.k.doanhThu)}</div>
      <div class="bc-o"><span>Lớp mới · gia hạn</span><b>${d.lopMoi} · ${d.giaHan}</b><small>${d.thuSo ? `dạy nhiều nhất vào ${THU[d.thuDong]} (${d.thuSo} buổi)` : ''}</small></div>
    </div>
    <div class="bc-hai">
      <div><h4>🏅 Lớp chăm nhất</h4>${d.topLop.length ? `<ol>${d.topLop.map(x => `<li>${chamMau(x.L)}<b>${esc(x.L ? x.L.ten : '')}</b><span>${x.n} buổi</span></li>`).join('')}</ol>` : '<p class="mo">Chưa có buổi dạy.</p>'}</div>
      <div><h4>🔥 Thói quen giữ tốt nhất</h4>${tqTot ? `<p class="bc-tq"><b>${esc(tqTot.h.ten)}</b> · ${tqTot.dat}/${d.soNgay} ngày (${tqTot.pt}%)</p>${d.tq.slice(1, 3).map(x => `<p class="mo nho">${esc(x.h.ten)}: ${x.pt}%</p>`).join('')}${d.tq.filter(x => x.h.don_vi === 'đ').map(x => `<p class="mo nho">Đã tiết kiệm: <b>${tien(x.tong)}</b></p>`).join('')}` : '<p class="mo">Chưa theo dõi thói quen.</p>'}
        ${d.tongChi ? `<p class="mo nho">Chi tiêu: ${tien(d.tongChi)}${d.dmTop ? ` · nhiều nhất: ${esc(d.dmTop[0])}` : ''}</p>` : ''}</div>
    </div>
    <div class="bc-cau"><p class="cn-zh">${esc(cau.zh)}</p><p class="mo">${esc(cau.nghia)}</p></div>
    <p class="bc-ky">光余汉语 · GUANGYU HANYU</p>
  </div>`;
}
let TK_THANG = null;
function moTongKet(th) {
  TK_THANG = th || homNay().slice(0, 7);
  const { nen } = moHop({
    tieuDe: 'Tổng kết tháng', rong: true,
    noiDung: `<div class="nhom-nut giua bc-dieu-huong"><button class="nut-tron vien" data-tk="-1">${ICON.trai}</button><span id="tk-ten"></span><button class="nut-tron vien" data-tk="1">${ICON.phai}</button></div><div id="tk-than"></div>`,
    nut: [{ chu: '⤓ Lưu thành ảnh', trai: true, bam: async () => { await luuAnhBaoCao(); return false; } }, { chu: 'Đóng', kieu: 'chinh', bam: () => { } }],
    khiMo: n => {
      const ve_ = () => { $('#tk-ten', n).textContent = `Tháng ${Number(TK_THANG.slice(5))}/${TK_THANG.slice(0, 4)}`; $('#tk-than', n).innerHTML = baoCaoThang(TK_THANG); };
      $$('[data-tk]', n).forEach(b => b.onclick = () => { const d = s2d(TK_THANG + '-01'); d.setMonth(d.getMonth() + Number(b.dataset.tk)); TK_THANG = d2s(d).slice(0, 7); ve_(); });
      ve_();
    },
  });
  nen.querySelector('.hop').classList.add('hop-bc');
}
async function luuAnhBaoCao() {
  if (!window.modernScreenshot) await new Promise((ok, loi) => { const s = document.createElement('script'); s.src = 'vendor/modern-screenshot.js?v=4.1'; s.onload = ok; s.onerror = loi; document.head.appendChild(s); });
  const el = $('#bao-cao'); await document.fonts.ready;
  const opt = { scale: 2.5, backgroundColor: '#FBF6EA' };
  if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) await modernScreenshot.domToBlob(el, opt);
  taiFile(await modernScreenshot.domToBlob(el, opt), `tong-ket-thang-${TK_THANG}.png`, 'image/png'); toast('Đã lưu ảnh tổng kết ✓');
}
function theTongKetHomNay() {
  const d = new Date(); const ngay = d.getDate();
  if (ngay >= 26) return `<button class="the-tong-ket" data-act="tong-ket" data-thang="${homNay().slice(0, 7)}">📜 <span><b>Tổng kết tháng ${d.getMonth() + 1}</b> (tạm tính) đã có, Thầy xem nhé</span>›</button>`;
  if (ngay <= 5) { const t = new Date(d.getFullYear(), d.getMonth() - 1, 1); return `<button class="the-tong-ket" data-act="tong-ket" data-thang="${t.getFullYear()}-${pad(t.getMonth() + 1)}">📜 <span><b>Tổng kết tháng ${t.getMonth() + 1}</b> đã sẵn sàng, gửi riêng Thầy</span>›</button>`; }
  return '';
}
