import { useState } from 'react'
import { X, Settings, Check, Shield, BarChart3, Target, Cookie } from 'lucide-react'
import { useCookieConsent } from '../contexts/CookieConsentContext'
import './CookieConsentBanner.css'

const CookieConsentBanner = () => {
  const {
    showBanner,
    consentPreferences,
    acceptAll,
    acceptSelected,
    rejectAll,
    hideBanner
  } = useCookieConsent()

  const [showPreferences, setShowPreferences] = useState(false)
  const [tempPreferences, setTempPreferences] = useState(consentPreferences)

  if (!showBanner) return null

  const handleAcceptSelected = () => {
    acceptSelected(tempPreferences)
    setShowPreferences(false)
  }

  const handleTogglePreference = (category) => {
    if (category === 'essential') return // Can't toggle essential cookies
    
    setTempPreferences(prev => ({
      ...prev,
      [category]: !prev[category]
    }))
  }

  const cookieCategories = [
    {
      id: 'essential',
      title: 'Essential Cookies',
      description: 'Required for basic website functionality, authentication, and security. These cannot be disabled.',
      icon: Shield,
      required: true
    },
    {
      id: 'functional',
      title: 'Functional Cookies',
      description: 'Remember your preferences, location settings, and enhance your browsing experience.',
      icon: Settings,
      required: false
    },
    {
      id: 'analytics',
      title: 'Analytics Cookies',
      description: 'Help us understand how you use our website to improve performance and user experience.',
      icon: BarChart3,
      required: false
    },
    {
      id: 'marketing',
      title: 'Marketing Cookies',
      description: 'Used to deliver relevant advertisements and track campaign effectiveness.',
      icon: Target,
      required: false
    }
  ]

  return (
    <div className="cookie-consent-overlay">
      <div className="cookie-consent-banner">
        {!showPreferences ? (
          // Simple banner view
          <div className="cookie-banner-simple">
            <div className="cookie-banner-content">
              <div className="cookie-banner-icon">
                <Cookie size={24} />
              </div>
              <div className="cookie-banner-text">
                <h3>We use cookies</h3>
                <p>
                  We use cookies to enhance your browsing experience, serve personalized content, 
                  and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
                </p>
              </div>
            </div>
            <div className="cookie-banner-actions">
              <button 
                className="cookie-btn cookie-btn-secondary"
                onClick={rejectAll}
              >
                Reject All
              </button>
              <button 
                className="cookie-btn cookie-btn-outline"
                onClick={() => setShowPreferences(true)}
              >
                <Settings size={16} />
                Customize
              </button>
              <button 
                className="cookie-btn cookie-btn-primary"
                onClick={acceptAll}
              >
                Accept All
              </button>
            </div>
            <button 
              className="cookie-banner-close"
              onClick={hideBanner}
              aria-label="Close cookie banner"
            >
              <X size={20} />
            </button>
          </div>
        ) : (
          // Detailed preferences view
          <div className="cookie-banner-detailed">
            <div className="cookie-banner-header">
              <h3>Cookie Preferences</h3>
              <button 
                className="cookie-banner-close"
                onClick={() => setShowPreferences(false)}
                aria-label="Close preferences"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="cookie-preferences">
              {cookieCategories.map((category) => {
                const IconComponent = category.icon
                return (
                  <div key={category.id} className="cookie-preference-item">
                    <div className="cookie-preference-header">
                      <div className="cookie-preference-info">
                        <IconComponent size={20} />
                        <div>
                          <h4>{category.title}</h4>
                          <p>{category.description}</p>
                        </div>
                      </div>
                      <div className="cookie-preference-toggle">
                        {category.required ? (
                          <span className="cookie-toggle-disabled">
                            <Check size={16} />
                          </span>
                        ) : (
                          <button
                            className={`cookie-toggle ${tempPreferences[category.id] ? 'active' : ''}`}
                            onClick={() => handleTogglePreference(category.id)}
                            aria-label={`Toggle ${category.title}`}
                          >
                            <span className="cookie-toggle-slider"></span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="cookie-banner-actions">
              <button 
                className="cookie-btn cookie-btn-secondary"
                onClick={rejectAll}
              >
                Reject All
              </button>
              <button 
                className="cookie-btn cookie-btn-outline"
                onClick={() => setShowPreferences(false)}
              >
                Cancel
              </button>
              <button 
                className="cookie-btn cookie-btn-primary"
                onClick={handleAcceptSelected}
              >
                Save Preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CookieConsentBanner
