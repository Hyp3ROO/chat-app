import { Turn as Hamburger } from 'hamburger-react'
import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import useChatContext from '../../context/useChatContext'
import useAuthContext from '../../context/useAuthContext'
import { auth } from '../../firebase/config'
import { signOut } from 'firebase/auth'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { TbLogout } from 'react-icons/tb'
import { HiChatBubbleLeftRight } from 'react-icons/hi2'
import NavbarListItem from './NavbarListItem'

const animationVariantsUl = {
  open: {
    display: 'flex',
    opacity: 1,
    x: 0,
  },
  closed: {
    opacity: 0,
    x: '100%',
    transitionEnd: {
      display: 'none',
    },
  },
}

const NavbarList = () => {
  const [navbarListIsOpen, setNavbarListIsOpen] = useState(false)
  const navbarListRef = useRef<HTMLDivElement | null>(null)
  const { currentUser } = useAuthContext()
  const { chatsIsOpen, setChatsIsOpen, chatSelectionHandler } = useChatContext()
  const location = useLocation()
  const navigate = useNavigate()

  const signOutHandler = () => {
    signOut(auth)
    chatSelectionHandler({ displayName: '', photoURL: '', uid: '' })
  }

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
        className='hidden absolute right-2 top-[4.5rem] flex-col items-center justify-around gap-2 overflow-hidden rounded-lg bg-secondary p-4 font-bold md:top-24 md:gap-4 md:p-6'>
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
            <button
              className='flex items-center gap-2 p-2 transition-colors hover:text-hover'
              onClick={() => navigate('/')}>
              <HiChatBubbleLeftRight className='text-3xl' />
              Back To Chat
            </button>
          </NavbarListItem>
        ) : chatsIsOpen ? (
          <NavbarListItem
            styles='md:hidden'
            navbarListIsOpen={navbarListIsOpen}>
            <button
              className='flex items-center gap-2 p-2 transition-colors hover:text-hover'
              onClick={() => {
                setChatsIsOpen(false)
                setNavbarListIsOpen(false)
              }}>
              <HiChatBubbleLeftRight className='text-3xl' />
              Back To Messages
            </button>
          </NavbarListItem>
        ) : (
          <NavbarListItem
            styles='md:hidden'
            navbarListIsOpen={navbarListIsOpen}>
            <button
              className='flex items-center gap-2 p-2 transition-colors hover:text-hover'
              onClick={() => {
                setChatsIsOpen(true)
                setNavbarListIsOpen(false)
              }}>
              <HiChatBubbleLeftRight className='text-3xl' />
              Chats
            </button>
          </NavbarListItem>
        )}
        <NavbarListItem navbarListIsOpen={navbarListIsOpen}>
          <button
            className='flex items-center gap-2 p-2 transition-colors hover:text-hover'
            onClick={signOutHandler}>
            <TbLogout className='text-3xl' />
            Logout
          </button>
        </NavbarListItem>
      </motion.ul>
    </div>
  )
}
export default NavbarList
