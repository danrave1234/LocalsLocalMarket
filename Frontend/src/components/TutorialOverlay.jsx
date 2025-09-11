import { useEffect, useRef, useState } from 'react'
import { useTutorial } from '../contexts/TutorialContext'
import { X, ChevronLeft, ChevronRight, SkipForward } from 'lucide-react'
import './TutorialOverlay.css'

const TutorialOverlay = () => {
  const {
    isTutorialActive,
    currentStep,
    tutorialSteps,
    nextStep,
    previousStep,
    skipTutorial,
    completeTutorial
  } = useTutorial()

  const [highlightedElement, setHighlightedElement] = useState(null)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
  const tooltipRef = useRef(null)
  const overlayRef = useRef(null)

  // Get current step data
  const currentStepData = tutorialSteps[currentStep]

  // Helper: clamp value within bounds
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

  // Compute and set positions with viewport clamping
  const computePositions = (element, placement) => {
    if (!element) return
    const rect = element.getBoundingClientRect()
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft

    // Base position near the target
    let top = rect.top + scrollTop
    let left = rect.left + scrollLeft

    switch (placement) {
      case 'top':
        top = rect.top + scrollTop - 20
        left = rect.left + scrollLeft + rect.width / 2
        break
      case 'bottom':
        top = rect.bottom + scrollTop + 20
        left = rect.left + scrollLeft + rect.width / 2
        break
      case 'left':
        top = rect.top + scrollTop + rect.height / 2
        left = rect.left + scrollLeft - 20
        break
      case 'right':
        top = rect.top + scrollTop + rect.height / 2
        left = rect.right + scrollLeft + 20
        break
      case 'center':
        top = rect.top + scrollTop + rect.height / 2
        left = rect.left + scrollLeft + rect.width / 2
        break
      default:
        if (rect.top < window.innerHeight / 2) {
          top = rect.bottom + scrollTop + 20
        } else {
          top = rect.top + scrollTop - 20
        }
        left = rect.left + scrollLeft + rect.width / 2
    }

    // After tooltip renders, clamp within viewport with better edge detection
    requestAnimationFrame(() => {
      const tooltipEl = tooltipRef.current
      const margin = 20
      if (tooltipEl) {
        const width = tooltipEl.offsetWidth || 320
        const height = tooltipEl.offsetHeight || 160
        
        // Calculate viewport boundaries
        const viewportTop = scrollTop + margin
        const viewportBottom = scrollTop + window.innerHeight - margin
        const viewportLeft = scrollLeft + margin
        const viewportRight = scrollLeft + window.innerWidth - margin
        
        // Check if tooltip would go off-screen and adjust placement
        const tooltipTop = top - height / 2
        const tooltipBottom = top + height / 2
        const tooltipLeft = left - width / 2
        const tooltipRight = left + width / 2
        
        // If tooltip goes off top, try bottom placement
        if (tooltipTop < viewportTop && placement === 'top') {
          top = rect.bottom + scrollTop + 20
        }
        // If tooltip goes off bottom, try top placement
        else if (tooltipBottom > viewportBottom && placement === 'bottom') {
          top = rect.top + scrollTop - 20
        }
        // If tooltip goes off left, try right placement
        else if (tooltipLeft < viewportLeft && placement === 'left') {
          left = rect.right + scrollLeft + 20
        }
        // If tooltip goes off right, try left placement
        else if (tooltipRight > viewportRight && placement === 'right') {
          left = rect.left + scrollLeft - 20
        }
        
        // Final clamp to ensure tooltip stays within viewport
        const maxLeft = viewportRight - width / 2
        const minLeft = viewportLeft + width / 2
        const maxTop = viewportBottom - height / 2
        const minTop = viewportTop + height / 2
        
        left = clamp(left, minLeft, maxLeft)
        top = clamp(top, minTop, maxTop)
      }
      setTooltipPosition({ top, left })
    })
  }

  // Calculate tooltip position and highlight element, with scroll settle
  useEffect(() => {
    if (!isTutorialActive || !currentStepData) return
    const element = document.querySelector(currentStepData.target)
    if (!element) return

    setHighlightedElement(element)

    // Ensure element is in view; then compute after scroll settles
    let scrollTimeout
    const onScrollSettle = () => {
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        computePositions(element, currentStepData.placement)
      }, 120)
    }

    // Scroll into view (centered) - but only if tutorial is not active
    if (!isTutorialActive) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
      onScrollSettle()
    } else {
      // Just compute positions without scrolling when tutorial is active
      computePositions(element, currentStepData.placement)
    }

    // Listeners for dynamic reposition
    let rafId = null
    const onReposition = () => {
      if (rafId) return
      rafId = requestAnimationFrame(() => {
        rafId = null
        computePositions(element, currentStepData.placement)
      })
    }

    window.addEventListener('scroll', onReposition, { passive: true })
    window.addEventListener('resize', onReposition)

    return () => {
      clearTimeout(scrollTimeout)
      window.removeEventListener('scroll', onReposition)
      window.removeEventListener('resize', onReposition)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [isTutorialActive, currentStep, currentStepData])

  // Handle keyboard navigation and body scroll lock
  useEffect(() => {
    if (!isTutorialActive) return

    // Disable body scrolling
    document.body.classList.add('tutorial-active')
    
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'Escape':
          skipTutorial()
          break
        case 'ArrowRight':
        case 'Enter':
          e.preventDefault()
          nextStep()
          break
        case 'ArrowLeft':
          e.preventDefault()
          previousStep()
          break
      }
    }

    // Prevent scroll events
    const preventScroll = (e) => {
      e.preventDefault()
      e.stopPropagation()
      return false
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('wheel', preventScroll, { passive: false })
    document.addEventListener('touchmove', preventScroll, { passive: false })
    document.addEventListener('scroll', preventScroll, { passive: false })

    return () => {
      document.body.classList.remove('tutorial-active')
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('wheel', preventScroll)
      document.removeEventListener('touchmove', preventScroll)
      document.removeEventListener('scroll', preventScroll)
    }
  }, [isTutorialActive, nextStep, previousStep, skipTutorial])

  if (!isTutorialActive || !currentStepData) return null

  return (
    <div className="tutorial-overlay" ref={overlayRef}>
      {/* Backdrop */}
      <div className="tutorial-backdrop" />
      
      {/* Highlighted element */
      }
      {highlightedElement && (
        <div
          className="tutorial-highlight"
          style={{
            top: highlightedElement.getBoundingClientRect().top + window.pageYOffset,
            left: highlightedElement.getBoundingClientRect().left + window.pageXOffset,
            width: highlightedElement.getBoundingClientRect().width,
            height: highlightedElement.getBoundingClientRect().height,
          }}
        />
      )}
      
      {/* Tooltip */}
      <div
        className={`tutorial-tooltip tutorial-tooltip--${currentStepData.placement || 'auto'}`}
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left,
        }}
        ref={tooltipRef}
      >
        <div className="tutorial-tooltip-content">
          {/* Header */}
          <div className="tutorial-tooltip-header">
            <div className="tutorial-step-indicator">
              Step {currentStep + 1} of {tutorialSteps.length}
            </div>
            <button
              className="tutorial-close-btn"
              onClick={skipTutorial}
              aria-label="Skip tutorial"
            >
              <X size={16} />
            </button>
          </div>
          
          {/* Content */}
          <div className="tutorial-tooltip-body">
            <h3 className="tutorial-title">{currentStepData.title}</h3>
            <p className="tutorial-description">{currentStepData.description}</p>
            
            {currentStepData.action && (
              <div className="tutorial-action">
                <p className="tutorial-action-text">{currentStepData.action}</p>
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="tutorial-tooltip-footer">
            <div className="tutorial-progress">
              <div 
                className="tutorial-progress-bar"
                style={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
              />
            </div>
            
            <div className="tutorial-controls">
              <button
                className="tutorial-btn tutorial-btn--secondary"
                onClick={previousStep}
                disabled={currentStep === 0}
              >
                <ChevronLeft size={16} />
                Previous
              </button>
              
              <button
                className="tutorial-btn tutorial-btn--skip"
                onClick={skipTutorial}
              >
                <SkipForward size={16} />
                Skip
              </button>
              
              <button
                className="tutorial-btn tutorial-btn--primary"
                onClick={nextStep}
              >
                {currentStep === tutorialSteps.length - 1 ? 'Finish' : 'Next'}
                {currentStep < tutorialSteps.length - 1 && <ChevronRight size={16} />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Arrow */}
        <div className={`tutorial-arrow tutorial-arrow--${currentStepData.placement || 'auto'}`} />
      </div>
    </div>
  )
}

export default TutorialOverlay
