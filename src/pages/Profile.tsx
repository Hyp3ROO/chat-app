import Navbar from '../components/Navbar/Navbar'
import ProfileInfo from '../components/Profile/ProfileInfo'
import ProtectedRoute from '../routes/ProtectedRoute'

const Profile = () => {
  return (
    <ProtectedRoute>
      <Navbar />
      <ProfileInfo />
    </ProtectedRoute>
  )
}
export default Profile
