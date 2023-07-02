import { useContext, useState } from 'react'
import {
  Timestamp,
  arrayUnion,
  doc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { db, storage } from '../../auth/firebase'
import { v4 as uuid } from 'uuid'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'
import { toast } from 'react-hot-toast'
import imageCompression from 'browser-image-compression'
import { FcAddImage } from 'react-icons/fc'
import { BsFillSendFill } from 'react-icons/bs'

const MessageInput = () => {
  const [text, setText] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [isImageAdding, setIsImageAdding] = useState(false)
  const { state } = useContext(ChatContext)
  const { currentUser } = useContext(AuthContext)

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsImageAdding(true)
    const imageFile = e.target.files?.[0]
    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: 'image/webp',
    }
    try {
      if (imageFile) {
        const compressedImageFile = await imageCompression(imageFile, options)
        setImage(compressedImageFile)
      }
    } catch (error) {
      toast.error(`Error occured: ${error}`)
    }
    e.target.value = ''
    setIsImageAdding(false)
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    const chatId = state?.chatId || ''
    const currentUserUID = currentUser?.uid || ''

    if (text === '' && !image) {
      toast.error('You need to type something or select some image!')
      return
    }
    if (image) {
      const storageRef = ref(storage, uuid())
      const uploadTask = uploadBytesResumable(storageRef, image)
      uploadTask.on(
        'state_changed',
        null,
        error => {
          toast.error(`Error occured: ${error}`)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async downloadURL => {
            await updateDoc(doc(db, 'chats', chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser?.uid,
                date: Timestamp.now(),
                image: downloadURL,
              }),
            })
          })
        }
      )
    } else {
      await updateDoc(doc(db, 'chats', chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser?.uid,
          date: Timestamp.now(),
        }),
      })
    }
    await updateDoc(doc(db, 'userChats', currentUserUID), {
      [`${chatId}.lastMessage`]: {
        text: text !== '' ? text : 'Sent an Image',
        senderId: currentUser?.uid,
      },
      [`${chatId}.date`]: serverTimestamp(),
    })

    await updateDoc(doc(db, 'userChats', state.user.uid), {
      [`${chatId}.lastMessage`]: {
        text: text !== '' ? text : 'Sent an Image',
        senderId: currentUser?.uid,
      },
      [`${chatId}.date`]: serverTimestamp(),
    })
    setText('')
    setImage(null)
  }

  return (
    <div className='fixed bottom-0 w-full bg-primary-bg md:static'>
      <form
        className='flex h-24 items-center justify-center gap-4 px-6 py-4 md:py-6'
        onSubmit={handleSend}>
        <input
          className={`${
            isImageAdding ? 'placeholder-gray-400' : 'placeholder-white/70'
          } w-full border-b bg-transparent p-1.5 outline-none duration-300 focus:border-secondary md:border-b-2 md:text-xl`}
          type='text'
          disabled={isImageAdding ? true : false}
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder={isImageAdding ? 'Adding Image...' : 'Type Message...'}
        />
        <button
          type='submit'
          disabled={isImageAdding ? true : false}
          className={`${
            isImageAdding
              ? 'bg-gray-400 focus:bg-gray-600'
              : 'bg-secondary focus:bg-secondary-bg'
          } rounded-lg p-2 font-bold transition-colors hover:bg-hover md:p-3`}>
          <BsFillSendFill className='text-xl md:text-2xl' />
        </button>
        <input
          type='file'
          id='image'
          name='image'
          className='hidden'
          accept='image/*'
          onChange={handleImageChange}
        />
        <label
          htmlFor='image'
          className='group flex cursor-pointer flex-col items-center'>
          <FcAddImage className='text-3xl transition-transform group-hover:scale-105 md:text-4xl' />
          {image && (
            <span className='text-xs text-green-500 md:text-sm'>Added</span>
          )}
          {isImageAdding && (
            <span className='text-xs text-gray-400 md:text-sm'>Adding...</span>
          )}
        </label>
      </form>
    </div>
  )
}
export default MessageInput
