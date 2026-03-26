import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  HiShoppingCart,
  HiHeart,
  HiUser,
  HiMenu,
  HiX,
  HiSearch,
  HiLogout,
  HiChevronDown,
} from 'react-icons/hi';
import { useAuth } from '../../hooks/useAuth';
import { selectCartCount } from '../../store/slices/cartSlice';
import { logoutUser } from '../../store/slices/authSlice';
import { clearWishlist } from '../../store/slices/wishlistSlice';
import SearchBar from './SearchBar';
import MobileMenu from './MobileMenu';

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const cartCount = useSelector(selectCartCount);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const profileRef = useRef(null);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close profile dropdown on route change
  useEffect(() => {
    setProfileOpen(false);
  }, [location]);

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(clearWishlist());
    setProfileOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header
      className={`
        sticky top-0 z-50 w-full transition-all duration-500 ease-out
        ${
          scrolled
            ? 'bg-paper/95 glass shadow-lg shadow-ink/5 py-2'
            : 'bg-paper py-3 md:py-4'
        }
      `}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="group flex items-center gap-0.5 cursor-pointer"
          >
            <span
              className="
                text-2xl md:text-3xl font-black tracking-tight text-ink
                transition-colors duration-300 group-hover:text-rust
              "
            >
              Sketch
            </span>
            <span
              className="
                text-2xl md:text-3xl font-light tracking-tight text-rust
                transition-colors duration-300 group-hover:text-gold
              "
            >
              Mint
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {[
              { to: '/shop', label: 'Shop' },
              { to: '/custom-painting', label: 'Custom Painting' },
              { to: '/about', label: 'About' },
              { to: '/contact', label: 'Contact' },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`
                  relative px-4 py-2 text-sm font-medium tracking-wide
                  transition-colors duration-300 cursor-pointer rounded-lg
                  ${
                    isActive(link.to)
                      ? 'text-rust'
                      : 'text-charcoal hover:text-rust'
                  }
                  group
                `}
              >
                {link.label}
                {/* Active / hover underline */}
                <span
                  className={`
                    absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full
                    bg-gradient-to-r from-rust to-gold
                    transition-all duration-300
                    ${isActive(link.to) ? 'w-6' : 'w-0 group-hover:w-6'}
                  `}
                />
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="
                relative p-2.5 rounded-xl text-charcoal
                hover:text-rust hover:bg-cream
                transition-all duration-300 cursor-pointer
                active:scale-90
              "
              aria-label="Search"
            >
              <HiSearch className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            {isAuthenticated && (
              <Link
                to="/wishlist"
                className="
                  relative p-2.5 rounded-xl text-charcoal
                  hover:text-rust hover:bg-cream
                  transition-all duration-300 cursor-pointer
                  active:scale-90 hidden sm:flex
                "
                aria-label="Wishlist"
              >
                <HiHeart className="w-5 h-5" />
              </Link>
            )}

            {/* Cart */}
            <Link
              to="/cart"
              className="
                relative p-2.5 rounded-xl text-charcoal
                hover:text-rust hover:bg-cream
                transition-all duration-300 cursor-pointer
                active:scale-90
              "
              aria-label="Cart"
            >
              <HiShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span
                  className="
                    absolute -top-0.5 -right-0.5
                    min-w-[20px] h-5 px-1.5
                    flex items-center justify-center
                    bg-rust text-paper text-[11px] font-bold
                    rounded-full
                    animate-scale-in
                    shadow-md shadow-rust/30
                  "
                >
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Profile / Login */}
            {isAuthenticated ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="
                    flex items-center gap-1.5 p-1.5 rounded-xl
                    hover:bg-cream transition-all duration-300
                    cursor-pointer active:scale-95
                  "
                >
                  {user?.avatar?.url ? (
                    <img
                      src={user.avatar.url}
                      alt={user.firstName}
                      className="
                        w-8 h-8 rounded-lg object-cover
                        ring-2 ring-cream
                        transition-all duration-300
                        group-hover:ring-rust
                      "
                    />
                  ) : (
                    <div
                      className="
                        w-8 h-8 rounded-lg bg-sage/20
                        flex items-center justify-center
                      "
                    >
                      <HiUser className="w-4 h-4 text-sage" />
                    </div>
                  )}
                  <HiChevronDown
                    className={`
                      w-3.5 h-3.5 text-mist hidden sm:block
                      transition-transform duration-300
                      ${profileOpen ? 'rotate-180' : ''}
                    `}
                  />
                </button>

                {/* Profile Dropdown */}
                {profileOpen && (
                  <div
                    className="
                      absolute right-0 top-full mt-2
                      w-64 bg-paper rounded-2xl
                      shadow-xl shadow-ink/10
                      border border-cream
                      overflow-hidden
                      animate-scale-in origin-top-right
                      z-50
                    "
                  >
                    {/* User Info */}
                    <div className="px-4 py-3 bg-cream/50 border-b border-cream">
                      <p className="text-sm font-semibold text-ink truncate">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-mist truncate mt-0.5">
                        {user.email}
                      </p>
                    </div>

                    {/* Links */}
                    <div className="py-1.5">
                      {[
                        { to: '/profile', label: 'Profile' },
                        { to: '/orders', label: 'My Orders' },
                        { to: '/custom-orders', label: 'Custom Orders' },
                        { to: '/wishlist', label: 'Wishlist' },
                        { to: '/track-order', label: 'Track Order' },
                      ].map((link) => (
                        <Link
                          key={link.to}
                          to={link.to}
                          onClick={() => setProfileOpen(false)}
                          className="
                            block px-4 py-2.5 text-sm text-charcoal
                            hover:bg-cream hover:text-rust
                            transition-colors duration-200 cursor-pointer
                          "
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>

                    {/* Logout */}
                    <div className="border-t border-cream py-1.5">
                      <button
                        onClick={handleLogout}
                        className="
                          w-full flex items-center gap-2
                          px-4 py-2.5 text-sm text-rust
                          hover:bg-rust/5
                          transition-colors duration-200 cursor-pointer
                        "
                      >
                        <HiLogout className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="
                  hidden sm:inline-flex items-center gap-1.5
                  px-5 py-2 rounded-xl
                  bg-ink text-paper text-sm font-medium
                  hover:bg-charcoal
                  transition-all duration-300 cursor-pointer
                  active:scale-95
                  shadow-md shadow-ink/10
                "
              >
                Login
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(true)}
              className="
                lg:hidden p-2.5 rounded-xl text-charcoal
                hover:text-rust hover:bg-cream
                transition-all duration-300 cursor-pointer
                active:scale-90
              "
              aria-label="Open menu"
            >
              <HiMenu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      {searchOpen && <SearchBar onClose={() => setSearchOpen(false)} />}

      {/* Mobile Menu */}
      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}