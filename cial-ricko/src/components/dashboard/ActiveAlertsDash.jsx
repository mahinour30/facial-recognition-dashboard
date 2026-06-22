import { Link } from 'react-router-dom'
import { WarningFilled } from '@carbon/icons-react'
import { useStore } from '../../store/useStore'

const SEV_COLOR = { Critical: 'var(--status-danger)', Warning: 'var(--status-warning)', Info: 'var(--status-info)' }

export default function ActiveAlertsDash() {
  const alerts = useStore(s => s.alerts)
  const active = alerts.filter(a => a.status !== 'Resolved').slice(0, 6)
  const activeCount = alerts.filter(a => a.status === 'Active').length

  return (
    <div style={{ background: 'var(--surface-primary)', border: '1px solid var(--stroke-default)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--stroke-default)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--type-body-semibold-size)', fontWeight: 600 }}>
          Active Alerts
          <span style={{ background: 'var(--status-danger)', color: '#fff', borderRadius: 'var(--radius-pill)', fontSize: 11, fontWeight: 700, padding: '1px 7px' }}>{activeCount}</span>
        </div>
        <Link to="/alerts" style={{ fontSize: 'var(--type-label-regular-size)', color: 'var(--link-primary)', textDecoration: 'none' }}>All Alerts →</Link>
      </div>

      {active.map(alert => (
        <div key={alert.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--stroke-default)' }}>
          <WarningFilled size={16} style={{ color: SEV_COLOR[alert.severity] || 'var(--status-warning)', flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 'var(--type-body-regular-size)', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{alert.type}</div>
            <div style={{ fontSize: 'var(--type-label-regular-size)', color: 'var(--text-body-tertiary)' }}>{alert.location}</div>
            <div style={{ fontSize: 'var(--type-label-regular-size)', color: 'var(--text-body-tertiary)' }}>{new globalThis.Date(alert.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          </div>
          {alert.status === 'Active'
            ? <button style={{ padding: '2px 10px', border: '1px solid var(--stroke-default)', borderRadius: 'var(--radius-sm)', background: 'var(--surface-primary)', cursor: 'pointer', fontSize: 11, color: 'var(--text-title-primary)', whiteSpace: 'nowrap' }}>View</button>
            : <span style={{ fontSize: 11, color: 'var(--text-body-tertiary)', border: '1px solid var(--stroke-default)', borderRadius: 'var(--radius-sm)', padding: '2px 10px' }}>Resolved</span>
          }
        </div>
      ))}
    </div>
  )
}
