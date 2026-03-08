import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, currentUser, logout } = useAuth();
  const location = useLocation();
  const { t } = useTranslation();

  // 检查用户是否为管理员
  const isAdmin = currentUser && currentUser.role === 'admin';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    // Close mobile menu when location changes
    setMobileMenuOpen(false);
  }, [location]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-white ${scrolled ? 'shadow-md' : ''} transition-all duration-300`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img
                className="h-10 w-auto"
                src="/images/logo/logo.svg"
                alt="Stratford International University"
              />
              <span className="ml-3 text-lg font-bold text-blue-800 hidden md:block">
                {t('header.universityChinese')}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:ml-6 md:flex md:space-x-6 md:items-center">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-blue-500'
              }
              end
            >
              {t('header.home')}
            </NavLink>
            <NavLink
              to="/courses"
              className={({ isActive }) =>
                isActive ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-blue-500'
              }
            >
              {t('header.courses')}
            </NavLink>
            <NavLink
              to="/verify-certificate"
              className={({ isActive }) =>
                isActive ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-blue-500'
              }
            >
              {t('header.verifyCertificate')}
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-blue-500'
              }
            >
              {t('header.about')}
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                isActive ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-blue-500'
              }
            >
              {t('header.contact')}
            </NavLink>

            {/* 语言切换器 */}
            <div className="ml-4">
              <LanguageSwitcher />
            </div>

            {isAuthenticated ? (
              <div className="ml-4 flex items-center space-x-3">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  {t('header.dashboard')}
                </Link>
                <button
                  onClick={logout}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  {t('header.logout')}
                </button>
              </div>
            ) : (
              <div className="ml-4 flex items-center space-x-3">
                <Link
                  to="/login"
                  className="inline-flex items-center px-3 py-1.5 border border-blue-500 text-sm font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100"
                  style={{ color: '#003087 !important', backgroundColor: '#eaf5ff !important' }}
                >
                  {t('header.login')}
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  style={{ color: 'white !important', backgroundColor: '#003087 !important' }}
                >
                  {t('header.register')}
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            {/* 移动端语言切换器 */}
            <div className="mr-2">
              <LanguageSwitcher />
            </div>

            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
              onClick={toggleMobileMenu}
            >
              <span className="sr-only">打开主菜单</span>
              {mobileMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden bg-white`}>
        <div className="pt-2 pb-3 space-y-1">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? 'block pl-3 pr-4 py-2 border-l-4 border-blue-500 text-base font-medium text-blue-700 bg-blue-50'
                : 'block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
            }
            end
          >
            {t('header.home')}
          </NavLink>
          <NavLink
            to="/courses"
            className={({ isActive }) =>
              isActive
                ? 'block pl-3 pr-4 py-2 border-l-4 border-blue-500 text-base font-medium text-blue-700 bg-blue-50'
                : 'block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
            }
          >
            {t('header.courses')}
          </NavLink>
          <NavLink
            to="/verify-certificate"
            className={({ isActive }) =>
              isActive
                ? 'block pl-3 pr-4 py-2 border-l-4 border-blue-500 text-base font-medium text-blue-700 bg-blue-50'
                : 'block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
            }
          >
            {t('header.verifyCertificate')}
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive
                ? 'block pl-3 pr-4 py-2 border-l-4 border-blue-500 text-base font-medium text-blue-700 bg-blue-50'
                : 'block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
            }
          >
            {t('header.about')}
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive
                ? 'block pl-3 pr-4 py-2 border-l-4 border-blue-500 text-base font-medium text-blue-700 bg-blue-50'
                : 'block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
            }
          >
            {t('header.contact')}
          </NavLink>
        </div>
        <div className="pt-4 pb-3 border-t border-gray-200">
          {isAuthenticated ? (
            <div className="space-y-1">
              <Link
                to="/dashboard"
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-800 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                style={{ color: '#111827 !important' }}
              >
                {t('header.dashboard')}
              </Link>
              <button
                onClick={logout}
                className="w-full text-left block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-800 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                style={{ color: '#111827 !important' }}
              >
                {t('header.logout')}
              </button>
            </div>
          ) : (
            <div className="space-y-3 px-4 py-2">
              <Link
                to="/login"
                className="block py-2 px-4 text-center border border-blue-500 rounded-md text-base font-medium text-blue-700 bg-blue-50 hover:bg-blue-100"
                style={{ color: '#003087 !important', backgroundColor: '#eaf5ff !important' }}
              >
                {t('header.login')}
              </Link>
              <Link
                to="/register"
                className="block py-2 px-4 text-center border border-transparent rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
                style={{ color: 'white !important', backgroundColor: '#003087 !important' }}
              >
                {t('header.register')}
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* 用户登录状态菜单 */}
      <div className="hidden md:flex items-center ml-4">
        {isAuthenticated ? (
          <div className="relative group">
            <button
              className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 focus:outline-none"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              <span>{currentUser.name || t('header.account')}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                <Link
                  to="/user-dashboard"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setUserMenuOpen(false)}
                >
                  {t('header.dashboard')}
                </Link>
                
                {/* 仅对管理员显示管理员链接 */}
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    {t('header.adminPanel')}
                  </Link>
                )}
                
                <button
                  onClick={() => {
                    logout();
                    setUserMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  {t('header.logout')}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex space-x-2">
            <Link
              to="/login"
              className="py-2 px-3 text-sm font-medium rounded text-blue-600 hover:text-blue-700"
            >
              {t('header.login')}
            </Link>
            <Link
              to="/register"
              className="py-2 px-3 text-sm font-medium rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              {t('header.register')}
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
