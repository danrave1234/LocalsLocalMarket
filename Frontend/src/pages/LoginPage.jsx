import { useState } from 'react'
import { useAuth } from '../auth/AuthContext.jsx'
import { useLocation, useNavigate } from 'react-router-dom'
import { ResponsiveAd } from '../components/GoogleAds.jsx'
import { forgotPasswordRequest } from '../api/auth.js'
import Modal from '../components/Modal.jsx'
import '../auth.css'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState('')
    const [showForgotPassword, setShowForgotPassword] = useState(false)
    const [forgotPasswordMessage, setForgotPasswordMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const onSubmit = async (e) => {
        e.preventDefault()
        setError('')
        const from = location.state?.from?.pathname || '/'

        try {
            await login(email, password)
            navigate(from, { replace: true })
        } catch (err) {
            setError(err?.data?.message || err.message || 'Login failed')
        }
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    const handleForgotPassword = async (e) => {
        e.preventDefault()
        setForgotPasswordMessage('')
        setIsLoading(true)
        
        try {
            const response = await forgotPasswordRequest({ email: forgotPasswordEmail })
            setForgotPasswordMessage(response.message)
            setForgotPasswordEmail('')
            setTimeout(() => {
                setShowForgotPassword(false)
                setForgotPasswordMessage('')
            }, 3000)
        } catch (err) {
            setForgotPasswordMessage(err.message || 'Failed to process request')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <main className="auth-container">
            <div className="auth-content">
                {/* Auth Header */}
                <div className="auth-header">
                    <h1 className="auth-title">Welcome Back</h1>
                    <p className="auth-subtitle">Sign in to your account to continue managing your shops</p>
                </div>

                {/* Auth Form Card */}
                <div className="auth-card">
                    {error && (
                        <div className="auth-error">
                            <svg className="error-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                                <path d="M15 9L9 15M9 9L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                            {error}
                        </div>
                    )}

                    <form onSubmit={onSubmit} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">
                                <svg className="label-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="auth-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                                data-form-type="other"
                                placeholder="Enter your email address"
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="password" className="form-label">
                                <svg className="label-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                                    <circle cx="12" cy="16" r="1" stroke="currentColor" strokeWidth="2"/>
                                    <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="currentColor" strokeWidth="2"/>
                                </svg>
                                Password
                            </label>
                            <div className="password-input-container">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    className="auth-input"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete="current-password"
                                    data-form-type="other"
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    className="password-toggle-btn"
                                    onClick={togglePasswordVisibility}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <svg className="password-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M17.94 17.94C16.2306 19.243 14.1491 19.9649 12 20C5 20 1 12 1 12C2.24389 9.68192 3.96914 7.65661 6.06 6.06M9.9 4.24C10.5883 4.0789 11.2931 3.99836 12 4C19 4 23 12 23 12C22.393 13.1356 21.6691 14.2048 20.84 15.19M14.12 14.12C13.8454 14.4148 13.5141 14.6512 13.1462 14.8151C12.7782 14.9791 12.3809 15.0673 11.9781 15.0744C11.5753 15.0815 11.1747 15.0074 10.8016 14.8565C10.4286 14.7056 10.0887 14.4811 9.80385 14.1962C9.51901 13.9114 9.29451 13.5715 9.14359 13.1984C8.99267 12.8253 8.91856 12.4247 8.92563 12.0219C8.9327 11.6191 9.02091 11.2218 9.18488 10.8538C9.34884 10.4859 9.58525 10.1546 9.88 9.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M1 1L23 23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    ) : (
                                        <svg className="password-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                        
                        <div className="form-group forgot-password-group">
                            <div className="password-actions">
                                <button 
                                    type="button" 
                                    className="forgot-password-btn"
                                    onClick={() => setShowForgotPassword(true)}
                                >
                                    Forgot Password?
                                </button>
                            </div>
                        </div>
                        
                        <button type="submit" className="auth-submit-btn">
                            <svg className="btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 3L21 12L15 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Sign In
                        </button>
                    </form>
                    
                    <div className="auth-footer">
                        <p className="auth-link-text">
                            Don't have an account?{' '}
                            <a href="/register" className="auth-link">
                                Sign up here
                            </a>
                        </p>
                    </div>
                </div>


            </div>
            
            {/* Bottom ad */}
            <div className="auth-ad">
                <ResponsiveAd />
            </div>

            {/* Forgot Password Modal */}
            <Modal
                isOpen={showForgotPassword}
                onClose={() => setShowForgotPassword(false)}
                title="Forgot Password"
                size="medium"
            >
                <form onSubmit={handleForgotPassword} className="modal-form" aria-label="Forgot password form">
                    <div className="form-group">
                        <label htmlFor="forgot-email" className="form-label">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="forgot-email"
                            className="auth-input"
                            value={forgotPasswordEmail}
                            onChange={(e) => setForgotPasswordEmail(e.target.value)}
                            required
                            placeholder="Enter your email address"
                            autoComplete="email"
                            list="email-suggestions"
                            aria-describedby="email-help"
                        />
                        <datalist id="email-suggestions">
                            <option value="danravekeh123@gmail.com" />
                            <option value="admin@localslocalmarket.com" />
                            <option value="dj@cit.edu" />
                            <option value="danrave.keh@cit.edu" />
                            <option value="DanraveCustomer@example.com" />
                        </datalist>
                        <small id="email-help" className="help-text">
                            Enter the email address associated with your account
                        </small>
                    </div>
                    
                    {forgotPasswordMessage && (
                        <div 
                            className={`message ${forgotPasswordMessage.includes('sent') ? 'success' : 'error'}`}
                            role="alert"
                            aria-live="polite"
                        >
                            {forgotPasswordMessage}
                        </div>
                    )}
                    
                    <div className="modal-actions">
                        <button 
                            type="button" 
                            className="btn-secondary"
                            onClick={() => setShowForgotPassword(false)}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="btn-primary"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </div>
                </form>
            </Modal>
        </main>
    )
}


