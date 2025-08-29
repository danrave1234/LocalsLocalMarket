import React from 'react';

const PrivacyPage = () => {
  return (
    <main className="privacy-container">
      {/* Hero Section */}
      <section className="privacy-hero">
        <div className="hero-background">
          <div className="hero-pattern"></div>
        </div>
        <div className="hero-content">
          <div className="hero-header">
            <div className="hero-logo">
              <svg className="hero-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="hero-title">Privacy Policy</span>
            </div>
            <h1 className="hero-heading">Your Privacy Matters</h1>
            <p className="hero-subtitle">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
            </p>
            <div className="hero-meta">
              <span className="last-updated">
                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="privacy-content">
        <div className="content-wrapper">
          {/* Introduction */}
          <div className="policy-section">
            <div className="section-card">
              <div className="card-header">
                <h2 className="card-title">
                  <svg className="card-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Introduction
                </h2>
              </div>
              <div className="card-content">
                <p className="content-text">
                  LocalsLocalMarket ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy 
                  explains how we collect, use, disclose, and safeguard your information when you visit our website or 
                  use our services.
                </p>
                <p className="content-text">
                  By using our services, you agree to the collection and use of information in accordance with this policy. 
                  If you do not agree with our policies and practices, please do not use our services.
                </p>
              </div>
            </div>
          </div>

          {/* Information We Collect */}
          <div className="policy-section">
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
                  Information We Collect
                </h2>
              </div>
              <div className="card-content">
                <div className="content-section">
                  <h3 className="section-subtitle">Personal Information</h3>
                  <p className="content-text">
                    We may collect personal information that you voluntarily provide to us, including:
                  </p>
                  <ul className="content-list">
                    <li>Name and contact information (email address, phone number)</li>
                    <li>Business information (business name, address, description)</li>
                    <li>Account credentials and profile information</li>
                    <li>Payment information (processed securely through third-party providers)</li>
                    <li>Communications with us (emails, messages, support requests)</li>
                  </ul>
                </div>

                <div className="content-section">
                  <h3 className="section-subtitle">Automatically Collected Information</h3>
                  <p className="content-text">
                    When you visit our website, we automatically collect certain information, including:
                  </p>
                  <ul className="content-list">
                    <li>Device information (IP address, browser type, operating system)</li>
                    <li>Usage data (pages visited, time spent, links clicked)</li>
                    <li>Location information (general location based on IP address)</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>
                </div>

                <div className="content-section">
                  <h3 className="section-subtitle">Third-Party Information</h3>
                  <p className="content-text">
                    We may receive information about you from third-party sources, such as social media platforms 
                    (if you choose to connect your account) or business partners.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* How We Use Information */}
          <div className="policy-section">
            <div className="section-card">
              <div className="card-header">
                <h2 className="card-title">
                  <svg className="card-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  How We Use Your Information
                </h2>
              </div>
              <div className="card-content">
                <p className="content-text">
                  We use the information we collect for various purposes, including:
                </p>
                <ul className="content-list">
                  <li>Providing and maintaining our services</li>
                  <li>Processing transactions and managing accounts</li>
                  <li>Communicating with you about our services</li>
                  <li>Improving our website and user experience</li>
                  <li>Analyzing usage patterns and trends</li>
                  <li>Preventing fraud and ensuring security</li>
                  <li>Complying with legal obligations</li>
                  <li>Sending marketing communications (with your consent)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Information Sharing */}
          <div className="policy-section">
            <div className="section-card">
              <div className="card-header">
                <h2 className="card-title">
                  <svg className="card-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                    <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45768C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Information Sharing and Disclosure
                </h2>
              </div>
              <div className="card-content">
                <p className="content-text">
                  We do not sell, trade, or otherwise transfer your personal information to third parties without 
                  your consent, except in the following circumstances:
                </p>
                <ul className="content-list">
                  <li><strong>Service Providers:</strong> We may share information with trusted third-party service 
                    providers who assist us in operating our website and providing services</li>
                  <li><strong>Legal Requirements:</strong> We may disclose information if required by law or to 
                    protect our rights, property, or safety</li>
                  <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, 
                    your information may be transferred as part of the transaction</li>
                  <li><strong>Public Information:</strong> Business information you choose to make public on your 
                    shop profile will be visible to other users</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Data Security */}
          <div className="policy-section">
            <div className="section-card">
              <div className="card-header">
                <h2 className="card-title">
                  <svg className="card-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Data Security
                </h2>
              </div>
              <div className="card-content">
                <p className="content-text">
                  We implement appropriate technical and organizational security measures to protect your personal 
                  information against unauthorized access, alteration, disclosure, or destruction. These measures include:
                </p>
                <ul className="content-list">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security assessments and updates</li>
                  <li>Access controls and authentication measures</li>
                  <li>Secure hosting and infrastructure</li>
                  <li>Employee training on data protection</li>
                </ul>
                <p className="content-text">
                  However, no method of transmission over the internet or electronic storage is 100% secure. 
                  While we strive to protect your information, we cannot guarantee absolute security.
                </p>
              </div>
            </div>
          </div>

          {/* Cookies and Tracking */}
          <div className="policy-section">
            <div className="section-card">
              <div className="card-header">
                <h2 className="card-title">
                  <svg className="card-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 8V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18 12C19.1 12 20 12.9 20 14C20 15.1 19.1 16 18 16C16.9 16 16 15.1 16 14C16 12.9 16.9 12 18 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18 16V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 12C7.1 12 8 12.9 8 14C8 15.1 7.1 16 6 16C4.9 16 4 15.1 4 14C4 12.9 4.9 12 6 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 16V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Cookies and Tracking Technologies
                </h2>
              </div>
              <div className="card-content">
                <p className="content-text">
                  We use cookies and similar tracking technologies to enhance your experience on our website. 
                  These technologies help us:
                </p>
                <ul className="content-list">
                  <li>Remember your preferences and settings</li>
                  <li>Analyze website traffic and usage patterns</li>
                  <li>Provide personalized content and advertisements</li>
                  <li>Improve website functionality and performance</li>
                </ul>
                <p className="content-text">
                  You can control cookie settings through your browser preferences. However, disabling certain 
                  cookies may affect the functionality of our website.
                </p>
              </div>
            </div>
          </div>

          {/* Your Rights */}
          <div className="policy-section">
            <div className="section-card">
              <div className="card-header">
                <h2 className="card-title">
                  <svg className="card-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H6C4.93913 15 3.92172 15.4214 3.17157 16.1716C2.42143 16.9217 2 17.9391 2 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                    <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Your Rights and Choices
                </h2>
              </div>
              <div className="card-content">
                <p className="content-text">
                  Depending on your location, you may have certain rights regarding your personal information:
                </p>
                <ul className="content-list">
                  <li><strong>Access:</strong> Request access to your personal information</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                  <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
                  <li><strong>Opt-out:</strong> Opt out of marketing communications</li>
                  <li><strong>Objection:</strong> Object to certain processing activities</li>
                </ul>
                <p className="content-text">
                  To exercise these rights, please contact us using the information provided below.
                </p>
              </div>
            </div>
          </div>

          {/* Data Retention */}
          <div className="policy-section">
            <div className="section-card">
              <div className="card-header">
                <h2 className="card-title">
                  <svg className="card-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Data Retention
                </h2>
              </div>
              <div className="card-content">
                <p className="content-text">
                  We retain your personal information for as long as necessary to provide our services, 
                  comply with legal obligations, resolve disputes, and enforce our agreements. When we no 
                  longer need your information, we will securely delete or anonymize it.
                </p>
              </div>
            </div>
          </div>

          {/* Children's Privacy */}
          <div className="policy-section">
            <div className="section-card">
              <div className="card-header">
                <h2 className="card-title">
                  <svg className="card-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Children's Privacy
                </h2>
              </div>
              <div className="card-content">
                <p className="content-text">
                  Our services are not intended for children under the age of 13. We do not knowingly collect 
                  personal information from children under 13. If you believe we have collected information 
                  from a child under 13, please contact us immediately.
                </p>
              </div>
            </div>
          </div>

          {/* International Transfers */}
          <div className="policy-section">
            <div className="section-card">
              <div className="card-header">
                <h2 className="card-title">
                  <svg className="card-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M2 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  International Data Transfers
                </h2>
              </div>
              <div className="card-content">
                <p className="content-text">
                  Your information may be transferred to and processed in countries other than your own. 
                  We ensure that such transfers comply with applicable data protection laws and implement 
                  appropriate safeguards to protect your information.
                </p>
              </div>
            </div>
          </div>

          {/* Changes to Policy */}
          <div className="policy-section">
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
                  Changes to This Privacy Policy
                </h2>
              </div>
              <div className="card-content">
                <p className="content-text">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by:
                </p>
                <ul className="content-list">
                  <li>Posting the new Privacy Policy on this page</li>
                  <li>Updating the "Last updated" date</li>
                  <li>Sending you an email notification (for significant changes)</li>
                </ul>
                <p className="content-text">
                  We encourage you to review this Privacy Policy periodically for any changes.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="policy-section">
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
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="contact-info">
                  <div className="contact-item">
                    <svg className="contact-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span><strong>Email:</strong> privacy@localslocalmarket.com</span>
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
                <p className="content-text">
                  We will respond to your inquiry within 30 days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default PrivacyPage;
