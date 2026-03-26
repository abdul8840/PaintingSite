export default function StatsCard({ title, value, icon: Icon, change, changeType = 'increase', subtitle }) {
  return (
    <div>
      <div>
        <div>
          <p>{title}</p>
          <h3>{value}</h3>
          {change !== undefined && (
            <span data-type={changeType}>
              {changeType === 'increase' ? '↑' : '↓'} {change}%
            </span>
          )}
          {subtitle && <p>{subtitle}</p>}
        </div>
        {Icon && <div><Icon /></div>}
      </div>
    </div>
  );
}