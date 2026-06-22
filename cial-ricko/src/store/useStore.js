import { create } from 'zustand'
import { PEOPLE_SEED } from '../data/peopleSeed'
import { ALERTS_SEED } from '../data/alertsSeed'
import { ACCESS_LOG_SEED } from '../data/accessLogSeed'

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
}))
