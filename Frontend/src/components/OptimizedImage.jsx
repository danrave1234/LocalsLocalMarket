import { useState, useRef, useEffect } from 'react'
import './OptimizedImage.css'
import { Camera } from 'lucide-react'

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
  ...props 
}) => {
  const [imageSrc, setImageSrc] = useState(src)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const imgRef = useRef(null)

  useEffect(() => {
    setImageSrc(src)
    setIsLoading(true)
    setHasError(false)
    setIsLoaded(false)
  }, [src])

  const handleLoad = () => {
    setIsLoading(false)
    setIsLoaded(true)
    onLoad?.()
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
    
    // Try fallback image if not already using it
    if (imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc)
    }
    
    onError?.()
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
