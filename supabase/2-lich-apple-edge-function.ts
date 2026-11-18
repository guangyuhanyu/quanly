// =====================================================================
//  GUANGYU HANYU — Edge Function "lich-apple"
//  Trả về lịch dạy dạng .ics để ứng dụng Lịch (iPhone/MacBook) đăng ký.
//  Cài: Supabase → Edge Functions → Deploy a new function → Via Editor
//       Tên hàm: lich-apple  → dán toàn bộ file này → Deploy
//       Sau đó vào Settings của hàm, TẮT "Verify JWT" (Enforce JWT verification).
// =====================================================================
import { createClient } from "npm:@supabase/supabase-js@2";

// Lấy khoá bí mật do Supabase tự cấp cho Edge Function (hỗ trợ cả khoá mới sb_secret_ lẫn khoá cũ)
function khoaBiMat(): string {
  const cu = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const moi = Deno.env.get("SUPABASE_SECRET_KEYS");
  if (moi) { try { const o = JSON.parse(moi); return o.default ?? Object.values(o)[0] as string; } catch { return moi; } }
  return cu!;
}
const db = createClient(Deno.env.get("SUPABASE_URL")!, khoaBiMat());

const pad = (n: number) => String(n).padStart(2, "0");
const thoat = (s: string) => String(s ?? "").replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/[,;]/g, (m) => "\\" + m);
// giờ Việt Nam (UTC+7, không đổi giờ mùa hè) → UTC
function utc(ngay: string, phut: number) {
  const [y, m, d] = ngay.split("-").map(Number);
  const t = new Date(Date.UTC(y, m - 1, d, 0, phut - 7 * 60));
  return t.toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";
}

Deno.serve(async (req) => {
  const token = new URL(req.url).searchParams.get("token");
  const { data: cai, error: loi } = await db.from("cai_dat").select("gia_tri").eq("khoa", "ics_token").maybeSingle();
  if (loi) return new Response("Lỗi đọc dữ liệu: " + loi.message + " (chạy file supabase/5-cap-quyen.sql)", { status: 500 });
  if (!token || !cai || String(cai.gia_tri) !== token) return new Response("Sai mã lịch", { status: 403 });

  const tu = new Date(Date.now() - 45 * 864e5).toISOString().slice(0, 10);
  const [{ data: buoi }, { data: lop }] = await Promise.all([
    db.from("buoi_hoc").select("id,lop_id,ngay,gio_bat_dau,thoi_luong_phut,trang_thai,noi_dung,ghi_chu")
      .gte("ngay", tu).in("trang_thai", ["du_kien", "da_day"]).not("gio_bat_dau", "is", null),
    db.from("lop").select("id,ten"),
  ]);
  const tenLop = new Map((lop ?? []).map((l) => [l.id, l.ten]));
  const now = new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";
  const out = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Guangyu Hanyu//Lich day//VI", "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
    "X-WR-CALNAME:Lịch dạy Guangyu", "X-WR-TIMEZONE:Asia/Ho_Chi_Minh", "REFRESH-INTERVAL;VALUE=DURATION:PT1H", "X-PUBLISHED-TTL:PT1H",
  ];
  for (const b of buoi ?? []) {
    const [h, m] = String(b.gio_bat_dau).split(":").map(Number);
    const s = h * 60 + m;
    out.push(
      "BEGIN:VEVENT", `UID:buoi-${b.id}@guangyu`, `DTSTAMP:${now}`,
      `DTSTART:${utc(b.ngay, s)}`, `DTEND:${utc(b.ngay, s + (b.thoi_luong_phut || 90))}`,
      `SUMMARY:${thoat("📚 " + (tenLop.get(b.lop_id) ?? "Lớp") + (b.trang_thai === "da_day" ? " ✓" : ""))}`,
      `DESCRIPTION:${thoat([b.noi_dung, b.ghi_chu].filter(Boolean).join("\n"))}`,
      "BEGIN:VALARM", "TRIGGER:-PT15M", "ACTION:DISPLAY", "DESCRIPTION:Sắp đến giờ dạy", "END:VALARM",
      "END:VEVENT",
    );
  }
  out.push("END:VCALENDAR");
  return new Response(out.join("\r\n"), {
    headers: { "Content-Type": "text/calendar; charset=utf-8", "Cache-Control": "no-cache" },
  });
});
