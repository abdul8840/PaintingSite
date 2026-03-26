const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function RevenueChart({ data = [] }) {
  if (!data.length) return <div><p>No revenue data available</p></div>;

  const maxRevenue = Math.max(...data.map(d => d.revenue), 1);

  return (
    <div>
      <h3>Revenue Trend (Last 6 Months)</h3>
      <div>
        {data.map((d, i) => (
          <div key={i}>
            <div>
              <div style={{ height: `${(d.revenue / maxRevenue) * 100}%` }}>
                <span>${d.revenue?.toLocaleString()}</span>
              </div>
            </div>
            <span>{months[d._id.month]} {d._id.year}</span>
            <span>{d.count} orders</span>
          </div>
        ))}
      </div>
    </div>
  );
}