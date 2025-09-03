import { useState, useCallback, useEffect } from 'react'
import { useDebounce } from '../hooks/useDebounce.js'
import './OptimizedSearch.css'

/**
 * Optimized search component with debouncing and loading states
 */
const OptimizedSearch = ({ 
  onSearch, 
  placeholder = "Search...", 
  debounceDelay = 300,
  minLength = 2,
  className = "",
  disabled = false 
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const debouncedSearchTerm = useDebounce(searchTerm, debounceDelay)

  // Handle search when debounced term changes
  const handleSearch = useCallback(async (term) => {
    if (!term || term.length < minLength) {
      onSearch('')
      return
    }

    setIsSearching(true)
    try {
      await onSearch(term)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsSearching(false)
    }
  }, [onSearch, minLength])

  // Effect to trigger search when debounced term changes
  useEffect(() => {
    handleSearch(debouncedSearchTerm)
  }, [debouncedSearchTerm, handleSearch])

  const handleInputChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)
  }

  const handleClear = () => {
    setSearchTerm('')
    onSearch('')
  }

  return (
    <div className={`optimized-search ${className}`}>
      <div className="search-input-wrapper">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder={placeholder}
          disabled={disabled}
          className="search-input"
        />
        {isSearching && (
          <div className="search-spinner">
            <div className="spinner"></div>
          </div>
        )}
        {searchTerm && !isSearching && (
          <button 
            type="button" 
            onClick={handleClear}
            className="clear-button"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>
      {searchTerm && searchTerm.length < minLength && (
        <div className="search-hint">
          Type at least {minLength} characters to search
        </div>
      )}
    </div>
  )
}

export default OptimizedSearch
