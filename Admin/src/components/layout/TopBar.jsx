import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { logoutAdmin } from '../../store/slices/authSlice';
import { toggleSidebar, toggleMobileSidebar } from '../../store/slices/uiSlice';
import { HiMenu, HiLogout, HiUser } from 'react-icons/hi';

export default function TopBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = () => {
    dispatch(logoutAdmin());
    navigate('/login');
  };

  return (
    <header>
      <div>
        <button onClick={() => dispatch(toggleMobileSidebar())}><HiMenu /></button>
        <button onClick={() => dispatch(toggleSidebar())}><HiMenu /></button>
        <h2>Admin Panel</h2>
      </div>

      <div>
        <div>
          <HiUser />
          <div>
            <span>{user?.firstName} {user?.lastName}</span>
            <span>Administrator</span>
          </div>
        </div>
        <button onClick={handleLogout}><HiLogout /> Logout</button>
      </div>
    </header>
  );
}