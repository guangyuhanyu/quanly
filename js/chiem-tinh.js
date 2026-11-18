/* CHIÊM TINH — lá số cá nhân + vận trình theo góc chiếu thật.
   Vị trí hành tinh tính bằng Astronomy Engine (vendor/astronomy.min.js, sai số < 1 phút góc).
   Nhà: hệ Whole Sign (mỗi cung một nhà, tính từ cung Mọc).
   Lá số gốc lưu trong cai_dat 'la_so_goc' (không cần sửa Supabase). */

const CUNG = [
  { vi: 'Bạch Dương', zh: '白羊座', py: 'Báiyáng zuò', ky: '♈', tu: '21/3', den: '19/4', nt: 'Lửa', sao: 'Hoả tinh', tinh: 'nhiệt huyết, dám nghĩ dám làm, thích mở đầu việc mới' },
  { vi: 'Kim Ngưu', zh: '金牛座', py: 'Jīnniú zuò', ky: '♉', tu: '20/4', den: '20/5', nt: 'Đất', sao: 'Kim tinh', tinh: 'kiên nhẫn, chắc chắn, trân trọng cái đẹp và sự ổn định' },
  { vi: 'Song Tử', zh: '双子座', py: 'Shuāngzǐ zuò', ky: '♊', tu: '21/5', den: '20/6', nt: 'Khí', sao: 'Thuỷ tinh', tinh: 'lanh lợi, giỏi ăn nói, tò mò với mọi điều mới' },
  { vi: 'Cự Giải', zh: '巨蟹座', py: 'Jùxiè zuò', ky: '♋', tu: '21/6', den: '22/7', nt: 'Nước', sao: 'Mặt Trăng', tinh: 'tình cảm, chu đáo, luôn muốn che chở người thân' },
  { vi: 'Sư Tử', zh: '狮子座', py: 'Shīzi zuò', ky: '♌', tu: '23/7', den: '22/8', nt: 'Lửa', sao: 'Mặt Trời', tinh: 'tự tin, hào phóng, có sức hút khi đứng trước đám đông' },
  { vi: 'Xử Nữ', zh: '处女座', py: 'Chǔnǚ zuò', ky: '♍', tu: '23/8', den: '22/9', nt: 'Đất', sao: 'Thuỷ tinh', tinh: 'tỉ mỉ, cầu toàn, giỏi sắp xếp và chăm lo chi tiết' },
  { vi: 'Thiên Bình', zh: '天秤座', py: 'Tiānchèng zuò', ky: '♎', tu: '23/9', den: '22/10', nt: 'Khí', sao: 'Kim tinh', tinh: 'hoà nhã, công bằng, có gu thẩm mỹ tinh tế' },
  { vi: 'Bọ Cạp', zh: '天蝎座', py: 'Tiānxiē zuò', ky: '♏', tu: '23/10', den: '21/11', nt: 'Nước', sao: 'Diêm Vương tinh', tinh: 'sâu sắc, bền bỉ, đã quyết thì theo đến cùng' },
  { vi: 'Nhân Mã', zh: '射手座', py: 'Shèshǒu zuò', ky: '♐', tu: '22/11', den: '21/12', nt: 'Lửa', sao: 'Mộc tinh', tinh: 'phóng khoáng, lạc quan, mê học hỏi và đi xa' },
  { vi: 'Ma Kết', zh: '摩羯座', py: 'Mójié zuò', ky: '♑', tu: '22/12', den: '19/1', nt: 'Đất', sao: 'Thổ tinh', tinh: 'kỷ luật, có trách nhiệm, đi chậm mà chắc' },
  { vi: 'Bảo Bình', zh: '水瓶座', py: 'Shuǐpíng zuò', ky: '♒', tu: '20/1', den: '18/2', nt: 'Khí', sao: 'Thiên Vương tinh', tinh: 'độc lập, sáng tạo, hay có ý tưởng khác người' },
  { vi: 'Song Ngư', zh: '双鱼座', py: 'Shuāngyú zuò', ky: '♓', tu: '19/2', den: '20/3', nt: 'Nước', sao: 'Hải Vương tinh', tinh: 'giàu cảm xúc, mơ mộng, dễ đồng cảm với người khác' },
];
CUNG.forEach(c => { c.ky += '︎'; });
const NT_ZH = { 'Lửa': '火', 'Đất': '土', 'Khí': '风', 'Nước': '水' };

const HT = {   // hành tinh
  Sun:     { vi: 'Mặt Trời', zh: '太阳', ky: '☉', sanh: 0.5, luc: 0.8, orb: 2.5, goc: 'bản thân và sức sống', mat: { cv: 1, sk: 1 } },
  Moon:    { vi: 'Mặt Trăng', zh: '月亮', ky: '☽', sanh: 0.3, luc: 0.5, orb: 6, goc: 'cảm xúc và gia đình', mat: { sk: 1, tcm: 1 } },
  Mercury: { vi: 'Thuỷ tinh', zh: '水星', ky: '☿', sanh: 0.3, luc: 0.7, orb: 2.5, goc: 'việc giảng dạy và giao tiếp', mat: { cv: 1.2 } },
  Venus:   { vi: 'Kim tinh', zh: '金星', ky: '♀', sanh: 1, luc: 0.9, orb: 2.5, goc: 'tình cảm và tiền bạc', mat: { tc: 1, tcm: 1 } },
  Mars:    { vi: 'Hoả tinh', zh: '火星', ky: '♂', sanh: -0.6, luc: 1, orb: 2, goc: 'năng lượng và hành động', mat: { sk: 1, cv: 0.6 } },
  Jupiter: { vi: 'Mộc tinh', zh: '木星', ky: '♃', sanh: 1, luc: 1, orb: 1.5, goc: 'cơ hội và việc học', mat: { tc: 0.8, cv: 0.6 } },
  Saturn:  { vi: 'Thổ tinh', zh: '土星', ky: '♄', sanh: -0.8, luc: 1.1, orb: 1.5, goc: 'trách nhiệm và kế hoạch dài hạn', mat: { cv: 1 } },
  Uranus:  { vi: 'Thiên Vương', zh: '天王星', ky: '♅', sanh: -0.3, luc: 0.8, orb: 1, mat: {} },
  Neptune: { vi: 'Hải Vương', zh: '海王星', ky: '♆', sanh: -0.2, luc: 0.8, orb: 1, mat: {} },
  Pluto:   { vi: 'Diêm Vương', zh: '冥王星', ky: '♇', sanh: -0.4, luc: 0.8, orb: 1, mat: {} },
  Asc:     { vi: 'Cung Mọc', zh: '上升', ky: 'AC', goc: 'hình ảnh bản thân và sức khoẻ', mat: { sk: 1, tcm: 0.4 } },
};
Object.values(HT).forEach(h => { if (h.ky.length === 1) h.ky += '︎'; });
const GOC_NATAL = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
const GOC_CHAM = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Asc'];   // điểm gốc được tính góc chiếu
const GOC_CHIEU = [
  { do: 0, vi: 'hợp', zh: '合相', tone: null },
  { do: 60, vi: 'lục hợp', zh: '六合', tone: 0.7 },
  { do: 90, vi: 'vuông góc', zh: '刑', tone: -0.8 },
  { do: 120, vi: 'tam hợp', zh: '三合', tone: 1 },
  { do: 180, vi: 'xung chiếu', zh: '冲', tone: -0.7 },
];
const TP_TXT = {
  Sun: ['được chú ý, tự tin, làm việc có kết quả', 'dễ cái tôi cao, mệt vì gồng gánh'],
  Moon: ['cảm xúc dễ chịu, dễ đồng cảm với người khác', 'tâm trạng thất thường, dễ nhạy cảm'],
  Mercury: ['nói năng trôi chảy, hợp giảng bài, nhắn tin, giấy tờ', 'dễ hiểu lầm, sơ suất chữ nghĩa và lịch hẹn'],
  Venus: ['được quý mến, thuận tiền bạc và các mối quan hệ', 'dễ chi tiêu quá tay, nuông chiều bản thân'],
  Mars: ['nhiều năng lượng, quyết đoán, làm nhanh', 'nóng vội, dễ va chạm, cẩn thận đau mỏi'],
  Jupiter: ['may mắn, mở rộng, có người giúp', 'dễ ôm đồm, hứa quá sức'],
  Saturn: ['kỷ luật, làm chắc chắn, được ghi nhận nhờ bền bỉ', 'áp lực, chậm trễ, thấy nặng nề'],
  Uranus: ['ý tưởng mới, thay đổi tích cực bất ngờ', 'xáo trộn bất ngờ, khó kiên nhẫn'],
  Neptune: ['cảm hứng, trực giác, lòng trắc ẩn', 'mơ hồ, dễ nhầm lẫn, thiếu tập trung'],
  Pluto: ['chuyển hoá sâu, nội lực mạnh', 'căng thẳng ngầm, muốn kiểm soát'],
};
const KHUYEN_TP = {
  Sun: ['Chủ động nhận việc quan trọng, hôm nay Thầy dễ toả sáng.', 'Bớt ôm việc một mình, nhờ người khác hỗ trợ.'],
  Moon: ['Lắng nghe cảm xúc, hợp dành thời gian cho gia đình.', 'Đừng quyết định khi đang bực, để mai tính.'],
  Mercury: ['Hợp dạy bài mới, soạn giáo án, gửi tin nhắn quan trọng.', 'Đọc lại tin nhắn, link Zoom và lịch hẹn trước khi gửi.'],
  Venus: ['Hợp gửi tin gia hạn, hỏi thăm học viên, tự thưởng một món nhỏ.', 'Giữ ví chặt, món nào chưa cần thì để tuần sau.'],
  Mars: ['Dồn sức cho việc khó nhất, làm ngay buổi sáng.', 'Nói chậm lại, tránh tranh cãi, vận động nhẹ để xả năng lượng.'],
  Jupiter: ['Mạnh dạn lên kế hoạch mở lớp, đón cơ hội mới.', 'Đừng hứa quá sức, chọn ít việc nhưng làm tới nơi.'],
  Saturn: ['Làm theo kế hoạch, việc bền bỉ hôm nay sẽ được ghi nhận.', 'Chấp nhận chậm, chia việc nhỏ, đừng tự trách mình.'],
  Uranus: ['Thử một cách dạy mới, đổi không khí lớp học.', 'Chuẩn bị phương án dự phòng cho thay đổi bất ngờ.'],
  Neptune: ['Dành thời gian cho sáng tạo, viết, nghe nhạc.', 'Kiểm tra kỹ thông tin, đừng tin lời hứa mơ hồ.'],
  Pluto: ['Xử lý dứt điểm một việc tồn đọng.', 'Buông bớt kiểm soát, không phải việc gì cũng cần hoàn hảo.'],
};
const NHA = ['', 'bản thân', 'tiền bạc', 'giao tiếp, học hành', 'gia đình, nhà cửa', 'sáng tạo, niềm vui', 'công việc hằng ngày, sức khoẻ', 'đối tác, quan hệ', 'tài chính chung, chuyển hoá', 'học vấn, đi xa', 'sự nghiệp, uy tín', 'bạn bè, cộng đồng', 'nghỉ ngơi, nội tâm'];
const NHA_MAT = { cv: [10, 6], tc: [2, 8], sk: [1, 6], tcm: [7, 5, 4] };
const MAT_CT = [
  { k: 'cv', ten: 'Công việc & dạy học', zh: '事业', icon: 'lop' },
  { k: 'tc', ten: 'Tài chính', zh: '财运', icon: 'tui-gam' },
  { k: 'sk', ten: 'Sức khoẻ', zh: '健康', icon: 'tra' },
  { k: 'tcm', ten: 'Tình cảm & quan hệ', zh: '人际', icon: 'hoc-vien' },
];
const CHU_NGAY = [   // hành tinh chủ ngày: CN → T7
  { p: 'Sun', mau: ['Vàng kim', '#D19A2A'], so: 1 }, { p: 'Moon', mau: ['Trắng bạc', '#C9CED6'], so: 2 },
  { p: 'Mars', mau: ['Đỏ son', '#B23A2E'], so: 9 }, { p: 'Mercury', mau: ['Xanh lá', '#4E8A4A'], so: 5 },
  { p: 'Jupiter', mau: ['Tím', '#7A5AA8'], so: 3 }, { p: 'Venus', mau: ['Hồng đào', '#E08A8A'], so: 6 },
  { p: 'Saturn', mau: ['Xanh đen', '#2F3B52'], so: 8 },
];
const CHALDEAN = ['Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon'];

const TINH = [  // 63 tỉnh thành (tên trước sáp nhập 2025, dùng cho nơi sinh)
  ['An Giang', 10.38, 105.43], ['Bà Rịa – Vũng Tàu', 10.35, 107.08], ['Bắc Giang', 21.27, 106.19], ['Bắc Kạn', 22.15, 105.83], ['Bạc Liêu', 9.29, 105.72], ['Bắc Ninh', 21.18, 106.07], ['Bến Tre', 10.24, 106.38], ['Bình Định', 13.78, 109.22], ['Bình Dương', 10.98, 106.65], ['Bình Phước', 11.53, 106.88], ['Bình Thuận', 10.93, 108.10], ['Cà Mau', 9.18, 105.15], ['Cần Thơ', 10.03, 105.78], ['Cao Bằng', 22.67, 106.26], ['Đà Nẵng', 16.05, 108.20], ['Đắk Lắk', 12.67, 108.04], ['Đắk Nông', 12.00, 107.69], ['Điện Biên', 21.39, 103.02], ['Đồng Nai', 10.95, 106.82], ['Đồng Tháp', 10.46, 105.63], ['Gia Lai', 13.98, 108.00], ['Hà Giang', 22.82, 104.98], ['Hà Nam', 20.54, 105.91], ['Hà Nội', 21.03, 105.85], ['Hà Tĩnh', 18.34, 105.91], ['Hải Dương', 20.94, 106.33], ['Hải Phòng', 20.86, 106.68], ['Hậu Giang', 9.78, 105.47], ['Hoà Bình', 20.82, 105.34], ['Hưng Yên', 20.65, 106.05], ['Khánh Hoà', 12.24, 109.19], ['Kiên Giang', 10.01, 105.08], ['Kon Tum', 14.35, 108.00], ['Lai Châu', 22.40, 103.46], ['Lâm Đồng', 11.94, 108.44], ['Lạng Sơn', 21.85, 106.76], ['Lào Cai', 22.49, 103.97], ['Long An', 10.54, 106.41], ['Nam Định', 20.43, 106.18], ['Nghệ An', 18.68, 105.68], ['Ninh Bình', 20.25, 105.97], ['Ninh Thuận', 11.57, 108.99], ['Phú Thọ', 21.32, 105.40], ['Phú Yên', 13.10, 109.30], ['Quảng Bình', 17.47, 106.62], ['Quảng Nam', 15.57, 108.47], ['Quảng Ngãi', 15.12, 108.80], ['Quảng Ninh', 20.95, 107.08], ['Quảng Trị', 16.82, 107.10], ['Sóc Trăng', 9.60, 105.97], ['Sơn La', 21.33, 103.91], ['Tây Ninh', 11.31, 106.10], ['Thái Bình', 20.45, 106.34], ['Thái Nguyên', 21.59, 105.85], ['Thanh Hoá', 19.81, 105.78], ['Thừa Thiên Huế', 16.46, 107.59], ['Tiền Giang', 10.36, 106.36], ['TP. Hồ Chí Minh', 10.78, 106.70], ['Trà Vinh', 9.93, 106.35], ['Tuyên Quang', 21.82, 105.21], ['Vĩnh Long', 10.25, 105.97], ['Vĩnh Phúc', 21.31, 105.60], ['Yên Bái', 21.72, 104.91],
];
const toaDo = ten => TINH.find(t => t[0] === ten) || TINH.find(t => t[0] === 'Lâm Đồng');

/* ----- thiên văn ----- */
const AE = () => window.Astronomy;
const D2R = Math.PI / 180, R2D = 180 / Math.PI, chuan = x => ((x % 360) + 360) % 360;
const cungCua = lon => Math.floor(chuan(lon) / 30);
const doTrongCung = lon => chuan(lon) % 30;
const thoiDiem = (ymd, hm) => AE().MakeTime(new Date(`${ymd}T${hm || '12:00'}:00+07:00`));
function kinhDo(body, t) {
  const A = AE();
  if (body === 'Sun') return A.SunPosition(t).elon;
  if (body === 'Moon') return A.EclipticGeoMoon(t).lon;
  return A.Ecliptic(A.GeoVector(body, t, true)).elon;
}
function cungMoc(t, lat, lon) {
  const eps = 23.4392911 * D2R, ramc = chuan(AE().SiderealTime(t) * 15 + lon) * D2R, f = lat * D2R;
  return chuan(Math.atan2(Math.cos(ramc), -(Math.sin(ramc) * Math.cos(eps) + Math.tan(f) * Math.sin(eps))) * R2D);
}
const lechGoc = (a, b) => { const d = Math.abs(chuan(a - b)); return d > 180 ? 360 - d : d; };
const hm2p = hm => { const [h, m] = hm.split(':').map(Number); return h * 60 + m; };
const p2hm = p => `${String(Math.floor(p / 60) % 24).padStart(2, '0')}:${String(Math.round(p % 60)).padStart(2, '0')}`;
const gioVN = t => { const d = new Date(t.date.getTime() + 7 * 3600e3); return `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`; };
const ngayVNcua = t => new Date(t.date.getTime() + 7 * 3600e3).toISOString().slice(0, 10);

/* ----- lá số gốc ----- */
const thongTinGoc = () => caiDat('la_so_goc', null);
let _laSoCache = { k: null, v: null };
function laSoGoc() {
  const g = thongTinGoc(); if (!g || !g.ngay || !AE()) return null;
  const k = JSON.stringify(g); if (_laSoCache.k === k) return _laSoCache.v;
  const coGio = !!g.gio_tu;
  const gioGiua = coGio ? p2hm(g.gio_den ? (hm2p(g.gio_tu) + hm2p(g.gio_den)) / 2 : hm2p(g.gio_tu)) : '12:00';
  const [, lat, lon] = toaDo(g.noi_sinh);
  const t = thoiDiem(g.ngay, gioGiua);
  const diem = {};
  GOC_NATAL.forEach(b => {
    const l = kinhDo(b, t), l2 = kinhDo(b, t.AddDays(1 / 24));
    diem[b] = { lon: l, nghich: b !== 'Sun' && b !== 'Moon' && chuan(l2 - l) > 180 };
  });
  let moc = null, mocKhac = null;
  if (coGio) {
    moc = cungMoc(t, lat, lon); diem.Asc = { lon: moc };
    const c1 = cungCua(cungMoc(thoiDiem(g.ngay, g.gio_tu), lat, lon)), c2 = cungCua(cungMoc(thoiDiem(g.ngay, g.gio_den || g.gio_tu), lat, lon));
    if (c1 !== c2) mocKhac = [c1, c2];
  }
  // Mặt Trăng đổi cung trong ngày sinh khi không rõ giờ?
  let trangKhac = null;
  if (!coGio) { const a = cungCua(kinhDo('Moon', thoiDiem(g.ngay, '00:00'))), b = cungCua(kinhDo('Moon', thoiDiem(g.ngay, '23:59'))); if (a !== b) trangKhac = [a, b]; }
  const ascCung = moc != null ? cungCua(moc) : null;
  const nha = lon => ascCung == null ? null : ((cungCua(lon) - ascCung + 12) % 12) + 1;
  const v = { g, coGio, gioGiua, diem, moc, mocKhac, trangKhac, ascCung, nha, mt: cungCua(diem.Sun.lon), tr: cungCua(diem.Moon.lon) };
  _laSoCache = { k, v }; return v;
}
const cungThay = () => { const ls = laSoGoc(); return ls ? ls.mt : null; };

/* ----- vận trình theo ngày ----- */
const _vtCache = new Map();
function vanTrinh(ymd) {
  const ls = laSoGoc(); if (!ls) return null;
  const key = ymd + '|' + JSON.stringify(ls.g); if (_vtCache.has(key)) return _vtCache.get(key);
  const t = thoiDiem(ymd, '12:00'), t2 = t.AddDays(1);
  const qua = {};
  GOC_NATAL.forEach(b => { const l = kinhDo(b, t); qua[b] = { lon: l, nghich: b !== 'Sun' && b !== 'Moon' && chuan(kinhDo(b, t2) - l) > 180 }; });

  // góc chiếu: hành tinh hôm nay → điểm gốc
  const chieu = [];
  GOC_NATAL.forEach(tb => GOC_CHAM.forEach(nb => {
    if (!ls.diem[nb]) return;
    const d = lechGoc(qua[tb].lon, ls.diem[nb].lon);
    GOC_CHIEU.forEach(a => {
      const orb = Math.abs(d - a.do); if (orb > HT[tb].orb) return;
      let tone = a.tone == null ? HT[tb].sanh : a.tone;
      if ((tb === 'Venus' || tb === 'Jupiter') && tone < 0) tone *= 0.4;
      if ((tb === 'Saturn' || tb === 'Mars' || tb === 'Pluto') && tone > 0 && a.do === 0) tone = -0.4;
      const diem = HT[tb].luc * tone * (1 - 0.5 * orb / HT[tb].orb);
      const tot = tone >= 0;
      chieu.push({ tb, nb, a, orb, diem, tot,
        cau: `${HT[tb].vi} ${a.vi} ${HT[nb].vi} gốc: ${TP_TXT[tb][tot ? 0 : 1]}, chạm tới ${HT[nb].goc}.`,
        ngan: `${HT[tb].ky} ${a.zh} ${HT[nb].ky}` });
    });
  }));
  chieu.sort((x, y) => Math.abs(y.diem) - Math.abs(x.diem));

  // điểm 4 mặt
  const trangNha = ls.nha(qua.Moon.lon);
  const mat = MAT_CT.map(m => {
    let s = 3; const lienQuan = [];
    chieu.forEach(c => { const w = (HT[c.nb].mat[m.k] || 0) + (HT[c.tb].mat[m.k] || 0) * 0.35; if (w) { s += c.diem * (c.diem > 0 ? 0.65 : 1.15) * w * 0.9; if ((HT[c.nb].mat[m.k] || 0) >= 0.6) lienQuan.push(c); } });
    if (trangNha && NHA_MAT[m.k].includes(trangNha)) s += 0.3;
    if (m.k === 'cv' && qua.Mercury.nghich) s -= 0.4;
    const sao = Math.max(1, Math.min(5, Math.round(s)));
    const c = lienQuan[0];
    const loi = c ? c.cau : ['', 'Ngày khá nặng nề cho mặt này, làm chậm và chắc.', 'Không có góc chiếu nổi bật, cần chủ động hơn một chút.', 'Không có góc chiếu đặc biệt, mọi việc diễn ra bình thường.', 'Bầu trời khá ủng hộ, cứ tiến hành theo kế hoạch.', 'Rất thuận lợi.'][sao];
    return { ...m, sao, loi, ly: c ? c.ngan : '' };
  });
  const tong = Math.max(1, Math.min(5, Math.round(mat.reduce((a, m) => a + m.sao, 0) / 4)));

  // trăng, tuần trăng, nghịch hành
  const pha = AE().MoonPhase(t);
  const tenPha = pha < 22.5 || pha >= 337.5 ? ['Trăng non', '新月'] : pha < 67.5 ? ['Trăng lưỡi liềm', '蛾眉月'] : pha < 112.5 ? ['Trăng thượng huyền', '上弦月'] : pha < 157.5 ? ['Trăng gần tròn', '盈凸月'] : pha < 202.5 ? ['Trăng tròn', '满月'] : pha < 247.5 ? ['Trăng bắt đầu khuyết', '亏凸月'] : pha < 292.5 ? ['Trăng hạ huyền', '下弦月'] : ['Trăng tàn', '残月'];
  const nghich = ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'].filter(b => qua[b].nghich);
  const suKien = [];
  if (qua.Mercury.nghich) suKien.push({ ky: HT.Mercury.ky, tieu: 'Thuỷ tinh nghịch hành 水星逆行', mo: 'Dễ trục trặc mạng, lịch hẹn, tin nhắn, giấy tờ. Kiểm tra kỹ link Zoom; hợp ôn tập hơn là bắt đầu chương trình mới.' });
  nghich.filter(b => b !== 'Mercury').forEach(b => suKien.push({ ky: HT[b].ky, tieu: `${HT[b].vi} nghịch hành`, mo: `Các việc liên quan tới ${HT[b].goc} nên rà soát lại thay vì khởi sự lớn.` }));
  const tiepTheo = [0, 180].map(p => { const e = AE().SearchMoonPhase(p, thoiDiem(ymd, '00:00'), 35); const l = kinhDo('Moon', e); return { p, t: e, ngay: ngayVNcua(e), cung: cungCua(l), nha: ls.nha(l) }; }).sort((a, b) => a.t.ut - b.t.ut)[0];
  if (tiepTheo && tiepTheo.ngay === ymd) suKien.unshift({ ky: tiepTheo.p ? '○' : '●', tieu: `${tiepTheo.p ? 'Trăng tròn 满月' : 'Trăng non 新月'} lúc ${gioVN(tiepTheo.t)}`, mo: tiepTheo.p ? `Đỉnh điểm của một chu kỳ ở cung ${CUNG[tiepTheo.cung].vi}${tiepTheo.nha ? `, nhà ${tiepTheo.nha} (${NHA[tiepTheo.nha]})` : ''}. Hợp tổng kết, hoàn thành việc dở.` : `Khởi đầu chu kỳ mới ở cung ${CUNG[tiepTheo.cung].vi}${tiepTheo.nha ? `, nhà ${tiepTheo.nha} (${NHA[tiepTheo.nha]})` : ''}. Hợp đặt mục tiêu mới.` });

  const voc = trangVoHuong(ymd);
  if (voc) suKien.push({ ky: HT.Moon.ky, tieu: `Trăng vô hướng 月空 ${voc.tu}–${voc.den}`, mo: 'Khoảng giờ nên tránh chốt việc quan trọng, ký kết, mở khoá học mới; hợp nghỉ ngơi, ôn bài, việc thường ngày.' });

  // ngày, giờ hành tinh
  const thu = s2d(ymd).getDay(), cn = CHU_NGAY[thu];
  const [, lat, lon] = toaDo(ls.g.noi_o || ls.g.noi_sinh);
  const gioTot = gioHanhTinh(ymd, lat, lon, cn.p);

  // lời khuyên: từ góc chiếu mạnh nhất
  const nhanh = ['Sun', 'Mercury', 'Venus', 'Mars'];
  const c0 = chieu.find(c => nhanh.includes(c.tb)) || chieu.find(c => c.tb !== 'Moon') || chieu[0];
  const khuyen = c0 ? KHUYEN_TP[c0.tb][c0.tot ? 0 : 1] : 'Bầu trời yên ả, giữ nhịp đều đặn và chăm lo những việc thường ngày.';
  const cau = LA_THAM[(Math.floor(s2d(ymd).getTime() / 864e5) * 7 + ls.mt) % LA_THAM.length];

  const v = { ymd, ls, qua, chieu, mat, tong, pha, tenPha, trangCung: cungCua(qua.Moon.lon), trangNha, suKien, tiepTheo, cn, gioTot, khuyen, cau, c0 };
  _vtCache.set(key, v); return v;
}
const laSoNgay = (ci, ymd) => vanTrinh(ymd);

/* Trăng vô hướng: từ góc chiếu chính cuối cùng của Mặt Trăng (với Mặt Trời → Thổ tinh) đến lúc vào cung mới */
function trangVoHuong(ymd) {
  const A = AE(), dau = thoiDiem(ymd, '00:00'), cuoi = dau.AddDays(1);
  const bodies = ['Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];
  const buoc = 1 / 24, mau = [];
  for (let i = -60; i <= 84; i++) { const t = dau.AddDays(i * buoc); const o = { t, m: kinhDo('Moon', t) }; bodies.forEach(b => o[b] = kinhDo(b, t)); mau.push(o); }
  const ketQua = [];
  for (let i = 1; i < mau.length; i++) {
    if (cungCua(mau[i].m) === cungCua(mau[i - 1].m)) continue;
    // tìm phút vào cung
    let a = mau[i - 1].t, b = mau[i].t, c0 = cungCua(mau[i - 1].m);
    for (let k = 0; k < 12; k++) { const m = a.AddDays((b.ut - a.ut) / 2); if (cungCua(kinhDo('Moon', m)) === c0) a = m; else b = m; }
    const vao = b;
    // góc chiếu cuối cùng trước khi vào cung (trong cung cũ)
    let cuoiCung = null;
    for (let j = i - 1; j > 0 && cungCua(mau[j].m) === c0; j--) {
      for (const bd of bodies) for (const g of [0, 60, 90, 120, 180]) {
        const f = o => { let d = chuan(o.m - o[bd]); if (d > 180) d -= 360; return Math.abs(d) - g; };
        const f1 = f(mau[j - 1]), f2 = f(mau[j]);
        if (Math.sign(f1) !== Math.sign(f2) && Math.abs(f1) < 8 && Math.abs(f2) < 8) {
          const tg = mau[j - 1].t.AddDays(buoc * Math.abs(f1) / (Math.abs(f1) + Math.abs(f2)));
          if (!cuoiCung || tg.ut > cuoiCung.ut) cuoiCung = tg;
        }
      }
      if (cuoiCung) break;
    }
    if (!cuoiCung) continue;
    if (vao.ut > dau.ut && cuoiCung.ut < cuoi.ut) ketQua.push({ tu: cuoiCung.ut < dau.ut ? '00:00' : gioVN(cuoiCung), den: vao.ut > cuoi.ut ? '24:00' : gioVN(vao), phut: (Math.min(vao.ut, cuoi.ut) - Math.max(cuoiCung.ut, dau.ut)) * 1440 });
  }
  const lon = ketQua.filter(x => x.phut >= 20).sort((a, b) => b.phut - a.phut)[0];
  return lon || null;
}

/* Giờ hành tinh: chia ngày (bình minh → hoàng hôn) và đêm thành 12 phần; giờ Mộc tinh & Kim tinh là giờ tốt */
function gioHanhTinh(ymd, lat, lon, chuNgay) {
  const A = AE(), obs = new A.Observer(lat, lon, 0), dau = thoiDiem(ymd, '00:00');
  const moc = A.SearchRiseSet('Sun', obs, +1, dau, 1), lan = moc && A.SearchRiseSet('Sun', obs, -1, moc, 1), moc2 = lan && A.SearchRiseSet('Sun', obs, +1, lan, 1);
  if (!moc || !lan || !moc2) return [];
  const bd = CHALDEAN.indexOf(chuNgay), ds = [];
  for (let i = 0; i < 24; i++) {
    const [a, b] = i < 12 ? [moc.ut + (lan.ut - moc.ut) * i / 12, moc.ut + (lan.ut - moc.ut) * (i + 1) / 12] : [lan.ut + (moc2.ut - lan.ut) * (i - 12) / 12, lan.ut + (moc2.ut - lan.ut) * (i - 11) / 12];
    ds.push({ p: CHALDEAN[(bd + i) % 7], tu: gioVN(A.MakeTime(a)), den: gioVN(A.MakeTime(b)) });
  }
  return ds.filter(x => (x.p === 'Jupiter' || x.p === 'Venus') && hm2p(x.tu) >= 360 && hm2p(x.tu) <= 1350);
}

/* ----- giao diện ----- */
const saoHTML = n => `<span class="ct-sao" aria-label="${n}/5">${'★'.repeat(n)}<i>${'★'.repeat(5 - n)}</i></span>`;
const doHTML = lon => { const d = doTrongCung(lon); return `${Math.floor(d)}°${String(Math.floor((d % 1) * 60)).padStart(2, '0')}′`; };

function banDoSao(ls, vt) {
  const S0 = 320, c = S0 / 2, goc0 = ls.moc != null ? ls.moc : 0;
  const xy = (lon, r) => { const a = (180 + chuan(lon - goc0)) * D2R; return [c + r * Math.cos(a), c - r * Math.sin(a)]; };
  const vong = [];
  for (let i = 0; i < 12; i++) {
    const [x1, y1] = xy(i * 30, 150), [x2, y2] = xy(i * 30, 118), [tx, ty] = xy(i * 30 + 15, 134);
    vong.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/><text x="${tx}" y="${ty}" class="bd-cung" fill="var(--mau-${CUNG[i].nt === 'Lửa' ? 'lua' : CUNG[i].nt === 'Đất' ? 'dat' : CUNG[i].nt === 'Khí' ? 'khi' : 'nuoc'})">${CUNG[i].ky}</text>`);
    if (ls.ascCung != null) { const [hx, hy] = xy(i * 30 + 15, 106); vong.push(`<text x="${hx}" y="${hy}" class="bd-nha">${((i - ls.ascCung + 12) % 12) + 1}</text>`); }
  }
  const datDiem = (ds, r, lop) => {
    const sap = ds.map(([k, l]) => ({ k, l })).sort((a, b) => chuan(a.l - goc0) - chuan(b.l - goc0));
    let truoc = -99, tang = 0;
    return sap.map(o => { const a = chuan(o.l - goc0); tang = a - truoc < 7 ? tang + 1 : 0; truoc = a; const [x, y] = xy(o.l, r - (tang % 2) * 14); const [x2, y2] = xy(o.l, r + 9); return `<line x1="${x}" y1="${y}" x2="${x2}" y2="${y2}" class="bd-gach"/><text x="${x}" y="${y}" class="${lop}">${HT[o.k].ky}</text>`; }).join('');
  };
  const goc = Object.entries(ls.diem).filter(([k]) => k !== 'Asc').map(([k, v]) => [k, v.lon]);
  const nay = Object.entries(vt.qua).map(([k, v]) => [k, v.lon]);
  const day = vt.chieu.filter(x => x.tb !== 'Moon' || x.orb < 3).slice(0, 6).map(x => { const [a1, b1] = xy(ls.diem[x.nb].lon, 60); const [a2, b2] = xy(vt.qua[x.tb].lon, 60); return `<line x1="${a1}" y1="${b1}" x2="${a2}" y2="${b2}" class="bd-chieu ${x.tot ? 'tot' : 'xau'}"/>`; }).join('');
  const truc = ls.moc != null ? (() => { const [a, b] = xy(ls.moc, 150), [a2, b2] = xy(ls.moc + 180, 150); const [ax, ay] = xy(ls.moc - 6, 108); return `<line x1="${a}" y1="${b}" x2="${a2}" y2="${b2}" class="bd-truc"/><text x="${ax}" y="${ay}" class="bd-ac">AC</text>`; })() : '';
  return `<svg viewBox="0 0 ${S0} ${S0}" class="ban-do-sao" aria-label="Lá số">
    <circle cx="${c}" cy="${c}" r="150" class="bd-vien"/><circle cx="${c}" cy="${c}" r="118" class="bd-vien"/><circle cx="${c}" cy="${c}" r="60" class="bd-trong"/>
    <g class="bd-ke">${vong.join('')}</g>${truc}${day}
    ${datDiem(goc, 90, 'bd-goc')}${datDiem(nay, 45, 'bd-nay')}
  </svg>`;
}

function formLaSo() {
  const g = thongTinGoc() || {};
  const opt = chon => TINH.map(t => `<option ${t[0] === chon ? 'selected' : ''}>${t[0]}</option>`).join('');
  return `<section class="the-giay ct-chon-cung">
    <h2>Lập lá số của Thầy</h2>
    <p class="mo">Web tính vị trí thật của các hành tinh lúc Thầy sinh ra, rồi so với bầu trời mỗi ngày. Thông tin chỉ lưu trong tài khoản của Thầy.</p>
    <form class="form ct-form-ls" data-form="ct-ls">
      <label>Ngày sinh (dương lịch)<input type="date" name="ngay" value="${esc(g.ngay || '')}" required></label>
      <label>Giờ sinh từ<input type="time" name="gio_tu" value="${esc(g.gio_tu || '')}"></label>
      <label>đến <small class="mo">(nếu chỉ nhớ khoảng)</small><input type="time" name="gio_den" value="${esc(g.gio_den || '')}"></label>
      <label>Nơi sinh<select name="noi_sinh">${opt(g.noi_sinh || 'Lâm Đồng')}</select></label>
      <label>Nơi đang sống <small class="mo">(tính giờ tốt)</small><select name="noi_o">${opt(g.noi_o || g.noi_sinh || 'Lâm Đồng')}</select></label>
      <div class="nhom-nut"><button class="nut chinh">Lập lá số</button>${g.ngay ? '<button type="button" class="nut" data-act="ct-huy">Huỷ</button>' : ''}</div>
    </form>
    <p class="mo nho">Không nhớ giờ sinh thì để trống: vẫn xem được, chỉ không có cung Mọc và 12 nhà.</p>
  </section>`;
}
const chonCungHTML = formLaSo;

function vChiemTinh() {
  if (!AE()) return oTrong('Chưa tải được thư viện thiên văn. Thầy tải lại trang (⌥⌘R) nhé.');
  const ls = laSoGoc(); if (!ls) return formLaSo();
  const ymd = RT.ngayCT || homNay(), vt = vanTrinh(ymd);
  const mt = CUNG[ls.mt], tr = CUNG[ls.tr], mc = ls.ascCung != null ? CUNG[ls.ascCung] : null;
  const dong = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'].map(k => { const d = ls.diem[k]; const ci = cungCua(d.lon); return `<div><span><i class="ky-ht">${HT[k].ky}</i>${HT[k].vi} <small>${HT[k].zh}</small></span><span>${CUNG[ci].ky} ${CUNG[ci].vi} ${doHTML(d.lon)}${d.nghich ? ' <b class="ct-r">R</b>' : ''}</span><span>${ls.nha(d.lon) ? 'Nhà ' + ls.nha(d.lon) : ''}</span></div>`; }).join('');
  return `
  <div class="ct-tong-quan">
    <div class="ct-ba">
      <div><small>Mặt Trời · bản chất</small><b>${mt.ky} ${mt.vi}</b><span>${mt.zh}</span></div>
      <div><small>Mặt Trăng · cảm xúc</small><b>${tr.ky} ${tr.vi}</b><span>${tr.zh}</span></div>
      <div><small>Cung Mọc · ấn tượng đầu</small><b>${mc ? `${mc.ky} ${mc.vi}` : '—'}</b><span>${mc ? mc.zh : 'cần giờ sinh'}</span></div>
    </div>
    <p class="ct-tinh">Bản chất ${mt.tinh}; ${mc && ls.ascCung === ls.tr ? `cả nội tâm lẫn vẻ ngoài đều ${tr.tinh}` : `bên trong ${tr.tinh}${mc ? `; người khác thấy Thầy ${mc.tinh}` : ''}`}.</p>
    ${ls.mocKhac ? `<p class="canh-bao nho">Trong khoảng giờ sinh đã nhập, cung Mọc có thể là ${CUNG[ls.mocKhac[0]].vi} hoặc ${CUNG[ls.mocKhac[1]].vi}. Web đang dùng giờ ở giữa.</p>` : ''}
    ${ls.trangKhac ? `<p class="canh-bao nho">Ngày Thầy sinh, Mặt Trăng đổi từ ${CUNG[ls.trangKhac[0]].vi} sang ${CUNG[ls.trangKhac[1]].vi}; cần giờ sinh để biết chính xác.</p>` : ''}
  </div>
  <div class="luoi-2 ct-luoi">
    <section class="the-giay ct-cung">
      <div class="dau-muc"><h2>Lá số 星盘</h2><button class="nut-chu" data-act="ct-doi">Sửa thông tin sinh</button></div>
      ${banDoSao(ls, vt)}
      <p class="mo nho ct-chu-thich"><span class="bd-goc-m">●</span> vòng ngoài: lá số gốc · <span class="bd-nay-m">●</span> vòng trong: hành tinh ngày ${ngayVN(ymd)}</p>
      <div class="ct-bang">${dong}${mc ? `<div><span><i class="ky-ht">AC</i>Cung Mọc <small>上升</small></span><span>${mc.ky} ${mc.vi} ${doHTML(ls.moc)}</span><span>Nhà 1</span></div>` : ''}</div>
      <p class="mo nho">Sinh ${ngayVN(ls.g.ngay)}${ls.coGio ? ` lúc ${ls.g.gio_tu}${ls.g.gio_den ? '–' + ls.g.gio_den : ''}` : ''} · ${esc(ls.g.noi_sinh)} · nhà theo hệ Whole Sign · R = nghịch hành</p>
    </section>
    <section class="the-giay ct-ket-qua">
      <div class="ct-dau"><div><small class="mo">Vận trình ${ymd === homNay() ? 'hôm nay' : 'ngày ' + ngayVN(ymd)} · ${THU[s2d(ymd).getDay()]}</small><h2>Tổng quan ${saoHTML(vt.tong)}</h2></div>
        <div class="nhom-nut"><button class="nut nho" data-act="ct-ngay" data-d="-1">${ICON.trai}</button><button class="nut nho" data-act="ct-ngay" data-d="0">Hôm nay</button><button class="nut nho" data-act="ct-ngay" data-d="1">${ICON.phai}</button></div></div>
      <div class="ct-trang">
        <div class="ct-trang-hinh" style="--pha:${(vt.pha / 360).toFixed(3)}"></div>
        <div><b>Mặt Trăng ở ${CUNG[vt.trangCung].ky} ${CUNG[vt.trangCung].vi}${vt.trangNha ? ` · nhà ${vt.trangNha}` : ''}</b><small>${vt.tenPha[0]} · ${vt.tenPha[1]}${vt.trangNha ? ` · chú ý chuyện ${NHA[vt.trangNha]}` : ''}</small></div>
      </div>
      <div class="ct-mat">${vt.mat.map(m => `<div class="ct-mat-o"><div class="ct-mat-dau"><span>${ICON[m.icon] || ''}<b>${m.ten}</b> <small>${m.zh}</small></span>${saoHTML(m.sao)}</div><p>${m.loi}</p>${m.ly ? `<small class="ct-ly">${m.ly}</small>` : ''}</div>`).join('')}</div>
      ${vt.suKien.length ? `<div class="ct-su-kien">${vt.suKien.map(s => `<div><i>${s.ky}</i><span><b>${s.tieu}</b><small>${s.mo}</small></span></div>`).join('')}</div>` : ''}
      <div class="ct-may">
        <div><small>Chủ ngày</small><b>${HT[vt.cn.p].ky} ${HT[vt.cn.p].vi}</b></div>
        <div><small>Màu hợp</small><b><i class="ct-mau" style="background:${vt.cn.mau[1]}"></i>${vt.cn.mau[0]}</b></div>
        <div><small>Con số</small><b>${vt.cn.so}</b></div>
        <div><small>Giờ tốt</small><b class="ct-gio">${vt.gioTot.slice(0, 3).map(g => `${g.tu}–${g.den}`).join('<br>') || '—'}</b></div>
      </div>
      <div class="lt-kh"><small>Lời khuyên cho Thầy</small>${vt.khuyen}${vt.c0 ? `<em class="ct-vi-sao">Vì: ${vt.c0.cau}</em>` : ''}</div>
      ${vt.chieu.length > 1 ? `<details class="ct-chi-tiet"><summary>Tất cả góc chiếu hôm nay (${vt.chieu.length})</summary>${vt.chieu.map(c => `<p class="${c.tot ? 'tot' : 'xau'}"><b>${c.ngan}</b> ${c.cau} <small class="mo">lệch ${c.orb.toFixed(1)}°</small></p>`).join('')}</details>` : ''}
      <div class="ct-cau"><p class="lt-zh nho">${esc(vt.cau.zh)}</p><p class="lt-py">${esc(vt.cau.py)}</p><p class="mo nho">${esc(vt.cau.nghia)}</p></div>
      ${ymd === homNay() ? `<div class="nhom-nut giua"><button class="nut" data-act="ct-thanh-viec">${ICON['cong-viec']} Thêm lời khuyên vào việc hôm nay</button></div>` : ''}
      <p class="mo nho ct-ghi">Vị trí hành tinh tính theo thiên văn (Astronomy Engine). Lời luận dựa trên phương pháp chiêm tinh phương Tây, chỉ để tham khảo.</p>
    </section>
  </div>`;
}

function theCTHomNay() {
  const vt = AE() && vanTrinh(homNay()); if (!vt) return '';
  const mt = CUNG[vt.ls.mt];
  return `<div class="ct-mini"><span>${mt.ky} ${mt.vi} ${saoHTML(vt.tong)}</span><small>${vt.khuyen}</small>${vt.suKien[0] ? `<small class="ct-mini-sk">${vt.suKien[0].ky} ${vt.suKien[0].tieu}</small>` : ''}</div>`;
}
