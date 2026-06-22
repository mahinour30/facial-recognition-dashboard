import { useState } from 'react'
import { DotMark, Maximize } from '@carbon/icons-react'

export default function CameraFeed() {
  const [offline, setOffline] = useState(false)

  return (
    <div style={{ background: 'var(--surface-primary)', border: '1px solid var(--stroke-default)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--stroke-default)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--type-body-semibold-size)', fontWeight: 'var(--type-body-semibold-weight)' }}>
          Live Camera Feed
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--type-label-regular-size)', color: 'var(--status-success)' }}>
            <DotMark size={12} /> Live
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <button onClick={() => setOffline(o => !o)} style={{ fontSize: 11, background: 'var(--surface-tertiary)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '2px 8px', cursor: 'pointer', color: 'var(--text-body-tertiary)' }}>
            {offline ? 'Restore' : 'Simulate offline'}
          </button>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-body-tertiary)', display: 'flex' }}>
            <Maximize size={16} />
          </button>
        </div>
      </div>

      {/* Video area */}
      <div style={{ height: 240, position: 'relative', background: '#0d1929' }}>
        {offline ? (
          <div style={{ inset: 0, position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-body-secondary)', gap: 'var(--space-2)' }}>
            <DotMark size={24} style={{ color: 'var(--status-danger)' }} />
            <span style={{ fontSize: 'var(--type-body-regular-size)' }}>Stream unavailable</span>
            <span style={{ fontSize: 'var(--type-label-regular-size)', color: 'var(--text-body-tertiary)' }}>CAM-03 · 3rd Reception</span>
          </div>
        ) : (
          <>
            {/* Simulated office background gradient */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg,#0d1929 0%,#1a3a5c 55%,#0d2a40 100%)' }} />
            {/* Face detection box */}
            <div style={{ position: 'absolute', top: '20%', left: '35%', width: 110, height: 140, border: '2px solid var(--status-success)', borderRadius: 2 }}>
              <span style={{ position: 'absolute', bottom: -26, left: '50%', transform: 'translateX(-50%)', background: 'var(--status-success)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 'var(--radius-sm)', whiteSpace: 'nowrap' }}>
                Rafik Mikhail · 94%
              </span>
            </div>
            {/* Corner brackets */}
            {[['0%','0%','2px 0 0 2px'],['0%','auto','2px 2px 0 0'],['auto','0%','0 0 2px 2px'],['auto','auto','0 2px 2px 0']].map(([t,l,b],i)=>(
              <div key={i} style={{ position:'absolute', width:16, height:16, top: t==='auto'?undefined:'12px', bottom: t==='auto'?'12px':undefined, left: l==='auto'?undefined:'12px', right: l==='auto'?'12px':undefined, borderColor:'rgba(255,255,255,0.3)', borderStyle:'solid', borderWidth:b }} />
            ))}
          </>
        )}
      </div>

      {/* Notice */}
      <div style={{ padding: 'var(--space-2) var(--space-4)', background: 'var(--surface-tertiary)', fontSize: 'var(--type-label-regular-size)', color: 'var(--text-body-tertiary)', display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
        <DotMark size={8} style={{ color: 'var(--status-success)', flexShrink: 0 }} />
        Live metrics reflect enrolled, consented users only. See coverage in People & Access.
      </div>
    </div>
  )
}
