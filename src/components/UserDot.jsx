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
        x: currentPosition.x - 20, // Center the character (40px wide)
        y: currentPosition.y - 30, // Center the character (60px tall)
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
      {/* Snoopy-style simple character */}
      <svg
        width="40"
        height="60"
        viewBox="0 0 40 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-lg"
      >
        {/* Head (round) */}
        <circle cx="20" cy="15" r="12" fill="black" stroke="white" strokeWidth="1.5"/>
        
        {/* Body (oval) */}
        <ellipse cx="20" cy="35" rx="10" ry="12" fill="black" stroke="white" strokeWidth="1.5"/>
        
        {/* Arms */}
        <ellipse cx="10" cy="32" rx="4" ry="8" fill="black" stroke="white" strokeWidth="1.5"/>
        <ellipse cx="30" cy="32" rx="4" ry="8" fill="black" stroke="white" strokeWidth="1.5"/>
        
        {/* Legs */}
        <ellipse cx="15" cy="48" rx="4" ry="8" fill="black" stroke="white" strokeWidth="1.5"/>
        <ellipse cx="25" cy="48" rx="4" ry="8" fill="black" stroke="white" strokeWidth="1.5"/>
        
        {/* Eyes (simple dots) */}
        <circle cx="16" cy="13" r="1.5" fill="white"/>
        <circle cx="24" cy="13" r="1.5" fill="white"/>
        
        {/* Nose (small triangle) */}
        <path d="M 20 16 L 18 18 L 22 18 Z" fill="white"/>
      </svg>
    </motion.div>
  )
}

export default UserDot

