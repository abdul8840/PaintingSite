import StatsCard from '../common/StatsCard';
import { HiUsers, HiPhotograph, HiShoppingBag, HiCurrencyDollar } from 'react-icons/hi';

export default function QuickStats({ stats }) {
  if (!stats) return null;

  return (
    <div>
      <StatsCard title="Total Revenue" value={`$${stats.monthlyRevenue?.toLocaleString() || 0}`} icon={HiCurrencyDollar} change={stats.revenueGrowth} changeType={stats.revenueGrowth >= 0 ? 'increase' : 'decrease'} subtitle="This month" />
      <StatsCard title="Total Orders" value={stats.totalOrders || 0} icon={HiShoppingBag} subtitle={`${stats.pendingOrders || 0} pending`} />
      <StatsCard title="Total Artworks" value={stats.totalArtworks || 0} icon={HiPhotograph} />
      <StatsCard title="Total Customers" value={stats.totalUsers || 0} icon={HiUsers} subtitle={`${stats.newUsersThisMonth || 0} new this month`} />
    </div>
  );
}