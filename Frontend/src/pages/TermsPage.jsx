import React from 'react';

const TermsPage = () => {
  return (
    <main className="terms-container">
      {/* Hero Section */}
      <section className="terms-hero">
        <div className="hero-background">
          <div className="hero-pattern"></div>
        </div>
        <div className="hero-content">
          <div className="hero-header">
            <div className="hero-logo">
              <svg className="hero-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="hero-title">Terms of Service</span>
            </div>
            <h1 className="hero-heading">Service Agreement</h1>
            <p className="hero-subtitle">
              Please read these terms carefully before using our services.
            </p>
            <div className="hero-meta">
              <span className="last-updated">
                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="terms-content">
        <div className="content-wrapper">
          {/* Agreement */}
          <div className="terms-section">
            <div className="section-card">
              <div className="card-header">
                <h2 className="card-title">
                  <svg className="card-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Agreement to Terms
                </h2>
              </div>
              <div className="card-content">
                <p className="content-text">
                  These Terms of Service ("Terms") govern your use of the LocalsLocalMarket website and services 
                  operated by LocalsLocalMarket ("we," "our," or "us").
                </p>
                <p className="content-text">
                  By accessing or using our services, you agree to be bound by these Terms. If you disagree with 
                  any part of these terms, then you may not access our services.
                </p>
              </div>
            </div>
          </div>

          {/* Description of Service */}
          <div className="terms-section">
            <div className="section-card">
              <div className="card-header">
                <h2 className="card-title">
                  <svg className="card-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Description of Service
                </h2>
              </div>
              <div className="card-content">
                <p className="content-text">
                  LocalsLocalMarket is a platform that connects local businesses with their communities. Our 
                  services include:
                </p>
                <ul className="content-list">
                  <li>Business profile creation and management</li>
                  <li>Product and service listings</li>
                  <li>Customer reviews and ratings</li>
                  <li>Communication tools between businesses and customers</li>
                  <li>Analytics and business insights</li>
                  <li>Marketing and promotional features</li>
                </ul>
              </div>
            </div>
          </div>

          {/* User Accounts */}
          <div className="terms-section">
            <div className="section-card">
              <div className="card-header">
                <h2 className="card-title">
                  <svg className="card-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H6C4.93913 15 3.92172 15.4214 3.17157 16.1716C2.42143 16.9217 2 17.9391 2 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  User Accounts
                </h2>
              </div>
              <div className="card-content">
                <p className="content-text">
                  When you create an account with us, you must provide accurate, complete, and current information. 
                  You are responsible for:
                </p>
                <ul className="content-list">
                  <li>Maintaining the confidentiality of your account credentials</li>
                  <li>All activities that occur under your account</li>
                  <li>Notifying us immediately of any unauthorized use</li>
                  <li>Ensuring your account information remains accurate and up-to-date</li>
                </ul>
                <p className="content-text">
                  We reserve the right to terminate accounts that violate these Terms or are inactive for extended periods.
                </p>
              </div>
            </div>
          </div>

          {/* Acceptable Use */}
          <div className="terms-section">
            <div className="section-card">
              <div className="card-header">
                <h2 className="card-title">
                  <svg className="card-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Acceptable Use
                </h2>
              </div>
              <div className="card-content">
                <p className="content-text">
                  You agree to use our services only for lawful purposes and in accordance with these Terms. 
                  You agree not to:
                </p>
                <ul className="content-list">
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe upon the rights of others</li>
                  <li>Upload or transmit harmful, offensive, or inappropriate content</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Interfere with or disrupt our services</li>
                  <li>Use our services for spam or unsolicited communications</li>
                  <li>Impersonate another person or entity</li>
                  <li>Engage in fraudulent or deceptive practices</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Business Listings */}
          <div className="terms-section">
            <div className="section-card">
              <div className="card-header">
                <h2 className="card-title">
                  <svg className="card-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 10C21 17 12 23 12 23S3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Business Listings and Content
                </h2>
              </div>
              <div className="card-content">
                <p className="content-text">
                  When creating business listings, you agree to:
                </p>
                <ul className="content-list">
                  <li>Provide accurate and truthful information about your business</li>
                  <li>Maintain up-to-date business hours, contact information, and descriptions</li>
                  <li>Use only content that you own or have permission to use</li>
                  <li>Not misrepresent your business or services</li>
                  <li>Comply with all applicable laws and regulations</li>
                </ul>
                <p className="content-text">
                  We reserve the right to review, edit, or remove any content that violates these Terms or 
                  is otherwise inappropriate.
                </p>
              </div>
            </div>
          </div>

          {/* Intellectual Property */}
          <div className="terms-section">
            <div className="section-card">
              <div className="card-header">
                <h2 className="card-title">
                  <svg className="card-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Intellectual Property
                </h2>
              </div>
              <div className="card-content">
                <p className="content-text">
                  Our services and their original content, features, and functionality are owned by LocalsLocalMarket 
                  and are protected by international copyright, trademark, patent, trade secret, and other 
                  intellectual property laws.
                </p>
                <p className="content-text">
                  You retain ownership of content you submit to our platform, but you grant us a non-exclusive, 
                  worldwide, royalty-free license to use, display, and distribute your content in connection 
                  with our services.
                </p>
              </div>
            </div>
          </div>

          {/* Privacy */}
          <div className="terms-section">
            <div className="section-card">
              <div className="card-header">
                <h2 className="card-title">
                  <svg className="card-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Privacy
                </h2>
              </div>
              <div className="card-content">
                <p className="content-text">
                  Your privacy is important to us. Please review our Privacy Policy, which also governs your 
                  use of our services, to understand our practices regarding the collection and use of your 
                  personal information.
                </p>
              </div>
            </div>
          </div>

          {/* Payment Terms */}
          <div className="terms-section">
            <div className="section-card">
              <div className="card-header">
                <h2 className="card-title">
                  <svg className="card-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                    <line x1="1" y1="10" x2="23" y2="10" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Payment Terms
                </h2>
              </div>
              <div className="card-content">
                <p className="content-text">
                  Some features of our services may require payment. By subscribing to paid services, you agree to:
                </p>
                <ul className="content-list">
                  <li>Pay all fees in advance</li>
                  <li>Provide accurate billing information</li>
                  <li>Authorize us to charge your payment method</li>
                  <li>Pay any applicable taxes</li>
                </ul>
                <p className="content-text">
                  Subscription fees are non-refundable except as required by law. We may change our pricing 
                  with 30 days' notice.
                </p>
              </div>
            </div>
          </div>

          {/* Termination */}
          <div className="terms-section">
            <div className="section-card">
              <div className="card-header">
                <h2 className="card-title">
                  <svg className="card-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Termination
                </h2>
              </div>
              <div className="card-content">
                <p className="content-text">
                  We may terminate or suspend your account and access to our services immediately, without 
                  prior notice, for any reason, including breach of these Terms.
                </p>
                <p className="content-text">
                  Upon termination, your right to use our services will cease immediately. We may delete 
                  your account and data, though some information may be retained as required by law.
                </p>
              </div>
            </div>
          </div>

          {/* Disclaimers */}
          <div className="terms-section">
            <div className="section-card">
              <div className="card-header">
                <h2 className="card-title">
                  <svg className="card-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.29 3.86L1.82 18A2 2 0 003.64 21H20.36A2 2 0 0022.18 18L13.71 3.86A2 2 0 0010.29 3.86Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Disclaimers
                </h2>
              </div>
              <div className="card-content">
                <p className="content-text">
                  Our services are provided "as is" and "as available" without warranties of any kind. 
                  We disclaim all warranties, express or implied, including:
                </p>
                <ul className="content-list">
                  <li>Warranties of merchantability and fitness for a particular purpose</li>
                  <li>Warranties that our services will be uninterrupted or error-free</li>
                  <li>Warranties regarding the accuracy or reliability of information</li>
                  <li>Warranties that defects will be corrected</li>
                </ul>
                <p className="content-text">
                  We do not guarantee the quality, safety, or legality of any business listings or services 
                  offered by third parties on our platform.
                </p>
              </div>
            </div>
          </div>

          {/* Limitation of Liability */}
          <div className="terms-section">
            <div className="section-card">
              <div className="card-header">
                <h2 className="card-title">
                  <svg className="card-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Limitation of Liability
                </h2>
              </div>
              <div className="card-content">
                <p className="content-text">
                  In no event shall LocalsLocalMarket be liable for any indirect, incidental, special, 
                  consequential, or punitive damages, including loss of profits, data, or use, arising out 
                  of or relating to your use of our services.
                </p>
                <p className="content-text">
                  Our total liability to you for any claims arising from these Terms or your use of our 
                  services shall not exceed the amount you paid us in the 12 months preceding the claim.
                </p>
              </div>
            </div>
          </div>

          {/* Indemnification */}
          <div className="terms-section">
            <div className="section-card">
              <div className="card-header">
                <h2 className="card-title">
                  <svg className="card-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Indemnification
                </h2>
              </div>
              <div className="card-content">
                <p className="content-text">
                  You agree to indemnify and hold harmless LocalsLocalMarket and its officers, directors, 
                  employees, and agents from any claims, damages, losses, or expenses arising out of your 
                  use of our services, violation of these Terms, or violation of any rights of another party.
                </p>
              </div>
            </div>
          </div>

          {/* Governing Law */}
          <div className="terms-section">
            <div className="section-card">
              <div className="card-header">
                <h2 className="card-title">
                  <svg className="card-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 10C21 17 12 23 12 23S3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Governing Law
                </h2>
              </div>
              <div className="card-content">
                <p className="content-text">
                  These Terms shall be governed by and construed in accordance with the laws of the State 
                  of New York, without regard to its conflict of law provisions. Any disputes arising from 
                  these Terms or your use of our services shall be resolved in the courts of New York.
                </p>
              </div>
            </div>
          </div>

          {/* Changes to Terms */}
          <div className="terms-section">
            <div className="section-card">
              <div className="card-header">
                <h2 className="card-title">
                  <svg className="card-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Changes to Terms
                </h2>
              </div>
              <div className="card-content">
                <p className="content-text">
                  We reserve the right to modify these Terms at any time. We will notify users of significant 
                  changes by:
                </p>
                <ul className="content-list">
                  <li>Posting the updated Terms on our website</li>
                  <li>Sending email notifications to registered users</li>
                  <li>Updating the "Last updated" date</li>
                </ul>
                <p className="content-text">
                  Your continued use of our services after changes become effective constitutes acceptance 
                  of the new Terms.
                </p>
              </div>
            </div>
          </div>

          {/* Severability */}
          <div className="terms-section">
            <div className="section-card">
              <div className="card-header">
                <h2 className="card-title">
                  <svg className="card-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Severability
                </h2>
              </div>
              <div className="card-content">
                <p className="content-text">
                  If any provision of these Terms is found to be unenforceable or invalid, that provision 
                  will be limited or eliminated to the minimum extent necessary so that these Terms will 
                  otherwise remain in full force and effect.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="terms-section">
            <div className="section-card">
              <div className="card-header">
                <h2 className="card-title">
                  <svg className="card-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Contact Us
                </h2>
              </div>
              <div className="card-content">
                <p className="content-text">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="contact-info">
                  <div className="contact-item">
                    <svg className="contact-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span><strong>Email:</strong> legal@localslocalmarket.com</span>
                  </div>
                  <div className="contact-item">
                    <svg className="contact-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 10C21 17 12 23 12 23S3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    <span><strong>Address:</strong> 123 Main Street, Suite 100, New York, NY 10001</span>
                  </div>
                  <div className="contact-item">
                    <svg className="contact-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7293C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1469 21.5901 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0973 21.9452 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77382 17.3146 6.72533 15.2661 5.18999 12.85C3.49997 10.2412 2.44824 7.27099 2.11999 4.18C2.09477 3.90347 2.12787 3.62476 2.21649 3.36162C2.30512 3.09849 2.44756 2.85669 2.63476 2.65182C2.82196 2.44695 3.0498 2.28335 3.30379 2.17149C3.55778 2.05963 3.83233 2.00189 4.10999 2H7.10999C7.59522 1.99522 8.06574 2.16708 8.43376 2.48353C8.80178 2.79999 9.042 3.23945 9.10999 3.72C9.23662 4.68007 9.47144 5.62273 9.80999 6.53C9.94454 6.88792 9.97348 7.27675 9.89399 7.653C9.81449 8.02925 9.62984 8.37425 9.35999 8.65L8.08999 9.92C9.51355 12.4135 11.5865 14.4865 14.08 15.91L15.35 14.64C15.6258 14.3702 15.9708 14.1855 16.347 14.106C16.7233 14.0265 17.1121 14.0555 17.47 14.19C18.3773 14.5286 19.3199 14.7635 20.28 14.89C20.7658 14.9585 21.2094 15.2032 21.5265 15.5775C21.8437 15.9518 22.0122 16.4296 22 16.92Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span><strong>Phone:</strong> +1 (555) 123-4567</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default TermsPage;
