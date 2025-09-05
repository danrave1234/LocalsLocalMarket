import React from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead.jsx';
import { Home, Search, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <>
      <SEOHead 
        title="Page Not Found - LocalsLocalMarket"
        description="The page you're looking for doesn't exist. Return to LocalsLocalMarket to discover local businesses and shops in your community."
        keywords="page not found, 404 error, broken link, local businesses, marketplace"
        url="https://localslocalmarket.com/404"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Page Not Found - LocalsLocalMarket",
          "description": "404 error page for LocalsLocalMarket",
          "url": "https://localslocalmarket.com/404",
          "isPartOf": {
            "@type": "WebSite",
            "name": "LocalsLocalMarket",
            "url": "https://localslocalmarket.com"
          }
        }}
      />
      <main className="not-found-container">
        <div className="not-found-content">
          {/* 404 Visual */}
          <div className="not-found-visual">
            <div className="error-code">404</div>
            <div className="error-illustration">
              <svg viewBox="0 0 200 200" width="200" height="200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="100" cy="100" r="80" stroke="var(--border)" strokeWidth="2" fill="var(--surface)"/>
                <circle cx="70" cy="80" r="8" fill="var(--muted)"/>
                <circle cx="130" cy="80" r="8" fill="var(--muted)"/>
                <path d="M70 120 Q100 140 130 120" stroke="var(--muted)" strokeWidth="3" strokeLinecap="round" fill="none"/>
                <path d="M60 60 L40 40 M140 60 L160 40 M60 140 L40 160 M140 140 L160 160" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          </div>

          {/* Error Message */}
          <div className="not-found-message">
            <h1 className="error-title">Oops! Page Not Found</h1>
            <p className="error-description">
              The page you're looking for seems to have wandered off. Don't worry, 
              there are plenty of amazing local businesses waiting to be discovered!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="not-found-actions">
            <Link to="/" className="btn btn-primary">
              <Home size={20} />
              Go Home
            </Link>
            <Link to="/" className="btn btn-secondary">
              <Search size={20} />
              Browse Shops
            </Link>
            <button 
              onClick={() => window.history.back()} 
              className="btn btn-outline"
            >
              <ArrowLeft size={20} />
              Go Back
            </button>
          </div>

          {/* Helpful Links */}
          <div className="not-found-help">
            <h3>Looking for something specific?</h3>
            <div className="help-links">
              <Link to="/about" className="help-link">About Us</Link>
              <Link to="/contact" className="help-link">Contact Support</Link>
              <Link to="/support" className="help-link">Help Center</Link>
              <Link to="/privacy" className="help-link">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        .not-found-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: var(--bg);
        }

        .not-found-content {
          text-align: center;
          max-width: 600px;
          width: 100%;
        }

        .not-found-visual {
          margin-bottom: 2rem;
        }

        .error-code {
          font-size: 6rem;
          font-weight: 800;
          color: var(--accent);
          line-height: 1;
          margin-bottom: 1rem;
          font-family: var(--font-serif);
        }

        .error-illustration {
          margin: 0 auto;
          opacity: 0.8;
        }

        .not-found-message {
          margin-bottom: 2rem;
        }

        .error-title {
          font-size: 2rem;
          font-weight: 600;
          color: var(--text);
          margin-bottom: 1rem;
          font-family: var(--font-serif);
        }

        .error-description {
          font-size: 1.125rem;
          color: var(--muted);
          line-height: 1.6;
          margin: 0;
        }

        .not-found-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
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

        .btn-primary {
          background: var(--accent);
          color: white;
          border-color: var(--accent);
        }

        .btn-primary:hover {
          background: var(--accent-2);
          border-color: var(--accent-2);
          transform: translateY(-1px);
        }

        .btn-secondary {
          background: var(--card);
          color: var(--text);
          border-color: var(--border);
        }

        .btn-secondary:hover {
          background: var(--card-2);
          border-color: var(--accent);
          transform: translateY(-1px);
        }

        .btn-outline {
          background: transparent;
          color: var(--muted);
          border-color: var(--border);
        }

        .btn-outline:hover {
          background: var(--surface);
          color: var(--text);
          border-color: var(--accent);
          transform: translateY(-1px);
        }

        .not-found-help {
          padding-top: 2rem;
          border-top: 1px solid var(--border);
        }

        .not-found-help h3 {
          font-size: 1.125rem;
          color: var(--text);
          margin-bottom: 1rem;
          font-weight: 500;
        }

        .help-links {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .help-link {
          color: var(--muted);
          text-decoration: none;
          font-size: 0.875rem;
          transition: color 0.2s ease;
        }

        .help-link:hover {
          color: var(--accent);
        }

        @media (max-width: 768px) {
          .not-found-container {
            padding: 1rem;
          }

          .error-code {
            font-size: 4rem;
          }

          .error-title {
            font-size: 1.5rem;
          }

          .error-description {
            font-size: 1rem;
          }

          .not-found-actions {
            flex-direction: column;
            align-items: center;
          }

          .btn {
            width: 100%;
            max-width: 200px;
            justify-content: center;
          }

          .help-links {
            flex-direction: column;
            gap: 0.75rem;
          }
        }
      `}</style>
    </>
  );
};

export default NotFoundPage;
