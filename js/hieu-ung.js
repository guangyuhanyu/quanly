/* HIỆU ỨNG & ÂM THANH (bản 5.4) — phong cách cổ phong, tiết chế.
   Cài đặt lưu theo từng máy (localStorage 'gyq_hieu_ung'). Âm thanh mặc định TẮT và tự im trong giờ dạy. */

const HU_MD = { am: false, amLuong: 0.5, nen: true, giam: false };
let HU = (() => { try { return { ...HU_MD, ...JSON.parse(localStorage.getItem('gyq_hieu_ung') || '{}') }; } catch (e) { return { ...HU_MD }; } })();
const luuHU = () => { try { localStorage.setItem('gyq_hieu_ung', JSON.stringify(HU)); } catch (e) { } };
const giamDong = () => HU.giam || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);

/* ================= ÂM THANH (tự tổng hợp, không cần file) ================= */
let AC = null;
const ac = () => { if (!AC) { const C = window.AudioContext || window.webkitAudioContext; if (!C) return null; AC = new C(); } if (AC.state === 'suspended') AC.resume(); return AC; };
function dangDay() {   // đang trong giờ có buổi học (±5 phút) → im lặng
  try {
    const hn = homNay(), d = new Date(), now = d.getHours() * 60 + d.getMinutes();
    return S.buoi_hoc.some(b => b.ngay === hn && b.gio_bat_dau && b.trang_thai !== 'huy' && b.trang_thai !== 'nghi' && (() => { const [h, m] = b.gio_bat_dau.split(':').map(Number), bd = h * 60 + m, kt = bd + (Number(b.thoi_luong_phut) || 90); return now >= bd - 5 && now <= kt + 5; })());
  } catch (e) { return false; }
}
const coPhat = () => HU.am && !dangDay();
function gay(tan, luc = 0, dai = 1.6, to = 1) {   // một nốt đàn tranh: dây gảy, tắt dần, hơi trượt cao độ
  const a = ac(); if (!a) return; const t = a.currentTime + luc, v = HU.amLuong * .35 * to;
  const g = a.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + .006); g.gain.exponentialRampToValueAtTime(.0008, t + dai);
  const loc = a.createBiquadFilter(); loc.type = 'lowpass'; loc.frequency.setValueAtTime(5200, t); loc.frequency.exponentialRampToValueAtTime(900, t + dai * .7);
  [[1, 'triangle', 1], [2, 'sine', .35], [3, 'sine', .12]].forEach(([k, kieu, m]) => {
    const o = a.createOscillator(), gg = a.createGain(); o.type = kieu;
    o.frequency.setValueAtTime(tan * k * 1.012, t); o.frequency.exponentialRampToValueAtTime(tan * k, t + .08);
    gg.gain.value = m; o.connect(gg).connect(loc); o.start(t); o.stop(t + dai + .1);
  });
  loc.connect(g).connect(a.destination);
}
function khanh(tan = 880, luc = 0) {   // chuông khánh: các bội âm không hoà, ngân dài
  const a = ac(); if (!a) return; const t = a.currentTime + luc;
  [[1, .5, 3.2], [2.76, .25, 2.2], [5.4, .12, 1.4], [8.9, .05, .8]].forEach(([k, m, dai]) => {
    const o = a.createOscillator(), g = a.createGain(); o.type = 'sine'; o.frequency.value = tan * k;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(HU.amLuong * .22 * m, t + .01); g.gain.exponentialRampToValueAtTime(.0005, t + dai);
    o.connect(g).connect(a.destination); o.start(t); o.stop(t + dai + .1);
  });
}
function xu(luc = 0) {   // tiếng đồng xu
  const a = ac(); if (!a) return; const t = a.currentTime + luc;
  [[1976, 0], [2637, .07]].forEach(([f, d]) => {
    const o = a.createOscillator(), g = a.createGain(); o.type = 'square'; o.frequency.value = f;
    const lo = a.createBiquadFilter(); lo.type = 'bandpass'; lo.frequency.value = f; lo.Q.value = 6;
    g.gain.setValueAtTime(0, t + d); g.gain.linearRampToValueAtTime(HU.amLuong * .12, t + d + .004); g.gain.exponentialRampToValueAtTime(.0005, t + d + .35);
    o.connect(lo).connect(g).connect(a.destination); o.start(t + d); o.stop(t + d + .4);
  });
}
const NGU_AM = [392, 440, 523.25, 587.33, 659.25, 784, 880];   // ngũ cung G A C D E
const AM = {
  tich: () => coPhat() && gay(NGU_AM[2 + Math.floor(Math.random() * 3)], 0, 1.4, .8),
  boTich: () => coPhat() && gay(NGU_AM[0], 0, .7, .5),
  hoa: () => coPhat() && [0, 1, 2, 3, 4].forEach((i, k) => gay(NGU_AM[[2, 3, 4, 5, 6][i]], k * .11, 1.8, .7)),
  datMucTieu: () => { if (!coPhat()) return; khanh(784); khanh(1046.5, .35); gay(NGU_AM[5], .7, 2, .6); },
  xu: () => coPhat() && (xu(0), xu(.16)),
  thu: () => { if (!HU.am) return; gay(NGU_AM[3], 0, 1.4, .9); khanh(1046.5, .25); },
};

/* ================= HIỆU ỨNG HÌNH ================= */
function lop() { let l = document.getElementById('hu-lop'); if (!l) { l = document.createElement('div'); l.id = 'hu-lop'; l.setAttribute('aria-hidden', 'true'); document.body.appendChild(l); } return l; }
function hatRoi(n, tao, thoiGian = 3200) {
  if (giamDong()) return; const L = lop();
  for (let i = 0; i < n; i++) {
    const e = tao(i); e.style.left = (Math.random() * 100) + 'vw'; e.style.animationDelay = (Math.random() * .9) + 's';
    e.style.setProperty('--troi', ((Math.random() - .5) * 160) + 'px'); e.style.setProperty('--xoay', ((Math.random() - .5) * 720) + 'deg');
    e.style.animationDuration = (thoiGian / 1000 * (.75 + Math.random() * .5)) + 's';
    L.appendChild(e); setTimeout(() => e.remove(), thoiGian + 1200);
  }
}
const HIEU_UNG = {
  hoaDao() {
    hatRoi(26, () => { const e = document.createElement('i'); e.className = 'hu-hoa'; e.innerHTML = `<svg viewBox="0 0 20 20"><path d="M10 1c3 3 5 6 4 10-1 3-3 5-4 8-1-3-3-5-4-8-1-4 1-7 4-10z" fill="${['#F4B9C6', '#F7CBD5', '#EDA6B8', '#FADDE4'][Math.floor(Math.random() * 4)]}"/></svg>`; return e; });
  },
  xu() {
    hatRoi(16, () => { const e = document.createElement('i'); e.className = 'hu-xu'; e.innerHTML = '<b></b>'; return e; }, 2400);
  },
  hac() {
    if (giamDong()) return; const L = lop(), e = document.createElement('div'); e.className = 'hu-hac';
    e.innerHTML = `<svg viewBox="0 0 120 60"><g fill="none" stroke="#2F3F46" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path class="canh" d="M58 30C44 12 24 8 6 14c16 2 30 9 40 20"/><path class="canh2" d="M62 30c14-18 34-22 52-16-16 2-30 9-40 20"/><path d="M40 34c10 2 26 2 38-2l14-4 8 1-8 3c-6 4-12 6-20 7"/><path d="M92 29l10-6 4 1"/><path d="M60 38l-6 14M64 37l-2 15"/></g><circle cx="99" cy="25" r="2.4" fill="#B23A2E"/></svg>`;
    L.appendChild(e); setTimeout(() => e.remove(), 5200);
  },
  dau(x, y) {   // con dấu đỏ "成" tại chỗ bấm
    if (giamDong()) return; const L = lop(), e = document.createElement('i'); e.className = 'hu-dau'; e.textContent = '成';
    e.style.left = x + 'px'; e.style.top = y + 'px'; L.appendChild(e); setTimeout(() => e.remove(), 1100);
  },
  muc(el, x, y) {   // mực loang trên nút
    if (giamDong() || !el) return; const r = el.getBoundingClientRect(), s = Math.max(r.width, r.height) * 2.2, e = document.createElement('span');
    e.className = 'hu-muc'; e.style.width = e.style.height = s + 'px'; e.style.left = (x - r.left - s / 2) + 'px'; e.style.top = (y - r.top - s / 2) + 'px';
    if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
    el.style.overflow = 'hidden'; el.appendChild(e); setTimeout(() => e.remove(), 650);
  },
};

/* ================= NỀN: lá & mây trôi ================= */
let _nenHen = null;
function chayNen() {
  clearTimeout(_nenHen); if (!HU.nen || giamDong()) return;
  _nenHen = setTimeout(() => {
    if (!document.hidden) {
      const L = lop(), may = Math.random() < .45, e = document.createElement('i');
      e.className = may ? 'hu-may' : 'hu-la';
      e.innerHTML = may ? '<svg viewBox="0 0 120 40"><path d="M10 30c-6 0-8-8-2-10 0-8 12-10 16-4 4-8 18-8 20 2 8-4 16 2 14 8 8 0 10 8 2 8H14c-2 0-4-1-4-4z" fill="#fff" opacity=".8"/><path d="M30 22c4-3 9-3 12 1M60 24c3-2 7-2 9 1" stroke="#c9d3d6" fill="none" stroke-width="1.5" stroke-linecap="round"/></svg>'
        : `<svg viewBox="0 0 30 16"><path d="M2 8C8 1 20 0 28 8 20 15 8 15 2 8z" fill="${['#9DB49A', '#B7C8A8', '#C9B98F'][Math.floor(Math.random() * 3)]}"/><path d="M4 8h22" stroke="#7d9677" stroke-width=".8"/></svg>`;
      e.style.top = (8 + Math.random() * (may ? 25 : 60)) + 'vh';
      e.style.animationDuration = (may ? 60 + Math.random() * 30 : 22 + Math.random() * 10) + 's';
      L.appendChild(e); setTimeout(() => e.remove(), 95000);
    }
    chayNen();
  }, 18000 + Math.random() * 22000);
}

/* ================= ĐẾM SỐ & THANH TIẾN ĐỘ khi vào trang ================= */
function demSo(goc) {
  if (giamDong()) return;
  goc.querySelectorAll('.o-so-the b, .st-tk b, .tk-so b, .mt-vong b, .qy-vong b, .lt79-so b, .mt-so b, .qy-so b').forEach(b => {
    const n = b.firstChild; if (!n || n.nodeType !== 3) return;
    const m = n.nodeValue.match(/^(\s*)([\d.]+(?:,\d+)?)(.*)$/s); if (!m) return;
    const so = Number(m[2].replace(/\./g, '').replace(',', '.')); if (!isFinite(so) || so === 0) return;
    const thapPhan = (m[2].split(',')[1] || '').length, bd = performance.now(), dai = 700;
    const dinhDang = v => { const s = v.toFixed(thapPhan).split('.'); return s[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.') + (s[1] ? ',' + s[1] : ''); };
    const buoc = t => { const p = Math.min(1, (t - bd) / dai), e = 1 - Math.pow(1 - p, 3); n.nodeValue = m[1] + dinhDang(so * e) + m[3]; if (p < 1) requestAnimationFrame(buoc); };
    requestAnimationFrame(buoc);
  });
}

/* ================= THEO DÕI THÀNH TÍCH (so trạng thái trước/sau mỗi lần vẽ) ================= */
let _truoc = null, _bamLuc = 0;
function trangThaiHU() {
  const hn = homNay(), r = { tq: false, l79: false, sk: [], mt: [], quy: {}, quyDu: [] };
  try { const hs = S.thoi_quen.filter(h => h.dang_dung !== false); r.tq = hs.length > 0 && hs.every(h => datTQ(h, giaTriTQ(h.id, hn))); } catch (e) { }
  try { if (caiDat('lo_trinh_hsk79', null)) { const bs = l79BaiNgay(hn); r.l79 = bs.length > 0 && bs.every(b => l79Xong(hn, b)); } } catch (e) { }
  try { const sk = caiDat('skincare', null); if (sk) r.sk = ['sang', 'toi'].filter(b => ((sk.log || {})[`${hn}|${b}`] || []).length >= (sk[b] || []).length && (sk[b] || []).length); } catch (e) { }
  try { r.mt = dsMT().filter(g => { const [tu, den] = khoangMT(g); return den >= congNgay(hn, -7) && tu <= hn && trangThaiMT(g).p >= 1; }).map(g => g.id); } catch (e) { }
  try { dsQuy().forEach(q => { r.quy[q.id] = soDuQuy(q); if (q.dich && soDuQuy(q) >= q.dich) r.quyDu.push(q.id); }); } catch (e) { }
  return r;
}
function soSanh() {
  const sau = trangThaiHU(), t = _truoc; _truoc = sau; if (!t || Date.now() - _bamLuc > 4000) return;   // chỉ ăn mừng ngay sau thao tác của Thầy
  const moi = (a, b) => b.filter(x => !a.includes(x));
  if (moi(t.mt, sau.mt).length || moi(t.quyDu, sau.quyDu).length) { HIEU_UNG.hac(); AM.datMucTieu(); if (moi(t.quyDu, sau.quyDu).length) HIEU_UNG.xu(); return; }
  if ((!t.tq && sau.tq) || (!t.l79 && sau.l79) || moi(t.sk, sau.sk).length) { HIEU_UNG.hoaDao(); AM.hoa(); return; }
  if (Object.keys(sau.quy).some(k => (sau.quy[k] || 0) > (t.quy[k] || 0))) { HIEU_UNG.xu(); AM.xu(); }
}

/* ================= GẮN VÀO WEB ================= */
const HU_TICK = ['tq-tich', 'tq-cong', 'l79-tick', 'sk-tick', 'mt-tich', 'mt-cong', 'xong-viec', 'st-mac', 'vali-tick'];
document.addEventListener('pointerdown', e => {
  const n = e.target.closest('.nut, .nut-tron, .tq-tich, .lt79-muc, .lt79-chip, .st-sk-buoc, .tq-chip, .st-tabs button, .loc-chip button, .phan-doan button');
  if (n) HIEU_UNG.muc(n, e.clientX, e.clientY);
}, { passive: true });
document.addEventListener('click', () => { _bamLuc = Date.now(); }, true);
document.addEventListener('submit', () => { _bamLuc = Date.now(); }, true);
document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]'); if (!el || !HU_TICK.includes(el.dataset.act)) return;
  const dangBat = el.classList.contains('on') || el.classList.contains('xong') || (el.type === 'checkbox' && !el.checked);
  if (dangBat) { AM.boTich(); return; }
  HIEU_UNG.dau(e.clientX, e.clientY); AM.tich();
}, true);

(function bocVe() {   // bọc hàm ve(): hiệu ứng vào trang + so thành tích
  if (typeof ve !== 'function') return;
  const _ve = ve; let trang = null;
  const sauVe = () => {
    try {
      const m = document.getElementById('main'), t = location.hash;
      if (m && t !== trang) { trang = t; if (!giamDong()) { m.classList.remove('hu-vao'); void m.offsetWidth; m.classList.add('hu-vao'); } demSo(m); }
      clearTimeout(bocVe._h); bocVe._h = setTimeout(soSanh, 120);
    } catch (e) { }
  };
  window.ve = ve = function () { const r = _ve.apply(this, arguments); sauVe(); return r; };
  window.addEventListener('hashchange', () => setTimeout(sauVe, 0));
  setTimeout(sauVe, 1500);
})();
if (typeof moGiaoDien === 'function') {   // thêm mục "Hiệu ứng & âm thanh" vào hộp Giao diện
  const _mgd = moGiaoDien;
  window.moGiaoDien = moGiaoDien = function () {
    _mgd.apply(this, arguments);
    const gd = [...document.querySelectorAll('.hop-gd .gd')].pop(); if (!gd || gd.querySelector('.hu-cd')) return;
    const k = document.createElement('div'); k.className = 'hu-cd';
    k.innerHTML = `<h4>Hiệu ứng & âm thanh</h4>
      <label class="hop-chon-dong"><input type="checkbox" data-hu="am" ${HU.am ? 'checked' : ''}> Bật âm thanh <span class="mo nho">(đàn tranh khi tick, chuông khánh khi đạt mục tiêu, tiếng xu khi góp quỹ; tự im trong giờ dạy)</span></label>
      <div class="gd-dong"><span class="mo nho">nhỏ</span><input type="range" min="0.1" max="1" step="0.05" data-hu="amLuong" value="${HU.amLuong}"><span class="mo nho">to</span><button class="nut nho" data-hu-thu type="button">Nghe thử</button></div>
      <label class="hop-chon-dong"><input type="checkbox" data-hu="nen" ${HU.nen ? 'checked' : ''}> Lá và mây thỉnh thoảng trôi qua nền</label>
      <label class="hop-chon-dong"><input type="checkbox" data-hu="giam" ${HU.giam ? 'checked' : ''}> Giảm hiệu ứng (tắt hoa rơi, hạc bay, mực loang)</label>`;
    const sm = document.createElement('div'); sm.className = 'hu-cd'; sm.innerHTML = '<h4>Menu</h4><button class="nut nho" type="button" data-sm-mo>⇅ Sắp xếp / ẩn bớt mục trong menu</button>';
    gd.appendChild(sm); sm.querySelector('[data-sm-mo]').addEventListener('click', () => { const x = document.querySelector('.hop-gd'); if (x) x.closest('.hop-nen').remove(); moSapMenu(); });
    gd.appendChild(k);
    k.querySelectorAll('[data-hu]').forEach(i => i.addEventListener(i.type === 'range' ? 'input' : 'change', () => { const x = i.dataset.hu; HU[x] = i.type === 'checkbox' ? i.checked : Number(i.value); luuHU(); if (x === 'nen' || x === 'giam') chayNen(); }));
    k.querySelector('[data-hu-thu]').addEventListener('click', () => { const bat = HU.am; HU.am = true; AM.thu(); HU.am = bat; HIEU_UNG.hoaDao(); });
  };
}
chayNen();
