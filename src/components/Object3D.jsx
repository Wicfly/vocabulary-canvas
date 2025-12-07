import { useRef, useState, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { motion } from 'framer-motion'
import * as THREE from 'three'

function Model3D({ modelUrl, autoRotate = true }) {
  const { scene } = useGLTF(modelUrl)
  const meshRef = useRef()

  useFrame((state, delta) => {
    if (autoRotate && meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5
    }
  })
  
  return <primitive object={scene} ref={meshRef} />
}

function Object3DViewer({ modelUrl, word, definition, onDelete }) {
  const [showTooltip, setShowTooltip] = useState(false)

  if (!modelUrl) {
    return (
      <div className="w-20 h-20 flex items-center justify-center text-xs text-black/30">
        Loading...
      </div>
    )
  }

  return (
    <div className="relative w-20 h-20"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="relative w-full h-full rounded-lg overflow-hidden border border-black/10 shadow-sm hover:shadow-md transition-shadow bg-white">
        <Suspense fallback={
          <div className="w-full h-full flex items-center justify-center text-xs text-black/30">
            Loading 3D...
          </div>
        }>
          <Canvas
            camera={{ position: [0, 0, 5], fov: 50 }}
            gl={{ antialias: true, alpha: true }}
            style={{ width: '100%', height: '100%' }}
          >
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <pointLight position={[-10, -10, -5]} intensity={0.5} />
            <Model3D modelUrl={modelUrl} autoRotate={true} />
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              minPolarAngle={Math.PI / 3}
              maxPolarAngle={Math.PI / 1.5}
            />
          </Canvas>
        </Suspense>
        
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-56 bg-white border border-black/10 p-3 rounded-xl shadow-lg z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-semibold text-sm mb-1.5 text-black">{word}</h3>
            <p className="text-xs text-black/50 mb-3 line-clamp-2">{definition}</p>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
              className="text-xs text-black/40 hover:text-black/60 transition-colors"
            >
              Delete
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Object3DViewer

