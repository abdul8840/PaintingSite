import { formatPrice } from '../../utils/currency';
import { HiTrendingUp, HiExclamationCircle } from 'react-icons/hi';

const MONTH_NAMES = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function RevenueChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 md:p-8 
                      shadow-sm h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-neutral-100 rounded-xl">
            <HiTrendingUp className="w-5 h-5 text-neutral-600" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900">Revenue Trend</h3>
        </div>
        
        {/* Empty State */}
        <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
            <HiExclamationCircle className="w-8 h-8 text-neutral-400" />
          </div>
          <p className="text-neutral-600 font-medium mb-1">No revenue data yet</p>
          <p className="text-sm text-neutral-400 max-w-xs">
            Chart will appear after your first paid order is completed.
          </p>
        </div>
      </div>
    );
  }

  const maxRevenue = Math.max(...data.map(d => d.revenue || 0), 1);
  const totalRevenue = data.reduce((sum, d) => sum + (d.revenue || 0), 0);
  const totalOrders = data.reduce((sum, d) => sum + (d.count || 0), 0);

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-6 md:p-8 
                    shadow-sm hover:shadow-lg transition-shadow duration-300 h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-neutral-900 rounded-xl shadow-lg">
            <HiTrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">Revenue Trend</h3>
            <p className="text-sm text-neutral-500">Last 6 months performance</p>
          </div>
        </div>
        
        {/* Summary badges */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 bg-neutral-100 rounded-lg">
            <p className="text-xs text-neutral-500">Total Revenue</p>
            <p className="text-sm font-bold text-neutral-900 font-numeric">
              {formatPrice(totalRevenue)}
            </p>
          </div>
          <div className="px-3 py-1.5 bg-neutral-100 rounded-lg">
            <p className="text-xs text-neutral-500">Orders</p>
            <p className="text-sm font-bold text-neutral-900 font-numeric">
              {totalOrders}
            </p>
          </div>
        </div>
      </div>
      
      {/* Chart Container */}
      <div className="relative">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-8 w-16 flex flex-col justify-between 
                        text-xs text-neutral-400 font-numeric pr-2">
          <span>{formatPrice(maxRevenue)}</span>
          <span>{formatPrice(maxRevenue / 2)}</span>
          <span>{formatPrice(0)}</span>
        </div>
        
        {/* Chart area */}
        <div className="ml-16 md:ml-20">
          {/* Grid lines */}
          <div className="absolute inset-0 ml-16 md:ml-20 flex flex-col justify-between 
                          pointer-events-none">
            <div className="border-b border-dashed border-neutral-200" />
            <div className="border-b border-dashed border-neutral-200" />
            <div className="border-b border-neutral-200" />
          </div>
          
          {/* Bars */}
          <div className="flex items-end justify-between gap-2 md:gap-4 h-48 md:h-64 relative">
            {data.map((d, i) => {
              const revenue = d.revenue || 0;
              const heightPercent = maxRevenue > 0 ? (revenue / maxRevenue) * 100 : 0;
              const monthName = d._id ? MONTH_NAMES[d._id.month] : '';
              
              return (
                <div 
                  key={i} 
                  className="flex-1 flex flex-col items-center group"
                >
                  {/* Bar container */}
                  <div className="relative w-full h-full flex items-end justify-center">
                    {/* Bar */}
                    <div 
                      className="chart-bar relative w-full max-w-[3rem] md:max-w-[4rem] 
                                 bg-gradient-to-t from-neutral-900 to-neutral-600 
                                 rounded-t-lg cursor-pointer
                                 transition-all duration-300 ease-out
                                 hover:from-neutral-800 hover:to-neutral-500
                                 group-hover:shadow-lg"
                      style={{ 
                        height: `${Math.max(heightPercent, 4)}%`,
                        '--bar-height': `${Math.max(heightPercent, 4)}%`
                      }}
                    >
                      {/* Tooltip */}
                      <div className="chart-tooltip -top-14 left-1/2 -translate-x-1/2">
                        <div className="text-center">
                          <p className="font-bold">{formatPrice(revenue)}</p>
                          <p className="text-neutral-400 text-[10px]">{d.count || 0} orders</p>
                        </div>
                        {/* Tooltip arrow */}
                        <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 
                                        w-2 h-2 bg-neutral-900 rotate-45" />
                      </div>
                      
                      {/* Shine effect on hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent 
                                      via-white/10 to-transparent rounded-t-lg
                                      opacity-0 group-hover:opacity-100 
                                      transition-opacity duration-300" />
                    </div>
                  </div>
                  
                  {/* X-axis label */}
                  <div className="mt-3 text-center">
                    <span className="text-sm font-medium text-neutral-700">
                      {monthName}
                    </span>
                    <p className="text-xs text-neutral-400 mt-0.5 hidden sm:block">
                      {d.count || 0} orders
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}