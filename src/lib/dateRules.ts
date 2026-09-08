const SEOUL_TIME_ZONE = 'Asia/Seoul';

export function toDateKey(date: Date): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: SEOUL_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? '';
  return `${get('year')}-${get('month')}-${get('day')}`;
}

export function todayKey(): string {
  return toDateKey(new Date());
}

export function parseDateKey(key: string): Date {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

export function addDays(key: string, days: number): string {
  const date = parseDateKey(key);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function daysBetween(start: string, end: string): number {
  return Math.round((parseDateKey(end).getTime() - parseDateKey(start).getTime()) / 86_400_000);
}

export function daysInMonth(year: number, monthIndex: number): number {
  return new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
}

export function paydayForMonth(year: number, monthIndex: number, paydayDay: number): string {
  const day = Math.min(Math.max(paydayDay, 1), daysInMonth(year, monthIndex));
  return new Date(Date.UTC(year, monthIndex, day)).toISOString().slice(0, 10);
}

export function nextPaydayAfter(dateKey: string, paydayDay: number): string {
  const date = parseDateKey(dateKey);
  return paydayForMonth(date.getUTCFullYear(), date.getUTCMonth() + 1, paydayDay);
}

export function normalizePayday(dateKey: string, paydayDay: number): string {
  const candidate = paydayForMonth(
    parseDateKey(dateKey).getUTCFullYear(),
    parseDateKey(dateKey).getUTCMonth(),
    paydayDay,
  );
  return candidate <= dateKey ? nextPaydayAfter(dateKey, paydayDay) : candidate;
}

export function previousPaydayBefore(dateKey: string, paydayDay: number): string {
  const date = parseDateKey(dateKey);
  return paydayForMonth(date.getUTCFullYear(), date.getUTCMonth() - 1, paydayDay);
}

export function formatDate(key: string, options: Intl.DateTimeFormatOptions = {}): string {
  return new Intl.DateTimeFormat('ko-KR', {
    timeZone: SEOUL_TIME_ZONE,
    month: 'long',
    day: 'numeric',
    ...options,
  }).format(parseDateKey(key));
}

export function shortDate(key: string): string {
  return new Intl.DateTimeFormat('ko-KR', {
    timeZone: SEOUL_TIME_ZONE,
    month: 'numeric',
    day: 'numeric',
  }).format(parseDateKey(key));
}

export function weekdayLabel(key: string): string {
  return new Intl.DateTimeFormat('ko-KR', {
    timeZone: SEOUL_TIME_ZONE,
    weekday: 'short',
  }).format(parseDateKey(key));
}

export function startOfWeek(dateKey: string): string {
  const date = parseDateKey(dateKey);
  const day = date.getUTCDay();
  const daysFromMonday = day === 0 ? 6 : day - 1;
  return addDays(dateKey, -daysFromMonday);
}

export function isDateKey(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(parseDateKey(value).getTime());
}
