import React, { useState, useEffect } from 'react'
import { Package, Wrench, Upload, X, AlertCircle, CheckCircle } from 'lucide-react'
import CategorySelector from './CategorySelector.jsx'
import { uploadImage, deleteImage, updateProductImages } from '../api/products.js'
import { updateServiceImages } from '../api/services.js'
import { validateServiceData, formatServiceData } from '../api/services.js'
import './ItemForm.css'

const ItemForm = ({ 
  item, 
  type = 'product', // 'product' or 'service'
  onSubmit, 
  onCancel,
  onImageUpdate, // New callback for when images are updated
  loading = false,
  className = '',
  token
}) => {
  const isProduct = type === 'product'
  const isService = type === 'service'

  const [formData, setFormData] = useState({
    title: item?.title || '',
    description: item?.description || '',
    price: item?.price || '',
    mainCategory: item?.mainCategory || '',
    subcategory: item?.subcategory || '',
    customCategory: item?.customCategory || '',
    status: item?.status || 'AVAILABLE',
    isActive: item?.isActive ?? true,
    // Product-specific fields
    stockCount: item?.stockCount || '',
    // Service-specific fields (removed durationMinutes)
  })

  const [images, setImages] = useState(item?.imageUrl ? [item.imageUrl] : [])
  const [imageFiles, setImageFiles] = useState([]) // Store File objects for new uploads
  const [uploadingImages, setUploadingImages] = useState(false)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  // Update form data when item prop changes
  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title || '',
        description: item.description || '',
        price: item.price || '',
        mainCategory: item.mainCategory || '',
        subcategory: item.subcategory || '',
        customCategory: item.customCategory || '',
        status: item.status || 'AVAILABLE',
        isActive: item.isActive ?? true,
        stockCount: item.stockCount || ''
      })
      
      // Handle images based on item type
      if (isService) {
        // Services use imageUrl
        setImages(item.imageUrl ? [item.imageUrl] : [])
      } else if (isProduct) {
        // Products use imagePathsJson
        let imagePaths = []
        if (item.imagePathsJson) {
          try {
            imagePaths = JSON.parse(item.imagePathsJson)
          } catch (e) {
            console.warn('Failed to parse imagePathsJson:', e)
            imagePaths = []
          }
        }
        setImages(imagePaths)
      }
    }
  }, [item, isService, isProduct])

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      images.forEach(imageUrl => {
        if (imageUrl && imageUrl.startsWith('blob:')) {
          URL.revokeObjectURL(imageUrl)
        }
      })
    }
  }, [images])

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  // Handle field blur for validation
  const handleFieldBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    validateField(field, formData[field])
  }

  // Validate individual field
  const validateField = (field, value) => {
    const fieldErrors = []

    switch (field) {
      case 'title':
        if (!value || value.trim().length === 0) {
          fieldErrors.push('Title is required')
        } else if (value.length > 255) {
          fieldErrors.push('Title must be less than 255 characters')
        }
        break
      
      case 'description':
        if (value && value.length > 1000) {
          fieldErrors.push('Description must be less than 1000 characters')
        }
        break
      
      case 'price':
        if (value && value !== '') {
          const price = parseFloat(value)
          if (isNaN(price) || price < 0) {
            fieldErrors.push('Price must be a valid positive number')
          } else if (price > 999999.99) {
            fieldErrors.push('Price must be less than ₱999,999.99')
          }
        }
        break
      
      case 'stockCount':
        if (isProduct && value !== '') {
          const stock = parseInt(value)
          if (isNaN(stock) || stock < 0) {
            fieldErrors.push('Stock count must be a valid non-negative number')
          }
        }
        break
      
      // Duration field removed
    }

    setErrors(prev => ({ 
      ...prev, 
      [field]: fieldErrors.length > 0 ? fieldErrors[0] : null 
    }))
  }

  // Handle image selection (store files locally, don't upload yet)
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files)
    if (files.length === 0) return

    // Validate files
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ 
          ...prev, 
          images: 'Please select only image files.' 
        }))
        return
      }
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({ 
          ...prev, 
          images: 'File size must be less than 2MB.' 
        }))
        return
      }
    }

    // Create preview URLs for display
    const previewUrls = files.map(file => URL.createObjectURL(file))
    
    if (isProduct) {
      // Products can have multiple images
      setImages(prev => [...prev, ...previewUrls])
      setImageFiles(prev => [...prev, ...files])
    } else {
      // Services only have one image - replace existing
      setImages(previewUrls)
      setImageFiles(files)
    }

    // Clear any previous errors
    setErrors(prev => ({ ...prev, images: null }))
  }

  // Remove image
  const removeImage = async (index) => {
    const imageUrl = images[index]
    
    // If it's a cloud storage URL (not a blob URL), delete it from cloud storage
    if (imageUrl && !imageUrl.startsWith('blob:') && imageUrl.startsWith('https://storage.googleapis.com/')) {
      try {
        await deleteImage(imageUrl, token)
      } catch (error) {
        console.error('Failed to delete image from cloud storage:', error)
        // Continue with removal even if cloud deletion fails
      }
    }
    
    // Revoke object URL to prevent memory leaks
    if (imageUrl && imageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imageUrl)
    }
    
    // Update state immediately to reflect the removal
    const newImages = images.filter((_, i) => i !== index)
    const newImageFiles = imageFiles.filter((_, i) => i !== index)
    
    setImages(newImages)
    setImageFiles(newImageFiles)
    
    // If this is an edit operation, update the database immediately
    if (item && item.id) {
      try {
        if (isService) {
          // For services, update the single imageUrl
          const newImageUrl = newImages.length > 0 ? newImages[0] : null
          await updateServiceImages(item.id, newImageUrl, token)
          
          // Notify parent component about the image update
          if (onImageUpdate) {
            onImageUpdate(item.id, 'service', { imageUrl: newImageUrl })
          }
        } else if (isProduct) {
          // For products, update the imagePathsJson
          const imagePathsJson = newImages.length > 0 ? JSON.stringify(newImages) : null
          await updateProductImages(item.id, imagePathsJson, token)
          
          // Notify parent component about the image update
          if (onImageUpdate) {
            onImageUpdate(item.id, 'product', { imagePathsJson, imageUrl: newImages[0] || null })
          }
        }
      } catch (error) {
        console.error('Failed to update database after image removal:', error)
        // Don't show error to user as the UI has already been updated
        // The database will be updated when the form is saved
      }
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate all fields
    const fieldsToValidate = ['title', 'description', 'price']
    if (isProduct) fieldsToValidate.push('stockCount')
    
    let hasErrors = false
    fieldsToValidate.forEach(field => {
      validateField(field, formData[field])
      if (errors[field]) hasErrors = true
    })

    if (hasErrors) {
      setTouched(fieldsToValidate.reduce((acc, field) => ({ ...acc, [field]: true }), {}))
      return
    }

    setUploadingImages(true)
    try {
      // Upload new images first
      let uploadedImageUrls = []
      if (imageFiles.length > 0) {
        const uploadPromises = imageFiles.map(file => {
          const formData = new FormData()
          formData.append('file', file, file.name)
          // Use appropriate directory based on item type
          const uploadType = isProduct ? 'products' : isService ? 'services' : 'general'
          return uploadImage(formData, token, uploadType)
        })
        const uploadResponses = await Promise.all(uploadPromises)
        // Extract the path from each response
        uploadedImageUrls = uploadResponses.map(response => response.path)
      }

      // Get existing images (cloud storage URLs, not blob URLs)
      const existingImages = images.filter(img => !img.startsWith('blob:'))
      const allImageUrls = [...existingImages, ...uploadedImageUrls]
      
      console.log('Form submission - Current images state:', images)
      console.log('Form submission - Existing images (cloud URLs):', existingImages)
      console.log('Form submission - Newly uploaded images:', uploadedImageUrls)
      console.log('Form submission - Final image URLs:', allImageUrls)

      // If this is an edit operation, clean up old images that are no longer used
      if (item && item.id) {
        const oldImageUrls = []
        
        // For services, check if the old imageUrl is different from the new one
        if (isService && item.imageUrl && item.imageUrl !== allImageUrls[0]) {
          oldImageUrls.push(item.imageUrl)
        }
        
        // For products, check if any old images are no longer in the new list
        if (isProduct && item.imagePathsJson) {
          try {
            const oldImagePaths = JSON.parse(item.imagePathsJson)
            const newImagePaths = allImageUrls
            const removedImages = oldImagePaths.filter(oldImg => !newImagePaths.includes(oldImg))
            oldImageUrls.push(...removedImages)
          } catch (e) {
            console.warn('Failed to parse old imagePathsJson:', e)
          }
        }
        
        // Delete old images from cloud storage
        for (const oldImageUrl of oldImageUrls) {
          if (oldImageUrl && oldImageUrl.startsWith('https://storage.googleapis.com/')) {
            try {
              await deleteImage(oldImageUrl, token)
            } catch (error) {
              console.error('Failed to delete old image from cloud storage:', error)
              // Continue even if deletion fails
            }
          }
        }
      }

      // Prepare data for submission
      const submitData = {
        ...formData,
        price: formData.price ? parseFloat(formData.price) : null,
        stockCount: isProduct && formData.stockCount ? parseInt(formData.stockCount) : null,
        imageUrl: allImageUrls[0] || null,
        // For products, include all image URLs
        ...(isProduct && allImageUrls.length > 0 && { imagePathsJson: JSON.stringify(allImageUrls) })
      }

      // For services, use the service-specific formatting
      if (isService) {
        // Only pass service-relevant fields to formatServiceData
        const serviceFormData = {
          title: formData.title,
          description: formData.description,
          price: formData.price,
          mainCategory: formData.mainCategory,
          subcategory: formData.subcategory,
          customCategory: formData.customCategory,
          status: formData.status,
          isActive: formData.isActive,
          imageUrl: allImageUrls[0] || null
        }
        const serviceData = formatServiceData(serviceFormData)
        const serviceErrors = validateServiceData(serviceData)
        if (serviceErrors.length > 0) {
          setErrors(prev => ({ ...prev, general: serviceErrors[0] }))
          return
        }
        onSubmit(serviceData)
      } else {
        onSubmit(submitData)
      }
    } catch (error) {
      console.error('Failed to upload images:', error)
      setErrors(prev => ({ 
        ...prev, 
        images: 'Failed to upload images. Please try again.' 
      }))
    } finally {
      setUploadingImages(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`item-form ${className} ${loading ? 'loading' : ''}`}>

      {/* General Error */}
      {errors.general && (
        <div className="error-message general-error">
          <AlertCircle size={16} />
          <span>{errors.general}</span>
        </div>
      )}

      {/* Basic Information */}
      <div className="form-section">
        <h4>Basic Information</h4>
        
        <div className="form-group">
          <label htmlFor="title">
            {isProduct ? 'Product' : 'Service'} Title *
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            onBlur={() => handleFieldBlur('title')}
            placeholder={`Enter ${isProduct ? 'product' : 'service'} title`}
            className={errors.title && touched.title ? 'error' : ''}
            required
          />
          {errors.title && touched.title && (
            <div className="error-message">
              <AlertCircle size={14} />
              <span>{errors.title}</span>
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            onBlur={() => handleFieldBlur('description')}
            rows="3"
            placeholder={`Describe your ${isProduct ? 'product' : 'service'}`}
            className={errors.description && touched.description ? 'error' : ''}
          />
          {errors.description && touched.description && (
            <div className="error-message">
              <AlertCircle size={14} />
              <span>{errors.description}</span>
            </div>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="price">Price (₱) *</label>
            <input
              type="number"
              id="price"
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              onBlur={() => handleFieldBlur('price')}
              step="0.01"
              min="0"
              placeholder="0.00"
              className={errors.price && touched.price ? 'error' : ''}
              required
            />
            {errors.price && touched.price && (
              <div className="error-message">
                <AlertCircle size={14} />
                <span>{errors.price}</span>
              </div>
            )}
          </div>

          {isProduct && (
            <div className="form-group">
              <label htmlFor="stockCount">Stock Count *</label>
              <input
                type="number"
                id="stockCount"
                value={formData.stockCount}
                onChange={(e) => handleInputChange('stockCount', e.target.value)}
                onBlur={() => handleFieldBlur('stockCount')}
                min="0"
                placeholder="0"
                className={errors.stockCount && touched.stockCount ? 'error' : ''}
                required
              />
              {errors.stockCount && touched.stockCount && (
                <div className="error-message">
                  <AlertCircle size={14} />
                  <span>{errors.stockCount}</span>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Category Selection */}
      <div className="form-section">
        <h4>Category</h4>
        <div className="form-group">
          <CategorySelector
            value={{
              mainCategory: formData.mainCategory,
              subcategory: formData.subcategory,
              customCategory: formData.customCategory
            }}
            onChange={(categoryData) => {
              setFormData(prev => ({
                ...prev,
                mainCategory: categoryData.mainCategory || '',
                subcategory: categoryData.subcategory || '',
                customCategory: categoryData.customCategory || ''
              }))
            }}
            placeholder={`Select ${isProduct ? 'product' : 'service'} category`}
            showSubcategories={true}
            allowCustom={true}
          />
        </div>
      </div>

      {/* Image Upload */}
      <div className="form-section">
          <h4>{isProduct ? 'Images' : 'Service Image'}</h4>
          <div className="form-group">
            <label htmlFor="images">
              {isProduct ? 'Upload Images' : 'Upload Service Image'}
            </label>
            {!isProduct && (
              <p className="form-help-text">
                Add a photo to showcase your service. This helps customers understand what you offer and builds trust.
              </p>
            )}
            <div className="image-upload-area">
              <input
                type="file"
                id="images"
                accept="image/*"
                multiple={isProduct}
                onChange={handleImageUpload}
                className="image-input"
                disabled={uploadingImages}
              />
              <label htmlFor="images" className="image-upload-label">
                <Upload size={20} />
                <span>
                  {uploadingImages ? 'Uploading...' : 
                   isProduct ? 'Choose Images' : 'Choose Image'}
                </span>
              </label>
            </div>
            
            {images.length > 0 && (
              <div className="image-preview">
                {images.map((image, index) => (
                  <div key={index} className="image-item">
                    <img src={image} alt={`Preview ${index + 1}`} />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="remove-image-btn"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {errors.images && (
              <div className="error-message">
                <AlertCircle size={14} />
                <span>{errors.images}</span>
              </div>
            )}
          </div>
        </div>

      {/* Status (Services only) */}
      {isService && (
        <div className="form-section">
          <h4>Availability</h4>
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
            >
              <option value="AVAILABLE">Available</option>
              <option value="NOT_AVAILABLE">Not Available</option>
            </select>
          </div>
        </div>
      )}

      {/* Form Actions */}
      <div className="form-actions">
        <button type="button" onClick={onCancel} className="cancel-btn">
          Cancel
        </button>
        <button 
          type="submit" 
          className="submit-btn"
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="spinner" />
              {item ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            <>
              <CheckCircle size={16} />
              {item ? 'Update' : 'Create'} {isProduct ? 'Product' : 'Service'}
            </>
          )}
        </button>
      </div>
    </form>
  )
}

export default ItemForm
