import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { speakText } from '../utils/textToSpeech'

function WordSticker({ word, onDelete, onUpdatePosition }) {
  const [isDragging, setIsDragging] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [position, setPosition] = useState({ x: word.x || 0, y: word.y || 0 })
  const [isPlaying, setIsPlaying] = useState(false)
  const stickerRef = useRef(null)
  const tooltipRef = useRef(null)
  const hoverTimeoutRef = useRef(null)

  // Update position when word prop changes
  useEffect(() => {
    setPosition({ x: word.x || 0, y: word.y || 0 })
  }, [word.x, word.y])
  
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
    }
  }, [])

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
      onMouseEnter={() => {
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current)
        }
        setShowTooltip(true)
      }}
      onMouseLeave={() => {
        // Delay hiding tooltip to allow mouse to move to tooltip
        hoverTimeoutRef.current = setTimeout(() => {
          setShowTooltip(false)
        }, 200)
      }}
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
            ref={tooltipRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-56 bg-white border border-black/10 p-3 rounded-xl shadow-lg z-50 pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
            onMouseEnter={() => {
              if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current)
              }
              setShowTooltip(true)
            }}
            onMouseLeave={() => {
              setShowTooltip(false)
            }}
          >
            <div className="flex items-start justify-between mb-1.5">
              <h3 className="font-semibold text-sm text-black">{word.word}</h3>
              <button
                onClick={async (e) => {
                  e.stopPropagation()
                  e.preventDefault()
                  if (isPlaying) return
                  
                  setIsPlaying(true)
                  try {
                    console.log('Playing audio for:', word.word)
                    await speakText(word.word)
                    console.log('Audio played successfully')
                  } catch (err) {
                    console.error('Failed to play audio:', err)
                    alert('播放失败，请检查控制台错误信息')
                  } finally {
                    setIsPlaying(false)
                  }
                }}
                disabled={isPlaying}
                className="ml-2 p-1 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 cursor-pointer"
                title="播放发音"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 ${isPlaying ? 'text-blue-500' : 'text-black/40'}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                  />
                </svg>
              </button>
            </div>
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

