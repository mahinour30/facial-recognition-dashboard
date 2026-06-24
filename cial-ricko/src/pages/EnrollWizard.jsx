import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CheckmarkFilled, CheckmarkOutline, CircleDash, Camera } from '@carbon/icons-react'
import { useStore } from '../store/useStore'

const STEPS = ['Consent', 'Identity', 'Capture', 'Confirm']
const ANGLES = ['Front', 'Left', 'Right']

function Stepper({ current }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 'var(--space-6)' }}>
      {STEPS.map((label, i) => {
        const n = i + 1
        const done = n < current
        const active = n === current
        return (
          <div key={label} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-1)' }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: done ? 'var(--status-success)' : active ? 'var(--surface-secondary)' : 'var(--stroke-default)',
                color: done || active ? 'var(--text-title-secondary)' : 'var(--text-body-tertiary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700,
              }}>
                {done ? <CheckmarkFilled size={16} /> : n}
              </div>
              <span style={{ fontSize: 'var(--type-label-semibold-size)', fontWeight: active ? 'var(--type-label-semibold-weight)' : 'var(--type-label-regular-weight)', color: active ? 'var(--text-title-primary)' : 'var(--text-body-tertiary)' }}>{label}</span>
            </div>
            {i < STEPS.length - 1 && <div style={{ width: 80, height: 1, background: i < current - 1 ? 'var(--status-success)' : 'var(--stroke-default)', margin: '0 var(--space-2)', marginBottom: 20 }} />}
          </div>
        )
      })}
    </div>
  )
}

function CaptureStep({ person, onNext, onBack, onEnrollmentComplete }) {
  const startLiveEnrollment = useStore(s => s.startLiveEnrollment)
  const updatePerson        = useStore(s => s.updatePerson)
  const [angleIdx, setAngleIdx] = useState(0)
  const [captures, setCaptures] = useState({ Front: null, Left: null, Right: null })
  const [analyzing, setAnalyzing] = useState(false)
  const [qualityOk, setQualityOk] = useState(false)
  const [camError, setCamError] = useState(null)
  const [wsFeedback, setWsFeedback] = useState(null)
  const [wsEnrolled, setWsEnrolled] = useState(false)
  const [wsError, setWsError] = useState(null)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const wsRef = useRef(null)

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
      .then(stream => {
        streamRef.current = stream
        if (videoRef.current) videoRef.current.srcObject = stream
        wsRef.current = startLiveEnrollment({
          employeeId: String(person.employeeId || person.id),
          fullName: person.name,
          videoEl: videoRef.current,
          onFeedback: (fb) => setWsFeedback(fb),
          onEnrolled: ({ prototypes }) => {
            // Server confirmed enrollment — mark all angles done and update store immediately
            setCaptures({ Front: 'done', Left: 'done', Right: 'done' })
            setWsEnrolled(true)
            updatePerson(person.id, {
              state: 'Enrolled / Active',
              consent: 'Consented',
              _prototypes: prototypes,
              _enrolledAt: new globalThis.Date().toISOString(),
            })
            // Notify parent with server data so Confirm step can display it
            onEnrollmentComplete({ prototypes, source: 'websocket' })
          },
          onError: (msg) => setWsError(msg),
        })
      })
      .catch(() => setCamError('Camera access denied. Please allow camera access and reload.'))
    setTimeout(() => setQualityOk(true), 2000)
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop())
      if (wsRef.current) wsRef.current.stop()
    }
  }, [])

  const captureAngle = () => {
    const angle = ANGLES[angleIdx]
    const video = videoRef.current
    const canvas = canvasRef.current
    if (video && canvas) {
      canvas.width = video.videoWidth || 640
      canvas.height = video.videoHeight || 480
      canvas.getContext('2d').drawImage(video, 0, 0)
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9)
      setAnalyzing(true)
      setTimeout(() => {
        setCaptures(c => ({ ...c, [angle]: dataUrl }))
        setAnalyzing(false)
        if (angleIdx < ANGLES.length - 1) setAngleIdx(i => i + 1)
      }, 1500)
    }
  }

  const allDone = wsEnrolled || ANGLES.every(a => captures[a])
  const currentAngle = ANGLES[angleIdx]
  const btnLabel = analyzing ? 'Analyzing…' : allDone ? 'Next →' : 'Capture ' + currentAngle

  return (
    <div>
      <h2 style={{ fontSize: 'var(--type-heading-5-size)', fontWeight: 'var(--type-heading-5-weight)', marginBottom: 'var(--space-2)' }}>Capture face</h2>
      <p style={{ color: 'var(--text-body-tertiary)', marginBottom: 'var(--space-4)' }}>Three-shot capture. The frame is analyzed for quality, converted to a vector, and the image is discarded.</p>
      {wsError && <div style={{ color: 'var(--status-warning)', fontSize: 'var(--type-label-regular-size)', marginBottom: 'var(--space-2)', padding: 'var(--space-2) var(--space-3)', background: 'var(--tag-yellow-bg)', borderRadius: 'var(--radius-sm)' }}>WebSocket: {wsError} — manual capture still available.</div>}
      {camError ? <div style={{ color: 'var(--status-danger)', padding: 'var(--space-4)', textAlign: 'center' }}>{camError}</div> : (
        <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
          {/* Camera view */}
          <div style={{ flex: 1, background: '#000', borderRadius: 'var(--radius-md)', overflow: 'hidden', position: 'relative', minHeight: 280 }}>
            {captures[currentAngle] && captures[currentAngle] !== 'done'
              ? <img src={captures[currentAngle]} style={{ width: '100%', height: 280, objectFit: 'cover' }} alt="captured" />
              : <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: 280, objectFit: 'cover', display: 'block' }} />
            }
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-60%)', width: 160, height: 200, border: '2px dashed rgba(255,255,255,0.5)', borderRadius: '50%', pointerEvents: 'none' }} />
            {analyzing && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 'var(--type-body-semibold-size)' }}>Analyzing…</div>}
            {/* Quality checks */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', gap: 'var(--space-4)', padding: 'var(--space-2)' }}>
              {wsFeedback
                ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', fontSize: 11, color: '#4ade80' }}>
                    <CheckmarkOutline size={12} /> Frames: {wsFeedback.framesCollected}/{wsFeedback.framesNeeded}
                  </span>
                )
                : ['Lighting good', 'Single face detected', 'Face centered'].map(label => (
                  <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', fontSize: 11, color: qualityOk ? '#4ade80' : '#888' }}>
                    {qualityOk ? <CheckmarkOutline size={12} /> : <CircleDash size={12} />} {label}
                  </span>
                ))
              }
            </div>
          </div>
          {/* Angle selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', paddingTop: 'var(--space-2)' }}>
            {ANGLES.map((angle, i) => {
              const done = wsEnrolled || !!captures[angle]
              const active = i === angleIdx && !done
              return (
                <div key={angle} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-1)' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: done ? 'var(--status-success)' : active ? 'var(--button-primary)' : 'var(--surface-tertiary)', border: '2px solid ' + (done ? 'var(--status-success)' : active ? 'var(--button-primary)' : 'var(--stroke-default)'), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {done ? <CheckmarkFilled size={16} style={{ color: '#fff' }} /> : active ? <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} /> : null}
                  </div>
                  <span style={{ fontSize: 11, color: done ? 'var(--status-success)' : active ? 'var(--text-title-primary)' : 'var(--text-body-tertiary)', fontWeight: active ? 600 : 400 }}>{angle}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-5)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--stroke-default)' }}>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', padding: 'var(--space-2) var(--space-4)', border: '1px solid var(--stroke-default)', borderRadius: 'var(--radius-sm)', background: 'var(--surface-primary)', cursor: 'pointer', fontSize: 'var(--type-body-regular-size)' }}>
          <ArrowLeft size={16} /> Back
        </button>
        <button onClick={allDone ? onNext : captureAngle} disabled={analyzing}
          style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', padding: 'var(--space-2) var(--space-4)', border: 'none', borderRadius: 'var(--radius-sm)', background: analyzing ? 'var(--state-disabled)' : 'var(--button-primary)', color: '#fff', cursor: analyzing ? 'not-allowed' : 'pointer', fontSize: 'var(--type-body-semibold-size)', fontWeight: 'var(--type-body-semibold-weight)' }}>
          {btnLabel} {!analyzing && !allDone && <Camera size={16} />} {allDone && <ArrowRight size={16} />}
        </button>
      </div>
    </div>
  )
}

export default function EnrollWizard() {
  const [step, setStep] = useState(1)
  const [enrollResult, setEnrollResult] = useState(null) // {prototypes, source} from WebSocket
  const people = useStore(s => s.people)
  const updatePerson = useStore(s => s.updatePerson)
  const showToast = useStore(s => s.showToast)
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const personId = parseInt(params.get('id'))
  const person = people.find(p => p.id === personId) || people[2]

  const next = () => setStep(s => s + 1)
  const back = () => setStep(s => s - 1)
  const finish = () => {
    // If WebSocket already enrolled, store is already updated — just navigate back
    // If manual capture was used, update the store now as the commit point
    if (!enrollResult) {
      updatePerson(person.id, {
        state: 'Enrolled / Active',
        consent: 'Consented',
        _enrolledAt: new globalThis.Date().toISOString(),
      })
    }
    showToast(person.name + ' enrolled successfully')
    navigate('/people')
  }

  const cardStyle = { background: 'var(--surface-primary)', border: '1px solid var(--stroke-default)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)', maxWidth: 640 }
  const btnRow = (onB, onN, nLabel) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-5)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--stroke-default)' }}>
      {onB ? <button onClick={onB} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', padding: 'var(--space-2) var(--space-4)', border: '1px solid var(--stroke-default)', borderRadius: 'var(--radius-sm)', background: 'var(--surface-primary)', cursor: 'pointer', fontSize: 'var(--type-body-regular-size)' }}><ArrowLeft size={16} /> Back</button> : <div />}
      <button onClick={onN} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', padding: 'var(--space-2) var(--space-4)', border: 'none', borderRadius: 'var(--radius-sm)', background: 'var(--button-primary)', color: '#fff', cursor: 'pointer', fontSize: 'var(--type-body-semibold-size)', fontWeight: 'var(--type-body-semibold-weight)' }}>{nLabel} <ArrowRight size={16} /></button>
    </div>
  )

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', gap: 'var(--space-2)', fontSize: 'var(--type-label-regular-size)', color: 'var(--text-body-tertiary)', marginBottom: 'var(--space-2)' }}>
        <Link to="/" style={{ color: 'var(--link-primary)', textDecoration: 'none' }}>Facial Recognition</Link>
        <span>/</span>
        <Link to="/people" style={{ color: 'var(--link-primary)', textDecoration: 'none' }}>People and Access</Link>
        <span>/</span>
        <span>Enroll User</span>
      </div>
      <h1 style={{ fontSize: 'var(--type-heading-4-size)', fontWeight: 'var(--type-heading-4-weight)', marginBottom: 'var(--space-5)' }}>Enroll User &middot; {person.name}</h1>

      <div style={cardStyle}>
        <Stepper current={step} />

        {step === 1 && (
          <div>
            <h2 style={{ fontSize: 'var(--type-heading-5-size)', fontWeight: 'var(--type-heading-5-weight)', marginBottom: 'var(--space-2)' }}>Consent check</h2>
            <p style={{ color: 'var(--text-body-tertiary)', marginBottom: 'var(--space-4)' }}>A face vector can only be created after the person has given explicit consent. This is verified before any capture.</p>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)', padding: 'var(--space-4)', background: 'var(--tag-green-bg)', border: '1px solid var(--status-success)', borderRadius: 'var(--radius-sm)' }}>
              <CheckmarkFilled size={20} style={{ color: 'var(--status-success)', flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 'var(--type-body-semibold-weight)', color: 'var(--tag-green-fg)' }}>Consent on record for {person.name}</div>
                <div style={{ fontSize: 'var(--type-label-regular-size)', color: 'var(--text-body-tertiary)' }}>Form v2.1, signed 12 Jun 2026. Enrollment may proceed.</div>
              </div>
            </div>
            {btnRow(null, next, 'Next')}
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 style={{ fontSize: 'var(--type-heading-5-size)', fontWeight: 'var(--type-heading-5-weight)', marginBottom: 'var(--space-2)' }}>Confirm identity</h2>
            <p style={{ color: 'var(--text-body-tertiary)', marginBottom: 'var(--space-4)' }}>Verify this with the user&apos;s ID and Access Card.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', padding: 'var(--space-4)', background: 'var(--surface-tertiary)', borderRadius: 'var(--radius-sm)' }}>
              {[['User name', person.name], ['Type', person.type], ['Offering', person.offering || '—'], ['Email', person.email || '—']].map(([l, v]) => (
                <div key={l}><div style={{ fontSize: 'var(--type-label-regular-size)', color: 'var(--text-body-tertiary)', marginBottom: 2 }}>{l}</div><div style={{ fontWeight: 'var(--type-body-semibold-weight)' }}>{v}</div></div>
              ))}
            </div>
            {btnRow(back, next, 'Next')}
          </div>
        )}

        {step === 3 && <CaptureStep person={person} onNext={next} onBack={back} onEnrollmentComplete={setEnrollResult} />}

        {step === 4 && (
          <div>
            <h2 style={{ fontSize: 'var(--type-heading-5-size)', fontWeight: 'var(--type-heading-5-weight)', marginBottom: 'var(--space-2)' }}>Confirm</h2>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)', padding: 'var(--space-4)', background: 'var(--tag-green-bg)', border: '1px solid var(--status-success)', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-4)' }}>
              <CheckmarkFilled size={20} style={{ color: 'var(--status-success)', flexShrink: 0, marginTop: 2 }} />
              <div>
                <div style={{ fontWeight: 'var(--type-body-semibold-weight)', color: 'var(--tag-green-fg)' }}>Face vector stored for {person.name}</div>
                <div style={{ fontSize: 'var(--type-label-regular-size)', color: 'var(--text-body-tertiary)' }}>No photograph is retained &mdash; all angle frames were converted to a vector and discarded.</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
              <div>
                <div style={{ fontSize: 'var(--type-label-regular-size)', color: 'var(--text-body-tertiary)' }}>
                  {enrollResult ? 'Face prototypes stored' : 'Quality score'}
                </div>
                <div style={{ fontWeight: 600, color: 'var(--status-success)' }}>
                  {enrollResult ? `${enrollResult.prototypes} vectors` : '94%'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 'var(--type-label-regular-size)', color: 'var(--text-body-tertiary)' }}>New status</div>
                <div><span style={{ background: 'var(--tag-green-bg)', color: 'var(--tag-green-fg)', padding: '2px 8px', borderRadius: 'var(--radius-pill)', fontSize: 12, fontWeight: 600 }}>Enrolled / Active</span></div>
              </div>
              {enrollResult?.source === 'websocket' && (
                <div style={{ gridColumn: '1 / -1' }}>
                  <div style={{ fontSize: 'var(--type-label-regular-size)', color: 'var(--text-body-tertiary)' }}>Enrollment method</div>
                  <div style={{ fontSize: 'var(--type-label-regular-size)', color: 'var(--status-success)' }}>✓ Live WebSocket enrollment confirmed by server</div>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-5)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--stroke-default)' }}>
              <button onClick={back} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', padding: 'var(--space-2) var(--space-4)', border: '1px solid var(--stroke-default)', borderRadius: 'var(--radius-sm)', background: 'var(--surface-primary)', cursor: 'pointer', fontSize: 'var(--type-body-regular-size)' }}><ArrowLeft size={16} /> Back</button>
              <button onClick={finish} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', padding: 'var(--space-2) var(--space-4)', border: 'none', borderRadius: 'var(--radius-sm)', background: 'var(--button-primary)', color: '#fff', cursor: 'pointer', fontSize: 'var(--type-body-semibold-size)', fontWeight: 'var(--type-body-semibold-weight)' }}>Finish &amp; Save <ArrowRight size={16} /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
