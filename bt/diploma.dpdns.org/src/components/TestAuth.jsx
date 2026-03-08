import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

function TestAuth() {
  const { currentUser, isAuthenticated, loading, refreshAuth } = useAuth();
  const [localStorageData, setLocalStorageData] = useState({
    auth_token: null,
    token: null,
    user: null,
    isAdmin: null,
    isLoggedIn: null
  });
  const [tokenValid, setTokenValid] = useState(null);
  const [checkingToken, setCheckingToken] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const refreshLocalStorageData = () => {
    setLocalStorageData({
      auth_token: localStorage.getItem('auth_token'),
      token: localStorage.getItem('token'),
      user: localStorage.getItem('user'),
      isAdmin: localStorage.getItem('isAdmin'),
      isLoggedIn: localStorage.getItem('isLoggedIn')
    });
  };

  useEffect(() => {
    refreshLocalStorageData();
  }, []);

  const checkTokenValidity = async () => {
    setCheckingToken(true);
    setStatusMessage('正在检查令牌有效性...');
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setTokenValid(false);
        setStatusMessage('没有找到认证令牌');
        return;
      }

      const response = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTokenValid(true);
        setStatusMessage('令牌有效，API调用成功');
      } else {
        setTokenValid(false);
        setStatusMessage(`令牌无效，API返回状态码: ${response.status}`);
      }
    } catch (error) {
      setTokenValid(false);
      setStatusMessage(`检查令牌时出错: ${error.message}`);
    } finally {
      setCheckingToken(false);
    }
  };

  const fixTokenIssues = () => {
    // 尝试修复可能的令牌问题
    try {
      // 1. 检查是否有旧格式的token
      const oldToken = localStorage.getItem('token');
      const currentToken = localStorage.getItem('auth_token');
      
      if (oldToken && !currentToken) {
        localStorage.setItem('auth_token', oldToken);
        localStorage.removeItem('token');
        setStatusMessage('已将旧令牌格式迁移到新格式');
      }

      // 2. 确保用户数据与令牌保持一致
      const userStr = localStorage.getItem('user');
      if (currentToken && !userStr) {
        setStatusMessage('存在令牌但缺少用户数据，建议重新登录');
      }

      // 3. 确保isAdmin标志正确设置
      if (userStr) {
        try {
          const userData = JSON.parse(userStr);
          const correctIsAdmin = userData.role === 'admin' ? 'true' : 'false';
          if (localStorage.getItem('isAdmin') !== correctIsAdmin) {
            localStorage.setItem('isAdmin', correctIsAdmin);
            setStatusMessage('已修复管理员状态标志');
          }
        } catch (e) {
          console.error('解析用户数据出错:', e);
        }
      }

      // 4. 设置isLoggedIn标志
      if (currentToken && !localStorage.getItem('isLoggedIn')) {
        localStorage.setItem('isLoggedIn', 'true');
        setStatusMessage('已设置登录状态标志');
      }

      refreshLocalStorageData();
    } catch (error) {
      setStatusMessage(`修复过程出错: ${error.message}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">认证测试页面</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">认证状态</h2>
        {loading ? (
          <p>加载中...</p>
        ) : (
          <div className="bg-gray-100 p-4 rounded">
            <p><strong>已认证:</strong> {isAuthenticated ? '是' : '否'}</p>
            <p><strong>当前用户:</strong> {currentUser ? JSON.stringify(currentUser) : '未登录'}</p>
          </div>
        )}
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">localStorage 数据</h2>
        <div className="bg-gray-100 p-4 rounded mb-2">
          <p><strong>auth_token:</strong> {localStorageData.auth_token ? '存在' : '不存在'}</p>
          {localStorageData.auth_token && (
            <p className="text-xs text-gray-600 break-all">{localStorageData.auth_token.substring(0, 20)}...</p>
          )}
          
          <p><strong>token (旧格式):</strong> {localStorageData.token ? '存在' : '不存在'}</p>
          {localStorageData.token && (
            <p className="text-xs text-gray-600 break-all">{localStorageData.token.substring(0, 20)}...</p>
          )}
          
          <p><strong>user:</strong> {localStorageData.user ? '存在' : '不存在'}</p>
          {localStorageData.user && (
            <p className="text-xs text-gray-600 break-all">{localStorageData.user}</p>
          )}
          
          <p><strong>isAdmin:</strong> {localStorageData.isAdmin}</p>
          <p><strong>isLoggedIn:</strong> {localStorageData.isLoggedIn}</p>
        </div>
        
        <p className="text-sm font-medium mb-2">令牌状态: {
          tokenValid === null ? '未检查' : 
          tokenValid ? '有效' : '无效'
        }</p>
        {statusMessage && (
          <p className={`text-sm ${tokenValid ? 'text-green-600' : 'text-amber-600'} mb-2`}>
            {statusMessage}
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          刷新页面
        </button>
        <button 
          onClick={refreshAuth} 
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          刷新认证状态
        </button>
        <button 
          onClick={checkTokenValidity} 
          disabled={checkingToken}
          className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 disabled:bg-gray-400"
        >
          {checkingToken ? '检查中...' : '检查令牌有效性'}
        </button>
        <button 
          onClick={fixTokenIssues} 
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          修复令牌问题
        </button>
        <button 
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            localStorage.removeItem('isAdmin');
            localStorage.removeItem('isLoggedIn');
            refreshLocalStorageData();
            setStatusMessage('已清除所有认证数据');
          }} 
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          清除所有令牌
        </button>
      </div>
    </div>
  );
}

export default TestAuth; 