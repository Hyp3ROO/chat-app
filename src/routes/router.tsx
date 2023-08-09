import { Navigate, Route, Routes } from 'react-router-dom'
import Home from '../pages/Home'
import Profile from '../pages/Profile'
import SignIn from '../pages/SignIn'
import SignUp from '../pages/SignUp'
import useAuthContext from '../hooks/useAuthContext'

const Router = () => {
  const { currentUser, authLoaded } = useAuthContext()

  const ProtectedRoute = ({ children }: React.PropsWithChildren) => {
    if (!authLoaded) {
      return null
    }

    if (!currentUser) {
      return <Navigate to='/sign-in' />
    }
    return <>{children}</>
  }

  return (
    <Routes>
      <Route path='*' element={<Navigate to='/' />} />
      <Route
        path='/'
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path='/profile'
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route path='/sign-in' element={<SignIn />} />
      <Route path='/sign-up' element={<SignUp />} />
    </Routes>
  )
}
export default Router
