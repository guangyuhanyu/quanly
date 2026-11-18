/* Bộ icon cổ phong vẽ riêng (nét mảnh, theo màu chữ) */
const _i = (d, extra = '') => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.45" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>${extra}`;
const ICON = {
  // Hôm nay: mặt trời mọc trên núi, mây cuộn
  'hom-nay': _i('<circle cx="15.6" cy="7.6" r="2.6"/><path d="M2.5 19.5l5.2-7.2 3.3 4.2 2.6-3.1 5.9 6.1z"/><path d="M2.5 19.5h19"/><path d="M3.6 9.6c.5-1.3 2.2-1.7 3.1-.7.5-1 1.9-1.1 2.5-.1"/>'),
  // Lịch dạy: cuộn thư pháp có triện đỏ
  'lich': _i('<path d="M4 4.2h16M4 19.8h16"/><path d="M6.2 4.2v15.6M17.8 4.2v15.6"/><circle cx="3.4" cy="4.2" r=".8"/><circle cx="20.6" cy="4.2" r=".8"/><circle cx="3.4" cy="19.8" r=".8"/><circle cx="20.6" cy="19.8" r=".8"/><path d="M9 8.4h6M9 11.6h6M9 14.8h3"/><rect x="13.3" y="14" width="2.4" height="2.4" fill="currentColor" stroke="none" opacity=".75"/>'),
  // Lớp học: mái đình
  'lop': _i('<path d="M12 3.4 9.9 5.5C8.1 7.3 5.7 8.4 3 8.5c1 .9 2.2 1.3 3.5 1.3h11c1.3 0 2.5-.4 3.5-1.3-2.7-.1-5.1-1.2-6.9-3z"/><path d="M12 2v1.4M7 9.8v9.4M17 9.8v9.4M4.5 19.4h15M7 13.4h10"/>'),
  // Học viên: thư sinh búi tóc
  'hoc-vien': _i('<circle cx="10" cy="8.8" r="3"/><circle cx="10" cy="4.9" r="1"/><path d="M4 20.2c.3-3.6 2.8-6 6-6s5.7 2.4 6 6"/><path d="M8.3 14.6 10 17.2l1.7-2.6"/><path d="M15.4 6.6a2.6 2.6 0 0 1 .5 5"/><path d="M17.6 14.8c1.5.9 2.4 2.8 2.5 5.4"/>'),
  // Tài chính: đồng tiền cổ lỗ vuông
  'tai-chinh': _i('<circle cx="12" cy="12" r="8.6"/><circle cx="12" cy="12" r="6.3" opacity=".45"/><rect x="9.6" y="9.6" width="4.8" height="4.8" rx=".3"/><path d="M12 4.7v1.4M12 17.9v1.4M4.7 12h1.4M17.9 12h1.4"/>'),
  // Công việc: bút lông
  'cong-viec': _i('<path d="M20.2 3.6 12.4 11.4"/><path d="M13.6 10.2l1.6 1.6"/><path d="M12.4 11.4c-2-.3-3.9.8-4.7 2.8-.7 1.7-.6 3.4-2.5 5.1 2.7.4 5.6-.3 7.2-2.4 1.1-1.4 1.3-3.2 1-4.7"/><path d="M18.8 2.4l2.8 2.8"/>'),
  // Cài đặt: song cửa hoa văn
  'cai-dat': _i('<rect x="3.5" y="3.5" width="17" height="17" rx="2.5"/><circle cx="12" cy="12" r="3.4"/><path d="M12 3.5v5.1M12 15.4v5.1M3.5 12h5.1M15.4 12h5.1"/><path d="M6.6 6.6l2.9 2.9M17.4 6.6l-2.9 2.9M6.6 17.4l2.9-2.9M17.4 17.4l-2.9-2.9"/>'),
  // Đèn lồng
  'den-long': _i('<path d="M12 2.4v2.2M9.4 4.6h5.2"/><path d="M8.3 6.4C6 7.6 5 9.7 5 11.8s1 4.2 3.3 5.4h7.4c2.3-1.2 3.3-3.3 3.3-5.4s-1-4.2-3.3-5.4z"/><path d="M8.3 6.4h7.4M12 6.4v10.8M9.4 6.8c-.9 3.3-.9 6.7 0 10M14.6 6.8c.9 3.3.9 6.7 0 10"/><path d="M12 17.2v4.4M10.6 21.6h2.8"/>'),
  // Bàn tính
  'ban-tinh': _i('<rect x="3" y="4.5" width="18" height="15" rx="1.6"/><path d="M3 9.4h18M7.5 4.5v15M12 4.5v15M16.5 4.5v15"/><g fill="currentColor" stroke="none"><circle cx="7.5" cy="7" r="1.1"/><circle cx="12" cy="7" r="1.1"/><circle cx="16.5" cy="7" r="1.1"/><circle cx="7.5" cy="12" r="1.1"/><circle cx="12" cy="14.2" r="1.1"/><circle cx="16.5" cy="12" r="1.1"/><circle cx="7.5" cy="14.2" r="1.1"/><circle cx="16.5" cy="16.4" r="1.1"/></g>'),
  // Túi gấm
  'tui-gam': _i('<path d="M9 5.2h6l-1.4 2.4c3.2 1.4 4.9 4.3 4.4 7.6-.5 3.1-3.1 4.6-6 4.6s-5.5-1.5-6-4.6c-.5-3.3 1.2-6.2 4.4-7.6z"/><path d="M10.4 7.6h3.2M8.6 3.4c1.1.9 2.2 1.3 3.4 1.3s2.3-.4 3.4-1.3"/><path d="M12 11.2v5M10.2 13.2h3.6"/>'),
  // Chim hạc (trang trí)
  'hac': _i('<path d="M3 9.5c3.5-3 7-3.3 9.5-.8 2.6-3 6.2-3.6 8.5-1.7-2.6.3-4.7 1.6-6.2 3.8l-1.8 3.2-2.5-2.3C8.6 10 6 9.4 3 9.5z"/><path d="M13 14l1.6 5.5M12 13.6l-.4 5.9"/>'),
  // Rút thăm: ống thăm tre
  'rut-tham': _i('<path d="M6.5 10.5h11l-1.2 9.2a1.5 1.5 0 0 1-1.5 1.3H9.2a1.5 1.5 0 0 1-1.5-1.3z"/><path d="M6.5 13h11"/><path d="M9 10.5 8.2 3.6M11.4 10.5V2.8M13.8 10.5l.9-6.6M16 10.5l2-5"/><rect x="13.6" y="2.2" width="2.2" height="4" rx=".6" transform="rotate(8 14.7 4.2)" fill="currentColor" stroke="none" opacity=".8"/>'),
  // Chiêm tinh: trăng khuyết + sao
  'chiem-tinh': _i('<path d="M14.5 3.5a8.5 8.5 0 1 0 6 13.6A7 7 0 0 1 14.5 3.5z"/><path d="M18 3.2l.7 1.6 1.6.7-1.6.7-.7 1.6-.7-1.6-1.6-.7 1.6-.7z" fill="currentColor" stroke="none"/><circle cx="10.5" cy="10" r=".8" fill="currentColor" stroke="none"/><circle cx="8.5" cy="14.5" r=".6" fill="currentColor" stroke="none"/>'),
  // Thói quen: đốt trúc
  'thoi-quen': _i('<path d="M9 2.5v19M9 8h0M9 14h0"/><path d="M7.4 7.6h3.2M7.4 13.6h3.2"/><path d="M9 6c2.4-.4 4.2-1.6 5.6-3.6M9 12c2.8-.2 5.2-1.2 7.4-3.4M9 18c2.2.1 4.2-.6 6-2.2"/><path d="M14.6 2.4c.9 1.1 1 2.4.4 3.6M16.4 8.6c1 1 1.4 2.3 1 3.6"/>'),
  // Chi tiêu: nén bạc
  'chi-tieu': _i('<path d="M3 13c0-1 1-1.6 2.2-1.4 1.4.3 2.2-.4 2.6-1.6.6-1.7 2.2-2.6 4.2-2.6s3.6.9 4.2 2.6c.4 1.2 1.2 1.9 2.6 1.6C20 11.4 21 12 21 13c0 3.6-4 6.4-9 6.4S3 16.6 3 13z"/><path d="M8.6 11.8c.8 1 2 1.6 3.4 1.6s2.6-.6 3.4-1.6"/><path d="M6 16.6c1.7 1 3.7 1.5 6 1.5s4.3-.5 6-1.5" opacity=".5"/>'),
  // Giao diện: quạt xếp
  'giao-dien': _i('<path d="M12 20.5 3.2 9.4A12 12 0 0 1 20.8 9.4z"/><path d="M12 20.5 7.2 6.1M12 20.5V5.2M12 20.5l4.8-14.4M12 20.5 3.2 9.4M12 20.5l8.8-11.1"/><circle cx="12" cy="20.2" r="1" fill="currentColor"/>'),
  'menu': _i('<path d="M4 7h16M4 12h16M4 17h10"/>'),
  'ghim': _i('<path d="M9 3.5h6l-1 5 3 3.5H7l3-3.5z"/><path d="M12 12v8.5"/>'),
  'tai-anh': _i('<rect x="3.5" y="4" width="17" height="16" rx="2"/><path d="M12 8v8M8.5 11.5 12 8l3.5 3.5"/>'),
  'lua': _i('<path d="M12 21c-3.6 0-6-2.4-6-5.6 0-3.4 2.6-5 3.4-8.4 1.8 1.2 2.6 3 2.6 4.6 1-.8 1.6-2 1.8-3.4 2.4 2 4.2 4.4 4.2 7.2 0 3.2-2.4 5.6-6 5.6z"/>'),
  'nuoc': _i('<path d="M12 3c3 4 6 7.2 6 10.8A6 6 0 0 1 6 13.8C6 10.2 9 7 12 3z"/>'),
  'sach': _i('<path d="M3.5 5.5c3-1 5.8-.8 8.5 1 2.7-1.8 5.5-2 8.5-1v13c-3-1-5.8-.8-8.5 1-2.7-1.8-5.5-2-8.5-1z"/><path d="M12 6.5v13"/>'),
  'chay': _i('<circle cx="14.5" cy="4.6" r="1.8"/><path d="M8 21l3-5.5 3 2.5v3.5M11 15.5l1.5-5.5 3 2.5 3 .5M12.5 10 9 9.5l-2.5 3"/>'),
  'trang': _i('<path d="M15.5 3.5a8.5 8.5 0 1 0 5 13.6A7 7 0 0 1 15.5 3.5z"/>'),
  'tra': _i('<path d="M5 10h12v3.5A5.5 5.5 0 0 1 11.5 19h-1A5.5 5.5 0 0 1 5 13.5z"/><path d="M17 11.2h1.3a2 2 0 0 1 0 4H16.6M4 21h15"/><path d="M9 7c0-1 1-1.4 1-2.4M12.5 7c0-1 1-1.4 1-2.4"/>'),
  'trai': _i('<path d="M14.5 5.5 8 12l6.5 6.5"/>'),
  'phai': _i('<path d="M9.5 5.5 16 12l-6.5 6.5"/>'),
  'cong': _i('<path d="M12 5v14M5 12h14"/>'),
  'loc': _i('<path d="M4 5h16l-6 7.5V19l-4-2v-4.5z"/>'),
  'png': _i('<rect x="3.5" y="4" width="17" height="16" rx="2"/><circle cx="9" cy="9.5" r="1.8"/><path d="M3.5 17l5-4.5 3.5 3 3-2.5 5.5 4.5"/>'),
  'chuong': _i('<path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 1.5h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0M12 3v2"/>'),
};

/* ===== Bộ icon pastel (bản 4.8) — ảnh màu thay cho icon nét ===== */
const _a = n => `<img class="ic ic-anh" src="assets/icons/${n}.webp?v=5.6" alt="" aria-hidden="true" draggable="false">`;
Object.assign(ICON, {
  'hom-nay': _a('positive'), 'lich': _a('schedule'), 'lop': _a('study'), 'hoc-vien': _a('mood'),
  'tai-chinh': _a('progress'), 'cong-viec': _a('todo'), 'cai-dat': _a('notes'), 'den-long': _a('ideas'),
  'ban-tinh': _a('goals'), 'tui-gam': _a('milestone'), 'rut-tham': _a('event'), 'chiem-tinh': _a('important'),
  'thoi-quen': _a('growth'), 'chi-tieu': _a('shopping'), 'giao-dien': _a('inspiration'), 'lua': _a('energy'),
  'nuoc': _a('hydrate'), 'sach': _a('journal'), 'chay': _a('exercise'), 'trang': _a('rest'), 'tra': _a('focus'),
  'chuong': _a('reminder'), 'png': _a('memories'),
  // thêm cho mục Thói quen
  'pomodoro': _a('pomodoro'), 'healthy': _a('healthy'), 'breathe': _a('breathe'), 'selflove': _a('selflove'),
  'deepwork': _a('deepwork'), 'break': _a('break'), 'time': _a('time'), 'messages': _a('messages'),
  'travel': _a('travel'), 'gratitude': _a('gratitude'), 'celebrate': _a('celebrate'), 'refresh': _a('refresh'),
  'mindset': _a('mindset'), 'work': _a('work'), 'plan': _a('plan'), 'ideas': _a('ideas'), 'youtime': _a('youtime'),
  'priorities': _a('priorities'), 'goals': _a('goals'), 'todo': _a('todo'), 'journal': _a('journal'), 'quy': _a('celebrate'), 'ky-niem': _a('memories'), 'tong-ket': _a('notes'), 'muc-tieu': _a('goals'), 'style': _a('youtime'), 'study': _a('study'), 'notes': _a('notes'),
});
