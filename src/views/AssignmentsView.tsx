import React, { useState } from 'react';
import {
  ClipboardCheck,
  Plus,
  Sparkles,
  Search,
  Filter,
  Trash2,
  Edit2,
  Calendar,
  CheckCircle2,
  User,
  School
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DutyAssignment } from '../types';

export const AssignmentsView: React.FC = () => {
  const {
    assignments,
    weeks,
    activeWeekId,
    setActiveWeekId,
    classes,
    redFlags,
    addAssignment,
    updateAssignment,
    deleteAssignment,
    autoAssignWeek
  } = useApp();

  const [filterArea, setFilterArea] = useState<string>('all');
  const [filterDay, setFilterDay] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingAssignment, setEditingAssignment] = useState<DutyAssignment | null>(null);
  const [autoAssignSuccess, setAutoAssignSuccess] = useState<boolean>(false);

  // Form states
  const [formData, setFormData] = useState({
    weekId: activeWeekId,
    redFlagId: redFlags[0]?.id || '',
    redFlagName: redFlags[0]?.fullName || '',
    targetClassId: classes[0]?.name || '7A',
    dayOfWeek: 'Thứ 2',
    date: '2026-09-28',
    area: 'Sân trường',
    content: 'Nề nếp',
    status: 'pending' as 'pending' | 'completed'
  });

  const weekAssignments = assignments.filter(a => a.weekId === activeWeekId);

  const filteredAssignments = weekAssignments.filter(a => {
    if (filterArea !== 'all' && a.area !== filterArea) return false;
    if (filterDay !== 'all' && a.dayOfWeek !== filterDay) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = a.redFlagName.toLowerCase().includes(q);
      const matchClass = a.targetClassId.toLowerCase().includes(q);
      if (!matchName && !matchClass) return false;
    }
    return true;
  });

  const handleOpenAdd = () => {
    setEditingAssignment(null);
    setFormData({
      weekId: activeWeekId,
      redFlagId: redFlags[0]?.id || '',
      redFlagName: redFlags[0]?.fullName || '',
      targetClassId: classes[0]?.name || '7A',
      dayOfWeek: 'Thứ 2',
      date: '2026-09-28',
      area: 'Sân trường',
      content: 'Nề nếp',
      status: 'pending'
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (asg: DutyAssignment) => {
    setEditingAssignment(asg);
    setFormData({
      weekId: asg.weekId,
      redFlagId: asg.redFlagId,
      redFlagName: asg.redFlagName,
      targetClassId: asg.targetClassId,
      dayOfWeek: asg.dayOfWeek,
      date: asg.date,
      area: asg.area,
      content: asg.content,
      status: asg.status
    });
    setModalOpen(true);
  };

  const handleRedFlagChange = (rfId: string) => {
    const selected = redFlags.find(r => r.id === rfId);
    setFormData({
      ...formData,
      redFlagId: rfId,
      redFlagName: selected ? selected.fullName : ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAssignment) {
      updateAssignment(editingAssignment.id, formData);
    } else {
      addAssignment(formData);
    }
    setModalOpen(false);
  };

  const handleAutoAssign = () => {
    autoAssignWeek(activeWeekId);
    setAutoAssignSuccess(true);
    setTimeout(() => setAutoAssignSuccess(false), 3000);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Top Filter and Action Bar from Panel 4 */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5 text-blue-600" />
            <span>Phân công trực tuần</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Lịch phân công cờ đỏ chấm nề nếp, tự động luân phiên và kiểm soát chéo
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Week Selector */}
          <div className="flex items-center space-x-1.5 text-xs">
            <span className="text-slate-500 font-medium">Tuần:</span>
            <select
              value={activeWeekId}
              onChange={e => setActiveWeekId(e.target.value)}
              className="rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-1.5 font-bold text-blue-800 focus:outline-none"
            >
              {weeks.map(w => (
                <option key={w.id} value={w.id}>
                  {w.name} ({w.startDate.split('-').reverse().slice(0, 2).join('/')} - {w.endDate.split('-').reverse().slice(0, 2).join('/')})
                </option>
              ))}
            </select>
          </div>

          {/* Area Filter */}
          <div className="flex items-center space-x-1.5 text-xs">
            <span className="text-slate-500 font-medium">Khu vực:</span>
            <select
              value={filterArea}
              onChange={e => setFilterArea(e.target.value)}
              className="rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-1.5 text-slate-700 focus:outline-none"
            >
              <option value="all">Tất cả</option>
              <option value="Sân trường">Sân trường</option>
              <option value="Hành lang">Hành lang</option>
              <option value="Cổng trường">Cổng trường</option>
              <option value="Lớp học">Lớp học</option>
            </select>
          </div>

          {/* Day Filter */}
          <div className="flex items-center space-x-1.5 text-xs">
            <span className="text-slate-500 font-medium">Thứ:</span>
            <select
              value={filterDay}
              onChange={e => setFilterDay(e.target.value)}
              className="rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-1.5 text-slate-700 focus:outline-none"
            >
              <option value="all">Tất cả các ngày</option>
              <option value="Thứ 2">Thứ 2</option>
              <option value="Thứ 3">Thứ 3</option>
              <option value="Thứ 4">Thứ 4</option>
              <option value="Thứ 5">Thứ 5</option>
              <option value="Thứ 6">Thứ 6</option>
            </select>
          </div>

          {/* Smart Auto Assign Button from Panel 4 */}
          <button
            onClick={handleAutoAssign}
            className="flex items-center space-x-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-3 py-1.5 text-xs font-bold transition-all shadow-xs"
            title="Thuật toán tự động phân công chéo, không trùng lớp bản thân"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
            <span>Phân công tự động</span>
          </button>

          {/* Manual Add Button from Panel 4 */}
          <button
            onClick={handleOpenAdd}
            className="flex items-center space-x-1.5 rounded-lg bg-[#1a56db] hover:bg-[#1546b3] text-white px-3.5 py-1.5 text-xs font-bold transition-colors shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>+ Phân công</span>
          </button>
        </div>
      </div>

      {/* Auto Assign Alert */}
      {autoAssignSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>Hệ thống đã phân công tự động thành công cho toàn bộ các lớp theo nguyên tắc xoay vòng công bằng!</span>
        </div>
      )}

      {/* Main Table from Panel 4 */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4 w-16 text-center">STT</th>
                <th className="py-3.5 px-4">Cờ đỏ</th>
                <th className="py-3.5 px-4">Lớp được chấm</th>
                <th className="py-3.5 px-4">Ngày</th>
                <th className="py-3.5 px-4">Khu vực</th>
                <th className="py-3.5 px-4">Nội dung</th>
                <th className="py-3.5 px-4 text-center w-28">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredAssignments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Không có phân công nào phù hợp. Hãy nhấn <strong>+ Phân công</strong> hoặc <strong>Phân công tự động</strong>.
                  </td>
                </tr>
              ) : (
                filteredAssignments.map((asg, idx) => (
                  <tr key={asg.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="py-3 px-4 text-center font-bold text-slate-500">{idx + 1}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      <div className="flex items-center space-x-2">
                        <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">
                          {asg.redFlagName.charAt(0)}
                        </div>
                        <span>{asg.redFlagName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                        {asg.targetClassId}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700">{asg.dayOfWeek}</td>
                    <td className="py-3 px-4 text-slate-600">{asg.area}</td>
                    <td className="py-3 px-4 text-slate-600">{asg.content}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleOpenEdit(asg)}
                          title="Sửa"
                          className="p-1 rounded hover:bg-slate-100 text-slate-600 hover:text-blue-600 transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Xóa phân công của ${asg.redFlagName}?`)) {
                              deleteAssignment(asg.id);
                            }
                          }}
                          title="Xóa"
                          className="p-1 rounded hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 border-b border-slate-100 pb-2">
              {editingAssignment ? 'Chỉnh sửa phân công trực' : 'Thêm phân công trực mới'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Cờ đỏ thực hiện</label>
                <select
                  value={formData.redFlagId}
                  onChange={e => handleRedFlagChange(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-blue-500 focus:outline-none"
                >
                  {redFlags.map(rf => (
                    <option key={rf.id} value={rf.id}>
                      {rf.fullName} ({rf.classId})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Lớp được chấm</label>
                  <select
                    value={formData.targetClassId}
                    onChange={e => setFormData({ ...formData, targetClassId: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-blue-500 focus:outline-none"
                  >
                    {classes.map(c => (
                      <option key={c.id} value={c.name}>
                        Lớp {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Thứ trong tuần</label>
                  <select
                    value={formData.dayOfWeek}
                    onChange={e => setFormData({ ...formData, dayOfWeek: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Thứ 2">Thứ 2</option>
                    <option value="Thứ 3">Thứ 3</option>
                    <option value="Thứ 4">Thứ 4</option>
                    <option value="Thứ 5">Thứ 5</option>
                    <option value="Thứ 6">Thứ 6</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Khu vực</label>
                  <input
                    type="text"
                    required
                    value={formData.area}
                    onChange={e => setFormData({ ...formData, area: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-blue-500 focus:outline-none"
                    placeholder="Sân trường / Hành lang..."
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nội dung chấm</label>
                  <input
                    type="text"
                    required
                    value={formData.content}
                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-blue-500 focus:outline-none"
                    placeholder="Nề nếp / Vệ sinh / Trang phục..."
                  />
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
                  {editingAssignment ? 'Lưu thay đổi' : 'Tạo phân công'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
