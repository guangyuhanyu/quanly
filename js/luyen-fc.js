/* LUYỆN GÕ & ĐỌC trong Flashcard HSK 7–9 (bản 5.9)
   Lấy bộ từ từ chính file flashcard/hsk79.html của Thầy (không sửa file). Ưu tiên từ Thầy đã học trong flashcard.
   Gõ: (1) chữ Hán → gõ pinyin (số thanh hoặc dấu)  (2) gõ cả câu chữ Hán bằng bộ gõ như thi trên máy.
   Đọc: đọc to câu ví dụ, nghe giọng mẫu, ghi âm để máy nghe và chấm (nếu Safari hỗ trợ).
   Xong 1 lượt → tự tick bài "Gõ pinyin" / "Đọc bài phân cấp" của lộ trình hôm nay. */
const LF = { tu: null, dang: null, kieu: 'py', thanh: true, lot: [], i: 0, kq: [], t0: 0, doc: [], di: 0, nghe: null };
const LF_SO = { py: 15, han: 10, doc: 10 };

async function lfTaiTu() {
  if (LF.tu) return LF.tu;
  const r = await fetch(FC_FILE); const s = await r.text();
  const a = s.indexOf('WORDS = [') + 8; let sau = 0, i = a;
  for (; i < s.length; i++) { const c = s[i]; if (c === '[') sau++; else if (c === ']') { sau--; if (!sau) break; } else if (c === '"') { i++; while (s[i] !== '"') { if (s[i] === '\\') i++; i++; } } }
  LF.tu = JSON.parse(s.slice(a, i + 1)); return LF.tu;
}
/* từ đã học trong flashcard trước, rồi tới các từ kế tiếp */
function lfChon(n, canCau) {
  const S0 = fcDocLocal() || {}, the = S0.cards || {}, daHoc = new Set(Object.keys(the).map(k => k.split('_')[0]));
  let ds = LF.tu.filter(w => !canCau || (w.ex && w.ex.length >= 6));
  const hoc = ds.filter(w => daHoc.has(String(w.no))), moi = ds.filter(w => !daHoc.has(String(w.no)));
  const tron = a => a.map(x => [Math.random(), x]).sort((p, q) => p[0] - q[0]).map(x => x[1]);
  return [...tron(hoc), ...tron(moi.slice(0, n * 2))].slice(0, n);
}

/* ---------- pinyin: so sánh không phân biệt dấu/số ---------- */
const PY_DAU = { ā: 'a1', á: 'a2', ǎ: 'a3', à: 'a4', ē: 'e1', é: 'e2', ě: 'e3', è: 'e4', ī: 'i1', í: 'i2', ǐ: 'i3', ì: 'i4', ō: 'o1', ó: 'o2', ǒ: 'o3', ò: 'o4', ū: 'u1', ú: 'u2', ǔ: 'u3', ù: 'u4', ǖ: 'v1', ǘ: 'v2', ǚ: 'v3', ǜ: 'v4', ü: 'v0', ń: 'n2', ň: 'n3', ǹ: 'n4' };
function pyTach(s) {   // → { chu: 'zhongguo', thanh: '12' }
  let chu = '', thanh = '';
  for (const c of String(s).toLowerCase().normalize('NFC')) {
    if (PY_DAU[c]) { chu += PY_DAU[c][0]; if (PY_DAU[c][1] !== '0') thanh += PY_DAU[c][1]; }
    else if (/[1-4]/.test(c)) thanh += c;
    else if (/[a-z]/.test(c)) chu += c === 'u' ? 'u' : c;
  }
  return { chu: chu.replace(/u:/g, 'v'), thanh };
}
function pyCham(nhap, dung, coThanh) {
  const a = pyTach(nhap.replace(/ü|u:/g, 'v').replace(/v/g, 'ü') ), b = pyTach(dung);
  const chuA = a.chu.replace(/ü/g, 'v'), chuB = b.chu.replace(/ü/g, 'v');
  const chuDung = chuA === chuB || chuA === chuB.replace(/v/g, 'u');
  if (!chuDung) return 'sai';
  if (!coThanh) return 'dung';
  return a.thanh === b.thanh ? 'dung' : a.thanh ? 'thanh' : 'thieu';
}

/* ---------- khung ---------- */
async function lfVe(khung, tab) {
  LF.dang = tab;
  khung.innerHTML = '<div class="lf"><p class="mo">Đang lấy bộ từ…</p></div>';
  try { await lfTaiTu(); } catch (e) { khung.innerHTML = '<div class="lf"><p class="canh-bao">Không đọc được bộ từ trong file flashcard. Thầy thử tải lại trang.</p></div>'; return; }
  if (tab === 'go') lfVeGo(khung); else if (tab === 'nghe') ngVe(khung); else if (tab === 'doc' && BD.mo) bdVeBai(khung); else bdVeKho(khung);
}
function lfThanh(i, n) { return `<div class="lf-tien"><i style="width:${(i / n) * 100}%"></i></div><small class="lf-dem">${Math.min(i + 1, n)}/${n}</small>`; }

/* ====================== GÕ ====================== */
function lfVeGo(khung) {
  khung.innerHTML = `<div class="lf">
    <div class="lf-chon">
      <button data-lf="kieu" data-v="py" class="${LF.kieu === 'py' ? 'on' : ''}"><b>Gõ pinyin</b><small>Nhìn chữ Hán, gõ pinyin</small></button>
      <button data-lf="kieu" data-v="han" class="${LF.kieu === 'han' ? 'on' : ''}"><b>Gõ chữ Hán</b><small>Gõ cả câu bằng bộ gõ, như thi trên máy</small></button>
    </div>
    ${LF.kieu === 'py' ? `<label class="lf-tuy"><input type="checkbox" data-lf="thanh" ${LF.thanh ? 'checked' : ''}> Chấm cả thanh điệu <small class="mo">(gõ số: zhong1guo2, hoặc gõ dấu đều được)</small></label>` : '<p class="mo nho lf-tuy">Bật bộ gõ tiếng Trung (Pinyin – Giản thể) rồi gõ đúng câu hiện ra. Web đo tốc độ chữ/phút và độ chính xác.</p>'}
    <button class="nut chinh lf-bat" data-lf="bat-go">▶ Bắt đầu ${LF_SO[LF.kieu]} ${LF.kieu === 'py' ? 'từ' : 'câu'}</button>
    ${lfLichSu('go')}
  </div>`;
}
function lfBatGo(khung) {
  LF.lot = lfChon(LF_SO[LF.kieu], LF.kieu === 'han'); LF.i = 0; LF.kq = []; LF.t0 = 0;
  lfCauGo(khung);
}
function lfCauGo(khung) {
  const n = LF.lot.length; if (LF.i >= n) return lfXongGo(khung);
  const w = LF.lot[LF.i];
  if (LF.kieu === 'py') {
    khung.innerHTML = `<div class="lf lf-bai">${lfThanh(LF.i, n)}
      <div class="lf-the"><div class="lf-han">${esc(w.w)}</div><small class="lf-loai">${esc(w.pos || '')}</small></div>
      <input class="lf-o" id="lf-o" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="gõ pinyin rồi Enter">
      <div class="lf-fb" id="lf-fb"></div>
      <div class="lf-nut"><button class="nut nho" data-lf="bo">Bỏ qua</button><button class="nut chinh nho" data-lf="kiem">Kiểm tra ↵</button></div></div>`;
  } else {
    khung.innerHTML = `<div class="lf lf-bai">${lfThanh(LF.i, n)}
      <div class="lf-cau-mau" id="lf-mau">${[...w.ex].map(c => `<span>${esc(c)}</span>`).join('')}</div>
      <p class="lf-vi">${esc(w.exvi || '')}</p>
      <textarea class="lf-o han" id="lf-o" rows="2" autocomplete="off" spellcheck="false" placeholder="Gõ câu trên bằng bộ gõ tiếng Trung…"></textarea>
      <div class="lf-fb" id="lf-fb"><small class="mo">Từ cần nhớ: <b>${esc(w.w)}</b> ${esc(w.py)} · ${esc(w.vi)}</small></div>
      <div class="lf-nut"><button class="nut nho" data-lf="bo">Bỏ qua</button><button class="nut chinh nho" data-lf="kiem">Xong câu ↵</button></div></div>`;
  }
  const o = khung.querySelector('#lf-o'); setTimeout(() => o.focus(), 50);
  LF.tCau = 0; LF.daKiem = false;
  o.addEventListener('input', () => { if (!LF.tCau) LF.tCau = Date.now(); if (!LF.t0) LF.t0 = Date.now(); if (LF.kieu === 'han') lfToMau(khung); });
  o.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.isComposing && e.keyCode !== 229) { e.preventDefault(); lfKiem(khung); } });
}
function lfToMau(khung) {
  const w = LF.lot[LF.i], v = khung.querySelector('#lf-o').value.replace(/\s/g, '');
  khung.querySelectorAll('#lf-mau span').forEach((s, i) => { s.className = i < v.length ? (v[i] === w.ex[i] ? 'dung' : 'sai') : ''; });
}
function lfKiem(khung) {
  const w = LF.lot[LF.i], o = khung.querySelector('#lf-o'), fb = khung.querySelector('#lf-fb');
  if (LF.daKiem) { LF.i++; return lfCauGo(khung); }
  const giay = LF.tCau ? (Date.now() - LF.tCau) / 1000 : 0;
  if (LF.kieu === 'py') {
    if (!o.value.trim()) return;
    const k = pyCham(o.value, w.py, LF.thanh);
    LF.kq.push({ w, k, giay });
    fb.innerHTML = `<div class="lf-kq ${k}">${k === 'dung' ? '✓ Đúng' : k === 'thanh' ? '△ Đúng âm, sai thanh' : k === 'thieu' ? '△ Đúng âm, chưa gõ thanh' : '✗ Chưa đúng'}</div>
      <p class="lf-dap"><b>${esc(w.py)}</b> · ${esc(w.vi)}</p><p class="lf-vd">${esc(w.ex || '')}</p>`;
    o.classList.add(k === 'dung' ? 'ok' : 'loi');
    try { if (k === 'dung') AM.tick && AM.tick(); } catch (e) { }
  } else {
    const v = o.value.replace(/\s/g, ''), mau = w.ex.replace(/\s/g, '');
    let dung = 0; for (let i = 0; i < Math.min(v.length, mau.length); i++) if (v[i] === mau[i]) dung++;
    const pt = mau.length ? dung / mau.length : 0;
    LF.kq.push({ w, k: pt >= .95 ? 'dung' : 'sai', giay, chu: v.length, dungChu: dung, tong: mau.length });
    fb.innerHTML = `<div class="lf-kq ${pt >= .95 ? 'dung' : 'sai'}">${Math.round(pt * 100)}% đúng · ${giay ? Math.round(v.length / giay * 60) : 0} chữ/phút</div>`;
  }
  LF.daKiem = true; khung.querySelector('[data-lf=kiem]').textContent = 'Tiếp →';
}
function lfXongGo(khung) {
  const kq = LF.kq, n = kq.length || 1, dung = kq.filter(x => x.k === 'dung').length;
  const tg = kq.reduce((a, x) => a + x.giay, 0);
  let tom;
  if (LF.kieu === 'py') tom = { loai: 'py', dung, n: kq.length, tb: kq.length ? tg / kq.length : 0 };
  else { const chu = kq.reduce((a, x) => a + (x.dungChu || 0), 0), tong = kq.reduce((a, x) => a + (x.tong || 0), 0); tom = { loai: 'han', cpm: tg ? Math.round(kq.reduce((a, x) => a + (x.chu || 0), 0) / tg * 60) : 0, dung: tong ? Math.round(chu / tong * 100) : 0, n: kq.length }; }
  lfGhiLichSu('go', tom);
  const sai = kq.filter(x => x.k !== 'dung');
  khung.innerHTML = `<div class="lf lf-xong">
    <div class="lf-dau">完成</div>
    ${tom.loai === 'py' ? `<h3>${dung}/${kq.length} từ đúng</h3><p class="mo">trung bình ${tom.tb.toFixed(1)} giây/từ</p>` : `<h3>${tom.cpm} chữ/phút</h3><p class="mo">chính xác ${tom.dung}% · ${tom.n} câu</p><p class="mo nho">Mục tiêu khi thi HSK 7–9 trên máy: khoảng 30–40 chữ/phút.</p>`}
    ${sai.length ? `<div class="lf-sai"><small class="mo">Cần ôn lại:</small>${sai.map(x => `<span><b>${esc(x.w.w)}</b> ${esc(x.w.py)}</span>`).join('')}</div>` : ''}
    <div class="lf-nut"><button class="nut" data-lf="ve-go">← Chọn kiểu khác</button><button class="nut chinh" data-lf="bat-go">Làm lượt nữa</button></div>
  </div>`;
  fcTickBai('pinyin', 'Gõ pinyin hôm nay xong ✓');
}

/* ====================== ĐỌC ====================== */
const lfCoNghe = () => !!(window.SpeechRecognition || window.webkitSpeechRecognition);
function lfVeDocCau(khung) {
  khung.innerHTML = `<div class="lf">
    <p class="lf-gt">Đọc to ${LF_SO.doc} câu ví dụ của những từ Thầy đang học. Mỗi câu: đọc trước → bấm 🔊 nghe giọng mẫu → ${lfCoNghe() ? 'bấm 🎙 đọc lại để máy nghe và chấm' : 'đọc lại theo'}.</p>
    <label class="lf-tuy"><input type="checkbox" data-lf="an-py" ${LF.anPy !== false ? 'checked' : ''}> Ẩn pinyin & nghĩa, chạm để hiện</label>
    <button class="nut chinh lf-bat" data-lf="bat-doc">▶ Bắt đầu đọc</button>
    ${lfLichSu('doc')}
  </div>`;
}
function lfBatDoc(khung) { LF.doc = lfChon(LF_SO.doc, true); LF.di = 0; LF.diem = []; lfCauDoc(khung); }
function lfCauDoc(khung) {
  const n = LF.doc.length; if (LF.di >= n) return lfXongDoc(khung);
  const w = LF.doc[LF.di], an = LF.anPy !== false;
  const cau = esc(w.ex).split(esc(w.w)).join(`<mark>${esc(w.w)}</mark>`);
  khung.innerHTML = `<div class="lf lf-bai">${lfThanh(LF.di, n)}
    <div class="lf-doc-cau">${cau}</div>
    <div class="lf-doc-phu ${an ? 'an' : ''}" data-lf="hien"><p><b>${esc(w.w)}</b> ${esc(w.py)} · ${esc(w.vi)}</p><p class="mo">${esc(w.exvi || '')}</p>${an ? '<span class="lf-cham">chạm để xem pinyin & nghĩa</span>' : ''}</div>
    <div class="lf-doc-nut">
      <button class="nut" data-lf="nghe">🔊 Nghe mẫu</button>
      <button class="nut" data-lf="cham-cham">🐢 Nghe chậm</button>
      ${lfCoNghe() ? '<button class="nut chinh" data-lf="ghi">🎙 Đọc để chấm</button>' : ''}
    </div>
    <div class="lf-fb" id="lf-fb"></div>
    <div class="lf-nut"><button class="nut nho" data-lf="lui-doc" ${LF.di ? '' : 'disabled'}>← Câu trước</button><button class="nut chinh nho" data-lf="tiep-doc">Câu tiếp →</button></div></div>`;
}
function lfNoi(cau, cham) {
  try {
    speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(cau); u.lang = 'zh-CN'; u.rate = cham ? .6 : .9;
    const g = speechSynthesis.getVoices().filter(v => /zh[-_]CN/i.test(v.lang)); if (g.length) u.voice = g.find(v => /Tingting|Ting-Ting|Yu-shu|Lili/i.test(v.name)) || g[0];
    speechSynthesis.speak(u);
  } catch (e) { toast('Máy này chưa có giọng đọc tiếng Trung'); }
}
function lfGhi(khung) {
  const R = window.SpeechRecognition || window.webkitSpeechRecognition, w = LF.doc[LF.di], fb = khung.querySelector('#lf-fb'), nut = khung.querySelector('[data-lf=ghi]');
  if (LF.nghe) { try { LF.nghe.stop(); } catch (e) { } return; }
  const r = new R(); r.lang = 'zh-CN'; r.interimResults = true; r.maxAlternatives = 3; LF.nghe = r;
  nut.textContent = '■ Dừng'; nut.classList.add('dang-ghi'); fb.innerHTML = '<small class="mo">Đang nghe… Thầy đọc câu trên.</small>';
  let cuoi = '';
  r.onresult = e => { cuoi = [...e.results].map(x => x[0].transcript).join(''); fb.innerHTML = `<p class="lf-nghe-duoc">${esc(cuoi)}</p>`; };
  r.onerror = e => { fb.innerHTML = `<small class="canh-bao">${e.error === 'not-allowed' ? 'Thầy cho phép dùng micro trong Safari giúp em nhé.' : 'Máy chưa nghe rõ, Thầy thử lại.'}</small>`; };
  r.onend = () => {
    LF.nghe = null; nut.textContent = '🎙 Đọc lại'; nut.classList.remove('dang-ghi'); if (!cuoi) return;
    const mau = w.ex.replace(/[，。！？、；：“”‘’（）\s,.!?]/g, ''), noi = cuoi.replace(/[，。！？、；：“”‘’（）\s,.!?]/g, '');
    const pt = lfGiong(mau, noi); LF.diem[LF.di] = pt;
    fb.innerHTML = `<div class="lf-kq ${pt >= .85 ? 'dung' : pt >= .6 ? 'thanh' : 'sai'}">${Math.round(pt * 100)}% · ${pt >= .85 ? 'Rõ ràng, tốt lắm' : pt >= .6 ? 'Khá, còn vài chữ chưa rõ' : 'Đọc lại chậm và rõ hơn nhé'}</div>
      <p class="lf-so">${lfSoSanh(mau, noi)}</p>`;
  };
  r.start();
}
function lfGiong(a, b) {   // độ giống theo LCS
  if (!a.length) return 0; const d = Array(b.length + 1).fill(0);
  for (let i = 1; i <= a.length; i++) { let tr = 0; for (let j = 1; j <= b.length; j++) { const t = d[j]; d[j] = a[i - 1] === b[j - 1] ? tr + 1 : Math.max(d[j], d[j - 1]); tr = t; } }
  return d[b.length] / a.length;
}
function lfSoSanh(mau, noi) { const co = new Set(noi); return [...mau].map(c => `<span class="${co.has(c) ? 'dung' : 'sai'}">${esc(c)}</span>`).join(''); }
function lfXongDoc(khung) {
  const d = (LF.diem || []).filter(x => x != null), tb = d.length ? Math.round(d.reduce((a, b) => a + b, 0) / d.length * 100) : null;
  lfGhiLichSu('doc', { n: LF.doc.length, tb });
  khung.innerHTML = `<div class="lf lf-xong"><div class="lf-dau">朗读</div><h3>Đọc xong ${LF.doc.length} câu</h3>${tb != null ? `<p class="mo">Điểm phát âm trung bình ${tb}% (${d.length} câu có chấm)</p>` : ''}
    <div class="lf-nut"><button class="nut chinh" data-lf="bat-doc">Đọc lượt nữa</button></div></div>`;
  fcTickBai('docpc', 'Đọc hôm nay xong ✓');
}

/* ---------- lịch sử nhỏ (máy này) ---------- */
function lfGhiLichSu(loai, x) { try { const k = 'gyq_lf_' + loai, a = JSON.parse(localStorage.getItem(k) || '[]'); a.unshift({ ...x, ngay: homNay() }); localStorage.setItem(k, JSON.stringify(a.slice(0, 30))); } catch (e) { } }
function lfLichSu(loai) {
  let a = []; try { a = JSON.parse(localStorage.getItem('gyq_lf_' + loai) || '[]'); } catch (e) { }
  if (!a.length) return '';
  return `<div class="lf-ls"><small class="mo">Mấy lượt gần đây</small>${a.slice(0, 5).map(x => `<span>${ngayNgan(x.ngay)} · ${loai === 'doc' ? `${x.n} câu${x.tb != null ? ` · ${x.tb}%` : ''}` : x.loai === 'py' ? `pinyin ${x.dung}/${x.n}` : `chữ Hán ${x.cpm} chữ/phút · ${x.dung}%`}</span>`).join('')}</div>`;
}

/* ---------- bấm ---------- */
function lfBam(e, khung) {
  const p = khung.querySelector('#bd-pop'); if (p && e.type === 'click' && !e.target.closest('[data-lf=bd-tu],[data-lf=bd-nghe-tu]')) { const trong = e.target.closest('#bd-pop'); p.hidden = true; if (trong) return; }
  const b = e.target.closest('[data-lf]'); if (!b) return; const a = b.dataset.lf;
  if (a === 'kieu') { LF.kieu = b.dataset.v; lfVeGo(khung); }
  else if (a === 'thanh') LF.thanh = b.checked;
  else if (a === 'an-py') LF.anPy = b.checked;
  else if (a === 'bat-go') lfBatGo(khung);
  else if (a === 've-go') lfVeGo(khung);
  else if (a === 'kiem') lfKiem(khung);
  else if (a === 'bo') { LF.kq.push({ w: LF.lot[LF.i], k: 'sai', giay: 0 }); LF.i++; lfCauGo(khung); }
  else if (a === 'bat-doc') lfBatDoc(khung);
  else if (a === 'doc-cau') lfVeDocCau(khung);
  else if (a.startsWith('bd-') || a.startsWith('ng-')) (a.startsWith('bd-') ? bdBam : ngBam)(a, b, khung, e);
  else if (a === 'hien') b.classList.remove('an');
  else if (a === 'nghe') lfNoi(LF.doc[LF.di].ex);
  else if (a === 'cham-cham') lfNoi(LF.doc[LF.di].ex, true);
  else if (a === 'ghi') lfGhi(khung);
  else if (a === 'tiep-doc') { speechSynthesis && speechSynthesis.cancel(); LF.di++; lfCauDoc(khung); }
  else if (a === 'lui-doc') { LF.di = Math.max(0, LF.di - 1); lfCauDoc(khung); }
}


/* ====================== BÀI ĐỌC PHÂN CẤP (bản 6.0) ====================== */
const BD = { mo: null, loc: 0, dich: {}, t0: 0, tl: {}, nop: false, toc: .9, noi: false };
const dsBD = () => caiDat('bai_doc', {}) || {};
function bdTuDien(bai) {   // từ trong bộ 1.500 (≥2 chữ) + từ khó của bài
  const m = new Map();
  const bo = new Set(bai.bo || []);
  (LF.tu || []).forEach(w => { if (w.w && w.w.length >= 2 && !bo.has(w.w) && !m.has(w.w)) m.set(w.w, { py: w.py, vi: w.vi, loai: 'hsk' }); });
  (bai.gl || []).forEach(([w, py, vi]) => m.set(w, { py, vi, loai: 'gl' }));
  return m;
}
function bdTo(cau, td) {   // tách từ dài nhất trước
  let o = '', i = 0;
  while (i < cau.length) {
    let tim = null;
    for (let L = Math.min(8, cau.length - i); L >= 2; L--) { const w = cau.substr(i, L); if (td.has(w)) { tim = w; break; } }
    if (tim) { const x = td.get(tim); o += `<span class="bd-tu ${x.loai}" data-lf="bd-tu" data-w="${esc(tim)}">${esc(tim)}</span>`; i += tim.length; }
    else { o += esc(cau[i]); i++; }
  }
  return o;
}
const bdCau = doan => doan.match(/[^。！？；]+[。！？；”]*/g) || [doan];
function bdVeKho(khung) {
  const d = dsBD(), ds = BAI_DOC.filter(b => !BD.loc || b.cap === BD.loc), xong = BAI_DOC.filter(b => d[b.id]).length;
  const goiY = BAI_DOC.find(b => !d[b.id]);
  khung.innerHTML = `<div class="lf bd-kho">
    <div class="bd-dau-kho"><div><h3>Bài đọc phân cấp</h3><p class="mo nho">Đã đọc ${xong}/${BAI_DOC.length} bài · chạm vào từ được tô để xem pinyin và nghĩa</p></div>
      ${goiY ? `<button class="nut chinh" data-lf="bd-mo" data-id="${goiY.id}">▶ Đọc bài tiếp theo</button>` : ''}</div>
    <div class="loc-chip">${[[0, 'Tất cả'], [7, 'Cấp 7'], [8, 'Cấp 8'], [9, 'Cấp 9']].map(([v, c]) => `<button class="${BD.loc === v ? 'on' : ''}" data-lf="bd-loc" data-v="${v}">${c}</button>`).join('')}</div>
    <div class="bd-ds">${ds.map(b => { const x = d[b.id], so = b.doan.reduce((a, p) => a + p[0].length, 0); return `<button class="bd-the ${x ? 'xong' : ''}" data-lf="bd-mo" data-id="${b.id}">
      <span class="bd-cap c${b.cap}">${b.cap}</span><span class="bd-chu"><b>${esc(b.ten)}</b><small>${esc(b.vi_ten)}</small><em>${esc(b.chu_de)} · ${so} chữ · ~${Math.max(2, Math.round(so / 180))} phút${x ? ` · ✓ ${x.dung}/${b.hoi.length} câu đúng` : ''}</em></span></button>`; }).join('')}</div>
    <button class="nut nho bd-cau-lk" data-lf="doc-cau">🗣 Luyện đọc to câu ví dụ trong flashcard →</button>
  </div>`;
}
function bdVeBai(khung) {
  const b = BAI_DOC.find(x => x.id === BD.mo); if (!b) { BD.mo = null; return bdVeKho(khung); }
  const td = bdTuDien(b); if (!BD.t0) BD.t0 = Date.now();
  let ci = 0;
  khung.innerHTML = `<div class="lf bd-bai">
    <div class="bd-thanh"><button class="nut nho" data-lf="bd-ve">← Kho bài</button><span class="bd-cap c${b.cap}">Cấp ${b.cap}</span>
      <span class="bd-nghe"><button class="nut nho" data-lf="bd-noi">${BD.noi ? '■ Dừng' : '🔊 Nghe cả bài'}</button><select data-lf="bd-toc">${[[.7, 'Chậm'], [.9, 'Vừa'], [1.05, 'Nhanh']].map(([v, c]) => `<option value="${v}" ${BD.toc == v ? 'selected' : ''}>${c}</option>`).join('')}</select></span></div>
    <h2 class="bd-ten">${esc(b.ten)}</h2><p class="mo bd-viten">${esc(b.vi_ten)}</p>
    ${b.doan.map(([zh, vi], i) => `<div class="bd-doan"><p class="bd-zh">${bdCau(zh).map(c => `<span class="bd-c" data-ci="${ci++}">${bdTo(c, td)}</span>`).join('')}</p>
      <button class="bd-dich-nut" data-lf="bd-dich" data-i="${i}">${BD.dich[i] ? 'Ẩn dịch' : 'Xem dịch'}</button>${BD.dich[i] ? `<p class="bd-vi">${esc(vi)}</p>` : ''}</div>`).join('')}
    <details class="bd-gl"><summary>Từ khó trong bài (${b.gl.length})</summary>${b.gl.map(([w, py, vi]) => `<div><b>${esc(w)}</b> <span>${esc(py)}</span> · ${esc(vi)}</div>`).join('')}</details>
    <section class="bd-hoi"><h4>Câu hỏi hiểu bài</h4>
      ${b.hoi.map(([q, ops, dung], i) => `<div class="bd-q"><p>${i + 1}. ${esc(q)}</p>${ops.map((o, j) => { const chon = BD.tl[i] === j, kq = BD.nop ? (j === dung ? 'dung' : chon ? 'sai' : '') : ''; return `<button class="bd-op ${chon ? 'chon' : ''} ${kq}" data-lf="bd-chon" data-q="${i}" data-o="${j}" ${BD.nop ? 'disabled' : ''}>${'ABCD'[j]}. ${esc(o)}</button>`; }).join('')}</div>`).join('')}
      ${BD.nop ? bdKetQua(b) : `<button class="nut chinh" data-lf="bd-nop">Nộp bài</button>`}
    </section>
    <div class="bd-pop" id="bd-pop" hidden></div>
  </div>`;
}
function bdKetQua(b) {
  const dung = b.hoi.filter((h, i) => BD.tl[i] === h[2]).length, x = dsBD()[b.id] || {};
  return `<div class="bd-kq"><b>${dung}/${b.hoi.length} câu đúng</b> · ${x.phut || '?'} phút · ${x.toc || '?'} chữ/phút
    <div class="lf-nut"><button class="nut" data-lf="bd-ve">← Kho bài</button>${(() => { const n = BAI_DOC[BAI_DOC.findIndex(t => t.id === b.id) + 1]; return n ? `<button class="nut chinh" data-lf="bd-mo" data-id="${n.id}">Bài tiếp →</button>` : ''; })()}</div></div>`;
}
async function bdNop(khung) {
  const b = BAI_DOC.find(x => x.id === BD.mo);
  if (Object.keys(BD.tl).length < b.hoi.length) { toast('Thầy trả lời hết các câu nhé'); return; }
  BD.nop = true;
  const dung = b.hoi.filter((h, i) => BD.tl[i] === h[2]).length, so = b.doan.reduce((a, p) => a + p[0].length, 0);
  const phut = Math.max(1, Math.round((Date.now() - BD.t0) / 60000)), toc = Math.round(so / Math.max(.5, (Date.now() - BD.t0) / 60000));
  await luuCaiDat('bai_doc', { ...dsBD(), [b.id]: { ngay: homNay(), dung, phut, toc } });
  bdVeBai(khung); khung.querySelector('.bd-hoi').scrollIntoView({ behavior: 'smooth' });
  fcTickBai('docpc', 'Đọc bài phân cấp hôm nay xong ✓');
}
function bdDocToan(khung) {
  const ds = [...khung.querySelectorAll('.bd-c')];
  if (BD.noi) { BD.noi = false; try { speechSynthesis.cancel(); } catch (e) { } ds.forEach(x => x.classList.remove('dang')); bdNutNoi(khung); return; }
  BD.noi = true; bdNutNoi(khung);
  const g = speechSynthesis.getVoices().filter(v => /zh[-_]CN/i.test(v.lang)), giong = g.find(v => /Tingting|Ting-Ting|Yu-shu|Lili/i.test(v.name)) || g[0];
  let i = 0;
  const tiep = () => {
    ds.forEach(x => x.classList.remove('dang'));
    if (!BD.noi || i >= ds.length || !document.body.contains(ds[0])) { BD.noi = false; bdNutNoi(khung); return; }
    const el = ds[i++]; el.classList.add('dang'); el.scrollIntoView({ block: 'center', behavior: 'smooth' });
    const u = new SpeechSynthesisUtterance(el.textContent); u.lang = 'zh-CN'; u.rate = BD.toc; if (giong) u.voice = giong;
    u.onend = tiep; u.onerror = tiep; speechSynthesis.speak(u);
  };
  try { speechSynthesis.cancel(); } catch (e) { } tiep();
}
function bdNutNoi(khung) { const n = khung.querySelector('[data-lf=bd-noi]'); if (n) n.textContent = BD.noi ? '■ Dừng' : '🔊 Nghe cả bài'; }
function bdBam(a, b, khung, e) {
  if (a === 'bd-loc') { BD.loc = Number(b.dataset.v); bdVeKho(khung); }
  else if (a === 'bd-mo') { BD.mo = b.dataset.id; BD.dich = {}; BD.tl = {}; BD.nop = false; BD.t0 = Date.now(); BD.noi = false; try { speechSynthesis.cancel(); } catch (x) { } bdVeBai(khung); khung.scrollTop = 0; }
  else if (a === 'bd-ve') { BD.mo = null; BD.noi = false; try { speechSynthesis.cancel(); } catch (x) { } bdVeKho(khung); khung.scrollTop = 0; }
  else if (a === 'bd-dich') { const i = b.dataset.i; BD.dich[i] = !BD.dich[i]; const y = khung.scrollTop; bdVeBai(khung); khung.scrollTop = y; }
  else if (a === 'bd-chon') { if (BD.nop) return; BD.tl[b.dataset.q] = Number(b.dataset.o); const y = khung.scrollTop; bdVeBai(khung); khung.scrollTop = y; }
  else if (a === 'bd-nop') bdNop(khung);
  else if (a === 'bd-noi') bdDocToan(khung);
  else if (a === 'bd-toc') { if (e.type === 'change') BD.toc = Number(b.value); }
  else if (a === 'bd-tu') {
    const bai = BAI_DOC.find(x => x.id === BD.mo), x = bdTuDien(bai).get(b.dataset.w), p = khung.querySelector('#bd-pop');
    if (!x) return;
    p.innerHTML = `<b>${esc(b.dataset.w)}</b><span>${esc(x.py)}</span><p>${esc(x.vi)}</p><button class="nut nho" data-lf="bd-nghe-tu" data-w="${esc(b.dataset.w)}">🔊</button>${x.loai === 'hsk' ? '<small>trong bộ 1.500 từ</small>' : ''}`;
    const r = b.getBoundingClientRect(), k = khung.getBoundingClientRect();
    p.hidden = false; p.style.top = (r.bottom - k.top + khung.scrollTop + 6) + 'px'; p.style.left = Math.max(8, Math.min(r.left - k.left - 20, k.width - 250)) + 'px';
    e.stopPropagation();
  }
  else if (a === 'bd-nghe-tu') lfNoi(b.dataset.w);
}

/* ====================== NGHE THỤ ĐỘNG (bản 6.0) ======================
   cai_dat 'nghe_ds' = [{ id, ten, url, loai: 'apple'|'youtube'|'khac', luot, cuoi }] */
const NG = { dang: null };
const NG_GOI_Y = [
  { ten: '忽左忽右', mo: 'Trò chuyện văn hóa, lịch sử, xã hội', url: 'https://podcasts.apple.com/podcast/id1493503146' },
  { ten: '日谈公园', mo: 'Tán gẫu phim ảnh, âm nhạc, đời sống', url: 'https://podcasts.apple.com/podcast/id1166949390' },
  { ten: '日知录', mo: 'Nhà nghiên cứu kể về khoa học, lịch sử', url: 'https://podcasts.apple.com/podcast/id1527514372' },
];
const dsNghe = () => caiDat('nghe_ds', []) || [];
function ngPhanTich(url) {
  const u = String(url || '').trim(); if (!/^https?:\/\//i.test(u)) return null;
  let m;
  if ((m = u.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|live\/|embed\/)|youtu\.be\/)([\w-]{11})/))) return { loai: 'youtube', nhung: `https://www.youtube-nocookie.com/embed/${m[1]}?rel=0&playsinline=1` };
  if ((m = u.match(/youtube\.com\/.*[?&]list=([\w-]+)/))) return { loai: 'youtube', nhung: `https://www.youtube-nocookie.com/embed/videoseries?list=${m[1]}&playsinline=1` };
  if (/podcasts\.apple\.com/.test(u)) return { loai: 'apple', nhung: u.replace('://podcasts.apple.com', '://embed.podcasts.apple.com') };
  return { loai: 'khac', nhung: null };
}
function ngVe(khung) {
  const ds = dsNghe(), hn = homNay(), daNghe = typeof l79Data === 'function' && l79Data().done && l79Data().done[`${hn}|nghetd`];
  const dang = ds.find(x => x.id === NG.dang), pt = dang ? ngPhanTich(dang.url) : null;
  const goiY = NG_GOI_Y.filter(g => !ds.some(x => x.url === g.url));
  khung.innerHTML = `<div class="lf ng">
    ${dang ? `<div class="ng-play"><div class="ng-play-dau"><b>${esc(dang.ten)}</b><span><a class="nut nho" href="${esc(dang.url)}" target="_blank" rel="noopener">Mở trong app ↗</a><button class="nut-x" data-lf="ng-dong">×</button></span></div>
      ${pt && pt.nhung ? `<iframe class="ng-khung ${pt.loai}" src="${esc(pt.nhung)}" allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation allow-presentation" loading="lazy"></iframe>` : `<p class="mo">Link này không phát được trong web. Bấm "Mở trong app" để nghe.</p>`}
    </div>` : ''}
    <div class="ng-dau"><div><h3>Nghe thụ động</h3><p class="mo nho">Lưu podcast Apple hoặc video YouTube Thầy hay nghe, bấm là phát ngay. Nghe lúc di chuyển, nấu ăn, trước khi ngủ.</p></div>
      <button class="nut ${daNghe ? '' : 'chinh'}" data-lf="ng-xong" ${daNghe ? 'disabled' : ''}>${daNghe ? '✓ Hôm nay đã nghe' : '✓ Đã nghe hôm nay'}</button></div>
    <form class="ng-them" data-lf="ng-form"><input name="url" placeholder="Dán link Apple Podcasts hoặc YouTube…" autocomplete="off"><input name="ten" placeholder="Tên (VD: 新闻联播)" autocomplete="off"><button class="nut chinh" type="submit">＋ Lưu</button></form>
    ${ds.length ? `<div class="ng-ds">${ds.map(x => { const p = ngPhanTich(x.url) || {}; return `<div class="ng-dong ${NG.dang === x.id ? 'on' : ''}"><button class="ng-mo" data-lf="ng-mo" data-id="${x.id}"><i class="ng-ic ${p.loai}">${p.loai === 'youtube' ? '▶' : p.loai === 'apple' ? '🎙' : '🔗'}</i><span><b>${esc(x.ten || x.url)}</b><small>${p.loai === 'youtube' ? 'YouTube' : p.loai === 'apple' ? 'Apple Podcasts' : 'Link ngoài'}${x.luot ? ` · nghe ${x.luot} lần · gần nhất ${ngayNgan(x.cuoi)}` : ''}</small></span></button><button class="nut-x" data-lf="ng-xoa" data-id="${x.id}" title="Xoá">×</button></div>`; }).join('')}</div>` : '<p class="mo ng-trong">Chưa có kênh nào. Thầy dán link vào ô trên, hoặc thêm nhanh vài kênh gợi ý dưới đây.</p>'}
    ${goiY.length ? `<div class="ng-goi-y"><small class="mo">Gợi ý podcast tiếng Trung hay (Apple Podcasts):</small>${goiY.map(g => `<button class="nut nho" data-lf="ng-goi-y" data-url="${g.url}" data-ten="${g.ten}"><b>＋ ${g.ten}</b> <span class="mo">${g.mo}</span></button>`).join('')}</div>` : ''}
    <p class="mo nho">Mẹo: trong app YouTube hay Podcasts, bấm Chia sẻ → Sao chép liên kết rồi dán vào đây.</p>
  </div>`;
}
async function ngBam(a, b, khung, e) {
  if (a === 'ng-form') {
    if (e.type !== 'submit') return; e.preventDefault();
    const f = docForm(b), p = ngPhanTich(f.url); if (!p) { toast('Link chưa đúng, Thầy kiểm tra lại', 'loi'); return; }
    const id = 'ng' + Date.now(); await luuCaiDat('nghe_ds', [{ id, ten: f.ten || (p.loai === 'youtube' ? 'Video YouTube' : p.loai === 'apple' ? 'Podcast' : 'Link nghe'), url: f.url.trim(), luot: 0 }, ...dsNghe()]);
    NG.dang = id; ngVe(khung); toast('Đã lưu ✓');
  }
  else if (a === 'ng-goi-y') { const id = 'ng' + Date.now(); await luuCaiDat('nghe_ds', [...dsNghe(), { id, ten: b.dataset.ten, url: b.dataset.url, luot: 0 }]); ngVe(khung); }
  else if (a === 'ng-mo') {
    NG.dang = b.dataset.id; await luuCaiDat('nghe_ds', dsNghe().map(x => x.id === NG.dang ? { ...x, luot: (x.luot || 0) + 1, cuoi: homNay() } : x));
    ngVe(khung); khung.scrollTop = 0;
  }
  else if (a === 'ng-dong') { NG.dang = null; ngVe(khung); }
  else if (a === 'ng-xoa') { if (!(await hoi('Xoá kênh này khỏi danh sách?', 'Xoá', 'nguy'))) return; if (NG.dang === b.dataset.id) NG.dang = null; await luuCaiDat('nghe_ds', dsNghe().filter(x => x.id !== b.dataset.id)); ngVe(khung); }
  else if (a === 'ng-xong') { await fcTickBai('nghetd', 'Đã ghi: hôm nay có nghe ✓'); ngVe(khung); }
}
