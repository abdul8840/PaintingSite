import { Link } from 'react-router-dom';
import { HiX } from 'react-icons/hi';
import { useAuth } from '../../hooks/useAuth';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../store/slices/authSlice';

export default function MobileMenu({ isOpen, onClose }) {
  const { user, isAuthenticated } = useAuth();
  const dispatch = useDispatch();

  if (!isOpen) return null;

  const handleLogout = () => {
    dispatch(logoutUser());
    onClose();
  };

  return (
    <div>
      <div onClick={onClose}></div>
      <div>
        <div>
          <Link to="/" onClick={onClose}><span>Sketch</span><span>Mint</span></Link>
          <button onClick={onClose}><HiX /></button>
        </div>

        {isAuthenticated && (
          <div>
            <p>{user.firstName} {user.lastName}</p>
            <p>{user.email}</p>
          </div>
        )}

        <nav>
          <Link to="/shop" onClick={onClose}>Shop</Link>
          <Link to="/custom-painting" onClick={onClose}>Custom Painting</Link>
          <Link to="/about" onClick={onClose}>About</Link>
          <Link to="/contact" onClick={onClose}>Contact</Link>

          {isAuthenticated ? (
            <>
              <Link to="/profile" onClick={onClose}>Profile</Link>
              <Link to="/orders" onClick={onClose}>My Orders</Link>
              <Link to="/custom-orders" onClick={onClose}>Custom Orders</Link>
              <Link to="/wishlist" onClick={onClose}>Wishlist</Link>
              <Link to="/cart" onClick={onClose}>Cart</Link>
              <Link to="/track-order" onClick={onClose}>Track Order</Link>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={onClose}>Login</Link>
              <Link to="/register" onClick={onClose}>Register</Link>
            </>
          )}
        </nav>
      </div>
    </div>
  );
}