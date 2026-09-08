import { useMemo, useState } from 'react';
import { ArrowRight, ChevronDown, Spark } from '../components/Icons';
import AmountInput from '../components/AmountInput';
import AppHeader from '../components/AppHeader';
import PrimaryButton from '../components/PrimaryButton';
import { defaultPaydayDate } from '../lib/budgetCalculator';
import { formatDate, todayKey } from '../lib/dateRules';
import type { Profile, Screen } from '../types';

type SetupPageProps = {
  onComplete: (profile: Profile) => void;
  onClose?: () => void;
  mode?: 'setup' | 'settings';
  initialProfile?: Profile | null;
};

export default function SetupPage({ onComplete, onClose, mode = 'setup', initialProfile }: SetupPageProps) {
  const initialDate = initialProfile?.nextPayday ?? defaultPaydayDate();
  const [availableMoney, setAvailableMoney] = useState(initialProfile?.availableMoney ?? 450_000);
  const [nextPayday, setNextPayday] = useState(initialDate);
  const [fixedCosts, setFixedCosts] = useState(initialProfile?.fixedCosts ?? 0);
  const [reserveMoney, setReserveMoney] = useState(initialProfile?.reserveMoney ?? 0);
  const [showAdvanced, setShowAdvanced] = useState(Boolean(initialProfile?.fixedCosts || initialProfile?.reserveMoney));
  const [error, setError] = useState('');
  const dateLabel = useMemo(() => (nextPayday ? formatDate(nextPayday) : '날짜를 선택해 주세요'), [nextPayday]);

  function submit() {
    if (availableMoney <= 0) {
      setError('월급일까지 쓸 수 있는 돈을 입력해 주세요.');
      return;
    }
    if (!nextPayday) {
      setError('다음 월급일을 선택해 주세요.');
      return;
    }
    if (fixedCosts + reserveMoney >= availableMoney) {
      setError('고정비와 남겨둘 돈은 생활비보다 적어야 해요.');
      return;
    }
    const now = new Date().toISOString();
    onComplete({
      availableMoney,
      paydayDay: Number(nextPayday.slice(-2)),
      nextPayday,
      fixedCosts,
      reserveMoney,
      createdAt: initialProfile?.createdAt ?? now,
      updatedAt: now,
    });
  }

  return (
    <div className="app-page setup-page">
      <AppHeader screen={mode === 'settings' ? 'settings' : 'setup'} onBack={onClose} title={mode === 'settings' ? '예산 설정' : '월급까지'} />
      <main className="page-content setup-content">
        <div className="setup-intro">
          <div className="eyebrow"><Spark size={15} /> {mode === 'settings' ? '예산 조건 수정' : '첫 설정'}</div>
          <h1>{mode === 'settings' ? '예산을 다시 계산해볼까요?' : '월급일까지\n오늘 얼마 써도 될까요?'}</h1>
          <p>{mode === 'settings' ? '바뀐 조건을 저장하면 오늘 예산부터 다시 계산해요.' : '남은 생활비와 월급일만 알려주면\n바로 계산해요.'}</p>
        </div>

        <section className="form-section">
          <AmountInput label="월급일까지 쓸 수 있는 돈" value={availableMoney} onChange={setAvailableMoney} autoFocus={mode === 'setup'} />
          <div className="field-group">
            <label htmlFor="payday">다음 월급일</label>
            <div className="date-input-wrap">
              <span className="date-icon" aria-hidden="true">▣</span>
              <input id="payday" type="date" min={todayKey()} value={nextPayday} onChange={(event) => setNextPayday(event.target.value)} />
              <span className="date-display">{dateLabel}</span>
              <ArrowRight size={19} />
            </div>
            <p className="field-hint">오늘이면 다음 달 월급일로 계산해요.</p>
          </div>

          <button className={`advanced-toggle ${showAdvanced ? 'expanded' : ''}`} onClick={() => setShowAdvanced((current) => !current)}>
            <span><span className="optional-label">선택</span> 고정비 · 남겨둘 돈 더하기</span>
            <ChevronDown size={18} />
          </button>

          {showAdvanced && (
            <div className="advanced-fields">
              <AmountInput label="월급일까지 나갈 고정비" value={fixedCosts} onChange={setFixedCosts} hint="월세, 통신비처럼 꼭 나갈 돈을 빼둘 수 있어요." />
              <AmountInput label="남겨둘 돈" value={reserveMoney} onChange={setReserveMoney} hint="이번 달 끝까지 남겨두고 싶은 금액이에요." />
            </div>
          )}
          {error && <p className="form-error" role="alert">{error}</p>}
        </section>
      </main>
      <div className="bottom-action"><PrimaryButton onClick={submit}>{mode === 'settings' ? '다시 계산하기' : '오늘 예산 계산하기'}</PrimaryButton></div>
    </div>
  );
}
