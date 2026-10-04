import { createClient } from '@supabase/supabase-js';
import {
  INITIAL_USERS,
  INITIAL_CLASSES,
  INITIAL_WEEKS,
  INITIAL_RED_FLAGS,
  INITIAL_CRITERIA,
  INITIAL_ASSIGNMENTS,
  INITIAL_SUBMISSIONS,
  INITIAL_SETTINGS,
  INITIAL_MINUTES,
  INITIAL_AUDIT_LOGS
} from '../src/data/initialData';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://ntarkbkbngwpapohtlel.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_f0ByXc_IVJXGtp6VELDsVg_z2qjM9dL';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function runSeed() {
  console.log('--- ĐANG BẮT ĐẦU ĐỒNG BỘ DỮ LIỆU LÊN SUPABASE ---');

  // 1. Classes
  console.log(`Đang tải ${INITIAL_CLASSES.length} Lớp học...`);
  const { error: errClasses } = await supabase.from('classes').upsert(INITIAL_CLASSES);
  if (errClasses) console.error('Lỗi classes:', errClasses.message);
  else console.log('✓ Lớp học OK');

  // 2. Weeks
  console.log(`Đang tải ${INITIAL_WEEKS.length} Tuần học...`);
  const { error: errWeeks } = await supabase.from('school_weeks').upsert(INITIAL_WEEKS);
  if (errWeeks) console.error('Lỗi school_weeks:', errWeeks.message);
  else console.log('✓ Tuần học OK');

  // 3. Red flags
  console.log(`Đang tải ${INITIAL_RED_FLAGS.length} Cờ đỏ...`);
  const { error: errRedFlags } = await supabase.from('red_flags').upsert(INITIAL_RED_FLAGS);
  if (errRedFlags) console.error('Lỗi red_flags:', errRedFlags.message);
  else console.log('✓ Cờ đỏ OK');

  // 4. Criteria
  console.log(`Đang tải ${INITIAL_CRITERIA.length} Tiêu chí vi phạm...`);
  const { error: errCriteria } = await supabase.from('criteria').upsert(INITIAL_CRITERIA);
  if (errCriteria) console.error('Lỗi criteria:', errCriteria.message);
  else console.log('✓ Tiêu chí OK');

  // 5. Assignments
  console.log(`Đang tải ${INITIAL_ASSIGNMENTS.length} Phân công trực...`);
  const { error: errAssignments } = await supabase.from('assignments').upsert(INITIAL_ASSIGNMENTS);
  if (errAssignments) console.error('Lỗi assignments:', errAssignments.message);
  else console.log('✓ Phân công OK');

  // 6. Submissions
  console.log(`Đang tải ${INITIAL_SUBMISSIONS.length} Phiếu chấm điểm...`);
  const { error: errSubmissions } = await supabase.from('submissions').upsert(INITIAL_SUBMISSIONS);
  if (errSubmissions) console.error('Lỗi submissions:', errSubmissions.message);
  else console.log('✓ Phiếu chấm điểm OK');

  // 7. Users
  console.log(`Đang tải ${INITIAL_USERS.length} Tài khoản đăng nhập...`);
  const { error: errUsers } = await supabase.from('users').upsert(INITIAL_USERS);
  if (errUsers) console.error('Lỗi users:', errUsers.message);
  else console.log('✓ Tài khoản người dùng OK');

  // 8. Settings
  console.log('Đang tải Cài đặt hệ thống...');
  const { error: errSettings } = await supabase.from('school_settings').upsert({
    id: 'config_primary',
    data: INITIAL_SETTINGS
  });
  if (errSettings) console.error('Lỗi school_settings:', errSettings.message);
  else console.log('✓ Cài đặt hệ thống OK');

  // 9. Minutes
  console.log('Đang tải Biên bản tuần...');
  const { error: errMinutes } = await supabase.from('weekly_minutes').upsert({
    id: INITIAL_MINUTES.weekId || 'current_minutes',
    ...INITIAL_MINUTES
  });
  if (errMinutes) console.error('Lỗi weekly_minutes:', errMinutes.message);
  else console.log('✓ Biên bản OK');

  // 10. Audit logs
  console.log(`Đang tải ${INITIAL_AUDIT_LOGS.length} Nhật ký...`);
  const { error: errLogs } = await supabase.from('audit_logs').upsert(INITIAL_AUDIT_LOGS.slice(0, 30));
  if (errLogs) console.error('Lỗi audit_logs:', errLogs.message);
  else console.log('✓ Nhật ký OK');

  console.log('--- HOÀN TẤT ĐỒNG BỘ TOÀN BỘ DỮ LIỆU LÊN SUPABASE ---');
}

runSeed();
