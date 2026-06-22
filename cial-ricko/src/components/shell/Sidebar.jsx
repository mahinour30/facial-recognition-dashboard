import { NavLink } from 'react-router-dom'
import { Dashboard, Warning, UserMultiple, Table, Settings, SidePanelClose, SidePanelOpen } from '@carbon/icons-react'
import { useStore } from '../../store/useStore'

const NAV = [
  { label: 'Dashboard', icon: Dashboard, to: '/' },
  { label: 'Alerts', icon: Warning, to: '/alerts', badge: 3 },
  { label: 'People and Access', icon: UserMultiple, to: '/people' },
  { label: 'Access Log', icon: Table, to: '/access-log' },
]

export default function Sidebar() {
  const collapsed = useStore(s => s.ui.sidebarCollapsed)
  const toggleSidebar = useStore(s => s.toggleSidebar)
  const w = collapsed ? 64 : 220

  return (
    <aside style={{
      width: w, flexShrink: 0,
      background: 'var(--surface-primary)',
      borderRight: '1px solid var(--stroke-default)',
      display: 'flex', flexDirection: 'column',
      transition: 'width 0.2s',
      overflow: 'hidden',
    }}>
      {/* Toggle button */}
      <button onClick={toggleSidebar} style={{
        display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-end',
        padding: 'var(--space-3) var(--space-4)',
        background: 'transparent', border: 'none', cursor: 'pointer',
        color: 'var(--text-body-tertiary)', borderBottom: '1px solid var(--stroke-default)',
        minHeight: 48,
      }}>
        {collapsed ? <SidePanelOpen size={20} /> : <SidePanelClose size={20} />}
      </button>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: 'var(--space-2) 0' }}>
        {NAV.map(({ label, icon: Icon, to, badge }) => (
          <NavLink key={to} to={to} end={to === '/'} style={({ isActive }) => ({
            display: 'flex', alignItems: 'center',
            gap: 'var(--space-3)', padding: '0 var(--space-4)',
            height: 48, textDecoration: 'none', whiteSpace: 'nowrap',
            background: isActive ? 'var(--surface-tertiary)' : 'transparent',
            color: isActive ? 'var(--text-title-primary)' : 'var(--text-body-tertiary)',
            fontWeight: isActive ? 'var(--font-weight-open-sans-0)' : 'var(--type-body-regular-weight)',
            fontSize: 'var(--type-body-regular-size)',
            transition: 'background 0.15s',
            overflow: 'hidden',
          })}>
            <span style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
              <Icon size={16} />
            </span>
            {!collapsed && <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>}
            {!collapsed && badge && (
              <span style={{ background: 'var(--color-functional-colors-red)', color: '#fff', fontSize: 11, fontWeight: 700, borderRadius: 'var(--radius-pill)', padding: '1px 7px', flexShrink: 0 }}>{badge}</span>
            )}
          </NavLink>
        ))}

        {/* System Logs — disabled */}
        <div style={{
          display: 'flex', alignItems: 'center',
          gap: 'var(--space-3)', padding: '0 var(--space-4)',
          height: 48, opacity: 0.4, cursor: 'not-allowed',
          color: 'var(--text-body-tertiary)', fontSize: 'var(--type-body-regular-size)',
          whiteSpace: 'nowrap', overflow: 'hidden',
        }}>
          <Settings size={16} />
          {!collapsed && <>
            <span style={{ flex: 1 }}>System Logs</span>
            <span style={{ background: 'var(--surface-tertiary)', color: 'var(--text-body-tertiary)', fontSize: 10, borderRadius: 'var(--radius-pill)', padding: '1px 6px', flexShrink: 0 }}>Soon</span>
          </>}
        </div>
      </nav>

      {/* Footer placeholder */}
      {!collapsed && (
        <div style={{ padding: 'var(--space-3) var(--space-4)', borderTop: '1px solid var(--stroke-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 'var(--font-size-0)', color: 'var(--text-body-primary)' }}>Systems Logo</span>
          <span style={{ fontSize: 10, background: 'var(--surface-tertiary)', color: 'var(--text-body-primary)', borderRadius: 'var(--radius-pill)', padding: '1px 6px' }}>Soon</span>
        </div>
      )}
    </aside>
  )
}
