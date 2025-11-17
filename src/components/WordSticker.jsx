import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

function WordSticker({ word, onDelete, onUpdatePosition }) {
  const [isDragging, setIsDragging] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [position, setPosition] = useState({ x: word.x || 0, y: word.y || 0 })
  const stickerRef = useRef(null)

  // Update position when word prop changes
  useEffect(() => {
    setPosition({ x: word.x || 0, y: word.y || 0 })
  }, [word.x, word.y])

  const handleMouseDown = (e) => {
    e.preventDefault()
    setIsDragging(true)
    const startX = e.clientX - position.x
    const startY = e.clientY - position.y
    let currentPos = { x: position.x, y: position.y }

    const handleMouseMove = (e) => {
      const newX = e.clientX - startX
      const newY = e.clientY - startY
      currentPos = { x: newX, y: newY }
      setPosition(currentPos)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      onUpdatePosition(word.id, currentPos.x, currentPos.y)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  return (
    <motion.div
      ref={stickerRef}
      className="absolute cursor-move"
      style={{
        left: position.x,
        top: position.y,
        zIndex: isDragging ? 1000 : 1,
      }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onMouseDown={(e) => {
        e.stopPropagation() // Prevent canvas click
        handleMouseDown(e)
      }}
      onClick={(e) => e.stopPropagation()} // Prevent canvas click
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="relative">
        <img
          src={word.imageUrl}
          alt={word.word}
          className="w-20 h-20 object-cover rounded-lg border border-black/10 shadow-sm hover:shadow-md transition-shadow"
          draggable={false}
        />
        
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-56 bg-white border border-black/10 p-3 rounded-xl shadow-lg z-50"
          >
            <h3 className="font-semibold text-sm mb-1.5 text-black">{word.word}</h3>
            <p className="text-xs text-black/50 mb-3 line-clamp-2">{word.definition}</p>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete(word.id, true)
              }}
              className="text-xs text-black/40 hover:text-black/60 transition-colors"
            >
              Delete
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default WordSticker

