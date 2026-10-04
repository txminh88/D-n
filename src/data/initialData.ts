import {
  User,
  ClassInfo,
  SchoolWeek,
  RedFlagMember,
  DutyAssignment,
  ViolationCriteria,
  ScoreSubmission,
  SchoolSettings,
  NotificationItem,
  AuditLog,
  WeeklyMinutesReport
} from '../types';

export const INITIAL_SETTINGS: SchoolSettings = {
  schoolName: 'TRƯỜNG PTDTBT TH&THCS QUẢN BẠ',
  schoolSubTitle: 'Huyện Quản Bạ - Tỉnh Hà Giang',
  academicYear: '2026 - 2027',
  chiefOfficerName: 'Nguyễn Văn Minh',
  principalName: 'Trần Đình Hùng',
  baseScore: 100,
  allowEditAfterSubmit: false,
  requireApproval: true,
  systemNotifications: true,
  autoLockOnSunday: true,
  goodThreshold: 90,
  fairThreshold: 80,
  passThreshold: 70,
  startDate: '2026-09-07',
  startWeekNumber: 1,
  totalWeeksCount: 35
};

export const AVAILABLE_ACADEMIC_YEARS: string[] = [
  '2026 - 2027',
  '2025 - 2026',
  '2024 - 2025'
];

export const INITIAL_USERS: User[] = [
  {
    id: 'u-admin',
    name: 'Thầy Nguyễn Văn Minh',
    username: 'tongphutrach',
    password: 'password123',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    roleTitle: 'Tổng phụ trách Đội (Quản trị)',
    phone: '0988123456',
    email: 'nguyenvanminh@quanba.edu.vn',
    status: 'active',
    academicYear: '2026 - 2027',
    createdAt: '2026-08-15'
  },
  {
    id: 'u-bgh',
    name: 'Thầy Trần Đình Hùng',
    username: 'hieutruong',
    password: 'password123',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    roleTitle: 'Hiệu trưởng (Ban Giám hiệu)',
    phone: '0988999888',
    email: 'trandinhhung@quanba.edu.vn',
    status: 'active',
    academicYear: '2026 - 2027',
    createdAt: '2026-08-15'
  },
  {
    id: 'u-codo1',
    name: 'Nguyễn Văn A',
    username: 'codo_nguyenvana',
    password: 'password123',
    role: 'red_flag',
    assignedClass: '8A',
    roleTitle: 'Đội viên Cờ đỏ - Chi đội 8A',
    phone: '0981234567',
    status: 'active',
    academicYear: '2026 - 2027',
    createdAt: '2026-09-01'
  },
  {
    id: 'u-codo2',
    name: 'Trần Thị B',
    username: 'codo_tranthib',
    password: 'password123',
    role: 'red_flag',
    assignedClass: '8B',
    roleTitle: 'Đội viên Cờ đỏ - Chi đội 8B',
    phone: '0981234568',
    status: 'active',
    academicYear: '2026 - 2027',
    createdAt: '2026-09-01'
  },
  {
    id: 'u-gvcn1',
    name: 'Cô Hoàng Thị Lan',
    username: 'gvcn_7a',
    password: 'password123',
    role: 'teacher',
    assignedClass: '7A',
    roleTitle: 'GVCN Lớp 7A',
    phone: '0982345678',
    email: 'hoangthilan@quanba.edu.vn',
    status: 'active',
    academicYear: '2026 - 2027',
    createdAt: '2026-08-20'
  },
  {
    id: 'u-gvcn2',
    name: 'Thầy Đặng Quốc Tuấn',
    username: 'gvcn_9a',
    password: 'password123',
    role: 'teacher',
    assignedClass: '9A',
    roleTitle: 'GVCN Lớp 9A',
    phone: '0983456789',
    email: 'dangquoctuan@quanba.edu.vn',
    status: 'active',
    academicYear: '2026 - 2027',
    createdAt: '2026-08-20'
  },
  {
    id: 'u-gvcn3',
    name: 'Thầy Nguyễn Văn Trọng',
    username: 'gvcn_8a',
    password: 'password123',
    role: 'teacher',
    assignedClass: '8A',
    roleTitle: 'GVCN Lớp 8A',
    phone: '0984567890',
    email: 'nguyenvantrong@quanba.edu.vn',
    status: 'active',
    academicYear: '2026 - 2027',
    createdAt: '2026-08-20'
  },
  {
    id: 'u-student',
    name: 'Lớp 7A (Đại diện lớp)',
    username: 'lop_7a',
    password: 'password123',
    role: 'student',
    assignedClass: '7A',
    roleTitle: 'Tập thể Lớp 7A',
    status: 'active',
    academicYear: '2026 - 2027',
    createdAt: '2026-09-01'
  }
];

export const INITIAL_CLASSES: ClassInfo[] = [
  { id: '6A', name: '6A', grade: 6, homeroomTeacher: 'Cô Lê Thị Nga', totalStudents: 38, roomNumber: 'P.101', status: 'active' },
  { id: '6B', name: '6B', grade: 6, homeroomTeacher: 'Thầy Vàng Seo Sùng', totalStudents: 36, roomNumber: 'P.102', status: 'active' },
  { id: '6C', name: '6C', grade: 6, homeroomTeacher: 'Cô Đỗ Thu Hà', totalStudents: 35, roomNumber: 'P.103', status: 'active' },
  { id: '6D', name: '6D', grade: 6, homeroomTeacher: 'Thầy Hoàng Văn Hải', totalStudents: 37, roomNumber: 'P.104', status: 'active' },
  { id: '7A', name: '7A', grade: 7, homeroomTeacher: 'Cô Hoàng Thị Lan', totalStudents: 40, roomNumber: 'P.201', status: 'active' },
  { id: '7B', name: '7B', grade: 7, homeroomTeacher: 'Thầy Lý A Sính', totalStudents: 39, roomNumber: 'P.202', status: 'active' },
  { id: '7C', name: '7C', grade: 7, homeroomTeacher: 'Cô Mai Thị Yến', totalStudents: 38, roomNumber: 'P.203', status: 'active' },
  { id: '7D', name: '7D', grade: 7, homeroomTeacher: 'Thầy Triệu Văn Đức', totalStudents: 36, roomNumber: 'P.204', status: 'active' },
  { id: '8A', name: '8A', grade: 8, homeroomTeacher: 'Thầy Nguyễn Văn Trọng', totalStudents: 41, roomNumber: 'P.301', status: 'active' },
  { id: '8B', name: '8B', grade: 8, homeroomTeacher: 'Cô Bùi Thị Thoa', totalStudents: 40, roomNumber: 'P.302', status: 'active' },
  { id: '8C', name: '8C', grade: 8, homeroomTeacher: 'Thầy Lò Văn Hạnh', totalStudents: 37, roomNumber: 'P.303', status: 'active' },
  { id: '8D', name: '8D', grade: 8, homeroomTeacher: 'Cô Phùng Thị Loan', totalStudents: 38, roomNumber: 'P.304', status: 'active' },
  { id: '9A', name: '9A', grade: 9, homeroomTeacher: 'Thầy Đặng Quốc Tuấn', totalStudents: 42, roomNumber: 'P.401', status: 'active' },
  { id: '9B', name: '9B', grade: 9, homeroomTeacher: 'Cô Vũ Hải Vân', totalStudents: 39, roomNumber: 'P.402', status: 'active' },
  { id: '9C', name: '9C', grade: 9, homeroomTeacher: 'Thầy Giàng A Mùa', totalStudents: 36, roomNumber: 'P.403', status: 'active' },
  { id: '9D', name: '9D', grade: 9, homeroomTeacher: 'Cô Vi Thị Huệ', totalStudents: 38, roomNumber: 'P.404', status: 'active' }
];

export const INITIAL_WEEKS: SchoolWeek[] = [
  { id: 'w1', number: 1, name: 'Tuần 1', startDate: '2026-09-01', endDate: '2026-09-07', status: 'approved', academicYear: '2026 - 2027' },
  { id: 'w2', number: 2, name: 'Tuần 2', startDate: '2026-09-08', endDate: '2026-09-14', status: 'approved', academicYear: '2026 - 2027' },
  { id: 'w3', number: 3, name: 'Tuần 3', startDate: '2026-09-15', endDate: '2026-09-21', status: 'approved', academicYear: '2026 - 2027' },
  { id: 'w4', number: 4, name: 'Tuần 4', startDate: '2026-09-28', endDate: '2026-10-04', status: 'scoring', academicYear: '2026 - 2027' },
  { id: 'w5', number: 5, name: 'Tuần 5', startDate: '2026-10-05', endDate: '2026-10-11', status: 'not_started', academicYear: '2026 - 2027' }
];

export const INITIAL_RED_FLAGS: RedFlagMember[] = [
  { id: 'cd-1', code: 'CD01', fullName: 'Nguyễn Văn A', classId: '8A', username: 'codo_nguyenvana', status: 'active', academicYear: '2026 - 2027', phone: '0981234567', dutyGroup: 'Đội 1' },
  { id: 'cd-2', code: 'CD02', fullName: 'Trần Thị B', classId: '8B', username: 'codo_tranthib', status: 'active', academicYear: '2026 - 2027', phone: '0981234568', dutyGroup: 'Đội 1' },
  { id: 'cd-3', code: 'CD03', fullName: 'Lý Văn C', classId: '8A', username: 'codo_lyvanc', status: 'active', academicYear: '2026 - 2027', phone: '0981234569', dutyGroup: 'Đội 2' },
  { id: 'cd-4', code: 'CD04', fullName: 'Mùa A Dê', classId: '8B', username: 'codo_muaade', status: 'active', academicYear: '2026 - 2027', phone: '0981234570', dutyGroup: 'Đội 2' },
  { id: 'cd-5', code: 'CD05', fullName: 'Giàng Thị D', classId: '9A', username: 'codo_giangthid', status: 'active', academicYear: '2026 - 2027', phone: '0981234571', dutyGroup: 'Đội 3' },
  { id: 'cd-6', code: 'CD06', fullName: 'Vàng A Sinh', classId: '9B', username: 'codo_vangasinh', status: 'active', academicYear: '2026 - 2027', phone: '0981234572', dutyGroup: 'Đội 3' },
  { id: 'cd-7', code: 'CD07', fullName: 'Vàng Thị Mai', classId: '7A', username: 'codo_vangthimai', status: 'active', academicYear: '2026 - 2027', phone: '0981234573', dutyGroup: 'Đội 4' },
  { id: 'cd-8', code: 'CD08', fullName: 'Thào A Páo', classId: '7B', username: 'codo_thaoapao', status: 'active', academicYear: '2026 - 2027', phone: '0981234574', dutyGroup: 'Đội 4' },
  { id: 'cd-9', code: 'CD09', fullName: 'Lù Thị Hoa', classId: '9A', username: 'codo_luthihoa', status: 'active', academicYear: '2026 - 2027', phone: '0981234575', dutyGroup: 'Đội 1' },
  { id: 'cd-10', code: 'CD10', fullName: 'Sùng A Tủa', classId: '8B', username: 'codo_sungatua', status: 'active', academicYear: '2026 - 2027', phone: '0981234576', dutyGroup: 'Đội 2' },
  { id: 'cd-11', code: 'CD11', fullName: 'Nông Thị Mến', classId: '8A', username: 'codo_nongthimen', status: 'active', academicYear: '2026 - 2027', phone: '0981234577', dutyGroup: 'Đội 3' },
  { id: 'cd-12', code: 'CD12', fullName: 'Triệu Văn Lâm', classId: '9B', username: 'codo_trieuvanlam', status: 'active', academicYear: '2026 - 2027', phone: '0981234578', dutyGroup: 'Đội 4' }
];

export const INITIAL_CRITERIA: ViolationCriteria[] = [
  // Trang phục
  { id: 'crit-tp-1', group: 'Trang phục', name: 'Không đeo khăn quàng', points: -1, type: 'minus', status: 'active', applicableGrades: 'Tất cả', description: 'Đội viên không đeo khăn quàng đỏ khi đến trường' },
  { id: 'crit-tp-2', group: 'Trang phục', name: 'Không mặc đúng đồng phục', points: -2, type: 'minus', status: 'active', applicableGrades: 'Tất cả', description: 'Không mặc áo đồng phục hoặc mặc sai quy định' },
  { id: 'crit-tp-3', group: 'Trang phục', name: 'Đi dép lê / không sơ vin', points: -1, type: 'minus', status: 'active', applicableGrades: 'Tất cả', description: 'Đi dép không có quai hậu hoặc trang phục lôi thôi' },

  // Đi học
  { id: 'crit-dh-1', group: 'Đi học', name: 'Đi học muộn', points: -2, type: 'minus', status: 'active', applicableGrades: 'Tất cả', description: 'Đến trường sau hiệu lệnh trống vào lớp' },
  { id: 'crit-dh-2', group: 'Đi học', name: 'Vắng không phép', points: -5, type: 'minus', status: 'active', applicableGrades: 'Tất cả', description: 'Nghỉ học không có giấy phép của phụ huynh' },
  { id: 'crit-dh-3', group: 'Đi học', name: 'Bỏ tiết / trốn học', points: -10, type: 'minus', status: 'active', applicableGrades: 'Tất cả', description: 'Tự ý ra khỏi lớp hoặc khuôn viên trường' },

  // Vệ sinh
  { id: 'crit-vs-1', group: 'Vệ sinh', name: 'Không trực nhật', points: -5, type: 'minus', status: 'active', applicableGrades: 'Tất cả', description: 'Lớp không phân công hoặc không quét dọn vệ sinh' },
  { id: 'crit-vs-2', group: 'Vệ sinh', name: 'Xả rác bừa bãi', points: -2, type: 'minus', status: 'active', applicableGrades: 'Tất cả', description: 'Vứt rác tại sân trường, bồn hoa hoặc hành lang' },
  { id: 'crit-vs-3', group: 'Vệ sinh', name: 'Bàn ghế xộc xệch, bảng bẩn', points: -2, type: 'minus', status: 'active', applicableGrades: 'Tất cả', description: 'Lớp học không kê ngay ngắn, không lau bảng sạch' },

  // Nề nếp
  { id: 'crit-nn-1', group: 'Nề nếp', name: 'Nói chuyện trong giờ', points: -2, type: 'minus', status: 'active', applicableGrades: 'Tất cả', description: 'Mất trật tự, làm ảnh hưởng giờ học' },
  { id: 'crit-nn-2', group: 'Nề nếp', name: 'Mất trật tự khi xếp hàng', points: -2, type: 'minus', status: 'active', applicableGrades: 'Tất cả', description: 'Xô đẩy, gây ồn ào khi chào cờ hoặc chuyển tiết' },
  { id: 'crit-nn-3', group: 'Nề nếp', name: 'Nói tục, chửi thề', points: -5, type: 'minus', status: 'active', applicableGrades: 'Tất cả', description: 'Sử dụng ngôn từ thiếu văn hóa' },

  // Học tập & Hoạt động
  { id: 'crit-ht-1', group: 'Học tập', name: 'Không thuộc bài / làm bài tập', points: -1, type: 'minus', status: 'active', applicableGrades: 'Tất cả', description: 'Ghi sổ đầu bài điểm kém hoặc chưa chuẩn bị' },
  { id: 'crit-tb-1', group: 'Truy bài', name: 'Không thực hiện 15 phút truy bài', points: -3, type: 'minus', status: 'active', applicableGrades: 'Tất cả', description: '15 phút đầu giờ không ôn bài nề nếp' },
  { id: 'crit-td-1', group: 'Thể dục giữa giờ', name: 'Tập thể dục uể oải / thiếu người', points: -3, type: 'minus', status: 'active', applicableGrades: 'Tất cả', description: 'Tập sai động tác, trốn tập thể dục' },
  { id: 'crit-hd-1', group: 'Hoạt động Đội', name: 'Không tham gia hoạt động Đội', points: -5, type: 'minus', status: 'active', applicableGrades: 'Tất cả', description: 'Vắng mặt các buổi sinh hoạt Liên đội phát động' }
];

export const INITIAL_ASSIGNMENTS: DutyAssignment[] = [
  { id: 'as-1', weekId: 'w4', redFlagId: 'cd-1', redFlagName: 'Nguyễn Văn A', targetClassId: '7A', dayOfWeek: 'Thứ 2', date: '2026-09-28', area: 'Sân trường', content: 'Nề nếp', status: 'completed' },
  { id: 'as-2', weekId: 'w4', redFlagId: 'cd-2', redFlagName: 'Trần Thị B', targetClassId: '7B', dayOfWeek: 'Thứ 2', date: '2026-09-28', area: 'Sân trường', content: 'Nề nếp', status: 'completed' },
  { id: 'as-3', weekId: 'w4', redFlagId: 'cd-3', redFlagName: 'Lý Văn C', targetClassId: '8A', dayOfWeek: 'Thứ 2', date: '2026-09-28', area: 'Hành lang', content: 'Nề nếp', status: 'completed' },
  { id: 'as-4', weekId: 'w4', redFlagId: 'cd-4', redFlagName: 'Mùa A Dê', targetClassId: '8B', dayOfWeek: 'Thứ 2', date: '2026-09-28', area: 'Hành lang', content: 'Nề nếp', status: 'completed' },
  { id: 'as-5', weekId: 'w4', redFlagId: 'cd-1', redFlagName: 'Nguyễn Văn A', targetClassId: '7A', dayOfWeek: 'Thứ 3', date: '2026-09-29', area: 'Sân trường', content: 'Nề nếp', status: 'completed' },
  { id: 'as-6', weekId: 'w4', redFlagId: 'cd-2', redFlagName: 'Trần Thị B', targetClassId: '7B', dayOfWeek: 'Thứ 3', date: '2026-09-29', area: 'Sân trường', content: 'Nề nếp', status: 'completed' },
  { id: 'as-7', weekId: 'w4', redFlagId: 'cd-5', redFlagName: 'Giàng Thị D', targetClassId: '9A', dayOfWeek: 'Thứ 3', date: '2026-09-29', area: 'Cổng trường', content: 'Đi học', status: 'completed' },
  { id: 'as-8', weekId: 'w4', redFlagId: 'cd-6', redFlagName: 'Vàng A Sinh', targetClassId: '9B', dayOfWeek: 'Thứ 3', date: '2026-09-29', area: 'Sân trường', content: 'Trang phục', status: 'completed' },
  { id: 'as-9', weekId: 'w4', redFlagId: 'cd-1', redFlagName: 'Nguyễn Văn A', targetClassId: '7A', dayOfWeek: 'Thứ 4', date: '2026-09-30', area: 'Sân trường', content: 'Nề nếp', status: 'completed' },
  { id: 'as-10', weekId: 'w4', redFlagId: 'cd-1', redFlagName: 'Nguyễn Văn A', targetClassId: '7A', dayOfWeek: 'Thứ 5', date: '2026-10-01', area: 'Sân trường', content: 'Nề nếp', status: 'pending' },
  { id: 'as-11', weekId: 'w4', redFlagId: 'cd-1', redFlagName: 'Nguyễn Văn A', targetClassId: '7A', dayOfWeek: 'Thứ 6', date: '2026-10-02', area: 'Sân trường', content: 'Nề nếp', status: 'pending' }
];

export const INITIAL_SUBMISSIONS: ScoreSubmission[] = [
  // 5 pending approval matching Panel 7
  {
    id: 'sub-p1',
    assignmentId: 'as-9',
    weekId: 'w4',
    classId: '7A',
    redFlagId: 'cd-1',
    redFlagName: 'Nguyễn Văn A',
    date: '2026-09-30',
    dayLabel: 'Thứ 4',
    area: 'Sân trường',
    content: 'Trang phục, Vệ sinh',
    status: 'pending',
    submittedAt: '2026-09-30 11:35:00',
    items: [
      { criteriaId: 'crit-tp-1', criteriaName: 'Không đeo khăn quàng', group: 'Trang phục', quantity: 3, pointsPerItem: -1, totalPoints: -3, note: 'Nhắc nhở nhiều lần' },
      { criteriaId: 'crit-vs-2', criteriaName: 'Xả rác bừa bãi', group: 'Vệ sinh', quantity: 1, pointsPerItem: -2, totalPoints: -2, note: 'Khu vực bồn hoa trước cửa lớp' }
    ]
  },
  {
    id: 'sub-p2',
    assignmentId: 'as-2',
    weekId: 'w4',
    classId: '7B',
    redFlagId: 'cd-2',
    redFlagName: 'Trần Thị B',
    date: '2026-09-30',
    dayLabel: 'Thứ 4',
    area: 'Sân trường',
    content: 'Đi học, Nề nếp',
    status: 'pending',
    submittedAt: '2026-09-30 11:40:00',
    items: [
      { criteriaId: 'crit-dh-1', criteriaName: 'Đi học muộn', group: 'Đi học', quantity: 2, pointsPerItem: -2, totalPoints: -4, note: 'Muộn 10 phút đầu giờ' },
      { criteriaId: 'crit-tp-1', criteriaName: 'Không đeo khăn quàng', group: 'Trang phục', quantity: 1, pointsPerItem: -1, totalPoints: -1 }
    ]
  },
  {
    id: 'sub-p3',
    assignmentId: 'as-3',
    weekId: 'w4',
    classId: '8A',
    redFlagId: 'cd-3',
    redFlagName: 'Lý Văn C',
    date: '2026-09-30',
    dayLabel: 'Thứ 4',
    area: 'Hành lang',
    content: 'Nề nếp',
    status: 'pending',
    submittedAt: '2026-09-30 11:42:00',
    items: [
      { criteriaId: 'crit-nn-1', criteriaName: 'Nói chuyện trong giờ', group: 'Nề nếp', quantity: 1, pointsPerItem: -2, totalPoints: -2, note: 'Giờ Sinh học tiết 2' }
    ]
  },
  {
    id: 'sub-p4',
    assignmentId: 'as-4',
    weekId: 'w4',
    classId: '8B',
    redFlagId: 'cd-4',
    redFlagName: 'Mùa A Dê',
    date: '2026-09-30',
    dayLabel: 'Thứ 4',
    area: 'Hành lang',
    content: 'Vệ sinh, Đi học',
    status: 'pending',
    submittedAt: '2026-09-30 11:45:00',
    items: [
      { criteriaId: 'crit-vs-1', criteriaName: 'Không trực nhật', group: 'Vệ sinh', quantity: 1, pointsPerItem: -5, totalPoints: -5, note: 'Lớp quét muộn sau giờ học' },
      { criteriaId: 'crit-dh-1', criteriaName: 'Đi học muộn', group: 'Đi học', quantity: 1, pointsPerItem: -2, totalPoints: -2 }
    ]
  },
  {
    id: 'sub-p5',
    assignmentId: 'as-7',
    weekId: 'w4',
    classId: '9A',
    redFlagId: 'cd-5',
    redFlagName: 'Giàng Thị D',
    date: '2026-09-30',
    dayLabel: 'Thứ 4',
    area: 'Cổng trường',
    content: 'Trang phục',
    status: 'pending',
    submittedAt: '2026-09-30 11:50:00',
    items: [
      { criteriaId: 'crit-tp-1', criteriaName: 'Không đeo khăn quàng', group: 'Trang phục', quantity: 1, pointsPerItem: -1, totalPoints: -1 }
    ]
  },

  // 2 rejection/corrections required
  {
    id: 'sub-r1',
    assignmentId: 'as-5',
    weekId: 'w4',
    classId: '6A',
    redFlagId: 'cd-7',
    redFlagName: 'Vàng Thị Mai',
    date: '2026-09-29',
    dayLabel: 'Thứ 3',
    area: 'Sân trường',
    content: 'Đi học',
    status: 'rejected',
    submittedAt: '2026-09-29 11:30:00',
    rejectionReason: 'Cần đối chiếu lại sĩ số vắng với sổ đầu bài của GVCN',
    items: [
      { criteriaId: 'crit-dh-2', criteriaName: 'Vắng không phép', group: 'Đi học', quantity: 2, pointsPerItem: -5, totalPoints: -10 }
    ]
  },
  {
    id: 'sub-r2',
    assignmentId: 'as-6',
    weekId: 'w4',
    classId: '6B',
    redFlagId: 'cd-8',
    redFlagName: 'Thào A Páo',
    date: '2026-09-29',
    dayLabel: 'Thứ 3',
    area: 'Hành lang',
    content: 'Vệ sinh',
    status: 'rejected',
    submittedAt: '2026-09-29 11:45:00',
    rejectionReason: 'Lỗi xả rác cần ghi rõ tên học sinh vi phạm hoặc khu vực hành lang',
    items: [
      { criteriaId: 'crit-vs-2', criteriaName: 'Xả rác bừa bãi', group: 'Vệ sinh', quantity: 3, pointsPerItem: -2, totalPoints: -6 }
    ]
  },

  // Approved submissions representing Week 4 scores
  // 9A: 96 pts (-4 total)
  {
    id: 'sub-app-9a',
    weekId: 'w4',
    classId: '9A',
    redFlagId: 'cd-5',
    redFlagName: 'Giàng Thị D',
    date: '2026-09-28',
    dayLabel: 'Thứ 2',
    area: 'Sân trường',
    content: 'Nề nếp',
    status: 'approved',
    submittedAt: '2026-09-28 11:30:00',
    approvedAt: '2026-09-28 14:00:00',
    approvedBy: 'Thầy Nguyễn Văn Minh',
    items: [
      { criteriaId: 'crit-tp-1', criteriaName: 'Không đeo khăn quàng', group: 'Trang phục', quantity: 2, pointsPerItem: -1, totalPoints: -2 },
      { criteriaId: 'crit-nn-1', criteriaName: 'Nói chuyện trong giờ', group: 'Nề nếp', quantity: 1, pointsPerItem: -2, totalPoints: -2 }
    ]
  },
  // 8A: 94 pts (-6 total)
  {
    id: 'sub-app-8a',
    weekId: 'w4',
    classId: '8A',
    redFlagId: 'cd-3',
    redFlagName: 'Lý Văn C',
    date: '2026-09-28',
    dayLabel: 'Thứ 2',
    area: 'Sân trường',
    content: 'Đi học & Trang phục',
    status: 'approved',
    submittedAt: '2026-09-28 11:35:00',
    approvedAt: '2026-09-28 14:10:00',
    approvedBy: 'Thầy Nguyễn Văn Minh',
    items: [
      { criteriaId: 'crit-dh-1', criteriaName: 'Đi học muộn', group: 'Đi học', quantity: 2, pointsPerItem: -2, totalPoints: -4 },
      { criteriaId: 'crit-tp-1', criteriaName: 'Không đeo khăn quàng', group: 'Trang phục', quantity: 2, pointsPerItem: -1, totalPoints: -2 }
    ]
  },
  // 7B: 91 pts (-9 total)
  {
    id: 'sub-app-7b',
    weekId: 'w4',
    classId: '7B',
    redFlagId: 'cd-2',
    redFlagName: 'Trần Thị B',
    date: '2026-09-28',
    dayLabel: 'Thứ 2',
    area: 'Hành lang',
    content: 'Vệ sinh & Nề nếp',
    status: 'approved',
    submittedAt: '2026-09-28 11:40:00',
    approvedAt: '2026-09-28 14:15:00',
    approvedBy: 'Thầy Nguyễn Văn Minh',
    items: [
      { criteriaId: 'crit-vs-1', criteriaName: 'Không trực nhật', group: 'Vệ sinh', quantity: 1, pointsPerItem: -5, totalPoints: -5 },
      { criteriaId: 'crit-nn-1', criteriaName: 'Nói chuyện trong giờ', group: 'Nề nếp', quantity: 2, pointsPerItem: -2, totalPoints: -4 }
    ]
  },
  // 6A: 88 pts (-12 total)
  {
    id: 'sub-app-6a',
    weekId: 'w4',
    classId: '6A',
    redFlagId: 'cd-7',
    redFlagName: 'Vàng Thị Mai',
    date: '2026-09-29',
    dayLabel: 'Thứ 3',
    area: 'Sân trường',
    content: 'Trang phục & Đi học',
    status: 'approved',
    submittedAt: '2026-09-29 11:20:00',
    approvedAt: '2026-09-29 14:20:00',
    approvedBy: 'Thầy Nguyễn Văn Minh',
    items: [
      { criteriaId: 'crit-tp-1', criteriaName: 'Không đeo khăn quàng', group: 'Trang phục', quantity: 4, pointsPerItem: -1, totalPoints: -4 },
      { criteriaId: 'crit-dh-1', criteriaName: 'Đi học muộn', group: 'Đi học', quantity: 3, pointsPerItem: -2, totalPoints: -6 },
      { criteriaId: 'crit-vs-2', criteriaName: 'Xả rác bừa bãi', group: 'Vệ sinh', quantity: 1, pointsPerItem: -2, totalPoints: -2 }
    ]
  },
  // 7A: 86 pts (-14 total)
  {
    id: 'sub-app-7a-1',
    weekId: 'w4',
    classId: '7A',
    redFlagId: 'cd-1',
    redFlagName: 'Nguyễn Văn A',
    date: '2026-09-28',
    dayLabel: 'Thứ 2',
    area: 'Sân trường',
    content: 'Trang phục & Đi học',
    status: 'approved',
    submittedAt: '2026-09-28 11:25:00',
    approvedAt: '2026-09-28 14:25:00',
    approvedBy: 'Thầy Nguyễn Văn Minh',
    items: [
      { criteriaId: 'crit-tp-1', criteriaName: 'Không đeo khăn quàng', group: 'Trang phục', quantity: 3, pointsPerItem: -1, totalPoints: -3 },
      { criteriaId: 'crit-dh-1', criteriaName: 'Đi học muộn', group: 'Đi học', quantity: 2, pointsPerItem: -2, totalPoints: -4 },
      { criteriaId: 'crit-vs-1', criteriaName: 'Không trực nhật', group: 'Vệ sinh', quantity: 1, pointsPerItem: -5, totalPoints: -5 },
      { criteriaId: 'crit-nn-1', criteriaName: 'Nói chuyện trong giờ', group: 'Nề nếp', quantity: 1, pointsPerItem: -2, totalPoints: -2 }
    ]
  },
  // 8B: 83 pts (-17 total)
  {
    id: 'sub-app-8b',
    weekId: 'w4',
    classId: '8B',
    redFlagId: 'cd-4',
    redFlagName: 'Mùa A Dê',
    date: '2026-09-29',
    dayLabel: 'Thứ 3',
    area: 'Hành lang',
    content: 'Trang phục, Vệ sinh',
    status: 'approved',
    submittedAt: '2026-09-29 11:30:00',
    approvedAt: '2026-09-29 14:30:00',
    approvedBy: 'Thầy Nguyễn Văn Minh',
    items: [
      { criteriaId: 'crit-tp-1', criteriaName: 'Không đeo khăn quàng', group: 'Trang phục', quantity: 5, pointsPerItem: -1, totalPoints: -5 },
      { criteriaId: 'crit-dh-1', criteriaName: 'Đi học muộn', group: 'Đi học', quantity: 3, pointsPerItem: -2, totalPoints: -6 },
      { criteriaId: 'crit-vs-2', criteriaName: 'Xả rác bừa bãi', group: 'Vệ sinh', quantity: 3, pointsPerItem: -2, totalPoints: -6 }
    ]
  },
  // 6B: 80 pts (-20 total)
  {
    id: 'sub-app-6b',
    weekId: 'w4',
    classId: '6B',
    redFlagId: 'cd-8',
    redFlagName: 'Thào A Páo',
    date: '2026-09-28',
    dayLabel: 'Thứ 2',
    area: 'Hành lang',
    content: 'Vệ sinh & Nề nếp',
    status: 'approved',
    submittedAt: '2026-09-28 11:35:00',
    approvedAt: '2026-09-28 14:35:00',
    approvedBy: 'Thầy Nguyễn Văn Minh',
    items: [
      { criteriaId: 'crit-vs-1', criteriaName: 'Không trực nhật', group: 'Vệ sinh', quantity: 2, pointsPerItem: -5, totalPoints: -10 },
      { criteriaId: 'crit-nn-1', criteriaName: 'Nói chuyện trong giờ', group: 'Nề nếp', quantity: 3, pointsPerItem: -2, totalPoints: -6 },
      { criteriaId: 'crit-dh-1', criteriaName: 'Đi học muộn', group: 'Đi học', quantity: 2, pointsPerItem: -2, totalPoints: -4 }
    ]
  },
  // 9B: 79 pts (-21 total)
  {
    id: 'sub-app-9b',
    weekId: 'w4',
    classId: '9B',
    redFlagId: 'cd-6',
    redFlagName: 'Vàng A Sinh',
    date: '2026-09-29',
    dayLabel: 'Thứ 3',
    area: 'Sân trường',
    content: 'Trang phục & Hoạt động',
    status: 'approved',
    submittedAt: '2026-09-29 11:40:00',
    approvedAt: '2026-09-29 14:40:00',
    approvedBy: 'Thầy Nguyễn Văn Minh',
    items: [
      { criteriaId: 'crit-tp-1', criteriaName: 'Không đeo khăn quàng', group: 'Trang phục', quantity: 6, pointsPerItem: -1, totalPoints: -6 },
      { criteriaId: 'crit-td-1', criteriaName: 'Tập thể dục uể oải / thiếu người', group: 'Thể dục giữa giờ', quantity: 2, pointsPerItem: -3, totalPoints: -6 },
      { criteriaId: 'crit-dh-1', criteriaName: 'Đi học muộn', group: 'Đi học', quantity: 2, pointsPerItem: -2, totalPoints: -4 },
      { criteriaId: 'crit-nn-1', criteriaName: 'Nói chuyện trong giờ', group: 'Nề nếp', quantity: 2, pointsPerItem: -2, totalPoints: -4 },
      { criteriaId: 'crit-tp-3', criteriaName: 'Đi dép lê / không sơ vin', group: 'Trang phục', quantity: 1, pointsPerItem: -1, totalPoints: -1 }
    ]
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Tuần 4 đang diễn ra',
    message: 'Tuần 4 sẽ đóng vào Thứ 7 (04/10/2026). Các cờ đỏ khẩn trương hoàn thành nhập điểm.',
    time: '10 phút trước',
    type: 'warning',
    read: false,
    linkTab: 'approval'
  },
  {
    id: 'notif-2',
    title: 'Có 5 phiếu chờ duyệt',
    message: 'Cờ đỏ Nguyễn Văn A, Trần Thị B vừa gửi kết quả chấm ngày 30/09.',
    time: '25 phút trước',
    type: 'info',
    read: false,
    linkTab: 'approval'
  },
  {
    id: 'notif-3',
    title: 'Phân công trực tuần 4',
    message: 'Bạn Nguyễn Văn A được phân công chấm nề nếp lớp 7A tại Sân trường.',
    time: '2 ngày trước',
    type: 'success',
    read: true,
    linkTab: 'assignments'
  },
  {
    id: 'notif-4',
    title: 'Kết quả thi đua tuần 3 đã công bố',
    message: 'Chi đội 9A xuất sắc giành giải Nhất tuần 3 với 98 điểm.',
    time: '3 ngày trước',
    type: 'info',
    read: true,
    linkTab: 'rankings'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  { id: 'log-1', timestamp: '2026-09-30 11:55:12', userName: 'Nguyễn Văn Minh', userRole: 'Tổng phụ trách', action: 'Duyệt kết quả', details: 'Duyệt 1 phiếu chấm lớp 9A ngày 28/09 (-4 điểm)' },
  { id: 'log-2', timestamp: '2026-09-30 11:50:30', userName: 'Giàng Thị D', userRole: 'Cờ đỏ', action: 'Gửi kết quả chấm', details: 'Gửi kết quả chấm nề nếp lớp 9A (1 lỗi)' },
  { id: 'log-3', timestamp: '2026-09-30 11:42:08', userName: 'Lý Văn C', userRole: 'Cờ đỏ', action: 'Gửi kết quả chấm', details: 'Gửi kết quả chấm lớp 8A (1 lỗi nói chuyện)' },
  { id: 'log-4', timestamp: '2026-09-30 10:15:00', userName: 'Nguyễn Văn Minh', userRole: 'Tổng phụ trách', action: 'Yêu cầu sửa', details: 'Yêu cầu sửa phiếu của Vàng Thị Mai (Lớp 6A)' },
  { id: 'log-5', timestamp: '2026-09-28 07:30:00', userName: 'Nguyễn Văn Minh', userRole: 'Tổng phụ trách', action: 'Mở tuần mới', details: 'Mở chấm thi đua Tuần 4 (28/09 - 04/10/2026)' }
];

export const INITIAL_MINUTES: WeeklyMinutesReport = {
  weekId: 'w4',
  weekName: 'Tuần 4',
  dateRange: '28/09/2026 – 04/10/2026',
  advantages: `• Các lớp duy trì rất tốt nề nếp đi học đúng giờ, hát đầu giờ và tập thể dục giữa giờ nghiêm túc.
• Vệ sinh sân trường, lớp học cơ bản sạch sẽ, phong quang; khu vực bán trú ngăn nắp.
• Các chi đội 9A, 8A, 7B tiếp tục duy trì vị trí dẫn đầu trong phong trào học tập và nề nếp.
• Đội cờ đỏ làm việc trách nhiệm, ghi chép và gửi kết quả đúng khung giờ quy định.`,
  drawbacks: `• Một số lớp (7A, 8B, 6B) còn tình trạng học sinh quên đeo khăn quàng đỏ vào đầu tuần.
• Vẫn còn hiện tượng một vài học sinh nói chuyện riêng trong các tiết học buổi chiều.
• Vệ sinh khu vực hành lang tầng 2 dãy phòng học khối 6 còn sót rác giấy vụn.
• 02 lượt cờ đỏ nộp kết quả muộn và phải gửi yêu cầu rà soát bổ sung.`,
  generalComments: `Toàn trường đạt kết quả thi đua mức Tốt. Tỷ lệ hoàn thành nhiệm vụ cờ đỏ đạt 95%. Nề nếp bán trú ổn định, tinh thần đoàn kết và ý thức tự giác của các em học sinh có chuyển biến rõ rệt so với tuần trước.`,
  recommendations: `1. Các thầy cô Giáo viên chủ nhiệm tăng cường nhắc nhở học sinh đeo khăn quàng và đồng phục đúng quy định trước khi vào lớp.
2. Ban Chỉ huy Liên đội kiểm tra đột xuất nề nếp 15 phút truy bài đầu giờ của khối 6 và khối 7.
3. Biểu dương chi đội 9A và 8A trong buổi lễ Chào cờ đầu tuần tới.
4. Đội Cờ đỏ thực hiện xoay vòng ca trực tuần 5 theo phân công tự động mới.`,
  preparedBy: 'Nguyễn Văn Minh - Tổng phụ trách Đội',
  approvedBy: 'Trần Đình Hùng - Hiệu trưởng',
  dateCreated: '2026-10-01'
};
