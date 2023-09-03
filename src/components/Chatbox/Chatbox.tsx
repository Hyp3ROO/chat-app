import { useEffect, useRef, useState } from 'react'
import useAuthContext from '../../context/useAuthContext'
import useChatContext from '../../context/useChatContext'
import MessageInput from './MessageInput'
import Messages from './Messages'

const Chatbox = () => {
  const { currentUser } = useAuthContext()
  const { selectedUserData, chatSelectionHandler } = useChatContext()
  const messageTextAreaRef = useRef<HTMLTextAreaElement | null>(null)
  const [messageToReply, setMessageToReply] = useState({
    text: '',
    isImage: false,
  })

  const handleReplyClick = (text: string, isImage: boolean) => {
    setMessageToReply({ text, isImage })
    messageTextAreaRef.current?.focus()
  }

  useEffect(() => {
    chatSelectionHandler({
      displayName: '',
      photoURL: '',
      uid: '',
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser])

  return (
    <div className='w-full md:max-h-screen md:w-2/3'>
      {selectedUserData.user?.uid ? (
        <>
          <div className='fixed top-[4.5rem] z-30 flex h-12 w-full items-center justify-center gap-4 bg-primary-bg/80 p-8 md:static md:top-20 md:h-24 md:justify-start'>
            {selectedUserData.user.photoURL && (
              <img
                src={selectedUserData.user.photoURL}
                alt=''
                className='h-7 w-7 rounded-full object-cover md:h-14 md:w-14'
              />
            )}
            <span className='text-xl font-bold'>
              {selectedUserData.user.displayName}
            </span>
          </div>
          <Messages handleReplyClick={handleReplyClick} />
          <MessageInput
            messageToReply={messageToReply}
            setMessageToReply={setMessageToReply}
            messageTextAreaRef={messageTextAreaRef}
          />
        </>
      ) : (
        <div className='flex h-screen items-center justify-center text-center'>
          <h2 className='px-2 text-3xl font-bold'>
            Choose chat to start a conversation
          </h2>
        </div>
      )}
    </div>
  )
}
export default Chatbox
