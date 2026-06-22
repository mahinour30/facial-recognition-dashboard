import { useStore } from '../../store/useStore'
export default function Toast() {
  const toast = useStore(s => s.ui.toast)
  if (!toast) return null
  return (
    <div style={{
      position: 'fixed', bottom: 'var(--space-5)', right: 'var(--space-5)',
      background: 'var(--surface-quaternary)', color: 'var(--text-title-secondary)',
      padding: 'var(--space-3) var(--space-5)', borderRadius: 'var(--radius-md)',
      fontSize: 'var(--type-body-regular-size)', zIndex: 9999,
      boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
    }}>{toast}</div>
  )
}
