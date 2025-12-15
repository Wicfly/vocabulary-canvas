// Authentication Context for Firebase Auth
import { createContext, useContext, useEffect, useState } from 'react'
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  GithubAuthProvider,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth'
import { auth } from '../utils/firebase'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Sign up with email and password
  const signup = async (email, password, displayName = null) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    if (displayName && userCredential.user) {
      await updateProfile(userCredential.user, { displayName })
    }
    return userCredential
  }

  // Sign in with email and password
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password)
  }

  // Sign in with Google
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    return signInWithPopup(auth, provider)
  }

  // Sign in with GitHub
  const signInWithGitHub = async () => {
    const provider = new GithubAuthProvider()
    return signInWithPopup(auth, provider)
  }

  // Sign out
  const logout = () => {
    return signOut(auth)
  }

  // Reset password
  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email)
  }

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    signup,
    login,
    logout,
    signInWithGoogle,
    signInWithGitHub,
    resetPassword,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

