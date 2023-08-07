import { collection, getDocs, query, updateDoc, doc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { User, updateProfile } from 'firebase/auth'

export const updateProfileInfo = async (
  currentUser: User | null,
  path: string,
  key: string,
  newInfo: string
) => {
  if (!currentUser) return
  const currentUserUID = currentUser?.uid || ''

  await updateProfile(currentUser, {
    [key]: newInfo,
  })
  await updateDoc(doc(db, 'users', currentUserUID), {
    [key]: newInfo,
  })

  const q = query(collection(db, 'userChats'))
  const querySnapshot = await getDocs(q)
  if (!querySnapshot.empty) {
    querySnapshot.forEach(document => {
      const documentArr = Object.entries(document.data())
      documentArr.forEach(async arr => {
        if (
          arr[0].includes(currentUserUID) &&
          arr[1].userInfo.uid === currentUserUID
        ) {
          await updateDoc(
            doc(db, 'userChats', arr[0].replace(currentUserUID, '')),
            {
              [`${arr[0]}.${path}`]: newInfo,
            }
          )
        }
      })
    })
  }
}
