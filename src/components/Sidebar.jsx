import { motion } from 'framer-motion'

function Sidebar({ currentView, onViewChange }) {
  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed left-6 top-1/2 -translate-y-1/2 z-50"
    >
      <div className="bg-white/80 backdrop-blur-sm border border-black/10 rounded-2xl p-3 shadow-lg">
        <div className="flex flex-col gap-2">
          <button
            onClick={() => onViewChange('canvas')}
            className={`
              px-4 py-3 rounded-xl text-sm font-medium transition-all
              ${currentView === 'canvas' 
                ? 'bg-black text-white' 
                : 'text-black/60 hover:text-black hover:bg-black/5'
              }
            `}
          >
            Canvas
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
            Gallery
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default Sidebar

