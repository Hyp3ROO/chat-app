import type { MessageType } from '../types/types'
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  documentId,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from '../firebase/config'
import toast from 'react-hot-toast'

type updateMessageInfoProps = {
  currentUserUID: string
  selectedUserUID: string
  chatId: string
  message: MessageType
  newText: string
  action: 'deleted' | 'edited'
}

export const updateMessageInfo = async ({
  currentUserUID,
  selectedUserUID,
  chatId,
  message,
  newText,
  action,
}: updateMessageInfoProps) => {
  try {
    if (message.text === newText) return
    await updateDoc(doc(db, 'chats', chatId), {
      messages: arrayRemove({
        ...message,
      }),
    })
    await updateDoc(doc(db, 'chats', chatId), {
      messages: arrayUnion({
        ...message,
        text: newText,
        image:
          action === 'deleted' ? null : message.image ? message.image : null,
        action,
      }),
    })
    const q = query(
      collection(db, 'userChats'),
      where(documentId(), '==', currentUserUID)
    )
    const querySnapshot = await getDocs(q)
    if (!querySnapshot.empty) {
      querySnapshot.forEach(document => {
        const documentArr = Object.entries(document.data())
        documentArr.forEach(async arr => {
          if (arr[0] === chatId && arr[1].lastMessage.messageId == message.id) {
            await updateDoc(doc(db, 'userChats', currentUserUID), {
              [`${chatId}.lastMessage`]: {
                text: newText,
                senderId: currentUserUID,
                action,
                messageId: message.id,
              },
            })
            await updateDoc(doc(db, 'userChats', selectedUserUID), {
              [`${chatId}.lastMessage`]: {
                text: newText,
                senderId: currentUserUID,
                action,
                messageId: message.id,
              },
            })
          }
        })
      })
    }
  } catch (error) {
    toast.error('Something went wrong')
  }
}
