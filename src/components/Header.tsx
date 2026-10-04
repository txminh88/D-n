import React, { useState } from 'react';
import {
  Shield,
  Gauge,
  Landmark,
  Scale,
  Clock,
  Bell,
  Smartphone,
  ChevronDown,
  UserCheck,
  LogIn,
  LogOut,
  Sparkles,
  School,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

export const Header: React.FC<{ onToggleMobileNav?: () => void }> = ({ onToggleMobileNav }) => {
  const {
    currentUser,
    logout,
    setMobileSimulatorOpen,
    setLoginModalOpen,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setActiveTab,
    kpiStats
  } = useApp();

  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const unreadNotifs = notifications.filter(n => !n.read);

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?')) {
      logout();
    }
  };

  return (
    <header className="relative z-30 bg-gradient-to-r from-[#174db9] via-[#1a56db] to-[#123e98] text-white shadow-md print:hidden">
      <div className="mx-auto flex h-20 items-center justify-between px-3 md:px-6">
        {/* Left: Mobile hamburger + School Crest + Title */}
        <div className="flex items-center space-x-3 md:space-x-4">
          {/* Mobile hamburger */}
          <button
            onClick={onToggleMobileNav}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 lg:hidden text-white focus:outline-none"
            aria-label="Menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* School Emblem / Circular Crest */}
          <div className="relative flex h-13 w-13 shrink-0 items-center justify-center rounded-full bg-white p-1 shadow-lg ring-2 ring-amber-300">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-tr from-red-600 via-yellow-500 to-blue-600 text-white font-bold text-xs shadow-inner overflow-hidden">
              {/* Stylized Vietnamese School Emblem */}
              <div className="flex flex-col items-center justify-center leading-none text-center">
                <span className="text-[9px] font-black tracking-tight text-white drop-shadow">QB</span>
                <span className="text-[10px] text-yellow-300">★</span>
              </div>
            </div>
            {/* Red scarf mini badge */}
            <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] text-white font-bold shadow ring-1 ring-white">
              Đ
            </div>
          </div>

          {/* Title & School Name */}
          <div className="flex flex-col">
            <h1 className="text-base sm:text-lg md:text-xl font-extrabold tracking-wide uppercase text-white drop-shadow-sm flex items-center gap-2">
              QUẢN LÝ THI ĐUA NỀ NẾP HỌC SINH
            </h1>
            <p className="text-xs sm:text-sm font-semibold tracking-wider text-blue-100 uppercase opacity-95">
              TRƯỜNG PTDTBT TH&THCS QUẢN BẠ
            </p>
          </div>
        </div>

        {/* Center-Right Badges from Image: Hiệu quả, Minh bạch, Công bằng, Kịp thời */}
        <div className="hidden xl:flex items-center space-x-3 text-white/90">
          <div className="flex items-center space-x-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-xs hover:bg-white/15 transition-all">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-cyan-200">
              <Gauge className="h-3.5 w-3.5" />
            </div>
            <span>Hiệu quả</span>
          </div>

          <div className="flex items-center space-x-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-xs hover:bg-white/15 transition-all">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-blue-200">
              <Landmark className="h-3.5 w-3.5" />
            </div>
            <span>Minh bạch</span>
          </div>

          <div className="flex items-center space-x-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-xs hover:bg-white/15 transition-all">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-emerald-200">
              <Scale className="h-3.5 w-3.5" />
            </div>
            <span>Công bằng</span>
          </div>

          <div className="flex items-center space-x-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-xs hover:bg-white/15 transition-all">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-amber-200">
              <Clock className="h-3.5 w-3.5" />
            </div>
            <span>Kịp thời</span>
          </div>
        </div>

        {/* Right Section: Student Illustration Banner + Simulator + Notification + Avatar */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Vietnamese Student Illustration Graphic from Reference Image */}
          <div className="hidden 2xl:flex items-center pr-2">
            <div className="flex items-center gap-1.5 bg-blue-900/40 rounded-xl px-2.5 py-1 ring-1 ring-white/15">
              <div className="flex -space-x-2 overflow-hidden">
                <div className="inline-block h-7 w-7 rounded-full bg-amber-400 ring-2 ring-white flex items-center justify-center text-xs font-bold text-slate-800">
                  👦
                </div>
                <div className="inline-block h-7 w-7 rounded-full bg-emerald-400 ring-2 ring-white flex items-center justify-center text-xs font-bold text-slate-800">
                  👧
                </div>
                <div className="inline-block h-7 w-7 rounded-full bg-rose-500 ring-2 ring-white flex items-center justify-center text-xs text-white">
                  🇻🇳
                </div>
              </div>
              <span className="text-[11px] font-medium text-blue-100 hidden 2xl:inline">
                Đội TNTP Hồ Chí Minh
              </span>
            </div>
          </div>

          {/* Phone Simulator Button */}
          <button
            onClick={() => setMobileSimulatorOpen(true)}
            className="flex items-center space-x-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 ring-1 ring-cyan-400/40 px-2.5 py-1.5 text-xs font-medium transition-all shadow-xs"
            title="Mở giao diện điện thoại dành cho học sinh Cờ đỏ"
          >
            <Smartphone className="h-4 w-4" />
            <span className="hidden sm:inline">Mô phỏng ĐT Cờ Đỏ</span>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setNotifDropdownOpen(!notifDropdownOpen);
              }}
              className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Thông báo"
            >
              <Bell className="h-4.5 w-4.5" />
              {unreadNotifs.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow ring-2 ring-white">
                  {unreadNotifs.length}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {notifDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-white text-slate-800 shadow-2xl ring-1 ring-black/10 py-2 z-50">
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-blue-600" />
                    <span className="font-bold text-sm text-slate-900">Thông báo hệ thống</span>
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
                      {unreadNotifs.length} mới
                    </span>
                  </div>
                  {unreadNotifs.length > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Đã đọc tất cả
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-500">
                      Không có thông báo mới
                    </div>
                  ) : (
                    notifications.map(notif => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          markNotificationAsRead(notif.id);
                          if (notif.linkTab) setActiveTab(notif.linkTab);
                          setNotifDropdownOpen(false);
                        }}
                        className={`p-3 transition-colors hover:bg-blue-50/50 cursor-pointer ${
                          !notif.read ? 'bg-blue-50/30' : ''
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <div className="mt-0.5">
                            {notif.type === 'warning' ? (
                              <AlertCircle className="h-4 w-4 text-amber-500" />
                            ) : notif.type === 'success' ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            ) : (
                              <Bell className="h-4 w-4 text-blue-500" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-900">{notif.title}</p>
                            <p className="text-xs text-slate-600 line-clamp-2 mt-0.5">{notif.message}</p>
                            <span className="text-[10px] text-slate-400 mt-1 block">{notif.time}</span>
                          </div>
                          {!notif.read && (
                            <span className="h-2 w-2 rounded-full bg-blue-600 mt-1.5" />
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Account Info */}
          {currentUser && (
            <div className="flex items-center space-x-2 rounded-lg bg-white/10 p-1.5 pr-2.5 text-left">
              <div className="relative">
                <img
                  src={
                    currentUser.avatar ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
                  }
                  alt={currentUser.name}
                  className="h-8 w-8 rounded-full object-cover ring-2 ring-white/60 shadow-xs"
                />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-[#1a56db]" />
              </div>
              <div className="hidden md:block leading-tight text-left">
                <span className="block text-xs font-bold text-white truncate max-w-[130px]">
                  {currentUser.roleTitle || 'Thành viên'}
                </span>
                <span className="block text-[11px] text-blue-200 truncate max-w-[130px]">
                  {currentUser.name}
                </span>
              </div>
            </div>
          )}

          {/* Cặp nút Đăng nhập & Đăng xuất đặt cạnh nhau */}
          <div className="flex items-center space-x-1.5">
            {/* Nút Đăng nhập */}
            <button
              onClick={() => setLoginModalOpen(true)}
              className="flex items-center space-x-1.5 rounded-lg bg-emerald-600/90 hover:bg-emerald-700 text-white px-3 py-1.5 text-xs font-bold transition-all shadow-sm border border-emerald-400/40 cursor-pointer active:scale-95"
              title="Đăng nhập tài khoản khác hoặc xác thực lại"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Đăng nhập</span>
            </button>

            {/* Nút Đăng xuất */}
            {currentUser && (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1.5 rounded-lg bg-rose-600/90 hover:bg-rose-700 text-white px-3 py-1.5 text-xs font-bold transition-all shadow-sm border border-rose-400/40 cursor-pointer active:scale-95"
                title="Đăng xuất khỏi hệ thống"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Đăng xuất</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
