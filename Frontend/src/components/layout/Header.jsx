import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { HiShoppingCart, HiHeart, HiUser, HiMenu, HiX, HiSearch, HiLogout } from 'react-icons/hi';
import { useAuth } from '../../hooks/useAuth';
import { selectCartCount } from '../../store/slices/cartSlice';
import { logoutUser } from '../../store/slices/authSlice';
import { clearWishlist } from '../../store/slices/wishlistSlice';
import SearchBar from './SearchBar';
import MobileMenu from './MobileMenu';

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const cartCount = useSelector(selectCartCount);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(clearWishlist());
    setProfileOpen(false);
    navigate('/');
  };

  return (
    <header>
      <div>
        {/* Logo */}
        <Link to="/">
          <span>Sketch</span><span>Mint</span>
        </Link>

        {/* Desktop Nav */}
        <nav>
          <Link to="/shop">Shop</Link>
          <Link to="/custom-painting">Custom Painting</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </nav>

        {/* Actions */}
        <div>
          <button onClick={() => setSearchOpen(!searchOpen)}>
            <HiSearch />
          </button>

          {isAuthenticated && (
            <Link to="/wishlist">
              <HiHeart />
            </Link>
          )}

          <Link to="/cart">
            <HiShoppingCart />
            {cartCount > 0 && <span>{cartCount}</span>}
          </Link>

          {isAuthenticated ? (
            <div>
              <button onClick={() => setProfileOpen(!profileOpen)}>
                {user?.avatar?.url ? (
                  <img src={user.avatar.url} alt={user.firstName} />
                ) : (
                  <HiUser />
                )}
              </button>

              {profileOpen && (
                <div>
                  <div>
                    <p>{user.firstName} {user.lastName}</p>
                    <p>{user.email}</p>
                  </div>
                  <Link to="/profile" onClick={() => setProfileOpen(false)}>Profile</Link>
                  <Link to="/orders" onClick={() => setProfileOpen(false)}>My Orders</Link>
                  <Link to="/custom-orders" onClick={() => setProfileOpen(false)}>Custom Orders</Link>
                  <Link to="/wishlist" onClick={() => setProfileOpen(false)}>Wishlist</Link>
                  <Link to="/track-order" onClick={() => setProfileOpen(false)}>Track Order</Link>
                  <button onClick={handleLogout}><HiLogout /> Logout</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">Login</Link>
          )}

          {/* Mobile toggle */}
          <button onClick={() => setMobileOpen(true)}>
            <HiMenu />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {searchOpen && <SearchBar onClose={() => setSearchOpen(false)} />}

      {/* Mobile Menu */}
      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}