import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowLeft, ArrowRight } from 'lucide-react';

/* ---- Step definitions (Figma: Consent → Identity → Capture → Confirm) ---- */
const STEPS = [
  { id: 1, label: 'Consent' },
  { id: 2, label: 'Identity' },
  { id: 3, label: 'Capture' },
  { id: 4, label: 'Confirm' },
];

/* ---- Step indicator ---- */
function StepIndicator({ current }) {
  return (
    <div className="step-indicator">
      {STEPS.map((step, idx) => {
        const done   = step.id < current;
        const active = step.id === current;
        return (
          <div key={step.id} className="step-indicator__item">
            <div
              className={`step-circle${done ? ' step-circle--done' : active ? ' step-circle--active' : ''}`}
            >
              {done ? <CheckCircle2 size={14} /> : step.id}
            </div>
            <span className={`step-label${active ? ' step-label--active' : ''}`}>
              {step.label}
            </span>
            {idx < STEPS.length - 1 && (
              <div className={`step-line${done ? ' step-line--done' : ''}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ===== STEP 1: Consent ===== */
function ConsentStep({ onNext }) {
  return (
    <div className="enroll-step">
      <h2 className="enroll-step__title">Consent check</h2>
      <p className="enroll-step__desc">
        A face vector can only be created after the person has given explicit consent.
        This is verified before any capture.
      </p>
      <div className="consent-record">
        <CheckCircle2 size={20} color="#1f6f0e" style={{ flexShrink: 0 }} />
        <div>
          <div className="consent-record__title">
            Consent on record for Kareem Shukry
          </div>
          <div className="consent-record__meta">
            Form v2.1, signed 12 Jun 2024. Enrolment may proceed.
          </div>
        </div>
      </div>
      <div className="enroll-step__actions">
        <div />
        <button className="btn btn--primary" onClick={onNext}>
          Next <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

/* ===== STEP 2: Identity ===== */
function IdentityStep({ onNext, onBack }) {
  return (
    <div className="enroll-step">
      <h2 className="enroll-step__title">Confirm identity</h2>
      <p className="enroll-step__desc">
        Verify this with the user's ID and Access Card before proceeding.
      </p>
      <div className="identity-grid">
        {[
          ['User name',   'Omar Farouk'],
          ['Employee ID', '20230594'],
          ['Type',        'Employee'],
          ['Offering',    'Customer'],
          ['Email',       'ofarouk@deloitte.com'],
          ['Manager',     'Sara Khalil'],
        ].map(([label, value]) => (
          <div className="identity-field" key={label}>
            <div className="identity-field__label">{label}</div>
            <div className="identity-field__value">{value}</div>
          </div>
        ))}
      </div>
      <div className="enroll-step__actions">
        <button className="btn btn--outline" onClick={onBack}>
          <ArrowLeft size={14} /> Back
        </button>
        <button className="btn btn--primary" onClick={onNext}>
          Next <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

/* ===== STEP 3: Capture ===== */
function CaptureStep({ onNext, onBack }) {
  const [activeAngle, setActiveAngle] = useState('Front');
  const [captured, setCaptured]       = useState({ Front: false, Left: false, Right: false });

  const handleCapture = () => {
    setCaptured(prev => ({ ...prev, [activeAngle]: true }));
    const angles = ['Front', 'Left', 'Right'];
    const nextIdx = angles.indexOf(activeAngle) + 1;
    if (nextIdx < angles.length) setActiveAngle(angles[nextIdx]);
  };

  const allCaptured = Object.values(captured).every(Boolean);

  return (
    <div className="enroll-step">
      <h2 className="enroll-step__title">Capture face</h2>
      <p className="enroll-step__desc">
        Three-shot capture: Front, Left, and Right angles.
        The frame is analyzed for quality, converted to a vector, and the image is discarded.
      </p>

      <div className="capture-layout">
        {/* Angle selector */}
        <div className="angle-selector">
          {['Front', 'Left', 'Right'].map(angle => (
            <button
              key={angle}
              className={`angle-btn${activeAngle === angle ? ' angle-btn--active' : ''}`}
              onClick={() => setActiveAngle(angle)}
            >
              {captured[angle] && <CheckCircle2 size={14} style={{ marginRight: 4 }} />}
              {angle}
            </button>
          ))}
        </div>

        {/* Camera view */}
        <div className="camera-view">
          <div className="face-outline" />
          <div className="capture-status">
            <span className="capture-check">✓ Lighting good</span>
            <span className="capture-check">✓ Single face detected</span>
            <span style={{ color: captured[activeAngle] ? '#43b02a' : '#a1a1a1' }}>
              {captured[activeAngle] ? '✓ Captured' : '↺ Align face'}
            </span>
          </div>
          {/* Angle label */}
          <div style={{
            position: 'absolute',
            top: 10, left: 12,
            fontSize: 11,
            color: 'rgba(255,255,255,0.7)',
            fontWeight: 600,
          }}>
            {activeAngle} View
          </div>
          {/* Capture button */}
          <button
            onClick={handleCapture}
            style={{
              position: 'absolute',
              bottom: 10,
              right: 12,
              background: '#007cb0',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              padding: '4px 12px',
              fontSize: 12,
              cursor: 'pointer',
              fontWeight: 600,
              fontFamily: 'inherit',
            }}
          >
            Capture
          </button>
        </div>
      </div>

      <div className="enroll-step__actions">
        <button className="btn btn--outline" onClick={onBack}>
          <ArrowLeft size={14} /> Back
        </button>
        <button
          className="btn btn--primary"
          onClick={onNext}
          disabled={!allCaptured}
          style={{ opacity: allCaptured ? 1 : 0.5 }}
        >
          Next <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

/* ===== STEP 4: Confirm ===== */
function ConfirmStep({ onBack, onFinish }) {
  return (
    <div className="enroll-step">
      <h2 className="enroll-step__title">Enrollment Complete</h2>
      <p className="enroll-step__desc">
        Omar Farouk has been successfully enrolled in the facial recognition system.
      </p>
      <div className="confirm-success">
        <CheckCircle2 size={56} color="#26890d" />
        <p>
          Face vector created and stored securely.
          The captured image has been discarded per data retention policy.
        </p>
        <div style={{
          background: '#e6f9e1',
          border: '1px solid #b7eaab',
          borderRadius: 4,
          padding: '12px 20px',
          fontSize: 13,
          color: '#1f6f0e',
          fontWeight: 600,
          width: '100%',
          maxWidth: 340,
          textAlign: 'left',
        }}>
          <div>User: Omar Farouk</div>
          <div style={{ marginTop: 4, fontWeight: 400, color: '#53565a' }}>
            Status: <strong style={{ color: '#1f6f0e' }}>Enrolled / Active</strong>
          </div>
        </div>
      </div>
      <div className="enroll-step__actions">
        <button className="btn btn--outline" onClick={onBack}>
          <ArrowLeft size={14} /> Back
        </button>
        <button className="btn btn--primary" onClick={onFinish}>
          Finish
        </button>
      </div>
    </div>
  );
}

/* ===== Main EnrollUser page ===== */
export default function EnrollUser() {
  const [step, setStep] = useState(1);
  const navigate        = useNavigate();

  const next   = () => setStep(s => Math.min(s + 1, 4));
  const back   = () => setStep(s => Math.max(s - 1, 1));
  const finish = () => navigate('/people');

  return (
    <div className="page">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/">Facial Recognition</Link>
        <span>/</span>
        <Link to="/people">People and Access</Link>
        <span>/</span>
        <span>Enroll User</span>
      </div>

      <h1 className="page-title">Enroll User — Omar Farouk</h1>

      <div className="enroll-card">
        <StepIndicator current={step} />
        <div className="enroll-body">
          {step === 1 && <ConsentStep  onNext={next} />}
          {step === 2 && <IdentityStep onNext={next} onBack={back} />}
          {step === 3 && <CaptureStep  onNext={next} onBack={back} />}
          {step === 4 && <ConfirmStep  onBack={back} onFinish={finish} />}
        </div>
      </div>
    </div>
  );
}
