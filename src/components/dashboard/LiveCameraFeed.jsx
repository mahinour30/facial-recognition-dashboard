import { useState, useRef, useEffect } from 'react';
import { Maximize2, Info } from 'lucide-react';

export default function LiveCameraFeed() {
  const [expanded, setExpanded]     = useState(false);
  const [camError, setCamError]     = useState(null);
  const [streaming, setStreaming]   = useState(false);
  const videoRef  = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment', width: 1280, height: 720 } })
      .then((stream) => {
        if (cancelled) { stream.getTracks().forEach(t => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setStreaming(true);
        }
      })
      .catch(() => {
        if (!cancelled) setCamError('Camera unavailable');
      });

    return () => {
      cancelled = true;
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    };
  }, []);

  const videoHeight = expanded ? 360 : 260;

  return (
    <div className="camera-feed">
      <div className="camera-feed__header">
        <div className="camera-feed__title">
          <span>Live Camera Feed</span>
          <span className="live-badge">● {camError ? 'Offline' : 'Live'}</span>
        </div>
        <div className="camera-feed__controls">
          <button className="icon-btn" onClick={() => setExpanded(!expanded)} title="Expand">
            <Maximize2 size={15} />
          </button>
        </div>
      </div>

      <div className="camera-feed__video" style={{ height: videoHeight }}>
        {camError ? (
          /* ── Offline state ── */
          <div className="camera-bg" style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8 }}>
            <span style={{ color: '#ef4444', fontSize: 13, fontWeight: 600 }}>⚠ Stream unavailable</span>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>CAM-03 · 3rd Reception</span>
          </div>
        ) : (
          /* ── Live camera ── */
          <div style={{ position: 'relative', width: '100%', height: '100%', background: '#000', overflow: 'hidden' }}>
            {/* Real camera video */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />

            {/* Face detection overlay — shown once streaming */}
            {streaming && (
              <div className="face-overlay">
                <div className="face-box">
                  <span className="face-label">Rafik Mikhail · 94%</span>
                </div>
              </div>
            )}

            {/* Corner brackets */}
            <div className="camera-corner camera-corner--tl" />
            <div className="camera-corner camera-corner--tr" />
            <div className="camera-corner camera-corner--bl" />
            <div className="camera-corner camera-corner--br" />

            {/* Camera label */}
            <div style={{
              position: 'absolute', top: 10, left: 12,
              fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: 600,
            }}>
              CAM-03 · 3rd Reception
            </div>
          </div>
        )}
      </div>

      <div className="camera-feed__notice">
        <Info size={13} style={{ color: '#26890d', flexShrink: 0 }} />
        <span>
          Live metrics reflect enrolled, consented users only.
          See coverage in People &amp; Access.
        </span>
      </div>
    </div>
  );
}
