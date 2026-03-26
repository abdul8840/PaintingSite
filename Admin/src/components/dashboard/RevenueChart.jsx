import { HiTrendingUp, HiTrendingDown, HiCurrencyDollar } from 'react-icons/hi';

const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function RevenueChart({ data = [] }) {
  if (!data.length) {
    return (
      <div className="
        bg-bg-primary
        rounded-xl
        border border-border-light
        p-6 sm:p-8
      ">
        <div className="flex items-center gap-3 mb-6">
          <div className="
            w-10 h-10
            bg-success/10
            rounded-lg
            flex items-center justify-center
          ">
            <HiTrendingUp className="w-5 h-5 text-success" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary">Revenue Trend</h3>
        </div>
        
        <div className="
          flex flex-col items-center justify-center
          py-12
          text-center
        ">
          <div className="
            w-16 h-16
            bg-bg-tertiary
            rounded-full
            flex items-center justify-center
            mb-4
          ">
            <HiCurrencyDollar className="w-8 h-8 text-text-muted" />
          </div>
          <p className="text-text-secondary font-medium">No revenue data available</p>
          <p className="text-sm text-text-muted mt-1">Revenue data will appear once you have completed orders</p>
        </div>
      </div>
    );
  }

  const maxRevenue = Math.max(...data.map(d => d.revenue), 1);
  const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);
  const totalOrders = data.reduce((sum, d) => sum + d.count, 0);
  
  // Calculate growth
  const currentMonth = data[data.length - 1]?.revenue || 0;
  const previousMonth = data[data.length - 2]?.revenue || 0;
  const growth = previousMonth ? ((currentMonth - previousMonth) / previousMonth * 100).toFixed(1) : 0;
  const isPositiveGrowth = growth >= 0;

  return (
    <div className="
      bg-bg-primary
      rounded-xl
      border border-border-light
      overflow-hidden
    ">
      {/* Header */}
      <div className="
        px-4 sm:px-6 py-4
        border-b border-border-light
        bg-bg-secondary
      ">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="
              w-10 h-10
              bg-success/10
              rounded-lg
              flex items-center justify-center
            ">
              <HiTrendingUp className="w-5 h-5 text-success" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text-primary">Revenue Trend</h3>
              <p className="text-sm text-text-muted">Last 6 months performance</p>
            </div>
          </div>
          
          {/* Summary Stats */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="text-right">
              <p className="text-xs text-text-muted uppercase tracking-wider">Total Revenue</p>
              <p className="text-lg sm:text-xl font-bold text-text-primary">
                ${totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-text-muted uppercase tracking-wider">Growth</p>
              <p className={`
                text-lg sm:text-xl font-bold
                flex items-center gap-1
                ${isPositiveGrowth ? 'text-success' : 'text-error'}
              `}>
                {isPositiveGrowth ? (
                  <HiTrendingUp className="w-5 h-5" />
                ) : (
                  <HiTrendingDown className="w-5 h-5" />
                )}
                {Math.abs(growth)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-4 sm:p-6">
        <div className="
          flex items-end justify-between gap-2 sm:gap-4
          h-48 sm:h-64
        ">
          {data.map((d, i) => {
            const heightPercent = (d.revenue / maxRevenue) * 100;
            const isHighest = d.revenue === maxRevenue;
            
            return (
              <div 
                key={i}
                className="flex-1 flex flex-col items-center gap-2"
              >
                {/* Bar Container */}
                <div className="
                  relative
                  w-full
                  h-full
                  flex items-end justify-center
                ">
                  {/* Bar */}
                  <div 
                    className={`
                      relative
                      w-full max-w-[60px]
                      rounded-t-lg
                      transition-all duration-500 ease-out
                      group
                      cursor-pointer
                      ${isHighest 
                        ? 'bg-gradient-to-t from-theme-primary to-theme-secondary' 
                        : 'bg-gradient-to-t from-bg-tertiary to-bg-hover hover:from-theme-primary/20 hover:to-theme-primary/10'
                      }
                    `}
                    style={{ 
                      height: `${Math.max(heightPercent, 5)}%`,
                      animationDelay: `${i * 100}ms`
                    }}
                  >
                    {/* Tooltip */}
                    <div className="
                      absolute bottom-full left-1/2 -translate-x-1/2 mb-2
                      px-3 py-2
                      bg-theme-primary text-white
                      text-xs font-medium
                      rounded-lg
                      whitespace-nowrap
                      opacity-0 invisible
                      group-hover:opacity-100 group-hover:visible
                      transition-all duration-200
                      z-10
                      shadow-lg
                    ">
                      <div className="text-center">
                        <p className="font-bold">${d.revenue?.toLocaleString()}</p>
                        <p className="text-white/70">{d.count} orders</p>
                      </div>
                      {/* Arrow */}
                      <div className="
                        absolute top-full left-1/2 -translate-x-1/2
                        border-4 border-transparent border-t-theme-primary
                      " />
                    </div>
                  </div>
                </div>

                {/* Labels */}
                <div className="text-center">
                  <p className="text-xs sm:text-sm font-medium text-text-primary">
                    {months[d._id?.month]}
                  </p>
                  <p className="text-[10px] sm:text-xs text-text-muted">
                    {d._id?.year}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="
          flex items-center justify-center gap-6
          mt-6 pt-4
          border-t border-border-light
        ">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-theme-primary to-theme-secondary" />
            <span className="text-xs text-text-muted">Highest</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-bg-tertiary" />
            <span className="text-xs text-text-muted">Revenue</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-muted">{totalOrders} total orders</span>
          </div>
        </div>
      </div>
    </div>
  );
}