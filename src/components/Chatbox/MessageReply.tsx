import type { MessageType } from '../../types/types'
import MessageImage from './MessageImage'

type MessageReplyProps = {
  message: MessageType
  isCurrentUser: boolean
}

const MessageReply = ({ message, isCurrentUser }: MessageReplyProps) => {
  return (
    <span
      className={`${
        !/\s/.test(message.messageToReply) ? 'break-all' : 'break-words'
      } relative top-1 md:top-2 ${
        isCurrentUser ? 'right-2' : 'left-2'
      } bg-primary-bg/80 rounded-xl p-4 text-xs md:text-sm`}>
      Reply to:{' '}
      {message.isReplyImage ? (
        <MessageImage
          image={message.messageToReply}
          className='rounded-lg w-12 my-2 md:w-20'
        />
      ) : (
        message.messageToReply
      )}
    </span>
  )
}
export default MessageReply
