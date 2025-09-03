import React from 'react';
import { useNavigate } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to console or send to error reporting service
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

function ErrorFallback({ error }) {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '2rem',
      fontFamily: 'var(--font-family, Inter, system-ui, sans-serif)'
    }}>
      <div style={{
        maxWidth: '500px',
        margin: '0 auto',
        width: '100%'
      }}>
        <div style={{
          backgroundColor: 'var(--card)',
          padding: '2.5rem 2rem',
          borderRadius: '20px',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--border)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Background accent */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, var(--error) 0%, var(--warning) 50%, var(--error) 100%)'
          }} />
          
          <div style={{ textAlign: 'center' }}>
            <div style={{
              margin: '0 auto 2rem auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '2px solid rgba(239, 68, 68, 0.2)'
            }}>
              <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--error)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            
            <h2 style={{
              margin: '0 0 1rem 0',
              fontSize: '2rem',
              fontWeight: '700',
              color: 'var(--text)',
              letterSpacing: '-0.025em'
            }}>
              Something went wrong
            </h2>
            
            <p style={{
              margin: '0 0 2rem 0',
              fontSize: '1.1rem',
              color: 'var(--muted)',
              lineHeight: '1.6'
            }}>
              We're sorry, but something unexpected happened. Please try again.
            </p>
            
            {process.env.NODE_ENV === 'development' && error && (
              <details style={{
                margin: '2rem 0',
                textAlign: 'left',
                backgroundColor: 'var(--card-2)',
                borderRadius: '12px',
                padding: '1rem',
                border: '1px solid var(--border)'
              }}>
                <summary style={{
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  color: 'var(--muted)',
                  fontWeight: '500',
                  padding: '0.5rem 0'
                }}>
                  Error Details (Development)
                </summary>
                <pre style={{
                  margin: '1rem 0 0 0',
                  fontSize: '0.8rem',
                  color: 'var(--error)',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  padding: '1rem',
                  borderRadius: '8px',
                  overflow: 'auto',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  lineHeight: '1.4'
                }}>
                  {error.toString()}
                </pre>
              </details>
            )}
          </div>

          <div style={{
            marginTop: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <button
              onClick={handleReload}
              style={{
                width: '100%',
                padding: '1rem',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '600',
                color: 'white',
                backgroundColor: 'var(--accent)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: 'var(--shadow-sm)'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--accent-2)'
                e.target.style.transform = 'translateY(-1px)'
                e.target.style.boxShadow = 'var(--shadow-md)'
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'var(--accent)'
                e.target.style.transform = 'translateY(0)'
                e.target.style.boxShadow = 'var(--shadow-sm)'
              }}
            >
              Reload Page
            </button>
            
            <button
              onClick={handleGoBack}
              style={{
                width: '100%',
                padding: '1rem',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '500',
                color: 'var(--text)',
                backgroundColor: 'var(--card-2)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--border)'
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'var(--card-2)'
              }}
            >
              Go Back
            </button>
            
            <button
              onClick={handleGoHome}
              style={{
                width: '100%',
                padding: '1rem',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '500',
                color: 'var(--text)',
                backgroundColor: 'var(--card-2)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--border)'
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'var(--card-2)'
              }}
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ErrorBoundary;
