import type { Timestamp } from 'firebase/firestore'

export type MessageType = {
  id: string
  text: string
  image: string
  date: Timestamp
  senderId: string
  messageToReply: string
  isReplyImage: boolean
}
