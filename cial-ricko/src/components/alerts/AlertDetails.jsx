import { useState } from 'react'
import { Close, Time, CheckmarkOutline, ArrowUp, WarningFilled, WarningAltFilled, InformationFilled } from '@carbon/icons-react'
import { useStore } from '../../store/useStore'

const OUTCOMES = [
  'Genuine threat',
  'False alarm',
  'Duplicate of a resolved alert',
  'Expected Visitor',
  'Authorized / identified as known person',
  'Test / Drill',
  'Other',
]

const SEV_COLOR = { Critical: 'var(--status-danger)', Warning: 'var(--status-warning)', Info: 'var(--status-info)' }
const SEV_ICON  = { Critical: WarningFilled, Warning: WarningAltFilled, Info: InformationFilled }

function fmt(iso) {
  const d = new globalThis.Date(iso)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' at ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function AlertDetails({ alert, onClose }) {
  const updateAlert = useStore(s => s.updateAlert)
  const showToast   = useStore(s => s.showToast)
  const [outcome, setOutcome] = useState(alert.outcome || '')
  const [note, setNote]       = useState(alert.note || '')

  const needsNote    = outcome === 'Other'
  const resolveOk    = outcome !== '' && (!needsNote || note.trim() !== '')
  const SevIcon      = SEV_ICON[alert.severity] || InformationFilled
  const sevColor     = SEV_COLOR[alert.severity] || 'var(--status-info)'

  const acknowledge = () => {
    updateAlert(alert.id, { status: 'In Progress', outcome, note })
    showToast('Alert acknowledged')
    onClose()
  }
  const escalate = () => {
    const next = alert.severity === 'Warning' ? 'Critical' : alert.severity
    updateAlert(alert.id, { severity: next, status: 'In Progress', outcome, note })
    showToast('Alert escalated')
    onClose()
  }
  const resolve = () => {
    updateAlert(alert.id, { status: 'Resolved', outcome, note, resolvedAt: new globalThis.Date().toISOString() })
    showToast('Alert resolved')
    onClose()
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-4)' }}>
      <div style={{ background: 'var(--surface-primary)', borderRadius: 'var(--radius-md)', width: 860, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 8px 40px rgba(0,0,0,0.25)' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-4) var(--space-5)', borderBottom: '1px solid var(--stroke-default)' }}>
          <h2 style={{ fontSize: 'var(--type-heading-5-size)', fontWeight: 'var(--type-heading-5-weight)' }}>Alert Details</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-body-tertiary)', display: 'flex' }}><Close size={18} /></button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 'var(--space-5)', padding: 'var(--space-5)' }}>
          {/* Left: captured frames + meta */}
          <div>
            {/* Captured frames */}
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                <span style={{ fontSize: 'var(--type-body-semibold-size)', fontWeight: 600 }}>Captured frame</span>
                <span style={{ background: 'var(--tag-orange-bg)', color: 'var(--tag-orange-fg)', fontSize: 11, fontWeight: 600, padding: '2px 10px', borderRadius: 'var(--radius-pill)' }}>Auto-deletes in 14 Days</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 'var(--space-1)' }}>
                {[...Array(6)].map((_,i) => (
                  <div key={i} style={{ height: 80, background: 'var(--surface-quaternary)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <SevIcon size={20} style={{ color: sevColor, opacity: 0.4 }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Meta grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
              {[
                ['Time', fmt(alert.time)],
                ['Severity', <span style={{ color: sevColor, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}><SevIcon size={14} />{alert.severity}</span>],
                ['Alert Type', alert.type],
                ['Location', alert.location],
                ['Detected Persons', alert.person || 'Unknown (—)'],
                ['Status', <span style={{ background: alert.status === 'Active' ? 'var(--tag-red-bg)' : alert.status === 'Resolved' ? 'var(--tag-green-bg)' : 'var(--tag-orange-bg)', color: alert.status === 'Active' ? 'var(--tag-red-fg)' : alert.status === 'Resolved' ? 'var(--tag-green-fg)' : 'var(--tag-orange-fg)', padding: '2px 8px', borderRadius: 'var(--radius-pill)', fontSize: 11, fontWeight: 600 }}>{alert.status}</span>],
              ].map(([l, v]) => (
                <div key={l}>
                  <div style={{ fontSize: 'var(--type-label-regular-size)', color: 'var(--text-body-tertiary)', marginBottom: 2 }}>{l}</div>
                  <div style={{ fontSize: 'var(--type-body-regular-size)', fontWeight: 400 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: outcome + note */}
          <div>
            <div style={{ fontSize: 'var(--type-body-semibold-size)', fontWeight: 600, marginBottom: 'var(--space-3)' }}>Outcome</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
              {OUTCOMES.map(opt => (
                <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer', fontSize: 'var(--type-body-regular-size)', color: 'var(--text-title-primary)' }}>
                  <input type="radio" name="outcome" value={opt} checked={outcome === opt} onChange={() => setOutcome(opt)}
                    style={{ accentColor: 'var(--button-primary)', width: 14, height: 14 }} />
                  {opt}
                </label>
              ))}
            </div>

            <div style={{ marginBottom: 'var(--space-1)' }}>
              <label style={{ fontSize: 'var(--type-label-semibold-size)', fontWeight: 600, color: 'var(--text-body-tertiary)', display: 'block', marginBottom: 'var(--space-1)' }}>
                Note {needsNote && <span style={{ color: 'var(--status-danger)' }}>*required</span>}
              </label>
              <textarea value={note} onChange={e => setNote(e.target.value)}
                placeholder="Describe the reason for this outcome…"
                style={{ width: '100%', minHeight: 80, padding: 'var(--space-2) var(--space-3)', border: '1px solid var(--stroke-default)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--type-body-regular-size)', fontFamily: 'var(--font-family)', resize: 'vertical', outline: 'none', color: 'var(--text-title-primary)' }} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', padding: 'var(--space-4) var(--space-5)', borderTop: '1px solid var(--stroke-default)' }}>
          <button onClick={acknowledge} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', padding: 'var(--space-2) var(--space-4)', border: '1px solid var(--status-warning)', borderRadius: 'var(--radius-sm)', background: 'var(--tag-orange-bg)', color: 'var(--tag-orange-fg)', cursor: 'pointer', fontSize: 'var(--type-body-semibold-size)', fontWeight: 600 }}>
            <Time size={16} /> Acknowledge
          </button>
          <button onClick={escalate} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', padding: 'var(--space-2) var(--space-4)', border: '1px solid var(--status-danger)', borderRadius: 'var(--radius-sm)', background: 'var(--surface-primary)', color: 'var(--status-danger)', cursor: 'pointer', fontSize: 'var(--type-body-semibold-size)', fontWeight: 600 }}>
            <ArrowUp size={16} /> Escalate
          </button>
          <button onClick={resolve} disabled={!resolveOk} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', padding: 'var(--space-2) var(--space-4)', border: 'none', borderRadius: 'var(--radius-sm)', background: resolveOk ? 'var(--button-primary)' : 'var(--state-disabled)', color: '#fff', cursor: resolveOk ? 'pointer' : 'not-allowed', fontSize: 'var(--type-body-semibold-size)', fontWeight: 600 }}>
            <CheckmarkOutline size={16} /> Resolve
          </button>
        </div>
      </div>
    </div>
  )
}
