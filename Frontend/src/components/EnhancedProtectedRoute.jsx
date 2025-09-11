import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import UnauthorizedPage from './UnauthorizedPage.jsx';

const EnhancedProtectedRoute = ({ 
  children, 
  requiredRoles = [], 
  fallbackComponent = null,
  redirectTo = '/login',
  showUnauthorizedPage = true 
}) => {
  const { user, token, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-sm text-gray-600">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Check if user is authenticated (derive from token)
  const isAuthenticated = !!token;
  if (!isAuthenticated) {
    // Use custom fallback component if provided
    if (fallbackComponent) {
      return fallbackComponent;
    }

    // Show unauthorized page if enabled
    if (showUnauthorizedPage) {
      return <UnauthorizedPage errorCode={401} />;
    }

    // Redirect to login page
    return (
      <Navigate 
        to={redirectTo} 
        state={{ 
          from: location.pathname,
          message: 'Please log in to access this page.' 
        }} 
        replace 
      />
    );
  }

  // Check if user has required roles
  if (requiredRoles.length > 0) {
    // Normalize roles to support either `role` as string or `roles` as array
    const normalizedRoles = Array.isArray(user?.roles) && user.roles.length > 0
      ? user.roles
      : (user?.role ? [user.role, `ROLE_${user.role}`] : []);
    const hasRequiredRole = requiredRoles.some(role => 
      normalizedRoles.includes(role) || normalizedRoles.includes(`ROLE_${role}`)
    );

    if (!hasRequiredRole) {
      // Use custom fallback component if provided
      if (fallbackComponent) {
        return fallbackComponent;
      }

      // Show unauthorized page if enabled
      if (showUnauthorizedPage) {
        return (
          <UnauthorizedPage 
            errorCode={403} 
            message="You don't have the required permissions to access this page." 
          />
        );
      }

      // Redirect to home page
      return (
        <Navigate 
          to="/" 
          state={{ 
            message: 'You don\'t have permission to access that page.' 
          }} 
          replace 
        />
      );
    }
  }

  // User is authenticated and has required roles (if any)
  return children;
};

// Higher-order component for role-based protection
export const withRoleProtection = (Component, requiredRoles = []) => {
  return (props) => (
    <EnhancedProtectedRoute requiredRoles={requiredRoles}>
      <Component {...props} />
    </EnhancedProtectedRoute>
  );
};

// Higher-order component for authentication protection
export const withAuthProtection = (Component) => {
  return (props) => (
    <EnhancedProtectedRoute>
      <Component {...props} />
    </EnhancedProtectedRoute>
  );
};

export default EnhancedProtectedRoute;
