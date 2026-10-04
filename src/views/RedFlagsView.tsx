import React, { useState } from 'react';
import {
  Flag,
  Plus,
  Search,
  Edit2,
  Trash2,
  Lock,
  Unlock,
  KeyRound,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RedFlagMember } from '../types';

export const RedFlagsView: React.FC = () => {
  const {
    redFlags,
    classes,
    addRedFlag,
    updateRedFlag,
    toggleRedFlagStatus,
    deleteRedFlag
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRf, setEditingRf] = useState<RedFlagMember | null>(null);
  const [resetPwdSuccess, setResetPwdSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    code: `CD${String(redFlags.length + 1).padStart(2, '0')}`,
    fullName: '',
    classId: '8A',
    username: '',
    status: 'active' as 'active' | 'locked',
    academicYear: '2026 - 2027',
    phone: '',
    dutyGroup: 'Đội 1'
  });

  const filteredMembers = redFlags.filter(rf => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        rf.fullName.toLowerCase().includes(q) ||
        rf.code.toLowerCase().includes(q) ||
        rf.classId.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenAdd = () => {
    setEditingRf(null);
    setFormData({
      code: `CD${String(redFlags.length + 1).padStart(2, '0')}`,
      fullName: '',
      classId: '8A',
      username: `codo_${Date.now().toString().slice(-4)}`,
      status: 'active',
      academicYear: '2026 - 2027',
      phone: '098' + Math.floor(1000000 + Math.random() * 9000000),
      dutyGroup: 'Đội 1'
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (rf: RedFlagMember) => {
    setEditingRf(rf);
    setFormData({
      code: rf.code,
      fullName: rf.fullName,
      classId: rf.classId,
      username: rf.username,
      status: rf.status,
      academicYear: rf.academicYear,
      phone: rf.phone || '',
      dutyGroup: rf.dutyGroup || 'Đội 1'
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRf) {
      updateRedFlag(editingRf.id, formData);
    } else {
      addRedFlag(formData);
    }
    setModalOpen(false);
  };

  const handleResetPassword = (rf: RedFlagMember) => {
    setResetPwdSuccess(`Đã đặt lại mật khẩu cho ${rf.fullName} về mặc định (123456)`);
    setTimeout(() => setResetPwdSuccess(null), 3000);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <Flag className="h-5 w-5 text-red-600" />
            <span>Quản lý đội cờ đỏ</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Danh sách {redFlags.length} đội viên xung kích thực hiện nhiệm vụ chấm điểm nề nếp
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center space-x-1.5 rounded-lg bg-[#1a56db] hover:bg-[#1546b3] text-white px-3.5 py-2 text-xs font-bold shadow-xs transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>+ Thêm cờ đỏ</span>
        </button>
      </div>

      {resetPwdSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>{resetPwdSuccess}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Tìm theo họ tên, mã cờ đỏ hoặc chi đội..."
          className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-800 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4 w-16 text-center">STT</th>
                <th className="py-3.5 px-4">Mã CĐ</th>
                <th className="py-3.5 px-4">Họ và tên</th>
                <th className="py-3.5 px-4">Chi đội</th>
                <th className="py-3.5 px-4">Tài khoản</th>
                <th className="py-3.5 px-4">Nhóm trực</th>
                <th className="py-3.5 px-4 text-center">Trạng thái</th>
                <th className="py-3.5 px-4 text-center w-36">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredMembers.map((rf, idx) => (
                <tr key={rf.id} className="hover:bg-blue-50/40 transition-colors">
                  <td className="py-3 px-4 text-center text-slate-500 font-bold">{idx + 1}</td>
                  <td className="py-3 px-4 font-black text-blue-700">{rf.code}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{rf.fullName}</td>
                  <td className="py-3 px-4">
                    <span className="bg-slate-100 font-bold px-2 py-0.5 rounded text-slate-700">
                      {rf.classId}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{rf.username}</td>
                  <td className="py-3 px-4 text-slate-600">{rf.dutyGroup || 'Đội 1'}</td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        rf.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {rf.status === 'active' ? 'Hoạt động' : 'Đã khóa'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center space-x-1.5">
                      <button
                        onClick={() => handleResetPassword(rf)}
                        title="Đặt lại mật khẩu"
                        className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-amber-600"
                      >
                        <KeyRound className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => toggleRedFlagStatus(rf.id)}
                        title={rf.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa'}
                        className={`p-1 rounded hover:bg-slate-100 ${
                          rf.status === 'active' ? 'text-slate-500 hover:text-rose-600' : 'text-emerald-600'
                        }`}
                      >
                        {rf.status === 'active' ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => handleOpenEdit(rf)}
                        title="Sửa"
                        className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-blue-600"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Xóa cờ đỏ ${rf.fullName}?`)) {
                            deleteRedFlag(rf.id);
                          }
                        }}
                        title="Xóa"
                        className="p-1 rounded hover:bg-rose-50 text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 border-b border-slate-100 pb-2">
              {editingRf ? `Chỉnh sửa thông tin cờ đỏ` : 'Thêm đội viên cờ đỏ mới'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Mã cờ đỏ</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={e => setFormData({ ...formData, code: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 font-bold focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Chi đội</label>
                  <select
                    value={formData.classId}
                    onChange={e => setFormData({ ...formData, classId: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-blue-500 focus:outline-none"
                  >
                    {classes.map(c => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Họ và tên học sinh</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 font-bold focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tài khoản đăng nhập</label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nhóm trực</label>
                  <select
                    value={formData.dutyGroup}
                    onChange={e => setFormData({ ...formData, dutyGroup: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Đội 1">Đội 1</option>
                    <option value="Đội 2">Đội 2</option>
                    <option value="Đội 3">Đội 3</option>
                    <option value="Đội 4">Đội 4</option>
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
                  {editingRf ? 'Lưu thay đổi' : 'Thêm cờ đỏ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
