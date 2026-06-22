import { User, Settings, ChevronDown } from '@carbon/icons-react'

export default function Header() {
  return (
    <header style={{
      background: 'var(--surface-secondary)',
      height: 48,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 var(--space-5)',
      flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <span style={{ color: 'var(--text-title-secondary)', fontWeight: 700, fontSize: 'var(--font-size-2)', letterSpacing: -0.5 }}>Deloitte.</span>
        <span style={{ color: 'var(--state-disabled)', fontSize: 'var(--font-size-2)' }}>|</span>
        <span style={{ color: 'var(--text-body-secondary)', fontSize: 'var(--type-body-regular-size)' }}>Facial Recognition</span>
      </div>
      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
        {[User, Settings].map((Icon, i) => (
          <button key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#222', border: '1px solid #333', color: 'var(--text-body-secondary)', padding: '4px 10px', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>
            <Icon size={16} /><ChevronDown size={14} />
          </button>
        ))}
      </div>
    </header>
  )
}
