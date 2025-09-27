/**
 * Utility functions for identifying and refactoring duplicated code patterns
 */

import React from 'react'

// Common form validation patterns
export const formValidationPatterns = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address'
  },
  password: {
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    message: 'Password must be at least 8 characters with uppercase, lowercase, and number'
  },
  phone: {
    pattern: /^[\+]?[1-9][\d]{0,15}$/,
    message: 'Please enter a valid phone number'
  },
  name: {
    minLength: 2,
    pattern: /^[a-zA-Z\s]+$/,
    message: 'Name must contain only letters and spaces'
  }
}

// Common error handling patterns
export const errorHandlingPatterns = {
  apiError: (error) => ({
    message: error?.data?.message || error?.message || 'An error occurred',
    status: error?.status || 500,
    type: 'api_error'
  }),
  validationError: (errors) => {
    const result = {}
    Object.keys(errors).forEach(key => {
      result[key] = Array.isArray(errors[key]) ? errors[key][0] : errors[key]
    })
    return result
  },
  networkError: () => ({
    message: 'Network error. Please check your connection and try again.',
    type: 'network_error'
  })
}

// Common loading state patterns
export const loadingStatePatterns = {
  initial: {
    loading: false,
    error: null,
    data: null
  },
  loading: {
    loading: true,
    error: null,
    data: null
  },
  success: (data) => ({
    loading: false,
    error: null,
    data
  }),
  error: (error) => ({
    loading: false,
    error,
    data: null
  })
}

// Common form state patterns
export const formStatePatterns = {
  initial: (fields) => {
    const state = {}
    fields.forEach(field => {
      state[field] = ''
    })
    return state
  },
  update: (prevState, field, value) => ({
    ...prevState,
    [field]: value
  }),
  reset: (fields) => formStatePatterns.initial(fields)
}

// Common modal state patterns
export const modalStatePatterns = {
  initial: {
    isOpen: false,
    data: null,
    loading: false,
    error: null
  },
  open: (data = null) => ({
    isOpen: true,
    data,
    loading: false,
    error: null
  }),
  close: () => ({
    isOpen: false,
    data: null,
    loading: false,
    error: null
  }),
  loading: (prevState) => ({
    ...prevState,
    loading: true,
    error: null
  }),
  error: (prevState, error) => ({
    ...prevState,
    loading: false,
    error
  })
}

// Common API call patterns
export const apiCallPatterns = {
  withRetry: async (apiCall, maxRetries = 3, delay = 1000) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await apiCall()
      } catch (error) {
        if (attempt === maxRetries) throw error
        await new Promise(resolve => setTimeout(resolve, delay * attempt))
      }
    }
  },
  withTimeout: (apiCall, timeout = 10000) => {
    return Promise.race([
      apiCall(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), timeout)
      )
    ])
  },
  withLoading: async (apiCall, setLoading) => {
    setLoading(true)
    try {
      const result = await apiCall()
      return result
    } finally {
      setLoading(false)
    }
  }
}

// Common validation patterns
export const validationPatterns = {
  required: (value, fieldName) => {
    if (!value || value.trim() === '') {
      return `${fieldName} is required`
    }
    return null
  },
  email: (value) => {
    if (value && !formValidationPatterns.email.pattern.test(value)) {
      return formValidationPatterns.email.message
    }
    return null
  },
  password: (value) => {
    if (value && value.length < formValidationPatterns.password.minLength) {
      return `Password must be at least ${formValidationPatterns.password.minLength} characters`
    }
    if (value && !formValidationPatterns.password.pattern.test(value)) {
      return formValidationPatterns.password.message
    }
    return null
  },
  confirmPassword: (password, confirmPassword) => {
    if (password !== confirmPassword) {
      return 'Passwords do not match'
    }
    return null
  },
  minLength: (value, minLength, fieldName) => {
    if (value && value.length < minLength) {
      return `${fieldName} must be at least ${minLength} characters`
    }
    return null
  },
  maxLength: (value, maxLength, fieldName) => {
    if (value && value.length > maxLength) {
      return `${fieldName} must be no more than ${maxLength} characters`
    }
    return null
  }
}

// Common debounce patterns
export const debouncePatterns = {
  search: (callback, delay = 300) => {
    let timeoutId
    return (...args) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => callback(...args), delay)
    }
  },
  resize: (callback, delay = 150) => {
    let timeoutId
    return (...args) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => callback(...args), delay)
    }
  },
  input: (callback, delay = 500) => {
    let timeoutId
    return (...args) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => callback(...args), delay)
    }
  }
}

// Common localStorage patterns
export const localStoragePatterns = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.warn(`Failed to get ${key} from localStorage:`, error)
      return defaultValue
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.warn(`Failed to set ${key} in localStorage:`, error)
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.warn(`Failed to remove ${key} from localStorage:`, error)
    }
  }
}

// Common event handler patterns
export const eventHandlerPatterns = {
  preventDefault: (handler) => (event) => {
    event.preventDefault()
    handler(event)
  },
  stopPropagation: (handler) => (event) => {
    event.stopPropagation()
    handler(event)
  },
  withLoading: (handler, setLoading) => async (event) => {
    setLoading(true)
    try {
      await handler(event)
    } finally {
      setLoading(false)
    }
  }
}

// Common component patterns
export const componentPatterns = {
  withErrorBoundary: (Component, fallback = null) => {
    return (props) => {
      try {
        return <Component {...props} />
      } catch (error) {
        console.error('Component error:', error)
        return fallback || <div>Something went wrong</div>
      }
    }
  },
  withLoading: (Component, isLoading, loadingComponent = null) => {
    return (props) => {
      if (isLoading) {
        return loadingComponent || <div>Loading...</div>
      }
      return <Component {...props} />
    }
  },
  withConditional: (Component, condition, fallback = null) => {
    return (props) => {
      if (condition) {
        return <Component {...props} />
      }
      return fallback
    }
  }
}
