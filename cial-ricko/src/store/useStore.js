import { create } from 'zustand'
import { PEOPLE_SEED } from '../data/peopleSeed'
import { ALERTS_SEED } from '../data/alertsSeed'
import { ACCESS_LOG_SEED } from '../data/accessLogSeed'
import { enrollFromFiles, enrollFromVideo } from '../api/enrollmentService'
import { startWsEnrollment } from '../api/wsEnrollment'
import { searchFace, searchBatch } from '../api/searchService'

export const useStore = create((set) => ({
  people: PEOPLE_SEED,
  alerts: ALERTS_SEED,
  accessLog: ACCESS_LOG_SEED,
  ui: {
    sidebarCollapsed: false,
    activeRoute: '/',
    selectedRows: [],
    openModal: null,
    filters: {},
    toast: null,
  },
  toggleSidebar: () => set(s => ({ ui: { ...s.ui, sidebarCollapsed: !s.ui.sidebarCollapsed } })),
  setRoute: (route) => set(s => ({ ui: { ...s.ui, activeRoute: route } })),
  setSelectedRows: (ids) => set(s => ({ ui: { ...s.ui, selectedRows: ids } })),
  setOpenModal: (modal) => set(s => ({ ui: { ...s.ui, openModal: modal } })),
  closeModal: () => set(s => ({ ui: { ...s.ui, openModal: null } })),
  showToast: (msg) => {
    set(s => ({ ui: { ...s.ui, toast: msg } }))
    setTimeout(() => set(s => ({ ui: { ...s.ui, toast: null } })), 3000)
  },
  updatePerson: (id, patch) => set(s => ({ people: s.people.map(p => p.id === id ? { ...p, ...patch } : p) })),
  addPerson: (person) => set(s => ({ people: [...s.people, { ...person, id: s.people.length + 100 }] })),
  deletePerson: (id) => set(s => ({ people: s.people.filter(p => p.id !== id) })),
  updateAlert: (id, patch) => set(s => ({ alerts: s.alerts.map(a => a.id === id ? { ...a, ...patch } : a) })),

  // ─── API: Enrollment ────────────────────────────────────────────────────────

  /**
   * Enroll a person via live WebSocket camera stream.
   * Wires the WebSocket session; feedback/completion handled via callbacks.
   * Does NOT mutate store state — caller updates person record on onEnrolled.
   *
   * @param {object} opts
   * @param {string}   opts.employeeId
   * @param {string}   opts.fullName
   * @param {HTMLVideoElement} opts.videoEl
   * @param {function} opts.onFeedback   ({status, quality, framesCollected, framesNeeded}) => void
   * @param {function} opts.onEnrolled   ({employeeId, prototypes}) => void — store caller should call updatePerson here
   * @param {function} opts.onError      (errorMessage: string) => void
   * @returns {{ stop: function }} controller — call stop() to cancel
   */
  startLiveEnrollment: (opts) => startWsEnrollment(opts),

  /**
   * Enroll a person from uploaded image files.
   * On success, marks person as Enrolled / Active in the store.
   *
   * @param {number}   personStoreId - internal store id to update on success
   * @param {string}   employeeId    - backend employee_id
   * @param {string}   fullName
   * @param {File[]}   files
   */
  enrollFromFiles: async (personStoreId, employeeId, fullName, files) => {
    const result = await enrollFromFiles(employeeId, fullName, files)
    // Update local store record on success — UI reads from store, not API
    set(s => ({
      people: s.people.map(p =>
        p.id === personStoreId
          ? { ...p, state: 'Enrolled / Active', consent: 'Consented', _prototypes: result.prototypes }
          : p
      ),
    }))
    return result
  },

  /**
   * Enroll a person from an uploaded video file.
   * On success, marks person as Enrolled / Active in the store.
   *
   * @param {number}   personStoreId
   * @param {string}   employeeId
   * @param {string}   fullName
   * @param {File}     videoFile
   */
  enrollFromVideo: async (personStoreId, employeeId, fullName, videoFile) => {
    const result = await enrollFromVideo(employeeId, fullName, videoFile)
    set(s => ({
      people: s.people.map(p =>
        p.id === personStoreId
          ? { ...p, state: 'Enrolled / Active', consent: 'Consented', _prototypes: result.prototypes }
          : p
      ),
    }))
    return result
  },

  // ─── API: Search ─────────────────────────────────────────────────────────────

  /**
   * Search for a face embedding. Returns raw API result.
   * Store is NOT mutated — caller decides what to do with result.
   * Typically called by the live camera feed or access log pipeline.
   *
   * @param {string}   cameraId
   * @param {number[]} vector       - 512-dim embedding
   * @param {number}   [quality]    - optional quality score
   * @returns {Promise<{identity, employee_id, distance, confidence, refined}>}
   */
  searchFace: (cameraId, vector, quality) => searchFace(cameraId, vector, quality),

  /**
   * Batch search multiple face embeddings. Returns raw API result array.
   *
   * @param {string}     cameraId
   * @param {number[][]} vectors
   * @param {number[]}   [qualityScores]
   * @returns {Promise<Array<{identity, employee_id, distance, confidence, refined}>>}
   */
  searchBatch: (cameraId, vectors, qualityScores) => searchBatch(cameraId, vectors, qualityScores),
}))
