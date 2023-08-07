import { BsFillReplyFill } from 'react-icons/bs'

type ReplyButtonProps = {
  showReplyButton: boolean
  replyTo: string
  handleReplyClick: (text: string, isImage: boolean) => void
  isImage: boolean
}

const ReplyButton = ({
  showReplyButton,
  replyTo,
  handleReplyClick,
  isImage,
}: ReplyButtonProps) => {
  return (
    <button
      className={`${
        showReplyButton ? 'opacity-100' : 'opacity-0'
      } p-1 font-bold transition-opacity md:p-2 group focus:opacity-100`}
      onClick={() => handleReplyClick(replyTo, isImage)}>
      <BsFillReplyFill className='text-xl md:text-2xl group-hover:text-hover' />
    </button>
  )
}
export default ReplyButton
