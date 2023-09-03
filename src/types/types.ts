export type MessageType = {
  id: string
  text: string
  image: string
  date: number
  senderId: string
  messageToReply: string
  isReplyImage: boolean
  isDeleted?: boolean
}
