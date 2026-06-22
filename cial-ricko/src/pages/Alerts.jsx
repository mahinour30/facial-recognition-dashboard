import { useState } from 'react'
import { Export, WarningFilled, WarningAltFilled, InformationFilled, View } from '@carbon/icons-react'
import { useStore } from '../store/useStore'
import AlertDetails from '../components/alerts/AlertDetails'

const SEV_ICON = {
  Critical: WarningFilled,
  Warning:  WarningAltFilled,
  Info:     InformationFilled,
}
const SEV_COLOR = {
  Critical: 'var(--status-danger)',
  Warning:  'var(--status-warning)',
  Info:     'var(--status-info)',
}
const STATUS_STYLE = {
  Active:      { bg: 'var(--tag-red-bg)',    fg: 'var(--tag-red-fg)' },
  'In Progress':{ bg: 'var(--tag-orange-bg)', fg: 'var(--tag-orange-fg)' },
  Resolved:    { bg: 'var(--tag-green-bg)',  fg: 'var(--tag-green-fg)' },
}

function fmt(iso) {
  const d = new globalThis.Date(iso)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function Alerts() {
  const alerts   = useStore(s => s.alerts)
  const [tab, setTab]         = useState('All')
  const [viewing, setViewing] = useState(null)

  const filtered = tab === 'All' ? alerts
    : tab === 'Active' ? alerts.filter(a => a.status === 'Active' || a.status === 'In Progress')
    : alerts.filter(a => a.status === 'Resolved')

  const thStyle = {
    padding: 'var(--space-2) var(--space-4)', textAlign: 'left',
    fontSize: 'var(--type-label-semibold-size)', fontWeight: 'var(--type-label-semibold-weight)',
    color: 'var(--text-body-tertiary)', whiteSpace: 'nowrap',
    borderBottom: '1px solid var(--stroke-default)', background: 'var(--surface-tertiary)',
  }
  const tdStyle = {
    padding: 'var(--space-3) var(--space-4)',
    fontSize: 'var(--type-body-regular-size)', color: 'var(--text-title-primary)',
    borderBottom: '1px solid var(--stroke-default)', verticalAlign: 'middle',
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-5)' }}>
        <h1 style={{ fontSize: 'var(--type-heading-4-size)', fontWeight: 'var(--type-heading-4-weight)' }}>Alerts</h1>
        <button style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', padding: 'var(--space-2) var(--space-4)', background: 'var(--button-primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: 'var(--type-body-semibold-size)', fontWeight: 600 }}>
          <Export size={16} /> Export Alerts
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--stroke-default)', marginBottom: 'var(--space-4)', gap: 0 }}>
        {['All', 'Active', 'Resolved'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: 'var(--space-2) var(--space-4)', background: 'none', border: 'none',
            borderBottom: t === tab ? '2px solid var(--button-primary)' : '2px solid transparent',
            color: t === tab ? 'var(--button-primary)' : 'var(--text-body-tertiary)',
            fontWeight: t === tab ? 600 : 400, fontSize: 'var(--type-body-regular-size)',
            cursor: 'pointer', marginBottom: -1,
          }}>{t}</button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: 'var(--surface-primary)', border: '1px solid var(--stroke-default)', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: 'var(--space-4)' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: 'var(--space-7)', textAlign: 'center', color: 'var(--text-body-tertiary)', fontSize: 'var(--type-body-regular-size)' }}>No alerts in this category.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Severity','Type','Timestamp','Location / Camera','User','Status','Actions'].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(alert => {
                const Icon   = SEV_ICON[alert.severity] || InformationFilled
                const color  = SEV_COLOR[alert.severity] || 'var(--status-info)'
                const st     = STATUS_STYLE[alert.status] || STATUS_STYLE['Active']
                return (
                  <tr key={alert.id} style={{ cursor: 'default' }}>
                    <td style={tdStyle}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', color, fontWeight: 600, fontSize: 'var(--type-body-regular-size)' }}>
                        <Icon size={16} /> {alert.severity}
                      </span>
                    </td>
                    <td style={tdStyle}>{alert.type}</td>
                    <td style={{ ...tdStyle, color: 'var(--text-body-tertiary)', whiteSpace: 'nowrap' }}>{fmt(alert.time)}</td>
                    <td style={{ ...tdStyle, color: 'var(--text-body-tertiary)' }}>{alert.location}</td>
                    <td style={{ ...tdStyle, color: 'var(--text-body-tertiary)' }}>{alert.person || '—'}</td>
                    <td style={tdStyle}>
                      <span style={{ background: st.bg, color: st.fg, padding: '2px 8px', borderRadius: 'var(--radius-pill)', fontSize: 11, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: st.fg }} />
                        {alert.status}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <button onClick={() => setViewing(alert)}
                        style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', padding: '3px 10px', border: '1px solid var(--stroke-default)', borderRadius: 'var(--radius-sm)', background: 'var(--surface-primary)', cursor: 'pointer', fontSize: 12, color: 'var(--text-title-primary)' }}>
                        <View size={14} /> View
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 'var(--type-label-regular-size)', color: 'var(--text-body-tertiary)' }}>
        <span>Showing 1–{filtered.length} of {filtered.length} alerts</span>
        <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
          {[1,2,3,4,5].map(p => (
            <button key={p} style={{ width: 28, height: 28, borderRadius: 'var(--radius-sm)', border: '1px solid var(--stroke-default)', background: p===1 ? 'var(--button-primary)' : 'var(--surface-primary)', color: p===1 ? '#fff' : 'var(--text-title-primary)', cursor: 'pointer', fontSize: 12 }}>{p}</button>
          ))}
        </div>
      </div>

      {/* Alert Details modal */}
      {viewing && <AlertDetails alert={viewing} onClose={() => setViewing(null)} />}
    </div>
  )
}
