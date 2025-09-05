import React, { useState } from 'react';
import SEOHead from '../components/SEOHead.jsx';
import '../contact.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Reset status after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000);
    }, 2000);
  };

  return (
    <>
      <SEOHead 
        title="Contact Us - LocalsLocalMarket"
        description="Get in touch with LocalsLocalMarket. Have questions about our platform, need support, or want to partner with us? Contact our team for assistance with local business marketplace solutions."
        keywords="contact us, customer support, local business help, marketplace support, business partnership, contact form, customer service"
        url="https://localslocalmarket.com/contact"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "name": "Contact LocalsLocalMarket",
          "description": "Get in touch with LocalsLocalMarket for support and inquiries",
          "url": "https://localslocalmarket.com/contact",
          "mainEntity": {
            "@type": "Organization",
            "name": "LocalsLocalMarket",
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "customer service",
              "email": "support@localslocalmarket.com",
              "availableLanguage": "English"
            }
          }
        }}
      />
      <main className="contact-container">
      {/* Hero Section */}
      <section className="contact-header">
        <h1 className="contact-title">Get in Touch</h1>
        <p className="contact-subtitle">
          Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>
      </section>

      {/* Contact Content */}
      <section className="contact-content">
        {/* Contact Form */}
        <div className="contact-form-section">
          <h2 className="contact-form-title">Send us a Message</h2>
          
          {submitStatus === 'success' && (
            <div className="success-banner">
              <svg className="success-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <div className="success-content">
                <h3 className="success-title">Message Sent Successfully!</h3>
                <p className="success-message">Thank you for your message! We'll get back to you soon.</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name" className="form-label">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your email address"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject" className="form-label">Subject *</label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Select a subject</option>
                <option value="general">General Inquiry</option>
                <option value="support">Technical Support</option>
                <option value="business">Business Partnership</option>
                <option value="feedback">Feedback</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="message" className="form-label">Message *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="form-textarea"
                placeholder="Tell us how we can help you..."
                rows="6"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="form-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="loading-spinner" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2V6M12 18V22M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M2 12H6M18 12H22M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  <svg className="btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Send Message
                </>
              )}
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="contact-info-section">
          <h2 className="contact-info-title">Contact Information</h2>
          
          <div className="contact-info-list">
            <div className="contact-info-item">
              <svg className="contact-info-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 10C21 17 12 23 12 23S3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2"/>
                <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <div className="contact-info-content">
                <div className="contact-info-label">Address</div>
                <div className="contact-info-value">
                  123 Main Street<br />
                  City, State 12345<br />
                  United States
                </div>
              </div>
            </div>

            <div className="contact-info-item">
              <svg className="contact-info-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 5C3 3.89543 3.89543 3 5 3H8.27924C8.70967 3 9.09181 3.27543 9.22792 3.68377L10.7257 8.17721C10.8831 8.64932 10.6694 9.16531 10.2243 9.38787L7.96701 10.5165C9.06925 12.9612 11.0388 14.9308 13.4835 16.033L14.6121 13.7757C14.8347 13.3306 15.3507 13.1169 15.8228 13.2743L20.3162 14.7721C20.7246 14.9082 21 15.2903 21 15.7208V19C21 20.1046 20.1046 21 19 21H18C9.71573 21 3 14.2843 3 6V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div className="contact-info-content">
                <div className="contact-info-label">Phone</div>
                <div className="contact-info-value">
                  <a href="tel:+1-555-123-4567">+1 (555) 123-4567</a>
                </div>
              </div>
            </div>

            <div className="contact-info-item">
              <svg className="contact-info-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div className="contact-info-content">
                <div className="contact-info-label">Email</div>
                <div className="contact-info-value">
                  <a href="mailto:info@localslocalmarket.com">info@localslocalmarket.com</a>
                </div>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div className="contact-hours">
            <h3 className="hours-title">Business Hours</h3>
            <div className="hours-card">
              <div className="hours-day">Monday - Friday</div>
              <div className="hours-time">9:00 AM - 6:00 PM</div>
            </div>
            <div className="hours-card">
              <div className="hours-day">Saturday</div>
              <div className="hours-time">10:00 AM - 4:00 PM</div>
            </div>
            <div className="hours-card">
              <div className="hours-day">Sunday</div>
              <div className="hours-time">Closed</div>
            </div>
          </div>

          {/* Social Links */}
          <div className="contact-social">
            <a href="#" className="social-link">
              <svg className="social-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <a href="#" className="social-link">
              <svg className="social-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M23 3C22.0424 3.67548 20.9821 4.19211 19.86 4.53C19.2577 3.83751 18.4573 3.34669 17.567 3.12393C16.6767 2.90116 15.7395 2.9572 14.8821 3.28445C14.0247 3.61173 13.2884 4.19445 12.773 4.95376C12.2575 5.71308 11.9877 6.62234 12 7.56V8.56C10.2426 8.61457 8.50127 8.19811 6.93101 7.34945C5.36074 6.50079 4.01032 5.24424 3 3.77C3 3.77 -1 13.77 8 18.77C6.12883 20.1462 3.98145 20.9809 1.7 21.22C4.16591 22.6596 6.95378 23.3494 9.8 23.22C12.6598 23.1015 15.4194 22.3324 17.9 20.98C20.3806 19.6276 22.5188 17.7218 24.15 15.42C25.7812 13.1182 26.8629 10.4878 27.31 7.72C26.2376 8.19859 25.0779 8.45612 23.9 8.48L23 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <a href="#" className="social-link">
              <svg className="social-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 8C17.5913 8 19.1174 7.36786 20.2426 6.24264C21.3679 5.11742 22 3.5913 22 2H18C17.4696 2 16.9609 2.21071 16.5858 2.58579C16.2107 2.96086 16 3.46957 16 4V8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 2H6C6 3.5913 6.63214 5.11742 7.75736 6.24264C8.88258 7.36786 10.4087 8 12 8V4C12 3.46957 11.7893 2.96086 11.4142 2.58579C11.0391 2.21071 10.5304 2 10 2H2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 22H6C6 20.4087 6.63214 18.8826 7.75736 17.7574C8.88258 16.6321 10.4087 16 12 16V20C12 20.5304 11.7893 21.0391 11.4142 21.4142C11.0391 21.7893 10.5304 22 10 22H2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 22H18C18 20.4087 17.3679 18.8826 16.2426 17.7574C15.1174 16.6321 13.5913 16 12 16V20C12 20.5304 12.2107 21.0391 12.5858 21.4142C12.9609 21.7893 13.4696 22 14 22H22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </div>
      </section>
      </main>
    </>
  );
};

export default ContactPage;
