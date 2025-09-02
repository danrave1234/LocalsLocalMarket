import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { loginRequest, registerRequest, getProfileRequest, updateProfileRequest, changePasswordRequest } from '../api/auth.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('auth_token')
        const storedUser = localStorage.getItem('auth_user')
        
        if (storedToken && storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser)
            
            // Verify the token is still valid by making a test request
            try {
              const profileData = await getProfileRequest(storedToken)
              const updatedUser = { 
                ...parsedUser,
                name: profileData.name,
                createdAt: profileData.createdAt,
                role: profileData.role || 'SELLER' // Default to SELLER if role is not provided
              }
              localStorage.setItem('auth_user', JSON.stringify(updatedUser))
              setToken(storedToken)
              setUser(updatedUser)
            } catch (error) {
              console.log('Stored token is invalid, clearing auth data')
              localStorage.removeItem('auth_token')
              localStorage.removeItem('auth_user')
              setToken(null)
              setUser(null)
            }
          } catch {
            // If stored user data is corrupted, clear everything
            localStorage.removeItem('auth_token')
            localStorage.removeItem('auth_user')
            setToken(null)
            setUser(null)
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
        setToken(null)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = async (email, password) => {
    const data = await loginRequest({ email, password })
    const newToken = data.token || data.accessToken
    localStorage.setItem('auth_token', newToken)
    setToken(newToken)
    
    // Fetch user profile data
    try {
      const profileData = await getProfileRequest(newToken)
      const newUser = { 
        email,
        name: profileData.name,
        createdAt: profileData.createdAt,
        role: profileData.role || 'SELLER' // Default to SELLER if role is not provided
      }
      localStorage.setItem('auth_user', JSON.stringify(newUser))
      setUser(newUser)
      return newUser
    } catch (error) {
      console.error('Failed to fetch profile:', error)
      const newUser = { email, role: 'SELLER' }
      localStorage.setItem('auth_user', JSON.stringify(newUser))
      setUser(newUser)
      return newUser
    }
  }

  const register = async (email, password, name) => {
    const data = await registerRequest({ name, email, password })
    const newToken = data.token || data.accessToken
    if (newToken) localStorage.setItem('auth_token', newToken)
    if (newToken) setToken(newToken)
    
    // Create user object with provided data
    const newUser = { name, email, createdAt: new Date().toISOString(), role: 'SELLER' }
    localStorage.setItem('auth_user', JSON.stringify(newUser))
    setUser(newUser)
    return newUser
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    setToken(null)
    setUser(null)
  }

  const updateProfile = async (profileData) => {
    console.log('=== UPDATE PROFILE DEBUG ===')
    console.log('Token exists:', !!token)
    console.log('Token length:', token ? token.length : 0)
    console.log('Token preview:', token ? token.substring(0, 50) + '...' : 'NO TOKEN')
    console.log('Profile data:', profileData)
    console.log('User data:', user)
    
    if (!token) throw new Error('No token available')
    
    try {
      console.log('Calling updateProfileRequest...')
      await updateProfileRequest(profileData, token)
      console.log('updateProfileRequest successful')
      const updatedUser = { ...user, ...profileData }
      localStorage.setItem('auth_user', JSON.stringify(updatedUser))
      setUser(updatedUser)
      return updatedUser
    } catch (error) {
      console.error('Failed to update profile:', error)
      throw error
    }
  }

  const changePassword = async (currentPassword, newPassword) => {
    console.log('=== CHANGE PASSWORD DEBUG ===')
    console.log('Token exists:', !!token)
    
    if (!token) throw new Error('No token available')
    
    try {
      console.log('Calling changePasswordRequest...')
      await changePasswordRequest({ currentPassword, newPassword }, token)
      console.log('changePasswordRequest successful')
      return { message: 'Password changed successfully' }
    } catch (error) {
      console.error('Failed to change password:', error)
      throw error
    }
  }

  const value = useMemo(() => ({ 
    token, 
    user, 
    isLoading,
    login, 
    register, 
    logout, 
    updateProfile, 
    changePassword 
  }), [token, user, isLoading])
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}


