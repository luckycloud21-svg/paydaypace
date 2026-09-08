import { Edit, Info, Plus, Settings, Trash } from '../components/Icons';
import AppHeader from '../components/AppHeader';
import PrimaryButton from '../components/PrimaryButton';
import StatCard from '../components/StatCard';
import { calculateSummary } from '../lib/budgetCalculator';
import { formatDate, shortDate, todayKey } from '../lib/dateRules';
import { formatWon } from '../lib/format';
import type { AppData, Screen, SpendEntry } from '../types';

type HomePageProps = {
  data: AppData;
  onNavigate: (screen: Screen) => void;
  onEditSpend: (id: string) => void;
  onDeleteSpend: (id: string) => void;
};

export default function HomePage({ data, onNavigate, onEditSpend, onDeleteSpend }: HomePageProps) {
  const today = todayKey();
  const summary = calculateSummary(data, today);
  const todayEntries = data.spendEntries.filter((entry) => entry.date === today).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const usageRate = summary.dayStartBudget > 0 ? Math.min(Math.max(summary.todaySpent / summary.dayStartBudget, 0), 1) : 0;
  const isOver = summary.todayRemaining < 0;
  const cycleMoney = data.currentCycle?.initialVariableBudget ?? 0;

  return (
    <div className="app-page home-page">
      <AppHeader screen="home" onMenu={() => onNavigate('settings')} right={<button className="icon-button" onClick={() => onNavigate('settings')} aria-label="예산 설정"><Settings size={20} /></button>} />
      <main className="page-content home-content">
        <section className="hero-copy">
          <span className="section-kicker">오늘 써도 되는 돈</span>
          <h1 className={isOver ? 'amount-alert' : ''}>{formatWon(summary.todayRemaining)}</h1>
          <div className="hero-meta"><span>월급까지 {summary.daysRemaining}일</span><i /> <span>생활비 {formatWon(summary.remainingVariable)} 남음</span></div>
        </section>

        <section className={`today-card card ${isOver ? 'over-card' : ''}`}>
          <div className="card-heading"><span>오늘 사용</span><strong>{formatWon(summary.todaySpent)}</strong><span className={isOver ? 'over-text' : 'remaining-text'}>{isOver ? `${formatWon(Math.abs(summary.todayRemaining))} 초과` : `${formatWon(summary.todayRemaining)} 남음`}</span></div>
          <div className="progress-track"><div className={`progress-fill ${isOver ? 'over-fill' : ''}`} style={{ width: `${Math.max(usageRate * 100, summary.todaySpent ? 5 : 0)}%` }} /></div>
          <p className="helper-copy">{isOver ? `오늘 한도를 ${formatWon(Math.abs(summary.todayRemaining))} 넘었어요. 내일 예산이 자동 조정돼요.` : '오늘 남은 금액 안에서 편하게 써보세요.'}</p>
        </section>

        <PrimaryButton className="add-spend-button" onClick={() => onNavigate('spend')}><Plus size={18} /> 지출 추가</PrimaryButton>

        <section className="insight-grid">
          <StatCard label="내일 예상 예산" value={formatWon(summary.tomorrowEstimate)} detail="오늘 지출을 반영했어요" />
          <StatCard label="이번 주 예산" value={formatWon(summary.weeklyBudget)} detail={`생활비 ${formatWon(summary.remainingVariable)} 남음`} />
        </section>

        <button className="report-link" onClick={() => onNavigate('report')}>
          <span><span className="report-dot" /> 이번 주 리포트 보기</span><span aria-hidden="true">›</span>
        </button>

        {todayEntries.length > 0 && (
          <section className="spend-list-section">
            <div className="section-title-row"><h2>오늘 지출</h2><span>{todayEntries.length}건</span></div>
            <div className="spend-list">{todayEntries.map((entry) => <SpendRow key={entry.id} entry={entry} onEdit={onEditSpend} onDelete={onDeleteSpend} />)}</div>
          </section>
        )}

        <div className="privacy-note"><Info size={16} /><span>입력한 예산과 지출은 이 기기에만 저장돼요.</span></div>
      </main>
    </div>
  );
}

function SpendRow({ entry, onEdit, onDelete }: { entry: SpendEntry; onEdit: (id: string) => void; onDelete: (id: string) => void }) {
  return (
    <div className="spend-row">
      <div className="spend-row-main"><span className="spend-mark" /><div><strong>{entry.memo || '지출'}</strong><small>{shortDate(entry.date)}</small></div></div>
      <div className="spend-row-actions"><strong>{formatWon(entry.amount)}</strong><button aria-label="지출 수정" onClick={() => onEdit(entry.id)}><Edit size={16} /></button><button aria-label="지출 삭제" onClick={() => onDelete(entry.id)}><Trash size={16} /></button></div>
    </div>
  );
}
