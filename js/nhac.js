/* NHẠC NỀN CỔ PHONG TỰ TẠO (bản 5.8) — đàn tranh ngũ âm + nền trầm + chuông khánh, tổng hợp bằng WebAudio.
   Không dùng file nhạc → không lo bản quyền, không tốn dung lượng. Mặc định TẮT, tự im trong giờ dạy.
   Cài đặt theo từng máy: localStorage 'gyq_nhac'. */
const NHAC_KHUC = {
  son_thuy: { ten: 'Sơn thuỷ', zh: '山水', goc: 196, bpm: 64, thua: .28, dem: 1, sao: .12, khanh: .5, mo: 'Đàn tranh thong thả, nền núi xa' },
  tra_dem: { ten: 'Trà đêm', zh: '夜茶', goc: 174.6, bpm: 52, thua: .4, dem: 1.25, sao: .35, khanh: .3, mo: 'Chậm, trầm, có tiếng sáo' },
  mua_xuan: { ten: 'Mưa xuân', zh: '春雨', goc: 220, bpm: 76, thua: .2, dem: .8, sao: 0, khanh: .8, mo: 'Trong trẻo, nhiều nốt cao' },
};
const NHAC = (() => {
  const MD = { bat: false, khuc: 'son_thuy', luong: .45 };
  let cd = (() => { try { return { ...MD, ...JSON.parse(localStorage.getItem('gyq_nhac') || '{}') }; } catch (e) { return { ...MD }; } })();
  const luu = () => { try { localStorage.setItem('gyq_nhac', JSON.stringify(cd)); } catch (e) { } };
  let a = null, tong = null, vang = null, hen = null, nen = [], tGiai = 0, bac = 7, buoc = 0, cau = 0, imVi = '', tinh = null, the = null;
  const THANG = [0, 2, 4, 7, 9];   // ngũ cung: cung – thương – giốc – chuỷ – vũ
  const tan = (goc, b) => goc * Math.pow(2, (Math.floor(b / 5) * 12 + THANG[((b % 5) + 5) % 5]) / 12);

  function khoi() {
    if (a) return a;
    try { if (typeof ac === 'function') a = ac(); } catch (e) { }
    if (!a) { const C = window.AudioContext || window.webkitAudioContext; if (!C) return null; a = new C(); }
    tong = a.createGain(); tong.gain.value = 0;
    const nen2 = a.createDynamicsCompressor(); nen2.threshold.value = -20; nen2.ratio.value = 3;
    vang = a.createConvolver(); vang.buffer = xungVang(3.2);
    const uot = a.createGain(); uot.gain.value = .38;
    tong.connect(nen2); tong.connect(vang); vang.connect(uot).connect(nen2); nen2.connect(a.destination);
    return a;
  }
  function xungVang(giay) {
    const n = Math.floor(a.sampleRate * giay), b = a.createBuffer(2, n, a.sampleRate);
    for (let c = 0; c < 2; c++) { const d = b.getChannelData(c); for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 3.2); }
    return b;
  }
  /* iPhone đang gạt im lặng: phát kèm 1 file âm thanh rỗng để WebAudio vẫn kêu */
  let lap = null;
  function moKhoaIOS() {
    if (lap) { lap.play().catch(() => { }); return; }
    const sr = 8000, n = sr, buf = new ArrayBuffer(44 + n), v = new DataView(buf), w = (o, s) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
    w(0, 'RIFF'); v.setUint32(4, 36 + n, true); w(8, 'WAVE'); w(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
    v.setUint32(24, sr, true); v.setUint32(28, sr, true); v.setUint16(32, 1, true); v.setUint16(34, 8, true); w(36, 'data'); v.setUint32(40, n, true);
    for (let i = 0; i < n; i++) v.setUint8(44 + i, 128);
    lap = new Audio(URL.createObjectURL(new Blob([buf], { type: 'audio/wav' }))); lap.loop = true; lap.volume = .01; lap.setAttribute('playsinline', '');
    lap.play().catch(() => { });
  }

  /* ---- nhạc cụ ---- */
  function tranh(f, t, dai = 2.6, to = 1) {
    const g = a.createGain(), lo = a.createBiquadFilter(); lo.type = 'lowpass';
    lo.frequency.setValueAtTime(Math.min(6000, f * 9), t); lo.frequency.exponentialRampToValueAtTime(Math.max(400, f * 1.6), t + dai * .6);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.22 * to, t + .005); g.gain.exponentialRampToValueAtTime(.0006, t + dai);
    [[1, 'triangle', 1], [2, 'sine', .3], [3, 'sine', .1], [4.02, 'sine', .04]].forEach(([k, kieu, m]) => {
      const o = a.createOscillator(), gg = a.createGain(); o.type = kieu;
      o.frequency.setValueAtTime(f * k * 1.01, t); o.frequency.exponentialRampToValueAtTime(f * k, t + .07);
      gg.gain.value = m; o.connect(gg).connect(lo); o.start(t); o.stop(t + dai + .05);
    });
    lo.connect(g).connect(tong);
  }
  function luyen(f0, f1, t, dai) {   // nhấn – vuốt dây: nốt trượt lên
    const o = a.createOscillator(), g = a.createGain(), lo = a.createBiquadFilter(); o.type = 'triangle'; lo.type = 'lowpass'; lo.frequency.value = f1 * 4;
    o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + .22);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.16, t + .006); g.gain.exponentialRampToValueAtTime(.0006, t + dai);
    o.connect(lo).connect(g).connect(tong); o.start(t); o.stop(t + dai + .05);
  }
  function sao(f, t, dai) {   // sáo trúc: sin + rung + hơi thở
    const o = a.createOscillator(), g = a.createGain(), lfo = a.createOscillator(), lg = a.createGain(); o.type = 'sine'; o.frequency.value = f;
    lfo.frequency.value = 5.2; lg.gain.value = f * .012; lfo.connect(lg).connect(o.frequency);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.07, t + .35); g.gain.setValueAtTime(.07, t + dai * .7); g.gain.linearRampToValueAtTime(0, t + dai);
    const n = a.createBufferSource(), nb = a.createBuffer(1, a.sampleRate * dai, a.sampleRate), d = nb.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    n.buffer = nb; const bp = a.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = f * 2; bp.Q.value = 3; const ng = a.createGain(); ng.gain.value = .012;
    o.connect(g).connect(tong); n.connect(bp).connect(ng).connect(g);
    [o, lfo, n].forEach(x => { x.start(t); x.stop(t + dai + .05); });
  }
  function khanh2(f, t) {
    [[1, .5, 4], [2.76, .2, 2.6], [5.4, .08, 1.5]].forEach(([k, m, dai]) => {
      const o = a.createOscillator(), g = a.createGain(); o.type = 'sine'; o.frequency.value = f * k;
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.09 * m, t + .01); g.gain.exponentialRampToValueAtTime(.0004, t + dai);
      o.connect(g).connect(tong); o.start(t); o.stop(t + dai + .05);
    });
  }
  function batNen(k) {   // nền trầm: cung + chuỷ, thở chậm
    tatNen();
    [[k.goc / 2, .05], [k.goc * .75, .028], [k.goc, .016]].forEach(([f, v], i) => {
      const o = a.createOscillator(), g = a.createGain(), lfo = a.createOscillator(), lg = a.createGain(), lo = a.createBiquadFilter();
      o.type = 'sine'; o.frequency.value = f; lo.type = 'lowpass'; lo.frequency.value = 600;
      lfo.frequency.value = .05 + i * .03; lg.gain.value = v * .6; lfo.connect(lg).connect(g.gain);
      g.gain.setValueAtTime(0, a.currentTime); g.gain.linearRampToValueAtTime(v, a.currentTime + 6);
      o.connect(lo).connect(g).connect(tong); o.start(); lfo.start(); nen.push(o, lfo);
    });
  }
  function tatNen() { nen.forEach(o => { try { o.stop(a.currentTime + .1); } catch (e) { } }); nen = []; }

  /* ---- sáng tác: đi bộ trên thang ngũ cung, câu 8 phách, cuối câu về nốt chủ ---- */
  function len() {
    const k = NHAC_KHUC[cd.khuc] || NHAC_KHUC.son_thuy, phach = 60 / k.bpm;
    while (tGiai < a.currentTime + 1.2) {
      const t = tGiai, cuoiCau = buoc % 8 === 7;
      if (cuoiCau) {
        bac = [5, 7, 10][Math.floor(Math.random() * 3)];
        tranh(tan(k.goc, bac), t, 4, .9); if (Math.random() < .5) tranh(tan(k.goc, bac - 5), t + .02, 4, .5);
        if (Math.random() < k.khanh * .5) khanh2(tan(k.goc, bac + 10), t + phach * 1.5);
        tGiai += phach * (2 + Math.random() * 1.5) * k.dem; cau++;
        if (k.sao && Math.random() < k.sao) sao(tan(k.goc, 7 + [0, 2, 3][Math.floor(Math.random() * 3)]), tGiai, phach * 6);
      } else if (Math.random() < k.thua) {
        tGiai += phach * (Math.random() < .5 ? .5 : 1) * k.dem;
      } else {
        const r = Math.random(); bac += r < .35 ? 1 : r < .7 ? -1 : r < .82 ? 2 : r < .94 ? -2 : (Math.random() < .5 ? 3 : -3);
        bac = Math.max(3, Math.min(14, bac));
        const f = tan(k.goc, bac);
        if (Math.random() < .12) luyen(tan(k.goc, bac - 1), f, t, 2.4); else tranh(f, t, 2.2 + Math.random(), .55 + Math.random() * .4);
        if (Math.random() < .1) tranh(f * 2, t + phach * .25, 1.2, .3);   // nốt hoa
        tGiai += phach * (Math.random() < .25 ? .5 : 1) * k.dem;
      }
      buoc++;
    }
  }
  function choi() {
    if (!khoi()) return;
    if (a.state === 'suspended') a.resume();
    moKhoaIOS();
    const k = NHAC_KHUC[cd.khuc] || NHAC_KHUC.son_thuy;
    tong.gain.cancelScheduledValues(a.currentTime); tong.gain.setValueAtTime(tong.gain.value, a.currentTime); tong.gain.linearRampToValueAtTime(cd.luong, a.currentTime + 3);
    batNen(k); tGiai = a.currentTime + .4; bac = 7; buoc = 0;
    clearInterval(hen); hen = setInterval(len, 250); len();
  }
  function dung(nhanh) {
    clearInterval(hen); hen = null;
    if (!a || !tong) return;
    tong.gain.cancelScheduledValues(a.currentTime); tong.gain.setValueAtTime(tong.gain.value, a.currentTime); tong.gain.linearRampToValueAtTime(0, a.currentTime + (nhanh ? .3 : 2));
    setTimeout(tatNen, nhanh ? 400 : 2200);
    if (lap) lap.pause();
  }
  const dangChoi = () => !!hen;
  const daDay = () => { try { return typeof dangDay === 'function' && dangDay(); } catch (e) { return false; } };
  /* giờ dạy → tự im, hết giờ → chơi lại */
  setInterval(() => {
    if (!cd.bat) return;
    if (daDay() && dangChoi()) { dung(); imVi = 'day'; veNut(); }
    else if (!daDay() && imVi === 'day' && a) { imVi = ''; choi(); veNut(); }
  }, 30000);

  /* ---- nút nổi ---- */
  function veNut() {
    if (!the) { the = document.createElement('div'); the.id = 'nhac'; document.body.appendChild(the); the.addEventListener('click', bam); }
    const k = NHAC_KHUC[cd.khuc] || NHAC_KHUC.son_thuy, choiNay = dangChoi();
    the.className = `${choiNay ? 'dang' : ''} ${the.classList.contains('mo') ? 'mo' : ''}`;
    the.innerHTML = `<button class="nhac-nut" data-n="mo" title="Nhạc nền" aria-label="Nhạc nền">${choiNay ? '<i></i><i></i><i></i>' : '♪'}</button>
      <div class="nhac-bang">
        <div class="nhac-dau"><b>Nhạc nền · ${k.zh}</b><button class="nut-x" data-n="dong">×</button></div>
        <button class="nhac-play nut ${choiNay ? '' : 'chinh'}" data-n="play">${choiNay ? '❚❚ Tạm dừng' : '▶ Phát'}</button>
        ${imVi === 'day' ? '<p class="mo nho">Đang giờ dạy nên em tạm im, hết giờ sẽ tự phát lại.</p>' : ''}
        <div class="nhac-khuc">${Object.entries(NHAC_KHUC).map(([id, x]) => `<button data-n="khuc" data-k="${id}" class="${cd.khuc === id ? 'on' : ''}"><b>${x.ten}</b><small>${x.mo}</small></button>`).join('')}</div>
        <label class="nhac-am"><span>🔈</span><input type="range" min="0.05" max="1" step="0.05" value="${cd.luong}" data-n="am"><span>🔊</span></label>
        <p class="mo nho">Nhạc do web tự chơi, mỗi lần mỗi khác. Tự im trong giờ dạy.</p>
      </div>`;
    the.querySelector('[data-n=am]').addEventListener('input', e => { cd.luong = Number(e.target.value); luu(); if (a && tong && dangChoi()) tong.gain.setTargetAtTime(cd.luong, a.currentTime, .3); });
  }
  function bam(e) {
    const b = e.target.closest('[data-n]'); if (!b || b.dataset.n === 'am') return;
    const n = b.dataset.n;
    if (n === 'mo') { the.classList.toggle('mo'); return; }
    if (n === 'dong') { the.classList.remove('mo'); return; }
    if (n === 'play') { if (dangChoi()) { dung(true); cd.bat = false; imVi = ''; } else { cd.bat = true; imVi = ''; choi(); } luu(); veNut(); return; }
    if (n === 'khuc') { cd.khuc = b.dataset.k; luu(); if (dangChoi()) { dung(true); setTimeout(() => { choi(); veNut(); }, 450); } veNut(); }
  }
  /* lần trước Thầy để nhạc bật → chờ chạm đầu tiên (trình duyệt bắt buộc) rồi phát */
  function cho() {
    if (!cd.bat) return;
    const go = e => { if (e && e.target && e.target.closest && e.target.closest('#nhac')) { document.removeEventListener('pointerdown', go, true); return; } document.removeEventListener('pointerdown', go, true); if (cd.bat && !dangChoi() && !daDay()) { choi(); veNut(); } else if (daDay()) { imVi = 'day'; veNut(); } };
    document.addEventListener('pointerdown', go, true);
  }
  document.addEventListener('DOMContentLoaded', () => { veNut(); cho(); });
  if (document.readyState !== 'loading') setTimeout(() => { if (!the) { veNut(); cho(); } }, 0);
  return { choi, dung, dangChoi, cd: () => cd };
})();
