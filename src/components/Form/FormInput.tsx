const FormInput = ({ ...rest }) => {
  return (
    <input
      className='placeholder-white/70 text-sm md:text-base p-3.5 rounded-lg bg-secondary/40'
      required
      {...rest}
    />
  )
}
export default FormInput
