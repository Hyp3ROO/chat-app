import { Navigate } from 'react-router-dom'
import useAuthContext from '../context/useAuthContext'

const ProtectedRoute = ({ children }: React.PropsWithChildren) => {
  const { currentUser, authLoaded } = useAuthContext()
  if (!authLoaded) {
    return null
  }

  if (!currentUser) {
    return <Navigate to='/sign-in' />
  }
  return <>{children}</>
}
export default ProtectedRoute
