import React from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  GraduationCap,
  Users,
  Flag,
  ClipboardCheck,
  SlidersHorizontal,
  AlertTriangle,
  Edit3,
  CheckSquare,
  Trophy,
  BarChart3,
  History,
  FileText,
  Settings,
  ShieldAlert,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Sidebar: React.FC<{ onCloseMobile?: () => void }> = ({ onCloseMobile }) => {
  const { activeTab, setActiveTab, kpiStats, currentUser } = useApp();

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Tổng quan',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'weeks',
      label: 'Quản lý tuần',
      icon: CalendarDays,
      badge: null
    },
    {
      id: 'classes',
      label: 'Quản lý lớp',
      icon: GraduationCap,
      badge: null
    },
    {
      id: 'user_management',
      label: 'Cấp & sửa tài khoản',
      icon: Users,
      badge: 'Admin',
      badgeColor: 'bg-amber-500'
    },
    {
      id: 'red_flags',
      label: 'Quản lý cờ đỏ',
      icon: Flag,
      badge: null
    },
    {
      id: 'assignments',
      label: 'Phân công trực tuần',
      icon: ClipboardCheck,
      badge: null
    },
    {
      id: 'criteria',
      label: 'Tiêu chí chấm điểm',
      icon: SlidersHorizontal,
      badge: null
    },
    {
      id: 'violations_catalog',
      label: 'Danh mục lỗi vi phạm',
      icon: AlertTriangle,
      badge: null
    },
    {
      id: 'red_flag_input',
      label: 'Nhập kết quả chấm',
      icon: Edit3,
      badge: currentUser?.role === 'red_flag' ? 'Cờ đỏ' : null,
      badgeColor: 'bg-emerald-500'
    },
    {
      id: 'approval',
      label: 'Duyệt kết quả',
      icon: CheckSquare,
      badge: kpiStats.pendingApprovalCount > 0 ? kpiStats.pendingApprovalCount : null,
      badgeColor: 'bg-amber-500'
    },
    {
      id: 'rankings',
      label: 'Xếp hạng thi đua',
      icon: Trophy,
      badge: null
    },
    {
      id: 'reports',
      label: 'Thống kê – Báo cáo',
      icon: BarChart3,
      badge: null
    },
    {
      id: 'class_history',
      label: 'Lịch sử vi phạm lớp',
      icon: History,
      badge: null
    },
    {
      id: 'minutes',
      label: 'Biên bản trực tuần',
      icon: FileText,
      badge: null
    },
    {
      id: 'settings',
      label: 'Cấu hình hệ thống',
      icon: Settings,
      badge: 'Admin',
      badgeColor: 'bg-indigo-600'
    }
  ];

  const handleSelect = (id: string) => {
    setActiveTab(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <aside className="w-64 bg-[#0d3466] text-slate-100 flex flex-col h-full shadow-xl select-none print:hidden border-r border-[#1a4884]">
      {/* Sidebar Header Title */}
      <div className="px-4 py-3.5 border-b border-[#1b4884]/60 bg-[#0a2952]/40 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="h-6 w-1.5 bg-cyan-400 rounded-full" />
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-200">
            QUẢN LÝ THI ĐUA NỀ NẾP
          </span>
        </div>
      </div>

      {/* Menu List */}
      <div className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5 custom-scrollbar">
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all text-left group ${
                isActive
                  ? 'bg-[#1b539c] text-white shadow-sm font-semibold border-l-4 border-cyan-400'
                  : 'text-blue-100/80 hover:bg-[#15427d] hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3 min-w-0">
                <Icon
                  className={`h-4 w-4 shrink-0 transition-colors ${
                    isActive ? 'text-cyan-300' : 'text-blue-300 group-hover:text-white'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge !== null && (
                <span
                  className={`ml-2 px-1.5 py-0.5 text-[10px] font-bold rounded-full text-white shrink-0 ${
                    item.badgeColor || 'bg-blue-500'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Footer Info */}
      <div className="p-3 border-t border-[#1b4884]/60 bg-[#09284f]/60 text-[11px] text-blue-200/80">
        <div className="flex items-center justify-between mb-1">
          <span className="font-semibold text-white">Năm học 2026 - 2027</span>
          <span className="rounded bg-cyan-500/20 px-1.5 py-0.2 text-[10px] text-cyan-300 font-bold">HK I</span>
        </div>
        <div className="flex items-center justify-between text-[10px] text-blue-300/70">
          <span>PTDTBT Quản Bạ</span>
          <button
            onClick={() => handleSelect('audit_logs')}
            className="hover:text-cyan-300 underline cursor-pointer"
          >
            Nhật ký
          </button>
        </div>
      </div>
    </aside>
  );
};
