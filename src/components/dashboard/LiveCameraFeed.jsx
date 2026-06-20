import { useState } from 'react';
import { Maximize2, Info } from 'lucide-react';

export default function LiveCameraFeed() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="camera-feed">
      <div className="camera-feed__header">
        <div className="camera-feed__title">
          <span>Live Camera Feed</span>
          <span className="live-badge">● Live</span>
        </div>
        <div className="camera-feed__controls">
          <button className="icon-btn" onClick={() => setExpanded(!expanded)} title="Expand">
            <Maximize2 size={15} />
          </button>
        </div>
      </div>
      <div className="camera-feed__video" style={{ height: expanded ? 360 : 260 }}>
        <div className="camera-bg">
          <div className="face-overlay">
            <div className="face-box">
              <span className="face-label">Rafik Mikhail · 94%</span>
            </div>
          </div>
          <div className="camera-corner camera-corner--tl" />
          <div className="camera-corner camera-corner--tr" />
          <div className="camera-corner camera-corner--bl" />
          <div className="camera-corner camera-corner--br" />
          {/* Camera label overlay */}
          <div style={{
            position: 'absolute',
            top: 10,
            left: 12,
            fontSize: 11,
            color: 'rgba(255,255,255,0.7)',
            fontWeight: 600,
          }}>
            CAM-03 · 3rd Reception
          </div>
        </div>
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
