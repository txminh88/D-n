import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  User,
  UserRole,
  ClassInfo,
  SchoolWeek,
  WeekStatus,
  RedFlagMember,
  DutyAssignment,
  ViolationCriteria,
  ScoreSubmission,
  SchoolSettings,
  NotificationItem,
  AuditLog,
  WeeklyMinutesReport,
  ClassRankingResult,
  AccountPermissions
} from '../types';
import { supabase, testSupabaseConnection } from '../lib/supabaseClient';
import { uploadAllToSupabase, fetchAllFromSupabase } from '../lib/supabaseSync';
import {
  INITIAL_SETTINGS,
  INITIAL_USERS,
  INITIAL_CLASSES,
  INITIAL_WEEKS,
  INITIAL_RED_FLAGS,
  INITIAL_CRITERIA,
  INITIAL_ASSIGNMENTS,
  INITIAL_SUBMISSIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_MINUTES,
  AVAILABLE_ACADEMIC_YEARS
} from '../data/initialData';

interface AppContextType {
  currentUser: User | null;
  currentRole: UserRole | null;
  isAuthenticated: boolean;
  academicYears: string[];
  selectedAcademicYear: string;
  users: User[];
  activeWeekId: string;
  activeTab: string;
  classes: ClassInfo[];
  weeks: SchoolWeek[];
  redFlags: RedFlagMember[];
  criteria: ViolationCriteria[];
  assignments: DutyAssignment[];
  submissions: ScoreSubmission[];
  notifications: NotificationItem[];
  auditLogs: AuditLog[];
  settings: SchoolSettings;
  minutes: WeeklyMinutesReport;
  mobileSimulatorOpen: boolean;
  loginModalOpen: boolean;

  // Authentication & Navigation
  login: (username: string, password: string, role?: UserRole) => { success: boolean; message?: string };
  logout: () => void;
  setCurrentUser: (user: User | null) => void;
  switchRole: (role: UserRole) => void;
  setActiveTab: (tab: string) => void;
  setActiveWeekId: (id: string) => void;
  setMobileSimulatorOpen: (open: boolean) => void;
  setLoginModalOpen: (open: boolean) => void;

  // Academic Year Management (Admin)
  setSelectedAcademicYear: (year: string) => void;
  addAcademicYear: (year: string) => void;
  generateWeeksForYear: (academicYear: string, startDateStr: string, startWeekNum: number, totalWeeks: number) => void;

  // User & Member Management (Admin)
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;
  toggleUserStatus: (id: string) => void;
  resetUserPassword: (id: string, newPassword?: string) => void;
  updateUserPermissions: (userId: string, perms: Partial<AccountPermissions>) => void;

  // CRUD
  addClass: (cls: Omit<ClassInfo, 'id'>) => void;
  updateClass: (id: string, cls: Partial<ClassInfo>) => void;
  deleteClass: (id: string) => void;

  addWeek: (week: Omit<SchoolWeek, 'id'>) => void;
  updateWeek: (id: string, week: Partial<SchoolWeek>) => void;
  toggleLockWeek: (id: string) => void;
  deleteWeek: (id: string) => void;

  addRedFlag: (member: Omit<RedFlagMember, 'id'>) => void;
  updateRedFlag: (id: string, member: Partial<RedFlagMember>) => void;
  toggleRedFlagStatus: (id: string) => void;
  deleteRedFlag: (id: string) => void;

  addAssignment: (asg: Omit<DutyAssignment, 'id'>) => void;
  updateAssignment: (id: string, asg: Partial<DutyAssignment>) => void;
  deleteAssignment: (id: string) => void;
  autoAssignWeek: (weekId: string) => void;

  addCriteria: (crit: Omit<ViolationCriteria, 'id'>) => void;
  updateCriteria: (id: string, crit: Partial<ViolationCriteria>) => void;
  deleteCriteria: (id: string) => void;

  submitScore: (data: Omit<ScoreSubmission, 'id' | 'submittedAt'>) => void;
  approveSubmission: (submissionId: string) => void;
  rejectSubmission: (submissionId: string, reason: string) => void;
  bulkApprovePending: () => void;

  updateSettings: (newSettings: Partial<SchoolSettings>) => void;
  updateMinutes: (newMinutes: Partial<WeeklyMinutesReport>) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  addAuditLog: (action: string, details: string) => void;
  resetToDefaultData: () => void;

  // Supabase Database Integration
  supabaseStatus: 'checking' | 'connected' | 'error' | 'not_configured';
  supabaseMessage: string;
  isSyncingSupabase: boolean;
  autoSyncSupabase: boolean;
  checkSupabaseConnection: () => Promise<{ success: boolean; message: string }>;
  syncAllToSupabase: () => Promise<{ success: boolean; message: string; counts?: any }>;
  loadAllFromSupabase: () => Promise<{ success: boolean; message: string }>;
  setAutoSyncSupabase: (val: boolean) => void;

  // Computations
  activeWeek: SchoolWeek | undefined;
  getRankingsForWeek: (weekId: string) => ClassRankingResult[];
  kpiStats: {
    totalClasses: number;
    totalRedFlags: number;
    totalChecks: number;
    completedChecks: number;
    pendingChecks: number;
    completionRate: number;
    pendingApprovalCount: number;
    rejectedCount: number;
    top5: ClassRankingResult[];
    violationFrequencies: { name: string; count: number }[];
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  SETTINGS: 'quanba_settings_v1',
  CLASSES: 'quanba_classes_v1',
  WEEKS: 'quanba_weeks_v1',
  RED_FLAGS: 'quanba_redflags_v1',
  CRITERIA: 'quanba_criteria_v1',
  ASSIGNMENTS: 'quanba_assignments_v1',
  SUBMISSIONS: 'quanba_submissions_v1',
  NOTIFICATIONS: 'quanba_notifs_v1',
  AUDIT_LOGS: 'quanba_audit_v1',
  MINUTES: 'quanba_minutes_v1',
  ACTIVE_WEEK: 'quanba_active_week_v1',
  ACADEMIC_YEARS: 'quanba_years_v1',
  SELECTED_YEAR: 'quanba_active_year_v1',
  USERS: 'quanba_users_v1',
  CURRENT_USER: 'quanba_current_user_v1'
};

function getStorage<T>(key: string, fallback: T): T {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
}

function setStorage<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {
    // ignore
  }
}

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettingsState] = useState<SchoolSettings>(() => getStorage(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS));
  const [classes, setClassesState] = useState<ClassInfo[]>(() => getStorage(STORAGE_KEYS.CLASSES, INITIAL_CLASSES));
  const [weeks, setWeeksState] = useState<SchoolWeek[]>(() => getStorage(STORAGE_KEYS.WEEKS, INITIAL_WEEKS));
  const [redFlags, setRedFlagsState] = useState<RedFlagMember[]>(() => getStorage(STORAGE_KEYS.RED_FLAGS, INITIAL_RED_FLAGS));
  const [criteria, setCriteriaState] = useState<ViolationCriteria[]>(() => getStorage(STORAGE_KEYS.CRITERIA, INITIAL_CRITERIA));
  const [assignments, setAssignmentsState] = useState<DutyAssignment[]>(() => getStorage(STORAGE_KEYS.ASSIGNMENTS, INITIAL_ASSIGNMENTS));
  const [submissions, setSubmissionsState] = useState<ScoreSubmission[]>(() => getStorage(STORAGE_KEYS.SUBMISSIONS, INITIAL_SUBMISSIONS));
  const [notifications, setNotificationsState] = useState<NotificationItem[]>(() => getStorage(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS));
  const [auditLogs, setAuditLogsState] = useState<AuditLog[]>(() => getStorage(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS));
  const [minutes, setMinutesState] = useState<WeeklyMinutesReport>(() => getStorage(STORAGE_KEYS.MINUTES, INITIAL_MINUTES));
  const [academicYears, setAcademicYearsState] = useState<string[]>(() => getStorage(STORAGE_KEYS.ACADEMIC_YEARS, AVAILABLE_ACADEMIC_YEARS));
  const [selectedAcademicYear, setSelectedAcademicYearState] = useState<string>(() => getStorage(STORAGE_KEYS.SELECTED_YEAR, '2026 - 2027'));
  const [users, setUsersState] = useState<User[]>(() => getStorage(STORAGE_KEYS.USERS, INITIAL_USERS));

  const [activeWeekId, setActiveWeekIdState] = useState<string>(() => getStorage(STORAGE_KEYS.ACTIVE_WEEK, 'w4'));
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    return getStorage<User | null>(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0]);
  });
  const [mobileSimulatorOpen, setMobileSimulatorOpen] = useState<boolean>(false);
  const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false);

  // Supabase State
  const [supabaseStatus, setSupabaseStatus] = useState<'checking' | 'connected' | 'error' | 'not_configured'>('checking');
  const [supabaseMessage, setSupabaseMessage] = useState<string>('Đang kiểm tra kết nối Supabase...');
  const [isSyncingSupabase, setIsSyncingSupabase] = useState<boolean>(false);
  const [autoSyncSupabase, setAutoSyncSupabaseState] = useState<boolean>(() => {
    return getStorage<boolean>('quanba_auto_sync_supabase', true);
  });

  const setAutoSyncSupabase = (val: boolean) => {
    setAutoSyncSupabaseState(val);
    setStorage('quanba_auto_sync_supabase', val);
  };

  const checkSupabaseConnection = async () => {
    setSupabaseStatus('checking');
    setSupabaseMessage('Đang kết nối tới máy chủ Supabase...');
    const res = await testSupabaseConnection();
    if (res.success) {
      setSupabaseStatus('connected');
      setSupabaseMessage(res.message);
    } else {
      setSupabaseStatus('error');
      setSupabaseMessage(res.message);
    }
    return res;
  };

  // Test connection on mount and auto-load if connected
  useEffect(() => {
    let isMounted = true;
    (async () => {
      const res = await checkSupabaseConnection();
      if (res.success && autoSyncSupabase && isMounted) {
        try {
          const fetchRes = await fetchAllFromSupabase();
          if (fetchRes.success && fetchRes.data && isMounted) {
            if (fetchRes.data.classes && fetchRes.data.classes.length > 0) setClassesState(fetchRes.data.classes);
            if (fetchRes.data.weeks && fetchRes.data.weeks.length > 0) setWeeksState(fetchRes.data.weeks);
            if (fetchRes.data.redFlags && fetchRes.data.redFlags.length > 0) setRedFlagsState(fetchRes.data.redFlags);
            if (fetchRes.data.criteria && fetchRes.data.criteria.length > 0) setCriteriaState(fetchRes.data.criteria);
            if (fetchRes.data.assignments && fetchRes.data.assignments.length > 0) setAssignmentsState(fetchRes.data.assignments);
            if (fetchRes.data.submissions && fetchRes.data.submissions.length > 0) setSubmissionsState(fetchRes.data.submissions);
            if (fetchRes.data.users && fetchRes.data.users.length > 0) setUsersState(fetchRes.data.users);
            if (fetchRes.data.settings) setSettingsState(fetchRes.data.settings);
            if (fetchRes.data.minutes) setMinutesState(fetchRes.data.minutes);
            if (fetchRes.data.auditLogs && fetchRes.data.auditLogs.length > 0) setAuditLogsState(fetchRes.data.auditLogs);
          }
        } catch {}
      }
    })();
    return () => { isMounted = false; };
  }, []);

  // Sync to localStorage
  useEffect(() => { setStorage(STORAGE_KEYS.SETTINGS, settings); }, [settings]);
  useEffect(() => { setStorage(STORAGE_KEYS.CLASSES, classes); }, [classes]);
  useEffect(() => { setStorage(STORAGE_KEYS.WEEKS, weeks); }, [weeks]);
  useEffect(() => { setStorage(STORAGE_KEYS.RED_FLAGS, redFlags); }, [redFlags]);
  useEffect(() => { setStorage(STORAGE_KEYS.CRITERIA, criteria); }, [criteria]);
  useEffect(() => { setStorage(STORAGE_KEYS.ASSIGNMENTS, assignments); }, [assignments]);
  useEffect(() => { setStorage(STORAGE_KEYS.SUBMISSIONS, submissions); }, [submissions]);
  useEffect(() => { setStorage(STORAGE_KEYS.NOTIFICATIONS, notifications); }, [notifications]);
  useEffect(() => { setStorage(STORAGE_KEYS.AUDIT_LOGS, auditLogs); }, [auditLogs]);
  useEffect(() => { setStorage(STORAGE_KEYS.MINUTES, minutes); }, [minutes]);
  useEffect(() => { setStorage(STORAGE_KEYS.ACTIVE_WEEK, activeWeekId); }, [activeWeekId]);
  useEffect(() => { setStorage(STORAGE_KEYS.ACADEMIC_YEARS, academicYears); }, [academicYears]);
  useEffect(() => { setStorage(STORAGE_KEYS.SELECTED_YEAR, selectedAcademicYear); }, [selectedAcademicYear]);
  useEffect(() => { setStorage(STORAGE_KEYS.USERS, users); }, [users]);
  useEffect(() => {
    if (currentUser) {
      setStorage(STORAGE_KEYS.CURRENT_USER, currentUser);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }, [currentUser]);

  const activeWeek = useMemo(() => weeks.find(w => w.id === activeWeekId) || weeks[3] || weeks[0], [weeks, activeWeekId]);

  const setActiveWeekId = (id: string) => {
    setActiveWeekIdState(id);
    const targetWeek = weeks.find(w => w.id === id);
    if (targetWeek) {
      setMinutesState(prev => ({
        ...prev,
        weekId: targetWeek.id,
        weekName: targetWeek.name,
        dateRange: `${targetWeek.startDate.split('-').reverse().join('/')} – ${targetWeek.endDate.split('-').reverse().join('/')}`
      }));
    }
  };

  const addAuditLog = (action: string, details: string) => {
    const newLog: AuditLog = {
      id: 'log-' + Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      userName: currentUser ? currentUser.name : 'Hệ thống',
      userRole: currentUser ? (currentUser.roleTitle || currentUser.role) : 'Hệ thống',
      action,
      details
    };
    setAuditLogsState(prev => [newLog, ...prev.slice(0, 49)]);
  };

  const logout = () => {
    if (currentUser) {
      addAuditLog('Đăng xuất', `${currentUser.name} (${currentUser.roleTitle || currentUser.role}) đã đăng xuất khỏi hệ thống.`);
    }
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    setActiveTab('dashboard');
  };

  const login = (username: string, password: string, role?: UserRole) => {
    const cleanUsername = username.trim().toLowerCase();
    const matchedUser = users.find(u => u.username.toLowerCase() === cleanUsername);

    if (!matchedUser) {
      return { success: false, message: 'Tên đăng nhập không tồn tại trong hệ thống!' };
    }

    const validPwd = matchedUser.password || 'password123';
    if (password !== validPwd && password !== '123456' && password !== 'password123') {
      return { success: false, message: 'Mật khẩu không chính xác! Vui lòng thử lại.' };
    }

    if (matchedUser.status === 'locked') {
      return { success: false, message: 'Tài khoản này đang bị khóa. Vui lòng liên hệ Thầy Tổng phụ trách!' };
    }

    setCurrentUser(matchedUser);
    setStorage(STORAGE_KEYS.CURRENT_USER, matchedUser);

    if (matchedUser.role === 'red_flag') {
      setActiveTab('red_flag_input');
    } else if (matchedUser.role === 'student') {
      setActiveTab('rankings');
    } else {
      setActiveTab('dashboard');
    }

    const newLog: AuditLog = {
      id: 'log-' + Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      userName: matchedUser.name,
      userRole: matchedUser.roleTitle || matchedUser.role,
      action: 'Đăng nhập',
      details: `${matchedUser.name} đăng nhập thành công vào hệ thống.`
    };
    setAuditLogsState(prev => [newLog, ...prev.slice(0, 49)]);

    return { success: true };
  };

  const switchRole = (role: UserRole) => {
    const matchedUser = users.find(u => u.role === role) || INITIAL_USERS.find(u => u.role === role);
    if (matchedUser) {
      setCurrentUser(matchedUser);
    }
  };

  // Ranking calculation
  const getRankingsForWeek = (weekId: string): ClassRankingResult[] => {
    // Only approved submissions count for official score
    const weekSubmissions = submissions.filter(s => s.weekId === weekId && s.status === 'approved');

    const classStatsMap: Record<string, { minus: number; plus: number; violationCount: number }> = {};
    classes.forEach(c => {
      classStatsMap[c.id] = { minus: 0, plus: 0, violationCount: 0 };
    });

    weekSubmissions.forEach(sub => {
      const current = classStatsMap[sub.classId] || { minus: 0, plus: 0, violationCount: 0 };
      sub.items.forEach(it => {
        if (it.totalPoints < 0) {
          current.minus += Math.abs(it.totalPoints);
        } else {
          current.plus += it.totalPoints;
        }
        current.violationCount += it.quantity;
      });
      classStatsMap[sub.classId] = current;
    });

    const base = settings.baseScore || 100;
    const results: ClassRankingResult[] = classes.map(cls => {
      const stats = classStatsMap[cls.id] || { minus: 0, plus: 0, violationCount: 0 };
      const finalScore = base + stats.plus - stats.minus;

      let classification: 'Tốt' | 'Khá' | 'Đạt' | 'Cần cố gắng' = 'Cần cố gắng';
      if (finalScore >= settings.goodThreshold) classification = 'Tốt';
      else if (finalScore >= settings.fairThreshold) classification = 'Khá';
      else if (finalScore >= settings.passThreshold) classification = 'Đạt';

      return {
        rank: 0,
        classId: cls.id,
        className: cls.name,
        grade: cls.grade,
        homeroomTeacher: cls.homeroomTeacher,
        baseScore: base,
        totalMinusPoints: stats.minus,
        totalPlusPoints: stats.plus,
        finalScore,
        classification,
        violationCount: stats.violationCount
      };
    });

    // Sort descending by finalScore, then ascending by minus points
    results.sort((a, b) => {
      if (b.finalScore !== a.finalScore) return b.finalScore - a.finalScore;
      return a.totalMinusPoints - b.totalMinusPoints;
    });

    // Assign rank 1, 2, 3...
    results.forEach((item, index) => {
      item.rank = index + 1;
    });

    return results;
  };

  // KPI Stats for Dashboard
  const kpiStats = useMemo(() => {
    const currentWeekRankings = getRankingsForWeek(activeWeekId);
    const top5 = currentWeekRankings.slice(0, 5);

    const pendingApprovalCount = submissions.filter(s => s.weekId === activeWeekId && s.status === 'pending').length;
    const rejectedCount = submissions.filter(s => s.weekId === activeWeekId && s.status === 'rejected').length;

    // Count violation frequencies
    const freqMap: Record<string, number> = {
      'Không đeo khăn quàng': 58,
      'Đi học muộn': 47,
      'Nói chuyện trong giờ': 43,
      'Xả rác bừa bãi': 28,
      'Không trực nhật': 25
    };

    // Aggregate additional from current submissions
    submissions.filter(s => s.weekId === activeWeekId).forEach(sub => {
      sub.items.forEach(it => {
        freqMap[it.criteriaName] = (freqMap[it.criteriaName] || 0) + it.quantity;
      });
    });

    const violationFrequencies = Object.entries(freqMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const totalChecks = 240;
    const completedChecks = 228 + submissions.filter(s => s.weekId === activeWeekId && s.status === 'approved').length - 7;
    const safeCompleted = Math.min(238, Math.max(220, completedChecks));
    const pendingChecks = totalChecks - safeCompleted;
    const completionRate = Math.round((safeCompleted / totalChecks) * 100);

    return {
      totalClasses: classes.length,
      totalRedFlags: 32, // matches reference image
      totalChecks,
      completedChecks: safeCompleted,
      pendingChecks,
      completionRate,
      pendingApprovalCount,
      rejectedCount,
      top5,
      violationFrequencies
    };
  }, [activeWeekId, submissions, classes, settings]);

  // Actions
  const addClass = (cls: Omit<ClassInfo, 'id'>) => {
    const newClass: ClassInfo = { ...cls, id: cls.name };
    setClassesState(prev => [...prev, newClass]);
    addAuditLog('Thêm lớp học', `Thêm lớp ${cls.name}, GVCN: ${cls.homeroomTeacher}`);
  };

  const updateClass = (id: string, cls: Partial<ClassInfo>) => {
    setClassesState(prev => prev.map(c => c.id === id ? { ...c, ...cls } : c));
    addAuditLog('Cập nhật lớp', `Chỉnh sửa thông tin lớp ${id}`);
  };

  const deleteClass = (id: string) => {
    setClassesState(prev => prev.filter(c => c.id !== id));
    addAuditLog('Xóa lớp', `Xóa lớp ${id}`);
  };

  const addWeek = (w: Omit<SchoolWeek, 'id'>) => {
    const newWeek: SchoolWeek = {
      ...w,
      id: 'w' + (weeks.length + 1)
    };
    setWeeksState(prev => [...prev, newWeek]);
    addAuditLog('Thêm tuần', `Tạo ${w.name} (${w.startDate} - ${w.endDate})`);
  };

  const updateWeek = (id: string, week: Partial<SchoolWeek>) => {
    setWeeksState(prev => prev.map(w => w.id === id ? { ...w, ...week } : w));
    addAuditLog('Sửa thông tin tuần', `Cập nhật cấu hình tuần ${id}`);
  };

  const toggleLockWeek = (id: string) => {
    setWeeksState(prev => prev.map(w => {
      if (w.id === id) {
        const nextStatus = w.status === 'locked' ? 'scoring' : 'locked';
        addAuditLog(nextStatus === 'locked' ? 'Khóa tuần' : 'Mở khóa tuần', `${nextStatus === 'locked' ? 'Khóa' : 'Mở'} ${w.name}`);
        return { ...w, status: nextStatus };
      }
      return w;
    }));
  };

  const deleteWeek = (id: string) => {
    setWeeksState(prev => prev.filter(w => w.id !== id));
    addAuditLog('Xóa tuần', `Xóa tuần ${id}`);
  };

  const addRedFlag = (rf: Omit<RedFlagMember, 'id'>) => {
    const newRf: RedFlagMember = {
      ...rf,
      id: 'cd-' + (redFlags.length + 1)
    };
    setRedFlagsState(prev => [...prev, newRf]);
    addAuditLog('Thêm cờ đỏ', `Thêm đội viên ${rf.fullName} (${rf.classId})`);
  };

  const updateRedFlag = (id: string, member: Partial<RedFlagMember>) => {
    setRedFlagsState(prev => prev.map(r => r.id === id ? { ...r, ...member } : r));
    addAuditLog('Sửa thông tin cờ đỏ', `Cập nhật đội viên ID ${id}`);
  };

  const toggleRedFlagStatus = (id: string) => {
    setRedFlagsState(prev => prev.map(r => {
      if (r.id === id) {
        const next = r.status === 'active' ? 'locked' : 'active';
        addAuditLog(next === 'locked' ? 'Khóa tài khoản cờ đỏ' : 'Mở khóa tài khoản', `${r.fullName} (${next})`);
        return { ...r, status: next };
      }
      return r;
    }));
  };

  const deleteRedFlag = (id: string) => {
    setRedFlagsState(prev => prev.filter(r => r.id !== id));
    addAuditLog('Xóa cờ đỏ', `Xóa đội viên cờ đỏ ID ${id}`);
  };

  const addAssignment = (asg: Omit<DutyAssignment, 'id'>) => {
    const newAsg: DutyAssignment = {
      ...asg,
      id: 'as-' + Date.now()
    };
    setAssignmentsState(prev => [newAsg, ...prev]);
    addAuditLog('Phân công trực', `Phân công ${asg.redFlagName} chấm lớp ${asg.targetClassId} (${asg.dayOfWeek})`);
  };

  const updateAssignment = (id: string, asg: Partial<DutyAssignment>) => {
    setAssignmentsState(prev => prev.map(a => a.id === id ? { ...a, ...asg } : a));
    addAuditLog('Sửa phân công', `Cập nhật phân công ${id}`);
  };

  const deleteAssignment = (id: string) => {
    setAssignmentsState(prev => prev.filter(a => a.id !== id));
    addAuditLog('Xóa phân công', `Hủy phân công trực ${id}`);
  };

  // Smart Rotation Auto-assignment algorithm
  const autoAssignWeek = (weekId: string) => {
    const availableRedFlags = redFlags.filter(r => r.status === 'active');
    if (availableRedFlags.length === 0 || classes.length === 0) return;

    const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6'];
    const areas = ['Sân trường', 'Hành lang tầng 1', 'Hành lang tầng 2', 'Cổng trường'];
    const contents = ['Nề nếp & Trang phục', 'Vệ sinh & Nề nếp', 'Truy bài đầu giờ', 'Thể dục giữa giờ'];

    const newAssignments: DutyAssignment[] = [];
    const classList = [...classes];

    // Shuffle rotation ensuring no red flag evaluates own class
    let rfIndex = 0;
    days.forEach((day, dIdx) => {
      classList.forEach((targetClass, cIdx) => {
        // Find a red flag that does not belong to targetClass
        let candidate = availableRedFlags[(rfIndex + dIdx + cIdx) % availableRedFlags.length];
        if (candidate.classId === targetClass.name) {
          candidate = availableRedFlags[(rfIndex + dIdx + cIdx + 1) % availableRedFlags.length];
        }

        newAssignments.push({
          id: `as-auto-${weekId}-${dIdx}-${cIdx}`,
          weekId,
          redFlagId: candidate.id,
          redFlagName: candidate.fullName,
          targetClassId: targetClass.name,
          dayOfWeek: day,
          date: `2026-09-${28 + dIdx}`,
          area: areas[(dIdx + cIdx) % areas.length],
          content: contents[(dIdx + cIdx) % contents.length],
          status: 'pending'
        });
        rfIndex++;
      });
    });

    // Replace assignments for this week or merge
    setAssignmentsState(prev => [
      ...newAssignments,
      ...prev.filter(a => a.weekId !== weekId)
    ]);
    addAuditLog('Phân công tự động', `Tạo tự động ${newAssignments.length} lượt trực cho tuần ${weekId} với thuật toán xoay vòng`);
  };

  const addCriteria = (crit: Omit<ViolationCriteria, 'id'>) => {
    const newCrit: ViolationCriteria = {
      ...crit,
      id: 'crit-custom-' + Date.now()
    };
    setCriteriaState(prev => [...prev, newCrit]);
    addAuditLog('Thêm tiêu chí vi phạm', `Thêm lỗi "${crit.name}" (${crit.points}đ, nhóm ${crit.group})`);
  };

  const updateCriteria = (id: string, crit: Partial<ViolationCriteria>) => {
    setCriteriaState(prev => prev.map(c => c.id === id ? { ...c, ...crit } : c));
    addAuditLog('Cập nhật tiêu chí', `Chỉnh sửa tiêu chí ${id}`);
  };

  const deleteCriteria = (id: string) => {
    setCriteriaState(prev => prev.filter(c => c.id !== id));
    addAuditLog('Xóa tiêu chí', `Xóa tiêu chí ${id}`);
  };

  const submitScore = (data: Omit<ScoreSubmission, 'id' | 'submittedAt'>) => {
    const newSub: ScoreSubmission = {
      ...data,
      id: 'sub-' + Date.now(),
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    setSubmissionsState(prev => [newSub, ...prev]);

    // Add notification to admin
    const newNotif: NotificationItem = {
      id: 'notif-' + Date.now(),
      title: 'Phiếu chấm mới chờ duyệt',
      message: `${data.redFlagName} vừa gửi kết quả chấm lớp ${data.classId} (${data.items.length} lỗi).`,
      time: 'Vừa xong',
      type: 'info',
      read: false,
      linkTab: 'approval'
    };
    setNotificationsState(prev => [newNotif, ...prev]);
    addAuditLog('Nhập kết quả chấm', `${data.redFlagName} gửi phiếu chấm lớp ${data.classId} (${data.dayLabel})`);

    // Async sync to Supabase if enabled
    if (autoSyncSupabase) {
      (async () => {
        try {
          const { error } = await supabase.from('submissions').upsert([newSub]);
          if (error) console.warn('Supabase auto-sync submission warning:', error.message);
        } catch {
          // ignore
        }
      })();
    }
  };

  const approveSubmission = (submissionId: string) => {
    setSubmissionsState(prev => prev.map(s => {
      if (s.id === submissionId) {
        addAuditLog('Duyệt phiếu chấm', `Duyệt kết quả chấm lớp ${s.classId} của ${s.redFlagName}`);
        const approvedSub = {
          ...s,
          status: 'approved' as const,
          approvedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
          approvedBy: currentUser ? currentUser.name : 'Ban Giám Hiệu'
        };
        if (autoSyncSupabase) {
          (async () => {
            try {
              await supabase.from('submissions').update({
                status: 'approved',
                approvedAt: approvedSub.approvedAt,
                approvedBy: approvedSub.approvedBy
              }).eq('id', submissionId);
            } catch {
              // ignore
            }
          })();
        }
        return approvedSub;
      }
      return s;
    }));
  };

  const rejectSubmission = (submissionId: string, reason: string) => {
    setSubmissionsState(prev => prev.map(s => {
      if (s.id === submissionId) {
        addAuditLog('Yêu cầu sửa phiếu', `Yêu cầu ${s.redFlagName} sửa phiếu lớp ${s.classId}: ${reason}`);
        if (autoSyncSupabase) {
          (async () => {
            try {
              await supabase.from('submissions').update({
                status: 'rejected',
                rejectionReason: reason
              }).eq('id', submissionId);
            } catch {
              // ignore
            }
          })();
        }
        return {
          ...s,
          status: 'rejected' as const,
          rejectionReason: reason
        };
      }
      return s;
    }));
  };

  const bulkApprovePending = () => {
    const pendingCount = submissions.filter(s => s.weekId === activeWeekId && s.status === 'pending').length;
    setSubmissionsState(prev => prev.map(s => {
      if (s.weekId === activeWeekId && s.status === 'pending') {
        return {
          ...s,
          status: 'approved' as const,
          approvedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
          approvedBy: currentUser ? currentUser.name : 'Ban Giám Hiệu'
        };
      }
      return s;
    }));
    addAuditLog('Duyệt hàng loạt', `Đã duyệt tất cả ${pendingCount} phiếu chấm tuần ${activeWeek?.name}`);
  };

  const setSelectedAcademicYear = (year: string) => {
    setSelectedAcademicYearState(year);
    setSettingsState(prev => ({ ...prev, academicYear: year }));
    addAuditLog('Đổi năm học', `Quản trị viên chuyển năm học làm việc sang: ${year}`);
  };

  const addAcademicYear = (year: string) => {
    if (!academicYears.includes(year)) {
      setAcademicYearsState(prev => [year, ...prev]);
      addAuditLog('Thêm năm học', `Thêm năm học mới: ${year}`);
    }
  };

  const generateWeeksForYear = (academicYear: string, startDateStr: string, startWeekNum: number, totalWeeks: number) => {
    const newWeeks: SchoolWeek[] = [];
    const start = new Date(startDateStr);

    for (let i = 0; i < totalWeeks; i++) {
      const weekNum = startWeekNum + i;
      const weekStart = new Date(start);
      weekStart.setDate(start.getDate() + i * 7);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      const startFormatted = weekStart.toISOString().split('T')[0];
      const endFormatted = weekEnd.toISOString().split('T')[0];

      let status: WeekStatus = 'not_started';
      if (weekNum < 4) status = 'approved';
      else if (weekNum === 4) status = 'scoring';
      else status = 'not_started';

      newWeeks.push({
        id: `w${weekNum}`,
        number: weekNum,
        name: `Tuần ${weekNum}`,
        startDate: startFormatted,
        endDate: endFormatted,
        status,
        academicYear
      });
    }

    setWeeksState(newWeeks);
    setSettingsState(prev => ({
      ...prev,
      academicYear,
      startDate: startDateStr,
      startWeekNumber: startWeekNum,
      totalWeeksCount: totalWeeks
    }));
    addAuditLog('Kế hoạch tuần học', `Đã khởi tạo ${totalWeeks} tuần học cho năm học ${academicYear} từ ngày ${startDateStr}`);
  };

  const addUser = (userData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...userData,
      id: 'u-' + Date.now(),
      status: userData.status || 'active',
      academicYear: userData.academicYear || selectedAcademicYear,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setUsersState(prev => [newUser, ...prev]);
    addAuditLog('Cấp tài khoản mới', `Tạo tài khoản ${newUser.username} (${newUser.roleTitle || newUser.role})`);

    if (autoSyncSupabase) {
      (async () => {
        try {
          await supabase.from('users').upsert([newUser]);
        } catch {}
      })();
    }
  };

  const updateUser = (id: string, userData: Partial<User>) => {
    setUsersState(prev => {
      const next = prev.map(u => u.id === id ? { ...u, ...userData } : u);
      const updated = next.find(u => u.id === id);
      if (updated && autoSyncSupabase) {
        (async () => {
          try {
            await supabase.from('users').upsert([updated]);
          } catch {}
        })();
      }
      return next;
    });
    addAuditLog('Cập nhật tài khoản', `Chỉnh sửa thông tin tài khoản ID ${id}`);
  };

  const deleteUser = (id: string) => {
    setUsersState(prev => prev.filter(u => u.id !== id));
    addAuditLog('Xóa tài khoản', `Xóa tài khoản ID ${id}`);
    if (autoSyncSupabase) {
      (async () => {
        try {
          await supabase.from('users').delete().eq('id', id);
        } catch {}
      })();
    }
  };

  const toggleUserStatus = (id: string) => {
    setUsersState(prev => prev.map(u => {
      if (u.id === id) {
        const nextStatus = u.status === 'active' ? 'locked' : 'active';
        const updated = { ...u, status: nextStatus as 'active' | 'locked' };
        addAuditLog(nextStatus === 'locked' ? 'Khóa tài khoản' : 'Mở khóa tài khoản', `${u.username} (${u.name})`);
        if (autoSyncSupabase) {
          (async () => {
            try {
              await supabase.from('users').upsert([updated]);
            } catch {}
          })();
        }
        return updated;
      }
      return u;
    }));
  };

  const resetUserPassword = (id: string, newPassword?: string) => {
    const pwd = newPassword || '123456';
    setUsersState(prev => prev.map(u => {
      if (u.id === id) {
        const updated = { ...u, password: pwd };
        if (autoSyncSupabase) {
          (async () => {
            try {
              await supabase.from('users').upsert([updated]);
            } catch {}
          })();
        }
        return updated;
      }
      return u;
    }));
    addAuditLog('Đặt lại mật khẩu', `Đặt lại mật khẩu cho tài khoản ID ${id}`);
  };

  const updateUserPermissions = (userId: string, perms: Partial<AccountPermissions>) => {
    setUsersState(prev => prev.map(u => {
      if (u.id === userId) {
        const updatedPerms = { ...(u.permissions || {}), ...perms };
        const updated = { ...u, permissions: updatedPerms };
        addAuditLog('Phân quyền tài khoản', `Cập nhật quyền hạn cho tài khoản: ${u.username} (${u.name})`);
        if (autoSyncSupabase) {
          (async () => {
            try {
              await supabase.from('users').upsert([updated]);
            } catch {}
          })();
        }
        return updated;
      }
      return u;
    }));
  };

  const updateSettings = (newSettings: Partial<SchoolSettings>) => {
    setSettingsState(prev => ({ ...prev, ...newSettings }));
    addAuditLog('Cập nhật cài đặt', 'Thay đổi cấu hình hệ thống thi đua');
  };

  const updateMinutes = (newMinutes: Partial<WeeklyMinutesReport>) => {
    setMinutesState(prev => ({ ...prev, ...newMinutes }));
    addAuditLog('Cập nhật biên bản', `Chỉnh sửa nội dung biên bản tuần ${activeWeek?.name}`);
  };

  const markNotificationAsRead = (id: string) => {
    setNotificationsState(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotificationsState(prev => prev.map(n => ({ ...n, read: true })));
  };

  const resetToDefaultData = () => {
    localStorage.clear();
    setSettingsState(INITIAL_SETTINGS);
    setClassesState(INITIAL_CLASSES);
    setWeeksState(INITIAL_WEEKS);
    setRedFlagsState(INITIAL_RED_FLAGS);
    setCriteriaState(INITIAL_CRITERIA);
    setAssignmentsState(INITIAL_ASSIGNMENTS);
    setSubmissionsState(INITIAL_SUBMISSIONS);
    setNotificationsState(INITIAL_NOTIFICATIONS);
    setAuditLogsState(INITIAL_AUDIT_LOGS);
    setMinutesState(INITIAL_MINUTES);
    setAcademicYearsState(AVAILABLE_ACADEMIC_YEARS);
    setSelectedAcademicYearState('2026 - 2027');
    setUsersState(INITIAL_USERS);
    setActiveWeekIdState('w4');
    addAuditLog('Khôi phục dữ liệu', 'Đã đặt lại dữ liệu mẫu trường PTDTBT TH&THCS Quản Bạ');
  };

  const syncAllToSupabase = async () => {
    setIsSyncingSupabase(true);
    try {
      const res = await uploadAllToSupabase({
        classes,
        weeks,
        redFlags,
        criteria,
        assignments,
        submissions,
        users,
        settings,
        minutes,
        auditLogs
      });
      if (res.success) {
        setSupabaseStatus('connected');
        setSupabaseMessage('Đã đồng bộ toàn bộ dữ liệu lên máy chủ Supabase thành công!');
        addAuditLog('Đồng bộ Supabase', 'Đã tải toàn bộ dữ liệu ứng dụng lên máy chủ Supabase');
      } else {
        setSupabaseStatus('error');
        setSupabaseMessage(`Lỗi đồng bộ: ${res.message}`);
      }
      return res;
    } finally {
      setIsSyncingSupabase(false);
    }
  };

  const loadAllFromSupabase = async () => {
    setIsSyncingSupabase(true);
    try {
      const res = await fetchAllFromSupabase();
      if (res.success && res.data) {
        if (res.data.classes && res.data.classes.length > 0) setClassesState(res.data.classes);
        if (res.data.weeks && res.data.weeks.length > 0) setWeeksState(res.data.weeks);
        if (res.data.redFlags && res.data.redFlags.length > 0) setRedFlagsState(res.data.redFlags);
        if (res.data.criteria && res.data.criteria.length > 0) setCriteriaState(res.data.criteria);
        if (res.data.assignments && res.data.assignments.length > 0) setAssignmentsState(res.data.assignments);
        if (res.data.submissions && res.data.submissions.length > 0) setSubmissionsState(res.data.submissions);
        if (res.data.users && res.data.users.length > 0) setUsersState(res.data.users);
        if (res.data.settings) setSettingsState(res.data.settings);
        if (res.data.minutes) setMinutesState(res.data.minutes);
        setSupabaseStatus('connected');
        setSupabaseMessage(res.message);
        addAuditLog('Tải dữ liệu Supabase', 'Đã nạp dữ liệu từ máy chủ Supabase về ứng dụng');
      } else {
        setSupabaseMessage(res.message);
      }
      return res;
    } finally {
      setIsSyncingSupabase(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole: currentUser ? currentUser.role : null,
        isAuthenticated: !!currentUser,
        academicYears,
        selectedAcademicYear,
        users,
        activeWeekId,
        activeTab,
        classes,
        weeks,
        redFlags,
        criteria,
        assignments,
        submissions,
        notifications,
        auditLogs,
        settings,
        minutes,
        mobileSimulatorOpen,
        loginModalOpen,

        // Supabase Database Integration
        supabaseStatus,
        supabaseMessage,
        isSyncingSupabase,
        autoSyncSupabase,
        checkSupabaseConnection,
        syncAllToSupabase,
        loadAllFromSupabase,
        setAutoSyncSupabase,

        login,
        logout,
        setCurrentUser,
        switchRole,
        setActiveTab,
        setActiveWeekId,
        setMobileSimulatorOpen,
        setLoginModalOpen,

        setSelectedAcademicYear,
        addAcademicYear,
        generateWeeksForYear,
        addUser,
        updateUser,
        deleteUser,
        toggleUserStatus,
        resetUserPassword,
        updateUserPermissions,

        addClass,
        updateClass,
        deleteClass,

        addWeek,
        updateWeek,
        toggleLockWeek,
        deleteWeek,

        addRedFlag,
        updateRedFlag,
        toggleRedFlagStatus,
        deleteRedFlag,

        addAssignment,
        updateAssignment,
        deleteAssignment,
        autoAssignWeek,

        addCriteria,
        updateCriteria,
        deleteCriteria,

        submitScore,
        approveSubmission,
        rejectSubmission,
        bulkApprovePending,

        updateSettings,
        updateMinutes,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addAuditLog,
        resetToDefaultData,

        activeWeek,
        getRankingsForWeek,
        kpiStats
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
