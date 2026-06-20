export default function StatCard({ label, value, delta, deltaLabel, icon: Icon, accent }) {
  const isPositive = !String(delta).startsWith('-');
  return (
    <div className="stat-card">
      <div className="stat-card__header">
        <span className="stat-card__label">{label}</span>
        <Icon size={16} className="stat-card__icon" />
      </div>
      <div className="stat-card__value">{value}</div>
      <div className={`stat-card__delta ${isPositive ? 'stat-card__delta--up' : 'stat-card__delta--down'}`}>
        <span>{delta}</span>
        <span className="stat-card__delta-label">{deltaLabel}</span>
      </div>
    </div>
  );
}
