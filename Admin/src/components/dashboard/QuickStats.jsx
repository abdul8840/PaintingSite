import StatsCard from '../common/StatsCard';
import { HiUsers, HiPhotograph, HiShoppingBag, HiCurrencyDollar } from 'react-icons/hi';
import { formatPrice } from '../../utils/currency';

export default function QuickStats({ stats = {} }) {
  const statsData = [
    {
      title: "Monthly Revenue",
      value: formatPrice(stats.monthlyRevenue || 0),
      icon: HiCurrencyDollar,
      change: Math.abs(stats.revenueGrowth || 0),
      changeType: (stats.revenueGrowth || 0) >= 0 ? 'increase' : 'decrease',
      subtitle: "This month",
      gradient: "from-neutral-900 to-neutral-700",
    },
    {
      title: "Total Orders",
      value: (stats.totalOrders || 0).toLocaleString(),
      icon: HiShoppingBag,
      subtitle: `${stats.pendingOrders || 0} pending`,
      gradient: "from-neutral-800 to-neutral-600",
    },
    {
      title: "Total Artworks",
      value: (stats.totalArtworks || 0).toLocaleString(),
      icon: HiPhotograph,
      subtitle: "In catalog",
      gradient: "from-neutral-700 to-neutral-500",
    },
    {
      title: "Total Customers",
      value: (stats.totalUsers || 0).toLocaleString(),
      icon: HiUsers,
      subtitle: `${stats.newUsersThisMonth || 0} new this month`,
      gradient: "from-neutral-600 to-neutral-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {statsData.map((stat, index) => (
        <div 
          key={stat.title}
          className="animate-slideUp"
          style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'backwards' }}
        >
          <StatsCard {...stat} />
        </div>
      ))}
    </div>
  );
}