import { useState } from 'react'
import { Export, Search, Filter, Login, Logout, WarningAlt } from '@carbon/icons-react'
import { useStore } from '../store/useStore'

const RESULT_STYLE = {
  'Entry Confirmed':       { bg: 'var(--tag-green-bg)',  fg: 'var(--tag-green-fg)',  Icon: Login       },
  'Exit Confirmed':        { bg: 'var(--tag-green-bg)',  fg: 'var(--tag-green-fg)',  Icon: Logout      },
  'Re-entry without exit': { bg: 'var(--tag-orange-bg)', fg: 'var(--tag-orange-fg)', Icon: WarningAlt  },
  'Re-exit without entry': { bg: 'var(--tag-orange-bg)', fg: 'var(--tag-orange-fg)', Icon: WarningAlt  },
  'Flagged':               { bg: 'var(--tag-red-bg)',    fg: 'var(--tag-red-fg)',    Icon: WarningAlt  },
}

function ConfidenceBar({ value }) {
  const color = value >= 80 ? 'var(--status-success)' : value >= 50 ? 'var(--status-warning)' : 'var(--status-danger)'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
      <div style={{ width: 64, height: 5, background: 'var(--stroke-default)', borderRadius: 'var(--radius-pill)', overflow: 'hidden' }}>
        <div style={{ width: value + '%', height: '100%', background: color, borderRadius: 'var(--radius-pill)' }} />
      </div>
      <span style={{ fontSize: 'var(--type-label-semibold-size)', fontWeight: 600, color }}>{value}%</span>
    </div>
  )
}

function fmt(iso) {
  const d = new globalThis.Date(iso)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function AccessLog() {
  const accessLog = useStore(s => s.accessLog)
  const [search, setSearch] = useState('')

  const filtered = accessLog.filter(row => {
    const q = search.toLowerCase()
    return !q || row.name.toLowerCase().includes(q) || (row.camera || '').toLowerCase().includes(q) || (row.type || '').toLowerCase().includes(q)
  })

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
        <h1 style={{ fontSize: 'var(--type-heading-4-size)', fontWeight: 'var(--type-heading-4-weight)' }}>Access Log</h1>
        <button style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', padding: 'var(--space-2) var(--space-4)', background: 'var(--button-primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: 'var(--type-body-semibold-size)', fontWeight: 600 }}>
          <Export size={16} /> Export Access Logs
        </button>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
          <Search size={16} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-body-tertiary)', pointerEvents: 'none' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, camera, or type…"
            style={{ width: '100%', padding: 'var(--space-2) var(--space-2) var(--space-2) 34px', border: '1px solid var(--stroke-default)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--type-body-regular-size)', background: 'var(--surface-primary)', color: 'var(--text-title-primary)', outline: 'none' }} />
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', padding: 'var(--space-2) var(--space-3)', border: '1px solid var(--stroke-default)', borderRadius: 'var(--radius-sm)', background: 'var(--surface-primary)', fontSize: 'var(--type-body-regular-size)', cursor: 'pointer', color: 'var(--text-title-primary)' }}>
          <Filter size={16} /> Filter
        </button>
      </div>

      {/* Table */}
      <div style={{ background: 'var(--surface-primary)', border: '1px solid var(--stroke-default)', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: 'var(--space-4)' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: 'var(--space-7)', textAlign: 'center', color: 'var(--text-body-tertiary)', fontSize: 'var(--type-body-regular-size)' }}>No entries match your search.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Timestamp','Location / Camera','User','Type','Confidence','Result'].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(row => {
                const rs = RESULT_STYLE[row.result] || RESULT_STYLE['Flagged']
                const ResIcon = rs.Icon
                const isUnknown = !row.type
                return (
                  <tr key={row.id}>
                    <td style={{ ...tdStyle, whiteSpace: 'nowrap', color: 'var(--text-body-tertiary)' }}>{fmt(row.time)}</td>
                    <td style={{ ...tdStyle, color: 'var(--text-body-tertiary)' }}>{row.camera}</td>
                    <td style={{ ...tdStyle, fontWeight: isUnknown ? 400 : 600, color: isUnknown ? 'var(--text-body-tertiary)' : 'var(--text-title-primary)' }}>
                      {row.name}
                      {isUnknown && <span style={{ marginLeft: 4, fontSize: 11, background: 'var(--tag-red-bg)', color: 'var(--tag-red-fg)', borderRadius: 'var(--radius-pill)', padding: '1px 6px', fontWeight: 600 }}>Unidentified</span>}
                    </td>
                    <td style={{ ...tdStyle, color: 'var(--text-body-tertiary)' }}>{row.type || '—'}</td>
                    <td style={tdStyle}><ConfidenceBar value={row.confidence} /></td>
                    <td style={tdStyle}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)', background: rs.bg, color: rs.fg, padding: '2px 8px', borderRadius: 'var(--radius-pill)', fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap' }}>
                        <ResIcon size={12} /> {row.result}
                      </span>
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
        <span>Showing 1–{filtered.length} of {filtered.length} entries</span>
        <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
          {[1,2,3,4,5].map(p => (
            <button key={p} style={{ width: 28, height: 28, borderRadius: 'var(--radius-sm)', border: '1px solid var(--stroke-default)', background: p===1 ? 'var(--button-primary)' : 'var(--surface-primary)', color: p===1 ? '#fff' : 'var(--text-title-primary)', cursor: 'pointer', fontSize: 12 }}>{p}</button>
          ))}
        </div>
      </div>
    </div>
  )
}
