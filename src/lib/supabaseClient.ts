import { createClient } from '@supabase/supabase-js';

// Fallback to provided credentials if env is not yet reloaded by dev server
export const SUPABASE_URL = 
  (import.meta.env.VITE_SUPABASE_URL as string) || 'https://ntarkbkbngwpapohtlel.supabase.co';

export const SUPABASE_ANON_KEY = 
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || 'sb_publishable_f0ByXc_IVJXGtp6VELDsVg_z2qjM9dL';

const safeFetch = (input: RequestInfo | URL, init?: RequestInit) => {
  return window.fetch(input, init);
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  },
  global: {
    fetch: safeFetch
  }
});

// Helper to test connectivity
export async function testSupabaseConnection(): Promise<{ success: boolean; message: string; latency?: number }> {
  const startTime = Date.now();
  try {
    // Attempt a light query
    const { error } = await supabase.from('classes').select('id').limit(1);
    const latency = Date.now() - startTime;
    
    if (error) {
      // If table doesn't exist (code 42P01 in postgres or PGRST204/PGRST116), connection succeeded but table needs creation
      if (error.code === '42P01' || error.message?.includes('relation') || error.message?.includes('not find the table') || error.code === 'PGRST205') {
        return {
          success: true,
          message: 'Kết nối Supabase thành công! (Lưu ý: Bảng dữ liệu chưa được tạo trong CSDL, vui lòng chạy đoạn mã SQL khởi tạo bên dưới).',
          latency
        };
      }
      return {
        success: false,
        message: `Lỗi kết nối Supabase: ${error.message} (Mã: ${error.code || 'N/A'})`,
        latency
      };
    }
    return {
      success: true,
      message: `Kết nối máy chủ Supabase thành công tuyệt vời! (Độ trễ: ${latency}ms)`,
      latency
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Không thể kết nối đến Supabase: ${err.message || String(err)}`
    };
  }
}

// SQL Script for user to run in Supabase SQL Editor
export const SUPABASE_INIT_SQL = `-- ========================================================
-- KỊCH BẢN KHỞI TẠO CƠ SỞ DỮ LIỆU SUPABASE
-- Hệ thống Quản lý thi đua nề nếp Trường PTDTBT TH&THCS Quản Bạ
-- Hướng dẫn: Mở Supabase -> Chọn dự án -> Vào mục "SQL Editor" -> Dán toàn bộ mã này -> Nhấn "Run"
-- ========================================================

-- 1. BẢNG LỚP HỌC (classes)
CREATE TABLE IF NOT EXISTS public.classes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  grade INTEGER NOT NULL,
  "homeroomTeacher" TEXT NOT NULL,
  "totalStudents" INTEGER NOT NULL DEFAULT 30,
  "roomNumber" TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. BẢNG TUẦN HỌC (school_weeks)
CREATE TABLE IF NOT EXISTS public.school_weeks (
  id TEXT PRIMARY KEY,
  number INTEGER NOT NULL,
  name TEXT NOT NULL,
  "startDate" TEXT NOT NULL,
  "endDate" TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'scoring',
  "academicYear" TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. BẢNG ĐỘI CỜ ĐỎ / SAO ĐỎ (red_flags)
CREATE TABLE IF NOT EXISTS public.red_flags (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  "fullName" TEXT NOT NULL,
  "classId" TEXT NOT NULL,
  username TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  "academicYear" TEXT NOT NULL,
  phone TEXT,
  "dutyGroup" TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. BẢNG DANH MỤC TIÊU CHÍ VI PHẠM (criteria)
CREATE TABLE IF NOT EXISTS public.criteria (
  id TEXT PRIMARY KEY,
  "group" TEXT NOT NULL,
  name TEXT NOT NULL,
  points NUMERIC NOT NULL,
  type TEXT NOT NULL DEFAULT 'minus',
  status TEXT NOT NULL DEFAULT 'active',
  "applicableGrades" TEXT NOT NULL DEFAULT 'Tất cả',
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. BẢNG PHÂN CÔNG CHẤM TRỰC (assignments)
CREATE TABLE IF NOT EXISTS public.assignments (
  id TEXT PRIMARY KEY,
  "weekId" TEXT NOT NULL,
  "redFlagId" TEXT NOT NULL,
  "redFlagName" TEXT NOT NULL,
  "targetClassId" TEXT NOT NULL,
  "dayOfWeek" TEXT NOT NULL,
  date TEXT NOT NULL,
  area TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. BẢNG PHIẾU CHẤM ĐIỂM NỀ NẾP (submissions)
CREATE TABLE IF NOT EXISTS public.submissions (
  id TEXT PRIMARY KEY,
  "assignmentId" TEXT,
  "weekId" TEXT NOT NULL,
  "classId" TEXT NOT NULL,
  "redFlagId" TEXT NOT NULL,
  "redFlagName" TEXT NOT NULL,
  date TEXT NOT NULL,
  "dayLabel" TEXT NOT NULL,
  area TEXT NOT NULL,
  content TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending',
  "submittedAt" TEXT NOT NULL,
  "approvedAt" TEXT,
  "approvedBy" TEXT,
  "rejectionReason" TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. BẢNG NGƯỜI DÙNG & TÀI KHOẢN (users)
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  password TEXT,
  role TEXT NOT NULL,
  avatar TEXT,
  "assignedClass" TEXT,
  "roleTitle" TEXT,
  phone TEXT,
  email TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  "createdAt" TEXT,
  "academicYear" TEXT,
  permissions JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. BẢNG CÀI ĐẶT HỆ THỐNG (school_settings)
CREATE TABLE IF NOT EXISTS public.school_settings (
  id TEXT PRIMARY KEY DEFAULT 'config_primary',
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 9. BẢNG BIÊN BẢN TỔNG KẾT TUẦN (weekly_minutes)
CREATE TABLE IF NOT EXISTS public.weekly_minutes (
  id TEXT PRIMARY KEY,
  "weekId" TEXT NOT NULL,
  "weekName" TEXT NOT NULL,
  "dateRange" TEXT NOT NULL,
  advantages TEXT,
  drawbacks TEXT,
  "generalComments" TEXT,
  recommendations TEXT,
  "preparedBy" TEXT,
  "approvedBy" TEXT,
  "dateCreated" TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 10. BẢNG NHẬT KÝ HỆ THỐNG (audit_logs)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id TEXT PRIMARY KEY,
  timestamp TEXT NOT NULL,
  "userName" TEXT NOT NULL,
  "userRole" TEXT NOT NULL,
  action TEXT NOT NULL,
  details TEXT NOT NULL,
  target TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 11. BẬT QUYỀN TRUY CẬP CÔNG KHAI (RLS Policies cho phép Anon Key truy vấn)
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_weeks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.red_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.criteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_minutes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Tạo chính sách cho phép đọc/ghi toàn quyền với Anon Key
DO $$ 
DECLARE
  t text;
BEGIN
  FOR t IN 
    SELECT tablename FROM pg_tables WHERE schemaname = 'public' 
    AND tablename IN ('classes', 'school_weeks', 'red_flags', 'criteria', 'assignments', 'submissions', 'users', 'school_settings', 'weekly_minutes', 'audit_logs')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Allow anon full access" ON public.%I', t);
    EXECUTE format('CREATE POLICY "Allow anon full access" ON public.%I FOR ALL TO anon USING (true) WITH CHECK (true)', t);
  END LOOP;
END $$;
`;
