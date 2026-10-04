import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { TopNavBar } from './components/TopNavBar';
import { Sidebar } from './components/Sidebar';
import { LoginModal } from './components/LoginModal';
import { RedFlagPhoneSimulatorModal } from './components/RedFlagPhoneSimulatorModal';

import { DashboardView } from './views/DashboardView';
import { WeeksView } from './views/WeeksView';
import { ClassesView } from './views/ClassesView';
import { UserManagementView } from './views/UserManagementView';
import { RedFlagsView } from './views/RedFlagsView';
import { AssignmentsView } from './views/AssignmentsView';
import { ViolationsCatalogView } from './views/ViolationsCatalogView';
import { RedFlagScoringView } from './views/RedFlagScoringView';
import { ApprovalView } from './views/ApprovalView';
import { RankingsView } from './views/RankingsView';
import { ReportsView } from './views/ReportsView';
import { ClassHistoryView } from './views/ClassHistoryView';
import { WeeklyMinutesView } from './views/WeeklyMinutesView';
import { SettingsView } from './views/SettingsView';
import { AuditLogsView } from './views/AuditLogsView';

import {
  LayoutDashboard,
  Edit3,
  CheckSquare,
  Trophy,
  Menu,
  X
} from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeTab, setActiveTab, kpiStats, currentUser } = useApp();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'weeks':
        return <WeeksView />;
      case 'classes':
        return <ClassesView />;
      case 'user_management':
        return <UserManagementView />;
      case 'red_flags':
        return <RedFlagsView />;
      case 'assignments':
        return <AssignmentsView />;
      case 'criteria':
      case 'violations_catalog':
        return <ViolationsCatalogView />;
      case 'red_flag_input':
        return <RedFlagScoringView />;
      case 'approval':
        return <ApprovalView />;
      case 'rankings':
        return <RankingsView />;
      case 'reports':
        return <ReportsView />;
      case 'class_history':
        return <ClassHistoryView />;
      case 'minutes':
        return <WeeklyMinutesView />;
      case 'settings':
        return <SettingsView />;
      case 'audit_logs':
        return <AuditLogsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-[#f4f7fb]">
      {/* Header */}
      <Header onToggleMobileNav={() => setMobileNavOpen(!mobileNavOpen)} />

      {/* Top Functions and Categories Navigation Bar (Đặt các chức năng, danh mục ở trên) */}
      <TopNavBar />

      {/* Main Body with Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block h-full shrink-0">
          <Sidebar />
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileNavOpen && (
          <div className="fixed inset-0 z-40 flex lg:hidden">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileNavOpen(false)}
            />
            <div className="relative flex w-64 max-w-xs flex-1 flex-col bg-[#0d3466] text-white z-50">
              <div className="flex items-center justify-between p-3 border-b border-blue-900">
                <span className="font-bold text-xs uppercase text-cyan-300">Menu Hệ Thống</span>
                <button
                  onClick={() => setMobileNavOpen(false)}
                  className="rounded-lg p-1 text-slate-300 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <Sidebar onCloseMobile={() => setMobileNavOpen(false)} />
            </div>
          </div>
        )}

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto pb-16 lg:pb-6 custom-scrollbar">
          {renderActiveView()}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around border-t border-slate-200 bg-white py-1.5 shadow-lg lg:hidden print:hidden">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center p-1 text-[10px] font-bold ${
            activeTab === 'dashboard' ? 'text-blue-700' : 'text-slate-500'
          }`}
        >
          <LayoutDashboard className="h-5 w-5" />
          <span>Tổng quan</span>
        </button>

        <button
          onClick={() => setActiveTab('red_flag_input')}
          className={`flex flex-col items-center p-1 text-[10px] font-bold ${
            activeTab === 'red_flag_input' ? 'text-blue-700' : 'text-slate-500'
          }`}
        >
          <Edit3 className="h-5 w-5" />
          <span>Chấm điểm</span>
        </button>

        <button
          onClick={() => setActiveTab('approval')}
          className={`flex flex-col items-center p-1 text-[10px] font-bold relative ${
            activeTab === 'approval' ? 'text-blue-700' : 'text-slate-500'
          }`}
        >
          <div className="relative">
            <CheckSquare className="h-5 w-5" />
            {kpiStats.pendingApprovalCount > 0 && (
              <span className="absolute -top-1 -right-2 h-4 w-4 rounded-full bg-amber-500 text-[9px] font-black text-white flex items-center justify-center">
                {kpiStats.pendingApprovalCount}
              </span>
            )}
          </div>
          <span>Duyệt</span>
        </button>

        <button
          onClick={() => setActiveTab('rankings')}
          className={`flex flex-col items-center p-1 text-[10px] font-bold ${
            activeTab === 'rankings' ? 'text-blue-700' : 'text-slate-500'
          }`}
        >
          <Trophy className="h-5 w-5" />
          <span>Xếp hạng</span>
        </button>

        <button
          onClick={() => setMobileNavOpen(true)}
          className="flex flex-col items-center p-1 text-[10px] font-bold text-slate-500"
        >
          <Menu className="h-5 w-5" />
          <span>Thêm</span>
        </button>
      </div>

      {/* Global Modals */}
      <LoginModal />
      <RedFlagPhoneSimulatorModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
