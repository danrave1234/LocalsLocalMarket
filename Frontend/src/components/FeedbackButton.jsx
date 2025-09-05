import React from 'react';

const FeedbackButton = ({ 
  variant = 'default', 
  size = 'md', 
  className = '',
  children,
  showIcon = true,
  onClick
}) => {

  const getButtonClasses = () => {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200';
    
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base'
    };

    const variantClasses = {
      default: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      outline: 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-blue-500',
      ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500',
      floating: 'fixed bottom-6 right-6 bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-lg rounded-full p-3 z-40'
    };

    return `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;
  };

  const renderIcon = () => {
    if (!showIcon) return null;
    
    return (
      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    );
  };

  return (
    <button
      onClick={onClick}
      className={getButtonClasses()}
      aria-label="Send feedback"
    >
      {renderIcon()}
      {children || 'Feedback'}
    </button>
  );
};

export default FeedbackButton;
