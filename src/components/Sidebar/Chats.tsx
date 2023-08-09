import { useEffect, useState } from 'react'
import useAuthContext from '../../hooks/useAuthContext'
import useChatContext from '../../hooks/useChatContext'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../../firebase/config'
import Chat from './Chat'
import Searchbar from './Searchbar'

type Chats = {
  combinedId: string
  date: number
  userInfo: {
    displayName: string
    photoURL: string
    uid: string
  }
  lastMessage?: {
    text: string
    senderId: string
  }
}

const Chats = () => {
  const [chats, setChats] = useState<Chats[]>([])
  const { currentUser } = useAuthContext()
  const { chatsIsOpen } = useChatContext()

  const chatsSorted = Object.entries(chats)
    .sort((a, b) => b[1].date - a[1].date)
    .map(chat => {
      return (
        <li key={chat[0]}>
          <Chat
            displayName={chat[1].userInfo.displayName}
            photoURL={chat[1].userInfo.photoURL}
            lastMessage={chat[1].lastMessage?.text}
            senderId={chat[1].lastMessage?.senderId}
            user={chat[1].userInfo}
          />
        </li>
      )
    })

  useEffect(() => {
    const getChats = () => {
      const currentUserUID = currentUser?.uid || ''
      const unsubscribe = onSnapshot(
        doc(db, 'userChats', currentUserUID),
        doc => {
          setChats(doc.data() as Chats[])
        }
      )
      return () => {
        unsubscribe()
      }
    }
    currentUser?.uid && getChats()
  }, [currentUser?.uid])

  return (
    <>
      {/* Mobile */}
      {chatsIsOpen && (
        <ul className='fixed inset-0 flex h-full flex-col overflow-x-hidden overflow-y-scroll bg-primary-bg py-24 scrollbar-thin scrollbar-track-primary-bg scrollbar-thumb-secondary-bg md:hidden'>
          <Searchbar />
          {chatsSorted}
        </ul>
      )}

      {/* Desktop */}
      <ul className='hidden h-full flex-col overflow-x-hidden overflow-y-scroll bg-primary-bg/80 py-4 scrollbar-thin scrollbar-track-primary-bg scrollbar-thumb-secondary-bg md:flex'>
        <Searchbar />
        {chatsSorted}
      </ul>
    </>
  )
}
export default Chats
