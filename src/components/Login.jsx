import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // 检查是否有从其他页面跳转时带来的消息（如注册成功）
  useState(() => {
    if (location.state?.message) {
      setTimeout(() => {
        alert(location.state.message);
      }, 100);
    }
  }, [location.state]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = t('login.errors.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('login.errors.emailInvalid');
    }

    if (!formData.password) {
      newErrors.password = t('login.errors.passwordRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 重置错误
    setLoginError(null);
    setErrors({});

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    try {
      // 首先检查服务器是否在线
      try {
        const healthCheck = await fetch('/api/health', { 
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (!healthCheck.ok) {
          throw new Error(t('login.errors.serverOffline'));
        }
      } catch (healthError) {
        console.error('服务器连接错误:', healthError);
        throw new Error(t('login.errors.serverOffline') || 'Server is currently unavailable. Please try again later.');
      }

      // 尝试登录
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      // 处理非JSON格式的响应
      let data;
      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        try {
          data = await response.json();
        } catch (jsonError) {
          console.error('JSON解析错误:', jsonError);
          throw new Error(t('login.errors.serverError'));
        }
      } else {
        // 处理非JSON响应，如纯文本
        const textResponse = await response.text();
        console.log('服务器返回非JSON响应:', textResponse);

        // 使用响应文本作为错误消息，如果为空则使用默认消息
        throw new Error(t('login.errors.serverOffline') || 'Server is currently unavailable. Please try again later.');
      }

      if (!response.ok) {
        throw new Error(data?.message || t('login.errors.invalidCredentials'));
      }

      // 登录成功，保存用户信息和token
      localStorage.setItem('auth_token', data.token);
      
      // 移除旧格式的token（如果存在）
      if (localStorage.getItem('token')) {
        localStorage.removeItem('token');
      }
      
      console.log('Login successful, storing user data:', data.data);
      
      // 确保data.data不为空
      if (!data.data) {
        console.error('No user data received in login response');
        throw new Error('Login successful but no user data received');
      }
      
      localStorage.setItem('user', JSON.stringify(data.data));
      localStorage.setItem('isLoggedIn', 'true');
      
      // 确保角色存在
      const isAdmin = data.data && data.data.role === 'admin';
      localStorage.setItem('isAdmin', isAdmin ? 'true' : 'false');
      
      console.log('Redirecting to dashboard as:', isAdmin ? 'admin' : 'regular user');
      
      // 使用简化的重定向逻辑
      const targetUrl = isAdmin ? '/admin' : '/user-dashboard';
      window.location.href = targetUrl;
    } catch (error) {
      setLoginError(error.message || t('login.errors.loginFailed'));
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-md">
        <div className="text-center">
          <Link to="/">
            <img
              className="mx-auto h-16 w-auto"
              src="/images/logo/logo.svg"
              alt="Stratford International University"
            />
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">{t('login.title')}</h2>
          <p className="mt-2 text-sm text-gray-600">
            {t('login.orRegister')}{' '}
            <Link to="/register" className="font-medium text-[#003087] hover:text-blue-800">
              {t('login.registerLink')}
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {loginError && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{loginError}</p>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                {t('login.emailLabel')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-[#003087] focus:border-[#003087] focus:z-10 sm:text-sm`}
                placeholder={t('login.emailPlaceholder')}
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                {t('login.passwordLabel')}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-[#003087] focus:border-[#003087] focus:z-10 sm:text-sm`}
                placeholder={t('login.passwordPlaceholder')}
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                className="h-4 w-4 text-[#003087] focus:ring-[#003087] border-gray-300 rounded"
                checked={formData.remember}
                onChange={handleChange}
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-gray-900">
                {t('login.rememberMe')}
              </label>
            </div>

            <div className="text-sm">
              <Link
                to="/forgot-password"
                className="font-medium text-[#003087] hover:text-blue-800"
              >
                {t('login.forgotPassword')}
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#003087] hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#003087]"
            >
              {isLoading ? (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
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
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : null}
              {isLoading ? t('login.signingIn') : t('login.signIn')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
