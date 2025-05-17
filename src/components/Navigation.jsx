import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // 导航链接样式
  const activeClass = 'bg-blue-900 text-white px-3 py-2 rounded-md text-sm font-medium';
  const inactiveClass =
    'text-gray-700 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium';

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <NavLink to="/" className="flex items-center">
                <img className="h-8 w-auto" src="/logo.png" alt="Global Horizon University Logo" />
                <span className="ml-2 font-bold text-xl text-blue-900">GHU</span>
              </NavLink>
            </div>

            {/* 主导航链接 - 桌面视图 */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-2 items-center">
              <NavLink
                to="/dashboard"
                className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
              >
                首页
              </NavLink>

              <NavLink
                to="/courses"
                className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
              >
                课程
              </NavLink>

              <NavLink
                to="/certificates"
                className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
              >
                证书墙
              </NavLink>

              {currentUser && (
                <NavLink
                  to="/dashboard?activeTab=certificates"
                  className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
                >
                  我的证书
                </NavLink>
              )}

              <NavLink
                to="/verify-certificate"
                className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
              >
                证书验证
              </NavLink>

              <NavLink
                to="/about"
                className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
              >
                关于我们
              </NavLink>

              <NavLink
                to="/contact"
                className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
              >
                联系我们
              </NavLink>
            </div>
          </div>

          {/* 右侧用户菜单 */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {currentUser ? (
              <div className="flex items-center space-x-4">
                {currentUser.isAdmin && (
                  <NavLink
                    to="/admin"
                    className="text-blue-800 hover:text-blue-900 font-medium text-sm"
                  >
                    管理面板
                  </NavLink>
                )}

                <div className="relative">
                  <button
                    className="flex items-center space-x-2 bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() => navigate('/profile')}
                  >
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-semibold">
                      {currentUser.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{currentUser.name}</span>
                  </button>
                </div>

                <button
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                >
                  退出
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <NavLink
                  to="/login"
                  className="text-gray-700 hover:text-gray-900 font-medium text-sm"
                >
                  登录
                </NavLink>

                <NavLink
                  to="/register"
                  className="bg-blue-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-800"
                >
                  注册
                </NavLink>
              </div>
            )}
          </div>

          {/* 移动端菜单按钮 */}
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">打开主菜单</span>
              {isMenuOpen ? (
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

      {/* 移动端菜单 */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive
                  ? 'bg-blue-900 text-white block px-3 py-2 rounded-md text-base font-medium'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium'
              }
              onClick={() => setIsMenuOpen(false)}
            >
              首页
            </NavLink>

            <NavLink
              to="/courses"
              className={({ isActive }) =>
                isActive
                  ? 'bg-blue-900 text-white block px-3 py-2 rounded-md text-base font-medium'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium'
              }
              onClick={() => setIsMenuOpen(false)}
            >
              课程
            </NavLink>

            <NavLink
              to="/certificates"
              className={({ isActive }) =>
                isActive
                  ? 'bg-blue-900 text-white block px-3 py-2 rounded-md text-base font-medium'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium'
              }
              onClick={() => setIsMenuOpen(false)}
            >
              证书墙
            </NavLink>

            {currentUser && (
              <NavLink
                to="/dashboard?activeTab=certificates"
                className={({ isActive }) =>
                  isActive
                    ? 'bg-blue-900 text-white block px-3 py-2 rounded-md text-base font-medium'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium'
                }
                onClick={() => setIsMenuOpen(false)}
              >
                我的证书
              </NavLink>
            )}

            <NavLink
              to="/verify-certificate"
              className={({ isActive }) =>
                isActive
                  ? 'bg-blue-900 text-white block px-3 py-2 rounded-md text-base font-medium'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium'
              }
              onClick={() => setIsMenuOpen(false)}
            >
              证书验证
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive
                  ? 'bg-blue-900 text-white block px-3 py-2 rounded-md text-base font-medium'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium'
              }
              onClick={() => setIsMenuOpen(false)}
            >
              关于我们
            </NavLink>

            <NavLink
              to="/contact"
              className={({ isActive }) =>
                isActive
                  ? 'bg-blue-900 text-white block px-3 py-2 rounded-md text-base font-medium'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium'
              }
              onClick={() => setIsMenuOpen(false)}
            >
              联系我们
            </NavLink>
          </div>

          {/* 移动端用户菜单 */}
          <div className="pt-4 pb-3 border-t border-gray-200">
            {currentUser ? (
              <div>
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-semibold text-lg">
                      {currentUser.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">{currentUser.name}</div>
                    <div className="text-sm font-medium text-gray-500">{currentUser.email}</div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <NavLink
                    to="/profile"
                    className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    个人资料
                  </NavLink>

                  {currentUser.isAdmin && (
                    <NavLink
                      to="/admin"
                      className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      管理面板
                    </NavLink>
                  )}

                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  >
                    退出
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-1 px-4">
                <NavLink
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  onClick={() => setIsMenuOpen(false)}
                >
                  登录
                </NavLink>

                <NavLink
                  to="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium bg-blue-900 text-white hover:bg-blue-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  注册
                </NavLink>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
