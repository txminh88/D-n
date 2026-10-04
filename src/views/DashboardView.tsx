import React from 'react';
import {
  School,
  Users,
  ClipboardList,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Trophy,
  ArrowRight,
  Clock,
  Sparkles,
  Info,
  Calendar
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DashboardView: React.FC = () => {
  const {
    activeWeek,
    weeks,
    activeWeekId,
    setActiveWeekId,
    setActiveTab,
    kpiStats,
    classes
  } = useApp();

  const handleRefresh = () => {
    // Quick refresh flash
    const elem = document.getElementById('dashboard-content');
    if (elem) {
      elem.classList.add('opacity-50');
      setTimeout(() => elem.classList.remove('opacity-50'), 200);
    }
  };

  // Classes for the bar chart
  const barChartClasses = [
    { name: '6A', score: 88 },
    { name: '6B', score: 80 },
    { name: '7A', score: 86 },
    { name: '7B', score: 91 },
    { name: '8A', score: 94 },
    { name: '8B', score: 83 },
    { name: '9A', score: 96 },
    { name: '9B', score: 79 }
  ];

  return (
    <div id="dashboard-content" className="p-4 sm:p-6 space-y-6 transition-opacity duration-200">
      {/* Top Filter Bar from Panel 2 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-xs border border-slate-200/80">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <span>Tổng quan</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Báo cáo tiến độ chấm thi đua và bảng điểm thời gian thực
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Academic Year Filter */}
          <div className="flex items-center space-x-1.5 text-xs">
            <span className="text-slate-500 font-medium">Năm học:</span>
            <select
              defaultValue="2026-2027"
              className="rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-1.5 font-semibold text-slate-700 focus:border-blue-500 focus:outline-none"
            >
              <option value="2026-2027">2026 - 2027</option>
              <option value="2025-2026">2025 - 2026</option>
            </select>
          </div>

          {/* Week Selector */}
          <div className="flex items-center space-x-1.5 text-xs">
            <span className="text-slate-500 font-medium">Tuần:</span>
            <select
              value={activeWeekId}
              onChange={e => setActiveWeekId(e.target.value)}
              className="rounded-lg border border-blue-300 bg-blue-50/50 px-3 py-1.5 font-bold text-blue-800 focus:border-blue-600 focus:outline-none"
            >
              {weeks.map(w => (
                <option key={w.id} value={w.id}>
                  {w.name} ({w.startDate.split('-').reverse().slice(0, 2).join('/')} - {w.endDate.split('-').reverse().slice(0, 2).join('/')})
                </option>
              ))}
            </select>
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            className="flex items-center space-x-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs transition-colors"
          >
            <RotateCw className="h-3.5 w-3.5 text-slate-500" />
            <span>Làm mới</span>
          </button>
        </div>
      </div>

      {/* 5 KPI Cards from Panel 2 */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3.5">
        {/* Card 1: Tổng số lớp */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Tổng số lớp</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{kpiStats.totalClasses}</p>
          </div>
          <div className="h-11 w-11 rounded-xl bg-blue-100/80 flex items-center justify-center text-blue-600">
            <School className="h-6 w-6" />
          </div>
        </div>

        {/* Card 2: Cờ đỏ được phân công */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Cờ đỏ được phân công</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{kpiStats.totalRedFlags}</p>
          </div>
          <div className="h-11 w-11 rounded-xl bg-cyan-100/80 flex items-center justify-center text-cyan-600">
            <Users className="h-6 w-6" />
          </div>
        </div>

        {/* Card 3: Lượt chấm trong tuần */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Lượt chấm trong tuần</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{kpiStats.totalChecks}</p>
          </div>
          <div className="h-11 w-11 rounded-xl bg-indigo-100/80 flex items-center justify-center text-indigo-600">
            <ClipboardList className="h-6 w-6" />
          </div>
        </div>

        {/* Card 4: Đã hoàn thành */}
        <div className="bg-white p-4 rounded-xl border border-emerald-200/80 shadow-xs flex items-center justify-between bg-gradient-to-br from-white to-emerald-50/20">
          <div>
            <p className="text-xs font-medium text-slate-500">Đã hoàn thành</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">{kpiStats.completedChecks}</p>
          </div>
          <div className="h-11 w-11 rounded-xl bg-emerald-100/90 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>

        {/* Card 5: Chưa hoàn thành */}
        <div className="bg-white p-4 rounded-xl border border-rose-200/80 shadow-xs flex items-center justify-between bg-gradient-to-br from-white to-rose-50/20 col-span-2 sm:col-span-1">
          <div>
            <p className="text-xs font-medium text-slate-500">Chưa hoàn thành</p>
            <p className="text-2xl font-black text-rose-600 mt-1">{kpiStats.pendingChecks}</p>
          </div>
          <div className="h-11 w-11 rounded-xl bg-rose-100/90 flex items-center justify-center text-rose-600">
            <AlertTriangle className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Middle Row: 3 Cards from Panel 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* CARD 1: TIẾN ĐỘ HOÀN THÀNH (Donut Chart) */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
              TIẾN ĐỘ HOÀN THÀNH
            </h3>
            <span className="text-[11px] font-semibold text-blue-600">{activeWeek?.name}</span>
          </div>

          <div className="py-6 flex flex-col sm:flex-row items-center justify-center gap-6">
            {/* SVG Donut */}
            <div className="relative flex items-center justify-center">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="48"
                  stroke="#fee2e2"
                  strokeWidth="14"
                  fill="transparent"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="48"
                  stroke="#1a56db"
                  strokeWidth="14"
                  strokeDasharray={`${(kpiStats.completionRate / 100) * 301.59} 301.59`}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-slate-800">{kpiStats.completionRate}%</span>
                <span className="text-[10px] text-slate-400 font-medium">Hoàn thành</span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-xs bg-[#1a56db]" />
                <span className="text-slate-600">Đã hoàn thành:</span>
                <span className="font-bold text-slate-800">{kpiStats.completedChecks}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-xs bg-rose-500" />
                <span className="text-slate-600">Chưa hoàn thành:</span>
                <span className="font-bold text-slate-800">{kpiStats.pendingChecks}</span>
              </div>
              <div className="pt-2 text-[11px] text-slate-400">
                Cập nhật lúc 11:45 hôm nay
              </div>
            </div>
          </div>
        </div>

        {/* CARD 2: TOP 5 LỚP DẪN ĐẦU TUẦN 4 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Trophy className="h-4 w-4 text-amber-500" />
              <span>TOP 5 LỚP DẪN ĐẦU {activeWeek?.name?.toUpperCase()}</span>
            </h3>
            <button
              onClick={() => setActiveTab('rankings')}
              className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-0.5"
            >
              <span>Chi tiết</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 py-1">
            {kpiStats.top5.map((item, index) => {
              const medalColors = [
                'bg-amber-100 text-amber-800 border-amber-300 ring-amber-400',
                'bg-slate-200 text-slate-700 border-slate-300 ring-slate-300',
                'bg-amber-700/20 text-amber-900 border-amber-500/40 ring-amber-600',
                'bg-blue-50 text-blue-700 border-blue-200',
                'bg-blue-50 text-blue-700 border-blue-200'
              ];

              return (
                <div key={item.classId} className="flex items-center justify-between py-2 px-1 hover:bg-slate-50/80 rounded transition-colors">
                  <div className="flex items-center space-x-3">
                    <span
                      className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-black border ${
                        medalColors[index] || 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {item.rank}
                    </span>
                    <span className="font-bold text-sm text-slate-800">{item.className}</span>
                    <span className="text-[11px] text-slate-400 hidden sm:inline">Khối {item.grade}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-blue-700 text-sm">{item.finalScore}</span>
                    <span className="text-xs text-slate-500 font-medium">điểm</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CARD 3: CẢNH BÁO */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <span>CẢNH BÁO & NHẮC NHỞ</span>
            </h3>
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
          </div>

          <div className="space-y-2.5 py-1.5">
            <div className="flex items-start space-x-2.5 p-2 rounded-lg bg-amber-50/70 border border-amber-200/70 text-xs">
              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold text-amber-900">3 cờ đỏ chưa nhập dữ liệu</span>
                <p className="text-[11px] text-amber-700 mt-0.5">Lớp 6A, 6B, 8A (ca chiều Thứ 4)</p>
              </div>
            </div>

            <div
              onClick={() => setActiveTab('approval')}
              className="flex items-start space-x-2.5 p-2 rounded-lg bg-blue-50/70 border border-blue-200/70 text-xs cursor-pointer hover:bg-blue-100/60 transition-colors"
            >
              <ClipboardList className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold text-blue-900">{kpiStats.pendingApprovalCount} phiếu chấm đang chờ duyệt</span>
                <p className="text-[11px] text-blue-700 mt-0.5">Nhấp vào đây để xem và duyệt kết quả ngay</p>
              </div>
            </div>

            <div
              onClick={() => setActiveTab('approval')}
              className="flex items-start space-x-2.5 p-2 rounded-lg bg-rose-50/70 border border-rose-200/70 text-xs cursor-pointer hover:bg-rose-100/60 transition-colors"
            >
              <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold text-rose-900">{kpiStats.rejectedCount} dữ liệu yêu cầu sửa</span>
                <p className="text-[11px] text-rose-700 mt-0.5">Đã gửi phản hồi yêu cầu cờ đỏ cập nhật lại</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
              <Clock className="h-3.5 w-3.5 text-slate-500 shrink-0" />
              <span className="text-[11px]">Tuần 4 sẽ đóng vào Thứ 7 (04/10/2026)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: 2 Charts from Panel 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* BIỂU ĐỒ SO SÁNH ĐIỂM TRUNG BÌNH (Bar Chart) */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
              BIỂU ĐỒ SO SÁNH ĐIỂM TRUNG BÌNH CÁC LỚP
            </h3>
            <span className="text-[11px] font-semibold text-slate-500">Thang điểm 100</span>
          </div>

          <div className="pt-6 pb-2">
            {/* Custom High Quality Clean SVG Bar Chart */}
            <div className="h-56 flex items-end justify-between gap-2 sm:gap-4 px-2 border-b border-slate-200 pb-2 relative">
              {/* Background grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                <div className="border-b border-dashed border-slate-400 w-full" />
                <div className="border-b border-dashed border-slate-400 w-full" />
                <div className="border-b border-dashed border-slate-400 w-full" />
                <div className="border-b border-dashed border-slate-400 w-full" />
                <div className="border-b border-slate-400 w-full" />
              </div>

              {barChartClasses.map((item) => {
                const heightPercent = (item.score / 100) * 100;
                return (
                  <div key={item.name} className="flex-1 flex flex-col items-center h-full justify-end group z-10">
                    <span className="text-[11px] font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                      {item.score}
                    </span>
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full max-w-[34px] bg-[#1a56db] hover:bg-[#1542a8] rounded-t-md transition-all duration-300 shadow-xs group-hover:brightness-110"
                    />
                    <span className="text-xs font-bold text-slate-600 mt-2">{item.name}</span>
                  </div>
                );
              })}
            </div>

            {/* Y Axis Legend */}
            <div className="flex justify-between text-[10px] text-slate-400 pt-1 px-1">
              <span>0đ</span>
              <span>20đ</span>
              <span>40đ</span>
              <span>60đ</span>
              <span>80đ</span>
              <span>100đ</span>
            </div>
          </div>
        </div>

        {/* THỐNG KÊ LỖI NHIỀU NHẤT (Horizontal Bar Chart) */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
              THỐNG KÊ LỖI NHIỀU NHẤT
            </h3>
            <span className="text-[11px] font-semibold text-slate-500">Số lượt vi phạm</span>
          </div>

          <div className="pt-5 space-y-3.5">
            {kpiStats.violationFrequencies.map((item) => {
              const maxCount = 65;
              const widthPercent = (item.count / maxCount) * 100;

              return (
                <div key={item.name} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700">{item.name}</span>
                    <span className="font-bold text-blue-700">{item.count}</span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${widthPercent}%` }}
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
