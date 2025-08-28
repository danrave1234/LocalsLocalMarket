import { useState } from 'react'
import { useAuth } from '../auth/AuthContext.jsx'
import { useLocation, useNavigate } from 'react-router-dom'
import { ResponsiveAd } from '../components/GoogleAds.jsx'

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
        <main className="container" style={{ 
            display: 'grid', 
            placeItems: 'center', 
            minHeight: 'calc(100vh - 140px)',
            paddingTop: '2rem',
            paddingBottom: '2rem'
        }}>
            <section className="card" style={{ width: '100%', maxWidth: 400, padding: '1.25rem' }}>
                <h2 style={{ margin: 0, textAlign: 'center' }}>Welcome Back</h2>
                <p className="muted" style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                    Sign in to your account to continue
                </p>
                
                {error && (
                    <div style={{ 
                        backgroundColor: 'var(--error-bg)', 
                        color: 'var(--error)', 
                        padding: '0.75rem', 
                        borderRadius: '8px', 
                        marginTop: '1rem',
                        fontSize: '0.9rem'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={onSubmit} style={{ marginTop: '1.5rem', display: 'grid', gap: '1rem' }}>
                    <div>
                        <label htmlFor="email" className="muted" style={{ display: 'block', marginBottom: '0.5rem' }}>
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                            autoFill="off"
                            data-form-type="other"
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="password" className="muted" style={{ display: 'block', marginBottom: '0.5rem' }}>
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                            autoFill="off"
                            data-form-type="other"
                        />
                    </div>
                    
                    <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                        Sign In
                    </button>
                </form>
                
                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                    <p className="muted" style={{ margin: 0 }}>
                        Don't have an account?{' '}
                        <a href="/register" style={{ color: 'var(--primary)', textDecoration: 'none' }}>
                            Sign up here
                        </a>
                    </p>
                </div>
            </section>
            
            {/* Bottom ad */}
            <div style={{ marginTop: '2rem', padding: '1rem 0', borderTop: '1px solid var(--border)' }}>
                <ResponsiveAd />
            </div>
        </main>
    )
}


