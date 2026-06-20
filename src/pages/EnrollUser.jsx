import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowLeft, ArrowRight, Camera } from 'lucide-react';

const STEPS = [
  { id: 1, label: 'Consent' },
  { id: 2, label: 'Identity' },
  { id: 3, label: 'Capture' },
  { id: 4, label: 'Confirm' },
];

function StepIndicator({ current }) {
  return (
    <div className="step-indicator">
      {STEPS.map((step, idx) => {
        const done = step.id < current;
        const active = step.id === current;
        return (
          <div key={step.id} className="step-indicator__item">
            <div className={`step-circle ${done ? 'step-circle--done' : active ? 'step-circle--active' : ''}`}>
              {done ? <CheckCircle size={16} /> : step.id}
            </div>
            <span className={`step-label ${active ? 'step-label--active' : ''}`}>{step.label}</span>
            {idx < STEPS.length - 1 && <div className={`step-line ${done ? 'step-line--done' : ''}`} />}
          </div>
        );
      })}
    </div>
  );
}

function ConsentStep({ onNext }) {
  return (
    <div className="enroll-step">
      <h2 className="enroll-step__title">Consent check</h2>
      <p className="enroll-step__desc">A face vector can only be created after the person has given explicit consent. This is verified before any capture.</p>
      <div className="consent-record">
        <CheckCircle size={18} color="#22c55e" />
        <div>
          <div className="consent-record__title">Consent on record for Kareem Shukry</div>
          <div className="consent-record__meta">Form v2.1, signed 12 Jun 2024. Enrolment may proceed.</div>
        </div>
      </div>
      <div className="enroll-step__actions">
        <div />
        <button className="btn btn--primary" onClick={onNext}>Next <ArrowRight size={14} /></button>
      </div>
    </div>
  );
}

function IdentityStep({ onNext, onBack }) {
  return (
    <div className="enroll-step">
      <h2 className="enroll-step__title">Confirm identity</h2>
      <p className="enroll-step__desc">Verify this with the user's ID and Access Card.</p>
      <div className="identity-grid">
        <div className="identity-field">
          <div className="identity-field__label">User name</div>
          <div className="identity-field__value">Omar Farouk</div>
        </div>
        <div className="identity-field">
          <div className="identity-field__label">Type</div>
          <div className="identity-field__value">Employee</div>
        </div>
        <div className="identity-field">
          <div className="identity-field__label">Offering</div>
          <div className="identity-field__value">Customer</div>
        </div>
        <div className="identity-field">
          <div className="identity-field__label">Email</div>
          <div className="identity-field__value">ofarouk@deloitte.com</div>
        </div>
      </div>
      <div className="enroll-step__actions">
        <button className="btn btn--outline" onClick={onBack}><ArrowLeft size={14} /> Back</button>
        <button className="btn btn--primary" onClick={onNext}>Next <ArrowRight size={14} /></button>
      </div>
    </div>
  );
}

function CaptureStep({ onNext, onBack }) {
  const [activeAngle, setActiveAngle] = useState('Front');
  return (
    <div className="enroll-step">
      <h2 className="enroll-step__title">Capture face</h2>
      <p className="enroll-step__desc">Three-shot capture. The frame is analyzed for quality, converted to a vector, and the image is discarded.</p>
      <div className="capture-layout">
        <div className="angle-selector">
          {['Front', 'Left', 'Right'].map(angle => (
            <button
              key={angle}
              className={`angle-btn ${activeAngle === angle ? 'angle-btn--active' : ''}`}
              onClick={() => setActiveAngle(angle)}
            >
              {angle}
            </button>
          ))}
        </div>
        <div className="camera-view">
          <div className="face-outline" />
          <div className="capture-status">
            <span className="capture-check">✓ Lighting good</span>
            <span className="capture-check">✓ Single face detected</span>
            <span className="capture-check">↺ Face centered</span>
          </div>
        </div>
      </div>
      <div className="enroll-step__actions">
        <button className="btn btn--outline" onClick={onBack}><ArrowLeft size={14} /> Back</button>
        <button className="btn btn--primary" onClick={onNext}>Next <ArrowRight size={14} /></button>
      </div>
    </div>
  );
}

function ConfirmStep({ onBack, onFinish }) {
  return (
    <div className="enroll-step">
      <h2 className="enroll-step__title">Enrollment Complete</h2>
      <p className="enroll-step__desc">Omar Farouk has been successfully enrolled in the facial recognition system.</p>
      <div className="confirm-success">
        <CheckCircle size={48} color="#22c55e" />
        <p>Face vector created and stored securely. The image has been discarded.</p>
      </div>
      <div className="enroll-step__actions">
        <button className="btn btn--outline" onClick={onBack}><ArrowLeft size={14} /> Back</button>
        <button className="btn btn--primary" onClick={onFinish}>Finish</button>
      </div>
    </div>
  );
}

export default function EnrollUser() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const next = () => setStep(s => Math.min(s + 1, 4));
  const back = () => setStep(s => Math.max(s - 1, 1));
  const finish = () => navigate('/people');

  return (
    <div className="page">
      <div className="breadcrumb">
        <Link to="/">Facial Recognition</Link>
        <span>/</span>
        <Link to="/people">People and Access</Link>
        <span>/</span>
        <span>Enroll User</span>
      </div>
      <h1 className="page-title">Enroll User - Omar Farouk</h1>
      <div className="enroll-card">
        <StepIndicator current={step} />
        <div className="enroll-body">
          {step === 1 && <ConsentStep onNext={next} />}
          {step === 2 && <IdentityStep onNext={next} onBack={back} />}
          {step === 3 && <CaptureStep onNext={next} onBack={back} />}
          {step === 4 && <ConfirmStep onBack={back} onFinish={finish} />}
        </div>
      </div>
    </div>
  );
}
