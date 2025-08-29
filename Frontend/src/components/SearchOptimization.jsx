import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchCategories } from '../api/shops.js'

const SearchOptimization = ({ onClearFilters }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchSuggestions, setSearchSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [categories, setCategories] = useState([])
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeFilter, setActiveFilter] = useState(null)

  const query = searchParams.get('q') || ''
  const category = searchParams.get('category') || ''

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
    // Update URL for better SEO when search changes
    if (query) {
      const url = new URL(window.location)
      url.searchParams.set('q', query)
      window.history.replaceState({}, '', url.toString())
    }
  }, [query])

  useEffect(() => {
    // Fetch categories
    const loadCategories = async () => {
      try {
        const data = await fetchCategories()
        setCategories(data.categories || [])
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      }
    }
    loadCategories()
  }, [])

  const handleSearch = (searchTerm) => {
    if (searchTerm.trim()) {
      setSearchParams({ q: searchTerm.trim() })
      setShowSuggestions(false)
      setIsExpanded(false)
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
    setSearchParams({})
    setActiveFilter(null)
    if (onClearFilters) {
      onClearFilters()
    }
  }

  return (
    <div className="airbnb-search-container">
      {/* Main Search Bar */}
      <div className="airbnb-search-bar">
        <div className="search-input-group">
          {/* Category Filter */}
          <div 
            className={`search-filter ${activeFilter === 'category' ? 'active' : ''}`}
            onClick={() => {
              setActiveFilter(activeFilter === 'category' ? null : 'category')
              setIsExpanded(true)
            }}
          >
            <div className="filter-value">
              {category || 'Any category'}
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
              value={query}
              onChange={(e) => {
                const newQuery = e.target.value
                if (newQuery) {
                  setSearchParams({ q: newQuery })
                } else {
                  setSearchParams({})
                }
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
            {query && (
              <button 
                className="clear-search"
                onClick={() => {
                  setSearchParams({})
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

          {/* Search Button */}
          <button
            onClick={() => handleSearch(query)}
            className="search-button"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </button>
        </div>

        {/* Active Filters Display - Only show search query, not category */}
        {query && (
          <div className="active-filters">
            <div className="filter-tag">
              <span>"{query}"</span>
              <button onClick={() => setSearchParams({ category })}>×</button>
            </div>
            <button onClick={clearFilters} className="clear-all">
              Clear all
            </button>
          </div>
        )}
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
                      {cat === 'Restaurants' && '🍽️'}
                      {cat === 'Grocery' && '🛒'}
                      {cat === 'Crafts' && '🎨'}
                      {cat === 'Services' && '🔧'}
                      {cat === 'Electronics' && '📱'}
                      {cat === 'Clothing' && '👕'}
                      {cat === 'Health & Beauty' && '💄'}
                      {cat === 'Home & Garden' && '🏡'}
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
