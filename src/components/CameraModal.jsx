import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../contexts/LanguageContext'
import { useTranslation } from '../utils/i18n'

function CameraModal({ isOpen, onClose, onCapture }) {
  const { language } = useLanguage()
  const { t } = useTranslation(language)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const [error, setError] = useState('')
  const [capturedImage, setCapturedImage] = useState(null)

  useEffect(() => {
    if (isOpen) {
      startCamera()
    } else {
      stopCamera()
      setCapturedImage(null)
      setError('')
    }

    return () => {
      stopCamera()
    }
  }, [isOpen])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' } // Use back camera on mobile
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      console.error('Error accessing camera:', err)
      setError(t('camera.error'))
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
  }

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    // Set canvas size to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw video frame to canvas
    context.drawImage(video, 0, 0)

    // Convert to base64
    const imageData = canvas.toDataURL('image/jpeg', 0.8)
    setCapturedImage(imageData)
    stopCamera()
  }

  const retakePhoto = () => {
    setCapturedImage(null)
    startCamera()
  }

  const confirmPhoto = () => {
    if (capturedImage) {
      onCapture(capturedImage)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl overflow-hidden max-w-2xl w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative bg-black">
            {capturedImage ? (
              <img
                src={capturedImage}
                alt="Captured"
                className="w-full h-auto max-h-[60vh] object-contain"
              />
            ) : (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-auto max-h-[60vh] object-contain"
              />
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="p-4 flex gap-3 justify-center">
            {capturedImage ? (
              <>
                <button
                  onClick={retakePhoto}
                  className="px-6 py-2.5 bg-gray-200 text-gray-800 rounded-xl font-medium hover:bg-gray-300 transition-colors"
                >
                  {t('camera.retake')}
                </button>
                <button
                  onClick={confirmPhoto}
                  className="px-6 py-2.5 bg-black text-white rounded-xl font-medium hover:bg-black/90 transition-colors"
                >
                  {t('camera.confirm')}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-gray-200 text-gray-800 rounded-xl font-medium hover:bg-gray-300 transition-colors"
                >
                  {t('camera.cancel')}
                </button>
                <button
                  onClick={capturePhoto}
                  className="px-6 py-2.5 bg-black text-white rounded-xl font-medium hover:bg-black/90 transition-colors"
                >
                  {t('camera.capture')}
                </button>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default CameraModal



