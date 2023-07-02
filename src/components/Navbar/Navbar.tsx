import { Link } from 'react-router-dom'
import NavbarList from './NavbarList'

const Navbar = () => {
  return (
    <nav className='relative z-20 flex w-full items-center justify-between gap-2 bg-primary-bg px-6 py-3 md:px-12 md:py-6'>
      <Link to='/' className='group'>
        <h1 className='text-lg font-bold text-white transition-colors group-hover:text-hover lg:text-2xl'>
          Chat App
        </h1>
      </Link>
      <NavbarList />
    </nav>
  )
}
export default Navbar
