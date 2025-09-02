import { useState, useEffect, useCallback } from 'react'

/**
 * Custom hook for handling API calls with loading and error states
 * @param {Function} apiCall - The API function to call
 * @param {boolean} immediate - Whether to call the API immediately
 * @returns {Object} - { data, loading, error, execute }
 */
export function useApiCall(apiCall, immediate = false) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiCall(...args)
      setData(result)
      return result
    } catch (err) {
      setError(err.message || 'An error occurred')
      throw err
    } finally {
      setLoading(false)
    }
  }, [apiCall])

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [execute, immediate])

  return { data, loading, error, execute }
}

/**
 * Custom hook for handling form state with validation
 * @param {Object} initialValues - Initial form values
 * @param {Function} validationSchema - Validation function
 * @returns {Object} - Form state and handlers
 */
export function useForm(initialValues, validationSchema = null) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const handleChange = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }, [errors])

  const handleBlur = useCallback((name) => {
    setTouched(prev => ({ ...prev, [name]: true }))
    
    // Validate on blur if validation schema exists
    if (validationSchema) {
      const fieldErrors = validationSchema(values, name)
      setErrors(prev => ({ ...prev, [name]: fieldErrors[name] || '' }))
    }
  }, [values, validationSchema])

  const validate = useCallback(() => {
    if (!validationSchema) return true
    
    const fieldErrors = validationSchema(values)
    setErrors(fieldErrors)
    
    return Object.keys(fieldErrors).length === 0
  }, [values, validationSchema])

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }, [initialValues])

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validate,
    reset,
    setValues
  }
}
