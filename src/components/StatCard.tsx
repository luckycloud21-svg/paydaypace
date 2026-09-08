import type { ReactNode } from 'react';

type StatCardProps = { label: string; value: ReactNode; detail?: ReactNode; tone?: 'default' | 'mint' | 'alert' };

export default function StatCard({ label, value, detail, tone = 'default' }: StatCardProps) {
  return (
    <div className={`stat-card ${tone}`}>
      <span className="stat-label">{label}</span>
      <div className="stat-value">{value}</div>
      {detail && <div className="stat-detail">{detail}</div>}
    </div>
  );
}
