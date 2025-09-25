import { API_BASE } from './client.js'

export async function loginRequest({ email, password }) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Login failed')
  }
  return response.json()
}

export async function registerRequest({ name, email, password }) {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Registration failed')
  }
  return response.json()
}

export async function getProfileRequest(token) {
  const response = await fetch(`${API_BASE}/users/profile`, {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to fetch profile')
  }
  return response.json()
}

export async function updateProfileRequest({ name }, token) {
  console.log('=== UPDATE PROFILE REQUEST DEBUG ===')
  console.log('API_BASE:', API_BASE)
  console.log('Full URL:', `${API_BASE}/users/profile`)
  console.log('Making update profile request with token:', token ? token.substring(0, 20) + '...' : 'NO TOKEN')
  console.log('Request data:', { name })
  
  const response = await fetch(`${API_BASE}/users/profile`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ name })
  })
  
  console.log('Response status:', response.status)
  console.log('Response headers:', Object.fromEntries(response.headers.entries()))
  
  if (!response.ok) {
    const error = await response.json()
    console.error('Error response:', error)
    throw new Error(error.error || 'Failed to update profile')
  }
  return response.json()
}

export async function changePasswordRequest({ currentPassword, newPassword }, token) {
  console.log('=== CHANGE PASSWORD REQUEST DEBUG ===')
  console.log('API_BASE:', API_BASE)
  console.log('Full URL:', `${API_BASE}/users/change-password`)
  console.log('Making change password request with token:', token ? token.substring(0, 20) + '...' : 'NO TOKEN')
  
  const response = await fetch(`${API_BASE}/users/change-password`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ currentPassword, newPassword })
  })
  
  console.log('Response status:', response.status)
  
  if (!response.ok) {
    const error = await response.json()
    console.error('Error response:', error)
    throw new Error(error.error || 'Failed to change password')
  }
  return response.json()
}

export async function forgotPasswordRequest({ email }) {
  const response = await fetch(`${API_BASE}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to process forgot password request')
  }
  return response.json()
}

export async function resetPasswordRequest({ token, password }) {
  const response = await fetch(`${API_BASE}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, password })
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to reset password')
  }
  return response.json()
}

export async function googleLoginRequest({ idToken }) {
  const response = await fetch(`${API_BASE}/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken })
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error || 'Google sign-in failed')
  }
  return response.json()
}

export async function fetchPublicConfig() {
  const response = await fetch(`${API_BASE}/public/config`, { method: 'GET' })
  if (!response.ok) return {}
  return response.json()
}

export async function getEmailVerificationStatus(token) {
  const response = await fetch(`${API_BASE}/users/email-verification-status`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
  if (!response.ok) {
    return { emailVerified: false, emailVerifiedAt: null }
  }
  return response.json()
}

export async function sendEmailVerification(token) {
  const response = await fetch(`${API_BASE}/users/send-email-verification`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error || 'Failed to send verification code')
  }
  return response.json()
}

export async function verifyEmailCode(code, token) {
  const response = await fetch(`${API_BASE}/users/verify-email`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ code })
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error || 'Invalid or expired code')
  }
  return response.json()
}


