-- GUANGYU HANYU — CẤP QUYỀN (cần cho project Supabase tạo từ cuối 2025 trở đi)
-- Lỗi "permission denied for table ..." → chạy file này 1 lần.
grant usage on schema public to authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant usage, select on all sequences in schema public to authenticated;
grant execute on all functions in schema public to authenticated;
alter default privileges in schema public grant select, insert, update, delete on tables to authenticated;
alter default privileges in schema public grant usage, select on sequences to authenticated;
