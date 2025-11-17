import { useState, useEffect } from 'react'
import WordInput from './components/WordInput'
import Sidebar from './components/Sidebar'
import NounCanvas from './components/NounCanvas'
import VocabularyGallery from './components/VocabularyGallery'
import { loadFromStorage, saveToStorage } from './utils/storage'
import './App.css'

function App() {
  const [nouns, setNouns] = useState([])
  const [nonNouns, setNonNouns] = useState([])
  const [currentView, setCurrentView] = useState('canvas') // 'canvas' or 'gallery'

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = loadFromStorage()
    if (savedData) {
      setNouns(savedData.nouns || [])
      setNonNouns(savedData.nonNouns || [])
    }
  }, [])

  // Save to localStorage whenever data changes
  useEffect(() => {
    saveToStorage({ nouns, nonNouns })
  }, [nouns, nonNouns])

  const handleAddWord = async (word, isNoun, imageUrl, definition) => {
    // Calculate center position for new nouns
    const centerX = isNoun ? window.innerWidth / 2 - 40 : 0
    const centerY = isNoun ? window.innerHeight / 2 - 40 : 0
    
    const newWord = {
      id: Date.now().toString(),
      word,
      imageUrl,
      definition,
      x: isNoun ? centerX : 0,
      y: isNoun ? centerY : 0,
    }

    if (isNoun) {
      setNouns([...nouns, newWord])
    } else {
      setNonNouns([...nonNouns, newWord])
    }
  }

  const handleDeleteWord = (id, isNoun) => {
    if (isNoun) {
      setNouns(nouns.filter(word => word.id !== id))
    } else {
      setNonNouns(nonNouns.filter(word => word.id !== id))
    }
  }

  const handleUpdateNounPosition = (id, x, y) => {
    setNouns(nouns.map(word => 
      word.id === id ? { ...word, x, y } : word
    ))
  }

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      {/* Top Input Bar */}
      <WordInput onAddWord={handleAddWord} />

      {/* Left Sidebar */}
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />

      {/* Main Content */}
      {currentView === 'canvas' ? (
        <NounCanvas
          nouns={nouns}
          onDelete={handleDeleteWord}
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

