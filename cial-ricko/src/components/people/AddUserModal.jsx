import { useState } from 'react'
import { Close, Calendar, ChevronDown, Add, Upload } from '@carbon/icons-react'
import { useStore } from '../../store/useStore'

const VISITOR_SUBTYPES = ['Client','Project Related','Firm Visit','Other']
const OUTSOURCE_SUBTYPES = ['Cleaning / facilities','Maintenance / interior','Medical','Instructor / trainer','Speaker','Consultant / contractor','Bank','Other']
const OFFERINGS = ['Customer','Engineering','Cyber Security','AI & Data','Consulting','Finance']

export default function AddUserModal({ onClose }) {
  const addPerson = useStore(s => s.addPerson)
  const showToast = useStore(s => s.showToast)
  const [form, setForm] = useState({ name: '', type: 'Employee', subtype: '', offering: '', employeeId: '', email: '', expiry: '' })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const isEmployee = form.type === 'Employee'
  const needsSubtype = form.type === 'Visitor' || form.type === 'Outsource'
  const subtypes = form.type === 'Visitor' ? VISITOR_SUBTYPES : OUTSOURCE_SUBTYPES

  const handleSubmit = () => {
    if (!form.name.trim()) return
    addPerson({ ...form, consent: 'Not Sent', state: 'Not Enrolled', expiry: needsSubtype ? form.expiry : null, employeeId: isEmployee ? form.employeeId : null, offering: isEmployee ? form.offering : null, subtype: needsSubtype ? form.subtype : null })
    showToast('User added successfully')
    onClose()
  }

  const inputStyle = { width: '100%', padding: 'var(--space-2) var(--space-3)', border: '1px solid var(--stroke-default)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--type-body-regular-size)', background: 'var(--surface-primary)', color: 'var(--text-title-primary)', outline: 'none' }
  const labelStyle = { display: 'block', fontSize: 'var(--type-label-semibold-size)', fontWeight: 'var(--type-label-semibold-weight)', color: 'var(--text-body-tertiary)', marginBottom: 'var(--space-1)' }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'var(--surface-primary)', borderRadius: 'var(--radius-md)', width: 520, boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-4) var(--space-5)', borderBottom: '1px solid var(--stroke-default)' }}>
          <h2 style={{ fontSize: 'var(--type-heading-5-size)', fontWeight: 'var(--type-heading-5-weight)' }}>Add Users</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-body-tertiary)', display: 'flex' }}><Close size={18} /></button>
        </div>
        <div style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div><label style={labelStyle}>Username</label><input style={inputStyle} value={form.name} onChange={e => set('name', e.target.value)} placeholder="Full name" /></div>
          <div><label style={labelStyle}>Type</label>
            <select style={inputStyle} value={form.type} onChange={e => set('type', e.target.value)}>
              <option>Employee</option><option>Visitor</option><option>Outsource</option>
            </select>
          </div>
          {needsSubtype && (
            <div><label style={labelStyle}>Sub-type</label>
              <select style={inputStyle} value={form.subtype} onChange={e => set('subtype', e.target.value)}>
                <option value="">Select…</option>{subtypes.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          )}
          {isEmployee && <>
            <div><label style={labelStyle}>Offering</label>
              <select style={inputStyle} value={form.offering} onChange={e => set('offering', e.target.value)}>
                <option value="">Select…</option>{OFFERINGS.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div><label style={labelStyle}>Employee ID</label><input style={inputStyle} value={form.employeeId} onChange={e => set('employeeId', e.target.value)} placeholder="e.g. 20230594" /></div>
            <div><label style={labelStyle}>Email</label><input style={inputStyle} type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="name@company.com" /></div>
          </>}
          {needsSubtype && (
            <div><label style={labelStyle}>Expiry Date</label><input style={inputStyle} type="date" value={form.expiry} onChange={e => set('expiry', e.target.value)} /></div>
          )}
        </div>
        <div style={{ padding: 'var(--space-4) var(--space-5)', borderTop: '1px solid var(--stroke-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button style={{ background: 'none', border: 'none', cursor: 'not-allowed', opacity: 0.4, display: 'flex', alignItems: 'center', gap: 'var(--space-1)', fontSize: 'var(--type-body-regular-size)', color: 'var(--text-body-tertiary)' }}>
            <Upload size={16} /> Bulk Upload Users
          </button>
          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <button onClick={onClose} style={{ padding: 'var(--space-2) var(--space-4)', border: '1px solid var(--stroke-default)', borderRadius: 'var(--radius-sm)', background: 'var(--surface-primary)', cursor: 'pointer', fontSize: 'var(--type-body-regular-size)' }}>Cancel</button>
            <button onClick={handleSubmit} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', padding: 'var(--space-2) var(--space-4)', border: 'none', borderRadius: 'var(--radius-sm)', background: 'var(--button-primary)', color: 'var(--text-title-secondary)', cursor: 'pointer', fontSize: 'var(--type-body-semibold-size)', fontWeight: 'var(--type-body-semibold-weight)' }}>
              <Add size={16} /> Add User
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
