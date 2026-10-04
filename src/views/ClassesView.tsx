import React, { useState } from 'react';
import {
  GraduationCap,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Search,
  School,
  Download,
  Users,
  CloudUpload
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ClassInfo } from '../types';

export const ClassesView: React.FC = () => {
  const { classes, addClass, updateClass, deleteClass, setActiveTab, syncAllToSupabase, isSyncingSupabase } = useApp();

  const [selectedGrade, setSelectedGrade] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassInfo | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [syncToast, setSyncToast] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    grade: 6,
    homeroomTeacher: '',
    totalStudents: 38,
    roomNumber: 'P.101',
    status: 'active' as 'active' | 'inactive'
  });

  const filteredClasses = classes.filter(c => {
    if (selectedGrade !== 'all' && c.grade !== selectedGrade) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!c.name.toLowerCase().includes(q) && !c.homeroomTeacher.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  const handleOpenAdd = () => {
    setEditingClass(null);
    setFormData({
      name: '',
      grade: 6,
      homeroomTeacher: '',
      totalStudents: 38,
      roomNumber: 'P.101',
      status: 'active'
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (cls: ClassInfo) => {
    setEditingClass(cls);
    setFormData({
      name: cls.name,
      grade: cls.grade,
      homeroomTeacher: cls.homeroomTeacher,
      totalStudents: cls.totalStudents,
      roomNumber: cls.roomNumber || '',
      status: cls.status
    });
    setModalOpen(true);
  };

  const handleDeleteClass = async (cls: ClassInfo) => {
    const isConfirmed = window.confirm(`Bạn có chắc chắn muốn xóa lớp ${cls.name}?\nThao tác này sẽ đồng bộ xóa trực tiếp trên cả hệ thống và máy chủ Supabase.`);
    if (!isConfirmed) return;

    try {
      setDeletingId(cls.id);
      await deleteClass(cls.id);
      setSyncToast(`✓ Đã xóa lớp ${cls.name} và đồng bộ xóa trên Supabase thành công!`);
      setTimeout(() => setSyncToast(null), 4000);
    } catch (err: any) {
      alert('Lỗi khi xóa lớp: ' + (err.message || String(err)));
    } finally {
      setDeletingId(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClass) {
      updateClass(editingClass.id, formData);
      setSyncToast(`✓ Đã lưu thay đổi lớp ${formData.name} lên Supabase!`);
    } else {
      addClass(formData);
      setSyncToast(`✓ Đã thêm lớp ${formData.name} và lưu lên Supabase!`);
    }
    setTimeout(() => setSyncToast(null), 4000);
    setModalOpen(false);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {syncToast && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-2.5 rounded-lg text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in">
          <span>{syncToast}</span>
          <button onClick={() => setSyncToast(null)} className="text-emerald-600 hover:text-emerald-900 font-bold ml-4">✕</button>
        </div>
      )}

      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <School className="h-5 w-5 text-blue-600" />
            <span>Quản lý danh sách lớp</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Tổng số {classes.length} lớp học thuộc Khối 6, 7, 8, 9 trường PTDTBT TH&THCS Quản Bạ
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={async () => {
              try {
                const res = await syncAllToSupabase();
                if (res.success) {
                  setSyncToast('✓ Đã đồng bộ và lưu dữ liệu mới nhất lên Supabase thành công!');
                  setTimeout(() => setSyncToast(null), 4000);
                } else {
                  alert('Lỗi khi lưu lên Supabase: ' + res.message);
                }
              } catch (err: any) {
                alert('Lỗi: ' + (err.message || String(err)));
              }
            }}
            disabled={isSyncingSupabase}
            className="flex items-center space-x-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 text-xs font-bold shadow-xs transition-colors disabled:opacity-50"
            title="Lưu toàn bộ danh sách lớp và dữ liệu hiện tại lên cơ sở dữ liệu Supabase"
          >
            {isSyncingSupabase ? (
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <CloudUpload className="h-4 w-4" />
            )}
            <span>{isSyncingSupabase ? 'Đang lưu...' : 'Lưu lên Supabase'}</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="flex items-center space-x-1.5 rounded-lg bg-[#1a56db] hover:bg-[#1546b3] text-white px-3.5 py-2 text-xs font-bold shadow-xs transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>+ Thêm lớp</span>
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên lớp hoặc giáo viên chủ nhiệm..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-800 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center space-x-1">
          {[
            { label: 'Tất cả', val: 'all' as const },
            { label: 'Khối 6', val: 6 },
            { label: 'Khối 7', val: 7 },
            { label: 'Khối 8', val: 8 },
            { label: 'Khối 9', val: 9 }
          ].map(g => (
            <button
              key={g.label}
              onClick={() => setSelectedGrade(g.val)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedGrade === g.val
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* Classes Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4 w-16 text-center">STT</th>
                <th className="py-3.5 px-4">Tên lớp</th>
                <th className="py-3.5 px-4">Khối</th>
                <th className="py-3.5 px-4">Giáo viên chủ nhiệm</th>
                <th className="py-3.5 px-4 text-center">Sĩ số</th>
                <th className="py-3.5 px-4 text-center">Phòng học</th>
                <th className="py-3.5 px-4 text-center">Trạng thái</th>
                <th className="py-3.5 px-4 text-center w-36">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredClasses.map((cls, idx) => (
                <tr key={cls.id} className="hover:bg-blue-50/40 transition-colors">
                  <td className="py-3 px-4 text-center text-slate-500 font-bold">{idx + 1}</td>
                  <td className="py-3 px-4">
                    <span className="font-extrabold text-sm text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {cls.name}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-700">Khối {cls.grade}</td>
                  <td className="py-3 px-4 text-slate-800 font-semibold">{cls.homeroomTeacher}</td>
                  <td className="py-3 px-4 text-center font-bold text-blue-700">{cls.totalStudents} hs</td>
                  <td className="py-3 px-4 text-center text-slate-500">{cls.roomNumber || '-'}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Đang học
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => setActiveTab('class_history')}
                        title="Xem lịch sử vi phạm"
                        className="p-1 rounded hover:bg-slate-100 text-slate-600 hover:text-blue-600"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(cls)}
                        title="Sửa"
                        className="p-1 rounded hover:bg-slate-100 text-slate-600 hover:text-blue-600"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClass(cls)}
                        disabled={deletingId === cls.id}
                        title="Xóa lớp và đồng bộ Supabase"
                        className="p-1 rounded hover:bg-rose-50 text-slate-400 hover:text-rose-600 disabled:opacity-50"
                      >
                        {deletingId === cls.id ? (
                          <div className="h-4 w-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 border-b border-slate-100 pb-2">
              {editingClass ? `Chỉnh sửa lớp ${editingClass.name}` : 'Thêm lớp học mới'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tên lớp</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: 7C"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 font-bold focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Khối</label>
                  <select
                    value={formData.grade}
                    onChange={e => setFormData({ ...formData, grade: parseInt(e.target.value) || 6 })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-blue-500 focus:outline-none"
                  >
                    <option value={6}>Khối 6</option>
                    <option value={7}>Khối 7</option>
                    <option value={8}>Khối 8</option>
                    <option value={9}>Khối 9</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Giáo viên chủ nhiệm</label>
                <input
                  type="text"
                  required
                  placeholder="Thầy/Cô..."
                  value={formData.homeroomTeacher}
                  onChange={e => setFormData({ ...formData, homeroomTeacher: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Sĩ số học sinh</label>
                  <input
                    type="number"
                    required
                    value={formData.totalStudents}
                    onChange={e => setFormData({ ...formData, totalStudents: parseInt(e.target.value) || 35 })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Phòng học</label>
                  <input
                    type="text"
                    value={formData.roomNumber}
                    onChange={e => setFormData({ ...formData, roomNumber: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-blue-500 focus:outline-none"
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
                  {editingClass ? 'Lưu thay đổi' : 'Thêm lớp'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
