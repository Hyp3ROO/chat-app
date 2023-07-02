import { createContext, useContext, useReducer, useState } from 'react'
import { AuthContext } from './AuthContext'

type User = {
  displayName: string
  photoURL: string
  uid: string
}

type StateType = {
  chatId: string | null
  user: User
}

type ReducerAction = {
  type: string
  payload: User
}

type ChatContextType = {
  state: StateType
  dispatch: React.Dispatch<ReducerAction>
  chatsIsOpen: boolean
  setChatsIsOpen: (chatsIsOpen: boolean) => void
}

type AuthContextType = {
  currentUser: User | null
}

const INITIAL_STATE: StateType = {
  chatId: null,
  user: {} as User,
}

export const ChatContext = createContext<ChatContextType>({
  state: INITIAL_STATE,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  dispatch: () => {},
  chatsIsOpen: false,
  setChatsIsOpen: () => false,
} as ChatContextType)

const ChatContextProvider = ({ children }: React.PropsWithChildren) => {
  const { currentUser } = useContext(AuthContext) as Partial<AuthContextType>

  const chatReducer = (state: StateType, action: ReducerAction): StateType => {
    switch (action.type) {
      default:
        return state
      case 'CHANGE_USER':
        return {
          user: action.payload,
          chatId: currentUser
            ? currentUser.uid > action.payload.uid
              ? currentUser.uid + action.payload.uid
              : action.payload.uid + currentUser.uid
            : '',
        }
    }
  }

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE)
  const [chatsIsOpen, setChatsIsOpen] = useState(false)

  return (
    <ChatContext.Provider
      value={{
        state,
        dispatch,
        chatsIsOpen,
        setChatsIsOpen,
      }}>
      {children}
    </ChatContext.Provider>
  )
}
export default ChatContextProvider
