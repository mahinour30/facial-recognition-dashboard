import { useState } from 'react';
import { Expand } from 'lucide-react';

export default function LiveCameraFeed() {
  const [expired, setExpired] = useState(false);

  return (
    <div className="camera-feed">
      <div className="camera-feed__header">
        <div className="camera-feed__title">
          <span>Live Camera Feed</span>
          <span className="live-badge">● Live</span>
        </div>
        <div className="camera-feed__controls">
          {expired && <span className="expired-badge">Expired</span>}
          <button className="icon-btn" onClick={() => setExpired(!expired)}>
            <Expand size={14} />
          </button>
        </div>
      </div>
      <div className="camera-feed__video">
        {/* Simulated camera feed */}
        <div className="camera-bg">
          <div className="face-overlay">
            <div className="face-box">
              <span className="face-label">Rafik Mikhail 94%</span>
            </div>
          </div>
          <div className="camera-corner camera-corner--tl" />
          <div className="camera-corner camera-corner--tr" />
          <div className="camera-corner camera-corner--bl" />
          <div className="camera-corner camera-corner--br" />
        </div>
      </div>
      <div className="camera-feed__notice">
        <span className="notice-icon">●</span>
        <span>Live metrics reflect enrolled, consented users only. See coverage in People &amp; Access.</span>
      </div>
    </div>
  );
}
