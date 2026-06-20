import { useState } from 'react';
import { Download, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { alerts } from '../data/mockData';

const severityClass = {
  'Critical': 'severity--critical',
  'Very Critical': 'severity--very-critical',
  'Warning': 'severity--warning',
  'Info': 'severity--info',
};

const statusClass = {
  'Active': 'badge--red-solid',
  'In Progress': 'badge--blue-solid',
  'Resolved': 'badge--green-solid',
};

export default function Alerts() {
  const [activeTab, setActiveTab] = useState('All');

  const filtered = activeTab === 'All'
    ? alerts
    : alerts.filter(a => a.status === activeTab || (activeTab === 'Resolved' && a.status === 'Resolved'));

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
            className={`tab ${activeTab === tab ? 'tab--active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Severity</th>
              <th>Type <ChevronUp size={12} className="inline" /></th>
              <th>Timestamp <ChevronUp size={12} className="inline" /></th>
              <th>Location / Camera <ChevronUp size={12} className="inline" /></th>
              <th>User</th>
              <th>Type <ChevronUp size={12} className="inline" /></th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(alert => (
              <tr key={alert.id}>
                <td><span className={`severity ${severityClass[alert.severity] || ''}`}>{alert.severity}</span></td>
                <td>{alert.type}</td>
                <td>{alert.timestamp}</td>
                <td>{alert.location}</td>
                <td>{alert.user || '—'}</td>
                <td>{alert.userType || '—'}</td>
                <td><span className={`badge ${statusClass[alert.status] || ''}`}>{alert.status}</span></td>
                <td><button className="btn btn--sm btn--outline">View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        <span className="pagination__info">Showing 1–9 of 41 alerts</span>
        <div className="pagination__controls">
          <button className="page-btn"><ChevronLeft size={14} /></button>
          {[1, 2, 3, 4, 5].map(p => (
            <button key={p} className={`page-btn ${p === 1 ? 'page-btn--active' : ''}`}>{p}</button>
          ))}
          <button className="page-btn"><ChevronRight size={14} /></button>
        </div>
      </div>
    </div>
  );
}
