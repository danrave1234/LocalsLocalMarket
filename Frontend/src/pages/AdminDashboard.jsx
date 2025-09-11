import { useState, useEffect } from 'react'
import { useAuth } from '../auth/AuthContext.jsx'
import { Link } from 'react-router-dom'
import SEOHead from '../components/SEOHead.jsx'
import { warnShopOwner, fetchUsers, updateUserStatus } from '../api/admin.js'
import '../components/AdminDashboard.css'
import { BarChart3, Users as UsersIcon, Package, Tags, TrendingUp, Bell, Clipboard, UserPlus, User, Map, Lock, Unlock } from 'lucide-react'

// Inline icon components to match landing page consistency
function StoreIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.width || 20} height={props.height || 20} fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M2 3h20v14H2z" />
      <path d="M2 17h20v4H2z" />
      <path d="M6 7h4" />
      <path d="M6 11h4" />
      <path d="M14 7h4" />
      <path d="M14 11h4" />
    </svg>
  )
}

export default function AdminDashboard() {
    const { user } = useAuth()
    const [activeTab, setActiveTab] = useState('shops')

    if (user?.role !== 'ADMIN') {
        return (
            <>
                <SEOHead 
                    title="Access Denied"
                    description="You need admin privileges to access this page."
                />
                <main className="container">
                    <div className="admin-access-denied">
                        <h3>Access Denied</h3>
                        <p>You need admin privileges to access this page.</p>
                    </div>
                </main>
            </>
        )
    }

    const tabs = [
        { id: 'shops', label: 'Shop Management', icon: <StoreIcon width={16} height={16} /> },
        { id: 'users', label: 'User Management', icon: <UsersIcon size={16} /> },
        { id: 'products', label: 'Product Management', icon: <Package size={16} /> }
    ]

    const renderTabContent = () => {
        switch (activeTab) {
            case 'shops':
                return <ShopManagementTab />
            case 'users':
                return <UserManagementTab />
            case 'products':
                return <ProductManagementTab />
            default:
                return <ShopManagementTab />
        }
    }

    return (
        <>
            <SEOHead 
                title="Admin Dashboard"
                description="Administrative dashboard for managing the local marketplace"
            />
            <main className="admin-dashboard">
                <div className="admin-header">
                    <div className="admin-header-content">
                        <h1>Admin Dashboard</h1>
                        <p>Welcome back, {user?.name || user?.email}</p>
                    </div>
                    <div className="admin-header-actions"></div>
                </div>

                <div className="admin-content">
                    <div className="admin-sidebar">
                        <nav className="admin-nav">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    className={`admin-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    <span className="nav-icon">{tab.icon}</span>
                                    <span className="nav-label">{tab.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="admin-main">
                        {renderTabContent()}
                    </div>
                </div>
            </main>
        </>
    )
}

// Removed Overview/Users/Reports/Settings/Category tabs to declutter

// User Management Tab Component
function UserManagementTab() {
    const [users, setUsers] = useState([])
    const [page, setPage] = useState(0)
    const [size, setSize] = useState(20)
    const [totalPages, setTotalPages] = useState(0)
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const load = async (p = page, s = size, q = search) => {
        setLoading(true)
        setError('')
        try {
            const res = await fetchUsers(p, s, q && q.trim() ? q.trim() : null)
            // Expect Spring Page response
            setUsers(res.content || [])
            setTotalPages(res.totalPages ?? 0)
            setPage(res.number ?? p)
        } catch (e) {
            setError(e?.message || 'Failed to load users')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        load(0, size, search)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onSearch = () => load(0, size, search)

    const toggleUser = async (u, disable) => {
        const prev = [...users]
        try {
            // Optimistic UI
            setUsers(users.map(x => x.id === u.id ? { ...x, enabled: !disable } : x))
            const status = disable ? 'DISABLED' : 'ACTIVE'
            await updateUserStatus(u.id, status)
            // Reload to ensure consistency
            load(page, size, search)
        } catch (e) {
            setUsers(prev)
            alert(e?.message || 'Failed to update user')
        }
    }

    return (
        <div className="user-management-tab">
            <div className="tab-header">
                <h2>User Management</h2>
                <div className="tab-actions" style={{ display: 'flex', gap: 8 }}>
                    <input
                        className="input"
                        placeholder="Search by name or email"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && onSearch()}
                        style={{ minWidth: 240 }}
                    />
                    <button className="btn" onClick={onSearch}>Search</button>
                </div>
            </div>

            {error && <div className="error-text" style={{ marginTop: 8 }}>{error}</div>}
            {loading ? (
                <div className="empty-state">Loading users...</div>
            ) : users.length === 0 ? (
                <div className="empty-state">No users found.</div>
            ) : (
                <div className="card" style={{ overflowX: 'auto' }}>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Enabled</th>
                                <th>Active</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u.id}>
                                    <td>{u.id}</td>
                                    <td>{u.name}</td>
                                    <td>{u.email}</td>
                                    <td>{String(u.enabled ?? u.enabled === true)}</td>
                                    <td>{String(u.isActive ?? u.isActive === true)}</td>
                                    <td>
                                        {u.enabled ? (
                                            <button className="btn btn-danger" onClick={() => toggleUser(u, true)}>
                                                <Lock size={14} /> Disable
                                            </button>
                                        ) : (
                                            <button className="btn btn-secondary" onClick={() => toggleUser(u, false)}>
                                                <Unlock size={14} /> Enable
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="pagination" style={{ display: 'flex', gap: 8, marginTop: 12, alignItems: 'center' }}>
                <button className="btn" disabled={page <= 0} onClick={() => load(page - 1, size, search)}>Prev</button>
                <span>Page {page + 1} of {Math.max(totalPages, 1)}</span>
                <button className="btn" disabled={page + 1 >= totalPages} onClick={() => load(page + 1, size, search)}>Next</button>
                <select className="input" value={size} onChange={(e) => { const s = parseInt(e.target.value, 10); setSize(s); load(0, s, search) }}>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                </select>
            </div>
        </div>
    )
}

// Shop Management Tab Component
function ShopManagementTab() {
    const [slugInput, setSlugInput] = useState('')
    const [reason, setReason] = useState('')
    const [sending, setSending] = useState(false)
    const [message, setMessage] = useState('')
    const [disableSlug, setDisableSlug] = useState('')
    const [toggling, setToggling] = useState(false)
    const [toggleMsg, setToggleMsg] = useState('')

    const handleWarn = async () => {
        setMessage('')
        if (!slugInput.trim()) {
            setMessage('Please enter the shop slug.')
            return
        }
        setSending(true)
        try {
            await warnShopOwner(slugInput.trim(), reason.trim())
            setMessage('Warning sent successfully.')
            setReason('')
        } catch (e) {
            setMessage(e?.message || 'Failed to send warning.')
        } finally {
            setSending(false)
        }
    }

    return (
        <div className="shop-management-tab">
            <div className="tab-header">
                <h2>Shop Management</h2>
                <div className="tab-actions">
                    <select className="input">
                        <option>All Shops</option>
                        <option>Pending Approval</option>
                        <option>Active</option>
                        <option>Suspended</option>
                    </select>
                    <button className="btn btn-primary">
                        <StoreIcon width={16} height={16} /> View All Shops
                    </button>
                </div>
            </div>
            <div className="empty-state">Shop statistics will appear here once connected.</div>
            <div className="warn-card" style={{ marginTop: 16 }}>
                <h3>Warn Shop Owner</h3>
                <div className="form-row" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <input 
                        className="input" 
                        placeholder="Shop slug"
                        value={slugInput}
                        onChange={(e) => setSlugInput(e.target.value)}
                        style={{ minWidth: 200 }}
                    />
                    <input 
                        className="input" 
                        placeholder="Reason (optional)"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        style={{ flex: 1, minWidth: 260 }}
                    />
                    <button className="btn btn-danger" onClick={handleWarn} disabled={sending}>
                        {sending ? 'Sending...' : 'Send Warning'}
                    </button>
                </div>
                {message && <div className="info-text" style={{ marginTop: 8 }}>{message}</div>}
            </div>
            <div className="status-card" style={{ marginTop: 16 }}>
                <h3>Disable/Enable Shop</h3>
                <div className="form-row" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <input
                        className="input"
                        placeholder="Shop slug"
                        value={disableSlug}
                        onChange={(e) => setDisableSlug(e.target.value)}
                        style={{ minWidth: 200 }}
                    />
                    <button className="btn btn-danger" onClick={async () => {
                        setToggleMsg('')
                        if (!disableSlug.trim()) {
                            setToggleMsg('Please enter the shop slug.')
                            return
                        }
                        setToggling(true)
                        try {
                            const res = await import('../api/shops.js').then(m => m.updateShopStatusBySlug(disableSlug.trim(), false))
                            setToggleMsg('Shop disabled successfully.')
                        } catch (e) {
                            setToggleMsg(e?.message || 'Failed to disable shop.')
                        } finally {
                            setToggling(false)
                        }
                    }} disabled={toggling}>
                        {toggling ? 'Working...' : (<><Lock size={16} /> Disable</>)}
                    </button>
                    <button className="btn btn-secondary" onClick={async () => {
                        setToggleMsg('')
                        if (!disableSlug.trim()) {
                            setToggleMsg('Please enter the shop slug.')
                            return
                        }
                        setToggling(true)
                        try {
                            const res = await import('../api/shops.js').then(m => m.updateShopStatusBySlug(disableSlug.trim(), true))
                            setToggleMsg('Shop enabled successfully.')
                        } catch (e) {
                            setToggleMsg(e?.message || 'Failed to enable shop.')
                        } finally {
                            setToggling(false)
                        }
                    }} disabled={toggling}>
                        {toggling ? 'Working...' : (<><Unlock size={16} /> Enable</>)}
                    </button>
                </div>
                {toggleMsg && <div className="info-text" style={{ marginTop: 8 }}>{toggleMsg}</div>}
            </div>
        </div>
    )
}

// Product Management Tab Component
function ProductManagementTab() {
    const [productIdInput, setProductIdInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [statusMsg, setStatusMsg] = useState('')
    const [product, setProduct] = useState(null)

    const loadProduct = async () => {
        setStatusMsg('')
        const id = parseInt(productIdInput, 10)
        if (!id || Number.isNaN(id)) { setStatusMsg('Enter a valid product ID.'); return }
        setLoading(true)
        try {
            const api = await import('../api/products.js')
            const res = await api.getProductById(id)
            setProduct(res)
        } catch (e) {
            setProduct(null)
            setStatusMsg(e?.message || 'Failed to load product.')
        } finally {
            setLoading(false)
        }
    }

    const saveProduct = async () => {
        if (!product) return
        setSaving(true)
        setStatusMsg('')
        try {
            const api = await import('../api/products.js')
            const updated = await api.updateProduct(product.id, {
                title: product.title,
                description: product.description,
                price: product.price,
                stockCount: product.stockCount,
                imagePathsJson: product.imagePathsJson,
                category: product.category,
                mainCategory: product.mainCategory,
                subcategory: product.subcategory,
                customCategory: product.customCategory,
                isActive: product.isActive,
            })
            setProduct(updated)
            setStatusMsg('Product saved successfully.')
        } catch (e) {
            setStatusMsg(e?.message || 'Failed to save product.')
        } finally {
            setSaving(false)
        }
    }

    const toggleActive = async (active) => {
        if (!product) return
        setSaving(true)
        setStatusMsg('')
        try {
            const api = await import('../api/products.js')
            const updated = await api.updateProduct(product.id, { isActive: active })
            setProduct(updated)
            setStatusMsg(active ? 'Product enabled.' : 'Product disabled.')
        } catch (e) {
            setStatusMsg(e?.message || 'Failed to update status.')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="product-management-tab">
            <div className="tab-header">
                <h2>Product Management</h2>
                <div className="tab-actions">
                    <input 
                        type="text" 
                        placeholder="Enter product ID" 
                        className="input"
                        value={productIdInput}
                        onChange={(e) => setProductIdInput(e.target.value)}
                        style={{ minWidth: 180 }}
                    />
                    <button className="btn btn-primary" onClick={loadProduct} disabled={loading}>
                        {loading ? 'Loading...' : 'Load Product'}
                    </button>
                </div>
            </div>

            {statusMsg && <div className="info-text" style={{ marginTop: 8 }}>{statusMsg}</div>}

            {!product ? (
                <div className="empty-state">Load a product by ID to edit or disable it.</div>
            ) : (
                <div className="product-editor" style={{ marginTop: 16, display: 'grid', gap: 12 }}>
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                        <div style={{ minWidth: 260, flex: 1 }}>
                            <label>Title</label>
                            <input className="input" value={product.title || ''} onChange={(e) => setProduct({ ...product, title: e.target.value })} />
                        </div>
                        <div>
                            <label>Price</label>
                            <input className="input" type="number" step="0.01" value={product.price || 0} onChange={(e) => setProduct({ ...product, price: Number(e.target.value) })} />
                        </div>
                        <div>
                            <label>Stock</label>
                            <input className="input" type="number" value={product.stockCount || 0} onChange={(e) => setProduct({ ...product, stockCount: parseInt(e.target.value || '0', 10) })} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <label>Status</label>
                            <span className={`badge ${product.isActive ? 'badge-success' : 'badge-danger'}`}>{product.isActive ? 'Active' : 'Disabled'}</span>
                            <button className="btn btn-danger" onClick={() => toggleActive(false)} disabled={saving || !product.isActive}>
                                <Lock size={16} /> Disable
                            </button>
                            <button className="btn btn-secondary" onClick={() => toggleActive(true)} disabled={saving || product.isActive}>
                                <Unlock size={16} /> Enable
                            </button>
                        </div>
                    </div>

                    <div>
                        <label>Description</label>
                        <textarea className="input" rows={4} value={product.description || ''} onChange={(e) => setProduct({ ...product, description: e.target.value })} />
                    </div>

                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                        <div>
                            <label>Category (legacy)</label>
                            <input className="input" value={product.category || ''} onChange={(e) => setProduct({ ...product, category: e.target.value })} />
                        </div>
                        <div>
                            <label>Main Category</label>
                            <input className="input" value={product.mainCategory || ''} onChange={(e) => setProduct({ ...product, mainCategory: e.target.value })} />
                        </div>
                        <div>
                            <label>Subcategory</label>
                            <input className="input" value={product.subcategory || ''} onChange={(e) => setProduct({ ...product, subcategory: e.target.value })} />
                        </div>
                        <div>
                            <label>Custom Category</label>
                            <input className="input" value={product.customCategory || ''} onChange={(e) => setProduct({ ...product, customCategory: e.target.value })} />
                        </div>
                    </div>

                    <div>
                        <label>Images JSON</label>
                        <textarea className="input" rows={3} value={product.imagePathsJson || ''} onChange={(e) => setProduct({ ...product, imagePathsJson: e.target.value })} />
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-primary" onClick={saveProduct} disabled={saving}>
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

// Category Management Tab Component
function CategoryManagementTab() { return null }

// Reports Tab Component
function ReportsTab() { return null }

// Settings Tab Component
function SettingsTab() { return null }
