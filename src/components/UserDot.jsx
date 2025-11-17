import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

function UserDot({ position, onPositionChange }) {
  const [currentPosition, setCurrentPosition] = useState(position)

  useEffect(() => {
    setCurrentPosition(position)
  }, [position])

  return (
    <motion.div
      className="absolute z-40"
      initial={false}
      animate={{
        x: currentPosition.x - 12, // Center the 24px circle
        y: currentPosition.y - 12,
      }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 15,
        mass: 0.5,
      }}
      style={{
        left: 0,
        top: 0,
      }}
    >
      <div className="w-6 h-6 bg-black rounded-full shadow-lg border-2 border-white"></div>
    </motion.div>
  )
}

export default UserDot

