import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext.jsx'
import { SkeletonPage } from '../components/Skeleton.jsx'

export default function ProtectedRoute({ children }) {
  const { token, isLoading } = useAuth()
  const location = useLocation()

  // Show loading while checking authentication
  if (isLoading) {
    return <SkeletonPage />
  }

  // Redirect to login if not authenticated
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}


