export type Screen = 'setup' | 'home' | 'spend' | 'report' | 'settings' | 'share';

export type Profile = {
  availableMoney: number;
  paydayDay: number;
  nextPayday: string;
  fixedCosts: number;
  reserveMoney: number;
  createdAt: string;
  updatedAt: string;
};

export type Cycle = {
  startDate: string;
  nextPayday: string;
  initialVariableBudget: number;
};

export type DailySnapshot = {
  date: string;
  dayStartBudget: number;
  daysRemaining: number;
  dayStartVariable: number;
  cycleStartDate: string;
};

export type SpendEntry = {
  id: string;
  date: string;
  amount: number;
  memo: string;
  createdAt: string;
};

export type UserSettings = {
  hideExactAmount: boolean;
};

export type AppData = {
  profile: Profile | null;
  currentCycle: Cycle | null;
  dailySnapshots: DailySnapshot[];
  spendEntries: SpendEntry[];
  settings: UserSettings;
};

export type BudgetSummary = {
  today: string;
  daysRemaining: number;
  dayStartBudget: number;
  todaySpent: number;
  todayRemaining: number;
  tomorrowEstimate: number;
  remainingVariable: number;
  weeklyBudget: number;
  cycleStartDate: string;
  nextPayday: string;
};

export type DayReport = {
  date: string;
  dayLabel: string;
  budget: number;
  spent: number;
  usageRate: number;
  kept: boolean;
};
