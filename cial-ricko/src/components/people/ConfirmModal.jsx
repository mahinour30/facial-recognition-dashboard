import { Information, WarningAlt, Close } from '@carbon/icons-react'
import { useState } from 'react'
import { useStore } from '../../store/useStore'

function ModalShell({ onClose, children }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'var(--surface-primary)', borderRadius: 'var(--radius-md)', width: 480, padding: 'var(--space-6)', position: 'relative', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 'var(--space-4)', right: 'var(--space-4)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-body-tertiary)', display: 'flex' }}><Close size={18} /></button>
        {children}
      </div>
    </div>
  )
}

function IconCircle({ color, bg, children }) {
  return (
    <div style={{ width: 56, height: 56, borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-4)' }}>
      <span style={{ color }}>{children}</span>
    </div>
  )
}

export function RequestConsentModal({ count, onClose, onConfirm }) {
  return (
    <ModalShell onClose={onClose}>
      <IconCircle color="var(--button-primary)" bg="var(--tag-blue-bg)"><Information size={24} /></IconCircle>
      <h2 style={{ textAlign: 'center', fontSize: 'var(--type-heading-4-size)', fontWeight: 'var(--type-heading-4-weight)', marginBottom: 'var(--space-3)' }}>Request consent</h2>
      <p style={{ textAlign: 'center', color: 'var(--text-body-tertiary)', marginBottom: 'var(--space-5)', lineHeight: 'var(--type-body-regular-line)' }}>
        This sends a consent form (MS Teams) to <strong>{count}</strong> selected {count === 1 ? 'person' : 'persons'}. They'll show as "Consent requested" until they submit.
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-3)' }}>
        <button onClick={onClose} style={{ padding: 'var(--space-2) var(--space-5)', border: '1px solid var(--stroke-default)', borderRadius: 'var(--radius-sm)', background: 'var(--surface-primary)', cursor: 'pointer', fontSize: 'var(--type-body-regular-size)' }}>Cancel</button>
        <button onClick={onConfirm} style={{ padding: 'var(--space-2) var(--space-5)', border: 'none', borderRadius: 'var(--radius-sm)', background: 'var(--button-primary)', color: 'var(--text-title-secondary)', cursor: 'pointer', fontSize: 'var(--type-body-semibold-size)', fontWeight: 'var(--type-body-semibold-weight)' }}>Send to {count}</button>
      </div>
    </ModalShell>
  )
}

export function InviteModal({ count, onClose, onConfirm }) {
  return (
    <ModalShell onClose={onClose}>
      <IconCircle color="var(--button-primary)" bg="var(--tag-blue-bg)"><Information size={24} /></IconCircle>
      <h2 style={{ textAlign: 'center', fontSize: 'var(--type-heading-4-size)', fontWeight: 'var(--type-heading-4-weight)', marginBottom: 'var(--space-3)' }}>Invite to enroll</h2>
      <p style={{ textAlign: 'center', color: 'var(--text-body-tertiary)', marginBottom: 'var(--space-5)', lineHeight: 'var(--type-body-regular-line)' }}>
        This emails <strong>{count}</strong> consented {count === 1 ? 'person' : 'persons'} to enroll with the office admin between Jun 23–27.
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-3)' }}>
        <button onClick={onClose} style={{ padding: 'var(--space-2) var(--space-5)', border: '1px solid var(--stroke-default)', borderRadius: 'var(--radius-sm)', background: 'var(--surface-primary)', cursor: 'pointer', fontSize: 'var(--type-body-regular-size)' }}>Cancel</button>
        <button onClick={onConfirm} style={{ padding: 'var(--space-2) var(--space-5)', border: 'none', borderRadius: 'var(--radius-sm)', background: 'var(--button-primary)', color: 'var(--text-title-secondary)', cursor: 'pointer', fontSize: 'var(--type-body-semibold-size)', fontWeight: 'var(--type-body-semibold-weight)' }}>Invite {count}</button>
      </div>
    </ModalShell>
  )
}

export function DeleteModal({ count, onClose, onConfirm }) {
  const [scheduled, setScheduled] = useState(false)
  return (
    <ModalShell onClose={onClose}>
      <IconCircle color="var(--status-danger)" bg="var(--tag-red-bg)"><WarningAlt size={24} /></IconCircle>
      <h2 style={{ textAlign: 'center', fontSize: 'var(--type-heading-4-size)', fontWeight: 'var(--type-heading-4-weight)', marginBottom: 'var(--space-3)' }}>Delete / offboard</h2>
      <p style={{ textAlign: 'center', color: 'var(--text-body-tertiary)', marginBottom: 'var(--space-4)', lineHeight: 'var(--type-body-regular-line)' }}>
        This permanently deletes the face vector and consent record for <strong>{count}</strong> {count === 1 ? 'user' : 'users'}. A confirmation is sent and the action is logged. This cannot be undone.
      </p>
      <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-5)', fontSize: 'var(--type-body-regular-size)', color: 'var(--text-title-primary)', cursor: 'pointer' }}>
        <input type="checkbox" checked={scheduled} onChange={e => setScheduled(e.target.checked)} /> Schedule deletion for last working day
      </label>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-3)' }}>
        <button onClick={onClose} style={{ padding: 'var(--space-2) var(--space-5)', border: '1px solid var(--stroke-default)', borderRadius: 'var(--radius-sm)', background: 'var(--surface-primary)', cursor: 'pointer', fontSize: 'var(--type-body-regular-size)' }}>Cancel</button>
        <button onClick={() => onConfirm(scheduled)} style={{ padding: 'var(--space-2) var(--space-5)', border: 'none', borderRadius: 'var(--radius-sm)', background: 'var(--status-danger)', color: '#fff', cursor: 'pointer', fontSize: 'var(--type-body-semibold-size)', fontWeight: 'var(--type-body-semibold-weight)' }}>Delete</button>
      </div>
    </ModalShell>
  )
}
