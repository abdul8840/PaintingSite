const MONTH_NAMES = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function RevenueChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div>
        <h3>Revenue Trend</h3>
        <div>
          <p>No revenue data available yet.</p>
          <p>Revenue chart will appear once orders are placed.</p>
        </div>
      </div>
    );
  }

  const maxRevenue = Math.max(...data.map(d => d.revenue || 0), 1);

  return (
    <div>
      <h3>Revenue Trend (Last 6 Months)</h3>
      <div>
        {data.map((d, i) => {
          const revenue = d.revenue || 0;
          const heightPercent = maxRevenue > 0 ? (revenue / maxRevenue) * 100 : 0;
          const monthName = d._id ? MONTH_NAMES[d._id.month] || '' : '';
          const year = d._id?.year || '';

          return (
            <div key={i}>
              <div>
                <div style={{ height: `${Math.max(heightPercent, 2)}%` }}>
                  <span>${revenue.toLocaleString()}</span>
                </div>
              </div>
              <span>{monthName}</span>
              <span>{year}</span>
              <span>{d.count || 0} orders</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}