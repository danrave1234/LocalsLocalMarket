import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Modal from '../components/Modal.jsx'
import CategorySelector from '../components/CategorySelector.jsx'
import { 
    fetchProductsByShopId, 
    createProduct, 
    updateProduct, 
    deleteProduct,
    updateProductStock,
    decrementProductStock
} from '../api/products.js'
import { uploadImage } from '../api/products.js'
import { getImageUrl } from '../utils/imageUtils.js'
import { extractShopIdFromSlug } from '../utils/slugUtils.js'
import { useAuth } from '../auth/AuthContext.jsx'
import { Search, ChevronLeft, ChevronRight, Filter } from 'lucide-react'
import './ProductManagementPage.css'

export default function ProductManagementPage() {
    const { shopId: shopSlug } = useParams()
    const navigate = useNavigate()
    const { token } = useAuth()
    
    // Extract shop ID from slug
    const shopId = extractShopIdFromSlug(shopSlug)
    
    const [products, setProducts] = useState([])
    const [filteredProducts, setFilteredProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [showAddProduct, setShowAddProduct] = useState(false)
    const [showEditProduct, setShowEditProduct] = useState(false)
    const [editingProduct, setEditingProduct] = useState(null)
    const [productForm, setProductForm] = useState({
        title: '', description: '', price: '', stockCount: '',
        mainCategory: '', subcategory: '', customCategory: ''
    })
    const [productImages, setProductImages] = useState([])
    const [uploadingImages, setUploadingImages] = useState(false)
    const [savingStock, setSavingStock] = useState({})
    
    // Search and pagination state
    const [searchQuery, setSearchQuery] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [productsPerPage, setProductsPerPage] = useState(12)
    const [sortBy, setSortBy] = useState('newest')
    const [categoryFilter, setCategoryFilter] = useState('all')

    useEffect(() => {
        if (shopId && token) {
            loadProducts()
        } else if (!shopId) {
            setError('Invalid shop URL')
            setLoading(false)
        } else if (!token) {
            setError('Authentication required')
            setLoading(false)
        }
    }, [shopId, token, shopSlug])

    // Set products per page based on screen size
    useEffect(() => {
        const updateProductsPerPage = () => {
            const width = window.innerWidth
            if (width < 640) { // Mobile
                setProductsPerPage(8)
            } else if (width < 1024) { // Tablet
                setProductsPerPage(12)
            } else if (width < 1440) { // Laptop
                setProductsPerPage(16)
            } else { // Big monitor
                setProductsPerPage(20)
            }
        }

        updateProductsPerPage()
        window.addEventListener('resize', updateProductsPerPage)
        return () => window.removeEventListener('resize', updateProductsPerPage)
    }, [])

    // Filter and sort products
    useEffect(() => {
        let filtered = [...products]
        
        // Apply search filter
        if (searchQuery.trim()) {
            filtered = filtered.filter(product => 
                product.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.mainCategory?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.subcategory?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.customCategory?.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }
        
        // Apply category filter
        if (categoryFilter !== 'all') {
            filtered = filtered.filter(product => 
                product.mainCategory === categoryFilter ||
                product.subcategory === categoryFilter ||
                product.customCategory === categoryFilter
            )
        }
        
        // Apply sorting
        switch (sortBy) {
            case 'name-asc':
                filtered.sort((a, b) => (a.title || '').localeCompare(b.title || ''))
                break
            case 'name-desc':
                filtered.sort((a, b) => (b.title || '').localeCompare(a.title || ''))
                break
            case 'price-low':
                filtered.sort((a, b) => (a.price || 0) - (b.price || 0))
                break
            case 'price-high':
                filtered.sort((a, b) => (b.price || 0) - (a.price || 0))
                break
            case 'stock-low':
                filtered.sort((a, b) => (a.stockCount || 0) - (b.stockCount || 0))
                break
            case 'stock-high':
                filtered.sort((a, b) => (b.stockCount || 0) - (a.stockCount || 0))
                break
            case 'newest':
            default:
                filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
                break
        }
        
        setFilteredProducts(filtered)
        setCurrentPage(1) // Reset to first page when filters change
    }, [products, searchQuery, categoryFilter, sortBy])

    const loadProducts = async () => {
        try {
            setLoading(true)
            const data = await fetchProductsByShopId(shopId, token)
            const productsList = Array.isArray(data) ? data : (data.content || [])
            setProducts(productsList)
        } catch (error) {
            console.error('Failed to load products:', error)
            setError('Failed to load products: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    // Get unique categories for filter
    const getUniqueCategories = () => {
        const categories = new Set()
        products.forEach(product => {
            if (product.mainCategory) categories.add(product.mainCategory)
            if (product.subcategory) categories.add(product.subcategory)
            if (product.customCategory) categories.add(product.customCategory)
        })
        return Array.from(categories).sort()
    }

    // Pagination logic
    const indexOfLastProduct = currentPage * productsPerPage
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage)

    const goToPage = (pageNumber) => {
        setCurrentPage(Math.max(1, Math.min(pageNumber, totalPages)))
    }

    const goToNextPage = () => goToPage(currentPage + 1)
    const goToPrevPage = () => goToPage(currentPage - 1)

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pages = []
        const maxVisiblePages = 5
        
        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i)
                pages.push('...')
                pages.push(totalPages)
            } else if (currentPage >= totalPages - 2) {
                pages.push(1)
                pages.push('...')
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i)
            } else {
                pages.push(1)
                pages.push('...')
                for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i)
                pages.push('...')
                pages.push(totalPages)
            }
        }
        
        return pages
    }

    const resetProductForm = () => {
        setProductForm({
            title: '', description: '', price: '', stockCount: '',
            mainCategory: '', subcategory: '', customCategory: ''
        })
        setProductImages([])
        setError('')
    }

    const handleEditProduct = (product) => {
        setEditingProduct(product)
        setProductForm({
            title: product.title || '',
            description: product.description || '',
            price: product.price || '',
            stockCount: product.stockCount || '',
            mainCategory: product.mainCategory || '',
            subcategory: product.subcategory || '',
            customCategory: product.customCategory || ''
        })
        
        let imagePaths = []
        try {
            imagePaths = product.imagePathsJson ? JSON.parse(product.imagePathsJson) : []
        } catch (e) {
            imagePaths = []
        }
        setProductImages(imagePaths)
        setShowEditProduct(true)
    }

    const handleProductImageUpload = async (files) => {
        if (!files || files.length === 0) return
        
        setUploadingImages(true)
        try {
            const uploadPromises = Array.from(files).map(file => uploadImage(file, token))
            const uploadedImages = await Promise.all(uploadPromises)
            setProductImages(prev => [...prev, ...uploadedImages])
        } catch (error) {
            console.error('Failed to upload images:', error)
            setError('Failed to upload images: ' + error.message)
        } finally {
            setUploadingImages(false)
        }
    }

    const handleAddProduct = async (e) => {
        e.preventDefault()
        
        if (!productForm.title.trim()) {
            setError('Product title is required')
            return
        }
        
        try {
            const newProduct = {
                ...productForm,
                shopId: shopId,
                imagePathsJson: JSON.stringify(productImages)
            }
            
            await createProduct(newProduct, token)
            setShowAddProduct(false)
            resetProductForm()
            loadProducts()
        } catch (error) {
            console.error('Failed to create product:', error)
            setError('Failed to create product: ' + error.message)
        }
    }

    const handleUpdateProduct = async (e) => {
        e.preventDefault()
        
        if (!editingProduct || !productForm.title.trim()) {
            setError('Product title is required')
            return
        }
        
        try {
            const updatedProduct = {
                ...editingProduct,
                ...productForm,
                imagePathsJson: JSON.stringify(productImages)
            }
            
            await updateProduct(editingProduct.id, updatedProduct, token)
            setShowEditProduct(false)
            setEditingProduct(null)
            resetProductForm()
            loadProducts()
        } catch (error) {
            console.error('Failed to update product:', error)
            setError('Failed to update product: ' + error.message)
        }
    }

    const handleDeleteProduct = async (productId) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return
        
        try {
            await deleteProduct(productId, token)
            loadProducts()
        } catch (error) {
            console.error('Failed to delete product:', error)
            setError('Failed to delete product: ' + error.message)
        }
    }

    const handleStockInputChange = (productId, value) => {
        const newStock = parseInt(value) || 0
        setProducts(products.map(p => 
            p.id === productId ? { ...p, stockCount: newStock } : p
        ))
    }

    const handleStockUpdate = async (productId, newStock) => {
        if (newStock < 0) return
        
        setSavingStock(prev => ({ ...prev, [productId]: true }))
        
        try {
            await updateProductStock(productId, newStock, token)
        } catch (error) {
            console.error('Failed to update stock:', error)
            setError('Failed to update stock: ' + error.message)
            loadProducts()
        } finally {
            setSavingStock(prev => ({ ...prev, [productId]: false }))
        }
    }

    if (loading) {
        return (
            <div className="product-management-page-container">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading products...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="product-management-page-container">
            <div className="page-header">
                <div className="page-header-content">
                    <button 
                        className="back-btn"
                        onClick={() => navigate('/dashboard')}
                    >
                        ← Back to Dashboard
                    </button>
                    <div className="page-title-section">
                        <h1 className="page-title">Product Management</h1>
                        <p className="page-subtitle">
                            Manage your shop's product catalog
                        </p>
                    </div>
                    <button 
                        className="add-product-btn"
                        onClick={() => setShowAddProduct(true)}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"/>
                            <line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                        Add New Product
                    </button>
                </div>
            </div>

            {error && (
                <div className="error-banner">
                    <span className="error-icon">⚠️</span>
                    {error}
                    <button 
                        className="error-close"
                        onClick={() => setError('')}
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* Search and Filter Controls */}
            <div className="search-filter-container">
                <div className="search-section">
                    <div className="search-input-wrapper">
                        <Search className="search-icon" size={20} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                    </div>
                    <div className="search-stats">
                        {filteredProducts.length} of {products.length} products
                    </div>
                </div>
                
                <div className="filter-section">
                    <div className="filter-group">
                        <label htmlFor="categoryFilter" className="filter-label">
                            <Filter size={16} />
                            Category
                        </label>
                        <select
                            id="categoryFilter"
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">All Categories</option>
                            {getUniqueCategories().map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="filter-group">
                        <label htmlFor="sortBy" className="filter-label">
                            Sort by
                        </label>
                        <select
                            id="sortBy"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="filter-select"
                        >
                            <option value="newest">Newest First</option>
                            <option value="name-asc">Name A-Z</option>
                            <option value="name-desc">Name Z-A</option>
                            <option value="price-low">Price Low to High</option>
                            <option value="price-high">Price High to Low</option>
                            <option value="stock-low">Stock Low to High</option>
                            <option value="stock-high">Stock High to Low</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="products-management-container">
                {(!Array.isArray(filteredProducts) || filteredProducts.length === 0) ? (
                    <div className="no-products-state">
                        <div className="no-products-icon">📦</div>
                        <h3>
                            {searchQuery || categoryFilter !== 'all' 
                                ? 'No products found' 
                                : 'No products yet'
                            }
                        </h3>
                        <p className="muted">
                            {searchQuery || categoryFilter !== 'all'
                                ? 'Try adjusting your search or filters'
                                : 'Start selling by adding your first product'
                            }
                        </p>
                        {!searchQuery && categoryFilter === 'all' && (
                            <button 
                                className="add-product-btn"
                                onClick={() => setShowAddProduct(true)}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="12" y1="5" x2="12" y2="19"/>
                                    <line x1="5" y1="12" x2="19" y2="12"/>
                                </svg>
                                Add Your First Product
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="products-management-grid">
                            {currentProducts.map((product) => (
                                <div key={product.id} className="product-management-card">
                                    <div className="product-management-image">
                                        {(() => {
                                            let imagePaths = []
                                            try {
                                                imagePaths = product.imagePathsJson ? JSON.parse(product.imagePathsJson) : []
                                            } catch (e) {
                                                imagePaths = []
                                            }
                                            
                                            if (imagePaths.length > 0 && imagePaths[0]) {
                                                const imageUrl = getImageUrl(imagePaths[0])
                                                console.log('Product image URL:', imageUrl, 'for product:', product.title)
                                                return (
                                                    <>
                                                        <img 
                                                            src={imageUrl} 
                                                            alt={product.title}
                                                            className="product-management-image"
                                                            onError={(e) => {
                                                                console.error('Image failed to load:', imageUrl)
                                                                e.target.style.display = 'none'
                                                                e.target.nextSibling.style.display = 'flex'
                                                            }}
                                                            onLoad={() => {
                                                                console.log('Image loaded successfully:', imageUrl)
                                                            }}
                                                        />
                                                        <div className="product-image-placeholder" style={{ display: 'none' }}>
                                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                                                <circle cx="8.5" cy="8.5" r="1.5"/>
                                                                <polyline points="21,15 16,10 5,21"/>
                                                            </svg>
                                                        </div>
                                                    </>
                                                )
                                            }
                                            
                                            return (
                                                <div className="product-image-placeholder">
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                                        <circle cx="8.5" cy="8.5" r="1.5"/>
                                                        <polyline points="21,15 16,10 5,21"/>
                                                    </svg>
                                                </div>
                                            )
                                        })()}
                                    </div>
                                    <div className="product-management-content">
                                        <div className="product-management-title">{product.title}</div>
                                        <div className="product-management-price">
                                            ₱{product.price ? Number(product.price).toFixed(2) : '0.00'}
                                        </div>
                                        {product.category && (
                                            <div className="product-management-category">
                                                <span className="category-tag">{product.category}</span>
                                            </div>
                                        )}
                                        {(product.mainCategory || product.subcategory || product.customCategory) && (
                                            <div className="product-management-category">
                                                <span className="category-tag">
                                                    {product.customCategory || product.subcategory || product.mainCategory}
                                                </span>
                                            </div>
                                        )}
                                        <div className="product-management-stock">
                                            {product.stockCount > 0 ? (
                                                <span className="stock-in-stock">In Stock: {product.stockCount}</span>
                                            ) : (
                                                <span className="stock-out-of-stock">Out of Stock</span>
                                            )}
                                            <div className="stock-controls">
                                                <button 
                                                    className="stock-btn stock-minus"
                                                    onClick={async () => {
                                                        try {
                                                            const productId = product.id
                                                            const result = await decrementProductStock(productId, 1, token)
                                                            
                                                            setProducts(products.map(p => 
                                                                p.id === productId ? { ...p, stockCount: result.stockCount } : p
                                                            ))
                                                        } catch (error) {
                                                            console.error('Failed to decrease stock:', error)
                                                            setError('Failed to decrease stock: ' + error.message)
                                                        }
                                                    }}
                                                    title="Decrease stock by 1"
                                                >
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <line x1="5" y1="12" x2="19" y2="12"/>
                                                    </svg>
                                                </button>
                                                <input
                                                    type="number"
                                                    className={`stock-input ${savingStock[product.id] ? 'saving' : ''}`}
                                                    value={product.stockCount || 0}
                                                    onChange={(e) => handleStockInputChange(product.id, e.target.value)}
                                                    onBlur={(e) => handleStockUpdate(product.id, parseInt(e.target.value) || 0)}
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
                                                    onClick={async () => {
                                                        try {
                                                            const productId = product.id
                                                            const newStock = (product.stockCount || 0) + 1
                                                            const result = await updateProductStock(productId, newStock, token)
                                                            
                                                            setProducts(products.map(p => 
                                                                p.id === productId ? { ...p, stockCount: result.stockCount } : p
                                                            ))
                                                        } catch (error) {
                                                            console.error('Failed to increase stock:', error)
                                                            setError('Failed to increase stock: ' + error.message)
                                                        }
                                                    }}
                                                    title="Increase stock by 1"
                                                >
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <line x1="12" y1="5" x2="12" y2="19"/>
                                                        <line x1="5" y1="12" x2="19" y2="12"/>
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                        {product.description && (
                                            <p className="product-management-description">
                                                {product.description.length > 80 
                                                    ? product.description.substring(0, 80) + '...' 
                                                    : product.description
                                                }
                                            </p>
                                        )}
                                        <div className="product-management-actions">
                                            <button 
                                                className="btn-sm edit-btn"
                                                onClick={() => handleEditProduct(product)}
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                                    <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                                </svg>
                                                Edit
                                            </button>
                                            <button 
                                                className="btn-sm delete-btn"
                                                onClick={() => handleDeleteProduct(product.id)}
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="3,6 5,6 21,6"/>
                                                    <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
                                                </svg>
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="pagination-container">
                                <div className="pagination-info">
                                    Showing {indexOfFirstProduct + 1} to {Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} products
                                </div>
                                
                                <div className="pagination-controls">
                                    <button
                                        className="pagination-btn"
                                        onClick={goToPrevPage}
                                        disabled={currentPage === 1}
                                    >
                                        <ChevronLeft size={16} />
                                        Previous
                                    </button>
                                    
                                    <div className="pagination-pages">
                                        {getPageNumbers().map((page, index) => (
                                            <button
                                                key={index}
                                                className={`pagination-page ${page === currentPage ? 'active' : ''} ${page === '...' ? 'disabled' : ''}`}
                                                onClick={() => typeof page === 'number' && goToPage(page)}
                                                disabled={page === '...'}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                    </div>
                                    
                                    <button
                                        className="pagination-btn"
                                        onClick={goToNextPage}
                                        disabled={currentPage === totalPages}
                                    >
                                        Next
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Add Product Modal */}
            <Modal 
                isOpen={showAddProduct} 
                onClose={() => {
                    setShowAddProduct(false)
                    resetProductForm()
                }}
                title="Add New Product"
                size="xlarge"
            >
                <form onSubmit={handleAddProduct} className="add-product-form">
                    <div className="form-grid">
                        <div className="form-inputs">
                            <div className="form-group">
                                <label htmlFor="productTitle" className="form-label">
                                    Product Title *
                                </label>
                                <input
                                    type="text"
                                    id="productTitle"
                                    className="input"
                                    value={productForm.title}
                                    onChange={(e) => setProductForm({...productForm, title: e.target.value})}
                                    required
                                    placeholder="Enter product name"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="productCategory" className="form-label">
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
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="productPrice" className="form-label">
                                    Price *
                                </label>
                                <input
                                    type="number"
                                    id="productPrice"
                                    className="input"
                                    value={productForm.price}
                                    onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                                    required
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="productStock" className="form-label">
                                    Initial Stock
                                </label>
                                <input
                                    type="number"
                                    id="productStock"
                                    className="input"
                                    value={productForm.stockCount}
                                    onChange={(e) => setProductForm({...productForm, stockCount: e.target.value})}
                                    min="0"
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        <div className="form-inputs">
                            <div className="form-group">
                                <label htmlFor="productDescription" className="form-label">
                                    Description
                                </label>
                                <textarea
                                    id="productDescription"
                                    className="input textarea"
                                    value={productForm.description}
                                    onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                                    rows="4"
                                    placeholder="Describe your product..."
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Product Images
                                </label>
                                <div className="image-upload-area">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={(e) => handleProductImageUpload(e.target.files)}
                                        className="image-upload-input"
                                        id="imageUpload"
                                    />
                                    <label htmlFor="imageUpload" className="image-upload-label">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                            <polyline points="7,10 12,15 17,10"/>
                                            <line x1="12" y1="15" x2="12" y2="3"/>
                                        </svg>
                                        {uploadingImages ? 'Uploading...' : 'Choose Images'}
                                    </label>
                                </div>
                                
                                {productImages.length > 0 && (
                                    <div className="uploaded-images">
                                        {productImages.map((image, index) => (
                                            <div key={index} className="uploaded-image">
                                                <img src={getImageUrl(image)} alt={`Product ${index + 1}`} />
                                                <button
                                                    type="button"
                                                    className="remove-image-btn"
                                                    onClick={() => setProductImages(productImages.filter((_, i) => i !== index))}
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => setShowAddProduct(false)}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={uploadingImages}>
                            {uploadingImages ? 'Creating...' : 'Create Product'}
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
                    resetProductForm()
                }}
                title="Edit Product"
                size="xlarge"
            >
                <form onSubmit={handleUpdateProduct} className="add-product-form">
                    <div className="form-grid">
                        <div className="form-inputs">
                            <div className="form-group">
                                <label htmlFor="editProductTitle" className="form-label">
                                    Product Title *
                                </label>
                                <input
                                    type="text"
                                    id="editProductTitle"
                                    className="input"
                                    value={productForm.title}
                                    onChange={(e) => setProductForm({...productForm, title: e.target.value})}
                                    required
                                    placeholder="Enter product name"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="editProductCategory" className="form-label">
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
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="editProductPrice" className="form-label">
                                    Price *
                                </label>
                                <input
                                    type="number"
                                    id="editProductPrice"
                                    className="input"
                                    value={productForm.price}
                                    onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                                    required
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="editProductStock" className="form-label">
                                    Stock Count
                                </label>
                                <input
                                    type="number"
                                    id="editProductStock"
                                    className="input"
                                    value={productForm.stockCount}
                                    onChange={(e) => setProductForm({...productForm, stockCount: e.target.value})}
                                    min="0"
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        <div className="form-inputs">
                            <div className="form-group">
                                <label htmlFor="editProductDescription" className="form-label">
                                    Description
                                </label>
                                <textarea
                                    id="editProductDescription"
                                    className="input textarea"
                                    value={productForm.description}
                                    onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                                    rows="4"
                                    placeholder="Describe your product..."
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Product Images
                                </label>
                                <div className="image-upload-area">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={(e) => handleProductImageUpload(e.target.files)}
                                        className="image-upload-input"
                                        id="editImageUpload"
                                    />
                                    <label htmlFor="editImageUpload" className="image-upload-label">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                            <polyline points="7,10 12,15 17,10"/>
                                            <line x1="12" y1="15" x2="12" y2="3"/>
                                        </svg>
                                        {uploadingImages ? 'Uploading...' : 'Add More Images'}
                                    </label>
                                </div>
                                
                                {productImages.length > 0 && (
                                    <div className="uploaded-images">
                                        {productImages.map((image, index) => (
                                            <div key={index} className="uploaded-image">
                                                <img src={getImageUrl(image)} alt={`Product ${index + 1}`} />
                                                <button
                                                    type="button"
                                                    className="remove-image-btn"
                                                    onClick={() => setProductImages(productImages.filter((_, i) => i !== index))}
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => setShowEditProduct(false)}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={uploadingImages}>
                            {uploadingImages ? 'Updating...' : 'Update Product'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}
