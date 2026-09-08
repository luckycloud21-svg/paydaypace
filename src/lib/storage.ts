import type { AppData, Cycle, DailySnapshot, Profile, SpendEntry, UserSettings } from '../types';

const KEYS = {
  profile: 'paydayBudget.profile',
  currentCycle: 'paydayBudget.currentCycle',
  dailySnapshots: 'paydayBudget.dailySnapshots',
  spendEntries: 'paydayBudget.spendEntries',
  settings: 'paydayBudget.settings',
} as const;

const defaultSettings: UserSettings = { hideExactAmount: true };

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function loadAppData(): AppData {
  return {
    profile: read<Profile | null>(KEYS.profile, null),
    currentCycle: read<Cycle | null>(KEYS.currentCycle, null),
    dailySnapshots: read<DailySnapshot[]>(KEYS.dailySnapshots, []),
    spendEntries: read<SpendEntry[]>(KEYS.spendEntries, []),
    settings: { ...defaultSettings, ...read<Partial<UserSettings>>(KEYS.settings, {}) },
  };
}

export function saveAppData(data: AppData): void {
  try {
    localStorage.setItem(KEYS.profile, JSON.stringify(data.profile));
    localStorage.setItem(KEYS.currentCycle, JSON.stringify(data.currentCycle));
    localStorage.setItem(KEYS.dailySnapshots, JSON.stringify(data.dailySnapshots));
    localStorage.setItem(KEYS.spendEntries, JSON.stringify(data.spendEntries));
    localStorage.setItem(KEYS.settings, JSON.stringify(data.settings));
  } catch {
    // Private browsing or a restricted WebView can reject storage. The session still works.
  }
}
