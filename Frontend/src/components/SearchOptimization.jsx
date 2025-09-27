import { useEffect, useState, useRef, memo, useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchCategories } from '../api/shops.js'
import { fetchProductMainCategories } from '../api/products.js'
import { getServiceCategories } from '../api/services.js'
import { useDebounce } from '../hooks/useDebounce.js'
import categoriesCache from '../utils/categoriesCache.js'
import { Utensils, ShoppingCart, Palette, Wrench, Smartphone, Shirt, Heart, Home } from 'lucide-react'

const SearchOptimization = ({ onClearFilters, onSearchChange, hasPinnedLocation, compactFilter = false, navigateOnSubmit = false }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchSuggestions, setSearchSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [categories, setCategories] = useState([])
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeFilter, setActiveFilter] = useState(null)
  const resultMenuRef = useRef(null)
  const resultMenuWrapperRef = useRef(null)
  const [showResultMenu, setShowResultMenu] = useState(false)
  const [localQuery, setLocalQuery] = useState(searchParams.get('q') || '')
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const raw = localStorage.getItem('recent_searches')
      if (!raw) return []
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed.slice(0, 5) : []
    } catch (_) {
      return []
    }
  })
  const categoriesLoadedRef = useRef(false)

  const query = searchParams.get('q') || ''
  const category = searchParams.get('category') || ''
  const initialType = searchParams.get('type') || 'shops'
  const [resultType, setResultType] = useState(initialType)
  
  // Check if there are any active filters
  const hasActiveFilters = localQuery || category || hasPinnedLocation
  
  // Debounce the local query to prevent immediate updates
  const debouncedQuery = useDebounce(localQuery, 300)

  // Update parent component with debounced search query (client-side only)
  useEffect(() => {
    if (onSearchChange) {
      onSearchChange(debouncedQuery)
    }
  }, [debouncedQuery, onSearchChange])

  // Ensure default type is 'shops' in URL when missing
  useEffect(() => {
    const current = searchParams.get('type')
    if (!current) {
      const params = new URLSearchParams(searchParams)
      params.set('type', 'shops')
      setSearchParams(params, { replace: true })
      setResultType('shops')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Sync local query with URL params only on initial load
  useEffect(() => {
    setLocalQuery(query)
    // keep type in sync if URL changes elsewhere
    const t = searchParams.get('type') || 'shops'
    setResultType(t)
  }, [query])

  // Popular search terms for suggestions
  const popularSearches = [
    'local shops',
    'fresh produce',
    'handmade crafts',
    'local restaurants',
    'artisan goods',
    'organic products',
    'local services',
    'community businesses'
  ]

  // Popular categories for quick selection (memoized)
  const popularCategories = useMemo(() => [
    'Barber',
    'Grocery',
    'Hardware',
    'Restaurants',
    'Thai',
    'Chinese',
    'Drinks',
    'Repair Phone',
    'Motorcycle Service',
    'Crafts',
    'Services',
    'Electronics',
    'Clothing',
    'Health & Beauty',
    'Home & Garden'
  ], [])

  useEffect(() => {
    // Close result type menu on outside click
    const onPointerDown = (e) => {
      if (!showResultMenu) return
      const wrapper = resultMenuWrapperRef.current
      if (wrapper && !wrapper.contains(e.target)) {
        setShowResultMenu(false)
      }
    }
    
    // Add event listener with error handling
    try {
      document.addEventListener('mousedown', onPointerDown)
    } catch (error) {
      console.warn('Failed to add mousedown listener:', error)
    }
    
    return () => {
      try {
        document.removeEventListener('mousedown', onPointerDown)
      } catch (error) {
        console.warn('Failed to remove mousedown listener:', error)
      }
    }
  }, [showResultMenu])

  useEffect(() => {
    // Reset state when type changes
    setCategories([])
    categoriesLoadedRef.current = false

    const loadCategories = async () => {
      try {
        if (resultType === 'shops') {
          // Prefer global cache for shops categories
          const cachedCategories = categoriesCache.get()
          if (cachedCategories && cachedCategories.length > 0) {
            setCategories(cachedCategories)
            categoriesLoadedRef.current = true
            return
          }
          if (categoriesCache.getLoadingState()) {
            categoriesCache.getLoadingPromise()?.then((data) => {
              setCategories(data.categories || [])
              categoriesLoadedRef.current = true
            })
            return
          }
          categoriesCache.setLoading(true)
          const data = await fetchCategories()
          categoriesCache.set(data.categories || [])
          setCategories(data.categories || [])
        } else if (resultType === 'products') {
          const data = await fetchProductMainCategories()
          // API returns an array
          setCategories(Array.isArray(data) ? data : (data?.categories || []))
        } else {
          // services
          const data = await getServiceCategories()
          setCategories(Array.isArray(data) ? data : (data?.categories || []))
        }
        categoriesLoadedRef.current = true
      } catch (error) {
        console.error('Failed to fetch categories:', error)
        setCategories(popularCategories)
        categoriesLoadedRef.current = true
      } finally {
        if (resultType === 'shops') {
          categoriesCache.setLoading(false, null)
        }
      }
    }

    loadCategories()
  }, [resultType])

  const handleSearch = useCallback((searchTerm) => {
    if (searchTerm.trim()) {
      const trimmed = searchTerm.trim()
      setLocalQuery(trimmed)
      setShowSuggestions(false)
      setIsExpanded(false)
      // Save to recent searches (MRU, max 5)
      try {
        setRecentSearches((prev) => {
          const next = [trimmed, ...prev.filter((q) => q.toLowerCase() !== trimmed.toLowerCase())]
          const limited = next.slice(0, 5)
          localStorage.setItem('recent_searches', JSON.stringify(limited))
          return limited
        })
      } catch (_) { /* ignore */ }
      if (navigateOnSubmit) {
        const params = new URLSearchParams()
        params.set('q', trimmed)
        params.set('type', resultType || 'shops')
        // Navigation disabled per new UX preference; preserve URL only
        const url = `${window.location.pathname}?${params.toString()}`
        window.history.replaceState({}, '', url)
      } else {
        // Update URL params without navigation
        const params = new URLSearchParams(searchParams)
        params.set('q', trimmed)
        params.set('type', resultType || 'shops')
        setSearchParams(params, { replace: true })
      }
    }
  }, [navigateOnSubmit, resultType, searchParams, setSearchParams])

  const handleSuggestionClick = useCallback((suggestion) => {
    handleSearch(suggestion)
  }, [handleSearch])

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      handleSearch(e.target.value)
    }
  }, [handleSearch])

  const handleCategoryChange = useCallback((selectedCategory) => {
    const newParams = new URLSearchParams(searchParams)
    if (selectedCategory) {
      newParams.set('category', selectedCategory)
    } else {
      newParams.delete('category')
    }
    setSearchParams(newParams)
    setActiveFilter(null)
  }, [searchParams, setSearchParams])

  const handleQuickCategorySelect = (cat) => {
    handleCategoryChange(cat)
    setIsExpanded(false)
  }

  const clearFilters = () => {
    setLocalQuery('')
    setSearchParams({})
    setActiveFilter(null)
    // Clear pinned location from localStorage
    const oldValue = localStorage.getItem('pinned_location')
    localStorage.removeItem('pinned_location')
    // Trigger a storage event to notify other components
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'pinned_location',
      newValue: null,
      oldValue: oldValue
    }))
    if (onClearFilters) {
      onClearFilters()
    }
  }

  // Function to refresh categories (useful for admin updates)
  const refreshCategories = () => {
    categoriesCache.clear()
    categoriesLoadedRef.current = false
    // This will trigger the useEffect to fetch fresh categories
    setCategories([])
  }

  // Choose icon for any category string
  const getCategoryIcon = (cat) => {
    const c = (cat || '').toLowerCase()
    if (c.includes('grocery') || c.includes('market')) return <ShoppingCart size={20} />
    if (c.includes('restaurant') || c.includes('thai') || c.includes('chinese') || c.includes('food')) return <Utensils size={20} />
    if (c.includes('hardware')) return <Wrench size={20} />
    if (c.includes('repair') || c.includes('service') || c.includes('motorcycle')) return <Wrench size={20} />
    if (c.includes('phone') || c.includes('electronic')) return <Smartphone size={20} />
    if (c.includes('clothing') || c.includes('apparel')) return <Shirt size={20} />
    if (c.includes('craft')) return <Palette size={20} />
    if (c.includes('health') || c.includes('beauty')) return <Heart size={20} />
    if (c.includes('home') || c.includes('garden')) return <Home size={20} />
    if (c.includes('barber') || c.includes('salon')) return <Home size={20} />
    return <Home size={20} />
  }

  // Prefer API categories for the quick grid if available
  const displayedCategories = (categories && categories.length > 0 ? categories : popularCategories).slice(0, 12)

  return (
    <div className="airbnb-search-container">
      {/* Main Search Bar */}
      <div className="airbnb-search-bar">
        <div className="search-input-group">
          {/* Results Filter (inline menu) */}
          <div ref={resultMenuWrapperRef} style={{ position: 'relative', display: 'inline-block' }}>
            <div 
              className={`search-filter ${activeFilter === 'resultType' ? 'active' : ''}`}
              aria-label={`Results: ${resultType}`}
              onClick={(e) => {
                e.stopPropagation()
                // Toggle small inline menu
                setShowResultMenu((v) => !v)
                setActiveFilter('resultType')
              }}
            >
              <div className="filter-value">
                <span className="category-label">
                  {resultType === 'products' ? 'Products' : resultType === 'services' ? 'Services' : 'Stores'}
                </span>
              </div>
              <svg className="filter-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6,9 12,15 18,9"></polyline>
              </svg>
            </div>
            {showResultMenu && (
              <div ref={resultMenuRef} style={{ position: 'absolute', top: '44px', left: 0, zIndex: 1000, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '10px', boxShadow: '0 8px 24px rgba(0,0,0,0.3)', padding: '6px', minWidth: '180px' }} onClick={(e) => e.stopPropagation()}>
                {[
                  { key: 'shops', label: 'Stores' },
                  { key: 'products', label: 'Products' },
                  { key: 'services', label: 'Services' }
                ].map(opt => (
                  <button
                    key={opt.key}
                    onClick={() => {
                      setResultType(opt.key)
                      const params = new URLSearchParams(searchParams)
                      params.set('type', opt.key)
                      params.delete('category')
                      setSearchParams(params, { replace: true })
                      setShowResultMenu(false)
                      setActiveFilter(null)
                    }}
                    className={`btn ${resultType === opt.key ? '' : 'outline'}`}
                    style={{ width: '100%', textAlign: 'left', margin: '2px 0' }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Type Filter (contextual to selected result type) */}
          <div 
            className={`search-filter ${activeFilter === 'category' ? 'active' : ''}`}
            aria-label={`${resultType === 'products' ? 'Type' : (resultType === 'services' ? 'Type' : 'Type')}${category ? ': ' + category : ''}`}
            onClick={() => {
              setActiveFilter(activeFilter === 'category' ? null : 'category')
              setIsExpanded(true)
            }}
          >
            <div className="filter-value">
              {category ? (
                <span className="category-selected">{category}</span>
              ) : (
                <span className="category-label">Type</span>
              )}
            </div>
            <svg className="filter-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6,9 12,15 18,9"></polyline>
            </svg>
          </div>

          {/* Search Input */}
          <div className={`search-input-wrapper ${activeFilter === 'search' ? 'active' : ''}`}>
            <input
              type="text"
              placeholder={
                resultType === 'products'
                  ? 'Search products...'
                  : resultType === 'services'
                    ? 'Search services...'
                    : 'Search stores...'
              }
              value={localQuery}
              onChange={(e) => {
                const newQuery = e.target.value
                setLocalQuery(newQuery)
                setShowSuggestions(true)
                setActiveFilter('search')
              }}
              onFocus={() => {
                setShowSuggestions(true)
                setActiveFilter('search')
                setIsExpanded(true)
              }}
              onKeyPress={handleKeyPress}
              className="search-input"
            />
            {localQuery && (
              <button 
                className="clear-search"
                onClick={() => {
                  setLocalQuery('')
                  setShowSuggestions(false)
                  if (onClearFilters) {
                    onClearFilters()
                  }
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
          </div>

          {/* Filter Button - Only show when there are active filters */}
          {hasActiveFilters && (
            <button
              className={`filter-clear-button ${compactFilter ? 'compact' : ''}`}
              onClick={clearFilters}
              title="Clear all filters"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
              {!compactFilter && <span>Filter</span>}
            </button>
          )}

          {/* Search Button */}
          <button
            onClick={() => handleSearch(localQuery)}
            className="search-button"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </button>
        </div>

        {/* Removed active filters pill display per request */}
      </div>

      {/* Expanded Search Panel (excludes Results type; handled inline now) */}
      {isExpanded && activeFilter !== 'resultType' && (
        <div className="search-panel">
          {/* Category Selection - options depend on selected result type */}
          {activeFilter === 'category' && (
            <div className="panel-section">
              <h3>Select a {resultType === 'products' ? 'product' : resultType === 'services' ? 'service' : 'store'} type</h3>
              <div className="category-grid">
                {displayedCategories.map((cat) => (
                  <button
                    key={cat}
                    className={`category-option ${category === cat ? 'selected' : ''}`}
                    onClick={() => handleQuickCategorySelect(cat)}
                  >
                    <div className="category-icon">
                      {getCategoryIcon(cat)}
                    </div>
                    <span>{cat}</span>
                  </button>
                ))}
              </div>
              <div className="all-categories">
                <h4>All {resultType === 'products' ? 'product' : resultType === 'services' ? 'service' : 'store'} types</h4>
                <select
                  value={category}
                  onChange={(e) => handleQuickCategorySelect(e.target.value)}
                  className="category-select"
                >
                  <option value="">Any {resultType === 'products' ? 'product' : resultType === 'services' ? 'service' : 'store'} type</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Search Suggestions */}
          {activeFilter === 'search' && showSuggestions && (
            <div className="panel-section">
              <h3>Search suggestions</h3>
              
              {/* Popular Searches */}
              <div className="suggestions-section">
                <h4>Popular searches</h4>
                <div className="suggestion-tags">
                  {popularSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(search)}
                      className="suggestion-tag"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="suggestions-section">
                  <h4>Recent</h4>
                  <div className="suggestion-tags">
                    {recentSearches.map((search, index) => (
                      <button
                        key={`recent-${index}`}
                        onClick={() => handleSuggestionClick(search)}
                        className="suggestion-tag"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Search Tips */}
              <div className="suggestions-section">
                <h4>Search tips</h4>
                <ul className="search-tips">
                  <li>Try searching by product type (e.g., "fresh bread")</li>
                  <li>Search by location (e.g., "downtown shops")</li>
                  <li>Use category names (e.g., "restaurants", "crafts")</li>
                  <li>Search for specific services (e.g., "delivery", "pickup")</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Overlay to close panel */}
      {isExpanded && (
        <div 
          className="search-overlay"
          onClick={() => {
            setIsExpanded(false)
            setActiveFilter(null)
            setShowSuggestions(false)
          }}
        />
      )}
    </div>
  )
}

// Memoized component to prevent unnecessary re-renders
const MemoizedSearchOptimization = memo(SearchOptimization, (prevProps, nextProps) => {
  // Custom comparison function for props
  return (
    prevProps.onClearFilters === nextProps.onClearFilters &&
    prevProps.onSearchChange === nextProps.onSearchChange &&
    prevProps.hasPinnedLocation === nextProps.hasPinnedLocation &&
    prevProps.compactFilter === nextProps.compactFilter &&
    prevProps.navigateOnSubmit === nextProps.navigateOnSubmit
  )
})

export default MemoizedSearchOptimization
