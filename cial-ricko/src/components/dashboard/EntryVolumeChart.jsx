import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { ENTRY_VOLUME } from '../../data/dashboardData'
import { Renew } from '@carbon/icons-react'

export default function EntryVolumeChart() {
  return (
    <div style={{ background: 'var(--surface-primary)', border: '1px solid var(--stroke-default)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', paddingBottom: 'var(--space-2)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
        <span style={{ fontSize: 'var(--type-body-semibold-size)', fontWeight: 600 }}>Entry Volume by Day</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--type-label-regular-size)', color: 'var(--text-body-tertiary)' }}>
          <Renew size={12} /> Week ending Jun 06, 2026
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={ENTRY_VOLUME} barSize={14} barCategoryGap="25%">
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--stroke-default)" />
          <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--text-body-tertiary)' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: 'var(--text-body-tertiary)' }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ borderRadius: 'var(--radius-sm)', border: '1px solid var(--stroke-default)', fontSize: 12 }} />
          <Legend iconType="square" iconSize={10} wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
          <Bar dataKey="employees"    name="Employees"    fill="var(--chart-employees)"    stackId="a" radius={[0,0,0,0]} />
          <Bar dataKey="visitors"     name="Visitors"     fill="var(--chart-visitors)"     stackId="a" radius={[0,0,0,0]} />
          <Bar dataKey="outsource"    name="Outsource"    fill="var(--chart-outsource)"    stackId="a" radius={[0,0,0,0]} />
          <Bar dataKey="unidentified" name="Unidentified" fill="var(--chart-unidentified)" stackId="a" radius={[2,2,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
