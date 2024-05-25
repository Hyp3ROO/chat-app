import {
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDocs,
  query,
  updateDoc,
} from 'firebase/firestore'
import { db } from '../firebase/config'
import { User, deleteUser } from 'firebase/auth'

export const deleteAccount = async (currentUser: User) => {
  await deleteDoc(doc(db, 'userChats', currentUser.uid))
  await deleteDoc(doc(db, 'users', currentUser.uid))
  const querySnapshot = await getDocs(query(collection(db, 'chats')))
  querySnapshot.forEach(async document => {
    if (document.id.includes(currentUser.uid)) {
      await deleteDoc(doc(db, 'chats', document.id))
    }
  })
  const querySnapshot2 = await getDocs(query(collection(db, 'userChats')))
  querySnapshot2.forEach(document => {
    const documentArr = Object.entries(document.data())
    documentArr.forEach(async arr => {
      if (arr[0].includes(currentUser.uid)) {
        await updateDoc(
          doc(db, 'userChats', arr[0].replace(currentUser.uid, '')),
          {
            [`${arr[0]}`]: deleteField(),
          }
        )
      }
    })
  })
  await deleteUser(currentUser)
}
