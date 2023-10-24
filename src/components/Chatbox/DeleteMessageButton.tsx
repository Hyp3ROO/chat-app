import type { MessageType } from '../../types/types'
import { useRef, useState } from 'react'
import useChatContext from '../../context/useChatContext'
import useAuthContext from '../../context/useAuthContext'
import toast from 'react-hot-toast'
import { updateMessageInfo } from '../../utils/updateMessageInfo'
import { AiFillDelete } from 'react-icons/ai'

type DeleteMessageButtonProps = {
  showMessageOptions: boolean
  message: MessageType
}

const DeleteMessageButton = ({
  showMessageOptions,
  message,
}: DeleteMessageButtonProps) => {
  const [showModal, setShowModal] = useState(false)
  const modalRef = useRef<HTMLDivElement | null>(null)
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
      {showModal && (
        <>
          <div
            className='fixed top-1/2 left-1/2 md:left-2/3 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 md:gap-4 p-5 rounded-lg bg-primary-bg text-center md:text-lg lg:text-xl md:p-7 z-50'
            ref={modalRef}>
            <p>Are you sure you want to delete this message?</p>
            <div className='flex items-center gap-4 md:gap-6'>
              <button
                className='rounded-lg bg-red-700 px-4 py-2 font-bold transition-colors hover:bg-red-500 md:px-6 md:py-3'
                onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button
                className='rounded-lg bg-secondary px-4 py-2 font-bold transition-colors hover:bg-hover md:px-6 md:py-3'
                onClick={handleDeleteMessage}>
                Delete
              </button>
            </div>
          </div>
          <div
            className='fixed inset-0 bg-black/80 h-full w-full z-40'
            onClick={() => setShowModal(false)}
          />
        </>
      )}
    </>
  )
}
export default DeleteMessageButton
