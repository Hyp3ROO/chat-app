import type { MessageType } from '../../types/types'
import { useState } from 'react'
import useChatContext from '../../context/useChatContext'
import useAuthContext from '../../context/useAuthContext'
import toast from 'react-hot-toast'
import { updateMessageInfo } from '../../utils/updateMessageInfo'
import { AiFillDelete } from 'react-icons/ai'
import Modal from '../UI/Modal'

type DeleteMessageButtonProps = {
  showMessageOptions: boolean
  message: MessageType
}

const DeleteMessageButton = ({
  showMessageOptions,
  message,
}: DeleteMessageButtonProps) => {
  const [showModal, setShowModal] = useState(false)
  const { selectedUserData } = useChatContext()
  const { currentUser } = useAuthContext()

  const messageInfoData = {
    currentUserUID: currentUser?.uid || '',
    selectedUserUID: selectedUserData.user?.uid || '',
    chatId: selectedUserData?.chatId || '',
    message,
    newText: 'Message was deleted',
    action: 'deleted' as 'deleted',
  }

  const handleDeleteMessage = () => {
    try {
      updateMessageInfo(messageInfoData)
      toast.success('Message successfully deleted')
      setShowModal(false)
    } catch (error) {
      toast.error('Something went wrong')
      setShowModal(false)
    }
  }

  return (
    <>
      <button
        className={`${
          showMessageOptions ? 'opacity-100' : 'opacity-0'
        } message-options-btn group`}
        onClick={() => setShowModal(true)}
        aria-label='delete message'>
        <AiFillDelete className='text-xl md:text-2xl group-hover:text-hover transition-colors' />
      </button>
      <Modal
        showModal={showModal}
        setShowModal={setShowModal}
        handleDeleteClick={handleDeleteMessage}
        modalMessage='Are you sure you want to delete this message?'
        size='md:left-2/3'
      />
    </>
  )
}
export default DeleteMessageButton
