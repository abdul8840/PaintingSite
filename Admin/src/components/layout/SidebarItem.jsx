import { Link } from 'react-router-dom';

export default function SidebarItem({ item, isActive, collapsed, onNavigate }) {
  const Icon = item.icon;

  return (
    <Link 
      to={item.path} 
      onClick={onNavigate}
      className={`
        group
        flex items-center gap-3
        px-3 py-2.5 sm:py-3
        rounded-xl
        transition-all duration-200
        cursor-pointer
        relative
        
        ${isActive 
          ? 'bg-white text-theme-primary shadow-lg shadow-white/20' 
          : 'text-white/70 hover:text-white hover:bg-white/10'
        }
        
        ${collapsed ? 'lg:justify-center lg:px-0' : ''}
      `}
    >
      {/* Active Indicator */}
      {isActive && (
        <span className="
          absolute left-0 top-1/2 -translate-y-1/2
          w-1 h-8
          bg-white
          rounded-r-full
          -ml-3
          hidden lg:block
        " />
      )}
      
      <Icon className={`
        w-5 h-5 sm:w-6 sm:h-6
        flex-shrink-0
        transition-transform duration-200
        ${!isActive && 'group-hover:scale-110'}
      `} />
      
      {/* Label - Hidden when collapsed on desktop */}
      <span className={`
        text-sm font-medium
        whitespace-nowrap
        transition-opacity duration-200
        ${collapsed ? 'lg:hidden' : ''}
      `}>
        {item.label}
      </span>
      
      {/* Tooltip for collapsed state */}
      {collapsed && (
        <span className="
          hidden lg:block
          absolute left-full ml-3
          px-3 py-2
          bg-theme-primary text-white
          text-sm font-medium
          rounded-lg
          shadow-lg
          whitespace-nowrap
          opacity-0 invisible
          group-hover:opacity-100 group-hover:visible
          transition-all duration-200
          z-50
        ">
          {item.label}
          {/* Tooltip Arrow */}
          <span className="
            absolute right-full top-1/2 -translate-y-1/2
            border-8 border-transparent border-r-theme-primary
          " />
        </span>
      )}
    </Link>
  );
}