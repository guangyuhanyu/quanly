/* =========================================================
   Lớp dữ liệu: Supabase (online) hoặc Máy này (localStorage)
   ========================================================= */
const BANG = ['bang_gia', 'hoc_vien', 'lop', 'lop_hoc_vien', 'khoa_hoc', 'buoi_hoc', 'thanh_toan', 'cong_viec', 'cai_dat', 'thoi_quen', 'thoi_quen_nhat_ky', 'chi_tieu'];
const BANG_CA_NHAN = ['thoi_quen', 'thoi_quen_nhat_ky', 'chi_tieu'];
const MA = {
  hoc_vien: id => 'HV' + String(id).padStart(4, '0'),
  lop: id => 'L' + String(id).padStart(4, '0'),
  khoa_hoc: id => 'K' + String(id).padStart(4, '0'),
  buoi_hoc: id => 'B' + String(id).padStart(5, '0'),
  thanh_toan: id => 'GD' + String(id).padStart(4, '0'),
};
const BANG_GIA_MAC_DINH = [
  { id: 1, nhom: 'HSK 3.0', ten: 'HSK 1', mo_ta: null, ten_zh: 'HSK一级', don_gia_gio: 160000, thu_tu: 1, dang_dung: true },
  { id: 2, nhom: 'HSK 3.0', ten: 'HSK 2', mo_ta: null, ten_zh: 'HSK二级', don_gia_gio: 160000, thu_tu: 2, dang_dung: true },
  { id: 3, nhom: 'HSK 3.0', ten: 'HSK 3', mo_ta: null, ten_zh: 'HSK三级', don_gia_gio: 170000, thu_tu: 3, dang_dung: true },
  { id: 4, nhom: 'HSK 3.0', ten: 'HSK 4', mo_ta: null, ten_zh: 'HSK四级', don_gia_gio: 180000, thu_tu: 4, dang_dung: true },
  { id: 5, nhom: 'HSK 3.0', ten: 'HSK 5', mo_ta: null, ten_zh: 'HSK五级', don_gia_gio: 195000, thu_tu: 5, dang_dung: true },
  { id: 6, nhom: 'Giao tiếp', ten: 'Cơ bản', mo_ta: 'Quyển 1', ten_zh: '汉语口语速成（第一册）', don_gia_gio: 160000, thu_tu: 11, dang_dung: true },
  { id: 7, nhom: 'Giao tiếp', ten: 'Sơ cấp 1', mo_ta: 'Quyển 2', ten_zh: '汉语口语速成（第二册）', don_gia_gio: 160000, thu_tu: 12, dang_dung: true },
  { id: 8, nhom: 'Giao tiếp', ten: 'Sơ cấp 2', mo_ta: 'Quyển 3', ten_zh: '汉语口语速成（第三册）', don_gia_gio: 170000, thu_tu: 13, dang_dung: true },
  { id: 9, nhom: 'Giao tiếp', ten: 'Sơ cấp 3', mo_ta: 'Quyển 4', ten_zh: '汉语口语速成（第四册）', don_gia_gio: 170000, thu_tu: 14, dang_dung: true },
  { id: 10, nhom: 'Giao tiếp', ten: 'Tiền trung cấp', mo_ta: 'Quyển 5', ten_zh: '汉语口语速成（第五册）', don_gia_gio: 180000, thu_tu: 15, dang_dung: true },
  { id: 11, nhom: 'Giao tiếp', ten: 'Trung cấp', mo_ta: 'Quyển 6', ten_zh: '汉语口语速成（第六册）', don_gia_gio: 190000, thu_tu: 16, dang_dung: true },
];

function chuanHoaDong(t, r) {
  if (!r) return r;
  if (t === 'buoi_hoc' && r.gio_bat_dau) r.gio_bat_dau = String(r.gio_bat_dau).slice(0, 5);
  return r;
}

/* ---------------- Máy này (localStorage) ---------------- */
const LocalDB = {
  mode: 'local',
  KEY: 'gyq_du_lieu_v1',
  _d: null,
  _save() { localStorage.setItem(this.KEY, JSON.stringify(this._d)); },
  async init() {
    try { this._d = JSON.parse(localStorage.getItem(this.KEY)); } catch (e) { this._d = null; }
    if (!this._d) {
      this._d = {}; BANG.forEach(t => this._d[t] = []);
      this._d.bang_gia = JSON.parse(JSON.stringify(BANG_GIA_MAC_DINH));
      this._save();
    }
    // nâng cấp: thêm bảng mới, KHÔNG xoá dữ liệu cũ
    let doi = false; BANG.forEach(t => { if (!Array.isArray(this._d[t])) { this._d[t] = []; doi = true; } });
    if (this._donDep()) doi = true;
    if (doi) this._save();
    return true;
  },
  async loadAll() { return JSON.parse(JSON.stringify(this._d)); },
  _nextId(t) { return this._d[t].reduce((m, r) => Math.max(m, r.id || 0), 0) + 1; },
  async insert(t, row) {
    const r = { ...row };
    if (t !== 'lop_hoc_vien' && t !== 'cai_dat') { r.id = r.id || this._nextId(t); if (MA[t]) r.ma = MA[t](r.id); r.created_at = r.created_at || new Date().toISOString(); }
    this._d[t].push(r); this._save(); return JSON.parse(JSON.stringify(r));
  },
  async insertMany(t, rows) { const out = []; for (const r of rows) out.push(await this.insert(t, r)); return out; },
  async update(t, id, patch) {
    const r = this._d[t].find(x => x.id === id); if (!r) throw new Error('Không tìm thấy dòng ' + id);
    Object.assign(r, patch); this._save(); return JSON.parse(JSON.stringify(r));
  },
  async remove(t, id) {
    this._d[t] = this._d[t].filter(x => x.id !== id);
    this._xoaLienQuan(t, id); this._save();
  },
  /* làm giống ràng buộc của Supabase: xoá lớp thì xoá luôn khoá, buổi, thanh toán của lớp… */
  _xoaLienQuan(t, id) {
    const d = this._d;
    if (t === 'lop') {
      d.lop_hoc_vien = d.lop_hoc_vien.filter(x => x.lop_id !== id);
      const ks = d.khoa_hoc.filter(x => x.lop_id === id).map(x => x.id);
      d.khoa_hoc = d.khoa_hoc.filter(x => x.lop_id !== id);
      d.buoi_hoc = d.buoi_hoc.filter(x => x.lop_id !== id);
      d.thanh_toan = d.thanh_toan.filter(x => x.lop_id !== id);
      d.cong_viec.forEach(x => { if (x.lop_id === id) x.lop_id = null; });
      ks.forEach(k => this._xoaLienQuan('khoa_hoc', k));
    }
    if (t === 'khoa_hoc') {
      d.buoi_hoc.forEach(x => { if (x.khoa_id === id) x.khoa_id = null; });
      d.thanh_toan.forEach(x => { if (x.khoa_id === id) x.khoa_id = null; });
      d.khoa_hoc.forEach(x => { if (x.khoa_truoc_id === id) x.khoa_truoc_id = null; });
    }
    if (t === 'hoc_vien') d.lop_hoc_vien = d.lop_hoc_vien.filter(x => x.hoc_vien_id !== id);
    if (t === 'thoi_quen') d.thoi_quen_nhat_ky = d.thoi_quen_nhat_ky.filter(x => x.thoi_quen_id !== id);
  },
  /* dọn dữ liệu mồ côi còn sót từ bản cũ */
  _donDep() {
    const d = this._d; const lop = new Set(d.lop.map(x => x.id)); const khoa = new Set(); let doi = false;
    const loc = (t, f) => { const n = d[t].length; d[t] = d[t].filter(f); if (d[t].length !== n) doi = true; };
    loc('khoa_hoc', x => lop.has(x.lop_id)); d.khoa_hoc.forEach(x => khoa.add(x.id));
    loc('buoi_hoc', x => lop.has(x.lop_id)); loc('thanh_toan', x => !x.lop_id || lop.has(x.lop_id));
    loc('lop_hoc_vien', x => lop.has(x.lop_id) && d.hoc_vien.some(h => h.id === x.hoc_vien_id));
    d.buoi_hoc.forEach(x => { if (x.khoa_id && !khoa.has(x.khoa_id)) { x.khoa_id = null; doi = true; } });
    d.thanh_toan.forEach(x => { if (x.khoa_id && !khoa.has(x.khoa_id)) { x.khoa_id = null; doi = true; } });
    const tq = new Set(d.thoi_quen.map(x => x.id)); loc('thoi_quen_nhat_ky', x => tq.has(x.thoi_quen_id));
    return doi;
  },
  async removeWhere(t, match) {
    this._d[t] = this._d[t].filter(x => !Object.entries(match).every(([k, v]) => x[k] === v)); this._save();
  },
  async setCaiDat(khoa, gia_tri) {
    const r = this._d.cai_dat.find(x => x.khoa === khoa);
    if (r) r.gia_tri = gia_tri; else this._d.cai_dat.push({ khoa, gia_tri });
    this._save();
  },
  async replaceAll(b) {
    b = lamSachSaoLuu(b);
    BANG.forEach(t => {
      if (!Array.isArray(b[t])) return;   // file sao lưu cũ không có bảng này → giữ nguyên
      this._d[t] = (b[t] || []).map(r => { const x = { ...r }; if (MA[t] && x.id) x.ma = MA[t](x.id); return x; });
    });
    this._save();
  },
};


/* Dọn dữ liệu mồ côi trong file sao lưu (khoá/buổi của lớp đã xoá…) trước khi khôi phục */
function lamSachSaoLuu(b) {
  const b2 = { ...b }, bo = {};
  const ids = t => new Set((b2[t] || []).map(r => r.id));
  const loc = (t, f) => { if (!Array.isArray(b2[t])) return; const n = b2[t].length; b2[t] = b2[t].filter(f); if (n - b2[t].length) bo[t] = n - b2[t].length; };
  const nul = (t, k, set) => { if (Array.isArray(b2[t])) b2[t] = b2[t].map(r => (r[k] != null && !set.has(r[k])) ? { ...r, [k]: null } : r); };
  const L = ids('lop'), HV = ids('hoc_vien'), BG = ids('bang_gia');
  if (Array.isArray(b2.lop) && Array.isArray(b2.bang_gia)) nul('lop', 'bang_gia_id', BG);
  if (Array.isArray(b2.lop)) {
    loc('khoa_hoc', r => L.has(r.lop_id));
    loc('lop_hoc_vien', r => L.has(r.lop_id) && (!Array.isArray(b2.hoc_vien) || HV.has(r.hoc_vien_id)));
    loc('buoi_hoc', r => L.has(r.lop_id));
    loc('thanh_toan', r => r.lop_id == null || L.has(r.lop_id));
    nul('cong_viec', 'lop_id', L);
  }
  const K = ids('khoa_hoc');
  if (Array.isArray(b2.khoa_hoc)) { nul('khoa_hoc', 'khoa_truoc_id', K); nul('buoi_hoc', 'khoa_id', K); nul('thanh_toan', 'khoa_id', K); }
  if (Array.isArray(b2.thoi_quen)) { const TQ = ids('thoi_quen'); loc('thoi_quen_nhat_ky', r => TQ.has(r.thoi_quen_id)); }
  b2._boQua = bo;
  return b2;
}

/* ---------------- Supabase ---------------- */
const SupaDB = {
  mode: 'supabase',
  sb: null,
  async init(conn) {
    this.sb = window.supabase.createClient(conn.url, conn.key, { auth: { persistSession: true, storageKey: 'gyq_auth' } });
    const { data } = await this.sb.auth.getSession();
    return !!data.session;
  },
  async login(email, password) {
    const { error } = await this.sb.auth.signInWithPassword({ email, password });
    if (error) { if (/invalid api key/i.test(error.message)) { localStorage.removeItem('gyq_ket_noi'); localStorage.removeItem('gyq_che_do'); throw new Error('Key kết nối bị gõ sai. Web đã tự đặt lại key đúng, Thầy tải lại trang rồi đăng nhập lại nhé.'); } throw new Error(error.message === 'Invalid login credentials' ? 'Sai email hoặc mật khẩu' : error.message); }
  },
  async logout() { await this.sb.auth.signOut(); },
  async _all(t) {
    const out = []; let from = 0;
    while (true) {
      const { data, error } = await this.sb.from(t).select('*').range(from, from + 999);
      if (error) throw new Error(`${t}: ${error.message}`);
      out.push(...data); if (data.length < 1000) break; from += 1000;
    }
    return out.map(r => chuanHoaDong(t, r));
  },
  async loadAll() {
    const S = {}; this.thieuBang = [];
    const res = await Promise.all(BANG.map(t => this._all(t).catch(e => {
      if (BANG_CA_NHAN.includes(t)) { this.thieuBang.push(t); return []; }  // chưa chạy file SQL số 3
      throw e;
    })));
    BANG.forEach((t, i) => S[t] = res[i]);
    return S;
  },
  _clean(t, row) { const r = { ...row }; delete r.ma; if (t !== 'lop_hoc_vien' && t !== 'cai_dat' && r.id == null) delete r.id; return r; },
  async insert(t, row) {
    const { data, error } = await this.sb.from(t).insert(this._clean(t, row)).select().single();
    if (error) throw new Error(error.message); return chuanHoaDong(t, data);
  },
  async insertMany(t, rows) {
    const out = [];
    for (let i = 0; i < rows.length; i += 500) {
      const { data, error } = await this.sb.from(t).insert(rows.slice(i, i + 500).map(r => this._clean(t, r))).select();
      if (error) throw new Error(`${t}: ${error.message}`); out.push(...data.map(r => chuanHoaDong(t, r)));
    }
    return out;
  },
  async update(t, id, patch) {
    const p = { ...patch }; delete p.ma; delete p.id;
    const { data, error } = await this.sb.from(t).update(p).eq('id', id).select().single();
    if (error) throw new Error(error.message); return chuanHoaDong(t, data);
  },
  async remove(t, id) { const { error } = await this.sb.from(t).delete().eq('id', id); if (error) throw new Error(error.message); },
  async removeWhere(t, match) { const { error } = await this.sb.from(t).delete().match(match); if (error) throw new Error(error.message); },
  async setCaiDat(khoa, gia_tri) {
    const { error } = await this.sb.from('cai_dat').upsert({ khoa, gia_tri }); if (error) throw new Error(error.message);
  },
  async replaceAll(b) {
    b = lamSachSaoLuu(b);
    const xoa = ['thoi_quen_nhat_ky', 'thoi_quen', 'chi_tieu', 'cong_viec', 'thanh_toan', 'buoi_hoc', 'lop_hoc_vien', 'khoa_hoc', 'lop', 'hoc_vien', 'cai_dat', 'bang_gia']
      .filter(t => Array.isArray(b[t]) && !(this.thieuBang || []).includes(t));   // chỉ thay bảng có trong file
    for (const t of xoa) {
      const q = this.sb.from(t).delete();
      const { error } = await (t === 'lop_hoc_vien' ? q.gte('lop_id', 0) : t === 'cai_dat' ? q.neq('khoa', '') : q.gte('id', 0));
      if (error) throw new Error(`Xoá ${t}: ${error.message}`);
    }
    const thuTu = ['bang_gia', 'hoc_vien', 'lop', 'lop_hoc_vien', 'khoa_hoc', 'buoi_hoc', 'thanh_toan', 'cong_viec', 'cai_dat', 'thoi_quen', 'thoi_quen_nhat_ky', 'chi_tieu'];
    for (const t of thuTu) {
      if (!xoa.includes(t)) continue;
      let rows = b[t] || []; if (!rows.length) continue;
      if (t === 'khoa_hoc') rows = [...rows].sort((a, c) => a.id - c.id);
      for (let i = 0; i < rows.length; i += 500) {
        const { error } = await this.sb.from(t).insert(rows.slice(i, i + 500).map(r => { const x = { ...r }; delete x.ma; return x; }));
        if (error) throw new Error(`Ghi ${t}: ${error.message}`);
      }
    }
    const { error } = await this.sb.rpc('dong_bo_ma'); if (error) throw new Error('Đồng bộ mã: ' + error.message);
  },
};
