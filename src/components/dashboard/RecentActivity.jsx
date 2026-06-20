import { Link } from 'react-router-dom';
import { recentActivity } from '../../data/mockData';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

function StatusIcon({ status }) {
  if (status === 'confirmed') return <CheckCircle2 size={16} color="#26890d" />;
  if (status === 'error')     return <XCircle      size={16} color="#da291c" />;
  return                             <AlertCircle  size={16} color="#ed8b00" />;
}

function resultBadgeClass(event) {
  if (event === 'Entry Confirmed') return 'badge--entry-confirmed';
  if (event === 'Exit Confirmed')  return 'badge--exit-confirmed';
  if (event === 'Re-entry without exit') return 'badge--re-entry';
  return 'badge--gray';
}

export default function RecentActivity() {
  return (
    <div className="recent-activity">
      <div className="panel-header">
        <span className="panel-header__title">Recent Activity</span>
        <Link to="/access-log" className="panel-header__link">View All →</Link>
      </div>
      <div className="activity-list">
        {recentActivity.map(item => (
          <div key={item.id} className="activity-row">
            <StatusIcon status={item.status} />
            <div className="activity-row__info">
              <div className="activity-row__name">{item.name}</div>
              <div className="activity-row__meta">
                Confidence: {item.confidence}% · {item.time}
              </div>
            </div>
            <span className={`badge ${resultBadgeClass(item.event)}`}>
              {item.event}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
