import { useEffect, useMemo, useState } from 'react';
import Toast from './components/Toast';
import HomePage from './screens/HomePage';
import ReportPage from './screens/ReportPage';
import SetupPage from './screens/SetupPage';
import SharePage from './screens/SharePage';
import SpendPage from './screens/SpendPage';
import { calculateSummary, createCycle, ensureCurrentCycle } from './lib/budgetCalculator';
import { track, trackAmount } from './lib/analytics';
import { shareText } from './lib/toss';
import { loadAppData, saveAppData } from './lib/storage';
import { todayKey } from './lib/dateRules';
import type { AppData, Profile, Screen, SpendEntry, UserSettings } from './types';

export default function App() {
  const [data, setData] = useState<AppData>(() => ensureCurrentCycle(loadAppData()));
  const [screen, setScreen] = useState<Screen>(() => (loadAppData().profile ? 'home' : 'setup'));
  const [editingSpendId, setEditingSpendId] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  useEffect(() => {
    saveAppData(data);
  }, [data]);

  useEffect(() => {
    track('app_open', { isReturning: Boolean(data.profile) });
    const refreshForNewDay = () => {
      if (document.visibilityState === 'visible') setData((current) => ensureCurrentCycle(current, todayKey()));
    };
    document.addEventListener('visibilitychange', refreshForNewDay);
    return () => document.removeEventListener('visibilitychange', refreshForNewDay);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(''), 2600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const editingEntry = useMemo(() => data.spendEntries.find((entry) => entry.id === editingSpendId), [data.spendEntries, editingSpendId]);

  function navigate(nextScreen: Screen) {
    setScreen(nextScreen);
    if (nextScreen === 'spend') track('spend_add_started');
    if (nextScreen === 'report') track('report_viewed');
  }

  function handleProfile(profile: Profile) {
    const nextData: AppData = ensureCurrentCycle({
      ...data,
      profile,
      currentCycle: createCycle(profile, todayKey()),
      dailySnapshots: [],
    });
    setData(nextData);
    setScreen('home');
    const setupSummary = calculateSummary(nextData, todayKey());
    track('budget_setup_completed', { daysRemaining: setupSummary.daysRemaining, hasAdvancedOptions: Boolean(profile.fixedCosts || profile.reserveMoney) });
    setToast('오늘 예산을 계산했어요.');
  }

  function handleSpend(entry: SpendEntry) {
    const nextData = ensureCurrentCycle({
      ...data,
      spendEntries: [...data.spendEntries.filter((item) => item.id !== entry.id), entry],
    });
    setData(nextData);
    setEditingSpendId(null);
    setScreen('home');
    const spendSummary = calculateSummary(nextData, todayKey());
    trackAmount('spend_added', entry.amount, { todayUsageRate: spendSummary.dayStartBudget > 0 ? spendSummary.todaySpent / spendSummary.dayStartBudget : 0 });
    setToast(editingEntry ? '지출을 수정했어요.' : '오늘 지출을 기록했어요.');
  }

  function handleDeleteSpend(id: string) {
    if (!window.confirm('이 지출을 삭제할까요?')) return;
    setData((current) => ({ ...current, spendEntries: current.spendEntries.filter((entry) => entry.id !== id) }));
    setToast('지출을 삭제했어요.');
  }

  function handleSettingsChange(settings: UserSettings) {
    setData((current) => ({ ...current, settings }));
  }

  async function handleShare(hideExactAmount: boolean) {
    if (!data.profile || !data.currentCycle) return;
    const summary = calculateSummary(data, todayKey());
    const amountText = hideExactAmount ? '오늘 예산을 확인해봤어요.' : `오늘은 ${summary.todayRemaining < 0 ? '예산을 ' : ''}${Math.abs(summary.todayRemaining).toLocaleString('ko-KR')}원을 기준으로 써요.`;
    const result = await shareText(`월급까지 ${summary.daysRemaining}일, ${amountText}\n가계부 대신 오늘의 숫자 하나만 확인해보세요.`);
    track('share_clicked', { screen, hideExactAmount });
    setToast(result === 'copied' ? '공유 문구를 클립보드에 복사했어요.' : '공유할 앱을 선택해 주세요.');
  }

  function backToHome() {
    setEditingSpendId(null);
    setScreen('home');
  }

  let content;
  if (screen === 'setup') {
    content = <SetupPage onComplete={handleProfile} />;
  } else if (screen === 'home') {
    content = <HomePage data={data} onNavigate={navigate} onEditSpend={(id) => { setEditingSpendId(id); setScreen('spend'); }} onDeleteSpend={handleDeleteSpend} />;
  } else if (screen === 'spend') {
    content = <SpendPage key={editingSpendId ?? 'new'} data={data} editingEntry={editingEntry} onSave={handleSpend} onBack={backToHome} />;
  } else if (screen === 'report') {
    content = <ReportPage data={data} onBack={backToHome} onShare={() => setScreen('share')} />;
  } else if (screen === 'settings') {
    content = <SetupPage mode="settings" initialProfile={data.profile} onComplete={handleProfile} onClose={backToHome} />;
  } else {
    content = <SharePage summary={calculateSummary(data, todayKey())} settings={data.settings} onBack={() => setScreen('report')} onSettingChange={handleSettingsChange} onShare={handleShare} />;
  }

  return <><div className="app-shell">{content}</div>{toast && <Toast message={toast} />}</>;
}
