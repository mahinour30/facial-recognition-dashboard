import { API } from './config'

/**
 * Search for a single face embedding against all enrolled employees.
 * @param {string}   cameraId     - Camera identifier e.g. "cam1"
 * @param {number[]} vector       - 512-dim float32 embedding array
 * @param {number}   [qualityScore] - Optional quality score 0.0–1.0
 * @returns {Promise<{identity: string, employee_id: string|null, distance: number, confidence: number, refined: boolean}>}
 */
export async function searchFace(cameraId, vector, qualityScore) {
  const body = { camera_id: cameraId, vector }
  if (qualityScore !== undefined) body.quality_score = qualityScore

  const res = await fetch(`${API.SEARCH_BASE}/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail || 'Search failed')
  }

  return res.json()
}

/**
 * Search for multiple face embeddings in one request.
 * @param {string}     cameraId       - Camera identifier
 * @param {number[][]} vectors        - Array of 512-dim embeddings
 * @param {number[]}   [qualityScores] - Quality score per vector
 * @returns {Promise<Array<{identity: string, employee_id: string|null, distance: number, confidence: number, refined: boolean}>>}
 */
export async function searchBatch(cameraId, vectors, qualityScores) {
  const body = { camera_id: cameraId, vectors }
  if (qualityScores) body.quality_scores = qualityScores

  const res = await fetch(`${API.SEARCH_BASE}/search_batch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail || 'Batch search failed')
  }

  return res.json()
}
