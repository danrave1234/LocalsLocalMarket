import { useState, useEffect, useRef, useCallback } from 'react'
import './VirtualizedList.css'

/**
 * Virtualized list component for better performance with large datasets
 */
const VirtualizedList = ({ 
  items, 
  itemHeight = 60, 
  containerHeight = 400,
  renderItem,
  className = "",
  overscan = 5
}) => {
  const [scrollTop, setScrollTop] = useState(0)
  const containerRef = useRef(null)

  // Calculate visible range
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const endIndex = Math.min(
    items.length - 1,
    Math.floor((scrollTop + containerHeight) / itemHeight) + overscan
  )

  // Get visible items
  const visibleItems = items.slice(startIndex, endIndex + 1)

  // Calculate total height and offset
  const totalHeight = items.length * itemHeight
  const offsetY = startIndex * itemHeight

  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop)
  }, [])

  // Reset scroll position when items change
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0
      setScrollTop(0)
    }
  }, [items.length])

  return (
    <div 
      ref={containerRef}
      className={`virtualized-list ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div 
        className="virtualized-list-content"
        style={{ height: totalHeight }}
      >
        <div 
          className="virtualized-list-items"
          style={{ transform: `translateY(${offsetY}px)` }}
        >
          {visibleItems.map((item, index) => (
            <div
              key={startIndex + index}
              className="virtualized-list-item"
              style={{ height: itemHeight }}
            >
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default VirtualizedList
