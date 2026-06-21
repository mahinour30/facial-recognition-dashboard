import { useState, useRef, useEffect } from 'react';
import {
  Search,
  Filter,
  Download,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  MoreVertical,
  X,
  Mail,
  Trash2,
  Eye,
  Pencil,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { people as initialPeople } from '../data/mockData';

/* ---- badge mapping per Figma enrollment states ---- */
function stateBadgeClass(state) {
  const map = {
    'Not Enrolled':          'badge--not-enrolled',
    'Consent Requested':     'badge--consent-requested',
    'Ready to enroll':       'badge--ready-enroll',
    'Awaiting Capture':      'badge--awaiting-capture',
    'Enrolled / Active':     'badge--enrolled-active',
    'Pending re-enrollment': 'badge--pending-reenroll',
    'Deletion requested':    'badge--deletion-requested',
    'Expired':               'badge--expired',
  };
  return map[state] || 'badge--gray';
}

/* ---- consent dot colors per Figma ---- */
function ConsentDot({ consent }) {
  const dotColors = {
    Pending:   '#ed8b00',
    Consented: '#43b02a',
    Declined:  '#da291c',
    Withdrawn: '#63666a',
    '-':       '#a1a1a1',
  };
  const color = dotColors[consent] || '#a1a1a1';
  const label = consent === '-' ? '—' : consent;
  return (
    <div className={`consent-dot consent-dot--${(consent || '').toLowerCase()}`}>
      <span className="consent-dot-icon" style={{ background: color }} />
      <span>{label}</span>
    </div>
  );
}

/* ---- Row context menu ---- */
function ContextMenu({ person, onClose, onEnroll }) {
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  return (
    <div className="context-menu" ref={ref}>
      <button className="context-menu__item">
        <Eye size={14} />
        View profile
      </button>
      <button className="context-menu__item">
        <Pencil size={14} />
        Edit
      </button>
      <button className="context-menu__item" onClick={() => { onEnroll(); onClose(); }}>
        <UserPlus size={14} />
        Invite to enroll
      </button>
      <button className="context-menu__item context-menu__item--danger">
        <Trash2 size={14} />
        Delete / offboard
      </button>
    </div>
  );
}

/* ---- Delete Confirm Modal ---- */
function DeleteModal({ count, onCancel, onConfirm }) {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal__header">
          <span className="modal__title">Confirm Deletion</span>
          <button className="icon-btn" onClick={onCancel}><X size={16} /></button>
        </div>
        <div className="modal__body">
          Are you sure you want to offboard <strong>{count}</strong>{' '}
          {count === 1 ? 'user' : 'users'}? This action cannot be undone and
          will remove all associated face vectors.
        </div>
        <div className="modal__footer">
          <button className="btn btn--outline" onClick={onCancel}>Cancel</button>
          <button className="btn btn--danger" onClick={onConfirm}>
            <Trash2 size={14} /> Delete / Offboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PeopleAndAccess() {
  const [rows, setRows]              = useState(initialPeople);
  const [selected, setSelected]     = useState([]);
  const [search, setSearch]         = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const navigate = useNavigate();

  const filtered = rows.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = id =>
    setSelected(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );

  const toggleAll = () =>
    setSelected(prev =>
      prev.length === filtered.length ? [] : filtered.map(p => p.id)
    );

  const handleDeleteConfirm = () => {
    setRows(prev => prev.filter(p => !selected.includes(p.id)));
    setSelected([]);
    setShowDelete(false);
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

      {/* ---- Enrollment summary stats ---- */}
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
            <span style={{ color: '#ed8b00' }}>● Awaiting Response: 90</span>
            <span style={{ color: '#da291c' }}>● Declined: 10</span>
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
            <span style={{ color: '#26890d' }}>● Enrolled: 681</span>
            <span style={{ color: '#ed8b00' }}>● Awaiting Capture: 23</span>
            <span>Remaining: 8</span>
          </div>
        </div>
      </div>

      <p className="enrollment-note">
        Policies and consent flows aren't counted in the overview and are not presented in the table below.
      </p>

      {/* ---- Toolbar ---- */}
      <div className="toolbar">
        <div className="search-box">
          <Search size={14} className="search-box__icon" />
          <input
            type="text"
            placeholder="Search by name…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="search-box__input"
          />
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button className="btn btn--outline">
            <Filter size={14} /> Filter
          </button>
          <button className="btn btn--outline">
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {/* ---- Bulk action bar ---- */}
      {selected.length > 0 && (
        <div className="bulk-action-bar">
          <span className="bulk-action-bar__count">{selected.length} Users Selected</span>
          <button
            className="btn btn--sm btn--outline"
            onClick={() => alert(`Consent request sent to ${selected.length} user(s).`)}
          >
            <Mail size={13} /> Request consent
          </button>
          <button
            className="btn btn--sm btn--outline"
            onClick={() => navigate('/people/enroll')}
          >
            <UserPlus size={13} /> Invite to enroll
          </button>
          <button
            className="btn btn--sm btn--danger"
            onClick={() => setShowDelete(true)}
          >
            <Trash2 size={13} /> Delete / offboard
          </button>
          <button className="bulk-action-bar__close" onClick={() => setSelected([])}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* ---- Table ---- */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: 40 }}>
                <input
                  type="checkbox"
                  onChange={toggleAll}
                  checked={selected.length === filtered.length && filtered.length > 0}
                  style={{ cursor: 'pointer' }}
                />
              </th>
              <th>User</th>
              <th>
                Type <ChevronsUpDown size={12} className="inline" style={{ color: '#a1a1a1' }} />
              </th>
              <th>Employee ID</th>
              <th>
                Offering <ChevronsUpDown size={12} className="inline" style={{ color: '#a1a1a1' }} />
              </th>
              <th>
                Consent <ChevronsUpDown size={12} className="inline" style={{ color: '#a1a1a1' }} />
              </th>
              <th>State</th>
              <th style={{ width: 40 }} />
            </tr>
          </thead>
          <tbody>
            {filtered.map(person => (
              <tr
                key={person.id}
                className={selected.includes(person.id) ? 'row--selected' : ''}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={selected.includes(person.id)}
                    onChange={() => toggleSelect(person.id)}
                    style={{ cursor: 'pointer' }}
                  />
                </td>
                <td>
                  <div className="user-cell">
                    <div className="user-avatar">
                      {person.name.charAt(0)}
                    </div>
                    <span>{person.name}</span>
                  </div>
                </td>
                <td style={{ color: '#53565a' }}>{person.type}</td>
                <td style={{ color: '#53565a' }}>{person.employeeId}</td>
                <td style={{ color: '#53565a' }}>{person.offering}</td>
                <td>
                  <ConsentDot consent={person.consent} />
                </td>
                <td>
                  <span className={`badge ${stateBadgeClass(person.state)}`}>
                    {person.state}
                  </span>
                </td>
                <td>
                  <div className="context-menu-wrapper">
                    <button
                      className="icon-btn"
                      onClick={() =>
                        setOpenMenuId(openMenuId === person.id ? null : person.id)
                      }
                    >
                      <MoreVertical size={16} />
                    </button>
                    {openMenuId === person.id && (
                      <ContextMenu
                        person={person}
                        onClose={() => setOpenMenuId(null)}
                        onEnroll={() => navigate('/people/enroll')}
                      />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ---- Pagination ---- */}
      <div className="pagination">
        <span className="pagination__info">
          Showing 1–{filtered.length} of {rows.length} users
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

      {/* ---- Delete confirm modal ---- */}
      {showDelete && (
        <DeleteModal
          count={selected.length}
          onCancel={() => setShowDelete(false)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}
