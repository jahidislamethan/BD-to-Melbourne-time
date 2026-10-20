/**
 * Bangladesh & Melbourne Time Converter - Flexible Android & Web Experience
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { LiveClockCards } from './components/LiveClockCards';
import { TimeConverter } from './components/TimeConverter';
import { AndroidInstallBanner } from './components/AndroidInstallBanner';
import { OfflineIndicator } from './components/OfflineIndicator';
import { Footer } from './components/Footer';
import {
  DHAKA_TZ,
  MELBOURNE_TZ,
  getZonedTimeDetails,
  parseZonedTimeToUtc,
  getTimeDifferenceSummary,
} from './utils/timeZoneUtils';

export default function App() {
  // Live ticking date/time state (1-second tick)
  const [currentUtcDate, setCurrentUtcDate] = useState(() => new Date());
  const [is24Hour, setIs24Hour] = useState(false);

  // Active converted moment (Single source of truth)
  const [activeUtcDate, setActiveUtcDate] = useState(() => new Date());

  // Direction: 'dhakaToMel' (BD -> Melbourne) or 'melToDhaka' (Melbourne -> BD)
  const [direction, setDirection] = useState<'dhakaToMel' | 'melToDhaka'>('dhakaToMel');

  // Live clock ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentUtcDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute live clock details
  const dhakaLive = useMemo(() => getZonedTimeDetails(currentUtcDate, DHAKA_TZ), [currentUtcDate]);
  const melbourneLive = useMemo(() => getZonedTimeDetails(currentUtcDate, MELBOURNE_TZ), [currentUtcDate]);
  const diffSummary = useMemo(() => getTimeDifferenceSummary(currentUtcDate), [currentUtcDate]);

  // Compute converter details
  const bdDetails = useMemo(() => getZonedTimeDetails(activeUtcDate, DHAKA_TZ), [activeUtcDate]);
  const melDetails = useMemo(() => getZonedTimeDetails(activeUtcDate, MELBOURNE_TZ), [activeUtcDate]);

  // Handlers for bidirectional conversion
  const handleUpdateFromBd = (dateStr: string, timeStr: string) => {
    const newUtc = parseZonedTimeToUtc(dateStr, timeStr, DHAKA_TZ);
    setActiveUtcDate(newUtc);
    setDirection('dhakaToMel');
  };

  const handleUpdateFromMel = (dateStr: string, timeStr: string) => {
    const newUtc = parseZonedTimeToUtc(dateStr, timeStr, MELBOURNE_TZ);
    setActiveUtcDate(newUtc);
    setDirection('melToDhaka');
  };

  const handleToggleDirection = () => {
    setDirection(prev => (prev === 'dhakaToMel' ? 'melToDhaka' : 'dhakaToMel'));
  };

  const handleSetDirection = (dir: 'dhakaToMel' | 'melToDhaka') => {
    setDirection(dir);
  };

  const handleResetToNow = () => {
    setActiveUtcDate(new Date());
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white antialiased">
      {/* Top App Bar */}
      <Header
        is24Hour={is24Hour}
        onToggleTimeFormat={() => setIs24Hour(prev => !prev)}
        onResetToNow={handleResetToNow}
      />

      {/* Offline Toast */}
      <OfflineIndicator />

      {/* Fluid Responsive Main Viewport */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Android PWA Install Banner */}
        <AndroidInstallBanner />

        {/* 1. Live Clocks Section */}
        <LiveClockCards
          dhakaLive={dhakaLive}
          melbourneLive={melbourneLive}
          is24Hour={is24Hour}
          timeDiffDescription={diffSummary.description}
          hoursDiff={diffSummary.hoursDifference}
        />

        {/* 2. Interactive Time Converter */}
        <TimeConverter
          direction={direction}
          onSetDirection={handleSetDirection}
          onToggleDirection={handleToggleDirection}
          bdDetails={bdDetails}
          melDetails={melDetails}
          is24Hour={is24Hour}
          onUpdateFromBd={handleUpdateFromBd}
          onUpdateFromMel={handleUpdateFromMel}
          onResetToCurrent={handleResetToNow}
        />
      </main>

      {/* Clean Footer */}
      <Footer />
    </div>
  );
}
