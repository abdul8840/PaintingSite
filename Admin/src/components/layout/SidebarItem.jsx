import { Link } from 'react-router-dom';

export default function SidebarItem({ item, isActive, collapsed, onNavigate }) {
  const Icon = item.icon;

  return (
    <Link to={item.path} onClick={onNavigate} data-active={isActive}>
      <Icon />
      {!collapsed && <span>{item.label}</span>}
    </Link>
  );
}