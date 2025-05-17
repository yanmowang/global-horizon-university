import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const UnauthorizedPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="max-w-lg w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-red-500 text-5xl mb-4">
          <i className="fas fa-exclamation-circle"></i>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          {t('unauthorized.title')}
        </h1>
        <p className="text-gray-600 mb-6">
          {t('unauthorized.message')}
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            {t('unauthorized.goHome')}
          </Link>
          <Link
            to="/login"
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
          >
            {t('unauthorized.login')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage; 