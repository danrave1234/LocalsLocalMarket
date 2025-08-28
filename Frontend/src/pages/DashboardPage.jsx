import { useState, useEffect } from 'react'
import { useAuth } from '../auth/AuthContext.jsx'
import Modal from '../components/Modal.jsx'
import LocationMap from '../components/LocationMap.jsx'
import { createShopRequest, getUserShopsRequest, deleteShopRequest, updateShopRequest } from '../api/shops.js'
import { generateShopUrl } from '../utils/slugUtils.js'
import { ResponsiveAd, InContentAd } from '../components/GoogleAds.jsx'

export default function DashboardPage() {
    const { user, token } = useAuth()
    const [shops, setShops] = useState([])
    const [showCreateShop, setShowCreateShop] = useState(false)
    const [showEditShop, setShowEditShop] = useState(false)
    const [editingShop, setEditingShop] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    // Shop form state
    const [shopForm, setShopForm] = useState({
        name: '',
        addressLine: '',
        phone: '',
        website: '',
        email: '',
        facebook: '',
        instagram: '',
        twitter: '',
        lat: 10.3157, // Default to Cebu City
        lng: 123.8854
    })

    // Location selection state
    const [selectedLocation, setSelectedLocation] = useState(null)

    useEffect(() => {
        fetchUserShops()
    }, [])

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
            await updateShopRequest(editingShop.id, shopForm, token)
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
            addressLine: shop.addressLine || '',
            phone: shop.phone || '',
            website: shop.website || '',
            email: shop.email || '',
            facebook: shop.facebook || '',
            instagram: shop.instagram || '',
            twitter: shop.twitter || '',
            lat: shop.lat || 10.3157,
            lng: shop.lng || 123.8854
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
            addressLine: '',
            phone: '',
            website: '',
            email: '',
            facebook: '',
            instagram: '',
            twitter: '',
            lat: 10.3157,
            lng: 123.8854
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
            <main className="container" style={{ padding: '2rem', textAlign: 'center' }}>
                <div className="muted">Loading dashboard...</div>
            </main>
        )
    }

    return (
        <main className="container" style={{ padding: '2rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ margin: 0, marginBottom: '0.5rem' }}>Seller Dashboard</h1>
                <p className="muted">Manage your shops and products</p>
            </div>

            {error && (
                <div style={{ 
                    backgroundColor: 'var(--error-bg)', 
                    color: 'var(--error)', 
                    padding: '0.75rem', 
                    borderRadius: '8px', 
                    marginBottom: '1rem',
                    fontSize: '0.9rem'
                }}>
                    {error}
                </div>
            )}

            {/* Quick Actions */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '1rem', 
                marginBottom: '2rem' 
            }}>
                <button 
                    className="btn btn-primary" 
                    onClick={() => setShowCreateShop(true)}
                    style={{ padding: '1rem', textAlign: 'center' }}
                >
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🏪</div>
                    Create New Shop
                </button>
            </div>

            {/* Shops Section */}
            <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ marginBottom: '1rem' }}>Your Shops</h2>
                {shops.length === 0 ? (
                    <div className="card" style={{ 
                        textAlign: 'center', 
                        padding: '2rem',
                        backgroundColor: 'var(--card-2)',
                        border: '2px dashed var(--border)'
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏪</div>
                        <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>No shops yet</h3>
                        <p className="muted" style={{ marginBottom: '1rem' }}>
                            Create your first shop to start selling products
                        </p>
                        <button 
                            className="btn btn-primary" 
                            onClick={() => setShowCreateShop(true)}
                        >
                            Create Your First Shop
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {shops.map(shop => (
                            <div key={shop.id} className="card" style={{ padding: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ margin: 0, marginBottom: '0.25rem' }}>{shop.name}</h3>
                                        {shop.addressLine && (
                                            <p className="muted" style={{ margin: 0, marginBottom: '0.5rem' }}>
                                                {shop.addressLine}
                                            </p>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <a 
                                            href={generateShopUrl(shop.name, shop.id)}
                                            className="btn"
                                            style={{ textDecoration: 'none' }}
                                        >
                                            View Shop
                                        </a>
                                        <button 
                                            className="btn"
                                            onClick={() => openEditShop(shop)}
                                            style={{ 
                                                backgroundColor: 'var(--surface)', 
                                                color: 'var(--text)',
                                                border: '1px solid var(--border)'
                                            }}
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            className="btn"
                                            onClick={() => handleDeleteShop(shop.id)}
                                            style={{ 
                                                backgroundColor: 'var(--error-bg)', 
                                                color: 'var(--error)',
                                                border: '1px solid var(--error)'
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
                 <div style={{ marginTop: '2rem', padding: '1rem 0', borderTop: '1px solid var(--border)' }}>
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
                size="large"
            >
                <form onSubmit={handleCreateShop} style={{ display: 'grid', gap: '1.5rem' }}>
                    {/* Shop Name */}
                    <div>
                        <label htmlFor="shopName" className="muted" style={{ display: 'block', marginBottom: '0.5rem' }}>
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

                    {/* Location Map */}
                    <div>
                        <label className="muted" style={{ display: 'block', marginBottom: '0.5rem' }}>
                            Shop Location *
                        </label>
                        <LocationMap 
                            onLocationSelect={handleLocationSelect}
                            initialLat={shopForm.lat}
                            initialLng={shopForm.lng}
                        />
                    </div>

                    {/* Address */}
                    <div>
                        <label htmlFor="shopAddress" className="muted" style={{ display: 'block', marginBottom: '0.5rem' }}>
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
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label htmlFor="shopPhone" className="muted" style={{ display: 'block', marginBottom: '0.5rem' }}>
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                id="shopPhone"
                                className="input"
                                value={shopForm.phone}
                                onChange={(e) => setShopForm({...shopForm, phone: e.target.value})}
                                placeholder="Enter phone number"
                            />
                        </div>
                        <div>
                            <label htmlFor="shopEmail" className="muted" style={{ display: 'block', marginBottom: '0.5rem' }}>
                                Email
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

                    <div>
                        <label htmlFor="shopWebsite" className="muted" style={{ display: 'block', marginBottom: '0.5rem' }}>
                            Website
                        </label>
                        <input
                            type="url"
                            id="shopWebsite"
                            className="input"
                            value={shopForm.website}
                            onChange={(e) => setShopForm({...shopForm, website: e.target.value})}
                            placeholder="https://example.com"
                        />
                    </div>

                    {/* Social Media Links */}
                    <div>
                        <label className="muted" style={{ display: 'block', marginBottom: '0.5rem' }}>
                            Social Media Links (Optional)
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label htmlFor="shopFacebook" className="muted" style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
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
                            <div>
                                <label htmlFor="shopInstagram" className="muted" style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
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
                        <div style={{ marginTop: '1rem' }}>
                            <label htmlFor="shopTwitter" className="muted" style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                                Twitter/X
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

                    {/* Location Status */}
                    {selectedLocation && (
                        <div style={{ 
                            padding: '0.75rem', 
                            backgroundColor: 'var(--primary-bg)', 
                            borderRadius: '8px',
                            border: '1px solid var(--primary)',
                            fontSize: '0.875rem'
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

                    {/* Form Actions */}
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                        <button 
                            type="button" 
                            className="btn" 
                            onClick={() => {
                                setShowCreateShop(false)
                                resetForm()
                            }}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="btn btn-primary"
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
                size="large"
            >
                <form onSubmit={handleEditShop} style={{ display: 'grid', gap: '1.5rem' }}>
                    {/* Shop Name */}
                    <div>
                        <label htmlFor="editShopName" className="muted" style={{ display: 'block', marginBottom: '0.5rem' }}>
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

                    {/* Location Map */}
                    <div>
                        <label className="muted" style={{ display: 'block', marginBottom: '0.5rem' }}>
                            Shop Location *
                        </label>
                        <LocationMap 
                            onLocationSelect={handleLocationSelect}
                            initialLat={shopForm.lat}
                            initialLng={shopForm.lng}
                        />
                    </div>

                    {/* Address */}
                    <div>
                        <label htmlFor="editShopAddress" className="muted" style={{ display: 'block', marginBottom: '0.5rem' }}>
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
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label htmlFor="editShopPhone" className="muted" style={{ display: 'block', marginBottom: '0.5rem' }}>
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                id="editShopPhone"
                                className="input"
                                value={shopForm.phone}
                                onChange={(e) => setShopForm({...shopForm, phone: e.target.value})}
                                placeholder="Enter phone number"
                            />
                        </div>
                        <div>
                            <label htmlFor="editShopEmail" className="muted" style={{ display: 'block', marginBottom: '0.5rem' }}>
                                Email
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

                    <div>
                        <label htmlFor="editShopWebsite" className="muted" style={{ display: 'block', marginBottom: '0.5rem' }}>
                            Website
                        </label>
                        <input
                            type="url"
                            id="editShopWebsite"
                            className="input"
                            value={shopForm.website}
                            onChange={(e) => setShopForm({...shopForm, website: e.target.value})}
                            placeholder="https://example.com"
                        />
                    </div>

                    {/* Social Media Links */}
                    <div>
                        <label className="muted" style={{ display: 'block', marginBottom: '0.5rem' }}>
                            Social Media Links (Optional)
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label htmlFor="editShopFacebook" className="muted" style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
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
                            <div>
                                <label htmlFor="editShopInstagram" className="muted" style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
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
                        <div style={{ marginTop: '1rem' }}>
                            <label htmlFor="editShopTwitter" className="muted" style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                                Twitter/X
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

                    {/* Location Status */}
                    {selectedLocation && (
                        <div style={{ 
                            padding: '0.75rem', 
                            backgroundColor: 'var(--primary-bg)', 
                            borderRadius: '8px',
                            border: '1px solid var(--primary)',
                            fontSize: '0.875rem'
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

                    {/* Form Actions */}
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                        <button 
                            type="button" 
                            className="btn" 
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
                            className="btn btn-primary"
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
