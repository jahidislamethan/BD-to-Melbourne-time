import React, { useState } from 'react';
import { Sun, Moon, Copy, Check } from 'lucide-react';
import { ZonedTimeDetails } from '../utils/timeZoneUtils';

interface LiveClockCardsProps {
  dhakaLive: ZonedTimeDetails;
  melbourneLive: ZonedTimeDetails;
  is24Hour: boolean;
  timeDiffDescription: string;
  hoursDiff: number;
}

export const LiveClockCards: React.FC<LiveClockCardsProps> = ({
  dhakaLive,
  melbourneLive,
  is24Hour,
  timeDiffDescription,
  hoursDiff,
}) => {
  const [copiedCity, setCopiedCity] = useState<string | null>(null);

  const copyLiveTime = (city: string, details: ZonedTimeDetails) => {
    const formatted = `${city}: ${is24Hour ? details.formattedTime24 : details.formattedTime12} (${details.timeZoneAbbr}) · ${details.formattedDate}`;
    navigator.clipboard.writeText(formatted);
    setCopiedCity(city);
    setTimeout(() => setCopiedCity(null), 2000);
  };

  const isDhakaDay = dhakaLive.hours24 >= 6 && dhakaLive.hours24 < 18;
  const isMelbourneDay = melbourneLive.hours24 >= 6 && melbourneLive.hours24 < 18;

  return (
    <section className="space-y-4">
      {/* Live Offset Relationship Pill */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[11px] uppercase font-bold tracking-wider text-slate-500">Live Sync</span>
          <span className="text-slate-300">·</span>
          <span className="text-xs sm:text-sm font-bold text-slate-900">{timeDiffDescription}</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-slate-600 bg-slate-100/80 px-3 py-1.5 rounded-xl border border-slate-200/60 self-start sm:self-auto">
          <span>Dhaka {dhakaLive.offsetString}</span>
          <span className="text-slate-400">→</span>
          <span className="font-extrabold text-indigo-600">+{hoursDiff}h</span>
          <span className="text-slate-400">→</span>
          <span>Melbourne {melbourneLive.offsetString}</span>
        </div>
      </div>

      {/* Dual Clocks (Stacked or 2-col) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Dhaka, Bangladesh */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs relative overflow-hidden transition-all hover:border-slate-300">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl" role="img" aria-label="Bangladesh flag">🇧🇩</span>
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 tracking-tight leading-tight">Dhaka</h2>
                <div className="text-xs text-slate-500 font-medium">Bangladesh · BST (UTC+06:00)</div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <div
                className={`p-2 rounded-xl transition-colors ${
                  isDhakaDay ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-600'
                }`}
                title={isDhakaDay ? 'Daytime in Dhaka' : 'Nighttime in Dhaka'}
              >
                {isDhakaDay ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </div>
              <button
                type="button"
                onClick={() => copyLiveTime('Dhaka, Bangladesh', dhakaLive)}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer active:scale-95"
                title="Copy current Bangladesh time"
              >
                {copiedCity === 'Dhaka, Bangladesh' ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Time Display */}
          <div className="my-5">
            <div className="flex items-baseline gap-1 font-mono tracking-tight">
              <span className="text-4xl sm:text-5xl font-extrabold text-slate-900 tabular-nums">
                {is24Hour ? dhakaLive.formattedTime24 : dhakaLive.formattedTime12.replace(/\s[AP]M/, '')}
              </span>
              <span className="text-xl font-medium text-slate-400 tabular-nums">
                :{dhakaLive.formattedSeconds}
              </span>
              {!is24Hour && (
                <span className="text-lg font-bold text-indigo-600 ml-1.5">
                  {dhakaLive.formattedTime12.slice(-2)}
                </span>
              )}
            </div>

            <div className="mt-2 text-xs sm:text-sm text-slate-600 flex items-center gap-2">
              <span className="font-semibold text-slate-800">{dhakaLive.formattedDate}</span>
              <span className="text-slate-300">·</span>
              <span className="text-slate-500">{dhakaLive.periodLabel}</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>Bangladesh Standard Time</span>
            <span className="text-emerald-700 font-semibold">Standard (No DST)</span>
          </div>
        </div>

        {/* Melbourne, Australia */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs relative overflow-hidden transition-all hover:border-slate-300">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl" role="img" aria-label="Australia flag">🇦🇺</span>
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 tracking-tight leading-tight">Melbourne</h2>
                <div className="text-xs text-slate-500 font-medium">
                  Australia · {melbourneLive.timeZoneAbbr} ({melbourneLive.offsetString})
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <div
                className={`p-2 rounded-xl transition-colors ${
                  isMelbourneDay ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-600'
                }`}
                title={isMelbourneDay ? 'Daytime in Melbourne' : 'Nighttime in Melbourne'}
              >
                {isMelbourneDay ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </div>
              <button
                type="button"
                onClick={() => copyLiveTime('Melbourne, Australia', melbourneLive)}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer active:scale-95"
                title="Copy current Melbourne time"
              >
                {copiedCity === 'Melbourne, Australia' ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Time Display */}
          <div className="my-5">
            <div className="flex items-baseline gap-1 font-mono tracking-tight">
              <span className="text-4xl sm:text-5xl font-extrabold text-slate-900 tabular-nums">
                {is24Hour ? melbourneLive.formattedTime24 : melbourneLive.formattedTime12.replace(/\s[AP]M/, '')}
              </span>
              <span className="text-xl font-medium text-slate-400 tabular-nums">
                :{melbourneLive.formattedSeconds}
              </span>
              {!is24Hour && (
                <span className="text-lg font-bold text-indigo-600 ml-1.5">
                  {melbourneLive.formattedTime12.slice(-2)}
                </span>
              )}
            </div>

            <div className="mt-2 text-xs sm:text-sm text-slate-600 flex items-center gap-2">
              <span className="font-semibold text-slate-800">{melbourneLive.formattedDate}</span>
              <span className="text-slate-300">·</span>
              <span className="text-slate-500">{melbourneLive.periodLabel}</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>{melbourneLive.isDaylightSaving ? 'Daylight Saving Time (AEDT)' : 'Standard Time (AEST)'}</span>
            <span className="text-indigo-600 font-semibold">
              {melbourneLive.isDaylightSaving ? 'Summer Time (UTC+11)' : 'Winter Time (UTC+10)'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
