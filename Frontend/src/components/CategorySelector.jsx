import { useState, useEffect } from 'react'
import { fetchAllCategories, getSubcategoriesForMain } from '../api/categories.js'

const CategorySelector = ({ 
    value, 
    onChange, 
    placeholder = "Select a category",
    showSubcategories = true,
    allowCustom = false,
    className = "",
    required = false 
}) => {
    const [categories, setCategories] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [selectedMainCategory, setSelectedMainCategory] = useState('')
    const [selectedSubcategory, setSelectedSubcategory] = useState('')
    const [customCategory, setCustomCategory] = useState('')
    const [showCustomInput, setShowCustomInput] = useState(false)

    useEffect(() => {
        loadCategories()
    }, [])

    useEffect(() => {
        // Parse current value to set selected categories
        if (value) {
            if (typeof value === 'string') {
                // Handle simple string value (backward compatibility)
                setSelectedMainCategory(value)
                setSelectedSubcategory('')
            } else if (typeof value === 'object') {
                // Handle object value with main and sub categories
                setSelectedMainCategory(value.mainCategory || '')
                setSelectedSubcategory(value.subcategory || '')
                setCustomCategory(value.customCategory || '')
                setShowCustomInput(!!value.customCategory)
            }
        }
    }, [value])

    const loadCategories = async () => {
        try {
            setLoading(true)
            const data = await fetchAllCategories()
            setCategories(data)
        } catch (err) {
            console.error('Failed to load categories:', err)
            setError('Failed to load categories')
        } finally {
            setLoading(false)
        }
    }

    const handleMainCategoryChange = (mainCategory) => {
        setSelectedMainCategory(mainCategory)
        setSelectedSubcategory('')
        setCustomCategory('')
        setShowCustomInput(false)
        
        if (onChange) {
            if (showSubcategories) {
                onChange({ mainCategory, subcategory: '', customCategory: '' })
            } else {
                onChange(mainCategory)
            }
        }
    }

    const handleSubcategoryChange = (subcategory) => {
        setSelectedSubcategory(subcategory)
        setCustomCategory('')
        setShowCustomInput(false)
        
        if (onChange) {
            onChange({ 
                mainCategory: selectedMainCategory, 
                subcategory, 
                customCategory: '' 
            })
        }
    }

    const handleCustomCategoryChange = (customCategory) => {
        setCustomCategory(customCategory)
        
        if (onChange) {
            onChange({ 
                mainCategory: selectedMainCategory, 
                subcategory: selectedSubcategory, 
                customCategory 
            })
        }
    }

    const handleCustomInputToggle = () => {
        setShowCustomInput(!showCustomInput)
        if (!showCustomInput) {
            setSelectedSubcategory('')
            setCustomCategory('')
        }
    }

    const getSubcategories = () => {
        if (!categories || !selectedMainCategory) return []
        return getSubcategoriesForMain(categories, selectedMainCategory)
    }

    if (loading) {
        return (
            <div className={`category-selector loading ${className}`}>
                <div className="loading-spinner">Loading categories...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className={`category-selector error ${className}`}>
                <div className="error-message">{error}</div>
            </div>
        )
    }

    const mainCategories = categories?.categoryTree || []

    return (
        <div className={`category-selector ${className}`}>
            {/* Main Category Selection */}
            <div className="form-group">
                <label className="form-label">
                    Main Category {required && '*'}
                </label>
                <select
                    className="input"
                    value={selectedMainCategory}
                    onChange={(e) => handleMainCategoryChange(e.target.value)}
                    required={required}
                >
                    <option value="">{placeholder}</option>
                    {mainCategories.map((category) => (
                        <option key={category.mainCategory} value={category.mainCategory}>
                            {category.icon} {category.displayName}
                        </option>
                    ))}
                </select>
                {selectedMainCategory && (
                    <small className="help-text">
                        {mainCategories.find(c => c.mainCategory === selectedMainCategory)?.description}
                    </small>
                )}
            </div>

            {/* Subcategory Selection */}
            {showSubcategories && selectedMainCategory && (
                <div className="form-group">
                    <label className="form-label">
                        Subcategory
                    </label>
                    <select
                        className="input"
                        value={selectedSubcategory}
                        onChange={(e) => handleSubcategoryChange(e.target.value)}
                    >
                        <option value="">Select a subcategory (optional)</option>
                        {getSubcategories().map((subcategory) => (
                            <option key={subcategory} value={subcategory}>
                                {subcategory}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Custom Category Input */}
            {allowCustom && selectedMainCategory && (
                <div className="form-group">
                    <div className="custom-category-toggle">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleCustomInputToggle}
                        >
                            {showCustomInput ? 'Hide' : 'Add'} Custom Category
                        </button>
                    </div>
                    
                    {showCustomInput && (
                        <div className="custom-category-input">
                            <label className="form-label">
                                Custom Category Name
                            </label>
                            <input
                                type="text"
                                className="input"
                                value={customCategory}
                                onChange={(e) => handleCustomCategoryChange(e.target.value)}
                                placeholder="Enter custom category name"
                            />
                            <small className="help-text">
                                Add a specific category for your business type
                            </small>
                        </div>
                    )}
                </div>
            )}

            {/* Category Preview */}
            {(selectedMainCategory || selectedSubcategory || customCategory) && (
                <div className="category-preview">
                    <label className="form-label">Selected Category:</label>
                    <div className="selected-category">
                        {selectedMainCategory && (
                            <span className="main-category">
                                {mainCategories.find(c => c.mainCategory === selectedMainCategory)?.icon} 
                                {selectedMainCategory}
                            </span>
                        )}
                        {selectedSubcategory && (
                            <span className="subcategory">
                                → {selectedSubcategory}
                            </span>
                        )}
                        {customCategory && (
                            <span className="custom-category">
                                → {customCategory}
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default CategorySelector
