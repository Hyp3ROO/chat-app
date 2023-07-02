const FormInput = ({ ...rest }) => {
  return (
    <input
      className='border-b-4 bg-transparent p-4 outline-none transition-colors focus:border-secondary'
      autoComplete='off'
      required
      {...rest}
    />
  )
}
export default FormInput
