import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'
import { useContext, useState } from 'react'
import { db } from '../../auth/firebase'
import { AuthContext } from '../../context/AuthContext'
import { toast } from 'react-hot-toast'
import Chat from './Chat'

type User = {
  displayName: string
  email: string
  photoURL: string
  uid: string
}

const Searchbar = () => {
  const [username, setUsername] = useState('')
  const [user, setUser] = useState<User | null>(null)
  const { currentUser } = useContext(AuthContext)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const q = query(
        collection(db, 'users'),
        where('displayName', '==', username)
      )
      const querySnapshot = await getDocs(q)
      if (!querySnapshot.empty) {
        querySnapshot.forEach(doc => {
          setUser(doc.data() as User)
        })
      } else {
        toast.error(`${username} not found`)
      }
    } catch (error) {
      toast.error(`Error occured: ${error}`)
    }
  }

  const handleSelect = async () => {
    const combinedId =
      currentUser && user
        ? currentUser.uid > user.uid
          ? currentUser.uid + user.uid
          : user.uid + currentUser.uid
        : ''

    try {
      const response = await getDoc(doc(db, 'chats', combinedId))

      if (!response.exists() && currentUser && user) {
        await setDoc(doc(db, 'chats', combinedId), { messages: [] })

        await updateDoc(doc(db, 'userChats', currentUser.uid), {
          [`${combinedId}.userInfo`]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [`${combinedId}.date`]: serverTimestamp(),
        })

        await updateDoc(doc(db, 'userChats', user.uid), {
          [`${combinedId}.userInfo`]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [`${combinedId}.date`]: serverTimestamp(),
        })

        toast.success(`Added ${user.displayName} to your chats`)
      }
    } catch (error) {
      toast.error(`Error occured: ${error}`)
    }

    setUser(null)
    setUsername('')
  }

  return (
    <>
      <form className='flex w-full px-6 py-4 md:py-6' onSubmit={handleSearch}>
        <input
          className='w-full border-b bg-transparent p-1.5 outline-none duration-300 focus:border-secondary md:border-b-2 md:text-xl'
          type='text'
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder='Find a user...'
        />
      </form>
      {user && (
        <div className='border-b-4 border-secondary' onClick={handleSelect}>
          <Chat photoURL={user.photoURL} displayName={user.displayName} />
        </div>
      )}
    </>
  )
}
export default Searchbar