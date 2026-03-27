import StatsCard from '../common/StatsCard';
import { HiUsers, HiPhotograph, HiShoppingBag, HiCurrencyDollar } from 'react-icons/hi';

export default function QuickStats({ stats = {} }) {
  const monthlyRevenue = stats.monthlyRevenue || 0;
  const revenueGrowth = stats.revenueGrowth || 0;
  const totalOrders = stats.totalOrders || 0;
  const pendingOrders = stats.pendingOrders || 0;
  const totalArtworks = stats.totalArtworks || 0;
  const totalUsers = stats.totalUsers || 0;
  const newUsersThisMonth = stats.newUsersThisMonth || 0;

  return (
    <div>
      <StatsCard
        title="Monthly Revenue"
        value={`$${monthlyRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        icon={HiCurrencyDollar}
        change={Math.abs(revenueGrowth)}
        changeType={revenueGrowth >= 0 ? 'increase' : 'decrease'}
        subtitle="This month"
      />
      <StatsCard
        title="Total Orders"
        value={totalOrders.toLocaleString()}
        icon={HiShoppingBag}
        subtitle={`${pendingOrders} pending`}
      />
      <StatsCard
        title="Total Artworks"
        value={totalArtworks.toLocaleString()}
        icon={HiPhotograph}
      />
      <StatsCard
        title="Total Customers"
        value={totalUsers.toLocaleString()}
        icon={HiUsers}
        subtitle={`${newUsersThisMonth} new this month`}
      />
    </div>
  );
}