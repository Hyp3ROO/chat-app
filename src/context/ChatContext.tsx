import { createContext, useContext, useState } from 'react'
import { AuthContext } from './AuthContext'

type User = {
  displayName: string
  photoURL: string
  uid: string
}

type SelectedUserData = {
  user: User | null
  chatId: string | null
}

type ChatContextType = {
  selectedUserData: SelectedUserData
  chatSelectionHandler: (user: User) => void
  chatsIsOpen: boolean
  setChatsIsOpen: (chatsIsOpen: boolean) => void
}

export const ChatContext = createContext<ChatContextType | null>(null)

const ChatContextProvider = ({ children }: React.PropsWithChildren) => {
  const { currentUser } = useContext(AuthContext)

  const chatSelectionHandler = (user: User) => {
    if (user.uid !== selectedUserData.user?.uid) {
      const newUserData = {
        user: user,
        chatId: currentUser
          ? currentUser.uid > user.uid
            ? currentUser.uid + user.uid
            : user.uid + currentUser.uid
          : '',
      }
      setSelectedUserData(newUserData)
    }
  }

  const [selectedUserData, setSelectedUserData] = useState<SelectedUserData>({
    user: null,
    chatId: null,
  })
  const [chatsIsOpen, setChatsIsOpen] = useState(false)

  return (
    <ChatContext.Provider
      value={{
        selectedUserData,
        chatSelectionHandler,
        chatsIsOpen,
        setChatsIsOpen,
      }}>
      {children}
    </ChatContext.Provider>
  )
}
export default ChatContextProvider
