import { useContext, useEffect, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../../auth/firebase'
import { AuthContext } from '../../context/AuthContext'
import { ChatContext } from '../../context/ChatContext'
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

type User = {
  displayName: string
  photoURL: string
  uid: string
}

const Chats = () => {
  const [chats, setChats] = useState<Chats[]>([])
  const { currentUser } = useContext(AuthContext)
  const { dispatch, chatsIsOpen, setChatsIsOpen } = useContext(ChatContext)

  const handleSelect = (user: User) => {
    dispatch({ type: 'CHANGE_USER', payload: user })
    setChatsIsOpen(false)
  }

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
      <ul
        className={`${
          chatsIsOpen ? 'fixed' : 'hidden'
        } inset-0 flex h-full flex-col overflow-x-hidden overflow-y-scroll bg-primary-bg py-24 scrollbar-thin scrollbar-track-primary-bg scrollbar-thumb-secondary-bg md:hidden`}>
        {chatsIsOpen && (
          <>
            <Searchbar />
            {Object.entries(chats)
              .sort((a, b) => b[1].date - a[1].date)
              .map(chat => {
                return (
                  <div
                    onClick={() => handleSelect(chat[1].userInfo)}
                    key={chat[0]}>
                    <Chat
                      displayName={chat[1].userInfo.displayName}
                      photoURL={chat[1].userInfo.photoURL}
                      lastMessage={chat[1].lastMessage?.text}
                      senderId={chat[1].lastMessage?.senderId}
                    />
                  </div>
                )
              })}
          </>
        )}
      </ul>

      {/* Desktop */}
      <ul className='hidden h-full flex-col overflow-x-hidden overflow-y-scroll bg-primary-bg/80 py-4 scrollbar-thin scrollbar-track-primary-bg scrollbar-thumb-secondary-bg md:flex'>
        <Searchbar />
        {Object.entries(chats)
          .sort((a, b) => b[1].date - a[1].date)
          .map(chat => {
            return (
              <div onClick={() => handleSelect(chat[1].userInfo)} key={chat[0]}>
                <Chat
                  displayName={chat[1].userInfo.displayName}
                  photoURL={chat[1].userInfo.photoURL}
                  lastMessage={chat[1].lastMessage?.text}
                  senderId={chat[1].lastMessage?.senderId}
                />
              </div>
            )
          })}
      </ul>
    </>
  )
}
export default Chats
