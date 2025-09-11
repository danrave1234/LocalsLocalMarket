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
              create or manage a shop/listing, leave a review, or contact us for support. This may include:
            </p>
            <ul className="privacy-list">
              <li>Name, email address, and basic profile info</li>
              <li>Shop details (name, address, hours, categories, descriptions)</li>
              <li>Map/location coordinates you choose for your shop</li>
              <li>Photos and other media you upload</li>
              <li>Ratings, reviews, and other public content you submit</li>
              <li>Communications you send to the developer</li>
            </ul>
            <p>
              We also automatically collect certain information when you use our platform, including:
            </p>
            <ul className="privacy-list">
              <li>Device information, IP address, and browser type</li>
              <li>Usage data such as pages viewed and actions taken</li>
              <li>Cookies and similar technologies for essential functionality and analytics</li>
              <li>Approximate location when you interact with map features</li>
            </ul>
          </div>
        </div>

        <div className="privacy-section">
          <h2 className="section-title">How We Use Your Information</h2>
          <div className="section-content">
            <p>
              We use the information we collect to operate and improve LocalsLocalMarket, including:
            </p>
            <ul className="privacy-list">
              <li>Creating and managing your account</li>
              <li>Publishing shop profiles, listings, and reviews that you choose to make public</li>
              <li>Powering search, discovery, and map features to help users find local shops</li>
              <li>Providing support and responding to requests</li>
              <li>Sending essential account and activity notifications (marketing preferences can be managed separately)</li>
              <li>Monitoring, preventing, and addressing security, abuse, and policy violations</li>
              <li>Understanding usage to improve performance and features</li>
            </ul>
          </div>
        </div>

        <div className="privacy-section">
          <h2 className="section-title">Information Sharing</h2>
          <div className="section-content">
            <p>
              We do not sell your personal information. We share information only as needed to provide our services, such as:
            </p>
            <ul className="privacy-list">
              <li>Public content you post (shop details, listings, reviews) is visible to all users and may appear in search/social previews.</li>
              <li>Service providers for hosting, analytics, email delivery, and map rendering.</li>
              <li>When required by law, to protect rights and safety, or to prevent abuse.</li>
            </ul>
            <div className="privacy-highlight">
              <h3 className="highlight-title">Your Control</h3>
              <p className="highlight-content">
                You can access, update, or request deletion of your account information by contacting us.
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
              We use cookies and similar technologies for essential functionality (like session management) and to understand usage.
              We may also use third-party scripts to render maps and display ads, which can set their own cookies.
            </p>
            <ul className="privacy-list">
              <li>Essential: keep you signed in, remember preferences</li>
              <li>Analytics: measure traffic and feature usage</li>
              <li>Maps/Ads: enable map tiles and advertising components</li>
            </ul>
            <p>
              You can control cookies via your browser settings; disabling some cookies may impact functionality.
            </p>
          </div>
        </div>

        <div className="privacy-section">
          <h2 className="section-title">Third-Party Services</h2>
          <div className="section-content">
            <p>
              Our platform uses third-party services to operate key features. Examples include:
            </p>
            <ul className="privacy-list">
              <li>Map providers (e.g., Google Maps) to display locations</li>
              <li>Analytics and advertising services to understand usage and support the platform</li>
              <li>Hosting/CDN and email delivery providers</li>
            </ul>
            <p>
              These services have their own privacy policies; we encourage you to review them.
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
                Email: danrave.keh@localslocalmarket.com
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="privacy-contact">
        <h2 className="contact-title">Questions About Privacy?</h2>
        <p className="contact-description">
          We're here to help. Contact the developer for any questions or concerns.
        </p>
        <a href="/contact" className="contact-button">
          Contact Developer
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </section>

      {/* Last Updated */}
      <div className="last-updated">
        <p>Last updated: September 2025</p>
      </div>
      </main>
    </>
  );
};

export default PrivacyPage;
