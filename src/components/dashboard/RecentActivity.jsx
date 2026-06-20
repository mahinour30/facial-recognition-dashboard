import { Link } from 'react-router-dom';
import { recentActivity } from '../../data/mockData';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const statusIcon = {
  confirmed: <CheckCircle size={16} color="#22c55e" />,
  warning: <AlertCircle size={16} color="#f59e0b" />,
  error: <XCircle size={16} color="#ef4444" />,
  flagged: <AlertCircle size={16} color="#f59e0b" />,
};

const eventClass = {
  'Entry Confirmed': 'badge--green',
  'Exit Confirmed': 'badge--green',
  'Re-entry without exit': 'badge--orange',
};

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
            <div className="activity-row__icon">{statusIcon[item.status]}</div>
            <div className="activity-row__info">
              <div className="activity-row__name">{item.name}</div>
              <div className="activity-row__meta">Confidence: {item.confidence}% · {item.time}</div>
            </div>
            <span className={`badge ${eventClass[item.event] || 'badge--gray'}`}>{item.event}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
