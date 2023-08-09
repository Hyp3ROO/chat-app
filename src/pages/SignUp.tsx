import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { hasWhiteSpace } from '../utils/hasWhiteSpace'
import { auth, db, storage } from '../firebase/config'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { doc, setDoc } from 'firebase/firestore'
import { toast } from 'react-hot-toast'
import FormInput from '../components/Form/FormInput'
import ImagePicker from '../components/Form/ImagePicker'

const SignUp = () => {
  const [form, setForm] = useState({
    displayName: '',
    email: '',
    password: '',
  })
  const [image, setImage] = useState<File | null>(null)
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!image) {
      toast.error('You need to add an image!')
      return
    }
    if (
      hasWhiteSpace(form.displayName) ||
      hasWhiteSpace(form.email) ||
      hasWhiteSpace(form.password)
    ) {
      toast.error(
        'No whitespace characters can be used in an email or password'
      )
      return
    }
    const toastLoading = toast.loading('Creating an account...')
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      )
      const storageRef = ref(storage, form.displayName)
      const uploadTask = uploadBytesResumable(storageRef, image)
      uploadTask.on(
        'state_changed',
        null,
        error => {
          toast.error(`Error occured: ${error}`)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async downloadURL => {
            await updateProfile(response.user, {
              displayName: form.displayName,
              photoURL: downloadURL,
            })

            await setDoc(doc(db, 'users', response.user.uid), {
              uid: response.user.uid,
              displayName: form.displayName,
              email: form.email,
              photoURL: downloadURL,
            })

            await setDoc(doc(db, 'userChats', response.user.uid), {})

            toast.success('Successfully signed up!')
            toast.dismiss(toastLoading)
            navigate('/')
          })
        }
      )
    } catch (error) {
      toast.error(`Error occured: ${error}`)
      toast.dismiss(toastLoading)
    }
  }

  return (
    <div className='grid min-h-screen place-items-center bg-primary-bg px-4 py-4'>
      <div className='flex flex-col items-center justify-center gap-4 rounded-lg bg-primary p-6 md:p-12'>
        <h1 className='text-3xl font-bold'>Chat-App</h1>
        <p>Sign Up Here</p>
        <form
          className='flex flex-col items-center justify-center gap-6'
          onSubmit={handleSubmit}>
          <FormInput
            type='text'
            placeholder='Display Name'
            name='displayName'
            value={form.displayName}
            onChange={handleChange}
          />
          <FormInput
            type='email'
            placeholder='Email'
            name='email'
            value={form.email}
            onChange={handleChange}
          />
          <FormInput
            type='password'
            placeholder='Password'
            name='password'
            value={form.password}
            onChange={handleChange}
            minLength={6}
          />
          <ImagePicker image={image} setImage={setImage} />
          <button className='mt-2 rounded-lg bg-secondary px-6 py-3 font-bold transition-colors hover:bg-hover'>
            Sign Up
          </button>
        </form>
        <p className='text-center'>
          You do not have an account?{' '}
          <Link
            to='/sign-in'
            className='text-secondary-bg transition-colors hover:text-hover'>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}

export default SignUp
