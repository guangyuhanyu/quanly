/* CHIÊM TINH — 12 cung hoàng đạo.
   Vị trí Mặt Trăng & tuần trăng tính thật theo ngày (sai số ~1°).
   Lời bình từng mặt là thư viện cố định, chọn theo cung + Mặt Trăng + ngày: cùng ngày xem lại vẫn ra cùng kết quả.
   Cung của Thầy lưu trong cai_dat 'cung_hoang_dao' (không cần sửa Supabase). */

const CUNG = [
  { vi: 'Bạch Dương', zh: '白羊座', py: 'Báiyáng zuò', ky: '♈', tu: '21/3', den: '19/4', nt: 'Lửa', sao: 'Hoả tinh', tinh: 'Nhiệt huyết, dám nghĩ dám làm, thích mở đầu việc mới.' },
  { vi: 'Kim Ngưu', zh: '金牛座', py: 'Jīnniú zuò', ky: '♉', tu: '20/4', den: '20/5', nt: 'Đất', sao: 'Kim tinh', tinh: 'Kiên nhẫn, chắc chắn, trân trọng cái đẹp và sự ổn định.' },
  { vi: 'Song Tử', zh: '双子座', py: 'Shuāngzǐ zuò', ky: '♊', tu: '21/5', den: '20/6', nt: 'Khí', sao: 'Thuỷ tinh', tinh: 'Lanh lợi, giỏi ăn nói, tò mò với mọi điều mới.' },
  { vi: 'Cự Giải', zh: '巨蟹座', py: 'Jùxiè zuò', ky: '♋', tu: '21/6', den: '22/7', nt: 'Nước', sao: 'Mặt Trăng', tinh: 'Tình cảm, chu đáo, luôn muốn che chở người thân.' },
  { vi: 'Sư Tử', zh: '狮子座', py: 'Shīzi zuò', ky: '♌', tu: '23/7', den: '22/8', nt: 'Lửa', sao: 'Mặt Trời', tinh: 'Tự tin, hào phóng, có sức hút khi đứng trước đám đông.' },
  { vi: 'Xử Nữ', zh: '处女座', py: 'Chǔnǚ zuò', ky: '♍', tu: '23/8', den: '22/9', nt: 'Đất', sao: 'Thuỷ tinh', tinh: 'Tỉ mỉ, cầu toàn, giỏi sắp xếp và chăm lo chi tiết.' },
  { vi: 'Thiên Bình', zh: '天秤座', py: 'Tiānchèng zuò', ky: '♎', tu: '23/9', den: '22/10', nt: 'Khí', sao: 'Kim tinh', tinh: 'Hoà nhã, công bằng, có gu thẩm mỹ tinh tế.' },
  { vi: 'Bọ Cạp', zh: '天蝎座', py: 'Tiānxiē zuò', ky: '♏', tu: '23/10', den: '21/11', nt: 'Nước', sao: 'Diêm Vương tinh', tinh: 'Sâu sắc, bền bỉ, đã quyết thì theo đến cùng.' },
  { vi: 'Nhân Mã', zh: '射手座', py: 'Shèshǒu zuò', ky: '♐', tu: '22/11', den: '21/12', nt: 'Lửa', sao: 'Mộc tinh', tinh: 'Phóng khoáng, lạc quan, mê học hỏi và đi xa.' },
  { vi: 'Ma Kết', zh: '摩羯座', py: 'Mójié zuò', ky: '♑', tu: '22/12', den: '19/1', nt: 'Đất', sao: 'Thổ tinh', tinh: 'Kỷ luật, có trách nhiệm, đi chậm mà chắc.' },
  { vi: 'Bảo Bình', zh: '水瓶座', py: 'Shuǐpíng zuò', ky: '♒', tu: '20/1', den: '18/2', nt: 'Khí', sao: 'Thiên Vương tinh', tinh: 'Độc lập, sáng tạo, hay có ý tưởng khác người.' },
  { vi: 'Song Ngư', zh: '双鱼座', py: 'Shuāngyú zuò', ky: '♓', tu: '19/2', den: '20/3', nt: 'Nước', sao: 'Hải Vương tinh', tinh: 'Giàu cảm xúc, mơ mộng, dễ đồng cảm với người khác.' },
];
CUNG.forEach(c => { c.ky += '\uFE0E'; });   // hiện ký hiệu dạng nét chữ, không thành emoji màu
const NT_ZH = { 'Lửa': '火', 'Đất': '土', 'Khí': '风', 'Nước': '水' };

/* Ngày sinh (yyyy-mm-dd) → số thứ tự cung */
function cungTuNgaySinh(ns) {
  if (!ns) return null; const [, m, d] = ns.split('-').map(Number); const md = m * 100 + d;
  const moc = [[120, 10], [219, 11], [321, 0], [420, 1], [521, 2], [621, 3], [723, 4], [823, 5], [923, 6], [1023, 7], [1122, 8], [1222, 9]];
  let c = 9; for (const [mm, i] of moc) if (md >= mm) c = i; return c;
}

/* ----- thiên văn đơn giản ----- */
function ngayJulian(ymd) { const [y, m, d] = ymd.split('-').map(Number); return Date.UTC(y, m - 1, d, 5) / 864e5 + 2440587.5; } // 12h trưa giờ VN
function viTriTrang(ymd) {
  const n = ngayJulian(ymd) - 2451545.0, r = Math.PI / 180;
  const L = 218.316 + 13.176396 * n, M = 134.963 + 13.064993 * n, F = 93.272 + 13.229350 * n;
  const D = 297.850 + 12.190749 * n, Ms = 357.529 + 0.985600 * n;
  let lon = L + 6.289 * Math.sin(M * r) + 1.274 * Math.sin((2 * D - M) * r) + 0.658 * Math.sin(2 * D * r) - 0.186 * Math.sin(Ms * r) - 0.114 * Math.sin(2 * F * r);
  lon = ((lon % 360) + 360) % 360;
  return { lon, cung: Math.floor(lon / 30) };
}
function tuanTrang(ymd) {
  const tuoi = (((ngayJulian(ymd) - 2451550.26) / 29.530588) % 1 + 1) % 1 * 29.530588;
  const ds = [[1.85, 'Trăng non', '新月'], [5.54, 'Trăng lưỡi liềm', '蛾眉月'], [9.23, 'Trăng thượng huyền', '上弦月'], [12.92, 'Trăng gần tròn', '盈凸月'], [16.61, 'Trăng tròn', '满月'], [20.30, 'Trăng bắt đầu khuyết', '亏凸月'], [23.99, 'Trăng hạ huyền', '下弦月'], [27.68, 'Trăng tàn', '残月'], [30, 'Trăng non', '新月']];
  const p = ds.find(x => tuoi < x[0]); return { tuoi, ten: p[1], zh: p[2] };
}

/* ----- số ngẫu nhiên cố định theo hạt giống ----- */
function hatGiong(s) { let h = 1779033703 ^ s.length; for (let i = 0; i < s.length; i++) { h = Math.imul(h ^ s.charCodeAt(i), 3432918353); h = h << 13 | h >>> 19; } return () => { h = Math.imul(h ^ h >>> 16, 2246822507); h = Math.imul(h ^ h >>> 13, 3266489909); return ((h ^= h >>> 16) >>> 0) / 4294967296; }; }
const chon = (rd, a) => a[Math.floor(rd() * a.length)];

/* ----- thư viện lời bình: [thấp (1–2★), vừa (3★), cao (4–5★)] ----- */
const MAT_CT = [
  { k: 'cv', ten: 'Công việc & dạy học', zh: '事业', icon: 'lop', loi: [
    ['Năng lượng hơi chùng, dễ nói nhanh làm học viên theo không kịp. Giảm nhịp, ưu tiên ôn lại phần cũ.', 'Dễ gặp chuyện lặt vặt: mạng chập chờn, học viên xin dời lịch. Chuẩn bị sẵn phương án B là yên tâm.', 'Hôm nay không hợp để bắt đầu giáo án lớn. Làm những việc nhỏ, chắc tay trước.', 'Dễ mất kiên nhẫn khi học viên hỏi lại nhiều lần. Hít sâu một nhịp trước khi trả lời.', 'Giấy tờ, lịch dạy dễ nhầm. Kiểm tra lại giờ hẹn trước khi gửi link Zoom.'],
    ['Ngày làm việc đều đặn. Theo đúng giáo án đã soạn là đủ tốt.', 'Hợp để rà lại tiến độ từng lớp và ghi chú điểm yếu của học viên.', 'Một học viên có thể cần Thầy động viên nhiều hơn bình thường. Để ý lời nói của họ.', 'Việc nhỏ hôm nay sẽ đỡ việc lớn tuần sau. Tranh thủ soạn trước một bài.', 'Không có biến động lớn. Giữ nhịp và nghỉ giữa các ca dạy cho đủ.'],
    ['Lời giảng hôm nay đặc biệt có sức thuyết phục. Hợp để dạy điểm ngữ pháp khó.', 'Ý tưởng soạn bài đến dồi dào. Ghi lại ngay kẻo quên.', 'Hợp để nhắn học viên cũ hỏi thăm hoặc mời học tiếp khoá sau.', 'Lớp học dễ vui, học viên hào hứng. Thử thêm một trò chơi nhỏ cuối giờ.', 'Ngày tốt để lên kế hoạch mở lớp mới hoặc làm nội dung quảng bá.']] },
  { k: 'tc', ten: 'Tài chính', zh: '财运', icon: 'tui-gam', loi: [
    ['Dễ chi tiêu theo cảm hứng. Món gì chưa cần thì để mai hẵng mua.', 'Tiền ra nhanh hơn tiền vào. Kiểm tra các khoản học phí còn chờ thu.', 'Không hợp cho các quyết định tiền bạc lớn. Hoãn lại vài ngày.', 'Cẩn thận khi chuyển khoản, đọc kỹ số tài khoản và nội dung.', 'Dễ cho người khác mượn tiền vì nể. Nói "để Thầy xem lại" cũng được.'],
    ['Thu chi cân bằng. Ghi lại các khoản trong mục Chi tiêu để cuối tháng dễ nhìn.', 'Một khoản nhỏ có thể về muộn, đừng lo, nhắc nhẹ là được.', 'Ngày bình ổn. Hợp để xem lại ngân sách tháng.', 'Tiết kiệm một khoản nhỏ hôm nay sẽ thấy vui về sau.', 'Không lời không lỗ. Giữ thói quen ghi chép là đủ.'],
    ['Tài lộc thuận. Học phí, khoản chờ thu dễ về đúng hẹn.', 'Hợp để gửi tin gia hạn khoá học cho những lớp sắp hết buổi.', 'Có cơ hội thu nhập thêm từ học viên giới thiệu. Đón nhận vui vẻ.', 'Ngày tốt để đặt mục tiêu tiết kiệm mới.', 'Tiền bạc suôn sẻ. Có thể tự thưởng một món nhỏ.']] },
  { k: 'sk', ten: 'Sức khoẻ', zh: '健康', icon: 'tra', loi: [
    ['Cổ họng dễ mệt vì nói nhiều. Mang theo bình nước ấm khi dạy.', 'Mắt và vai gáy dễ mỏi. Rời màn hình 5 phút sau mỗi ca dạy.', 'Ngủ chưa đủ thì làm gì cũng chậm. Tối nay đi ngủ sớm hơn 30 phút.', 'Dễ ăn uống thất thường. Đừng bỏ bữa giữa các ca dạy.', 'Tâm trạng dễ bị kéo xuống. Ra ngoài đi bộ một chút sẽ đỡ hơn.'],
    ['Sức khoẻ ổn định. Duy trì thói quen vận động nhẹ.', 'Uống đủ nước, dạy xong thì giãn cơ một chút.', 'Năng lượng vừa phải, đừng ôm quá nhiều ca liên tiếp.', 'Một tách trà và mười phút yên tĩnh là đủ nạp lại năng lượng.', 'Hợp để đi ngủ đúng giờ và dậy sớm hơn mai.'],
    ['Tinh thần sảng khoái, giọng tốt. Ngày hợp để dạy nhiều ca.', 'Cơ thể dẻo dai. Hợp để tập thể dục lâu hơn thường lệ.', 'Ngủ ngon, đầu óc minh mẫn, làm việc nhanh.', 'Năng lượng dồi dào. Đừng quên nghỉ ngơi kẻo đuối vào buổi tối.', 'Tâm an thì thân khoẻ. Hôm nay cả hai đều tốt.']] },
  { k: 'tcm', ten: 'Tình cảm & quan hệ', zh: '人际', icon: 'hoc-vien', loi: [
    ['Dễ hiểu lầm qua tin nhắn. Chuyện quan trọng thì gọi điện nói rõ.', 'Người thân có thể cần Thầy dành thời gian hơn. Đặt điện thoại xuống một lúc.', 'Đừng nhận lời quá nhiều chuyện của người khác hôm nay.', 'Lời nói vô tình có thể làm người khác chạnh lòng. Nói chậm, nói mềm.', 'Nên tránh tranh luận. Nhường một câu, mọi việc nhẹ hơn.'],
    ['Quan hệ êm ả. Một lời cảm ơn đúng lúc sẽ rất được trân trọng.', 'Hợp để nhắn hỏi thăm một người bạn lâu ngày chưa gặp.', 'Không có gì nổi bật, nhưng sự chân thành vẫn được đón nhận.', 'Học viên và người thân đều dễ chịu. Giữ không khí vui vẻ.', 'Lắng nghe nhiều hơn nói, Thầy sẽ hiểu người khác thêm một chút.'],
    ['Có quý nhân giúp đỡ hoặc lời giới thiệu tốt.', 'Học viên dễ bày tỏ sự quý mến. Đón nhận và cảm ơn họ.', 'Ngày tốt để hẹn gặp bạn bè, gia đình.', 'Sức hút cao. Lời Thầy nói ra dễ được tin tưởng.', 'Các mối quan hệ gắn kết hơn. Hợp để nói lời cảm ơn ai đó.']] },
];
const MAU_MAY = [['Đỏ son', '#B23A2E'], ['Vàng hổ phách', '#D19A2A'], ['Xanh ngọc', '#2E8B7A'], ['Xanh lam', '#3C6E9E'], ['Tím hoa cà', '#8E6BB5'], ['Hồng đào', '#E08A8A'], ['Trắng ngà', '#EFE6D2'], ['Xanh rêu', '#6B7F3A'], ['Nâu trà', '#8A5A35'], ['Xám bạc', '#9AA3A8'], ['Cam đất', '#C86B3C'], ['Xanh bạc hà', '#7CC5B0']];
const GIO_TOT = ['7:00–9:00', '9:00–11:00', '11:00–13:00', '13:00–15:00', '15:00–17:00', '17:00–19:00', '19:00–21:00', '21:00–23:00'];
const LOI_NT = {
  'cung': 'Mặt Trăng đi qua cung cùng nguyên tố với Thầy, cảm xúc và trực giác dễ hoà hợp.',
  'hop': 'Nguyên tố của Mặt Trăng hôm nay nâng đỡ nguyên tố của Thầy, mọi việc dễ trôi chảy.',
  'nghich': 'Mặt Trăng ở nguyên tố trái chiều, cảm xúc dễ dao động. Chậm lại một nhịp sẽ tốt hơn.',
  'trung': 'Mặt Trăng ở vị trí trung tính, ngày bình ổn, kết quả tuỳ vào sự chủ động của Thầy.',
  'nha': 'Mặt Trăng đang ở đúng cung của Thầy, là ngày hợp để chăm lo cho bản thân và làm điều mình thích.',
};
const KHUYEN = {
  'Lửa': ['Hành động trước, hoàn thiện sau. Bắt tay vào việc đang trì hoãn.', 'Năng lượng nhiều thì dồn vào một việc, đừng rải khắp nơi.', 'Kiên nhẫn với người chậm hơn mình, đó cũng là một cách dạy.'],
  'Đất': ['Đi từng bước nhỏ nhưng đều, hôm nay chỉ cần hoàn thành một việc chính.', 'Sắp xếp lại góc làm việc, đầu óc cũng sẽ gọn gàng theo.', 'Cho phép mình nghỉ ngơi, chậm một chút không sao.'],
  'Khí': ['Ghi lại các ý tưởng, chọn một cái để làm ngay hôm nay.', 'Trò chuyện với một người mới, có thể nhận được gợi ý hay.', 'Bớt lướt điện thoại, tập trung trọn vẹn vào từng ca dạy.'],
  'Nước': ['Tin vào trực giác khi đánh giá học viên, nhưng kiểm chứng lại bằng bài tập.', 'Dành thời gian yên tĩnh cho riêng mình trước khi chăm lo cho người khác.', 'Đừng ôm cảm xúc của người khác vào mình quá nhiều.'],
};

function quanHeNT(a, b, cungThay, cungTrang) {
  if (cungThay === cungTrang) return 'nha';
  if (a === b) return 'cung';
  const cap = [a, b].sort().join('-');
  if (cap === 'Khí-Lửa' || cap === 'Nước-Đất') return 'hop';
  if (cap === 'Lửa-Nước' || cap === 'Khí-Đất') return 'nghich';
  return 'trung';
}

/* Lá số trong ngày của một cung */
function laSoNgay(ci, ymd) {
  const c = CUNG[ci], trang = viTriTrang(ymd), tt = tuanTrang(ymd), ct = CUNG[trang.cung];
  const qh = quanHeNT(c.nt, ct.nt, ci, trang.cung);
  const goc = { nha: 3.9, cung: 3.7, hop: 3.5, trung: 3.1, nghich: 2.6 }[qh] + ((tt.ten === 'Trăng tròn' || tt.ten === 'Trăng non') ? 0.2 : 0);
  const rd = hatGiong(ymd + '|' + ci);
  const mat = MAT_CT.map(m => {
    const s = Math.max(1, Math.min(5, Math.round(goc + (rd() - 0.5) * 2.6)));
    return { ...m, sao: s, loiBinh: chon(rd, m.loi[s <= 2 ? 0 : s === 3 ? 1 : 2]) };
  });
  const tong = Math.max(1, Math.min(5, Math.round(mat.reduce((a, m) => a + m.sao, 0) / mat.length + 0.1)));
  const hopCung = CUNG.map((x, i) => i).filter(i => i !== ci && (CUNG[i].nt === c.nt || quanHeNT(c.nt, CUNG[i].nt, -1, -2) === 'hop'));
  return {
    c, ci, ymd, trang, tt, ct, qh, mat, tong,
    mau: chon(rd, MAU_MAY), so: 1 + Math.floor(rd() * 9), gio: chon(rd, GIO_TOT), hop: CUNG[chon(rd, hopCung)],
    nhanXet: LOI_NT[qh], khuyen: chon(rd, KHUYEN[c.nt]),
    cau: LA_THAM[Math.floor(rd() * LA_THAM.length)],
  };
}

/* ----- giao diện ----- */
const saoHTML = n => `<span class="ct-sao" aria-label="${n}/5">${'★'.repeat(n)}<i>${'★'.repeat(5 - n)}</i></span>`;
const cungThay = () => { const v = caiDat('cung_hoang_dao', null); return v == null ? null : Number(v); };

function vChiemTinh() {
  const cm = cungThay();
  if (cm == null && RT.xemCung == null) return chonCungHTML();
  const ci = RT.xemCung != null ? RT.xemCung : cm;
  const ls = laSoNgay(ci, RT.ngayCT || homNay());
  const c = ls.c, laThay = ci === cm;
  return `
  <div class="luoi-2 ct-luoi">
    <section class="the-giay ct-cung">
      <div class="ct-ky">${c.ky}</div>
      <p class="ct-zh">${c.zh}</p><p class="ct-py">${c.py}</p>
      <h2 class="ct-vi">${c.vi}</h2>
      <p class="mo nho">${c.tu} – ${c.den} · Nguyên tố ${c.nt} ${NT_ZH[c.nt]} · Sao chủ quản: ${c.sao}</p>
      <p class="ct-tinh">${c.tinh}</p>
      <div class="ct-trang">
        <div class="ct-trang-hinh" style="--pha:${(ls.tt.tuoi / 29.53).toFixed(3)}"></div>
        <div><b>Mặt Trăng ở ${ls.ct.vi} ${ls.ct.ky}</b><small>${ls.tt.ten} · ${ls.tt.zh} · nguyên tố ${ls.ct.nt}</small></div>
      </div>
      <div class="ct-chon">
        <select data-act-change="ct-xem">${CUNG.map((x, i) => `<option value="${i}" ${i === ci ? 'selected' : ''}>${x.ky} ${x.vi}${i === cm ? ' (của Thầy)' : ''}</option>`).join('')}</select>
        ${laThay ? '' : `<button class="nut nho" data-act="ct-ve">Về cung của Thầy</button>`}
        <button class="nut-chu" data-act="ct-doi">${cm == null ? 'Đặt cung của Thầy' : 'Đổi cung của Thầy'}</button>
      </div>
    </section>
    <section class="the-giay ct-ket-qua">
      <div class="ct-dau"><div><small class="mo">Vận trình ${ls.ymd === homNay() ? 'hôm nay' : 'ngày ' + ngayVN(ls.ymd)}</small><h2>${c.vi} ${saoHTML(ls.tong)}</h2></div>
        <div class="nhom-nut"><button class="nut nho" data-act="ct-ngay" data-d="-1">${ICON.trai}</button><button class="nut nho" data-act="ct-ngay" data-d="0">Hôm nay</button><button class="nut nho" data-act="ct-ngay" data-d="1">${ICON.phai}</button></div></div>
      <p class="ct-nhan-xet">${ls.nhanXet}</p>
      <div class="ct-mat">${ls.mat.map(m => `<div class="ct-mat-o"><div class="ct-mat-dau"><span>${ICON[m.icon] || ''}<b>${m.ten}</b> <small>${m.zh}</small></span>${saoHTML(m.sao)}</div><p>${m.loiBinh}</p></div>`).join('')}</div>
      <div class="ct-may">
        <div><small>Màu may mắn</small><b><i class="ct-mau" style="background:${ls.mau[1]}"></i>${ls.mau[0]}</b></div>
        <div><small>Con số</small><b>${ls.so}</b></div>
        <div><small>Giờ tốt</small><b>${ls.gio}</b></div>
        <div><small>Hợp với</small><b>${ls.hop.ky} ${ls.hop.vi}</b></div>
      </div>
      <div class="lt-kh"><small>Lời khuyên cho ${laThay ? 'Thầy' : 'cung ' + c.vi}</small>${ls.khuyen}</div>
      <div class="ct-cau"><p class="lt-zh nho">${esc(ls.cau.zh)}</p><p class="lt-py">${esc(ls.cau.py)}</p><p class="mo nho">${esc(ls.cau.nghia)}</p></div>
      ${laThay && ls.ymd === homNay() ? `<div class="nhom-nut giua"><button class="nut" data-act="ct-thanh-viec">${ICON['cong-viec']} Thêm lời khuyên vào việc hôm nay</button></div>` : ''}
      <p class="mo nho ct-ghi">Vị trí Mặt Trăng tính theo thiên văn; lời bình chỉ để tham khảo cho vui, mỗi ngày đổi một lần.</p>
    </section>
  </div>`;
}

function chonCungHTML() {
  return `<section class="the-giay ct-chon-cung">
    <h2>Thầy thuộc cung nào?</h2><p class="mo">Chọn cung hoặc nhập ngày sinh, web sẽ nhớ cho lần sau.</p>
    <div class="ct-luoi-cung">${CUNG.map((c, i) => `<button class="ct-nut-cung" data-act="ct-dat" data-i="${i}"><span class="ct-ky nho">${c.ky}</span><b>${c.vi}</b><small>${c.zh}</small><small class="mo">${c.tu} – ${c.den}</small></button>`).join('')}</div>
    <form class="form ct-ngay-sinh" data-form="ct-ns"><label>Hoặc nhập ngày sinh<input type="date" name="ns" required></label><button class="nut chinh">Xem cung</button></form>
  </section>`;
}

function theCTHomNay() {
  const ci = cungThay(); if (ci == null) return '';
  const ls = laSoNgay(ci, homNay());
  return `<div class="ct-mini"><span>${ls.c.ky} ${ls.c.vi} ${saoHTML(ls.tong)}</span><small>${ls.khuyen}</small></div>`;
}
