import { useContext, useEffect, useState } from 'react'
import { ChatContext } from '../../context/ChatContext'
import { Timestamp, doc, onSnapshot } from 'firebase/firestore'
import { db } from '../../auth/firebase'
import Message from './Message'

type Message = {
  id: string
  text: string
  image?: string
  date: Timestamp
  senderId: string
}

const Messages = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const { state } = useContext(ChatContext)

  useEffect(() => {
    const chatId = state?.chatId || ''
    if (chatId) {
      const unsubscribe = onSnapshot(doc(db, 'chats', chatId), doc => {
        doc.exists() && setMessages(doc.data().messages as Message[])
      })

      return () => {
        unsubscribe()
      }
    }
  }, [state.chatId])

  return (
    <div className='flex h-[calc(100%-192px)] flex-col gap-8 overflow-x-hidden overflow-y-scroll p-4 pb-32 pt-44 scrollbar-thin scrollbar-track-primary-bg scrollbar-thumb-secondary-bg md:pb-8 md:pt-4'>
      {messages.map(message => (
        <Message key={message.id} message={message} />
      ))}
    </div>
  )
}
export default Messages
