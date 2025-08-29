import { useState, useEffect } from 'react'
import { useAuth } from '../auth/AuthContext.jsx'
import Modal from '../components/Modal.jsx'
import LocationMap from '../components/LocationMap.jsx'
import { createShopRequest, getUserShopsRequest, deleteShopRequest, updateShopRequest, fetchCategories } from '../api/shops.js'
import { generateShopUrl } from '../utils/slugUtils.js'
import { ResponsiveAd, InContentAd } from '../components/GoogleAds.jsx'
import { apiRequest } from '../api/client.js'

// Utility function to format image paths
const formatImagePath = (path) => {
  if (!path) return null
  // If path already starts with http/https, return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  // If path starts with /uploads, it's already correct
  if (path.startsWith('/uploads/')) {
    return path
  }
  // Otherwise, assume it's a relative path and add /uploads/
  return `/uploads/${path}`
}

// Add cache busting to image URLs
const getImageUrl = (path) => {
  const formattedPath = formatImagePath(path)
  if (!formattedPath) return null
  
  // Get the backend URL - use the same base as API requests
  const backendUrl = import.meta.env.VITE_API_BASE || 'http://localhost:8080/api'
  const baseUrl = backendUrl.replace('/api', '') // Remove /api to get just the base URL
  
  // Construct full URL to backend server
  const fullUrl = `${baseUrl}${formattedPath}`
  
  // Add timestamp to prevent caching issues
  const separator = fullUrl.includes('?') ? '&' : '?'
  return `${fullUrl}${separator}t=${Date.now()}`
}

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
        lat: 10.3157, // Default to Cebu City
        lng: 123.8854,
        logoPath: '',
        coverPath: ''
    })

    // Location selection state
    const [selectedLocation, setSelectedLocation] = useState(null)

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

    const onUpload = async (file) => {
        if (!file) {
            throw new Error('No file selected')
        }
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
            throw new Error('Please select an image file')
        }
        
        // Validate file size (max 2MB to match backend)
        if (file.size > 2 * 1024 * 1024) {
            throw new Error('File size must be less than 2MB')
        }
        
        setUploading(true)
        setError('')
        
        try {
            const fd = new FormData()
            fd.append('file', file, file.name) // Include filename
            
            const res = await apiRequest('/uploads/image', { method: 'POST', body: fd, token })
            console.log('Upload successful, path:', res.path)
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
            const data = await getUserShopsRequest(token)
            setShops(data)
            setLoading(false)
        } catch (error) {
            console.error('Failed to fetch shops:', error)
            setError('Failed to load your shops')
            setLoading(false)
        }
    }

    const handleLocationSelect = (location) => {
        setSelectedLocation(location)
        setShopForm(prev => ({
            ...prev,
            lat: location.lat,
            lng: location.lng,
            addressLine: location.addressLine || prev.addressLine
        }))
    }

    const handleCreateShop = async (e) => {
        e.preventDefault()
        
        if (!selectedLocation) {
            setError('Please select a location on the map')
            return
        }

        try {
            const newShopId = await createShopRequest(shopForm, token)
            // Refresh the shops list
            await fetchUserShops()
            setShowCreateShop(false)
            resetForm()
        } catch (error) {
            console.error('Failed to create shop:', error)
            setError('Failed to create shop: ' + error.message)
        }
    }

    const handleEditShop = async (e) => {
        e.preventDefault()
        
        if (!selectedLocation) {
            setError('Please select a location on the map')
            return
        }

        try {
            console.log('Saving shop with form data:', shopForm)
            await updateShopRequest(editingShop.id, shopForm, token)
            console.log('Shop updated successfully')
            // Refresh the shops list
            await fetchUserShops()
            setShowEditShop(false)
            setEditingShop(null)
            resetForm()
        } catch (error) {
            console.error('Failed to update shop:', error)
            setError('Failed to update shop: ' + error.message)
        }
    }

    const openEditShop = (shop) => {
        setEditingShop(shop)
        setShopForm({
            name: shop.name || '',
            description: shop.description || '',
            category: shop.category || '',
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
            coverPath: shop.coverPath || ''
        })
        setSelectedLocation({
            lat: shop.lat,
            lng: shop.lng,
            addressLine: shop.addressLine
        })
        setShowEditShop(true)
    }

    const resetForm = () => {
        setShopForm({
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
            coverPath: ''
        })
        setSelectedLocation(null)
    }

    const handleDeleteShop = async (shopId) => {
        if (!confirm('Are you sure you want to delete this shop? This action cannot be undone.')) {
            return
        }
        
        try {
            await deleteShopRequest(shopId, token)
            await fetchUserShops()
        } catch (error) {
            console.error('Failed to delete shop:', error)
            setError('Failed to delete shop: ' + error.message)
        }
    }

    if (loading) {
        return (
            <main className="container dashboard-container">
                <div className="dashboard-loading">
                    <div className="loading-spinner-large"></div>
                    <p className="muted">Loading your dashboard...</p>
                </div>
            </main>
        )
    }

    return (
        <main className="container dashboard-container">
            {/* Dashboard Header */}
            <div className="dashboard-header">
                <div className="dashboard-header-content">
                    <div>
                        <h1 className="dashboard-title">Seller Dashboard</h1>
                        <p className="dashboard-subtitle">Manage your shops and grow your business</p>
                    </div>
                    <div className="dashboard-stats">
                        <div className="stat-card">
                            <div className="stat-number">{shops.length}</div>
                            <div className="stat-label">Active Shops</div>
                        </div>
                    </div>
                </div>
            </div>

            {error && (
                <div className="error-banner">
                    <svg className="error-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                        <path d="M15 9L9 15M9 9L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    {error}
                </div>
            )}

            {/* Quick Actions */}
            <div className="quick-actions">
                <button 
                    className="create-shop-btn" 
                    onClick={() => setShowCreateShop(true)}
                >
                    <svg className="btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <span>Create New Shop</span>
                </button>
            </div>

            {/* Shops Section */}
            <section className="shops-section">
                <div className="section-header">
                    <h2 className="section-title">Your Shops</h2>
                    <p className="section-subtitle">Manage and monitor your business locations</p>
                </div>
                
                {shops.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">🏪</div>
                        <h3 className="empty-state-title">No shops yet</h3>
                        <p className="empty-state-description">
                            Create your first shop to start selling products and reaching customers
                        </p>
                        <button 
                            className="btn btn-primary" 
                            onClick={() => setShowCreateShop(true)}
                        >
                            Create Your First Shop
                        </button>
                    </div>
                ) : (
                    <div className="shops-grid">
                        {shops.map(shop => (
                            <div key={shop.id} className="card" style={{ 
                                padding: 0, 
                                overflow: "hidden",
                                borderRadius: "16px",
                                transition: "all 0.3s ease",
                                cursor: "pointer"
                            }}
                            onMouseEnter={(e) => e.target.style.transform = "translateY(-2px)"}
                            onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
                            >
                                {/* Shop Image */}
                                <div style={{ 
                                    height: "120px", 
                                    background: !shop.coverPath 
                                        ? "linear-gradient(135deg, var(--surface) 0%, var(--card) 100%)"
                                        : "transparent",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "var(--muted)",
                                    fontSize: "0.875rem",
                                    position: "relative",
                                    overflow: "hidden"
                                }}>
                                    {shop.coverPath ? (
                                        <img 
                                            src={getImageUrl(shop.coverPath)} 
                                            alt={`${shop.name} shop view`}
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                                objectPosition: "center"
                                            }}
                                            onError={(e) => {
                                                console.error('Shop view image failed to load:', e.target.src)
                                                e.target.style.display = 'none'
                                            }}
                                        />
                                    ) : (
                                        <div style={{ 
                                            display: "flex", 
                                            flexDirection: "column", 
                                            alignItems: "center", 
                                            gap: "0.5rem" 
                                        }}>
                                            <div style={{ fontSize: "1.5rem" }}>🏪</div>
                                            <span>Shop View</span>
                                        </div>
                                    )}
                                </div>

                                {/* Shop Details */}
                                <div style={{ padding: "0.75rem", position: "relative" }}>
                                    {/* Shop Logo Overlay */}
                                    {shop.logoPath && (
                                        <div style={{
                                            position: "absolute",
                                            top: "-30px",
                                            left: "20px",
                                            width: "60px",
                                            height: "60px",
                                            borderRadius: "50%",
                                            border: "3px solid var(--card)",
                                            overflow: "hidden",
                                            backgroundColor: "var(--card)",
                                            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                                            zIndex: 10
                                        }}>
                                            <img 
                                                src={getImageUrl(shop.logoPath)} 
                                                alt={`${shop.name} logo`} 
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    objectFit: "cover"
                                                }}
                                            />
                                        </div>
                                    )}
                                    
                                    {/* Shop Name */}
                                    <h3
                                        style={{
                                            margin: 0,
                                            marginBottom: "0.375rem",
                                            fontSize: "0.95rem",
                                            fontWeight: 600,
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                            marginLeft: shop.logoPath ? "80px" : "0"
                                        }}
                                    >
                                        {shop.name}
                                    </h3>
                                    
                                    {/* Category */}
                                    {shop.category && (
                                        <div style={{ marginBottom: "0.375rem" }}>
                                            <span className="pill" style={{ fontSize: "0.7rem", padding: "0.2rem 0.4rem" }}>
                                                {shop.category}
                                            </span>
                                        </div>
                                    )}
                                    
                                    {/* Location */}
                                    {shop.addressLine && (
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "0.5rem",
                                                fontSize: "0.75rem",
                                                color: "var(--muted)",
                                                marginBottom: "0.375rem",
                                            }}
                                        >
                                            <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M12 21s-7-6-7-11a7 7 0 1 1 14 0c0 5-7 11-7 11Z" />
                                                <circle cx="12" cy="10" r="2" />
                                            </svg>
                                            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                {shop.addressLine}
                                            </span>
                                        </div>
                                    )}

                                    {/* Description */}
                                    {shop.description && (
                                        <p style={{
                                            fontSize: "0.75rem",
                                            color: "var(--muted)",
                                            margin: "0 0 0.5rem 0",
                                            lineHeight: 1.4,
                                            display: "-webkit-box",
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: "vertical",
                                            overflow: "hidden"
                                        }}>
                                            {shop.description}
                                        </p>
                                    )}

                                    {/* Action Buttons */}
                                    <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
                                        <a 
                                            href={generateShopUrl(shop.name, shop.id)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                flex: 1,
                                                textDecoration: "none",
                                                color: "inherit"
                                            }}
                                        >
                                            <button
                                                className="btn btn-primary"
                                                style={{
                                                    width: "100%",
                                                    padding: "0.4rem",
                                                    borderRadius: "6px",
                                                    fontSize: "0.75rem",
                                                    fontWeight: 500,
                                                }}
                                            >
                                                View Shop
                                            </button>
                                        </a>
                                        <button 
                                            className="btn"
                                            onClick={() => openEditShop(shop)}
                                            style={{
                                                padding: "0.4rem 0.75rem",
                                                borderRadius: "6px",
                                                fontSize: "0.75rem",
                                                fontWeight: 500,
                                                background: "var(--surface)",
                                                border: "1px solid var(--border)",
                                                color: "var(--text)",
                                                cursor: "pointer",
                                                transition: "all 0.2s ease"
                                            }}
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            className="btn"
                                            onClick={() => handleDeleteShop(shop.id)}
                                            style={{
                                                padding: "0.4rem 0.75rem",
                                                borderRadius: "6px",
                                                fontSize: "0.75rem",
                                                fontWeight: 500,
                                                background: "var(--surface)",
                                                border: "1px solid var(--border)",
                                                color: "#ef4444",
                                                cursor: "pointer",
                                                transition: "all 0.2s ease"
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                 )}
                 
                 {/* Bottom ad after shops */}
                <div className="dashboard-ad">
                     <ResponsiveAd />
                 </div>
             </section>

            {/* Create Shop Modal */}
            <Modal 
                isOpen={showCreateShop} 
                onClose={() => {
                    setShowCreateShop(false)
                    resetForm()
                }}
                title="Create New Shop"
                size="xxlarge"
            >
                <form onSubmit={handleCreateShop} className="create-shop-form">
                    <div className="form-grid">
                        {/* Left Column - Form Inputs */}
                        <div className="form-inputs">
                            {/* Shop Name */}
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
                                    placeholder="Enter your shop name"
                                />
                            </div>

                            {/* Category */}
                            <div className="form-group">
                                <label htmlFor="shopCategory" className="form-label">
                                    Shop Category *
                                </label>
                                <select
                                    id="shopCategory"
                                    className="input"
                                    value={shopForm.category}
                                    onChange={(e) => setShopForm({...shopForm, category: e.target.value})}
                                    required
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Description */}
                            <div className="form-group">
                                <label htmlFor="shopDescription" className="form-label">
                                    Shop Description
                                </label>
                                <textarea
                                    id="shopDescription"
                                    className="input"
                                    value={shopForm.description}
                                    onChange={(e) => setShopForm({...shopForm, description: e.target.value})}
                                    placeholder="Describe your shop, what you sell, your specialties..."
                                    rows={4}
                                    style={{ resize: 'vertical' }}
                                />
                            </div>

                            {/* Address */}
                            <div className="form-group">
                                <label htmlFor="shopAddress" className="form-label">
                                    Address *
                                </label>
                                <input
                                    type="text"
                                    id="shopAddress"
                                    className="input"
                                    value={shopForm.addressLine}
                                    onChange={(e) => setShopForm({...shopForm, addressLine: e.target.value})}
                                    placeholder="Auto-filled from map or enter manually"
                                    required
                                    style={{ 
                                        backgroundColor: selectedLocation?.addressLine ? 'var(--surface)' : 'var(--card-2)',
                                        color: selectedLocation?.addressLine ? 'var(--text)' : 'var(--muted)'
                                    }}
                                />
                            </div>

                            {/* Contact Information */}
                            <div className="form-row">
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
                            </div>

                            {/* Website */}
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
                                    placeholder="https://your-shop-website.com"
                                />
                            </div>

                            {/* Social Media */}
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="shopFacebook" className="form-label">
                                        Facebook
                                    </label>
                                    <input
                                        type="url"
                                        id="shopFacebook"
                                        className="input"
                                        value={shopForm.facebook}
                                        onChange={(e) => setShopForm({...shopForm, facebook: e.target.value})}
                                        placeholder="https://facebook.com/yourpage"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="shopInstagram" className="form-label">
                                        Instagram
                                    </label>
                                    <input
                                        type="url"
                                        id="shopInstagram"
                                        className="input"
                                        value={shopForm.instagram}
                                        onChange={(e) => setShopForm({...shopForm, instagram: e.target.value})}
                                        placeholder="https://instagram.com/yourpage"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="shopTwitter" className="form-label">
                                    Twitter
                                </label>
                                <input
                                    type="url"
                                    id="shopTwitter"
                                    className="input"
                                    value={shopForm.twitter}
                                    onChange={(e) => setShopForm({...shopForm, twitter: e.target.value})}
                                    placeholder="https://twitter.com/yourpage"
                                />
                            </div>
                        </div>

                        {/* Right Column - Map */}
                        <div className="form-map">
                            <label className="form-label">
                                Shop Location *
                            </label>
                            <LocationMap 
                                onLocationSelect={handleLocationSelect}
                                initialLat={shopForm.lat}
                                initialLng={shopForm.lng}
                            />
                        </div>
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div className="form-error">
                            {error}
                        </div>
                    )}

                    {/* Form Actions */}
                    <div className="form-actions">
                        <button 
                            type="button" 
                            className="btn cancel-btn" 
                            onClick={() => {
                                setShowCreateShop(false)
                                resetForm()
                            }}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="btn btn-primary submit-btn"
                            disabled={!selectedLocation}
                        >
                            Create Shop
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Edit Shop Modal */}
            <Modal 
                isOpen={showEditShop} 
                onClose={() => {
                    setShowEditShop(false)
                    setEditingShop(null)
                    resetForm()
                }}
                title="Edit Shop"
                size="xxlarge"
            >
                <form onSubmit={handleEditShop} className="create-shop-form">
                    <div className="form-grid">
                        {/* Left Column - Form Inputs */}
                        <div className="form-inputs">
                            {/* Shop Images Upload - Top of form */}
                            <div className="form-group">
                                <label className="form-label">
                                    Shop Images
                                </label>
                                {uploading && (
                                    <div style={{ 
                                        padding: '0.5rem', 
                                        backgroundColor: 'var(--primary-bg)', 
                                        borderRadius: '8px',
                                        fontSize: '0.875rem',
                                        color: 'var(--primary)',
                                        marginBottom: '0.5rem'
                                    }}>
                                        📤 Uploading image...
                                    </div>
                                )}
                                <div style={{ 
                                    display: 'flex', 
                                    gap: '2rem', 
                                    alignItems: 'flex-start',
                                    justifyContent: 'space-between',
                                    flexWrap: 'wrap'
                                }}>
                                    {/* Debug info */}
                                    {process.env.NODE_ENV === 'development' && (
                                        <div style={{ 
                                            position: 'absolute', 
                                            top: '-30px', 
                                            left: '0', 
                                            fontSize: '0.7rem', 
                                            color: 'var(--muted)',
                                            backgroundColor: 'var(--card)',
                                            padding: '2px 6px',
                                            borderRadius: '4px',
                                            border: '1px solid var(--muted)'
                                        }}>
                                            Logo: {shopForm.logoPath || 'none'} | Shop View: {shopForm.coverPath || 'none'}
                                        </div>
                                    )}
                                    
                                    {/* Shop Logo */}
                                    <div style={{ 
                                        flex: '1 1 200px',
                                        minWidth: '200px',
                                        maxWidth: '250px'
                                    }}>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>
                                            Shop Logo
                                        </div>
                                        <div className="image-upload-container">
                                            <div className="image-preview">
                                                {shopForm.logoPath ? (
                                                    <>
                                                        <img src={shopForm.logoPath} alt="Shop logo" />
                                                        <div className="image-preview-overlay">
                                                            <div className="image-preview-overlay-content">
                                                                <button 
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        document.getElementById('logoUpload').click();
                                                                    }}
                                                                >
                                                                    Change
                                                                </button>
                                                                <button 
                                                                    type="button"
                                                                    className="remove-btn"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setShopForm({...shopForm, logoPath: ''});
                                                                    }}
                                                                >
                                                                    Remove
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="image-upload-placeholder">
                                                        <div className="upload-icon">📷</div>
                                                        <div>Upload Logo</div>
                                                        <div style={{fontSize: '0.7rem', opacity: 0.8}}>200x200px</div>
                                                    </div>
                                                )}
                                                <input 
                                                    id="logoUpload"
                                                    type="file" 
                                                    accept="image/*" 
                                                    className="image-upload-input"
                                                    disabled={uploading}
                                                                                                onChange={async (e)=>{ 
                                                const f = e.target.files?.[0]; 
                                                if(!f || uploading) return; 
                                                
                                                try {
                                                    const path = await onUpload(f); 
                                                    console.log('Setting logo path:', path);
                                                    setShopForm(prev => {
                                                        const updated = {...prev, logoPath: path};
                                                        console.log('Updated shopForm:', updated);
                                                        return updated;
                                                    });
                                                    setError(''); // Clear any previous errors
                                                } catch (error) {
                                                    setError(error.message);
                                                }
                                                
                                                // Reset the input value to allow re-uploading the same file
                                                e.target.value = '';
                                            }}  
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Shop View */}
                                    <div style={{ 
                                        flex: '1 1 200px',
                                        minWidth: '200px',
                                        maxWidth: '250px'
                                    }}>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>
                                            Shop View
                                        </div>
                                        <div className="image-upload-container">
                                            <div className="image-preview cover-preview">
                                                {shopForm.coverPath ? (
                                                    <>
                                                        <img src={getImageUrl(shopForm.coverPath)} alt="Shop view" />
                                                        <div className="image-preview-overlay">
                                                            <div className="image-preview-overlay-content">
                                                                <button 
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        document.getElementById('coverUpload').click();
                                                                    }}
                                                                >
                                                                    Change
                                                                </button>
                                                                <button 
                                                                    type="button"
                                                                    className="remove-btn"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setShopForm({...shopForm, coverPath: ''});
                                                                    }}
                                                                >
                                                                    Remove
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="image-upload-placeholder">
                                                        <div className="upload-icon">🏪</div>
                                                        <div>Upload Shop View</div>
                                                        <div style={{fontSize: '0.7rem', opacity: 0.8}}>Show what your shop looks like from outside</div>
                                                    </div>
                                                )}
                                                <input 
                                                    id="coverUpload"
                                                    type="file" 
                                                    accept="image/*" 
                                                    className="image-upload-input"
                                                    disabled={uploading}
                                                                                                onChange={async (e)=>{ 
                                                const f = e.target.files?.[0]; 
                                                if(!f || uploading) return; 
                                                
                                                try {
                                                    const path = await onUpload(f); 
                                                    console.log('Setting cover path:', path);
                                                    setShopForm(prev => {
                                                        const updated = {...prev, coverPath: path};
                                                        console.log('Updated shopForm:', updated);
                                                        return updated;
                                                    });
                                                    setError(''); // Clear any previous errors
                                                } catch (error) {
                                                    setError(error.message);
                                                }
                                                
                                                // Reset the input value to allow re-uploading the same file
                                                e.target.value = '';
                                            }}  
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                    {/* Shop Name */}
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
                            placeholder="Enter your shop name"
                        />
                    </div>

                    {/* Category */}
                            <div className="form-group">
                                <label htmlFor="editShopCategory" className="form-label">
                            Shop Category *
                        </label>
                        <select
                            id="editShopCategory"
                            className="input"
                            value={shopForm.category}
                            onChange={(e) => setShopForm({...shopForm, category: e.target.value})}
                            required
                        >
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Description */}
                            <div className="form-group">
                                <label htmlFor="editShopDescription" className="form-label">
                            Shop Description
                        </label>
                        <textarea
                            id="editShopDescription"
                            className="input"
                            value={shopForm.description}
                            onChange={(e) => setShopForm({...shopForm, description: e.target.value})}
                            placeholder="Describe your shop, what you sell, your specialties..."
                            rows={4}
                            style={{ resize: 'vertical' }}
                        />
                    </div>

                    {/* Address */}
                            <div className="form-group">
                                <label htmlFor="editShopAddress" className="form-label">
                            Address *
                        </label>
                        <input
                            type="text"
                            id="editShopAddress"
                            className="input"
                            value={shopForm.addressLine}
                            onChange={(e) => setShopForm({...shopForm, addressLine: e.target.value})}
                            placeholder="Auto-filled from map or enter manually"
                            required
                            style={{ 
                                backgroundColor: selectedLocation?.addressLine ? 'var(--surface)' : 'var(--card-2)',
                                color: selectedLocation?.addressLine ? 'var(--text)' : 'var(--muted)'
                            }}
                        />
                    </div>

                    {/* Contact Information */}
                            <div className="form-row">
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
                    </div>

                            {/* Website */}
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
                                    placeholder="https://your-shop-website.com"
                        />
                    </div>

                            {/* Social Media */}
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="editShopFacebook" className="form-label">
                                    Facebook
                                </label>
                                <input
                                    type="url"
                                    id="editShopFacebook"
                                    className="input"
                                    value={shopForm.facebook}
                                    onChange={(e) => setShopForm({...shopForm, facebook: e.target.value})}
                                    placeholder="https://facebook.com/yourpage"
                                />
                            </div>
                                <div className="form-group">
                                    <label htmlFor="editShopInstagram" className="form-label">
                                    Instagram
                                </label>
                                <input
                                    type="url"
                                    id="editShopInstagram"
                                    className="input"
                                    value={shopForm.instagram}
                                    onChange={(e) => setShopForm({...shopForm, instagram: e.target.value})}
                                    placeholder="https://instagram.com/yourpage"
                                />
                            </div>
                        </div>

                            <div className="form-group">
                                <label htmlFor="editShopTwitter" className="form-label">
                                    Twitter
                            </label>
                            <input
                                type="url"
                                id="editShopTwitter"
                                className="input"
                                value={shopForm.twitter}
                                onChange={(e) => setShopForm({...shopForm, twitter: e.target.value})}
                                placeholder="https://twitter.com/yourpage"
                            />
                        </div>
                    </div>

                        {/* Right Column - Map */}
                        <div className="form-map">
                            <label className="form-label">
                                Shop Location *
                            </label>
                            <LocationMap 
                                onLocationSelect={handleLocationSelect}
                                initialLat={shopForm.lat}
                                initialLng={shopForm.lng}
                            />

                    {/* Location Status */}
                    {selectedLocation && (
                        <div style={{ 
                            padding: '0.75rem', 
                            backgroundColor: 'var(--primary-bg)', 
                            borderRadius: '8px',
                            border: '1px solid var(--primary)',
                                    fontSize: '0.875rem',
                                    marginTop: '0.75rem'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                <span style={{ color: 'var(--primary)' }}>📍</span>
                                <span style={{ fontWeight: '500', color: 'var(--primary)' }}>Location Selected</span>
                            </div>
                            <div style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>
                                Coordinates: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                            </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div className="form-error">
                            {error}
                        </div>
                    )}

                    {/* Form Actions */}
                    <div className="form-actions">
                        <button 
                            type="button" 
                            className="btn cancel-btn" 
                            onClick={() => {
                                setShowEditShop(false)
                                setEditingShop(null)
                                resetForm()
                            }}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="btn btn-primary submit-btn"
                            disabled={!selectedLocation}
                        >
                            Update Shop
                        </button>
                    </div>
                </form>
            </Modal>
        </main>
    )
}
