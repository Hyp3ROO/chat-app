import { useState } from 'react'
import { storage } from '../../firebase/config'
import toast from 'react-hot-toast'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import imageCompression from 'browser-image-compression'
import { updateProfileInfo } from '../../utils/updateProfileInfo'
import { AiOutlineCamera } from 'react-icons/ai'
import FormInput from '../../components/Form/FormInput'
import useAuthContext from '../../hooks/useAuthContext'

const ProfileInfo = () => {
  const { currentUser } = useAuthContext()
  const [newUsername, setNewUsername] = useState('')
  const [, setImageChanged] = useState(false)

  const handleChangeUsername = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newUsername === '') {
      toast.error('You need to type something!')
      return
    } else if (newUsername === currentUser?.displayName) {
      toast.error(
        'You need to enter a username different from the one you have now!'
      )
      return
    }

    const toastLoading = toast.loading('Changing username...')

    try {
      await updateProfileInfo(
        currentUser,
        'userInfo.displayName',
        'displayName',
        newUsername
      )

      toast.success('Username changed')
      toast.dismiss(toastLoading)
      setNewUsername('')
    } catch (error) {
      toast.error(`Error occured: ${error}`)
      toast.dismiss(toastLoading)
    }
  }

  const handleChangeImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageChanged(false)
    const currentUserDisplayName = currentUser?.displayName || ''

    const imageFile = e.target.files?.[0]
    if (!imageFile) return
    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: 'image/webp',
    }

    const toastLoading = toast.loading('Changing avatar image...')

    try {
      if (imageFile) {
        const compressedImageFile = await imageCompression(imageFile, options)
        try {
          const storageRef = ref(storage, currentUserDisplayName)
          const uploadTask = uploadBytesResumable(
            storageRef,
            compressedImageFile
          )
          uploadTask.on(
            'state_changed',
            null,
            (error: unknown) => {
              toast.error(`Error occured: ${error}`)
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then(
                async downloadURL => {
                  await updateProfileInfo(
                    currentUser,
                    'userInfo.photoURL',
                    'photoURL',
                    downloadURL
                  )

                  toast.success('Avatar image changed')
                  toast.dismiss(toastLoading)
                  setImageChanged(true)
                }
              )
            }
          )
        } catch (error) {
          toast.error(`Error occured: ${error}`)
          toast.dismiss(toastLoading)
        }
      }
    } catch (error) {
      toast.error(`Error occured: ${error}`)
      toast.dismiss(toastLoading)
    }
  }
  return (
    <div className='flex flex-col items-center justify-center gap-4 py-8'>
      {currentUser?.photoURL && (
        <>
          <input
            type='file'
            id='image'
            name='image'
            className='hidden'
            accept='image/*'
            onChange={handleChangeImage}
          />
          <label
            htmlFor='image'
            className='group relative cursor-pointer rounded-full border-2 border-transparent transition-colors hover:border-hover'>
            <img
              src={currentUser.photoURL}
              alt=''
              className='h-32 w-32 rounded-full object-cover md:h-56 md:w-56'
            />
            <div className='absolute bottom-0 right-4 z-10 inline-block rounded-full border-2 border-white bg-primary p-1 transition-colors group-hover:border-hover md:right-10'>
              <AiOutlineCamera className='text-lg transition-colors group-hover:text-hover md:text-2xl' />
            </div>
            <div className='absolute inset-0 rounded-full transition-colors group-hover:bg-primary/60' />
          </label>
        </>
      )}
      <h2 className='text-3xl font-bold'>{currentUser?.displayName}</h2>
      <div className='mt-6 flex flex-col items-center gap-12'>
        <div className='flex flex-col items-center gap-4'>
          <h2 className='text-center text-2xl font-bold md:text-3xl'>
            Change Username
          </h2>
          <form
            className='mt-4 flex flex-col items-center gap-4'
            onSubmit={handleChangeUsername}>
            <FormInput
              placeholder='New Username...'
              value={newUsername}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewUsername(e.target.value)
              }
            />
            <button
              type='submit'
              className='rounded-lg bg-secondary p-2 font-bold transition-colors hover:bg-hover md:p-3'>
              Change
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
export default ProfileInfo
