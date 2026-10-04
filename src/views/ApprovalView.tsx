import React, { useState } from 'react';
import {
  CheckSquare,
  Check,
  X,
  AlertTriangle,
  Clock,
  Eye,
  CheckCircle2,
  Send,
  MessageSquare
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ScoreSubmission, SubmissionStatus } from '../types';

export const ApprovalView: React.FC = () => {
  const {
    submissions,
    activeWeekId,
    activeWeek,
    approveSubmission,
    rejectSubmission,
    bulkApprovePending
  } = useApp();

  const [activeTab, setActiveTab] = useState<SubmissionStatus>('pending');
  const [rejectingItem, setRejectingItem] = useState<ScoreSubmission | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('');
  const [viewingDetailItem, setViewingDetailItem] = useState<ScoreSubmission | null>(null);

  const weekSubmissions = submissions.filter(s => s.weekId === activeWeekId);

  const pendingSubmissions = weekSubmissions.filter(s => s.status === 'pending');
  const approvedSubmissions = weekSubmissions.filter(s => s.status === 'approved');
  const rejectedSubmissions = weekSubmissions.filter(s => s.status === 'rejected');

  const currentList =
    activeTab === 'pending'
      ? pendingSubmissions
      : activeTab === 'approved'
      ? approvedSubmissions
      : rejectedSubmissions;

  const handleOpenReject = (sub: ScoreSubmission) => {
    setRejectingItem(sub);
    setRejectReason('');
  };

  const handleConfirmReject = () => {
    if (!rejectingItem) return;
    if (!rejectReason.trim()) {
      alert('Vui lòng nhập lý do yêu cầu sửa!');
      return;
    }
    rejectSubmission(rejectingItem.id, rejectReason);
    setRejectingItem(null);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Top Header from Panel 7 */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-blue-600" />
            <span>Duyệt kết quả chấm ({activeWeek?.name})</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Tổng phụ trách kiểm tra, phê duyệt hoặc gửi phản hồi chỉnh sửa phiếu chấm
          </p>
        </div>

        {pendingSubmissions.length > 0 && (
          <button
            onClick={bulkApprovePending}
            className="flex items-center space-x-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 text-xs font-bold shadow-xs transition-colors"
          >
            <Check className="h-4 w-4" />
            <span>Duyệt tất cả ({pendingSubmissions.length} phiếu)</span>
          </button>
        )}
      </div>

      {/* Tabs from Panel 7: Chờ duyệt | Đã duyệt | Yêu cầu sửa */}
      <div className="flex border-b border-slate-200 space-x-6 text-xs font-bold">
        <button
          onClick={() => setActiveTab('pending')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'pending'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Chờ duyệt</span>
          <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-[11px] font-black">
            {pendingSubmissions.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('approved')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'approved'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Đã duyệt</span>
          <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[11px] font-black">
            {approvedSubmissions.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('rejected')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'rejected'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Yêu cầu sửa</span>
          <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full text-[11px] font-black">
            {rejectedSubmissions.length}
          </span>
        </button>
      </div>

      {/* Main Table from Panel 7 */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Cờ đỏ</th>
                <th className="py-3.5 px-4">Lớp</th>
                <th className="py-3.5 px-4">Ngày</th>
                <th className="py-3.5 px-4">Nội dung vi phạm</th>
                <th className="py-3.5 px-4 text-center">Trạng thái</th>
                <th className="py-3.5 px-4 text-center w-36">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {currentList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Không có phiếu chấm nào trong mục này.
                  </td>
                </tr>
              ) : (
                currentList.map(sub => {
                  const totalMinus = sub.items.reduce((s, it) => s + it.totalPoints, 0);

                  return (
                    <tr key={sub.id} className="hover:bg-blue-50/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{sub.redFlagName}</div>
                        <span className="text-[10px] text-slate-400">{sub.submittedAt.split(' ')[1]}</span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-black text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                          {sub.classId}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-slate-600">
                        <div>{sub.dayLabel}</div>
                        <span className="text-[10px] text-slate-400">{sub.date.split('-').reverse().slice(0, 2).join('/')}</span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          {sub.items.map((it, i) => (
                            <div key={i} className="text-[11px] flex items-center space-x-1">
                              <span className="font-medium text-slate-800">• {it.criteriaName}</span>
                              <span className="text-slate-400">({it.quantity} lượt)</span>
                              <span className="font-bold text-rose-600">[{it.totalPoints}đ]</span>
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-center">
                        {sub.status === 'pending' ? (
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-200">
                            Chờ duyệt
                          </span>
                        ) : sub.status === 'approved' ? (
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Đã duyệt
                          </span>
                        ) : (
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            Yêu cầu sửa
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-center">
                        {sub.status === 'pending' ? (
                          <div className="flex items-center justify-center space-x-1.5">
                            {/* Green Check button from Panel 7 */}
                            <button
                              onClick={() => approveSubmission(sub.id)}
                              title="Duyệt phiếu chấm"
                              className="h-8 w-8 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 flex items-center justify-center transition-colors"
                            >
                              <Check className="h-4 w-4 stroke-[3]" />
                            </button>

                            {/* Red X button from Panel 7 */}
                            <button
                              onClick={() => handleOpenReject(sub)}
                              title="Yêu cầu sửa"
                              className="h-8 w-8 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 flex items-center justify-center transition-colors"
                            >
                              <X className="h-4 w-4 stroke-[3]" />
                            </button>

                            {/* View detail button */}
                            <button
                              onClick={() => setViewingDetailItem(sub)}
                              title="Xem chi tiết"
                              className="h-8 w-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setViewingDetailItem(sub)}
                            className="text-xs text-blue-600 hover:underline font-semibold"
                          >
                            Xem chi tiết
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Yêu cầu sửa phiếu */}
      {rejectingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center space-x-3 text-rose-600 border-b border-slate-100 pb-3">
              <div className="h-9 w-9 rounded-full bg-rose-100 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Yêu cầu cờ đỏ sửa phiếu</h3>
                <p className="text-xs text-slate-500">
                  Lớp {rejectingItem.classId} - Cờ đỏ {rejectingItem.redFlagName}
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <label className="font-semibold text-slate-700 block">
                Lý do yêu cầu sửa (Cờ đỏ sẽ nhìn thấy ghi chú này):
              </label>
              <textarea
                rows={3}
                required
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                placeholder="Ví dụ: Kiểm tra lại số học sinh vắng với sổ đầu bài, hoặc ghi rõ tên học sinh vi phạm..."
                className="w-full rounded-lg border border-slate-300 p-2.5 text-slate-800 focus:border-blue-500 focus:outline-none"
              />

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setRejectingItem(null)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReject}
                  className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-xs"
                >
                  Gửi yêu cầu sửa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Xem chi tiết phiếu */}
      {viewingDetailItem && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="font-bold text-sm text-slate-900">
                Chi tiết phiếu chấm Lớp {viewingDetailItem.classId}
              </h3>
              <button
                onClick={() => setViewingDetailItem(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2 text-slate-600 bg-slate-50 p-2.5 rounded-lg">
                <div>
                  <span className="text-slate-400 block text-[10px]">Cờ đỏ chấm:</span>
                  <span className="font-bold text-slate-800">{viewingDetailItem.redFlagName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Thời gian:</span>
                  <span className="font-bold text-slate-800">
                    {viewingDetailItem.dayLabel} ({viewingDetailItem.date})
                  </span>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg p-3 space-y-2">
                <span className="font-bold text-slate-800 block">Danh sách lỗi:</span>
                {viewingDetailItem.items.map((it, i) => (
                  <div key={i} className="flex justify-between border-b border-slate-100 pb-1.5 last:border-none">
                    <div>
                      <span className="font-semibold text-slate-800">{it.criteriaName}</span>
                      <span className="text-slate-500 ml-1.5">x{it.quantity}</span>
                      {it.note && <span className="block text-[10px] text-slate-400">"{it.note}"</span>}
                    </div>
                    <span className="font-bold text-rose-600">{it.totalPoints}đ</span>
                  </div>
                ))}
              </div>

              {viewingDetailItem.rejectionReason && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-700">
                  <span className="font-bold block">Ghi chú yêu cầu sửa:</span>
                  <p>{viewingDetailItem.rejectionReason}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setViewingDetailItem(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 text-white font-bold text-xs"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
