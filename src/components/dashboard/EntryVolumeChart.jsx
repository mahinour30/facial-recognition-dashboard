import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { entryVolumeData } from '../../data/mockData';

export default function EntryVolumeChart() {
  return (
    <div className="chart-panel">
      <div className="panel-header">
        <span className="panel-header__title">Entry Volume by Day</span>
        <span className="panel-header__subtitle">Week ending Jun 06, 2026</span>
      </div>
      <div style={{ padding: '12px 16px 16px' }}>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={entryVolumeData} barSize={14} barGap={2} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 12, fill: '#63666a', fontFamily: 'Open Sans, sans-serif' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#63666a', fontFamily: 'Open Sans, sans-serif' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                fontSize: 12,
                border: '1px solid #e2e8f0',
                borderRadius: 0,
                fontFamily: 'Open Sans, sans-serif',
              }}
            />
            <Legend
              iconType="square"
              iconSize={10}
              wrapperStyle={{ fontSize: 12, fontFamily: 'Open Sans, sans-serif', paddingTop: 8 }}
            />
            {/* Figma colors: dark navy for employees, shades of blue for others */}
            <Bar dataKey="employees" name="Employees"  fill="#007cb0"  radius={[2, 2, 0, 0]} />
            <Bar dataKey="visitors"  name="Visitors"   fill="#4ab0d9"  radius={[2, 2, 0, 0]} />
            <Bar dataKey="outsource" name="Outsource"  fill="#89cfea"  radius={[2, 2, 0, 0]} />
            <Bar dataKey="underTest" name="Under Test" fill="#c2e7f5"  radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
