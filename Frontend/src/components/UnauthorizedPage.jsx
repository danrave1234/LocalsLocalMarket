import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ShieldAlert, Home, LogIn, ArrowLeft } from 'lucide-react';

const UnauthorizedPage = ({ errorCode = 403, message = null }) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const isUnauthorized = Number(errorCode) === 401;
  const title = isUnauthorized ? 'Unauthorized Access' : 'Access Forbidden';
  const description = message || (isUnauthorized
    ? 'You need to be logged in to access this page.'
    : "You don't have permission to access this resource.");

  return (
    <>
      <main className="not-found-container" style={{ background: 'var(--bg)' }}>
        <div className="not-found-content" style={{ maxWidth: '640px' }}>
          <div className="not-found-visual" style={{ marginBottom: '2rem' }}>
            <div className="error-code" style={{ color: 'var(--accent)' }}>{errorCode}</div>
            <div className="error-illustration" style={{ margin: '0 auto', opacity: 0.9 }}>
              {isUnauthorized ? (
                <Lock size={120} style={{ color: 'var(--muted)' }} />
              ) : (
                <ShieldAlert size={120} style={{ color: 'var(--muted)' }} />
              )}
            </div>
          </div>

          <div className="not-found-message" style={{ marginBottom: '2rem' }}>
            <h1 className="error-title" style={{ color: 'var(--text)' }}>{title}</h1>
            <p className="error-description" style={{ color: 'var(--muted)' }}>{description}</p>
          </div>

          <div className="not-found-actions" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
            <button onClick={isUnauthorized ? handleLogin : handleGoHome} className="btn btn-primary">
              {isUnauthorized ? <LogIn size={20} /> : <Home size={20} />}
              {isUnauthorized ? 'Login' : 'Go Home'}
            </button>
            <button onClick={handleGoBack} className="btn btn-secondary">
              <ArrowLeft size={20} />
              Go Back
            </button>
            <button onClick={handleGoHome} className="btn btn-outline">
              <Home size={20} />
              Homepage
            </button>
          </div>

          <div className="not-found-help" style={{ paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
            <h3 style={{ color: 'var(--text)', marginBottom: '1rem', fontWeight: 500, fontSize: '1.125rem' }}>What you can do</h3>
            <ul style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.6, textAlign: 'left', margin: '0 auto', maxWidth: '520px' }}>
              {isUnauthorized ? (
                <>
                  <li>Log in to your account</li>
                  <li>Create a new account if you don't have one</li>
                  <li>Contact support if you're having trouble logging in</li>
                </>
              ) : (
                <>
                  <li>Contact an administrator for access</li>
                  <li>Check if you're using the correct account</li>
                  <li>Return to the homepage to browse public content</li>
                </>
              )}
              <li>Go back to the previous page</li>
            </ul>
          </div>
        </div>
      </main>
      <style jsx>{`
        .not-found-container {
          min-height: 60vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: var(--bg);
        }

        .not-found-content {
          text-align: center;
          width: 100%;
        }

        .error-code {
          font-size: 6rem;
          font-weight: 800;
          line-height: 1;
          margin-bottom: 1rem;
          font-family: var(--font-serif);
        }

        .error-title {
          font-size: 2rem;
          font-weight: 600;
          margin-bottom: 1rem;
          font-family: var(--font-serif);
        }

        .error-description {
          font-size: 1.125rem;
          line-height: 1.6;
          margin: 0;
        }

        .not-found-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-top: 2rem;
          margin-bottom: 3rem;
          flex-wrap: wrap;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.2s ease;
          border: 1px solid transparent;
          cursor: pointer;
          font-size: 0.875rem;
        }

        .btn-primary { background: var(--accent); color: #fff; border-color: var(--accent); }
        .btn-primary:hover { background: var(--accent-2); border-color: var(--accent-2); transform: translateY(-1px); }
        .btn-secondary { background: var(--card); color: var(--text); border-color: var(--border); }
        .btn-secondary:hover { background: var(--card-2); border-color: var(--accent); transform: translateY(-1px); }
        .btn-outline { background: transparent; color: var(--muted); border-color: var(--border); }
        .btn-outline:hover { background: var(--surface); color: var(--text); border-color: var(--accent); transform: translateY(-1px); }

        .not-found-help { padding-top: 2rem; border-top: 1px solid var(--border); }

        @media (max-width: 768px) {
          .not-found-container { padding: 1rem; }
          .error-code { font-size: 4rem; }
          .error-title { font-size: 1.5rem; }
          .error-description { font-size: 1rem; }
          .not-found-actions { flex-direction: column; align-items: center; }
          .btn { width: 100%; max-width: 220px; justify-content: center; }
        }
      `}</style>
    </>
  );
};

export default UnauthorizedPage;
