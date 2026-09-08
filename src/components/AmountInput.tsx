import { useId } from 'react';
import { formatInput, parseInput } from '../lib/format';

type AmountInputProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  hint?: string;
  autoFocus?: boolean;
};

export default function AmountInput({ label, value, onChange, placeholder = '0', hint, autoFocus }: AmountInputProps) {
  const id = useId();
  return (
    <div className="field-group">
      <label htmlFor={id}>{label}</label>
      <div className="amount-input-wrap">
        <input
          id={id}
          inputMode="numeric"
          autoFocus={autoFocus}
          value={value ? formatInput(String(value)) : ''}
          onChange={(event) => onChange(Math.min(parseInput(event.target.value), 99_999_999))}
          placeholder={placeholder}
          aria-label={label}
        />
        <span>원</span>
      </div>
      {hint && <p className="field-hint">{hint}</p>}
    </div>
  );
}
