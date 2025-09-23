import { useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'

/**
 * Dedicated Order Modal (self-contained)
 * - Does not use the centralized Modal.jsx
 * - Includes its own overlay, dialog, and keyboard handling
 */
export default function OrderModal({ isOpen, onClose, title, children, size = 'large' }) {
  const onKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose?.()
    }
  }, [onClose])

  useEffect(() => {
    if (!isOpen) return
    document.addEventListener('keydown', onKeyDown)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = prevOverflow
    }
  }, [isOpen, onKeyDown])

  if (!isOpen) return null

  const sizeClass = {
    small: 'order-dialog-sm',
    medium: 'order-dialog-md',
    large: 'order-dialog-lg',
    xlarge: 'order-dialog-xl',
    xxlarge: 'order-dialog-2xl'
  }[size] || 'order-dialog-lg'

  const overlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose?.()
    }
  }

  const dialog = (
    <div className="order-modal-overlay" data-component="OrderModal" onClick={overlayClick} role="dialog" aria-modal="true" aria-labelledby="order-dialog-title">
      <div className={`order-dialog ${sizeClass}`} data-om-root onClick={(e) => e.stopPropagation()}>
        <div className="order-dialog-header">
          <h3 id="order-dialog-title" className="order-dialog-title">{title}</h3>
          <button className="order-dialog-close" type="button" aria-label="Close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className="order-dialog-body">
          {children}
        </div>
      </div>
    </div>
  )

  return createPortal(dialog, document.body)
}
