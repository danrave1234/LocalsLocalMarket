import React, { useState } from 'react'
import { Package, Wrench, Edit, Trash2, Eye, ShoppingCart, Clock, Tag, MapPin } from 'lucide-react'
import OptimizedImage from './OptimizedImage.jsx'
import { getImageUrl } from '../utils/imageUtils.js'
import './ItemCard.css'

const ItemCard = ({ 
  item, 
  type = 'product', // 'product' or 'service'
  isOwner = false, 
  onEdit, 
  onDelete, 
  onViewDetails,
  onUpdateStock,
  savingStock = false,
  className = ''
}) => {
  const [stockInput, setStockInput] = useState(item.stockCount || 0)
  const [isEditingStock, setIsEditingStock] = useState(false)

  const isProduct = type === 'product'
  const isService = type === 'service'

  // Determine if item is available
  const isAvailable = isProduct ? 
    (item.stockCount > 0) : 
    (item.status === 'AVAILABLE')

  // Get appropriate icon
  const getItemIcon = () => {
    if (isProduct) return <Package size={16} />
    return <Wrench size={16} />
  }

  // Get status display
  const getStatusDisplay = () => {
    if (isProduct) {
      return (
        <span className={`item-status ${isAvailable ? 'available' : 'out-of-stock'}`}>
          {isAvailable ? `${item.stockCount} in stock` : 'Out of stock'}
        </span>
      )
    } else {
      return (
        <span className={`item-status ${isAvailable ? 'available' : 'unavailable'}`}>
          {isAvailable ? 'Available' : 'Not Available'}
        </span>
      )
    }
  }

  // Handle stock update
  const handleStockUpdate = async () => {
    if (onUpdateStock && stockInput !== item.stockCount) {
      try {
        await onUpdateStock(item.id, parseInt(stockInput))
        setIsEditingStock(false)
      } catch (error) {
        console.error('Failed to update stock:', error)
        setStockInput(item.stockCount || 0) // Reset on error
      }
    } else {
      setIsEditingStock(false)
    }
  }

  // Handle stock input change
  const handleStockInputChange = (e) => {
    const value = e.target.value
    if (value === '' || (!isNaN(value) && parseInt(value) >= 0)) {
      setStockInput(value)
    }
  }

  // Handle stock input key press
  const handleStockKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleStockUpdate()
    } else if (e.key === 'Escape') {
      setStockInput(item.stockCount || 0)
      setIsEditingStock(false)
    }
  }

  return (
    <div className={`item-card ${className} ${!isAvailable ? 'unavailable' : ''}`}>
      {/* Item Image */}
      <div className="item-image-container">
        {(() => {
          // Handle both imageUrl (for services) and imagePathsJson (for products)
          let imageUrl = null;
          
          if (item.imageUrl) {
            // Services use imageUrl
            imageUrl = item.imageUrl;
          } else if (item.imagePathsJson) {
            // Products use imagePathsJson - extract first image
            try {
              const imagePaths = JSON.parse(item.imagePathsJson);
              if (Array.isArray(imagePaths) && imagePaths.length > 0) {
                imageUrl = imagePaths[0];
              }
            } catch (e) {
              console.warn('Failed to parse imagePathsJson:', e);
            }
          }
          
          return imageUrl ? (
            <OptimizedImage
              src={getImageUrl(imageUrl)}
              alt={item.title}
              className="item-image"
              fallbackSrc="/images/placeholder-product.png"
              loading="lazy"
            />
          ) : (
            <div className="item-image-placeholder">
              {getItemIcon()}
            </div>
          );
        })()}
        
        {/* Item Type Badge */}
        <div className={`item-type-badge ${type}`}>
          {getItemIcon()}
          <span>{isProduct ? 'Product' : 'Service'}</span>
        </div>
      </div>

      {/* Item Content */}
      <div className="item-content">
        {/* Header */}
        <div className="item-header">
          <h3 className="item-title" title={item.title}>
            {item.title}
          </h3>
          <div className="item-price">
            <span>₱{item.price || '0.00'}</span>
          </div>
        </div>

        {/* Description */}
        {item.description && (
          <p className="item-description" title={item.description}>
            {item.description}
          </p>
        )}

        {/* Meta Information */}
        <div className="item-meta">
          {/* Category */}
          <div className="item-category">
            <Tag size={12} />
            <span>{item.mainCategory || 'Uncategorized'}</span>
            {item.subcategory && (
              <>
                <span className="meta-separator">•</span>
                <span>{item.subcategory}</span>
              </>
            )}
          </div>

          {/* Service Duration (for services) */}
          {isService && item.durationMinutes && (
            <div className="item-duration">
              <Clock size={12} />
              <span>{item.durationMinutes} min</span>
            </div>
          )}

          {/* Shop Location (if provided) */}
          {item.shopName && (
            <div className="item-shop">
              <MapPin size={12} />
              <span>{item.shopName}</span>
            </div>
          )}
        </div>

        {/* Status and Stock */}
        <div className="item-status-section">
          {getStatusDisplay()}
          
          {/* Stock Management (for products and owners) */}
          {isProduct && isOwner && (
            <div className="stock-management">
              {isEditingStock ? (
                <div className="stock-input-group">
                  <input
                    type="number"
                    value={stockInput}
                    onChange={handleStockInputChange}
                    onKeyPress={handleStockKeyPress}
                    onBlur={handleStockUpdate}
                    className="stock-input"
                    min="0"
                    autoFocus
                    disabled={savingStock}
                  />
                  <button
                    onClick={handleStockUpdate}
                    className="stock-save-btn"
                    disabled={savingStock}
                  >
                    {savingStock ? '...' : '✓'}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditingStock(true)}
                  className="stock-edit-btn"
                  title="Click to edit stock"
                >
                  Edit Stock
                </button>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="item-actions">
          {isOwner ? (
            <>
              <button
                onClick={() => onEdit && onEdit(item)}
                className="action-btn edit-btn"
                title="Edit item"
              >
                <Edit size={14} />
                <span>Edit</span>
              </button>
              <button
                onClick={() => onDelete && onDelete(item.id)}
                className="action-btn delete-btn"
                title="Delete item"
              >
                <Trash2 size={14} />
                <span>Delete</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => onViewDetails && onViewDetails(item)}
              className={`action-btn view-btn ${!isAvailable ? 'disabled' : ''}`}
              disabled={!isAvailable}
              title={isAvailable ? 'View details' : 'Currently unavailable'}
            >
              {isProduct ? <ShoppingCart size={14} /> : <Eye size={14} />}
              <span>
                {isProduct ? 
                  (isAvailable ? 'Add to Cart' : 'Out of Stock') : 
                  (isAvailable ? 'View Details' : 'Unavailable')
                }
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ItemCard
