import { useSelector } from 'react-redux';

export const useAuth = () => {
  const { user, isAuthenticated, loading, authChecked } = useSelector((state) => state.auth);
  return { user, isAuthenticated, loading, authChecked };
};