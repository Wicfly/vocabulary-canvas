import { useState, useEffect } from 'react'
import WordInput from './components/WordInput'
import Sidebar from './components/Sidebar'
import NounCanvas from './components/NounCanvas'
import VocabularyGallery from './components/VocabularyGallery'
import Login from './components/Login'
import { useAuth } from './contexts/AuthContext'
import { loadFromStorage, saveToStorage } from './utils/storage'
import { loadFromFirestore, saveToFirestore } from './utils/firestoreStorage'
import { getWordDefinition, generateImage } from './utils/imageGenerator'
import { classifyWord } from './utils/wordClassifier'
import { recognizeImage } from './utils/imageRecognition'
import { classifyCategory } from './utils/categoryClassifier'
import { generateVideo } from './utils/videoGenerator'
import './App.css'

function App() {
  const { currentUser, loading: authLoading } = useAuth()
  const [showLogin, setShowLogin] = useState(false)
  
  // Store nouns by category: { main: [], kitchen: [], home: [] }
  const [nounsByCategory, setNounsByCategory] = useState({ main: [], kitchen: [], home: [] })
  const [nonNouns, setNonNouns] = useState([])
  const [currentView, setCurrentView] = useState('canvas') // 'canvas' or 'gallery'
  const [currentCategory, setCurrentCategory] = useState('main') // 'main', 'kitchen', 'home'

  // Load data from Firestore (if logged in) or localStorage (if not logged in)
  useEffect(() => {
    const loadData = async () => {
      if (currentUser) {
        // Load from Firestore for logged-in users
        const savedData = await loadFromFirestore(currentUser.uid)
        if (savedData) {
          if (savedData.nounsByCategory) {
            setNounsByCategory(savedData.nounsByCategory)
          } else if (savedData.nouns) {
            setNounsByCategory({ main: savedData.nouns || [], kitchen: [], home: [] })
          }
          setNonNouns(savedData.nonNouns || [])
        }
      } else {
        // Load from localStorage for guests
        const savedData = loadFromStorage()
        if (savedData) {
          if (savedData.nounsByCategory) {
            setNounsByCategory(savedData.nounsByCategory)
          } else if (savedData.nouns) {
            setNounsByCategory({ main: savedData.nouns || [], kitchen: [], home: [] })
          }
          setNonNouns(savedData.nonNouns || [])
        }
      }
    }
    
    if (!authLoading) {
      loadData()
    }
  }, [currentUser, authLoading])

  // Save data to Firestore (if logged in) or localStorage (if not logged in)
  useEffect(() => {
    if (authLoading) return
    
    const saveData = async () => {
      const data = { nounsByCategory, nonNouns }
      
      if (currentUser) {
        // Save to Firestore for logged-in users
        try {
          await saveToFirestore(currentUser.uid, data)
        } catch (error) {
          console.error('Failed to save to Firestore, falling back to localStorage:', error)
          saveToStorage(data)
        }
      } else {
        // Save to localStorage for guests
        saveToStorage(data)
      }
    }
    
    saveData()
  }, [nounsByCategory, nonNouns, currentUser, authLoading])
  
  // Note: All categories are now displayed on the same canvas, so we don't need currentNouns filter

  const handleAddWord = async (word, isNoun, imageUrl, definition) => {
    // Classify category for nouns
    let category = 'main'
    if (isNoun) {
      category = classifyCategory(word)
    }

    // Calculate position for new word
    // If there are existing words in this category, place near them
    // Otherwise, place in a default position for this category
    let centerX = 0
    let centerY = 0
    
    if (isNoun) {
      // Use current state to get existing words
      const categoryNouns = nounsByCategory[category] || []
      if (categoryNouns.length > 0) {
        // Calculate center of existing words in this category
        const validNouns = categoryNouns.filter(n => n.x !== undefined && n.y !== undefined && n.x !== null && n.y !== null)
        if (validNouns.length > 0) {
          const avgX = validNouns.reduce((sum, n) => sum + (n.x || 0), 0) / validNouns.length
          const avgY = validNouns.reduce((sum, n) => sum + (n.y || 0), 0) / validNouns.length
          // Place new word near the center, offset by a small amount
          centerX = avgX + (Math.random() - 0.5) * 200
          centerY = avgY + (Math.random() - 0.5) * 200
          } else {
            // Fallback to default position (centered in viewport)
            const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1920
            const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 1080
            const viewportCenterX = viewportWidth / 2
            const viewportCenterY = viewportHeight / 2
            const categoryOffsets = {
              main: { x: -200, y: 0 },
              kitchen: { x: 200, y: 0 },
              home: { x: 400, y: 0 }
            }
            const offset = categoryOffsets[category] || categoryOffsets.main
            centerX = viewportCenterX + offset.x
            centerY = viewportCenterY + offset.y
          }
        } else {
          // Default positions for each category (centered in viewport, spaced horizontally)
          const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1920
          const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 1080
          const viewportCenterX = viewportWidth / 2
          const viewportCenterY = viewportHeight / 2
        const categoryOffsets = {
          main: { x: -200, y: 0 },
          kitchen: { x: 200, y: 0 },
          home: { x: 400, y: 0 }
        }
        const offset = categoryOffsets[category] || categoryOffsets.main
        centerX = viewportCenterX + offset.x
        centerY = viewportCenterY + offset.y
      }
    }
    
    // For non-nouns (adjectives/verbs), try to generate video
    let videoUrl = null
    if (!isNoun) {
      try {
        // Determine word type for better video generation
        const wordClass = await classifyWord(word)
        const wordType = wordClass === 'verb' ? 'verb' : 'adjective'
        
        videoUrl = await generateVideo(word, wordType)
        if (videoUrl) {
          console.log('Video generated for:', word, videoUrl)
        }
      } catch (err) {
        console.warn('Video generation failed, using image:', err)
        // Continue with image if video generation fails
      }
    }
    
    const newWord = {
      id: Date.now().toString(),
      word,
      imageUrl: videoUrl || imageUrl, // Use video if available, otherwise image
      videoUrl: videoUrl, // Store video URL separately
      isVideo: !!videoUrl, // Flag to indicate if this is a video
      definition,
      category,
      x: isNoun ? centerX : 0,
      y: isNoun ? centerY : 0,
    }

    if (isNoun) {
      setNounsByCategory(prev => ({
        ...prev,
        [category]: [...(prev[category] || []), newWord]
      }))
    } else {
      setNonNouns([...nonNouns, newWord])
    }
  }

  const handleAddWordFromImage = async (imageBase64) => {
    try {
      // Recognize the object in the image
      let objectName = 'Photo'
      
      try {
        const recognizedWord = await recognizeImage(imageBase64)
        if (recognizedWord && recognizedWord !== 'Photo') {
          objectName = recognizedWord
          console.log('Recognized object:', objectName)
        }
      } catch (err) {
        console.warn('Image recognition failed:', err)
        // Keep default name 'Photo'
      }
      
      // Classify the word - wrap in try-catch to handle errors gracefully
      let isNoun = true // Default to noun for photos
      try {
        if (objectName && objectName !== 'Photo') {
          const wordClass = await classifyWord(objectName)
          isNoun = wordClass === 'noun'
        }
      } catch (err) {
        console.warn('Failed to classify word, defaulting to noun:', err)
      }
      
      // Get definition - wrap in try-catch to handle errors gracefully
      let definition = 'A photo object'
      try {
        if (objectName && objectName !== 'Photo') {
          definition = await getWordDefinition(objectName) || definition
        }
      } catch (err) {
        console.warn('Failed to get definition:', err)
      }
      
      // Classify category for nouns
      let category = 'main'
      if (isNoun) {
        category = classifyCategory(objectName)
      }

      // Calculate position for new word
      let centerX = 0
      let centerY = 0
      
      if (isNoun) {
        const categoryNouns = nounsByCategory[category] || []
        if (categoryNouns.length > 0) {
          // Calculate center of existing words in this category
          const validNouns = categoryNouns.filter(n => n.x !== undefined && n.y !== undefined && n.x !== null && n.y !== null)
          if (validNouns.length > 0) {
            const avgX = validNouns.reduce((sum, n) => sum + (n.x || 0), 0) / validNouns.length
            const avgY = validNouns.reduce((sum, n) => sum + (n.y || 0), 0) / validNouns.length
            // Place new word near the center, offset by a small amount
            centerX = avgX + (Math.random() - 0.5) * 200
            centerY = avgY + (Math.random() - 0.5) * 200
          } else {
            // Fallback to default position (centered in viewport)
            const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1920
            const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 1080
            const viewportCenterX = viewportWidth / 2
            const viewportCenterY = viewportHeight / 2
            const categoryOffsets = {
              main: { x: -200, y: 0 },
              kitchen: { x: 200, y: 0 },
              home: { x: 400, y: 0 }
            }
            const offset = categoryOffsets[category] || categoryOffsets.main
            centerX = viewportCenterX + offset.x
            centerY = viewportCenterY + offset.y
          }
        } else {
          // Default positions for each category (centered in viewport, spaced horizontally)
          // Use canvas coordinates (not viewport coordinates)
          // Since canvas will be centered, we place words relative to viewport center
          const viewportCenterX = typeof window !== 'undefined' ? window.innerWidth / 2 : 960
          const viewportCenterY = typeof window !== 'undefined' ? window.innerHeight / 2 : 540
          const categoryOffsets = {
            main: { x: -200, y: 0 },
            kitchen: { x: 200, y: 0 },
            home: { x: 400, y: 0 }
          }
          const offset = categoryOffsets[category] || categoryOffsets.main
          centerX = viewportCenterX + offset.x
          centerY = viewportCenterY + offset.y
          console.log('Creating new word at:', { centerX, centerY, category, viewportCenterX, viewportCenterY })
        }
      }
      
      // Use the photo as a regular image
      const newWord = {
        id: Date.now().toString(),
        word: objectName,
        imageUrl: imageBase64, // Use photo as image
        definition,
        category,
        x: isNoun ? centerX : 0,
        y: isNoun ? centerY : 0,
      }

      if (isNoun) {
        setNounsByCategory(prev => ({
          ...prev,
          [category]: [...(prev[category] || []), newWord]
        }))
      } else {
        setNonNouns([...nonNouns, newWord])
      }
    } catch (error) {
      console.error('Error processing image:', error)
      throw error
    }
  }

  const handleDeleteWord = (id, isNoun, category = null) => {
    if (isNoun) {
      // If category is provided, delete from that category
      // Otherwise, search all categories
      if (category) {
        setNounsByCategory(prev => ({
          ...prev,
          [category]: (prev[category] || []).filter(word => word.id !== id)
        }))
      } else {
        // Search all categories
        setNounsByCategory(prev => {
          const updated = { ...prev }
          Object.keys(updated).forEach(cat => {
            updated[cat] = (updated[cat] || []).filter(word => word.id !== id)
          })
          return updated
        })
      }
    } else {
      setNonNouns(nonNouns.filter(word => word.id !== id))
    }
  }

  const handleUpdateNounPosition = (id, x, y, category = null) => {
    setNounsByCategory(prev => {
      const updated = { ...prev }
      // If category is provided, update in that category
      // Otherwise, search all categories
      if (category) {
        updated[category] = (updated[category] || []).map(word => 
          word.id === id ? { ...word, x, y } : word
        )
      } else {
        // Search all categories
        Object.keys(updated).forEach(cat => {
          updated[cat] = (updated[cat] || []).map(word => 
            word.id === id ? { ...word, x, y } : word
          )
        })
      }
      return updated
    })
  }

  // Show loading state while auth is initializing
  if (authLoading) {
    return (
      <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-black/60">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      {/* Top Input Bar */}
      <WordInput 
        onAddWord={handleAddWord}
        onAddWordFromImage={handleAddWordFromImage}
      />

      {/* Left Sidebar */}
      <Sidebar 
        currentView={currentView} 
        onViewChange={setCurrentView}
        currentCategory={currentCategory}
        onCategoryChange={setCurrentCategory}
        currentUser={currentUser}
        onLoginClick={() => setShowLogin(true)}
      />

      {/* Main Content */}
      {currentView === 'canvas' ? (
        <NounCanvas
          nounsByCategory={nounsByCategory}
          onDelete={handleDeleteWord}
          onUpdatePosition={handleUpdateNounPosition}
        />
      ) : (
        <VocabularyGallery
          words={nonNouns}
          onDelete={handleDeleteWord}
        />
      )}

      {/* Login Modal */}
      {showLogin && <Login onClose={() => setShowLogin(false)} />}
    </div>
  )
}

export default App

