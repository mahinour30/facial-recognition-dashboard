import { NavLink } from 'react-router-dom';
import { LayoutDashboard, AlertTriangle, Users, ClipboardList } from 'lucide-react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/alerts', label: 'Alerts', icon: AlertTriangle },
  { to: '/people', label: 'People and Access', icon: Users },
  { to: '/access-log', label: 'Access Log', icon: ClipboardList },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `sidebar-item ${isActive ? 'sidebar-item--active' : ''}`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <span className="sidebar-logo-label">Systems Logo</span>
        <span className="sidebar-logo-badge">Soon</span>
      </div>
    </aside>
  );
}
