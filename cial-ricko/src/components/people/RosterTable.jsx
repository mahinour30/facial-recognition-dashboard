import { useState, useRef } from 'react'
import { Search, Filter, Add, OverflowMenuVertical, ChevronDown, ChevronUp } from '@carbon/icons-react'
import { useStore } from '../../store/useStore'
import { getActions } from '../../lib/actions'
import { stateBadge, consentDot } from '../../lib/tags'
import RowMenu from './RowMenu'
import BulkBar from './BulkBar'

function Avatar({ name }) {
  return (
    <div style={{
      width: 28, height: 28, borderRadius: '50%',
      background: 'var(--button-primary)', color: 'var(--text-title-secondary)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 'var(--type-label-semibold-size)', fontWeight: 'var(--type-label-semibold-weight)',
      flexShrink: 0,
    }}>{(name || '?').charAt(0)}</div>
  )
}

function Tag({ state }) {
  const { bg, fg } = stateBadge(state)
  return (
    <span style={{
      background: bg, color: fg, padding: '2px 8px',
      borderRadius: 'var(--radius-pill)', fontSize: 'var(--type-label-semibold-size)',
      fontWeight: 'var(--type-label-semibold-weight)', whiteSpace: 'nowrap',
    }}>{state}</span>
  )
}

function ConsentCell({ consent }) {
  const dot = consentDot(consent)
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', fontSize: 'var(--type-body-regular-size)', color: 'var(--text-title-primary)' }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: dot, flexShrink: 0 }} />
      {consent || '—'}
    </span>
  )
}

export default function RosterTable({ onAddUser, onViewPerson, onAction }) {
  const people = useStore(s => s.people)
  const selected = useStore(s => s.ui.selectedRows)
  const setSelectedRows = useStore(s => s.setSelectedRows)
  const [search, setSearch] = useState('')
  const [openMenuId, setOpenMenuId] = useState(null)
  const [coverFilter, setCoverFilter] = useState(null)
  const PAGE_SIZE = 9

  const filtered = people.filter(p => {
    const q = search.toLowerCase()
    const matchSearch = !q || p.name.toLowerCase().includes(q) || (p.type || '').toLowerCase().includes(q)
    if (!matchSearch) return false
    if (!coverFilter) return true
    if (coverFilter === 'consented') return p.consent === 'Consented' && p.type === 'Employee'
    if (coverFilter === 'pending') return p.consent === 'Pending' && p.type === 'Employee'
    if (coverFilter === 'declined') return p.consent === 'Declined' && p.type === 'Employee'
    if (coverFilter === 'enrolled') return p.state === 'Enrolled / Active' && p.type === 'Employee'
    if (coverFilter === 'awaiting') return p.state === 'Awaiting Capture' && p.type === 'Employee'
    return true
  })

  const toggleAll = () => setSelectedRows(selected.length === filtered.length ? [] : filtered.map(p => p.id))
  const toggleRow = id => setSelectedRows(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id])

  const thStyle = {
    padding: 'var(--space-2) var(--space-4)', textAlign: 'left',
    fontSize: 'var(--type-label-semibold-size)', fontWeight: 'var(--type-label-semibold-weight)',
    color: 'var(--text-body-tertiary)', whiteSpace: 'nowrap',
    borderBottom: '1px solid var(--stroke-default)',
    background: 'var(--surface-tertiary)',
  }
  const tdStyle = {
    padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--type-body-regular-size)',
    color: 'var(--text-title-primary)', borderBottom: '1px solid var(--stroke-default)',
    verticalAlign: 'middle',
  }

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
          <Search size={16} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-body-tertiary)', pointerEvents: 'none' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…"
            style={{ width: '100%', padding: 'var(--space-2) var(--space-2) var(--space-2) 34px', border: '1px solid var(--stroke-default)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--type-body-regular-size)', background: 'var(--surface-primary)', color: 'var(--text-title-primary)', outline: 'none' }} />
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', padding: 'var(--space-2) var(--space-3)', border: '1px solid var(--stroke-default)', borderRadius: 'var(--radius-sm)', background: 'var(--surface-primary)', fontSize: 'var(--type-body-regular-size)', cursor: 'pointer', color: 'var(--text-title-primary)' }}>
          <Filter size={16} /> Filter
        </button>
        {coverFilter && (
          <button onClick={() => setCoverFilter(null)} style={{ fontSize: 'var(--type-label-regular-size)', color: 'var(--link-primary)', background: 'none', border: 'none', cursor: 'pointer' }}>
            Clear filter ×
          </button>
        )}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 'var(--space-2)' }}>
          <button onClick={onAddUser} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', padding: 'var(--space-2) var(--space-3)', background: 'var(--button-primary)', color: 'var(--text-title-secondary)', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: 'var(--type-body-semibold-size)', fontWeight: 'var(--type-body-semibold-weight)', cursor: 'pointer' }}>
            <Add size={16} /> Add Users
          </button>
        </div>
      </div>

      {/* Bulk bar */}
      {selected.length > 0 && <BulkBar onAction={onAction} />}

      {/* Table */}
      <div style={{ background: 'var(--surface-primary)', border: '1px solid var(--stroke-default)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ ...thStyle, width: 40 }}><input type="checkbox" onChange={toggleAll} checked={selected.length === filtered.length && filtered.length > 0} /></th>
              <th style={thStyle}>User</th>
              <th style={thStyle}>Type</th>
              <th style={thStyle}>Employee ID</th>
              <th style={thStyle}>Offering</th>
              <th style={thStyle}>Consent</th>
              <th style={thStyle}>State</th>
              <th style={{ ...thStyle, width: 40 }}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, PAGE_SIZE).map(person => (
              <tr key={person.id} style={{ background: selected.includes(person.id) ? 'var(--tag-blue-bg)' : 'transparent', cursor: 'default' }}>
                <td style={{ ...tdStyle, width: 40 }}><input type="checkbox" checked={selected.includes(person.id)} onChange={() => toggleRow(person.id)} /></td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <Avatar name={person.name} />
                    <span style={{ fontWeight: 'var(--type-body-semibold-weight)' }}>{person.name}</span>
                  </div>
                </td>
                <td style={tdStyle}>
                  <div>{person.type}</div>
                  {person.subtype && <div style={{ fontSize: 'var(--type-label-regular-size)', color: 'var(--text-body-tertiary)' }}>{person.subtype}</div>}
                </td>
                <td style={{ ...tdStyle, color: 'var(--text-body-tertiary)' }}>{person.employeeId || '—'}</td>
                <td style={{ ...tdStyle, color: 'var(--text-body-tertiary)' }}>{person.offering || '—'}</td>
                <td style={tdStyle}><ConsentCell consent={person.consent} /></td>
                <td style={tdStyle}><Tag state={person.state} /></td>
                <td style={{ ...tdStyle, width: 40, position: 'relative' }}>
                  <button onClick={() => setOpenMenuId(openMenuId === person.id ? null : person.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-body-tertiary)', display: 'flex', alignItems: 'center', padding: 'var(--space-1)', borderRadius: 'var(--radius-sm)' }}>
                    <OverflowMenuVertical size={16} />
                  </button>
                  {openMenuId === person.id && (
                    <RowMenu person={person} actions={getActions(person)}
                      onClose={() => setOpenMenuId(null)}
                      onView={() => onViewPerson(person)}
                      onAction={(act) => onAction(act, [person.id])} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3) 0', fontSize: 'var(--type-label-regular-size)', color: 'var(--text-body-tertiary)' }}>
        <span>Showing 1–{Math.min(PAGE_SIZE, filtered.length)} of {filtered.length} users</span>
        <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
          {[1,2,3,4,5].map(p => (
            <button key={p} style={{ width: 28, height: 28, borderRadius: 'var(--radius-sm)', border: '1px solid var(--stroke-default)', background: p === 1 ? 'var(--button-primary)' : 'var(--surface-primary)', color: p === 1 ? 'var(--text-title-secondary)' : 'var(--text-title-primary)', cursor: 'pointer', fontSize: 'var(--type-label-regular-size)' }}>{p}</button>
          ))}
        </div>
      </div>
    </div>
  )
}
