import { useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchCategories } from '../api/shops.js'
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
  const [localQuery, setLocalQuery] = useState(searchParams.get('q') || '')
  const categoriesLoadedRef = useRef(false)

  const query = searchParams.get('q') || ''
  const category = searchParams.get('category') || ''
  
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

  // Sync local query with URL params only on initial load
  useEffect(() => {
    setLocalQuery(query)
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

  // Popular categories for quick selection
  const popularCategories = [
    'Restaurants',
    'Grocery',
    'Crafts',
    'Services',
    'Electronics',
    'Clothing',
    'Health & Beauty',
    'Home & Garden'
  ]

  useEffect(() => {
    // Check global cache first (now includes localStorage persistence)
    const cachedCategories = categoriesCache.get()
    if (cachedCategories && cachedCategories.length > 0) {
      // Using cached categories from localStorage/memory
      setCategories(cachedCategories)
      categoriesLoadedRef.current = true
      return
    }
    
    // Check if already loading to prevent duplicate fetches
    if (categoriesCache.getLoadingState()) {
      // Categories already loading, waiting...
      // Wait for the existing promise
      categoriesCache.getLoadingPromise()?.then((data) => {
        setCategories(data.categories || [])
        categoriesLoadedRef.current = true
      })
      return
    }
    
    // Fetch categories if not in cache and not loading
    if (categoriesLoadedRef.current) return
    
    const loadCategories = async () => {
      try {
        // Loading categories from API...
        categoriesCache.setLoading(true)
        
        const data = await fetchCategories()
        // Categories loaded from API
        
        // Cache the categories globally (now persists to localStorage)
        categoriesCache.set(data.categories || [])
        
        setCategories(data.categories || [])
        categoriesLoadedRef.current = true
      } catch (error) {
        console.error('Failed to fetch categories:', error)
        // Fallback to popular categories if API fails
        setCategories(popularCategories)
        categoriesLoadedRef.current = true
      } finally {
        categoriesCache.setLoading(false, null)
      }
    }
    
    loadCategories()
  }, [])

  const handleSearch = (searchTerm) => {
    if (searchTerm.trim()) {
      const trimmed = searchTerm.trim()
      setLocalQuery(trimmed)
      setShowSuggestions(false)
      setIsExpanded(false)
      if (navigateOnSubmit) {
        const params = new URLSearchParams()
        params.set('q', trimmed)
        params.set('type', 'shops')
        window.location.href = `/search?${params.toString()}`
        return
      }
    }
  }

  const handleSuggestionClick = (suggestion) => {
    handleSearch(suggestion)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e.target.value)
    }
  }

  const handleCategoryChange = (selectedCategory) => {
    const newParams = new URLSearchParams(searchParams)
    if (selectedCategory) {
      newParams.set('category', selectedCategory)
    } else {
      newParams.delete('category')
    }
    setSearchParams(newParams)
    setActiveFilter(null)
  }

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

  return (
    <div className="airbnb-search-container">
      {/* Main Search Bar */}
      <div className="airbnb-search-bar">
        <div className="search-input-group">
          {/* Category Filter */}
          <div 
            className={`search-filter ${activeFilter === 'category' ? 'active' : ''}`}
            aria-label={`Category${category ? ': ' + category : ''}`}
            onClick={() => {
              setActiveFilter(activeFilter === 'category' ? null : 'category')
              setIsExpanded(true)
            }}
          >
            <div className="filter-value">
              <span className="category-label desktop-only">Category</span>
              {category && category}
            </div>
            <svg className="filter-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6,9 12,15 18,9"></polyline>
            </svg>
          </div>

          {/* Search Input */}
          <div className={`search-input-wrapper ${activeFilter === 'search' ? 'active' : ''}`}>
            <input
              type="text"
              placeholder="Search shops, products, or services..."
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

      {/* Expanded Search Panel */}
      {isExpanded && (
        <div className="search-panel">
          {/* Category Selection */}
          {activeFilter === 'category' && (
            <div className="panel-section">
              <h3>Select a category</h3>
              <div className="category-grid">
                {popularCategories.map((cat) => (
                  <button
                    key={cat}
                    className={`category-option ${category === cat ? 'selected' : ''}`}
                    onClick={() => handleQuickCategorySelect(cat)}
                  >
                    <div className="category-icon">
                      {cat === 'Restaurants' && <Utensils size={20} />}
                      {cat === 'Grocery' && <ShoppingCart size={20} />}
                      {cat === 'Crafts' && <Palette size={20} />}
                      {cat === 'Services' && <Wrench size={20} />}
                      {cat === 'Electronics' && <Smartphone size={20} />}
                      {cat === 'Clothing' && <Shirt size={20} />}
                      {cat === 'Health & Beauty' && <Heart size={20} />}
                      {cat === 'Home & Garden' && <Home size={20} />}
                    </div>
                    <span>{cat}</span>
                  </button>
                ))}
              </div>
              <div className="all-categories">
                <h4>All categories</h4>
                <select
                  value={category}
                  onChange={(e) => handleQuickCategorySelect(e.target.value)}
                  className="category-select"
                >
                  <option value="">Any category</option>
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

export default SearchOptimization
