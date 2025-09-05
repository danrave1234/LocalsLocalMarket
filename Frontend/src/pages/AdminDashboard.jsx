import { useState, useEffect } from 'react'
import { useAuth } from '../auth/AuthContext.jsx'
import { Link } from 'react-router-dom'
import SEOHead from '../components/SEOHead.jsx'
import AdminCategoryManager from '../components/AdminCategoryManager.jsx'
import { fetchDashboardStats, fetchRecentActivity } from '../api/admin.js'
import '../components/AdminDashboard.css'
import { BarChart3, Users, Package, Tags, TrendingUp, Bell, Clipboard, UserPlus, User, Map } from 'lucide-react'

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
    const [activeTab, setActiveTab] = useState('overview')
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalShops: 0,
        totalProducts: 0,
        activeUsers: 0,
        pendingShops: 0,
        lowStockProducts: 0,
        outOfStockProducts: 0,
        newProductsThisWeek: 0,
        totalSales: '₱0',
        salesThisMonth: '₱0'
    })
    const [recentActivity, setRecentActivity] = useState([])

    useEffect(() => {
        if (user?.role === 'ADMIN') {
            loadDashboardStats()
        }
    }, [user])

    const loadDashboardStats = async () => {
        try {
            setLoading(true)
            const [statsResponse, activityResponse] = await Promise.all([
                fetchDashboardStats(),
                fetchRecentActivity()
            ])
            
            setStats({
                totalUsers: statsResponse.data.totalUsers || 0,
                totalShops: statsResponse.data.totalShops || 0,
                totalProducts: statsResponse.data.totalProducts || 0,
                activeUsers: statsResponse.data.activeUsers || 0,
                pendingShops: statsResponse.data.pendingShops || 0,
                lowStockProducts: statsResponse.data.lowStockProducts || 0,
                outOfStockProducts: statsResponse.data.outOfStockProducts || 0,
                newProductsThisWeek: statsResponse.data.newProductsThisWeek || 0,
                totalSales: statsResponse.data.totalSales || '₱0',
                salesThisMonth: statsResponse.data.salesThisMonth || '₱0'
            })
            
            // Store recent activity for use in overview tab
            setRecentActivity(activityResponse.data || [])
        } catch (error) {
            console.error('Failed to load dashboard stats:', error)
            // Fallback to mock data if API fails
            setStats({
                totalUsers: 1250,
                totalShops: 89,
                totalProducts: 1247,
                activeUsers: 892,
                pendingShops: 12,
                lowStockProducts: 45,
                outOfStockProducts: 23,
                newProductsThisWeek: 89,
                totalSales: '₱2.4M',
                salesThisMonth: '₱450K'
            })
        } finally {
            setLoading(false)
        }
    }

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
        { id: 'overview', label: 'Overview', icon: <BarChart3 size={16} /> },
        { id: 'users', label: 'User Management', icon: <Users size={16} /> },
        { id: 'shops', label: 'Shop Management', icon: <StoreIcon width={16} height={16} /> },
        { id: 'products', label: 'Product Management', icon: <Package size={16} /> },
        { id: 'categories', label: 'Category Management', icon: <Tags size={16} /> },
        { id: 'reports', label: 'Reports & Analytics', icon: <TrendingUp size={16} /> },
        { id: 'settings', label: 'System Settings', icon: '⚙️' }
    ]

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return <OverviewTab stats={stats} loading={loading} recentActivity={recentActivity} />
            case 'users':
                return <UserManagementTab />
            case 'shops':
                return <ShopManagementTab />
            case 'products':
                return <ProductManagementTab />
            case 'categories':
                return <CategoryManagementTab />
            case 'reports':
                return <ReportsTab />
            case 'settings':
                return <SettingsTab />
            default:
                return <OverviewTab stats={stats} loading={loading} />
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
                    <div className="admin-header-actions">
                        <button className="btn btn-secondary">
                            <BarChart3 size={16} /> Export Data
                        </button>
                        <button className="btn btn-primary">
                            <Bell size={16} /> Notifications
                        </button>
                    </div>
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

// Overview Tab Component
function OverviewTab({ stats, loading, recentActivity }) {
    return (
        <div className="overview-tab">
            <div className="overview-header">
                <h2>Dashboard Overview</h2>
                <p>System statistics and recent activity</p>
            </div>

            {loading ? (
                <div className="loading-spinner">Loading dashboard data...</div>
            ) : (
                <>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon"><Users size={24} /></div>
                            <div className="stat-content">
                                <h3>{stats.totalUsers.toLocaleString()}</h3>
                                <p>Total Users</p>
                                <small>{stats.activeUsers} active</small>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon"><StoreIcon width={24} height={24} /></div>
                            <div className="stat-content">
                                <h3>{stats.totalShops.toLocaleString()}</h3>
                                <p>Total Shops</p>
                                <small>{stats.pendingShops} pending approval</small>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon"><Package size={24} /></div>
                            <div className="stat-content">
                                <h3>{stats.totalProducts.toLocaleString()}</h3>
                                <p>Total Products</p>
                                <small>{stats.lowStockProducts} low stock</small>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon"><TrendingUp size={24} /></div>
                            <div className="stat-content">
                                <h3>{stats.totalSales}</h3>
                                <p>Total Sales</p>
                                <small>This month</small>
                            </div>
                        </div>
                    </div>

                    <div className="overview-sections">
                        <div className="overview-section">
                            <h3>Recent Activity</h3>
                            <div className="activity-list">
                                {recentActivity.length > 0 ? (
                                    recentActivity.map((activity, index) => (
                                        <div key={index} className="activity-item">
                                            <div className="activity-icon">{activity.icon || <Clipboard size={16} />}</div>
                                            <div className="activity-content">
                                                <p>{activity.message}</p>
                                                <small>{new Date(activity.timestamp).toLocaleString()}</small>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="activity-item">
                                        <div className="activity-icon"><Clipboard size={16} /></div>
                                        <div className="activity-content">
                                            <p>No recent activity</p>
                                            <small>Activity will appear here</small>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="overview-section">
                            <h3>Quick Actions</h3>
                            <div className="quick-actions">
                                <button className="btn btn-secondary">
                                    <Users size={16} /> Review Pending Users
                                </button>
                                <button className="btn btn-secondary">
                                    <StoreIcon width={16} height={16} /> Approve Shops
                                </button>
                                <button className="btn btn-secondary">
                                    <Package size={16} /> Check Low Stock
                                </button>
                                <button className="btn btn-secondary">
                                    <BarChart3 size={16} /> Generate Report
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

// User Management Tab Component
function UserManagementTab() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // TODO: Implement user fetching
        setLoading(false)
    }, [])

    return (
        <div className="user-management-tab">
            <div className="tab-header">
                <h2>User Management</h2>
                <div className="tab-actions">
                    <input 
                        type="text" 
                        placeholder="Search users..." 
                        className="input"
                    />
                    <button className="btn btn-primary">
                        <UserPlus size={16} /> Add User
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="loading-spinner">Loading users...</div>
            ) : (
                <div className="user-list">
                    <div className="user-item">
                        <div className="user-info">
                            <div className="user-avatar"><User size={20} /></div>
                            <div className="user-details">
                                <h4>John Doe</h4>
                                <p>john.doe@example.com</p>
                                <span className="user-role">USER</span>
                            </div>
                        </div>
                        <div className="user-actions">
                            <button className="btn btn-secondary">Edit</button>
                            <button className="btn btn-danger">Suspend</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

// Shop Management Tab Component
function ShopManagementTab() {
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

            <div className="shop-stats">
                <div className="stat-item">
                    <h3>89</h3>
                    <p>Total Shops</p>
                </div>
                <div className="stat-item">
                    <h3>12</h3>
                    <p>Pending Approval</p>
                </div>
                <div className="stat-item">
                    <h3>67</h3>
                    <p>Active Shops</p>
                </div>
                <div className="stat-item">
                    <h3>10</h3>
                    <p>Suspended</p>
                </div>
            </div>
        </div>
    )
}

// Product Management Tab Component
function ProductManagementTab() {
    return (
        <div className="product-management-tab">
            <div className="tab-header">
                <h2>Product Management</h2>
                <div className="tab-actions">
                    <input 
                        type="text" 
                        placeholder="Search products..." 
                        className="input"
                    />
                    <button className="btn btn-primary">
                        <Package size={16} /> View All Products
                    </button>
                </div>
            </div>

            <div className="product-stats">
                <div className="stat-item">
                    <h3>1,247</h3>
                    <p>Total Products</p>
                </div>
                <div className="stat-item">
                    <h3>45</h3>
                    <p>Low Stock</p>
                </div>
                <div className="stat-item">
                    <h3>23</h3>
                    <p>Out of Stock</p>
                </div>
                <div className="stat-item">
                    <h3>89</h3>
                    <p>New This Week</p>
                </div>
            </div>
        </div>
    )
}

// Category Management Tab Component
function CategoryManagementTab() {
    return (
        <div className="category-management-tab">
            <div className="tab-header">
                <h2>Category Management</h2>
                <p>Manage product and shop categories</p>
            </div>
            <AdminCategoryManager />
        </div>
    )
}

// Reports Tab Component
function ReportsTab() {
    return (
        <div className="reports-tab">
            <div className="tab-header">
                <h2>Reports & Analytics</h2>
                <div className="tab-actions">
                    <button className="btn btn-secondary">
                        <BarChart3 size={16} /> Generate Report
                    </button>
                    <button className="btn btn-primary">
                        <TrendingUp size={16} /> View Analytics
                    </button>
                </div>
            </div>

            <div className="reports-grid">
                <div className="report-card">
                    <h3>User Growth</h3>
                    <div className="report-chart">
                        <TrendingUp size={24} /> Chart placeholder
                    </div>
                </div>
                <div className="report-card">
                    <h3>Sales Analytics</h3>
                    <div className="report-chart">
                        <BarChart3 size={24} /> Chart placeholder
                    </div>
                </div>
                <div className="report-card">
                    <h3>Popular Categories</h3>
                    <div className="report-chart">
                        <Tags size={24} /> Chart placeholder
                    </div>
                </div>
                <div className="report-card">
                    <h3>Geographic Distribution</h3>
                    <div className="report-chart">
                        <Map size={24} /> Chart placeholder
                    </div>
                </div>
            </div>
        </div>
    )
}

// Settings Tab Component
function SettingsTab() {
    return (
        <div className="settings-tab">
            <div className="tab-header">
                <h2>System Settings</h2>
                <p>Configure system-wide settings and preferences</p>
            </div>

            <div className="settings-sections">
                <div className="settings-section">
                    <h3>General Settings</h3>
                    <div className="setting-item">
                        <label>Site Name</label>
                        <input type="text" className="input" defaultValue="Locals Local Market" readOnly />
                    </div>
                    <div className="setting-item">
                        <label>Contact Email</label>
                        <input type="email" className="input" defaultValue="admin@localslocalmarket.com" readOnly />
                    </div>
                    <div className="setting-item">
                        <label>Maintenance Mode</label>
                        <input type="checkbox" />
                    </div>
                </div>

                <div className="settings-section">
                    <h3>Security Settings</h3>
                    <div className="setting-item">
                        <label>Session Timeout (minutes)</label>
                        <input type="number" className="input" defaultValue="30" readOnly />
                    </div>
                    <div className="setting-item">
                        <label>Require Email Verification</label>
                        <input type="checkbox" defaultChecked />
                    </div>
                </div>

                <div className="settings-section">
                    <h3>Notification Settings</h3>
                    <div className="setting-item">
                        <label>Email Notifications</label>
                        <input type="checkbox" defaultChecked />
                    </div>
                    <div className="setting-item">
                        <label>SMS Notifications</label>
                        <input type="checkbox" />
                    </div>
                </div>
            </div>

            <div className="settings-actions">
                <button className="btn btn-primary">Save Settings</button>
                <button className="btn btn-secondary">Reset to Default</button>
            </div>
        </div>
    )
}
