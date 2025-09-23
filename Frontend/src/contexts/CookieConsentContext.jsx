import { createContext, useContext, useState, useEffect } from 'react'

const CookieConsentContext = createContext()

export const useCookieConsent = () => {
  const context = useContext(CookieConsentContext)
  if (!context) {
    throw new Error('useCookieConsent must be used within a CookieConsentProvider')
  }
  return context
}

export const CookieConsentProvider = ({ children }) => {
  const [consentGiven, setConsentGiven] = useState(null) // null = not asked, true = given, false = denied
  const [showBanner, setShowBanner] = useState(false)
  const [consentPreferences, setConsentPreferences] = useState({
    essential: true, // Always true, can't be disabled
    functional: false,
    analytics: false,
    marketing: false
  })

  // Load consent status on mount
  useEffect(() => {
    try {
      const savedConsent = localStorage.getItem('cookie_consent')
      if (savedConsent) {
        const consentData = JSON.parse(savedConsent)
        setConsentGiven(consentData.given)
        setConsentPreferences(consentData.preferences || {
          essential: true,
          functional: false,
          analytics: false,
          marketing: false
        })
      } else {
        // Show banner if no consent has been given
        setShowBanner(true)
      }
    } catch (error) {
      console.error('Error loading cookie consent:', error)
      setShowBanner(true)
    }
  }, [])

  const acceptAll = () => {
    const newPreferences = {
      essential: true,
      functional: true,
      analytics: true,
      marketing: true
    }
    
    setConsentGiven(true)
    setConsentPreferences(newPreferences)
    setShowBanner(false)
    
    // Save consent with a 1-year expiration
    const consentData = {
      given: true,
      preferences: newPreferences,
      timestamp: new Date().toISOString(),
      expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
    }
    
    try {
      localStorage.setItem('cookie_consent', JSON.stringify(consentData))
    } catch (error) {
      console.error('Error saving cookie consent:', error)
    }
  }

  const acceptSelected = (preferences) => {
    const newPreferences = {
      essential: true, // Always true
      functional: preferences.functional || false,
      analytics: preferences.analytics || false,
      marketing: preferences.marketing || false
    }
    
    setConsentGiven(true)
    setConsentPreferences(newPreferences)
    setShowBanner(false)
    
    // Save consent with a 1-year expiration
    const consentData = {
      given: true,
      preferences: newPreferences,
      timestamp: new Date().toISOString(),
      expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
    }
    
    try {
      localStorage.setItem('cookie_consent', JSON.stringify(consentData))
    } catch (error) {
      console.error('Error saving cookie consent:', error)
    }
  }

  const rejectAll = () => {
    const newPreferences = {
      essential: true, // Always true
      functional: false,
      analytics: false,
      marketing: false
    }
    
    setConsentGiven(false)
    setConsentPreferences(newPreferences)
    setShowBanner(false)
    
    // Save consent with a 1-year expiration
    const consentData = {
      given: false,
      preferences: newPreferences,
      timestamp: new Date().toISOString(),
      expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
    }
    
    try {
      localStorage.setItem('cookie_consent', JSON.stringify(consentData))
    } catch (error) {
      console.error('Error saving cookie consent:', error)
    }
  }

  const showPreferences = () => {
    setShowBanner(true)
  }

  const hideBanner = () => {
    setShowBanner(false)
  }

  const resetConsent = () => {
    try {
      localStorage.removeItem('cookie_consent')
    } catch (error) {
      console.error('Error removing cookie consent:', error)
    }
    
    setConsentGiven(null)
    setConsentPreferences({
      essential: true,
      functional: false,
      analytics: false,
      marketing: false
    })
    setShowBanner(true)
  }

  const canUseStorage = (category = 'functional') => {
    if (category === 'essential') return true
    if (consentGiven === null) return false // Haven't asked yet
    return consentPreferences[category] || false
  }

  const value = {
    consentGiven,
    showBanner,
    consentPreferences,
    acceptAll,
    acceptSelected,
    rejectAll,
    showPreferences,
    hideBanner,
    resetConsent,
    canUseStorage
  }

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
    </CookieConsentContext.Provider>
  )
}
