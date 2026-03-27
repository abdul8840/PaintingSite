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
  const { stats, loading, error } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  if (loading && !stats) return <Loader text="Loading dashboard..." />;

  if (error) {
    return (
      <div>
        <h1>Dashboard</h1>
        <div>
          <p>Failed to load dashboard: {error}</p>
          <button onClick={() => dispatch(fetchDashboardStats())}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div>
        <h1>Dashboard</h1>
        <button onClick={() => dispatch(fetchDashboardStats())}>
          Refresh
        </button>
      </div>

      <QuickStats stats={stats || {}} />

      <div>
        <div>
          <RevenueChart data={stats?.revenueChart || []} />
        </div>
        <div>
          <TopArtworks artworks={stats?.topArtworks || []} />
        </div>
      </div>

      <RecentOrders
        orders={stats?.recentOrders || []}
        customOrders={stats?.recentCustomOrders || []}
      />
    </div>
  );
}