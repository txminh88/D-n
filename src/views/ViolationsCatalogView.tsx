import React, { useState } from 'react';
import {
  AlertTriangle,
  Plus,
  Search,
  Edit2,
  Trash2,
  Filter,
  CheckCircle2,
  Sliders
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ViolationCriteria, ViolationGroup } from '../types';

export const ViolationsCatalogView: React.FC = () => {
  const { criteria, addCriteria, updateCriteria, deleteCriteria } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCriteria, setEditingCriteria] = useState<ViolationCriteria | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    group: 'Trang phục' as ViolationGroup,
    name: '',
    points: -1,
    type: 'minus' as 'minus' | 'plus',
    status: 'active' as 'active' | 'inactive',
    applicableGrades: 'Tất cả',
    description: ''
  });

  const filteredCriteria = criteria.filter(c => {
    if (selectedGroup !== 'all' && c.group !== selectedGroup) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = c.name.toLowerCase().includes(q);
      const matchGroup = c.group.toLowerCase().includes(q);
      if (!matchName && !matchGroup) return false;
    }
    return true;
  });

  const handleOpenAdd = () => {
    setEditingCriteria(null);
    setFormData({
      group: 'Trang phục',
      name: '',
      points: -1,
      type: 'minus',
      status: 'active',
      applicableGrades: 'Tất cả',
      description: ''
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (crit: ViolationCriteria) => {
    setEditingCriteria(crit);
    setFormData({
      group: crit.group,
      name: crit.name,
      points: crit.points,
      type: crit.type,
      status: crit.status,
      applicableGrades: crit.applicableGrades,
      description: crit.description || ''
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCriteria) {
      updateCriteria(editingCriteria.id, formData);
    } else {
      addCriteria(formData);
    }
    setModalOpen(false);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Top Header from Panel 12 */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-blue-600" />
            <span>Quản lý danh mục lỗi vi phạm</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cấu hình danh mục hành vi, định mức trừ điểm thi đua và tiêu chuẩn kiểm tra
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center space-x-1.5 rounded-lg bg-[#1a56db] hover:bg-[#1546b3] text-white px-3.5 py-2 text-xs font-bold shadow-xs transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>+ Thêm lỗi</span>
        </button>
      </div>

      {/* Filter and Search Bar from Panel 12 */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm lỗi vi phạm..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-500 font-semibold">Nhóm:</span>
          <select
            value={selectedGroup}
            onChange={e => setSelectedGroup(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-700 font-medium focus:outline-none"
          >
            <option value="all">Tất cả nhóm</option>
            <option value="Trang phục">Trang phục</option>
            <option value="Đi học">Đi học</option>
            <option value="Vệ sinh">Vệ sinh</option>
            <option value="Nề nếp">Nề nếp</option>
            <option value="Học tập">Học tập</option>
            <option value="Truy bài">Truy bài</option>
            <option value="Thể dục giữa giờ">Thể dục giữa giờ</option>
            <option value="Hoạt động Đội">Hoạt động Đội</option>
          </select>
        </div>
      </div>

      {/* Main Table from Panel 12 */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Nhóm lỗi</th>
                <th className="py-3.5 px-4">Tên lỗi</th>
                <th className="py-3.5 px-4 text-center">Điểm trừ</th>
                <th className="py-3.5 px-4">Khối áp dụng</th>
                <th className="py-3.5 px-4">Mô tả chi tiết</th>
                <th className="py-3.5 px-4 text-center w-28">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredCriteria.map(item => (
                <tr key={item.id} className="hover:bg-blue-50/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-800">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] bg-slate-100 text-slate-700">
                      {item.group}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-bold text-slate-900">
                    {item.name}
                  </td>

                  <td className="py-3 px-4 text-center font-black text-sm text-rose-600">
                    {item.points}
                  </td>

                  <td className="py-3 px-4 text-slate-600">
                    {item.applicableGrades}
                  </td>

                  <td className="py-3 px-4 text-slate-500 max-w-xs truncate">
                    {item.description || 'Chưa có mô tả'}
                  </td>

                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        title="Sửa"
                        className="p-1.5 rounded hover:bg-slate-100 text-slate-600 hover:text-blue-600 transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Xóa tiêu chí "${item.name}"?`)) {
                            deleteCriteria(item.id);
                          }
                        }}
                        title="Xóa"
                        className="p-1.5 rounded hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
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

      {/* Add / Edit Criteria Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 border-b border-slate-100 pb-2">
              {editingCriteria ? 'Chỉnh sửa lỗi vi phạm' : 'Thêm lỗi vi phạm mới'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nhóm lỗi</label>
                  <select
                    value={formData.group}
                    onChange={e => setFormData({ ...formData, group: e.target.value as ViolationGroup })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Trang phục">Trang phục</option>
                    <option value="Đi học">Đi học</option>
                    <option value="Vệ sinh">Vệ sinh</option>
                    <option value="Nề nếp">Nề nếp</option>
                    <option value="Học tập">Học tập</option>
                    <option value="Truy bài">Truy bài</option>
                    <option value="Thể dục giữa giờ">Thể dục giữa giờ</option>
                    <option value="Hoạt động Đội">Hoạt động Đội</option>
                    <option value="Lỗi khác">Lỗi khác</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Điểm trừ (ví dụ: -2)</label>
                  <input
                    type="number"
                    required
                    value={formData.points}
                    onChange={e => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 font-bold focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tên hành vi / lỗi vi phạm</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ví dụ: Không đeo khăn quàng, vứt rác sân trường..."
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Khối lớp áp dụng</label>
                <input
                  type="text"
                  value={formData.applicableGrades}
                  onChange={e => setFormData({ ...formData, applicableGrades: e.target.value })}
                  placeholder="Tất cả hoặc 6, 7, 8, 9"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Mô tả và hướng dẫn nhận diện</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Hướng dẫn cho cờ đỏ khi xác định lỗi này..."
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-blue-500 focus:outline-none"
                />
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
                  {editingCriteria ? 'Lưu thay đổi' : 'Thêm tiêu chí'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
