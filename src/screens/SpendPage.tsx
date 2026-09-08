import { useMemo, useState } from 'react';
import AppHeader from '../components/AppHeader';
import AmountInput from '../components/AmountInput';
import PrimaryButton from '../components/PrimaryButton';
import { calculateSummary, floorToHundred } from '../lib/budgetCalculator';
import { formatWon } from '../lib/format';
import { todayKey } from '../lib/dateRules';
import type { AppData, Screen, SpendEntry } from '../types';

type SpendPageProps = {
  data: AppData;
  editingEntry?: SpendEntry;
  onSave: (entry: SpendEntry) => void;
  onBack: () => void;
};

const QUICK_AMOUNTS = [1_000, 5_000, 10_000, 30_000];

export default function SpendPage({ data, editingEntry, onSave, onBack }: SpendPageProps) {
  const [amount, setAmount] = useState(editingEntry?.amount ?? 8_900);
  const [memo, setMemo] = useState(editingEntry?.memo ?? '');
  const [error, setError] = useState('');
  const currentSummary = calculateSummary(data, todayKey());
  const previewRemaining = currentSummary.todayRemaining - (amount - (editingEntry?.amount ?? 0));
  const previewTomorrow = floorToHundred(
    Math.max(currentSummary.remainingVariable - (amount - (editingEntry?.amount ?? 0)), 0) / Math.max(currentSummary.daysRemaining - 1, 1),
  );
  const canSave = amount > 0 && amount <= 99_999_999;

  const memoCount = useMemo(() => `${memo.length}/20`, [memo]);

  function save() {
    if (!canSave) {
      setError('지출 금액을 입력해 주세요.');
      return;
    }
    onSave({
      id: editingEntry?.id ?? `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      date: todayKey(),
      amount,
      memo: memo.slice(0, 20),
      createdAt: editingEntry?.createdAt ?? new Date().toISOString(),
    });
  }

  return (
    <div className="app-page spend-page">
      <AppHeader screen="spend" title={editingEntry ? '지출 수정' : '오늘 지출 추가'} onBack={onBack} />
      <main className="page-content spend-content">
        <div className="page-intro"><span className="section-kicker">금액만 입력하면 충분해요</span><h1>{editingEntry ? '지출을 수정할까요?' : '오늘 얼마 썼나요?'}</h1></div>
        <section className="form-section spend-form">
          <AmountInput label="지출 금액" value={amount} onChange={setAmount} autoFocus />
          <div className="quick-inputs"><span>빠른 입력</span><div>{QUICK_AMOUNTS.map((quick) => <button key={quick} onClick={() => setAmount(quick)}>{quick >= 10_000 ? `${quick / 10_000}만` : `${quick / 1_000}천`}</button>)}</div></div>
          <div className="field-group memo-group"><div className="label-row"><label htmlFor="memo">메모 <em>(선택)</em></label><span>{memoCount}</span></div><input id="memo" maxLength={20} value={memo} onChange={(event) => setMemo(event.target.value)} placeholder="예: 점심 식사" /></div>
          <div className={`entry-preview ${previewRemaining < 0 ? 'preview-alert' : ''}`}><span>입력 후 변화</span><strong>{previewRemaining < 0 ? `오늘 예산 ${formatWon(Math.abs(previewRemaining))} 초과` : `오늘 ${formatWon(previewRemaining)} 남음`}</strong><small>내일 예상 {formatWon(previewTomorrow)}</small></div>
          {error && <p className="form-error" role="alert">{error}</p>}
        </section>
      </main>
      <div className="bottom-action"><PrimaryButton onClick={save}>저장하기</PrimaryButton></div>
    </div>
  );
}
