import { bucketAmount } from './format';
import { eventLog } from '@apps-in-toss/web-framework';

type AnalyticsEvent = {
  name: string;
  params?: Record<string, string | number | boolean>;
  at: string;
};

const EVENT_KEY = 'paydayBudget.analytics';

export function track(name: string, params?: Record<string, string | number | boolean>): void {
  const event: AnalyticsEvent = { name, params, at: new Date().toISOString() };
  try {
    const previous = JSON.parse(localStorage.getItem(EVENT_KEY) ?? '[]') as AnalyticsEvent[];
    localStorage.setItem(EVENT_KEY, JSON.stringify([...previous.slice(-99), event]));
  } catch {
    // Analytics must never affect the core offline experience.
  }
  try {
    void eventLog({ log_name: name, log_type: 'event', params: params ?? {} }).catch(() => undefined);
  } catch {
    // The native analytics bridge is unavailable in a regular browser.
  }
  if (import.meta.env.DEV) console.info(`[analytics] ${name}`, params ?? {});
}

export function trackAmount(name: string, amount: number, params?: Record<string, string | number | boolean>): void {
  track(name, { ...params, amountBucket: bucketAmount(amount) });
}
