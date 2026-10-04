import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Lock,
  Unlock,
  KeyRound,
  Shield,
  School,
  Flag,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Calendar,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { User, UserRole } from '../types';

export const UserManagementView: React.FC = () => {
  const {
    users,
    currentUser,
    classes,
    academicYears,
    selectedAcademicYear,
    setSelectedAcademicYear,
    addUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    resetUserPassword
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [resetPwdModalUser, setResetPwdModalUser] = useState<User | null>(null);
  const [newPasswordInput, setNewPasswordInput] = useState('123456');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState<{
    name: string;
    username: string;
    password: string;
    role: UserRole;
    assignedClass: string;
    roleTitle: string;
    phone: string;
    email: string;
    status: 'active' | 'locked';
    academicYear: string;
  }>({
    name: '',
    username: '',
    password: 'password123',
    role: 'teacher',
    assignedClass: '7A',
    roleTitle: 'Giáo viên chủ nhiệm',
    phone: '',
    email: '',
    status: 'active',
    academicYear: selectedAcademicYear
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      username: '',
      password: 'password123',
      role: 'teacher',
      assignedClass: '7A',
      roleTitle: 'GVCN Lớp 7A',
      phone: '',
      email: '',
      status: 'active',
      academicYear: selectedAcademicYear
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      username: user.username,
      password: user.password || 'password123',
      role: user.role,
      assignedClass: user.assignedClass || '7A',
      roleTitle: user.roleTitle || '',
      phone: user.phone || '',
      email: user.email || '',
      status: user.status || 'active',
      academicYear: user.academicYear || selectedAcademicYear
    });
    setModalOpen(true);
  };

  const handleRoleChangeInForm = (newRole: UserRole) => {
    let title = '';
    if (newRole === 'admin') title = 'Tổng phụ trách Đội (Quản trị)';
    else if (newRole === 'teacher') title = `GVCN Lớp ${formData.assignedClass || '7A'}`;
    else if (newRole === 'red_flag') title = `Đội viên Cờ đỏ - Chi đội ${formData.assignedClass || '8A'}`;
    else if (newRole === 'student') title = `Tập thể Lớp ${formData.assignedClass || '7A'}`;

    setFormData(prev => ({
      ...prev,
      role: newRole,
      roleTitle: title
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.username.trim()) {
      alert('Vui lòng điền đầy đủ họ tên và tên đăng nhập!');
      return;
    }

    if (editingUser) {
      updateUser(editingUser.id, formData);
      showToast(`Đã cập nhật thành công tài khoản: ${formData.username}`);
    } else {
      // Check username duplicate
      if (users.some(u => u.username.toLowerCase() === formData.username.toLowerCase())) {
        alert('Tên đăng nhập này đã tồn tại! Vui lòng chọn tên đăng nhập khác.');
        return;
      }
      addUser(formData);
      showToast(`Đã cấp thành công tài khoản mới: ${formData.username}`);
    }
    setModalOpen(false);
  };

  const handleConfirmResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetPwdModalUser) return;
    resetUserPassword(resetPwdModalUser.id, newPasswordInput);
    showToast(`Đã đặt lại mật khẩu cho tài khoản ${resetPwdModalUser.username} thành công!`);
    setResetPwdModalUser(null);
  };

  const filteredUsers = users.filter(user => {
    if (roleFilter !== 'all' && user.role !== roleFilter) return false;
    if (statusFilter !== 'all' && user.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = user.name.toLowerCase().includes(q);
      const matchUser = user.username.toLowerCase().includes(q);
      const matchClass = (user.assignedClass || '').toLowerCase().includes(q);
      const matchPhone = (user.phone || '').toLowerCase().includes(q);
      if (!matchName && !matchUser && !matchClass && !matchPhone) return false;
    }
    return true;
  });

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <Shield className="h-3 w-3" />
            Quản trị / TPT
          </span>
        );
      case 'teacher':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <School className="h-3 w-3" />
            Giáo viên CN
          </span>
        );
      case 'red_flag':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <Flag className="h-3 w-3" />
            Học sinh Cờ đỏ
          </span>
        );
      case 'student':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Sparkles className="h-3 w-3" />
            Lớp học
          </span>
        );
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header with Academic Year Switcher for Admin */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
              Quản lý & Cấp tài khoản thành viên
            </h2>
            <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-black text-blue-700 border border-blue-200">
              Quyền Quản trị viên
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Cấp mới, chỉnh sửa thông tin, đặt lại mật khẩu và phân quyền cho Ban giám hiệu, GVCN, Cờ đỏ và các lớp
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Academic Year Selection Feature for Admin */}
          <div className="flex items-center space-x-2 bg-blue-50/70 border border-blue-200 px-3 py-1.5 rounded-lg text-xs">
            <Calendar className="h-4 w-4 text-blue-700" />
            <span className="font-bold text-slate-700">Năm học làm việc:</span>
            <select
              value={selectedAcademicYear}
              onChange={e => setSelectedAcademicYear(e.target.value)}
              className="font-black text-blue-800 bg-transparent focus:outline-none cursor-pointer"
            >
              {academicYears.map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Button: + Cấp tài khoản mới */}
          <button
            onClick={handleOpenAdd}
            className="flex items-center space-x-1.5 rounded-lg bg-[#1a56db] hover:bg-[#1546b3] text-white px-3.5 py-2 text-xs font-bold shadow-xs transition-colors"
          >
            <UserPlus className="h-4 w-4" />
            <span>+ Cấp tài khoản mới</span>
          </button>
        </div>
      </div>

      {toastMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* KPI Cards for Members */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-medium text-slate-500 block">Tổng tài khoản</span>
          <span className="text-2xl font-black text-slate-900 mt-0.5 block">{users.length}</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-medium text-slate-500 block">Quản trị / BGH</span>
          <span className="text-2xl font-black text-blue-700 mt-0.5 block">
            {users.filter(u => u.role === 'admin').length}
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-medium text-slate-500 block">Giáo viên CN</span>
          <span className="text-2xl font-black text-emerald-700 mt-0.5 block">
            {users.filter(u => u.role === 'teacher').length}
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-medium text-slate-500 block">Học sinh Cờ đỏ</span>
          <span className="text-2xl font-black text-rose-700 mt-0.5 block">
            {users.filter(u => u.role === 'red_flag').length}
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs col-span-2 sm:col-span-1">
          <span className="text-[11px] font-medium text-slate-500 block">Đại diện Lớp</span>
          <span className="text-2xl font-black text-amber-700 mt-0.5 block">
            {users.filter(u => u.role === 'student').length}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Tìm theo họ tên, tên đăng nhập, chi đội hoặc số điện thoại..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-500 font-semibold">Vai trò:</span>
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-700 font-medium focus:outline-none"
          >
            <option value="all">Tất cả vai trò</option>
            <option value="admin">Quản trị viên / TPT</option>
            <option value="teacher">Giáo viên chủ nhiệm</option>
            <option value="red_flag">Học sinh Cờ đỏ</option>
            <option value="student">Đại diện Lớp</option>
          </select>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-500 font-semibold">Trạng thái:</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-700 font-medium focus:outline-none"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="locked">Đã khóa</option>
          </select>
        </div>
      </div>

      {/* Main Accounts Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4 w-12 text-center">STT</th>
                <th className="py-3.5 px-4">Họ và tên</th>
                <th className="py-3.5 px-4">Tên đăng nhập</th>
                <th className="py-3.5 px-4">Vai trò</th>
                <th className="py-3.5 px-4">Lớp / Chi đội</th>
                <th className="py-3.5 px-4">Số điện thoại</th>
                <th className="py-3.5 px-4 text-center">Trạng thái</th>
                <th className="py-3.5 px-4 text-center w-36">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    Không tìm thấy tài khoản nào phù hợp.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, idx) => (
                  <tr key={user.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="py-3 px-4 text-center text-slate-500 font-bold">{idx + 1}</td>
                    <td className="py-3 px-4">
                      <div className="font-extrabold text-slate-900">{user.name}</div>
                      <div className="text-[10px] text-slate-400">{user.roleTitle}</div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-blue-700">{user.username}</td>
                    <td className="py-3 px-4">{getRoleBadge(user.role)}</td>
                    <td className="py-3 px-4">
                      {user.assignedClass ? (
                        <span className="bg-slate-100 font-bold px-2 py-0.5 rounded text-slate-800">
                          {user.assignedClass}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{user.phone || 'Chưa cập nhật'}</td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          user.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {user.status === 'active' ? 'Hoạt động' : 'Đã khóa'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center space-x-1.5">
                        <button
                          onClick={() => {
                            setResetPwdModalUser(user);
                            setNewPasswordInput('123456');
                          }}
                          title="Đặt lại mật khẩu"
                          className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-amber-600"
                        >
                          <KeyRound className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => toggleUserStatus(user.id)}
                          title={user.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa'}
                          className={`p-1 rounded hover:bg-slate-100 ${
                            user.status === 'active'
                              ? 'text-slate-500 hover:text-rose-600'
                              : 'text-emerald-600'
                          }`}
                        >
                          {user.status === 'active' ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => handleOpenEdit(user)}
                          title="Chỉnh sửa thông tin"
                          className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-blue-600"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        {(!currentUser || user.id !== currentUser.id) && (
                          <button
                            onClick={() => {
                              if (window.confirm(`Bạn có chắc chắn muốn xóa tài khoản "${user.username}" (${user.name})?`)) {
                                deleteUser(user.id);
                                showToast(`Đã xóa tài khoản: ${user.username}`);
                              }
                            }}
                            title="Xóa tài khoản"
                            className="p-1 rounded hover:bg-rose-50 text-slate-400 hover:text-rose-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Cấp / Sửa tài khoản thành viên */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="font-extrabold text-base text-slate-900">
                {editingUser ? `Chỉnh sửa tài khoản: ${editingUser.username}` : 'Cấp tài khoản thành viên mới'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Họ và tên thành viên</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ví dụ: Cô Nguyễn Thị Hoa"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 font-bold focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tên đăng nhập</label>
                  <input
                    type="text"
                    required
                    disabled={!!editingUser}
                    value={formData.username}
                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                    placeholder="Ví dụ: gvcn_7c"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 font-mono font-bold focus:border-blue-500 focus:outline-none disabled:bg-slate-100"
                  />
                </div>
              </div>

              {!editingUser && (
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Mật khẩu khởi tạo</label>
                  <input
                    type="text"
                    required
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 font-mono focus:border-blue-500 focus:outline-none"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Vai trò hệ thống</label>
                  <select
                    value={formData.role}
                    onChange={e => handleRoleChangeInForm(e.target.value as UserRole)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 font-semibold focus:border-blue-500 focus:outline-none"
                  >
                    <option value="admin">Quản trị viên / TPT</option>
                    <option value="teacher">Giáo viên chủ nhiệm</option>
                    <option value="red_flag">Học sinh Cờ đỏ</option>
                    <option value="student">Đại diện Lớp học</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Lớp phụ trách / Chi đội</label>
                  <select
                    value={formData.assignedClass}
                    onChange={e => setFormData({ ...formData, assignedClass: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 font-semibold focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">-- Không phân lớp --</option>
                    {classes.map(c => (
                      <option key={c.id} value={c.name}>
                        Lớp {c.name} (Khối {c.grade})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Chức vụ / Tiêu đề vai trò</label>
                <input
                  type="text"
                  value={formData.roleTitle}
                  onChange={e => setFormData({ ...formData, roleTitle: e.target.value })}
                  placeholder="Ví dụ: GVCN Lớp 7C, Cờ đỏ khối 8..."
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Số điện thoại</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="098..."
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Trạng thái tài khoản</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as 'active' | 'locked' })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="active">Đang hoạt động</option>
                    <option value="locked">Khóa tài khoản</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3.5 py-2 rounded-lg border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs"
                >
                  {editingUser ? 'Lưu thay đổi' : 'Cấp tài khoản'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Đặt lại mật khẩu */}
      {resetPwdModalUser && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center space-x-2.5 text-amber-600 border-b border-slate-100 pb-2">
              <KeyRound className="h-5 w-5" />
              <h3 className="font-bold text-sm text-slate-900">Đặt lại mật khẩu</h3>
            </div>

            <form onSubmit={handleConfirmResetPassword} className="space-y-3 text-xs">
              <p className="text-slate-600">
                Đặt lại mật khẩu mới cho tài khoản: <strong>{resetPwdModalUser.username}</strong> ({resetPwdModalUser.name})
              </p>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Mật khẩu mới</label>
                <input
                  type="text"
                  required
                  value={newPasswordInput}
                  onChange={e => setNewPasswordInput(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 font-mono font-bold focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setResetPwdModalUser(null)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold"
                >
                  Xác nhận đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
