import { useState, useEffect } from 'react'
import WordInput from './components/WordInput'
import Sidebar from './components/Sidebar'
import NounCanvas from './components/NounCanvas'
import VocabularyGallery from './components/VocabularyGallery'
import { loadFromStorage, saveToStorage } from './utils/storage'
import { getWordDefinition, generateImage } from './utils/imageGenerator'
import { classifyWord } from './utils/wordClassifier'
import { recognizeImage } from './utils/imageRecognition'
import { classifyCategory } from './utils/categoryClassifier'
import { generateVideo } from './utils/videoGenerator'
import './App.css'

function App() {
  // Store nouns by category: { main: [], kitchen: [], home: [] }
  const [nounsByCategory, setNounsByCategory] = useState({ main: [], kitchen: [], home: [] })
  const [nonNouns, setNonNouns] = useState([])
  const [currentView, setCurrentView] = useState('canvas') // 'canvas' or 'gallery'
  const [currentCategory, setCurrentCategory] = useState('main') // 'main', 'kitchen', 'home'

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = loadFromStorage()
    if (savedData) {
      // Support both old format (nouns array) and new format (nounsByCategory object)
      if (savedData.nounsByCategory) {
        setNounsByCategory(savedData.nounsByCategory)
      } else if (savedData.nouns) {
        // Migrate old data to new format
        setNounsByCategory({ main: savedData.nouns || [], kitchen: [], home: [] })
      }
      setNonNouns(savedData.nonNouns || [])
    }
  }, [])

  // Save to localStorage whenever data changes
  useEffect(() => {
    saveToStorage({ nounsByCategory, nonNouns })
  }, [nounsByCategory, nonNouns])
  
  // Get current category's nouns
  const currentNouns = nounsByCategory[currentCategory] || []

  const handleAddWord = async (word, isNoun, imageUrl, definition) => {
    // Calculate center position for new nouns
    const centerX = isNoun ? window.innerWidth / 2 - 40 : 0
    const centerY = isNoun ? window.innerHeight / 2 - 40 : 0
    
    // Classify category for nouns
    let category = 'main'
    if (isNoun) {
      category = classifyCategory(word)
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
      
      // Calculate center position for new nouns
      const centerX = isNoun ? window.innerWidth / 2 - 40 : 0
      const centerY = isNoun ? window.innerHeight / 2 - 40 : 0
      
      // Classify category for nouns
      let category = 'main'
      if (isNoun) {
        category = classifyCategory(objectName)
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

  const handleUpdateNounPosition = (id, x, y) => {
    setNounsByCategory(prev => ({
      ...prev,
      [currentCategory]: (prev[currentCategory] || []).map(word => 
        word.id === id ? { ...word, x, y } : word
      )
    }))
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
      />

      {/* Main Content */}
      {currentView === 'canvas' ? (
        <NounCanvas
          nouns={currentNouns}
          onDelete={(id) => handleDeleteWord(id, true, currentCategory)}
          onUpdatePosition={handleUpdateNounPosition}
        />
      ) : (
        <VocabularyGallery
          words={nonNouns}
          onDelete={handleDeleteWord}
        />
      )}
    </div>
  )
}

export default App

