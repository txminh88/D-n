import React from 'react';
import { X, Smartphone } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RedFlagScoringView } from '../views/RedFlagScoringView';

export const RedFlagPhoneSimulatorModal: React.FC = () => {
  const { mobileSimulatorOpen, setMobileSimulatorOpen } = useApp();

  if (!mobileSimulatorOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="relative flex flex-col items-center">
        {/* Top close button and label */}
        <div className="flex items-center justify-between w-full max-w-[390px] mb-2 text-white">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-cyan-300">
            <Smartphone className="h-4 w-4" />
            <span>Mô phỏng Giao diện Điện thoại Cờ Đỏ (Panel 5 & 6)</span>
          </div>
          <button
            onClick={() => setMobileSimulatorOpen(false)}
            className="rounded-full bg-white/20 p-1 text-white hover:bg-white/30"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Realistic Mobile Device Frame */}
        <div className="w-[370px] sm:w-[390px] h-[780px] bg-slate-900 rounded-[44px] p-3 shadow-2xl border-4 border-slate-700 ring-4 ring-black/40 flex flex-col relative overflow-hidden">
          {/* Phone Dynamic Island / Notch */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 h-5 w-28 bg-black rounded-full z-40 flex items-center justify-end pr-3">
            <div className="h-2.5 w-2.5 rounded-full bg-slate-900 ring-1 ring-slate-800" />
          </div>

          {/* Screen Content */}
          <div className="w-full h-full bg-slate-50 rounded-[34px] overflow-y-auto pt-6 flex flex-col relative custom-scrollbar">
            <RedFlagScoringView />
          </div>

          {/* Home indicator bar */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/50 rounded-full" />
        </div>
      </div>
    </div>
  );
};
