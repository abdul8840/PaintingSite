import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardStats } from '../store/slices/dashboardSlice';
import QuickStats from '../components/dashboard/QuickStats';
import RevenueChart from '../components/dashboard/RevenueChart';
import RecentOrders from '../components/dashboard/RecentOrders';
import TopArtworks from '../components/dashboard/TopArtworks';
import Loader from '../components/common/Loader';

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { stats, loading } = useSelector((state) => state.dashboard);

  useEffect(() => { dispatch(fetchDashboardStats()); }, [dispatch]);

  if (loading && !stats) return <Loader text="Loading dashboard..." />;

  return (
    <div>
      <h1>Dashboard</h1>
      <QuickStats stats={stats} />
      <div>
        <RevenueChart data={stats?.revenueChart} />
        <TopArtworks artworks={stats?.topArtworks} />
      </div>
      <RecentOrders orders={stats?.recentOrders} customOrders={stats?.recentCustomOrders} />
    </div>
  );
}