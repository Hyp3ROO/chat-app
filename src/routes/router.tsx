import { Navigate, Route, Routes } from 'react-router-dom'
import Home from '../pages/Home'
import Profile from '../pages/Profile'
import SignIn from '../pages/SignIn'
import SignUp from '../pages/SignUp'
import ProtectedRoute from './ProtectedRoute'

const Router = () => {
  const routes = [
    {
      path: '/',
      element: <Home />,
      requireAuth: true,
    },
    {
      path: '/profile',
      element: <Profile />,
      requireAuth: true,
    },
    {
      path: '/sign-in',
      element: <SignIn />,
      requireAuth: false,
    },
    {
      path: '/sign-up',
      element: <SignUp />,
      requireAuth: false,
    },
    {
      path: '*',
      element: <Navigate to='/' />,
      requireAuth: false,
    },
  ]

  return (
    <Routes>
      {routes.map(route => {
        return (
          <Route
            key={route.path}
            path={route.path}
            element={
              route.requireAuth ? (
                <ProtectedRoute>{route.element}</ProtectedRoute>
              ) : (
                route.element
              )
            }
          />
        )
      })}
    </Routes>
  )
}
export default Router
