import StatsCard from '../common/StatsCard';
import { HiUsers, HiPhotograph, HiShoppingBag, HiCurrencyDollar } from 'react-icons/hi';
import { formatPrice } from '../../utils/currency';

export default function QuickStats({ stats = {} }) {
  return (
    <div>
      <StatsCard title="Monthly Revenue" value={formatPrice(stats.monthlyRevenue || 0)} icon={HiCurrencyDollar} change={Math.abs(stats.revenueGrowth || 0)} changeType={(stats.revenueGrowth || 0) >= 0 ? 'increase' : 'decrease'} subtitle="This month" />
      <StatsCard title="Total Orders" value={(stats.totalOrders || 0).toLocaleString()} icon={HiShoppingBag} subtitle={`${stats.pendingOrders || 0} pending`} />
      <StatsCard title="Total Artworks" value={(stats.totalArtworks || 0).toLocaleString()} icon={HiPhotograph} />
      <StatsCard title="Total Customers" value={(stats.totalUsers || 0).toLocaleString()} icon={HiUsers} subtitle={`${stats.newUsersThisMonth || 0} new this month`} />
    </div>
  );
}