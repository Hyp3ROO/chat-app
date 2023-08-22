import type { MessageType } from '../../types/types'
import { useEffect, useRef, useState } from 'react'
import useAuthContext from '../../context/useAuthContext'
import { useMediaQuery } from 'react-responsive'
import { formatDate } from '../../utils/formatDate'
import Linkify from 'linkify-react'
import MessageImage from './MessageImage'
import MessageReply from './MessageReply'
import ReplyButton from './ReplyButton'

type MessageProps = {
  message: MessageType
  handleReplyClick: (text: string, isImage: boolean) => void
}

const Message = ({ message, handleReplyClick }: MessageProps) => {
  const { currentUser } = useAuthContext()
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
                  <Linkify
                    options={{
                      target: '_blank',
                      className:
                        'text-secondary-bg hover:text-hover transition-colors',
                      truncate: 42,
                    }}>
                    {message.text}
                  </Linkify>
                </span>
              </div>
              {message.senderId !== currentUser?.uid && (
                <ReplyButton
                  showReplyButton={showReplyButton}
                  replyTo={message.text}
                  handleReplyClick={handleReplyClick}
                  isImage={false}
                />
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
                <ReplyButton
                  showReplyButton={showReplyButton}
                  replyTo={message.image}
                  handleReplyClick={handleReplyClick}
                  isImage={true}
                />
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
