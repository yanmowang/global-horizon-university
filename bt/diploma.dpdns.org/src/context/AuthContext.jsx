import React, { createContext, useState, useEffect, useCallback } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // 优化的检查登录状态函数
  const checkLoggedIn = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');

      // 如果发现旧的token键，迁移到新的auth_token键
      const oldToken = localStorage.getItem('token');
      if (oldToken && !token) {
        console.log('发现旧令牌格式，正在迁移...');
        localStorage.setItem('auth_token', oldToken);
        localStorage.removeItem('token');
      }

      // 获取最新token
      const currentToken = localStorage.getItem('auth_token');

      if (currentToken) {
        // 尝试从localStorage获取用户信息作为备份
        let cachedUser = null;
        try {
          const userStr = localStorage.getItem('user');
          if (userStr) {
            cachedUser = JSON.parse(userStr);
          }
        } catch (cacheErr) {
          console.error('解析缓存用户数据失败:', cacheErr);
        }

        // 尝试获取用户数据
        try {
          const response = await fetch('/api/auth/me', {
            headers: {
              Authorization: `Bearer ${currentToken}`,
            },
            credentials: 'include',
          });

          if (response.ok) {
            const data = await response.json();

            if (data.success && data.data) {
              // 确保用户数据包含所需字段
              if (!data.data.name && cachedUser && cachedUser.name) {
                data.data.name = cachedUser.name;
              }

              // 更新用户数据
              setCurrentUser(data.data);
              setIsAdmin(data.data.role === 'admin');

              // 更新缓存
              localStorage.setItem('user', JSON.stringify(data.data));
              localStorage.setItem('isAdmin', data.data.role === 'admin' ? 'true' : 'false');
              localStorage.setItem('isLoggedIn', 'true');
            } else {
              // 如果服务器响应成功但没有返回有效数据
              if (cachedUser) {
                // 使用缓存数据作为备用
                setCurrentUser(cachedUser);
                setIsAdmin(cachedUser.role === 'admin');
              } else {
                throw new Error('收到无效的用户数据');
              }
            }
          } else {
            // 如果服务器响应不成功
            if (cachedUser) {
              // 使用缓存数据作为备用
              setCurrentUser(cachedUser);
              setIsAdmin(cachedUser.role === 'admin');
            } else {
              throw new Error('获取用户数据失败');
            }
          }
        } catch (fetchErr) {
          console.error('获取用户数据时出错:', fetchErr);

          // 如果API请求失败但有缓存数据
          if (cachedUser) {
            setCurrentUser(cachedUser);
            setIsAdmin(cachedUser.role === 'admin');
          } else {
            // 完全失败的情况下清除所有数据
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            localStorage.removeItem('isAdmin');
            localStorage.removeItem('isLoggedIn');
            setCurrentUser(null);
            setIsAdmin(false);
          }
        }
      } else {
        // 没有token的情况
        setCurrentUser(null);
        setIsAdmin(false);
      }
    } catch (err) {
      console.error('认证检查错误:', err);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('isLoggedIn');
      setCurrentUser(null);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // 初始化时检查登录状态
  useEffect(() => {
    checkLoggedIn();
  }, [checkLoggedIn]);

  // 登录函数
  const login = async (email, password) => {
    setAuthError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '登录失败');
      }

      // 确保数据中包含所需字段
      if (data.data && !data.data.name) {
        data.data.name = email.split('@')[0]; // 使用邮箱前缀作为默认名称
      }

      // 保存令牌到localStorage
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user', JSON.stringify(data.data));
      localStorage.setItem('isAdmin', data.data.role === 'admin' ? 'true' : 'false');
      localStorage.setItem('isLoggedIn', 'true');

      // 设置当前用户
      setCurrentUser(data.data);
      setIsAdmin(data.data.role === 'admin');

      // 直接重定向到适当的页面
      const isUserAdmin = data.data.role === 'admin';
      const redirectPath = isUserAdmin ? '/admin' : '/user-dashboard';
      window.location.href = redirectPath;

      return data;
    } catch (err) {
      console.error('登录错误:', err);
      setAuthError(err.message);
      throw err;
    }
  };

  // 注册函数
  const register = async (name, email, password) => {
    setAuthError(null);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '注册失败');
      }

      // 保存令牌到localStorage
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user', JSON.stringify(data.data));
      localStorage.setItem('isAdmin', data.data.role === 'admin' ? 'true' : 'false');
      localStorage.setItem('isLoggedIn', 'true');

      // 设置当前用户
      setCurrentUser(data.data);
      setIsAdmin(data.data.role === 'admin');

      return data;
    } catch (err) {
      console.error('注册错误:', err);
      setAuthError(err.message);
      throw err;
    }
  };

  // 登出函数
  const logout = () => {
    // 清除localStorage中的令牌
    localStorage.removeItem('auth_token');
    localStorage.removeItem('token'); // 清除可能存在的旧格式令牌
    localStorage.removeItem('user');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('isLoggedIn');

    // 清除当前用户
    setCurrentUser(null);
    setIsAdmin(false);
    
    // 刷新页面以确保所有状态重置
    window.location.href = '/';
  };

  // 更新用户数据
  const updateCurrentUser = userData => {
    // 更新状态中的用户数据
    setCurrentUser(userData);
    setIsAdmin(userData.role === 'admin');
    
    // 同步更新localStorage中的用户信息
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('isAdmin', userData.role === 'admin' ? 'true' : 'false');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin,
        loading,
        authError,
        login,
        register,
        logout,
        updateCurrentUser,
        refreshAuth: checkLoggedIn,
        isAuthenticated: !!currentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
