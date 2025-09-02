import { useAuth } from '../auth/AuthContext.jsx'
import AdminCategoryManager from '../components/AdminCategoryManager.jsx'
import SEOHead from '../components/SEOHead.jsx'
import '../components/AdminCategoryManager.css'

export default function AdminCategoryPage() {
    const { user } = useAuth()

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

    return (
        <>
            <SEOHead 
                title="Category Management - Admin"
                description="Manage categories for the local marketplace"
            />
            <main className="container">
                <AdminCategoryManager />
            </main>
        </>
    )
}
