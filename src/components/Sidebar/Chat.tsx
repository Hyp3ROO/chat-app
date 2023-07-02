import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'

type ChatProps = {
  photoURL: string
  displayName: string
  lastMessage?: string
  senderId?: string
}

const Chat = ({ photoURL, displayName, lastMessage, senderId }: ChatProps) => {
  const { currentUser } = useContext(AuthContext)
  return (
    <li className='flex cursor-pointer items-center gap-6 px-8 py-4 transition-colors duration-300 hover:bg-primary/80'>
      {photoURL && (
        <>
          <img
            src={photoURL}
            alt={`${displayName}'s avatar image`}
            className='h-10 w-10 flex-shrink-0 rounded-full object-cover md:h-14 md:w-14'
          />
          <div className='inline-flex min-w-0 flex-col'>
            <span className='break-all font-bold md:text-lg'>
              {displayName}
            </span>
            <span className='truncate'>{`${
              senderId === currentUser?.uid ? 'You:' : ''
            } ${lastMessage ? lastMessage : ''}`}</span>
          </div>
        </>
      )}
    </li>
  )
}
export default Chat
