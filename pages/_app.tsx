import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../config/firebase';
import { useEffect } from 'react';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import Login from './login';

export default function App({ Component, pageProps }: AppProps) {
  const [loggedInUser, loading, _error] = useAuthState(auth);

  useEffect(() => {
    const setUserDb = async () => {
      try {
        await setDoc(
          doc(db, 'user', loggedInUser?.email as string),
          {
            email: loggedInUser?.email,
            lastSeen: serverTimestamp(),
            photoURL: loggedInUser?.photoURL
          },
          { merge: true }
        )
      } catch (error) {
        console.log("error", error)
      }
    }
    if (loggedInUser) {
      setUserDb()
    }
    return () => {
      setUserDb
    }
  }, [loggedInUser])


  if (loading) return <h1>Loading</h1>

  if (!loggedInUser) return <Login></Login>



  return <Component {...pageProps} />
}
