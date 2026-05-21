export default function StatCard({ label, value, sub, color = '', delay = 0 }) {
  return (
    <div className={`stat-card ${color}`} style={{ animationDelay: `${delay}ms` }}>
      <div className="stat-card__label">{label}</div>
      <div className="stat-card__value">{value}</div>
      {sub && <div className="stat-card__sub">{sub}</div>}
    </div>
  )
}
