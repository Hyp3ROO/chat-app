import { User, onAuthStateChanged } from 'firebase/auth'
import { createContext, useEffect, useState } from 'react'
import { auth } from '../firebase/config'

type AuthContextType = {
  currentUser: User | null
  authLoaded: boolean
}

export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
} as AuthContextType)

const AuthContextProvider = ({ children }: React.PropsWithChildren) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [authLoaded, setAuthLoaded] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user)
      setAuthLoaded(true)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ currentUser, authLoaded }}>
      {children}
    </AuthContext.Provider>
  )
}
export default AuthContextProvider
