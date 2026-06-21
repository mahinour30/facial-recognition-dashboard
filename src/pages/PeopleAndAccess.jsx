import { useState, useRef, useEffect } from 'react';
import {
  Search, Filter, Download, ChevronsUpDown,
  ChevronLeft, ChevronRight, UserPlus, MoreVertical,
  X, Mail, Trash2, Eye, Pencil, Info, Send,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { people as initialPeople } from '../data/mockData';

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

/* ---- User Details modal (shown after "Send to X" in Request Consent) ---- */
function UserDetailsModal({ person, onClose, onRequestConsent }) {
  const consentDotColor = {
    Pending:   '#ed8b00',
    Consented: '#43b02a',
    Declined:  '#da291c',
    Withdrawn: '#63666a',
    'Not Sent':'#ed8b00',
    '-':       '#a1a1a1',
  };
  const consentLabel = person.consent === '-' ? 'Not Sent' : person.consent;
  const dotColor = consentDotColor[consentLabel] || '#a1a1a1';

  return (
    <div className="modal-backdrop">
      <div className="modal modal--details">
        <div className="modal-details__header">
          <h2 className="modal-details__title">User Details</h2>
          <button className="modal__close" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="modal-details__grid">
          <div className="modal-details__field">
            <div className="modal-details__label">User name</div>
            <div className="modal-details__value">{person.name}</div>
          </div>
          <div className="modal-details__field">
            <div className="modal-details__label">Type</div>
            <div className="modal-details__value">{person.type}</div>
          </div>
          <div className="modal-details__field">
            <div className="modal-details__label">Sub-type</div>
            <div className="modal-details__value">{person.offering || 'Client'}</div>
          </div>
          <div className="modal-details__field">
            <div className="modal-details__label">Expiry Date</div>
            <div className="modal-details__value">17th July, 2026</div>
          </div>
          <div className="modal-details__field">
            <div className="modal-details__label">Consent</div>
            <div className="modal-details__value">
              <span className="consent-dot-inline">
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: dotColor, display: 'inline-block', marginRight: 6 }} />
                {consentLabel}
              </span>
            </div>
          </div>
          <div className="modal-details__field">
            <div className="modal-details__label">Status</div>
            <div className="modal-details__value">
              <span className="badge badge--not-enrolled">{person.state}</span>
            </div>
          </div>
          <div className="modal-details__field">
            <div className="modal-details__label">Consent Form Signed</div>
            <div className="modal-details__value">V.2</div>
          </div>
          <div className="modal-details__field">
            <div className="modal-details__label">Signed on</div>
            <div className="modal-details__value">12 Jun 2026, 09:14</div>
          </div>
        </div>
        <div className="modal-details__footer">
          <button className="btn btn--outline" onClick={onRequestConsent}>
            <Send size={13} /> Request consent
          </button>
          <button className="btn btn--outline">
            <Pencil size={13} /> Edit info
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---- Shared info modal shell (matches Figma popup style) ---- */
function InfoModal({ title, body, confirmLabel, onCancel, onConfirm }) {
  return (
    <div className="modal-backdrop">
      <div className="modal modal--info">
        <button className="modal__close" onClick={onCancel}><X size={18} /></button>
        <div className="modal__info-icon">
          <Info size={22} color="#007cb0" />
        </div>
        <h2 className="modal__info-title">{title}</h2>
        <p className="modal__info-body">{body}</p>
        <div className="modal__info-footer">
          <button className="btn btn--outline" onClick={onCancel}>Cancel</button>
          <button className="btn btn--primary" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

/* ---- Delete confirm modal ---- */
function DeleteModal({ count, onCancel, onConfirm }) {
  return (
    <div className="modal-backdrop">
      <div className="modal modal--info">
        <button className="modal__close" onClick={onCancel}><X size={18} /></button>
        <div className="modal__info-icon modal__info-icon--danger">
          <Trash2 size={22} color="#da291c" />
        </div>
        <h2 className="modal__info-title">Delete / Offboard</h2>
        <p className="modal__info-body">
          Are you sure you want to offboard <strong>{count}</strong>{' '}
          {count === 1 ? 'user' : 'users'}? This action cannot be undone and
          will remove all associated face vectors.
        </p>
        <div className="modal__info-footer">
          <button className="btn btn--outline" onClick={onCancel}>Cancel</button>
          <button className="btn btn--danger" onClick={onConfirm}>
            Delete / Offboard
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---- Row context menu ---- */
function ContextMenu({ person, onClose, onViewProfile, onRequestConsent, onInviteEnroll, onDelete }) {
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
      <button className="context-menu__item" onClick={() => { onViewProfile(); onClose(); }}>
        <Eye size={14} /> View profile
      </button>
      <button className="context-menu__item">
        <Pencil size={14} /> Edit
      </button>
      <button className="context-menu__item" onClick={() => { onRequestConsent(); onClose(); }}>
        <Mail size={14} /> Request consent
      </button>
      <button className="context-menu__item" onClick={() => { onInviteEnroll(); onClose(); }}>
        <UserPlus size={14} /> Invite to enroll
      </button>
      <button className="context-menu__item context-menu__item--danger"
        onClick={() => { onDelete(); onClose(); }}>
        <Trash2 size={14} /> Delete / offboard
      </button>
    </div>
  );
}

export default function PeopleAndAccess() {
  const [rows, setRows]               = useState(initialPeople);
  const [selected, setSelected]       = useState([]);
  const [search, setSearch]           = useState('');
  const [openMenuId, setOpenMenuId]   = useState(null);
  const [modal, setModal]             = useState(null); // 'consent' | 'enroll' | 'delete' | 'userdetails'
  const [targetIds, setTargetIds]     = useState([]);
  const [detailPerson, setDetailPerson] = useState(null);
  const navigate = useNavigate();

  const filtered = rows.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = id =>
    setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);

  const toggleAll = () =>
    setSelected(prev => prev.length === filtered.length ? [] : filtered.map(p => p.id));

  // Open a modal — from bulk bar use selected[], from row menu pass [personId]
  const openModal = (type, ids) => {
    setTargetIds(ids);
    setModal(type);
  };

  const closeModal = () => { setModal(null); setTargetIds([]); };

  const handleConsentConfirm = () => {
    setRows(prev => prev.map(p =>
      targetIds.includes(p.id) ? { ...p, consent: 'Pending', state: 'Consent Requested' } : p
    ));
    setSelected([]);
    // After sending, open User Details for the first targeted person
    const firstPerson = rows.find(p => p.id === targetIds[0]);
    setModal(null);
    setTargetIds([]);
    if (firstPerson) {
      setDetailPerson({ ...firstPerson, consent: 'Pending', state: 'Consent Requested' });
      setModal('userdetails');
    }
  };

  const handleEnrollConfirm = () => {
    closeModal();
    navigate('/people/enroll');
  };

  const handleDeleteConfirm = () => {
    setRows(prev => prev.filter(p => !targetIds.includes(p.id)));
    setSelected([]);
    closeModal();
  };

  const count = targetIds.length;

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">People and Access</h1>
        <button className="btn btn--primary" onClick={() => navigate('/people/enroll')}>
          <UserPlus size={14} /> Add Users
        </button>
      </div>

      {/* Enrollment summary */}
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

      {/* Toolbar */}
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
          <button className="btn btn--outline"><Filter size={14} /> Filter</button>
          <button className="btn btn--outline"><Download size={14} /> Export Access Logs</button>
        </div>
      </div>

      {/* Bulk action bar */}
      {selected.length > 0 && (
        <div className="bulk-action-bar">
          <span className="bulk-action-bar__count">{selected.length} Users Selected</span>
          <button className="btn btn--sm btn--outline"
            onClick={() => openModal('consent', [...selected])}>
            <Mail size={13} /> Request consent
          </button>
          <button className="btn btn--sm btn--outline"
            onClick={() => openModal('enroll', [...selected])}>
            <UserPlus size={13} /> Invite to enroll
          </button>
          <button className="btn btn--sm btn--danger"
            onClick={() => openModal('delete', [...selected])}>
            <Trash2 size={13} /> Delete / offboard
          </button>
          <button className="bulk-action-bar__close" onClick={() => setSelected([])}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: 40 }}>
                <input type="checkbox" onChange={toggleAll}
                  checked={selected.length === filtered.length && filtered.length > 0}
                  style={{ cursor: 'pointer' }} />
              </th>
              <th>User</th>
              <th>Type <ChevronsUpDown size={12} className="inline" style={{ color: '#a1a1a1' }} /></th>
              <th>Employee ID</th>
              <th>Offering <ChevronsUpDown size={12} className="inline" style={{ color: '#a1a1a1' }} /></th>
              <th>Consent <ChevronsUpDown size={12} className="inline" style={{ color: '#a1a1a1' }} /></th>
              <th>State</th>
              <th style={{ width: 40 }} />
            </tr>
          </thead>
          <tbody>
            {filtered.map(person => (
              <tr key={person.id} className={selected.includes(person.id) ? 'row--selected' : ''}>
                <td>
                  <input type="checkbox" checked={selected.includes(person.id)}
                    onChange={() => toggleSelect(person.id)} style={{ cursor: 'pointer' }} />
                </td>
                <td>
                  <div className="user-cell">
                    <div className="user-avatar">{person.name.charAt(0)}</div>
                    <span>{person.name}</span>
                  </div>
                </td>
                <td style={{ color: '#53565a' }}>{person.type}</td>
                <td style={{ color: '#53565a' }}>{person.employeeId}</td>
                <td style={{ color: '#53565a' }}>{person.offering}</td>
                <td><ConsentDot consent={person.consent} /></td>
                <td>
                  <span className={`badge ${stateBadgeClass(person.state)}`}>{person.state}</span>
                </td>
                <td>
                  <div className="context-menu-wrapper">
                    <button className="icon-btn"
                      onClick={() => setOpenMenuId(openMenuId === person.id ? null : person.id)}>
                      <MoreVertical size={16} />
                    </button>
                    {openMenuId === person.id && (
                      <ContextMenu
                        person={person}
                        onClose={() => setOpenMenuId(null)}
                        onViewProfile={() => { setDetailPerson(person); setModal('userdetails'); }}
                        onRequestConsent={() => openModal('consent', [person.id])}
                        onInviteEnroll={() => openModal('enroll', [person.id])}
                        onDelete={() => openModal('delete', [person.id])}
                      />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <span className="pagination__info">Showing 1–{filtered.length} of {rows.length} users</span>
        <div className="pagination__controls">
          <button className="page-btn"><ChevronLeft size={14} /></button>
          {[1, 2, 3, 4, 5].map(p => (
            <button key={p} className={`page-btn${p === 1 ? ' page-btn--active' : ''}`}>{p}</button>
          ))}
          <button className="page-btn"><ChevronRight size={14} /></button>
        </div>
      </div>

      {/* Request consent modal */}
      {modal === 'consent' && (
        <InfoModal
          title="Request consent"
          body={`This sends a consent form (MS Teams) to ${count} selected ${count === 1 ? 'person' : 'persons'}. They'll show as "Consent requested" until they submit.`}
          confirmLabel={`Send to ${count}`}
          onCancel={closeModal}
          onConfirm={handleConsentConfirm}
        />
      )}

      {/* Invite to enroll modal */}
      {modal === 'enroll' && (
        <InfoModal
          title="Invite to enroll"
          body={`This emails ${count} consented ${count === 1 ? 'person' : 'persons'} to enroll with the office admin between Jun 23–27.`}
          confirmLabel={`Invite ${count}`}
          onCancel={closeModal}
          onConfirm={handleEnrollConfirm}
        />
      )}

      {/* Delete modal */}
      {modal === 'delete' && (
        <DeleteModal
          count={count}
          onCancel={closeModal}
          onConfirm={handleDeleteConfirm}
        />
      )}

      {/* User Details modal */}
      {modal === 'userdetails' && detailPerson && (
        <UserDetailsModal
          person={detailPerson}
          onClose={closeModal}
          onRequestConsent={() => {
            closeModal();
            openModal('consent', [detailPerson.id]);
          }}
        />
      )}
    </div>
  );
}
