import { useState } from 'react'
import { useTutorial } from '../contexts/TutorialContext'
import { HelpCircle, X } from 'lucide-react'
import './TutorialTrigger.css'

const TutorialTrigger = () => {
  const { startTutorial, tutorialCompleted, resetTutorial } = useTutorial()
  const [isExpanded, setIsExpanded] = useState(false)

  const handleStartTutorial = () => {
    startTutorial()
    setIsExpanded(false)
  }

  const handleResetTutorial = () => {
    resetTutorial()
    setIsExpanded(false)
  }

  return (
    <div className="tutorial-trigger">
      {!isExpanded ? (
        <button
          className="tutorial-trigger-btn"
          onClick={() => setIsExpanded(true)}
          title="Show tutorial options"
          aria-label="Show tutorial options"
        >
          <HelpCircle size={20} />
        </button>
      ) : (
        <div className="tutorial-trigger-menu">
          <div className="tutorial-trigger-header">
            <span className="tutorial-trigger-title">Tutorial</span>
            <button
              className="tutorial-trigger-close"
              onClick={() => setIsExpanded(false)}
              aria-label="Close tutorial menu"
            >
              <X size={16} />
            </button>
          </div>
          
          <div className="tutorial-trigger-options">
            <button
              className="tutorial-trigger-option"
              onClick={handleStartTutorial}
            >
              {tutorialCompleted ? 'Restart Tutorial' : 'Start Tutorial'}
            </button>
            
            {tutorialCompleted && (
              <button
                className="tutorial-trigger-option tutorial-trigger-option--secondary"
                onClick={handleResetTutorial}
              >
                Reset Tutorial Status
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default TutorialTrigger

