import { BsFillReplyFill } from 'react-icons/bs'

type ReplyButtonProps = {
  showMessageOptions: boolean
  replyTo: string
  handleReplyClick: (text: string, isImage: boolean) => void
  isImage: boolean
}

const ReplyButton = ({
  showMessageOptions,
  replyTo,
  handleReplyClick,
  isImage,
}: ReplyButtonProps) => {
  return (
    <button
      className={`${
        showMessageOptions ? 'opacity-100' : 'opacity-0'
      } message-options-btn group`}
      onClick={() => handleReplyClick(replyTo, isImage)}>
      <BsFillReplyFill className='text-xl md:text-2xl group-hover:text-hover transition-colors' />
    </button>
  )
}
export default ReplyButton
