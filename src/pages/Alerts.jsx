import { useState } from 'react';
import { Download, ChevronsUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { alerts } from '../data/mockData';

function severityClass(sev) {
  if (sev === 'Critical')      return 'severity--critical';
  if (sev === 'Very Critical') return 'severity--very-critical';
  if (sev === 'Warning')       return 'severity--warning';
  return 'severity--info';
}

function statusBadgeClass(status) {
  if (status === 'Active')      return 'badge--active';
  if (status === 'In Progress') return 'badge--progress';
  if (status === 'Resolved')    return 'badge--resolved';
  return 'badge--gray';
}

export default function Alerts() {
  const [activeTab, setActiveTab] = useState('All');

  const filtered = activeTab === 'All'
    ? alerts
    : activeTab === 'Active'
    ? alerts.filter(a => a.status === 'Active' || a.status === 'In Progress')
    : alerts.filter(a => a.status === 'Resolved');

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Alerts</h1>
        <button className="btn btn--primary">
          <Download size={14} />
          Export Alerts
        </button>
      </div>

      <div className="tabs">
        {['All', 'Active', 'Resolved'].map(tab => (
          <button
            key={tab}
            className={`tab${activeTab === tab ? ' tab--active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
            {tab === 'All' && (
              <span style={{ marginLeft: 6, fontSize: 12, color: '#63666a' }}>
                ({alerts.length})
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Severity</th>
              <th>
                Type <ChevronsUpDown size={12} className="inline" style={{ color: '#a1a1a1' }} />
              </th>
              <th>
                Timestamp <ChevronsUpDown size={12} className="inline" style={{ color: '#a1a1a1' }} />
              </th>
              <th>
                Location / Camera <ChevronsUpDown size={12} className="inline" style={{ color: '#a1a1a1' }} />
              </th>
              <th>User</th>
              <th>User Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(alert => (
              <tr key={alert.id}>
                <td>
                  <span className={`severity ${severityClass(alert.severity)}`}>
                    {alert.severity}
                  </span>
                </td>
                <td>{alert.type}</td>
                <td style={{ color: '#53565a' }}>{alert.timestamp}</td>
                <td style={{ color: '#53565a' }}>{alert.location}</td>
                <td>{alert.user || <span style={{ color: '#a1a1a1' }}>—</span>}</td>
                <td>{alert.userType || <span style={{ color: '#a1a1a1' }}>—</span>}</td>
                <td>
                  <span className={`badge ${statusBadgeClass(alert.status)}`}>
                    <span style={{
                      width: 6, height: 6, borderRadius: 0'50%',
                      background: 'currentColor', display: 'inline-block',
                    }} />
                    {alert.status}
                  </span>
                </td>
                <td>
                  <button className="btn btn--sm btn--outline">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <span className="pagination__info">
          Showing 1–{filtered.length} of {alerts.length} alerts
        </span>
        <div className="pagination__controls">
          <button className="page-btn"><ChevronLeft size={14} /></button>
          {[1, 2, 3, 4, 5].map(p => (
            <button key={p} className={`page-btn${p === 1 ? ' page-btn--active' : ''}`}>
              {p}
            </button>
          ))}
          <button className="page-btn"><ChevronRight size={14} /></button>
        </div>
      </div>
    </div>
  );
}
