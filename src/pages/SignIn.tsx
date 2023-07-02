import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import toast from 'react-hot-toast'
import { auth } from '../auth/firebase'
import FormInput from '../components/Form/FormInput'

const SignIn = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
  })
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const toastLoading = toast.loading('Signing in...')
    try {
      await signInWithEmailAndPassword(auth, form.email, form.password)
      toast.success('Successfully signed in!')
      toast.dismiss(toastLoading)
      navigate('/')
    } catch (error) {
      toast.error('Error: ' + error)
      toast.dismiss(toastLoading)
    }
  }

  return (
    <div className='grid min-h-screen place-items-center bg-primary-bg px-4 py-4'>
      <div className='flex flex-col items-center justify-center gap-4 rounded-lg bg-primary p-6 md:p-12'>
        <h1 className='text-3xl font-bold'>Chat-App</h1>
        <p>Sign In Here</p>
        <form
          className='flex flex-col items-center justify-center gap-6'
          onSubmit={handleSubmit}>
          <FormInput
            type='email'
            name='email'
            placeholder='Email'
            value={form.email}
            onChange={handleChange}
          />
          <FormInput
            type='password'
            name='password'
            placeholder='Password'
            value={form.password}
            onChange={handleChange}
          />
          <button className='mt-2 rounded-lg bg-secondary px-6 py-3 font-bold transition-colors hover:bg-hover'>
            Sign In
          </button>
        </form>
        <p className='text-center'>
          You do not have an account?{' '}
          <Link
            to='/sign-up'
            className='text-secondary-bg transition-colors hover:text-hover'>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}
export default SignIn
