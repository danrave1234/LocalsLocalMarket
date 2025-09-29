import { useEffect, useState, useRef, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'
import SEOHead from '../components/SEOHead.jsx'
import SocialSharing from '../components/SocialSharing.jsx'
import RelatedShops from '../components/RelatedShops.jsx'
import CategorySelector from '../components/CategorySelector.jsx'
import OptimizedSearch from '../components/OptimizedSearch.jsx'
import OptimizedImage from '../components/OptimizedImage.jsx'
import ServiceCard from '../components/ServiceCard.jsx'
import ServiceForm from '../components/ServiceForm.jsx'
import { fetchShopById } from '../api/shops.js'
import shopCache from '../utils/shopCache.js'
import { Store, MapPin, Check, Copy, Phone, Globe, BarChart3, Package, Search, DollarSign, Camera, Trash2, ShoppingCart, Plus, Info, Star, ThumbsUp, ThumbsDown, Crosshair, Wrench, Share2, MessageSquare } from 'lucide-react'


import { fetchProducts, fetchProductsByShopIdPaginated, createProduct, updateProduct, deleteProduct, updateProductStock } from '../api/products.js'
import { fetchServicesByShopId, fetchServicesByShopIdLegacy, createService, updateService, deleteService } from '../api/services.js'
import Avatar from '../components/Avatar.jsx'
import Modal from '../components/Modal.jsx'
import OrderModal from '../components/OrderModal.jsx'
import ReviewModal from '../components/ReviewModal.jsx'
import ShopReviews from '../components/ShopReviews.jsx'
import { extractShopIdFromSlug, extractShopNameFromSlug, generateShopSlug } from '../utils/slugUtils.js'
import { ResponsiveAd, InContentAd } from '../components/GoogleAds.jsx'
import { getImageUrl, clearImageCache } from '../utils/imageUtils.jsx'
import { handleApiError } from '../utils/errorHandler.js'
import { SkeletonProductCard, SkeletonText, SkeletonAvatar, SkeletonButton, SkeletonMap } from '../components/Skeleton.jsx'
import ErrorDisplay from '../components/ErrorDisplay.jsx'
import { LoadingSpinner, LoadingOverlay } from '../components/Loading.jsx'
import ProductDetailsModal from '../components/ProductDetailsModal.jsx'
import { useDebounce } from '../hooks/useDebounce.js'
import { useScroll } from '../hooks/useEvents.js'
import { useClipboard } from '../hooks/useStorage.js'
import { useLocalStorage } from '../hooks/useStorage.js'
import { getShopRating, getUserReview, recordUserOrder } from '../utils/shopRatings.js'
import './ShopPage.css'
import { Clock, MapPin as MapPinIcon } from 'lucide-react'
import { sanitizeText } from '../utils/sanitize.js'

export default function ShopPage() {
  const { slug } = useParams()
  const { user, token } = useAuth()
  
  const shopId = extractShopIdFromSlug(slug)
  const [shop, setShop] = useState(null)
  const [products, setProducts] = useState([])
  const [services, setServices] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  
  
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize] = useState(12) // Fixed page size for shop products
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [showEditProduct, setShowEditProduct] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [showAddService, setShowAddService] = useState(false)
  const [showEditService, setShowEditService] = useState(false)
  const [editingService, setEditingService] = useState(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [savingStock, setSavingStock] = useState({})
  const [activeTab, setActiveTab] = useState('products') // 'products' or 'services'
  const [shareOpen, setShareOpen] = useState(false)
  const [contactsOpen, setContactsOpen] = useState(false)
  const [showProductDetails, setShowProductDetails] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const hoursRef = useRef(null)
  const [showMapModal, setShowMapModal] = useState(false)
  const mobileMapRef = useRef(null)
  const mobileMapInstanceRef = useRef(null)
  const isMobileDevice = typeof window !== 'undefined' && /Android|iPhone|iPad|iPod|Mobile/i.test(window.navigator.userAgent)

  // Respect shop offering configuration for initial tab and visibility
  useEffect(() => {
    if (!shop) return
    const type = (shop.offeringType || 'both').toLowerCase()
    const priority = (shop.showcasePriority || 'products').toLowerCase()
    if (type === 'products') {
      setActiveTab('products')
    } else if (type === 'services') {
      setActiveTab('services')
    } else {
      setActiveTab(priority === 'services' ? 'services' : 'products')
    }
    // Update tutorial steps visibility hints if needed via data-tutorial targets (no code change required)
  }, [shop])

  // Lightweight cart/order state stored per shop in localStorage
  const [cartItems, setCartItems] = useLocalStorage(`shop_${shopId}_cart`, [])
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [senderEmail, setSenderEmail] = useState('')
  const [orderMessage, setOrderMessage] = useState('')
  const [placingOrder, setPlacingOrder] = useState(false)
  const [orderError, setOrderError] = useState('')
  const [orderSuccess, setOrderSuccess] = useState('')
  const [orderPlacedPopup, setOrderPlacedPopup] = useState(false)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [localShopRating, setLocalShopRating] = useState({ averageRating: 0, reviewCount: 0, hasUserReviewed: false })
  const scrollToReviews = () => {
    const el = document.getElementById('shop-reviews')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Function to fetch products with pagination
  const fetchProductsWithPagination = useCallback(async (page = 0, shopId = null) => {
    const targetShopId = shopId || shop?.id
    if (!targetShopId) {
      return
    }
    
    try {
      const response = await fetchProductsByShopIdPaginated(targetShopId, page, pageSize)
      
      if (response && response.content && response.pagination) {
        setProducts(response.content)
        setPagination(response.pagination)
        setCurrentPage(page)
      } else {
        // Fallback to old API if new format not available
        const fallbackResponse = await fetchProducts({ shopId: targetShopId })
        const productsData = Array.isArray(fallbackResponse) ? fallbackResponse : (fallbackResponse.content || [])
        setProducts(productsData)
        setPagination(null)
        setCurrentPage(0)
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
      setError('Failed to load products: ' + error.message)
    }
  }, [shop?.id, pageSize])

  // Function to fetch services
  const fetchServices = useCallback(async (shopId = null) => {
    const targetShopId = shopId || shop?.id
    if (!targetShopId) {
      return
    }
    
    try {
      // Try paginated API first
      const response = await fetchServicesByShopId(targetShopId, { page: 0, size: 100 })
      
      // Handle paginated response format
      if (response && response.content && Array.isArray(response.content)) {
        setServices(response.content)
      } else if (Array.isArray(response)) {
        // Fallback for non-paginated response
        setServices(response)
      } else {
        // Try legacy non-paginated API as fallback
        try {
          const legacyResponse = await fetchServicesByShopIdLegacy(targetShopId)
          setServices(Array.isArray(legacyResponse) ? legacyResponse : [])
        } catch (legacyError) {
          console.error('Legacy API also failed:', legacyError)
          setServices([])
        }
      }
    } catch (error) {
      console.error('Failed to fetch services:', error)
      
      // Enhanced mobile error handling for services
      const isMobile = typeof window !== 'undefined' && 
        (window.navigator.userAgent.includes('Mobile') || 
         window.navigator.userAgent.includes('Android') ||
         window.navigator.userAgent.includes('iPhone'))
      
      // Try legacy API as fallback
      try {
        const legacyResponse = await fetchServicesByShopIdLegacy(targetShopId)
        setServices(Array.isArray(legacyResponse) ? legacyResponse : [])
      } catch (legacyError) {
        console.error('Both APIs failed:', legacyError)
        
        // Don't set error for services failure on mobile - just log it
        if (isMobile) {
          console.warn('Services failed to load on mobile, but continuing without services')
          setServices([])
        } else {
          setError('Failed to load services: ' + error.message)
          setServices([])
        }
      }
    }
  }, [shop?.id])

  const [productForm, setProductForm] = useState({
    title: '',
    description: '',
    price: '',
    mainCategory: '',
    subcategory: '',
    customCategory: '',
    stockCount: ''
  })
  const [serviceForm, setServiceForm] = useState({
    title: '',
    description: '',
    price: '',
    mainCategory: '',
    subcategory: '',
    customCategory: '',
    status: 'AVAILABLE',
    durationMinutes: ''
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [stockFilter, setStockFilter] = useState('all')
  const [showPriceFilter, setShowPriceFilter] = useState(false)
  const [showStockFilter, setShowStockFilter] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [copiedText, setCopiedText] = useState('')
  const [showBusinessHours, setShowBusinessHours] = useState(false)
  const [showMobileSocials, setShowMobileSocials] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)
  const [businessHours, setBusinessHours] = useState({
    monday: { open: '9:00 AM', close: '6:00 PM', closed: false },
    tuesday: { open: '9:00 AM', close: '6:00 PM', closed: false },
    wednesday: { open: '9:00 AM', close: '6:00 PM', closed: false },
    thursday: { open: '9:00 AM', close: '6:00 PM', closed: false },
    friday: { open: '9:00 AM', close: '6:00 PM', closed: false },
    saturday: { open: '10:00 AM', close: '4:00 PM', closed: false },
    sunday: { open: '10:00 AM', close: '4:00 PM', closed: true }
  })

  // Optimized hooks
  const debouncedSearchQuery = useDebounce(searchQuery, 300)
  const { isScrolled } = useScroll(300)
  const { copyToClipboard } = useClipboard()
  const [recentlyViewedShops, setRecentlyViewedShops] = useLocalStorage('recentlyViewedShops', [])
  
  // Prevent duplicate API calls
  const shopLoadingRef = useRef(false)

  // Load local shop rating when shop changes
  useEffect(() => {
    if (shop?.id) {
      const rating = getShopRating(shop.id, user?.id)
      setLocalShopRating(rating)
    }
  }, [shop?.id, user?.id])


  // Debug logging for image paths (development only)
  useEffect(() => {
    if (shop && import.meta && import.meta.env && import.meta.env.DEV) {
      // place any dev-only logging here if needed
    }
  }, [shop])

  // Optimized copy to clipboard functionality using hook
  const handleCopyToClipboard = useCallback(async (text, label) => {
    const success = await copyToClipboard(text)
    if (success) {
      setCopiedText(label)
      setTimeout(() => setCopiedText(''), 2000)
    }
  }, [copyToClipboard])

  // Sort products function with memoization
  const getSortedProducts = useCallback(() => {
    console.log('getSortedProducts called, products:', products)
    if (!Array.isArray(products)) {
      console.log('Products is not an array:', products)
      return []
    }
    
    // Temporary bypass for debugging - return all products without filtering
    if (products.length > 0) {
      console.log('TEMP: Returning all products without filtering for debugging')
      return products
    }
    
    let filteredProducts = products.filter(product => {
      // Search filter - only apply if there's a search query
      const matchesSearch = !debouncedSearchQuery || debouncedSearchQuery.trim() === '' || 
        product.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase())) ||
        (product.mainCategory && product.mainCategory.toLowerCase().includes(debouncedSearchQuery.toLowerCase())) ||
        (product.subcategory && product.subcategory.toLowerCase().includes(debouncedSearchQuery.toLowerCase())) ||
        (product.customCategory && product.customCategory.toLowerCase().includes(debouncedSearchQuery.toLowerCase()))
      
      // Category filter - only apply if a specific category is selected
      const matchesCategory = !selectedCategory || selectedCategory === 'all' || selectedCategory === 'All Categories' ||
        product.mainCategory === selectedCategory ||
        product.subcategory === selectedCategory ||
        product.customCategory === selectedCategory ||
        product.category === selectedCategory // Backward compatibility
      
      // Price range filter - only apply if price range is set
      const matchesPriceRange = (!priceRange.min || priceRange.min === '') && (!priceRange.max || priceRange.max === '') || 
        ((!priceRange.min || priceRange.min === '' || (product.price || 0) >= parseFloat(priceRange.min)) &&
         (!priceRange.max || priceRange.max === '' || (product.price || 0) <= parseFloat(priceRange.max)))
      
      // Stock status filter
      const matchesStockFilter = stockFilter === 'all' ||
        (stockFilter === 'in-stock' && (product.stockCount || 0) > 0) ||
        (stockFilter === 'out-of-stock' && (product.stockCount || 0) <= 0) ||
        (stockFilter === 'low-stock' && (product.stockCount || 0) > 0 && (product.stockCount || 0) <= 5)
      
      const result = matchesSearch && matchesCategory && matchesPriceRange && matchesStockFilter
      
      // Debug logging for first product
      if (product.id === products[0]?.id) {
        console.log('Filtering product:', product.title, {
          matchesSearch,
          matchesCategory,
          matchesPriceRange,
          matchesStockFilter,
          result,
          selectedCategory,
          debouncedSearchQuery,
          priceRange,
          stockFilter
        })
      }
      
      return result
    })

    switch (sortBy) {
      case 'price-low':
        return filteredProducts.sort((a, b) => (a.price || 0) - (b.price || 0))
      case 'price-high':
        return filteredProducts.sort((a, b) => (b.price || 0) - (a.price || 0))
      case 'oldest':
        return filteredProducts.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0))
      case 'name-asc':
        return filteredProducts.sort((a, b) => (a.title || '').localeCompare(b.title || ''))
      case 'name-desc':
        return filteredProducts.sort((a, b) => (b.title || '').localeCompare(a.title || ''))
      case 'newest':
      default:
        return filteredProducts.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    }
  }, [products, debouncedSearchQuery, selectedCategory, sortBy, priceRange, stockFilter])

  // Sort services function with memoization
  const getSortedServices = useCallback(() => {
    console.log('getSortedServices called with services:', services)
    if (!Array.isArray(services)) {
      console.log('Services is not an array:', services)
      return []
    }
    
    let filteredServices = services.filter(service => {
      const matchesSearch = !debouncedSearchQuery || 
        service.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        (service.description && service.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase())) ||
        (service.mainCategory && service.mainCategory.toLowerCase().includes(debouncedSearchQuery.toLowerCase())) ||
        (service.subcategory && service.subcategory.toLowerCase().includes(debouncedSearchQuery.toLowerCase())) ||
        (service.customCategory && service.customCategory.toLowerCase().includes(debouncedSearchQuery.toLowerCase()))
      
      const matchesCategory = !selectedCategory || 
        service.mainCategory === selectedCategory ||
        service.subcategory === selectedCategory ||
        service.customCategory === selectedCategory ||
        service.category === selectedCategory // Backward compatibility
      
      // Price range filter
      const matchesPriceRange = (!priceRange.min || priceRange.min === '') && (!priceRange.max || priceRange.max === '') || 
        ((!priceRange.min || priceRange.min === '' || (service.price || 0) >= parseFloat(priceRange.min)) &&
         (!priceRange.max || priceRange.max === '' || (service.price || 0) <= parseFloat(priceRange.max)))
      
      // Status filter (for services)
      const matchesStatusFilter = stockFilter === 'all' ||
        (stockFilter === 'in-stock' && service.status === 'AVAILABLE') ||
        (stockFilter === 'out-of-stock' && service.status === 'NOT_AVAILABLE')
      
      const result = matchesSearch && matchesCategory && matchesPriceRange && matchesStatusFilter
      console.log(`Service "${service.title}" filters:`, {
        matchesSearch,
        matchesCategory,
        matchesPriceRange,
        matchesStatusFilter,
        result,
        selectedCategory,
        debouncedSearchQuery,
        priceRange,
        stockFilter
      })
      return result
    })

    console.log('Filtered services before sorting:', filteredServices)
    
    let sortedServices;
    switch (sortBy) {
      case 'price-low':
        sortedServices = filteredServices.sort((a, b) => (a.price || 0) - (b.price || 0))
        break
      case 'price-high':
        sortedServices = filteredServices.sort((a, b) => (b.price || 0) - (a.price || 0))
        break
      case 'oldest':
        sortedServices = filteredServices.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0))
        break
      case 'name-asc':
        sortedServices = filteredServices.sort((a, b) => (a.title || '').localeCompare(b.title || ''))
        break
      case 'name-desc':
        sortedServices = filteredServices.sort((a, b) => (b.title || '').localeCompare(a.title || ''))
        break
      case 'newest':
      default:
        sortedServices = filteredServices.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        break
    }
    
    console.log('Final sorted services:', sortedServices)
    return sortedServices
  }, [services, debouncedSearchQuery, selectedCategory, sortBy, priceRange, stockFilter])

  // Format business hours display
  const formatHoursDisplay = useCallback((hours) => {
    if (!hours || hours.closed === true || hours.isOpen === false) {
      return 'Closed'
    }
    
    // Check if it's a 24-hour day
    if (hours.open === '12' && hours.openMinute === '00' && hours.openAMPM === 'AM' &&
        hours.close === '11' && hours.closeMinute === '59' && hours.closeAMPM === 'PM') {
      return '24 Hours'
    }
    
    // Check if it's the old 24-hour format
    if (hours.open === '12' && hours.openMinute === '00' && hours.openAMPM === 'AM' &&
        hours.close === '12' && hours.closeMinute === '00' && hours.closeAMPM === 'AM') {
      return '24 Hours'
    }
    
    // Regular time format
    const display = `${hours.open}:${hours.openMinute || '00'} ${hours.openAMPM || 'AM'} - ${hours.close}:${hours.closeMinute || '00'} ${hours.closeAMPM || 'PM'}`
    return display
  }, [])

  // Check if shop is currently open
  const isShopOpen = useCallback(() => {
    const now = new Date()
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    const currentDay = days[now.getDay()]
    
    const dayKey = currentDay
    const hours = businessHours[dayKey]
    
    if (!hours || hours.closed === true || hours.isOpen === false) {
      return false
    }
    
    // Check if it's a 24-hour day
    if (hours.open === '12' && hours.openMinute === '00' && hours.openAMPM === 'AM' &&
        hours.close === '11' && hours.closeMinute === '59' && hours.closeAMPM === 'PM') {
      return true // 24-hour days are always open
    }
    
    // Check if it's the old 24-hour format
    if (hours.open === '12' && hours.openMinute === '00' && hours.openAMPM === 'AM' &&
        hours.close === '12' && hours.closeMinute === '00' && hours.closeAMPM === 'AM') {
      return true // Old 24-hour format is always open
    }
    
    // Handle both old format (time strings) and new format (separate fields)
    let openTime, closeTime
    
    if (hours.openMinute !== undefined && hours.openAMPM !== undefined) {
      // New format: separate fields
      openTime = `${hours.open}:${hours.openMinute || '00'} ${hours.openAMPM || 'AM'}`
      closeTime = `${hours.close}:${hours.closeMinute || '00'} ${hours.closeAMPM || 'PM'}`
    } else {
      // Old format: time strings
      openTime = hours.open
      closeTime = hours.close
    }
    
    // Convert 12-hour format to 24-hour for comparison
    const convertTo24Hour = (timeStr) => {
      const [time, ampm] = timeStr.split(' ')
      const [hour, minute] = time.split(':')
      let hour24 = parseInt(hour)
      
      if (ampm === 'PM' && hour24 !== 12) {
        hour24 += 12
      } else if (ampm === 'AM' && hour24 === 12) {
        hour24 = 0
      }
      
      return `${hour24.toString().padStart(2, '0')}:${minute}`
    }
    
    const currentTime = now.toTimeString().slice(0, 5)
    const open24 = convertTo24Hour(openTime)
    const close24 = convertTo24Hour(closeTime)
    
    return currentTime >= open24 && currentTime <= close24
  }, [businessHours])

  // Scroll handler for back to top button - now using optimized hook
  useEffect(() => {
    setShowBackToTop(isScrolled)
  }, [isScrolled])

  // Back to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Floating mini map removed

  // Center shop location function
  const centerShopLocation = () => {
    if (mapInstanceRef.current && shop && shop.lat && shop.lng) {
      mapInstanceRef.current.setView([shop.lat, shop.lng], 15)
    }
  }

  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)

  const isOwner = shop && user && shop.owner && shop.owner.id === user.id

  useEffect(() => {
    // Initialize map inside the modal when opened
    const initMobileMap = async () => {
      try {
        if (!showMapModal || !shop?.lat || !shop?.lng) return
        // Load Leaflet only once (ShopPage already ensures CSS/JS, but guard here too)
        if (typeof window.L === 'undefined') {
          // Fallback dynamic loader
          const link = document.createElement('link')
          link.rel = 'stylesheet'
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
          document.head.appendChild(link)
          const script = document.createElement('script')
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
          await new Promise((res) => { script.onload = res; document.body.appendChild(script) })
        }
        const L = window.L
        // Cleanup existing instance
        try { if (mobileMapInstanceRef.current) { mobileMapInstanceRef.current.remove() } } catch {}
        if (mobileMapRef.current) {
          const map = L.map(mobileMapRef.current, { zoomControl: true, attributionControl: false })
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19
          }).addTo(map)
          L.marker([shop.lat, shop.lng]).addTo(map)
          map.setView([shop.lat, shop.lng], 16)
          setTimeout(() => { try { map.invalidateSize() } catch {} }, 200)
          mobileMapInstanceRef.current = map
        }
      } catch {}
    }
    initMobileMap()
    return () => {
      try { if (mobileMapInstanceRef.current) { mobileMapInstanceRef.current.remove(); mobileMapInstanceRef.current = null } } catch {}
    }
  }, [showMapModal, shop?.lat, shop?.lng])
  useEffect(() => {
    const loadShopData = async () => {
      // Prevent duplicate API calls
      if (shopLoadingRef.current) {
        return
      }
      shopLoadingRef.current = true
      
      setError('')
      setLoading(true)
      setMapLoaded(false)
      
      // Clear image cache to ensure fresh images when loading shop data
      clearImageCache()
      
      
      try {
        // First, check if we have shop data in the global cache
        let shopData = shopCache.get(shopId)
        
        if (shopData) {
          // Set default values if not present
          shopData.averageRating = shopData.averageRating || 0
          shopData.reviewCount = shopData.reviewCount || 0
          
          setShop(shopData)
          
          // Only fetch products and services since they're not cached
          try {
            await Promise.all([
              fetchProductsWithPagination(0, shopId),
              fetchServices(shopId)
            ])
          } catch (fetchError) {
            console.error('Error fetching products/services from cache:', fetchError)
            // Don't fail the entire page load for products/services errors
          }
          
          // Load business hours from shop data
          if (shopData.businessHoursJson && shopData.businessHoursJson.trim() !== '') {
            try {
              const parsedHours = JSON.parse(shopData.businessHoursJson)
              setBusinessHours(parsedHours)
            } catch (error) {
              console.error('Failed to parse business hours:', error)
            }
          }
          
        } else {
          // No cached data, fetch from API
          let apiShopData = null
          try {
            apiShopData = await fetchShopById(shopId)
            
            // Cache the fetched data for future use
            shopCache.set(shopId, apiShopData)
            
            // Set default values if not present
            apiShopData.averageRating = apiShopData.averageRating || 0
            apiShopData.reviewCount = apiShopData.reviewCount || 0
            
            setShop(apiShopData)
          } catch (error) {
            console.error('Failed to fetch shop data:', error)
            
            // Enhanced error handling for mobile devices
            const isMobile = typeof window !== 'undefined' && 
              (window.navigator.userAgent.includes('Mobile') || 
               window.navigator.userAgent.includes('Android') ||
               window.navigator.userAgent.includes('iPhone'))
            
            let errorMessage = 'Failed to load shop: ' + error.message
            
            if (isMobile && error.message.includes('Failed to fetch')) {
              errorMessage = 'Unable to connect to server. Please check your internet connection and try again.'
            } else if (isMobile && error.message.includes('timeout')) {
              errorMessage = 'Request timed out. Please check your internet connection and try again.'
            }
            
            setError(errorMessage)
            setLoading(false)
            return
          }
          
          // Fetch products and services
          try {
            await Promise.all([
              fetchProductsWithPagination(0, shopId),
              fetchServices(shopId)
            ])
          } catch (fetchError) {
            console.error('Error fetching products/services:', fetchError)
            // Don't fail the entire page load for products/services errors
          }
          
          // Load business hours from shop data
          if (apiShopData && apiShopData.businessHoursJson && apiShopData.businessHoursJson.trim() !== '') {
            try {
              const parsedHours = JSON.parse(apiShopData.businessHoursJson)
              setBusinessHours(parsedHours)
            } catch (error) {
              console.error('Failed to parse business hours:', error)
            }
          }
        }
        
      } catch (e) {
        console.error('Failed to load shop data:', e)
        const errorInfo = handleApiError(e)
        
        // Enhanced mobile error handling
        const isMobile = typeof window !== 'undefined' && 
          (window.navigator.userAgent.includes('Mobile') || 
           window.navigator.userAgent.includes('Android') ||
           window.navigator.userAgent.includes('iPhone'))
        
        let errorMessage = errorInfo.message
        
        if (isMobile && (e.message?.includes('Failed to fetch') || errorInfo.type === 'network')) {
          errorMessage = 'Unable to connect to server. Please check your internet connection and try again.'
        } else if (isMobile && e.message?.includes('timeout')) {
          errorMessage = 'Request timed out. Please check your internet connection and try again.'
        }
        
        setError(errorMessage)
      } finally {
        setLoading(false)
        shopLoadingRef.current = false
      }
    }

    if (shopId) {
      // Small delay to allow cache to be populated from other components
      setTimeout(() => {
        loadShopData()
      }, 100)
    }
  }, [shopId])



  // Initialize map when shop data is loaded
  useEffect(() => {
    if (!shop || !shop.lat || !shop.lng) return

    const initializeMap = async () => {
      // Load Leaflet CSS
      if (!document.querySelector('link[href*="leaflet.css"]')) {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY='
        link.crossOrigin = ''
        document.head.appendChild(link)
      }

      // Load Leaflet JS
      if (typeof window.L === 'undefined') {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script')
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
          script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo='
          script.crossOrigin = ''
          script.onload = resolve
          script.onerror = reject
          document.head.appendChild(script)
        })
      }

      // Wait a bit for the script to be fully loaded
      await new Promise(resolve => setTimeout(resolve, 100))

      // Initialize map
      if (mapRef.current && !mapInstanceRef.current && window.L) {
        // Check if container already has a map
        if (mapRef.current._leaflet_id) {
          return
        }

        try {
          mapInstanceRef.current = window.L.map('shop-map').setView([shop.lat, shop.lng], 15)
          
          window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(mapInstanceRef.current)

          // Add shop marker (custom icon with background-image logo)
          const logoUrl = shop.logoPath ? getImageUrl(shop.logoPath) : ''
          const mainShopIcon = window.L.divIcon({
            className: 'shop-marker',
            html: `
              <div style="position: relative; width: 44px; height: 44px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.3); overflow: hidden; color: white;">
                ${logoUrl ? `<div style=\"position:absolute; top:0; left:0; right:0; bottom:0; background-image:url('${logoUrl}'); background-size:cover; background-position:center;\"></div>` : '<div style=\"position:absolute; inset:0; background:#6366f1; display:flex; align-items:center; justify-content:center;\"><svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"white\" stroke-width=\"2\"><path d=\"M3 9l1-5h16l1 5\"/><path d=\"M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z\"/><path d=\"M8 13h3v3H8z\"/></svg></div>'}
              </div>` ,
            iconSize: [44, 44],
            iconAnchor: [22, 22]
          })
          window.L.marker([shop.lat, shop.lng], { icon: mainShopIcon })
            .addTo(mapInstanceRef.current)
            .bindPopup(shop.name)
          
          setMapLoaded(true)
        } catch (error) {
          console.error('Failed to initialize map:', error)
        }
      }
    }

    initializeMap()

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove()
        } catch (error) {
          // Map already removed
        }
        mapInstanceRef.current = null
      }
      setMapLoaded(false)
    }
  }, [shop])

  const handleAddProduct = async (e) => {
    e.preventDefault()
    
    // Validate required fields
    if (!productForm.title || !productForm.title.trim()) {
      setError('Product title is required')
      return
    }

    if (!productForm.price || parseFloat(productForm.price) <= 0) {
      setError('Product price must be greater than 0')
      return
    }

    if (!productForm.stockCount || parseInt(productForm.stockCount) < 0) {
      setError('Stock count must be 0 or greater')
      return
    }
    
    try {
            const productData = {
        ...productForm, 
        shopId: shop.id,
        price: productForm.price ? parseFloat(productForm.price) : 0,
        stockCount: productForm.stockCount ? parseInt(productForm.stockCount) : 0,
        category: productForm.customCategory || productForm.subcategory || productForm.mainCategory
      }
      const newProduct = await createProduct(productData, token)
      
      // Validate the response
      if (!newProduct || !newProduct.id) {
        setError('Invalid product response from server')
        return
      }
      setProducts([...products, newProduct])
      setShowAddProduct(false)
      setProductForm({
        title: '',
        description: '',
        price: '',
        mainCategory: '',
        subcategory: '',
        customCategory: '',
        stockCount: ''
      })
    } catch (error) {
      console.error('Failed to create product:', error)
      setError('Failed to create product: ' + error.message)
    }
  }

  const handleDeleteProduct = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return
    }
    
    try {
      await deleteProduct(productId, token)
      setProducts(products.filter(p => p.id !== productId))
    } catch (error) {
      console.error('Failed to delete product:', error)
      setError('Failed to delete product: ' + error.message)
    }
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setProductForm({
      title: product.title,
      description: product.description || '',
      price: product.price,
      mainCategory: product.mainCategory || '',
      subcategory: product.subcategory || '',
      customCategory: product.customCategory || '',
      stockCount: product.stockCount || ''
    })
    setShowEditProduct(true)
  }

  // --- Product Details helpers ---
  const hasProductVariants = (product) => {
    try {
      // Check for sizes or variants in various possible fields
      if (product.sizesJson) {
        const sizes = JSON.parse(product.sizesJson)
        return Array.isArray(sizes) && sizes.length > 0
      }
      if (product.variantsJson) {
        const variants = JSON.parse(product.variantsJson)
        return Array.isArray(variants) && variants.length > 0
      }
      if (product.sizes && Array.isArray(product.sizes) && product.sizes.length > 0) {
        return true
      }
      if (product.variants && Array.isArray(product.variants) && product.variants.length > 0) {
        return true
      }
      // Check if description mentions sizes or variants
      if (product.description) {
        const desc = product.description.toLowerCase()
        return desc.includes('size') || desc.includes('variant') || desc.includes('option')
      }
      return false
    } catch (e) {
      return false
    }
  }

  const handleViewProductDetails = (product) => {
    setSelectedProduct(product)
    setShowProductDetails(true)
  }

  const handleCloseProductDetails = () => {
    setShowProductDetails(false)
    setSelectedProduct(null)
  }

  // --- Cart & Order helpers ---
  const makeCartItem = (item) => {
    const priceNum = item && item.price != null ? parseFloat(item.price) : 0
    // Derive a thumbnail image if available (for products). Services will show a placeholder.
    let imageUrl = null
    try {
      if (item) {
        // Prefer JSON array from DB
        if (item.imagePathsJson) {
          const imgs = JSON.parse(item.imagePathsJson)
          if (Array.isArray(imgs) && imgs.length > 0) {
            imageUrl = getImageUrl(imgs[0])
          }
        }
        // Alternate shapes some APIs use
        if (!imageUrl && Array.isArray(item.imagePaths) && item.imagePaths.length > 0) {
          imageUrl = getImageUrl(item.imagePaths[0])
        }
        if (!imageUrl && Array.isArray(item.images) && item.images.length > 0) {
          imageUrl = getImageUrl(item.images[0])
        }
        if (!imageUrl && (item.primaryImage || item.image || item.thumbnail)) {
          const raw = item.primaryImage || item.image || item.thumbnail
          imageUrl = (raw && (raw.startsWith('http') || raw.startsWith('/'))) ? getImageUrl(raw) : raw
        }
      }
    } catch (e) {
      // ignore parse error; fallback to null
    }
    if (!imageUrl && item && item.imageUrl) {
      // Fallback if a direct imageUrl exists
      try {
        imageUrl = getImageUrl(item.imageUrl)
      } catch {
        imageUrl = item.imageUrl
      }
    }
    return {
      serviceId: item?.id, // use same field for products/services
      name: item?.title || item?.name || 'Item',
      unitPrice: isNaN(priceNum) ? 0 : priceNum,
      quantity: 1,
      imageUrl,
    }
  }

  // Resolve the best display URL for a cart item thumbnail
  const resolveCartImage = (ci) => {
    if (!ci) return null
    const normalize = (p) => {
      if (!p) return null
      try {
        // If already http(s), return as is
        if (typeof p === 'string' && (p.startsWith('http://') || p.startsWith('https://'))) return p
        return getImageUrl(p)
      } catch {
        return p
      }
    }
    // 1) If cart already has a usable URL/path
    let url = normalize(ci.imageUrl || ci.imagePath || ci.thumbnail)
    if (url) return url

    // 2) Try to hydrate from current products list
    const prod = Array.isArray(products) ? products.find(p => p.id === ci.serviceId) : null
    if (prod) {
      // try various fields on product
      try {
        if (prod.imagePathsJson) {
          const imgs = JSON.parse(prod.imagePathsJson)
          if (Array.isArray(imgs) && imgs.length > 0) return normalize(imgs[0])
        }
      } catch {}
      if (Array.isArray(prod.imagePaths) && prod.imagePaths.length > 0) return normalize(prod.imagePaths[0])
      if (Array.isArray(prod.images) && prod.images.length > 0) return normalize(prod.images[0])
      return normalize(prod.primaryImage || prod.image || prod.thumbnail)
    }

    // 3) Services typically have no images; return null -> placeholder will render
    return null
  }

  // Hydrate any legacy cart items without imageUrl whenever the Order modal opens
  useEffect(() => {
    if (!showOrderModal) return
    try {
      setCartItems((prev) => {
        if (!Array.isArray(prev) || prev.length === 0) return prev
        let changed = false
        const updated = prev.map(ci => {
          const url = resolveCartImage(ci)
          if (url && ci.imageUrl !== url) {
            changed = true
            return { ...ci, imageUrl: url }
          }
          return ci
        })
        return changed ? updated : prev
      })
    } catch {}
  }, [showOrderModal, products, services, setCartItems])

  const addItemToCart = (item) => {
    const newItem = makeCartItem(item)
    setCartItems((prev) => {
      const idx = prev.findIndex(ci => ci.serviceId === newItem.serviceId)
      if (idx >= 0) {
        const updated = [...prev]
        updated[idx] = { ...updated[idx], quantity: (updated[idx].quantity || 0) + 1 }
        return updated
      }
      return [...prev, newItem]
    })
  }

  const incrementQty = (serviceId) => {
    setCartItems(prev => prev.map(ci => ci.serviceId === serviceId ? { ...ci, quantity: (ci.quantity || 1) + 1 } : ci))
  }

  const decrementQty = (serviceId) => {
    setCartItems(prev => prev.flatMap(ci => {
      if (ci.serviceId !== serviceId) return [ci]
      const nextQty = (ci.quantity || 1) - 1
      return nextQty > 0 ? [{ ...ci, quantity: nextQty }] : []
    }))
  }

  const removeFromCart = (serviceId) => {
    setCartItems(prev => prev.filter(ci => ci.serviceId !== serviceId))
  }

  const getCartTotal = () => {
    try {
      return cartItems.reduce((acc, ci) => acc + (Number(ci.unitPrice || 0) * Number(ci.quantity || 0)), 0)
    } catch {
      return 0
    }
  }

  const handleAddToCart = (item) => {
    addItemToCart(item)
    setOrderSuccess(`${item?.title || item?.name || 'Item'} added to cart`)
    setTimeout(() => setOrderSuccess(''), 1500)
  }

  const handleOrderNow = (item) => {
    addItemToCart(item)
    setShowOrderModal(true)
  }

  const handleReviewSubmitted = (rating, comment) => {
    // Update local rating state
    const updatedRating = getShopRating(shop.id, user?.id)
    setLocalShopRating(updatedRating)
    
    // Show success message
    setOrderSuccess('Thank you for your review!')
    setTimeout(() => setOrderSuccess(''), 3000)
  }

  const submitOrder = async (e) => {
    if (e && e.preventDefault) e.preventDefault()
    setOrderError('')
    setOrderSuccess('')

    if (!senderEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(senderEmail)) {
      setOrderError('Please enter a valid email address')
      return
    }
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      setOrderError('Your cart is empty')
      return
    }

    const payload = {
      shopId: shop?.id || shopId,
      senderEmail: senderEmail.trim(),
      message: orderMessage || '',
      items: cartItems.map(ci => ({
        serviceId: ci.serviceId,
        name: ci.name,
        quantity: ci.quantity,
        unitPrice: Number(ci.unitPrice || 0)
      }))
    }

    try {
      setPlacingOrder(true)
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await (async () => { try { return await res.json() } catch { return {} } })()

      if (res.ok) {
        // Record the order for review eligibility
        if (user?.id && shop?.id) {
          const orderItems = cartItems.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity
          }))
          recordUserOrder(user.id, shop.id, orderItems)
        }
        
        // Show centered success popup that auto fades
        setCartItems([])
        setShowOrderModal(false)
        setOrderSuccess('')
        setOrderPlacedPopup(true)
        setTimeout(() => setOrderPlacedPopup(false), 2600)
      } else {
        setOrderError(data?.message || 'Failed to place order')
      }
    } catch (err) {
      console.error('Order submission failed:', err)
      setOrderError('Failed to place order. Please try again later.')
    } finally {
      setPlacingOrder(false)
    }
  }

  const handleUpdateProduct = async (e) => {
    e.preventDefault()
    try {
      const productData = {
        ...productForm,
        category: productForm.customCategory || productForm.subcategory || productForm.mainCategory
      }
      const updatedProduct = await updateProduct(editingProduct.id, productData, token)
      
      // Validate the response
      if (!updatedProduct || !updatedProduct.id) {
        setError('Invalid product response from server')
        return
      }
      
      setProducts(products.map(p => p.id === editingProduct.id ? updatedProduct : p))
      setShowEditProduct(false)
      setEditingProduct(null)
      setProductForm({
        title: '',
        description: '',
        price: '',
        mainCategory: '',
        subcategory: '',
        customCategory: '',
        stockCount: ''
      })
    } catch (error) {
      console.error('Failed to update product:', error)
      setError('Failed to update product: ' + error.message)
    }
  }

  // Service management functions
  const handleAddService = async (e) => {
    e.preventDefault()
    
    // Validate required fields
    if (!serviceForm.title || !serviceForm.title.trim()) {
      setError('Service title is required')
      return
    }

    if (!serviceForm.price || parseFloat(serviceForm.price) <= 0) {
      setError('Service price must be greater than 0')
      return
    }
    
    try {
      // Only send service-relevant fields, exclude durationMinutes which is not in the DTO
      const serviceData = {
        title: serviceForm.title,
        description: serviceForm.description,
        price: serviceForm.price ? parseFloat(serviceForm.price) : 0,
        mainCategory: serviceForm.mainCategory,
        subcategory: serviceForm.subcategory,
        customCategory: serviceForm.customCategory,
        status: serviceForm.status,
        shopId: shop.id
      }
      const newService = await createService(serviceData, token)
      
      // Validate the response
      if (!newService || !newService.id) {
        setError('Invalid service response from server')
        return
      }
      setServices([...services, newService])
      setShowAddService(false)
      setServiceForm({
        title: '',
        description: '',
        price: '',
        mainCategory: '',
        subcategory: '',
        customCategory: '',
        status: 'AVAILABLE',
        durationMinutes: ''
      })
    } catch (error) {
      console.error('Failed to create service:', error)
      setError('Failed to create service: ' + error.message)
    }
  }

  const handleDeleteService = async (serviceId) => {
    if (!confirm('Are you sure you want to delete this service?')) {
      return
    }
    
    try {
      await deleteService(serviceId, token)
      setServices(services.filter(s => s.id !== serviceId))
    } catch (error) {
      console.error('Failed to delete service:', error)
      setError('Failed to delete service: ' + error.message)
    }
  }

  const handleEditService = (service) => {
    setEditingService(service)
    setServiceForm({
      title: service.title,
      description: service.description || '',
      price: service.price,
      mainCategory: service.mainCategory || '',
      subcategory: service.subcategory || '',
      customCategory: service.customCategory || '',
      status: service.status || 'AVAILABLE',
      durationMinutes: service.durationMinutes || ''
    })
    setShowEditService(true)
  }

  const handleUpdateService = async (e) => {
    e.preventDefault()
    try {
      // Only send service-relevant fields, exclude durationMinutes which is not in the DTO
      const serviceData = {
        title: serviceForm.title,
        description: serviceForm.description,
        price: serviceForm.price,
        mainCategory: serviceForm.mainCategory,
        subcategory: serviceForm.subcategory,
        customCategory: serviceForm.customCategory,
        status: serviceForm.status
      }
      const updatedService = await updateService(editingService.id, serviceData, token)
      
      // Validate the response
      if (!updatedService || !updatedService.id) {
        setError('Invalid service response from server')
        return
      }
      
      setServices(services.map(s => s.id === editingService.id ? updatedService : s))
      setShowEditService(false)
      setEditingService(null)
      setServiceForm({
        title: '',
        description: '',
        price: '',
        mainCategory: '',
        subcategory: '',
        customCategory: '',
        status: 'AVAILABLE',
        durationMinutes: ''
      })
    } catch (error) {
      console.error('Failed to update service:', error)
      setError('Failed to update service: ' + error.message)
    }
  }

  const handleStockChange = async (productId, change) => {
    try {
      const product = products.find(p => p.id === productId)
      if (!product) return
      
      const newStock = Math.max(0, (product.stockCount || 0) + change)
      
      // Update the product in the list immediately for better UX
      setProducts(products.map(p => 
        p.id === productId ? { ...p, stockCount: newStock } : p
      ))
      
      // Make API call to update stock
      await updateProductStock(productId, newStock, token)
    } catch (error) {
      console.error('Failed to update stock:', error)
      setError('Failed to update stock: ' + error.message)
      // Revert the optimistic update
      await fetchProductsWithPagination(currentPage)
    }
  }

  // Debounce timer for stock input
  const stockDebounceTimers = useRef({})

  const handleStockInputChange = async (productId, value) => {
    const newStock = Math.max(0, parseInt(value) || 0)
    
    // Update the product in the list immediately for better UX
    setProducts(products.map(p => 
      p.id === productId ? { ...p, stockCount: newStock } : p
    ))
    
    // Clear existing timer for this product
    if (stockDebounceTimers.current[productId]) {
      clearTimeout(stockDebounceTimers.current[productId])
    }
    
    // Set new timer for this product
    stockDebounceTimers.current[productId] = setTimeout(async () => {
      try {
        // Show saving state
        setSavingStock(prev => ({ ...prev, [productId]: true }))
        
        // Make API call to update stock
        await updateProductStock(productId, newStock, token)
        
        // Clear the timer reference and saving state
        delete stockDebounceTimers.current[productId]
        setSavingStock(prev => ({ ...prev, [productId]: false }))
      } catch (error) {
        console.error('Failed to update stock:', error)
        setError('Failed to update stock: ' + error.message)
        // Revert the optimistic update
        await fetchProductsWithPagination(currentPage)
        // Clear the timer reference and saving state
        delete stockDebounceTimers.current[productId]
        setSavingStock(prev => ({ ...prev, [productId]: false }))
      }
    }, 2000) // 2 second delay
  }

  if (loading) {
    const shopNameFromSlug = extractShopNameFromSlug(slug)
    const loadingTitle = shopNameFromSlug || "Shop"
    
    return (
      <>
        <SEOHead 
          key={`loading-${shopId}`}
          title={loadingTitle}
          description="Loading shop information..."
        />
        <main className="container shop-page-container">
          {/* Shop Header Skeleton */}
          <div className="shop-content-layout">
            <div className="shop-left-column">
              <section className="card shop-header">
                <div className="shop-header-content">
                  <div className="shop-info-section">
                    <SkeletonAvatar size="200px" style={{ marginBottom: '1rem' }} />
                    <div className="shop-details">
                      <SkeletonText lines={1} height="2rem" style={{ marginBottom: '0.5rem' }} />
                      <SkeletonText lines={2} height="1rem" style={{ marginBottom: '1rem' }} />
                      
                      <div className="shop-location-section">
                        <SkeletonText lines={1} height="1.2rem" style={{ marginBottom: '0.5rem' }} />
                        <SkeletonText lines={1} height="1rem" style={{ width: '80%' }} />
                      </div>
                      
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <SkeletonButton width="120px" />
                        <SkeletonButton width="120px" />
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
            
            <div className="shop-right-column">
              <SkeletonMap style={{ height: '300px', marginBottom: '1rem' }} />
            </div>
          </div>
          
          {/* Products Section Skeleton */}
          <section className="card" style={{ marginTop: '2rem' }}>
            <SkeletonText lines={1} height="1.5rem" style={{ marginBottom: '1rem' }} />
            <div className="products-grid-full-width">
              {Array.from({ length: 8 }).map((_, index) => (
                <SkeletonProductCard key={index} />
              ))}
            </div>
          </section>
        </main>
      </>
    )
  }

  if (error) {
    return (
      <>
        <SEOHead 
          title="Error - LocalsLocalMarket"
          description="We encountered an issue loading the shop. Please try again."
        />
        <main className="container shop-page-container">
          <ErrorDisplay 
            error={error}
            title="Unable to Load Shop"
          />
        </main>
      </>
    )
  }

  if (!shop) {
    return (
      <>
        <SEOHead 
          title="Shop Not Found - LocalsLocalMarket"
          description="The requested shop could not be found. Browse other local shops and businesses on LocalsLocalMarket."
        />
        <main className="container shop-page-container">
          <div className="muted">Shop not found</div>
        </main>
      </>
    )
  }

  return (
    <>
      <SEOHead 
        key={`shop-${shop?.id || 'unknown'}`}
        title={shop?.name || 'Shop'}
        description={`Visit ${shop?.name || 'Shop'} - ${shop?.addressLine || 'Local shop'}. Discover products, contact information, and location. Support local businesses on LocalsLocalMarket.`}
        keywords={`${shop?.name || 'Shop'}, local shop, ${shop?.addressLine ? shop.addressLine.split(',')[0] : 'local business'}, local products, shop local`}
        url={shop?.name && shop?.id ? `https://localslocalmarket.com/shops/${generateShopSlug(shop.name, shop.id)}` : undefined}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": shop?.name,
          "description": shop?.description || (shop?.name ? `Local shop: ${shop.name}` : undefined),
          "url": shop?.name && shop?.id ? `https://localslocalmarket.com/shops/${generateShopSlug(shop.name, shop.id)}` : undefined,
          "telephone": shop?.phone,
          "email": shop?.email,
          "address": shop?.addressLine ? {
            "@type": "PostalAddress",
            "streetAddress": shop.addressLine
          } : undefined,
          "geo": shop?.lat && shop?.lng ? {
            "@type": "GeoCoordinates",
            "latitude": shop.lat,
            "longitude": shop.lng
          } : undefined,
          "image": shop?.coverPath ? getImageUrl(shop.coverPath) : undefined,
          "logo": shop?.logoPath ? getImageUrl(shop.logoPath) : undefined,
          "sameAs": [
            shop?.facebook,
            shop?.instagram,
            shop?.twitter,
            shop?.website
          ].filter(Boolean)
        }}
      />
      <main className="container shop-page-container">


      {/* Shop Content - Two Column Layout */}
      <div className="shop-content-layout">
        {/* Left Column - Shop Info Only */}
        <div className="shop-left-column">
          {/* Shop Header */}
          <section className="card shop-header" data-tutorial="shop-header">
            <div className="shop-header-content">
              <div className="shop-info-section">

                {/* Mobile Avatar */}
                <div className="mobile-only">
                  <Avatar src={getImageUrl(shop.logoPath)} alt={shop.name} size={80} fallback={<Store size={40} />} />
                </div>
                
                {/* Desktop Avatar */}
                <div className="desktop-only">
                  <Avatar src={getImageUrl(shop.logoPath)} alt={shop.name} size={220} fallback={<Store size={110} />} />
                </div>
                <div className="shop-details">
                  <div className="shop-name-section">
                    <h1 className="shop-name">{shop.name}</h1>
                    <div className="shop-offering-badges" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                      {(() => {
                        const type = (shop.offeringType || 'both').toLowerCase()
                        const priority = (shop.showcasePriority || 'products').toLowerCase()
                        const badges = []
                        if (type === 'products') badges.push({ label: 'Products', tip: 'This shop offers products only' })
                        else if (type === 'services') badges.push({ label: 'Services', tip: 'This shop offers services only' })
                        else badges.push({ label: 'Products & Services', tip: 'This shop offers both products and services' })
                        badges.push({ label: `Show ${priority === 'services' ? 'Services' : 'Products'} first`, tip: 'The first tab matches the shop\'s showcase preference' })
                        return badges.map((b, i) => (
                          <span key={i} className="chip" style={{ fontSize: '0.75rem' }} title={b.tip}>{b.label}</span>
                        ))
                      })()}
                    </div>
                    {shop.description && (
                      <p className="shop-tagline">
                        {shop.description}
                      </p>
                    )}
                    
                    {/* Shop Rating Display */}
                    <div className="shop-rating-display">
                      <div className="rating-stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span 
                            key={star} 
                            className={`rating-star ${star <= Math.round(localShopRating.averageRating || shop.averageRating || 0) ? 'filled' : ''}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <div className="rating-info">
                        <span className="rating-score">
                          {localShopRating.averageRating || shop.averageRating ? (localShopRating.averageRating || shop.averageRating).toFixed(1) : '--'}
                        </span>
                        <button
                          type="button"
                          className="link-button rating-count"
                          onClick={scrollToReviews}
                          title="View reviews"
                          style={{ background: 'transparent', border: 'none', color: 'var(--accent)', cursor: 'pointer', padding: 0, marginLeft: '0.5rem' }}
                        >
                          View reviews{(localShopRating.reviewCount || shop.reviewCount) ? ` (${localShopRating.reviewCount || shop.reviewCount})` : ''}
                        </button>
                      </div>
                    </div>
                  </div>
                    
                    {/* Address under reviews for desktop */}
                    {shop.addressLine && (
                      <div className="shop-address-desktop desktop-only" style={{ marginTop: '0.75rem' }}>
                        <div className="location-row">
                          <span className="location-icon"><MapPin size={16} /></span>
                          <span className="location-address">{shop.addressLine}</span>
                          <button 
                            className="copy-btn"
                            onClick={() => copyToClipboard(shop.addressLine, 'Address')}
                            title="Copy address"
                          >
                            {copiedText === 'Address' ? <Check size={16} /> : <Copy size={16} />}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  
                  

                </div>
                {/* Desktop actions: Share and Review */}
                <div className="desktop-actions desktop-only">
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => setShowReviewModal(true)}
                    disabled={!shop}
                    aria-label={localShopRating.hasUserReviewed ? "Edit your review" : (user ? "Review this shop" : "Login required to review")}
                    data-tutorial="review-btn"
                    title={
                      !user ? "Please log in to leave a review" :
                      localShopRating.hasUserReviewed ? "Edit your review" :
                      "Leave a review for this shop"
                    }
                  >
                    <MessageSquare size={16} style={{ marginRight: '0.4rem' }} /> 
                    {!user ? 'Login to Review' : localShopRating.hasUserReviewed ? 'Edit Review' : 'Write Review'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => setShareOpen(true)}
                    disabled={!shop}
                    aria-label="Share shop"
                  >
                    <Share2 size={16} style={{ marginRight: '0.4rem' }} /> Share
                  </button>
                  
                  {/* Shop image as clickable button for desktop */}
                  {shop.coverPath && (
                    <div className="shop-image-button desktop-only" style={{ marginTop: '0.75rem', width: '100%' }}>
                      <button
                        className="shop-image-btn"
                        onClick={() => setShowImageModal(true)}
                        title="View full shop image"
                        style={{ 
                          width: '100%', 
                          padding: 0, 
                          border: 'none', 
                          background: 'transparent',
                          cursor: 'pointer',
                          borderRadius: '8px',
                          overflow: 'hidden'
                        }}
                      >
                        <img 
                          src={getImageUrl(shop.coverPath, { forceRefresh: false })} 
                          alt={`${shop.name} shop view - Click to view full size`}
                          style={{ 
                            objectFit: 'cover', 
                            borderRadius: '8px',
                            width: '100%',
                            height: '180px',
                            transition: 'transform 0.2s ease'
                          }}
                          onError={(e) => {
                            console.error('Shop cover image failed to load:', e.target.src)
                            // Try with force refresh
                            setTimeout(() => {
                              e.target.src = getImageUrl(shop.coverPath, { forceRefresh: true })
                            }, 1000)
                          }}
                        />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {/* Location full-width row under header info */}
              {shop.addressLine && (
                <div className="shop-location-inline mobile-only">
                  <div className="location-row">
                    <span className="location-icon"><MapPin size={16} /></span>
                    <span className="location-address">{shop.addressLine}</span>
                    <button 
                      className="copy-btn"
                      onClick={() => copyToClipboard(shop.addressLine, 'Address')}
                      title="Copy address"
                    >
                      {copiedText === 'Address' ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                  {shop.coverPath && (
                    <div className="shop-view-image" style={{ marginTop: '0.5rem' }}>
                      <img 
                        src={getImageUrl(shop.coverPath)} 
                        alt={`${shop.name} shop view`}
                        style={{ objectFit: 'cover', borderRadius: '8px' }}
                      />
                    </div>
                  )}
                </div>
              )}
              {/* Floating Map Button (mobile) */}
              {isMobileDevice && shop?.lat && shop?.lng && (
                  <button 
                  type="button"
                  className="floating-map-btn"
                  onClick={() => setShowMapModal(true)}
                  aria-label="Open map"
                >
                  <MapPinIcon size={18} />
                  </button>
              )}

              {/* Modals accessible when shop is loaded */}
              <Modal isOpen={shareOpen} onClose={() => setShareOpen(false)} title={`Share ${shop?.name || 'Shop'}`} size="small">
                <p className="muted" style={{ marginBottom: '0.75rem' }}>Help others discover {shop?.name || 'this shop'}</p>
                        <SocialSharing
                  title={`${shop?.name || 'Shop'} - Local Shop`}
                  description={`Visit ${shop?.name || 'Shop'} - ${shop?.addressLine || 'Local shop'}. Discover products and support local businesses.`}
                  url={shop?.name && shop?.id ? `https://localslocalmarket.com/shops/${generateShopSlug(shop.name, shop.id)}` : undefined}
                  image={shop?.coverPath ? getImageUrl(shop.coverPath) : undefined}
                />
              </Modal>
              <Modal isOpen={showBusinessHours} onClose={() => setShowBusinessHours(false)} title="Business Hours" size="small">
                <div className="hours-grid">
                  {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => {
                    const hours = businessHours[day];
                    return (
                      <div key={day} className="hours-row">
                        <span className="day-name">{day.charAt(0).toUpperCase() + day.slice(1)}</span>
                        <span className="hours-time">{formatHoursDisplay(hours)}</span>
                      </div>
                    );
                  })}
                </div>
                <div style={{ marginTop: '0.75rem' }}>
                  <div className={`status-indicator ${isShopOpen() ? 'open' : 'closed'}`}>
                    {isShopOpen() ? 'Open' : 'Closed'}
                  </div>
                </div>
              </Modal>

              {/* Map Modal */}
              <Modal isOpen={showMapModal} onClose={() => setShowMapModal(false)} title="Location" size="small">
                <div id="mobile-shop-map" ref={mobileMapRef} style={{ width: '100%', height: '280px', borderRadius: '8px', overflow: 'hidden' }} />
              </Modal>

              {/* Shop Image Modal */}
              <Modal isOpen={showImageModal} onClose={() => setShowImageModal(false)} title={`${shop?.name || 'Shop'} Image`} size="large">
                {shop?.coverPath && (
                  <div style={{ textAlign: 'center' }}>
                    <img 
                      src={getImageUrl(shop.coverPath)} 
                      alt={`${shop.name} shop view`}
                      style={{ 
                        maxWidth: '100%', 
                        maxHeight: '80vh', 
                        objectFit: 'contain',
                        borderRadius: '8px'
                      }}
                    />
                  </div>
                )}
              </Modal>
                {/* Global Share, Review, and Hours Buttons */}
                <div className="shop-actions-row mobile-only">
                  <button 
                    type="button" 
                    className="btn btn-outline" 
                    onClick={() => setShowReviewModal(true)} 
                    disabled={!shop}
                    data-tutorial="review-btn"
                    title={!user ? "Please log in to leave a review" : (localShopRating.hasUserReviewed ? "Edit your review" : "Leave a review for this shop")}
                  >
                    <MessageSquare size={16} style={{ marginRight: '0.4rem' }} /> 
                    {!user ? 'Login to Review' : localShopRating.hasUserReviewed ? 'Edit Review' : 'Review'}
                  </button>
                  <button type="button" className="btn btn-primary" onClick={() => { console.log('Share click'); setShareOpen(true) }} disabled={!shop}>
                    <Share2 size={16} style={{ marginRight: '0.4rem' }} /> Share
                  </button>
                  <button 
                    type="button"
                    className="btn btn-secondary hours-inline-btn"
                    onClick={() => { console.log('Hours click'); setShowBusinessHours(true) }}
                  >
                    <Clock size={16} style={{ marginRight: '0.4rem' }} /> {isShopOpen() ? 'Open' : 'Closed'}
                  </button>
                </div>
              {isOwner && (
                <div className="shop-owner-actions">
                  <button 
                    className="btn btn-secondary"
                    onClick={() => window.location.href = `/shops/${generateShopSlug(shop.name, shop.id)}/edit`}
                  >
                    <span className="btn-icon">✏️</span>
                    Edit Shop
                  </button>
                  <button 
                    className="btn btn-primary"
                    onClick={() => window.location.href = '/dashboard'}
                  >
                    <span className="btn-icon"><BarChart3 size={16} /></span>
                    Go to Dashboard
                  </button>
                  {import.meta && import.meta.env && import.meta.env.DEV && (
                    <button 
                      className="btn btn-outline"
                      onClick={() => window.location.reload()}
                      style={{fontSize: '0.8rem', padding: '4px 8px'}}
                    >
                      Refresh
                    </button>
                  )}
                </div>
              )}
            

            {/* Contact & Social - Collapsible */}
              {(shop.phone || shop.website || shop.email || shop.facebook || shop.instagram || shop.twitter) && (
              <div className="collapsible-section">
                <button 
                  className="collapsible-toggle"
                  onClick={() => setContactsOpen(!contactsOpen)}
                  aria-expanded={contactsOpen}
                >
                  <span>Contact & Social</span>
                  <span className={`dropdown-arrow ${contactsOpen ? 'rotated' : ''}`}>▼</span>
                </button>
                {contactsOpen && (
                  <div className="collapsible-content">
                <div className="shop-contact-details" data-tutorial="contact-info">
                  {shop.phone && (
                    <div className="contact-item">
                      <span className="contact-icon"><Phone size={16} /></span>
                      <a 
                        href={`tel:${shop.phone}`}
                        className="contact-link"
                      >
                        {shop.phone}
                      </a>
                      <button 
                        className="copy-btn"
                        onClick={() => copyToClipboard(shop.phone, 'Phone')}
                        title="Copy phone number"
                      >
                        {copiedText === 'Phone' ? <Check size={16} /> : <Copy size={16} />}
                      </button>
                    </div>
                  )}
                  {shop.email && (
                    <div className="contact-item">
                      <span className="contact-icon">✉️</span>
                      <a 
                        href={`mailto:${shop.email}`}
                        className="contact-link"
                      >
                        {shop.email}
                      </a>
                    </div>
                  )}
                  {shop.website && (
                    <div className="contact-item">
                      <span className="contact-icon"><Globe size={16} /></span>
                      <a 
                        href={shop.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="contact-link"
                      >
                        {shop.website}
                      </a>
                    </div>
                  )}
                  {shop.facebook && (
                    <div className="contact-item">
                      <span className="contact-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </span>
                      <a 
                        href={shop.facebook} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="contact-link"
                      >
                        Facebook
                      </a>
                    </div>
                  )}
                  {shop.instagram && (
                    <div className="contact-item">
                      <span className="contact-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      </span>
                      <a 
                        href={shop.instagram} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="contact-link"
                      >
                        Instagram
                      </a>
                    </div>
                  )}
                  {shop.twitter && (
                    <div className="contact-item">
                      <span className="contact-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                      </span>
                      <a 
                        href={shop.twitter} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="contact-link"
                      >
                        X
                      </a>
                    </div>
                  )}
                    </div>
                </div>
              )}
            </div>
            )}
          </section>
        </div>

        {/* Right Column - Map Only */}
        <div className="shop-right-column">
          {/* Address moved into header */}
          {/* Shop Location Map */}
          {shop.lat && shop.lng && (
            <section className="card shop-map-section">
              <div className="map-header">
                <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Location</h3>
                <button 
                  className="center-location-btn"
                  onClick={centerShopLocation}
                  title="Center on shop location"
                  disabled={!mapLoaded}
                >
                  <Crosshair size={16} />
                </button>
              </div>
              <div 
                ref={mapRef}
                id="shop-map"
                className={`shop-map ${mapLoaded ? 'loaded' : ''}`}
              >
                {!mapLoaded && (
                  <div className="map-loading">
                    <SkeletonMap style={{ height: '100%', borderRadius: '8px' }} />
                  </div>
                )}
              </div>
              
              {/* Business Hours Status under map for desktop only */}
              <div className="desktop-only" style={{ marginTop: '1rem', textAlign: 'center' }}>
                <button
                  type="button"
                  className="btn btn-secondary hours-inline-btn"
                  onClick={() => setShowBusinessHours(true)}
                  aria-label="View business hours"
                  style={{ width: '100%' }}
                >
                  <Clock size={16} style={{ marginRight: '0.4rem' }} /> {isShopOpen() ? 'Open' : 'Closed'}
                </button>
              </div>
            </section>
          )}
          
          {/* Business Hours inline dropdown removed; now handled by modal near header */}
        </div>
      </div>

      {/* Products & Services Section - Full Width */}
      <section className="products-section-full-width">
        {/* Tab Navigation */}
        <div className="items-tab-navigation" data-tutorial="products-services-tabs">
          {(shop?.offeringType || 'both').toLowerCase() !== 'services' && (
          <button
            className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <Package size={16} />
            Products ({products.length})
          </button>
          )}
          {(shop?.offeringType || 'both').toLowerCase() !== 'products' && (
          <button
            className={`tab-btn ${activeTab === 'services' ? 'active' : ''}`}
            onClick={() => setActiveTab('services')}
          >
            <Wrench size={16} />
            Services ({services.length})
          </button>
          )}
        </div>

        <div className="products-header">
          {isOwner && (
            <button 
              className="btn add-another-product-btn"
              onClick={() => {
                if (activeTab === 'products') {
                  setShowAddProduct(true);
                } else {
                  setShowAddService(true);
                }
              }}
            >
              Add {activeTab === 'products' ? 'Product' : 'Service'}
            </button>
          )}
        </div>



        {/* Enhanced Item Controls */}
        {((activeTab === 'products' && Array.isArray(products) && products.length > 0) || 
          (activeTab === 'services' && Array.isArray(services) && services.length > 0)) && (
          <div className="product-controls">
            <div className="controls-left">
              <div className="search-sort-row">
                <div className="search-container">
                  <div className="search-icon"><Search size={16} /></div>
                  <input
                    type="text"
                    placeholder={`Search ${activeTab}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="enhanced-search-input"
                  />
                  {searchQuery && (
                    <button
                      className="clear-search-btn"
                      onClick={() => setSearchQuery('')}
                      type="button"
                    >
                      ✕
                    </button>
                  )}
                </div>
                
                <div className="sort-container">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="enhanced-sort-select"
                  >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="price-low">Price ↑</option>
                    <option value="price-high">Price ↓</option>
                    <option value="name-asc">Name A-Z</option>
                    <option value="name-desc">Name Z-A</option>
                  </select>
                </div>
              </div>
            </div>
            {/* Location section moved to right column */}
            
            {/* Filter toggle chips removed per design (redundant) */}
          </div>
        )}

        {/* Collapsible Filter Panels */}
        {Array.isArray(products) && products.length > 0 && (
          <>
            {/* Price Filter Panel */}
            {showPriceFilter && (
              <div className="filter-panel price-filter-panel">
                <div className="filter-panel-header">
                  <h5>Price Range</h5>
                  <button
                    className="close-filter-btn"
                    onClick={() => setShowPriceFilter(false)}
                    type="button"
                  >
                    ✕
                  </button>
                </div>
                <div className="price-range-controls">
                  <div className="price-input-group">
                    <label>Min Price</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                      className="price-range-input"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="price-input-group">
                    <label>Max Price</label>
                    <input
                      type="number"
                      placeholder="999.99"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                      className="price-range-input"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Stock Filter Panel */}
            {showStockFilter && (
              <div className="filter-panel stock-filter-panel">
                <div className="filter-panel-header">
                  <h5>Stock Status</h5>
                  <button
                    className="close-filter-btn"
                    onClick={() => setShowStockFilter(false)}
                    type="button"
                  >
                    ✕
                  </button>
                </div>
                <div className="stock-options">
                  <label className="stock-option">
                    <input
                      type="radio"
                      name="stockFilter"
                      value="all"
                      checked={stockFilter === 'all'}
                      onChange={(e) => setStockFilter(e.target.value)}
                    />
                    <span className="radio-label">All Products</span>
                  </label>
                  <label className="stock-option">
                    <input
                      type="radio"
                      name="stockFilter"
                      value="in-stock"
                      checked={stockFilter === 'in-stock'}
                      onChange={(e) => setStockFilter(e.target.value)}
                    />
                    <span className="radio-label">In Stock</span>
                  </label>
                  <label className="stock-option">
                    <input
                      type="radio"
                      name="stockFilter"
                      value="out-of-stock"
                      checked={stockFilter === 'out-of-stock'}
                      onChange={(e) => setStockFilter(e.target.value)}
                    />
                    <span className="radio-label">Out of Stock</span>
                  </label>
                  <label className="stock-option">
                    <input
                      type="radio"
                      name="stockFilter"
                      value="low-stock"
                      checked={stockFilter === 'low-stock'}
                      onChange={(e) => setStockFilter(e.target.value)}
                    />
                    <span className="radio-label">Low Stock (≤5)</span>
                  </label>
                </div>
              </div>
            )}
          </>
        )}

        {/* Category Filter */}
        {(() => {
          const currentItems = activeTab === 'products' ? products : services;
          if (Array.isArray(currentItems) && currentItems.length > 0) {
            const categories = [...new Set([
              ...currentItems.map(item => item.mainCategory).filter(Boolean),
              ...currentItems.map(item => item.subcategory).filter(Boolean),
              ...currentItems.map(item => item.customCategory).filter(Boolean),
              ...currentItems.map(item => item.category).filter(Boolean) // Backward compatibility
            ])];
            if (categories.length > 1) {
              return (
                <div className="category-filter">
                  <div className="filter-label">Filter by Category:</div>
                  <div className="category-buttons">
                    <button 
                      className={`category-btn ${!selectedCategory ? 'active' : ''}`}
                      onClick={() => setSelectedCategory(null)}
                    >
                      All
                    </button>
                    {categories.map(category => (
                      <button 
                        key={category}
                        className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              );
            }
          }
          return null;
        })()}

        {(() => {
          const currentItems = activeTab === 'products' ? products : services;
          const hasItems = Array.isArray(currentItems) && currentItems.length > 0;
          
          if (!hasItems) {
            return (
              <div className="card no-products-card">
                <div className="no-products-icon">
                  {activeTab === 'products' ? <Package size={48} /> : <Wrench size={48} />}
                </div>
                <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>
                  No {activeTab} yet
                </h3>
                <p className="muted" style={{ marginBottom: '1rem' }}>
                  {isOwner ? 
                    `Start ${activeTab === 'products' ? 'selling' : 'offering services'} by adding your first ${activeTab.slice(0, -1)}` : 
                    `This shop hasn't added any ${activeTab} yet`
                  }
                </p>
                {isOwner && (
                  <button 
                    className="btn btn-primary add-first-product-btn"
                    onClick={() => {
                      if (activeTab === 'products') {
                        setShowAddProduct(true);
                      } else {
                        setShowAddService(true);
                      }
                    }}
                  >
                    Add Your First {activeTab === 'products' ? 'Product' : 'Service'}
                  </button>
                )}
              </div>
            );
          }
          
          return (
          <div className="products-grid-full-width">
            {activeTab === 'products' ? 
              getSortedProducts().map((product) => (
                <article 
                  key={product.id} 
                  className="card product-card"
                >
                  <div className="product-image-container">
                  {(() => {
                    let imagePaths = [];
                    try {
                      imagePaths = product.imagePathsJson ? JSON.parse(product.imagePathsJson) : [];
                    } catch (e) {
                      imagePaths = [];
                    }
                    
                    if (imagePaths.length > 0) {
                      return (
                        <>
                          <OptimizedImage 
                            src={getImageUrl(imagePaths[0], { forceRefresh: false })} 
                            alt={product.title}
                            className="product-image"
                            fallbackSrc="/placeholder-product.jpg"
                            loading="lazy"
                            retryOnError={true}
                          />
                          <div className="product-image-placeholder" style={{ display: 'none' }}>
                            <Camera size={24} />
                          </div>
                        </>
                      );
                    }
                    
                    return (
                      <div className="product-image-placeholder">
                        <Camera size={24} />
                      </div>
                    );
                  })()}
                  {product.description && product.description.trim() && (
                    <div className="product-description-hover">
                      <div className="description-trigger">
                        <Info size={16} />
                      </div>
                      <div className="description-tooltip">
                        {sanitizeText(product.description)}
                      </div>
                    </div>
                  )}
                </div>
                <div className="product-content">
                  <div className="product-title">{sanitizeText(product.title)}</div>
                  
                  <div className="product-price-stock">
                    <div className="product-price">
                      ₱{product.price ? Number(product.price).toFixed(2) : '0.00'}
                    </div>
                    <div className="product-stock-compact">
                      {product.stockCount > 0 ? (
                        <span className="stock-in-stock-compact">
                          <Check size={12} />
                          Stock: {product.stockCount}
                        </span>
                      ) : (
                        <span className="stock-out-of-stock-compact">
                          <span className="stock-x">✗</span>
                          Out
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="product-category-section">
                    {(() => {
                      const category = product.category || product.customCategory || product.subcategory || product.mainCategory;
                      return category ? (
                        <span className="category-tag">{category}</span>
                      ) : (
                        <span className="no-category">No category</span>
                      );
                    })()}
                  </div>

                  <div className="product-reviews-section">
                    <div className="product-rating">
                      {product.averageRating && product.reviewCount > 0 ? (
                        <>
                          <Star size={12} className="star-icon" />
                          <span className="rating-text">{product.averageRating.toFixed(1)}</span>
                          <span className="rating-count">({product.reviewCount})</span>
                        </>
                      ) : (
                        <span className="no-reviews">No reviews</span>
                      )}
                    </div>
                    
                    <div className="review-actions">
                      <button className="review-btn thumbs-up" title="Like this product">
                        <ThumbsUp size={14} />
                      </button>
                      <button className="review-btn thumbs-down" title="Dislike this product">
                        <ThumbsDown size={14} />
                      </button>
                    </div>
                  </div>

                  {isOwner && (
                    <div className="stock-controls">
                      <button 
                        className="stock-btn stock-minus"
                        onClick={() => handleStockChange(product.id, -1)}
                        title="Decrease stock by 1"
                      >
                        -
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
                        onClick={() => handleStockChange(product.id, 1)}
                        title="Increase stock by 1"
                      >
                        +
                      </button>
                    </div>
                  )}
                  
                  <div className="product-actions">
                    {isOwner ? (
                      <>
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleEditProduct(product)}
                        >
                          <span className="btn-icon">✏️</span>
                          Edit
                        </button>
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <span className="btn-icon"><Trash2 size={16} /></span>
                          Delete
                        </button>
                      </>
                    ) : (
                      <>
                        {hasProductVariants(product) && (
                          <button 
                            className="btn btn-outline btn-sm view-details-btn"
                            onClick={() => handleViewProductDetails(product)}
                            title="View sizes and options"
                          >
                            <Info size={16} />
                            View Details
                          </button>
                        )}
                        <button 
                          className="btn btn-primary btn-sm order-now-btn"
                          onClick={() => handleOrderNow(product)}
                          data-tutorial="order-now-btn"
                        >
                          <ShoppingCart size={20} />
                          Order Now
                        </button>
                        <button 
                          className="btn btn-outline btn-sm add-to-cart-btn"
                          onClick={() => handleAddToCart(product)}
                          data-tutorial="add-to-cart-btn"
                        >
                          <Plus size={20} />
                          Add to Cart
                        </button>
                      </>
                    )}
                  </div>
                                  </div>
                </article>
              )) :
              getSortedServices().map((service) => (
                <article 
                  key={service.id} 
                  className="card product-card"
                >
                  <div className="product-image-container">
                    <div className="product-image-placeholder">
                      <Wrench size={24} />
                    </div>
                  </div>
                  
                  <div className="product-content">
                    <h4 className="product-title">{service.title}</h4>
                    <p className="product-description">{service.description}</p>
                    
                    <div className="product-meta">
                      <div className="product-price">₱{service.price}</div>
                      <div className="product-category">
                        {service.mainCategory}
                        {service.subcategory && ` • ${service.subcategory}`}
                      </div>
                      {service.durationMinutes && (
                        <div className="service-duration">
                          <Clock size={14} />
                          {service.durationMinutes} min
                        </div>
                      )}
                    </div>
                    
                    <div className="product-status">
                      <span className={`status-badge ${service.status === 'AVAILABLE' ? 'available' : 'unavailable'}`}>
                        {service.status === 'AVAILABLE' ? 'Available' : 'Not Available'}
                      </span>
                    </div>
                    
                    <div className="product-actions">
                      {isOwner ? (
                        <>
                          <button 
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleEditService(service)}
                          >
                            <span className="btn-icon">✏️</span>
                            Edit
                          </button>
                          <button 
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteService(service.id)}
                          >
                            <span className="btn-icon"><Trash2 size={16} /></span>
                            Delete
                          </button>
                        </>
                      ) : (
                        <>
                          <button 
                            className="btn btn-primary btn-sm order-now-btn"
                            onClick={() => handleOrderNow(service)}
                            disabled={service.status !== 'AVAILABLE'}
                            data-tutorial="order-now-btn"
                          >
                            <ShoppingCart size={20} />
                            Order Now
                          </button>
                          <button 
                            className="btn btn-outline btn-sm add-to-cart-btn"
                            onClick={() => handleAddToCart(service)}
                            disabled={service.status !== 'AVAILABLE'}
                            data-tutorial="add-to-cart-btn"
                          >
                            <Plus size={20} />
                            Add to Cart
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </article>
              ))
            }
          </div>
          );
        })()}

        {/* Pagination Controls */}
        {pagination && pagination.totalPages > 1 && (
          <div className="pagination-controls">
            <div className="pagination-info">
              Showing {pagination.startIndex || 1} to {pagination.endIndex || pagination.numberOfElements} of {pagination.totalElements} products
            </div>
            <div className="pagination-buttons">
              <button 
                className="pagination-btn"
                onClick={() => fetchProductsWithPagination(currentPage - 1)}
                disabled={!pagination.hasPrevious}
              >
                Previous
              </button>
              
              {/* Page numbers */}
              {pagination.getPageRange(5).map(pageNum => (
                <button
                  key={pageNum}
                  className={`pagination-btn ${pageNum === pagination.displayPage ? 'active' : ''}`}
                  onClick={() => fetchProductsWithPagination(pageNum - 1)}
                >
                  {pageNum}
                </button>
              ))}
              
              <button 
                className="pagination-btn"
                onClick={() => fetchProductsWithPagination(currentPage + 1)}
                disabled={!pagination.hasNext}
              >
                Next
              </button>
            </div>
          </div>
        )}
         
        {/* Reviews Section - below products, above ads */}
        <section id="shop-reviews" className="card" style={{ marginTop: '2rem' }} data-tutorial="reviews">
          <ShopReviews 
            shopId={shop?.id}
            shopName={shop?.name}
            averageRating={localShopRating.averageRating || shop.averageRating || 0}
            reviewCount={localShopRating.reviewCount || shop.reviewCount || 0}
          />
        </section>

        {/* Bottom ad after products and reviews */}
        <div className="bottom-ad">
          <ResponsiveAd />
        </div>
      </section>

      {/* Advertisements Carousel - DISABLED */}
      {/* {shop.adsEnabled && shop.adsImagePathsJson && (()=>{ let imgs=[]; try{ imgs = JSON.parse(shop.adsImagePathsJson)||[] } catch { imgs=[] }
        return imgs.length>0 ? (
          <section className="card" style={{marginBottom:16}}>
            <div style={{display:'flex', overflowX:'auto', gap:8}}>
              {imgs.map((src, idx)=> (
                <div key={idx} style={{minWidth:260}}>
                  <img src={src} alt={`Ad ${idx+1}`} style={{width:'100%', height:160, objectFit:'cover', borderRadius:8}} />
                </div>
              ))}
            </div>
          </section>
        ) : null })()} */}

      {/* Related Shops */}
      <RelatedShops currentShop={shop} />


      {/* Add Product Modal */}
      <Modal 
        isOpen={showAddProduct} 
        onClose={() => setShowAddProduct(false)}
        title="Add New Product"
        size="xlarge"
      >
        <form onSubmit={handleAddProduct} className="add-product-form">
          <div>
            <label htmlFor="productTitle" className="muted form-label">
              Product Title *
            </label>
            <input
              type="text"
              id="productTitle"
              className="input"
              value={productForm.title}
              onChange={(e) => setProductForm({...productForm, title: e.target.value})}
              required
            />
          </div>

          <div>
            <label htmlFor="productDescription" className="muted form-label">
              Description
            </label>
            <textarea
              id="productDescription"
              className="input"
              value={productForm.description}
              onChange={(e) => setProductForm({...productForm, description: e.target.value})}
              rows={3}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div className="form-row">
            <div>
              <label htmlFor="productPrice" className="muted form-label">
                Price *
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
              />
            </div>
            <div>
              <label htmlFor="productCategory" className="muted form-label">
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
            <div>
              <label htmlFor="productStock" className="muted form-label">
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
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn cancel-btn" 
              onClick={() => setShowAddProduct(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary submit-btn">
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
                          setProductForm({
                  title: '',
                  description: '',
                  price: '',
                  mainCategory: '',
                  subcategory: '',
                  customCategory: '',
                  stockCount: ''
                })
        }}
        title={`Edit Product - ${editingProduct?.title || ''}`}
        size="xlarge"
      >
        <form onSubmit={handleUpdateProduct} className="add-product-form">
          <div>
            <label htmlFor="editProductTitle" className="muted form-label">
              Product Title *
            </label>
            <input
              type="text"
              id="editProductTitle"
              className="input"
              value={productForm.title}
              onChange={(e) => setProductForm({...productForm, title: e.target.value})}
              required
            />
          </div>

          <div>
            <label htmlFor="editProductDescription" className="muted form-label">
              Description
            </label>
            <textarea
              id="editProductDescription"
              className="input"
              value={productForm.description}
              onChange={(e) => setProductForm({...productForm, description: e.target.value})}
              rows={3}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div className="form-row">
            <div>
              <label htmlFor="editProductPrice" className="muted form-label">
                Price *
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
              />
            </div>
            <div>
              <label htmlFor="editProductCategory" className="muted form-label">
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
            <div>
              <label htmlFor="editProductStock" className="muted form-label">
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
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn cancel-btn" 
              onClick={() => {
                setShowEditProduct(false)
                setEditingProduct(null)
                setProductForm({
                  title: '',
                  description: '',
                  price: '',
                  category: '',
                  stockCount: ''
                })
              }}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary submit-btn">
              Update Product
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Service Modal */}
      <Modal 
        isOpen={showAddService} 
        onClose={() => setShowAddService(false)}
        title="Add New Service"
        size="xlarge"
      >
        <form onSubmit={handleAddService} className="add-product-form">
          <div>
            <label htmlFor="serviceTitle" className="muted form-label">
              Service Title *
            </label>
            <input
              type="text"
              id="serviceTitle"
              className="input"
              value={serviceForm.title}
              onChange={(e) => setServiceForm({...serviceForm, title: e.target.value})}
              required
            />
          </div>

          <div>
            <label htmlFor="serviceDescription" className="muted form-label">
              Description
            </label>
            <textarea
              id="serviceDescription"
              className="input"
              value={serviceForm.description}
              onChange={(e) => setServiceForm({...serviceForm, description: e.target.value})}
              rows={3}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div className="form-row">
            <div>
              <label htmlFor="servicePrice" className="muted form-label">
                Price *
              </label>
              <input
                type="number"
                id="servicePrice"
                className="input"
                value={serviceForm.price}
                onChange={(e) => setServiceForm({...serviceForm, price: e.target.value})}
                min="0"
                step="0.01"
                required
              />
            </div>
            <div>
              <label htmlFor="serviceDuration" className="muted form-label">
                Duration (minutes)
              </label>
              <input
                type="number"
                id="serviceDuration"
                className="input"
                value={serviceForm.durationMinutes}
                onChange={(e) => setServiceForm({...serviceForm, durationMinutes: e.target.value})}
                min="1"
                placeholder="60"
              />
            </div>
          </div>

          <div>
            <label htmlFor="serviceCategory" className="muted form-label">
              Service Category
            </label>
            <CategorySelector
              value={{
                mainCategory: serviceForm.mainCategory,
                subcategory: serviceForm.subcategory,
                customCategory: serviceForm.customCategory
              }}
              onChange={(categoryData) => {
                setServiceForm({
                  ...serviceForm,
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

          <div>
            <label htmlFor="serviceStatus" className="muted form-label">
              Status
            </label>
            <select
              id="serviceStatus"
              className="input"
              value={serviceForm.status}
              onChange={(e) => setServiceForm({...serviceForm, status: e.target.value})}
            >
              <option value="AVAILABLE">Available</option>
              <option value="NOT_AVAILABLE">Not Available</option>
            </select>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn cancel-btn" 
              onClick={() => setShowAddService(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary submit-btn">
              Add Service
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Service Modal */}
      <Modal 
        isOpen={showEditService} 
        onClose={() => {
          setShowEditService(false)
          setEditingService(null)
          setServiceForm({
            title: '',
            description: '',
            price: '',
            mainCategory: '',
            subcategory: '',
            customCategory: '',
            status: 'AVAILABLE',
            durationMinutes: ''
          })
        }}
        title={`Edit Service - ${editingService?.title || ''}`}
        size="xlarge"
      >
        <form onSubmit={handleUpdateService} className="add-product-form">
          <div>
            <label htmlFor="editServiceTitle" className="muted form-label">
              Service Title *
            </label>
            <input
              type="text"
              id="editServiceTitle"
              className="input"
              value={serviceForm.title}
              onChange={(e) => setServiceForm({...serviceForm, title: e.target.value})}
              required
            />
          </div>

          <div>
            <label htmlFor="editServiceDescription" className="muted form-label">
              Description
            </label>
            <textarea
              id="editServiceDescription"
              className="input"
              value={serviceForm.description}
              onChange={(e) => setServiceForm({...serviceForm, description: e.target.value})}
              rows={3}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div className="form-row">
            <div>
              <label htmlFor="editServicePrice" className="muted form-label">
                Price *
              </label>
              <input
                type="number"
                id="editServicePrice"
                className="input"
                value={serviceForm.price}
                onChange={(e) => setServiceForm({...serviceForm, price: e.target.value})}
                min="0"
                step="0.01"
                required
              />
            </div>
            <div>
              <label htmlFor="editServiceDuration" className="muted form-label">
                Duration (minutes)
              </label>
              <input
                type="number"
                id="editServiceDuration"
                className="input"
                value={serviceForm.durationMinutes}
                onChange={(e) => setServiceForm({...serviceForm, durationMinutes: e.target.value})}
                min="1"
                placeholder="60"
              />
            </div>
          </div>

          <div>
            <label htmlFor="editServiceCategory" className="muted form-label">
              Service Category
            </label>
            <CategorySelector
              value={{
                mainCategory: serviceForm.mainCategory,
                subcategory: serviceForm.subcategory,
                customCategory: serviceForm.customCategory
              }}
              onChange={(categoryData) => {
                setServiceForm({
                  ...serviceForm,
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

          <div>
            <label htmlFor="editServiceStatus" className="muted form-label">
              Status
            </label>
            <select
              id="editServiceStatus"
              className="input"
              value={serviceForm.status}
              onChange={(e) => setServiceForm({...serviceForm, status: e.target.value})}
            >
              <option value="AVAILABLE">Available</option>
              <option value="NOT_AVAILABLE">Not Available</option>
            </select>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn cancel-btn" 
              onClick={() => {
                setShowEditService(false)
                setEditingService(null)
                setServiceForm({
                  title: '',
                  description: '',
                  price: '',
                  mainCategory: '',
                  subcategory: '',
                  customCategory: '',
                  status: 'AVAILABLE',
                  durationMinutes: ''
                })
              }}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary submit-btn">
              Update Service
            </button>
          </div>
        </form>
      </Modal>

      {/* Order Modal (Dedicated component, not using centralized modal) */}
      <OrderModal 
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        title={`Order from ${shop?.name || 'Shop'}`}
        size="large"
      >
        <div className="order-modal">
          {orderError && (
            <div className="om-error-banner" role="alert">
              {orderError}
            </div>
          )}

          <form className="order-form" onSubmit={submitOrder}>
            {/* Customer details on top */}
            <div className="form-row">
              <div className="form-group" style={{ flex: 1 }}>
                <label className="muted form-label" htmlFor="orderEmail">Your Email *</label>
                <input id="orderEmail" type="email" className="input" value={senderEmail} onChange={(e) => setSenderEmail(e.target.value)} required />
              </div>
            </div>
            <div className="form-group">
              <label className="muted form-label" htmlFor="orderMessage">Message (optional)</label>
              <textarea id="orderMessage" className="input" value={orderMessage} onChange={(e) => setOrderMessage(e.target.value)} rows={3} />
            </div>

            {/* Cart items below details */}
            {(!cartItems || cartItems.length === 0) ? (
              <div className="card empty-cart">
                <p>Your cart is empty.</p>
              </div>
            ) : (
              <div className="cart-list" data-tutorial="cart-management">
                {cartItems.map(ci => (
                  <div key={ci.serviceId} className="cart-item">
                    <div className="item-thumb">
                      {resolveCartImage(ci) ? (
                        <img src={resolveCartImage(ci)} alt={ci.name} />
                      ) : (
                        <div className="thumb-placeholder"><Camera size={16} /></div>
                      )}
                    </div>
                    <div className="item-info">
                      <div className="item-name">{ci.name}</div>
                      <div className="item-price muted">₱{Number(ci.unitPrice || 0).toFixed(2)}</div>
                    </div>
                    <div className="qty-stepper" role="group" aria-label={`Quantity for ${ci.name}`}>
                      <button type="button" className="qty-btn minus" onClick={() => decrementQty(ci.serviceId)} aria-label={`Decrease ${ci.name} quantity`}>-</button>
                      <span className="qty-display" aria-live="polite">{ci.quantity || 1}</span>
                      <button type="button" className="qty-btn plus" onClick={() => incrementQty(ci.serviceId)} aria-label={`Increase ${ci.name} quantity`}>+</button>
                    </div>
                    <div className="item-line-total">₱{(Number(ci.unitPrice || 0) * Number(ci.quantity || 0)).toFixed(2)}</div>
                    <div className="item-remove">
                      <button type="button" className="remove-btn" onClick={() => removeFromCart(ci.serviceId)}>
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="order-summary">
              <div className="total-label">Total</div>
              <div className="total-amount">₱{getCartTotal().toFixed(2)}</div>
            </div>

            <div className="order-actions">
              <button type="button" className="om-btn-secondary om-cancel-btn" onClick={() => setShowOrderModal(false)}>Cancel</button>
              <button type="submit" className="om-btn-primary om-submit-btn" disabled={placingOrder || !cartItems || cartItems.length === 0} data-tutorial="place-order-btn">
                {placingOrder ? 'Placing...' : 'Place Order'}
              </button>
            </div>
          </form>
          <p className="order-note muted">
            Note: No stocks are reduced automatically. The shop will contact you via your email to confirm and arrange payment/delivery.
          </p>
        </div>
      </OrderModal>

      {/* Floating Cart Button */}
      <button 
        type="button"
        className="shop-cart-fab"
        onClick={() => setShowOrderModal(true)}
        aria-label="Open cart and place order"
        data-tutorial="floating-cart-btn"
      >
        <ShoppingCart size={20} />
        <span className="shop-cart-fab-label">Cart ({Array.isArray(cartItems) ? cartItems.reduce((sum, ci) => sum + (ci.quantity || 0), 0) : 0})</span>
      </button>

      {/* Floating mini map and minimizer removed */}

      {/* Back to Top Button */}
      {showBackToTop && (
        <button 
          className="back-to-top-btn"
          onClick={scrollToTop}
          title="Back to top"
        >
          ↑
        </button>
      )}

      {/* Order success toast */}
      {orderSuccess && (
        <div className="shop-toast shop-toast-success" role="status" aria-live="polite">
          <span className="shop-toast-icon" aria-hidden="true">✓</span>
          <span className="shop-toast-text">{orderSuccess}</span>
        </div>
      )}

      {/* Centered order placed popup */}
      {orderPlacedPopup && (
        <div className="order-success-overlay" role="status" aria-live="polite" data-tutorial="order-confirmation">
          <div className="order-success-popup">
            <span className="order-success-check" aria-hidden="true">✓</span>
            <span className="order-success-text">Ordered successfully</span>
          </div>
        </div>
      )}

      {/* Review Modal */}
      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        shopId={shop?.id}
        shopName={shop?.name}
        onReviewSubmitted={handleReviewSubmitted}
      />

      {/* Product Details Modal */}
      <ProductDetailsModal
        product={selectedProduct}
        isOpen={showProductDetails}
        onClose={handleCloseProductDetails}
        onAddToCart={handleAddToCart}
        onOrderNow={handleOrderNow}
        isOwner={isOwner}
      />

      </main>
    </>
  )
}


