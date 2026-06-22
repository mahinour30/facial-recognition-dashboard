import { Link } from 'react-router-dom'
import { CheckmarkFilled, WarningAltFilled, WarningFilled } from '@carbon/icons-react'
import { RECENT_ACTIVITY } from '../../data/dashboardData'

const RESULT_STYLE = {
  'Entry Confirmed':       { bg: 'var(--tag-green-bg)',  fg: 'var(--tag-green-fg)' },
  'Exit Confirmed':        { bg: 'var(--tag-green-bg)',  fg: 'var(--tag-green-fg)' },
  'Re-entry without exit': { bg: 'var(--tag-orange-bg)', fg: 'var(--tag-orange-fg)' },
  'Flagged':               { bg: 'var(--tag-red-bg)',    fg: 'var(--tag-red-fg)' },
}

function StatusIcon({ status }) {
  if (status === 'ok')   return <CheckmarkFilled size={16} style={{ color: 'var(--status-success)', flexShrink: 0 }} />
  if (status === 'warn') return <WarningAltFilled size={16} style={{ color: 'var(--status-warning)', flexShrink: 0 }} />
  return <WarningFilled size={16} style={{ color: 'var(--status-danger)', flexShrink: 0 }} />
}

export default function RecentActivity() {
  return (
    <div style={{ background: 'var(--surface-primary)', border: '1px solid var(--stroke-default)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--stroke-default)' }}>
        <span style={{ fontSize: 'var(--type-body-semibold-size)', fontWeight: 600 }}>Recent Activity</span>
        <Link to="/access-log" style={{ fontSize: 'var(--type-label-regular-size)', color: 'var(--link-primary)', textDecoration: 'none' }}>View All →</Link>
      </div>
      {RECENT_ACTIVITY.map(item => {
        const chip = RESULT_STYLE[item.result] || RESULT_STYLE['Flagged']
        return (
          <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--stroke-default)' }}>
            <StatusIcon status={item.status} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 'var(--type-body-regular-size)', fontWeight: 600 }}>{item.name}</div>
              <div style={{ fontSize: 'var(--type-label-regular-size)', color: 'var(--text-body-tertiary)' }}>
                Confidence: {item.confidence}% · {item.timeAgo}
              </div>
            </div>
            <span style={{ background: chip.bg, color: chip.fg, fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 'var(--radius-pill)', whiteSpace: 'nowrap' }}>
              {item.result}
            </span>
          </div>
        )
      })}
    </div>
  )
}
