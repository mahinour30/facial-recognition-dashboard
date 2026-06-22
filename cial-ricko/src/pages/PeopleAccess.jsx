import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { applyAction } from '../lib/stateMachine'
import CoverageCards from '../components/people/CoverageCards'
import RosterTable from '../components/people/RosterTable'
import { RequestConsentModal, InviteModal, DeleteModal } from '../components/people/ConfirmModal'
import UserDetails from '../components/people/UserDetails'
import AddUserModal from '../components/people/AddUserModal'

export default function PeopleAccess() {
  const people = useStore(s => s.people)
  const updatePerson = useStore(s => s.updatePerson)
  const deletePerson = useStore(s => s.deletePerson)
  const selected = useStore(s => s.ui.selectedRows)
  const setSelectedRows = useStore(s => s.setSelectedRows)
  const showToast = useStore(s => s.showToast)
  const navigate = useNavigate()

  const [modal, setModal] = useState(null) // null | {type, ids}
  const [viewPerson, setViewPerson] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [coverFilter, setCoverFilter] = useState(null)

  const handleAction = (actionType, ids) => {
    if (actionType === 'requestConsent') return setModal({ type: 'consent', ids })
    if (actionType === 'invite')         return setModal({ type: 'invite', ids })
    if (actionType === 'delete')         return setModal({ type: 'delete', ids })
    if (actionType === 'enroll' || actionType === 'reenroll') {
      const id = ids[0]
      navigate('/people/enroll?id=' + id)
      return
    }
    // Other actions: apply state machine directly
    const patch = applyAction({ }, actionType)
    if (patch) ids.forEach(id => updatePerson(id, patch))
    showToast('Action applied')
    setSelectedRows([])
  }

  const confirmConsent = () => {
    modal.ids.forEach(id => updatePerson(id, applyAction({}, 'requestConsent')))
    showToast('Consent request sent to ' + modal.ids.length + ' person(s)')
    setModal(null); setSelectedRows([])
  }
  const confirmInvite = () => {
    modal.ids.forEach(id => updatePerson(id, applyAction({}, 'invite')))
    showToast('Invite sent to ' + modal.ids.length + ' person(s)')
    setModal(null); setSelectedRows([])
  }
  const confirmDelete = () => {
    modal.ids.forEach(id => deletePerson(id))
    showToast(modal.ids.length + ' user(s) offboarded')
    setModal(null); setSelectedRows([])
  }

  const count = modal?.ids?.length || 0

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
        <h1 style={{ fontSize: 'var(--type-heading-4-size)', fontWeight: 'var(--type-heading-4-weight)' }}>People and Access</h1>
      </div>
      <CoverageCards onFilter={setCoverFilter} />
      <p style={{ fontSize: 'var(--type-label-regular-size)', color: 'var(--text-body-tertiary)', marginBottom: 'var(--space-4)' }}>
        System can only count the enrolled visitor after their explicit consent.
      </p>
      <RosterTable
        onAddUser={() => setShowAdd(true)}
        onViewPerson={setViewPerson}
        onAction={handleAction}
        coverFilter={coverFilter}
      />

      {modal?.type === 'consent' && <RequestConsentModal count={count} onClose={() => setModal(null)} onConfirm={confirmConsent} />}
      {modal?.type === 'invite'  && <InviteModal count={count} onClose={() => setModal(null)} onConfirm={confirmInvite} />}
      {modal?.type === 'delete'  && <DeleteModal count={count} onClose={() => setModal(null)} onConfirm={confirmDelete} />}
      {viewPerson && <UserDetails person={viewPerson} onClose={() => setViewPerson(null)} onAction={(act, ids) => { handleAction(act, ids); setViewPerson(null) }} />}
      {showAdd && <AddUserModal onClose={() => setShowAdd(false)} />}
    </div>
  )
}
