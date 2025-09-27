import { useEffect, useRef, useCallback } from 'react'

/**
 * Custom hook for managing focus in modals, dropdowns, and other overlays
 * Provides accessible focus management following ARIA guidelines
 */
export const useFocusManagement = (options = {}) => {
  const {
    isOpen = false,
    trapFocus = true,
    restoreFocus = true,
    initialFocus = null,
    returnFocus = null
  } = options

  const containerRef = useRef(null)
  const previousActiveElement = useRef(null)
  const firstFocusableElement = useRef(null)
  const lastFocusableElement = useRef(null)

  // Get all focusable elements within the container
  const getFocusableElements = useCallback(() => {
    if (!containerRef.current) return []
    
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(', ')
    
    return Array.from(containerRef.current.querySelectorAll(focusableSelectors))
      .filter(element => {
        const style = window.getComputedStyle(element)
        return style.display !== 'none' && style.visibility !== 'hidden'
      })
  }, [])

  // Set up focus trap
  const setupFocusTrap = useCallback(() => {
    if (!trapFocus || !containerRef.current) return

    const focusableElements = getFocusableElements()
    if (focusableElements.length === 0) return

    firstFocusableElement.current = focusableElements[0]
    lastFocusableElement.current = focusableElements[focusableElements.length - 1]

    const handleKeyDown = (event) => {
      if (event.key !== 'Tab') return

      if (event.shiftKey) {
        // Shift + Tab: move backwards
        if (document.activeElement === firstFocusableElement.current) {
          event.preventDefault()
          lastFocusableElement.current?.focus()
        }
      } else {
        // Tab: move forwards
        if (document.activeElement === lastFocusableElement.current) {
          event.preventDefault()
          firstFocusableElement.current?.focus()
        }
      }
    }

    containerRef.current.addEventListener('keydown', handleKeyDown)
    return () => {
      containerRef.current?.removeEventListener('keydown', handleKeyDown)
    }
  }, [trapFocus, getFocusableElements])

  // Focus initial element
  const focusInitialElement = useCallback(() => {
    if (!containerRef.current) return

    let elementToFocus = null

    if (initialFocus) {
      elementToFocus = typeof initialFocus === 'string' 
        ? containerRef.current.querySelector(initialFocus)
        : initialFocus
    } else {
      const focusableElements = getFocusableElements()
      elementToFocus = focusableElements[0]
    }

    if (elementToFocus) {
      // Use requestAnimationFrame to ensure the element is rendered
      requestAnimationFrame(() => {
        elementToFocus.focus()
      })
    }
  }, [initialFocus, getFocusableElements])

  // Restore focus to previous element
  const restorePreviousFocus = useCallback(() => {
    if (restoreFocus && previousActiveElement.current) {
      previousActiveElement.current.focus()
    }
  }, [restoreFocus])

  // Handle escape key
  const handleEscapeKey = useCallback((event) => {
    if (event.key === 'Escape' && isOpen) {
      // Let the parent component handle the escape action
      // This is just for focus management
      event.stopPropagation()
    }
  }, [isOpen])

  // Set up focus management when modal opens
  useEffect(() => {
    if (!isOpen) return

    // Store the currently focused element
    previousActiveElement.current = document.activeElement

    // Set up focus trap
    const cleanupFocusTrap = setupFocusTrap()

    // Focus initial element
    focusInitialElement()

    // Add escape key handler
    document.addEventListener('keydown', handleEscapeKey)

    return () => {
      cleanupFocusTrap?.()
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [isOpen, setupFocusTrap, focusInitialElement, handleEscapeKey])

  // Restore focus when modal closes
  useEffect(() => {
    if (!isOpen && previousActiveElement.current) {
      restorePreviousFocus()
    }
  }, [isOpen, restorePreviousFocus])

  return {
    containerRef,
    focusInitialElement,
    restorePreviousFocus,
    getFocusableElements
  }
}

/**
 * Hook for managing focus in dropdowns and menus
 */
export const useDropdownFocus = (options = {}) => {
  const {
    isOpen = false,
    items = [],
    onSelect = null
  } = options

  const containerRef = useRef(null)
  const itemRefs = useRef([])
  const [focusedIndex, setFocusedIndex] = useState(-1)

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event) => {
    if (!isOpen || items.length === 0) return

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        setFocusedIndex(prev => 
          prev < items.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        event.preventDefault()
        setFocusedIndex(prev => 
          prev > 0 ? prev - 1 : items.length - 1
        )
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        if (focusedIndex >= 0 && onSelect) {
          onSelect(items[focusedIndex], focusedIndex)
        }
        break
      case 'Escape':
        event.preventDefault()
        // Let parent handle closing
        break
    }
  }, [isOpen, items, focusedIndex, onSelect])

  // Focus the currently selected item
  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && itemRefs.current[focusedIndex]) {
      itemRefs.current[focusedIndex].focus()
    }
  }, [isOpen, focusedIndex])

  // Reset focus when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setFocusedIndex(0)
    } else {
      setFocusedIndex(-1)
    }
  }, [isOpen])

  // Add keyboard event listener
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, handleKeyDown])

  return {
    containerRef,
    itemRefs,
    focusedIndex,
    setFocusedIndex
  }
}
