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
import { useState } from 'react'
import useAuthContext from '../../hooks/useAuthContext'
import { db } from '../../firebase/config'
import { toast } from 'react-hot-toast'
import { BsSearch } from 'react-icons/bs'
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
  const { currentUser } = useAuthContext()

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
      <form
        className='flex items-center w-full rounded-lg py-6 px-6'
        onSubmit={handleSearch}>
        <div className='relative w-full'>
          <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
            <BsSearch className='text-2xl' />
          </div>
          <input
            className='w-full h-full md:text-lg pl-12 p-3 md:p-4 md:pl-12 rounded-lg bg-primary placeholder-white/70'
            type='text'
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder='Find a user...'
          />
        </div>
      </form>
      {user && (
        <div className='border-b-4 border-secondary' onClick={handleSelect}>
          <Chat
            photoURL={user.photoURL}
            displayName={user.displayName}
            user={user}
          />
        </div>
      )}
    </>
  )
}
export default Searchbar
