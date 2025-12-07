import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getCategories } from '../utils/categoryClassifier'

function Sidebar({ currentView, onViewChange, currentCategory, onCategoryChange }) {
  const [showCategoryMenu, setShowCategoryMenu] = useState(false)
  const categories = getCategories()

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
          <div className="relative">
            <button
              onMouseEnter={() => setShowCategoryMenu(true)}
              onMouseLeave={() => setShowCategoryMenu(false)}
              onClick={() => onViewChange('canvas')}
              className={`
                px-4 py-3 rounded-xl text-sm font-medium transition-all w-full text-left
                ${currentView === 'canvas' 
                  ? 'bg-black text-white' 
                  : 'text-black/60 hover:text-black hover:bg-black/5'
                }
              `}
            >
              Canvas
            </button>
            
            <AnimatePresence>
              {showCategoryMenu && currentView === 'canvas' && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  onMouseEnter={() => setShowCategoryMenu(true)}
                  onMouseLeave={() => setShowCategoryMenu(false)}
                  className="absolute left-full ml-2 top-0 bg-white/95 backdrop-blur-sm border border-black/10 rounded-xl p-2 shadow-lg min-w-[120px]"
                >
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        onCategoryChange(category.id)
                        setShowCategoryMenu(false)
                      }}
                      className={`
                        w-full px-3 py-2 rounded-lg text-sm text-left transition-all
                        ${currentCategory === category.id
                          ? 'bg-black text-white'
                          : 'text-black/60 hover:text-black hover:bg-black/5'
                        }
                      `}
                    >
                      <span className="mr-2">{category.icon}</span>
                      {category.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
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
            Gallery
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default Sidebar

