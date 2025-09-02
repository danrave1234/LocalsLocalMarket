import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * Custom hook for handling scroll events with throttling
 * @param {number} threshold - Scroll threshold to trigger callback
 * @param {Function} callback - Callback function to execute
 * @returns {Object} - Scroll state and handlers
 */
export function useScroll(threshold = 100, callback = null) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const ticking = useRef(false)

  const handleScroll = useCallback(() => {
    if (!ticking.current) {
      requestAnimationFrame(() => {
        const currentScrollY = window.scrollY
        setScrollY(currentScrollY)
        setIsScrolled(currentScrollY > threshold)
        
        if (callback) {
          callback(currentScrollY)
        }
        
        ticking.current = false
      })
      ticking.current = true
    }
  }, [threshold, callback])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  return { isScrolled, scrollY }
}

/**
 * Custom hook for handling window resize events with debouncing
 * @param {Function} callback - Callback function to execute on resize
 * @returns {Object} - Window dimensions
 */
export function useWindowSize(callback = null) {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })

  const handleResize = useCallback(() => {
    const newSize = {
      width: window.innerWidth,
      height: window.innerHeight
    }
    setSize(newSize)
    
    if (callback) {
      callback(newSize)
    }
  }, [callback])

  useEffect(() => {
    let timeoutId = null
    
    const debouncedResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(handleResize, 100)
    }

    window.addEventListener('resize', debouncedResize, { passive: true })
    return () => {
      window.removeEventListener('resize', debouncedResize)
      clearTimeout(timeoutId)
    }
  }, [handleResize])

  return size
}

/**
 * Custom hook for handling click outside events
 * @param {Function} callback - Callback function to execute when clicking outside
 * @returns {Object} - Ref to attach to the element
 */
export function useClickOutside(callback) {
  const ref = useRef()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [callback])

  return ref
}

/**
 * Custom hook for handling keyboard events
 * @param {string} key - The key to listen for
 * @param {Function} callback - Callback function to execute
 * @param {Object} options - Additional options (ctrlKey, shiftKey, etc.)
 */
export function useKeyPress(key, callback, options = {}) {
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === key) {
        // Check if modifier keys match
        if (options.ctrlKey && !event.ctrlKey) return
        if (options.shiftKey && !event.shiftKey) return
        if (options.altKey && !event.altKey) return
        if (options.metaKey && !event.metaKey) return
        
        callback(event)
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [key, callback, options])
}
