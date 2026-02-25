import { useState } from 'react'
import { motion } from 'framer-motion'
import { generateImage, getWordDefinition } from '../utils/imageGenerator'
import { classifyWord } from '../utils/wordClassifier'
import { useLanguage } from '../contexts/LanguageContext'
import { useTranslation } from '../utils/i18n'
import CameraModal from './CameraModal'

function WordInput({ onAddWord, onAddWordFromImage }) {
  const { language, toggleLanguage } = useLanguage()
  const { t } = useTranslation(language)
  const [word, setWord] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [focused, setFocused] = useState(false)
  const [showCamera, setShowCamera] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!word.trim()) {
      setError(t('wordInput.error.empty'))
      return
    }

    setLoading(true)
    setError('')

    try {
      const wordText = word.trim()
      // classifyWord is now async, so we need to await it
      const wordClass = await classifyWord(wordText)
      const isNoun = wordClass === 'noun'
      
      // Generate image and definition in parallel
      const [imageUrl, definition] = await Promise.all([
        generateImage(wordText, isNoun),
        getWordDefinition(wordText)
      ])

      onAddWord(wordText, isNoun, imageUrl, definition)
      setWord('')
    } catch (err) {
      setError(t('wordInput.error'))
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCameraCapture = async (imageBase64) => {
    setLoading(true)
    setError('')
    
    try {
      await onAddWordFromImage(imageBase64)
    } catch (err) {
      // Show more detailed error message
      const errorMessage = err?.message || 'Unknown error'
      console.error('Camera capture error:', err)
      
      // Only show error if it's a critical error (not just 3D conversion failure)
      if (errorMessage.includes('SAM 3D API is not configured')) {
        // This is expected - photo will be added as regular image, just show info message
        setError('SAM 3D API 未配置，照片已作为普通图片添加。如需 3D 功能，请查看 SAM3D_SETUP.md')
        // Clear error after 5 seconds
        setTimeout(() => setError(''), 5000)
      } else if (!errorMessage.includes('3D conversion failed')) {
        // Only show error if it's not the expected 3D conversion failure
        setError(`处理失败: ${errorMessage}`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed bottom-6 z-50"
        style={{ 
          left: '50%',
          transform: 'translateX(-50%)',
          maxWidth: 'calc(100vw - 48px)',
          width: 'max-content'
        }}
      >
        <div className="bg-white/90 backdrop-blur-md border border-black/10 rounded-2xl shadow-xl">
          <form onSubmit={handleSubmit} className="flex items-center gap-2 p-2">
            {/* Language Toggle */}
            <button
              type="button"
              onClick={toggleLanguage}
              className={`
                w-10 h-10 rounded-lg flex items-center justify-center
                transition-all text-sm font-medium
                ${language === 'zh' 
                  ? 'bg-black text-white' 
                  : 'bg-black/5 text-black/70 hover:bg-black/10'
                }
              `}
              title={language === 'zh' ? 'Switch to English' : '切换到中文'}
            >
              {language === 'zh' ? '中' : 'EN'}
            </button>
            
            <input
              type="text"
              value={word}
              onChange={(e) => {
                setWord(e.target.value)
                setError('')
              }}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder={t('wordInput.placeholder')}
              className={`
                px-4 py-2.5 w-64 text-sm bg-transparent
                focus:outline-none placeholder:text-black/30
                transition-all
                ${focused ? 'text-black' : 'text-black/70'}
              `}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowCamera(true)}
              disabled={loading}
              className={`
                w-10 h-10 rounded-full flex items-center justify-center
                transition-all
                ${loading
                  ? 'bg-black/10 cursor-not-allowed'
                  : 'bg-black text-white hover:bg-black/90'
                }
              `}
              title={t('wordInput.camera')}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
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
              {loading ? '...' : t('wordInput.add')}
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

    <CameraModal
      isOpen={showCamera}
      onClose={() => setShowCamera(false)}
      onCapture={handleCameraCapture}
    />
    </>
  )
}

export default WordInput

