import { useContext } from 'react'
import { ChatContext } from './ChatContext'

const useChatContext = () => {
  const chatContext = useContext(ChatContext)
  if (!chatContext)
    throw new Error(
      'No ChatContext.Provider found when calling useChatContext.'
    )
  return chatContext
}
export default useChatContext
