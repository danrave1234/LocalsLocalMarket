import React from 'react';
import SEOHead from '../components/SEOHead.jsx';
import '../privacy.css';

const PrivacyPage = () => {
  return (
    <>
      <SEOHead 
        title="Privacy Policy - LocalsLocalMarket"
        description="Read LocalsLocalMarket's privacy policy to understand how we collect, use, and protect your personal information. Learn about our data practices and your privacy rights on our local business marketplace platform."
        keywords="privacy policy, data protection, personal information, privacy rights, data collection, user privacy, GDPR compliance, data security"
        url="https://localslocalmarket.com/privacy"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Privacy Policy - LocalsLocalMarket",
          "description": "Privacy policy explaining how LocalsLocalMarket collects and uses personal information",
          "url": "https://localslocalmarket.com/privacy",
          "isPartOf": {
            "@type": "WebSite",
            "name": "LocalsLocalMarket",
            "url": "https://localslocalmarket.com"
          }
        }}
      />
      <main className="privacy-container">
      {/* Hero Section */}
      <section className="privacy-header">
        <h1 className="privacy-title">Privacy Policy</h1>
        <p className="privacy-subtitle">
          Your privacy is important to us. This policy explains how we collect, use, and protect your information.
        </p>
      </section>

      {/* Privacy Content */}
      <section className="privacy-content">
        <div className="privacy-section">
          <h2 className="section-title">Information We Collect</h2>
          <div className="section-content">
            <p>
              We collect information you provide directly to us, such as when you create an account, 
              list a business, or contact us for support. This may include:
            </p>
            <ul className="privacy-list">
              <li>Name, email address, and contact information</li>
              <li>Business details and descriptions</li>
              <li>Photos and media you upload</li>
              <li>Payment and billing information</li>
              <li>Communications with our support team</li>
            </ul>
            <p>
              We also automatically collect certain information when you use our platform, including:
            </p>
            <ul className="privacy-list">
              <li>Device information and IP addresses</li>
              <li>Usage data and analytics</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </div>
        </div>

        <div className="privacy-section">
          <h2 className="section-title">How We Use Your Information</h2>
          <div className="section-content">
            <p>
              We use the information we collect to provide, maintain, and improve our services, including:
            </p>
            <ul className="privacy-list">
              <li>Processing your account registration and business listings</li>
              <li>Facilitating communication between users</li>
              <li>Providing customer support and responding to inquiries</li>
              <li>Analyzing usage patterns to improve our platform</li>
              <li>Sending important updates and notifications</li>
              <li>Preventing fraud and ensuring platform security</li>
            </ul>
          </div>
        </div>

        <div className="privacy-section">
          <h2 className="section-title">Information Sharing</h2>
          <div className="section-content">
            <p>
              We do not sell, trade, or otherwise transfer your personal information to third parties 
              without your consent, except in the following circumstances:
            </p>
            <ul className="privacy-list">
              <li>With your explicit permission</li>
              <li>To comply with legal obligations</li>
              <li>To protect our rights and safety</li>
              <li>With trusted service providers who assist in operating our platform</li>
            </ul>
            <div className="privacy-highlight">
              <h3 className="highlight-title">Your Control</h3>
              <p className="highlight-content">
                You have the right to access, update, or delete your personal information at any time 
                through your account settings or by contacting us directly.
              </p>
            </div>
          </div>
        </div>

        <div className="privacy-section">
          <h2 className="section-title">Data Security</h2>
          <div className="section-content">
            <p>
              We implement appropriate security measures to protect your personal information against 
              unauthorized access, alteration, disclosure, or destruction. These measures include:
            </p>
            <ul className="privacy-list">
              <li>Encryption of sensitive data in transit and at rest</li>
              <li>Regular security assessments and updates</li>
              <li>Access controls and authentication requirements</li>
              <li>Employee training on data protection practices</li>
            </ul>
          </div>
        </div>

        <div className="privacy-section">
          <h2 className="section-title">Cookies and Tracking</h2>
          <div className="section-content">
            <p>
              We use cookies and similar technologies to enhance your experience on our platform. 
              These technologies help us:
            </p>
            <ul className="privacy-list">
              <li>Remember your preferences and settings</li>
              <li>Analyze how our platform is used</li>
              <li>Provide personalized content and recommendations</li>
              <li>Improve our services and user experience</li>
            </ul>
            <p>
              You can control cookie settings through your browser preferences, though disabling 
              certain cookies may affect platform functionality.
            </p>
          </div>
        </div>

        <div className="privacy-section">
          <h2 className="section-title">Third-Party Services</h2>
          <div className="section-content">
            <p>
              Our platform may integrate with third-party services, such as payment processors, 
              analytics providers, and social media platforms. These services have their own 
              privacy policies, and we encourage you to review them.
            </p>
            <p>
              We are not responsible for the privacy practices of these third-party services.
            </p>
          </div>
        </div>

        <div className="privacy-section">
          <h2 className="section-title">Children's Privacy</h2>
          <div className="section-content">
            <p>
              Our platform is not intended for children under the age of 13. We do not knowingly 
              collect personal information from children under 13. If you believe we have collected 
              information from a child under 13, please contact us immediately.
            </p>
          </div>
        </div>

        <div className="privacy-section">
          <h2 className="section-title">Changes to This Policy</h2>
          <div className="section-content">
            <p>
              We may update this privacy policy from time to time to reflect changes in our 
              practices or applicable laws. We will notify you of any material changes by:
            </p>
            <ul className="privacy-list">
              <li>Posting the updated policy on our platform</li>
              <li>Sending an email notification to registered users</li>
              <li>Displaying a prominent notice on our website</li>
            </ul>
            <p>
              Your continued use of our platform after such changes constitutes acceptance of 
              the updated privacy policy.
            </p>
          </div>
        </div>

        <div className="privacy-section">
          <h2 className="section-title">Contact Us</h2>
          <div className="section-content">
            <p>
              If you have any questions about this privacy policy or our data practices, 
              please contact us:
            </p>
            <div className="privacy-highlight">
              <h3 className="highlight-title">Contact Information</h3>
              <p className="highlight-content">
                Email: privacy@localslocalmarket.com<br />
                Phone: +1 (555) 123-4567<br />
                Address: 123 Main Street, City, State 12345
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="privacy-contact">
        <h2 className="contact-title">Questions About Privacy?</h2>
        <p className="contact-description">
          We're here to help. Contact our privacy team for any questions or concerns.
        </p>
        <a href="/contact" className="contact-button">
          Contact Privacy Team
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </section>

      {/* Last Updated */}
      <div className="last-updated">
        <p>Last updated: December 2024</p>
      </div>
      </main>
    </>
  );
};

export default PrivacyPage;
