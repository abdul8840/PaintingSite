import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { logoutAdmin } from '../../store/slices/authSlice';
import { toggleSidebar, toggleMobileSidebar } from '../../store/slices/uiSlice';
import { 
  HiMenu, HiLogout, HiUser, HiChevronDown, 
  HiBell, HiCog, HiSearch, HiMenuAlt2 
} from 'react-icons/hi';

export default function TopBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { sidebarCollapsed } = useSelector((state) => state.ui);
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logoutAdmin());
    navigate('/login');
  };

  return (
    <header className="
      sticky top-0 z-30
      h-16 sm:h-18
      bg-bg-primary
      border-b border-border-light
      shadow-sm
    ">
      <div className="
        h-full
        px-4 sm:px-6 lg:px-8
        flex items-center justify-between gap-4
      ">
        {/* Left Section */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => dispatch(toggleMobileSidebar())}
            className="
              lg:hidden
              p-2
              text-text-secondary hover:text-text-primary
              hover:bg-bg-hover
              rounded-lg
              transition-colors duration-200
              cursor-pointer
            "
          >
            <HiMenu className="w-6 h-6" />
          </button>
          
          {/* Desktop Sidebar Toggle */}
          <button 
            onClick={() => dispatch(toggleSidebar())}
            className="
              hidden lg:flex
              p-2
              text-text-secondary hover:text-text-primary
              hover:bg-bg-hover
              rounded-lg
              transition-colors duration-200
              cursor-pointer
            "
            title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            <HiMenuAlt2 className={`
              w-6 h-6
              transition-transform duration-300
              ${sidebarCollapsed ? 'rotate-180' : ''}
            `} />
          </button>
          
          {/* Page Title */}
          <div className="hidden sm:block">
            <h1 className="
              text-lg sm:text-xl font-semibold
              text-text-primary
            ">
              Admin Panel
            </h1>
            <p className="text-xs text-text-muted hidden md:block">
              Welcome back, manage your store
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Button (Mobile) */}
          <button className="
            sm:hidden
            p-2
            text-text-secondary hover:text-text-primary
            hover:bg-bg-hover
            rounded-lg
            transition-colors duration-200
            cursor-pointer
          ">
            <HiSearch className="w-5 h-5" />
          </button>
          
          {/* Search Bar (Desktop) */}
          <div className="
            hidden md:flex
            items-center
            bg-bg-secondary
            border border-border-light
            rounded-lg
            px-3 py-2
            w-64 lg:w-80
            transition-all duration-200
            focus-within:border-theme-secondary
            focus-within:ring-2 focus-within:ring-theme-secondary/20
          ">
            <HiSearch className="w-5 h-5 text-text-muted mr-2" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="
                flex-1
                bg-transparent
                text-sm
                text-text-primary
                placeholder:text-text-muted
                outline-none
              "
            />
            <kbd className="
              hidden lg:inline-flex
              items-center
              px-2 py-0.5
              text-xs
              text-text-muted
              bg-bg-tertiary
              rounded
              border border-border-light
            ">
              ⌘K
            </kbd>
          </div>

          {/* Notifications */}
          <button className="
            relative
            p-2
            text-text-secondary hover:text-text-primary
            hover:bg-bg-hover
            rounded-lg
            transition-colors duration-200
            cursor-pointer
          ">
            <HiBell className="w-5 h-5 sm:w-6 sm:h-6" />
            {/* Notification Badge */}
            <span className="
              absolute top-1 right-1
              w-2 h-2
              bg-error
              rounded-full
              ring-2 ring-bg-primary
            " />
          </button>

          {/* Divider */}
          <div className="
            hidden sm:block
            w-px h-8
            bg-border-light
          " />

          {/* User Menu */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="
                flex items-center gap-2 sm:gap-3
                p-1.5 sm:p-2
                hover:bg-bg-hover
                rounded-xl
                transition-colors duration-200
                cursor-pointer
              "
            >
              {/* Avatar */}
              <div className="
                w-8 h-8 sm:w-10 sm:h-10
                bg-theme-primary
                rounded-full
                flex items-center justify-center
                text-white
                font-semibold
                text-sm
              ">
                {user?.firstName?.[0]}{user?.lastName?.[0] || 'A'}
              </div>
              
              {/* User Info - Desktop */}
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-text-primary">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-text-muted">
                  Administrator
                </p>
              </div>
              
              <HiChevronDown className={`
                hidden sm:block
                w-4 h-4
                text-text-muted
                transition-transform duration-200
                ${dropdownOpen ? 'rotate-180' : ''}
              `} />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="
                absolute right-0 mt-2
                w-56
                bg-bg-primary
                border border-border-light
                rounded-xl
                shadow-xl
                py-2
                animate-scaleIn
                origin-top-right
                z-50
              ">
                {/* User Info Header */}
                <div className="px-4 py-3 border-b border-border-light">
                  <p className="text-sm font-medium text-text-primary">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-text-muted truncate">
                    {user?.email || 'admin@sketchmint.com'}
                  </p>
                </div>
                
                {/* Menu Items */}
                <div className="py-2">
                  <button className="
                    w-full
                    flex items-center gap-3
                    px-4 py-2.5
                    text-sm text-text-secondary
                    hover:text-text-primary hover:bg-bg-hover
                    transition-colors duration-200
                    cursor-pointer
                  ">
                    <HiUser className="w-5 h-5" />
                    My Profile
                  </button>
                  
                  <button className="
                    w-full
                    flex items-center gap-3
                    px-4 py-2.5
                    text-sm text-text-secondary
                    hover:text-text-primary hover:bg-bg-hover
                    transition-colors duration-200
                    cursor-pointer
                  ">
                    <HiCog className="w-5 h-5" />
                    Settings
                  </button>
                </div>
                
                {/* Logout */}
                <div className="pt-2 border-t border-border-light">
                  <button 
                    onClick={handleLogout}
                    className="
                      w-full
                      flex items-center gap-3
                      px-4 py-2.5
                      text-sm text-error
                      hover:bg-error-bg
                      transition-colors duration-200
                      cursor-pointer
                    "
                  >
                    <HiLogout className="w-5 h-5" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}