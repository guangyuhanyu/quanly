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
  async remove(t, id) { this._d[t] = this._d[t].filter(x => x.id !== id); this._save(); },
  async removeWhere(t, match) {
    this._d[t] = this._d[t].filter(x => !Object.entries(match).every(([k, v]) => x[k] === v)); this._save();
  },
  async setCaiDat(khoa, gia_tri) {
    const r = this._d.cai_dat.find(x => x.khoa === khoa);
    if (r) r.gia_tri = gia_tri; else this._d.cai_dat.push({ khoa, gia_tri });
    this._save();
  },
  async replaceAll(b) {
    BANG.forEach(t => {
      if (!Array.isArray(b[t])) return;   // file sao lưu cũ không có bảng này → giữ nguyên
      this._d[t] = (b[t] || []).map(r => { const x = { ...r }; if (MA[t] && x.id) x.ma = MA[t](x.id); return x; });
    });
    this._save();
  },
};

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
    if (error) throw new Error(error.message === 'Invalid login credentials' ? 'Sai email hoặc mật khẩu' : error.message);
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
