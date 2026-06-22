import { useStore } from '../../store/useStore'

function ProgressBar({ segments }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0)
  return (
    <div style={{ height: 8, borderRadius: 'var(--radius-pill)', background: 'var(--stroke-default)', overflow: 'hidden', display: 'flex', marginBottom: 'var(--space-3)' }}>
      {segments.map((seg, i) => (
        <div key={i} style={{ width: (seg.value / total * 100) + '%', background: seg.color, transition: 'width 0.3s' }} />
      ))}
    </div>
  )
}

export default function CoverageCards({ onFilter }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
      {/* Consented */}
      <div style={{ background: 'var(--surface-primary)', border: '1px solid var(--stroke-default)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
          <span style={{ fontSize: 'var(--type-body-semibold-size)', fontWeight: 'var(--type-body-semibold-weight)' }}>Consented Employees</span>
          <span style={{ fontSize: 'var(--type-body-semibold-size)', fontWeight: 'var(--type-body-semibold-weight)' }}>84%</span>
        </div>
        <ProgressBar segments={[
          { value: 712, color: 'var(--chart-employees)' },
          { value: 90, color: 'var(--status-warning)' },
          { value: 10, color: 'var(--status-danger)' },
          { value: 38, color: 'var(--stroke-default)' },
        ]} />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', fontSize: 'var(--type-label-regular-size)', color: 'var(--text-body-tertiary)' }}>
          <span>Total Employees: 850</span>
          <span style={{ color: 'var(--status-success)', cursor: 'pointer' }} onClick={() => onFilter('consented')}>● Consented: 712</span>
          <span style={{ color: 'var(--status-warning)', cursor: 'pointer' }} onClick={() => onFilter('pending')}>● Awaiting Response: 90</span>
          <span style={{ color: 'var(--status-danger)', cursor: 'pointer' }} onClick={() => onFilter('declined')}>● Declined: 10</span>
          <span>Remaining: 38</span>
        </div>
      </div>

      {/* Enrolled */}
      <div style={{ background: 'var(--surface-primary)', border: '1px solid var(--stroke-default)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
          <span style={{ fontSize: 'var(--type-body-semibold-size)', fontWeight: 'var(--type-body-semibold-weight)' }}>Enrolled Employees</span>
          <span style={{ fontSize: 'var(--type-body-semibold-size)', fontWeight: 'var(--type-body-semibold-weight)' }}>96%</span>
        </div>
        <ProgressBar segments={[
          { value: 681, color: 'var(--chart-employees)' },
          { value: 23, color: 'var(--status-warning)' },
          { value: 8, color: 'var(--stroke-default)' },
        ]} />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', fontSize: 'var(--type-label-regular-size)', color: 'var(--text-body-tertiary)' }}>
          <span>Of 712 consented</span>
          <span style={{ color: 'var(--status-success)', cursor: 'pointer' }} onClick={() => onFilter('enrolled')}>● Enrolled: 681</span>
          <span style={{ color: 'var(--status-warning)', cursor: 'pointer' }} onClick={() => onFilter('awaiting')}>● Awaiting Response: 23</span>
          <span>Remaining: 8</span>
        </div>
      </div>
    </div>
  )
}
