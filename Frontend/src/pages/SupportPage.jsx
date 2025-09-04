import React, { useState } from 'react';
import '../support.css';

// Inline icon components to match landing page consistency
function StoreIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.width || 20} height={props.height || 20} fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M2 3h20v14H2z" />
      <path d="M2 17h20v4H2z" />
      <path d="M6 7h4" />
      <path d="M6 11h4" />
      <path d="M14 7h4" />
      <path d="M14 11h4" />
    </svg>
  )
}

const SupportPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFaq, setActiveFaq] = useState(null);

  const handleFaqToggle = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqData = [
    {
      question: "How do I create an account?",
      answer: "To create an account, click the 'Sign Up' button in the top right corner of the page. Fill in your details and verify your email address to get started."
    },
    {
      question: "How do I list my business?",
      answer: "After creating an account, go to your dashboard and click 'Add Business'. Fill in your business details, upload photos, and submit for review. We'll approve your listing within 24-48 hours."
    },
    {
      question: "How do I contact customer support?",
      answer: "You can contact our support team through the contact form on our Contact page, email us at support@localslocalmarket.com, or call us at +1 (555) 123-4567 during business hours."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. All payments are processed securely through our trusted payment partners."
    },
    {
      question: "How do I update my business information?",
      answer: "Log into your account, go to your dashboard, and click on 'Manage Business'. You can edit your business details, photos, and contact information at any time."
    },
    {
      question: "Is my personal information secure?",
      answer: "Yes, we take your privacy and security seriously. All personal information is encrypted and stored securely. We never share your data with third parties without your consent."
    }
  ];

  return (
    <main className="support-container">
      {/* Hero Section */}
      <section className="support-header">
        <h1 className="support-title">Support & Help Center</h1>
        <p className="support-subtitle">
          Find answers to common questions and get the help you need to make the most of LocalsLocalMarket.
        </p>
      </section>

      {/* Search Section */}
      <section className="support-search">
        <h2 className="search-title">Search for Help</h2>
        <form className="search-form">
          <input
            type="text"
            className="search-input"
            placeholder="Search for help articles, FAQs, and guides..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Search
          </button>
        </form>
      </section>

      {/* Support Categories */}
      <section className="support-categories">
        <div className="support-category">
          <div className="category-icon">📚</div>
          <h3 className="category-title">Getting Started</h3>
          <p className="category-description">
            New to LocalsLocalMarket? Learn the basics and get up and running quickly.
          </p>
          <div className="category-count">5 articles</div>
        </div>

        <div className="support-category">
          <div className="category-icon"><StoreIcon width={24} height={24} /></div>
          <h3 className="category-title">Business Management</h3>
          <p className="category-description">
            Learn how to manage your business listing, update information, and grow your presence.
          </p>
          <div className="category-count">8 articles</div>
        </div>

        <div className="support-category">
          <div className="category-icon">💰</div>
          <h3 className="category-title">Payments & Billing</h3>
          <p className="category-description">
            Everything you need to know about payments, billing, and subscription management.
          </p>
          <div className="category-count">6 articles</div>
        </div>

        <div className="support-category">
          <div className="category-icon">🔧</div>
          <h3 className="category-title">Technical Support</h3>
          <p className="category-description">
            Technical issues, troubleshooting, and platform-related questions.
          </p>
          <div className="category-count">4 articles</div>
        </div>

        <div className="support-category">
          <div className="category-icon">📱</div>
          <h3 className="category-title">Mobile App</h3>
          <p className="category-description">
            Using our mobile app? Find guides and tips for mobile users.
          </p>
          <div className="category-count">3 articles</div>
        </div>

        <div className="support-category">
          <div className="category-icon">🔒</div>
          <h3 className="category-title">Privacy & Security</h3>
          <p className="category-description">
            Learn about our privacy policies, data protection, and security measures.
          </p>
          <div className="category-count">7 articles</div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <h2 className="faq-title">Frequently Asked Questions</h2>
        <div className="faq-list">
          {faqData.map((faq, index) => (
            <div key={index} className="faq-item">
              <button
                className={`faq-question ${activeFaq === index ? 'active' : ''}`}
                onClick={() => handleFaqToggle(index)}
              >
                <span className="question-text">{faq.question}</span>
                <svg className={`faq-icon ${activeFaq === index ? 'active' : ''}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <div className={`faq-answer ${activeFaq === index ? 'active' : ''}`}>
                <div className="answer-content">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Help Resources */}
      <section className="help-resources">
        <div className="resource-card">
          <div className="resource-icon">📖</div>
          <h3 className="resource-title">User Guide</h3>
          <p className="resource-description">
            Comprehensive guide covering all features and functionality.
          </p>
          <a href="#" className="resource-link">
            Read Guide
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>

        <div className="resource-card">
          <div className="resource-icon">🎥</div>
          <h3 className="resource-title">Video Tutorials</h3>
          <p className="resource-description">
            Step-by-step video tutorials for visual learners.
          </p>
          <a href="#" className="resource-link">
            Watch Videos
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>

        <div className="resource-card">
          <div className="resource-icon">💬</div>
          <h3 className="resource-title">Community Forum</h3>
          <p className="resource-description">
            Connect with other users and share tips and experiences.
          </p>
          <a href="#" className="resource-link">
            Join Forum
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </section>

      {/* Contact Support */}
      <section className="support-contact">
        <h2 className="contact-title">Still Need Help?</h2>
        <p className="contact-description">
          Can't find what you're looking for? Our support team is here to help.
        </p>
                   <a href="/contact" className="contact-button">
             Contact Support
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
             </svg>
           </a>
        </section>
    </main>
  );
};

export default SupportPage;
