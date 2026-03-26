import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { closeMobileSidebar } from '../../store/slices/uiSlice';
import SidebarItem from './SidebarItem';
import {
  HiChartPie, HiPhotograph, HiCollection, HiShoppingBag,
  HiColorSwatch, HiTicket, HiUsers, HiX, HiCog, HiSupport,
} from 'react-icons/hi';

const menuItems = [
  { label: 'Dashboard', path: '/dashboard', icon: HiChartPie },
  { label: 'Artworks', path: '/artworks', icon: HiPhotograph },
  { label: 'Categories', path: '/categories', icon: HiCollection },
  { label: 'Orders', path: '/orders', icon: HiShoppingBag },
  { label: 'Custom Orders', path: '/custom-orders', icon: HiColorSwatch },
  { label: 'Coupons', path: '/coupons', icon: HiTicket },
  { label: 'Users', path: '/users', icon: HiUsers },
];

const bottomMenuItems = [
  { label: 'Settings', path: '/settings', icon: HiCog },
  { label: 'Help & Support', path: '/support', icon: HiSupport },
];

export default function Sidebar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { sidebarCollapsed, sidebarMobileOpen } = useSelector((state) => state.ui);

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarMobileOpen && (
        <div 
          onClick={() => dispatch(closeMobileSidebar())}
          className="
            fixed inset-0 z-40
            bg-black/50 backdrop-blur-sm
            lg:hidden
            animate-fadeIn
          "
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed top-0 left-0 z-50
          h-full
          bg-theme-primary
          border-r border-white/10
          transition-all duration-300 ease-in-out
          flex flex-col
          
          /* Width based on collapsed state */
          ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-64'}
          
          /* Mobile: Full width, slide in/out */
          w-72
          ${sidebarMobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* Logo Header */}
        <div className="
          flex items-center justify-between
          h-16 sm:h-18
          px-4
          border-b border-white/10
          flex-shrink-0
        ">
          <div className={`
            flex items-center gap-1
            ${sidebarCollapsed ? 'lg:hidden' : ''}
          `}>
            <span className="
              text-xl sm:text-2xl font-bold
              text-white
            ">
              Sketch
            </span>
            <span className="
              text-xl sm:text-2xl font-bold
              text-white/70
            ">
              Mint
            </span>
            <span className="
              ml-2
              px-2 py-0.5
              text-[10px] font-semibold
              uppercase tracking-wider
              bg-white/20 text-white/90
              rounded-full
            ">
              Admin
            </span>
          </div>
          
          {/* Collapsed Logo */}
          {sidebarCollapsed && (
            <div className="hidden lg:flex items-center justify-center w-full">
              <span className="
                text-2xl font-bold
                text-white
              ">
                S
              </span>
              <span className="
                text-2xl font-bold
                text-white/70
              ">
                M
              </span>
            </div>
          )}
          
          {/* Mobile Close Button */}
          <button 
            onClick={() => dispatch(closeMobileSidebar())}
            className="
              lg:hidden
              p-2
              text-white/70 hover:text-white
              hover:bg-white/10
              rounded-lg
              transition-colors duration-200
              cursor-pointer
            "
          >
            <HiX className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="
          flex-1
          py-4 sm:py-6
          px-3
          space-y-1
          overflow-y-auto
          scrollbar-thin scrollbar-thumb-white/20
        ">
          {/* Menu Label */}
          {!sidebarCollapsed && (
            <p className="
              px-3 mb-3
              text-xs font-semibold
              text-white/40
              uppercase tracking-wider
            ">
              Main Menu
            </p>
          )}
          
          {menuItems.map((item) => (
            <SidebarItem
              key={item.path}
              item={item}
              isActive={location.pathname.startsWith(item.path)}
              collapsed={sidebarCollapsed}
              onNavigate={() => dispatch(closeMobileSidebar())}
            />
          ))}
        </nav>

        {/* Bottom Menu */}
        <div className="
          py-4
          px-3
          border-t border-white/10
          flex-shrink-0
        ">
          {!sidebarCollapsed && (
            <p className="
              px-3 mb-3
              text-xs font-semibold
              text-white/40
              uppercase tracking-wider
              hidden lg:block
            ">
              Support
            </p>
          )}
          
          {bottomMenuItems.map((item) => (
            <SidebarItem
              key={item.path}
              item={item}
              isActive={location.pathname.startsWith(item.path)}
              collapsed={sidebarCollapsed}
              onNavigate={() => dispatch(closeMobileSidebar())}
            />
          ))}
        </div>

        {/* User Info (Mobile Only) */}
        <div className="
          lg:hidden
          p-4
          border-t border-white/10
          flex-shrink-0
        ">
          <div className="
            flex items-center gap-3
            p-3
            bg-white/5
            rounded-xl
          ">
            <div className="
              w-10 h-10
              bg-white/20
              rounded-full
              flex items-center justify-center
            ">
              <HiUsers className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                Admin User
              </p>
              <p className="text-xs text-white/50 truncate">
                admin@sketchmint.com
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}