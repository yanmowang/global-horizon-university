import React, { useState, useEffect, useRef } from 'react';
import { Pagination, Tooltip, Modal, Button } from 'antd';
import CertificateGenerator from '../../services/CertificateGenerator';

const CertificatesList = ({ certificates }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCertificates, setSelectedCertificates] = useState([]);
  const [filteredCertificates, setFilteredCertificates] = useState([]);
  
  // 添加一个引用来跟踪组件是否已卸载
  const isMounted = useRef(true);

  // 确保在组件卸载后不更新状态
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // 处理搜索和过滤
  useEffect(() => {
    if (!isMounted.current) return;
    
    if (!certificates || certificates.length === 0) {
      setFilteredCertificates([]);
      return;
    }
    
    // 防止在组件卸载后更新状态
    const filtered = certificates.filter(cert => {
      // Status filter
      if (statusFilter !== 'all' && cert.status !== statusFilter) {
        return false;
      }

      // Search term
      if (!searchTerm) return true;
      
      const searchTermLower = searchTerm.toLowerCase();
      
      // 添加null/undefined检查
      const recipientName = cert.recipientName || '';
      const certificateNumber = cert.certificateNumber || '';
      const program = cert.program || '';
      
      return (
        recipientName.toLowerCase().includes(searchTermLower) ||
        certificateNumber.toLowerCase().includes(searchTermLower) ||
        program.toLowerCase().includes(searchTermLower)
      );
    });
    
    if (isMounted.current) {
      setFilteredCertificates(filtered);
    }
  }, [certificates, searchTerm, statusFilter]);

  // Handle search input change
  const handleSearchChange = e => {
    if (isMounted.current) {
      setSearchTerm(e.target.value);
    }
  };

  // Handle status filter change
  const handleStatusFilterChange = e => {
    if (isMounted.current) {
      setStatusFilter(e.target.value);
    }
  };

  // Handle certificate selection
  const handleSelectCertificate = id => {
    if (!isMounted.current) return;
    
    setSelectedCertificates(prev => {
      if (prev.includes(id)) {
        return prev.filter(certId => certId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Handle "Select All" checkbox
  const handleSelectAll = () => {
    if (!isMounted.current) return;
    
    if (selectedCertificates.length === filteredCertificates.length) {
      setSelectedCertificates([]);
    } else {
      setSelectedCertificates(filteredCertificates.map(cert => cert._id));
    }
  };

  // Handle certificate deletion
  const handleDeleteCertificate = (id) => {
    if (!isMounted.current) return;
    
    if (window.confirm('确定要删除此证书吗？')) {
      console.log('删除证书:', id);
      
      // 使用API删除证书
      const token = localStorage.getItem('auth_token');
      fetch(`/api/admin/certificates/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        if (!response.ok) throw new Error('删除证书失败');
        return response.json();
      })
      .then(data => {
        alert('证书删除成功');
        // 通知父组件刷新证书列表
        window.location.reload();
      })
      .catch(error => {
        console.error('删除证书错误:', error);
        alert('删除证书失败: ' + error.message);
      });
    }
  };

  // 处理查看证书
  const handleViewCertificate = (certificate) => {
    console.log('查看证书:', certificate);
    // 可以打开一个模态框或导航到证书详情页面
    window.open(`/verify/${certificate.certificateNumber}`, '_blank');
  };
  
  // 处理下载证书
  const handleDownloadCertificate = async (certificate) => {
    console.log('下载证书 (Admin - New Method):', certificate);
    
    // Prepare certificate data for the frontend generator
    // It expects 'name', 'course', 'date', 'certificateId'
    const certDataForFrontend = {
      ...certificate,
      name: certificate.recipientName || certificate.name || 'N/A', // Ensure name field
      course: certificate.program || certificate.courseName || 'N/A', // Ensure course field
      date: certificate.issueDate, // Assumes issueDate is available and is what getCertificateSVG's 'date' expects
      certificateId: certificate.certificateNumber || certificate.certificateId // Ensure certificateId field
    };

    try {
      const success = await CertificateGenerator.downloadCertificate(certDataForFrontend);
      if (success) {
        // Optionally, show a success message to the admin
        alert('证书已开始下载。'); 
      } else {
        // downloadCertificate itself shows an alert on failure.
        // alert('下载证书失败，请重试。'); 
      }
    } catch (error) {
      console.error('下载证书错误 (Admin - New Method):', error);
      alert('下载证书时发生错误，请查看控制台。');
    }
  };
  
  // 处理添加新证书
  const handleAddNewCertificate = () => {
    console.log('添加新证书');
    window.location.href = '/admin/certificates/new';
  };

  // 处理批量删除证书
  const handleDeleteSelected = (selectedIds) => {
    if (!isMounted.current) return;
    
    if (
      window.confirm(`确定要删除这 ${selectedIds.length} 个证书吗？`)
    ) {
      console.log('批量删除证书:', selectedIds);
      
      // 这里可以实现批量删除API调用
      // 为简单起见，我们这里循环删除
      const token = localStorage.getItem('auth_token');
      
      Promise.all(
        selectedIds.map(id => 
          fetch(`/api/admin/certificates/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }).then(response => {
            if (!response.ok) throw new Error(`删除证书 ${id} 失败`);
            return response.json();
          })
        )
      )
      .then(() => {
        if (isMounted.current) {
          alert(`已成功删除 ${selectedIds.length} 个证书`);
          setSelectedCertificates([]);
          window.location.reload();
        }
      })
      .catch(error => {
        console.error('批量删除证书失败:', error);
        alert('批量删除证书失败: ' + error.message);
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {/* Toolbar */}
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div className="flex items-center">
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-12 py-2 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Search certificates"
                />
              </div>

              <div className="ml-4">
                <select
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="all">All Status</option>
                  <option value="issued">Issued</option>
                  <option value="pending">Pending</option>
                  <option value="revoked">Revoked</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-2">
              {selectedCertificates.length > 0 && (
                <button
                  onClick={() => handleDeleteSelected(selectedCertificates)}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <svg
                    className="-ml-0.5 mr-2 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Delete Selected
                </button>
              )}

              <button
                onClick={handleAddNewCertificate}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg
                  className="-ml-0.5 mr-2 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Generate New
              </button>
            </div>
          </div>

          {/* Certificates Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        checked={
                          selectedCertificates.length === filteredCertificates.length &&
                          filteredCertificates.length > 0
                        }
                        onChange={handleSelectAll}
                      />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Certificate ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Program
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCertificates.length > 0 ? (
                  filteredCertificates.map(certificate => (
                    <tr key={certificate._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            checked={selectedCertificates.includes(certificate._id)}
                            onChange={() => handleSelectCertificate(certificate._id)}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                           {certificate.certificateNumber || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{certificate.recipientName || '未命名'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{certificate.program || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {certificate.issueDate 
                            ? new Date(certificate.issueDate).toLocaleDateString() 
                            : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            certificate.status === 'issued'
                              ? 'bg-green-100 text-green-800'
                              : certificate.status === 'revoked'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {certificate.status ? certificate.status.charAt(0).toUpperCase() + certificate.status.slice(1) : 'Unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewCertificate(certificate)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleDownloadCertificate(certificate)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Download
                          </button>
                          <button
                            onClick={() => handleDeleteCertificate(certificate._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                      No certificates found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Previous
              </button>
              <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to{' '}
                  <span className="font-medium">{filteredCertificates.length}</span> of{' '}
                  <span className="font-medium">{certificates.length}</span> certificates
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="sr-only">Previous</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    1
                  </button>
                  <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="sr-only">Next</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificatesList;
