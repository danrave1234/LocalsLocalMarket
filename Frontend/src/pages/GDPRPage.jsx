import React from 'react';

const GDPRPage = () => {
  return (
    <main className="gdpr-container">
      {/* Hero Section */}
      <section className="gdpr-hero">
        <div className="hero-background">
          <div className="hero-pattern"></div>
        </div>
        <div className="hero-content">
          <div className="hero-header">
            <div className="hero-logo">
              <svg className="hero-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="hero-title">GDPR Compliance</span>
            </div>
            <h1 className="hero-heading">Data Protection Rights</h1>
            <p className="hero-subtitle">
              Your data protection rights under the General Data Protection Regulation (GDPR).
            </p>
            <div className="hero-meta">
              <span className="last-updated">
                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* GDPR Content */}
      <section className="gdpr-content">
        <div className="content-wrapper">
          {/* Introduction */}
          <div className="gdpr-section">
            <div className="section-card">
              <div className="card-header">
                <h2 className="card-title">
                  <svg className="card-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  What is GDPR?
                </h2>
              </div>
              <div className="card-content">
                <p className="content-text">
                  The General Data Protection Regulation (GDPR) is a comprehensive data protection law that 
                  came into effect on May 25, 2018. It applies to all organizations operating within the EU 
                  and those that offer goods or services to individuals in the EU, regardless of where the 
                  organization is based.
                </p>
                <p className="content-text">
                  At LocalsLocalMarket, we are committed to protecting your privacy and ensuring compliance 
                  with GDPR requirements. This page explains your rights and how we handle your personal data.
                </p>
              </div>
            </div>
          </div>

          {/* Your Rights */}
          <div className="gdpr-section">
            <div className="section-card">
              <div className="card-header">
                <h2 className="card-title">
                  <svg className="card-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Your GDPR Rights
                </h2>
              </div>
              <div className="card-content">
                <p className="content-text">
                  Under GDPR, you have the following rights regarding your personal data:
                </p>
            
                <div className="rights-grid">
                  <div className="right-card">
                    <div className="right-header">
                      <svg className="right-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <h3 className="right-title">1. Right to Access</h3>
                    </div>
                    <p className="right-description">
                      You have the right to request access to your personal data and receive information about:
                    </p>
                    <ul className="right-list">
                      <li>What personal data we hold about you</li>
                      <li>How we use your data</li>
                      <li>Who we share your data with</li>
                      <li>How long we keep your data</li>
                    </ul>
                  </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">2. Right to Rectification</h3>
                <p className="text-gray-700">
                  You have the right to request that we correct any inaccurate or incomplete personal 
                  data we hold about you. You can update most of your information directly through 
                  your account settings.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">3. Right to Erasure (Right to be Forgotten)</h3>
                <p className="text-gray-700 mb-2">
                  You have the right to request that we delete your personal data in certain circumstances, 
                  such as when:
                </p>
                <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                  <li>The data is no longer necessary for the purpose it was collected</li>
                  <li>You withdraw your consent and there's no other legal basis for processing</li>
                  <li>You object to the processing and there are no overriding legitimate grounds</li>
                  <li>The data has been unlawfully processed</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">4. Right to Restrict Processing</h3>
                <p className="text-gray-700">
                  You have the right to request that we restrict the processing of your personal data 
                  in certain circumstances, such as when you contest the accuracy of the data or 
                  object to the processing.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">5. Right to Data Portability</h3>
                <p className="text-gray-700">
                  You have the right to receive your personal data in a structured, commonly used, 
                  and machine-readable format, and to transmit that data to another controller.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">6. Right to Object</h3>
                <p className="text-gray-700 mb-2">
                  You have the right to object to the processing of your personal data in certain 
                  circumstances, including:
                </p>
                <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                  <li>Direct marketing communications</li>
                  <li>Processing based on legitimate interests</li>
                  <li>Processing for research or statistical purposes</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">7. Rights Related to Automated Decision Making</h3>
                <p className="text-gray-700">
                  You have the right not to be subject to decisions based solely on automated processing, 
                  including profiling, that produce legal effects concerning you or similarly significantly 
                  affect you.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">8. Right to Withdraw Consent</h3>
                <p className="text-gray-700">
                  Where we rely on your consent to process your personal data, you have the right to 
                  withdraw that consent at any time. Withdrawal of consent does not affect the lawfulness 
                  of processing based on consent before its withdrawal.
                </p>
              </div>
            </div>
          </div>

          {/* How to Exercise Your Rights */}
          <div className="bg-white p-8 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Exercise Your Rights</h2>
            <p className="text-gray-700 mb-4">
              To exercise any of your GDPR rights, you can:
            </p>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact Us Directly</h3>
                <p className="text-gray-700 text-sm">
                  Email us at privacy@localslocalmarket.com with your request. Please include:
                </p>
                <ul className="list-disc list-inside text-gray-600 text-sm space-y-1 mt-2">
                  <li>Your full name and email address</li>
                  <li>The specific right you want to exercise</li>
                  <li>Any relevant details about your request</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Account Settings</h3>
                <p className="text-gray-700 text-sm">
                  You can update most of your personal information directly through your account settings 
                  in your dashboard.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Response Time</h3>
                <p className="text-gray-700 text-sm">
                  We will respond to your request within 30 days. If we need more time, we will notify 
                  you and explain why.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Verification</h3>
                <p className="text-gray-700 text-sm">
                  We may need to verify your identity before processing your request to ensure the 
                  security of your personal data.
                </p>
              </div>
            </div>
          </div>

          {/* Data Processing */}
          <div className="bg-white p-8 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Process Your Data</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Legal Basis for Processing</h3>
                <p className="text-gray-700 mb-3">
                  We process your personal data based on the following legal grounds:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li><strong>Consent:</strong> When you explicitly agree to the processing</li>
                  <li><strong>Contract:</strong> When processing is necessary to fulfill our contract with you</li>
                  <li><strong>Legitimate Interest:</strong> When processing is necessary for our legitimate business interests</li>
                  <li><strong>Legal Obligation:</strong> When processing is required by law</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Data Retention</h3>
                <p className="text-gray-700 mb-3">
                  We retain your personal data only for as long as necessary to:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Provide our services to you</li>
                  <li>Comply with legal obligations</li>
                  <li>Resolve disputes and enforce agreements</li>
                  <li>Protect against fraud and abuse</li>
                </ul>
                <p className="text-gray-700 mt-3">
                  When we no longer need your data, we will securely delete or anonymize it.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Data Transfers</h3>
                <p className="text-gray-700">
                  Your personal data may be transferred to and processed in countries outside the European 
                  Economic Area (EEA). We ensure that such transfers comply with GDPR requirements and 
                  implement appropriate safeguards, such as Standard Contractual Clauses or adequacy 
                  decisions.
                </p>
              </div>
            </div>
          </div>

          {/* Data Protection Officer */}
          <div className="bg-white p-8 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Protection Officer</h2>
            <p className="text-gray-700 mb-4">
              We have appointed a Data Protection Officer (DPO) to oversee our data protection practices 
              and ensure GDPR compliance. You can contact our DPO at:
            </p>
            <div className="space-y-2 text-gray-700">
              <p><strong>Email:</strong> dpo@localslocalmarket.com</p>
              <p><strong>Address:</strong> 123 Main Street, Suite 100, New York, NY 10001</p>
              <p><strong>Phone:</strong> +1 (555) 123-4567</p>
            </div>
          </div>

          {/* Complaints */}
          <div className="bg-white p-8 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Lodging a Complaint</h2>
            <p className="text-gray-700 mb-4">
              If you believe that we have not properly addressed your GDPR rights or have concerns 
              about how we process your personal data, you have the right to lodge a complaint with 
              your local data protection authority.
            </p>
            <p className="text-gray-700">
              We encourage you to contact us first to resolve any issues, but you can also contact 
              your local supervisory authority directly. You can find your local authority at: 
              <a href="https://edpb.europa.eu/about-edpb/board/members_en" className="text-purple-600 hover:text-purple-700 ml-1">
                European Data Protection Board
              </a>
            </p>
          </div>

          {/* Updates */}
          <div className="bg-white p-8 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Updates to This Policy</h2>
            <p className="text-gray-700 mb-4">
              We may update this GDPR information from time to time to reflect changes in our practices 
              or legal requirements. We will notify you of any material changes by:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Posting the updated information on our website</li>
              <li>Sending email notifications to registered users</li>
              <li>Updating the "Last updated" date</li>
            </ul>
            <p className="text-gray-700 mt-4">
              We encourage you to review this information periodically to stay informed about your 
              GDPR rights.
            </p>
          </div>

          {/* Contact Information */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about your GDPR rights or our data protection practices, 
              please contact us:
            </p>
            <div className="space-y-2 text-gray-700">
              <p><strong>Email:</strong> privacy@localslocalmarket.com</p>
              <p><strong>Data Protection Officer:</strong> dpo@localslocalmarket.com</p>
              <p><strong>Address:</strong> 123 Main Street, Suite 100, New York, NY 10001</p>
              <p><strong>Phone:</strong> +1 (555) 123-4567</p>
            </div>
            <p className="text-gray-700 mt-4">
              We will respond to your inquiry within 30 days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GDPRPage;
