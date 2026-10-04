import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  FileDown,
  Edit3,
  Check,
  Eye,
  School,
  Save,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const WeeklyMinutesView: React.FC = () => {
  const {
    activeWeek,
    activeWeekId,
    minutes,
    updateMinutes,
    getRankingsForWeek,
    settings
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    advantages: minutes.advantages,
    drawbacks: minutes.drawbacks,
    generalComments: minutes.generalComments,
    recommendations: minutes.recommendations
  });
  const [savedToast, setSavedToast] = useState(false);

  const rankings = getRankingsForWeek(activeWeekId);

  const handleSave = () => {
    updateMinutes(formData);
    setIsEditing(false);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportWord = () => {
    const content = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>Biên bản trực tuần ${activeWeek?.name}</title>
      <style>
        body { font-family: 'Times New Roman', serif; font-size: 13pt; line-height: 1.4; }
        h1, h2, h3 { text-align: center; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th, td { border: 1px solid black; padding: 6px; text-align: left; }
        th { text-align: center; background-color: #f2f2f2; }
      </style>
      </head>
      <body>
        <table style="border:none; width: 100%;">
          <tr style="border:none;">
            <td style="border:none; text-align: center; width: 45%;">
              <strong>${settings.schoolName}</strong><br/>
              <strong>LIÊN ĐỘI TNTP HỒ CHÍ MINH</strong><br/>
              ***
            </td>
            <td style="border:none; text-align: center; width: 55%;">
              <strong>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong><br/>
              <strong>Độc lập - Tự do - Hạnh phúc</strong><br/>
              <em>Quản Bạ, ngày ${new Date().getDate()} tháng ${new Date().getMonth() + 1} năm ${new Date().getFullYear()}</em>
            </td>
          </tr>
        </table>
        <br/>
        <h2 style="text-align: center; text-transform: uppercase;">BIÊN BẢN NHẬN XÉT TRỰC TUẦN</h2>
        <h3 style="text-align: center;">${activeWeek?.name} (${activeWeek?.startDate} - ${activeWeek?.endDate})</h3>
        
        <h3>I. ƯU ĐIỂM</h3>
        <p>${formData.advantages.replace(/\n/g, '<br/>')}</p>

        <h3>II. TỒN TẠI</h3>
        <p>${formData.drawbacks.replace(/\n/g, '<br/>')}</p>

        <h3>III. KẾT QUẢ THI ĐUA</h3>
        <table>
          <thead>
            <tr>
              <th>Hạng</th>
              <th>Lớp</th>
              <th>GVCN</th>
              <th>Điểm trừ</th>
              <th>Tổng điểm</th>
              <th>Xếp loại</th>
            </tr>
          </thead>
          <tbody>
            ${rankings
              .map(
                r => `<tr>
              <td style="text-align:center;">${r.rank}</td>
              <td style="text-align:center;"><strong>${r.className}</strong></td>
              <td>${r.homeroomTeacher}</td>
              <td style="text-align:center;">-${r.totalMinusPoints}</td>
              <td style="text-align:center;"><strong>${r.finalScore}</strong></td>
              <td style="text-align:center;">${r.classification}</td>
            </tr>`
              )
              .join('')}
          </tbody>
        </table>

        <h3>IV. NHẬN XÉT</h3>
        <p>${formData.generalComments.replace(/\n/g, '<br/>')}</p>

        <h3>V. KIẾN NGHỊ VÀ PHƯƠNG HƯỚNG</h3>
        <p>${formData.recommendations.replace(/\n/g, '<br/>')}</p>
        <br/><br/>
        <table style="border:none; width: 100%;">
          <tr style="border:none;">
            <td style="border:none; text-align: center; width: 50%;">
              <strong>BAN GIÁM HIỆU DUYỆT</strong><br/><br/><br/><br/>
              <strong>${settings.principalName}</strong>
            </td>
            <td style="border:none; text-align: center; width: 50%;">
              <strong>TỔNG PHỤ TRÁCH ĐỘI</strong><br/><br/><br/><br/>
              <strong>${settings.chiefOfficerName}</strong>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff' + content], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Bien_ban_truc_tuan_${activeWeek?.name.replace(/\s+/g, '_')}_Quan_Ba.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Top Action Bar from Panel 9 */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <span>Biên bản trực tuần</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Văn bản nhận xét thi đua chính thức của Liên đội trường PTDTBT TH&THCS Quản Bạ
          </p>
        </div>

        {/* Action buttons from Panel 9: Xem trước, Tải Word, Tải PDF, In */}
        <div className="flex flex-wrap items-center gap-2">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="flex items-center space-x-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 text-xs font-bold shadow-xs transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>Lưu biên bản</span>
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 text-xs font-bold transition-colors"
            >
              <Edit3 className="h-3.5 w-3.5 text-slate-600" />
              <span>Chỉnh sửa nội dung</span>
            </button>
          )}

          <button
            onClick={handleExportWord}
            className="flex items-center space-x-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-3 py-1.5 text-xs font-bold transition-colors"
          >
            <Download className="h-3.5 w-3.5 text-blue-600" />
            <span>Tải Word</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 rounded-lg bg-[#1a56db] hover:bg-[#1546b3] text-white px-3.5 py-1.5 text-xs font-bold shadow-xs transition-colors"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>In / Xuất PDF</span>
          </button>
        </div>
      </div>

      {savedToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2 print:hidden animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>Đã lưu nội dung biên bản thành công!</span>
        </div>
      )}

      {/* Official School Document Sheet from Panel 9 */}
      <div className="bg-white rounded-xl border border-slate-300 p-8 sm:p-12 shadow-md max-w-4xl mx-auto text-slate-900 font-serif leading-relaxed text-sm">
        {/* National Header */}
        <div className="grid grid-cols-2 text-center pb-6 border-b border-slate-200">
          <div>
            <p className="font-bold text-xs uppercase tracking-tight text-slate-800">
              {settings.schoolName}
            </p>
            <p className="font-bold text-xs uppercase text-slate-700">
              LIÊN ĐỘI TNTP HỒ CHÍ MINH
            </p>
            <div className="w-16 h-0.5 bg-slate-400 mx-auto mt-1" />
          </div>

          <div>
            <p className="font-bold text-xs uppercase tracking-tight text-slate-800">
              CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
            </p>
            <p className="font-bold text-xs text-slate-700">
              Độc lập - Tự do - Hạnh phúc
            </p>
            <div className="w-24 h-0.5 bg-slate-400 mx-auto mt-1" />
            <p className="text-[11px] italic text-slate-500 mt-2">
              Quản Bạ, ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm {new Date().getFullYear()}
            </p>
          </div>
        </div>

        {/* Document Title from Panel 9 */}
        <div className="text-center py-6">
          <h1 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-slate-900">
            BIÊN BẢN NHẬN XÉT TRỰC TUẦN
          </h1>
          <p className="text-sm font-semibold text-slate-700 mt-1">
            {activeWeek?.name}: {activeWeek?.startDate.split('-').reverse().join('/')} – {activeWeek?.endDate.split('-').reverse().join('/')}
          </p>
        </div>

        {/* Section I: Ưu điểm from Panel 9 */}
        <div className="space-y-2 py-3">
          <h2 className="font-bold text-sm uppercase tracking-wide text-slate-900 flex items-center gap-1.5">
            <span>I. ƯU ĐIỂM</span>
          </h2>
          {isEditing ? (
            <textarea
              rows={4}
              value={formData.advantages}
              onChange={e => setFormData({ ...formData, advantages: e.target.value })}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-sans focus:outline-none focus:border-blue-500"
            />
          ) : (
            <div className="whitespace-pre-line text-slate-800 text-xs sm:text-sm pl-2">
              {formData.advantages}
            </div>
          )}
        </div>

        {/* Section II: Tồn tại from Panel 9 */}
        <div className="space-y-2 py-3">
          <h2 className="font-bold text-sm uppercase tracking-wide text-slate-900 flex items-center gap-1.5">
            <span>II. TỒN TẠI</span>
          </h2>
          {isEditing ? (
            <textarea
              rows={4}
              value={formData.drawbacks}
              onChange={e => setFormData({ ...formData, drawbacks: e.target.value })}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-sans focus:outline-none focus:border-blue-500"
            />
          ) : (
            <div className="whitespace-pre-line text-slate-800 text-xs sm:text-sm pl-2">
              {formData.drawbacks}
            </div>
          )}
        </div>

        {/* Section III: Kết quả thi đua from Panel 9 */}
        <div className="space-y-3 py-3">
          <h2 className="font-bold text-sm uppercase tracking-wide text-slate-900">
            III. KẾT QUẢ THI ĐUA
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-slate-300 text-xs text-center font-sans">
              <thead className="bg-slate-100 font-bold text-slate-800">
                <tr>
                  <th className="border border-slate-300 py-2 px-3">Hạng</th>
                  <th className="border border-slate-300 py-2 px-3">Lớp</th>
                  <th className="border border-slate-300 py-2 px-3">GVCN</th>
                  <th className="border border-slate-300 py-2 px-3">Tổng điểm</th>
                  <th className="border border-slate-300 py-2 px-3">Xếp loại</th>
                </tr>
              </thead>
              <tbody>
                {rankings.map(r => (
                  <tr key={r.classId} className="hover:bg-slate-50">
                    <td className="border border-slate-300 py-1.5 px-3 font-bold">{r.rank}</td>
                    <td className="border border-slate-300 py-1.5 px-3 font-bold">{r.className}</td>
                    <td className="border border-slate-300 py-1.5 px-3 text-left">{r.homeroomTeacher}</td>
                    <td className="border border-slate-300 py-1.5 px-3 font-black text-blue-700">{r.finalScore}</td>
                    <td className="border border-slate-300 py-1.5 px-3">{r.classification}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section IV: Nhận xét from Panel 9 */}
        <div className="space-y-2 py-3">
          <h2 className="font-bold text-sm uppercase tracking-wide text-slate-900">
            IV. NHẬN XÉT
          </h2>
          {isEditing ? (
            <textarea
              rows={3}
              value={formData.generalComments}
              onChange={e => setFormData({ ...formData, generalComments: e.target.value })}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-sans focus:outline-none focus:border-blue-500"
            />
          ) : (
            <div className="whitespace-pre-line text-slate-800 text-xs sm:text-sm pl-2">
              {formData.generalComments}
            </div>
          )}
        </div>

        {/* Section V: Kiến nghị from Panel 9 */}
        <div className="space-y-2 py-3">
          <h2 className="font-bold text-sm uppercase tracking-wide text-slate-900">
            V. KIẾN NGHỊ
          </h2>
          {isEditing ? (
            <textarea
              rows={3}
              value={formData.recommendations}
              onChange={e => setFormData({ ...formData, recommendations: e.target.value })}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-sans focus:outline-none focus:border-blue-500"
            />
          ) : (
            <div className="whitespace-pre-line text-slate-800 text-xs sm:text-sm pl-2">
              {formData.recommendations}
            </div>
          )}
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-2 text-center pt-8 mt-4 border-t border-slate-200">
          <div>
            <p className="font-bold text-xs uppercase text-slate-800">BAN GIÁM HIỆU DUYỆT</p>
            <p className="text-[11px] italic text-slate-500">(Ký và ghi rõ họ tên)</p>
            <div className="h-16" />
            <p className="font-bold text-xs text-slate-800">{settings.principalName}</p>
          </div>

          <div>
            <p className="font-bold text-xs uppercase text-slate-800">TỔNG PHỤ TRÁCH ĐỘI</p>
            <p className="text-[11px] italic text-slate-500">(Ký và ghi rõ họ tên)</p>
            <div className="h-16" />
            <p className="font-bold text-xs text-slate-800">{settings.chiefOfficerName}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
