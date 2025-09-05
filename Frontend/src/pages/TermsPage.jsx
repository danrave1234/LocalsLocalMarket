import React from 'react';
import SEOHead from '../components/SEOHead.jsx';
import '../terms.css';

const TermsPage = () => {
  return (
    <>
      <SEOHead 
        title="Terms of Service - LocalsLocalMarket"
        description="Read LocalsLocalMarket's terms of service to understand the rules and guidelines for using our local business marketplace platform. Learn about user responsibilities, platform policies, and service agreements."
        keywords="terms of service, user agreement, platform rules, marketplace terms, service agreement, user responsibilities, platform policies, legal terms"
        url="https://localslocalmarket.com/terms"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Terms of Service - LocalsLocalMarket",
          "description": "Terms of service for using the LocalsLocalMarket platform",
          "url": "https://localslocalmarket.com/terms",
          "isPartOf": {
            "@type": "WebSite",
            "name": "LocalsLocalMarket",
            "url": "https://localslocalmarket.com"
          }
        }}
      />
      <main className="terms-container">
      {/* Hero Section */}
      <section className="terms-header">
        <h1 className="terms-title">Terms of Service</h1>
        <p className="terms-subtitle">
          Please read these terms carefully before using our platform. By using LocalsLocalMarket, you agree to these terms.
        </p>
      </section>

      {/* Terms Content */}
      <section className="terms-content">
        <div className="terms-section">
          <h2 className="section-title">Acceptance of Terms</h2>
          <div className="section-content">
            <p>
              By accessing and using LocalsLocalMarket, you accept and agree to be bound by the terms and provision of this agreement. 
              If you do not agree to abide by the above, please do not use this service.
            </p>
          </div>
        </div>

        <div className="terms-section">
          <h2 className="section-title">Description of Service</h2>
          <div className="section-content">
            <p>
              LocalsLocalMarket is a platform that connects local businesses with their communities. We provide:
            </p>
            <ul className="terms-list">
              <li>Business listing and profile management</li>
              <li>Customer review and rating systems</li>
              <li>Communication tools between businesses and customers</li>
              <li>Search and discovery features</li>
              <li>Payment processing services</li>
            </ul>
          </div>
        </div>

        <div className="terms-section">
          <h2 className="section-title">User Accounts</h2>
          <div className="section-content">
            <p>
              To use certain features of our platform, you must create an account. You agree to:
            </p>
            <ul className="terms-list">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorized use</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>
            <div className="terms-highlight">
              <h3 className="highlight-title">Account Security</h3>
              <p className="highlight-content">
                You are responsible for maintaining the confidentiality of your account information 
                and for all activities that occur under your account.
              </p>
            </div>
          </div>
        </div>

        <div className="terms-section">
          <h2 className="section-title">Business Listings</h2>
          <div className="section-content">
            <p>
              When creating a business listing, you agree to:
            </p>
            <ul className="terms-list">
              <li>Provide accurate and truthful business information</li>
              <li>Maintain up-to-date contact details and business hours</li>
              <li>Upload only appropriate and legal content</li>
              <li>Comply with all applicable laws and regulations</li>
              <li>Not misrepresent your business or services</li>
            </ul>
          </div>
        </div>

        <div className="terms-section">
          <h2 className="section-title">Prohibited Activities</h2>
          <div className="section-content">
            <p>
              You agree not to use our platform to:
            </p>
            <ul className="terms-list">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Upload malicious content or software</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Use automated systems to access our platform</li>
              <li>Engage in fraudulent or deceptive practices</li>
            </ul>
          </div>
        </div>

        <div className="terms-section">
          <h2 className="section-title">Content and Intellectual Property</h2>
          <div className="section-content">
            <p>
              You retain ownership of content you submit to our platform. By submitting content, you grant us a license to:
            </p>
            <ul className="terms-list">
              <li>Display and distribute your content on our platform</li>
              <li>Use your content for promotional purposes</li>
              <li>Modify content for technical compatibility</li>
            </ul>
            <p>
              Our platform and its original content, features, and functionality are owned by LocalsLocalMarket 
              and are protected by international copyright, trademark, and other intellectual property laws.
            </p>
          </div>
        </div>

        <div className="terms-section">
          <h2 className="section-title">Payment Terms</h2>
          <div className="section-content">
            <p>
              Some features of our platform may require payment. You agree to:
            </p>
            <ul className="terms-list">
              <li>Pay all fees associated with your use of paid features</li>
              <li>Provide accurate billing information</li>
              <li>Authorize us to charge your payment method</li>
              <li>Notify us of any changes to your billing information</li>
            </ul>
            <p>
              All fees are non-refundable unless otherwise stated in our refund policy.
            </p>
          </div>
        </div>

        <div className="terms-section">
          <h2 className="section-title">Privacy and Data Protection</h2>
          <div className="section-content">
            <p>
              Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, 
              which is incorporated into these Terms of Service by reference.
            </p>
            <p>
              By using our platform, you consent to the collection and use of your information as described in our Privacy Policy.
            </p>
          </div>
        </div>

        <div className="terms-section">
          <h2 className="section-title">Limitation of Liability</h2>
          <div className="section-content">
            <p>
              To the maximum extent permitted by law, LocalsLocalMarket shall not be liable for any indirect, incidental, 
              special, consequential, or punitive damages, including but not limited to:
            </p>
            <ul className="terms-list">
              <li>Loss of profits, data, or business opportunities</li>
              <li>Damages resulting from use of our platform</li>
              <li>Damages resulting from third-party services</li>
              <li>Damages resulting from security breaches</li>
            </ul>
            <div className="terms-highlight">
              <h3 className="highlight-title">Disclaimer</h3>
              <p className="highlight-content">
                Our platform is provided "as is" without warranties of any kind, either express or implied.
              </p>
            </div>
          </div>
        </div>

        <div className="terms-section">
          <h2 className="section-title">Termination</h2>
          <div className="section-content">
            <p>
              We may terminate or suspend your account and access to our platform at any time, with or without cause, 
              with or without notice, effective immediately.
            </p>
            <p>
              Upon termination, your right to use the platform will cease immediately. If you wish to terminate your account, 
              you may simply discontinue using the platform or contact us to delete your account.
            </p>
          </div>
        </div>

        <div className="terms-section">
          <h2 className="section-title">Governing Law</h2>
          <div className="section-content">
            <p>
              These Terms of Service shall be governed by and construed in accordance with the laws of the jurisdiction 
              in which LocalsLocalMarket operates, without regard to its conflict of law provisions.
            </p>
            <p>
              Any disputes arising from these terms or your use of our platform shall be resolved in the courts 
              of the applicable jurisdiction.
            </p>
          </div>
        </div>

        <div className="terms-section">
          <h2 className="section-title">Changes to Terms</h2>
          <div className="section-content">
            <p>
              We reserve the right to modify these terms at any time. We will notify users of any material changes by:
            </p>
            <ul className="terms-list">
              <li>Posting the updated terms on our platform</li>
              <li>Sending email notifications to registered users</li>
              <li>Displaying prominent notices on our website</li>
            </ul>
            <p>
              Your continued use of our platform after such changes constitutes acceptance of the updated terms.
            </p>
          </div>
        </div>

        <div className="terms-section">
          <h2 className="section-title">Contact Information</h2>
          <div className="section-content">
            <p>
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="terms-highlight">
              <h3 className="highlight-title">Contact Details</h3>
              <p className="highlight-content">
                Email: legal@localslocalmarket.com<br />
                Phone: +1 (555) 123-4567<br />
                Address: 123 Main Street, City, State 12345
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="terms-contact">
        <h2 className="contact-title">Questions About Terms?</h2>
        <p className="contact-description">
          Our legal team is here to help clarify any questions about our terms of service.
        </p>
        <a href="/contact" className="contact-button">
          Contact Legal Team
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

export default TermsPage;
