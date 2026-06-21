import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowLeft, ArrowRight, Check } from 'lucide-react';

/* ---- Step definitions (Figma: Consent → Identity → Capture → Confirm) ---- */
const STEPS = [
  { id: 1, label: 'Consent' },
  { id: 2, label: 'Identity' },
  { id: 3, label: 'Capture' },
  { id: 4, label: 'Confirm' },
];

const ANGLES = ['front', 'left', 'right'];

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
  const [activeAngle, setActiveAngle] = useState('front');
  const [photos, setPhotos] = useState({ front: null, left: null, right: null });
  const [previewAngle, setPreviewAngle] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [faceCentered, setFaceCentered] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Start camera on mount
  useEffect(() => {
    let cancelled = false;

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'user', width: 1280, height: 720 } })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(() => {
        if (!cancelled) {
          setCameraError('Camera access denied. Please allow camera access and reload.');
        }
      });

    return () => {
      cancelled = true;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  // Mock "face centered" after 2 seconds whenever we're on a new angle
  useEffect(() => {
    setFaceCentered(false);
    const timer = setTimeout(() => setFaceCentered(true), 2000);
    return () => clearTimeout(timer);
  }, [activeAngle]);

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return null;
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.9);
  };

  const handleNext = () => {
    const allDone = ANGLES.every((a) => photos[a]);

    if (allDone) {
      onNext();
      return;
    }

    const dataUrl = capturePhoto();
    setPhotos((prev) => ({ ...prev, [activeAngle]: dataUrl }));

    const currentIdx = ANGLES.indexOf(activeAngle);
    const nextIdx = currentIdx + 1;

    if (nextIdx < ANGLES.length) {
      setActiveAngle(ANGLES[nextIdx]);
      setPreviewAngle(null);
    }
  };

  const handleAngleClick = (angle) => {
    if (photos[angle]) {
      setPreviewAngle(angle === previewAngle ? null : angle);
    }
  };

  const allDone = ANGLES.every((a) => photos[a]);

  const angleLabel = (a) => a.charAt(0).toUpperCase() + a.slice(1);

  const nextBtnLabel = () => {
    if (allDone) return 'Next';
    return `Capture ${angleLabel(activeAngle)}`;
  };

  const getAngleState = (angle) => {
    if (photos[angle]) return 'done';
    if (angle === activeAngle) return 'active';
    return 'pending';
  };

  const displayedPhoto = previewAngle ? photos[previewAngle] : photos[activeAngle];
  const showPhoto = !!displayedPhoto && (previewAngle !== null || photos[activeAngle]);

  return (
    <div className="enroll-step">
      <h2 className="enroll-step__title">Capture face</h2>
      <p className="enroll-step__desc">
        Three-shot capture: Front, Left, and Right angles.
        The frame is analyzed for quality, converted to a vector, and the image is discarded.
      </p>

      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <div className="capture-layout">
        {/* Camera / photo view */}
        <div className="capture-camera-wrap">
          {cameraError ? (
            <div className="capture-error">{cameraError}</div>
          ) : (
            <>
              {showPhoto ? (
                <img
                  src={displayedPhoto}
                  alt={`${activeAngle} capture`}
                  className="capture-photo-preview"
                />
              ) : (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="capture-video"
                />
              )}

              {/* Oval guide — always visible unless photo overlay covering */}
              {!showPhoto && <div className="capture-oval" />}

              {/* Green done overlay when showing captured photo */}
              {showPhoto && (
                <div className="capture-done-overlay">
                  <Check size={48} color="#fff" strokeWidth={3} />
                </div>
              )}

              {/* Status bar */}
              <div className="capture-status-bar">
                <span className="capture-status-item capture-status-item--ok">
                  ✓ Lighting good
                </span>
                <span className="capture-status-item capture-status-item--ok">
                  ✓ Single face detected
                </span>
                <span
                  className={`capture-status-item ${
                    faceCentered
                      ? 'capture-status-item--ok'
                      : 'capture-status-item--pending'
                  }`}
                >
                  {faceCentered ? '✓' : '↺'} Face centered
                </span>
              </div>
            </>
          )}
        </div>

        {/* Angle selector column */}
        <div className="capture-angles">
          {ANGLES.map((angle) => {
            const state = getAngleState(angle);
            return (
              <div
                key={angle}
                className="angle-item"
                onClick={() => handleAngleClick(angle)}
                title={photos[angle] ? `View ${angleLabel(angle)} capture` : undefined}
              >
                <div className={`angle-circle angle-circle--${state}`}>
                  {state === 'active' && <div className="angle-circle__dot" />}
                  {state === 'done' && <Check size={18} color="#fff" />}
                </div>
                <span
                  className={`angle-label${
                    state === 'active'
                      ? ' angle-label--active'
                      : state === 'done'
                      ? ' angle-label--done'
                      : ''
                  }`}
                >
                  {angleLabel(angle)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="enroll-step__actions">
        <button className="btn btn--outline" onClick={onBack}>
          <ArrowLeft size={14} /> Back
        </button>
        <button
          className="btn btn--primary"
          onClick={handleNext}
          disabled={!!cameraError && !allDone}
        >
          {nextBtnLabel()} {!allDone && <ArrowRight size={14} />}
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
