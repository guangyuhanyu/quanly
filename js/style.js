/* STYLE — phong cách cá nhân của Thầy (bản 5.1)
   Tab: Gợi ý phối · Tủ đồ · Mỹ phẩm · Skincare · Du lịch · Cân nhắc mua · Hồ sơ & công cụ
   Lưu trong cai_dat (không cần sửa Supabase):
     tu_do, my_pham, outfit_luu, lich_outfit, size_shop, skincare, vali, style_ho_so, style_nhin (tiền đã nhịn), anh:<id> (ảnh từng món) */

/* ================= HẰNG SỐ ================= */
const ST_HO_SO_MAC_DINH = { cao: 160, nang: 60, vai: 46, nguc: 87, eo: 77, ngan_sach: 2000000, ngan_sach_thang: 1000000 };
const ST_BANG_MAU = [
  ['Xanh', [['Baby blue', '#A9CCE8'], ['Powder blue', '#B6CFE0'], ['Dusty blue', '#7F9BB5'], ['Navy', '#2C3E5C']]],
  ['Trắng', [['Cool white', '#F4F6F8']]],
  ['Xám', [['Light grey', '#CDD1D6'], ['Cool grey', '#9AA2AB'], ['Charcoal', '#4A4F57']]],
  ['Hồng', [['Cool pink', '#E7B7C8'], ['Dusty rose', '#C9A0A6'], ['Mauve', '#A98199']]],
  ['Tím', [['Lavender', '#C7BEE3'], ['Soft lilac', '#D9C8E6']]],
];
const ST_TRANH = [['Cam đất', '#C46A3C'], ['Vàng mustard', '#D1A32A'], ['Nâu cam', '#A0602F'], ['Đỏ cam', '#D94F2B']];
const ST_MAU_TET = [['Dusty rose', '#C9A0A6'], ['Mauve', '#A98199'], ['Pink berry', '#A4436B'], ['Navy', '#2C3E5C'], ['Cool white', '#F4F6F8']];
const ST_LOAI = {   // loại chi tiết → nhóm
  'Áo thun': 'Áo', 'Sơ mi': 'Áo', 'Áo len / knit': 'Áo', 'Áo khác': 'Áo',
  'Cardigan': 'Khoác', 'Áo khoác': 'Khoác', 'Khăn': 'Khoác',
  'Quần âu': 'Quần', 'Jeans': 'Quần', 'Quần short': 'Quần', 'Quần khác': 'Quần',
  'Giày': 'Giày', 'Túi': 'Túi', 'Trang sức': 'Phụ kiện', 'Đồng hồ': 'Phụ kiện', 'Kính': 'Phụ kiện', 'Mũ': 'Phụ kiện',
};
const ST_KHONG_UU_TIEN = ['blazer', 'polo', 'oversize', 'ren', 'bèo', 'váy', 'cam đất', 'mustard'];
const ST_DIP = { day: 'Đi dạy online', choi: 'Đi chơi / cafe', lam: 'Đi làm / gặp đối tác', tet: 'Lễ Tết', tiec: 'Ăn tiệc' };
const ST_TT = { nong: 'Nóng (≥ 28°C)', mat: 'Mát (20–27°C)', lanh: 'Lạnh (< 20°C)' };
const ST_NOI = {
  nui: { ten: 'Lên núi', vd: 'Đà Lạt, Sapa, Mộc Châu', tt: 'lanh', nhiet: '10–20°C, sáng tối lạnh, ngày dịu' },
  bien: { ten: 'Xuống biển', vd: 'Vũng Tàu, Nha Trang, Phú Quốc', tt: 'nong', nhiet: '28–33°C, nắng gắt, gió' },
  pho: { ten: 'Thành phố', vd: 'Hà Nội, Hội An, nước ngoài…', tt: 'mat', nhiet: 'tuỳ mùa, mặc theo lớp' },
};
const MP_LOAI = {   // loại mỹ phẩm → [nhóm, hạn sau mở (tháng)]
  'Tẩy trang': ['Skincare', 12], 'Sữa rửa mặt': ['Skincare', 12], 'Toner': ['Skincare', 12], 'Serum': ['Skincare', 12], 'Kem dưỡng': ['Skincare', 12], 'Chống nắng': ['Skincare', 12], 'Mặt nạ': ['Skincare', 12], 'Dưỡng môi': ['Skincare', 12],
  'Kem lót': ['Makeup', 12], 'Nền / cushion': ['Makeup', 12], 'Che khuyết điểm': ['Makeup', 12], 'Phấn phủ': ['Makeup', 24], 'Má hồng': ['Makeup', 24], 'Son': ['Makeup', 18], 'Kẻ mày': ['Makeup', 24], 'Mắt': ['Makeup', 6], 'Highlight': ['Makeup', 24],
  'Nước hoa': ['Khác', 36], 'Tóc': ['Khác', 24], 'Khác': ['Khác', 12],
};
const SK_MAC_DINH = { sang: ['Sữa rửa mặt', 'Toner', 'Serum', 'Kem dưỡng', 'Chống nắng'], toi: ['Tẩy trang', 'Sữa rửa mặt', 'Toner', 'Serum', 'Kem dưỡng'] };
const LOOK = {
  day: { ten: 'Lên camera Zoom', buoc: [['Kem lót', ''], ['Nền / cushion', 'lớp mỏng'], ['Che khuyết điểm', 'quầng mắt, vùng đỏ'], ['Phấn phủ', 'vùng chữ T, chống bóng dưới đèn'], ['Kẻ mày', 'tự nhiên'], ['Má hồng', 'cool pink nhẹ'], ['Son', 'rose / mauve, đậm hơn bình thường một chút vì camera làm nhạt màu']] },
  choi: { ten: 'Đi chơi glowy', buoc: [['Kem lót', ''], ['Nền / cushion', 'glowy, thật mỏng'], ['Má hồng', 'cool pink'], ['Highlight', 'gò má, sống mũi'], ['Son', 'son bóng hồng lạnh']] },
  lam: { ten: 'Gọn gàng, chỉn chu', buoc: [['Nền / cushion', 'mỏng'], ['Che khuyết điểm', ''], ['Phấn phủ', ''], ['Kẻ mày', ''], ['Son', 'mauve / rose, finish lì nhẹ']] },
  tet: { ten: 'Tươi tắn ngày Tết', buoc: [['Kem lót', ''], ['Nền / cushion', ''], ['Má hồng', 'hồng lạnh, tán rộng'], ['Highlight', 'nhẹ'], ['Son', 'pink berry: có không khí Tết mà không ngả cam']] },
  tiec: { ten: 'Ăn tiệc', buoc: [['Kem lót', ''], ['Nền / cushion', ''], ['Che khuyết điểm', ''], ['Mắt', 'nhấn nhẹ'], ['Má hồng', 'mauve'], ['Highlight', ''], ['Son', 'pink berry / mauve, căng bóng']] },
};
const _sv = d => `<svg viewBox="0 0 48 48" class="st-sv"><path d="${d}" fill="var(--m)" stroke="color-mix(in srgb, var(--m) 55%, #2b2b3a)" stroke-width="1.6" stroke-linejoin="round"/></svg>`;
const ST_HINH = {
  'Áo': _sv('M17 8l-9 5 3 8 4-2v21h18V19l4 2 3-8-9-5c-1 3-4 5-7 5s-6-2-7-5z'),
  'Quần': _sv('M14 6h20l2 36h-8l-4-24-4 24h-8z'),
  'Khoác': _sv('M17 7l-9 5 2 28h8V18l6 14 6-14v22h8l2-28-9-5-7 16z'),
  'Giày': _sv('M6 30c0-6 2-10 6-10l8 2 6 5 12 2c3 1 5 3 5 6v3H6z'),
  'Túi': _sv('M10 18h28l-2 22H12zM18 18v-3a6 6 0 0 1 12 0v3'),
  'Phụ kiện': _sv('M24 10a14 14 0 1 0 .01 0zM24 16a8 8 0 1 1-.01 0z'),
  'Son': _sv('M20 6h8v10h-8zM18 16h12v26H18z'),
  'Mỹ phẩm': _sv('M17 10h14v6H17zM14 16h20v26H14z'),
};
const ST_CONG_THUC = [
  ['Áo gọn + quần suông', 'Áo vừa người, dáng ngắn nhẹ; quần ống suông cạp vừa – cao vừa.'],
  ['Áo pastel lạnh + quần trung tính', 'Baby blue / lavender / cool pink đi với quần xám, trắng hoặc navy.'],
  ['Cardigan mềm + áo thun basic', 'Cardigan lavender hoặc dusty blue khoác ngoài áo thun trắng lạnh.'],
  ['Sơ mi tối giản + quần sáng màu', 'Sơ mi trắng lạnh hoặc powder blue, quần light grey.'],
];

/* ================= TRẠNG THÁI & DỮ LIỆU ================= */
const ST = { tab: 'phoi', loc: 'Tất cả', dip: 'day', lan: 0, mpLoc: 'Tất cả', skBuoi: new Date().getHours() < 14 ? 'sang' : 'toi' };
const nhomCua = loai => ST_LOAI[loai] || loai || 'Áo';
const hoSoST = () => ({ ...ST_HO_SO_MAC_DINH, ...(caiDat('style_ho_so', {}) || {}) });
const tuDo = () => caiDat('tu_do', []) || [];
const myPham = () => caiDat('my_pham', []) || [];
const coTrongTu = () => tuDo().filter(x => x.trang_thai !== 'muon_mua');
async function luuTuDo(a) { await luuCaiDat('tu_do', a); }
async function luuMyPham(a) { await luuCaiDat('my_pham', a); }
const anhCua = x => x.anh_url || layAnhCache('anh:' + x.id) || '';
function hatGiong(s) { let h = 1779033703 ^ s.length; for (let i = 0; i < s.length; i++) { h = Math.imul(h ^ s.charCodeAt(i), 3432918353); h = h << 13 | h >>> 19; } return () => { h = Math.imul(h ^ h >>> 16, 2246822507); h = Math.imul(h ^ h >>> 13, 3266489909); return ((h ^= h >>> 16) >>> 0) / 4294967296; }; }
const stSoNgay = (a, b) => Math.round((s2d(b) - s2d(a)) / 864e5);
const congThang = (ymd, m) => { const d = s2d(ymd); d.setMonth(d.getMonth() + m); return d2s(d); };

/* ================= MÀU ================= */
function hexRgb(h) { h = (h || '#cccccc').replace('#', ''); if (h.length === 3) h = h.split('').map(c => c + c).join(''); const n = parseInt(h, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
function rgbHex(r, g, b) { return '#' + [r, g, b].map(v => Math.round(v).toString(16).padStart(2, '0')).join(''); }
function rgbHsl([r, g, b]) {
  r /= 255; g /= 255; b /= 255; const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2; let h = 0, s = 0;
  if (mx !== mn) { const d = mx - mn; s = l > .5 ? d / (2 - mx - mn) : d / (mx + mn); h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; }
  return [h, s * 100, l * 100];
}
const hsl = hex => rgbHsl(hexRgb(hex));
const doMau = hex => { const c = hexRgb(hex); return Math.max(...c) - Math.min(...c); };
const laTrungTinh = hex => doMau(hex) < 24 || (hsl(hex)[2] < 30 && hsl(hex)[1] < 40);
const khoangMau = (a, b) => { const [x, y, z] = hexRgb(a), [p, q, r] = hexRgb(b); return Math.hypot(x - p, y - q, z - r); };
function kiemMau(hex) {
  const [h, s, l] = hsl(hex);
  const xam = doMau(hex) < 24 || s < 12, am = !xam && h >= 12 && h <= 75, amNhe = !xam && ((h > 75 && h < 100) || (h < 12 && s > 55)), lanh = !xam && h >= 170 && h <= 345, choi = s > 70 && l > 35 && l < 70;
  let diem = 50; const ly = [];
  if (xam) { diem += 25; ly.push('trung tính, dễ phối'); }
  if (lanh) { diem += 30; ly.push('tông lạnh'); }
  if (am) { diem -= 45; ly.push('tông ấm (cam, vàng, nâu) – nên hạn chế'); }
  if (amNhe) { diem -= 15; ly.push('hơi ngả ấm'); }
  if (choi) { diem -= 25; ly.push('quá rực, nên chọn bản dịu hơn'); } else if (s <= 55 && !xam) { diem += 10; ly.push('độ bão hoà dịu'); }
  if (l < 18) { diem -= 10; ly.push('quá tối, thay bằng navy/charcoal'); }
  diem = Math.max(0, Math.min(100, diem));
  const kq = diem >= 70 ? ['Rất hợp', 'mt-dat'] : diem >= 50 ? ['Dùng được', 'mt-tot'] : diem >= 30 ? ['Hơi lệch tông', 'mt-cham'] : ['Nên tránh', 'mt-truot'];
  const gan = ST_BANG_MAU.flatMap(([, ds]) => ds).map(([t, c]) => [t, c, khoangMau(c, hex)]).sort((a, b) => a[2] - b[2])[0];
  return { diem, nhan: kq[0], lop: kq[1], ly, gan };
}
function kiemSon(hex) {
  const k = kiemMau(hex), [, s, l] = hsl(hex), ghi = [];
  if (l > 70) ghi.push('màu khá nhạt: môi hơi thâm có thể làm son lên màu xỉn, nên dùng lót môi hoặc che khuyết điểm trước');
  else if (l >= 35 && l <= 62) ghi.push('độ đậm vừa, dễ phủ được nền môi hơi thâm');
  if (s < 25 && l < 50) ghi.push('hơi trầm, hợp đi tiệc buổi tối');
  return { ...k, ghi };
}
/* lấy màu chính từ ảnh (bỏ nền trắng/xám nhạt và vùng da) */
function mauChinhAnh(img) {
  const c = document.createElement('canvas'), w = 80, h = Math.round(80 * img.height / img.width) || 80; c.width = w; c.height = h;
  const g = c.getContext('2d'); g.drawImage(img, 0, 0, w, h);
  let px; try { px = g.getImageData(0, 0, w, h).data; } catch (e) { return null; }
  const thung = {};
  for (let y = Math.floor(h * .15); y < h * .9; y++) for (let x = Math.floor(w * .15); x < w * .85; x++) {
    const i = (y * w + x) * 4, r = px[i], gg = px[i + 1], b = px[i + 2], a = px[i + 3]; if (a < 200) continue;
    const [hh, ss, ll] = rgbHsl([r, gg, b]);
    if (ll > 93 || (ll > 85 && ss < 10)) continue;                              // nền trắng
    if (hh >= 8 && hh <= 40 && ss > 18 && ss < 65 && ll > 45 && ll < 82) continue; // da
    const k = `${r >> 4}|${gg >> 4}|${b >> 4}`; (thung[k] = thung[k] || [0, 0, 0, 0]); thung[k][0] += r; thung[k][1] += gg; thung[k][2] += b; thung[k][3]++;
  }
  const top = Object.values(thung).sort((a, b) => b[3] - a[3])[0];
  return top ? rgbHex(top[0] / top[3], top[1] / top[3], top[2] / top[3]) : null;
}

/* ================= THỜI TIẾT (Open-Meteo, miễn phí) ================= */
const TT_NOI = { sg: ['Sài Gòn', 10.78, 106.70], dl: ['Đà Lạt', 11.94, 108.44] };
const ST_TT_CACHE = {};
const noiO = () => (caiDat('style_ho_so', {}) || {}).noi_o || 'sg';
function thoiTiet(noi) {
  noi = noi || noiO();
  if (ST_TT_CACHE[noi]) return ST_TT_CACHE[noi];
  try { const c = JSON.parse(localStorage.getItem('gyq_tt_' + noi) || 'null'); if (c && Date.now() - c.luc < 3 * 3600e3) return (ST_TT_CACHE[noi] = c); } catch (e) { }
  if (!ST_TT_CACHE['_dang_' + noi]) {
    ST_TT_CACHE['_dang_' + noi] = 1;
    const [, la, lo] = TT_NOI[noi];
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${la}&longitude=${lo}&current=temperature_2m&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max&timezone=Asia%2FHo_Chi_Minh&forecast_days=3`)
      .then(r => r.json()).then(j => {
        const d = { luc: Date.now(), now: j.current.temperature_2m, ngay: j.daily.time.map((t, i) => ({ t, max: j.daily.temperature_2m_max[i], min: j.daily.temperature_2m_min[i], mua: j.daily.precipitation_probability_max[i], uv: j.daily.uv_index_max[i] })) };
        ST_TT_CACHE[noi] = d; try { localStorage.setItem('gyq_tt_' + noi, JSON.stringify(d)); } catch (e) { }
        if (['style', 'hom-nay'].includes((location.hash.slice(2) || 'hom-nay').split('/')[0])) ve();
      }).catch(() => { });
  }
  return null;
}
function loaiTroi(noi) {
  const t = thoiTiet(noi), m = new Date().getMonth() + 1;
  if (t) { const n = t.ngay[0]; const tb = (n.max + n.min) / 2; return { tt: tb >= 27 ? 'nong' : tb >= 20 ? 'mat' : 'lanh', t, n }; }
  const dl = (noi || noiO()) === 'dl'; return { tt: dl ? 'lanh' : (m >= 3 && m <= 5 ? 'nong' : 'nong'), t: null, n: null };
}
function loiKhuyenTroi(noi) {
  const { tt, n } = loaiTroi(noi), ds = [], dl = (noi || noiO()) === 'dl', m = new Date().getMonth() + 1;
  if (tt === 'lanh') ds.push('Trời lạnh: mặc nhiều lớp, áo len/knit + cardigan hoặc áo khoác, có thể quàng khăn.');
  if (tt === 'mat') ds.push('Trời mát: áo thun hoặc sơ mi, mang thêm cardigan mỏng.');
  if (tt === 'nong') ds.push('Trời nóng: chất liệu thoáng (cotton, linen), màu sáng; mang áo khoác mỏng cho phòng máy lạnh.');
  if (n && n.mua >= 60) ds.push(`Khả năng mưa ${n.mua}%: tránh giày vải sáng màu, quần dài quá mắt cá; mang dù.`);
  else if (!n && !dl && m >= 5 && m <= 11) ds.push('Mùa mưa Sài Gòn: chiều hay mưa, tránh giày vải sáng màu.');
  if (n && n.uv >= 7) ds.push(`UV ${Math.round(n.uv)}: nhớ chống nắng, thoa lại sau 2–3 tiếng nếu ra đường.`);
  if (dl) ds.push('Đà Lạt khô lạnh: mang dưỡng môi, kem dưỡng đặc hơn.');
  return ds;
}

/* ================= GỢI Ý PHỐI ================= */
function vuaVoi(x, dip, tt) {
  const okDip = !x.dip || !x.dip.length || x.dip.includes(dip);
  const okTT = !x.thoi_tiet || !x.thoi_tiet.length || x.thoi_tiet.includes(tt);
  return okDip && okTT;
}
function macGanDay(x, ngay = 3) { const hn = homNay(); return (x.mac || []).some(d => stSoNgay(d, hn) >= 0 && stSoNgay(d, hn) < ngay); }
function diemBo(bo, dip, tt) {
  const mon = bo.filter(Boolean), ly = [];
  let d = mon.reduce((s, x) => s + kiemMau(x.mau).diem, 0) / mon.length;
  const [ao, quan, khoac] = bo;
  const mauKhac = new Set(mon.filter(x => ['Áo', 'Quần', 'Khoác'].includes(nhomCua(x.loai))).map(x => laTrungTinh(x.mau) ? 'tt' : Math.round(hsl(x.mau)[0] / 40)));
  if (mauKhac.size > 3) d -= 20;
  if (quan && ao) {
    const tuongPhan = Math.abs(hsl(ao.mau)[2] - hsl(quan.mau)[2]); d += Math.min(15, tuongPhan / 4);
    if (!laTrungTinh(ao.mau) && laTrungTinh(quan.mau)) { d += 10; ly.push('Áo pastel lạnh + quần trung tính'); }
    if (ao.loai === 'Sơ mi' && hsl(quan.mau)[2] > 60) { d += 8; ly.push('Sơ mi tối giản + quần sáng màu'); }
    if (['Quần âu', 'Jeans'].includes(quan.loai)) { d += 4; if (!ly.length) ly.push('Áo gọn + quần suông'); }
  }
  if (khoac && khoac.loai === 'Cardigan' && ao && ao.loai === 'Áo thun') { d += 10; ly.push('Cardigan mềm + áo thun basic'); }
  if (tt === 'lanh' && !khoac) d -= 25;
  if (tt === 'nong' && khoac && khoac.loai !== 'Cardigan') d -= 10;
  if (dip === 'tet') { mon.forEach(x => { if (ST_MAU_TET.some(([, c]) => khoangMau(c, x.mau) < 70)) d += 6; }); }
  if (dip === 'lam' || dip === 'tiec') { if (ao && ao.loai === 'Sơ mi') d += 6; }
  mon.forEach(x => { if (macGanDay(x)) d -= 15; if (vuaVoi(x, dip, tt)) d += 3; });
  return { d, ly: ly.length ? ly : ['Phối tối giản, màu hài hoà'] };
}
function goiYPhoi(dip, tt, lan = 0, soBo = 3) {
  const ds = coTrongTu().filter(x => vuaVoi(x, dip, tt) || !x.dip);
  const theo = n => ds.filter(x => nhomCua(x.loai) === n);
  const ao = theo('Áo'), quan = theo('Quần'), khoac = theo('Khoác'), giay = theo('Giày'), pk = ds.filter(x => ['Phụ kiện', 'Túi'].includes(nhomCua(x.loai)));
  if (!ao.length || (dip !== 'day' && !quan.length)) return [];
  const rd = hatGiong(`phoi|${homNay()}|${dip}|${lan}`), ung = [];
  const qs = dip === 'day' ? [null] : quan, ks = [null, ...khoac];
  ao.forEach(a => qs.forEach(q => ks.forEach(k => { const s = diemBo([a, q, k], dip, tt); ung.push({ ao: a, quan: q, khoac: k, d: s.d + rd() * 14, ly: s.ly }); })));
  ung.sort((x, y) => y.d - x.d);
  const kq = [], daDung = new Set();
  for (const u of ung) { if (kq.length >= soBo) break; if (daDung.has(u.ao.id)) continue; daDung.add(u.ao.id); kq.push(u); }
  kq.forEach(u => {
    if (giay.length && dip !== 'day') u.giay = giay.slice().sort((a, b) => (laTrungTinh(b.mau) - laTrungTinh(a.mau)) + rd() - .5)[0];
    if (pk.length) u.pk = pk[Math.floor(rd() * pk.length)];
    u.son = goiYSon(u);
  });
  return kq;
}
function goiYSon(bo) {
  const son = myPham().filter(x => x.loai === 'Son' && x.trang_thai !== 'muon_mua' && !hetHan(x).het);
  if (!son.length) return null;
  const mau = [bo.ao, bo.khoac].filter(Boolean).map(x => x.mau);
  const hongAo = mau.find(m => { const [h, s] = hsl(m); return s > 15 && (h > 300 || h < 20); });
  return son.slice().sort((a, b) => (hongAo ? khoangMau(a.mau, hongAo) - khoangMau(b.mau, hongAo) : kiemMau(b.mau).diem - kiemMau(a.mau).diem))[0];
}

/* ================= MỸ PHẨM ================= */
function hetHan(x) {
  let han = x.han_su_dung || null;
  if (x.ngay_mo) { const h2 = congThang(x.ngay_mo, Number(x.pao) || (MP_LOAI[x.loai] || [, 12])[1]); han = han && han < h2 ? han : h2; }
  if (!han) return { han: null, con: null, het: false, sap: false };
  const con = stSoNgay(homNay(), han); return { han, con, het: con < 0, sap: con >= 0 && con <= 30 };
}

/* ================= CÂN NHẮC MUA ================= */
function phanTichMua(x) {
  const hs = hoSoST(), tu = coTrongTu(), nhom = nhomCua(x.loai), diem = [], tru = [];
  let s = 50;
  // 1. trùng
  const trung = tu.filter(t => t.loai === x.loai && khoangMau(t.mau, x.mau) < 70);
  const cungLoai = tu.filter(t => t.loai === x.loai);
  if (trung.length) { s -= 25 + 8 * (trung.length - 1); tru.push(`Đã có ${trung.length} món gần giống: ${trung.slice(0, 3).map(t => esc(t.ten)).join(', ')}.`); }
  else if (cungLoai.length >= 4) { s -= 10; tru.push(`Tủ đã có ${cungLoai.length} món "${x.loai}".`); }
  // 2. phối được với bao nhiêu món
  let phoi = 0;
  if (nhom === 'Áo') phoi = tu.filter(t => nhomCua(t.loai) === 'Quần').filter(q => laTrungTinh(q.mau) || Math.abs(hsl(q.mau)[2] - hsl(x.mau)[2]) > 20).length;
  else if (nhom === 'Quần') phoi = tu.filter(t => nhomCua(t.loai) === 'Áo').filter(a => laTrungTinh(x.mau) || kiemMau(a.mau).diem >= 50).length;
  else if (nhom === 'Khoác') phoi = tu.filter(t => nhomCua(t.loai) === 'Áo' && (laTrungTinh(t.mau) || laTrungTinh(x.mau) || (kiemMau(t.mau).diem >= 60 && kiemMau(x.mau).diem >= 60 && khoangMau(t.mau, x.mau) > 60))).length;
  else phoi = tu.filter(t => ['Áo', 'Quần'].includes(nhomCua(t.loai))).length;
  if (phoi >= 3) { s += 12; diem.push(`Phối được với ${phoi} món đang có.`); }
  else if (['Áo', 'Quần', 'Khoác'].includes(nhom)) { s -= 10; tru.push(`Chỉ phối được với ${phoi} món đang có, dễ thành "mua về để đó".`); }
  // 3. màu + style
  const km = kiemMau(x.mau || '#ccc');
  if (km.diem >= 70) { s += 10; diem.push('Màu hợp Cool Summer.'); } else if (km.diem < 40) { s -= 18; tru.push(`Màu ${km.nhan.toLowerCase()} với Cool Summer (${km.ly.join(', ')}).`); }
  const tenThuong = (x.ten + ' ' + (x.ghi_chu || '')).toLowerCase();
  const khongHop = ST_KHONG_UU_TIEN.filter(w => tenThuong.includes(w));
  if (khongHop.length) { s -= 15; tru.push(`Thuộc nhóm không ưu tiên trong style của Thầy (${khongHop.join(', ')}).`); }
  // 4. lấp khoảng trống
  const thieuLanh = !tu.some(t => (t.thoi_tiet || []).includes('lanh') || ['Áo khoác', 'Áo len / knit'].includes(t.loai));
  if (thieuLanh && ['Áo khoác', 'Áo len / knit', 'Khăn'].includes(x.loai)) { s += 12; diem.push('Tủ đang thiếu đồ cho trời lạnh (về Đà Lạt).'); }
  if (!cungLoai.length && ['Áo', 'Quần', 'Khoác', 'Giày'].includes(nhom)) { s += 8; diem.push(`Tủ chưa có "${x.loai}".`); }
  // 5. tiền
  const gia = Number(x.gia) || 0, lan = Number(x.lan_mac) || 0;
  if (gia > hs.ngan_sach) { s -= 15; tru.push(`Giá ${tien(gia)} vượt mức tối đa ${tienGon(hs.ngan_sach)}/món.`); }
  if (gia && lan) { const cpw = gia / (lan * 12); if (cpw <= 30000) { s += 8; diem.push(`Ước mặc ${lan} lần/tháng → khoảng ${tienGon(cpw)}/lần mặc trong 1 năm.`); } else if (cpw > 80000) { s -= 8; tru.push(`Ước mặc ${lan} lần/tháng → ${tienGon(cpw)}/lần mặc, khá đắt.`); } }
  const thang = homNay().slice(0, 7);
  const daTieu = (S.chi_tieu || []).filter(c => c.loai !== 'thu' && (c.ngay || '').startsWith(thang) && ['Quần áo', 'Làm đẹp', 'Mua sắm'].includes(c.danh_muc)).reduce((a, c) => a + c.so_tien, 0);
  if (hs.ngan_sach_thang && daTieu + gia > hs.ngan_sach_thang) { s -= 12; tru.push(daTieu ? `Tháng này đã chi ${tienGon(daTieu)} cho quần áo/làm đẹp; mua thêm sẽ vượt ngân sách tháng ${tienGon(hs.ngan_sach_thang)}.` : `Giá vượt ngân sách quần áo + làm đẹp của cả tháng (${tienGon(hs.ngan_sach_thang)}).`); }
  // 6. món lâu chưa mặc cùng nhóm
  const bo = tu.filter(t => nhomCua(t.loai) === nhom && (!(t.mac || []).length || stSoNgay((t.mac || []).slice(-1)[0], homNay()) > 60));
  if (bo.length >= 2) { s -= 6; tru.push(`Có ${bo.length} món ${nhom.toLowerCase()} hơn 2 tháng chưa mặc. Thử mặc lại trước khi mua thêm.`); }
  // 7. thời gian chờ 7 ngày
  const cho = x.ngay_them ? stSoNgay(x.ngay_them, homNay()) : 0;
  const conCho = Math.max(0, 7 - cho);
  s = Math.max(0, Math.min(100, Math.round(s)));
  const ket = s >= 68 ? ['Nên mua', 'mt-dat'] : s >= 45 ? ['Cân nhắc thêm', 'mt-cham'] : ['Không nên mua', 'mt-truot'];
  return { s, ket: ket[0], lop: ket[1], diem, tru, conCho, trung };
}

/* ================= THỐNG KÊ ================= */
function tkTuDo() {
  const tu = coTrongTu(), hn = homNay();
  const lauChuaMac = tu.filter(x => ['Áo', 'Quần', 'Khoác'].includes(nhomCua(x.loai))).map(x => ({ x, ngay: (x.mac || []).length ? stSoNgay((x.mac || []).slice(-1)[0], hn) : 999 })).filter(o => o.ngay > 45).sort((a, b) => b.ngay - a.ngay);
  const nhieu = tu.filter(x => (x.mac || []).length).sort((a, b) => b.mac.length - a.mac.length).slice(0, 3);
  const cpw = tu.filter(x => x.gia && (x.mac || []).length).map(x => ({ x, v: x.gia / x.mac.length })).sort((a, b) => b.v - a.v);
  const nhin = caiDat('style_nhin', { tong: 0, so: 0 }) || { tong: 0, so: 0 };
  const lanMuaCuoi = tu.filter(x => x.ngay_mua).map(x => x.ngay_mua).sort().slice(-1)[0];
  return { lauChuaMac, nhieu, cpw, nhin, ngayKhongMua: lanMuaCuoi ? stSoNgay(lanMuaCuoi, hn) : null };
}

/* ================= GIAO DIỆN ================= */
const anhMon = (x, co = '') => { const u = anhCua(x); const n = MP_LOAI[x.loai] ? (x.loai === 'Son' ? 'Son' : 'Mỹ phẩm') : nhomCua(x.loai); return u ? `<img src="${esc(u)}" alt="" class="st-anh ${co}" loading="lazy">` : `<span class="st-anh st-anh-trong ${co}" style="--m:${esc(x.mau || '#e5e5e5')}">${ST_HINH[n] || ST_HINH['Áo']}</span>`; };
const oMau = (c, t) => `<span class="st-o-mau" style="--m:${c}" title="${t}"><i></i><small>${t}</small></span>`;
const chipMau = hex => `<i class="st-cham" style="background:${esc(hex)}"></i>`;

function vStyle() {
  const tabs = [['phoi', 'Gợi ý phối'], ['tu-do', 'Tủ đồ'], ['my-pham', 'Mỹ phẩm'], ['skincare', 'Skincare'], ['du-lich', 'Du lịch'], ['mua', 'Cân nhắc mua'], ['ho-so', 'Hồ sơ & công cụ']];
  const than = { 'phoi': stPhoi, 'tu-do': stTuDo, 'my-pham': stMyPham, 'skincare': stSkincare, 'du-lich': stDuLich, 'mua': stMua, 'ho-so': stHoSo }[ST.tab] || stPhoi;
  const nutThem = { 'tu-do': `<button class="nut chinh" data-act="st-moi">${ICON.cong} Thêm đồ</button>`, 'my-pham': `<button class="nut chinh" data-act="mp-moi">${ICON.cong} Thêm mỹ phẩm</button>`, 'mua': `<button class="nut chinh" data-act="st-moi" data-mua="1">${ICON.cong} Món muốn mua</button>` }[ST.tab] || '';
  return `
  <header class="dau-trang gon"><div><p class="mat-tren">Soft Korean Boy × Cool Summer</p><h1>${ICON.youtime} Style</h1></div>${nutThem}</header>
  <div class="st-tabs">${tabs.map(([v, c]) => `<button data-act="st-tab" data-v="${v}" class="${ST.tab === v ? 'on' : ''}">${c}</button>`).join('')}</div>
  ${than()}`;
}

function theThoiTiet() {
  const noi = noiO(), { tt, n } = loaiTroi(noi), t = thoiTiet(noi);
  return `<div class="st-troi">
    <div class="st-troi-so"><b>${t ? Math.round(t.now) + '°' : '…'}</b><span>${TT_NOI[noi][0]}${n ? ` · ${Math.round(n.min)}–${Math.round(n.max)}°C · mưa ${n.mua}%` : ''}</span>
      <div class="phan-doan nho">${Object.entries(TT_NOI).map(([k, v]) => `<button data-act="st-noi" data-v="${k}" class="${noi === k ? 'on' : ''}">${v[0]}</button>`).join('')}</div></div>
    <ul>${loiKhuyenTroi(noi).map(x => `<li>${x}</li>`).join('')}</ul>
  </div>`;
}

function theBo(b, i, dip, gon) {
  const mon = [b.khoac, b.ao, b.quan, b.giay, b.pk].filter(Boolean);
  const ids = mon.map(x => x.id).join(',');
  return `<div class="st-bo">
    <div class="st-bo-dau"><b>Bộ ${i + 1}</b><small>${b.ly.join(' · ')}</small></div>
    <div class="st-outfit-ds">${mon.map(x => `<div>${anhMon(x, 'lon')}<b>${esc(x.ten)}</b><small>${chipMau(x.mau)}${esc(x.ten_mau || x.loai)}</small></div>`).join('<span class="st-cong">+</span>')}</div>
    ${b.son ? `<p class="st-son">💄 Son hợp bộ này: ${chipMau(b.son.mau)}<b>${esc(b.son.ten)}</b>${b.son.ten_mau ? ` (${esc(b.son.ten_mau)})` : ''}</p>` : ''}
    ${gon ? '' : `<div class="nhom-nut"><button class="nut nho" data-act="st-mac" data-ids="${ids}">✓ Mặc hôm nay</button><button class="nut nho" data-act="st-luu-bo" data-ids="${ids}" data-dip="${dip}">♥ Lưu bộ</button><button class="nut nho" data-act="st-len-lich" data-ids="${ids}" data-dip="${dip}">📅 Lên lịch</button></div>`}
  </div>`;
}

function stPhoi() {
  const { tt } = loaiTroi(), ds = goiYPhoi(ST.dip, tt, ST.lan);
  const lich = caiDat('lich_outfit', {}) || {}, hn = homNay(), mai = congNgay(hn, 1);
  const sapToi = Object.entries(lich).filter(([d]) => d >= hn).sort().slice(0, 6);
  const luu = caiDat('outfit_luu', []) || [];
  const tim = id => tuDo().find(x => x.id === id);
  return `${theThoiTiet()}
  <div class="loc-chip">${Object.entries(ST_DIP).map(([k, v]) => `<button class="${ST.dip === k ? 'on' : ''}" data-act="st-dip" data-v="${k}">${v}</button>`).join('')}</div>
  ${ST.dip === 'tet' ? `<p class="st-meo">🧧 Tết nhưng tránh đỏ cam, vàng mustard. Màu Tết hợp Thầy: ${ST_MAU_TET.map(([t, c]) => `${chipMau(c)}${t}`).join(' · ')}</p>` : ''}
  ${ST.dip === 'day' ? `<p class="st-meo">🎥 Đi dạy Zoom: chỉ cần phần trên camera. Tránh sọc nhỏ và trắng tinh dễ cháy sáng, chọn pastel lạnh hoặc trắng ngà lạnh.</p>` : ''}
  ${lich[mai] ? `<p class="st-meo nhac">📅 Ngày mai đã lên lịch: ${(lich[mai].ids || []).map(id => (tim(id) || {}).ten).filter(Boolean).join(' + ')}. Tối nay nhớ ủi đồ nhé!</p>` : ''}
  ${ds.length ? `<div class="st-cac-bo">${ds.map((b, i) => theBo(b, i, ST.dip)).join('')}</div><div class="giua"><button class="nut" data-act="st-doi">↻ Đổi bộ khác</button></div>`
    : `<section class="the-giay">${oTrong(coTrongTu().length ? `Chưa đủ đồ hợp dịp "${ST_DIP[ST.dip]}" và thời tiết ${ST_TT[tt].toLowerCase()}.` : 'Tủ đồ còn trống. Thầy thêm vài áo, quần để web gợi ý phối.', `<button class="nut chinh" data-act="st-tab" data-v="tu-do">Mở tủ đồ</button>`)}</section>`}
  <div class="luoi-2 st-luoi">
    <section class="the-giay"><div class="dau-muc"><h2>Lịch outfit</h2></div>
      ${sapToi.length ? sapToi.map(([d, v]) => `<div class="st-lich"><b>${d === hn ? 'Hôm nay' : d === mai ? 'Ngày mai' : ngayVN(d)}</b><span>${ST_DIP[v.dip] || ''}</span><small>${(v.ids || []).map(id => (tim(id) || {}).ten).filter(Boolean).join(' + ')}</small><button class="nut-x" data-act="st-bo-lich" data-d="${d}">×</button></div>`).join('') : '<p class="mo nho">Bấm "📅 Lên lịch" ở một bộ để xếp sẵn cho ngày quan trọng (mùng 1 Tết, ăn tiệc…). Web nhắc tối hôm trước.</p>'}
    </section>
    <section class="the-giay"><div class="dau-muc"><h2>Bộ đã lưu ♥</h2></div>
      ${luu.length ? luu.map(o => `<div class="st-lich"><b>${esc(o.ten || ST_DIP[o.dip] || 'Bộ yêu thích')}</b><small>${(o.ids || []).map(id => (tim(id) || {}).ten).filter(Boolean).join(' + ')}</small><button class="nut nho" data-act="st-mac" data-ids="${(o.ids || []).join(',')}">Mặc</button><button class="nut-x" data-act="st-bo-luu" data-id="${o.id}">×</button></div>`).join('') : '<p class="mo nho">Chưa lưu bộ nào.</p>'}
    </section>
  </div>`;
}

function stTuDo() {
  const ds = coTrongTu();
  const nhoms = ['Tất cả', ...['Áo', 'Khoác', 'Quần', 'Giày', 'Túi', 'Phụ kiện'].filter(n => ds.some(x => nhomCua(x.loai) === n))];
  const loc = nhoms.includes(ST.loc) ? ST.loc : 'Tất cả';
  const hien = ds.filter(x => loc === 'Tất cả' || nhomCua(x.loai) === loc);
  const tk = tkTuDo();
  return `<div class="st-tk">
      <div><small>Trong tủ</small><b>${ds.length}</b><span>món</span></div>
      <div><small>Không mua đồ mới</small><b>${tk.ngayKhongMua == null ? '—' : tk.ngayKhongMua}</b><span>ngày</span></div>
      <div><small>Đã nhịn được</small><b>${tienGon(tk.nhin.tong)}</b><span>${tk.nhin.so} món không mua</span></div>
      <div><small>Lâu chưa mặc</small><b>${tk.lauChuaMac.length}</b><span>món > 45 ngày</span></div>
    </div>
    ${tk.lauChuaMac.length ? `<p class="st-meo">👀 Mặc lại trước khi mua mới: ${tk.lauChuaMac.slice(0, 4).map(o => `<b>${esc(o.x.ten)}</b>${o.ngay === 999 ? ' (chưa mặc lần nào)' : ` (${o.ngay} ngày)`}`).join(' · ')}</p>` : ''}
    ${ds.length ? `<div class="loc-chip">${nhoms.map(l => `<button class="${l === loc ? 'on' : ''}" data-act="st-loc" data-v="${l}">${l}</button>`).join('')}</div>` : ''}
    ${hien.length ? `<div class="st-luoi-mon">${hien.map(x => { const k = kiemMau(x.mau); const n = (x.mac || []).length; return `<div class="st-mon" data-act="st-sua" data-id="${x.id}">${anhMon(x)}
      <div class="st-mon-than"><b>${esc(x.ten)}</b><small>${x.loai}${x.ten_mau ? ' · ' + esc(x.ten_mau) : ''}${x.shop ? ' · ' + esc(x.shop) : ''}</small>
      <span class="the mt-nhan ${k.lop}">${chipMau(x.mau)}${k.nhan}</span>
      <small>${n ? `Đã mặc ${n} lần${x.gia ? ` · ${tienGon(x.gia / n)}/lần` : ''}` : 'Chưa ghi lần mặc'}</small></div></div>`; }).join('')}</div>`
      : `<section class="the-giay">${oTrong('Tủ đồ còn trống.', `<button class="nut chinh" data-act="st-moi">${ICON.cong} Thêm đồ</button>`)}</section>`}`;
}

function stMyPham() {
  const ds = myPham().filter(x => x.trang_thai !== 'muon_mua');
  const nhoms = ['Tất cả', 'Skincare', 'Makeup', 'Khác'].filter(n => n === 'Tất cả' || ds.some(x => (MP_LOAI[x.loai] || ['Khác'])[0] === n));
  const loc = nhoms.includes(ST.mpLoc) ? ST.mpLoc : 'Tất cả';
  const hien = ds.filter(x => loc === 'Tất cả' || (MP_LOAI[x.loai] || ['Khác'])[0] === loc);
  const canhBao = ds.filter(x => hetHan(x).het || hetHan(x).sap || x.con === 'it' || x.con === 'het');
  const look = LOOK[ST.dip] || LOOK.day;
  return `${canhBao.length ? `<div class="st-canh">${canhBao.map(x => { const h = hetHan(x); return `<span class="${h.het || x.con === 'het' ? 'do' : ''}">${chipMau(x.mau || '#ddd')}<b>${esc(x.ten)}</b> ${h.het ? `hết hạn ${ngayVN(h.han)}` : h.sap ? `còn ${h.con} ngày` : x.con === 'het' ? 'đã hết' : 'sắp hết'}</span>`; }).join('')}</div>` : ''}
    <div class="luoi-2 st-luoi st-mp">
      <section class="the-giay"><div class="dau-muc"><h2>Kho mỹ phẩm</h2></div>
        ${ds.length ? `<div class="loc-chip">${nhoms.map(l => `<button class="${l === loc ? 'on' : ''}" data-act="mp-loc" data-v="${l}">${l}</button>`).join('')}</div>` : ''}
        ${hien.length ? `<div class="st-ds-mp">${hien.map(x => { const h = hetHan(x); const son = ['Son', 'Má hồng'].includes(x.loai) && x.mau ? kiemSon(x.mau) : null; return `<div class="st-mp-dong" data-act="mp-sua" data-id="${x.id}">${anhMon(x, 'nho')}
          <div><b>${esc(x.ten)}</b><small>${x.loai}${x.hang ? ' · ' + esc(x.hang) : ''}${x.ten_mau ? ' · ' + esc(x.ten_mau) : ''}</small>
          ${son ? `<span class="the mt-nhan ${son.lop}">${son.nhan}</span>` : ''}</div>
          <div class="st-mp-phai">${h.han ? `<small class="${h.het ? 'chu-do' : h.sap ? 'chu-cam' : ''}">${h.het ? 'Hết hạn' : `HSD ${ngayVN(h.han)}`}</small>` : '<small class="mo">chưa ghi ngày mở</small>'}
          <span class="st-con st-con-${x.con || 'nhieu'}" data-act="mp-con" data-id="${x.id}" title="Bấm để đổi">${{ nhieu: 'Còn nhiều', it: 'Sắp hết', het: 'Đã hết' }[x.con || 'nhieu']}</span></div></div>`; }).join('')}</div>`
          : oTrong('Chưa có mỹ phẩm nào.', `<button class="nut chinh" data-act="mp-moi">${ICON.cong} Thêm mỹ phẩm</button>`)}
      </section>
      <section class="the-giay"><div class="dau-muc"><h2>Gợi ý makeup</h2></div>
        <div class="loc-chip">${Object.entries(ST_DIP).map(([k, v]) => `<button class="${ST.dip === k ? 'on' : ''}" data-act="st-dip" data-v="${k}">${v}</button>`).join('')}</div>
        <h4 class="st-look-ten">${look.ten}</h4>
        <ol class="st-look">${look.buoc.map(([l, m]) => { const mon = ds.filter(x => x.loai === l && !hetHan(x).het && x.con !== 'het').sort((a, b) => l === 'Son' || l === 'Má hồng' ? kiemMau(b.mau || '#ccc').diem - kiemMau(a.mau || '#ccc').diem : 0)[0]; return `<li><b>${l}</b>${m ? ` <small>${m}</small>` : ''}<span>${mon ? `${chipMau(mon.mau || '#ddd')}${esc(mon.ten)}` : '<em>chưa có trong kho</em>'}</span></li>`; }).join('')}</ol>
        <p class="mo nho">Phong cách natural glowy Korean: nền mỏng trong, má và son tông hồng lạnh, không tạo khối sắc, không son cam.</p>
      </section>
    </div>`;
}

function stSkincare() {
  const sk = caiDat('skincare', null) || { sang: SK_MAC_DINH.sang, toi: SK_MAC_DINH.toi, log: {} };
  const hn = homNay(), b = ST.skBuoi, buoc = sk[b] || [], log = sk.log || {}, xong = log[`${hn}|${b}`] || [];
  const kho = myPham().filter(x => x.trang_thai !== 'muon_mua' && !hetHan(x).het);
  const chuoi = bb => { let n = 0, d = hn; const du = dd => (log[`${dd}|${bb}`] || []).length >= (sk[bb] || []).length && (sk[bb] || []).length; if (!du(d)) d = congNgay(d, -1); while (du(d) && n < 400) { n++; d = congNgay(d, -1); } return n; };
  const tuan = [...Array(14)].map((_, i) => { const d = congNgay(hn, i - 13); return `<i class="${(log[`${d}|sang`] || []).length >= sk.sang.length ? 's' : ''} ${(log[`${d}|toi`] || []).length >= sk.toi.length ? 't' : ''}" title="${ngayVN(d)}"></i>`; }).join('');
  return `<div class="luoi-2 st-luoi">
    <section class="the-giay st-sk"><div class="dau-muc"><h2>Routine ${b === 'sang' ? 'buổi sáng ☀️' : 'buổi tối 🌙'}</h2>
      <div class="phan-doan nho"><button data-act="sk-buoi" data-v="sang" class="${b === 'sang' ? 'on' : ''}">Sáng</button><button data-act="sk-buoi" data-v="toi" class="${b === 'toi' ? 'on' : ''}">Tối</button></div></div>
      <div class="st-sk-ds">${buoc.map((l, i) => { const on = xong.includes(i); const mon = kho.find(x => x.loai === l); return `<button class="st-sk-buoc ${on ? 'on' : ''}" data-act="sk-tick" data-i="${i}"><i>${on ? '✓' : i + 1}</i><span><b>${esc(l)}</b><small>${mon ? esc(mon.ten) : 'chưa có trong kho'}</small></span></button>`; }).join('')}</div>
      <div class="nhom-nut"><button class="nut nho" data-act="sk-sua">Sửa các bước</button></div>
    </section>
    <section class="the-giay"><div class="dau-muc"><h2>Chuỗi ngày</h2></div>
      <div class="st-tk nho"><div><small>Sáng</small><b>${chuoi('sang')}</b><span>ngày liền</span></div><div><small>Tối</small><b>${chuoi('toi')}</b><span>ngày liền</span></div></div>
      <div class="st-sk-14">${tuan}</div><p class="mo nho">14 ngày gần nhất · nửa trên: sáng · nửa dưới: tối</p>
      <ul class="st-ds">${loiKhuyenTroi().filter(x => /UV|khô/.test(x)).map(x => `<li>${x}</li>`).join('') || '<li>Chống nắng là bước quan trọng nhất buổi sáng, kể cả ngày ở nhà dạy online cạnh cửa sổ.</li>'}</ul>
    </section>
  </div>`;
}

function stDuLich() {
  const v = caiDat('vali', null);
  const form = `<form class="form st-vali-form" data-form="st-vali">
      <div class="st-noi">${Object.entries(ST_NOI).map(([k, n]) => `<label class="st-noi-o"><input type="radio" name="noi" value="${k}" ${(v ? v.noi : 'nui') === k ? 'checked' : ''}><span><b>${n.ten}</b><small>${n.vd}</small><em>${n.nhiet}</em></span></label>`).join('')}</div>
      <label>Tên chuyến<input name="ten" value="${esc(v ? v.ten : '')}" placeholder="VD: Tết về Đà Lạt"></label>
      <label>Số ngày<input type="number" name="ngay" min="1" max="30" value="${v ? v.ngay : 4}"></label>
      <label class="st-chk"><input type="checkbox" name="tet" ${v && v.tet ? 'checked' : ''}> Có dịp Tết / tiệc</label>
      <button class="nut chinh">${v ? 'Soạn lại vali' : 'Soạn vali'}</button></form>`;
  if (!v) return `<section class="the-giay"><div class="dau-muc"><h2>Soạn vali đi du lịch</h2></div>${form}<p class="mo nho">Web chọn từ tủ đồ ít món nhưng phối được nhiều bộ, hợp nhiệt độ nơi đến, kèm mỹ phẩm và đồ cần thiết.</p></section>`;
  const tim = id => tuDo().find(x => x.id === id) || myPham().find(x => x.id === id);
  const tick = v.tick || {}, tong = v.ds.length, da = v.ds.filter(k => tick[k]).length;
  const nhom = {}; v.ds.forEach(k => { const x = tim(k); const n = x ? (MP_LOAI[x.loai] ? 'Mỹ phẩm' : nhomCua(x.loai)) : Object.keys(MP_LOAI).some(l => k.startsWith(l)) ? 'Mỹ phẩm' : 'Đồ cần thiết'; (nhom[n] = nhom[n] || []).push(k); });
  return `<section class="the-giay"><div class="dau-muc"><h2>🧳 ${esc(v.ten || ST_NOI[v.noi].ten)} · ${v.ngay} ngày</h2><span class="the">${da}/${tong} đã xếp</span></div>
      <p class="st-meo">${ST_NOI[v.noi].ten}: ${ST_NOI[v.noi].nhiet}. ${v.soBo ? `Tủ đồ mang theo phối được khoảng <b>${v.soBo} bộ</b>.` : ''}</p>
      ${v.thieu && v.thieu.length ? `<p class="st-meo nhac">⚠️ Tủ đang thiếu: ${v.thieu.join(', ')}. Thầy có thể mượn hoặc mặc nhiều lớp thay vì mua mới.</p>` : ''}
      <div class="st-vali">${Object.entries(nhom).map(([n, ks]) => `<div><h4>${n}</h4>${ks.map(k => { const x = tim(k); return `<label class="st-vali-dong ${tick[k] ? 'on' : ''}"><input type="checkbox" data-act="vali-tick" data-k="${esc(k)}" ${tick[k] ? 'checked' : ''}>${x ? chipMau(x.mau || '#ddd') + esc(x.ten) : esc(k)}</label>`; }).join('')}</div>`).join('')}</div>
      <details class="st-vali-sua"><summary>Đổi chuyến đi</summary>${form}</details>
      <div class="nhom-nut"><button class="nut nho nguy" data-act="vali-xoa">Xoá vali</button></div></section>`;
}
function soanVali(noi, ngay, tet, ten) {
  const tt = ST_NOI[noi].tt, tu = coTrongTu(), rd = hatGiong('vali' + noi + ngay);
  const hop = x => !x.thoi_tiet || !x.thoi_tiet.length || x.thoi_tiet.includes(tt);
  const theo = n => tu.filter(x => nhomCua(x.loai) === n && hop(x)).sort((a, b) => kiemMau(b.mau).diem - kiemMau(a.mau).diem + (rd() - .5) * 20);
  const nAo = Math.min(7, Math.ceil(ngay * .7) + (noi === 'bien' ? 1 : 0)), nQuan = Math.min(4, Math.ceil(ngay / 3) + 1), nKhoac = noi === 'nui' ? 2 : noi === 'pho' ? 1 : 0;
  const quan = theo('Quần').sort((a, b) => laTrungTinh(b.mau) - laTrungTinh(a.mau)).slice(0, nQuan);
  const ao = theo('Áo').slice(0, nAo), khoac = theo('Khoác').slice(0, nKhoac), giay = theo('Giày').slice(0, ngay > 3 ? 2 : 1);
  const thieu = [];
  if (ao.length < nAo) thieu.push(`${nAo - ao.length} áo`); if (quan.length < Math.min(2, nQuan)) thieu.push('quần'); if (noi === 'nui' && !khoac.length) thieu.push('áo khoác / len ấm');
  const mpCan = noi === 'nui' ? ['Sữa rửa mặt', 'Kem dưỡng', 'Dưỡng môi', 'Chống nắng', 'Son'] : noi === 'bien' ? ['Sữa rửa mặt', 'Chống nắng', 'Kem dưỡng', 'Son', 'Tẩy trang'] : ['Sữa rửa mặt', 'Kem dưỡng', 'Chống nắng', 'Son'];
  if (tet) mpCan.push('Má hồng', 'Nền / cushion');
  const mp = mpCan.map(l => (myPham().find(x => x.loai === l && x.trang_thai !== 'muon_mua' && x.con !== 'het') || {}).id || `${l}${l === 'Chống nắng' && noi === 'bien' ? ' (SPF 50+)' : ''}`);
  const can = ['Sạc điện thoại, tai nghe', 'Giấy tờ tuỳ thân', 'Đồ ngủ', 'Đồ lót, tất', 'Thuốc cá nhân'];
  if (noi === 'nui') can.push('Khăn len, tất dày'); if (noi === 'bien') can.push('Kính râm, mũ', 'Dép đi biển', 'Đồ bơi'); if (tet) can.push('Bao lì xì');
  const soBo = ao.length * Math.max(1, quan.length) + (khoac.length ? ao.length : 0);
  return { ten, noi, ngay, tet, ds: [...khoac, ...ao, ...quan, ...giay].map(x => x.id).concat(mp, can), tick: {}, thieu, soBo };
}

function stMua() {
  const ds = [...tuDo(), ...myPham()].filter(x => x.trang_thai === 'muon_mua');
  const mpCanMua = myPham().filter(x => x.trang_thai !== 'muon_mua' && (x.con === 'het' || x.con === 'it' || hetHan(x).het));
  const hs = hoSoST(), tk = tkTuDo();
  return `<div class="st-tk">
      <div><small>Không mua đồ mới</small><b>${tk.ngayKhongMua == null ? '—' : tk.ngayKhongMua}</b><span>ngày</span></div>
      <div><small>Đã nhịn được</small><b>${tienGon(tk.nhin.tong)}</b><span>${tk.nhin.so} món</span></div>
      <div><small>Ngân sách tháng</small><b>${tienGon(hs.ngan_sach_thang)}</b><span>quần áo + làm đẹp</span></div>
      <div><small>Tối đa / món</small><b>${tienGon(hs.ngan_sach)}</b><span>&nbsp;</span></div>
    </div>
    <p class="st-meo">🧘 Quy tắc: món mới thêm phải <b>chờ 7 ngày</b> mới bấm mua được. Sau 7 ngày mà vẫn còn muốn và web chấm "Nên mua" thì hãy mua. Bỏ một món khỏi danh sách = cộng tiền vào "Đã nhịn được".</p>
    ${mpCanMua.length ? `<section class="the-giay"><div class="dau-muc"><h2>Mỹ phẩm cần mua lại</h2></div><div class="st-canh">${mpCanMua.map(x => `<span>${chipMau(x.mau || '#ddd')}<b>${esc(x.ten)}</b> ${hetHan(x).het ? 'hết hạn' : x.con === 'het' ? 'đã hết' : 'sắp hết'}</span>`).join('')}</div><p class="mo nho">Mỹ phẩm thiết yếu (chống nắng, sữa rửa mặt…) hết thì nên mua lại. Đây không tính là mua sắm thêm.</p></section>` : ''}
    ${ds.length ? `<div class="st-mua-ds">${ds.map(x => { const laMP = !!MP_LOAI[x.loai]; const p = laMP ? null : phanTichMua(x); const cho = x.ngay_them ? Math.max(0, 7 - stSoNgay(x.ngay_them, homNay())) : 0; return `<div class="st-mua">
        <div class="st-mua-dau">${anhMon(x)}<div><b>${esc(x.ten)}</b><small>${x.loai}${x.gia ? ' · ' + tien(Number(x.gia)) : ''}${x.shop ? ' · ' + esc(x.shop) : ''}</small>${x.ly_do ? `<small><i>Lý do muốn mua: ${esc(x.ly_do)}</i></small>` : ''}</div>
          ${p ? `<div class="st-diem ${p.lop}"><b>${p.s}</b><small>${p.ket}</small></div>` : ''}</div>
        ${p ? `<div class="st-ptich">${p.diem.map(d => `<p class="cong">＋ ${d}</p>`).join('')}${p.tru.map(d => `<p class="tru">－ ${d}</p>`).join('')}</div>` : ''}
        <div class="nhom-nut">${cho > 0 ? `<span class="the">⏳ Chờ thêm ${cho} ngày</span>` : `<button class="nut nho chinh" data-act="st-da-mua" data-id="${x.id}">✓ Đã mua</button>`}
          <button class="nut nho" data-act="st-bo-mua" data-id="${x.id}">✗ Thôi, không mua</button><button class="nut nho" data-act="${laMP ? 'mp-sua' : 'st-sua'}" data-id="${x.id}">Sửa</button>${x.link ? `<a class="nut nho" href="${esc(x.link)}" target="_blank" rel="noopener">Link ↗</a>` : ''}</div>
      </div>`; }).join('')}</div>`
      : `<section class="the-giay">${oTrong('Danh sách muốn mua đang trống. Tốt lắm! 🌿', `<button class="nut" data-act="st-moi" data-mua="1">${ICON.cong} Thêm món đang để ý</button>`)}</section>`}`;
}

function stHoSo() {
  const hs = hoSoST(), sizes = caiDat('size_shop', []) || [];
  return `<div class="st-hero the-giay">
    <p class="st-nho">Style identity</p><h2>Soft Korean Boy <span>×</span> Cool Summer <span>×</span> Soft Masculine</h2>
    <p class="st-mo">Tối giản, trẻ trung, trong trẻo. Phom gọn, bảng màu lạnh dịu, tóc mềm, makeup tự nhiên. Có nét nam tính nhưng không cứng nhắc. Mục tiêu không phải nổi bật, mà là hài hoà, có gu và mang dấu ấn riêng.</p>
    <div class="st-tu-khoa">${['Soft', 'Youthful', 'Clean', 'Minimalist', 'Androgynous'].map(k => `<span>${k}</span>`).join('')}</div>
    <div class="st-ti-le"><span>Nam tính 60%</span><div><i style="width:60%"></i></div><span>Mềm mại 40%</span></div>
  </div>
  <div class="luoi-2 st-luoi">
    <section class="the-giay"><div class="dau-muc"><h2>Bảng màu Cool Summer</h2></div>
      ${ST_BANG_MAU.map(([n, ds]) => `<div class="st-nhom-mau"><b>${n}</b><div>${ds.map(([t, c]) => oMau(c, t)).join('')}</div></div>`).join('')}
      <div class="st-nhom-mau tranh"><b>Hạn chế</b><div>${ST_TRANH.map(([t, c]) => oMau(c, t)).join('')}</div></div>
    </section>
    <section class="the-giay"><div class="dau-muc"><h2>Vóc dáng & ngân sách</h2><button class="nut-chu" data-act="st-so-do">Sửa</button></div>
      <div class="st-so-do">${[['Cao', hs.cao + ' cm'], ['Nặng', '~' + hs.nang + ' kg'], ['Ngang vai', hs.vai + ' cm'], ['Vòng ngực', hs.nguc + ' cm'], ['Vòng eo', hs.eo + ' cm'], ['Tối đa/món', tienGon(hs.ngan_sach)], ['Ngân sách tháng', tienGon(hs.ngan_sach_thang)]].map(([a, b]) => `<div><small>${a}</small><b>${b}</b></div>`).join('')}</div>
      <ul class="st-ds"><li>Tạo cảm giác cao ráo, cân đối; cải thiện tỷ lệ đầu – cổ – vai; cổ tròn hoặc cổ mở vừa.</li><li>Ưu tiên: áo vừa/hơi ôm, dáng ngắn nhẹ; knit, cardigan, sơ mi tối giản; quần ống suông cạp vừa – cao vừa.</li><li>Không ưu tiên: blazer, polo, oversized quá rộng, bèo nhún/ren, outfit quá trưởng thành hoặc quá streetwear.</li></ul>
    </section>
    <section class="the-giay"><div class="dau-muc"><h2>Size theo shop</h2><button class="nut-chu" data-act="size-moi">${ICON.cong} Thêm</button></div>
      ${sizes.length ? sizes.map((z, i) => `<div class="st-lich"><b>${esc(z.shop)}</b><small>${[z.ao && 'Áo ' + z.ao, z.quan && 'Quần ' + z.quan, z.giay && 'Giày ' + z.giay].filter(Boolean).map(esc).join(' · ')}${z.ghi_chu ? ' · ' + esc(z.ghi_chu) : ''}</small><button class="nut-x" data-act="size-xoa" data-i="${i}">×</button></div>`).join('') : '<p class="mo nho">Mua vừa size nào ở shop nào thì ghi lại đây, lần sau khỏi đo.</p>'}
    </section>
    <section class="the-giay"><div class="dau-muc"><h2>Kiểm tra màu</h2></div>
      <div class="form st-chon-mau"><label>Chọn màu<input type="color" value="${ST.mauThu || '#A9CCE8'}" data-act-change="st-thu-mau"></label></div>${stKqMau(ST.mauThu || '#A9CCE8')}
    </section>
    <section class="the-giay ca-dong-luoi"><div class="dau-muc"><h2>Kiểm tra size theo số đo thành phẩm</h2></div>${stFormSize()}</section>
    <section class="the-giay"><div class="dau-muc"><h2>Tóc · Makeup · Phụ kiện · Nước hoa</h2></div>
      <div class="st-muc"><b>💇 Tóc</b><p>Ngắn gọn, tự nhiên · mái phủ trán nhẹ · hai bên ôm đầu, không cạo cao · đỉnh có texture mềm. Tóc dày, sợi cứng, hay chỉa ở thái dương và trên tai, nên nhờ thợ xử lý để tóc nằm gọn khi mọc dài.</p></div>
      <div class="st-muc"><b>💄 Makeup</b><p>Natural glowy Korean · má cool pink/mauve · son rose pink, mauve, pink berry · tránh tạo khối sắc, son cam. Môi hơi thâm: thử độ lên màu thực tế.</p></div>
      <div class="st-muc"><b>💍 Phụ kiện</b><p>Bạc, thép bạc, nhẫn tối giản, phỉ thuý, ngọc Hoà Điền · túi mini unisex đen, xám, navy, bạc.</p></div>
      <div class="st-muc"><b>🌸 Nước hoa</b><p>Jean Paul Gaultier Scandal.</p></div>
    </section>
  </div>`;
}
function stKqMau(hex) {
  const k = kiemMau(hex);
  return `<div class="st-kq-mau"><span class="st-mau-to" style="background:${hex}"></span><div><span class="the mt-nhan ${k.lop}">${k.nhan} · ${k.diem}/100</span><p>${k.ly.join(' · ') || 'Màu trung tính'}</p><small class="mo">Gần nhất trong bảng màu: ${chipMau(k.gan[1])} ${k.gan[0]}</small></div></div>`;
}
function kiemSize(loai, f) {
  const hs = hoSoST(), kq = [], n = k => Number(f[k]) || 0;
  if (loai === 'ao') {
    if (n('ngang_nguc')) { const du = n('ngang_nguc') * 2 - hs.nguc; kq.push(du < 4 ? ['Ngực', 'Chật – dưới 4 cm cử động', 'mt-truot'] : du <= 12 ? ['Ngực', `Vừa / hơi ôm (dư ${du} cm) – đúng ý`, 'mt-dat'] : du <= 20 ? ['Ngực', `Suông (dư ${du} cm) – vẫn ổn`, 'mt-tot'] : ['Ngực', `Oversized (dư ${du} cm) – dễ làm người nặng nề`, 'mt-cham']); }
    if (n('vai')) { const d = n('vai') - hs.vai; kq.push(d < -2 ? ['Vai', 'Hẹp hơn vai, dễ bó', 'mt-truot'] : d <= 2 ? ['Vai', 'Vừa vai – cân tỷ lệ đầu–vai', 'mt-dat'] : d <= 5 ? ['Vai', `Rớt vai nhẹ ${d} cm`, 'mt-tot'] : ['Vai', `Rớt vai ${d} cm – vai trông hẹp, đầu to hơn`, 'mt-cham']); }
    if (n('dai')) { const d = n('dai'), lo = Math.round(hs.cao * .38), hi = Math.round(hs.cao * .42); kq.push(d < lo - 4 ? ['Dài áo', 'Hơi crop', 'mt-cham'] : d <= hi ? ['Dài áo', `Dáng ngắn nhẹ (${lo}–${hi} cm) – kéo chân dài`, 'mt-dat'] : d <= hi + 5 ? ['Dài áo', 'Hơi dài, nên sơ vin nhẹ', 'mt-tot'] : ['Dài áo', 'Dài – dễ làm chân ngắn lại', 'mt-truot']); }
  } else {
    if (n('eo')) { const d = n('eo') - hs.eo; kq.push(d < -1 ? ['Eo', 'Chật eo', 'mt-truot'] : d <= 3 ? ['Eo', 'Vừa eo', 'mt-dat'] : d <= 6 ? ['Eo', `Rộng ${d} cm – cần thắt lưng hoặc sửa`, 'mt-cham'] : ['Eo', `Rộng ${d} cm – nên đổi size`, 'mt-truot']); }
    if (n('dai')) { const d = n('dai'), dep = Math.round(hs.cao * .6); kq.push(Math.abs(d - dep) <= 3 ? ['Dài quần', `Vừa đẹp (~${dep} cm, chạm mu giày)`, 'mt-dat'] : d > dep ? ['Dài quần', `Dài hơn ~${d - dep} cm – nên lên lai`, 'mt-cham'] : ['Dài quần', `Ngắn hơn ~${dep - d} cm`, 'mt-cham']); }
    if (n('ong')) kq.push(n('ong') >= 19 && n('ong') <= 23 ? ['Ống', 'Ống suông vừa phải', 'mt-dat'] : n('ong') < 19 ? ['Ống', 'Ống hơi ôm/côn', 'mt-tot'] : ['Ống', 'Ống rộng – dễ nuốt chiều cao', 'mt-cham']);
  }
  if (n('gia')) kq.push(n('gia') <= hs.ngan_sach ? ['Giá', `${tien(n('gia'))} – trong mức tối đa`, 'mt-dat'] : ['Giá', `${tien(n('gia'))} – vượt ${tien(hs.ngan_sach)}`, 'mt-cham']);
  return kq;
}
function stFormSize() {
  const sv = ST.sizeVal || {}, q = ST.sizeLoai === 'quan';
  return `<form class="form luoi-form" data-form="st-size">
      <label class="ca-dong">Loại<select name="loai" data-act-change="st-size-loai"><option value="ao">Áo / cardigan</option><option value="quan" ${q ? 'selected' : ''}>Quần</option></select></label>
      ${q ? `<label>Vòng eo (cm)<input type="number" name="eo" value="${sv.eo || ''}"></label><label>Dài quần (cm)<input type="number" name="dai" value="${sv.dai || ''}"></label><label>Rộng ống (cm, đo nằm)<input type="number" name="ong" value="${sv.ong || ''}"></label>`
        : `<label>Ngang ngực (cm, đo nằm)<input type="number" name="ngang_nguc" value="${sv.ngang_nguc || ''}"></label><label>Ngang vai (cm)<input type="number" name="vai" value="${sv.vai || ''}"></label><label>Dài áo (cm)<input type="number" name="dai" value="${sv.dai || ''}"></label>`}
      <label>Giá (đ)<input data-so name="gia" value="${sv.gia || ''}"></label><div class="ca-dong"><button class="nut chinh">Kiểm tra</button></div></form>
    <div>${ST.kqSize ? ST.kqSize.map(([a, b, c]) => `<div class="st-kq ${c}"><b>${a}</b><span>${b}</span></div>`).join('') : '<p class="mo nho">Nhập số đo trong bảng size của shop để xem có vừa không.</p>'}</div>`;
}

/* khối trang Hôm nay */
function stOutfitHomNay() {
  const lich = (caiDat('lich_outfit', {}) || {}), hn = homNay(), mai = congNgay(hn, 1);
  const tim = id => tuDo().find(x => x.id === id);
  let bo = null, nhan = '';
  if (lich[hn]) { const ids = lich[hn].ids || []; bo = { mon: ids.map(tim).filter(Boolean) }; nhan = 'Đã lên lịch hôm nay'; }
  else { const g = goiYPhoi('day', loaiTroi().tt, 0, 1)[0]; if (g) { bo = { mon: [g.khoac, g.ao, g.quan].filter(Boolean) }; nhan = 'Gợi ý đi dạy'; } }
  const mp = myPham().filter(x => x.trang_thai !== 'muon_mua' && (hetHan(x).het || hetHan(x).sap));
  if (!bo && !lich[mai] && !mp.length) return '';
  return `<section class="the-giay"><div class="dau-muc"><h2 class="co-icon">${ICON.youtime}Outfit hôm nay</h2><a href="#/style" data-act="st-mo-tab" data-v="phoi">Mở →</a></div>
    ${bo && bo.mon.length ? `<small class="mo">${nhan}</small><div class="st-outfit-ds nho">${bo.mon.map(x => `<div>${anhMon(x)}<small>${esc(x.ten)}</small></div>`).join('<span class="st-cong">+</span>')}</div>` : ''}
    ${lich[mai] ? `<p class="st-meo nhac">📅 Ngày mai: ${(lich[mai].ids || []).map(id => (tim(id) || {}).ten).filter(Boolean).join(' + ')}. Tối nay nhớ ủi đồ!</p>` : ''}
    ${mp.length ? `<p class="st-meo">💄 ${mp.map(x => `${esc(x.ten)} ${hetHan(x).het ? 'đã hết hạn' : `còn ${hetHan(x).con} ngày`}`).join(' · ')}</p>` : ''}
  </section>`;
}

/* ================= FORM ================= */
function nenAnhST(file) {
  return new Promise((res, rej) => {
    const img = new Image(); img.onload = () => {
      const s = 280, k = Math.min(1, s / Math.max(img.width, img.height)); const c = document.createElement('canvas');
      c.width = Math.round(img.width * k); c.height = Math.round(img.height * k); c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      let u = c.toDataURL('image/webp', .74); if (!u.startsWith('data:image/webp')) u = c.toDataURL('image/jpeg', .78);
      const mau = mauChinhAnh(img); URL.revokeObjectURL(img.src); res({ u, mau });
    }; img.onerror = rej; img.src = URL.createObjectURL(file);
  });
}
function oAnhForm(x) {
  return `<div class="ca-dong st-anh-form"><span class="nhan">Ảnh (lưu ảnh shop về máy rồi chọn, hoặc dán link ảnh)</span>
    <div><span id="st-xem-anh">${anhCua(x) ? `<img src="${esc(anhCua(x))}" class="st-anh lon" title="Chạm vào ảnh để lấy màu tại điểm đó">` : ''}</span>
    <div class="st-anh-nut"><input type="file" accept="image/*" id="st-file"><input name="anh_url" placeholder="https://… (link ảnh)" value="${esc(x.anh_url || '')}"><small class="mo">Web tự lấy màu chính từ ảnh. Ảnh có người mẫu thì chạm vào vùng áo để lấy đúng màu.</small></div></div></div>`;
}
function ganAnhForm(n, ctx) {
  const xem = n.querySelector('#st-xem-anh'), mauO = n.querySelector('[name=mau]');
  const capMau = m => { if (!m) return; mauO.value = m; mauO.dispatchEvent(new Event('input')); };
  const ganChamAnh = () => { const im = xem.querySelector('img'); if (!im) return; im.style.cursor = 'crosshair'; im.onclick = ev => { try { const r = im.getBoundingClientRect(), c = document.createElement('canvas'); c.width = im.naturalWidth; c.height = im.naturalHeight; const g = c.getContext('2d'); g.drawImage(im, 0, 0); const x = Math.floor((ev.clientX - r.left) / r.width * c.width), y = Math.floor((ev.clientY - r.top) / r.height * c.height); const p = g.getImageData(Math.max(0, x - 2), Math.max(0, y - 2), 5, 5).data; let R = 0, G = 0, B = 0; for (let i = 0; i < p.length; i += 4) { R += p[i]; G += p[i + 1]; B += p[i + 2]; } const k = p.length / 4; capMau(rgbHex(R / k, G / k, B / k)); toast('Đã lấy màu tại điểm chạm'); } catch (e) { toast('Ảnh từ link không lấy màu được, Thầy chọn màu tay nhé'); } }; };
  ganChamAnh();
  n.querySelector('#st-file').addEventListener('change', async e => { const f = e.target.files[0]; if (!f) return; const { u, mau } = await nenAnhST(f); ctx.anh = u; n.querySelector('[name=anh_url]').value = ''; xem.innerHTML = `<img src="${u}" class="st-anh lon">`; ganChamAnh(); capMau(mau); });
  n.querySelector('[name=anh_url]').addEventListener('change', e => { const u = e.target.value.trim(); if (!u) return; ctx.anh = ''; xem.innerHTML = `<img src="${esc(u)}" class="st-anh lon">`; const im = new Image(); im.crossOrigin = 'anonymous'; im.onload = () => { capMau(mauChinhAnh(im)); ganChamAnh(); }; im.src = u; });
}
async function luuAnh(id, ctx) { if (ctx.anh !== undefined) await luuCaiDat('anh:' + id, ctx.anh || ''); }

function moMonDo(id, muonMua) {
  const x = id ? tuDo().find(m => m.id === id) : { loai: 'Áo thun', trang_thai: muonMua ? 'muon_mua' : 'co', mau: '#A9CCE8', dip: [], thoi_tiet: [] };
  const ctx = {}, shops = [...new Set([...(caiDat('size_shop', []) || []).map(z => z.shop), ...tuDo().map(t => t.shop)].filter(Boolean))];
  const chk = (ten, ds, chon) => Object.entries(ds).map(([k, v]) => `<label class="st-chk"><input type="checkbox" name="${ten}" value="${k}" ${(chon || []).includes(k) ? 'checked' : ''}> ${v}</label>`).join('');
  moHop({
    tieuDe: id ? 'Sửa món đồ' : x.trang_thai === 'muon_mua' ? 'Món đang muốn mua' : 'Thêm đồ vào tủ',
    rong: true,
    noiDung: `<div class="form luoi-form">
      <label class="ca-dong">Tên món<input name="ten" value="${esc(x.ten || '')}" placeholder="VD: Cardigan len lavender, Quần âu xám ống suông…"></label>
      <label>Loại<select name="loai">${Object.keys(ST_LOAI).map(l => `<option ${x.loai === l ? 'selected' : ''}>${l}</option>`).join('')}</select></label>
      <label>Trạng thái<select name="trang_thai"><option value="co">Đã có trong tủ</option><option value="muon_mua" ${x.trang_thai === 'muon_mua' ? 'selected' : ''}>Đang muốn mua</option></select></label>
      ${oAnhForm(x)}
      <label>Màu<input type="color" name="mau" value="${esc(x.mau || '#A9CCE8')}"></label>
      <label>Tên màu<input name="ten_mau" value="${esc(x.ten_mau || '')}" placeholder="Lavender, Cool grey…"></label>
      <div class="ca-dong" id="st-goi-y-mau">${stKqMau(x.mau || '#A9CCE8')}</div>
      <label>Chất liệu<input name="chat_lieu" value="${esc(x.chat_lieu || '')}" placeholder="cotton, len, linen…"></label>
      <label>Shop<input name="shop" list="st-shop" value="${esc(x.shop || '')}"><datalist id="st-shop">${shops.map(s => `<option>${esc(s)}</option>`).join('')}</datalist><small class="mo" id="st-size-goi-y"></small></label>
      <label>Giá (đ)<input data-so name="gia" value="${x.gia || ''}"></label>
      <label>Size<input name="size" value="${esc(x.size || '')}"></label>
      <div class="ca-dong"><span class="nhan">Mặc khi trời</span><div class="st-chk-ds">${chk('thoi_tiet', ST_TT, x.thoi_tiet)}</div></div>
      <div class="ca-dong"><span class="nhan">Dịp (bỏ trống = mặc được mọi dịp)</span><div class="st-chk-ds">${chk('dip', ST_DIP, x.dip)}</div></div>
      <label class="ca-dong">Link shop<input name="link" value="${esc(x.link || '')}" placeholder="https://…"></label>
      <div class="ca-dong st-chi-mua"><span class="nhan">Để web phân tích có nên mua</span></div>
      <label class="st-chi-mua">Ước mặc mấy lần/tháng?<input type="number" name="lan_mac" value="${x.lan_mac || ''}" placeholder="VD: 4"></label>
      <label class="st-chi-mua">Vì sao muốn mua?<input name="ly_do" value="${esc(x.ly_do || '')}" placeholder="VD: thiếu áo ấm về Đà Lạt"></label>
      <label class="ca-dong">Ghi chú<textarea name="ghi_chu" rows="2">${esc(x.ghi_chu || '')}</textarea></label>
      ${id && x.trang_thai !== 'muon_mua' ? `<p class="ca-dong mo nho">Đã mặc ${(x.mac || []).length} lần${(x.mac || []).length ? `, gần nhất ${ngayVN(x.mac.slice(-1)[0])}` : ''}.</p>` : ''}
    </div>`,
    khiMo: n => {
      ganOTien(n); ganAnhForm(n, ctx);
      n.querySelector('[name=mau]').addEventListener('input', e => { n.querySelector('#st-goi-y-mau').innerHTML = stKqMau(e.target.value); });
      const cap = () => { const tt = n.querySelector('[name=trang_thai]').value; n.querySelectorAll('.st-chi-mua').forEach(e => e.style.display = tt === 'muon_mua' ? '' : 'none');
        const sh = n.querySelector('[name=shop]').value.trim().toLowerCase(), z = (caiDat('size_shop', []) || []).find(s => s.shop.toLowerCase() === sh); n.querySelector('#st-size-goi-y').textContent = z ? `Size đã vừa ở shop này: ${[z.ao && 'áo ' + z.ao, z.quan && 'quần ' + z.quan, z.giay && 'giày ' + z.giay].filter(Boolean).join(', ')}` : ''; };
      n.addEventListener('change', cap); n.querySelector('[name=shop]').addEventListener('input', cap); cap();
    },
    nut: [
      ...(id ? [{ chu: 'Xoá', kieu: 'nguy', trai: true, bam: async () => { if (!(await hoi(`Xoá "${esc(x.ten)}"?`, 'Xoá', 'nguy'))) return false; await luuTuDo(tuDo().filter(m => m.id !== id)); if (caiDat('anh:' + id, '')) await luuCaiDat('anh:' + id, ''); ve(); } }] : []),
      { chu: 'Huỷ', bam: () => { } },
      { chu: 'Lưu', kieu: 'chinh', bam: async n => {
        const f = docForm(n); if (!f.ten) return false;
        const lay = ten => [...n.querySelectorAll(`[name=${ten}]:checked`)].map(e => e.value);
        const moi = { ...x, id: id || 'td' + Date.now(), ten: f.ten, loai: f.loai, trang_thai: f.trang_thai, mau: f.mau, ten_mau: f.ten_mau, chat_lieu: f.chat_lieu, shop: f.shop, gia: Number(f.gia) || 0, size: f.size, link: f.link, ghi_chu: f.ghi_chu, anh_url: f.anh_url || '', thoi_tiet: lay('thoi_tiet'), dip: lay('dip'), lan_mac: Number(f.lan_mac) || 0, ly_do: f.ly_do || '' };
        if (moi.trang_thai === 'muon_mua' && !moi.ngay_them) moi.ngay_them = homNay();
        if (!id && moi.trang_thai === 'muon_mua') { const p = phanTichMua(moi); if (p.trung.length && !(await hoi(`Tủ đã có ${p.trung.length} món gần giống (${p.trung.map(t => esc(t.ten)).join(', ')}). Vẫn thêm vào danh sách muốn mua?`, 'Vẫn thêm'))) return false; }
        await luuAnh(moi.id, ctx); await luuTuDo([...tuDo().filter(m => m.id !== moi.id), moi]); ve();
      } }],
  });
}

function moMyPham(id) {
  const x = id ? myPham().find(m => m.id === id) : { loai: 'Son', trang_thai: 'co', mau: '#C9A0A6', con: 'nhieu' };
  const ctx = {};
  moHop({
    tieuDe: id ? 'Sửa mỹ phẩm' : 'Thêm mỹ phẩm', rong: true,
    noiDung: `<div class="form luoi-form">
      <label class="ca-dong">Tên sản phẩm<input name="ten" value="${esc(x.ten || '')}" placeholder="VD: Romand Juicy Lasting Tint #06"></label>
      <label>Loại<select name="loai">${Object.keys(MP_LOAI).map(l => `<option ${x.loai === l ? 'selected' : ''}>${l}</option>`).join('')}</select></label>
      <label>Hãng<input name="hang" value="${esc(x.hang || '')}"></label>
      <label>Trạng thái<select name="trang_thai"><option value="co">Đang dùng / có sẵn</option><option value="muon_mua" ${x.trang_thai === 'muon_mua' ? 'selected' : ''}>Muốn mua</option></select></label>
      <label>Còn<select name="con"><option value="nhieu">Còn nhiều</option><option value="it" ${x.con === 'it' ? 'selected' : ''}>Sắp hết</option><option value="het" ${x.con === 'het' ? 'selected' : ''}>Đã hết</option></select></label>
      ${oAnhForm(x)}
      <label>Màu / tone<input type="color" name="mau" value="${esc(x.mau || '#C9A0A6')}"></label>
      <label>Tên màu<input name="ten_mau" value="${esc(x.ten_mau || '')}" placeholder="#06 Fig Fig…"></label>
      <div class="ca-dong" id="st-goi-y-mau">${stKqSon(x.mau || '#C9A0A6', x.loai)}</div>
      <label>Ngày mở nắp<input type="date" name="ngay_mo" value="${esc(x.ngay_mo || '')}"></label>
      <label>Dùng được sau mở (tháng)<input type="number" name="pao" value="${x.pao || ''}" placeholder="${(MP_LOAI[x.loai] || [, 12])[1]} (theo ký hiệu hũ mở nắp)"></label>
      <label>Hạn in trên bao bì<input type="date" name="han_su_dung" value="${esc(x.han_su_dung || '')}"></label>
      <label>Giá (đ)<input data-so name="gia" value="${x.gia || ''}"></label>
      <label class="ca-dong">Link<input name="link" value="${esc(x.link || '')}"></label>
      <label class="ca-dong">Ghi chú<textarea name="ghi_chu" rows="2">${esc(x.ghi_chu || '')}</textarea></label>
    </div>`,
    khiMo: n => { ganOTien(n); ganAnhForm(n, ctx); const cap = () => { n.querySelector('#st-goi-y-mau').innerHTML = stKqSon(n.querySelector('[name=mau]').value, n.querySelector('[name=loai]').value); }; n.querySelector('[name=mau]').addEventListener('input', cap); n.querySelector('[name=loai]').addEventListener('change', cap); },
    nut: [
      ...(id ? [{ chu: 'Xoá', kieu: 'nguy', trai: true, bam: async () => { if (!(await hoi(`Xoá "${esc(x.ten)}"?`, 'Xoá', 'nguy'))) return false; await luuMyPham(myPham().filter(m => m.id !== id)); if (caiDat('anh:' + id, '')) await luuCaiDat('anh:' + id, ''); ve(); } }] : []),
      { chu: 'Huỷ', bam: () => { } },
      { chu: 'Lưu', kieu: 'chinh', bam: async n => {
        const f = docForm(n); if (!f.ten) return false;
        const moi = { ...x, id: id || 'mp' + Date.now(), ten: f.ten, loai: f.loai, hang: f.hang, trang_thai: f.trang_thai, con: f.con, mau: f.mau, ten_mau: f.ten_mau, ngay_mo: f.ngay_mo, pao: Number(f.pao) || null, han_su_dung: f.han_su_dung, gia: Number(f.gia) || 0, link: f.link, ghi_chu: f.ghi_chu, anh_url: f.anh_url || '' };
        if (moi.trang_thai === 'muon_mua' && !moi.ngay_them) moi.ngay_them = homNay();
        await luuAnh(moi.id, ctx); await luuMyPham([...myPham().filter(m => m.id !== moi.id), moi]); ve();
      } }],
  });
}
function stKqSon(hex, loai) {
  if (!['Son', 'Má hồng'].includes(loai)) return '';
  const k = kiemSon(hex);
  return `<div class="st-kq-mau"><span class="st-mau-to nho" style="background:${hex}"></span><div><span class="the mt-nhan ${k.lop}">${k.nhan}</span><p>${[...k.ly, ...k.ghi].join(' · ')}</p></div></div>`;
}

/* ================= HÀNH ĐỘNG ================= */
async function ghiChiTieu(x, laMP) {
  if (!x.gia || !S.chi_tieu) return;
  try { await luu('chi_tieu', { ngay: homNay(), so_tien: Number(x.gia), loai: 'chi', danh_muc: laMP ? 'Làm đẹp' : 'Quần áo', ghi_chu: x.ten }); } catch (e) { }
}
const HD_ST = {
  'st-tab': el => { ST.tab = el.dataset.v; ve(); },
  'st-mo-tab': el => { ST.tab = el.dataset.v; location.hash = '#/style'; },
  'st-loc': el => { ST.loc = el.dataset.v; ve(); },
  'mp-loc': el => { ST.mpLoc = el.dataset.v; ve(); },
  'st-dip': el => { ST.dip = el.dataset.v; ST.lan = 0; ve(); },
  'st-doi': () => { ST.lan++; ve(); },
  'st-noi': async el => { await luuCaiDat('style_ho_so', { ...(caiDat('style_ho_so', {}) || {}), noi_o: el.dataset.v }); ve(); },
  'st-moi': el => moMonDo(null, !!el.dataset.mua),
  'st-sua': el => moMonDo(el.dataset.id),
  'mp-moi': () => moMyPham(null),
  'mp-sua': el => moMyPham(el.dataset.id),
  'mp-con': async (el, e) => { e && e.stopPropagation(); const vong = { nhieu: 'it', it: 'het', het: 'nhieu' }; await luuMyPham(myPham().map(x => x.id === el.dataset.id ? { ...x, con: vong[x.con || 'nhieu'] } : x)); ve(); },
  'st-mac': async el => { const ids = el.dataset.ids.split(','), hn = homNay(); await luuTuDo(tuDo().map(x => ids.includes(x.id) ? { ...x, mac: [...new Set([...(x.mac || []), hn])] } : x)); toast('Đã ghi: hôm nay mặc bộ này ✓'); ve(); },
  'st-luu-bo': async el => { const a = caiDat('outfit_luu', []) || []; a.push({ id: 'ob' + Date.now(), ids: el.dataset.ids.split(','), dip: el.dataset.dip, ten: ST_DIP[el.dataset.dip] }); await luuCaiDat('outfit_luu', a); toast('Đã lưu bộ ♥'); ve(); },
  'st-bo-luu': async el => { await luuCaiDat('outfit_luu', (caiDat('outfit_luu', []) || []).filter(o => o.id !== el.dataset.id)); ve(); },
  'st-len-lich': el => moHop({ tieuDe: 'Lên lịch bộ này', noiDung: `<div class="form"><label>Ngày mặc<input type="date" name="d" value="${congNgay(homNay(), 1)}"></label></div>`, nut: [{ chu: 'Huỷ', bam: () => { } }, { chu: 'Lưu', kieu: 'chinh', bam: async n => { const d = docForm(n).d; if (!d) return false; const l = { ...(caiDat('lich_outfit', {}) || {}) }; l[d] = { ids: el.dataset.ids.split(','), dip: el.dataset.dip }; await luuCaiDat('lich_outfit', l); toast(`Đã xếp cho ${ngayVN(d)} ✓`); ve(); } }] }),
  'st-bo-lich': async el => { const l = { ...(caiDat('lich_outfit', {}) || {}) }; delete l[el.dataset.d]; await luuCaiDat('lich_outfit', l); ve(); },
  'st-da-mua': async el => {
    const id = el.dataset.id, laMP = id.startsWith('mp'), ds = laMP ? myPham() : tuDo(), x = ds.find(m => m.id === id); if (!x) return;
    const moi = ds.map(m => m.id === id ? { ...m, trang_thai: 'co', ngay_mua: homNay(), con: 'nhieu' } : m);
    if (laMP) await luuMyPham(moi); else await luuTuDo(moi);
    await ghiChiTieu(x, laMP);
    toast(x.gia ? `Đã chuyển vào ${laMP ? 'kho mỹ phẩm' : 'tủ đồ'} và ghi ${tien(x.gia)} vào Chi tiêu` : 'Đã chuyển vào tủ ✓');
    if (!laMP && x.shop && x.size && !(caiDat('size_shop', []) || []).some(z => z.shop === x.shop)) { const a = caiDat('size_shop', []) || []; a.push({ shop: x.shop, [nhomCua(x.loai) === 'Quần' ? 'quan' : nhomCua(x.loai) === 'Giày' ? 'giay' : 'ao']: x.size }); await luuCaiDat('size_shop', a); }
    ve();
  },
  'st-bo-mua': async el => {
    const id = el.dataset.id, laMP = id.startsWith('mp'), x = (laMP ? myPham() : tuDo()).find(m => m.id === id); if (!x) return;
    if (!(await hoi(`Bỏ "${esc(x.ten)}" khỏi danh sách muốn mua?${x.gia ? ` Thầy vừa giữ lại ${tien(x.gia)} 🌿` : ''}`, 'Bỏ, không mua'))) return;
    if (laMP) await luuMyPham(myPham().filter(m => m.id !== id)); else await luuTuDo(tuDo().filter(m => m.id !== id));
    const nh = caiDat('style_nhin', { tong: 0, so: 0 }) || { tong: 0, so: 0 }; await luuCaiDat('style_nhin', { tong: (nh.tong || 0) + (Number(x.gia) || 0), so: (nh.so || 0) + 1 });
    toast('Đã nhịn được thêm một món 👏'); ve();
  },
  'sk-buoi': el => { ST.skBuoi = el.dataset.v; ve(); },
  'sk-tick': async el => {
    const sk = { ...(caiDat('skincare', null) || { sang: SK_MAC_DINH.sang, toi: SK_MAC_DINH.toi, log: {} }) }; sk.log = { ...(sk.log || {}) };
    const k = `${homNay()}|${ST.skBuoi}`, i = Number(el.dataset.i), a = new Set(sk.log[k] || []); a.has(i) ? a.delete(i) : a.add(i); sk.log[k] = [...a];
    await luuCaiDat('skincare', sk); ve();
  },
  'sk-sua': () => {
    const sk = caiDat('skincare', null) || { sang: SK_MAC_DINH.sang, toi: SK_MAC_DINH.toi, log: {} };
    moHop({ tieuDe: 'Các bước skincare', noiDung: `<div class="form"><label>Buổi sáng (mỗi dòng một bước)<textarea name="sang" rows="6">${esc(sk.sang.join('\n'))}</textarea></label><label>Buổi tối<textarea name="toi" rows="6">${esc(sk.toi.join('\n'))}</textarea></label><p class="mo nho">Đặt tên bước trùng loại mỹ phẩm (Toner, Serum…) để web tự gắn sản phẩm trong kho.</p></div>`,
      nut: [{ chu: 'Huỷ', bam: () => { } }, { chu: 'Lưu', kieu: 'chinh', bam: async n => { const f = docForm(n), t = s => (s || '').split('\n').map(x => x.trim()).filter(Boolean); await luuCaiDat('skincare', { ...sk, sang: t(f.sang), toi: t(f.toi) }); ve(); } }] });
  },
  'vali-tick': async el => { const v = { ...(caiDat('vali', null) || {}) }; v.tick = { ...(v.tick || {}) }; v.tick[el.dataset.k] = el.checked; await luuCaiDat('vali', v); ve(); },
  'vali-xoa': async () => { if (!(await hoi('Xoá danh sách vali này?', 'Xoá', 'nguy'))) return; await luuCaiDat('vali', null); ve(); },
  'size-moi': () => moHop({ tieuDe: 'Size theo shop', noiDung: `<div class="form luoi-form"><label class="ca-dong">Shop / thương hiệu<input name="shop"></label><label>Áo<input name="ao" placeholder="M"></label><label>Quần<input name="quan" placeholder="29"></label><label>Giày<input name="giay" placeholder="40"></label><label>Ghi chú<input name="ghi_chu" placeholder="form nhỏ, nên lên size"></label></div>`,
    nut: [{ chu: 'Huỷ', bam: () => { } }, { chu: 'Lưu', kieu: 'chinh', bam: async n => { const f = docForm(n); if (!f.shop) return false; const a = (caiDat('size_shop', []) || []).filter(z => z.shop !== f.shop); a.push(f); await luuCaiDat('size_shop', a); ve(); } }] }),
  'size-xoa': async el => { const a = [...(caiDat('size_shop', []) || [])]; a.splice(Number(el.dataset.i), 1); await luuCaiDat('size_shop', a); ve(); },
  'st-so-do': () => {
    const hs = hoSoST();
    moHop({ tieuDe: 'Số đo & ngân sách', noiDung: `<div class="form luoi-form">${[['cao', 'Chiều cao (cm)'], ['nang', 'Cân nặng (kg)'], ['vai', 'Ngang vai (cm)'], ['nguc', 'Vòng ngực (cm)'], ['eo', 'Vòng eo (cm)']].map(([k, t]) => `<label>${t}<input type="number" name="${k}" value="${hs[k]}"></label>`).join('')}<label>Tối đa mỗi món (đ)<input data-so name="ngan_sach" value="${hs.ngan_sach}"></label><label>Ngân sách quần áo + làm đẹp / tháng (đ)<input data-so name="ngan_sach_thang" value="${hs.ngan_sach_thang}"></label></div>`,
      khiMo: ganOTien, nut: [{ chu: 'Huỷ', bam: () => { } }, { chu: 'Lưu', kieu: 'chinh', bam: async n => { const f = docForm(n); const o = { ...(caiDat('style_ho_so', {}) || {}) }; Object.keys(ST_HO_SO_MAC_DINH).forEach(k => o[k] = Number(f[k]) || ST_HO_SO_MAC_DINH[k]); await luuCaiDat('style_ho_so', o); ve(); } }] });
  },
};
