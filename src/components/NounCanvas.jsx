import { useRef, useState, useEffect } from 'react'
import WordSticker from './WordSticker'
import UserDot from './UserDot'

function NounCanvas({ nouns, onDelete, onUpdatePosition }) {
  const canvasRef = useRef(null)
  const [userPosition, setUserPosition] = useState({ x: 100, y: 100 })

  // Load user position from localStorage
  useEffect(() => {
    const savedPosition = localStorage.getItem('userPosition')
    if (savedPosition) {
      try {
        setUserPosition(JSON.parse(savedPosition))
      } catch (e) {
        console.warn('Failed to load user position')
      }
    }
  }, [])

  // Save user position to localStorage
  useEffect(() => {
    localStorage.setItem('userPosition', JSON.stringify(userPosition))
  }, [userPosition])

  const handleCanvasClick = (e) => {
    // Check if click is on a word sticker or its children
    const clickedElement = e.target
    if (clickedElement.closest('[data-word-sticker]')) {
      return // Don't move if clicking on a word sticker
    }
    
    // Only move if clicking on the canvas background
    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    setUserPosition({ x, y })
  }

  return (
    <div
      ref={canvasRef}
      className="fixed inset-0 w-full h-full dot-grid overflow-hidden cursor-pointer"
      onClick={handleCanvasClick}
    >
      {/* User Dot */}
      <UserDot position={userPosition} />

      {/* Word Stickers */}
      {nouns.length === 0 ? (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className="text-sm text-black/20">Add nouns to see them here</p>
        </div>
      ) : (
        nouns.map((noun) => (
          <div key={noun.id} data-word-sticker>
            <WordSticker
              word={noun}
              onDelete={onDelete}
              onUpdatePosition={onUpdatePosition}
            />
          </div>
        ))
      )}
    </div>
  )
}

export default NounCanvas

