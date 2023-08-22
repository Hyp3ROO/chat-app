import Chatbox from '../components/Chatbox/Chatbox'
import Sidebar from '../components/Sidebar/Sidebar'
import ProtectedRoute from '../routes/ProtectedRoute'

const Home = () => {
  return (
    <ProtectedRoute>
      <div className='flex min-h-screen flex-col md:flex-row'>
        <Sidebar />
        <Chatbox />
      </div>
    </ProtectedRoute>
  )
}

export default Home
