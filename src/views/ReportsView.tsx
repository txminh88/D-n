import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  PieChart as PieIcon,
  Calendar,
  Filter,
  School,
  Download,
  Award
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ReportsView: React.FC = () => {
  const { weeks, classes, getRankingsForWeek, activeWeekId } = useApp();

  const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'term'>('week');

  // Trend line points across weeks
  const weekTrendData = [
    { label: 'Tuần 1', avg: 89.4 },
    { label: 'Tuần 2', avg: 91.2 },
    { label: 'Tuần 3', avg: 90.8 },
    { label: 'Tuần 4', avg: 93.5 }
  ];

  // Violation breakdown from Panel 10
  const violationShareData = [
    { name: 'Không đeo khăn quàng', percent: 30, color: '#1a56db' },
    { name: 'Nói chuyện trong giờ', percent: 22, color: '#06b6d4' },
    { name: 'Đi học muộn', percent: 18, color: '#f59e0b' },
    { name: 'Xả rác', percent: 15, color: '#10b981' },
    { name: 'Khác', percent: 15, color: '#8b5cf6' }
  ];

  // Grade comparison
  const gradeAvgs = [
    { grade: 'Khối 6', score: 84.0, count: 4 },
    { grade: 'Khối 7', score: 88.5, count: 4 },
    { grade: 'Khối 8', score: 88.5, count: 4 },
    { grade: 'Khối 9', score: 87.5, count: 4 }
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Top Header from Panel 10 */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <span>Thống kê – Báo cáo thi đua</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Phân tích số liệu vi phạm, xu hướng thi đua và biểu đồ trực quan
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {['week', 'month', 'term'].map(mode => (
            <button
              key={mode}
              onClick={() => setTimeFilter(mode as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                timeFilter === mode
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {mode === 'week' ? 'Theo tuần' : mode === 'month' ? 'Theo tháng' : 'Theo học kỳ'}
            </button>
          ))}
        </div>
      </div>

      {/* Two main charts from Panel 10 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Chart 1: Thống kê theo tuần (Line Chart) */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <span>Thống kê theo tuần (Điểm trung bình toàn trường)</span>
            </h3>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              +4.1đ so với Tuần 1
            </span>
          </div>

          <div className="pt-2">
            {/* SVG Line Chart */}
            <div className="relative h-56 w-full flex items-end">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 400 160">
                {/* Grid lines */}
                <line x1="0" y1="40" x2="400" y2="40" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="0" y1="80" x2="400" y2="80" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="0" y1="120" x2="400" y2="120" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />

                {/* Path line */}
                <path
                  d="M 40 100 Q 140 70 240 75 T 360 30"
                  fill="none"
                  stroke="#1a56db"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Area under curve */}
                <path
                  d="M 40 100 Q 140 70 240 75 T 360 30 L 360 160 L 40 160 Z"
                  fill="url(#blueGradient)"
                  opacity="0.15"
                />

                <defs>
                  <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1a56db" />
                    <stop offset="100%" stopColor="#ffffff" />
                  </linearGradient>
                </defs>

                {/* Data points */}
                <circle cx="40" cy="100" r="5" fill="#1a56db" stroke="#ffffff" strokeWidth="2" />
                <text x="40" y="85" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#1e293b">89.4</text>

                <circle cx="140" cy="70" r="5" fill="#1a56db" stroke="#ffffff" strokeWidth="2" />
                <text x="140" y="55" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#1e293b">91.2</text>

                <circle cx="240" cy="75" r="5" fill="#1a56db" stroke="#ffffff" strokeWidth="2" />
                <text x="240" y="60" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#1e293b">90.8</text>

                <circle cx="360" cy="30" r="6" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                <text x="360" y="18" fontSize="11" fontWeight="black" textAnchor="middle" fill="#10b981">93.5</text>
              </svg>
            </div>

            <div className="flex justify-between text-xs font-bold text-slate-500 pt-2 border-t border-slate-200">
              <span className="w-20 text-center">Tuần 1</span>
              <span className="w-20 text-center">Tuần 2</span>
              <span className="w-20 text-center">Tuần 3</span>
              <span className="w-20 text-center text-blue-600">Tuần 4 (Hiện tại)</span>
            </div>
          </div>
        </div>

        {/* Chart 2: Thống kê lỗi vi phạm (Donut / Pie Chart) from Panel 10 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <PieIcon className="h-4 w-4 text-cyan-600" />
              <span>Thống kê lỗi vi phạm theo tỷ lệ (%)</span>
            </h3>
            <span className="text-[11px] font-semibold text-slate-500">171 lỗi ghi nhận</span>
          </div>

          <div className="py-2 flex flex-col sm:flex-row items-center justify-center gap-6">
            {/* SVG Pie Chart */}
            <div className="relative h-44 w-44 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Slice 1: 30% */}
                <circle cx="50" cy="50" r="35" fill="transparent" stroke="#1a56db" strokeWidth="20" strokeDasharray="65.97 153.94" strokeDashoffset="0" />
                {/* Slice 2: 22% */}
                <circle cx="50" cy="50" r="35" fill="transparent" stroke="#06b6d4" strokeWidth="20" strokeDasharray="48.38 171.53" strokeDashoffset="-65.97" />
                {/* Slice 3: 18% */}
                <circle cx="50" cy="50" r="35" fill="transparent" stroke="#f59e0b" strokeWidth="20" strokeDasharray="39.58 180.33" strokeDashoffset="-114.35" />
                {/* Slice 4: 15% */}
                <circle cx="50" cy="50" r="35" fill="transparent" stroke="#10b981" strokeWidth="20" strokeDasharray="32.99 186.92" strokeDashoffset="-153.93" />
                {/* Slice 5: 15% */}
                <circle cx="50" cy="50" r="35" fill="transparent" stroke="#8b5cf6" strokeWidth="20" strokeDasharray="32.99 186.92" strokeDashoffset="-186.92" />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-xs font-black text-slate-700">TỔNG</span>
                <span className="text-base font-black text-blue-700">100%</span>
              </div>
            </div>

            {/* Legend from Panel 10 */}
            <div className="space-y-2 text-xs w-full sm:w-auto">
              {violationShareData.map(item => (
                <div key={item.name} className="flex items-center justify-between sm:justify-start space-x-2">
                  <div className="flex items-center space-x-2">
                    <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-700 font-medium text-xs">{item.name}</span>
                  </div>
                  <span className="font-black text-slate-900 text-xs ml-auto">({item.percent}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grade Level Summary Table */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
          So sánh điểm trung bình giữa các khối học
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {gradeAvgs.map(g => (
            <div key={g.grade} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-xs font-bold text-slate-500 block">{g.grade}</span>
              <span className="text-2xl font-black text-blue-700 block mt-1">{g.score}</span>
              <span className="text-[10px] text-slate-400 mt-1 block">Gồm 4 chi đội</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
