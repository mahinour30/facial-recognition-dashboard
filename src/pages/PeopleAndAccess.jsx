import { useState } from 'react';
import { Search, Filter, Download, ChevronUp, ChevronLeft, ChevronRight, UserPlus, MoreVertical, X, Mail, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { people } from '../data/mockData';

const stateClass = {
  'Not Enrolled': 'badge--gray',
  'Consent Requested': 'badge--orange',
  'Ready to enroll': 'badge--teal',
  'Awaiting Capture': 'badge--orange',
  'Enrolled / Active': 'badge--green',
  'Pending re-enrollment': 'badge--blue',
  'Deletion requested': 'badge--red',
  'Expired': 'badge--red',
};

export default function PeopleAndAccess() {
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filtered = people.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    setSelected(prev => prev.length === filtered.length ? [] : filtered.map(p => p.id));
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">People and Access</h1>
        <button className="btn btn--primary" onClick={() => navigate('/people/enroll')}>
          <UserPlus size={14} />
          Add Users
        </button>
      </div>

      {/* Enrollment Stats */}
      <div className="enrollment-stats">
        <div className="enrollment-stat">
          <div className="enrollment-stat__header">
            <span className="enrollment-stat__label">Consented Employees</span>
            <span className="enrollment-stat__pct">29%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-bar__fill progress-bar__fill--blue" style={{ width: '29%' }} />
          </div>
          <div className="enrollment-stat__details">
            <span>Total Employees: 803</span>
            <span>● Awaiting Response: 90</span>
            <span>● Declined: 10</span>
            <span>Remaining: 38</span>
          </div>
        </div>
        <div className="enrollment-stat">
          <div className="enrollment-stat__header">
            <span className="enrollment-stat__label">Enrolled Employees</span>
            <span className="enrollment-stat__pct">96%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-bar__fill progress-bar__fill--green" style={{ width: '96%' }} />
          </div>
          <div className="enrollment-stat__details">
            <span>Of 72 consented</span>
            <span>● Enrolled: 681</span>
            <span>● Awaiting Response: 23</span>
            <span>Remaining: 8</span>
          </div>
        </div>
      </div>

      <p className="enrollment-note">Policies and consent flows aren't counted in the overview does not present in the table below.</p>

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
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button className="btn btn--outline"><Filter size={14} /> Filter</button>
          <button className="btn btn--outline"><Download size={14} /> Export Access Logs</button>
        </div>
      </div>

      {selected.length > 0 && (
        <div className="bulk-action-bar">
          <span className="bulk-action-bar__count">{selected.length} Users Selected</span>
          <button className="btn btn--sm btn--outline"><Mail size={13} /> Request consent</button>
          <button className="btn btn--sm btn--outline"><UserPlus size={13} /> Invite to enroll</button>
          <button className="btn btn--sm btn--danger"><Trash2 size={13} /> Delete / offboard</button>
          <button className="bulk-action-bar__close" onClick={() => setSelected([])}><X size={16} /></button>
        </div>
      )}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th><input type="checkbox" onChange={toggleAll} checked={selected.length === filtered.length && filtered.length > 0} /></th>
              <th>User</th>
              <th>Type <ChevronUp size={12} className="inline" /></th>
              <th>Employee ID</th>
              <th>Offering <ChevronUp size={12} className="inline" /></th>
              <th>Consent <ChevronUp size={12} className="inline" /></th>
              <th>State</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(person => (
              <tr key={person.id} className={selected.includes(person.id) ? 'row--selected' : ''}>
                <td>
                  <input
                    type="checkbox"
                    checked={selected.includes(person.id)}
                    onChange={() => toggleSelect(person.id)}
                  />
                </td>
                <td className="user-cell">
                  <div className="user-avatar">{person.name.charAt(0)}</div>
                  {person.name}
                </td>
                <td>{person.type}</td>
                <td>{person.employeeId}</td>
                <td>{person.offering}</td>
                <td>
                  <span className={`consent-dot ${person.consent === 'Consented' ? 'consent-dot--green' : person.consent === 'Declined' ? 'consent-dot--red' : 'consent-dot--gray'}`}>
                    ● {person.consent}
                  </span>
                </td>
                <td>
                  <span className={`badge ${stateClass[person.state] || 'badge--gray'}`}>{person.state}</span>
                </td>
                <td>
                  <button className="icon-btn" onClick={() => navigate(`/people/enroll`)}>
                    <MoreVertical size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        <span className="pagination__info">Showing 1 of all users</span>
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
