import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import WordSticker from './WordSticker'
import UserDot from './UserDot'
import { useLanguage } from '../contexts/LanguageContext'
import { useTranslation } from '../utils/i18n'

function NounCanvas({ nounsByCategory, onDelete, onUpdatePosition }) {
  const { language } = useLanguage()
  const { t } = useTranslation(language)
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const [userPosition, setUserPosition] = useState({ x: 100, y: 100 })
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 })
  const isInitializedRef = useRef(false)

  // Load user position from localStorage
  useEffect(() => {
    const savedPosition = localStorage.getItem('userPosition')
    if (savedPosition) {
      try {
        setUserPosition(JSON.parse(savedPosition))
      } catch (e) {
        console.warn('Failed to load user position')
      }
    }
  }, [])

  // Save user position to localStorage
  useEffect(() => {
    localStorage.setItem('userPosition', JSON.stringify(userPosition))
  }, [userPosition])

  // Combine all nouns from all categories
  const allNouns = [
    ...(nounsByCategory.main || []).map(n => ({ ...n, category: 'main' })),
    ...(nounsByCategory.kitchen || []).map(n => ({ ...n, category: 'kitchen' })),
    ...(nounsByCategory.home || []).map(n => ({ ...n, category: 'home' }))
  ]

  // Calculate dynamic category regions based on content
  const calculateCategoryBounds = (categoryNouns, categoryName) => {
    if (!categoryNouns || categoryNouns.length === 0) {
      return null // No region if no content
    }

    const padding = 150 // Padding around content
    const stickerSize = 80 // Approximate sticker size

    // Find bounds
    let minX = Infinity
    let minY = Infinity
    let maxX = -Infinity
    let maxY = -Infinity

    categoryNouns.forEach(noun => {
      const x = noun.x || 0
      const y = noun.y || 0
      minX = Math.min(minX, x)
      minY = Math.min(minY, y)
      maxX = Math.max(maxX, x + stickerSize)
      maxY = Math.max(maxY, y + stickerSize)
    })

    // Calculate center
    const centerX = (minX + maxX) / 2
    const centerY = (minY + maxY) / 2

    // Calculate size with padding
    const width = Math.max(maxX - minX + padding * 2, 400) // Minimum width
    const height = Math.max(maxY - minY + padding * 2, 300) // Minimum height

    // Position so center of region is center of content
    const x = centerX - width / 2
    const y = centerY - height / 2

    return { x, y, width, height, centerX, centerY }
  }

  // Calculate bounds for each category
  const mainBounds = calculateCategoryBounds(nounsByCategory.main, 'main')
  const kitchenBounds = calculateCategoryBounds(nounsByCategory.kitchen, 'kitchen')
  const homeBounds = calculateCategoryBounds(nounsByCategory.home, 'home')

  // Initialize canvas offset - keep it fixed at (0, 0) so canvas doesn't jump
  // Words are already positioned relative to viewport center, so no offset needed
  useEffect(() => {
    const hasContent = allNouns.length > 0
    if (hasContent && !isInitializedRef.current) {
      // Don't calculate offset - keep canvas at (0, 0)
      // First word positions are already relative to viewport center
      // This prevents the canvas from jumping when first word is created
      isInitializedRef.current = true
    } else if (!hasContent) {
      // Reset when all content is removed
      isInitializedRef.current = false
      setCanvasOffset({ x: 0, y: 0 })
    }
  }, [allNouns.length])

  // Calculate canvas size and position based on all regions
  const calculateCanvasSize = () => {
    const bounds = [mainBounds, kitchenBounds, homeBounds].filter(Boolean)
    
    // Default canvas size (centered around viewport)
    const viewportCenterX = window.innerWidth / 2
    const viewportCenterY = window.innerHeight / 2
    let contentMinX = viewportCenterX - window.innerWidth
    let contentMinY = viewportCenterY - window.innerHeight
    let contentMaxX = viewportCenterX + window.innerWidth
    let contentMaxY = viewportCenterY + window.innerHeight
    let width = window.innerWidth * 2
    let height = window.innerHeight * 2

    if (bounds.length > 0) {
      // Calculate content bounds from actual word positions
      let minX = Infinity
      let minY = Infinity
      let maxX = -Infinity
      let maxY = -Infinity

      bounds.forEach(bound => {
        minX = Math.min(minX, bound.x)
        minY = Math.min(minY, bound.y)
        maxX = Math.max(maxX, bound.x + bound.width)
        maxY = Math.max(maxY, bound.y + bound.height)
      })

      // Add padding around content
      const canvasPadding = 200
      contentMinX = minX - canvasPadding
      contentMinY = minY - canvasPadding
      contentMaxX = maxX + canvasPadding
      contentMaxY = maxY + canvasPadding

      // Ensure minimum size
      width = Math.max(contentMaxX - contentMinX, window.innerWidth)
      height = Math.max(contentMaxY - contentMinY, window.innerHeight)
    }

    // Keep canvas offset at (0, 0) - words are positioned relative to viewport center
    // This ensures canvas stays in place when words are created
    return {
      width,
      height,
      offsetX: 0,  // Always use 0, 0 - no automatic centering
      offsetY: 0,
      contentMinX,  // Min X in canvas coordinates
      contentMinY   // Min Y in canvas coordinates
    }
  }

  const canvasSize = calculateCanvasSize()

  const handleCanvasClick = (e) => {
    // Check if click is on a word sticker or its children
    const clickedElement = e.target
    if (clickedElement.closest('[data-word-sticker]')) {
      return // Don't move if clicking on a word sticker
    }
    
    // Only move if clicking on the canvas background
    const containerRect = containerRef.current?.getBoundingClientRect()
    if (!containerRect) return
    
    // Get the canvas element
    const canvasElement = canvasRef.current
    if (!canvasElement) return
    
    // Get the actual position of the canvas element on screen
    const canvasRect = canvasElement.getBoundingClientRect()
    
    // Calculate click position relative to the canvas element's top-left corner
    // This gives us the position in canvas coordinates (canvas coordinate system starts at 0,0)
    const canvasX = e.clientX - canvasRect.left
    const canvasY = e.clientY - canvasRect.top
    
    // Set user position at the clicked point
    setUserPosition({ x: canvasX, y: canvasY })
  }

  // Category colors
  const categoryColors = {
    main: { border: 'rgba(59, 130, 246, 0.3)', bg: 'rgba(59, 130, 246, 0.05)' },
    kitchen: { border: 'rgba(34, 197, 94, 0.3)', bg: 'rgba(34, 197, 94, 0.05)' },
    home: { border: 'rgba(234, 179, 8, 0.3)', bg: 'rgba(234, 179, 8, 0.05)' }
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full overflow-hidden cursor-pointer bg-white"
      onClick={handleCanvasClick}
    >

      {/* Canvas - bounded container */}
      <div
        ref={canvasRef}
        className="relative dot-grid"
        style={{
          width: `${canvasSize.width}px`,
          height: `${canvasSize.height}px`,
          left: `${canvasSize.offsetX}px`,
          top: `${canvasSize.offsetY}px`,
          minWidth: `${canvasSize.width}px`,
          minHeight: `${canvasSize.height}px`,
          position: 'absolute',
        }}
      >

        {/* Dynamic Category Regions - only show if they have content */}
        {mainBounds && (
          <>
            <div 
              className="absolute pointer-events-none rounded-2xl border-2"
              style={{
                left: `${mainBounds.x}px`,
                top: `${mainBounds.y}px`,
                width: `${mainBounds.width}px`,
                height: `${mainBounds.height}px`,
                borderColor: categoryColors.main.border,
                backgroundColor: categoryColors.main.bg,
              }}
            />
            <div 
              className="absolute bg-black/60 text-white px-4 py-2 rounded-lg text-sm font-medium backdrop-blur-sm pointer-events-none"
              style={{
                left: `${mainBounds.x + 12}px`,
                top: `${mainBounds.y + 12}px`,
              }}
            >
              {t('category.main')}
            </div>
          </>
        )}

        {kitchenBounds && (
          <>
            <div 
              className="absolute pointer-events-none rounded-2xl border-2"
              style={{
                left: `${kitchenBounds.x}px`,
                top: `${kitchenBounds.y}px`,
                width: `${kitchenBounds.width}px`,
                height: `${kitchenBounds.height}px`,
                borderColor: categoryColors.kitchen.border,
                backgroundColor: categoryColors.kitchen.bg,
              }}
            />
            <div 
              className="absolute bg-black/60 text-white px-4 py-2 rounded-lg text-sm font-medium backdrop-blur-sm pointer-events-none"
              style={{
                left: `${kitchenBounds.x + 12}px`,
                top: `${kitchenBounds.y + 12}px`,
              }}
            >
              {t('category.kitchen')}
            </div>
          </>
        )}

        {homeBounds && (
          <>
            <div 
              className="absolute pointer-events-none rounded-2xl border-2"
              style={{
                left: `${homeBounds.x}px`,
                top: `${homeBounds.y}px`,
                width: `${homeBounds.width}px`,
                height: `${homeBounds.height}px`,
                borderColor: categoryColors.home.border,
                backgroundColor: categoryColors.home.bg,
              }}
            />
            <div 
              className="absolute bg-black/60 text-white px-4 py-2 rounded-lg text-sm font-medium backdrop-blur-sm pointer-events-none"
              style={{
                left: `${homeBounds.x + 12}px`,
                top: `${homeBounds.y + 12}px`,
              }}
            >
              {t('category.home')}
            </div>
          </>
        )}

        {/* User Dot */}
        <UserDot position={userPosition} />

        {/* Word Stickers */}
        {allNouns.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-sm text-black/20">{t('canvas.empty')}</p>
          </div>
        ) : (
          allNouns.map((noun) => {
            return (
              <WordSticker
                key={noun.id}
                word={noun}
                onDelete={() => onDelete(noun.id, true, noun.category)}
                onUpdatePosition={(id, x, y) => {
                  onUpdatePosition(id, x, y, noun.category)
                }}
              />
            )
          })
        )}
      </div>
    </div>
  )
}

export default NounCanvas

