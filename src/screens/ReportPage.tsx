import AppHeader from '../components/AppHeader';
import PrimaryButton from '../components/PrimaryButton';
import { getWeekReport, reportTotals } from '../lib/budgetCalculator';
import { formatWon } from '../lib/format';
import { formatDate, todayKey } from '../lib/dateRules';
import type { AppData } from '../types';
import { Share } from '../components/Icons';

type ReportPageProps = { data: AppData; onBack: () => void; onShare: () => void };

export default function ReportPage({ data, onBack, onShare }: ReportPageProps) {
  const report = getWeekReport(data, todayKey());
  const totals = reportTotals(report);
  const maxValue = Math.max(...report.map((day) => Math.max(day.budget, day.spent)), 1);
  const today = todayKey();

  return (
    <div className="app-page report-page">
      <AppHeader screen="report" title="이번 주 리포트" onBack={onBack} />
      <main className="page-content report-content">
        <div className="report-intro"><span className="section-kicker">{formatDate(report[0]?.date ?? today)} - {formatDate(report[6]?.date ?? today)}</span><h1>이번 주, 잘 쓰고 있어요.</h1><p>기록한 지출을 기준으로 한눈에 보여드려요.</p></div>
        <section className="report-summary card"><div><span>예산을 지킨 날</span><strong>{totals.keptDays}<small>/{totals.totalDays || 7}일</small></strong></div><div className="summary-saving"><strong>+{formatWon(totals.plannedRemaining)}</strong><span>계획 대비 남김</span></div></section>
        <section className="chart-card card"><div className="card-heading"><strong>일별 예산 사용률</strong><span>예산 대비</span></div><div className="bar-chart" aria-label="요일별 예산 사용률 막대 그래프">{report.map((day) => <div className="bar-column" key={day.date}><div className="bar-area"><div className={`bar ${day.kept ? 'bar-good' : 'bar-over'}`} style={{ height: `${Math.min((day.spent / maxValue) * 100, 100)}%` }} title={`${day.dayLabel} ${formatWon(day.spent)}`} /></div><span className={day.date === today ? 'today-label' : ''}>{day.dayLabel.replace('요일', '')}</span></div>)}</div><div className="chart-legend"><span><i className="legend-good" /> 예산 안</span><span><i className="legend-over" /> 예산 초과</span></div></section>
        <section className="suggestion-card"><span>다음 주 한 줄 제안</span><strong>{totals.keptDays >= 5 ? '평일은 잘 지켰어요.' : '작은 지출부터 한 번 줄여봐요.'}</strong><p>{totals.keptDays >= 5 ? '주말에도 오늘 예산만 한 번 확인해보세요.' : '오늘 쓰기 전, 남은 예산을 먼저 확인해보세요.'}</p></section>
        <div className="report-note">정확한 총 잔액은 공유 카드에서 기본으로 숨겨져요.</div>
        <PrimaryButton variant="secondary" className="share-report-button" onClick={onShare}><Share size={18} /> 결과 공유하기</PrimaryButton>
      </main>
    </div>
  );
}
