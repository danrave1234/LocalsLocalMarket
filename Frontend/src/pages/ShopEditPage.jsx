import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'
import { fetchShopById, updateShopRequest, fetchCategories } from '../api/shops.js'
import { fetchProductsByShopId, createProduct, updateProduct, deleteProduct, uploadImage, decrementProductStock } from '../api/products.js'
import { SkeletonText, SkeletonForm } from '../components/Skeleton.jsx'
import { handleApiError } from '../utils/errorHandler.js'
import { LoadingButton } from '../components/Loading.jsx'
import BusinessHours from '../components/BusinessHours.jsx'
import LocationMap from '../components/LocationMap.jsx'
import { 
  Store, 
  MapPin, 
  Clock, 
  Phone, 
  Mail, 
  Globe, 
  Share2, 
  Image as ImageIcon,
  Package,
  Plus,
  Trash2,
  Eye,
  Save,
  ArrowLeft,
  AlertCircle,
  Info
} from 'lucide-react'
import './ShopEditPage.css'

export default function ShopEditPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { token, user } = useAuth()
  const [shop, setShop] = useState(null)
  const [categories, setCategories] = useState([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('basic')
  const [form, setForm] = useState({
    name: '', description: '', category: '', addressLine: '', phone: '', website: '', email: '',
    facebook: '', instagram: '', twitter: '', lat: '', lng: '', logoPath: '', coverPath: '',
    adsEnabled: false, adsImagePathsJson: '[]', businessHoursJson: ''
  })
  const [addressLoading, setAddressLoading] = useState(false)

  // Memoize the business hours onChange callback to prevent infinite re-renders
  const handleBusinessHoursChange = useCallback((value) => {
    setForm(prevForm => ({ ...prevForm, businessHoursJson: value }))
  }, [])

  // Memoize the location select callback to prevent infinite re-renders
  const handleLocationSelect = useCallback((location) => {
    console.log('Location selected:', location)
    setAddressLoading(true)
    setForm(prevForm => ({
      ...prevForm,
      lat: location.lat?.toString() || '',
      lng: location.lng?.toString() || '',
      addressLine: location.addressLine || ''
    }))
    // Reset loading after a short delay to ensure UI updates
    setTimeout(() => setAddressLoading(false), 100)
  }, [])

  useEffect(() => {
    (async () => {
      try {
        const cats = await fetchCategories()
        setCategories(cats.categories || [])
      } catch { /* ignore */ }
      try {
        const s = await fetchShopById(slug)
        setShop(s)
        setForm({
          name: s.name || '', description: s.description || '', category: s.category || '', addressLine: s.addressLine || '',
          phone: s.phone || '', website: s.website || '', email: s.email || '', facebook: s.facebook || '', instagram: s.instagram || '', twitter: s.twitter || '',
          lat: s.lat ?? '', lng: s.lng ?? '', logoPath: s.logoPath || '', coverPath: s.coverPath || '',
          adsEnabled: !!s.adsEnabled, adsImagePathsJson: s.adsImagePathsJson || '[]', businessHoursJson: s.businessHoursJson || ''
        })
      } catch (e) {
        console.error('Failed to load shop:', e)
        const errorInfo = handleApiError(e)
        setError(errorInfo.message)
      }
    })()
  }, [slug])

  const isOwner = shop && user && (shop.owner?.id === user.id || shop.ownerId === user.id || shop.userId === user.id)



  const onUpload = async (file) => {
    const fd = new FormData()
    fd.append('file', file)
    const res = await uploadImage(fd, token)
    return res.path
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!token) { setError('You must be logged in.'); return }
    if (!isOwner) { setError('Forbidden'); return }
    setSaving(true)
    setError('')
    try {
      const payload = {
        name: form.name, description: form.description, category: form.category, addressLine: form.addressLine,
        phone: form.phone, website: form.website, email: form.email, facebook: form.facebook, instagram: form.instagram, twitter: form.twitter,
        lat: form.lat === '' ? null : Number(form.lat), lng: form.lng === '' ? null : Number(form.lng), logoPath: form.logoPath, coverPath: form.coverPath,
        adsEnabled: !!form.adsEnabled, adsImagePathsJson: form.adsImagePathsJson, businessHoursJson: form.businessHoursJson
      }
      await updateShopRequest(slug, payload, token)
      navigate(`/shops/${slug}`)
    } catch (e) {
      console.error('Failed to save shop:', e)
      const errorInfo = handleApiError(e)
      setError(errorInfo.message || 'Failed to save')
    } finally { setSaving(false) }
  }

  if (!shop) return (
    <main className="shop-edit-container">
      <div className="shop-edit-header">
        <SkeletonText lines={1} height="2.5rem" style={{ marginBottom: '1rem' }} />
        <SkeletonText lines={1} height="1.5rem" style={{ marginBottom: '2rem' }} />
      </div>
      <div className="shop-edit-content">
        <SkeletonForm fields={8} />
      </div>
    </main>
  )

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: Store, description: 'Shop name, description, and category' },
    { id: 'location', label: 'Location', icon: MapPin, description: 'Pin your shop location on the map' },
    { id: 'hours', label: 'Business Hours', icon: Clock, description: 'Operating hours and availability' },
    { id: 'contact', label: 'Contact & Social', icon: Share2, description: 'Phone, email, website, and social media' },
    { id: 'media', label: 'Media & Branding', icon: ImageIcon, description: 'Logo, cover image, and advertisements' }
  ]

  return (
    <main className="shop-edit-container">
      {/* Header Section */}
      <div className="shop-edit-header">
        <div className="header-content">
          <button 
            className="back-button" 
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="header-text">
            <h1 className="page-title">Edit Shop</h1>
            <p className="page-subtitle">Update your shop information and settings</p>
          </div>
        </div>
        
        {error && (
          <div className="error-banner">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="tab-navigation">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon size={18} />
            <span className="tab-label">{tab.label}</span>
            <span className="tab-description">{tab.description}</span>
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="shop-edit-content">
        <form onSubmit={handleSubmit} className="edit-form">
          {/* Basic Info Tab */}
          {activeTab === 'basic' && (
            <div className="tab-content">
              <div className="section-header">
                <Store size={24} />
                <div>
                  <h2>Basic Information</h2>
                  <p>Set your shop's name, description, and category</p>
                </div>
              </div>

              <div className="form-section">
                <div className="form-group">
                  <label className="form-label">
                    <span className="label-text">Shop Name *</span>
                    <span className="label-required">Required</span>
                  </label>
                  <input
                    className="form-input"
                    required
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Enter your shop name"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span className="label-text">Category</span>
                    <span className="label-optional">Optional</span>
                  </label>
                  <select
                    className="form-select"
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                  >
                    <option value="">Select a category</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span className="label-text">Description</span>
                    <span className="label-optional">Optional</span>
                  </label>
                  <textarea
                    className="form-textarea"
                    rows={4}
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    placeholder="Describe your shop, what you offer, and what makes you unique..."
                  />
                  <div className="input-help">
                    <Info size={16} />
                    <span>This description will be visible to customers browsing your shop</span>
                  </div>
                </div>
              </div>
            </div>
          )}

                     {/* Location Tab */}
           {activeTab === 'location' && (
             <div className="tab-content">
               <div className="section-header">
                 <MapPin size={24} />
                 <div>
                   <h2>Location & Address</h2>
                   <p>Pin your shop location on the map below</p>
                 </div>
               </div>

               <div className="form-section">
                 <div className="form-group">
                   <label className="form-label">
                     <span className="label-text">Address</span>
                     <span className="label-optional">Auto-detected from map</span>
                   </label>
                                       <div className="address-input-container">
                      <input
                        className="form-input"
                        value={form.addressLine}
                        disabled={addressLoading}
                        placeholder={addressLoading ? "Detecting address..." : "Address will be automatically detected from the map"}
                      />
                      {addressLoading && (
                        <div className="address-loading">
                          <div className="loading-spinner"></div>
                          <span>Detecting address...</span>
                        </div>
                      )}
                    </div>
                   <div className="input-help">
                     <Info size={16} />
                     <span>Click or drag on the map below to set your shop location. The address will be automatically detected.</span>
                   </div>
                 </div>

                 <div className="form-group">
                   <label className="form-label">
                     <span className="label-text">Map Location</span>
                     <span className="label-required">Required</span>
                   </label>
                                       <LocationMap
                      initialLat={form.lat ? parseFloat(form.lat) : 10.3157}
                      initialLng={form.lng ? parseFloat(form.lng) : 123.8854}
                      onLocationSelect={handleLocationSelect}
                    />
                   <div className="input-help">
                     <Info size={16} />
                     <span>Click anywhere on the map to place your shop marker. Drag the marker to adjust the exact location.</span>
                   </div>
                 </div>
               </div>
             </div>
           )}

          {/* Business Hours Tab */}
          {activeTab === 'hours' && (
            <div className="tab-content">
              <div className="section-header">
                <Clock size={24} />
                <div>
                  <h2>Business Hours</h2>
                  <p>Set when your shop is open and closed</p>
                </div>
              </div>

              <div className="form-section">
                <BusinessHours
                  value={form.businessHoursJson}
                  onChange={handleBusinessHoursChange}
                />
              </div>
            </div>
          )}

                     {/* Contact & Social Tab */}
           {activeTab === 'contact' && (
             <div className="tab-content">
               <div className="section-header">
                 <Share2 size={24} />
                 <div>
                   <h2>Contact & Social Media</h2>
                   <p>Provide ways for customers to reach you</p>
                 </div>
               </div>

               <div className="form-section">
                 <div className="contact-section">
                   <h3>Contact Information</h3>
                   <div className="form-row">
                     <div className="form-group">
                       <label className="form-label">
                         <Phone size={16} />
                         <span>Phone Number</span>
                       </label>
                       <input
                         className="form-input"
                         value={form.phone}
                         onChange={e => setForm({ ...form, phone: e.target.value })}
                         placeholder="Enter phone number"
                       />
                     </div>
                     <div className="form-group">
                       <label className="form-label">
                         <Mail size={16} />
                         <span>Email Address</span>
                       </label>
                       <input
                         className="form-input"
                         type="email"
                         value={form.email}
                         onChange={e => setForm({ ...form, email: e.target.value })}
                         placeholder="Enter email address"
                       />
                     </div>
                   </div>

                   <div className="form-group">
                     <label className="form-label">
                       <Globe size={16} />
                       <span>Website</span>
                     </label>
                     <input
                       className="form-input"
                       value={form.website}
                       onChange={e => setForm({ ...form, website: e.target.value })}
                       placeholder="https://yourwebsite.com"
                     />
                   </div>
                 </div>

                 <div className="social-section">
                   <h3>Social Media</h3>
                   <div className="form-row">
                     <div className="form-group">
                       <label className="form-label">
                         <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                           <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                         </svg>
                         <span>Facebook</span>
                       </label>
                       <input
                         className="form-input"
                         value={form.facebook}
                         onChange={e => setForm({ ...form, facebook: e.target.value })}
                         placeholder="Facebook page URL"
                       />
                     </div>
                     <div className="form-group">
                       <label className="form-label">
                         <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                           <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                         </svg>
                         <span>Instagram</span>
                       </label>
                       <input
                         className="form-input"
                         value={form.instagram}
                         onChange={e => setForm({ ...form, instagram: e.target.value })}
                         placeholder="Instagram profile URL"
                       />
                     </div>
                   </div>

                   <div className="form-group">
                                           <label className="form-label">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                        <span>X</span>
                      </label>
                     <input
                       className="form-input"
                       value={form.twitter}
                       onChange={e => setForm({ ...form, twitter: e.target.value })}
                       placeholder="Twitter profile URL"
                     />
                   </div>
                 </div>
               </div>
             </div>
           )}

           {/* Media & Branding Tab */}
           {activeTab === 'media' && (
             <div className="tab-content">
               <div className="section-header">
                 <ImageIcon size={24} />
                 <div>
                   <h2>Media & Branding</h2>
                   <p>Upload your shop's logo, cover image, and manage advertisements</p>
                 </div>
               </div>

               <div className="form-section">
                 <div className="media-section">
                   <h3>Shop Images</h3>
                   
                   <div className="form-group">
                     <label className="form-label">
                       <span className="label-text">Shop Logo</span>
                       <span className="label-optional">Optional</span>
                     </label>
                     <div className="image-upload-container">
                       {form.logoPath ? (
                         <div className="image-preview">
                           <img src={form.logoPath} alt="Shop logo" />
                           <button
                             type="button"
                             className="remove-image-btn"
                             onClick={() => setForm({ ...form, logoPath: '' })}
                           >
                             <Trash2 size={16} />
                           </button>
                         </div>
                       ) : (
                         <div className="upload-placeholder">
                           <ImageIcon size={32} />
                           <span>Click to upload logo</span>
                           <small>Recommended: 200x200px, PNG or JPG</small>
                         </div>
                       )}
                       <input
                         type="file"
                         accept="image/*"
                         onChange={async (e) => {
                           const file = e.target.files[0]
                           if (file) {
                             try {
                               const path = await onUpload(file)
                               setForm({ ...form, logoPath: path })
                             } catch (error) {
                               console.error('Upload failed:', error)
                               setError('Failed to upload logo')
                             }
                           }
                         }}
                         className="file-input"
                       />
                     </div>
                   </div>

                   <div className="form-group">
                     <label className="form-label">
                       <span className="label-text">Cover Image</span>
                       <span className="label-optional">Optional</span>
                     </label>
                     <div className="image-upload-container">
                       {form.coverPath ? (
                         <div className="image-preview cover-preview">
                           <img src={form.coverPath} alt="Shop cover" />
                           <button
                             type="button"
                             className="remove-image-btn"
                             onClick={() => setForm({ ...form, coverPath: '' })}
                           >
                             <Trash2 size={16} />
                           </button>
                         </div>
                       ) : (
                         <div className="upload-placeholder cover-placeholder">
                           <ImageIcon size={32} />
                           <span>Click to upload cover image</span>
                           <small>Recommended: 1200x400px, PNG or JPG</small>
                         </div>
                       )}
                       <input
                         type="file"
                         accept="image/*"
                         onChange={async (e) => {
                           const file = e.target.files[0]
                           if (file) {
                             try {
                               const path = await onUpload(file)
                               setForm({ ...form, coverPath: path })
                             } catch (error) {
                               console.error('Upload failed:', error)
                               setError('Failed to upload cover image')
                             }
                           }
                         }}
                         className="file-input"
                       />
                     </div>
                   </div>
                 </div>

                 <div className="ads-section">
                   <h3>Advertisements</h3>
                   
                   <div className="form-group">
                     <label className="form-label">
                       <span className="label-text">Enable Advertisements</span>
                     </label>
                     <div className="toggle-container">
                       <input
                         type="checkbox"
                         id="adsEnabled"
                         checked={form.adsEnabled}
                         onChange={(e) => setForm({ ...form, adsEnabled: e.target.checked })}
                         className="toggle-input"
                       />
                       <label htmlFor="adsEnabled" className="toggle-label">
                         <span className="toggle-slider"></span>
                       </label>
                       <span className="toggle-text">
                         {form.adsEnabled ? 'Enabled' : 'Disabled'}
                       </span>
                     </div>
                     <div className="input-help">
                       <Info size={16} />
                       <span>When enabled, your shop can display promotional advertisements to customers</span>
                     </div>
                   </div>

                   {form.adsEnabled && (
                     <div className="form-group">
                       <label className="form-label">
                         <span className="label-text">Advertisement Images</span>
                         <span className="label-optional">Optional</span>
                       </label>
                       <div className="ads-upload-container">
                         <div className="ads-grid">
                           {JSON.parse(form.adsImagePathsJson || '[]').map((path, index) => (
                             <div key={`ad-${path}-${index}`} className="ad-image-item">
                               <img src={path} alt={`Ad ${index + 1}`} />
                               <button
                                 type="button"
                                 className="remove-ad-btn"
                                 onClick={() => {
                                   const ads = JSON.parse(form.adsImagePathsJson || '[]')
                                   ads.splice(index, 1)
                                   setForm({ ...form, adsImagePathsJson: JSON.stringify(ads) })
                                 }}
                               >
                                 <Trash2 size={16} />
                               </button>
                             </div>
                           ))}
                           <div className="add-ad-placeholder">
                             <Plus size={24} />
                             <span>Add Ad Image</span>
                             <small>Upload promotional images</small>
                           </div>
                         </div>
                         <input
                           type="file"
                           accept="image/*"
                           onChange={async (e) => {
                             const file = e.target.files[0]
                             if (file) {
                               try {
                                 const path = await onUpload(file)
                                 const ads = JSON.parse(form.adsImagePathsJson || '[]')
                                 ads.push(path)
                                 setForm({ ...form, adsImagePathsJson: JSON.stringify(ads) })
                               } catch (error) {
                                 console.error('Upload failed:', error)
                                 setError('Failed to upload advertisement image')
                               }
                             }
                           }}
                           className="file-input"
                         />
                       </div>
                     </div>
                   )}
                 </div>
               </div>
             </div>
           )}

          {/* Form Actions */}
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>
              <ArrowLeft size={16} />
              Cancel
            </button>

            <LoadingButton
              type="submit"
              className="btn-primary"
              loading={saving}
              loadingText="Saving..."
            >
              <Save size={16} />
              Save Changes
            </LoadingButton>
          </div>
        </form>

        {/* Live Preview */}
        <div className="shop-preview">
          <div className="preview-header">
            <Eye size={20} />
            <h3>Live Preview</h3>
            <span className="preview-subtitle">See how your shop will appear to customers</span>
          </div>
          
          <div className="preview-card">
            <div className="preview-cover">
              {form.coverPath ? (
                <img src={form.coverPath} alt="Shop cover" />
              ) : (
                <div className="preview-cover-placeholder">
                  <ImageIcon size={48} />
                  <span>Cover Image</span>
                </div>
              )}
            </div>
            
            <div className="preview-content">
              <div className="preview-logo">
                {form.logoPath ? (
                  <img src={form.logoPath} alt="Shop logo" />
                ) : (
                  <div className="preview-logo-placeholder">
                    <Store size={24} />
                  </div>
                )}
              </div>
              
              <div className="preview-details">
                <h2 className="preview-title">
                  {form.name || 'Shop Name'}
                </h2>
                
                {form.category && (
                  <div className="preview-category">
                    {form.category}
                  </div>
                )}

                {form.description && (
                  <p className="preview-description">
                    {form.description}
                  </p>
                )}

                {form.addressLine && (
                  <div className="preview-address">
                    <MapPin size={16} />
                    {form.addressLine}
                  </div>
                )}

                <div className="preview-contact">
                  {form.phone && (
                    <div className="contact-item">
                      <Phone size={16} />
                      {form.phone}
                    </div>
                  )}
                  {form.email && (
                    <div className="contact-item">
                      <Mail size={16} />
                      {form.email}
                    </div>
                  )}
                  {form.website && (
                    <div className="contact-item">
                      <Globe size={16} />
                      {form.website}
                    </div>
                  )}
                </div>

                                 {(form.facebook || form.instagram || form.twitter) && (
                   <div className="preview-social">
                     {form.facebook && (
                       <a href={form.facebook} target="_blank" rel="noopener noreferrer" className="social-link">
                         <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                           <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                         </svg>
                       </a>
                     )}
                     {form.instagram && (
                       <a href={form.instagram} target="_blank" rel="noopener noreferrer" className="social-link">
                         <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                           <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                         </svg>
                       </a>
                     )}
                     {form.twitter && (
                       <a href={form.twitter} target="_blank" rel="noopener noreferrer" className="social-link">
                         <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                           <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                         </svg>
                       </a>
                     )}
                   </div>
                 )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
