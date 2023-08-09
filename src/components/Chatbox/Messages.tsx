import type { MessageType } from '../../types/types'
import { useEffect, useState } from 'react'
import useChatContext from '../../hooks/useChatContext'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../../firebase/config'
import Message from './Message'

type MessagesProps = {
  handleReplyClick: (messageToReply: string, isImage: boolean) => void
}

const Messages = ({ handleReplyClick }: MessagesProps) => {
  const [messages, setMessages] = useState<MessageType[]>([])
  const { state } = useChatContext()

  useEffect(() => {
    const chatId = state?.chatId || ''
    if (chatId) {
      const unsubscribe = onSnapshot(doc(db, 'chats', chatId), doc => {
        doc.exists() && setMessages(doc.data().messages as MessageType[])
      })

      return () => {
        unsubscribe()
      }
    }
  }, [state.chatId])

  return (
    <div className='flex h-[calc(100%-192px)] flex-col gap-8 overflow-x-hidden overflow-y-scroll p-4 pb-32 pt-44 scrollbar-thin scrollbar-track-primary-bg scrollbar-thumb-secondary-bg md:pb-8 md:pt-4'>
      {messages.map(message => (
        <Message
          key={message.id}
          message={message}
          handleReplyClick={handleReplyClick}
        />
      ))}
    </div>
  )
}
export default Messages
