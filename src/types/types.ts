export type MessageType = {
  id: string
  text: string
  image: string
  date: {
    seconds: number
    nanoseconds: number
  }
  senderId: string
  messageToReply: string
  isReplyImage: boolean
  action?: 'deleted' | 'edited'
}
