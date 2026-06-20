import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ label, value, delta, deltaLabel, icon: Icon }) {
  const isPositive = delta && !String(delta).startsWith('-');
  const isNegative = delta && String(delta).startsWith('-');

  return (
    <div className="stat-card">
      <div className="stat-card__header">
        <span className="stat-card__label">{label}</span>
        {Icon && <Icon size={18} className="stat-card__icon" />}
      </div>
      <div className="stat-card__value">{value}</div>
      {delta && (
        <div
          className={`stat-card__delta ${
            isPositive ? 'stat-card__delta--up' :
            isNegative ? 'stat-card__delta--down' :
            ''
          }`}
        >
          {isPositive && <TrendingUp size={12} />}
          {isNegative && <TrendingDown size={12} />}
          <span>{delta}</span>
          {deltaLabel && (
            <span className="stat-card__delta-label">{deltaLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}
