import React, { useState } from 'react';
import { Download, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { AppIcon } from './AppIcon';

export const AndroidInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);
  const [showAndroidGuide, setShowAndroidGuide] = useState(false);

  if (dismissed || isInstalled) {
    return null;
  }

  return (
    <>
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-3.5 sm:p-4 rounded-2xl shadow-md border border-indigo-900/40 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <AppIcon size={44} className="shadow-lg rounded-xl shrink-0" />
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <span>Android Mobile App</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span className="text-slate-300 font-normal">Offline Ready</span>
            </div>
            <div className="text-sm font-semibold text-white tracking-tight">
              Install on your Android Device
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isInstallable ? (
            <button
              type="button"
              onClick={install}
              className="px-4 py-2 text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl transition-all shadow-sm flex items-center gap-1.5 active:scale-95 cursor-pointer whitespace-nowrap min-h-[44px]"
            >
              <Download className="w-4 h-4" />
              <span>Install App</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowAndroidGuide(true)}
              className="px-3.5 py-2 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap min-h-[44px]"
            >
              <Download className="w-4 h-4" />
              <span>Install Guide</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="p-2 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            title="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Android Install Instructions Dialog */}
      {showAndroidGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl text-slate-900 border border-slate-200">
            <div className="flex items-center gap-3 mb-3">
              <AppIcon size={40} className="rounded-xl shadow-xs" />
              <div>
                <h3 className="text-lg font-bold">Install on Android</h3>
                <div className="text-xs text-slate-500">BD ⇄ Melbourne Time Converter</div>
              </div>
            </div>
            <div className="space-y-3 text-sm text-slate-600 mt-4">
              <div className="flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
                <span>Open this page in <strong>Chrome for Android</strong>.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
                <span>Tap the three dots <strong>menu (⋮)</strong> at the top right.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">3</span>
                <span>Tap <strong>Install App</strong> or <strong>Add to Home screen</strong>.</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowAndroidGuide(false)}
              className="mt-6 w-full py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};
