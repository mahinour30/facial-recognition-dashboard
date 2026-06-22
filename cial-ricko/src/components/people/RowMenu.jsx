import { useEffect, useRef } from 'react'
import { Camera, SendAlt, Email, Renew, View, Edit, PauseOutline, TrashCan } from '@carbon/icons-react'

const ITEMS = [
  { key: 'enroll',          label: p => p.enrollLabel || 'Enroll',     icon: Camera,       danger: false },
  { key: 'requestConsent',  label: () => 'Request consent',             icon: SendAlt,      danger: false },
  { key: 'invite',          label: () => 'Invite to enroll',            icon: Email,        danger: false },
  { key: 'reenroll',        label: () => 'Capture re-enrollment',       icon: Renew,        danger: false },
  { key: 'view',            label: () => 'View',                        icon: View,         danger: false },
  { key: 'edit',            label: () => 'Edit info',                   icon: Edit,         danger: false },
  { key: 'suspend',         label: () => 'Suspend',                     icon: PauseOutline, danger: false, alwaysDisabled: true },
  { key: 'delete',          label: p => p.deleteLabel || 'Delete / offboard', icon: TrashCan, danger: true },
]

export default function RowMenu({ person, actions, onClose, onView, onAction }) {
  const ref = useRef(null)
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) onClose() }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [onClose])

  return (
    <div ref={ref} style={{
      position: 'absolute', right: 0, top: '100%', zIndex: 100,
      background: 'var(--surface-primary)', border: '1px solid var(--stroke-default)',
      borderRadius: 'var(--radius-md)', boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
      minWidth: 200, padding: 'var(--space-1) 0',
    }}>
      {ITEMS.map(item => {
        const enabled = actions[item.key] && !item.alwaysDisabled
        const Icon = item.icon
        const label = typeof item.label === 'function' ? item.label(actions) : item.label
        return (
          <button key={item.key}
            disabled={!enabled}
            onClick={() => { if (!enabled) return; if (item.key === 'view') { onView(); onClose() } else { onAction(item.key); onClose() } }}
            style={{
              display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
              width: '100%', padding: 'var(--space-2) var(--space-4)',
              background: 'none', border: 'none', cursor: enabled ? 'pointer' : 'not-allowed',
              fontSize: 'var(--type-body-regular-size)', textAlign: 'left',
              color: !enabled ? 'var(--state-disabled)' : item.danger ? 'var(--status-danger)' : 'var(--text-title-primary)',
              opacity: !enabled ? 0.5 : 1,
            }}>
            <Icon size={16} />{label}
          </button>
        )
      })}
    </div>
  )
}
