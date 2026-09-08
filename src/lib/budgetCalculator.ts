import {
  addDays,
  daysBetween,
  normalizePayday,
  parseDateKey,
  previousPaydayBefore,
  startOfWeek,
  todayKey,
  weekdayLabel,
} from './dateRules';
import type { AppData, BudgetSummary, Cycle, DailySnapshot, DayReport, Profile, SpendEntry } from '../types';

export function floorToHundred(value: number): number {
  return Math.floor(Math.max(value, 0) / 100) * 100;
}

export function variableBudget(profile: Profile): number {
  return Math.max(profile.availableMoney - profile.fixedCosts - profile.reserveMoney, 0);
}

export function createCycle(profile: Profile, today = todayKey()): Cycle {
  const requestedPayday = profile.nextPayday;
  const nextPayday = requestedPayday && requestedPayday > today
    ? requestedPayday
    : normalizePayday(today, profile.paydayDay);
  return {
    startDate: today,
    nextPayday,
    initialVariableBudget: variableBudget(profile),
  };
}

export function ensureCurrentCycle(data: AppData, today = todayKey()): AppData {
  if (!data.profile) return data;

  let cycle = data.currentCycle ?? createCycle(data.profile, today);
  let snapshots = data.dailySnapshots;

  if (today >= cycle.nextPayday) {
    const next = normalizePayday(today, data.profile.paydayDay);
    cycle = {
      startDate: today,
      nextPayday: next,
      initialVariableBudget: variableBudget(data.profile),
    };
    snapshots = snapshots.filter((snapshot) => snapshot.cycleStartDate === cycle.startDate);
  }

  const daysRemaining = Math.max(daysBetween(today, cycle.nextPayday), 1);
  const spentBeforeToday = sumSpend(data.spendEntries, cycle.startDate, today);
  const dayStartVariable = Math.max(cycle.initialVariableBudget - spentBeforeToday, 0);
  const dayStartBudget = floorToHundred(dayStartVariable / daysRemaining);
  const existing = snapshots.find(
    (snapshot) => snapshot.date === today && snapshot.cycleStartDate === cycle.startDate,
  );
  if (!existing) {
    snapshots = [
      ...snapshots,
      { date: today, daysRemaining, dayStartBudget, dayStartVariable, cycleStartDate: cycle.startDate },
    ];
  }

  return { ...data, currentCycle: cycle, dailySnapshots: snapshots };
}

export function sumSpend(entries: SpendEntry[], startDate?: string, endDateExclusive?: string): number {
  return entries
    .filter((entry) => (!startDate || entry.date >= startDate) && (!endDateExclusive || entry.date < endDateExclusive))
    .reduce((total, entry) => total + entry.amount, 0);
}

function dayBudget(data: AppData, date: string): number {
  const cycle = data.currentCycle;
  if (!cycle || date < cycle.startDate || date >= cycle.nextPayday) return 0;
  const snapshot = data.dailySnapshots.find(
    (item) => item.date === date && item.cycleStartDate === cycle.startDate,
  );
  if (snapshot) return snapshot.dayStartBudget;
  const daysRemaining = Math.max(daysBetween(date, cycle.nextPayday), 1);
  const spentBefore = sumSpend(data.spendEntries, cycle.startDate, date);
  return floorToHundred((cycle.initialVariableBudget - spentBefore) / daysRemaining);
}

export function calculateSummary(data: AppData, today = todayKey()): BudgetSummary {
  const cycle = data.currentCycle;
  if (!cycle) {
    return {
      today,
      daysRemaining: 0,
      dayStartBudget: 0,
      todaySpent: 0,
      todayRemaining: 0,
      tomorrowEstimate: 0,
      remainingVariable: 0,
      weeklyBudget: 0,
      cycleStartDate: today,
      nextPayday: today,
    };
  }

  const daysRemaining = Math.max(daysBetween(today, cycle.nextPayday), 1);
  const todaySpent = sumSpend(data.spendEntries, today, addDays(today, 1));
  const dayStartVariable = Math.max(cycle.initialVariableBudget - sumSpend(data.spendEntries, cycle.startDate, today), 0);
  const dayStartBudget = dayBudget(data, today);
  const todayRemaining = dayStartBudget - todaySpent;
  const tomorrowEstimate = floorToHundred(
    Math.max(dayStartVariable - todaySpent, 0) / Math.max(daysRemaining - 1, 1),
  );
  const remainingVariable = Math.max(
    cycle.initialVariableBudget - sumSpend(data.spendEntries, cycle.startDate, cycle.nextPayday),
    0,
  );
  const projectedDaily = floorToHundred(Math.max(dayStartVariable - todaySpent, 0) / Math.max(daysRemaining - 1, 1));
  const daysInPlan = Math.min(daysRemaining, 7);
  const weeklyBudget = floorToHundred(todayRemaining + projectedDaily * Math.max(daysInPlan - 1, 0));

  return {
    today,
    daysRemaining,
    dayStartBudget,
    todaySpent,
    todayRemaining,
    tomorrowEstimate,
    remainingVariable,
    weeklyBudget,
    cycleStartDate: cycle.startDate,
    nextPayday: cycle.nextPayday,
  };
}

export function getWeekReport(data: AppData, today = todayKey()): DayReport[] {
  const firstDay = startOfWeek(today);
  return Array.from({ length: 7 }, (_, index) => {
    const date = addDays(firstDay, index);
    const spent = sumSpend(data.spendEntries, date, addDays(date, 1));
    const budget = dayBudget(data, date);
    return {
      date,
      dayLabel: weekdayLabel(date),
      budget,
      spent,
      usageRate: budget > 0 ? spent / budget : 0,
      kept: budget > 0 ? spent <= budget : false,
    };
  });
}

export function reportTotals(report: DayReport[]) {
  const activeDays = report.filter((day) => day.budget > 0);
  const keptDays = activeDays.filter((day) => day.kept).length;
  const planned = activeDays.reduce((sum, day) => sum + day.budget, 0);
  const spent = activeDays.reduce((sum, day) => sum + day.spent, 0);
  return {
    keptDays,
    totalDays: activeDays.length,
    planned,
    spent,
    plannedRemaining: Math.max(planned - spent, 0),
    usageRate: planned > 0 ? spent / planned : 0,
  };
}

export function nextCyclePayday(profile: Profile, today = todayKey()): string {
  const next = normalizePayday(today, profile.paydayDay);
  const current = parseDateKey(next);
  return `${current.getUTCFullYear()}-${String(current.getUTCMonth() + 1).padStart(2, '0')}-${String(current.getUTCDate()).padStart(2, '0')}`;
}

export function defaultPaydayDate(today = todayKey()): string {
  const current = parseDateKey(today);
  const candidate = new Date(current);
  candidate.setUTCDate(candidate.getUTCDate() + 17);
  return candidate.toISOString().slice(0, 10);
}

export function paydayDayFromDate(date: string): number {
  return parseDateKey(date).getUTCDate();
}

export function previousPayday(profile: Profile, today = todayKey()): string {
  return previousPaydayBefore(today, profile.paydayDay);
}
