import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../auth/AuthContext.jsx'
import { 
  submitShopRating, 
  submitUnauthenticatedShopRating,
  hasUserReviewedShop,
  getUserShopReview,
  getAllShopReviews
} from '../api/reviews.js'
import { Star, MessageCircle, User, Clock } from 'lucide-react'
import './ShopReviews.css'

export default function ShopReviews({ shopId, shopName, averageRating = 0, reviewCount = 0 }) {
  const { user, token } = useAuth()
  const [ratingSummary, setRatingSummary] = useState({ count: reviewCount, average: averageRating })
  const [userRating, setUserRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewText, setReviewText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(false) // Start with false since we have ratings data
  const [error, setError] = useState('')
  
  // Prevent duplicate API calls
  const reviewsLoadingRef = useRef(false)

  useEffect(() => {
    // Only load reviews, ratings are already provided
    loadReviewsData()
  }, [shopId])

  const loadReviewsData = async () => {
    // Prevent duplicate API calls
    if (reviewsLoadingRef.current) {
      console.log(`ShopReviews: Already loading reviews for shop ${shopId}, skipping...`)
      return
    }
    reviewsLoadingRef.current = true
    
    try {
      setLoading(true)
      
      // Load reviews from backend (ratings are already provided via props)
      const localReviews = await getAllShopReviews(shopId)
      setReviews(localReviews)
      
      // Check if user has already reviewed
      if (user) {
        // For authenticated users, we could fetch their rating from backend
        // For now, we'll check local storage
        const userReview = getUserShopReview(shopId)
        if (userReview) {
          setUserRating(userReview.stars)
        }
      } else {
        // For unauthenticated users, check local storage
        const userReview = getUserShopReview(shopId)
        if (userReview) {
          setUserRating(userReview.stars)
        }
      }
    } catch (error) {
      console.error('ShopReviews: Error loading reviews data:', error)
      setError('Failed to load reviews data')
    } finally {
      setLoading(false)
      reviewsLoadingRef.current = false
    }
  }

  const handleRatingSubmit = async (e) => {
    e.preventDefault()
    if (userRating === 0) {
      setError('Please select a rating')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      if (user && token) {
        // Authenticated user - submit to backend
        await submitShopRating(shopId, userRating, token)
      } else {
        // Unauthenticated user - store locally
        await submitUnauthenticatedShopRating(shopId, userRating, {
          reviewText,
          reviewerName: 'Anonymous Customer'
        })
      }

      // Reload data
      await loadRatingData()
      setShowReviewForm(false)
      setReviewText('')
      setUserRating(0)
    } catch (error) {
      setError(error.message || 'Failed to submit rating')
    } finally {
      setSubmitting(false)
    }
  }

  const handleStarClick = (rating) => {
    setUserRating(rating)
  }

  const handleStarHover = (rating) => {
    setHoverRating(rating)
  }

  const handleStarLeave = () => {
    setHoverRating(0)
  }

  const canReview = !hasUserReviewedShop(shopId)

  if (loading) {
    return (
      <div className="shop-reviews">
        <div className="reviews-header">
          <h3>Customer Reviews</h3>
          <div className="rating-summary">
            <div className="stars">
                             {[1, 2, 3, 4, 5].map((star) => (
                 <Star key={star} size={14} className="star" />
               ))}
            </div>
            <span className="rating-text">Loading...</span>
          </div>
        </div>
        <div className="reviews-content">
          <p>Loading reviews...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="shop-reviews">
      <div className="reviews-header">
        <h3>Customer Reviews</h3>
        <div className="rating-summary">
          <div className="stars">
                         {[1, 2, 3, 4, 5].map((star) => (
               <Star 
                 key={star} 
                 size={14} 
                 className={`star ${star <= Math.round(ratingSummary.average) ? 'filled' : ''}`}
               />
             ))}
          </div>
                     <span className="rating-text">
             {ratingSummary.average > 0 ? `${ratingSummary.average.toFixed(1)}` : '--'} 
             {ratingSummary.count > 0 ? ` (${ratingSummary.count} reviews)` : ' (No reviews yet)'}
           </span>
        </div>
      </div>

      <div className="reviews-content">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Review Form */}
        {canReview && (
          <div className="review-form-section">
            <button 
              className="write-review-btn"
              onClick={() => setShowReviewForm(!showReviewForm)}
            >
              <MessageCircle size={16} />
              Write a Review
            </button>

            {showReviewForm && (
              <form onSubmit={handleRatingSubmit} className="review-form">
                <div className="rating-input">
                  <label>Your Rating:</label>
                  <div className="star-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`star-btn ${star <= (hoverRating || userRating) ? 'filled' : ''}`}
                        onClick={() => handleStarClick(star)}
                        onMouseEnter={() => handleStarHover(star)}
                        onMouseLeave={handleStarLeave}
                      >
                        <Star size={24} />
                      </button>
                    ))}
                  </div>
                  <span className="rating-label">
                    {userRating > 0 ? `${userRating} star${userRating > 1 ? 's' : ''}` : 'Select rating'}
                  </span>
                </div>

                <div className="review-text-input">
                  <label htmlFor="reviewText">Your Review (Optional):</label>
                  <textarea
                    id="reviewText"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Share your experience with this shop..."
                    rows={3}
                  />
                </div>

                <div className="form-actions">
                  <button 
                    type="button" 
                    className="btn-secondary"
                    onClick={() => {
                      setShowReviewForm(false)
                      setReviewText('')
                      setUserRating(0)
                      setError('')
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn-primary"
                    disabled={submitting || userRating === 0}
                  >
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Reviews List */}
        <div className="reviews-list">
          {reviews.length === 0 ? (
            <div className="no-reviews">
              <MessageCircle size={48} className="no-reviews-icon" />
              <p>No reviews yet. Be the first to share your experience!</p>
            </div>
          ) : (
                         reviews.map((review, index) => (
               <div key={index} className="review-item">
                 <div className="review-header">
                   <div className="reviewer-info">
                     <User size={16} />
                     <span className="reviewer-name">
                       {review.reviewerName || 'Anonymous Customer'}
                     </span>
                   </div>
                   <div className="review-rating">
                     {[1, 2, 3, 4, 5].map((star) => (
                       <Star 
                         key={star} 
                         size={14} 
                         className={`star ${star <= review.stars ? 'filled' : ''}`}
                       />
                     ))}
                   </div>
                 </div>
                 
                 {review.reviewText && (
                   <div className="review-text">
                     {review.reviewText}
                   </div>
                 )}
                 
                 <div className="review-meta">
                   <Clock size={12} />
                   <span>
                     {new Date(review.createdAt || review.timestamp).toLocaleDateString()}
                   </span>
                 </div>
               </div>
             ))
          )}
        </div>

        {/* Already Reviewed Message */}
        {!canReview && (
          <div className="already-reviewed">
            <MessageCircle size={16} />
            <span>You have already reviewed this shop</span>
          </div>
        )}
      </div>
    </div>
  )
}
