export function formatWon(value: number, withUnit = true): string {
  const formatted = Math.abs(Math.round(value)).toLocaleString('ko-KR');
  return `${value < 0 ? '-' : ''}${formatted}${withUnit ? '원' : ''}`;
}

export function formatInput(value: string): string {
  const digits = value.replace(/[^0-9]/g, '').replace(/^0+(?=\d)/, '');
  return digits ? Number(digits).toLocaleString('ko-KR') : '';
}

export function parseInput(value: string): number {
  return Number(value.replace(/[^0-9]/g, '')) || 0;
}

export function bucketAmount(amount: number): string {
  if (amount < 10_000) return '0~1만';
  if (amount < 30_000) return '1~3만';
  if (amount < 50_000) return '3~5만';
  return '5만 이상';
}
