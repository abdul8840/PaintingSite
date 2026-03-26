import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/common/Loader';

export default function AdminRoute({ children }) {
  const { isAuthenticated, authChecked, user } = useAuth();

  if (!authChecked) return <Loader text="Checking authentication..." />;
  if (!isAuthenticated || user?.role !== 'admin') return <Navigate to="/login" replace />;

  return children;
}