import StatsCard from '../common/StatsCard';
import { 
  HiUsers, 
  HiPhotograph, 
  HiShoppingBag, 
  HiCurrencyDollar,
  HiTrendingUp,
  HiClock
} from 'react-icons/hi';

export default function QuickStats({ stats }) {
  if (!stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[...Array(4)].map((_, i) => (
          <div 
            key={i}
            className="
              bg-bg-primary
              rounded-xl
              border border-border-light
              p-4 sm:p-6
              animate-pulse
            "
          >
            <div className="flex items-start justify-between">
              <div className="space-y-3 flex-1">
                <div className="h-4 w-24 bg-bg-tertiary rounded" />
                <div className="h-8 w-32 bg-bg-tertiary rounded" />
                <div className="h-3 w-20 bg-bg-tertiary rounded" />
              </div>
              <div className="w-12 h-12 bg-bg-tertiary rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <StatsCard 
        title="Total Revenue" 
        value={`$${stats.monthlyRevenue?.toLocaleString() || 0}`} 
        icon={HiCurrencyDollar} 
        change={stats.revenueGrowth} 
        changeType={stats.revenueGrowth >= 0 ? 'increase' : 'decrease'} 
        subtitle="This month" 
      />
      <StatsCard 
        title="Total Orders" 
        value={stats.totalOrders || 0} 
        icon={HiShoppingBag} 
        subtitle={`${stats.pendingOrders || 0} pending`} 
      />
      <StatsCard 
        title="Total Artworks" 
        value={stats.totalArtworks || 0} 
        icon={HiPhotograph}
        subtitle="In catalog" 
      />
      <StatsCard 
        title="Total Customers" 
        value={stats.totalUsers || 0} 
        icon={HiUsers} 
        subtitle={`${stats.newUsersThisMonth || 0} new this month`} 
      />
    </div>
  );
}