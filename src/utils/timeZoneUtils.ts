/**
 * Bulletproof Timezone calculation and formatting utilities for
 * Bangladesh (Asia/Dhaka) and Melbourne, Australia (Australia/Melbourne).
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ZonedTimeDetails {
  date: Date;
  dateStr: string; // YYYY-MM-DD
  formattedDate: string; // "Tuesday, 20 Oct 2026"
  formattedTime12: string; // "02:30 PM"
  formattedTime24: string; // "14:30"
  formattedSeconds: string; // "45"
  hours24: number; // 0-23
  minutes: number; // 0-59
  seconds: number; // 0-59
  timeZoneAbbr: string; // "BST" or "AEDT" / "AEST"
  offsetString: string; // "+06:00" or "+11:00"
  offsetMinutes: number; // 360 (for UTC+6) or 660 (for UTC+11) or 600 (for UTC+10)
  isDaylightSaving: boolean;
  periodOfDay: 'night' | 'early_morning' | 'business' | 'evening';
  periodLabel: string;
}

export const DHAKA_TZ = 'Asia/Dhaka';
export const MELBOURNE_TZ = 'Australia/Melbourne';

/**
 * Sanitizes input date (YYYY-MM-DD) and time (HH:mm) strings.
 * Guarantees valid numeric outputs.
 */
function sanitizeDateTimeInputs(dateStr?: string, timeStr?: string): {
  year: number;
  month: number;
  day: number;
  hours: number;
  minutes: number;
  seconds: number;
  safeDateStr: string;
  safeTimeStr: string;
} {
  const now = new Date();
  let year = now.getUTCFullYear();
  let month = now.getUTCMonth() + 1;
  let day = now.getUTCDate();
  let hours = now.getUTCHours();
  let minutes = now.getUTCMinutes();
  let seconds = 0;

  if (dateStr && typeof dateStr === 'string' && dateStr.includes('-')) {
    const parts = dateStr.split('-').map(Number);
    if (parts.length >= 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
      year = parts[0];
      month = Math.min(Math.max(parts[1], 1), 12);
      day = Math.min(Math.max(parts[2], 1), 31);
    }
  }

  if (timeStr && typeof timeStr === 'string' && timeStr.includes(':')) {
    const parts = timeStr.split(':').map(Number);
    if (!isNaN(parts[0])) {
      hours = Math.min(Math.max(parts[0], 0), 23);
    }
    if (parts.length > 1 && !isNaN(parts[1])) {
      minutes = Math.min(Math.max(parts[1], 0), 59);
    }
    if (parts.length > 2 && !isNaN(parts[2])) {
      seconds = Math.min(Math.max(parts[2], 0), 59);
    }
  }

  const safeDateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  const safeTimeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

  return { year, month, day, hours, minutes, seconds, safeDateStr, safeTimeStr };
}

/**
 * Parses a local date string (YYYY-MM-DD) and time string (HH:mm or HH:mm:ss)
 * in a specified IANA time zone, returning the exact UTC Date object.
 * Guaranteed never to throw an unhandled exception.
 */
export function parseZonedTimeToUtc(
  dateStr: string,
  timeStr: string,
  timeZone: string
): Date {
  try {
    const { year, month, day, hours, minutes, seconds } = sanitizeDateTimeInputs(dateStr, timeStr);

    // Initial estimate in UTC
    const guessUtc = new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds));
    if (isNaN(guessUtc.getTime())) {
      return new Date();
    }

    // Determine local time guessUtc corresponds to in the requested time zone
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timeZone || DHAKA_TZ,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false,
    });

    const getOffsetDiff = (utcDate: Date): number => {
      const parts = formatter.formatToParts(utcDate);
      const getPart = (type: string) => Number(parts.find(p => p.type === type)?.value ?? 0);
      const zYear = getPart('year');
      const zMonth = getPart('month');
      const zDay = getPart('day');
      let zHour = getPart('hour');
      if (zHour === 24) zHour = 0;
      const zMinute = getPart('minute');
      const zSecond = getPart('second');

      const asUtcOfZoned = Date.UTC(zYear, zMonth - 1, zDay, zHour, zMinute, zSecond);
      return asUtcOfZoned - utcDate.getTime();
    };

    const diff1 = getOffsetDiff(guessUtc);
    const candidate = new Date(guessUtc.getTime() - diff1);
    const diff2 = getOffsetDiff(candidate);

    const result = new Date(guessUtc.getTime() - diff2);
    return isNaN(result.getTime()) ? new Date() : result;
  } catch {
    return new Date();
  }
}

/**
 * Extracts comprehensive zoned time details for a given UTC Date and time zone.
 * Guaranteed to never throw.
 */
export function getZonedTimeDetails(utcDateInput: Date | unknown, timeZone: string): ZonedTimeDetails {
  let utcDate = utcDateInput instanceof Date && !isNaN(utcDateInput.getTime())
    ? utcDateInput
    : new Date();

  try {
    const partsFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timeZone || DHAKA_TZ,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZoneName: 'short',
    });

    const parts = partsFormatter.formatToParts(utcDate);
    const getPartVal = (type: string) => parts.find(p => p.type === type)?.value ?? '';

    const year = getPartVal('year') || '2026';
    const month = getPartVal('month') || '01';
    const day = getPartVal('day') || '01';
    let hour = Number(getPartVal('hour') || '0');
    if (hour === 24) hour = 0;
    const minute = Number(getPartVal('minute') || '0');
    const second = Number(getPartVal('second') || '0');
    const rawTzAbbr = getPartVal('timeZoneName');

    const dateStr = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

    // Date display string
    const dateDisplayFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timeZone || DHAKA_TZ,
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    const formattedDate = dateDisplayFormatter.format(utcDate);

    // 12-hour format with AM/PM
    const time12Formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timeZone || DHAKA_TZ,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    const formattedTime12 = time12Formatter.format(utcDate);

    // 24-hour format
    const hours24Padded = hour.toString().padStart(2, '0');
    const minutesPadded = minute.toString().padStart(2, '0');
    const secondsPadded = second.toString().padStart(2, '0');
    const formattedTime24 = `${hours24Padded}:${minutesPadded}`;

    // Time zone offset calculation
    const localAsUtc = Date.UTC(Number(year), Number(month) - 1, Number(day), hour, minute, second);
    const offsetMs = localAsUtc - utcDate.getTime();
    const offsetMinutes = Math.round(offsetMs / 60000);

    const sign = offsetMinutes >= 0 ? '+' : '-';
    const absOffset = Math.abs(offsetMinutes);
    const offsetHours = Math.floor(absOffset / 60);
    const offsetMins = absOffset % 60;
    const offsetString = `UTC${sign}${offsetHours.toString().padStart(2, '0')}:${offsetMins.toString().padStart(2, '0')}`;

    // Canonical readable time zone abbreviation
    let timeZoneAbbr = rawTzAbbr;
    let isDaylightSaving = false;

    if (timeZone === DHAKA_TZ) {
      timeZoneAbbr = 'BST';
      isDaylightSaving = false;
    } else if (timeZone === MELBOURNE_TZ) {
      if (offsetMinutes >= 660 || rawTzAbbr.includes('AEDT') || rawTzAbbr.includes('+11')) {
        timeZoneAbbr = 'AEDT';
        isDaylightSaving = true;
      } else {
        timeZoneAbbr = 'AEST';
        isDaylightSaving = false;
      }
    }

    // Period classification
    let periodOfDay: 'night' | 'early_morning' | 'business' | 'evening' = 'business';
    let periodLabel = 'Business Hours';

    if (hour >= 23 || hour < 7) {
      periodOfDay = 'night';
      periodLabel = 'Night / Sleeping';
    } else if (hour >= 7 && hour < 9) {
      periodOfDay = 'early_morning';
      periodLabel = 'Early Morning';
    } else if (hour >= 9 && hour < 18) {
      periodOfDay = 'business';
      periodLabel = 'Business Hours';
    } else {
      periodOfDay = 'evening';
      periodLabel = 'Evening / Leisure';
    }

    return {
      date: utcDate,
      dateStr,
      formattedDate,
      formattedTime12,
      formattedTime24,
      formattedSeconds: secondsPadded,
      hours24: hour,
      minutes: minute,
      seconds: second,
      timeZoneAbbr,
      offsetString,
      offsetMinutes,
      isDaylightSaving,
      periodOfDay,
      periodLabel,
    };
  } catch {
    // Fallback safe object
    return {
      date: new Date(),
      dateStr: '2026-10-20',
      formattedDate: 'Tue, 20 Oct 2026',
      formattedTime12: '12:00 PM',
      formattedTime24: '12:00',
      formattedSeconds: '00',
      hours24: 12,
      minutes: 0,
      seconds: 0,
      timeZoneAbbr: timeZone === DHAKA_TZ ? 'BST' : 'AEDT',
      offsetString: timeZone === DHAKA_TZ ? 'UTC+06:00' : 'UTC+11:00',
      offsetMinutes: timeZone === DHAKA_TZ ? 360 : 660,
      isDaylightSaving: timeZone === MELBOURNE_TZ,
      periodOfDay: 'business',
      periodLabel: 'Business Hours',
    };
  }
}

/**
 * Calculates the relative day difference between target date and source date.
 */
export function getRelativeDayDifference(sourceDateStr: string, targetDateStr: string): {
  diffDays: number;
  label: string;
} {
  try {
    const dSource = new Date(sourceDateStr + 'T00:00:00Z');
    const dTarget = new Date(targetDateStr + 'T00:00:00Z');
    if (isNaN(dSource.getTime()) || isNaN(dTarget.getTime())) {
      return { diffDays: 0, label: 'Same Day' };
    }
    const diffDays = Math.round((dTarget.getTime() - dSource.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return { diffDays, label: 'Tomorrow (+1d)' };
    if (diffDays === -1) return { diffDays, label: 'Yesterday (-1d)' };
    if (diffDays > 1) return { diffDays, label: `+${diffDays} Days` };
    if (diffDays < -1) return { diffDays, label: `${diffDays} Days` };
    return { diffDays: 0, label: 'Same Day' };
  } catch {
    return { diffDays: 0, label: 'Same Day' };
  }
}

/**
 * Calculates current live time offset difference between Melbourne and Bangladesh.
 */
export function getTimeDifferenceSummary(utcDate: Date = new Date()): {
  hoursDifference: number;
  isMelbourneDst: boolean;
  description: string;
} {
  try {
    const bd = getZonedTimeDetails(utcDate, DHAKA_TZ);
    const mel = getZonedTimeDetails(utcDate, MELBOURNE_TZ);
    const diffMinutes = mel.offsetMinutes - bd.offsetMinutes;
    const hoursDifference = diffMinutes / 60;

    return {
      hoursDifference,
      isMelbourneDst: mel.isDaylightSaving,
      description: `Melbourne is ${hoursDifference} hours ahead of Bangladesh (${mel.timeZoneAbbr})`,
    };
  } catch {
    return {
      hoursDifference: 5,
      isMelbourneDst: true,
      description: 'Melbourne is 5 hours ahead of Bangladesh (AEDT)',
    };
  }
}

/**
 * Generates an hourly breakdown for a 24-hour day to display in an interactive matrix.
 */
export interface HourComparisonSlot {
  hourIndex: number; // 0 to 23
  sourceDetails: ZonedTimeDetails;
  targetDetails: ZonedTimeDetails;
  dayDiff: { diffDays: number; label: string };
  isOverlapFriendly: boolean;
  isBusinessOverlap: boolean;
}

export function generate24HourSlots(
  referenceDateStr: string,
  sourceZone: string,
  targetZone: string
): HourComparisonSlot[] {
  const slots: HourComparisonSlot[] = [];
  const safeDate = referenceDateStr && referenceDateStr.includes('-') ? referenceDateStr : '2026-10-20';

  for (let h = 0; h < 24; h++) {
    const timeStr = `${h.toString().padStart(2, '0')}:00`;
    const utcDate = parseZonedTimeToUtc(safeDate, timeStr, sourceZone);
    const sourceDetails = getZonedTimeDetails(utcDate, sourceZone);
    const targetDetails = getZonedTimeDetails(utcDate, targetZone);
    const dayDiff = getRelativeDayDifference(sourceDetails.dateStr, targetDetails.dateStr);

    // Business hours overlap: both between 09:00 and 18:00
    const isBusinessOverlap =
      sourceDetails.hours24 >= 9 &&
      sourceDetails.hours24 < 18 &&
      targetDetails.hours24 >= 9 &&
      targetDetails.hours24 < 18;

    // Overlap friendly: both awake (between 08:00 and 22:00)
    const isOverlapFriendly =
      sourceDetails.hours24 >= 8 &&
      sourceDetails.hours24 <= 22 &&
      targetDetails.hours24 >= 8 &&
      targetDetails.hours24 <= 22;

    slots.push({
      hourIndex: h,
      sourceDetails,
      targetDetails,
      dayDiff,
      isOverlapFriendly,
      isBusinessOverlap,
    });
  }

  return slots;
}

/**
 * Generates a Google Calendar link for a meeting.
 */
export function createGoogleCalendarUrl(
  title: string,
  description: string,
  utcStart: Date,
  durationMinutes: number
): string {
  try {
    const formatUtcGCal = (d: Date) => {
      return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    };

    const utcEnd = new Date(utcStart.getTime() + durationMinutes * 60000);
    const dates = `${formatUtcGCal(utcStart)}/${formatUtcGCal(utcEnd)}`;

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: title || 'Bangladesh & Melbourne Sync',
      details: description || '',
      dates: dates,
      location: 'Dhaka, Bangladesh / Melbourne, Victoria, Australia (Virtual)',
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  } catch {
    return 'https://calendar.google.com';
  }
}

/**
 * Generates an .ics file string for downloading into Apple Calendar or Outlook.
 */
export function createIcsFileContent(
  title: string,
  description: string,
  utcStart: Date,
  durationMinutes: number
): string {
  try {
    const formatUtcIcs = (d: Date) => {
      return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    };

    const utcEnd = new Date(utcStart.getTime() + durationMinutes * 60000);
    const nowStr = formatUtcIcs(new Date());

    return [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Bangladesh Melbourne Time Converter//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:meeting-${Date.now()}@bangladesh-melbourne-converter`,
      `DTSTAMP:${nowStr}`,
      `DTSTART:${formatUtcIcs(utcStart)}`,
      `DTEND:${formatUtcIcs(utcEnd)}`,
      `SUMMARY:${(title || 'Bangladesh & Melbourne Meeting').replace(/,/g, '\\,')}`,
      `DESCRIPTION:${(description || '').replace(/\n/g, '\\n').replace(/,/g, '\\,')}`,
      'LOCATION:Virtual (Bangladesh / Melbourne)',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');
  } catch {
    return '';
  }
}
