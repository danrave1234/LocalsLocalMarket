import { useState } from 'react'
import { useAuth } from '../auth/AuthContext.jsx'
import { useLocation, useNavigate } from 'react-router-dom'
// import { ResponsiveAd } from '../components/GoogleAds.jsx'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
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

    return (
        <main className="auth-container">
            <div className="auth-content">
                {/* Auth Header */}
                <div className="auth-header">
                    <div className="auth-logo">
                        <svg className="logo-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2"/>
                            <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        <span className="logo-text">LocalsLocalMarket</span>
                    </div>
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
                                autoFill="off"
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
                            <input
                                type="password"
                                id="password"
                                className="auth-input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                                autoFill="off"
                                data-form-type="other"
                                placeholder="Enter your password"
                            />
                        </div>
                        
                        <button type="submit" className="auth-submit-btn">
                            <svg className="btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                <path d="M10 17L15 12L10 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M15 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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

                {/* Features Section */}
                <div className="auth-features">
                    <div className="feature-item">
                        <div className="feature-icon">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <div className="feature-content">
                            <h3>Secure Access</h3>
                            <p>Your account is protected with industry-standard encryption</p>
                        </div>
                    </div>
                    
                    <div className="feature-item">
                        <div className="feature-icon">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2"/>
                                <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                        </div>
                        <div className="feature-content">
                            <h3>Manage Your Shops</h3>
                            <p>Access your dashboard to manage all your business locations</p>
                        </div>
                    </div>
                    
                    <div className="feature-item">
                        <div className="feature-icon">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <div className="feature-content">
                            <h3>24/7 Support</h3>
                            <p>Get help whenever you need it with our dedicated support team</p>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Bottom ad - DISABLED */}
            {/* <div className="auth-ad">
                <ResponsiveAd />
            </div> */}
        </main>
    )
}


