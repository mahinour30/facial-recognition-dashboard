import { useState, useRef, useEffect } from 'react';
import {
  Search, Filter, Download, ChevronsUpDown,
  ChevronLeft, ChevronRight, UserPlus, MoreVertical,
  X, Mail, Trash2, Eye, Pencil, Info, Send,
  Camera, RefreshCw, PauseCircle, UserMinus,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { people as initialPeople } from '../data/mockData';

/* ─────────────────────────────────────────────
   ACTION AVAILABILITY MATRIX
   Returns a plain object describing which actions
   are shown/enabled for a given person row.
───────────────────────────────────────────── */
function getActions(person) {
  const { state, consent, type } = person;
  const t = (type || '').toLowerCase();
  const isVisitor   = t.includes('visitor');
  const isConsented = consent === 'Consented';

  // base: Edit + Delete always on (except Deletion requested)
  const base = { viewProfile: true, edit: true, delete: true, deleteLabel: 'Delete / offboard' };

  switch (state) {
    case 'Not Enrolled':
      // Pending → request consent; Declined → nothing extra
      if (consent === 'Declined') return { ...base };
      return { ...base, requestConsent: true, requestConsentLabel: 'Request consent' };

    case 'Consent Requested':
      return { ...base, requestConsent: true, requestConsentLabel: 'Resend consent' };

    case 'Ready to enroll':
      return { ...base, capture: true, withdraw: true };

    case 'Awaiting Capture':
      return { ...base, capture: true, withdraw: true };

    case 'Enrolled / Active':
      return {
        ...base,
        reenroll:       !isVisitor,
        suspend:        !isVisitor,
        suspendDisabled: true,
        withdraw:       isConsented,
      };

    case 'Pending re-enrollment':
      return {
        ...base,
        capture:         true,
        reenroll:        !isVisitor,
        suspend:         !isVisitor,
        suspendDisabled: true,
        withdraw:        isConsented,
      };

    case 'Expiring':
      // * Re-enroll = Outsourced renewal only, not Visitor
      return {
        ...base,
        reenroll:        !isVisitor,
        suspend:         !isVisitor,
        suspendDisabled: true,
        withdraw:        isConsented,
      };

    case 'Expired':
      // Visitor: Edit (extend) or Delete only
      return { viewProfile: true, edit: true, delete: true, deleteLabel: 'Delete / offboard' };

    case 'Suspended':
      return {
        ...base,
        suspend:         !isVisitor,
        suspendDisabled: true,
        withdraw:        isConsented,
      };

    case 'Deletion requested':
      // Only Cancel deletion + view profile
      return { viewProfile: true, delete: true, deleteLabel: 'Cancel deletion' };

    default:
      return { ...base };
  }
}

/* ─────────────────────────────────────────────
   BADGE / CONSENT HELPERS
───────────────────────────────────────────── */
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
    'Expiring':              'badge--consent-requested',
    'Suspended':             'badge--not-enrolled',
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

/* ─────────────────────────────────────────────
   CONTEXT MENU  — items driven by getActions()
───────────────────────────────────────────── */
function ContextMenu({ person, actions, onClose, handlers }) {
  const ref = useRef(null);
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [onClose]);

  const item = (label, icon, onClick, danger = false, disabled = false) => (
    <button
      key={label}
      className={`context-menu__item${danger ? ' context-menu__item--danger' : ''}${disabled ? ' context-menu__item--disabled' : ''}`}
      onClick={disabled ? undefined : () => { onClick(); onClose(); }}
      disabled={disabled}
    >
      {icon} {label}
    </button>
  );

  return (
    <div className="context-menu" ref={ref}>
      {actions.viewProfile    && item('View profile',             <Eye size={14} />,         handlers.viewProfile)}
      {actions.edit           && item('Edit',                     <Pencil size={14} />,       handlers.edit)}
      {actions.requestConsent && item(actions.requestConsentLabel || 'Request consent', <Mail size={14} />, handlers.requestConsent)}
      {actions.invite         && item('Invite to enroll',         <UserPlus size={14} />,    handlers.invite)}
      {actions.capture        && item('Capture face',             <Camera size={14} />,      handlers.capture)}
      {actions.reenroll       && item('Re-enroll',                <RefreshCw size={14} />,   handlers.reenroll)}
      {actions.suspend        && item('Suspend',                  <PauseCircle size={14} />, handlers.suspend, false, actions.suspendDisabled)}
      {actions.withdraw       && item('Withdraw consent',         <UserMinus size={14} />,   handlers.withdraw)}
      {actions.delete         && item(actions.deleteLabel || 'Delete / offboard', <Trash2 size={14} />, handlers.delete, true)}
    </div>
  );
}

/* ─────────────────────────────────────────────
   INFO MODAL SHELL  (Request consent / Invite)
───────────────────────────────────────────── */
function InfoModal({ title, body, confirmLabel, onCancel, onConfirm }) {
  return (
    <div className="modal-backdrop">
      <div className="modal modal--info">
        <button className="modal__close" onClick={onCancel}><X size={18} /></button>
        <div className="modal__info-icon"><Info size={22} color="#007cb0" /></div>
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

/* ─────────────────────────────────────────────
   DELETE / OFFBOARD MODAL
───────────────────────────────────────────── */
function DeleteModal({ count, label, onCancel, onConfirm }) {
  const isCancelDeletion = label === 'Cancel deletion';
  return (
    <div className="modal-backdrop">
      <div className="modal modal--info">
        <button className="modal__close" onClick={onCancel}><X size={18} /></button>
        <div className={`modal__info-icon ${isCancelDeletion ? '' : 'modal__info-icon--danger'}`}>
          <Trash2 size={22} color={isCancelDeletion ? '#007cb0' : '#da291c'} />
        </div>
        <h2 className="modal__info-title">{isCancelDeletion ? 'Cancel Deletion' : 'Delete / Offboard'}</h2>
        <p className="modal__info-body">
          {isCancelDeletion
            ? `Cancel the pending deletion request for ${count} ${count === 1 ? 'user' : 'users'}?`
            : <>Are you sure you want to offboard <strong>{count}</strong>{' '}
              {count === 1 ? 'user' : 'users'}? This action cannot be undone and will remove all associated face vectors.</>
          }
        </p>
        <div className="modal__info-footer">
          <button className="btn btn--outline" onClick={onCancel}>Cancel</button>
          <button className={`btn ${isCancelDeletion ? 'btn--primary' : 'btn--danger'}`} onClick={onConfirm}>
            {isCancelDeletion ? 'Cancel deletion' : 'Delete / Offboard'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   USER DETAILS MODAL
───────────────────────────────────────────── */
function UserDetailsModal({ person, onClose, onRequestConsent }) {
  const dotColors = { Pending: '#ed8b00', Consented: '#43b02a', Declined: '#da291c', Withdrawn: '#63666a', '-': '#a1a1a1' };
  const consentLabel = person.consent === '-' ? 'Not Sent' : person.consent;
  const dotColor = dotColors[consentLabel] || '#a1a1a1';
  const actions = getActions(person);
  const isEmployee = (person.type || '').toLowerCase().includes('employee');

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
          {/* Expiry only for Visitor / Outsource, not Employee */}
          {!isEmployee && (
            <div className="modal-details__field">
              <div className="modal-details__label">Expiry Date</div>
              <div className="modal-details__value">17th July, 2026</div>
            </div>
          )}
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
              <span className={`badge ${stateBadgeClass(person.state)}`}>{person.state}</span>
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
          {actions.requestConsent && (
            <button className="btn btn--outline" onClick={onRequestConsent}>
              <Send size={13} /> {actions.requestConsentLabel || 'Request consent'}
            </button>
          )}
          {actions.edit && (
            <button className="btn btn--outline"><Pencil size={13} /> Edit info</button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function PeopleAndAccess() {
  const [rows, setRows]                 = useState(initialPeople);
  const [selected, setSelected]         = useState([]);
  const [search, setSearch]             = useState('');
  const [openMenuId, setOpenMenuId]     = useState(null);
  const [modal, setModal]               = useState(null);
  const [targetIds, setTargetIds]       = useState([]);
  const [deleteLabel, setDeleteLabel]   = useState('Delete / offboard');
  const [detailPerson, setDetailPerson] = useState(null);
  const navigate = useNavigate();

  const filtered = rows.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = id =>
    setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);

  const toggleAll = () =>
    setSelected(prev => prev.length === filtered.length ? [] : filtered.map(p => p.id));

  const openModal = (type, ids, label = 'Delete / offboard') => {
    setTargetIds(ids);
    setDeleteLabel(label);
    setModal(type);
  };
  const closeModal = () => { setModal(null); setTargetIds([]); };

  /* ── action handlers ── */
  const handleConsentConfirm = () => {
    const updated = rows.map(p =>
      targetIds.includes(p.id) ? { ...p, consent: 'Pending', state: 'Consent Requested' } : p
    );
    setRows(updated);
    setSelected([]);
    const first = updated.find(p => p.id === targetIds[0]);
    setModal(null); setTargetIds([]);
    if (first) { setDetailPerson(first); setModal('userdetails'); }
  };

  const handleEnrollConfirm = () => {
    const person = rows.find(p => p.id === targetIds[0]);
    closeModal();
    navigate('/people/enroll', { state: { person } });
  };

  const handleDeleteConfirm = () => {
    if (deleteLabel === 'Cancel deletion') {
      setRows(prev => prev.map(p => targetIds.includes(p.id) ? { ...p, state: 'Not Enrolled' } : p));
    } else {
      setRows(prev => prev.filter(p => !targetIds.includes(p.id)));
    }
    setSelected([]);
    closeModal();
  };

  const handleWithdrawConfirm = () => {
    setRows(prev => prev.map(p =>
      targetIds.includes(p.id) ? { ...p, consent: 'Withdrawn', state: 'Not Enrolled' } : p
    ));
    setSelected([]);
    closeModal();
  };

  const handleCaptureConfirm = () => {
    const person = rows.find(p => p.id === targetIds[0]);
    closeModal();
    navigate('/people/enroll', { state: { person } });
  };
  const handleReenrollConfirm = () => {
    const person = rows.find(p => p.id === targetIds[0]);
    closeModal();
    navigate('/people/enroll', { state: { person } });
  };

  const count = targetIds.length;

  /* ── derive bulk bar visibility from selected rows ── */
  const selectionActions = selected.reduce((acc, id) => {
    const p = rows.find(r => r.id === id);
    if (!p) return acc;
    const a = getActions(p);
    return {
      canConsent: acc.canConsent || !!a.requestConsent,
      canInvite:  acc.canInvite  || !!a.invite,
      canDelete:  true,
    };
  }, { canConsent: false, canInvite: false, canDelete: false });

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
        {/* Consented Employees — 850 total */}
        <div className="enrollment-stat">
          <div className="enrollment-stat__header">
            <span className="enrollment-stat__label">Consented Employees</span>
            <span className="enrollment-stat__pct">84%</span>
          </div>
          <div className="progress-bar progress-bar--multi">
            <div className="progress-bar__seg" style={{ width: '83.8%', background: '#26890d' }} />
            <div className="progress-bar__seg" style={{ width: '10.6%', background: '#007cb0' }} />
            <div className="progress-bar__seg" style={{ width: '1.2%',  background: '#da291c' }} />
            <div className="progress-bar__seg" style={{ width: '4.5%',  background: '#bbbcbc' }} />
          </div>
          <div className="enrollment-stat__details">
            <span>Total Employees: 850</span>
            <span style={{ color: '#26890d' }}>● Consented: 712</span>
            <span style={{ color: '#007cb0' }}>● Awaiting Response: 90</span>
            <span style={{ color: '#da291c' }}>● Declined: 10</span>
            <span style={{ color: '#97999b' }}>● Remaining: 38</span>
          </div>
        </div>

        {/* Enrolled Employees — 712 consented */}
        <div className="enrollment-stat">
          <div className="enrollment-stat__header">
            <span className="enrollment-stat__label">Enrolled Employees</span>
            <span className="enrollment-stat__pct">96%</span>
          </div>
          <div className="progress-bar progress-bar--multi">
            <div className="progress-bar__seg" style={{ width: '95.6%', background: '#26890d' }} />
            <div className="progress-bar__seg" style={{ width: '3.2%',  background: '#ed8b00' }} />
            <div className="progress-bar__seg" style={{ width: '1.1%',  background: '#bbbcbc' }} />
          </div>
          <div className="enrollment-stat__details">
            <span>Of 712 consented</span>
            <span style={{ color: '#26890d' }}>● Enrolled: 681</span>
            <span style={{ color: '#ed8b00' }}>● Awaiting Capture: 23</span>
            <span style={{ color: '#97999b' }}>● Remaining: 8</span>
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
          <input type="text" placeholder="Search by name…" value={search}
            onChange={e => setSearch(e.target.value)} className="search-box__input" />
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button className="btn btn--outline"><Filter size={14} /> Filter</button>
          <button className="btn btn--outline"><Download size={14} /> Export Access Logs</button>
        </div>
      </div>

      {/* Bulk action bar — only shows relevant actions */}
      {selected.length > 0 && (
        <div className="bulk-action-bar">
          <span className="bulk-action-bar__count">{selected.length} Users Selected</span>
          {selectionActions.canConsent && (
            <button className="btn btn--sm btn--outline"
              onClick={() => openModal('consent', [...selected])}>
              <Mail size={13} /> Request consent
            </button>
          )}
          {selectionActions.canInvite && (
            <button className="btn btn--sm btn--outline"
              onClick={() => openModal('enroll', [...selected])}>
              <UserPlus size={13} /> Invite to enroll
            </button>
          )}
          <button className="btn btn--sm btn--danger"
            onClick={() => openModal('delete', [...selected])}>
            <Trash2 size={13} /> Delete / offboard
          </button>
          <button className="bulk-action-bar__close" onClick={() => setSelected([])}><X size={16} /></button>
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
            {filtered.map(person => {
              const actions = getActions(person);
              const rowHandlers = {
                viewProfile:    () => { setDetailPerson(person); setModal('userdetails'); },
                edit:           () => { setDetailPerson(person); setModal('userdetails'); },
                requestConsent: () => openModal('consent', [person.id]),
                invite:         () => openModal('enroll', [person.id]),
                capture:        () => openModal('capture', [person.id]),
                reenroll:       () => openModal('reenroll', [person.id]),
                suspend:        () => {},
                withdraw:       () => openModal('withdraw', [person.id]),
                delete:         () => openModal('delete', [person.id], actions.deleteLabel),
              };
              return (
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
                          actions={actions}
                          onClose={() => setOpenMenuId(null)}
                          handlers={rowHandlers}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
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

      {/* ── Modals ── */}
      {modal === 'consent' && (
        <InfoModal title="Request consent"
          body={`This sends a consent form (MS Teams) to ${count} selected ${count === 1 ? 'person' : 'persons'}. They'll show as "Consent requested" until they submit.`}
          confirmLabel={`Send to ${count}`} onCancel={closeModal} onConfirm={handleConsentConfirm} />
      )}
      {modal === 'enroll' && (
        <InfoModal title="Invite to enroll"
          body={`This emails ${count} consented ${count === 1 ? 'person' : 'persons'} to enroll with the office admin between Jun 23–27.`}
          confirmLabel={`Invite ${count}`} onCancel={closeModal} onConfirm={handleEnrollConfirm} />
      )}
      {modal === 'capture' && (
        <InfoModal title="Capture face"
          body={`Start the face capture process for ${count} ${count === 1 ? 'person' : 'persons'}. You will be taken to the capture wizard.`}
          confirmLabel="Start capture" onCancel={closeModal} onConfirm={handleCaptureConfirm} />
      )}
      {modal === 'reenroll' && (
        <InfoModal title="Re-enroll"
          body={`This will restart the enrollment process for ${count} ${count === 1 ? 'person' : 'persons'} and replace their existing face vector.`}
          confirmLabel="Re-enroll" onCancel={closeModal} onConfirm={handleReenrollConfirm} />
      )}
      {modal === 'withdraw' && (
        <InfoModal title="Withdraw consent"
          body={`This will withdraw consent for ${count} ${count === 1 ? 'person' : 'persons'} and permanently delete their face vector. This action is irreversible.`}
          confirmLabel={`Withdraw ${count}`} onCancel={closeModal} onConfirm={handleWithdrawConfirm} />
      )}
      {modal === 'delete' && (
        <DeleteModal count={count} label={deleteLabel} onCancel={closeModal} onConfirm={handleDeleteConfirm} />
      )}
      {modal === 'userdetails' && detailPerson && (
        <UserDetailsModal person={detailPerson} onClose={closeModal}
          onRequestConsent={() => { closeModal(); openModal('consent', [detailPerson.id]); }} />
      )}
    </div>
  );
}
