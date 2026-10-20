import React from 'react';
import { RefreshCw } from 'lucide-react';

interface HeaderProps {
  is24Hour: boolean;
  onToggleTimeFormat: () => void;
  onResetToNow: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  is24Hour,
  onToggleTimeFormat,
  onResetToNow,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-2.5">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Brand / App Title */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-xs ring-1 ring-slate-800">
            ⇄
          </div>
          <div>
            <div className="text-base font-extrabold tracking-tight text-slate-900 leading-tight">
              BD <span className="text-indigo-600 font-normal">⇄</span> Melbourne
            </div>
            <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
              Android Time Converter
            </div>
          </div>
        </div>

        {/* Top App Bar Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleTimeFormat}
            type="button"
            className="min-h-[44px] px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all font-mono active:scale-95 cursor-pointer flex items-center"
            title="Toggle between 12-hour AM/PM and 24-hour military time"
          >
            {is24Hour ? '24H' : '12H'}
          </button>

          <button
            onClick={onResetToNow}
            type="button"
            className="min-h-[44px] px-3.5 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all flex items-center gap-1.5 shadow-xs active:scale-95 cursor-pointer"
            title="Reset to current live time"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Now</span>
          </button>
        </div>
      </div>
    </header>
  );
};
