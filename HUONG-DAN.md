# Sổ quản lý lớp học Guangyu Hanyu — Hướng dẫn cài đặt

## Cách 1: Xem thử ngay, chưa cần cài gì

1. Giải nén file zip.
2. Đưa cả thư mục lên GitHub Pages: tạo repo mới (ví dụ `quanly`), kéo thả **toàn bộ** các file vào, rồi bật Pages.
3. Mở link, bấm **"Dùng thử trên máy này"**.
4. Vào **Cài đặt → nạp vào web** để nạp dữ liệu Excel 2026 đã chuyển sẵn.

Ở chế độ dùng thử, dữ liệu chỉ lưu trên Safari của máy đó. Khi dùng thật, Thầy làm theo Cách 2.

> Lưu ý: nếu mở trực tiếp file `index.html` trên máy (không qua link web), phần xem trước PNG sẽ không chạy. Thầy cần mở qua GitHub Pages.

## Cách 2: Dùng thật, lưu online (Supabase miễn phí)

### Bước 1. Tạo database (khoảng 5 phút)
1. Vào https://supabase.com, đăng nhập bằng GitHub, bấm **New project**.
   - Tên: `guangyu`
   - Region: **Southeast Asia (Singapore)**
   - Đặt mật khẩu database và cất mật khẩu đó lại.
2. Mở **SQL Editor → New query**. Dán toàn bộ file `supabase/1-tao-database.sql` rồi bấm **Run**. Khi thấy "Success" là xong.
3. Vào **Authentication → Users → Add user → Create new user**. Nhập email và mật khẩu Thầy muốn dùng để đăng nhập web, nhớ tick **Auto Confirm User**.
4. Vào **Authentication → Sign In / Providers**, tắt **Allow new users to sign up**. Như vậy chỉ mình Thầy đăng nhập được.

### Bước 2. Kết nối web
1. Trong Supabase, vào **Project Settings → API** và copy 2 thông tin: **Project URL** và **anon public key**.
2. Mở web, dán 2 thông tin đó vào màn hình đầu tiên, rồi đăng nhập bằng email vừa tạo.
3. Vào **Cài đặt → nạp vào web** để đưa dữ liệu Excel 2026 lên.

Nếu trước đó Thầy đã dùng thử và nhập dữ liệu, hãy **Tải bản sao lưu** ở chế độ dùng thử trước, rồi **Khôi phục từ file** sau khi đã kết nối Supabase.

### Bước 3. Lịch Apple (iPhone / MacBook)
1. Trong Supabase, vào **Edge Functions → Deploy a new function → Via Editor**.
2. Đặt tên hàm là `lich-apple`, dán toàn bộ file `supabase/2-lich-apple-edge-function.ts`, rồi bấm **Deploy**.
3. Mở hàm vừa tạo → **Settings**, tắt **Enforce JWT verification** và lưu lại.
4. Trên web, vào **Cài đặt → Tạo link lịch Apple → Mở trong Lịch Apple**. Bấm **Đăng ký** (Subscribe), chọn **Tự động làm mới: Mỗi giờ** và đồng bộ qua iCloud để iPhone cũng có lịch.
5. Mỗi buổi học sẽ được nhắc trước 15 phút. Lịch chỉ đồng bộ một chiều, từ web sang ứng dụng Lịch.

## Cách dùng hằng ngày

| Việc | Làm ở đâu |
|---|---|
| Đặt lịch dạy | **Lịch dạy**: bấm vào ô trống, hoặc nhấn phím `N`. Ô "Lặp lại hằng tuần" giúp đặt nhiều tuần cùng lúc. |
| Đổi giờ | Kéo thả buổi học sang ô khác. Nếu trùng giờ, web sẽ hỏi lại. |
| Dạy xong | Bấm vào buổi → **Đã dạy** → gõ nội dung bài. Web tự trừ buổi và cộng doanh thu. |
| Học viên nghỉ | Bấm vào buổi → **Nghỉ**. Buổi đó không trừ, không tính phí. |
| Gia hạn | Trang lớp → **Gia hạn / khoá mới**. Buổi còn dư sẽ tự chuyển sang khoá sau. |
| Học viên chuyển khoản | **Ghi thanh toán** |
| Gửi báo cáo | **PNG**, chọn Tiếng Việt hoặc 中文 → **Tải ảnh** hoặc **Sao chép ảnh**, rồi dán vào Zalo bằng ⌘V |
| Sao lưu | **Cài đặt → Tải bản sao lưu**. Nên làm mỗi tháng và cất vào Google Drive. |

Mã học viên (HV0001), mã lớp (L0001), mã khoá (K0001), mã buổi (B00001) và mã giao dịch (GD0001) đều do web tự tạo.

## Dữ liệu chuyển từ Excel — 14 khoá cần Thầy kiểm tra

Excel chỉ ghi số ngày (13, 17, 20…), nên web đã tự suy ra tháng dựa vào ngày kết thúc của khoá trước. Các khoá dưới đây có dấu ⚠ trong web. Thầy mở từng khoá, bấm vào buổi để sửa ngày nếu sai.

| Sheet | Lớp | Excel ghi | Web suy ra | Lý do cần xem |
|---|---|---|---|---|
| 1-26 | Thuỷ | 2,8,12,15,31,5,24,3 | 02/01 → 03/03 | 8 buổi kéo dài 60 ngày |
| 2-26 | Đăng | 7,6,18,21,27,28,8,10,31,12,19,26,28 | 07/01 → 28/04 | 13 buổi kéo dài 111 ngày |
| 3-26 | Bảo Hi | 5,7,2,9,16,22,23,15 | 05/03 → 15/05 | 71 ngày |
| 3-26 | Thuỷ | 10,19,7,14,21,26,6,9 | 10/03 → 09/05 | 60 ngày |
| 3-26 | GTCB(UD) | 17,24,26,2,7,14,21,23,7,26,4,9 | 17/03 → 09/06 | 84 ngày |
| 4-26 | GTCB3 (PL) | 14,21,5,19,31,2,17,27 | 14/04 → 27/06 | 74 ngày |
| 4-26 | HSK2 | 22,6,23,27,30,9,11,14 | 22/04 → 14/06 | 53 ngày |
| 5-26 | Chị Thảo | 7,16,21,30,4,13,21,27,2,11,18,1 | 07/05 → 01/08 | 86 ngày |
| 5-26 | GTCB2 (GN) | 23.11 | 23/05, 11/06 | Excel tự đổi "23,11" thành số |
| 6-26 | Chị Giang | 21,25,5,9,6,3 | 21/06 → 03/09 | 74 ngày |
| 7-26 | GTCB3 (PL) | 8,22,29,19,26,16,30 | 08/07 → 30/09 | 84 ngày |
| 8-26 | Chị Thảo | 8,15,29,6,13,20,27,4,11,18,25,1,15 | 08/08 → 15/11 | 99 ngày |
| 9-26 | HSK2 | 8(15),12(15),29(15),3,6(15)… | 08/08 → 03/10 | Chưa rõ "(15)" nghĩa là gì |
| 11-26 | HSK3 | 7.17 | 07/11, 17/11 | Excel tự đổi "7,17" thành số |

Một số quy ước khác khi chuyển dữ liệu:
- **Ngày thu tiền:** ghi theo buổi học đầu tiên của khoá, vì Excel không có ngày nhận tiền.
- **Thời lượng mặc định:** 90 phút. Riêng những lớp ghi "1h" hoặc "2h" trong Excel thì theo ghi chú đó.
- **Lớp nhóm** (HSK2, HSK3, GTCB…): chưa có danh sách học viên. Thầy thêm ở **Sửa lớp**.
- **Lớp tạm dừng:** lớp không học từ tháng 10/2026 được xếp vào "Tạm dừng / bảo lưu". Số buổi còn lại vẫn được giữ.
- **Trình độ lớp 1-1:** Excel không ghi, nên ô "Trình độ" trên PNG đang trống. Thầy điền ở **Sửa lớp**.
