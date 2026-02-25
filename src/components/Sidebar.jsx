import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getCategories } from '../utils/categoryClassifier'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { useTranslation } from '../utils/i18n'

function Sidebar({ currentView, onViewChange, currentCategory, onCategoryChange, currentUser, onLoginClick }) {
  const { language } = useLanguage()
  const { t } = useTranslation(language)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
      setShowUserMenu(false)
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed left-6 top-1/2 z-50"
      style={{
        transform: 'translateY(-50%)',
        top: '50%'
      }}
    >
      <div className="bg-white/80 backdrop-blur-sm border border-black/10 rounded-2xl p-3 shadow-lg">
        <div className="flex flex-col gap-2">
          <button
            onClick={() => onViewChange('canvas')}
            className={`
              px-4 py-3 rounded-xl text-sm font-medium transition-all w-full text-left
              ${currentView === 'canvas' 
                ? 'bg-black text-white' 
                : 'text-black/60 hover:text-black hover:bg-black/5'
              }
            `}
          >
            {t('sidebar.canvas')}
          </button>
          
          <button
            onClick={() => onViewChange('gallery')}
            className={`
              px-4 py-3 rounded-xl text-sm font-medium transition-all
              ${currentView === 'gallery' 
                ? 'bg-black text-white' 
                : 'text-black/60 hover:text-black hover:bg-black/5'
              }
            `}
          >
            {t('sidebar.gallery')}
          </button>

          {/* User Section */}
          <div className="mt-4 pt-4 border-t border-black/10">
            {currentUser ? (
              <div className="relative">
                <button
                  onMouseEnter={() => setShowUserMenu(true)}
                  onMouseLeave={() => setShowUserMenu(false)}
                  className="w-full px-4 py-3 rounded-xl text-sm font-medium text-black/60 hover:text-black hover:bg-black/5 transition-all flex items-center gap-2"
                >
                  <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center overflow-hidden">
                    {currentUser.photoURL ? (
                      <img src={currentUser.photoURL} alt={currentUser.displayName || 'User'} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs font-semibold text-black/60">
                        {currentUser.displayName?.[0]?.toUpperCase() || currentUser.email?.[0]?.toUpperCase() || 'U'}
                      </span>
                    )}
                  </div>
                  <span className="flex-1 text-left truncate">
                    {currentUser.displayName || currentUser.email || 'User'}
                  </span>
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      onMouseEnter={() => setShowUserMenu(true)}
                      onMouseLeave={() => setShowUserMenu(false)}
                      className="absolute left-full ml-2 top-0 bg-white/95 backdrop-blur-sm border border-black/10 rounded-xl p-2 shadow-lg min-w-[160px] z-50"
                    >
                      <div className="px-3 py-2 text-xs text-black/60 border-b border-black/10 mb-2">
                        {currentUser.email}
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full px-3 py-2 rounded-lg text-sm text-left text-red-600 hover:bg-red-50 transition-colors"
                      >
                        {t('sidebar.signOut')}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="w-full px-4 py-3 rounded-xl text-sm font-medium bg-black text-white hover:bg-black/90 transition-colors"
              >
                {t('sidebar.signIn')}
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Sidebar

