import { createContext, useContext, useState, useEffect } from 'react'

const TutorialContext = createContext()

export const useTutorial = () => {
  const context = useContext(TutorialContext)
  if (!context) {
    throw new Error('useTutorial must be used within a TutorialProvider')
  }
  return context
}

export const TutorialProvider = ({ children }) => {
  const [isTutorialActive, setIsTutorialActive] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [tutorialCompleted, setTutorialCompleted] = useState(false)
  const [tutorialSteps, setTutorialSteps] = useState([])
  const [shouldPrompt, setShouldPrompt] = useState(false)

  // Check if user is first-time visitor
  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('tutorial_completed')
    const hasDismissedPrompt = localStorage.getItem('tutorial_prompt_dismissed')
    if (!hasSeenTutorial && !hasDismissedPrompt) {
      // Show prompt instead of auto-starting
      setShouldPrompt(true)
    }
    if (hasSeenTutorial) {
      setTutorialCompleted(true)
    }
  }, [])

  const startTutorial = () => {
    setIsTutorialActive(true)
    setCurrentStep(0)
    setTutorialCompleted(false)
  }

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      completeTutorial()
    }
  }

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const skipTutorial = () => {
    completeTutorial()
  }

  const completeTutorial = () => {
    setIsTutorialActive(false)
    setTutorialCompleted(true)
    localStorage.setItem('tutorial_completed', 'true')
  }

  const resetTutorial = () => {
    localStorage.removeItem('tutorial_completed')
    setTutorialCompleted(false)
    setIsTutorialActive(false)
    setCurrentStep(0)
  }

  const value = {
    isTutorialActive,
    currentStep,
    tutorialCompleted,
    tutorialSteps,
    setTutorialSteps,
    shouldPrompt,
    setShouldPrompt,
    startTutorial,
    nextStep,
    previousStep,
    skipTutorial,
    completeTutorial,
    resetTutorial
  }

  return (
    <TutorialContext.Provider value={value}>
      {children}
    </TutorialContext.Provider>
  )
}
