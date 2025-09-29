import React, { useState } from 'react'
import { X, Package, ShoppingCart, Plus, Minus, Check, Star, Clock, Tag } from 'lucide-react'
import OptimizedImage from './OptimizedImage.jsx'
import { getImageUrl } from '../utils/imageUtils.jsx'
import { sanitizeText } from '../utils/sanitize.js'
import './ProductDetailsModal.css'

const ProductDetailsModal = ({ 
  product, 
  isOpen, 
  onClose, 
  onAddToCart, 
  onOrderNow,
  isOwner = false 
}) => {
  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [quantity, setQuantity] = useState(1)

  if (!product || !isOpen) return null

  // Parse product data for sizes and variants
  const parseProductVariants = () => {
    try {
      // Check if product has sizes or variants stored in JSON format
      if (product.sizesJson) {
        return JSON.parse(product.sizesJson)
      }
      if (product.variantsJson) {
        return JSON.parse(product.variantsJson)
      }
      // Check for sizes in description or other fields
      if (product.sizes) {
        return Array.isArray(product.sizes) ? product.sizes : [product.sizes]
      }
      return []
    } catch (e) {
      console.warn('Failed to parse product variants:', e)
      return []
    }
  }

  const parseProductImages = () => {
    try {
      if (product.imagePathsJson) {
        return JSON.parse(product.imagePathsJson)
      }
      return []
    } catch (e) {
      return []
    }
  }

  const variants = parseProductVariants()
  const images = parseProductImages()
  const hasVariants = variants.length > 0
  const hasMultipleImages = images.length > 1

  // Get current price based on selected variant
  const getCurrentPrice = () => {
    if (selectedVariant && selectedVariant.price) {
      return selectedVariant.price
    }
    return product.price || 0
  }

  // Get current stock based on selected variant
  const getCurrentStock = () => {
    if (selectedVariant && selectedVariant.stock !== undefined) {
      return selectedVariant.stock
    }
    return product.stockCount || 0
  }

  const isAvailable = getCurrentStock() > 0

  const handleAddToCart = () => {
    if (onAddToCart) {
      const cartItem = {
        ...product,
        selectedSize,
        selectedVariant,
        quantity,
        price: getCurrentPrice()
      }
      onAddToCart(cartItem)
    }
  }

  const handleOrderNow = () => {
    if (onOrderNow) {
      const orderItem = {
        ...product,
        selectedSize,
        selectedVariant,
        quantity,
        price: getCurrentPrice()
      }
      onOrderNow(orderItem)
    }
  }

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= getCurrentStock()) {
      setQuantity(newQuantity)
    }
  }

  return (
    <div className="product-details-modal-overlay" onClick={onClose}>
      <div className="product-details-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{sanitizeText(product.title)}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <X size={24} />
          </button>
        </div>

        <div className="modal-content">
          {/* Product Images */}
          <div className="product-images-section">
            {images.length > 0 ? (
              <div className="product-image-gallery">
                <OptimizedImage
                  src={getImageUrl(images[0])}
                  alt={product.title}
                  className="main-product-image"
                  fallbackSrc="/placeholder-product.jpg"
                  loading="lazy"
                />
                {hasMultipleImages && (
                  <div className="image-thumbnails">
                    {images.slice(1, 4).map((image, index) => (
                      <OptimizedImage
                        key={index}
                        src={getImageUrl(image)}
                        alt={`${product.title} ${index + 2}`}
                        className="thumbnail-image"
                        fallbackSrc="/placeholder-product.jpg"
                        loading="lazy"
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="product-image-placeholder">
                <Package size={48} />
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="product-info-section">
            {/* Price and Stock */}
            <div className="price-stock-section">
              <div className="product-price-large">
                ₱{getCurrentPrice().toFixed(2)}
              </div>
              <div className="stock-info">
                {isAvailable ? (
                  <span className="stock-available">
                    <Check size={16} />
                    {getCurrentStock()} in stock
                  </span>
                ) : (
                  <span className="stock-unavailable">
                    Out of stock
                  </span>
                )}
              </div>
            </div>

            {/* Product Description */}
            {product.description && (
              <div className="product-description">
                <h4>Description</h4>
                <p>{sanitizeText(product.description)}</p>
              </div>
            )}

            {/* Sizes and Variants */}
            {hasVariants && (
              <div className="variants-section">
                <h4>Available Options</h4>
                <div className="variants-grid">
                  {variants.map((variant, index) => (
                    <button
                      key={index}
                      className={`variant-option ${selectedVariant === variant ? 'selected' : ''}`}
                      onClick={() => setSelectedVariant(variant)}
                      disabled={variant.stock === 0}
                    >
                      <div className="variant-name">{variant.name || variant.size || `Option ${index + 1}`}</div>
                      {variant.price && (
                        <div className="variant-price">₱{variant.price.toFixed(2)}</div>
                      )}
                      {variant.stock !== undefined && (
                        <div className="variant-stock">
                          {variant.stock > 0 ? `${variant.stock} left` : 'Out of stock'}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            {isAvailable && (
              <div className="quantity-section">
                <h4>Quantity</h4>
                <div className="quantity-controls">
                  <button
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <input
                    type="number"
                    className="quantity-input"
                    value={quantity}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 1
                      if (value >= 1 && value <= getCurrentStock()) {
                        setQuantity(value)
                      }
                    }}
                    min="1"
                    max={getCurrentStock()}
                  />
                  <button
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= getCurrentStock()}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Product Category */}
            <div className="product-category">
              <Tag size={16} />
              <span>{product.mainCategory || product.category || 'Uncategorized'}</span>
              {product.subcategory && (
                <>
                  <span className="category-separator">•</span>
                  <span>{product.subcategory}</span>
                </>
              )}
            </div>

            {/* Product Rating */}
            {product.averageRating && product.reviewCount > 0 && (
              <div className="product-rating">
                <div className="rating-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={`star ${i < Math.floor(product.averageRating) ? 'filled' : ''}`}
                    />
                  ))}
                </div>
                <span className="rating-text">
                  {product.averageRating.toFixed(1)} ({product.reviewCount} reviews)
                </span>
              </div>
            )}

            {/* Action Buttons */}
            {!isOwner && (
              <div className="action-buttons">
                <button
                  className="btn btn-primary order-now-btn"
                  onClick={handleOrderNow}
                  disabled={!isAvailable}
                >
                  <ShoppingCart size={20} />
                  Order Now
                </button>
                <button
                  className="btn btn-outline add-to-cart-btn"
                  onClick={handleAddToCart}
                  disabled={!isAvailable}
                >
                  <Plus size={20} />
                  Add to Cart
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailsModal

