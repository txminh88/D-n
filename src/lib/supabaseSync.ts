import { supabase } from './supabaseClient';
import {
  ClassInfo,
  SchoolWeek,
  RedFlagMember,
  ViolationCriteria,
  DutyAssignment,
  ScoreSubmission,
  User,
  SchoolSettings,
  WeeklyMinutesReport,
  AuditLog
} from '../types';

export interface SupabaseSyncResult {
  success: boolean;
  message: string;
  counts?: { [key: string]: number };
}

/**
 * Upload all current application data to Supabase database
 */
export async function uploadAllToSupabase(data: {
  classes: ClassInfo[];
  weeks: SchoolWeek[];
  redFlags: RedFlagMember[];
  criteria: ViolationCriteria[];
  assignments: DutyAssignment[];
  submissions: ScoreSubmission[];
  users: User[];
  settings: SchoolSettings;
  minutes: WeeklyMinutesReport;
  auditLogs?: AuditLog[];
}): Promise<SupabaseSyncResult> {
  try {
    const counts: { [key: string]: number } = {};

    // 1. Classes
    if (data.classes.length > 0) {
      const { error } = await supabase.from('classes').upsert(data.classes);
      if (error) throw new Error(`Lỗi đồng bộ Lớp học: ${error.message}`);
      counts['Lớp học'] = data.classes.length;
    }

    // 2. School Weeks
    if (data.weeks.length > 0) {
      const { error } = await supabase.from('school_weeks').upsert(data.weeks);
      if (error) throw new Error(`Lỗi đồng bộ Tuần học: ${error.message}`);
      counts['Tuần học'] = data.weeks.length;
    }

    // 3. Red Flags
    if (data.redFlags.length > 0) {
      const { error } = await supabase.from('red_flags').upsert(data.redFlags);
      if (error) throw new Error(`Lỗi đồng bộ Đội cờ đỏ: ${error.message}`);
      counts['Đội cờ đỏ'] = data.redFlags.length;
    }

    // 4. Criteria
    if (data.criteria.length > 0) {
      const { error } = await supabase.from('criteria').upsert(data.criteria);
      if (error) throw new Error(`Lỗi đồng bộ Tiêu chí vi phạm: ${error.message}`);
      counts['Tiêu chí'] = data.criteria.length;
    }

    // 5. Assignments
    if (data.assignments.length > 0) {
      const { error } = await supabase.from('assignments').upsert(data.assignments);
      if (error) throw new Error(`Lỗi đồng bộ Phân công: ${error.message}`);
      counts['Phân công trực'] = data.assignments.length;
    }

    // 6. Submissions
    if (data.submissions.length > 0) {
      const { error } = await supabase.from('submissions').upsert(data.submissions);
      if (error) throw new Error(`Lỗi đồng bộ Phiếu chấm: ${error.message}`);
      counts['Phiếu chấm điểm'] = data.submissions.length;
    }

    // 7. Users
    if (data.users.length > 0) {
      const { error } = await supabase.from('users').upsert(data.users);
      if (error) throw new Error(`Lỗi đồng bộ Người dùng: ${error.message}`);
      counts['Tài khoản'] = data.users.length;
    }

    // 8. Settings
    if (data.settings) {
      const { error } = await supabase.from('school_settings').upsert({
        id: 'config_primary',
        data: data.settings
      });
      if (error) throw new Error(`Lỗi đồng bộ Cài đặt: ${error.message}`);
      counts['Cài đặt'] = 1;
    }

    // 9. Minutes
    if (data.minutes) {
      const { error } = await supabase.from('weekly_minutes').upsert({
        id: data.minutes.weekId || 'current_minutes',
        ...data.minutes
      });
      if (error) throw new Error(`Lỗi đồng bộ Biên bản: ${error.message}`);
      counts['Biên bản'] = 1;
    }

    // 10. Audit Logs
    if (data.auditLogs && data.auditLogs.length > 0) {
      const { error } = await supabase.from('audit_logs').upsert(data.auditLogs.slice(0, 30));
      if (!error) counts['Nhật ký'] = Math.min(data.auditLogs.length, 30);
    }

    return {
      success: true,
      message: 'Đã tải toàn bộ dữ liệu lên máy chủ Supabase thành công!',
      counts
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || String(err)
    };
  }
}

/**
 * Fetch all data from Supabase
 */
export async function fetchAllFromSupabase(): Promise<{
  success: boolean;
  data?: {
    classes?: ClassInfo[];
    weeks?: SchoolWeek[];
    redFlags?: RedFlagMember[];
    criteria?: ViolationCriteria[];
    assignments?: DutyAssignment[];
    submissions?: ScoreSubmission[];
    users?: User[];
    settings?: SchoolSettings;
    minutes?: WeeklyMinutesReport;
    auditLogs?: AuditLog[];
  };
  message: string;
}> {
  try {
    const results: any = {};

    const [
      resClasses,
      resWeeks,
      resRedFlags,
      resCriteria,
      resAssignments,
      resSubmissions,
      resUsers,
      resSettings,
      resMinutes,
      resAuditLogs
    ] = await Promise.allSettled([
      supabase.from('classes').select('*'),
      supabase.from('school_weeks').select('*'),
      supabase.from('red_flags').select('*'),
      supabase.from('criteria').select('*'),
      supabase.from('assignments').select('*'),
      supabase.from('submissions').select('*'),
      supabase.from('users').select('*'),
      supabase.from('school_settings').select('*').limit(1),
      supabase.from('weekly_minutes').select('*').limit(1),
      supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(30)
    ]);

    if (resClasses.status === 'fulfilled' && !resClasses.value.error && resClasses.value.data?.length) {
      results.classes = resClasses.value.data;
    }
    if (resWeeks.status === 'fulfilled' && !resWeeks.value.error && resWeeks.value.data?.length) {
      results.weeks = resWeeks.value.data;
    }
    if (resRedFlags.status === 'fulfilled' && !resRedFlags.value.error && resRedFlags.value.data?.length) {
      results.redFlags = resRedFlags.value.data;
    }
    if (resCriteria.status === 'fulfilled' && !resCriteria.value.error && resCriteria.value.data?.length) {
      results.criteria = resCriteria.value.data;
    }
    if (resAssignments.status === 'fulfilled' && !resAssignments.value.error && resAssignments.value.data?.length) {
      results.assignments = resAssignments.value.data;
    }
    if (resSubmissions.status === 'fulfilled' && !resSubmissions.value.error && resSubmissions.value.data?.length) {
      results.submissions = resSubmissions.value.data;
    }
    if (resUsers.status === 'fulfilled' && !resUsers.value.error && resUsers.value.data?.length) {
      results.users = resUsers.value.data;
    }
    if (resSettings.status === 'fulfilled' && !resSettings.value.error && resSettings.value.data?.[0]?.data) {
      results.settings = resSettings.value.data[0].data;
    }
    if (resMinutes.status === 'fulfilled' && !resMinutes.value.error && resMinutes.value.data?.[0]) {
      results.minutes = resMinutes.value.data[0];
    }
    if (resAuditLogs.status === 'fulfilled' && !resAuditLogs.value.error && resAuditLogs.value.data?.length) {
      results.auditLogs = resAuditLogs.value.data;
    }

    const loadedKeys = Object.keys(results);
    if (loadedKeys.length === 0) {
      return {
        success: false,
        message: 'Các bảng trên Supabase chưa có bản ghi nào hoặc chưa được tạo bảng. Vui lòng nhấn "Đẩy dữ liệu hiện tại lên Supabase" hoặc chạy đoạn mã SQL.'
      };
    }

    return {
      success: true,
      data: results,
      message: `Đã nạp thành công ${loadedKeys.length} danh mục dữ liệu từ Supabase!`
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Lỗi tải dữ liệu từ Supabase: ${err.message || String(err)}`
    };
  }
}
