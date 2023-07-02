import Chats from './Chats'
import Navbar from '../Navbar/Navbar'

const Sidebar = () => {
  return (
    <div className='fixed z-20 flex w-full flex-col md:static md:max-h-screen md:w-1/3'>
      <Navbar />
      <Chats />
    </div>
  )
}
export default Sidebar
