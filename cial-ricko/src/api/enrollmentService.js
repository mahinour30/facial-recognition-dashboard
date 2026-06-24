import { API } from './config'

/**
 * Enroll an employee using one or more face image files.
 * @param {string} employeeId  - Unique ID e.g. "E001"
 * @param {string} fullName    - Full display name
 * @param {File[]} imageFiles  - Array of File objects (JPEG/PNG, max 10MB each)
 * @returns {Promise<{status: string, employee_id: string, prototypes: number}>}
 */
export async function enrollFromFiles(employeeId, fullName, imageFiles) {
  const formData = new FormData()
  formData.append('employee_id', employeeId)
  formData.append('full_name', fullName)
  imageFiles.forEach(file => formData.append('files', file))

  const res = await fetch(`${API.ENROLLMENT_BASE}/create_employee`, {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail || 'Enrollment failed')
  }

  return res.json()
}

/**
 * Enroll an employee using a video file.
 * @param {string} employeeId
 * @param {string} fullName
 * @param {File} videoFile - MP4/AVI, max 50MB
 * @returns {Promise<{status: string, employee_id: string, prototypes: number}>}
 */
export async function enrollFromVideo(employeeId, fullName, videoFile) {
  const formData = new FormData()
  formData.append('employee_id', employeeId)
  formData.append('full_name', fullName)
  formData.append('file', videoFile)

  const res = await fetch(`${API.ENROLLMENT_BASE}/enroll_video`, {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail || 'Video enrollment failed')
  }

  return res.json()
}
