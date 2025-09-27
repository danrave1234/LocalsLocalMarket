import { useState, useCallback } from 'react'
import { handleApiError } from '../utils/errorHandler.js'

/**
 * Custom hook for standardized error handling across components
 * Provides consistent error state management and user feedback
 */
export const useErrorHandler = (options = {}) => {
  const {
    showToast = false,
    toast = null,
    onError = null,
    retryable = true,
    maxRetries = 3
  } = options

  const [error, setError] = useState(null)
  const [isRetrying, setIsRetrying] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  const handleError = useCallback((error, context = '') => {
    console.error(`Error in ${context}:`, error)
    
    const errorInfo = handleApiError(error)
    setError(errorInfo)
    
    // Show toast notification if enabled
    if (showToast && toast) {
      toast({
        title: 'Error',
        description: errorInfo.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
    
    // Call custom error handler if provided
    if (onError) {
      onError(errorInfo, context)
    }
    
    return errorInfo
  }, [showToast, toast, onError])

  const clearError = useCallback(() => {
    setError(null)
    setRetryCount(0)
  }, [])

  const retry = useCallback(async (retryFn, context = '') => {
    if (!retryable || retryCount >= maxRetries) {
      return false
    }
    
    setIsRetrying(true)
    setRetryCount(prev => prev + 1)
    
    try {
      await retryFn()
      clearError()
      return true
    } catch (error) {
      handleError(error, `${context} (retry ${retryCount + 1})`)
      return false
    } finally {
      setIsRetrying(false)
    }
  }, [retryable, maxRetries, retryCount, handleError, clearError])

  return {
    error,
    isRetrying,
    retryCount,
    handleError,
    clearError,
    retry,
    hasError: !!error
  }
}

/**
 * Hook for form-specific error handling
 */
export const useFormErrorHandler = (options = {}) => {
  const {
    onValidationError = null,
    onSubmissionError = null
  } = options

  const [fieldErrors, setFieldErrors] = useState({})
  const [submissionError, setSubmissionError] = useState('')

  const handleValidationError = useCallback((errors) => {
    const validationErrors = {}
    
    if (errors && typeof errors === 'object') {
      Object.keys(errors).forEach(key => {
        if (Array.isArray(errors[key])) {
          validationErrors[key] = errors[key][0]
        } else if (typeof errors[key] === 'string') {
          validationErrors[key] = errors[key]
        }
      })
    }
    
    setFieldErrors(validationErrors)
    
    if (onValidationError) {
      onValidationError(validationErrors)
    }
    
    return validationErrors
  }, [onValidationError])

  const handleSubmissionError = useCallback((error, context = '') => {
    const errorInfo = handleApiError(error)
    setSubmissionError(errorInfo.message)
    
    if (onSubmissionError) {
      onSubmissionError(errorInfo, context)
    }
    
    return errorInfo
  }, [onSubmissionError])

  const clearFieldError = useCallback((fieldName) => {
    setFieldErrors(prev => {
      const next = { ...prev }
      delete next[fieldName]
      return next
    })
  }, [])

  const clearAllErrors = useCallback(() => {
    setFieldErrors({})
    setSubmissionError('')
  }, [])

  return {
    fieldErrors,
    submissionError,
    handleValidationError,
    handleSubmissionError,
    clearFieldError,
    clearAllErrors,
    hasFieldErrors: Object.keys(fieldErrors).length > 0,
    hasSubmissionError: !!submissionError
  }
}
