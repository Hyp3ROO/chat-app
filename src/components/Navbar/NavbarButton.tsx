type ButtonProps = {
  icon: JSX.Element
  text: string
  onClick: () => void
}

const NavbarButton = ({ icon, text, onClick }: ButtonProps) => {
  return (
    <button
      className='group flex items-center gap-2 p-2 transition-colors hover:text-hover'
      onClick={onClick}>
      {icon}
      {text}
    </button>
  )
}
export default NavbarButton
