import { Turn as Hamburger } from 'hamburger-react'
import { motion } from 'framer-motion'
import { useContext, useEffect, useRef, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { auth } from '../../auth/firebase'
import { signOut } from 'firebase/auth'
import { ChatContext } from '../../context/ChatContext'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { TbLogout } from 'react-icons/tb'
import { HiChatBubbleLeftRight } from 'react-icons/hi2'
import NavbarListItem from './NavbarListItem'
import Button from './Button'

const animationVariantsUl = {
  open: {
    opacity: 1,
    x: 0,
  },
  closed: {
    opacity: 0,
    x: '100%',
  },
}

const NavbarList = () => {
  const [navbarListIsOpen, setNavbarListIsOpen] = useState(false)
  const navbarListRef = useRef<HTMLDivElement | null>(null)
  const { currentUser } = useContext(AuthContext)
  const { chatsIsOpen, setChatsIsOpen } = useContext(ChatContext)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        navbarListRef.current &&
        !navbarListRef.current.contains(e.target as Element | null)
      ) {
        setNavbarListIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [navbarListRef])

  return (
    <div ref={navbarListRef}>
      <Hamburger
        toggled={navbarListIsOpen}
        toggle={setNavbarListIsOpen}
        rounded
        color='white'
        direction='left'
        label='Show menu'
        hideOutline={false}
      />
      <motion.ul
        animate={navbarListIsOpen ? 'open' : 'closed'}
        variants={animationVariantsUl}
        transition={{ duration: 0.3 }}
        className={`${
          navbarListIsOpen ? 'flex' : 'hidden'
        } absolute right-2 top-[4.5rem] flex-col items-center justify-around gap-2 overflow-hidden rounded-lg bg-secondary p-4 font-bold md:top-24 md:gap-4 md:p-6`}>
        {currentUser?.photoURL && (
          <Link to='/profile'>
            <NavbarListItem
              navbarListIsOpen={navbarListIsOpen}
              styles='group flex items-center justify-center gap-4 transition-colors hover:text-hover'>
              <img
                src={currentUser.photoURL}
                alt=''
                className='h-10 w-10 rounded-full border-2 border-transparent object-cover transition-colors group-hover:border-hover'
              />
              <span className='text-md'>{currentUser?.displayName}</span>
            </NavbarListItem>
          </Link>
        )}
        {location.pathname === '/profile' ? (
          <NavbarListItem navbarListIsOpen={navbarListIsOpen}>
            <Button
              onClick={() => navigate('/')}
              icon={<HiChatBubbleLeftRight className='text-3xl' />}
              text='Back To Chat'
            />
          </NavbarListItem>
        ) : chatsIsOpen ? (
          <NavbarListItem
            styles='md:hidden'
            navbarListIsOpen={navbarListIsOpen}>
            <Button
              onClick={() => {
                setChatsIsOpen(false)
                setNavbarListIsOpen(false)
              }}
              icon={<HiChatBubbleLeftRight className='text-3xl' />}
              text='Back To Messages'
            />
          </NavbarListItem>
        ) : (
          <NavbarListItem
            styles='md:hidden'
            navbarListIsOpen={navbarListIsOpen}>
            <Button
              onClick={() => {
                setChatsIsOpen(true)
                setNavbarListIsOpen(false)
              }}
              icon={<HiChatBubbleLeftRight className='text-3xl' />}
              text='Chats'
            />
          </NavbarListItem>
        )}
        <NavbarListItem navbarListIsOpen={navbarListIsOpen}>
          <Button
            onClick={() => signOut(auth)}
            icon={<TbLogout className='text-3xl' />}
            text='Logout'
          />
        </NavbarListItem>
      </motion.ul>
    </div>
  )
}
export default NavbarList
