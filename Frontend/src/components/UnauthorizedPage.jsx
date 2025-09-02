import React from 'react';
import { useNavigate } from 'react-router-dom';

const UnauthorizedPage = ({ errorCode = 403, message = null }) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const getErrorDetails = () => {
    switch (errorCode) {
      case 401:
        return {
          title: 'Unauthorized Access',
          subtitle: 'Authentication Required',
          description: 'You need to be logged in to access this page.',
          icon: (
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          ),
          bgColor: 'bg-red-100',
          textColor: 'text-red-600',
          primaryAction: 'Login',
          primaryActionHandler: handleLogin
        };
      case 403:
        return {
          title: 'Access Forbidden',
          subtitle: 'Insufficient Permissions',
          description: 'You don\'t have permission to access this resource.',
          icon: (
            <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
            </svg>
          ),
          bgColor: 'bg-orange-100',
          textColor: 'text-orange-600',
          primaryAction: 'Go Home',
          primaryActionHandler: handleGoHome
        };
      default:
        return {
          title: 'Access Denied',
          subtitle: 'Permission Error',
          description: 'You don\'t have the necessary permissions to access this page.',
          icon: (
            <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          ),
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-600',
          primaryAction: 'Go Home',
          primaryActionHandler: handleGoHome
        };
    }
  };

  const errorDetails = getErrorDetails();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${errorDetails.bgColor}`}>
              {errorDetails.icon}
            </div>
            <h1 className="mt-6 text-4xl font-extrabold text-gray-900">
              {errorCode}
            </h1>
            <h2 className="mt-2 text-2xl font-bold text-gray-900">
              {errorDetails.title}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {message || errorDetails.description}
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h3 className="text-sm font-medium text-blue-800">What you can do:</h3>
              <ul className="mt-2 text-sm text-blue-700 space-y-1">
                {errorCode === 401 && (
                  <>
                    <li>• Log in to your account</li>
                    <li>• Create a new account if you don't have one</li>
                    <li>• Contact support if you're having trouble logging in</li>
                  </>
                )}
                {errorCode === 403 && (
                  <>
                    <li>• Contact an administrator for access</li>
                    <li>• Check if you're using the correct account</li>
                    <li>• Return to the homepage to browse public content</li>
                  </>
                )}
                <li>• Go back to the previous page</li>
                <li>• Return to the homepage</li>
              </ul>
            </div>

            <div className="space-y-3">
              <button
                onClick={errorDetails.primaryActionHandler}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {errorDetails.primaryAction}
              </button>
              
              <button
                onClick={handleGoBack}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Go Back
              </button>
              
              <button
                onClick={handleGoHome}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Go to Homepage
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
