// Error handling utility for API calls
export const handleApiError = (error, navigate) => {
  console.error('API Error:', error);

  // Handle network errors
  if (!error.response) {
    return {
      type: 'network',
      message: 'Network error. Please check your internet connection and try again.',
      code: 'NETWORK_ERROR'
    };
  }

  const { status, data } = error.response;

  // Handle different HTTP status codes
  switch (status) {
    case 400:
      return {
        type: 'bad_request',
        message: data?.message || 'Invalid request. Please check your input and try again.',
        code: data?.code || 'BAD_REQUEST',
        details: data?.details || null
      };

    case 401:
      // Redirect to login page for authentication errors
      if (navigate) {
        navigate('/login', { 
          state: { 
            from: window.location.pathname,
            message: 'Please log in to continue.' 
          } 
        });
      }
      return {
        type: 'unauthorized',
        message: 'You need to be logged in to access this resource.',
        code: 'UNAUTHORIZED'
      };

    case 403:
      // Redirect to unauthorized page for permission errors
      if (navigate) {
        navigate('/unauthorized', { 
          state: { 
            errorCode: 403,
            message: data?.message || 'You don\'t have permission to access this resource.' 
          } 
        });
      }
      return {
        type: 'forbidden',
        message: data?.message || 'You don\'t have permission to access this resource.',
        code: data?.code || 'FORBIDDEN'
      };

    case 404:
      // Redirect to 404 page for not found errors
      if (navigate) {
        navigate('/not-found', { 
          state: { 
            message: data?.message || 'The requested resource was not found.' 
          } 
        });
      }
      return {
        type: 'not_found',
        message: data?.message || 'The requested resource was not found.',
        code: data?.code || 'NOT_FOUND'
      };

    case 422:
      return {
        type: 'validation',
        message: data?.message || 'Validation error. Please check your input.',
        code: data?.code || 'VALIDATION_ERROR',
        details: data?.details || null
      };

    case 429:
      return {
        type: 'rate_limit',
        message: 'Too many requests. Please wait a moment and try again.',
        code: 'RATE_LIMIT_EXCEEDED'
      };

    case 500:
      return {
        type: 'server_error',
        message: 'Server error. Please try again later.',
        code: 'INTERNAL_SERVER_ERROR'
      };

    case 502:
    case 503:
    case 504:
      return {
        type: 'service_unavailable',
        message: 'Service temporarily unavailable. Please try again later.',
        code: 'SERVICE_UNAVAILABLE'
      };

    default:
      return {
        type: 'unknown',
        message: data?.message || 'An unexpected error occurred.',
        code: data?.code || 'UNKNOWN_ERROR'
      };
  }
};

// Toast notification for errors
export const showErrorToast = (error, toast) => {
  if (!toast) return;

  const errorInfo = typeof error === 'string' ? { message: error } : error;
  
  toast({
    title: 'Error',
    description: errorInfo.message || 'An error occurred',
    status: 'error',
    duration: 5000,
    isClosable: true,
  });
};

// Handle form validation errors
export const handleValidationErrors = (errors) => {
  const validationErrors = {};
  
  if (errors && typeof errors === 'object') {
    Object.keys(errors).forEach(key => {
      if (Array.isArray(errors[key])) {
        validationErrors[key] = errors[key][0]; // Take first error message
      } else if (typeof errors[key] === 'string') {
        validationErrors[key] = errors[key];
      }
    });
  }
  
  return validationErrors;
};

// Retry mechanism for failed requests
export const retryRequest = async (requestFn, maxRetries = 3, delay = 1000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
};

// Check if error is retryable
export const isRetryableError = (error) => {
  if (!error.response) return true; // Network errors are retryable
  
  const { status } = error.response;
  return [408, 429, 500, 502, 503, 504].includes(status);
};
