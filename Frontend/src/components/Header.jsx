import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'
import Logo from './Logo.jsx'
import SearchOptimization from './SearchOptimization.jsx'

export default function Header() {
  const { token, user, logout, isLoading } = useAuth()

  const handleLogout = () => {
    logout()
  }

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <header className="modern-header">
        <div className="container header-row">
          <div className="header-left">
            <Link to="/" className="brand-link">
              <Logo />
            </Link>
            <span className="loading-pill">
              <div className="loading-spinner"></div>
              Loading...
            </span>
          </div>
          <div className="header-center">
            <div className="header-search">
              <input
                className="input"
                placeholder="Search products or shops"
                disabled
              />
              <button className="btn" disabled>Search</button>
            </div>
          </div>
          <nav className="header-right">
            <span className="muted">Loading...</span>
          </nav>
        </div>
      </header>
    )
  }

  return (
    <header className="modern-header">
      <div className="container header-row">
        <div className="header-left">
          <Link to="/" className="brand-link">
            <Logo size={80} />
          </Link>
        </div>
        
        <div className="header-center">
          <SearchOptimization />
        </div>
        
        <nav className="header-right">
          <Link to="/donate" className="nav-link donate-link">
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 20.02L12 17.77L5.82 20.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 20.02L12 17.77L5.82 20.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Donate</span>
          </Link>
          
          {token ? (
            <>
              <Link to={user?.role === 'ADMIN' ? "/admin" : "/dashboard"} className="nav-link">
                <svg className="nav-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="7" height="7" rx="1.5" fill="currentColor"/>
                  <rect x="14" y="3" width="7" height="7" rx="1.5" fill="currentColor"/>
                  <rect x="14" y="14" width="7" height="7" rx="1.5" fill="currentColor"/>
                  <rect x="3" y="14" width="7" height="7" rx="1.5" fill="currentColor"/>
                </svg>
                <span>Dashboard</span>
              </Link>
              
              <Link to="/profile" className="nav-link">
                <svg className="nav-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="8" r="5" fill="currentColor"/>
                  <path d="M20 21C20 16.5817 16.4183 13 12 13C7.58172 13 4 16.5817 4 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span>Profile</span>
              </Link>
              
              <button onClick={handleLogout} className="logout-btn">
                <svg className="nav-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link login-link">
                <svg className="nav-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 17L15 12L10 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Login</span>
              </Link>
              
              <Link to="/register" className="register-btn">
                <svg className="nav-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="8.5" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                  <path d="M20 8V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M23 11H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Register</span>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}


