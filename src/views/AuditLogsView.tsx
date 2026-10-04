import React, { useState } from 'react';
import {
  History,
  Shield,
  Search,
  Filter,
  Clock,
  User,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AuditLogsView: React.FC = () => {
  const { auditLogs } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = auditLogs.filter(log => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        log.userName.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <History className="h-5 w-5 text-blue-600" />
            <span>Nhật ký hệ thống (Audit Logs)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Lịch sử lưu vết tất cả các thao tác nhập điểm, duyệt, sửa đổi và quản trị hệ thống
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200">
            {auditLogs.length} sự kiện được ghi nhận
          </span>
        </div>
      </div>

      <div className="relative">
        <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Tìm theo người thực hiện, thao tác hoặc chi tiết..."
          className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-800 focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4 w-48">Thời gian</th>
                <th className="py-3.5 px-4">Người thực hiện</th>
                <th className="py-3.5 px-4">Vai trò</th>
                <th className="py-3.5 px-4">Hành động</th>
                <th className="py-3.5 px-4">Chi tiết nội dung</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {log.userName}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                      {log.userRole}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-blue-700">
                    {log.action}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
