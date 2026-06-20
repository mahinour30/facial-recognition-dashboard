import { useState } from 'react';
import { Search, Filter, Download, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { accessLogs } from '../data/mockData';

const resultClass = {
  'Entry Confirmed': 'badge--green',
  'Exit Confirmed': 'badge--green',
  'Flagged': 'badge--red',
  'Re-exit without entry': 'badge--orange',
};

export default function AccessLog() {
  const [search, setSearch] = useState('');

  const filtered = accessLogs.filter(log =>
    log.user.toLowerCase().includes(search.toLowerCase()) ||
    log.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Access Log</h1>
        <button className="btn btn--primary">
          <Download size={14} />
          Export Access Logs
        </button>
      </div>
      <div className="toolbar">
        <div className="search-box">
          <Search size={14} className="search-box__icon" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="search-box__input"
          />
        </div>
        <button className="btn btn--outline">
          <Filter size={14} />
          Filter
        </button>
      </div>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Timestamp <ChevronUp size={12} className="inline" /></th>
              <th>Location / Camera <ChevronUp size={12} className="inline" /></th>
              <th>User</th>
              <th>Type <ChevronUp size={12} className="inline" /></th>
              <th>Confidence <ChevronUp size={12} className="inline" /></th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(log => (
              <tr key={log.id}>
                <td>{log.timestamp}</td>
                <td>{log.location}</td>
                <td>{log.user}</td>
                <td>{log.type}</td>
                <td>
                  <div className="confidence-cell">
                    <div
                      className={`confidence-bar ${log.confidence < 50 ? 'confidence-bar--low' : log.confidence < 80 ? 'confidence-bar--mid' : 'confidence-bar--high'}`}
                      style={{ width: `${log.confidence}%` }}
                    />
                    <span>{log.confidence}%</span>
                  </div>
                </td>
                <td><span className={`badge ${resultClass[log.result] || 'badge--gray'}`}>{log.result}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        <span className="pagination__info">Showing 1–9 of 47 alerts</span>
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
