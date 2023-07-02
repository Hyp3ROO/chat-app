import { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthContext } from './context/AuthContext'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Profile from './pages/Profile'

const App = () => {
  const { currentUser, authLoaded } = useContext(AuthContext)

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
    <div className='relative min-h-screen overflow-hidden bg-primary text-white'>
      <Routes>
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
      <Toaster />
    </div>
  )
}

export default App
