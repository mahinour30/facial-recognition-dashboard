import { useEffect, useState } from 'react'
import { Login, Warning, UserMultiple, Group, Information } from '@carbon/icons-react'
import StatCard from '../components/dashboard/StatCard'
import CameraFeed from '../components/dashboard/CameraFeed'
import ActiveAlertsDash from '../components/dashboard/ActiveAlertsDash'
import EntryVolumeChart from '../components/dashboard/EntryVolumeChart'
import RecentActivity from '../components/dashboard/RecentActivity'
import { useStore } from '../store/useStore'

const STATS = [
  { label: 'Total Entries Today',  value: '1,284', delta:  12, deltaLabel: 'vs yesterday',      icon: Login       },
  { label: 'Active Alerts',        value: '3',      delta: -15, deltaLabel: 'in last 4 minutes', icon: Warning     },
  { label: 'Visitors Today',       value: '47',     delta:   6, deltaLabel: 'vs average',        icon: UserMultiple },
  { label: 'Current Occupancy',    value: '423',    delta: -26, deltaLabel: 'vs last Thursday',  icon: Group       },
]

export default function Dashboard() {
  const alerts = useStore(s => s.alerts)
  const [tick, setTick] = useState(0)

  // Auto-refresh mock every 5s
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 5000)
    return () => clearInterval(id)
  }, [])

  return (
    <div>
      <h1 style={{ fontSize: 'var(--type-heading-4-size)', fontWeight: 'var(--type-heading-4-weight)', marginBottom: 'var(--space-5)' }}>Dashboard</h1>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
        {STATS.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Main 2-col layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
        {/* Left */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <CameraFeed />
          <EntryVolumeChart />
        </div>
        {/* Right */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <ActiveAlertsDash />
          <RecentActivity />
        </div>
      </div>

      {/* Info banner */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-3) var(--space-4)', background: 'var(--tag-blue-bg)', border: '1px solid var(--tag-blue-fg)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--type-label-regular-size)', color: 'var(--tag-blue-fg)' }}>
        <Information size={16} style={{ flexShrink: 0 }} />
        Live metrics reflect enrolled, consented users only. See coverage in <a href="/people" style={{ color: 'var(--link-primary)', marginLeft: 4 }}>People & Access</a>.
      </div>
    </div>
  )
}
