import React, { useState, useEffect } from 'react'
import { useAuth } from '../auth/AuthContext.jsx'
import Modal from '../components/Modal.jsx'
import CategorySelector from '../components/CategorySelector.jsx'
import LocationMap from '../components/LocationMap.jsx'
import { SkeletonText } from '../components/Skeleton.jsx'
import { LoadingSpinner, LoadingOverlay, LoadingButton } from '../components/Loading.jsx'
import { 
    getUserShopsRequest as fetchUserShopsApi, 
    createShopRequest as createShop, 
    updateShopRequest as updateShop, 
    deleteShopRequest as deleteShop,
    fetchCategories
} from '../api/shops.js'
import { uploadImage } from '../api/products.js'
import { getImageUrl } from '../utils/imageUtils.js'
import { handleApiError } from '../utils/errorHandler.js'
import { generateShopUrl, generateShopSlug } from '../utils/slugUtils.js'
import ErrorDisplay from '../components/ErrorDisplay.jsx'
import BusinessHours from '../components/BusinessHours.jsx'
import '../dashboard.css'

export default function DashboardPage() {
    const { user, token } = useAuth()
    const [shops, setShops] = useState([])
    const [showCreateShop, setShowCreateShop] = useState(false)
    const [showEditShop, setShowEditShop] = useState(false)
    const [editingShop, setEditingShop] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [categories, setCategories] = useState([])
    const [uploading, setUploading] = useState(false)

    // Shop form state
    const [shopForm, setShopForm] = useState({
        name: '',
        description: '',
        category: '',
        addressLine: '',
        phone: '',
        website: '',
        email: '',
        facebook: '',
        instagram: '',
        twitter: '',
        lat: 10.3157,
        lng: 123.8854,
        logoPath: '',
        coverPath: '',
        businessHoursJson: ''
    })

    useEffect(() => {
        fetchUserShops()
        fetchCategoriesData()
    }, [])

    const fetchCategoriesData = async () => {
        try {
            const data = await fetchCategories()
            setCategories(data.categories || [])
        } catch (error) {
            console.error('Failed to fetch categories:', error)
        }
    }

    const onUpload = async (file, type = 'general') => {
        if (!file) {
            throw new Error('No file selected')
        }
        
        if (!file.type.startsWith('image/')) {
            throw new Error('Please select an image file')
        }
        
        if (file.size > 2 * 1024 * 1024) {
            throw new Error('File size must be less than 2MB')
        }
        
        setUploading(true)
        setError('')
        
        try {
            const fd = new FormData()
            fd.append('file', file, file.name)
            
            const res = await uploadImage(fd, token, type)
            return res.path
        } catch (error) {
            console.error('Upload error:', error)
            throw new Error(`Upload failed: ${error.message}`)
        } finally {
            setUploading(false)
        }
    }

    const fetchUserShops = async () => {
        try {
            setLoading(true)
            const data = await fetchUserShopsApi(token)
            setShops(Array.isArray(data) ? data : [])
        } catch (error) {
            console.error('Failed to fetch shops:', error)
            const errorInfo = handleApiError(error)
            setError(errorInfo.message)
        } finally {
            setLoading(false)
        }
    }

    const handleCreateShop = async (e) => {
        e.preventDefault()
        
        try {
            const shopData = {
                ...shopForm,
                ...formatCategoryData({
                    mainCategory: shopForm.mainCategory,
                    subcategory: shopForm.subcategory,
                    customCategory: shopForm.customCategory
                })
            }
            
            const newShop = await createShop(shopData, token)
            setShops([...shops, newShop])
            setShowCreateShop(false)
            resetShopForm()
        } catch (error) {
            console.error('Failed to create shop:', error)
            const errorInfo = handleApiError(error)
            setError(errorInfo.message)
        }
    }

    const handleUpdateShop = async (e) => {
        e.preventDefault()
        
        try {
            const shopData = {
                ...shopForm,
                ...formatCategoryData({
                    mainCategory: shopForm.mainCategory,
                    subcategory: shopForm.subcategory,
                    customCategory: shopForm.customCategory
                })
            }
            
            const updatedShop = await updateShop(editingShop.id, shopData, token)
            setShops(shops.map(shop => shop.id === editingShop.id ? updatedShop : shop))
            setShowEditShop(false)
            setEditingShop(null)
            resetShopForm()
        } catch (error) {
            console.error('Failed to update shop:', error)
            const errorInfo = handleApiError(error)
            setError(errorInfo.message)
        }
    }

    const handleDeleteShop = async (shopId) => {
        if (!confirm('Are you sure you want to delete this shop? This action cannot be undone.')) {
            return
        }
        
        try {
            await deleteShop(shopId, token)
            setShops(shops.filter(shop => shop.id !== shopId))
        } catch (error) {
            console.error('Failed to delete shop:', error)
            const errorInfo = handleApiError(error)
            setError(errorInfo.message)
        }
    }

    const handleEditShop = (shop) => {
        setEditingShop(shop)
        setShopForm({
            name: shop.name || '',
            description: shop.description || '',
            category: shop.category || '',
            mainCategory: shop.mainCategory || '',
            subcategory: shop.subcategory || '',
            customCategory: shop.customCategory || '',
            addressLine: shop.addressLine || '',
            phone: shop.phone || '',
            website: shop.website || '',
            email: shop.email || '',
            facebook: shop.facebook || '',
            instagram: shop.instagram || '',
            twitter: shop.twitter || '',
            lat: shop.lat || 10.3157,
            lng: shop.lng || 123.8854,
            logoPath: shop.logoPath || '',
            coverPath: shop.coverPath || '',
            businessHoursJson: shop.businessHoursJson || ''
        })
        setShowEditShop(true)
    }

    const resetShopForm = () => {
        setShopForm({
            name: '',
            description: '',
            category: '',
            mainCategory: '',
            subcategory: '',
            customCategory: '',
            addressLine: '',
            phone: '',
            website: '',
            email: '',
            facebook: '',
            instagram: '',
            twitter: '',
            lat: 10.3157,
            lng: 123.8854,
            logoPath: '',
            coverPath: '',
            businessHoursJson: ''
        })
        setError('')
    }

    const formatCategoryData = (categoryData) => {
        const { mainCategory, subcategory, customCategory } = categoryData
        
        if (customCategory && customCategory.trim()) {
            return { category: customCategory.trim() }
        } else if (subcategory && subcategory.trim()) {
            return { category: subcategory.trim() }
        } else if (mainCategory && mainCategory.trim()) {
            return { category: mainCategory.trim() }
        }
        
        return { category: '' }
    }

    // Product Management Functions - Now handled in ProductManagementPage
    const openManageProducts = async (shop) => {
        // Navigate to the dedicated product management page using slug
        const shopSlug = generateShopSlug(shop.name, shop.id)
        window.location.href = `/product-management/${shopSlug}`
    }

    if (loading) {
        return (
            <main className="container seller-dashboard-container">
                <div className="dashboard-header">
                    <div className="dashboard-header-content">
                        <div>
                            <SkeletonText lines={1} height="2rem" style={{ marginBottom: '0.5rem' }} />
                            <SkeletonText lines={1} height="1rem" style={{ width: '60%' }} />
                        </div>
                        <SkeletonText lines={1} height="3rem" style={{ width: '200px' }} />
                    </div>
                </div>

                <div className="shops-grid">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="shop-card skeleton">
                            <SkeletonText lines={1} height="160px" style={{ marginBottom: '1rem' }} />
                            <SkeletonText lines={1} height="1.5rem" style={{ marginBottom: '0.5rem' }} />
                            <SkeletonText lines={2} height="1rem" style={{ marginBottom: '1rem' }} />
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <SkeletonText lines={1} height="2.5rem" style={{ width: '80px' }} />
                                <SkeletonText lines={1} height="2.5rem" style={{ width: '80px' }} />
                                <SkeletonText lines={1} height="2.5rem" style={{ width: '80px' }} />
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        )
    }

    return (
        <main className="container seller-dashboard-container">
            <div className="dashboard-header">
                <div className="dashboard-header-content">
                    <div>
                        <h1 className="dashboard-title">My Dashboard</h1>
                        <p className="dashboard-subtitle">
                            Manage your shops and products
                        </p>
                    </div>
                    <button 
                        className="seller-btn seller-btn-primary create-shop-btn"
                        onClick={() => setShowCreateShop(true)}
                    >
                        <span className="seller-btn-icon">🏪</span>
                        Create New Shop
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

            <div className="shops-grid">
                {shops.length === 0 ? (
                    <div className="no-shops-state">
                        <div className="no-shops-icon">🏪</div>
                        <h3>No shops yet</h3>
                        <p className="muted">
                            Start selling by creating your first shop
                        </p>
                        <button 
                            className="seller-btn seller-btn-primary"
                            onClick={() => setShowCreateShop(true)}
                        >
                            <span className="seller-btn-icon">🏪</span>
                            Create Your First Shop
                        </button>
                    </div>
                ) : (
                    shops.map((shop) => (
                        <div key={shop.id} className="shop-card">
                            <div className="shop-image">
                                {shop.coverPath ? (
                                    <img 
                                        src={getImageUrl(shop.coverPath)} 
                                        alt={shop.name}
                                        className="shop-cover"
                                    />
                                ) : (
                                    <div className="shop-image-placeholder">🏪</div>
                                )}
                                <img 
                                    src={shop.logoPath ? getImageUrl(shop.logoPath) : '/default-shop-logo.png'} 
                                    alt={`${shop.name} logo`}
                                    className="shop-logo"
                                    onError={(e) => {
                                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMzAiIGZpbGw9IiMzMzMiLz4KPHN2ZyB4PSIxNSIgeT0iMTUiIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJ3aGl0ZSI+CjxwYXRoIGQ9Ik0xMiAyTDIgN0wxMiAxMkwyMiA3TDEyIDJaIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTIgMTdMMTIgMjJMMjIgMTciIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNMiAxMkwxMiAxN0wyMiAxMiIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo8L3N2Zz4K'
                                    }}
                                />
                            </div>
                            <div className="shop-content">
                                <h3 className="shop-title">{shop.name}</h3>
                                {shop.category && (
                                    <div className="shop-category">
                                        <span className="category-tag">{shop.category}</span>
                                    </div>
                                )}
                                {shop.addressLine && (
                                    <p className="shop-address">
                                        📍 {shop.addressLine}
                                    </p>
                                )}
                                <p className="shop-description">
                                    {shop.description || 'No description available'}
                                </p>
                                <div className="shop-actions">
                                    <button 
                                        className="seller-btn seller-btn-primary seller-btn-sm"
                                        onClick={() => window.open(generateShopUrl(shop.name, shop.id), '_blank')}
                                    >
                                        <svg className="seller-btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                            <circle cx="12" cy="12" r="3"/>
                                        </svg>
                                        View Shop
                                    </button>
                                    <button 
                                        className="seller-btn seller-btn-primary seller-btn-sm"
                                        onClick={() => openManageProducts(shop)}
                                    >
                                        <svg className="seller-btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                                            <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
                                        </svg>
                                        Products
                                    </button>
                                    <button 
                                        className="seller-btn seller-btn-secondary seller-btn-sm"
                                        onClick={() => handleEditShop(shop)}
                                    >
                                        <svg className="seller-btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                            <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                        </svg>
                                        Edit
                                    </button>
                                    <button 
                                        className="seller-btn seller-btn-danger seller-btn-sm"
                                        onClick={() => handleDeleteShop(shop.id)}
                                    >
                                        <svg className="seller-btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M3 6h18"/>
                                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                                        </svg>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Create Shop Modal */}
            <Modal 
                isOpen={showCreateShop} 
                onClose={() => {
                    setShowCreateShop(false)
                    resetShopForm()
                }}
                title="Create New Shop"
                size="xlarge"
            >
                <form onSubmit={handleCreateShop} className="create-shop-form">
                    <div className="form-grid">
                        <div className="form-inputs">
                            <div className="form-group">
                                <label htmlFor="shopName" className="form-label">
                                    Shop Name *
                                </label>
                                <input
                                    type="text"
                                    id="shopName"
                                    className="input"
                                    value={shopForm.name}
                                    onChange={(e) => setShopForm({...shopForm, name: e.target.value})}
                                    required
                                    placeholder="Enter shop name"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="shopCategory" className="form-label">
                                    Shop Category
                                </label>
                                <CategorySelector
                                    value={{
                                        mainCategory: shopForm.mainCategory,
                                        subcategory: shopForm.subcategory,
                                        customCategory: shopForm.customCategory
                                    }}
                                    onChange={(categoryData) => {
                                        setShopForm({
                                            ...shopForm,
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
                                <label htmlFor="shopDescription" className="form-label">
                                    Shop Description
                                </label>
                                <textarea
                                    id="shopDescription"
                                    className="input"
                                    value={shopForm.description}
                                    onChange={(e) => setShopForm({...shopForm, description: e.target.value})}
                                    placeholder="Describe your shop, what you sell, your story..."
                                    rows={4}
                                    style={{ resize: 'vertical' }}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="shopPhone" className="form-label">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    id="shopPhone"
                                    className="input"
                                    value={shopForm.phone}
                                    onChange={(e) => setShopForm({...shopForm, phone: e.target.value})}
                                    placeholder="+63 912 345 6789"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="shopEmail" className="form-label">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="shopEmail"
                                    className="input"
                                    value={shopForm.email}
                                    onChange={(e) => setShopForm({...shopForm, email: e.target.value})}
                                    placeholder="shop@example.com"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="shopWebsite" className="form-label">
                                    Website
                                </label>
                                <input
                                    type="url"
                                    id="shopWebsite"
                                    className="input"
                                    value={shopForm.website}
                                    onChange={(e) => setShopForm({...shopForm, website: e.target.value})}
                                    placeholder="https://www.example.com"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="shopAddress" className="form-label">
                                    Address
                                </label>
                                <input
                                    type="text"
                                    id="shopAddress"
                                    className="input"
                                    value={shopForm.addressLine}
                                    onChange={(e) => setShopForm({...shopForm, addressLine: e.target.value})}
                                    placeholder="Enter your shop address"
                                />
                            </div>
                        </div>

                        <div className="form-preview">
                            {/* Shop Preview */}
                            <div className="form-group">
                                <label className="form-label">
                                    Shop Preview
                                </label>
                                <div className="shop-preview-card">
                                    <div className="shop-preview-image">
                                        {shopForm.coverPath ? (
                                            <img 
                                                src={getImageUrl(shopForm.coverPath)} 
                                                alt="Shop preview"
                                                className="shop-preview-cover"
                                            />
                                        ) : (
                                            <div className="shop-image-placeholder">🏪</div>
                                        )}
                                        {shopForm.logoPath && (
                                            <img 
                                                src={getImageUrl(shopForm.logoPath)} 
                                                alt="Shop logo preview"
                                                className="shop-preview-logo"
                                            />
                                        )}
                                    </div>
                                    <div className="shop-preview-content">
                                        <h3 className="shop-preview-title">
                                            {shopForm.name || 'Shop Name'}
                                        </h3>
                                        <p className="shop-preview-description">
                                            {shopForm.description || 'Shop description will appear here...'}
                                        </p>
                                        {(shopForm.mainCategory || shopForm.category) && (
                                            <div className="shop-preview-category">
                                                <span className="category-tag">
                                                    {shopForm.mainCategory || shopForm.category}
                                                </span>
                                            </div>
                                        )}
                                        {shopForm.addressLine && (
                                            <p className="shop-preview-address">
                                                📍 {shopForm.addressLine}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Map */}
                            <div className="form-group">
                                <label className="form-label">
                                    Shop Location
                                </label>
                                <LocationMap
                                    initialLat={shopForm.lat}
                                    initialLng={shopForm.lng}
                                    onLocationSelect={(lat, lng) => {
                                        setShopForm({...shopForm, lat, lng})
                                    }}
                                />
                                <small className="form-help">
                                    Click on the map or drag the marker to set your shop location
                                </small>
                            </div>
                        </div>
                    </div>

                    {/* Logo and Cover Uploads */}
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">
                                Shop Logo
                            </label>
                            <div className="logo-upload-section">
                                <div className="upload-preview">
                                    {shopForm.logoPath ? (
                                        <img 
                                            src={getImageUrl(shopForm.logoPath)} 
                                            alt="Current logo" 
                                        />
                                    ) : (
                                        <div className="default">🏪</div>
                                    )}
                                </div>
                                <div className="upload-controls">
                                    <div className="upload-buttons">
                                        <label className="upload-btn">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                                <polyline points="7,10 12,15 17,10"/>
                                                <line x1="12" y1="15" x2="12" y2="3"/>
                                            </svg>
                                            {shopForm.logoPath ? 'Change Logo' : 'Upload Logo'}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                style={{display: 'none'}}
                                                onChange={async (e) => {
                                                    if (e.target.files[0]) {
                                                        try {
                                                            const path = await onUpload(e.target.files[0], 'logos')
                                                            setShopForm({...shopForm, logoPath: path})
                                                        } catch (error) {
                                                            setError(error.message)
                                                        }
                                                    }
                                                }}
                                                disabled={uploading}
                                            />
                                        </label>
                                        {shopForm.logoPath && (
                                            <button 
                                                type="button" 
                                                className="btn-danger" 
                                                onClick={() => setShopForm({...shopForm, logoPath: ''})}
                                            >
                                                Remove Logo
                                            </button>
                                        )}
                                    </div>
                                    <div className="upload-info">
                                        Upload your shop logo (max 2MB). Supported formats: JPG, PNG, GIF
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">
                                Shop Cover Image
                            </label>
                            <div className="cover-upload-section">
                                <div className="upload-preview">
                                    {shopForm.coverPath ? (
                                        <img 
                                            src={getImageUrl(shopForm.coverPath)} 
                                            alt="Current cover" 
                                        />
                                    ) : (
                                        <div className="default">🖼️</div>
                                    )}
                                </div>
                                <div className="upload-controls">
                                    <div className="upload-buttons">
                                        <label className="upload-btn">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                                <polyline points="7,10 12,15 17,10"/>
                                                <line x1="12" y1="15" x2="12" y2="3"/>
                                            </svg>
                                            {shopForm.coverPath ? 'Change Cover' : 'Upload Cover'}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                style={{display: 'none'}}
                                                onChange={async (e) => {
                                                    if (e.target.files[0]) {
                                                        try {
                                                            const path = await onUpload(e.target.files[0], 'covers')
                                                            setShopForm({...shopForm, coverPath: path})
                                                        } catch (error) {
                                                            setError(error.message)
                                                        }
                                                    }
                                                }}
                                                disabled={uploading}
                                            />
                                        </label>
                                        {shopForm.coverPath && (
                                            <button 
                                                type="button" 
                                                className="btn-danger" 
                                                onClick={() => setShopForm({...shopForm, coverPath: ''})}
                                            >
                                                Remove Cover
                                            </button>
                                        )}
                                    </div>
                                    <div className="upload-info">
                                        Upload a cover image for your shop (max 2MB). Supported formats: JPG, PNG, GIF
                                    </div>
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
                                setShowCreateShop(false)
                                resetShopForm()
                            }}
                        >
                            Cancel
                        </button>
                        <LoadingButton 
                            type="submit" 
                            className="btn btn-primary submit-btn"
                            loading={uploading}
                            loadingText="Creating..."
                        >
                            Create Shop
                        </LoadingButton>
                    </div>
                </form>
            </Modal>

            {/* Edit Shop Modal */}
            <Modal 
                isOpen={showEditShop} 
                onClose={() => {
                    setShowEditShop(false)
                    setEditingShop(null)
                    resetShopForm()
                }}
                title={`Edit Shop - ${editingShop?.name || ''}`}
                size="xlarge"
            >
                <form onSubmit={handleUpdateShop} className="create-shop-form">
                    <div className="form-grid">
                        <div className="form-inputs">
                            {/* Logo and Cover Uploads at the top */}
                            <div className="form-group">
                                <label className="form-label">
                                    Shop Logo
                                </label>
                                <div className="logo-upload-section">
                                    <div className="upload-preview">
                                        {shopForm.logoPath ? (
                                            <img 
                                                src={getImageUrl(shopForm.logoPath)} 
                                                alt="Shop Logo" 
                                            />
                                        ) : (
                                            <div className="default">🏪</div>
                                        )}
                                    </div>
                                    <div className="upload-controls">
                                        <div className="upload-buttons">
                                            <label className="upload-btn">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                                    <polyline points="7,10 12,15 17,10"/>
                                                    <line x1="12" y1="15" x2="12" y2="3"/>
                                                </svg>
                                                {shopForm.logoPath ? 'Change Logo' : 'Upload Logo'}
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    style={{display: 'none'}}
                                                    onChange={async (e) => {
                                                        if (e.target.files[0]) {
                                                            try {
                                                                const path = await onUpload(e.target.files[0], 'logos')
                                                                setShopForm({...shopForm, logoPath: path})
                                                            } catch (error) {
                                                                setError(error.message)
                                                            }
                                                        }
                                                    }}
                                                    disabled={uploading}
                                                />
                                            </label>
                                            {shopForm.logoPath && (
                                                <button 
                                                    type="button" 
                                                    className="btn-danger"
                                                    onClick={() => setShopForm({...shopForm, logoPath: ''})}
                                                >
                                                    Remove Logo
                                                </button>
                                            )}
                                        </div>
                                        <div className="upload-info">
                                            Upload your shop logo (max 2MB). Supported formats: JPG, PNG, GIF
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Shop Cover Image
                                </label>
                                <div className="cover-upload-section">
                                    <div className="upload-preview">
                                        {shopForm.coverPath ? (
                                            <img 
                                                src={getImageUrl(shopForm.coverPath)} 
                                                alt="Shop Cover" 
                                            />
                                        ) : (
                                            <div className="default">🖼️</div>
                                        )}
                                    </div>
                                    <div className="upload-controls">
                                        <div className="upload-buttons">
                                            <label className="upload-btn">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                                    <polyline points="7,10 12,15 17,10"/>
                                                    <line x1="12" y1="15" x2="12" y2="3"/>
                                                </svg>
                                                {shopForm.coverPath ? 'Change Cover' : 'Upload Cover'}
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    style={{display: 'none'}}
                                                    onChange={async (e) => {
                                                        if (e.target.files[0]) {
                                                            try {
                                                                const path = await onUpload(e.target.files[0], 'covers')
                                                                setShopForm({...shopForm, coverPath: path})
                                                            } catch (error) {
                                                                setError(error.message)
                                                            }
                                                        }
                                                    }}
                                                    disabled={uploading}
                                                />
                                            </label>
                                            {shopForm.coverPath && (
                                                <button 
                                                    type="button" 
                                                    className="btn-danger" 
                                                    onClick={() => setShopForm({...shopForm, coverPath: ''})}
                                                >
                                                    Remove Cover
                                                </button>
                                            )}
                                        </div>
                                        <div className="upload-info">
                                            Upload a cover image for your shop (max 2MB). Supported formats: JPG, PNG, GIF
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Other form fields */}
                            <div className="form-group">
                                <label htmlFor="editShopName" className="form-label">
                                    Shop Name *
                                </label>
                                <input
                                    type="text"
                                    id="editShopName"
                                    className="input"
                                    value={shopForm.name}
                                    onChange={(e) => setShopForm({...shopForm, name: e.target.value})}
                                    required
                                    placeholder="Enter shop name"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="editShopCategory" className="form-label">
                                    Shop Category
                                </label>
                                <CategorySelector
                                    value={{
                                        mainCategory: shopForm.mainCategory,
                                        subcategory: shopForm.subcategory,
                                        customCategory: shopForm.customCategory
                                    }}
                                    onChange={(categoryData) => {
                                        setShopForm({
                                            ...shopForm,
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
                                <label htmlFor="editShopDescription" className="form-label">
                                    Shop Description
                                </label>
                                <textarea
                                    id="editShopDescription"
                                    className="input"
                                    value={shopForm.description}
                                    onChange={(e) => setShopForm({...shopForm, description: e.target.value})}
                                    placeholder="Describe your shop, what you sell, your story..."
                                    rows={4}
                                    style={{ resize: 'vertical' }}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="editShopPhone" className="form-label">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    id="editShopPhone"
                                    className="input"
                                    value={shopForm.phone}
                                    onChange={(e) => setShopForm({...shopForm, phone: e.target.value})}
                                    placeholder="+63 912 345 6789"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="editShopEmail" className="form-label">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="editShopEmail"
                                    className="input"
                                    value={shopForm.email}
                                    onChange={(e) => setShopForm({...shopForm, email: e.target.value})}
                                    placeholder="shop@example.com"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="editShopWebsite" className="form-label">
                                    Website
                                </label>
                                <input
                                    type="url"
                                    id="editShopWebsite"
                                    className="input"
                                    value={shopForm.website}
                                    onChange={(e) => setShopForm({...shopForm, website: e.target.value})}
                                    placeholder="https://www.example.com"
                                />
                            </div>

                                                         <div className="form-group">
                                 <label htmlFor="editShopAddress" className="form-label">
                                     Address
                                 </label>
                                 <input
                                     type="text"
                                     id="editShopAddress"
                                     className="input"
                                     value={shopForm.addressLine}
                                     onChange={(e) => setShopForm({...shopForm, addressLine: e.target.value})}
                                     placeholder="Enter your shop address"
                                 />
                             </div>

                             <BusinessHours
                                 value={shopForm.businessHoursJson}
                                 onChange={(value) => setShopForm(prev => ({ ...prev, businessHoursJson: value }))}
                             />
                        </div>

                        <div className="form-preview">
                            {/* Shop Preview */}
                            <div className="form-group">
                                <label className="form-label">
                                    Shop Preview
                                </label>
                                <div className="shop-preview-card">
                                    <div className="shop-preview-image">
                                        {shopForm.coverPath ? (
                                            <img 
                                                src={getImageUrl(shopForm.coverPath)} 
                                                alt="Shop preview"
                                                className="shop-preview-cover"
                                            />
                                        ) : (
                                            <div className="shop-image-placeholder">🏪</div>
                                        )}
                                        {shopForm.logoPath && (
                                            <img 
                                                src={getImageUrl(shopForm.logoPath)} 
                                                alt="Shop logo preview"
                                                className="shop-preview-logo"
                                            />
                                        )}
                                    </div>
                                    <div className="shop-preview-content">
                                        <h3 className="shop-preview-title">
                                            {shopForm.name || 'Shop Name'}
                                        </h3>
                                        <p className="shop-preview-description">
                                            {shopForm.description || 'Shop description will appear here...'}
                                        </p>
                                        {(shopForm.mainCategory || shopForm.category) && (
                                            <div className="shop-preview-category">
                                                <span className="category-tag">
                                                    {shopForm.mainCategory || shopForm.category}
                                                </span>
                                            </div>
                                        )}
                                        {shopForm.addressLine && (
                                            <p className="shop-preview-address">
                                                📍 {shopForm.addressLine}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Map */}
                            <div className="form-group">
                                <label className="form-label">
                                    Shop Location
                                </label>
                                <LocationMap
                                    initialLat={shopForm.lat}
                                    initialLng={shopForm.lng}
                                    onLocationSelect={(lat, lng) => {
                                        setShopForm({...shopForm, lat, lng})
                                    }}
                                />
                                <small className="form-help">
                                    Click on the map or drag the marker to set your shop location
                                </small>
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
                                setShowEditShop(false)
                                setEditingShop(null)
                                resetShopForm()
                            }}
                        >
                            Cancel
                        </button>
                        <LoadingButton 
                            type="submit" 
                            className="btn btn-primary submit-btn"
                            loading={uploading}
                            loadingText="Updating..."
                        >
                            Update Shop
                        </LoadingButton>
                    </div>
                </form>
            </Modal>
        </main>
    )
}
