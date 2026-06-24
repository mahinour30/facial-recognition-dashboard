import { API } from './config'

/**
 * Open a WebSocket enrollment session.
 *
 * @param {object} opts
 * @param {string}   opts.employeeId   - Unique employee identifier
 * @param {string}   opts.fullName     - Full display name
 * @param {HTMLVideoElement} opts.videoEl - Live video element to capture frames from
 * @param {function} opts.onFeedback   - Called with each feedback message {status, quality, framesCollected, framesNeeded}
 * @param {function} opts.onEnrolled   - Called with {employeeId, prototypes} on success
 * @param {function} opts.onError      - Called with error string on failure
 *
 * @returns {{ stop: function }} — call stop() to cancel enrollment
 */
export function startWsEnrollment({ employeeId, fullName, videoEl, onFeedback, onEnrolled, onError }) {
  const ws = new WebSocket(API.WS_ENROLL)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  let captureInterval = null
  let active = true

  const stopCapture = () => {
    if (captureInterval) { clearInterval(captureInterval); captureInterval = null }
  }

  const stop = () => {
    active = false
    stopCapture()
    if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) ws.close()
  }

  ws.onopen = () => {
    if (!active) return
    ws.send(JSON.stringify({ type: 'start', employee_id: employeeId, full_name: fullName }))
  }

  ws.onmessage = (event) => {
    if (!active) return
    let msg
    try { msg = JSON.parse(event.data) } catch { return }

    if (msg.type === 'ready') {
      captureInterval = setInterval(() => {
        if (!active || !videoEl || !videoEl.videoWidth) return
        canvas.width  = videoEl.videoWidth  || 640
        canvas.height = videoEl.videoHeight || 480
        ctx.drawImage(videoEl, 0, 0)
        const dataUrl = canvas.toDataURL('image/jpeg', 0.6)
        const base64  = dataUrl.split(',')[1]
        if (!base64) return
        // Skip oversized frames (>200KB base64 ≈ ~150KB binary)
        if (base64.length > 270_000) return
        ws.send(JSON.stringify({ type: 'frame', image: base64 }))
      }, 1500)

    } else if (msg.type === 'feedback') {
      onFeedback({
        status:           msg.status,
        quality:          msg.quality,
        framesCollected:  msg.frames_collected,
        framesNeeded:     msg.frames_needed,
      })

    } else if (msg.type === 'enrolled') {
      stopCapture()
      ws.close()
      onEnrolled({ employeeId: msg.employee_id, prototypes: msg.prototypes })

    } else if (msg.type === 'error') {
      stopCapture()
      ws.close()
      onError(msg.detail || 'Enrollment error')
    }
  }

  ws.onerror = () => {
    stopCapture()
    onError('WebSocket connection failed. Is the enrollment server running on localhost:8001?')
  }

  ws.onclose = () => { stopCapture() }

  return { stop }
}
