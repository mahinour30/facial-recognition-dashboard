import { useStore } from '../../store/useStore'

function Dot({ color }) {
  return <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block', flexShrink: 0 }} />
}

function SegmentedBar({ segments }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0)
  return (
    <div style={{ display: 'flex', width: '100%', height: 12, overflow: 'hidden', marginBottom: 'var(--space-2)' }}>
      {segments.map((seg, i) => (
        <div key={i} style={{ width: (seg.value / total * 100) + '%', background: seg.color, transition: 'width 0.3s', flexShrink: 0 }} />
      ))}
    </div>
  )
}

function LegendItem({ color, label, onClick }) {
  return (
    <span
      onClick={onClick}
      style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', fontSize: 'var(--type-label-regular-size)', color: 'var(--text-title-primary)', cursor: onClick ? 'pointer' : 'default', whiteSpace: 'nowrap' }}
    >
      <Dot color={color} /> {label}
    </span>
  )
}

export default function CoverageCards({ onFilter }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>

      {/* Consented Employees */}
      <div style={{ background: 'var(--surface-primary)', border: '1px solid var(--stroke-default)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
          <span style={{ fontSize: 'var(--type-body-semibold-size)', fontWeight: 'var(--type-body-semibold-weight)' }}>Consented Employees</span>
          <span style={{ fontSize: 'var(--type-body-semibold-size)', fontWeight: 'var(--type-body-semibold-weight)' }}>84%</span>
        </div>

        <SegmentedBar segments={[
          { value: 712, color: 'var(--color-primary-accessible-green)' },
          { value: 90,  color: 'var(--color-primary-accessible-blue)' },
          { value: 10,  color: 'var(--color-functional-colors-red)' },
          { value: 38,  color: 'var(--color-secondary-gray-cool-gray-2)' },
        ]} />

        {/* Total below bar */}
        <div style={{ fontSize: 'var(--type-label-regular-size)', color: 'var(--text-body-tertiary)', marginBottom: 'var(--space-2)' }}>
          Total Employees is 850
        </div>

        {/* Legend below total */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          <LegendItem color="var(--color-primary-accessible-green)" label="Consented: 712"       onClick={() => onFilter('consented')} />
          <LegendItem color="var(--color-primary-accessible-blue)"  label="Awaiting Response: 90" onClick={() => onFilter('pending')} />
          <LegendItem color="var(--color-functional-colors-red)"    label="Declined: 10"          onClick={() => onFilter('declined')} />
          <LegendItem color="var(--color-secondary-gray-cool-gray-2)" label="Remaining: 38" />
        </div>
      </div>

      {/* Enrolled Employees */}
      <div style={{ background: 'var(--surface-primary)', border: '1px solid var(--stroke-default)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
          <span style={{ fontSize: 'var(--type-body-semibold-size)', fontWeight: 'var(--type-body-semibold-weight)' }}>Enrolled Employees</span>
          <span style={{ fontSize: 'var(--type-body-semibold-size)', fontWeight: 'var(--type-body-semibold-weight)' }}>96%</span>
        </div>

        <SegmentedBar segments={[
          { value: 681, color: 'var(--color-primary-accessible-green)' },
          { value: 23,  color: 'var(--color-primary-accessible-blue)' },
          { value: 8,   color: 'var(--color-secondary-gray-cool-gray-2)' },
        ]} />

        {/* Total below bar */}
        <div style={{ fontSize: 'var(--type-label-regular-size)', color: 'var(--text-body-tertiary)', marginBottom: 'var(--space-2)' }}>
          Total consented is 712
        </div>

        {/* Legend below total */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          <LegendItem color="var(--color-primary-accessible-green)" label="Enrolled: 681"          onClick={() => onFilter('enrolled')} />
          <LegendItem color="var(--color-primary-accessible-blue)"  label="Awaiting Response: 23"  onClick={() => onFilter('awaiting')} />
          <LegendItem color="var(--color-secondary-gray-cool-gray-2)" label="Remaining: 8" />
        </div>
      </div>

    </div>
  )
}
