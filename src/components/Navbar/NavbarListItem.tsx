import { motion } from 'framer-motion'

type NavbarListItemProps = {
  children?: React.ReactNode
  navbarListIsOpen: boolean
  styles?: string
}

const NavbarListItem = ({
  children,
  navbarListIsOpen,
  styles,
}: NavbarListItemProps) => {
  const animationVariantsLi = {
    open: { opacity: 1 },
    closed: { opacity: 0 },
  }

  return (
    <motion.li
      animate={navbarListIsOpen ? 'open' : 'closed'}
      variants={animationVariantsLi}
      transition={{ duration: 0.3 }}
      className={`${styles} md:text-md text-sm`}>
      {children}
    </motion.li>
  )
}
export default NavbarListItem
