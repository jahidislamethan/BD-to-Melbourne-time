import React, { useState } from 'react';
import {
  ArrowRightLeft,
  Calendar,
  Clock,
  Copy,
  Check,
  RotateCcw,
  Sun,
  Moon
} from 'lucide-react';
import {
  ZonedTimeDetails,
  getRelativeDayDifference,
} from '../utils/timeZoneUtils';

interface TimeConverterProps {
  direction: 'dhakaToMel' | 'melToDhaka';
  onSetDirection: (dir: 'dhakaToMel' | 'melToDhaka') => void;
  onToggleDirection: () => void;
  bdDetails: ZonedTimeDetails;
  melDetails: ZonedTimeDetails;
  is24Hour: boolean;
  onUpdateFromBd: (dateStr: string, timeStr: string) => void;
  onUpdateFromMel: (dateStr: string, timeStr: string) => void;
  onResetToCurrent: () => void;
}

export const TimeConverter: React.FC<TimeConverterProps> = ({
  direction,
  onSetDirection,
  onToggleDirection,
  bdDetails,
  melDetails,
  is24Hour,
  onUpdateFromBd,
  onUpdateFromMel,
  onResetToCurrent,
}) => {
  const [copied, setCopied] = useState(false);

  const isBdSource = direction === 'dhakaToMel';

  const dayDiff = isBdSource
    ? getRelativeDayDifference(bdDetails.dateStr, melDetails.dateStr)
    : getRelativeDayDifference(melDetails.dateStr, bdDetails.dateStr);

  const hoursDiff = (melDetails.offsetMinutes - bdDetails.offsetMinutes) / 60;

  // Step adjustment helpers
  const adjustBdMinutes = (deltaMinutes: number) => {
    const currentTotalMins = bdDetails.hours24 * 60 + bdDetails.minutes;
    let newTotalMins = (currentTotalMins + deltaMinutes) % 1440;
    if (newTotalMins < 0) newTotalMins += 1440;
    const h = Math.floor(newTotalMins / 60);
    const m = newTotalMins % 60;
    const timeStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    onUpdateFromBd(bdDetails.dateStr, timeStr);
  };

  const adjustMelMinutes = (deltaMinutes: number) => {
    const currentTotalMins = melDetails.hours24 * 60 + melDetails.minutes;
    let newTotalMins = (currentTotalMins + deltaMinutes) % 1440;
    if (newTotalMins < 0) newTotalMins += 1440;
    const h = Math.floor(newTotalMins / 60);
    const m = newTotalMins % 60;
    const timeStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    onUpdateFromMel(melDetails.dateStr, timeStr);
  };

  // Slider change
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const mins = Number(e.target.value);
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    const timeStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    if (isBdSource) {
      onUpdateFromBd(bdDetails.dateStr, timeStr);
    } else {
      onUpdateFromMel(melDetails.dateStr, timeStr);
    }
  };

  const activeSliderMins = isBdSource
    ? bdDetails.hours24 * 60 + bdDetails.minutes
    : melDetails.hours24 * 60 + melDetails.minutes;

  const handleCopyConversion = () => {
    const sourceText = isBdSource
      ? `${is24Hour ? bdDetails.formattedTime24 : bdDetails.formattedTime12} BST (Bangladesh)`
      : `${is24Hour ? melDetails.formattedTime24 : melDetails.formattedTime12} ${melDetails.timeZoneAbbr} (Melbourne)`;

    const targetText = isBdSource
      ? `${is24Hour ? melDetails.formattedTime24 : melDetails.formattedTime12} ${melDetails.timeZoneAbbr} (Melbourne)`
      : `${is24Hour ? bdDetails.formattedTime24 : bdDetails.formattedTime12} BST (Bangladesh)`;

    const text = `${sourceText} = ${targetText} [${isBdSource ? melDetails.formattedDate : bdDetails.formattedDate}]`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const bdPresets = [
    { label: '09:00 AM (Start)', time: '09:00' },
    { label: '01:00 PM (Lunch)', time: '13:00' },
    { label: '05:00 PM (COB)', time: '17:00' },
    { label: '08:00 PM (Night)', time: '20:00' },
  ];

  const melPresets = [
    { label: '09:00 AM (Start)', time: '09:00' },
    { label: '02:00 PM (Midday)', time: '14:00' },
    { label: '05:00 PM (COB)', time: '17:00' },
    { label: '09:00 PM (Night)', time: '21:00' },
  ];

  return (
    <section className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Top Header & Direction Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Bidirectional Time Converter
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Adjust either Bangladesh or Melbourne time to instantly compute the other.
          </p>
        </div>

        {/* Direction Segmented Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl shrink-0 self-stretch sm:self-auto">
          <button
            type="button"
            onClick={() => onSetDirection('dhakaToMel')}
            className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer text-center ${
              direction === 'dhakaToMel'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🇧🇩 BD → MEL 🇦🇺
          </button>
          <button
            type="button"
            onClick={() => onSetDirection('melToDhaka')}
            className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer text-center ${
              direction === 'melToDhaka'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🇦🇺 MEL → BD 🇧🇩
          </button>
        </div>
      </div>

      {/* Primary Result Statement Display Card */}
      <div className="rounded-2xl bg-slate-900 text-white p-4 sm:p-6 shadow-sm border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Active Conversion
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xl sm:text-3xl font-extrabold tracking-tight font-mono">
              <span className="text-emerald-400">
                {isBdSource
                  ? (is24Hour ? bdDetails.formattedTime24 : bdDetails.formattedTime12)
                  : (is24Hour ? melDetails.formattedTime24 : melDetails.formattedTime12)}
              </span>
              <span className="text-xs font-sans font-medium text-slate-400">
                {isBdSource ? 'BST (Dhaka)' : `${melDetails.timeZoneAbbr} (Melbourne)`}
              </span>
              <span className="text-slate-500 font-sans">➜</span>
              <span className="text-indigo-300">
                {isBdSource
                  ? (is24Hour ? melDetails.formattedTime24 : melDetails.formattedTime12)
                  : (is24Hour ? bdDetails.formattedTime24 : bdDetails.formattedTime12)}
              </span>
              <span className="text-xs font-sans font-medium text-slate-400">
                {isBdSource ? `${melDetails.timeZoneAbbr} (Melbourne)` : 'BST (Dhaka)'}
              </span>

              {dayDiff.diffDays !== 0 && (
                <span className="text-xs font-sans font-bold px-2.5 py-0.5 rounded-lg bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  {dayDiff.label}
                </span>
              )}
            </div>

            <div className="text-xs text-slate-400 font-medium">
              {isBdSource
                ? `Melbourne is ${hoursDiff} hours ahead (${melDetails.formattedDate})`
                : `Bangladesh is ${hoursDiff} hours behind (${bdDetails.formattedDate})`}
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            <button
              type="button"
              onClick={handleCopyConversion}
              className="min-h-[44px] px-4 py-2 text-xs font-bold bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border border-white/10 active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Result</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onResetToCurrent}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer active:scale-95"
              title="Reset both to current moment"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Dual Interactive Input Panels - Fluid 2-column or stacked grid */}
      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 items-stretch">
          {/* Bangladesh Card */}
          <div className={`rounded-2xl p-4 sm:p-6 border transition-all ${
            isBdSource
              ? 'bg-slate-50/90 border-indigo-500/50 ring-2 ring-indigo-500/10 shadow-xs'
              : 'bg-slate-50/50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl sm:text-3xl" role="img" aria-label="Bangladesh flag">🇧🇩</span>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">Bangladesh</h3>
                  <span className="text-xs text-slate-500 font-medium">Dhaka (BST)</span>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                {bdDetails.offsetString}
              </span>
            </div>

            {/* Date Picker */}
            <div className="mb-3">
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={bdDetails.dateStr}
                  onChange={(e) => onUpdateFromBd(e.target.value, bdDetails.formattedTime24)}
                  className="w-full min-h-[44px] px-3 py-2 pl-9 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-mono text-slate-900 cursor-pointer"
                />
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
              </div>
            </div>

            {/* Time Input */}
            <div className="mb-3">
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Time
              </label>
              <div className="relative">
                <input
                  type="time"
                  value={bdDetails.formattedTime24}
                  onChange={(e) => onUpdateFromBd(bdDetails.dateStr, e.target.value || '12:00')}
                  className="w-full min-h-[50px] px-3 py-2 pl-9 text-2xl sm:text-3xl font-extrabold bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-mono text-slate-900 cursor-pointer tabular-nums"
                />
                <Clock className="w-5 h-5 text-slate-400 absolute left-3 top-4 pointer-events-none" />
              </div>
            </div>

            {/* Fluid Steppers */}
            <div className="grid grid-cols-4 gap-1.5 sm:gap-2 mb-3.5">
              <button
                type="button"
                onClick={() => adjustBdMinutes(-60)}
                className="min-h-[44px] py-1.5 px-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 active:scale-95 transition-all text-center flex items-center justify-center cursor-pointer shadow-2xs"
              >
                -1h
              </button>
              <button
                type="button"
                onClick={() => adjustBdMinutes(-30)}
                className="min-h-[44px] py-1.5 px-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 active:scale-95 transition-all text-center flex items-center justify-center cursor-pointer shadow-2xs"
              >
                -30m
              </button>
              <button
                type="button"
                onClick={() => adjustBdMinutes(30)}
                className="min-h-[44px] py-1.5 px-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 active:scale-95 transition-all text-center flex items-center justify-center cursor-pointer shadow-2xs"
              >
                +30m
              </button>
              <button
                type="button"
                onClick={() => adjustBdMinutes(60)}
                className="min-h-[44px] py-1.5 px-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 active:scale-95 transition-all text-center flex items-center justify-center cursor-pointer shadow-2xs"
              >
                +1h
              </button>
            </div>

            {/* Presets */}
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-slate-400">Presets:</span>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {bdPresets.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => onUpdateFromBd(bdDetails.dateStr, p.time)}
                    className="min-h-[38px] px-2.5 py-1 text-xs font-medium bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg transition-all active:scale-95 cursor-pointer shadow-2xs flex items-center justify-center"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-600">
              <span className="font-medium">{bdDetails.formattedDate}</span>
              <span className="font-semibold text-slate-700">{bdDetails.periodLabel}</span>
            </div>
          </div>

          {/* Melbourne Card */}
          <div className={`rounded-2xl p-4 sm:p-6 border transition-all ${
            !isBdSource
              ? 'bg-indigo-50/60 border-indigo-500/50 ring-2 ring-indigo-500/10 shadow-xs'
              : 'bg-indigo-50/20 border-indigo-100'
          }`}>
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl sm:text-3xl" role="img" aria-label="Australia flag">🇦🇺</span>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">Melbourne</h3>
                  <span className="text-xs text-slate-500 font-medium">Victoria, Australia</span>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-indigo-900 bg-white px-2.5 py-1 rounded-lg border border-indigo-200 shadow-2xs">
                {melDetails.timeZoneAbbr} ({melDetails.offsetString})
              </span>
            </div>

            {/* Date Picker */}
            <div className="mb-3">
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={melDetails.dateStr}
                  onChange={(e) => onUpdateFromMel(e.target.value, melDetails.formattedTime24)}
                  className="w-full min-h-[44px] px-3 py-2 pl-9 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-mono text-slate-900 cursor-pointer"
                />
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
              </div>
            </div>

            {/* Time Input */}
            <div className="mb-3">
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Time
              </label>
              <div className="relative">
                <input
                  type="time"
                  value={melDetails.formattedTime24}
                  onChange={(e) => onUpdateFromMel(melDetails.dateStr, e.target.value || '12:00')}
                  className="w-full min-h-[50px] px-3 py-2 pl-9 text-2xl sm:text-3xl font-extrabold bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-mono text-slate-900 cursor-pointer tabular-nums"
                />
                <Clock className="w-5 h-5 text-slate-400 absolute left-3 top-4 pointer-events-none" />
              </div>
            </div>

            {/* Fluid Steppers */}
            <div className="grid grid-cols-4 gap-1.5 sm:gap-2 mb-3.5">
              <button
                type="button"
                onClick={() => adjustMelMinutes(-60)}
                className="min-h-[44px] py-1.5 px-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 active:scale-95 transition-all text-center flex items-center justify-center cursor-pointer shadow-2xs"
              >
                -1h
              </button>
              <button
                type="button"
                onClick={() => adjustMelMinutes(-30)}
                className="min-h-[44px] py-1.5 px-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 active:scale-95 transition-all text-center flex items-center justify-center cursor-pointer shadow-2xs"
              >
                -30m
              </button>
              <button
                type="button"
                onClick={() => adjustMelMinutes(30)}
                className="min-h-[44px] py-1.5 px-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 active:scale-95 transition-all text-center flex items-center justify-center cursor-pointer shadow-2xs"
              >
                +30m
              </button>
              <button
                type="button"
                onClick={() => adjustMelMinutes(60)}
                className="min-h-[44px] py-1.5 px-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 active:scale-95 transition-all text-center flex items-center justify-center cursor-pointer shadow-2xs"
              >
                +1h
              </button>
            </div>

            {/* Presets */}
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-slate-400">Presets:</span>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {melPresets.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => onUpdateFromMel(melDetails.dateStr, p.time)}
                    className="min-h-[38px] px-2.5 py-1 text-xs font-medium bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg transition-all active:scale-95 cursor-pointer shadow-2xs flex items-center justify-center"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-600">
              <span className="font-medium">{melDetails.formattedDate}</span>
              <span className="font-semibold text-slate-700">{melDetails.periodLabel}</span>
            </div>
          </div>
        </div>

        {/* Center Floating/Inline Swap Button */}
        <div className="flex justify-center my-3 md:my-0 md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:z-10">
          <button
            type="button"
            onClick={onToggleDirection}
            className="w-12 h-12 rounded-full bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center shadow-lg transition-all active:scale-90 cursor-pointer ring-4 ring-white"
            title="Swap conversion direction"
          >
            <ArrowRightLeft className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 24-Hour Timeline Slider */}
      <div className="pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="timeline-slider" className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-indigo-600" />
            <span>24-Hour Slider ({isBdSource ? 'Bangladesh Local Time' : 'Melbourne Local Time'})</span>
          </label>
          <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-200">
            {isBdSource
              ? (is24Hour ? bdDetails.formattedTime24 : bdDetails.formattedTime12)
              : (is24Hour ? melDetails.formattedTime24 : melDetails.formattedTime12)}
          </span>
        </div>

        <div className="relative py-2">
          <input
            id="timeline-slider"
            type="range"
            min="0"
            max="1425"
            step="15"
            value={activeSliderMins}
            onChange={handleSliderChange}
            className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />

          <div className="flex justify-between text-[11px] text-slate-400 font-mono mt-1 select-none">
            <span>00:00</span>
            <span>06:00</span>
            <span>12:00</span>
            <span>18:00</span>
            <span>23:45</span>
          </div>
        </div>
      </div>
    </section>
  );
};
