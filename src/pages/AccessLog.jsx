import { useState } from 'react';
import {
  Search,
  Filter,
  Download,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { accessLogs } from '../data/mockData';

function resultBadgeClass(result) {
  if (result === 'Entry Confirmed')     return 'badge--entry-confirmed';
  if (result === 'Exit Confirmed')      return 'badge--exit-confirmed';
  if (result === 'Flagged')             return 'badge--flagged';
  if (result === 'Re-exit without entry') return 'badge--re-exit';
  if (result === 'Re-entry without exit') return 'badge--re-entry';
  return 'badge--gray';
}

function confidenceBarClass(conf) {
  if (conf >= 80) return 'confidence-bar--high';
  if (conf >= 50) return 'confidence-bar--mid';
  return 'confidence-bar--low';
}

export default function AccessLog() {
  const [search, setSearch] = useState('');

  const filtered = accessLogs.filter(
    log =>
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
            placeholder="Search by user or location…"
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
              <th>
                Timestamp{' '}
                <ChevronsUpDown size={12} className="inline" style={{ color: '#a1a1a1' }} />
              </th>
              <th>
                Location / Camera{' '}
                <ChevronsUpDown size={12} className="inline" style={{ color: '#a1a1a1' }} />
              </th>
              <th>User</th>
              <th>
                Type{' '}
                <ChevronsUpDown size={12} className="inline" style={{ color: '#a1a1a1' }} />
              </th>
              <th>
                Confidence{' '}
                <ChevronsUpDown size={12} className="inline" style={{ color: '#a1a1a1' }} />
              </th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(log => (
              <tr key={log.id}>
                <td style={{ color: '#53565a' }}>{log.timestamp}</td>
                <td style={{ color: '#53565a' }}>{log.location}</td>
                <td>
                  <div className="user-cell">
                    <div className="user-avatar">
                      {log.user.charAt(0)}
                    </div>
                    {log.user}
                  </div>
                </td>
                <td>{log.type}</td>
                <td>
                  <div className="confidence-cell">
                    <div
                      className={`confidence-bar ${confidenceBarClass(log.confidence)}`}
                      style={{ width: `${Math.max(log.confidence, 8)}%` }}
                    />
                    <span
                      style={{
                        color:
                          log.confidence >= 80 ? '#26890d' :
                          log.confidence >= 50 ? '#ed8b00' :
                          '#da291c',
                        fontWeight: 600,
                      }}
                    >
                      {log.confidence}%
                    </span>
                  </div>
                </td>
                <td>
                  <span className={`badge ${resultBadgeClass(log.result)}`}>
                    {log.result}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <span className="pagination__info">
          Showing 1–{filtered.length} of {accessLogs.length} entries
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
