import { useState, useEffect } from 'react'

function pad(n) { return String(n).padStart(2, '0') }

export default function Footer() {
  const [time, setTime] = useState('--:--:--')
  useEffect(() => {
    const tick = () => {
      const d = new globalThis.Date()
      setTime(pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds()))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <footer>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: 'var(--space-3) var(--space-5)',
        background: 'var(--surface-primary)',
        borderTop: '1px solid var(--stroke-default)',
        fontSize: 'var(--font-size-0)', color: 'var(--text-body-primary)',
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--status-success)', display: 'inline-block' }} />
          System Status: Normal Operations
        </span>
        <span>Last sync: {time}</span>
      </div>
      <div style={{
        background: 'var(--surface-quaternary)',
        color: 'var(--text-title-secondary)',
        fontSize: 'var(--font-size-0)',
        padding: 'var(--space-2) var(--space-5)',
        display: 'flex', gap: 'var(--space-3)',
      }}>
        <span>Privacy notice</span><span>·</span>
        <span>About Deloitte</span><span>·</span>
        <span>Cookie Settings</span><span>·</span>
        <span>©2024 See terms of use for more information</span>
      </div>
    </footer>
  )
}
