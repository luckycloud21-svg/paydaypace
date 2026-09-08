import { useState } from 'react';
import AppHeader from '../components/AppHeader';
import PrimaryButton from '../components/PrimaryButton';
import { Share, Check } from '../components/Icons';
import { formatWon } from '../lib/format';
import type { BudgetSummary, UserSettings } from '../types';

type SharePageProps = { summary: BudgetSummary; settings: UserSettings; onBack: () => void; onSettingChange: (settings: UserSettings) => void; onShare: (hideExactAmount: boolean) => void };

export default function SharePage({ summary, settings, onBack, onSettingChange, onShare }: SharePageProps) {
  const [hideExactAmount, setHideExactAmount] = useState(settings.hideExactAmount);

  function toggle() {
    const next = !hideExactAmount;
    setHideExactAmount(next);
    onSettingChange({ ...settings, hideExactAmount: next });
  }

  return (
    <div className="app-page share-page">
      <AppHeader screen="share" title="공유 카드 미리보기" onBack={onBack} />
      <main className="page-content share-content">
        <section className="share-card-preview">
          <div className="share-logo"><span className="share-logo-icon">✦</span><strong>월급까지</strong></div>
          <span className="share-days">월급일까지 {summary.daysRemaining}일</span>
          <span className="share-card-label">오늘 예산</span>
          <strong className="share-amount">{hideExactAmount ? '오늘 예산' : formatWon(summary.todayRemaining)}</strong>
          <div className="share-card-message">가계부 대신 오늘의 숫자 하나</div>
          <span className="share-card-foot">나도 10초 만에 계산해보기</span>
        </section>
        <div className="share-option-label">공유 옵션</div>
        <button className="privacy-toggle" onClick={toggle}><span><span className="privacy-icon">●</span> 정확한 금액 숨기기</span><span className={`toggle ${hideExactAmount ? 'on' : ''}`}><span /></span></button>
        <p className="share-helper">정확한 잔액은 기본으로 숨겨서 공유해요.</p>
        <PrimaryButton onClick={() => onShare(hideExactAmount)}><Share size={18} /> 공유하기</PrimaryButton>
        <div className="share-tip"><Check size={16} /> 월급일과 오늘 예산만 공유돼요.</div>
      </main>
    </div>
  );
}
