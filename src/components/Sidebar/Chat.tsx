import useAuthContext from '../../context/useAuthContext'
import useChatContext from '../../context/useChatContext'

type User = {
  displayName: string
  photoURL: string
  uid: string
}

type ChatProps = {
  photoURL: string
  displayName: string
  lastMessage?: string
  senderId?: string
  user: User
  action?: 'deleted' | 'edited'
}

const Chat = ({
  photoURL,
  displayName,
  lastMessage,
  senderId,
  user,
  action,
}: ChatProps) => {
  const { currentUser } = useAuthContext()
  const { chatSelectionHandler, setChatsIsOpen } = useChatContext()

  const handleSelect = (user: User) => {
    chatSelectionHandler(user)
    setChatsIsOpen(false)
  }

  return (
    <button
      className='flex w-full cursor-pointer items-center text-left gap-6 px-8 py-4 transition-colors duration-300 hover:bg-primary/80'
      onClick={() => handleSelect(user)}>
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
            <span
              className={`${
                action === 'deleted' ? 'text-gray-500' : ''
              } truncate`}>{`${senderId === currentUser?.uid ? 'You:' : ''} ${
              lastMessage || ''
            }`}</span>
          </div>
        </>
      )}
    </button>
  )
}
export default Chat
