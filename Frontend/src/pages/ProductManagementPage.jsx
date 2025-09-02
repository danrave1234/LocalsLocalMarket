import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Modal from '../components/Modal.jsx'
import CategorySelector from '../components/CategorySelector.jsx'
import { 
    fetchProductsByShopId, 
    createProduct, 
    updateProduct, 
    deleteProduct,
    updateProductStock,
    decrementProductStock
} from '../api/products.js'
import { uploadImage } from '../api/products.js'
import { getImageUrl } from '../utils/imageUtils.js'
import { extractShopIdFromSlug } from '../utils/slugUtils.js'
import { useAuth } from '../auth/AuthContext.jsx'
import './ProductManagementPage.css'

export default function ProductManagementPage() {
    const { shopId: shopSlug } = useParams()
    const navigate = useNavigate()
    const { token } = useAuth()
    
    // Extract shop ID from slug
    const shopId = extractShopIdFromSlug(shopSlug)
    
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [showAddProduct, setShowAddProduct] = useState(false)
    const [showEditProduct, setShowEditProduct] = useState(false)
    const [editingProduct, setEditingProduct] = useState(null)
    const [productForm, setProductForm] = useState({
        title: '', description: '', price: '', stockCount: '',
        mainCategory: '', subcategory: '', customCategory: ''
    })
    const [productImages, setProductImages] = useState([])
    const [uploadingImages, setUploadingImages] = useState(false)
    const [savingStock, setSavingStock] = useState({})

    useEffect(() => {
        if (shopId && token) {
            loadProducts()
        } else if (!shopId) {
            setError('Invalid shop URL')
            setLoading(false)
        } else if (!token) {
            setError('Authentication required')
            setLoading(false)
        }
    }, [shopId, token, shopSlug])

    const loadProducts = async () => {
        try {
            setLoading(true)
            const data = await fetchProductsByShopId(shopId, token)
            const productsList = Array.isArray(data) ? data : (data.content || [])
            setProducts(productsList)
        } catch (error) {
            console.error('Failed to load products:', error)
            setError('Failed to load products: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    const resetProductForm = () => {
        setProductForm({
            title: '', description: '', price: '', stockCount: '',
            mainCategory: '', subcategory: '', customCategory: ''
        })
        setProductImages([])
        setError('')
    }

    const handleEditProduct = (product) => {
        setEditingProduct(product)
        setProductForm({
            title: product.title || '',
            description: product.description || '',
            price: product.price || '',
            stockCount: product.stockCount || '',
            mainCategory: product.mainCategory || '',
            subcategory: product.subcategory || '',
            customCategory: product.customCategory || ''
        })
        
        let imagePaths = []
        try {
            imagePaths = product.imagePathsJson ? JSON.parse(product.imagePathsJson) : []
        } catch (e) {
            imagePaths = []
        }
        setProductImages(imagePaths)
        setShowEditProduct(true)
    }

    const handleProductImageUpload = async (files) => {
        if (!files || files.length === 0) return
        
        setUploadingImages(true)
        try {
            const uploadPromises = Array.from(files).map(async (file) => {
                const formData = new FormData()
                formData.append('file', file, file.name)
                const result = await uploadImage(formData, token, 'products')
                return result.path
            })
            const uploadedPaths = await Promise.all(uploadPromises)
            setProductImages(prev => [...prev, ...uploadedPaths])
        } catch (error) {
            console.error('Failed to upload images:', error)
            setError('Failed to upload images: ' + error.message)
        } finally {
            setUploadingImages(false)
        }
    }

    const removeProductImage = (index) => {
        setProductImages(prev => prev.filter((_, i) => i !== index))
    }

    const handleAddProduct = async (e) => {
        e.preventDefault()
        try {
            const productData = {
                ...productForm,
                shopId: shopId,
                imagePathsJson: JSON.stringify(productImages),
                category: productForm.customCategory || productForm.subcategory || productForm.mainCategory
            }
            
            await createProduct(productData, token)
            setShowAddProduct(false)
            resetProductForm()
            loadProducts()
        } catch (error) {
            console.error('Failed to add product:', error)
            setError('Failed to add product: ' + error.message)
        }
    }

    const handleUpdateProduct = async (e) => {
        e.preventDefault()
        try {
            const productData = {
                ...productForm,
                imagePathsJson: JSON.stringify(productImages),
                category: productForm.customCategory || productForm.subcategory || productForm.mainCategory
            }
            
            await updateProduct(editingProduct.id, productData, token)
            setShowEditProduct(false)
            setEditingProduct(null)
            resetProductForm()
            loadProducts()
        } catch (error) {
            console.error('Failed to update product:', error)
            setError('Failed to update product: ' + error.message)
        }
    }

    const handleDeleteProduct = async (productId) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return
        
        try {
            await deleteProduct(productId, token)
            loadProducts()
        } catch (error) {
            console.error('Failed to delete product:', error)
            setError('Failed to delete product: ' + error.message)
        }
    }

    const handleStockInputChange = async (productId, value) => {
        const newStock = parseInt(value) || 0
        
        setProducts(products.map(p => 
            p.id === productId ? { ...p, stockCount: newStock } : p
        ))
        
        setSavingStock(prev => ({ ...prev, [productId]: true }))
        
        try {
            await updateProductStock(productId, newStock, token)
        } catch (error) {
            console.error('Failed to update stock:', error)
            setError('Failed to update stock: ' + error.message)
            loadProducts()
        } finally {
            setSavingStock(prev => ({ ...prev, [productId]: false }))
        }
    }

    if (loading) {
        return (
            <div className="product-management-page-container">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading products...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="product-management-page-container">
            <div className="page-header">
                <div className="page-header-content">
                    <button 
                        className="btn btn-secondary back-btn"
                        onClick={() => navigate('/dashboard')}
                    >
                        ← Back to Dashboard
                    </button>
                    <div className="page-title-section">
                        <h1 className="page-title">Product Management</h1>
                        <p className="page-subtitle">
                            Manage your shop's product catalog
                        </p>
                    </div>
                    <button 
                        className="btn btn-primary add-product-btn"
                        onClick={() => setShowAddProduct(true)}
                    >
                        <span className="btn-icon">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19"/>
                                <line x1="5" y1="12" x2="19" y2="12"/>
                            </svg>
                        </span>
                        Add New Product
                    </button>
                </div>
            </div>

            {error && (
                <div className="error-banner">
                    <span className="error-icon">⚠️</span>
                    {error}
                    <button 
                        className="error-close"
                        onClick={() => setError('')}
                    >
                        ✕
                    </button>
                </div>
            )}

            <div className="products-management-container">
                {(!Array.isArray(products) || products.length === 0) ? (
                    <div className="no-products-state">
                        <div className="no-products-icon">📦</div>
                        <h3>No products yet</h3>
                        <p className="muted">
                            Start selling by adding your first product
                        </p>
                        <button 
                            className="btn btn-primary"
                            onClick={() => setShowAddProduct(true)}
                        >
                            <span className="btn-icon">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="12" y1="5" x2="12" y2="19"/>
                                    <line x1="5" y1="12" x2="19" y2="12"/>
                                </svg>
                            </span>
                            Add Your First Product
                        </button>
                    </div>
                ) : (
                    <div className="products-management-grid">
                        {Array.isArray(products) && products.map((product) => (
                            <div key={product.id} className="product-management-card">
                                <div className="product-management-image">
                                    {(() => {
                                        let imagePaths = []
                                        try {
                                            imagePaths = product.imagePathsJson ? JSON.parse(product.imagePathsJson) : []
                                        } catch (e) {
                                            imagePaths = []
                                        }
                                        
                                        if (imagePaths.length > 0 && imagePaths[0]) {
                                            const imageUrl = getImageUrl(imagePaths[0])
                                            console.log('Product image URL:', imageUrl, 'for product:', product.title)
                                            return (
                                                <>
                                                    <img 
                                                        src={imageUrl} 
                                                        alt={product.title}
                                                        className="product-management-image"
                                                        onError={(e) => {
                                                            console.error('Image failed to load:', imageUrl)
                                                            e.target.style.display = 'none'
                                                            e.target.nextSibling.style.display = 'flex'
                                                        }}
                                                        onLoad={() => {
                                                            console.log('Image loaded successfully:', imageUrl)
                                                        }}
                                                    />
                                                    <div className="product-image-placeholder" style={{ display: 'none' }}>
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                                            <circle cx="8.5" cy="8.5" r="1.5"/>
                                                            <polyline points="21,15 16,10 5,21"/>
                                                        </svg>
                                                    </div>
                                                </>
                                            )
                                        }
                                        
                                        return (
                                            <div className="product-image-placeholder">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                                    <circle cx="8.5" cy="8.5" r="1.5"/>
                                                    <polyline points="21,15 16,10 5,21"/>
                                                </svg>
                                            </div>
                                        )
                                    })()}
                                </div>
                                <div className="product-management-content">
                                    <div className="product-management-title">{product.title}</div>
                                    <div className="product-management-price">
                                        ₱{product.price ? Number(product.price).toFixed(2) : '0.00'}
                                    </div>
                                    {product.category && (
                                        <div className="product-management-category">
                                            <span className="category-tag">{product.category}</span>
                                        </div>
                                    )}
                                    {(product.mainCategory || product.subcategory || product.customCategory) && (
                                        <div className="product-management-category">
                                            <span className="category-tag">
                                                {product.customCategory || product.subcategory || product.mainCategory}
                                            </span>
                                        </div>
                                    )}
                                    <div className="product-management-stock">
                                        {product.stockCount > 0 ? (
                                            <span className="stock-in-stock">In Stock: {product.stockCount}</span>
                                        ) : (
                                            <span className="stock-out-of-stock">Out of Stock</span>
                                        )}
                                        <div className="stock-controls">
                                            <button 
                                                className="stock-btn stock-minus"
                                                onClick={async () => {
                                                    try {
                                                        const productId = product.id
                                                        const result = await decrementProductStock(productId, 1, token)
                                                        
                                                        setProducts(products.map(p => 
                                                            p.id === productId ? { ...p, stockCount: result.stockCount } : p
                                                        ))
                                                    } catch (error) {
                                                        console.error('Failed to decrease stock:', error)
                                                        setError('Failed to decrease stock: ' + error.message)
                                                    }
                                                }}
                                                title="Decrease stock by 1"
                                            >
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <line x1="5" y1="12" x2="19" y2="12"/>
                                                </svg>
                                            </button>
                                            <input
                                                type="number"
                                                className={`stock-input ${savingStock[product.id] ? 'saving' : ''}`}
                                                value={product.stockCount || 0}
                                                onChange={(e) => handleStockInputChange(product.id, e.target.value)}
                                                min="0"
                                                title={savingStock[product.id] ? "Saving..." : "Edit stock count"}
                                            />
                                            {savingStock[product.id] && (
                                                <div className="stock-saving-indicator">
                                                    <div className="saving-spinner"></div>
                                                </div>
                                            )}
                                            <button 
                                                className="stock-btn stock-plus"
                                                onClick={async () => {
                                                    try {
                                                        const productId = product.id
                                                        const currentProduct = products.find(p => p.id === productId)
                                                        if (!currentProduct) return
                                                        
                                                        const newStock = (currentProduct.stockCount || 0) + 1
                                                        
                                                        setProducts(products.map(p => 
                                                            p.id === productId ? { ...p, stockCount: newStock } : p
                                                        ))
                                                        
                                                        await updateProductStock(productId, newStock, token)
                                                    } catch (error) {
                                                        console.error('Failed to increase stock:', error)
                                                        setError('Failed to increase stock: ' + error.message)
                                                        loadProducts()
                                                    }
                                                }}
                                                title="Increase stock by 1"
                                            >
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <line x1="12" y1="5" x2="12" y2="19"/>
                                                    <line x1="5" y1="12" x2="19" y2="12"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    {product.description && (
                                        <p className="product-management-description">
                                            {product.description.length > 80 
                                                ? product.description.substring(0, 80) + '...' 
                                                : product.description
                                            }
                                        </p>
                                    )}
                                    <div className="product-management-actions">
                                        <button 
                                            className="btn btn-secondary btn-sm"
                                            onClick={() => handleEditProduct(product)}
                                        >
                                            <span className="btn-icon">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                                    <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                                </svg>
                                            </span>
                                            Edit
                                        </button>
                                        <button 
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDeleteProduct(product.id)}
                                        >
                                            <span className="btn-icon">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="3,6 5,6 21,6"/>
                                                    <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
                                                </svg>
                                            </span>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add Product Modal */}
            <Modal 
                isOpen={showAddProduct} 
                onClose={() => {
                    setShowAddProduct(false)
                    resetProductForm()
                }}
                title="Add New Product"
                size="xlarge"
            >
                <form onSubmit={handleAddProduct} className="add-product-form">
                    <div className="form-grid">
                        <div className="form-inputs">
                            <div className="form-group">
                                <label htmlFor="productTitle" className="form-label">
                                    Product Title *
                                </label>
                                <input
                                    type="text"
                                    id="productTitle"
                                    className="input"
                                    value={productForm.title}
                                    onChange={(e) => setProductForm({...productForm, title: e.target.value})}
                                    required
                                    placeholder="Enter product name"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="productCategory" className="form-label">
                                    Product Category
                                </label>
                                <CategorySelector
                                    value={{
                                        mainCategory: productForm.mainCategory,
                                        subcategory: productForm.subcategory,
                                        customCategory: productForm.customCategory
                                    }}
                                    onChange={(categoryData) => {
                                        setProductForm({
                                            ...productForm,
                                            mainCategory: categoryData.mainCategory || '',
                                            subcategory: categoryData.subcategory || '',
                                            customCategory: categoryData.customCategory || ''
                                        })
                                    }}
                                    placeholder="Select a category"
                                    showSubcategories={true}
                                    allowCustom={true}
                                    required={false}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="productDescription" className="form-label">
                                    Product Description
                                </label>
                                <textarea
                                    id="productDescription"
                                    className="input"
                                    value={productForm.description}
                                    onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                                    placeholder="Describe your product, features, specifications..."
                                    rows={4}
                                    style={{ resize: 'vertical' }}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="productPrice" className="form-label">
                                    Price (₱) *
                                </label>
                                <input
                                    type="number"
                                    id="productPrice"
                                    className="input"
                                    value={productForm.price}
                                    onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                                    min="0"
                                    step="0.01"
                                    required
                                    placeholder="0.00"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="productStock" className="form-label">
                                    Stock Count *
                                </label>
                                <input
                                    type="number"
                                    id="productStock"
                                    className="input"
                                    value={productForm.stockCount}
                                    onChange={(e) => setProductForm({...productForm, stockCount: e.target.value})}
                                    min="0"
                                    required
                                    placeholder="0"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Product Images
                                </label>
                                <div className="image-upload-section">
                                    <input
                                        type="file"
                                        id="productImages"
                                        className="image-upload-input"
                                        multiple
                                        accept="image/*"
                                        onChange={(e) => handleProductImageUpload(e.target.files)}
                                        style={{ display: 'none' }}
                                    />
                                    <label htmlFor="productImages" className="image-upload-button">
                                        {uploadingImages ? (
                                            <div className="upload-loading">
                                                <div style={{
                                                    width: '16px',
                                                    height: '16px',
                                                    border: '2px solid var(--primary)',
                                                    borderTop: '2px solid transparent',
                                                    borderRadius: '50%',
                                                    animation: 'spin 1s linear infinite'
                                                }}></div>
                                                <span>Uploading...</span>
                                            </div>
                                        ) : (
                                            <>
                                                <span className="upload-icon">📷</span>
                                                <span>Upload Images</span>
                                            </>
                                        )}
                                    </label>
                                    <small className="form-help">
                                        Upload up to 5 images (max 2MB each). Supported formats: JPG, PNG, GIF
                                    </small>
                                </div>
                                
                                {productImages.length > 0 && (
                                    <div className="image-preview-grid">
                                        {productImages.map((imagePath, index) => (
                                            <div key={`add-${imagePath}-${index}`} className="image-preview-item">
                                                <img 
                                                    src={getImageUrl(imagePath)} 
                                                    alt={`Product image ${index + 1}`}
                                                    className="image-preview"
                                                />
                                                <button
                                                    type="button"
                                                    className="remove-image-btn"
                                                    onClick={() => removeProductImage(index)}
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="form-preview">
                            <label className="form-label">
                                Product Preview
                            </label>
                            <div className="product-preview-card">
                                <div className="product-preview-image">
                                    {productImages.length > 0 ? (
                                        <img 
                                            src={getImageUrl(productImages[0])} 
                                            alt="Product preview"
                                            className="product-preview-img"
                                        />
                                    ) : (
                                        <div className="product-image-placeholder">📷</div>
                                    )}
                                </div>
                                <div className="product-preview-content">
                                    <h3 className="product-preview-title">
                                        {productForm.title || 'Product Title'}
                                    </h3>
                                    <div className="product-preview-price">
                                        ₱{productForm.price ? Number(productForm.price).toFixed(2) : '0.00'}
                                    </div>
                                    {productForm.description && (
                                        <p className="product-preview-description">
                                            {productForm.description}
                                        </p>
                                    )}
                                    {productForm.category && (
                                        <div className="product-preview-category">
                                            <span className="pill">{productForm.category}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="form-error">
                            {error}
                        </div>
                    )}

                    <div className="form-actions">
                        <button 
                            type="button" 
                            className="btn cancel-btn" 
                            onClick={() => {
                                setShowAddProduct(false)
                                resetProductForm()
                            }}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="btn btn-primary submit-btn"
                        >
                            Add Product
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Edit Product Modal */}
            <Modal 
                isOpen={showEditProduct} 
                onClose={() => {
                    setShowEditProduct(false)
                    setEditingProduct(null)
                    resetProductForm()
                }}
                title={`Edit Product - ${editingProduct?.title || ''}`}
                size="xlarge"
            >
                <form onSubmit={handleUpdateProduct} className="add-product-form">
                    <div className="form-grid">
                        <div className="form-inputs">
                            <div className="form-group">
                                <label htmlFor="editProductTitle" className="form-label">
                                    Product Title *
                                </label>
                                <input
                                    type="text"
                                    id="editProductTitle"
                                    className="input"
                                    value={productForm.title}
                                    onChange={(e) => setProductForm({...productForm, title: e.target.value})}
                                    required
                                    placeholder="Enter product name"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="editProductCategory" className="form-label">
                                    Product Category
                                </label>
                                <CategorySelector
                                    value={{
                                        mainCategory: productForm.mainCategory,
                                        subcategory: productForm.subcategory,
                                        customCategory: productForm.customCategory
                                    }}
                                    onChange={(categoryData) => {
                                        setProductForm({
                                            ...productForm,
                                            mainCategory: categoryData.mainCategory || '',
                                            subcategory: categoryData.subcategory || '',
                                            customCategory: categoryData.customCategory || ''
                                        })
                                    }}
                                    placeholder="Select a category"
                                    showSubcategories={true}
                                    allowCustom={true}
                                    required={false}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="editProductDescription" className="form-label">
                                    Product Description
                                </label>
                                <textarea
                                    id="editProductDescription"
                                    className="input"
                                    value={productForm.description}
                                    onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                                    placeholder="Describe your product, features, specifications..."
                                    rows={4}
                                    style={{ resize: 'vertical' }}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="editProductPrice" className="form-label">
                                    Price (₱) *
                                </label>
                                <input
                                    type="number"
                                    id="editProductPrice"
                                    className="input"
                                    value={productForm.price}
                                    onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                                    min="0"
                                    step="0.01"
                                    required
                                    placeholder="0.00"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="editProductStock" className="form-label">
                                    Stock Count *
                                </label>
                                <input
                                    type="number"
                                    id="editProductStock"
                                    className="input"
                                    value={productForm.stockCount}
                                    onChange={(e) => setProductForm({...productForm, stockCount: e.target.value})}
                                    min="0"
                                    required
                                    placeholder="0"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Product Images
                                </label>
                                <div className="image-upload-section">
                                    <input
                                        type="file"
                                        id="editProductImages"
                                        className="image-upload-input"
                                        multiple
                                        accept="image/*"
                                        onChange={(e) => handleProductImageUpload(e.target.files)}
                                        style={{ display: 'none' }}
                                    />
                                    <label htmlFor="editProductImages" className="image-upload-button">
                                        {uploadingImages ? (
                                            <div className="upload-loading">
                                                <div style={{
                                                    width: '16px',
                                                    height: '16px',
                                                    border: '2px solid var(--primary)',
                                                    borderTop: '2px solid transparent',
                                                    borderRadius: '50%',
                                                    animation: 'spin 1s linear infinite'
                                                }}></div>
                                                <span>Uploading...</span>
                                            </div>
                                        ) : (
                                            <>
                                                <span className="upload-icon">📷</span>
                                                <span>Upload Images</span>
                                            </>
                                        )}
                                    </label>
                                    <small className="form-help">
                                        Upload up to 5 images (max 2MB each). Supported formats: JPG, PNG, GIF
                                    </small>
                                </div>
                                
                                {productImages.length > 0 && (
                                    <div className="image-preview-grid">
                                        {productImages.map((imagePath, index) => (
                                            <div key={`edit-${imagePath}-${index}`} className="image-preview-item">
                                                <img 
                                                    src={getImageUrl(imagePath)} 
                                                    alt={`Product image ${index + 1}`}
                                                    className="image-preview"
                                                />
                                                <button
                                                    type="button"
                                                    className="remove-image-btn"
                                                    onClick={() => removeProductImage(index)}
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="form-preview">
                            <label className="form-label">
                                Product Preview
                            </label>
                            <div className="product-preview-card">
                                <div className="product-preview-image">
                                    {productImages.length > 0 ? (
                                        <img 
                                            src={getImageUrl(productImages[0])} 
                                            alt="Product preview"
                                            className="product-preview-img"
                                        />
                                    ) : (
                                        <div className="product-image-placeholder">📷</div>
                                    )}
                                </div>
                                <div className="product-preview-content">
                                    <h3 className="product-preview-title">
                                        {productForm.title || 'Product Title'}
                                    </h3>
                                    <div className="product-preview-price">
                                        ₱{productForm.price ? Number(productForm.price).toFixed(2) : '0.00'}
                                    </div>
                                    {productForm.description && (
                                        <p className="product-preview-description">
                                            {productForm.description}
                                        </p>
                                    )}
                                    {productForm.category && (
                                        <div className="product-preview-category">
                                            <span className="pill">{productForm.category}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="form-error">
                            {error}
                        </div>
                    )}

                    <div className="form-actions">
                        <button 
                            type="button" 
                            className="btn cancel-btn" 
                            onClick={() => {
                                setShowEditProduct(false)
                                setEditingProduct(null)
                                resetProductForm()
                            }}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="btn btn-primary submit-btn"
                        >
                            Update Product
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}
