import React, { useState } from 'react';
import { api } from '../api/client.js';
import './FeedbackModal.css';

const FeedbackModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', null

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      console.log('Sending feedback with data:', {
        ...formData,
        name: 'Anonymous User',
        email: 'anonymous@localslocalmarket.com'
      });
      
      const result = await api.post('/feedback/send', {
        ...formData,
        name: 'No-Reply User',
        email: 'no-reply@localslocalmarket.com',
        toEmail: 'Danravekeh123@gmail.com',
        fromEmail: 'no-reply@localslocalmarket.com'
      });
      
      console.log('Feedback API response:', result);

      if (result.success) {
        setSubmitStatus('success');
        setFormData({ subject: '', message: '' });
        // Auto-close after 3 seconds
        setTimeout(() => {
          onClose();
          setSubmitStatus(null);
        }, 3000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error sending feedback:', error);
      setSubmitStatus('error');
      
      // Log more details for debugging
      if (error.status) {
        console.error('HTTP Status:', error.status);
      }
      if (error.data) {
        console.error('Error Data:', error.data);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      setSubmitStatus(null);
      setFormData({ subject: '', message: '' });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="feedback-modal-overlay">
      <div className="feedback-modal">
        {/* Header */}
        <div className="feedback-modal-header">
          <h2 className="feedback-modal-title">Send Feedback</h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="feedback-modal-close"
            aria-label="Close feedback modal"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Success/Error Messages */}
        {submitStatus === 'success' && (
          <div className="feedback-status-message feedback-status-success">
            <svg className="feedback-status-icon" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="feedback-status-text">
              Thank you! Your feedback has been received. We'll get back to you soon.
            </p>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="feedback-status-message feedback-status-error">
            <svg className="feedback-status-icon" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="feedback-status-text">
              Failed to submit feedback. Please try again later.
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="feedback-form">
          <div className="feedback-form-group">
            <label htmlFor="subject" className="feedback-form-label">
              Subject (Optional)
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className="feedback-form-input"
              placeholder="Brief description of your feedback"
            />
          </div>

          <div className="feedback-form-group">
            <label htmlFor="message" className="feedback-form-label required">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
              rows={4}
              className="feedback-form-textarea"
              placeholder="Please share your feedback, suggestions, or report any issues..."
            />
          </div>

          {/* Footer */}
          <div className="feedback-form-actions">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="feedback-btn feedback-btn-cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="feedback-btn feedback-btn-submit"
            >
              {isSubmitting ? (
                <span className="feedback-btn-loading">
                  <span className="feedback-spinner"></span>
                  Sending...
                </span>
              ) : (
                'Send Feedback'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;
