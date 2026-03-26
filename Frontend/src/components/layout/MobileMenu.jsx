import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HiX, HiLogout, HiShoppingCart, HiHeart,
  HiUser,
} from 'react-icons/hi';
import {
  HiSparkles, HiHome, HiPhoto, HiPaintBrush,
  HiEnvelope, HiInformationCircle, HiReceiptRefund,
  HiTruck, HiXMark,
} from 'react-icons/hi2';
import { useAuth } from '../../hooks/useAuth';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../store/slices/authSlice';
import { clearWishlist } from '../../store/slices/wishlistSlice';

const navLinks = [
  { to: '/',                label: 'Home',           icon: HiHome            },
  { to: '/shop',            label: 'Shop',           icon: HiPhoto           },
  { to: '/custom-painting', label: 'Custom Painting',icon: HiPaintBrush      },
  { to: '/about',           label: 'About',          icon: HiInformationCircle},
  { to: '/contact',         label: 'Contact',        icon: HiEnvelope        },
];

const accountLinks = [
  { to: '/profile',       label: 'My Profile',    icon: HiUser           },
  { to: '/orders',        label: 'My Orders',     icon: HiReceiptRefund  },
  { to: '/custom-orders', label: 'Custom Orders', icon: HiPaintBrush     },
  { to: '/wishlist',      label: 'Wishlist',      icon: HiHeart          },
  { to: '/cart',          label: 'Cart',          icon: HiShoppingCart   },
  { to: '/track-order',   label: 'Track Order',   icon: HiTruck          },
];

export default function MobileMenu({ isOpen, onClose }) {
  const { user, isAuthenticated } = useAuth();
  const dispatch  = useDispatch();
  const location  = useLocation();
  const cartCount = useSelector(s => s.cart?.items?.reduce((a, i) => a + i.quantity, 0) ?? 0);
  const wishCount = useSelector(s => s.wishlist?.items?.length ?? 0);

  /* ── lock body scroll ── */
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  /* ── close on route change ── */
  useEffect(() => { onClose(); }, [location.pathname]);

  if (!isOpen) return null;

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(clearWishlist());
    onClose();
  };

  const isActive = (path) =>
    path === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(path);

  return (
    <div className="fixed inset-0 z-[100] lg:hidden">

      {/* ── Backdrop ── */}
      <div
        className="absolute inset-0 bg-[var(--color-ink)]/50 backdrop-blur-sm
                   animate-fade-in"
        onClick={onClose}
      />

      {/* ── Drawer panel ── */}
      <div className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm
                      bg-[var(--color-paper)] shadow-2xl shadow-[var(--color-ink)]/25
                      animate-slide-in-right flex flex-col overflow-hidden">

        {/* Top gradient accent */}
        <div className="h-1 w-full bg-gradient-to-r from-[var(--color-rust)]
                        via-[var(--color-gold)] to-[var(--color-sage)] flex-shrink-0" />

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-4
                        border-b border-[var(--color-cream)] flex-shrink-0">
          <Link to="/" className="cursor-pointer flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-lg bg-[var(--color-ink)] flex items-center
                            justify-center group-hover:shadow-md transition-all duration-200">
              <HiSparkles className="w-4 h-4 text-[var(--color-gold)]" />
            </div>
            <span className="font-black text-[var(--color-ink)] group-hover:text-[var(--color-rust)]
                             transition-colors duration-200">
              Sketch
            </span>
            <span className="-ml-1.5 font-light text-[var(--color-rust)]
                             group-hover:text-[var(--color-gold)] transition-colors duration-200">
              Mint
            </span>
          </Link>

          <button
            onClick={onClose}
            className="cursor-pointer p-2 rounded-xl text-[var(--color-charcoal)]
                       hover:text-[var(--color-rust)] hover:bg-[var(--color-cream)]
                       transition-all duration-200 active:scale-90"
            aria-label="Close menu"
          >
            <HiXMark className="w-5 h-5" />
          </button>
        </div>

        {/* ── User greeting card ── */}
        {isAuthenticated && (
          <div className="px-4 py-4 mx-3 mt-3 rounded-2xl bg-gradient-to-br
                          from-[var(--color-ink)] to-[var(--color-charcoal)]
                          flex-shrink-0">
            <div className="flex items-center gap-3">
              {/* Avatar */}
              {user?.avatar?.url ? (
                <img src={user.avatar.url} alt={user.firstName}
                  className="w-11 h-11 rounded-xl object-cover ring-2 ring-white/20
                             flex-shrink-0" />
              ) : (
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br
                                from-[var(--color-rust)] to-[var(--color-gold)]
                                flex items-center justify-center flex-shrink-0 shadow-lg">
                  <span className="text-base font-bold text-white">
                    {user?.firstName?.[0]?.toUpperCase() ?? 'U'}
                  </span>
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-[var(--color-paper)] truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-[var(--color-mist)] truncate mt-0.5">
                  {user?.email}
                </p>
              </div>
              {/* Mini badges */}
              <div className="flex flex-col gap-1 flex-shrink-0">
                {cartCount > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full
                                   bg-[var(--color-rust)] text-white text-center">
                    {cartCount} cart
                  </span>
                )}
                {wishCount > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full
                                   bg-[var(--color-gold)]/20 text-[var(--color-gold)]
                                   border border-[var(--color-gold)]/30 text-center">
                    {wishCount} saved
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Scrollable nav area ── */}
        <nav className="flex-1 overflow-y-auto py-3 px-3">

          {/* Main links */}
          <div className="mb-2">
            <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest
                          text-[var(--color-mist)]">
              Menu
            </p>
            {navLinks.map(({ to, label, icon: Icon }, i) => (
              <Link
                key={to}
                to={to}
                className={`cursor-pointer flex items-center gap-3 px-3 py-3
                             rounded-xl text-sm font-medium mb-0.5
                             transition-all duration-200 animate-fade-in-up
                             ${isActive(to)
                               ? 'bg-[var(--color-ink)] text-[var(--color-paper)] shadow-md'
                               : 'text-[var(--color-charcoal)] hover:bg-[var(--color-cream)] hover:text-[var(--color-rust)]'
                             }`}
                style={{
                  animationDelay: `${i * 0.04}s`,
                  animationFillMode: 'both',
                }}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center
                                 flex-shrink-0 transition-all duration-200
                                 ${isActive(to)
                                   ? 'bg-white/12'
                                   : 'bg-[var(--color-cream)] group-hover:bg-[var(--color-mist)]/20'
                                 }`}>
                  <Icon className={`w-4 h-4 ${isActive(to)
                    ? 'text-[var(--color-gold)]'
                    : 'text-[var(--color-mist)]'}`} />
                </div>
                <span className="flex-1">{label}</span>
                {isActive(to) && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)]
                                   flex-shrink-0" />
                )}
              </Link>
            ))}
          </div>

          {/* Account links */}
          {isAuthenticated && (
            <>
              <div className="my-3 h-px bg-[var(--color-cream)]" />
              <div>
                <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest
                              text-[var(--color-mist)]">
                  Account
                </p>
                {accountLinks.map(({ to, label, icon: Icon }, i) => (
                  <Link
                    key={to}
                    to={to}
                    className={`cursor-pointer flex items-center gap-3 px-3 py-3
                                 rounded-xl text-sm font-medium mb-0.5
                                 transition-all duration-200 animate-fade-in-up relative
                                 ${isActive(to)
                                   ? 'bg-[var(--color-ink)] text-[var(--color-paper)] shadow-md'
                                   : 'text-[var(--color-charcoal)] hover:bg-[var(--color-cream)] hover:text-[var(--color-rust)]'
                                 }`}
                    style={{
                      animationDelay: `${(navLinks.length + i) * 0.04}s`,
                      animationFillMode: 'both',
                    }}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center
                                     flex-shrink-0 transition-all duration-200
                                     ${isActive(to) ? 'bg-white/12' : 'bg-[var(--color-cream)]'}`}>
                      <Icon className={`w-4 h-4 ${isActive(to)
                        ? 'text-[var(--color-gold)]'
                        : 'text-[var(--color-mist)]'}`} />
                    </div>
                    <span className="flex-1">{label}</span>

                    {/* Badges on specific links */}
                    {to === '/cart' && cartCount > 0 && (
                      <span className="min-w-[20px] h-5 px-1.5 flex items-center
                                       justify-center bg-[var(--color-rust)]
                                       text-white text-[10px] font-bold rounded-full">
                        {cartCount}
                      </span>
                    )}
                    {to === '/wishlist' && wishCount > 0 && (
                      <span className="min-w-[20px] h-5 px-1.5 flex items-center
                                       justify-center bg-[var(--color-rust)]/15
                                       text-[var(--color-rust)] text-[10px] font-bold
                                       rounded-full">
                        {wishCount}
                      </span>
                    )}
                    {isActive(to) && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)]
                                       flex-shrink-0" />
                    )}
                  </Link>
                ))}
              </div>
            </>
          )}
        </nav>

        {/* ── Footer actions ── */}
        <div className="flex-shrink-0 border-t border-[var(--color-cream)] p-4 space-y-3">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="cursor-pointer w-full flex items-center justify-center gap-2.5
                         px-4 py-3 rounded-xl border-2 border-[var(--color-rust)]/25
                         text-[var(--color-rust)] text-sm font-semibold
                         hover:bg-[var(--color-rust)] hover:text-white
                         hover:border-[var(--color-rust)]
                         transition-all duration-300 active:scale-[0.98] group"
            >
              <HiLogout className="w-4 h-4 transition-transform duration-200
                                    group-hover:-translate-x-0.5" />
              Sign Out
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/login"
                className="cursor-pointer flex-1 text-center px-4 py-3 rounded-xl
                           bg-[var(--color-ink)] text-[var(--color-paper)] text-sm
                           font-semibold hover:bg-[var(--color-charcoal)]
                           transition-all duration-200 active:scale-[0.98]"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="cursor-pointer flex-1 text-center px-4 py-3 rounded-xl
                           border-2 border-[var(--color-ink)] text-[var(--color-ink)]
                           text-sm font-semibold hover:bg-[var(--color-ink)]
                           hover:text-[var(--color-paper)] transition-all duration-200
                           active:scale-[0.98]"
              >
                Register
              </Link>
            </div>
          )}

          {/* Bottom safe area note */}
          <p className="text-[10px] text-[var(--color-mist)] text-center">
            © {new Date().getFullYear()} SketchMint
          </p>
        </div>
      </div>
    </div>
  );
}