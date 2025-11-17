import { useState } from 'react'
import { motion } from 'framer-motion'
import { generateImage, getWordDefinition } from '../utils/imageGenerator'
import { classifyWord } from '../utils/wordClassifier'

function WordInput({ onAddWord }) {
  const [word, setWord] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [focused, setFocused] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!word.trim()) {
      setError('Please enter a word')
      return
    }

    setLoading(true)
    setError('')

    try {
      const wordText = word.trim()
      const isNoun = classifyWord(wordText) === 'noun'
      
      // Generate image and definition in parallel
      const [imageUrl, definition] = await Promise.all([
        generateImage(wordText, isNoun),
        getWordDefinition(wordText)
      ])

      onAddWord(wordText, isNoun, imageUrl, definition)
      setWord('')
    } catch (err) {
      setError('Failed to add word. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-6 left-1/2 z-50"
      style={{ transform: 'translateX(-50%)' }}
    >
      <div className="bg-white/90 backdrop-blur-md border border-black/10 rounded-2xl shadow-xl">
        <form onSubmit={handleSubmit} className="flex items-center gap-2 p-2">
          <input
            type="text"
            value={word}
            onChange={(e) => {
              setWord(e.target.value)
              setError('')
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Add a word..."
            className={`
              px-4 py-2.5 w-64 text-sm bg-transparent
              focus:outline-none placeholder:text-black/30
              transition-all
              ${focused ? 'text-black' : 'text-black/70'}
            `}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !word.trim()}
            className={`
              px-5 py-2.5 rounded-xl text-sm font-medium
              transition-all
              ${loading || !word.trim()
                ? 'bg-black/10 text-black/30 cursor-not-allowed'
                : 'bg-black text-white hover:bg-black/90'
              }
            `}
          >
            {loading ? '...' : 'Add'}
          </button>
        </form>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 pb-2 text-xs text-black/50"
          >
            {error}
          </motion.p>
        )}
      </div>
    </motion.div>
  )
}

export default WordInput

