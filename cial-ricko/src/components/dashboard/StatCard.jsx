import { ArrowUp, ArrowDown } from '@carbon/icons-react'

export default function StatCard({ label, value, delta, deltaLabel, icon: Icon, iconSize = 20 }) {
  const up = delta >= 0
  return (
    <div style={{
      background: 'var(--surface-primary)',
      border: '1px solid var(--stroke-default)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-4)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-2)' }}>
        <span style={{ fontSize: 'var(--type-label-regular-size)', color: 'var(--text-body-tertiary)' }}>{label}</span>
        <Icon size={iconSize} style={{ color: 'var(--text-body-tertiary)' }} />
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-title-primary)', marginBottom: 'var(--space-1)', lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', fontSize: 'var(--type-label-regular-size)' }}>
        {up ? <ArrowUp size={12} style={{ color: 'var(--status-success)' }} /> : <ArrowDown size={12} style={{ color: 'var(--status-danger)' }} />}
        <span style={{ color: up ? 'var(--status-success)' : 'var(--status-danger)', fontWeight: 600 }}>
          {up ? '+' : ''}{delta}%
        </span>
        <span style={{ color: 'var(--text-body-tertiary)' }}>{deltaLabel}</span>
      </div>
    </div>
  )
}
