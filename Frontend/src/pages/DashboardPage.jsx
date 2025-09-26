import React, { useState, useEffect } from 'react'
import { ArrowUp, MapPin, Image, HelpCircle } from 'lucide-react'
import { useAuth } from '../auth/AuthContext.jsx'
import { useTutorial } from '../contexts/TutorialContext.jsx'
import { dashboardTutorialSteps } from '../components/TutorialSteps.js'
import Modal from '../components/Modal.jsx'
import CategorySelector from '../components/CategorySelector.jsx'
import LocationMap from '../components/LocationMap.jsx'
import { SkeletonText, SkeletonSellerDashboard } from '../components/Skeleton.jsx'
import { LoadingSpinner, LoadingOverlay, LoadingButton } from '../components/Loading.jsx'
import { 
    getUserShopsRequest as fetchUserShopsApi, 
    createShopRequest as createShop, 
    updateShopRequest as updateShop, 
    deleteShopRequest as deleteShop,
    fetchCategories
} from '../api/shops.js'
import categoriesCache from '../utils/categoriesCache.js'
import { uploadImage, deleteImage } from '../api/products.js'
import { getImageUrl } from '../utils/imageUtils.js'
import { handleApiError } from '../utils/errorHandler.js'
import { generateShopUrl, generateShopSlug } from '../utils/slugUtils.js'
import ErrorDisplay from '../components/ErrorDisplay.jsx'
import BusinessHours from '../components/BusinessHours.jsx'
import '../dashboard.css'

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

export default function DashboardPage() {
    const { user, token } = useAuth()
    const { setTutorialSteps, isTutorialActive, shouldPrompt, startTutorial, tutorialCompleted } = useTutorial()
    const [shops, setShops] = useState([])
    const [showCreateShop, setShowCreateShop] = useState(false)
    const [showEditShop, setShowEditShop] = useState(false)
    const [editingShop, setEditingShop] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [categories, setCategories] = useState([])
    const [uploading, setUploading] = useState(false)
    const [showBackToTop, setShowBackToTop] = useState(false)

    // Mock shops for tutorial demonstration
    const mockShops = [
        {
            id: 'mock-1',
            name: 'Sample Coffee Shop',
            description: 'A cozy neighborhood coffee shop serving premium coffee and pastries.',
            category: 'Food & Beverage',
            addressLine: '123 Main Street, Downtown',
            phone: '+1 (555) 123-4567',
            website: 'https://samplecoffee.com',
            email: 'info@samplecoffee.com',
            logoPath: '/default-shop-logo.png',
            coverPath: '/default-shop-cover.jpg',
            lat: 10.3157,
            lng: 123.8854,
            isMock: true
        },
        {
            id: 'mock-2',
            name: 'Local Art Gallery',
            description: 'Showcasing local artists and hosting community art events.',
            category: 'Arts & Culture',
            addressLine: '456 Art District, Midtown',
            phone: '+1 (555) 987-6543',
            website: 'https://localartgallery.com',
            email: 'contact@localartgallery.com',
            logoPath: '/default-shop-logo.png',
            coverPath: '/default-shop-cover.jpg',
            lat: 10.3200,
            lng: 123.8900,
            isMock: true
        },
        {
            id: 'mock-3',
            name: 'Green Thumb Garden Center',
            description: 'Your one-stop shop for plants, gardening tools, and expert advice.',
            category: 'Home & Garden',
            addressLine: '789 Garden Way, Uptown',
            phone: '+1 (555) 456-7890',
            website: 'https://greenthumbgardens.com',
            email: 'hello@greenthumbgardens.com',
            logoPath: '/default-shop-logo.png',
            coverPath: '/default-shop-cover.jpg',
            lat: 10.3100,
            lng: 123.8800,
            isMock: true
        }
    ]

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
        // Set tutorial steps for dashboard
        setTutorialSteps(dashboardTutorialSteps)
        
        fetchUserShops()
        fetchCategoriesData()
    }, [setTutorialSteps])

    useEffect(() => {
        const onScroll = () => setShowBackToTop(window.scrollY > 300)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

    const fetchCategoriesData = async () => {
        try {
            // Check cache first
            const cachedCategories = categoriesCache.get()
            if (cachedCategories && cachedCategories.length > 0) {
                console.log('DashboardPage: Using cached categories')
                setCategories(cachedCategories)
                return
            }
            
            // Fetch from API if not cached
            console.log('DashboardPage: Loading categories from API...')
            const data = await fetchCategories()
            const categoriesData = data.categories || []
            
            // Cache the categories
            categoriesCache.set(categoriesData)
            setCategories(categoriesData)
        } catch (error) {
            console.error('Failed to fetch categories:', error)
        }
    }

    const onUpload = async (file, type = 'general', oldImageUrl = null) => {
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
            
            // Delete old image if it exists and is different from new one
            if (oldImageUrl && oldImageUrl !== res.path) {
                try {
                    await deleteImage(oldImageUrl, token)
                } catch (deleteError) {
                    console.warn('Failed to delete old image:', deleteError)
                    // Don't throw error here, just log it
                }
            }
            
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
            // Clean up old images that are being replaced
            const oldImageUrls = []
            
            // Check if logo was changed
            if (editingShop.logoPath && editingShop.logoPath !== shopForm.logoPath) {
                oldImageUrls.push(editingShop.logoPath)
            }
            
            // Check if cover was changed
            if (editingShop.coverPath && editingShop.coverPath !== shopForm.coverPath) {
                oldImageUrls.push(editingShop.coverPath)
            }
            
            const shopData = {
                ...shopForm,
                ...formatCategoryData({
                    mainCategory: shopForm.mainCategory,
                    subcategory: shopForm.subcategory,
                    customCategory: shopForm.customCategory
                }),
                offeringType: shopForm.offeringType || 'both',
                showcasePriority: shopForm.showcasePriority || 'products'
            }
            
            const updatedShop = await updateShop(editingShop.id, shopData, token)
            setShops(shops.map(shop => shop.id === editingShop.id ? updatedShop : shop))
            setShowEditShop(false)
            setEditingShop(null)
            resetShopForm()
            
            // Delete old images from cloud storage after successful update
            for (const oldImageUrl of oldImageUrls) {
                if (oldImageUrl && oldImageUrl.startsWith('https://storage.googleapis.com/')) {
                    try {
                        await deleteImage(oldImageUrl, token)
                    } catch (error) {
                        console.error('Failed to delete old shop image from cloud storage:', error)
                        // Continue even if deletion fails
                    }
                }
            }
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
            businessHoursJson: shop.businessHoursJson || '',
            offeringType: (shop.offeringType || 'both'),
            showcasePriority: (shop.showcasePriority || 'products')
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

    // Shop Management Functions - Now handled in ShopManagementPage
    const openManageShop = async (shop) => {
        // Navigate to the unified shop management page using slug
        const shopSlug = generateShopSlug(shop.name, shop.id)
        window.location.href = `/shop-management/${shopSlug}`
    }

    if (loading) {
        return (
            <main className="container seller-dashboard-container">
                <SkeletonSellerDashboard />
            </main>
        )
    }

    return (
        <>
        <main className="container seller-dashboard-container">
            <div className="dashboard-header">
                <div className="dashboard-header-content">
                    <div>
                        <h1 className="dashboard-title">My Dashboard</h1>
                        <p className="dashboard-subtitle">
                            Manage your shops and products
                        </p>
                        {(!isTutorialActive && (!tutorialCompleted || shouldPrompt)) && (
                          <button 
                            className="seller-btn seller-btn-secondary seller-btn-sm"
                            onClick={() => startTutorial()}
                            style={{ marginTop: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                            data-tutorial="dashboard-tutorial-indicator"
                            aria-label="Start dashboard tutorial"
                          >
                            <HelpCircle size={16} />
                            Take a quick tour
                          </button>
                        )}
                    </div>
                    <button 
                        className="seller-btn seller-btn-primary create-shop-btn"
                        data-tutorial="create-shop-btn"
                        onClick={() => window.location.href = '/shops/create'}
                    >
                        <span className="seller-btn-icon"><StoreIcon width={16} height={16} /></span>
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

            <div className="shops-grid" data-tutorial="shops-grid">
                {shops.length === 0 && !isTutorialActive ? (
                    <div className="no-shops-state" data-tutorial="no-shops-state">
                        <div className="no-shops-icon"><StoreIcon width={48} height={48} /></div>
                        <h3>No shops yet</h3>
                        <p className="muted">
                            Start selling by creating your first shop
                        </p>
                        <button 
                            className="seller-btn seller-btn-primary"
                            onClick={() => window.location.href = '/shops/create'}
                        >
                            <span className="seller-btn-icon"><StoreIcon width={16} height={16} /></span>
                            Create Your First Shop
                        </button>
                    </div>
                ) : (
                    // Show mock shops during tutorial if user has no shops, otherwise show real shops
                    (shops.length === 0 && isTutorialActive ? mockShops : shops).map((shop) => (
                        <div key={shop.id} className={`shop-card ${shop.isMock ? 'mock-shop' : ''}`} 
                             style={{ cursor: shop.isMock ? 'default' : 'pointer' }}
                             onClick={shop.isMock ? undefined : () => window.open(generateShopUrl(shop.name, shop.id), '_blank')}>
                            {shop.isMock && (
                                <div className="mock-shop-badge">
                                    <span className="mock-badge-text">Demo Shop</span>
                                </div>
                            )}
                            <div className="shop-image">
                                {shop.coverPath ? (
                                    <img 
                                        src={shop.isMock ? shop.coverPath : getImageUrl(shop.coverPath)} 
                                        alt={shop.name}
                                        className="shop-cover"
                                    />
                                ) : (
                                    <div className="shop-image-placeholder"><StoreIcon width={24} height={24} /></div>
                                )}
                                <img 
                                    src={shop.isMock ? shop.logoPath : (shop.logoPath ? getImageUrl(shop.logoPath) : '/default-shop-logo.png')} 
                                    alt={`${shop.name} logo`}
                                    className="shop-logo"
                                    onError={(e) => {
                                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMzAiIGZpbGw9IiM2MzY2ZjEiLz4KPHN2ZyB4PSIxNSIgeT0iMTUiIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiPgo8cGF0aCBkPSJNMiAzaDIwdjE0SDJ6Ii8+CjxwYXRoIGQ9Ik0yIDE3aDIwdjRIMnoiLz4KPHBhdGggZD0iTTYgN2g0Ii8+CjxwYXRoIGQ9Ik02IDExaDR6Ii8+CjxwYXRoIGQ9Ik0xNCA3aDR6Ii8+CjxwYXRoIGQ9Ik0xNCAxMWg0eiIvPgo8L3N2Zz4KPC9zdmc+'
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
                                        <MapPin size={14} /> {shop.addressLine}
                                    </p>
                                )}
                                <p className="shop-description">
                                    {shop.description || 'No description available'}
                                </p>
                                <div className="shop-actions" data-tutorial="shop-actions">
                                    <button 
                                        className={`seller-btn seller-btn-primary seller-btn-sm ${shop.isMock ? 'disabled' : ''}`}
                                        onClick={shop.isMock ? undefined : () => window.open(generateShopUrl(shop.name, shop.id), '_blank')}
                                        disabled={shop.isMock}
                                        title={shop.isMock ? 'Demo shop - not interactive' : 'View shop'}
                                    >
                                        <svg className="seller-btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                            <circle cx="12" cy="12" r="3"/>
                                        </svg>
                                        {shop.isMock ? 'Demo View' : 'View Shop'}
                                    </button>
                                    <button 
                                        className={`seller-btn seller-btn-primary seller-btn-sm ${shop.isMock ? 'disabled' : ''}`}
                                        onClick={shop.isMock ? undefined : () => openManageShop(shop)}
                                        disabled={shop.isMock}
                                        title={shop.isMock ? 'Demo shop - not interactive' : 'Manage shop'}
                                    >
                                        <svg className="seller-btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                                            <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
                                        </svg>
                                        {shop.isMock ? 'Demo Manage' : 'Manage Shop'}
                                    </button>
                                    <button 
                                        className={`seller-btn seller-btn-secondary seller-btn-sm ${shop.isMock ? 'disabled' : ''}`}
                                        onClick={shop.isMock ? undefined : () => window.location.href = `/shops/${generateShopSlug(shop.name, shop.id)}/edit`}
                                        disabled={shop.isMock}
                                        title={shop.isMock ? 'Demo shop - not interactive' : 'Edit shop'}
                                    >
                                        <svg className="seller-btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                            <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                        </svg>
                                        {shop.isMock ? 'Demo Edit' : 'Edit'}
                                    </button>
                                    <button 
                                        className={`seller-btn seller-btn-danger seller-btn-sm ${shop.isMock ? 'disabled' : ''}`}
                                        onClick={shop.isMock ? undefined : () => handleDeleteShop(shop.id)}
                                        disabled={shop.isMock}
                                        title={shop.isMock ? 'Demo shop - not interactive' : 'Delete shop'}
                                    >
                                        <svg className="seller-btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M3 6h18"/>
                                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                                        </svg>
                                        {shop.isMock ? 'Demo Delete' : 'Delete'}
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
                                                                        placeholder="Address is auto-filled from map selection"
                                    disabled
                                    style={{ backgroundColor: 'var(--input-disabled-bg, #f5f5f5)', cursor: 'not-allowed' }}
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
                                            <div className="shop-image-placeholder"><StoreIcon width={24} height={24} /></div>
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
                                                <MapPin size={14} /> {shopForm.addressLine}
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
                                    onLocationSelect={(locationData) => {
                                        setShopForm({
                                            ...shopForm, 
                                            lat: locationData.lat, 
                                            lng: locationData.lng,
                                            addressLine: locationData.addressLine || locationData.fullAddress || '',
                                            barangay: locationData.barangay || '',
                                            city: locationData.city || ''
                                        })
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
                                        <>
                                            <img 
                                                src={getImageUrl(shopForm.logoPath)} 
                                                alt="Current logo" 
                                            />
                                            <button 
                                                type="button" 
                                                className="image-delete-btn"
                                                onClick={async () => {
                                                    const oldLogoPath = shopForm.logoPath
                                                    setShopForm({...shopForm, logoPath: ''})
                                                    
                                                    // Delete from cloud storage
                                                    if (oldLogoPath && oldLogoPath.startsWith('https://storage.googleapis.com/')) {
                                                        try {
                                                            await deleteImage(oldLogoPath, token)
                                                        } catch (error) {
                                                            console.error('Failed to delete logo from cloud storage:', error)
                                                        }
                                                    }
                                                }}
                                                title="Remove logo"
                                            />
                                        </>
                                    ) : (
                                        <div className="default"><StoreIcon width={24} height={24} /></div>
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
                                                            const path = await onUpload(e.target.files[0], 'shops', shopForm.logoPath)
                                                            setShopForm({...shopForm, logoPath: path})
                                                        } catch (error) {
                                                            setError(error.message)
                                                        }
                                                    }
                                                }}
                                                disabled={uploading}
                                            />
                                        </label>
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
                                        <>
                                            <img 
                                                src={getImageUrl(shopForm.coverPath)} 
                                                alt="Current cover" 
                                            />
                                            <button 
                                                type="button" 
                                                className="image-delete-btn"
                                                onClick={async () => {
                                                    const oldCoverPath = shopForm.coverPath
                                                    setShopForm({...shopForm, coverPath: ''})
                                                    
                                                    // Delete from cloud storage
                                                    if (oldCoverPath && oldCoverPath.startsWith('https://storage.googleapis.com/')) {
                                                        try {
                                                            await deleteImage(oldCoverPath, token)
                                                        } catch (error) {
                                                            console.error('Failed to delete cover from cloud storage:', error)
                                                        }
                                                    }
                                                }}
                                                title="Remove cover image"
                                            />
                                        </>
                                    ) : (
                                        <div className="default"><Image size={24} /></div>
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
                                                            const path = await onUpload(e.target.files[0], 'shops', shopForm.coverPath)
                                                            setShopForm({...shopForm, coverPath: path})
                                                        } catch (error) {
                                                            setError(error.message)
                                                        }
                                                    }
                                                }}
                                                disabled={uploading}
                                            />
                                        </label>
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
                                            <>
                                                <img 
                                                    src={getImageUrl(shopForm.logoPath)} 
                                                    alt="Shop Logo" 
                                                />
                                                <button 
                                                    type="button" 
                                                    className="image-delete-btn"
                                                    onClick={async () => {
                                                        const oldLogoPath = shopForm.logoPath
                                                        setShopForm({...shopForm, logoPath: ''})
                                                        
                                                        // Delete from cloud storage
                                                        if (oldLogoPath && oldLogoPath.startsWith('https://storage.googleapis.com/')) {
                                                            try {
                                                                await deleteImage(oldLogoPath, token)
                                                            } catch (error) {
                                                                console.error('Failed to delete logo from cloud storage:', error)
                                                            }
                                                        }
                                                    }}
                                                    title="Remove logo"
                                                />
                                            </>
                                        ) : (
                                            <div className="default"><StoreIcon width={24} height={24} /></div>
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
                                                                const path = await onUpload(e.target.files[0], 'shops', shopForm.logoPath)
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
                                                    onClick={async () => {
                                                        const oldLogoPath = shopForm.logoPath
                                                        setShopForm({...shopForm, logoPath: ''})
                                                        
                                                        // Delete from cloud storage
                                                        if (oldLogoPath && oldLogoPath.startsWith('https://storage.googleapis.com/')) {
                                                            try {
                                                                await deleteImage(oldLogoPath, token)
                                                            } catch (error) {
                                                                console.error('Failed to delete logo from cloud storage:', error)
                                                            }
                                                        }
                                                    }}
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
                                            <>
                                                <img 
                                                    src={getImageUrl(shopForm.coverPath)} 
                                                    alt="Shop Cover" 
                                                />
                                                <button 
                                                    type="button" 
                                                    className="image-delete-btn"
                                                    onClick={async () => {
                                                        const oldCoverPath = shopForm.coverPath
                                                        setShopForm({...shopForm, coverPath: ''})
                                                        
                                                        // Delete from cloud storage
                                                        if (oldCoverPath && oldCoverPath.startsWith('https://storage.googleapis.com/')) {
                                                            try {
                                                                await deleteImage(oldCoverPath, token)
                                                            } catch (error) {
                                                                console.error('Failed to delete cover from cloud storage:', error)
                                                            }
                                                        }
                                                    }}
                                                    title="Remove cover image"
                                                />
                                            </>
                                        ) : (
                                            <div className="default"><Image size={24} /></div>
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
                                                                const path = await onUpload(e.target.files[0], 'shops', shopForm.coverPath)
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
                                                    onClick={async () => {
                                                        const oldCoverPath = shopForm.coverPath
                                                        setShopForm({...shopForm, coverPath: ''})
                                                        
                                                        // Delete from cloud storage
                                                        if (oldCoverPath && oldCoverPath.startsWith('https://storage.googleapis.com/')) {
                                                            try {
                                                                await deleteImage(oldCoverPath, token)
                                                            } catch (error) {
                                                                console.error('Failed to delete cover from cloud storage:', error)
                                                            }
                                                        }
                                                    }}
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

                            {/* Shop Offering & Showcase Priority */}
                            <div className="form-group">
                                <label className="form-label">Shop Offering</label>
                                <div className="radio-group">
                                    <label className="radio">
                                        <input
                                            type="radio"
                                            name="offeringType"
                                            checked={(shopForm.offeringType || 'both') === 'products'}
                                            onChange={() => setShopForm({ ...shopForm, offeringType: 'products' })}
                                        />
                                        <span>Products only</span>
                                    </label>
                                    <label className="radio">
                                        <input
                                            type="radio"
                                            name="offeringType"
                                            checked={(shopForm.offeringType || 'both') === 'services'}
                                            onChange={() => setShopForm({ ...shopForm, offeringType: 'services' })}
                                        />
                                        <span>Services only</span>
                                    </label>
                                    <label className="radio">
                                        <input
                                            type="radio"
                                            name="offeringType"
                                            checked={(shopForm.offeringType || 'both') === 'both'}
                                            onChange={() => setShopForm({ ...shopForm, offeringType: 'both' })}
                                        />
                                        <span>Both</span>
                                    </label>
                                </div>
                            </div>

                            {(shopForm.offeringType || 'both') === 'both' && (
                                <div className="form-group">
                                    <label className="form-label">Showcase Priority</label>
                                    <div className="radio-group">
                                        <label className="radio">
                                            <input
                                                type="radio"
                                                name="showcasePriority"
                                                checked={(shopForm.showcasePriority || 'products') === 'products'}
                                                onChange={() => setShopForm({ ...shopForm, showcasePriority: 'products' })}
                                            />
                                            <span>Show Products first</span>
                                        </label>
                                        <label className="radio">
                                            <input
                                                type="radio"
                                                name="showcasePriority"
                                                checked={(shopForm.showcasePriority || 'products') === 'services'}
                                                onChange={() => setShopForm({ ...shopForm, showcasePriority: 'services' })}
                                            />
                                            <span>Show Services first</span>
                                        </label>
                                    </div>
                                </div>
                            )}

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
                                            <div className="shop-image-placeholder"><StoreIcon width={24} height={24} /></div>
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
                                                <MapPin size={14} /> {shopForm.addressLine}
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
                                    onLocationSelect={(locationData) => {
                                        setShopForm({
                                            ...shopForm, 
                                            lat: locationData.lat, 
                                            lng: locationData.lng,
                                            addressLine: locationData.addressLine || locationData.fullAddress || '',
                                            barangay: locationData.barangay || '',
                                            city: locationData.city || ''
                                        })
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
        {showBackToTop && (
            <button className="back-to-top-btn" onClick={scrollToTop} title="Back to top" aria-label="Back to top">
                <ArrowUp size={18} aria-hidden />
            </button>
        )}
        </>
    )
}
