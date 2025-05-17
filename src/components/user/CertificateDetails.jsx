import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import LoadingSpinner from '../shared/LoadingSpinner';
import AlertMessage from '../shared/AlertMessage';

const CertificateDetails = () => {
  const { id } = useParams();

  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerUrl, setViewerUrl] = useState('');

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('auth_token');
        if (!token) {
          throw new Error('Authentication required');
        }

        const response = await fetch(`/api/certificates/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch certificate');
        }

        setCertificate(data.data);
      } catch (err) {
        console.error('Error fetching certificate:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCertificate();
    }
  }, [id]);

  const formatDate = dateString => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusBadgeClass = status => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'issued':
        return 'bg-green-100 text-green-800';
      case 'revoked':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const [downloadTriggered, setDownloadTriggered] = useState(false);
  const [downloadIframe, setDownloadIframe] = useState(null);
  const [downloadStatus, setDownloadStatus] = useState({ loading: false, error: null });
  const [downloadFallbackAttempted, setDownloadFallbackAttempted] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // 显示下载成功消息
  const showSuccessMessage = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 5000);
  };

  // 从base64数据创建并下载PDF
  const downloadFromBase64 = (base64Data, filename) => {
    try {
      const binary = atob(base64Data);
      const len = binary.length;
      const buffer = new ArrayBuffer(len);
      const view = new Uint8Array(buffer);

      for (let i = 0; i < len; i++) {
        view[i] = binary.charCodeAt(i);
      }

      const blob = new Blob([buffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();

      setTimeout(() => {
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 1000);

      return true;
    } catch (error) {
      console.error('Base64 download error:', error);
      return false;
    }
  };

  // 在线查看证书
  const viewCertificate = () => {
    try {
      if (!certificate || !certificate._id) {
        throw new Error('证书信息不完整');
      }

      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('需要登录才能查看证书');
      }

      // 构建查看URL
      const viewUrl = `/api/certificates/${certificate._id}/view?token=${encodeURIComponent(token)}`;

      // 打开证书查看器
      setViewerUrl(viewUrl);
      setViewerOpen(true);
    } catch (err) {
      console.error('证书查看错误:', err);
      setError(`无法查看证书: ${err.message}`);
    }
  };

  // 关闭证书查看器
  const closeViewer = () => {
    setViewerOpen(false);
    setViewerUrl('');
  };

  // Base64备用下载方法
  const downloadCertificateBase64 = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`/api/certificates/${id}/download-base64`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to get certificate data');
      }

      const { base64Data, filename } = result.data;
      return downloadFromBase64(base64Data, filename);
    } catch (error) {
      console.error('Base64 download method failed:', error);
      return false;
    }
  };

  const downloadCertificate = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('Authentication required');
      }

      setDownloadStatus({ loading: true, error: null });
      setDownloadFallbackAttempted(false);

      // 方法1: 创建一个隐藏的iframe来触发下载
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = `/api/certificates/${id}/download?token=${token}&t=${Date.now()}`;
      document.body.appendChild(iframe);
      setDownloadIframe(iframe);

      // 显示下载中提示消息
      const downloadMessage = document.createElement('div');
      downloadMessage.innerText = '证书下载中，请稍候...';
      downloadMessage.style.position = 'fixed';
      downloadMessage.style.bottom = '20px';
      downloadMessage.style.right = '20px';
      downloadMessage.style.padding = '10px 15px';
      downloadMessage.style.backgroundColor = '#4299e1';
      downloadMessage.style.color = 'white';
      downloadMessage.style.borderRadius = '4px';
      downloadMessage.style.zIndex = '9999';
      document.body.appendChild(downloadMessage);

      // 方法2: 同时使用直接链接方式作为备份
      setTimeout(async () => {
        // 如果iframe方法在3秒内没有触发下载，尝试直接链接方法
        const directLink = document.createElement('a');
        directLink.href = `/api/certificates/${id}/download?token=${token}&t=${Date.now()}`;
        directLink.download = `certificate-${id}.pdf`;
        directLink.style.display = 'none';
        document.body.appendChild(directLink);
        directLink.click();

        setTimeout(() => {
          if (directLink.parentNode) {
            directLink.parentNode.removeChild(directLink);
          }
        }, 1000);

        // 设置标志以便5秒后检查是否需要尝试base64方法
        setDownloadFallbackAttempted(true);
      }, 3000);

      // 5秒后清理资源，更新状态，如果前两种方法都失败，尝试base64方法
      setTimeout(async () => {
        if (iframe && iframe.parentNode) {
          iframe.parentNode.removeChild(iframe);
          setDownloadIframe(null);
        }

        // 移除下载消息
        if (downloadMessage && downloadMessage.parentNode) {
          downloadMessage.parentNode.removeChild(downloadMessage);
        }

        // 显示下载成功消息
        showSuccessMessage();

        // 如果用户已经确认前两种方法都失败，尝试base64方法
        if (downloadFallbackAttempted && downloadStatus.error) {
          console.log('尝试base64下载方法...');
          const success = await downloadCertificateBase64();
          if (success) {
            setDownloadStatus({ loading: false, error: null });
          } else {
            setDownloadStatus({ loading: false, error: '所有下载方法都失败。请联系支持。' });
          }
        } else {
          setDownloadStatus({ loading: false, error: null });
        }
      }, 8000);
    } catch (error) {
      console.error('Error downloading certificate:', error);
      setDownloadStatus({ loading: false, error: error.message });

      // 尝试base64方法作为最后的尝试
      try {
        const success = await downloadCertificateBase64();
        if (success) {
          setDownloadStatus({ loading: false, error: null });
        } else {
          setError(`Failed to download certificate: ${error.message}`);
        }
      } catch (base64Error) {
        setError(`Failed to download certificate: ${error.message}`);
      }
    }
  };

  const verifyUrl = `${window.location.origin}/verify-certificate?id=${id}`;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <LoadingSpinner message="Loading certificate details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <AlertMessage type="error" message="Failed to load certificate details" details={error} />
        <div className="mt-4">
          <Link
            to="/certificates"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Back to Certificates
          </Link>
        </div>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <AlertMessage type="error" message="Certificate not found" />
        <div className="mt-4">
          <Link
            to="/certificates"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Back to Certificates
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Certificate Details
          </h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link
            to="/certificates"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Back to List
          </Link>

          {certificate.status === 'issued' && (
            <>
              <Link
                to="#"
                onClick={downloadCertificate}
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={downloadStatus.loading}
              >
                {downloadStatus.loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                    下载中...
                  </>
                ) : (
                  '下载证书'
                )}
              </Link>
              {downloadStatus.error && (
                <div className="mt-2 text-sm text-red-600">下载失败。请重试或联系管理员。</div>
              )}
              {downloadSuccess && (
                <div className="mt-2 text-sm text-green-600 bg-green-50 p-2 rounded">
                  证书已开始下载。若未自动下载，请再次点击下载按钮或检查浏览器下载栏。
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* 证书预览 */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Certificate Preview</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Visual representation of your certificate.
          </p>
        </div>

        <div className="px-4 py-5 sm:p-6">
          <div className="border border-gray-300 rounded-md p-6 bg-gray-50 text-center">
            {certificate.status === 'issued' ? (
              <div className="aspect-w-8 aspect-h-6 border-2 border-blue-600 mx-auto max-w-2xl p-8 bg-white rounded shadow">
                <div className="text-center">
                  <h1 className="text-2xl font-serif font-bold text-blue-800 mb-6">
                    Global Horizon University
                  </h1>
                  <p className="uppercase text-xs mb-2">This certifies that</p>
                  <p className="text-xl font-bold mb-4">{certificate.title}</p>
                  <p className="mb-4">has successfully completed</p>
                  <p className="text-xl font-bold mb-6">{certificate.title}</p>
                  <p className="mb-8">{certificate.description}</p>
                  <div className="flex justify-between items-center mt-10 border-t pt-4">
                    <div className="text-left">
                      <p className="text-sm">Date Issued</p>
                      <p className="font-bold">
                        {formatDate(certificate.issueDate || certificate.updatedAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">Certificate ID</p>
                      <p className="font-bold text-xs">{certificate._id}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-gray-500 py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="mt-2 text-sm">
                  Certificate preview will be available after issuance.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 证书详情 */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Certificate Information</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Details and status.</p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Title</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {certificate.title}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(certificate.status)}`}
                >
                  {certificate.status.charAt(0).toUpperCase() + certificate.status.slice(1)}
                </span>
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Description</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {certificate.description}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Certificate ID</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {certificate._id}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Requested On</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {formatDate(certificate.createdAt)}
              </dd>
            </div>
            {certificate.status === 'issued' && (
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Issued On</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {formatDate(certificate.issueDate || certificate.updatedAt)}
                </dd>
              </div>
            )}
            {certificate.notes && (
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Additional Notes</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {certificate.notes}
                </dd>
              </div>
            )}
            {certificate.status === 'revoked' && certificate.revocationReason && (
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Revocation Reason</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {certificate.revocationReason}
                </dd>
              </div>
            )}
            {certificate.status === 'issued' && (
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Verification Link</dt>
                <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                  <div className="flex items-center">
                    <input
                      type="text"
                      readOnly
                      value={verifyUrl}
                      className="flex-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(verifyUrl);
                        alert('Verification link copied to clipboard!');
                      }}
                      className="ml-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Copy
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Share this link to allow others to verify your certificate.
                  </p>
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {downloadSuccess && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-3 rounded-md shadow-lg">
          Certificate download initiated. Check your browser's download folder.
        </div>
      )}

      {/* 证书查看器 */}
      {viewerOpen && (
        <div className="certificate-viewer-overlay">
          <div className="certificate-viewer-container">
            <div className="certificate-viewer-header">
              <h5>证书查看器</h5>
              <button className="btn-close" onClick={closeViewer}>
                ×
              </button>
            </div>
            <div className="certificate-viewer-body">
              <iframe
                src={viewerUrl}
                title="Certificate Viewer"
                className="certificate-viewer-iframe"
                width="100%"
                height="100%"
              />
            </div>
          </div>
        </div>
      )}

      {/* 证书查看器样式 */}
      <style jsx>{`
        .certificate-viewer-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.7);
          z-index: 1000;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .certificate-viewer-container {
          width: 90%;
          height: 90%;
          background-color: white;
          border-radius: 8px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
        }

        .certificate-viewer-header {
          padding: 10px 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #e0e0e0;
        }

        .certificate-viewer-body {
          flex: 1;
          overflow: hidden;
        }

        .certificate-viewer-iframe {
          border: none;
        }

        .btn-close {
          background: transparent;
          border: none;
          font-size: 1.5rem;
          line-height: 1;
          color: #555;
          cursor: pointer;
        }

        .btn-close:hover {
          color: #000;
        }
      `}</style>
    </div>
  );
};

export default CertificateDetails;
