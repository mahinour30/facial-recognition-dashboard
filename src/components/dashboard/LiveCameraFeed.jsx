import { useState, useRef } from 'react';
import { Maximize2, Info, Camera } from 'lucide-react';

export default function LiveCameraFeed() {
  const [expanded, setExpanded]   = useState(false);
  const [status, setStatus]       = useState('idle'); // idle | streaming | denied | error
  const videoRef  = useRef(null);
  const streamRef = useRef(null);

  const requestCamera = async () => {
    setStatus('requesting');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: 1280, height: 720 },
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setStatus('streaming');
    } catch (err) {
      setStatus(err.name === 'NotAllowedError' ? 'denied' : 'error');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setStatus('idle');
  };

  const videoHeight = expanded ? 360 : 260;

  return (
    <div className="camera-feed">
      <div className="camera-feed__header">
        <div className="camera-feed__title">
          <span>Live Camera Feed</span>
          <span className="live-badge" style={{ color: status === 'streaming' ? '#22c55e' : '#9ca3af' }}>
            ● {status === 'streaming' ? 'Live' : 'Offline'}
          </span>
        </div>
        <div className="camera-feed__controls">
          {status === 'streaming' && (
            <button className="icon-btn" onClick={stopCamera} title="Stop camera" style={{ fontSize: 11, color: '#9ca3af' }}>
              Stop
            </button>
          )}
          <button className="icon-btn" onClick={() => setExpanded(!expanded)} title="Expand">
            <Maximize2 size={15} />
          </button>
        </div>
      </div>

      <div className="camera-feed__video" style={{ height: videoHeight }}>
        {/* Always-mounted video element — hidden until streaming */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            width: '100%', height: '100%', objectFit: 'cover', display: 'block',
            visibility: status === 'streaming' ? 'visible' : 'hidden',
            position: status === 'streaming' ? 'relative' : 'absolute',
          }}
        />

        {/* Overlay states */}
        {status !== 'streaming' && (
          <div className="camera-bg" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>

            {status === 'idle' && (
              <>
                <Camera size={32} color="rgba(255,255,255,0.4)" />
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, margin: 0 }}>
                  Camera is off
                </p>
                <button
                  onClick={requestCamera}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '8px 18px', borderRadius: 5, border: 'none',
                    background: '#007cb0', color: '#fff',
                    fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  <Camera size={15} /> Enable Camera
                </button>
              </>
            )}

            {status === 'requesting' && (
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, margin: 0 }}>
                Waiting for permission…
              </p>
            )}

            {status === 'denied' && (
              <>
                <p style={{ color: '#ef4444', fontSize: 13, margin: 0, fontWeight: 600 }}>
                  Camera permission denied
                </p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, margin: 0, textAlign: 'center' }}>
                  Allow camera access in your browser settings, then try again.
                </p>
                <button
                  onClick={requestCamera}
                  style={{ padding: '6px 14px', borderRadius: 4, border: '1px solid #555', background: 'transparent', color: '#ccc', fontSize: 12, cursor: 'pointer' }}
                >
                  Try again
                </button>
              </>
            )}

            {status === 'error' && (
              <>
                <p style={{ color: '#f59e0b', fontSize: 13, margin: 0 }}>⚠ Stream unavailable</p>
                <button
                  onClick={requestCamera}
                  style={{ padding: '6px 14px', borderRadius: 4, border: '1px solid #555', background: 'transparent', color: '#ccc', fontSize: 12, cursor: 'pointer' }}
                >
                  Retry
                </button>
              </>
            )}

            {/* Camera label */}
            <div style={{ position: 'absolute', top: 10, left: 12, fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>
              CAM-03 · 3rd Reception
            </div>
          </div>
        )}

        {/* Corner brackets when live */}
        {status === 'streaming' && (
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            <div className="camera-corner camera-corner--tl" />
            <div className="camera-corner camera-corner--tr" />
            <div className="camera-corner camera-corner--bl" />
            <div className="camera-corner camera-corner--br" />
            <div style={{ position: 'absolute', top: 10, left: 12, fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
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
