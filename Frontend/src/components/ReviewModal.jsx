import { useState, useEffect } from 'react'
import { X, Star, MessageSquare, AlertCircle, User } from 'lucide-react'
import Modal from './Modal.jsx'
import { useAuth } from '../auth/AuthContext.jsx'
import { getUserReview, addAuthenticatedReview } from '../utils/shopRatings.js'
import './ReviewModal.css'

const ReviewModal = ({ isOpen, onClose, shopId, shopName, onReviewSubmitted }) => {
  const { user } = useAuth()
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Check authentication and existing review (no order requirement)
  useEffect(() => {
    if (isOpen && shopId) {
      if (!user) {
        setError('Please log in or register to leave a review')
        setRating(0)
        setComment('')
        return
      }

      // Check for existing review
      const existingReview = getUserReview(shopId, user.id)
      if (existingReview) {
        setRating(existingReview.rating)
        setComment(existingReview.comment || '')
      } else {
        setRating(0)
        setComment('')
      }
      setError('')
    }
  }, [isOpen, shopId, user])

  const saveReview = (shopId, rating, comment) => {
    if (!user) {
      setError('You must be logged in to leave a review')
      return false
    }

    try {
      // Check if user has given consent for functional cookies
      const consentData = localStorage.getItem('cookie_consent')
      if (!consentData) {
        setError('Please accept cookies to save your review.')
        return false
      }

      const consent = JSON.parse(consentData)
      if (!consent.preferences.functional) {
        setError('Please enable functional cookies to save your review.')
        return false
      }

      // Use the authenticated review system (no order gate)
      const success = addAuthenticatedReview(user.id, shopId, rating, comment, shopName)
      if (!success) {
        setError('Failed to save review. Please try again.')
        return false
      }

      return true
    } catch (error) {
      console.error('Failed to save review:', error)
      setError('Failed to save review. Please try again.')
      return false
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (rating === 0) {
      setError('Please select a rating')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      // Save review to localStorage
      const success = saveReview(shopId, rating, comment)
      
      if (success) {
        // Update the shop's average rating in localStorage
        updateShopRating(shopId, rating)
        
        // Call the callback to update the UI
        if (onReviewSubmitted) {
          onReviewSubmitted(rating, comment)
        }
        
        onClose()
      } else {
        setError('Failed to save review. Please try again.')
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateShopRating = (shopId, newRating) => {
    try {
      const shopRatings = JSON.parse(localStorage.getItem('shop_ratings') || '{}')
      const existing = shopRatings[shopId] || { totalRating: 0, count: 0 }
      
      // If user already reviewed, update existing rating
      const existingReview = getExistingReview(shopId)
      if (existingReview) {
        // Remove old rating and add new one
        existing.totalRating = existing.totalRating - existingReview.rating + newRating
      } else {
        // Add new rating
        existing.totalRating += newRating
        existing.count += 1
      }
      
      shopRatings[shopId] = existing
      localStorage.setItem('shop_ratings', JSON.stringify(shopRatings))
    } catch (error) {
      console.error('Failed to update shop rating:', error)
    }
  }

  const handleStarClick = (starRating) => {
    setRating(starRating)
    setError('')
  }

  const handleStarHover = (starRating) => {
    setHoverRating(starRating)
  }

  const handleStarLeave = () => {
    setHoverRating(0)
  }

  const existingReview = user ? getUserReview(shopId, user.id) : null
  const isEditMode = !!existingReview
  const canReview = !!user

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="medium">
      <div className="review-modal">
        <div className="review-modal-header">
          <h2>
            {isEditMode ? 'Edit Your Review' : 'Rate This Shop'}
          </h2>
          <button 
            className="review-modal-close"
            onClick={onClose}
            aria-label="Close review modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="review-modal-content">
          <div className="shop-info">
            <h3>{shopName}</h3>
            
            {/* Authentication Check */}
            {!user && (
              <div className="review-requirement auth-required">
                <User size={20} />
                <div>
                  <h4>Login or Register</h4>
                  <p>You must be logged in to leave a review for this shop.</p>
                </div>
              </div>
            )}
            
            {/* Edit Notice */}
            {isEditMode && (
              <p className="edit-notice">
                You've already reviewed this shop. You can update your rating below.
              </p>
            )}
            
            {/* Order history no longer required */}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="rating-section">
              <label className="rating-label">
                Your Rating <span className="required">*</span>
              </label>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`star-btn ${star <= (hoverRating || rating) ? 'active' : ''}`}
                    onClick={() => handleStarClick(star)}
                    onMouseEnter={() => handleStarHover(star)}
                    onMouseLeave={handleStarLeave}
                    aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                  >
                    <Star size={32} fill="currentColor" />
                  </button>
                ))}
              </div>
              <div className="rating-text">
                {rating > 0 && (
                  <span className="rating-description">
                    {rating === 1 && 'Poor'}
                    {rating === 2 && 'Fair'}
                    {rating === 3 && 'Good'}
                    {rating === 4 && 'Very Good'}
                    {rating === 5 && 'Excellent'}
                  </span>
                )}
              </div>
            </div>

            <div className="comment-section">
              <label className="comment-label">
                <MessageSquare size={16} style={{ marginRight: '0.5rem' }} />
                Additional Comments (Optional)
              </label>
              <textarea
                className="comment-input"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this shop..."
                rows={4}
                maxLength={500}
              />
              <div className="comment-counter">
                {comment.length}/500 characters
              </div>
            </div>

            {error && (
              <div className="review-error">
                {error}
              </div>
            )}

            <div className="review-actions">
              <button 
                type="button" 
                className="btn btn-outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isSubmitting || rating === 0 || !canReview}
              >
                {isSubmitting ? 'Saving...' : (isEditMode ? 'Update Review' : 'Submit Review')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  )
}

export default ReviewModal
