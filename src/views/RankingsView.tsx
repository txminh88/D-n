import React, { useState } from 'react';
import {
  Trophy,
  Download,
  Filter,
  Medal,
  TrendingUp,
  FileSpreadsheet,
  Printer,
  Eye,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';

export const RankingsView: React.FC = () => {
  const {
    activeWeek,
    activeWeekId,
    setActiveWeekId,
    weeks,
    getRankingsForWeek,
    setActiveTab
  } = useApp();

  const [selectedGrade, setSelectedGrade] = useState<number | 'all'>('all');

  const allRankings = getRankingsForWeek(activeWeekId);

  const filteredRankings = allRankings.filter(r => {
    if (selectedGrade !== 'all' && r.grade !== selectedGrade) return false;
    return true;
  });

  const handleExportExcel = () => {
    // Fire celebratory confetti!
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 }
    });

    // Generate CSV content
    const headers = ['Hạng', 'Lớp', 'Khối', 'GVCN', 'Điểm gốc', 'Tổng điểm trừ', 'Điểm thi đua', 'Xếp loại'];
    const rows = filteredRankings.map(r => [
      r.rank,
      r.className,
      r.grade,
      `"${r.homeroomTeacher}"`,
      r.baseScore,
      r.totalMinusPoints,
      r.finalScore,
      `"${r.classification}"`
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Xep_hang_thi_dua_${activeWeek?.name.replace(/\s+/g, '_')}_Truong_PTDTBT_Quan_Ba.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getClassificationBadge = (cls: string) => {
    switch (cls) {
      case 'Tốt':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            Tốt
          </span>
        );
      case 'Khá':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            Khá
          </span>
        );
      case 'Đạt':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
            Đạt
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
            Cần cố gắng
          </span>
        );
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Top Header from Panel 8 */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            <span>Kết quả – Xếp hạng thi đua {activeWeek?.name}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Thời gian: {activeWeek?.startDate.split('-').reverse().join('/')} – {activeWeek?.endDate.split('-').reverse().join('/')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Week Selector */}
          <select
            value={activeWeekId}
            onChange={e => setActiveWeekId(e.target.value)}
            className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-none"
          >
            {weeks.map(w => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>

          {/* Export Excel Button from Panel 8 */}
          <button
            onClick={handleExportExcel}
            className="flex items-center space-x-1.5 rounded-lg bg-[#1a56db] hover:bg-[#1546b3] text-white px-3.5 py-1.5 text-xs font-bold shadow-xs transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Xuất Excel</span>
          </button>
        </div>
      </div>

      {/* Grade Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        <span className="text-xs font-bold text-slate-500 mr-2 flex items-center gap-1">
          <Filter className="h-3.5 w-3.5" />
          <span>Lọc theo:</span>
        </span>
        {[
          { label: 'Toàn trường', val: 'all' as const },
          { label: 'Khối 6', val: 6 },
          { label: 'Khối 7', val: 7 },
          { label: 'Khối 8', val: 8 },
          { label: 'Khối 9', val: 9 }
        ].map(tab => (
          <button
            key={tab.label}
            onClick={() => setSelectedGrade(tab.val)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedGrade === tab.val
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Ranking Table from Panel 8 */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4 w-20 text-center">Hạng</th>
                <th className="py-3.5 px-4">Lớp</th>
                <th className="py-3.5 px-4">Giáo viên chủ nhiệm</th>
                <th className="py-3.5 px-4 text-center">Tổng vi phạm</th>
                <th className="py-3.5 px-4 text-center">Tổng điểm trừ</th>
                <th className="py-3.5 px-4 text-center">Tổng điểm</th>
                <th className="py-3.5 px-4 text-center">Xếp loại</th>
                <th className="py-3.5 px-4 text-center w-28">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredRankings.map(item => {
                const isTop1 = item.rank === 1;
                const isTop2 = item.rank === 2;
                const isTop3 = item.rank === 3;

                return (
                  <tr
                    key={item.classId}
                    className={`hover:bg-blue-50/40 transition-colors ${
                      isTop1 ? 'bg-amber-50/30' : isTop2 ? 'bg-slate-50/50' : isTop3 ? 'bg-amber-50/20' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center">
                        {isTop1 ? (
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-400 font-black text-white text-xs shadow-xs ring-2 ring-amber-300">
                            1
                          </span>
                        ) : isTop2 ? (
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-300 font-black text-slate-800 text-xs shadow-xs ring-2 ring-slate-200">
                            2
                          </span>
                        ) : isTop3 ? (
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-700/60 font-black text-white text-xs shadow-xs ring-2 ring-amber-600/40">
                            3
                          </span>
                        ) : (
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-600 text-xs">
                            {item.rank}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-extrabold text-sm text-slate-900">{item.className}</span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">{item.homeroomTeacher}</td>

                    <td className="py-3.5 px-4 text-center text-slate-500 font-bold">
                      {item.violationCount} lỗi
                    </td>

                    <td className="py-3.5 px-4 text-center font-bold text-rose-600">
                      -{item.totalMinusPoints}đ
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="font-black text-sm text-blue-700 bg-blue-50/80 px-3 py-1 rounded-lg border border-blue-200 inline-block">
                        {item.finalScore}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {getClassificationBadge(item.classification)}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => setActiveTab('class_history')}
                        className="text-xs text-blue-600 hover:text-blue-800 font-bold hover:underline inline-flex items-center gap-1"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Xem lỗi</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
