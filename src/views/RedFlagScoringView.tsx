import React, { useState } from 'react';
import {
  User,
  Calendar,
  MapPin,
  Clock,
  Plus,
  Minus,
  CheckCircle2,
  ChevronRight,
  AlertTriangle,
  History,
  Send,
  Sparkles,
  BookOpen,
  Shirt,
  Trash2,
  ArrowLeft
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ViolationCriteria, ViolationGroup, ViolationRecordItem } from '../types';

export const RedFlagScoringView: React.FC = () => {
  const {
    currentUser,
    activeWeek,
    criteria,
    submissions,
    submitScore,
    classes
  } = useApp();

  const [activeTab, setActiveTab] = useState<'scoring' | 'history'>('scoring');
  const [selectedTargetClass, setSelectedTargetClass] = useState<string>('7A');
  const [selectedDay, setSelectedDay] = useState<string>('Thứ 4');
  const [selectedArea, setSelectedArea] = useState<string>('Sân trường');

  // Currently draft violations added during this session
  const [stagedViolations, setStagedViolations] = useState<ViolationRecordItem[]>([
    {
      criteriaId: 'crit-tp-1',
      criteriaName: 'Không đeo khăn quàng',
      group: 'Trang phục',
      quantity: 3,
      pointsPerItem: -1,
      totalPoints: -3,
      note: 'Nhắc nhở nhiều lần'
    },
    {
      criteriaId: 'crit-dh-1',
      criteriaName: 'Đi học muộn',
      group: 'Đi học',
      quantity: 1,
      pointsPerItem: -2,
      totalPoints: -2,
      note: 'Vào muộn 10 phút'
    },
    {
      criteriaId: 'crit-vs-2',
      criteriaName: 'Xả rác bừa bãi',
      group: 'Vệ sinh',
      quantity: 1,
      pointsPerItem: -2,
      totalPoints: -2
    }
  ]);

  // Modal for adding a violation (matching Panel 6)
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<ViolationGroup>('Trang phục');
  const [selectedCritId, setSelectedCritId] = useState<string>('crit-tp-1');
  const [quantity, setQuantity] = useState<number>(1);
  const [note, setNote] = useState<string>('');
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  // Filter criteria by group
  const groupCriteria = criteria.filter(c => c.group === selectedGroup);
  const selectedCriteriaObj = criteria.find(c => c.id === selectedCritId) || groupCriteria[0];

  const handleOpenAddModal = (group?: ViolationGroup) => {
    const targetGroup = group || 'Trang phục';
    setSelectedGroup(targetGroup);
    const crits = criteria.filter(c => c.group === targetGroup);
    setSelectedCritId(crits[0]?.id || criteria[0]?.id || '');
    setQuantity(1);
    setNote('');
    setModalOpen(true);
  };

  const handleSaveViolation = () => {
    if (!selectedCriteriaObj) return;

    const pointsPerItem = selectedCriteriaObj.points;
    const totalPoints = pointsPerItem * quantity;

    const newItem: ViolationRecordItem = {
      criteriaId: selectedCriteriaObj.id,
      criteriaName: selectedCriteriaObj.name,
      group: selectedGroup,
      quantity,
      pointsPerItem,
      totalPoints,
      note: note.trim() || undefined
    };

    setStagedViolations(prev => [...prev, newItem]);
    setModalOpen(false);
  };

  const handleRemoveStaged = (index: number) => {
    setStagedViolations(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmitScore = () => {
    if (stagedViolations.length === 0) {
      alert('Vui lòng thêm ít nhất một tiêu chí vi phạm trước khi gửi!');
      return;
    }

    submitScore({
      weekId: activeWeek?.id || 'w4',
      classId: selectedTargetClass,
      redFlagId: currentUser?.id || 'u-codo1',
      redFlagName: currentUser?.name || 'Nguyễn Văn A',
      date: new Date().toISOString().split('T')[0],
      dayLabel: selectedDay,
      area: selectedArea,
      content: Array.from(new Set(stagedViolations.map(v => v.group))).join(', '),
      status: 'pending',
      items: stagedViolations
    });

    setStagedViolations([]);
    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setActiveTab('history');
    }, 1500);
  };

  // Group violation counts for the UI summary
  const getViolationCountForGroup = (group: ViolationGroup) => {
    return stagedViolations
      .filter(v => v.group === group)
      .reduce((sum, v) => sum + v.quantity, 0);
  };

  const totalDeductedPoints = stagedViolations.reduce((sum, v) => sum + v.totalPoints, 0);

  // Submissions submitted by this user
  const userSubmissions = submissions.filter(
    s => (currentUser && s.redFlagName === currentUser.name) || s.classId === selectedTargetClass
  );

  return (
    <div className="p-3 sm:p-6 max-w-2xl mx-auto space-y-4">
      {/* Mobile-Styled Header from Panel 5 */}
      <div className="bg-gradient-to-r from-[#174db9] to-[#1a56db] text-white p-4 sm:p-5 rounded-2xl shadow-md space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm ring-2 ring-white/40">
              🚩
            </div>
            <div>
              <p className="text-xs text-blue-200">Xin chào, cờ đỏ</p>
              <h2 className="text-base sm:text-lg font-black tracking-wide">
                {currentUser?.name || 'Nguyễn Văn A'} ({currentUser?.assignedClass || '8A'})
              </h2>
            </div>
          </div>
          <span className="text-[11px] font-bold bg-white/15 px-2.5 py-1 rounded-full text-blue-100">
            {activeWeek?.name}
          </span>
        </div>

        <p className="text-xs text-blue-100/90 flex items-center gap-1.5 pt-1">
          <Calendar className="h-3.5 w-3.5" />
          <span>
            {activeWeek?.name}: {activeWeek?.startDate.split('-').reverse().join('/')} – {activeWeek?.endDate.split('-').reverse().join('/')}
          </span>
        </p>
      </div>

      {/* Mission Card: Nhiệm vụ của bạn (Panel 5) */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
            Nhiệm vụ của bạn
          </span>
          <span className="text-[11px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            Đang trực
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-blue-50/70 p-2 rounded-lg border border-blue-100">
            <span className="text-[10px] text-slate-500 block">Lớp được chấm</span>
            <select
              value={selectedTargetClass}
              onChange={e => setSelectedTargetClass(e.target.value)}
              className="text-base font-black text-blue-800 bg-transparent text-center focus:outline-none"
            >
              {classes.map(c => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
            <span className="text-[10px] text-slate-500 block">Ngày trực</span>
            <select
              value={selectedDay}
              onChange={e => setSelectedDay(e.target.value)}
              className="text-xs font-bold text-slate-800 bg-transparent text-center focus:outline-none mt-1"
            >
              <option value="Thứ 2">Thứ 2</option>
              <option value="Thứ 3">Thứ 3</option>
              <option value="Thứ 4">Thứ 4</option>
              <option value="Thứ 5">Thứ 5</option>
              <option value="Thứ 6">Thứ 6</option>
            </select>
          </div>

          <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
            <span className="text-[10px] text-slate-500 block">Khu vực</span>
            <span className="text-xs font-bold text-slate-800 block mt-1">{selectedArea}</span>
          </div>
        </div>

        {/* Progress pills from Panel 5 */}
        <div className="pt-1">
          <span className="text-[11px] text-slate-500 font-semibold block mb-1.5">
            Tiến độ tuần 4:
          </span>
          <div className="grid grid-cols-5 gap-1.5 text-center text-[11px]">
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 py-1 rounded font-bold">
              Thứ 2 ✓
            </div>
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 py-1 rounded font-bold">
              Thứ 3 ✓
            </div>
            <div className="bg-blue-600 text-white py-1 rounded font-bold shadow-xs">
              Thứ 4 ✓
            </div>
            <div className="bg-slate-100 border border-slate-200 text-slate-500 py-1 rounded">
              Thứ 5 chờ
            </div>
            <div className="bg-slate-100 border border-slate-200 text-slate-500 py-1 rounded">
              Thứ 6 chờ
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Nội dung chấm | Lịch sử chấm (Panel 5) */}
      <div className="flex rounded-xl bg-slate-200/70 p-1">
        <button
          onClick={() => setActiveTab('scoring')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'scoring'
              ? 'bg-white text-blue-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Nội dung chấm ({stagedViolations.length} lỗi)
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'history'
              ? 'bg-white text-blue-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Lịch sử chấm ({userSubmissions.length})
        </button>
      </div>

      {/* Tab 1: Nội dung chấm */}
      {activeTab === 'scoring' && (
        <div className="space-y-3">
          {/* Success Toast */}
          {submitSuccess && (
            <div className="p-3.5 bg-emerald-500 text-white rounded-xl text-xs font-bold text-center shadow-lg animate-in fade-in">
              ✓ Đã gửi kết quả chấm lớp {selectedTargetClass} thành công lên Ban Thi đua!
            </div>
          )}

          {/* Violation Groups matching Panel 5 */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs divide-y divide-slate-100">
            {(
              [
                'Trang phục',
                'Đi học',
                'Vệ sinh',
                'Truy bài',
                'Thể dục giữa giờ',
                'Nề nếp'
              ] as ViolationGroup[]
            ).map(grp => {
              const count = getViolationCountForGroup(grp);
              return (
                <div
                  key={grp}
                  onClick={() => handleOpenAddModal(grp)}
                  className="p-3.5 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span className="font-semibold text-xs text-slate-800">{grp}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        count > 0
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {count} lỗi
                    </span>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Staged violations preview before sending */}
          {stagedViolations.length > 0 && (
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">Chi tiết lỗi chuẩn bị gửi:</span>
                <span className="font-bold text-rose-600">
                  Tổng điểm trừ: {totalDeductedPoints} điểm
                </span>
              </div>

              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {stagedViolations.map((v, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-800">{v.criteriaName}</span>
                      <span className="text-slate-500 ml-2">x{v.quantity}</span>
                      {v.note && <span className="block text-[10px] text-slate-400">"{v.note}"</span>}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-rose-600">{v.totalPoints}đ</span>
                      <button
                        onClick={() => handleRemoveStaged(idx)}
                        className="text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleSubmitScore}
                className="w-full flex items-center justify-center space-x-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white py-3 text-xs font-bold shadow-md transition-colors cursor-pointer"
              >
                <Send className="h-4 w-4" />
                <span>GỬI PHIẾU CHẤM LỚP {selectedTargetClass} CHO TỔNG PHỤ TRÁCH</span>
              </button>
            </div>
          )}

          {/* Big Add Violation CTA Button matching Panel 5 */}
          <button
            onClick={() => handleOpenAddModal('Trang phục')}
            className="w-full flex items-center justify-center space-x-2 rounded-xl bg-[#1a56db] hover:bg-[#1546b3] text-white py-3.5 text-xs font-black uppercase tracking-wider shadow-md transition-colors"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            <span>+ THÊM LỖI VI PHẠM</span>
          </button>
        </div>
      )}

      {/* Tab 2: Lịch sử chấm */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-3">
          <span className="text-xs font-bold text-slate-800 block">
            Các phiếu chấm bạn đã nộp trong tuần
          </span>

          <div className="space-y-2.5 max-h-96 overflow-y-auto">
            {userSubmissions.map(sub => (
              <div
                key={sub.id}
                className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">
                    Lớp {sub.classId} - {sub.dayLabel} ({sub.date})
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      sub.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : sub.status === 'rejected'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {sub.status === 'approved'
                      ? 'Đã duyệt'
                      : sub.status === 'rejected'
                      ? 'Yêu cầu sửa'
                      : 'Chờ duyệt'}
                  </span>
                </div>

                <div className="text-[11px] text-slate-600">
                  {sub.items.map(it => (
                    <div key={it.criteriaId} className="flex justify-between py-0.5">
                      <span>• {it.criteriaName} (x{it.quantity})</span>
                      <span className="font-bold text-rose-600">{it.totalPoints}đ</span>
                    </div>
                  ))}
                </div>

                {sub.rejectionReason && (
                  <div className="p-2 bg-rose-50 border border-rose-200 rounded text-[11px] text-rose-700">
                    <strong>Lý do yêu cầu sửa:</strong> {sub.rejectionReason}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Panel 6 Modal: CHI TIẾT LỖI VI PHẠM */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="border-b border-slate-100 pb-2.5">
              <h3 className="font-black text-sm text-slate-900 uppercase">
                Thêm lỗi vi phạm - {selectedGroup}
              </h3>
              <p className="text-[11px] text-slate-500">Chấm cho lớp: {selectedTargetClass}</p>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* Group Selector */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nhóm lỗi</label>
                <select
                  value={selectedGroup}
                  onChange={e => {
                    const newGrp = e.target.value as ViolationGroup;
                    setSelectedGroup(newGrp);
                    const matched = criteria.filter(c => c.group === newGrp);
                    if (matched.length > 0) setSelectedCritId(matched[0].id);
                  }}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 bg-slate-50 font-medium focus:border-blue-500 focus:outline-none"
                >
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

              {/* Specific Violation Dropdown from Panel 6 */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Lỗi vi phạm</label>
                <select
                  value={selectedCritId}
                  onChange={e => setSelectedCritId(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 font-bold focus:border-blue-500 focus:outline-none"
                >
                  {groupCriteria.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.points} điểm)
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity Stepper: [-] [ 3 ] [+] from Panel 6 */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Số lượng học sinh vi phạm</label>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-10 w-10 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-black flex items-center justify-center text-base"
                  >
                    -
                  </button>
                  <span className="flex-1 text-center font-black text-lg text-slate-900 bg-slate-50 py-1.5 rounded-lg border border-slate-200">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-10 w-10 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-black flex items-center justify-center text-base"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Auto Calculated Penalty Points from Panel 6 */}
              <div className="bg-rose-50 p-2.5 rounded-lg border border-rose-200 flex items-center justify-between">
                <span className="font-semibold text-slate-700">Điểm trừ:</span>
                <span className="font-black text-base text-rose-600">
                  {selectedCriteriaObj ? selectedCriteriaObj.points * quantity : 0} điểm
                </span>
              </div>

              {/* Notes from Panel 6 */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Ghi chú (nếu có)</label>
                <input
                  type="text"
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="Ví dụ: Nhắc nhở nhiều lần, tại góc cầu thang..."
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Buttons: HỦY, LƯU LỖI from Panel 6 */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="w-full py-2.5 rounded-lg border border-slate-300 font-bold text-slate-600 hover:bg-slate-50"
                >
                  HỦY
                </button>
                <button
                  type="button"
                  onClick={handleSaveViolation}
                  className="w-full py-2.5 rounded-lg bg-[#1a56db] hover:bg-[#1546b3] text-white font-bold shadow-xs"
                >
                  LƯU LỖI
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
