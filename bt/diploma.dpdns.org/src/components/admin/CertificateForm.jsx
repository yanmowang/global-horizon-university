import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const CertificateForm = ({ isEdit = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    userId: '',
    program: '',
    certificateType: 'bachelor',
    status: 'pending',
    issueDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    // 加载用户列表
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await axios.get('/api/admin/users', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUsers(response.data);
      } catch (error) {
        console.error('获取用户列表失败:', error);
        setError('获取用户列表失败');
      }
    };

    // 如果是编辑模式，加载证书详情
    const fetchCertificate = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token');
        const response = await axios.get(`/api/admin/certificates/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setFormData({
          ...response.data,
          issueDate: new Date(response.data.issueDate).toISOString().split('T')[0]
        });
        setLoading(false);
      } catch (error) {
        console.error('获取证书详情失败:', error);
        setError('获取证书详情失败');
        setLoading(false);
      }
    };

    fetchUsers();
    if (isEdit && id) {
      fetchCertificate();
    }
  }, [isEdit, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('auth_token');
      const url = isEdit
        ? `/api/admin/certificates/${id}`
        : '/api/admin/certificates';
      const method = isEdit ? 'put' : 'post';
      
      const response = await axios({
        method,
        url,
        data: formData,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      
      setSuccess(true);
      setLoading(false);
      
      // 提交成功后等待1.5秒后返回列表页
      setTimeout(() => {
        navigate('/admin/certificates');
      }, 1500);
    } catch (error) {
      console.error('保存证书失败:', error);
      setError(error.response?.data?.message || '保存证书失败');
      setLoading(false);
    }
  };

  return (
    <div className="py-6">
      <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {isEdit ? '编辑证书' : '添加新证书'}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {isEdit ? '修改证书信息' : '创建一个新的证书'}
            </p>
          </div>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">证书{isEdit ? '更新' : '创建'}成功！正在返回列表...</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="border-t border-gray-200">
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                {/* 用户选择 */}
                <div className="sm:col-span-3">
                  <label htmlFor="userId" className="block text-sm font-medium text-gray-700">
                    选择用户
                  </label>
                  <div className="mt-1">
                    <select
                      id="userId"
                      name="userId"
                      value={formData.userId}
                      onChange={handleChange}
                      required
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value="">-- 选择用户 --</option>
                      {users.map(user => (
                        <option key={user._id} value={user._id}>
                          {user.name} ({user.email})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 证书类型 */}
                <div className="sm:col-span-3">
                  <label htmlFor="certificateType" className="block text-sm font-medium text-gray-700">
                    证书类型
                  </label>
                  <div className="mt-1">
                    <select
                      id="certificateType"
                      name="certificateType"
                      value={formData.certificateType}
                      onChange={handleChange}
                      required
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value="bachelor">本科学位</option>
                      <option value="master">硕士学位</option>
                      <option value="phd">博士学位</option>
                      <option value="professional">专业证书</option>
                    </select>
                  </div>
                </div>

                {/* 课程名称 */}
                <div className="sm:col-span-6">
                  <label htmlFor="program" className="block text-sm font-medium text-gray-700">
                    课程/项目名称
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="program"
                      id="program"
                      value={formData.program}
                      onChange={handleChange}
                      required
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                {/* 颁发日期 */}
                <div className="sm:col-span-3">
                  <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700">
                    颁发日期
                  </label>
                  <div className="mt-1">
                    <input
                      type="date"
                      name="issueDate"
                      id="issueDate"
                      value={formData.issueDate}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                {/* 状态 */}
                <div className="sm:col-span-3">
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    状态
                  </label>
                  <div className="mt-1">
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value="pending">待处理</option>
                      <option value="issued">已颁发</option>
                      <option value="revoked">已撤销</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => navigate('/admin/certificates')}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                  {loading ? '保存中...' : isEdit ? '更新证书' : '创建证书'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateForm; 