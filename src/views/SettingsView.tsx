import React, { useState } from 'react';
import {
  Settings,
  Save,
  RotateCcw,
  CheckCircle2,
  School,
  Sliders,
  Calendar,
  Shield,
  Plus,
  Sparkles,
  UserCheck,
  Check,
  Clock,
  Layers,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AccountPermissions, User, UserRole } from '../types';

export const SettingsView: React.FC = () => {
  const {
    settings,
    updateSettings,
    resetToDefaultData,
    academicYears,
    selectedAcademicYear,
    setSelectedAcademicYear,
    addAcademicYear,
    generateWeeksForYear,
    users,
    updateUserPermissions,
    currentUser
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'calendar' | 'permissions' | 'rules' | 'school'>('calendar');

  // School info & rules form
  const [formData, setFormData] = useState({
    schoolName: settings.schoolName,
    schoolSubTitle: settings.schoolSubTitle,
    academicYear: settings.academicYear || selectedAcademicYear,
    chiefOfficerName: settings.chiefOfficerName,
    principalName: settings.principalName,
    baseScore: settings.baseScore,
    allowEditAfterSubmit: settings.allowEditAfterSubmit,
    requireApproval: settings.requireApproval,
    systemNotifications: settings.systemNotifications,
    autoLockOnSunday: settings.autoLockOnSunday,
    goodThreshold: settings.goodThreshold,
    fairThreshold: settings.fairThreshold,
    passThreshold: settings.passThreshold,
    startDate: settings.startDate || '2026-09-07',
    startWeekNumber: settings.startWeekNumber || 1,
    totalWeeksCount: settings.totalWeeksCount || 35
  });

  // New academic year input
  const [newYearInput, setNewYearInput] = useState('');

  // Selected user for permission editing
  const [selectedUserId, setSelectedUserId] = useState<string>(users[0]?.id || '');
  const targetUser = users.find(u => u.id === selectedUserId) || users[0];

  // Permissions state for target user
  const [userPerms, setUserPerms] = useState<AccountPermissions>({
    canApprove: targetUser?.permissions?.canApprove ?? (targetUser?.role === 'admin'),
    canScore: targetUser?.permissions?.canScore ?? (targetUser?.role === 'admin' || targetUser?.role === 'red_flag'),
    canViewReports: targetUser?.permissions?.canViewReports ?? true,
    canLockWeeks: targetUser?.permissions?.canLockWeeks ?? (targetUser?.role === 'admin'),
    canManageCriteria: targetUser?.permissions?.canManageCriteria ?? (targetUser?.role === 'admin'),
    canManageUsers: targetUser?.permissions?.canManageUsers ?? (targetUser?.role === 'admin'),
    canExport: targetUser?.permissions?.canExport ?? (targetUser?.role === 'admin' || targetUser?.role === 'teacher'),
    canEditSettings: targetUser?.permissions?.canEditSettings ?? (targetUser?.role === 'admin')
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // When selected user changes, reload their permissions
  const handleSelectUser = (id: string) => {
    setSelectedUserId(id);
    const u = users.find(x => x.id === id);
    if (u) {
      setUserPerms({
        canApprove: u.permissions?.canApprove ?? (u.role === 'admin'),
        canScore: u.permissions?.canScore ?? (u.role === 'admin' || u.role === 'red_flag'),
        canViewReports: u.permissions?.canViewReports ?? true,
        canLockWeeks: u.permissions?.canLockWeeks ?? (u.role === 'admin'),
        canManageCriteria: u.permissions?.canManageCriteria ?? (u.role === 'admin'),
        canManageUsers: u.permissions?.canManageUsers ?? (u.role === 'admin'),
        canExport: u.permissions?.canExport ?? (u.role === 'admin' || u.role === 'teacher'),
        canEditSettings: u.permissions?.canEditSettings ?? (u.role === 'admin')
      });
    }
  };

  const handleAddNewAcademicYear = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newYearInput.trim()) return;
    const formatted = newYearInput.trim();
    if (academicYears.includes(formatted)) {
      alert('Năm học này đã có trong hệ thống!');
      return;
    }
    addAcademicYear(formatted);
    setSelectedAcademicYear(formatted);
    setFormData(prev => ({ ...prev, academicYear: formatted }));
    setNewYearInput('');
    showToast(`Đã thêm thành công năm học mới: ${formatted}`);
  };

  const handleGenerateWeeks = () => {
    if (window.confirm(`Bạn có chắc chắn muốn khởi tạo kế hoạch ${formData.totalWeeksCount} tuần học cho năm học ${selectedAcademicYear} từ ngày ${formData.startDate}?`)) {
      generateWeeksForYear(
        selectedAcademicYear,
        formData.startDate,
        formData.startWeekNumber,
        formData.totalWeeksCount
      );
      showToast(`Đã tự động khởi tạo ${formData.totalWeeksCount} tuần học thành công!`);
    }
  };

  const handleSavePermissions = () => {
    if (!targetUser) return;
    updateUserPermissions(targetUser.id, userPerms);
    showToast(`Đã lưu cấp quyền thành công cho tài khoản: ${targetUser.username} (${targetUser.name})`);
  };

  const handleSaveGeneralSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    showToast('Đã lưu cấu hình hệ thống thành công!');
  };

  const handleReset = () => {
    if (
      window.confirm(
        'Bạn có chắc chắn muốn đặt lại toàn bộ dữ liệu về trạng thái mẫu ban đầu? Thao tác này sẽ làm mới toàn bộ tuần, lớp và điểm số.'
      )
    ) {
      resetToDefaultData();
      showToast('Đã khôi phục dữ liệu mẫu ban đầu thành công!');
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
              Cấu hình hệ thống
            </h2>
            <span className="rounded-md bg-blue-50 px-2.5 py-0.5 text-xs font-black text-blue-700 border border-blue-200">
              Quyền Quản trị viên
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Thiết lập năm học, ngày/tuần bắt đầu học, số tuần học, cấp quyền cho các tài khoản và quy chế thi đua
          </p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center space-x-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 px-3 py-1.5 text-xs font-bold transition-colors shadow-xs self-start sm:self-auto cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Khôi phục dữ liệu mẫu</span>
        </button>
      </div>

      {toastMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sub-tab Navigator inside Cấu hình hệ thống */}
      <div className="flex rounded-xl bg-slate-200/70 p-1 overflow-x-auto text-xs font-bold gap-1">
        <button
          onClick={() => setActiveSubTab('calendar')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'calendar'
              ? 'bg-white text-blue-700 shadow-xs font-black'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Calendar className="h-4 w-4" />
          <span>Năm học & Kế hoạch tuần học</span>
        </button>

        <button
          onClick={() => setActiveSubTab('permissions')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'permissions'
              ? 'bg-white text-blue-700 shadow-xs font-black'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Shield className="h-4 w-4" />
          <span>Cấp quyền cho các tài khoản</span>
        </button>

        <button
          onClick={() => setActiveSubTab('rules')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'rules'
              ? 'bg-white text-blue-700 shadow-xs font-black'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sliders className="h-4 w-4" />
          <span>Quy chế thi đua & Điểm số</span>
        </button>

        <button
          onClick={() => setActiveSubTab('school')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'school'
              ? 'bg-white text-blue-700 shadow-xs font-black'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <School className="h-4 w-4" />
          <span>Thông tin trường học</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: CẤU HÌNH NĂM HỌC, NGÀY, TUẦN BẮT ĐẦU, SỐ TUẦN HỌC */}
      {/* ======================================================== */}
      {activeSubTab === 'calendar' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Box 1: Thêm năm học mới & Chọn năm học làm việc */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-2.5">
                <Calendar className="h-4 w-4 text-blue-600" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                  1. THÊM NĂM HỌC & NĂM HỌC LÀM VIỆC
                </h3>
              </div>

              {/* Form thêm năm học mới */}
              <form onSubmit={handleAddNewAcademicYear} className="space-y-2 text-xs">
                <label className="font-bold text-slate-700 block">Thêm năm học mới vào hệ thống:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={newYearInput}
                    onChange={e => setNewYearInput(e.target.value)}
                    placeholder="Ví dụ: 2027 - 2028"
                    className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-slate-800 font-bold focus:border-blue-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="flex items-center space-x-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    <span>+ Thêm năm</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  Định dạng chuẩn: YYYY - YYYY (ví dụ: 2026 - 2027, 2027 - 2028)
                </p>
              </form>

              {/* Danh sách năm học hiện có */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <span className="text-xs font-bold text-slate-700 block">
                  Danh sách năm học & chọn năm học đang làm việc:
                </span>
                <div className="space-y-1.5">
                  {academicYears.map(year => (
                    <div
                      key={year}
                      className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                        year === selectedAcademicYear
                          ? 'bg-blue-50/70 border-blue-300 text-blue-900 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span>{year}</span>
                        {year === selectedAcademicYear && (
                          <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Đang áp dụng
                          </span>
                        )}
                      </div>

                      {year !== selectedAcademicYear && (
                        <button
                          onClick={() => {
                            setSelectedAcademicYear(year);
                            setFormData(prev => ({ ...prev, academicYear: year }));
                            showToast(`Đã chuyển sang năm học: ${year}`);
                          }}
                          className="px-2.5 py-1 rounded bg-white hover:bg-blue-50 border border-slate-300 text-[11px] font-semibold text-blue-700 cursor-pointer"
                        >
                          Chọn áp dụng
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Box 2: Cấu hình ngày, tuần bắt đầu học, số tuần học */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 border-b border-slate-100 pb-2.5">
                  <Clock className="h-4 w-4 text-emerald-600" />
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                    2. NGÀY BẮT ĐẦU, TUẦN BẮT ĐẦU & SỐ TUẦN HỌC
                  </h3>
                </div>

                <div className="space-y-3.5 pt-2 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Năm học đang cấu hình
                    </label>
                    <div className="p-2 rounded-lg bg-blue-50/80 border border-blue-200 font-black text-blue-800">
                      {selectedAcademicYear}
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Ngày bắt đầu học (Thứ 2 của tuần 1)
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 font-semibold focus:border-blue-500 focus:outline-none bg-slate-50"
                    />
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      Thường là ngày Thứ 2 đầu tiên của tháng 9 (sau lễ khai giảng)
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Tuần bắt đầu học
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={10}
                        required
                        value={formData.startWeekNumber}
                        onChange={e => setFormData({ ...formData, startWeekNumber: parseInt(e.target.value) || 1 })}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 font-bold focus:border-blue-500 focus:outline-none"
                      />
                      <span className="text-[10px] text-slate-400">Mặc định: Tuần 1</span>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Số tuần học trong năm
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={50}
                        required
                        value={formData.totalWeeksCount}
                        onChange={e => setFormData({ ...formData, totalWeeksCount: parseInt(e.target.value) || 35 })}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 font-bold focus:border-blue-500 focus:outline-none"
                      />
                      <span className="text-[10px] text-slate-400">Chuẩn Bộ GD&ĐT: 35 tuần</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button: Sinh kế hoạch tuần */}
              <div className="pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleGenerateWeeks}
                  className="w-full flex items-center justify-center space-x-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white py-3 text-xs font-black uppercase tracking-wider shadow-md transition-all cursor-pointer active:scale-[0.98]"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>⚡ Tự động tạo / Cập nhật {formData.totalWeeksCount} tuần học</span>
                </button>
                <p className="text-[11px] text-center text-slate-500 mt-2">
                  Hệ thống sẽ tự động tính toán ngày bắt đầu và kết thúc cho từng tuần từ tuần {formData.startWeekNumber} đến tuần {formData.totalWeeksCount}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: CẤP QUYỀN CHO CÁC TÀI KHOẢN KHÁC (ROLES & PERMISSIONS) */}
      {/* ======================================================== */}
      {activeSubTab === 'permissions' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <span>Cấp quyền cho các tài khoản thành viên</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Chọn tài khoản để phân quyền chức năng cụ thể (Duyệt kết quả, chấm điểm, khóa tuần, báo cáo...)
                </p>
              </div>

              {/* Account Selector */}
              <div className="flex items-center space-x-2 text-xs">
                <span className="font-bold text-slate-700">Tài khoản:</span>
                <select
                  value={selectedUserId}
                  onChange={e => handleSelectUser(e.target.value)}
                  className="rounded-lg border border-blue-300 bg-blue-50 px-3 py-1.5 font-bold text-blue-800 focus:outline-none cursor-pointer"
                >
                  {users.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.username}) – {u.roleTitle || u.role}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Target User Info Badge */}
            {targetUser && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div>
                  <span className="text-slate-500">Đang cấp quyền cho:</span>{' '}
                  <strong className="text-slate-900 font-extrabold">{targetUser.name}</strong> ({targetUser.username})
                  <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                    {targetUser.roleTitle || targetUser.role}
                  </span>
                </div>
                <div className="text-slate-500">
                  Chi đội: <strong>{targetUser.assignedClass || 'Toàn trường'}</strong> | Trạng thái:{' '}
                  <strong className={targetUser.status === 'active' ? 'text-emerald-600' : 'text-rose-600'}>
                    {targetUser.status === 'active' ? 'Hoạt động' : 'Đã khóa'}
                  </strong>
                </div>
              </div>
            )}

            {/* Granular Permissions Checkbox Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <label className="p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={userPerms.canApprove}
                  onChange={e => setUserPerms({ ...userPerms, canApprove: e.target.checked })}
                  className="h-4 w-4 mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="font-bold text-xs text-slate-800 block">Duyệt kết quả chấm nề nếp</span>
                  <span className="text-[11px] text-slate-500 block">
                    Cho phép phê duyệt hoặc gửi yêu cầu sửa phiếu chấm của cờ đỏ
                  </span>
                </div>
              </label>

              <label className="p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={userPerms.canScore}
                  onChange={e => setUserPerms({ ...userPerms, canScore: e.target.checked })}
                  className="h-4 w-4 mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="font-bold text-xs text-slate-800 block">Nhập điểm chấm thi đua</span>
                  <span className="text-[11px] text-slate-500 block">
                    Quyền lập phiếu chấm điểm, ghi nhận vi phạm của các chi đội
                  </span>
                </div>
              </label>

              <label className="p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={userPerms.canLockWeeks}
                  onChange={e => setUserPerms({ ...userPerms, canLockWeeks: e.target.checked })}
                  className="h-4 w-4 mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="font-bold text-xs text-slate-800 block">Khóa / Mở tuần học</span>
                  <span className="text-[11px] text-slate-500 block">
                    Khóa tuần để chốt điểm hoặc mở lại tuần để cờ đỏ cập nhật bổ sung
                  </span>
                </div>
              </label>

              <label className="p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={userPerms.canManageCriteria}
                  onChange={e => setUserPerms({ ...userPerms, canManageCriteria: e.target.checked })}
                  className="h-4 w-4 mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="font-bold text-xs text-slate-800 block">Quản lý danh mục lỗi vi phạm</span>
                  <span className="text-[11px] text-slate-500 block">
                    Thêm, sửa, xóa tiêu chí hành vi và mức trừ/cộng điểm
                  </span>
                </div>
              </label>

              <label className="p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={userPerms.canManageUsers}
                  onChange={e => setUserPerms({ ...userPerms, canManageUsers: e.target.checked })}
                  className="h-4 w-4 mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="font-bold text-xs text-slate-800 block">Cấp & sửa tài khoản thành viên</span>
                  <span className="text-[11px] text-slate-500 block">
                    Tạo tài khoản mới, đặt lại mật khẩu và khóa tài khoản
                  </span>
                </div>
              </label>

              <label className="p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={userPerms.canExport}
                  onChange={e => setUserPerms({ ...userPerms, canExport: e.target.checked })}
                  className="h-4 w-4 mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="font-bold text-xs text-slate-800 block">Xuất báo cáo (Excel, Word, In PDF)</span>
                  <span className="text-[11px] text-slate-500 block">
                    Tải bảng xếp hạng Excel, xuất biên bản trực tuần file Word
                  </span>
                </div>
              </label>

              <label className="p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={userPerms.canViewReports}
                  onChange={e => setUserPerms({ ...userPerms, canViewReports: e.target.checked })}
                  className="h-4 w-4 mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="font-bold text-xs text-slate-800 block">Xem báo cáo & Bảng xếp hạng</span>
                  <span className="text-[11px] text-slate-500 block">
                    Theo dõi điểm số, vị trí xếp hạng và biểu đồ thống kê
                  </span>
                </div>
              </label>

              <label className="p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={userPerms.canEditSettings}
                  onChange={e => setUserPerms({ ...userPerms, canEditSettings: e.target.checked })}
                  className="h-4 w-4 mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="font-bold text-xs text-slate-800 block">Cấu hình hệ thống (Toàn quyền)</span>
                  <span className="text-[11px] text-slate-500 block">
                    Thiết lập năm học, kế hoạch tuần học và thông tin trường
                  </span>
                </div>
              </label>
            </div>

            {/* Save Permissions CTA */}
            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={handleSavePermissions}
                className="flex items-center space-x-2 rounded-xl bg-[#1a56db] hover:bg-[#1546b3] text-white px-6 py-2.5 text-xs font-bold shadow-md cursor-pointer transition-all active:scale-95"
              >
                <Save className="h-4 w-4" />
                <span>Lưu cấp quyền cho tài khoản</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: QUY CHẾ THI ĐUA & ĐIỂM SỐ (Panel 13 Config)       */}
      {/* ======================================================== */}
      {activeSubTab === 'rules' && (
        <form onSubmit={handleSaveGeneralSettings} className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-2.5">
              <Sliders className="h-4 w-4 text-blue-600" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                QUY CHẾ TÍNH ĐIỂM THI ĐUA & THIẾT LẬP DUYỆT
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Điểm nền mặc định ban đầu</label>
                <input
                  type="number"
                  required
                  value={formData.baseScore}
                  onChange={e => setFormData({ ...formData, baseScore: parseInt(e.target.value) || 100 })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 font-black text-sm focus:border-blue-500 focus:outline-none"
                />
                <span className="text-[10px] text-slate-400">Mỗi chi đội bắt đầu tuần mới với số điểm này</span>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Cơ chế phê duyệt kết quả</label>
                <div className="pt-2">
                  <label className="flex items-center space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.requireApproval}
                      onChange={e => setFormData({ ...formData, requireApproval: e.target.checked })}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="font-bold text-blue-900">Bắt buộc Tổng phụ trách duyệt trước khi cộng/trừ điểm</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2 text-xs">
              <label className="flex items-center space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.allowEditAfterSubmit}
                  onChange={e => setFormData({ ...formData, allowEditAfterSubmit: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-slate-700 font-medium">Cho phép cờ đỏ sửa lại phiếu trong ngày nếu chưa được duyệt</span>
              </label>

              <label className="flex items-center space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.systemNotifications}
                  onChange={e => setFormData({ ...formData, systemNotifications: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-slate-700 font-medium">Bật chuông thông báo hệ thống khi có kết quả hoặc yêu cầu sửa</span>
              </label>

              <label className="flex items-center space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.autoLockOnSunday}
                  onChange={e => setFormData({ ...formData, autoLockOnSunday: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="font-bold text-blue-900">Tự động khóa tuần học vào 23:59 Chủ nhật hàng tuần</span>
              </label>
            </div>

            {/* Thresholds */}
            <div className="pt-4 border-t border-slate-100">
              <span className="font-bold text-xs text-slate-800 block mb-2">
                Ngưỡng điểm phân loại thi đua chi đội:
              </span>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                  <span className="font-bold text-emerald-800 block">Xếp loại Tốt (&gt;=)</span>
                  <input
                    type="number"
                    value={formData.goodThreshold}
                    onChange={e => setFormData({ ...formData, goodThreshold: parseInt(e.target.value) || 90 })}
                    className="w-full mt-1 rounded border border-emerald-300 px-2 py-1 font-black text-slate-800 bg-white"
                  />
                </div>

                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                  <span className="font-bold text-amber-800 block">Xếp loại Khá (&gt;=)</span>
                  <input
                    type="number"
                    value={formData.fairThreshold}
                    onChange={e => setFormData({ ...formData, fairThreshold: parseInt(e.target.value) || 80 })}
                    className="w-full mt-1 rounded border border-amber-300 px-2 py-1 font-black text-slate-800 bg-white"
                  />
                </div>

                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
                  <span className="font-bold text-blue-800 block">Xếp loại Đạt (&gt;=)</span>
                  <input
                    type="number"
                    value={formData.passThreshold}
                    onChange={e => setFormData({ ...formData, passThreshold: parseInt(e.target.value) || 70 })}
                    className="w-full mt-1 rounded border border-blue-300 px-2 py-1 font-black text-slate-800 bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="flex items-center space-x-2 rounded-xl bg-[#1a56db] hover:bg-[#1546b3] text-white px-6 py-2.5 text-xs font-bold shadow-md cursor-pointer transition-all active:scale-95"
              >
                <Save className="h-4 w-4" />
                <span>Lưu quy chế thi đua</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ======================================================== */}
      {/* TAB 4: THÔNG TIN TRƯỜNG HỌC                              */}
      {/* ======================================================== */}
      {activeSubTab === 'school' && (
        <form onSubmit={handleSaveGeneralSettings} className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-2.5">
              <School className="h-4 w-4 text-blue-600" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                THÔNG TIN TRƯỜNG & BAN GIÁM HIỆU
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Tên đơn vị trường học</label>
                <input
                  type="text"
                  required
                  value={formData.schoolName}
                  onChange={e => setFormData({ ...formData, schoolName: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 font-bold focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Địa chỉ / Huyện tỉnh</label>
                <input
                  type="text"
                  value={formData.schoolSubTitle}
                  onChange={e => setFormData({ ...formData, schoolSubTitle: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Tổng phụ trách Đội</label>
                <input
                  type="text"
                  required
                  value={formData.chiefOfficerName}
                  onChange={e => setFormData({ ...formData, chiefOfficerName: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 font-semibold focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Hiệu trưởng / Đại diện BGH</label>
                <input
                  type="text"
                  required
                  value={formData.principalName}
                  onChange={e => setFormData({ ...formData, principalName: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 font-semibold focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="flex items-center space-x-2 rounded-xl bg-[#1a56db] hover:bg-[#1546b3] text-white px-6 py-2.5 text-xs font-bold shadow-md cursor-pointer transition-all active:scale-95"
              >
                <Save className="h-4 w-4" />
                <span>Lưu thông tin trường</span>
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
