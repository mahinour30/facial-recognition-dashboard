import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { entryVolumeData } from '../../data/mockData';

export default function EntryVolumeChart() {
  return (
    <div className="chart-panel">
      <div className="panel-header">
        <span className="panel-header__title">Entry Volume by Day</span>
        <span className="panel-header__subtitle">Week ending Jun 06, 2026 →</span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={entryVolumeData} barSize={16} barGap={2}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
          <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#666' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#666' }} axisLine={false} tickLine={false} />
          <Tooltip />
          <Legend iconType="square" iconSize={10} wrapperStyle={{ fontSize: 11 }} />
          <Bar dataKey="employees" name="Employees" fill="#1a3a5c" radius={[2, 2, 0, 0]} />
          <Bar dataKey="visitors" name="Visitors" fill="#4a90c4" radius={[2, 2, 0, 0]} />
          <Bar dataKey="outsource" name="Outsource" fill="#7ab3d4" radius={[2, 2, 0, 0]} />
          <Bar dataKey="underTest" name="Under Test" fill="#b0cfe4" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
