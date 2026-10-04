export type UserRole = 'admin' | 'teacher' | 'red_flag' | 'student';

export interface AccountPermissions {
  canApprove: boolean; // Duyệt kết quả chấm
  canScore: boolean; // Nhập điểm chấm nề nếp
  canViewReports: boolean; // Xem báo cáo & xếp hạng
  canLockWeeks: boolean; // Khóa / mở tuần
  canManageCriteria: boolean; // Quản lý danh mục lỗi
  canManageUsers: boolean; // Cấp và sửa tài khoản
  canExport: boolean; // Xuất Excel, Word, In PDF
  canEditSettings: boolean; // Cấu hình hệ thống
}

export interface User {
  id: string;
  name: string;
  username: string;
  password?: string;
  role: UserRole;
  avatar?: string;
  assignedClass?: string; // For teacher (GVCN) or Red Flag student
  roleTitle?: string;
  phone?: string;
  email?: string;
  status: 'active' | 'locked';
  createdAt?: string;
  academicYear?: string;
  permissions?: Partial<AccountPermissions>;
}

export interface ClassInfo {
  id: string;
  name: string; // 6A, 6B, 7A, 7B, 8A, 8B, 9A, 9B
  grade: number; // 6, 7, 8, 9
  homeroomTeacher: string;
  totalStudents: number;
  roomNumber?: string;
  status: 'active' | 'inactive';
}

export type WeekStatus = 'not_started' | 'scoring' | 'pending_approval' | 'approved' | 'locked';

export interface SchoolWeek {
  id: string;
  number: number;
  name: string; // Tuần 4
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  status: WeekStatus;
  academicYear: string;
}

export interface RedFlagMember {
  id: string;
  code: string; // CD01
  fullName: string;
  classId: string; // e.g. "8A"
  username: string;
  status: 'active' | 'locked';
  academicYear: string;
  phone?: string;
  dutyGroup?: string;
}

export interface DutyAssignment {
  id: string;
  weekId: string;
  redFlagId: string;
  redFlagName: string;
  targetClassId: string; // Lớp được chấm
  dayOfWeek: string; // Thứ 2, Thứ 3, Thứ 4, Thứ 5, Thứ 6
  date: string; // YYYY-MM-DD
  area: string; // Sân trường, Hành lang, Lớp học, Cổng trường
  content: string; // Nề nếp, Vệ sinh, Truy bài, Thể dục giữa giờ
  status: 'pending' | 'completed';
}

export type ViolationGroup = 'Trang phục' | 'Đi học' | 'Vệ sinh' | 'Học tập' | 'Nề nếp' | 'Thể dục giữa giờ' | 'Truy bài' | 'Hoạt động Đội' | 'Lỗi khác';

export interface ViolationCriteria {
  id: string;
  group: ViolationGroup;
  name: string;
  points: number; // usually negative, e.g. -1, -2, -5
  type: 'minus' | 'plus';
  status: 'active' | 'inactive';
  applicableGrades: string; // "Tất cả" or "6,7,8,9"
  description?: string;
}

export interface ViolationRecordItem {
  criteriaId: string;
  criteriaName: string;
  group: ViolationGroup;
  quantity: number;
  pointsPerItem: number;
  totalPoints: number; // quantity * pointsPerItem
  note?: string;
}

export type SubmissionStatus = 'pending' | 'approved' | 'rejected';

export interface ScoreSubmission {
  id: string;
  assignmentId?: string;
  weekId: string;
  classId: string;
  redFlagId: string;
  redFlagName: string;
  date: string; // YYYY-MM-DD
  dayLabel: string; // Thứ 2, Thứ 3...
  area: string;
  content: string;
  items: ViolationRecordItem[];
  status: SubmissionStatus;
  submittedAt: string;
  approvedAt?: string;
  approvedBy?: string;
  rejectionReason?: string;
}

export interface ClassRankingResult {
  rank: number;
  classId: string;
  className: string;
  grade: number;
  homeroomTeacher: string;
  baseScore: number; // 100
  totalMinusPoints: number;
  totalPlusPoints: number;
  finalScore: number;
  classification: 'Tốt' | 'Khá' | 'Đạt' | 'Cần cố gắng';
  violationCount: number;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userName: string;
  userRole: string;
  action: string;
  details: string;
  target?: string;
}

export interface SchoolSettings {
  schoolName: string;
  schoolSubTitle: string;
  academicYear: string;
  chiefOfficerName: string;
  principalName: string;
  baseScore: number;
  allowEditAfterSubmit: boolean;
  requireApproval: boolean;
  systemNotifications: boolean;
  autoLockOnSunday: boolean;
  goodThreshold: number;
  fairThreshold: number;
  passThreshold: number;
  startDate?: string; // Ngày bắt đầu học (YYYY-MM-DD)
  startWeekNumber?: number; // Tuần bắt đầu học (ví dụ: 1)
  totalWeeksCount?: number; // Số tuần học trong năm (ví dụ: 35 tuần)
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'warning' | 'success';
  read: boolean;
  linkTab?: string;
}

export interface WeeklyMinutesReport {
  weekId: string;
  weekName: string;
  dateRange: string;
  advantages: string;
  drawbacks: string;
  generalComments: string;
  recommendations: string;
  preparedBy: string;
  approvedBy: string;
  dateCreated: string;
}
