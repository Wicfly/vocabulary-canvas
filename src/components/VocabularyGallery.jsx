import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { speakText } from '../utils/textToSpeech'

function VocabularyGallery({ words, onDelete }) {
  const [playingWordId, setPlayingWordId] = useState(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [hoverSide, setHoverSide] = useState(null) // 'left' or 'right'
  const bookRef = useRef(null)
  const wordsPerPage = 2 // 左右各1个，共2个（放大显示）
  const totalPages = Math.ceil(words.length / wordsPerPage)

  const currentWords = words.slice(
    currentPage * wordsPerPage,
    (currentPage + 1) * wordsPerPage
  )

  const leftPageWords = currentWords.slice(0, 1)
  const rightPageWords = currentWords.slice(1, 2)

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
          className="relative w-full max-w-7xl h-[85vh] book-container"
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
                        className="flex flex-col items-center gap-4 p-6 hover:bg-white/50 rounded-lg transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {word.isVideo && word.videoUrl ? (
                          <div className="w-full max-w-2xl">
                            <video
                              src={word.videoUrl}
                              controls
                              className="w-full h-auto rounded-lg border border-black/10 shadow-md"
                              style={{ maxHeight: '500px', minHeight: '300px' }}
                              preload="metadata"
                            >
                              Your browser does not support the video tag.
                            </video>
                          </div>
                        ) : (
                          <div className="w-full max-w-2xl">
                        <img
                          src={word.imageUrl}
                          alt={word.word}
                              className="w-full h-auto object-cover rounded-lg border border-black/10 shadow-md"
                              style={{ maxHeight: '500px', minHeight: '300px' }}
                        />
                          </div>
                        )}
                        <div className="flex-1 w-full text-center">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg text-black">
                            {word.word}
                          </h3>
                            <button
                              onClick={async (e) => {
                                e.stopPropagation()
                                e.preventDefault()
                                if (playingWordId === word.id) return
                                
                                setPlayingWordId(word.id)
                                try {
                                  console.log('Playing audio for:', word.word)
                                  await speakText(word.word)
                                  console.log('Audio played successfully')
                                } catch (err) {
                                  console.error('Failed to play audio:', err)
                                  alert('播放失败，请检查控制台错误信息')
                                } finally {
                                  setPlayingWordId(null)
                                }
                              }}
                              disabled={playingWordId === word.id}
                              className="p-2 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 cursor-pointer"
                              title="播放发音"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={`h-5 w-5 ${playingWordId === word.id ? 'text-blue-500' : 'text-black/40'}`}
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
                          <p className="text-sm text-black/60 mb-3 line-clamp-3">
                            {word.definition}
                          </p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              onDelete(word.id, false)
                            }}
                            className="text-sm text-black/40 hover:text-black/60 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </motion.div>
                    ))}
                    {leftPageWords.length < 1 && (
                      <div className="h-full flex items-center justify-center">
                        <p className="text-sm text-black/20">No words on this page</p>
                      </div>
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
                        className="flex flex-col items-center gap-4 p-6 hover:bg-white/50 rounded-lg transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {word.isVideo && word.videoUrl ? (
                          <div className="w-full max-w-2xl">
                            <video
                              src={word.videoUrl}
                              controls
                              className="w-full h-auto rounded-lg border border-black/10 shadow-md"
                              style={{ maxHeight: '500px', minHeight: '300px' }}
                              preload="metadata"
                            >
                              Your browser does not support the video tag.
                            </video>
                          </div>
                        ) : (
                          <div className="w-full max-w-2xl">
                        <img
                          src={word.imageUrl}
                          alt={word.word}
                              className="w-full h-auto object-cover rounded-lg border border-black/10 shadow-md"
                              style={{ maxHeight: '500px', minHeight: '300px' }}
                        />
                          </div>
                        )}
                        <div className="flex-1 w-full text-center">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg text-black">
                            {word.word}
                          </h3>
                            <button
                              onClick={async (e) => {
                                e.stopPropagation()
                                e.preventDefault()
                                if (playingWordId === word.id) return
                                
                                setPlayingWordId(word.id)
                                try {
                                  console.log('Playing audio for:', word.word)
                                  await speakText(word.word)
                                  console.log('Audio played successfully')
                                } catch (err) {
                                  console.error('Failed to play audio:', err)
                                  alert('播放失败，请检查控制台错误信息')
                                } finally {
                                  setPlayingWordId(null)
                                }
                              }}
                              disabled={playingWordId === word.id}
                              className="p-2 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 cursor-pointer"
                              title="播放发音"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={`h-5 w-5 ${playingWordId === word.id ? 'text-blue-500' : 'text-black/40'}`}
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
                          <p className="text-sm text-black/60 mb-3 line-clamp-3">
                            {word.definition}
                          </p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              onDelete(word.id, false)
                            }}
                            className="text-sm text-black/40 hover:text-black/60 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </motion.div>
                    ))}
                    {rightPageWords.length < 1 && (
                      <div className="h-full flex items-center justify-center">
                        <p className="text-sm text-black/20">No words on this page</p>
                      </div>
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

