import { useState } from 'react'
import { useAuth } from '../auth/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'
import { ResponsiveAd } from '../components/GoogleAds.jsx'

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const [error, setError] = useState('')
    const { register } = useAuth()
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
        
        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match')
        }

        try {
            await register(formData.email, formData.password, formData.name)
            navigate('/', { replace: true })
        } catch (err) {
            setError(err?.data?.message || err.message || 'Registration failed')
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
                <h2 style={{ margin: 0, textAlign: 'center' }}>Create Account</h2>
                <p className="muted" style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                    Join our local marketplace community
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
                        <label htmlFor="name" className="muted" style={{ display: 'block', marginBottom: '0.5rem' }}>
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="input"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            autoComplete="name"
                            autoFill="off"
                            data-form-type="other"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="muted" style={{ display: 'block', marginBottom: '0.5rem' }}>
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="input"
                            value={formData.email}
                            onChange={handleChange}
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
                            name="password"
                            className="input"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            autoComplete="new-password"
                            autoFill="off"
                            data-form-type="other"
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="muted" style={{ display: 'block', marginBottom: '0.5rem' }}>
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            className="input"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            autoComplete="new-password"
                            autoFill="off"
                            data-form-type="other"
                        />
                    </div>
                    
                    <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                        Create Account
                    </button>
                </form>
                
                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                    <p className="muted" style={{ margin: 0 }}>
                        Already have an account?{' '}
                        <a href="/login" style={{ color: 'var(--primary)', textDecoration: 'none' }}>
                            Sign in here
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


