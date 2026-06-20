import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  AlertTriangle,
  Users,
  ClipboardList,
  Settings,
} from 'lucide-react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/alerts', label: 'Alerts', icon: AlertTriangle },
  { to: '/people', label: 'People and Access', icon: Users },
  { to: '/access-log', label: 'Access Log', icon: ClipboardList },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {navItems.map(({ to, label, icon: Icon, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            title={label}
            className={({ isActive }) =>
              `sidebar-item${isActive ? ' sidebar-item--active' : ''}`
            }
          >
            <Icon size={20} />
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <span className="sidebar-logo-label">Systems</span>
        <span className="sidebar-logo-badge">Soon</span>
      </div>
    </aside>
  );
}
