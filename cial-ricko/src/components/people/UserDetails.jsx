import { Close, SendAlt, Email, Camera, Edit, TrashCan } from '@carbon/icons-react'
import { stateBadge, consentDot } from '../../lib/tags'

function Field({ label, value, children }) {
  return (
    <div>
      <div style={{ fontSize: 'var(--type-label-regular-size)', color: 'var(--text-body-tertiary)', marginBottom: 'var(--space-1)' }}>{label}</div>
      <div style={{ fontSize: 'var(--type-body-regular-size)', color: 'var(--text-title-primary)' }}>{children || value || '—'}</div>
    </div>
  )
}

function Tag({ state }) {
  const { bg, fg } = stateBadge(state)
  return <span style={{ background: bg, color: fg, padding: '2px 8px', borderRadius: 'var(--radius-pill)', fontSize: 'var(--type-label-semibold-size)', fontWeight: 'var(--type-label-semibold-weight)' }}>{state}</span>
}

function FBtn({ onClick, icon: Icon, label, danger }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 'var(--space-1)',
      padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--radius-sm)',
      border: '1px solid ' + (danger ? 'var(--status-danger)' : 'var(--button-primary)'),
      background: 'var(--surface-primary)',
      color: danger ? 'var(--status-danger)' : 'var(--button-primary)',
      fontSize: 'var(--type-label-semibold-size)', fontWeight: 'var(--type-label-semibold-weight)',
      cursor: 'pointer',
    }}><Icon size={14} />{label}</button>
  )
}

export default function UserDetails({ person, onClose, onAction }) {
  const { state, consent, type } = person
  const isEmployee = type === 'Employee'
  const dot = consentDot(consent)

  const footerButtons = []
  if (state === 'Not Enrolled' || state === 'Consent Requested') {
    footerButtons.push({ icon: SendAlt, label: consent === 'Pending' ? 'Resend consent' : 'Request consent', act: 'requestConsent' })
    footerButtons.push({ icon: Edit, label: 'Edit info', act: 'edit' })
  } else if (state === 'Ready to enroll') {
    footerButtons.push({ icon: Email, label: 'Invite to enroll', act: 'invite' })
    footerButtons.push({ icon: Edit, label: 'Edit info', act: 'edit' })
  } else if (state === 'Awaiting Capture') {
    footerButtons.push({ icon: Camera, label: 'Enroll', act: 'enroll' })
    footerButtons.push({ icon: Edit, label: 'Edit info', act: 'edit' })
  } else if (state === 'Enrolled / Active') {
    footerButtons.push({ icon: Camera, label: 'Enroll', act: 'enroll' })
    footerButtons.push({ icon: Edit, label: 'Edit info', act: 'edit' })
    footerButtons.push({ icon: TrashCan, label: 'Delete / offboard', act: 'delete', danger: true })
  } else if (state === 'Deletion requested') {
    footerButtons.push({ icon: TrashCan, label: 'Cancel deletion', act: 'delete', danger: true })
  } else {
    footerButtons.push({ icon: Edit, label: 'Edit info', act: 'edit' })
    footerButtons.push({ icon: TrashCan, label: 'Delete / offboard', act: 'delete', danger: true })
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'var(--surface-primary)', borderRadius: 'var(--radius-md)', width: 520, boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-4) var(--space-5)', borderBottom: '1px solid var(--stroke-default)' }}>
          <h2 style={{ fontSize: 'var(--type-heading-5-size)', fontWeight: 'var(--type-heading-5-weight)' }}>User Details</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-body-tertiary)', display: 'flex' }}><Close size={18} /></button>
        </div>
        {/* Body */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', padding: 'var(--space-5)' }}>
          <Field label="User name" value={person.name} />
          <Field label="Type" value={person.type} />
          {person.subtype && <Field label="Sub-type" value={person.subtype} />}
          {!isEmployee && person.expiry && <Field label="Expiry Date" value={person.expiry} />}
          <Field label="Consent">
            <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: dot, flexShrink: 0 }} />
              {consent}
            </span>
          </Field>
          <Field label="Status"><Tag state={state} /></Field>
          <Field label="Consent Form Signed" value="V.2" />
          <Field label="Signed on" value="12 Jun 2026, 09:14" />
        </div>
        {/* Footer */}
        <div style={{ display: 'flex', gap: 'var(--space-3)', padding: 'var(--space-4) var(--space-5)', borderTop: '1px solid var(--stroke-default)' }}>
          {footerButtons.map(b => <FBtn key={b.act} icon={b.icon} label={b.label} danger={b.danger} onClick={() => { onAction(b.act, [person.id]); onClose() }} />)}
        </div>
      </div>
    </div>
  )
}
