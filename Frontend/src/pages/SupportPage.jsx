import React, { useState } from 'react';
import SEOHead from '../components/SEOHead.jsx';
import FeedbackButton from '../components/FeedbackButton.jsx';
import '../support.css';
import { BookOpen, Wrench, Lock, MessageCircle, Mail } from 'lucide-react';

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

const SupportPage = ({ onOpenFeedback }) => {
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
      answer: "After creating an account, go to your dashboard and click 'Create Shop'. Fill in your shop details, upload photos, and your listing will be live immediately."
    },
    {
      question: "How do I contact customer support?",
      answer: "You can contact the developer through the contact form on our Contact page or email danrave.keh@localslocalmarket.com directly."
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
    <>
      <SEOHead 
        title="Support Center - LocalsLocalMarket"
        description="Get help and support for LocalsLocalMarket. Find answers to frequently asked questions, contact our support team, and access resources to help you succeed on our local business marketplace platform."
        keywords="customer support, help center, FAQ, support team, marketplace help, business support, user guide, troubleshooting, contact support"
        url="https://localslocalmarket.com/support"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Support Center - LocalsLocalMarket",
          "description": "Support and help center for LocalsLocalMarket users",
          "url": "https://localslocalmarket.com/support",
          "isPartOf": {
            "@type": "WebSite",
            "name": "LocalsLocalMarket",
            "url": "https://localslocalmarket.com"
          },
          "mainEntity": {
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "How do I create an account?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "To create an account, click the 'Sign Up' button in the top right corner of the page. Fill in your details and verify your email address to get started."
                }
              },
              {
                "@type": "Question",
                "name": "How do I list my business?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "After creating an account, go to your dashboard and click 'Create Shop'. Fill in your shop details, upload photos, and your listing will be live immediately."
                }
              },
              {
                "@type": "Question",
                "name": "How do I contact customer support?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "You can contact the developer through the contact form on our Contact page or email danrave.keh@localslocalmarket.com directly."
                }
              }
            ]
          }
        }}
      />
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
          <div className="category-icon"><BookOpen size={24} /></div>
          <h3 className="category-title">Getting Started</h3>
          <p className="category-description">
            New to LocalsLocalMarket? Learn the basics and get up and running quickly.
          </p>
          <div className="category-count">Basic guides</div>
        </div>

        <div className="support-category">
          <div className="category-icon"><StoreIcon width={24} height={24} /></div>
          <h3 className="category-title">Business Management</h3>
          <p className="category-description">
            Learn how to manage your business listing, update information, and grow your presence.
          </p>
          <div className="category-count">Shop management</div>
        </div>


        <div className="support-category">
          <div className="category-icon"><Wrench size={24} /></div>
          <h3 className="category-title">Technical Support</h3>
          <p className="category-description">
            Technical issues, troubleshooting, and platform-related questions.
          </p>
          <div className="category-count">Technical help</div>
        </div>


        <div className="support-category">
          <div className="category-icon"><Lock size={24} /></div>
          <h3 className="category-title">Privacy & Security</h3>
          <p className="category-description">
            Learn about our privacy policies, data protection, and security measures.
          </p>
          <div className="category-count">Privacy info</div>
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


      {/* Contact Support */}
      <section className="support-contact">
        <h2 className="contact-title">Still Need Help?</h2>
        <p className="contact-description">
          Can't find what you're looking for? Our support team is here to help.
        </p>
        <div className="contact-buttons">
          <a href="mailto:danrave.keh@localslocalmarket.com" className="contact-button">
            <Mail size={16} />
            Email Support
          </a>
          <a href="/contact" className="contact-button">
            Contact Form
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <FeedbackButton variant="outline" size="md" className="contact-button" onClick={onOpenFeedback}>
            <MessageCircle size={16} />
            Send Feedback
          </FeedbackButton>
        </div>
        </section>
      </main>
    </>
  );
};

export default SupportPage;
