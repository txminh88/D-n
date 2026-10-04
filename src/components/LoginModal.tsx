import React, { useState } from 'react';
import {
  X,
  Eye,
  EyeOff,
  Lock,
  User,
  Shield,
  AlertCircle,
  CheckCircle2,
  LogIn
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

export const LoginModal: React.FC = () => {
  const { loginModalOpen, setLoginModalOpen, login, currentUser, isAuthenticated } = useApp();

  const [username, setUsername] = useState('tongphutrach');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState<UserRole>('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // If user is not authenticated, the login screen is always open/required!
  const isForcedLogin = !currentUser || !isAuthenticated;
  const isVisible = loginModalOpen || isForcedLogin;

  if (!isVisible) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const res = login(username, password, role);
    if (!res.success) {
      setErrorMsg(res.message || 'Đăng nhập không thành công!');
      return;
    }

    setLoginModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#071d3a]/80 backdrop-blur-md flex items-center justify-center p-4">
      {/* Modal matching Panel 1 from image */}
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 sm:p-8 shadow-2xl relative border border-slate-100 animate-in zoom-in-95 duration-200">
        {/* Only allow closing if already logged in */}
        {!isForcedLogin && (
          <button
            onClick={() => setLoginModalOpen(false)}
            className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100"
            title="Đóng"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {/* School Emblem from Panel 1 */}
        <div className="flex flex-col items-center text-center space-y-2 pb-2">
          <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-red-600 via-amber-500 to-blue-600 p-1 shadow-lg ring-4 ring-blue-50">
            <div className="h-full w-full rounded-full bg-white flex items-center justify-center text-lg font-black text-blue-700">
              QB★
            </div>
          </div>

          <h2 className="text-base font-black tracking-tight text-slate-900 uppercase">
            QUẢN LÝ THI ĐUA NỀ NẾP
          </h2>
          <p className="text-xs text-slate-500 font-semibold">
            Trường PTDTBT TH&THCS Quản Bạ
          </p>
          <div className="inline-block rounded-full bg-blue-50 px-3 py-0.5 text-[11px] font-bold text-blue-700 border border-blue-200">
            Đăng nhập hệ thống
          </div>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="p-3 my-2 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700 flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form from Panel 1 */}
        <form onSubmit={handleSubmit} className="space-y-3.5 pt-2 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Tên đăng nhập</label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={e => {
                  setUsername(e.target.value);
                  setErrorMsg(null);
                }}
                placeholder="Nhập tên đăng nhập"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-slate-800 placeholder-slate-400 focus:border-blue-600 focus:outline-none font-medium"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Mật khẩu</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  setErrorMsg(null);
                }}
                placeholder="Nhập mật khẩu"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-slate-800 placeholder-slate-400 focus:border-blue-600 focus:outline-none pr-10 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Vai trò</label>
            <select
              value={role}
              onChange={e => setRole(e.target.value as UserRole)}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-slate-800 font-bold focus:border-blue-600 focus:outline-none cursor-pointer bg-slate-50/50"
            >
              <option value="admin">Tổng phụ trách / Ban Giám hiệu</option>
              <option value="teacher">Giáo viên chủ nhiệm</option>
              <option value="red_flag">Học sinh Cờ đỏ</option>
              <option value="student">Đại diện Lớp học</option>
            </select>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center space-x-2 text-slate-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Ghi nhớ đăng nhập</span>
            </label>
            <a
              href="#forgot"
              onClick={e => {
                e.preventDefault();
                alert('Vui lòng liên hệ Quản trị viên (Thầy Nguyễn Văn Minh) để được cấp lại mật khẩu.');
              }}
              className="text-blue-600 hover:underline font-semibold"
            >
              Quên mật khẩu?
            </a>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#1a56db] hover:bg-[#1546b3] text-white font-black uppercase tracking-wider text-xs shadow-md transition-all cursor-pointer flex items-center justify-center space-x-2 active:scale-[0.98]"
          >
            <LogIn className="h-4 w-4" />
            <span>ĐĂNG NHẬP</span>
          </button>
        </form>

        <div className="pt-4 mt-3 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400">
            Hệ thống Quản lý thi đua nề nếp học sinh © 2026 - 2027
          </p>
        </div>
      </div>
    </div>
  );
};
