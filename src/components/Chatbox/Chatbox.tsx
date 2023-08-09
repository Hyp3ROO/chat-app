import { useEffect, useRef, useState } from 'react'
import useAuthContext from '../../hooks/useAuthContext'
import useChatContext from '../../hooks/useChatContext'
import MessageInput from './MessageInput'
import Messages from './Messages'

const Chatbox = () => {
  const { currentUser } = useAuthContext()
  const { state, dispatch } = useChatContext()
  const messageInputRef = useRef<HTMLInputElement | null>(null)
  const [messageToReply, setMessageToReply] = useState({
    text: '',
    isImage: false,
  })

  const handleReplyClick = (text: string, isImage: boolean) => {
    setMessageToReply({ text, isImage })
    messageInputRef.current?.focus()
  }

  useEffect(() => {
    dispatch({
      type: 'CHANGE_USER',
      payload: {
        displayName: '',
        photoURL: '',
        uid: '',
      },
    })
  }, [currentUser, dispatch])

  return (
    <div className='w-full md:max-h-screen md:w-2/3'>
      {state.user.uid !== '' ? (
        <>
          <div className='fixed top-[4.5rem] z-30 flex h-12 w-full items-center justify-center gap-4 bg-primary-bg/80 p-8 md:static md:top-20 md:h-24 md:justify-start'>
            {state.user.photoURL && (
              <img
                src={state.user?.photoURL}
                alt=''
                className='h-7 w-7 rounded-full object-cover md:h-14 md:w-14'
              />
            )}
            <span className='text-xl font-bold'>{state.user?.displayName}</span>
          </div>
          <Messages handleReplyClick={handleReplyClick} />
          <MessageInput
            messageToReply={messageToReply}
            setMessageToReply={setMessageToReply}
            messageInputRef={messageInputRef}
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
