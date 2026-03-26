import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { closeMobileSidebar } from '../../store/slices/uiSlice';
import SidebarItem from './SidebarItem';
import {
  HiChartPie, HiPhotograph, HiCollection, HiShoppingBag,
  HiColorSwatch, HiTicket, HiUsers, HiX,
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

export default function Sidebar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { sidebarCollapsed, sidebarMobileOpen } = useSelector((state) => state.ui);

  return (
    <>
      {/* Mobile overlay */}
      {sidebarMobileOpen && (
        <div onClick={() => dispatch(closeMobileSidebar())} />
      )}

      <aside data-collapsed={sidebarCollapsed} data-mobile-open={sidebarMobileOpen}>
        <div>
          <div>
            <span>Sketch</span><span>Mint</span>
            <span>Admin</span>
          </div>
          <button onClick={() => dispatch(closeMobileSidebar())}><HiX /></button>
        </div>

        <nav>
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
      </aside>
    </>
  );
}