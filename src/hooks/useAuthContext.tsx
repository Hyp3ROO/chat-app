import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

const useAuthContext = () => {
  const authContext = useContext(AuthContext)
  if (!authContext)
    throw new Error(
      'No AuthContext.Provider found when calling useAuthContext.'
    )
  return authContext
}
export default useAuthContext
