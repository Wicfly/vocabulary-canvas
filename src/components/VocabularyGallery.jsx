import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function VocabularyGallery({ words, onDelete }) {
  const [currentPage, setCurrentPage] = useState(0)
  const [hoverSide, setHoverSide] = useState(null) // 'left' or 'right'
  const bookRef = useRef(null)
  const wordsPerPage = 6 // 左右各3个，共6个
  const totalPages = Math.ceil(words.length / wordsPerPage)

  const currentWords = words.slice(
    currentPage * wordsPerPage,
    (currentPage + 1) * wordsPerPage
  )

  const leftPageWords = currentWords.slice(0, 3)
  const rightPageWords = currentWords.slice(3, 6)

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleBookClick = (e) => {
    if (!bookRef.current) return
    
    const rect = bookRef.current.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const bookWidth = rect.width
    const isLeftSide = clickX < bookWidth / 2

    if (isLeftSide && currentPage > 0) {
      prevPage()
    } else if (!isLeftSide && currentPage < totalPages - 1) {
      nextPage()
    }
  }

  const handleMouseMove = (e) => {
    if (!bookRef.current) return
    
    const rect = bookRef.current.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const bookWidth = rect.width
    const isLeftSide = mouseX < bookWidth / 2

    if (isLeftSide) {
      setHoverSide(currentPage > 0 ? 'left' : null)
    } else {
      setHoverSide(currentPage < totalPages - 1 ? 'right' : null)
    }
  }

  const handleMouseLeave = () => {
    setHoverSide(null)
  }

  if (words.length === 0) {
    return (
      <div className="fixed inset-0 w-full h-full bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-black/20">Add non-noun words to see them here</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 w-full h-full bg-white overflow-hidden">
      <div className="h-full flex items-center justify-center p-8">
        <div
          ref={bookRef}
          className="relative w-full max-w-6xl h-[80vh] book-container"
          onClick={handleBookClick}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            cursor: hoverSide === 'left' ? 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'120\' height=\'60\'%3E%3Cellipse cx=\'60\' cy=\'30\' rx=\'55\' ry=\'25\' fill=\'rgba(0,0,0,0.8)\'/%3E%3Ctext x=\'60\' y=\'35\' text-anchor=\'middle\' fill=\'white\' font-size=\'12\' font-family=\'sans-serif\'%3Elast page%3C/text%3E%3C/svg%3E") 60 30, auto' :
                   hoverSide === 'right' ? 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'120\' height=\'60\'%3E%3Cellipse cx=\'60\' cy=\'30\' rx=\'55\' ry=\'25\' fill=\'rgba(0,0,0,0.8)\'/%3E%3Ctext x=\'60\' y=\'35\' text-anchor=\'middle\' fill=\'white\' font-size=\'12\' font-family=\'sans-serif\'%3Enext page%3C/text%3E%3C/svg%3E") 60 30, auto' :
                   'default'
          }}
        >
          {/* Book Background */}
          <div className="absolute inset-0 book-background">
            {/* Left Page */}
            <div className="absolute left-0 top-0 w-1/2 h-full book-page border-r border-black/8">
              <div className="h-full p-8 flex flex-col gap-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`left-${currentPage}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="flex-1 flex flex-col gap-4"
                  >
                    {leftPageWords.map((word) => (
                      <motion.div
                        key={word.id}
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex items-start gap-3 p-3 hover:bg-white/50 rounded transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <img
                          src={word.imageUrl}
                          alt={word.word}
                          className="w-12 h-12 object-cover rounded border border-black/5 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm text-black mb-1">
                            {word.word}
                          </h3>
                          <p className="text-xs text-black/50 line-clamp-2 mb-2">
                            {word.definition}
                          </p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              onDelete(word.id, false)
                            }}
                            className="text-xs text-black/40 hover:text-black/60 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </motion.div>
                    ))}
                    {leftPageWords.length < 3 && (
                      Array.from({ length: 3 - leftPageWords.length }).map((_, i) => (
                        <div key={`empty-left-${i}`} className="h-20" />
                      ))
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Right Page */}
            <div className="absolute right-0 top-0 w-1/2 h-full book-page border-l border-black/8">
              <div className="h-full p-8 flex flex-col gap-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`right-${currentPage}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex-1 flex flex-col gap-4"
                  >
                    {rightPageWords.map((word) => (
                      <motion.div
                        key={word.id}
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex items-start gap-3 p-3 hover:bg-white/50 rounded transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <img
                          src={word.imageUrl}
                          alt={word.word}
                          className="w-12 h-12 object-cover rounded border border-black/5 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm text-black mb-1">
                            {word.word}
                          </h3>
                          <p className="text-xs text-black/50 line-clamp-2 mb-2">
                            {word.definition}
                          </p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              onDelete(word.id, false)
                            }}
                            className="text-xs text-black/40 hover:text-black/60 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </motion.div>
                    ))}
                    {rightPageWords.length < 3 && (
                      Array.from({ length: 3 - rightPageWords.length }).map((_, i) => (
                        <div key={`empty-right-${i}`} className="h-20" />
                      ))
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Book Spine/Center - 书脊 */}
            <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-r from-amber-900/20 via-amber-800/30 to-amber-900/20 transform -translate-x-1/2" />
            
            {/* Book Cover Shadow - 封面阴影效果 */}
            <div className="absolute left-0 top-0 w-1/2 h-full bg-gradient-to-r from-transparent via-black/5 to-transparent pointer-events-none" />
            <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-transparent via-black/5 to-transparent pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default VocabularyGallery

