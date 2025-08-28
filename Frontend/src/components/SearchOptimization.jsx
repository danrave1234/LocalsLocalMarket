import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

const SearchOptimization = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchSuggestions, setSearchSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  const query = searchParams.get('q') || ''

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

  useEffect(() => {
    // Update URL for better SEO when search changes
    if (query) {
      const url = new URL(window.location)
      url.searchParams.set('q', query)
      window.history.replaceState({}, '', url.toString())
    }
  }, [query])

  const handleSearch = (searchTerm) => {
    if (searchTerm.trim()) {
      setSearchParams({ q: searchTerm.trim() })
      setShowSuggestions(false)
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

  return (
    <div style={{ position: 'relative', maxWidth: '500px' }}>
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          placeholder="Search local shops, products, or services..."
          value={query}
          onChange={(e) => {
            const newQuery = e.target.value
            if (newQuery) {
              setSearchParams({ q: newQuery })
            } else {
              setSearchParams({})
            }
            setShowSuggestions(true)
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyPress={handleKeyPress}
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            backgroundColor: 'var(--surface)',
            color: 'var(--text)',
            fontSize: '1rem',
            outline: 'none',
            transition: 'border-color 0.2s'
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
        />
        
        <button
          onClick={() => handleSearch(query)}
          style={{
            position: 'absolute',
            right: '8px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'var(--primary)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            fontSize: '0.875rem'
          }}
        >
          Search
        </button>
      </div>

      {/* Search Suggestions */}
      {showSuggestions && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          marginTop: '4px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          zIndex: 1000,
          maxHeight: '300px',
          overflowY: 'auto'
        }}>
          {/* Popular Searches */}
          <div style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>
              Popular Searches
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {popularSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(search)}
                  style={{
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '16px',
                    padding: '0.25rem 0.75rem',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    color: 'var(--text)',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--primary)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--card)'}
                >
                  {search}
                </button>
              ))}
            </div>
          </div>

          {/* Recent Searches (if implemented) */}
          <div style={{ padding: '0.75rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>
              Search Tips
            </div>
            <ul style={{ 
              margin: 0, 
              padding: 0, 
              listStyle: 'none',
              fontSize: '0.875rem',
              color: 'var(--text)'
            }}>
              <li style={{ marginBottom: '0.25rem' }}>• Try searching by product type (e.g., "fresh bread")</li>
              <li style={{ marginBottom: '0.25rem' }}>• Search by location (e.g., "downtown shops")</li>
              <li style={{ marginBottom: '0.25rem' }}>• Use category names (e.g., "restaurants", "crafts")</li>
              <li>• Search for specific services (e.g., "delivery", "pickup")</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchOptimization
