import { useCookieConsent } from '../contexts/CookieConsentContext'

/**
 * Hook for safely using localStorage with cookie consent
 * @param {string} key - The localStorage key
 * @param {*} defaultValue - Default value if no consent or key doesn't exist
 * @param {string} category - Cookie category ('essential', 'functional', 'analytics', 'marketing')
 * @returns {[any, function, function]} - [value, setValue, removeValue]
 */
export const useConsentStorage = (key, defaultValue = null, category = 'functional') => {
  const { canUseStorage } = useCookieConsent()

  const getValue = () => {
    if (!canUseStorage(category)) {
      return defaultValue
    }

    try {
      const item = localStorage.getItem(key)
      if (item === null) {
        return defaultValue
      }
      return JSON.parse(item)
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error)
      return defaultValue
    }
  }

  const setValue = (value) => {
    if (!canUseStorage(category)) {
      console.warn(`Cannot set localStorage key "${key}" - no consent for ${category} cookies`)
      return false
    }

    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error)
      return false
    }
  }

  const removeValue = () => {
    if (!canUseStorage(category)) {
      console.warn(`Cannot remove localStorage key "${key}" - no consent for ${category} cookies`)
      return false
    }

    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error)
      return false
    }
  }

  return [getValue(), setValue, removeValue]
}

/**
 * Hook for safely using localStorage with cookie consent (React state-like)
 * @param {string} key - The localStorage key
 * @param {*} defaultValue - Default value if no consent or key doesn't exist
 * @param {string} category - Cookie category
 * @returns {[any, function]} - [value, setValue]
 */
export const useConsentStorageState = (key, defaultValue = null, category = 'functional') => {
  const { canUseStorage } = useCookieConsent()

  const getValue = () => {
    if (!canUseStorage(category)) {
      return defaultValue
    }

    try {
      const item = localStorage.getItem(key)
      if (item === null) {
        return defaultValue
      }
      return JSON.parse(item)
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error)
      return defaultValue
    }
  }

  const setValue = (value) => {
    if (!canUseStorage(category)) {
      console.warn(`Cannot set localStorage key "${key}" - no consent for ${category} cookies`)
      return
    }

    try {
      if (value === null || value === undefined) {
        localStorage.removeItem(key)
      } else {
        localStorage.setItem(key, JSON.stringify(value))
      }
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error)
    }
  }

  return [getValue(), setValue]
}

/**
 * Utility function to check if a localStorage operation is allowed
 * @param {string} category - Cookie category
 * @returns {boolean}
 */
export const useCanUseStorage = (category = 'functional') => {
  const { canUseStorage } = useCookieConsent()
  return canUseStorage(category)
}

/**
 * Utility function to safely get a value from localStorage with consent check
 * @param {string} key - The localStorage key
 * @param {*} defaultValue - Default value if no consent or key doesn't exist
 * @param {string} category - Cookie category
 * @returns {any}
 */
export const getConsentStorage = (key, defaultValue = null, category = 'functional') => {
  // This is a standalone function that can be used outside of React components
  try {
    const consentData = localStorage.getItem('cookie_consent')
    if (!consentData) {
      return defaultValue
    }

    const consent = JSON.parse(consentData)
    if (category === 'essential' || consent.preferences[category]) {
      const item = localStorage.getItem(key)
      if (item === null) {
        return defaultValue
      }
      return JSON.parse(item)
    }
    
    return defaultValue
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error)
    return defaultValue
  }
}

/**
 * Utility function to safely set a value in localStorage with consent check
 * @param {string} key - The localStorage key
 * @param {*} value - Value to store
 * @param {string} category - Cookie category
 * @returns {boolean} - Success status
 */
export const setConsentStorage = (key, value, category = 'functional') => {
  try {
    const consentData = localStorage.getItem('cookie_consent')
    if (!consentData) {
      console.warn(`Cannot set localStorage key "${key}" - no cookie consent given`)
      return false
    }

    const consent = JSON.parse(consentData)
    if (category === 'essential' || consent.preferences[category]) {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    }
    
    console.warn(`Cannot set localStorage key "${key}" - no consent for ${category} cookies`)
    return false
  } catch (error) {
    console.error(`Error writing to localStorage key "${key}":`, error)
    return false
  }
}
