import { useState } from 'react'
import toast from 'react-hot-toast'
import useChatContext from '../../context/useChatContext'
import { deleteAccount } from '../../utils/deleteAccount'
import useAuthContext from '../../context/useAuthContext'
import Modal from '../UI/Modal'
import { useNavigate } from 'react-router-dom'

const AccountDeletingButton = () => {
  const { currentUser } = useAuthContext()
  const { chatSelectionHandler } = useChatContext()
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()
  const handleAccountDeleting = async () => {
    if (!currentUser) return
    const toastLoading = toast.loading('Deleting account...')
    try {
      deleteAccount(currentUser)
      toast.success('Successfully deleted account!')
      toast.dismiss(toastLoading)
      setShowModal(false)
      chatSelectionHandler({ displayName: '', photoURL: '', uid: '' })
      navigate('/sign-in')
    } catch (error) {
      toast.error('Something went wrong!')
      toast.dismiss(toastLoading)
      setShowModal(false)
    }
  }
  return (
    <>
      <button
        className='rounded-lg bg-red-700 p-2 font-bold transition-colors hover:bg-red-500 md:p-3'
        onClick={() => setShowModal(true)}>
        Delete Acount
      </button>
      <Modal
        showModal={showModal}
        setShowModal={setShowModal}
        handleDeleteClick={handleAccountDeleting}
        modalMessage='Are you sure you want to delete this account?'
      />
    </>
  )
}
export default AccountDeletingButton
