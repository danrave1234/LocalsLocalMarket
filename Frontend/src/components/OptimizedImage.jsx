import { useState, useRef, useEffect } from 'react'
import './OptimizedImage.css'
import { Camera } from 'lucide-react'
import { loadImageWithRetry, getImageUrl } from '../utils/imageUtils.jsx'

/**
 * Optimized image component with lazy loading, error handling, and loading states
 */
const OptimizedImage = ({ 
  src, 
  alt, 
  className = "", 
  fallbackSrc = "/placeholder-image.jpg",
  loading = "lazy",
  width,
  height,
  objectFit = "cover",
  onLoad,
  onError,
  retryOnError = true,
  ...props 
}) => {
  const [imageSrc, setImageSrc] = useState(src)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const imgRef = useRef(null)

  useEffect(() => {
    if (!src) {
      setIsLoading(false)
      setHasError(true)
      return
    }

    setIsLoading(true)
    setHasError(false)
    setIsLoaded(false)
    setRetryCount(0)

    // Use enhanced image loading with retry logic
    loadImageWithRetry(src, { 
      maxRetries: retryOnError ? 3 : 1,
      fallbackSrc: fallbackSrc,
      retryDelay: 1000
    })
    .then(() => {
      setImageSrc(src)
      setIsLoading(false)
      setIsLoaded(true)
      setHasError(false)
      onLoad?.()
    })
    .catch((error) => {
      console.warn(`Failed to load image: ${src}`, error)
      setIsLoading(false)
      setHasError(true)
      onError?.()
    })
  }, [src, fallbackSrc, retryOnError, onLoad, onError])

  const handleLoad = () => {
    setIsLoading(false)
    setIsLoaded(true)
    setHasError(false)
    onLoad?.()
  }

  const handleError = () => {
    console.warn(`Image failed to load: ${imageSrc}`)
    
    // Try to retry with force refresh if we haven't exceeded retry limit
    if (retryCount < 3 && retryOnError) {
      setRetryCount(prev => prev + 1)
      console.log(`Retrying image load (attempt ${retryCount + 1})...`)
      
      // Try with force refresh
      setTimeout(() => {
        const retrySrc = getImageUrl(src, { forceRefresh: true })
        setImageSrc(retrySrc)
      }, 1000 * (retryCount + 1)) // Exponential backoff
    } else {
      setIsLoading(false)
      setHasError(true)
      
      // Try fallback image if not already using it
      if (imageSrc !== fallbackSrc) {
        setImageSrc(fallbackSrc)
      } else {
        onError?.()
      }
    }
  }

  return (
    <div 
      className={`optimized-image ${className} ${isLoading ? 'loading' : ''} ${hasError ? 'error' : ''}`}
      style={{ width, height }}
    >
      {isLoading && (
        <div className="image-skeleton">
          <div className="skeleton-shimmer"></div>
        </div>
      )}
      
      <img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        style={{ objectFit }}
        className={`image-content ${isLoaded ? 'loaded' : ''}`}
        {...props}
      />
      
      {hasError && imageSrc === fallbackSrc && (
        <div className="image-error">
          <div className="error-icon"><Camera size={24} /></div>
          <span>Image unavailable</span>
        </div>
      )}
    </div>
  )
}

export default OptimizedImage
