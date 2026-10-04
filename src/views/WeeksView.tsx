import React, { useState } from 'react';
import {
  CalendarDays,
  Plus,
  Edit2,
  Lock,
  Unlock,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SchoolWeek, WeekStatus } from '../types';

export const WeeksView: React.FC = () => {
  const {
    weeks,
    addWeek,
    updateWeek,
    toggleLockWeek,
    deleteWeek,
    activeWeekId,
    setActiveWeekId
  } = useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingWeek, setEditingWeek] = useState<SchoolWeek | null>(null);
  const [confirmLockWeek, setConfirmLockWeek] = useState<SchoolWeek | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    number: weeks.length + 1,
    name: `Tuần ${weeks.length + 1}`,
    startDate: '2026-10-12',
    endDate: '2026-10-18',
    status: 'not_started' as WeekStatus,
    academicYear: '2026 - 2027'
  });

  const handleOpenAdd = () => {
    setEditingWeek(null);
    setFormData({
      number: weeks.length + 1,
      name: `Tuần ${weeks.length + 1}`,
      startDate: '2026-10-12',
      endDate: '2026-10-18',
      status: 'not_started',
      academicYear: '2026 - 2027'
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (w: SchoolWeek) => {
    setEditingWeek(w);
    setFormData({
      number: w.number,
      name: w.name,
      startDate: w.startDate,
      endDate: w.endDate,
      status: w.status,
      academicYear: w.academicYear
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingWeek) {
      updateWeek(editingWeek.id, formData);
    } else {
      addWeek(formData);
    }
    setModalOpen(false);
  };

  const getStatusBadge = (status: WeekStatus) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="h-3 w-3" />
            Đã duyệt
          </span>
        );
      case 'scoring':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="h-3 w-3 animate-spin" />
            Đang chấm
          </span>
        );
      case 'locked':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <Lock className="h-3 w-3" />
            Đã khóa
          </span>
        );
      case 'pending_approval':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertCircle className="h-3 w-3" />
            Chờ duyệt
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
            Chưa mở
          </span>
        );
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Top action header from Panel 3 */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-blue-600" />
            <span>Danh sách tuần</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Quản lý kế hoạch tuần, thời gian mở/khóa chấm điểm và tình trạng thi đua
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center space-x-1.5 rounded-lg bg-[#1a56db] hover:bg-[#1546b3] text-white px-3.5 py-2 text-xs font-bold shadow-xs transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>+ Thêm tuần</span>
        </button>
      </div>

      {/* Main Table from Panel 3 */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4 w-16 text-center">STT</th>
                <th className="py-3.5 px-4">Tuần</th>
                <th className="py-3.5 px-4">Từ ngày</th>
                <th className="py-3.5 px-4">Đến ngày</th>
                <th className="py-3.5 px-4">Trạng thái</th>
                <th className="py-3.5 px-4 text-center w-36">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {weeks.map((w, idx) => {
                const isCurrentActive = w.id === activeWeekId;
                return (
                  <tr
                    key={w.id}
                    className={`hover:bg-blue-50/40 transition-colors ${
                      isCurrentActive ? 'bg-blue-50/20' : ''
                    }`}
                  >
                    <td className="py-3 px-4 text-center font-bold text-slate-500">{idx + 1}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900">{w.name}</span>
                        {isCurrentActive && (
                          <span className="bg-blue-600 text-white text-[10px] px-2 py-0.2 rounded-full font-bold">
                            Tuần hiện tại
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {w.startDate.split('-').reverse().join('/')}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {w.endDate.split('-').reverse().join('/')}
                    </td>
                    <td className="py-3 px-4">{getStatusBadge(w.status)}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center space-x-1.5">
                        <button
                          onClick={() => handleOpenEdit(w)}
                          title="Sửa tuần"
                          className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-blue-600 transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setConfirmLockWeek(w)}
                          title={w.status === 'locked' ? 'Mở khóa tuần' : 'Khóa tuần'}
                          className={`p-1.5 rounded-md transition-colors ${
                            w.status === 'locked'
                              ? 'text-rose-600 hover:bg-rose-50'
                              : 'text-slate-600 hover:bg-slate-100 hover:text-amber-600'
                          }`}
                        >
                          {w.status === 'locked' ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Bạn có chắc chắn muốn xóa ${w.name}?`)) {
                              deleteWeek(w.id);
                            }
                          }}
                          title="Xóa tuần"
                          className="p-1.5 rounded-md hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lock/Unlock Confirmation Dialog */}
      {confirmLockWeek && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-2xl space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center space-x-3 text-amber-600">
              <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  {confirmLockWeek.status === 'locked' ? 'Mở khóa tuần' : 'Xác nhận khóa tuần'}
                </h3>
                <p className="text-xs text-slate-500">{confirmLockWeek.name}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {confirmLockWeek.status === 'locked'
                ? `Khi mở khóa ${confirmLockWeek.name}, các học sinh Cờ đỏ và giáo viên có thể tiếp tục cập nhật điểm nề nếp.`
                : `Khi khóa ${confirmLockWeek.name}, toàn bộ kết quả chấm điểm sẽ được chốt cố định và không thể chỉnh sửa thêm nếu không có sự cho phép của Ban Giám hiệu.`}
            </p>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setConfirmLockWeek(null)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => {
                  toggleLockWeek(confirmLockWeek.id);
                  setConfirmLockWeek(null);
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold text-white shadow-xs ${
                  confirmLockWeek.status === 'locked'
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                {confirmLockWeek.status === 'locked' ? 'Xác nhận mở khóa' : 'Xác nhận khóa tuần'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 border-b border-slate-100 pb-2">
              {editingWeek ? `Chỉnh sửa ${editingWeek.name}` : 'Thêm tuần thi đua mới'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Số thứ tự tuần</label>
                  <input
                    type="number"
                    required
                    value={formData.number}
                    onChange={e => setFormData({ ...formData, number: parseInt(e.target.value) || 1 })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tên tuần</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Từ ngày</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Đến ngày</label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Trạng thái tuần</label>
                <select
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value as WeekStatus })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-blue-500 focus:outline-none"
                >
                  <option value="not_started">Chưa mở</option>
                  <option value="scoring">Đang chấm</option>
                  <option value="pending_approval">Chờ duyệt</option>
                  <option value="approved">Đã duyệt</option>
                  <option value="locked">Đã khóa</option>
                </select>
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
                  {editingWeek ? 'Lưu thay đổi' : 'Thêm tuần'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
