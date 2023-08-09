import { useState } from 'react'
import useChatContext from '../../hooks/useChatContext'
import useAuthContext from '../../hooks/useAuthContext'
import {
  Timestamp,
  arrayUnion,
  doc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { db, storage } from '../../firebase/config'
import { v4 as uuid } from 'uuid'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { hasWhiteSpace } from '../../utils/hasWhiteSpace'
import { toast } from 'react-hot-toast'
import imageCompression from 'browser-image-compression'
import { AiOutlineClose } from 'react-icons/ai'
import MessageImage from './MessageImage'
import ImagePicker from './ImagePicker'

type MessageInputProps = {
  messageToReply: {
    text: string
    isImage: boolean
  }
  setMessageToReply: (messageToReply: {
    text: string
    isImage: boolean
  }) => void
  messageInputRef: React.MutableRefObject<HTMLInputElement | null>
}

const MessageInput = ({
  messageToReply,
  setMessageToReply,
  messageInputRef,
}: MessageInputProps) => {
  const [text, setText] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [isImageAdding, setIsImageAdding] = useState(false)
  const { state } = useChatContext()
  const { currentUser } = useAuthContext()

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
    } else if (hasWhiteSpace(text)) {
      toast.error('You cannot use whitespace characters!')
      setText('')
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
                messageToReply: messageToReply.text,
                isReplyImage: messageToReply.isImage,
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
          messageToReply: messageToReply.text,
          isReplyImage: messageToReply.isImage,
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
    setMessageToReply({ text: '', isImage: false })
  }

  return (
    <div className='fixed bottom-0 flex flex-col justify-center w-full h-24 bg-primary-bg md:static z-20'>
      {messageToReply.text !== '' && (
        <div className='flex items-center justify-between gap-12 absolute bottom-24 w-full md:w-2/3 bg-primary-bg/90 p-3 z-20'>
          <span className='flex items-center gap-4 text-sm md:text-base truncate'>
            Reply to:{' '}
            {messageToReply.isImage ? (
              <MessageImage
                image={messageToReply.text}
                className='rounded-lg w-20'
              />
            ) : (
              messageToReply.text
            )}
          </span>
          <button
            className='group p-2'
            onClick={() => setMessageToReply({ text: '', isImage: false })}>
            <AiOutlineClose className='text-xl group-hover:text-hover transition-colors shrink-0' />
          </button>
        </div>
      )}
      {/* <form
        className='relative flex items-center self-center w-[95%] md:w-[98%] bg-primary rounded-lg'
        onSubmit={handleSend}>
        <input
          className={`${
            isImageAdding ? 'placeholder-gray-400' : 'placeholder-white/70'
          } w-full mr-14 md:mr-16 text-sm p-3.5 bg-transparent md:text-lg rounded-lg`}
          type='text'
          disabled={isImageAdding ? true : false}
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder={isImageAdding ? 'Adding Image...' : 'Type Message...'}
          ref={messageInputRef}
        />
        <ImagePicker
          image={image}
          handleImageChange={handleImageChange}
          isImageAdding={isImageAdding}
        />
      </form> */}
      <form
        className='flex items-center self-center w-full px-4'
        onSubmit={handleSend}>
        <div className='relative w-full'>
          <input
            className={`${
              isImageAdding ? 'placeholder-gray-400' : 'placeholder-white/70'
            } w-full text-sm p-3.5 bg-primary md:text-lg rounded-lg`}
            type='text'
            disabled={isImageAdding ? true : false}
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder={isImageAdding ? 'Adding Image...' : 'Type Message...'}
            ref={messageInputRef}
          />
          <div className='absolute inset-y-0 right-0 flex items-center pl-3'>
            <ImagePicker
              image={image}
              handleImageChange={handleImageChange}
              isImageAdding={isImageAdding}
            />
          </div>
        </div>
      </form>
    </div>
  )
}
export default MessageInput
