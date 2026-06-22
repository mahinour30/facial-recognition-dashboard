import { Close, SendAlt, Email, TrashCan } from '@carbon/icons-react'
import { useStore } from '../../store/useStore'

export default function BulkBar({ onAction }) {
  const selected = useStore(s => s.ui.selectedRows)
  const people = useStore(s => s.people)
  const setSelectedRows = useStore(s => s.setSelectedRows)

  const selPeople = people.filter(p => selected.includes(p.id))
  const canConsent = selPeople.some(p => p.consent === 'Not Sent' || p.consent === 'Pending')
  const canInvite  = selPeople.some(p => p.consent === 'Consented' && p.state === 'Ready to enroll')

  const btnStyle = (danger) => ({
    display: 'flex', alignItems: 'center', gap: 'var(--space-1)',
    padding: 'var(--space-1) var(--space-3)',
    border: '1px solid ' + (danger ? 'var(--status-danger)' : 'var(--stroke-default)'),
    borderRadius: 'var(--radius-sm)', background: danger ? 'var(--tag-red-bg)' : 'var(--surface-primary)',
    color: danger ? 'var(--status-danger)' : 'var(--text-title-primary)',
    fontSize: 'var(--type-label-semibold-size)', fontWeight: 'var(--type-label-semibold-weight)',
    cursor: 'pointer',
  })

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
      padding: 'var(--space-2) var(--space-4)', marginBottom: 'var(--space-3)',
      background: 'var(--tag-blue-bg)', border: '1px solid var(--tag-blue-fg)',
      borderRadius: 'var(--radius-sm)',
    }}>
      <span style={{ fontSize: 'var(--type-body-semibold-size)', fontWeight: 'var(--type-body-semibold-weight)', color: 'var(--tag-blue-fg)', marginRight: 'var(--space-1)' }}>
        {selected.length} Users Selected
      </span>
      {canConsent && <button style={btnStyle(false)} onClick={() => onAction('requestConsent', selected)}><SendAlt size={14} /> Request consent</button>}
      {canInvite  && <button style={btnStyle(false)} onClick={() => onAction('invite', selected)}><Email size={14} /> Invite to enroll</button>}
      <button style={btnStyle(true)} onClick={() => onAction('delete', selected)}><TrashCan size={14} /> Delete / offboard</button>
      <button onClick={() => setSelectedRows([])} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-body-tertiary)', display: 'flex' }}><Close size={16} /></button>
    </div>
  )
}
