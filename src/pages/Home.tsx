import Chatbox from '../components/Chatbox/Chatbox'
import Sidebar from '../components/Sidebar/Sidebar'

const Home = () => {
  return (
    <div className='flex min-h-screen flex-col md:flex-row'>
      <Sidebar />
      <Chatbox />
    </div>
  )
}

export default Home
