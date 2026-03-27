import { formatPrice } from '../../utils/currency';

const MONTH_NAMES = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function RevenueChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div>
        <h3>Revenue Trend</h3>
        <p>No revenue data yet. Chart appears after first paid order.</p>
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
          return (
            <div key={i}>
              <div>
                <div style={{ height: `${Math.max(heightPercent, 2)}%` }}>
                  <span>{formatPrice(revenue)}</span>
                </div>
              </div>
              <span>{d._id ? MONTH_NAMES[d._id.month] : ''}</span>
              <span>{d.count || 0} orders</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}