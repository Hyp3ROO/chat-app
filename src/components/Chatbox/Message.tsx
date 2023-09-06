import type { MessageType } from '../../types/types'
import { useEffect, useRef, useState } from 'react'
import useAuthContext from '../../context/useAuthContext'
import useChatContext from '../../context/useChatContext'
import { useMediaQuery } from 'react-responsive'
import toast from 'react-hot-toast'
import { formatDate } from '../../utils/formatDate'
import { updateMessageInfo } from '../../utils/updateMessageInfo'
import Linkify from 'linkify-react'
import MessageImage from './MessageImage'
import MessageReply from './MessageReply'
import ReplyButton from './ReplyButton'
import DeleteMessageButton from './DeleteMessageButton'
import EditMessageButton from './EditMessageButton'

type MessageProps = {
  message: MessageType
  handleReplyClick: (text: string, isImage: boolean) => void
  editingMessageId: string
  setEditingMessageId: React.Dispatch<React.SetStateAction<string>>
}

const Message = ({
  message,
  handleReplyClick,
  editingMessageId,
  setEditingMessageId,
}: MessageProps) => {
  const { currentUser } = useAuthContext()
  const { selectedUserData } = useChatContext()
  const [showMessageOptions, setShowMessageOptions] = useState(false)
  const [editedText, setEditedText] = useState(message.text)
  const isCurrentUser = message.senderId === currentUser?.uid
  const scrollToRef = useRef<HTMLDivElement | null>(null)
  const isMobile = useMediaQuery({ maxWidth: 767 })

  const messageInfoData = {
    currentUserUID: currentUser?.uid || '',
    selectedUserUID: selectedUserData.user?.uid || '',
    chatId: selectedUserData?.chatId || '',
    message,
    newText: editedText,
    action: 'edited' as 'edited',
  }

  const handleEdit = () => {
    try {
      updateMessageInfo(messageInfoData)
      toast.success('Message successfully edited')
      setEditingMessageId('')
    } catch (error) {
      toast.error('Something went wrong')
      setEditingMessageId('')
    }
  }

  const onEnterPress = (e: React.KeyboardEvent) => {
    if (e.key == 'Enter' && e.shiftKey === false) {
      e.preventDefault()
      handleEdit()
    }
  }

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
      onMouseEnter={() => setShowMessageOptions(true)}
      onMouseLeave={() => setShowMessageOptions(false)}>
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
            <div
              className={`flex items-center gap-2 ${
                message.senderId === currentUser?.uid ? 'flex-row-reverse' : ''
              }`}>
              <div
                className={`${
                  message.action === 'deleted'
                    ? 'bg-gray-500'
                    : isCurrentUser
                    ? 'rounded-br-none bg-secondary'
                    : 'rounded-bl-none bg-white text-black'
                } flex w-fit items-center gap-4 rounded-xl p-3 text-justify text-sm md:p-4 md:text-base z-10`}>
                <span className='break-all'>
                  <Linkify
                    options={{
                      target: '_blank',
                      className:
                        'text-secondary-bg hover:text-hover transition-colors',
                      truncate: 42,
                    }}>
                    {editingMessageId === message.id ? (
                      <textarea
                        className='flex items-center w-full h-12 md:h-14 text-sm p-3.5 bg-primary md:text-lg rounded-lg resize-none scrollbar-thin scrollbar-track-primary-bg scrollbar-thumb-secondary-bg'
                        value={editedText}
                        onChange={e => setEditedText(e.target.value)}
                        onKeyDown={onEnterPress}
                        autoFocus
                        onFocus={e => e.target.select()}
                      />
                    ) : (
                      message.text
                    )}
                  </Linkify>
                </span>
              </div>
              {message.action !== 'deleted' &&
                (message.senderId !== currentUser?.uid ? (
                  <ReplyButton
                    showMessageOptions={showMessageOptions}
                    replyTo={message.text}
                    handleReplyClick={handleReplyClick}
                    isImage={false}
                  />
                ) : (
                  <>
                    <DeleteMessageButton
                      showMessageOptions={showMessageOptions}
                      message={message}
                    />
                    <EditMessageButton
                      showMessageOptions={showMessageOptions}
                      messageId={message.id}
                      messageText={message.text}
                      setEditedText={setEditedText}
                      setEditingMessageId={setEditingMessageId}
                    />
                  </>
                ))}
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
            <div
              className={`flex items-center gap-2 ${
                isCurrentUser ? 'flex-row-reverse' : 'flex-row'
              }`}>
              <MessageImage
                image={message.image}
                width={isMobile ? 100 : 200}
                height={isMobile ? 100 : 200}
              />
              {message.action !== 'deleted' &&
                !message.text &&
                (message.senderId !== currentUser?.uid ? (
                  <ReplyButton
                    showMessageOptions={showMessageOptions}
                    replyTo={message.image}
                    handleReplyClick={handleReplyClick}
                    isImage={true}
                  />
                ) : (
                  <DeleteMessageButton
                    showMessageOptions={showMessageOptions}
                    message={message}
                  />
                ))}
            </div>
          </div>
        )}
        {message.date.seconds && (
          <span className='absolute -bottom-5 text-[.6rem] md:text-xs'>
            {formatDate(new Date(message.date.seconds * 1000))}
            {message.action === 'edited' && ' (edited)'}
          </span>
        )}
      </div>
    </div>
  )
}
export default Message
