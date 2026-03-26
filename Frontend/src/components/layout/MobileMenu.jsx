import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiX, HiLogout, HiShoppingCart, HiHeart } from 'react-icons/hi';
import { useAuth } from '../../hooks/useAuth';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../store/slices/authSlice';

export default function MobileMenu({ isOpen, onClose }) {
  const { user, isAuthenticated } = useAuth();
  const dispatch = useDispatch();
  const location = useLocation();

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLogout = () => {
    dispatch(logoutUser());
    onClose();
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: '/shop', label: 'Shop' },
    { to: '/custom-painting', label: 'Custom Painting' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  const accountLinks = [
    { to: '/profile', label: 'Profile' },
    { to: '/orders', label: 'My Orders' },
    { to: '/custom-orders', label: 'Custom Orders' },
    { to: '/wishlist', label: 'Wishlist', icon: HiHeart },
    { to: '/cart', label: 'Cart', icon: HiShoppingCart },
    { to: '/track-order', label: 'Track Order' },
  ];

  return (
    <div className="fixed inset-0 z-[100] lg:hidden">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-ink/40 glass animate-fade-in"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="
          absolute right-0 top-0 bottom-0
          w-[85%] max-w-sm
          bg-paper
          shadow-2xl shadow-ink/20
          animate-slide-in-right
          flex flex-col
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-cream">
          <Link
            to="/"
            onClick={onClose}
            className="flex items-center gap-0.5 cursor-pointer"
          >
            <span className="text-xl font-black text-ink">Sketch</span>
            <span className="text-xl font-light text-rust">Mint</span>
          </Link>
          <button
            onClick={onClose}
            className="
              p-2 rounded-xl text-charcoal
              hover:text-rust hover:bg-cream
              transition-all duration-300 cursor-pointer
              active:scale-90
            "
            aria-label="Close menu"
          >
            <HiX className="w-5 h-5" />
          </button>
        </div>

        {/* User Info */}
        {isAuthenticated && (
          <div className="px-5 py-4 bg-cream/40 border-b border-cream">
            <div className="flex items-center gap-3">
              {user?.avatar?.url ? (
                <img
                  src={user.avatar.url}
                  alt={user.firstName}
                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-cream"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-sage/20 flex items-center justify-center">
                  <span className="text-sm font-bold text-sage">
                    {user.firstName?.[0]}
                  </span>
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-mist truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3">
          {/* Main Links */}
          <div className="px-3">
            <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-mist">
              Menu
            </p>
            {navLinks.map((link, i) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-3 py-3 rounded-xl
                  text-sm font-medium
                  transition-all duration-300 cursor-pointer
                  animate-fade-in-up opacity-0
                  ${
                    isActive(link.to)
                      ? 'bg-rust/10 text-rust'
                      : 'text-charcoal hover:bg-cream hover:text-rust'
                  }
                `}
                style={{ animationDelay: `${i * 0.05}s`, animationFillMode: 'forwards' }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Account Links */}
          {isAuthenticated && (
            <div className="px-3 mt-4">
              <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-mist">
                Account
              </p>
              {accountLinks.map((link, i) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={onClose}
                  className={`
                    flex items-center gap-3 px-3 py-3 rounded-xl
                    text-sm font-medium
                    transition-all duration-300 cursor-pointer
                    animate-fade-in-up opacity-0
                    ${
                      isActive(link.to)
                        ? 'bg-rust/10 text-rust'
                        : 'text-charcoal hover:bg-cream hover:text-rust'
                    }
                  `}
                  style={{
                    animationDelay: `${(navLinks.length + i) * 0.05}s`,
                    animationFillMode: 'forwards',
                  }}
                >
                  {link.icon && <link.icon className="w-4 h-4" />}
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </nav>

        {/* Footer Actions */}
        <div className="border-t border-cream px-5 py-4">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="
                w-full flex items-center justify-center gap-2
                px-4 py-3 rounded-xl
                bg-rust/10 text-rust text-sm font-semibold
                hover:bg-rust hover:text-paper
                transition-all duration-300 cursor-pointer
                active:scale-[0.98]
              "
            >
              <HiLogout className="w-4 h-4" />
              Logout
            </button>
          ) : (
            <div className="flex gap-3">
              <Link
                to="/login"
                onClick={onClose}
                className="
                  flex-1 text-center px-4 py-3 rounded-xl
                  bg-ink text-paper text-sm font-semibold
                  hover:bg-charcoal
                  transition-all duration-300 cursor-pointer
                  active:scale-[0.98]
                "
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={onClose}
                className="
                  flex-1 text-center px-4 py-3 rounded-xl
                  border-2 border-ink text-ink text-sm font-semibold
                  hover:bg-ink hover:text-paper
                  transition-all duration-300 cursor-pointer
                  active:scale-[0.98]
                "
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}