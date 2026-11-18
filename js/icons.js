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
  'trai': _i('<path d="M14.5 5.5 8 12l6.5 6.5"/>'),
  'phai': _i('<path d="M9.5 5.5 16 12l-6.5 6.5"/>'),
  'cong': _i('<path d="M12 5v14M5 12h14"/>'),
  'loc': _i('<path d="M4 5h16l-6 7.5V19l-4-2v-4.5z"/>'),
  'png': _i('<rect x="3.5" y="4" width="17" height="16" rx="2"/><circle cx="9" cy="9.5" r="1.8"/><path d="M3.5 17l5-4.5 3.5 3 3-2.5 5.5 4.5"/>'),
  'chuong': _i('<path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 1.5h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0M12 3v2"/>'),
};
