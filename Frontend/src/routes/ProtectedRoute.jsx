import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/common/Loader';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, authChecked } = useAuth();
  const location = useLocation();

  if (!authChecked) return <Loader />;
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;

  return children;
}