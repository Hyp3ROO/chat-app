import type { MessageType } from '../../types/types'
import { useContext, useEffect, useRef, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { useMediaQuery } from 'react-responsive'
import { formatDate } from '../../utils/formatDate'
import { BsFillReplyFill } from 'react-icons/bs'
import MessageImage from './MessageImage'
import MessageReply from './MessageReply'

type MessageProps = {
  message: MessageType
  handleReplyClick: (text: string, isImage: boolean) => void
}

const Message = ({ message, handleReplyClick }: MessageProps) => {
  const { currentUser } = useContext(AuthContext)
  const [showReplyButton, setShowReplyButton] = useState(false)
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
      ref={scrollToRef}
      onMouseEnter={() => setShowReplyButton(true)}
      onMouseLeave={() => setShowReplyButton(false)}>
      <div
        className={`${
          isCurrentUser ? 'items-end' : 'items-start'
        } flex max-w-[80%] flex-col gap-2`}>
        {message.text !== '' && (
          <div
            className={`${
              isCurrentUser ? 'items-end' : 'items-start'
            } flex flex-col`}>
            {message?.messageToReply && (
              <MessageReply message={message} isCurrentUser={isCurrentUser} />
            )}
            <div className='flex items-center gap-1'>
              <div
                className={`flex w-fit items-center gap-4 rounded-xl p-3 text-justify text-sm md:p-4 md:text-base z-10 ${
                  isCurrentUser
                    ? 'rounded-br-none bg-secondary'
                    : 'rounded-bl-none bg-white text-black'
                }`}>
                <span
                  className={
                    !/\s/.test(message.text) ? 'break-all' : 'break-words'
                  }>
                  {message.text}
                </span>
              </div>
              {message.senderId !== currentUser?.uid && (
                <button
                  className={`${
                    showReplyButton ? 'opacity-100' : 'opacity-0'
                  } p-1 font-bold transition-opacity md:p-2 group`}
                  onClick={() => handleReplyClick(message.text, false)}>
                  <BsFillReplyFill className='text-xl md:text-2xl group-hover:text-hover' />
                </button>
              )}
            </div>
          </div>
        )}
        {message.image && (
          <div
            className={`${
              isCurrentUser ? 'items-end' : 'items-start'
            } flex flex-col`}>
            {message?.messageToReply && (
              <MessageReply message={message} isCurrentUser={isCurrentUser} />
            )}
            <div className='flex items-center gap-1'>
              <MessageImage
                image={message.image}
                width={isMobile ? 100 : 200}
                height={isMobile ? 100 : 200}
              />
              {message.senderId !== currentUser?.uid && (
                <button
                  className={`${
                    showReplyButton ? 'opacity-100' : 'opacity-0'
                  } p-1 font-bold transition-opacity md:p-2 group`}
                  onClick={() => handleReplyClick(message.image, true)}>
                  <BsFillReplyFill className='text-xl md:text-2xl group-hover:text-hover' />
                </button>
              )}
            </div>
          </div>
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
