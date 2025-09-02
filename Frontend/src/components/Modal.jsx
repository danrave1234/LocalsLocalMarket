import { useEffect } from 'react'
import { createPortal } from 'react-dom'

export default function Modal({ isOpen, onClose, title, children, size = 'medium' }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const sizeClasses = {
    small: 'max-w-sm',
    medium: 'max-w-md',
    large: 'max-w-lg',
    xlarge: 'max-w-2xl',
    xxlarge: 'max-w-4xl'
  }

  const handleOverlayClick = (e) => {
    // Only close if clicking directly on the overlay, not when dragging
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleContentMouseDown = (e) => {
    // Prevent the overlay click from firing when interacting with modal content
    e.stopPropagation()
  }

  const handleContentMouseUp = (e) => {
    // Allow mouseup events to bubble up for interactive elements like maps
    // Only stop propagation for non-interactive elements to prevent modal closing
    const target = e.target
    const isInteractive = target.closest('button, input, textarea, select, [role="button"], [tabindex], .leaflet-container, .custom-marker')
    
    if (!isInteractive) {
      e.stopPropagation()
    }
  }

  const handleContentClick = (e) => {
    // Prevent the overlay click from firing when clicking inside modal content
    e.stopPropagation()
  }

  const modalContent = (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div 
        className={`modal-content ${sizeClasses[size]}`} 
        onMouseDown={handleContentMouseDown}
        onMouseUp={handleContentMouseUp}
        onClick={handleContentClick}
      >
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button 
            className="modal-close" 
            onClick={(e) => {
              e.stopPropagation()
              onClose()
            }}
            aria-label="Close modal"
            type="button"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  )

  // Render modal outside the normal DOM hierarchy using portal
  return createPortal(modalContent, document.body)
}
