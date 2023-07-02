import type { Timestamp } from 'firebase/firestore'
import { useContext, useEffect, useRef } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { useMediaQuery } from 'react-responsive'
import { formatDate } from '../../utils/formatDate'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

type MessageProps = {
  message: {
    id: string
    text: string
    image?: string
    date: Timestamp
    senderId: string
  }
}

const Message = ({ message }: MessageProps) => {
  const { currentUser } = useContext(AuthContext)
  const isCurrentUser = message.senderId === currentUser?.uid
  const scrollToRef = useRef<HTMLDivElement | null>(null)
  const isMobile = useMediaQuery({ maxWidth: 767 })

  useEffect(
    () => scrollToRef.current?.scrollIntoView({ behavior: 'smooth' }),
    [scrollToRef]
  )

  return (
    <div
      className={`relative flex ${
        isCurrentUser ? 'flex-row-reverse' : 'flex-row'
      }`}
      ref={scrollToRef}>
      <div
        className={`${
          isCurrentUser ? 'items-end' : 'items-start'
        } flex max-w-[80%] flex-col gap-2`}>
        {message.text !== '' && (
          <div
            className={`flex w-fit items-center gap-4 rounded-xl p-3 text-justify text-sm md:p-4 md:text-lg ${
              isCurrentUser
                ? 'rounded-br-none bg-secondary'
                : 'rounded-bl-none bg-white text-black'
            }`}>
            <div
              className={`flex flex-col gap-4 ${
                isCurrentUser ? 'items-end' : 'items-start'
              }`}>
              <p className='break-words md:text-lg'>{message.text}</p>
            </div>
          </div>
        )}
        {message.image && (
          <Zoom zoomMargin={4}>
            <img
              src={message.image}
              alt=''
              className='rounded-lg object-cover'
              loading='lazy'
              width={isMobile ? 100 : 200}
              height={isMobile ? 100 : 200}
            />
          </Zoom>
        )}
        {message.date.seconds && (
          <span className='absolute -bottom-5 text-[.6rem] md:text-xs'>
            {formatDate(new Date(message.date.seconds * 1000))}
          </span>
        )}
      </div>
    </div>
  )
}
export default Message
