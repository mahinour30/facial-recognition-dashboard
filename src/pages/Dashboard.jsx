import { Users, AlertTriangle, UserCheck, Building2 } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import LiveCameraFeed from '../components/dashboard/LiveCameraFeed';
import ActiveAlerts from '../components/dashboard/ActiveAlerts';
import EntryVolumeChart from '../components/dashboard/EntryVolumeChart';
import RecentActivity from '../components/dashboard/RecentActivity';

const stats = [
  { label: 'Total Entries Today', value: '1,284', delta: '+12%', deltaLabel: 'vs yesterday', icon: Users },
  { label: 'Active Alerts', value: '3', delta: '+2', deltaLabel: 'in last 4 minutes', icon: AlertTriangle },
  { label: 'Visitors Today', value: '47', delta: '+6', deltaLabel: 'vs average', icon: UserCheck },
  { label: 'Current Occupancy', value: '423', delta: '-26%', deltaLabel: 'less than Thursday', icon: Building2 },
];

export default function Dashboard() {
  return (
    <div className="page">
      <h1 className="page-title">Dashboard</h1>
      <div className="stats-grid">
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>
      <div className="dashboard-main">
        <div className="dashboard-left">
          <LiveCameraFeed />
          <EntryVolumeChart />
        </div>
        <div className="dashboard-right">
          <ActiveAlerts />
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
