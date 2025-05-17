import React from 'react';

const LoadingSpinner = ({ message = 'Loading...', size = 'medium' }) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return {
          container: 'h-8 w-8',
          svg: 'h-8 w-8',
        };
      case 'large':
        return {
          container: 'h-16 w-16',
          svg: 'h-16 w-16',
        };
      case 'medium':
      default:
        return {
          container: 'h-12 w-12',
          svg: 'h-12 w-12',
        };
    }
  };

  const sizeClasses = getSizeClasses();

  return (
    <div className="flex flex-col items-center justify-center py-6">
      <div className={`${sizeClasses.container} animate-spin`}>
        <svg
          className={`${sizeClasses.svg} text-gray-200`}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="#003087"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
      {message && <p className="mt-4 text-sm text-gray-600 text-center">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
