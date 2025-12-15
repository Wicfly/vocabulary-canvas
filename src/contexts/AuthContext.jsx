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
    if (!auth) throw new Error('Firebase authentication is not configured')
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    if (displayName && userCredential.user) {
      await updateProfile(userCredential.user, { displayName })
    }
    return userCredential
  }

  // Sign in with email and password
  const login = (email, password) => {
    if (!auth) throw new Error('Firebase authentication is not configured')
    return signInWithEmailAndPassword(auth, email, password)
  }

  // Sign in with Google
  const signInWithGoogle = async () => {
    if (!auth) throw new Error('Firebase authentication is not configured')
    const provider = new GoogleAuthProvider()
    return signInWithPopup(auth, provider)
  }

  // Sign in with GitHub
  const signInWithGitHub = async () => {
    if (!auth) throw new Error('Firebase authentication is not configured')
    const provider = new GithubAuthProvider()
    return signInWithPopup(auth, provider)
  }

  // Sign out
  const logout = () => {
    if (!auth) return Promise.resolve()
    return signOut(auth)
  }

  // Reset password
  const resetPassword = (email) => {
    if (!auth) throw new Error('Firebase authentication is not configured')
    return sendPasswordResetEmail(auth, email)
  }

  // Listen to auth state changes
  useEffect(() => {
    if (!auth) {
      // If Firebase is not configured, skip auth and mark as not loading
      setLoading(false)
      return
    }

    try {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setCurrentUser(user)
        setLoading(false)
      }, (error) => {
        console.error('Auth state change error:', error)
        setLoading(false)
      })

      return unsubscribe
    } catch (error) {
      console.error('Error setting up auth state listener:', error)
      setLoading(false)
    }
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

