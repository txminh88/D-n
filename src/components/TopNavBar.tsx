import React from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  GraduationCap,
  Users,
  Flag,
  ClipboardCheck,
  AlertTriangle,
  Edit3,
  CheckSquare,
  Trophy,
  BarChart3,
  History,
  FileText,
  Settings,
  Calendar,
  ChevronDown,
  Database
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const TopNavBar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    kpiStats,
    currentUser,
    academicYears,
    selectedAcademicYear,
    setSelectedAcademicYear,
    activeWeek,
    supabaseStatus
  } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'weeks', label: 'Quản lý tuần', icon: CalendarDays },
    { id: 'classes', label: 'Quản lý lớp', icon: GraduationCap },
    {
      id: 'user_management',
      label: 'Cấp & sửa tài khoản',
      icon: Users,
      badge: 'Admin',
      badgeColor: 'bg-amber-500'
    },
    { id: 'red_flags', label: 'Đội cờ đỏ', icon: Flag },
    { id: 'assignments', label: 'Phân công trực', icon: ClipboardCheck },
    { id: 'violations_catalog', label: 'Danh mục lỗi', icon: AlertTriangle },
    {
      id: 'red_flag_input',
      label: 'Nhập điểm chấm',
      icon: Edit3,
      badge: currentUser?.role === 'red_flag' ? 'Cờ đỏ' : null,
      badgeColor: 'bg-emerald-500'
    },
    {
      id: 'approval',
      label: 'Duyệt kết quả',
      icon: CheckSquare,
      badge: kpiStats.pendingApprovalCount > 0 ? kpiStats.pendingApprovalCount : null,
      badgeColor: 'bg-rose-500'
    },
    { id: 'rankings', label: 'Xếp hạng thi đua', icon: Trophy },
    { id: 'reports', label: 'Thống kê - Báo cáo', icon: BarChart3 },
    { id: 'class_history', label: 'Lịch sử lớp', icon: History },
    { id: 'minutes', label: 'Biên bản trực', icon: FileText },
    {
      id: 'settings',
      label: 'Cấu hình hệ thống',
      icon: Settings,
      badge: 'Admin',
      badgeColor: 'bg-indigo-600'
    }
  ];

  return (
    <nav className="bg-[#0e3b74] text-white border-b border-[#1b4b8a] shadow-xs select-none sticky top-0 z-20 print:hidden">
      <div className="mx-auto px-2 sm:px-4 flex items-center justify-between overflow-x-auto no-scrollbar gap-2 py-1.5">
        {/* Left: Horizontal Menu Items (Các chức năng, danh mục đặt ở trên) */}
        <div className="flex items-center space-x-1 shrink-0 overflow-x-auto custom-scrollbar py-0.5">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-white text-blue-900 shadow-sm font-bold'
                    : 'text-blue-100 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon
                  className={`h-3.5 w-3.5 shrink-0 ${
                    isActive ? 'text-blue-700' : 'text-cyan-300'
                  }`}
                />
                <span>{item.label}</span>
                {item.badge !== null && item.badge !== undefined && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 text-[9px] font-black rounded-full text-white ${
                      item.badgeColor || 'bg-blue-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right: Academic Year Selector for Admin & Active Week Indicator */}
        <div className="flex items-center space-x-2 shrink-0 pl-2 border-l border-blue-800/80">
          {/* Admin Academic Year Selector */}
          <div className="flex items-center space-x-1.5 bg-[#0a2952]/70 hover:bg-[#0a2952] border border-cyan-400/40 px-2.5 py-1 rounded-lg text-xs transition-colors">
            <Calendar className="h-3.5 w-3.5 text-cyan-300 shrink-0" />
            <span className="text-[11px] text-blue-200 hidden md:inline font-medium">Năm học:</span>
            <select
              value={selectedAcademicYear}
              onChange={e => setSelectedAcademicYear(e.target.value)}
              className="bg-transparent font-bold text-white text-xs focus:outline-none cursor-pointer pr-1"
              title="Chọn năm học làm việc (Dành cho Quản trị viên)"
            >
              {academicYears.map(year => (
                <option key={year} value={year} className="bg-slate-900 text-white">
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Active Week Tag */}
          <span className="hidden sm:inline-block bg-cyan-500/20 text-cyan-200 font-bold px-2 py-1 rounded-md text-[11px] border border-cyan-400/30 whitespace-nowrap">
            {activeWeek?.name}
          </span>

          {/* Supabase Cloud Status Indicator */}
          <button
            onClick={() => setActiveTab('settings')}
            title={`Supabase Cloud Database: ${
              supabaseStatus === 'connected' ? 'Đã kết nối thành công' :
              supabaseStatus === 'error' ? 'Cần kiểm tra kết nối' : 'Đang kết nối'
            }`}
            className="flex items-center space-x-1.5 bg-[#0a2952]/70 hover:bg-[#0a2952] border border-emerald-400/40 px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer"
          >
            <Database className="h-3.5 w-3.5 text-emerald-400" />
            <span className="hidden xl:inline text-[11px] font-semibold text-emerald-300">Supabase</span>
            <span
              className={`h-2 w-2 rounded-full ${
                supabaseStatus === 'connected'
                  ? 'bg-emerald-400 animate-pulse'
                  : supabaseStatus === 'error'
                  ? 'bg-rose-400'
                  : 'bg-amber-400'
              }`}
            />
          </button>
        </div>
      </div>
    </nav>
  );
};
