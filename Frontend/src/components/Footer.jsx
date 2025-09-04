import React from 'react';
import { HeartHandshake, Home, Store, Info, Mail, HelpCircle, ShieldCheck, Cookie, FileText } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="modern-footer" role="contentinfo" aria-label="Site footer">
      <div className="footer-background">
        <div className="footer-pattern"></div>
      </div>
      
      <div className="footer-content">
        {/* Main Footer Content */}
        <div className="footer-main">
          {/* Brand Section */}
          <div className="footer-brand-section" aria-label="About LocalsLocalMarket">
                          <div className="footer-brand">
                <div className="brand-logo">
                  <img 
                    src="/LocalsLocalMarketLogoBig.svg" 
                    alt="LocalsLocalMarket Logo"
                    style={{
                      width: '100px',
                      height: 'auto',
                      objectFit: 'contain'
                    }}
                  />
                </div>
              <p className="brand-description">
                Connecting local businesses with their communities through innovative marketplace solutions. 
                Empowering sellers and delighting customers with seamless local commerce experiences.
              </p>
              {/* Removed brand stats per design update */}
            </div>
          </div>

          {/* Links Sections */}
          <div className="footer-links-grid" aria-label="Footer navigation">
            <details className="footer-accordion" open>
              <summary className="footer-section-title">
                <svg className="section-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Quick Links
              </summary>
              <ul className="footer-links-list">
                <li><a href="/" className="footer-link"><Home aria-hidden size={16} style={{marginRight: 8}} />Home</a></li>
                <li><a href="/shops" className="footer-link"><Store aria-hidden size={16} style={{marginRight: 8}} />Browse Shops</a></li>
                <li><a href="/about" className="footer-link"><Info aria-hidden size={16} style={{marginRight: 8}} />About Us</a></li>
                <li><a href="/contact" className="footer-link"><Mail aria-hidden size={16} style={{marginRight: 8}} />Contact</a></li>
                <li><a href="/donate" className="footer-link special"><HeartHandshake aria-hidden size={16} style={{marginRight: 8}} />Support Us</a></li>
              </ul>
            </details>

            <details className="footer-accordion" open>
              <summary className="footer-section-title">
                <svg className="section-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                </svg>
                For Businesses
              </summary>
              <ul className="footer-links-list">
                <li><a href="/register" className="footer-link"><Store aria-hidden size={16} style={{marginRight: 8}} />Register Shop</a></li>
                <li><a href="/dashboard" className="footer-link"><FileText aria-hidden size={16} style={{marginRight: 8}} />Seller Dashboard</a></li>
                <li><a href="/support" className="footer-link"><HelpCircle aria-hidden size={16} style={{marginRight: 8}} />Support</a></li>
                <li><a href="/help" className="footer-link"><HelpCircle aria-hidden size={16} style={{marginRight: 8}} />Help & FAQ</a></li>
              </ul>
            </details>

            <details className="footer-accordion" open>
              <summary className="footer-section-title">
                <svg className="section-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Legal
              </summary>
              <ul className="footer-links-list">
                <li><a href="/privacy" className="footer-link"><ShieldCheck aria-hidden size={16} style={{marginRight: 8}} />Privacy Policy</a></li>
                <li><a href="/terms" className="footer-link"><FileText aria-hidden size={16} style={{marginRight: 8}} />Terms of Service</a></li>
                <li><a href="/cookies" className="footer-link"><Cookie aria-hidden size={16} style={{marginRight: 8}} />Cookie Policy</a></li>
                <li><a href="/gdpr" className="footer-link"><ShieldCheck aria-hidden size={16} style={{marginRight: 8}} />GDPR</a></li>
              </ul>
            </details>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="footer-copyright">
              <p>© {currentYear} LocalsLocalMarket. All rights reserved.</p>
              <p className="footer-tagline">Empowering local commerce, one shop at a time.</p>
            </div>
            <nav className="footer-bottom-links" aria-label="Legal links">
              <a href="/privacy" className="footer-bottom-link">Privacy</a>
              <a href="/terms" className="footer-bottom-link">Terms</a>
              <a href="/cookies" className="footer-bottom-link">Cookies</a>
              <a href="/sitemap" className="footer-bottom-link">Sitemap</a>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
