import type { MessageType } from '../../types/types'
import { useEffect, useState } from 'react'
import useChatContext from '../../context/useChatContext'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../../firebase/config'
import Message from './Message'

type MessagesProps = {
  handleReplyClick: (messageToReply: string, isImage: boolean) => void
}

const Messages = ({ handleReplyClick }: MessagesProps) => {
  const [messages, setMessages] = useState<MessageType[]>([])
  const { selectedUserData } = useChatContext()

  useEffect(() => {
    const chatId = selectedUserData?.chatId || ''
    if (chatId) {
      const unsubscribe = onSnapshot(doc(db, 'chats', chatId), doc => {
        doc.exists() &&
          setMessages(
            doc
              .data()
              .messages.sort(
                (a: { date: number }, b: { date: number }) => a.date - b.date
              ) as MessageType[]
          )
      })

      return () => {
        unsubscribe()
      }
    }
  }, [selectedUserData.chatId])

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
