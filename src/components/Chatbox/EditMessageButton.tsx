import { AiFillEdit } from 'react-icons/ai'

type EditMessageButtonProps = {
  showMessageOptions: boolean
  messageId: string
  messageText: string
  setEditedText: React.Dispatch<React.SetStateAction<string>>
  setEditingMessageId: React.Dispatch<React.SetStateAction<string>>
}

const EditMessageButton = ({
  showMessageOptions,
  messageId,
  messageText,
  setEditedText,
  setEditingMessageId,
}: EditMessageButtonProps) => {
  const handleClick = () => {
    setEditingMessageId((currenteditingMessageId: string) => {
      if (currenteditingMessageId === messageId) {
        return ''
      } else {
        return messageId
      }
    })
    setEditedText(messageText)
  }
  return (
    <button
      className={`${
        showMessageOptions ? 'opacity-100' : 'opacity-0'
      } message-options-btn group`}
      onClick={handleClick}>
      <AiFillEdit className='text-xl md:text-2xl group-hover:text-hover transition-colors' />
    </button>
  )
}
export default EditMessageButton
