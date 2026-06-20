import { Link } from 'react-router-dom';
import { activeAlerts } from '../../data/mockData';

export default function ActiveAlerts() {
  const activeCount = activeAlerts.filter(a => a.status === 'active').length;

  return (
    <div className="active-alerts">
      <div className="panel-header">
        <div className="panel-header__title">
          Active Alerts
          <span className="badge badge--active">{activeCount}</span>
        </div>
        <Link to="/alerts" className="panel-header__link">All Alerts →</Link>
      </div>
      <div className="alerts-list">
        {activeAlerts.map(alert => (
          <div key={alert.id} className="alert-row">
            <div className="alert-row__info">
              <div className="alert-row__type">{alert.type}</div>
              <div className="alert-row__location">{alert.location}</div>
              <div className="alert-row__time">{alert.time}</div>
            </div>
            {alert.status === 'active' ? (
              <span className="badge badge--active">Active</span>
            ) : (
              <span className="badge badge--resolved">Resolved</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
