import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../auth/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'
import { ResponsiveAd } from '../components/GoogleAds.jsx'
import '../auth.css'
import { fetchPublicConfig } from '../api/auth.js'

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [acceptedTerms, setAcceptedTerms] = useState(false)
    const [error, setError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { register, loginWithGoogle } = useAuth()
    const googleBtnRef = useRef(null)
    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        setError('')
        if (isSubmitting) return
        
        if (!acceptedTerms) {
            return setError('Please accept the Terms of Agreement to continue')
        }

        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match')
        }

        setIsSubmitting(true)
        try {
            await register(formData.email, formData.password, formData.name)
            navigate('/', { replace: true })
        } catch (err) {
            setError(err?.data?.message || err.message || 'Registration failed')
        } finally {
            setIsSubmitting(false)
        }
    }

    useEffect(() => {
        if (!googleBtnRef.current) return
        try {
            const init = async () => {
                const envClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''
                let clientId = envClientId
                if (!clientId) {
                    try {
                        const conf = await fetchPublicConfig()
                        clientId = conf.googleClientId || ''
                    } catch {}
                }
                if (!window.google || !clientId) return
                /* global google */
                window.google.accounts.id.initialize({
                    client_id: clientId,
                    callback: async (response) => {
                    try {
                        const cred = response.credential
                        if (!cred) return
                        await loginWithGoogle(cred)
                        navigate('/', { replace: true })
                    } catch (err) {
                        setError(err?.message || 'Google sign-in failed')
                    }
                    }
                })
                window.google.accounts.id.renderButton(googleBtnRef.current, { 
                theme: 'filled_black', 
                size: 'large', 
                shape: 'pill',
                text: 'continue_with',
                logo_alignment: 'left',
                width: 360 
                })
            }
            init()
        } catch (e) {
            // ignore
        }
    }, [loginWithGoogle])

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword)
    }

    return (
        <main className="auth-container">
            <div className="auth-content">
                {/* Auth Header */}
                <div className="auth-header">
                    <h1 className="auth-title">Create Your Account</h1>
                    <p className="auth-subtitle">Join our local marketplace community and start selling your products</p>
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

                    <form onSubmit={onSubmit} className="auth-form" aria-busy={isSubmitting}>
                        <div className="form-group">
                            <label htmlFor="name" className="form-label">
                                <svg className="label-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                                </svg>
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className="auth-input"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                autoComplete="name"
                                autoFill="off"
                                data-form-type="other"
                                placeholder="Enter your full name"
                                disabled={isSubmitting}
                            />
                        </div>

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
                                name="email"
                                className="auth-input"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                autoComplete="email"
                                autoFill="off"
                                data-form-type="other"
                                placeholder="Enter your email address"
                                disabled={isSubmitting}
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
                                    name="password"
                                    className="auth-input"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    autoComplete="new-password"
                                    autoFill="off"
                                    data-form-type="other"
                                    placeholder="Create a strong password"
                                    disabled={isSubmitting}
                                />
                                <button
                                    type="button"
                                    className="password-toggle-btn"
                                    onClick={togglePasswordVisibility}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    disabled={isSubmitting}
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

                        <div className="form-group">
                            <label htmlFor="confirmPassword" className="form-label">
                                <svg className="label-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                                    <circle cx="12" cy="16" r="1" stroke="currentColor" strokeWidth="2"/>
                                    <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="currentColor" strokeWidth="2"/>
                                </svg>
                                Confirm Password
                            </label>
                            <div className="password-input-container">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    className="auth-input"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    autoComplete="new-password"
                                    autoFill="off"
                                    data-form-type="other"
                                    placeholder="Confirm your password"
                                    disabled={isSubmitting}
                                />
                                <button
                                    type="button"
                                    className="password-toggle-btn"
                                    onClick={toggleConfirmPasswordVisibility}
                                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                    disabled={isSubmitting}
                                >
                                    {showConfirmPassword ? (
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

                        <div className="form-group">
                            <label className="form-label" htmlFor="tos">
                                <input
                                    id="tos"
                                    name="tos"
                                    type="checkbox"
                                    checked={acceptedTerms}
                                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                                    className="auth-checkbox"
                                    required
                                />
                                <span style={{ marginLeft: 8 }}>
                                    I agree to the
                                    {' '}<a className="auth-link" href="/terms">Terms</a>{' '}and{' '}
                                    <a className="auth-link" href="/privacy">Privacy Policy</a>
                                </span>
                            </label>
                        </div>
                        
                        <button type="submit" className="auth-submit-btn" disabled={!acceptedTerms || isSubmitting} aria-disabled={!acceptedTerms || isSubmitting}>
                            <svg className="btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 3L21 12L15 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            {isSubmitting ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    <div className="oauth-divider">
                        <span>Or continue with</span>
                    </div>
                    <div className="oauth-buttons" style={isSubmitting ? { pointerEvents: 'none', opacity: 0.6 } : undefined}>
                        <div ref={googleBtnRef} aria-label="Sign up with Google"></div>
                    </div>
                    
                    <div className="auth-footer">
                        <p className="auth-link-text">
                            Already have an account?{' '}
                            <a href="/login" className="auth-link">
                                Sign in here
                            </a>
                        </p>
                    </div>
                </div>


            </div>
            
            {/* Bottom ad */}
            <div className="auth-ad">
                <ResponsiveAd />
            </div>
        </main>
    )
}


