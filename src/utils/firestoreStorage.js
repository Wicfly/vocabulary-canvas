// Firestore Storage Service
// Stores user data in Firestore instead of localStorage
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore'
import { db } from './firebase'

// Check if Firestore is available
const isFirestoreAvailable = () => {
  return db !== null && db !== undefined
}

/**
 * Save user data to Firestore
 * @param {string} userId - User ID
 * @param {Object} data - Data to save
 */
export const saveToFirestore = async (userId, data) => {
  if (!userId) {
    console.warn('Cannot save to Firestore: No user ID')
    return
  }

  if (!isFirestoreAvailable()) {
    console.warn('Firestore is not available. Data will not be saved.')
    throw new Error('Firestore is not configured')
  }

  try {
    const userDocRef = doc(db, 'users', userId)
    await setDoc(
      userDocRef,
      {
        ...data,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    )
    console.log('Data saved to Firestore successfully')
  } catch (error) {
    console.error('Failed to save to Firestore:', error)
    throw error
  }
}

/**
 * Load user data from Firestore
 * @param {string} userId - User ID
 * @returns {Object|null} User data or null if not found
 */
export const loadFromFirestore = async (userId) => {
  if (!userId) {
    console.warn('Cannot load from Firestore: No user ID')
    return null
  }

  if (!isFirestoreAvailable()) {
    console.warn('Firestore is not available. Cannot load data.')
    return null
  }

  try {
    const userDocRef = doc(db, 'users', userId)
    const docSnap = await getDoc(userDocRef)
    
    if (docSnap.exists()) {
      return docSnap.data()
    } else {
      console.log('No user data found in Firestore')
      return null
    }
  } catch (error) {
    console.error('Failed to load from Firestore:', error)
    return null
  }
}

/**
 * Update user data in Firestore
 * @param {string} userId - User ID
 * @param {Object} updates - Partial data to update
 */
export const updateFirestore = async (userId, updates) => {
  if (!userId) {
    console.warn('Cannot update Firestore: No user ID')
    return
  }

  if (!isFirestoreAvailable()) {
    console.warn('Firestore is not available. Cannot update data.')
    throw new Error('Firestore is not configured')
  }

  try {
    const userDocRef = doc(db, 'users', userId)
    await updateDoc(userDocRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    })
    console.log('Data updated in Firestore successfully')
  } catch (error) {
    console.error('Failed to update Firestore:', error)
    throw error
  }
}

