import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function VocabularyGallery({ words, onDelete }) {
  const [currentPage, setCurrentPage] = useState(0)
  const wordsPerPage = 4
  const totalPages = Math.ceil(words.length / wordsPerPage)

  const currentWords = words.slice(
    currentPage * wordsPerPage,
    (currentPage + 1) * wordsPerPage
  )

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
      <div className="h-full flex flex-col p-16">
        <div className="flex-1 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-4xl"
            >
              <div className="grid grid-cols-2 gap-6">
                {currentWords.map((word) => (
                  <motion.div
                    key={word.id}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white border border-black/10 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={word.imageUrl}
                        alt={word.word}
                        className="w-16 h-16 object-cover rounded-lg border border-black/5"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base text-black mb-1.5">
                          {word.word}
                        </h3>
                        <p className="text-sm text-black/50 mb-3 line-clamp-2">
                          {word.definition}
                        </p>
                        <button
                          onClick={() => onDelete(word.id, false)}
                          className="text-xs text-black/40 hover:text-black/60 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prevPage}
              disabled={currentPage === 0}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${currentPage === 0
                  ? 'text-black/20 cursor-not-allowed'
                  : 'text-black/60 hover:text-black hover:bg-black/5'
                }
              `}
            >
              ← Previous
            </button>
            <span className="text-sm text-black/40">
              {currentPage + 1} / {totalPages}
            </span>
            <button
              onClick={nextPage}
              disabled={currentPage >= totalPages - 1}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${currentPage >= totalPages - 1
                  ? 'text-black/20 cursor-not-allowed'
                  : 'text-black/60 hover:text-black hover:bg-black/5'
                }
              `}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default VocabularyGallery

