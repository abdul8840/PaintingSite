import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/common/Loader';

export default function GuestRoute({ children }) {
  const { isAuthenticated, authChecked } = useAuth();

  if (!authChecked) return <Loader />;
  if (isAuthenticated) return <Navigate to="/" replace />;

  return children;
}