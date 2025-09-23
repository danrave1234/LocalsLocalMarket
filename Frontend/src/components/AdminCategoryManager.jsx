import { useState, useEffect } from 'react'
import { useAuth } from '../auth/AuthContext.jsx'
import { 
    fetchAllCategories, 
    createCategory, 
    updateCategory, 
    deleteCategory, 
    initializeCategories 
} from '../api/categories.js'
import './AdminCategoryManager.css'
import * as LucideIcons from 'lucide-react'

const AdminCategoryManager = () => {
    const { user, token } = useAuth()
    const [categories, setCategories] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [editingCategory, setEditingCategory] = useState(null)
    const [formData, setFormData] = useState({
        name: '',
        displayName: '',
        description: '',
        icon: '',
        type: 'MAIN',
        parentCategory: '',
        subcategoriesJson: '',
        sortOrder: 0
    })
    const getLucideIcon = (iconName) => {
        if (!iconName) return null
        const name = String(iconName).trim()
        const direct = LucideIcons[name]
        if (direct) return direct
        // Try a couple of normalizations
        const pascal = name
            .toLowerCase()
            .split(/[^a-z0-9]+/)
            .filter(Boolean)
            .map(s => s.charAt(0).toUpperCase() + s.slice(1))
            .join('')
        return LucideIcons[pascal] || null
    }

    // Curated lucide icon choices grouped by likely category
    const ICON_CHOICES = [
        { group: 'Food & Beverages', options: [
            { label: 'Utensils', value: 'Utensils' },
            { label: 'Coffee', value: 'Coffee' },
            { label: 'Beer', value: 'Beer' },
            { label: 'Wine', value: 'Wine' },
            { label: 'IceCream', value: 'IceCream' },
            { label: 'Cookie', value: 'Cookie' },
            { label: 'Fish', value: 'Fish' },
            { label: 'Leaf', value: 'Leaf' }
        ]},
        { group: 'Automotive & Transportation', options: [
            { label: 'Car', value: 'Car' },
            { label: 'Truck', value: 'Truck' },
            { label: 'Wrench', value: 'Wrench' },
            { label: 'Fuel', value: 'Fuel' },
            { label: 'Bolt', value: 'Bolt' },
            { label: 'Wheelchair', value: 'Wheelchair' }
        ]},
        { group: 'Electronics & Technology', options: [
            { label: 'Smartphone', value: 'Smartphone' },
            { label: 'Monitor', value: 'Monitor' },
            { label: 'Laptop', value: 'Laptop' },
            { label: 'Headphones', value: 'Headphones' },
            { label: 'Gamepad', value: 'Gamepad' },
            { label: 'Camera', value: 'Camera' },
            { label: 'Cpu', value: 'Cpu' },
            { label: 'Database', value: 'Database' },
            { label: 'Printer', value: 'Printer' }
        ]},
        { group: 'Fashion & Beauty', options: [
            { label: 'ShoppingBag', value: 'ShoppingBag' },
            { label: 'Scissors', value: 'Scissors' },
            { label: 'Brush', value: 'Brush' },
            { label: 'Paintbrush', value: 'Paintbrush' },
            { label: 'Sparkles', value: 'Sparkles' }
        ]},
        { group: 'Home & Garden', options: [
            { label: 'Home', value: 'Home' },
            { label: 'Bed', value: 'Bed' },
            { label: 'Lamp', value: 'Lamp' },
            { label: 'Hammer', value: 'Hammer' },
            { label: 'Plug', value: 'Plug' },
            { label: 'Lightbulb', value: 'Lightbulb' },
            { label: 'Sprout', value: 'Sprout' }
        ]},
        { group: 'Health & Wellness', options: [
            { label: 'Stethoscope', value: 'Stethoscope' },
            { label: 'Pill', value: 'Pill' },
            { label: 'HeartPulse', value: 'HeartPulse' },
            { label: 'Dumbbell', value: 'Dumbbell' }
        ]},
        { group: 'Services', options: [
            { label: 'Briefcase', value: 'Briefcase' },
            { label: 'Wrench', value: 'Wrench' },
            { label: 'Clipboard', value: 'Clipboard' },
            { label: 'ShieldCheck', value: 'ShieldCheck' },
            { label: 'CalendarCheck2', value: 'CalendarCheck2' }
        ]},
        { group: 'Entertainment & Recreation', options: [
            { label: 'Ticket', value: 'Ticket' },
            { label: 'Music', value: 'Music' },
            { label: 'Clapperboard', value: 'Clapperboard' },
            { label: 'Gamepad', value: 'Gamepad' },
            { label: 'Bicycle', value: 'Bicycle' },
            { label: 'MountainSnow', value: 'MountainSnow' }
        ]},
        { group: 'Business & Professional', options: [
            { label: 'Building2', value: 'Building2' },
            { label: 'Calculator', value: 'Calculator' },
            { label: 'CreditCard', value: 'CreditCard' },
            { label: 'FileBarChart2', value: 'FileBarChart2' },
            { label: 'ChartBar', value: 'ChartBar' }
        ]},
        { group: 'Specialty & Niche', options: [
            { label: 'Palette', value: 'Palette' },
            { label: 'Gem', value: 'Gem' },
            { label: 'ScrollText', value: 'ScrollText' },
            { label: 'Globe', value: 'Globe' },
            { label: 'Wand2', value: 'Wand2' }
        ]}
    ]

    useEffect(() => {
        if (user?.role === 'ADMIN') {
            loadCategories()
        }
    }, [user])

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

    const handleInitializeCategories = async () => {
        try {
            setLoading(true)
            await initializeCategories(token)
            await loadCategories()
            setError('')
        } catch (err) {
            console.error('Failed to initialize categories:', err)
            setError('Failed to initialize categories')
        } finally {
            setLoading(false)
        }
    }

    const handleCreateCategory = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            // Validate lucide icon name if provided
            if (formData.icon && !getLucideIcon(formData.icon)) {
                setError('Icon must be a valid Lucide icon name (e.g., Utensils, Tag, Wrench).')
                setLoading(false)
                return
            }
            // Validate subcategories JSON when creating MAIN category
            if (formData.type === 'MAIN' && formData.subcategoriesJson) {
                try {
                    const parsed = JSON.parse(formData.subcategoriesJson)
                    if (!Array.isArray(parsed)) {
                        throw new Error('Subcategories must be a JSON array')
                    }
                } catch (jsonErr) {
                    setError('Subcategories must be a valid JSON array, e.g. ["Foo", "Bar"]')
                    setLoading(false)
                    return
                }
            }
            await createCategory(formData, token)
            await loadCategories()
            setShowCreateForm(false)
            resetForm()
            setError('')
        } catch (err) {
            console.error('Failed to create category:', err)
            setError('Failed to create category')
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateCategory = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            // Validate lucide icon name if provided
            if (formData.icon && !getLucideIcon(formData.icon)) {
                setError('Icon must be a valid Lucide icon name (e.g., Utensils, Tag, Wrench).')
                setLoading(false)
                return
            }
            // Validate subcategories JSON when updating MAIN category
            if (formData.type === 'MAIN' && formData.subcategoriesJson) {
                try {
                    const parsed = JSON.parse(formData.subcategoriesJson)
                    if (!Array.isArray(parsed)) {
                        throw new Error('Subcategories must be a JSON array')
                    }
                } catch (jsonErr) {
                    setError('Subcategories must be a valid JSON array, e.g. ["Foo", "Bar"]')
                    setLoading(false)
                    return
                }
            }
            await updateCategory(editingCategory.id, formData, token)
            await loadCategories()
            setEditingCategory(null)
            resetForm()
            setError('')
        } catch (err) {
            console.error('Failed to update category:', err)
            setError('Failed to update category')
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteCategory = async (categoryId) => {
        if (!confirm('Are you sure you want to delete this category?')) {
            return
        }
        
        try {
            setLoading(true)
            await deleteCategory(categoryId, token)
            await loadCategories()
            setError('')
        } catch (err) {
            console.error('Failed to delete category:', err)
            setError('Failed to delete category')
        } finally {
            setLoading(false)
        }
    }

    const resetForm = () => {
        setFormData({
            name: '',
            displayName: '',
            description: '',
            icon: '',
            type: 'MAIN',
            parentCategory: '',
            subcategoriesJson: '',
            sortOrder: 0
        })
    }

    const handleEditCategory = (category) => {
        setEditingCategory(category)
        setFormData({
            name: category.name,
            displayName: category.displayName,
            description: category.description || '',
            icon: category.icon || '',
            type: category.type,
            parentCategory: category.parentCategory || '',
            subcategoriesJson: category.subcategoriesJson || '',
            sortOrder: category.sortOrder
        })
        setShowCreateForm(true)
    }

    const handleCancelEdit = () => {
        setEditingCategory(null)
        resetForm()
    }

    if (user?.role !== 'ADMIN') {
        return (
            <div className="admin-access-denied">
                <h3>Access Denied</h3>
                <p>You need admin privileges to access this page.</p>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="admin-category-manager loading">
                <div className="loading-spinner">Loading...</div>
            </div>
        )
    }

    return (
        <div className="admin-category-manager">
            <div className="admin-header">
                <h2>Category Management</h2>
                <div className="admin-actions">
                    <button 
                        className="btn btn-secondary"
                        onClick={handleInitializeCategories}
                        disabled={loading}
                    >
                        Initialize Categories
                    </button>
                    <button 
                        className="btn btn-primary"
                        onClick={() => setShowCreateForm(true)}
                        disabled={loading}
                    >
                        Add New Category
                    </button>
                </div>
            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {/* Create/Edit Form */}
            {(showCreateForm || editingCategory) && (
                <div className="category-form-modal">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>{editingCategory ? 'Edit Category' : 'Create New Category'}</h3>
                            <button 
                                className="close-btn"
                                onClick={editingCategory ? handleCancelEdit : () => setShowCreateForm(false)}
                            >
                                ×
                            </button>
                        </div>
                        
                        <form onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Name *</label>
                                    <input
                                        type="text"
                                        className="input"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        placeholder="e.g., food-beverages"
                                        required
                                        disabled={editingCategory}
                                    />
                                    <small className="help-text">Unique identifier (no spaces, lowercase)</small>
                                </div>
                                
                                <div className="form-group">
                                    <label className="form-label">Display Name *</label>
                                    <input
                                        type="text"
                                        className="input"
                                        value={formData.displayName}
                                        onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                                        placeholder="e.g., Food & Beverages"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea
                                    className="input"
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    placeholder="Describe what this category includes..."
                                    rows={3}
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Icon</label>
                                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                                        <select
                                            className="input"
                                        value={formData.icon}
                                        onChange={(e) => setFormData({ ...formData, icon: e.target.value.trim() })}
                                            style={{ minWidth: 240 }}
                                        >
                                            <option value="">Select an icon</option>
                                            {ICON_CHOICES.map(group => (
                                                <optgroup key={group.group} label={group.group}>
                                                    {group.options.map(opt => (
                                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                    ))}
                                                </optgroup>
                                            ))}
                                        </select>
                                        <div style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text)' }}>
                                            {(() => {
                                                const IconCmp = getLucideIcon(formData.icon)
                                                return IconCmp ? <IconCmp size={20} /> : <span style={{ fontSize: 12, color: 'var(--muted)' }}>No icon</span>
                                            })()}
                                        </div>
                                    </div>
                                    <small className="help-text">Choose a Lucide icon that best represents the category.</small>
                                </div>
                                
                                <div className="form-group">
                                    <label className="form-label">Type</label>
                                    <select
                                        className="input"
                                        value={formData.type}
                                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                                    >
                                        <option value="MAIN">Main Category</option>
                                        <option value="SUB">Subcategory</option>
                                    </select>
                                    <small className="help-text">MAIN: top-level category. SUB: must select a parent.</small>
                                </div>
                                
                                <div className="form-group">
                                    <label className="form-label">Sort Order</label>
                                    <input
                                        type="number"
                                        className="input"
                                        value={formData.sortOrder}
                                        onChange={(e) => setFormData({...formData, sortOrder: parseInt(e.target.value) || 0})}
                                        min="0"
                                    />
                                </div>
                            </div>

                            {formData.type === 'SUB' && (
                                <div className="form-group">
                                    <label className="form-label">Parent Category</label>
                                    <select
                                        className="input"
                                        value={formData.parentCategory}
                                        onChange={(e) => setFormData({...formData, parentCategory: e.target.value})}
                                        required
                                    >
                                        <option value="">Select parent category</option>
                                        {categories?.categoryTree?.map(cat => (
                                            <option key={cat.mainCategory} value={cat.mainCategory}>
                                                {cat.displayName}
                                            </option>
                                        ))}
                                    </select>
                                    <small className="help-text">Choose which MAIN category this subcategory belongs to.</small>
                                </div>
                            )}

                            {formData.type === 'MAIN' && (
                                <div className="form-group">
                                    <label className="form-label">Subcategories (JSON)</label>
                                    <textarea
                                        className="input"
                                        value={formData.subcategoriesJson}
                                        onChange={(e) => setFormData({...formData, subcategoriesJson: e.target.value})}
                                        placeholder='["Subcategory 1", "Subcategory 2", "Subcategory 3"]'
                                        rows={3}
                                    />
                                    <small className="help-text">Paste a JSON array of names (e.g., ["Burgers", "Pasta"]).</small>
                                </div>
                            )}

                            <div className="form-actions">
                                <button 
                                    type="button" 
                                    className="btn btn-secondary"
                                    onClick={editingCategory ? handleCancelEdit : () => setShowCreateForm(false)}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="btn btn-primary"
                                    disabled={loading}
                                >
                                    {editingCategory ? 'Update Category' : 'Create Category'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Categories List */}
            <div className="categories-list">
                <h3>Current Categories</h3>
                {categories?.categories?.length === 0 ? (
                    <div className="no-categories">
                        <p>No categories found. Click "Initialize Categories" to create the default categories.</p>
                    </div>
                ) : (
                    <div className="categories-grid">
                        {categories?.categories?.map(category => (
                            <div key={category.id} className="category-card">
                                <div className="category-header">
                                    <div className="category-icon">
                                        {(() => { const I = getLucideIcon(category.icon); return I ? <I size={18} /> : null })()}
                                    </div>
                                    <div className="category-info">
                                        <h4>{category.displayName}</h4>
                                        <p className="category-name">{category.name}</p>
                                        {category.description && (
                                            <p className="category-description">{category.description}</p>
                                        )}
                                    </div>
                                    <div className="category-badge">
                                        {category.isSystem ? 'System' : 'Custom'}
                                    </div>
                                </div>
                                
                                <div className="category-details">
                                    <div className="detail-item">
                                        <span className="label">Type:</span>
                                        <span className="value">{category.type}</span>
                                    </div>
                                    {category.parentCategory && (
                                        <div className="detail-item">
                                            <span className="label">Parent:</span>
                                            <span className="value">{category.parentCategory}</span>
                                        </div>
                                    )}
                                    <div className="detail-item">
                                        <span className="label">Sort Order:</span>
                                        <span className="value">{category.sortOrder}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="label">Status:</span>
                                        <span className={`value status-${category.isActive ? 'active' : 'inactive'}`}>
                                            {category.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </div>

                                <div className="category-actions">
                                    <button 
                                        className="btn btn-secondary"
                                        onClick={() => handleEditCategory(category)}
                                        disabled={category.isSystem}
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        className="btn btn-danger"
                                        onClick={() => handleDeleteCategory(category.id)}
                                        disabled={category.isSystem}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminCategoryManager
