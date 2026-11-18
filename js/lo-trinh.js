/* LỘ TRÌNH ÔN HSK 7–9 — chuyển từ file theo-doi-on-hsk7-9.html của Thầy vào mục Thói quen.
   Dữ liệu lưu online trong cai_dat 'lo_trinh_hsk79' = { start: 'yyyy-mm-dd', done: { 'yyyy-mm-dd|id': 1 } }
   (không cần sửa Supabase). Nếu trình duyệt còn dữ liệu cũ của file (localStorage) thì tự chuyển sang. */

const L79_TONG_TUAN = 35, L79_KEY_CU = 'gy-habit-hsk79-v1';
const L79_THU = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const L79_NHOM = {
  vocab: ['#8ea888', '#e6eee2', 'Từ vựng'], listen: ['#a79bc8', '#eeebf6', 'Nghe · Nói'], read: ['#c8a679', '#f4ecdf', 'Đọc'],
  write: ['#d39a98', '#f8e7e5', 'Viết · Dịch'], test: ['#c29a55', '#f6eedc', 'Luyện đề'],
};
const L79_GD = [
  { ten: 'Nền tảng & từ vựng', m: [1, 2], c: '#8ea888', rgb: '142,168,136' },
  { ten: 'Rèn từng kỹ năng', m: [3, 5], c: '#a79bc8', rgb: '167,155,200' },
  { ten: 'Luyện đề theo phần', m: [6, 7], c: '#d39a98', rgb: '211,154,152' },
  { ten: 'Thi thử toàn bài', m: [8, 8], c: '#c29a55', rgb: '194,154,85' },
];
// d: 1 = Thứ 2 … 7 = Chủ nhật · m: tháng 1–8 của lộ trình · w: tuần 1–35
const L79_BAI = [
  { id: 'anki', cat: 'vocab', ten: 'Anki từ vựng', note: '20 từ mới + ôn từ cũ', min: 15, khi: () => true },
  { id: 'pinyin', cat: 'write', ten: 'Gõ pinyin', note: 'Luyện tốc độ gõ để thi trên máy', min: 10, khi: m => m <= 2 },
  { id: 'nghetd', cat: 'listen', ten: 'Nghe thụ động', note: '小宇宙 / 喜马拉雅 khi di chuyển', min: 0, khi: () => true },
  { id: 'docpc', cat: 'read', ten: 'Đọc bài phân cấp', note: 'Du Chinese / The Chairman’s Bao', min: 20, khi: (m, d) => m <= 2 && d <= 5 },
  { id: 'chinhta', cat: 'listen', ten: 'Nghe chép chính tả', note: 'Tin tức, phỏng vấn, bài giảng', min: 30, khi: (m, d) => m >= 3 && (d === 1 || d === 3) },
  { id: 'xaluan', cat: 'read', ten: 'Đọc xã luận có bấm giờ', note: '人民日报 / 澎湃新闻', min: 30, khi: (m, d) => m >= 3 && (d === 2 || d === 4) },
  { id: 'dichnoi', cat: 'listen', ten: 'Dịch 1 đoạn + ghi âm nói', note: 'Trả lời 2–3 phút, nghe lại', min: 30, khi: (m, d) => m >= 3 && d === 5 },
  { id: 'soloi', cat: 'vocab', ten: 'Ôn sổ lỗi', note: '成语, từ gần nghĩa, hư từ văn viết', min: 15, khi: (m, d) => m >= 6 && d <= 5 },
  { id: 'viet', cat: 'write', ten: 'Viết 1 bài', note: 'Nghị luận hoặc mô tả biểu đồ', min: 60, khi: (m, d) => m >= 3 && d === 6 },
  { id: 'italki', cat: 'listen', ten: 'italki chấm nói & viết', note: '2 buổi mỗi tháng', min: 60, khi: (m, d, w) => m >= 3 && d === 6 && w % 2 === 0 },
  { id: 'chambai', cat: 'write', ten: 'Chấm bài + ghi sổ lỗi', note: 'Gửi bài viết, bài dịch cho Claude chấm', min: 20, khi: (m, d) => m >= 3 && m <= 5 && d === 7 },
  { id: 'luyende', cat: 'test', ten: 'Luyện 1–2 phần đề', note: 'Đúng thời gian đề thật', min: 90, khi: (m, d) => (m === 6 || m === 7) && d === 7 },
  { id: 'thithu', cat: 'test', ten: 'Thi thử toàn bài', note: 'Khoảng 210 phút, như thi thật', min: 210, khi: (m, d) => m >= 8 && d === 7 },
  { id: 'dethu', cat: 'test', ten: '✦ Đề thử kiểm tra', note: 'So sánh với đề đầu tiên', min: 210, khi: (m, d, w) => d === 7 && [1, 9, 22, 31].includes(w) },
];
const L79 = { xem: 'day', ngay: null, tuan: null };

/* ----- dữ liệu ----- */
function l79Data() {
  let s = caiDat('lo_trinh_hsk79', null);
  if (!s) {
    try { const cu = JSON.parse(localStorage.getItem(L79_KEY_CU) || 'null'); if (cu && cu.start && cu.done) { s = cu; luuCaiDat('lo_trinh_hsk79', cu).catch(() => { }); } } catch (e) { }
  }
  return s || { start: dauTuan(homNay()), done: {}, moi: true };
}
async function l79Luu(s) { const { moi, ...g } = s; await luuCaiDat('lo_trinh_hsk79', g); }
const l79BatDau = () => dauTuan(l79Data().start);
const l79Lech = (a, b) => Math.round((s2d(b) - s2d(a)) / 864e5);
const l79Tuan = n => Math.floor(l79Lech(l79BatDau(), n) / 7) + 1;
const l79Thang = w => Math.min(8, Math.floor((w - 1) * 7 / 30.44) + 1);
const l79Thu = n => (s2d(n).getDay() + 6) % 7 + 1;
const l79Ngay = (w, d) => congNgay(l79BatDau(), (w - 1) * 7 + (d - 1));
const l79GD = m => L79_GD.find(p => m >= p.m[0] && m <= p.m[1]) || L79_GD[0];
const l79Kep = w => Math.max(1, Math.min(L79_TONG_TUAN, w));
function l79BaiNgay(n) {
  const w = l79Tuan(n); if (w < 1 || w > L79_TONG_TUAN) return [];
  const m = l79Thang(w), d = l79Thu(n);
  return L79_BAI.filter(h => h.khi(m, d, w));
}
const l79Xong = (n, h) => !!l79Data().done[`${n}|${h.id}`];
function l79TkTuan(w) { let tong = 0, ok = 0; for (let d = 1; d <= 7; d++) { const n = l79Ngay(w, d); l79BaiNgay(n).forEach(h => { tong++; if (l79Xong(n, h)) ok++; }); } return { tong, ok }; }
function l79TkKhoang(tu, den) {   // dùng cho Mục tiêu
  let tong = 0, ok = 0; const hn = homNay();
  for (let n = tu; n <= den && n <= hn; n = congNgay(n, 1)) l79BaiNgay(n).forEach(h => { tong++; if (l79Xong(n, h)) ok++; });
  return { tong, ok, pt: tong ? Math.round(ok * 100 / tong) : 0 };
}
function l79TongQuan() {
  const hn = homNay(), w = l79Tuan(hn), bs = l79BaiNgay(hn);
  const du = n => { const a = l79BaiNgay(n); return a.length > 0 && a.every(h => l79Xong(n, h)); };
  let chuoi = 0, d = hn; if (!du(d)) d = congNgay(d, -1);
  while (l79Tuan(d) >= 1 && du(d) && chuoi < 400) { chuoi++; d = congNgay(d, -1); }
  let T = 0, O = 0; for (let i = 1; i <= L79_TONG_TUAN; i++) { const s = l79TkTuan(i); T += s.tong; O += s.ok; }
  return { w, bs, ok: bs.filter(h => l79Xong(hn, h)).length, chuoi, pt: T ? Math.round(O * 100 / T) : 0 };
}

/* ----- giao diện ----- */
const l79Mau = h => `--c:${L79_NHOM[h.cat][0]};--cl:${L79_NHOM[h.cat][1]}`;
const l79Dm = n => `${n.slice(8, 10)}/${n.slice(5, 7)}`;
const l79Thu2 = n => { const d = l79Thu(n); return (d === 7 ? 'Chủ nhật' : 'Thứ ' + (d + 1)) + ', ' + ngayVN(n); };

function vLoTrinh() {
  const s = l79Data(), hn = homNay();
  if (!L79.ngay) L79.ngay = hn;
  if (L79.tuan == null) L79.tuan = l79Kep(l79Tuan(hn));
  const tq = l79TongQuan(), ket = congNgay(l79BatDau(), L79_TONG_TUAN * 7 - 1);
  const than = L79.xem === 'week' ? l79VeTuan() : L79.xem === 'all' ? l79VeTong() : l79VeNgay();
  return `<div class="lt79">
    <div class="lt79-wash w1"></div><div class="lt79-wash w2"></div><div class="lt79-wash w3"></div><div class="lt79-khung"></div>
    <span class="lt79-sao" style="left:9px;top:9px">✦</span><span class="lt79-sao" style="right:9px;top:9px">✦</span><span class="lt79-sao" style="left:9px;bottom:9px">✦</span><span class="lt79-sao" style="right:9px;bottom:9px">✦</span>
    ${L79_LA}
    <div class="lt79-trong">
      <div class="lt79-dau">
        <div class="lt79-tag">Tiếng Trung cùng Guangyu Laoshi</div>
        <h2>Lộ trình ôn HSK 7–9</h2>
        <div class="lt79-phu">Mục tiêu cấp 7 · 8 tháng · ${L79_TONG_TUAN} tuần</div>
        <div class="lt79-bd">Ngày bắt đầu <input type="date" value="${s.start}" data-act-change="l79-start"> <span>→ kết thúc ${ngayVN(ket)}</span>${s.moi ? ' <small class="mo">(chưa lưu, chọn ngày để bắt đầu)</small>' : ''}</div>
      </div>
      <div class="lt79-so">
        <div class="s1"><b>${tq.w < 1 ? 'Sắp bắt đầu' : tq.w > L79_TONG_TUAN ? 'Hoàn thành' : `${tq.w} / ${L79_TONG_TUAN}`}</b><span>Tuần hiện tại</span></div>
        <div class="s2"><b>${tq.bs.length ? `${tq.ok} / ${tq.bs.length}` : '–'}</b><span>Xong hôm nay</span></div>
        <div class="s3"><b>${tq.chuoi} ngày</b><span>Chuỗi ngày đủ bài</span></div>
        <div class="s4"><b>${tq.pt}%</b><span>Tổng tiến độ</span><div class="lt79-thanh"><i style="width:${tq.pt}%"></i></div></div>
      </div>
      <div class="lt79-tabs">${[['day', 'Hôm nay'], ['week', 'Theo tuần'], ['all', 'Tổng quan']].map(([v, c]) => `<button class="${L79.xem === v ? 'on' : ''}" data-act="l79-xem" data-v="${v}">${c}</button>`).join('')}</div>
      <div class="lt79-chu">${Object.values(L79_NHOM).map(c => `<span><i style="background:${c[0]}"></i>${c[2]}</span>`).join('')}</div>
      ${than}
      <div class="lt79-chan"><button class="lt79-nut" data-act="l79-xuat">⤓ Xuất dữ liệu</button><button class="lt79-nut" data-act="l79-nhap">⤒ Nhập dữ liệu</button></div>
    </div>
  </div>`;
}
function l79VeNgay() {
  const n = L79.ngay, w = l79Tuan(n), bs = l79BaiNgay(n), phut = bs.reduce((a, h) => a + h.min, 0);
  const phu = w < 1 ? 'Trước ngày bắt đầu' : w > L79_TONG_TUAN ? 'Sau khi kết thúc lộ trình' : `Tuần ${w} · Tháng ${l79Thang(w)} · ${l79GD(l79Thang(w)).ten}`;
  return `<div class="lt79-nav"><button class="lt79-nut" data-act="l79-ngay" data-d="-1">‹ Trước</button><div class="t">${l79Thu2(n)}<small>${phu}${bs.length ? ` · khoảng ${phut} phút` : ''}</small></div><button class="lt79-nut" data-act="l79-ngay" data-d="1">Sau ›</button></div>
    ${bs.length ? `<div class="lt79-ds">${bs.map(h => { const on = l79Xong(n, h); return `<div class="lt79-muc ${on ? 'xong' : ''}" style="${l79Mau(h)}" data-act="l79-tick" data-n="${n}" data-h="${h.id}"><div class="o">${on ? '✓' : ''}</div><div><div class="nm">${h.ten}</div><div class="nt">${h.note}</div></div><div class="mn">${h.min ? h.min + ' phút' : 'Lúc rảnh'}</div></div>`; }).join('')}</div>`
      : `<div class="lt79-trong-bai">Hôm nay không có bài, Thầy nghỉ ngơi nhé ✦</div>`}
    ${n !== homNay() ? `<div class="giua" style="margin-top:12px"><button class="lt79-nut" data-act="l79-ngay" data-d="0">Về hôm nay</button></div>` : ''}`;
}
function l79VeTuan() {
  const w = l79Kep(L79.tuan), m = l79Thang(w), s = l79TkTuan(w), hn = homNay();
  const dung = L79_BAI.filter(h => [1, 2, 3, 4, 5, 6, 7].some(d => h.khi(m, d, w)));
  return `<div class="lt79-nav"><button class="lt79-nut" data-act="l79-tuan" data-d="-1">‹ Tuần trước</button><div class="t">Tuần ${w} / ${L79_TONG_TUAN}<small>${l79Dm(l79Ngay(w, 1))} – ${l79Dm(l79Ngay(w, 7))} · ${l79GD(m).ten} · ${s.ok}/${s.tong} bài</small></div><button class="lt79-nut" data-act="l79-tuan" data-d="1">Tuần sau ›</button></div>
    <div class="lt79-bang"><table><thead><tr><th class="h">Thói quen</th>${[1, 2, 3, 4, 5, 6, 7].map(d => { const n = l79Ngay(w, d); return `<th class="${n === hn ? 'nay' : ''}"><b>${L79_THU[d - 1]}</b>${l79Dm(n)}</th>`; }).join('')}</tr></thead>
    <tbody>${dung.map(h => `<tr style="${l79Mau(h)}"><td class="h">${h.ten}<small>${h.min ? h.min + ' phút' : 'Lúc rảnh'}</small></td>${[1, 2, 3, 4, 5, 6, 7].map(d => { const n = l79Ngay(w, d); if (!h.khi(m, d, w)) return '<td><span class="cham">·</span></td>'; const on = l79Xong(n, h); return `<td><span class="o ${on ? 'on' : ''}" data-act="l79-tick" data-n="${n}" data-h="${h.id}">${on ? '✓' : ''}</span></td>`; }).join('')}</tr>`).join('')}</tbody></table></div>`;
}
function l79VeTong() {
  const cw = l79Tuan(homNay());
  return `<div class="lt79-gd">${L79_GD.map((p, i) => {
    let o = '';
    for (let w = 1; w <= L79_TONG_TUAN; w++) {
      const m = l79Thang(w); if (m < p.m[0] || m > p.m[1]) continue;
      const s = l79TkTuan(w), r = s.tong ? s.ok / s.tong : 0;
      o += `<div class="lt79-tuan ${w === cw ? 'nay' : ''}" data-act="l79-mo-tuan" data-w="${w}" style="background:${r === 0 ? '#fffdf9' : `rgba(${p.rgb},${(0.2 + 0.8 * r).toFixed(2)})`};color:${r > 0.6 ? '#fff' : 'var(--l79-ink)'}"><b>T${w}</b>${Math.round(r * 100)}%</div>`;
    }
    return `<div class="lt79-p" style="border-top:3px solid ${p.c}"><h4>${i + 1}. ${p.ten}</h4><p>Tháng ${p.m[0]}${p.m[1] !== p.m[0] ? '–' + p.m[1] : ''}</p><div class="lt79-luoi">${o}</div></div>`;
  }).join('')}</div>
  <div class="lt79-chu-thich">Ô càng đậm là tuần làm được càng nhiều · Viền chấm vàng là tuần hiện tại · Bấm vào ô để xem chi tiết<br>Đề thử kiểm tra vào Chủ nhật các tuần 1, 9, 22, 31</div>`;
}
const L79_LA = `<svg class="lt79-la tl" viewBox="0 0 90 150" fill="none"><path d="M14 148 C22 110 18 76 44 40 C54 26 62 16 74 6" stroke="#7d9677" stroke-width="1.2" stroke-linecap="round"/><g fill="#8ea888"><ellipse cx="10" cy="128" rx="9" ry="3.6" transform="rotate(-62 10 128)"/><ellipse cx="27" cy="120" rx="9" ry="3.6" transform="rotate(-118 27 120)" opacity=".8"/><ellipse cx="12" cy="100" rx="9" ry="3.6" transform="rotate(-55 12 100)" opacity=".9"/><ellipse cx="30" cy="92" rx="9" ry="3.6" transform="rotate(-125 30 92)"/><ellipse cx="22" cy="72" rx="8.5" ry="3.4" transform="rotate(-48 22 72)" opacity=".8"/><ellipse cx="42" cy="66" rx="8.5" ry="3.4" transform="rotate(-128 42 66)"/><ellipse cx="38" cy="44" rx="8" ry="3.2" transform="rotate(-40 38 44)"/><ellipse cx="56" cy="40" rx="8" ry="3.2" transform="rotate(-135 56 40)" opacity=".85"/><ellipse cx="56" cy="20" rx="7" ry="3" transform="rotate(-30 56 20)" opacity=".8"/><ellipse cx="70" cy="18" rx="7" ry="3" transform="rotate(-140 70 18)"/></g></svg>
<svg class="lt79-la br" viewBox="0 0 80 120" fill="none"><path d="M56 118 C54 90 50 64 38 36" stroke="#7d9677" stroke-width="1.2" stroke-linecap="round"/><path d="M52 86 C60 76 66 72 74 70" stroke="#7d9677" stroke-width="1" stroke-linecap="round"/><g fill="#8ea888"><ellipse cx="46" cy="100" rx="8" ry="3.2" transform="rotate(-70 46 100)"/><ellipse cx="62" cy="96" rx="8" ry="3.2" transform="rotate(-115 62 96)" opacity=".8"/><ellipse cx="44" cy="70" rx="7" ry="3" transform="rotate(-60 44 70)" opacity=".85"/></g><g transform="translate(36 30)" fill="#e2a9a5"><circle cx="0" cy="-8" r="6"/><circle cx="7.6" cy="-2.5" r="6"/><circle cx="4.7" cy="6.5" r="6"/><circle cx="-4.7" cy="6.5" r="6"/><circle cx="-7.6" cy="-2.5" r="6"/><circle r="3.2" fill="#c99a55"/></g><g transform="translate(74 68)" fill="#ecc3c0"><circle cx="0" cy="-4" r="3.2"/><circle cx="3.8" cy="-1.2" r="3.2"/><circle cx="2.4" cy="3.3" r="3.2"/><circle cx="-2.4" cy="3.3" r="3.2"/><circle cx="-3.8" cy="-1.2" r="3.2"/><circle r="1.6" fill="#c99a55"/></g></svg>`;

/* khối nhỏ cho trang Hôm nay */
function l79HomNay() {
  const s = caiDat('lo_trinh_hsk79', null); if (!s) return '';
  const hn = homNay(), bs = l79BaiNgay(hn); if (!bs.length) return '';
  const ok = bs.filter(h => l79Xong(hn, h)).length, phut = bs.filter(h => !l79Xong(hn, h)).reduce((a, h) => a + h.min, 0);
  return `<div class="lt79-mini"><div class="lt79-mini-dau"><b>Ôn HSK 7–9 · tuần ${l79Tuan(hn)}</b><small>${ok}/${bs.length} bài${phut ? ` · còn ~${phut} phút` : ' · xong hết ✦'}</small></div>
    ${bs.map(h => { const on = l79Xong(hn, h); return `<button class="lt79-chip ${on ? 'on' : ''}" style="${l79Mau(h)}" data-act="l79-tick" data-n="${hn}" data-h="${h.id}"><i>${on ? '✓' : ''}</i>${h.ten}<small>${h.min ? h.min + "'" : '∞'}</small></button>`; }).join('')}</div>`;
}

/* hành động */
const HD_L79 = {
  'l79-xem': el => { L79.xem = el.dataset.v; if (L79.xem === 'week') L79.tuan = l79Kep(l79Tuan(homNay())); ve(); },
  'l79-ngay': el => { const d = Number(el.dataset.d); L79.ngay = d === 0 ? homNay() : congNgay(L79.ngay || homNay(), d); ve(); },
  'l79-tuan': el => { L79.tuan = l79Kep((L79.tuan || 1) + Number(el.dataset.d)); ve(); },
  'l79-mo-tuan': el => { L79.tuan = Number(el.dataset.w); L79.xem = 'week'; ve(); },
  'l79-tick': async el => {
    const s = { ...l79Data() }; s.done = { ...s.done }; const k = `${el.dataset.n}|${el.dataset.h}`;
    if (s.done[k]) delete s.done[k]; else s.done[k] = 1;
    await l79Luu(s); ve();
  },
  'l79-xuat': () => { const s = l79Data(); const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify({ start: s.start, done: s.done })], { type: 'application/json' })); a.download = `on-hsk79-${homNay()}.json`; document.body.appendChild(a); a.click(); a.remove(); },
  'l79-nhap': () => {
    const fi = document.createElement('input'); fi.type = 'file'; fi.accept = '.json,application/json';
    fi.onchange = () => { const f = fi.files[0]; if (!f) return; const r = new FileReader(); r.onload = async () => { try { const s = JSON.parse(r.result); if (s && s.start && s.done) { await l79Luu(s); toast('Đã nhập dữ liệu lộ trình ✓'); ve(); } else toast('File không đúng định dạng', 'loi'); } catch (e) { toast('File không đọc được', 'loi'); } }; r.readAsText(f); };
    fi.click();
  },
};
async function l79DoiNgayBatDau(v) { if (!v) return; const s = { ...l79Data(), start: v }; await l79Luu(s); L79.tuan = l79Kep(l79Tuan(homNay())); ve(); }
