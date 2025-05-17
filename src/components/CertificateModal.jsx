import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import ImageWithFallback from './shared/ImageWithFallback';
import VerificationBadge from './VerificationBadge';

const CertificateModal = ({ certificate, onClose, onDownload }) => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const isEnglish = currentLanguage === 'en' || currentLanguage.startsWith('en-');
  const closeButtonRef = useRef(null);
  const downloadButtonRef = useRef(null);
  const modalRef = useRef(null);

  // Add escape key handler
  useEffect(() => {
    const handleEscapeKey = e => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [onClose]);

  // Focus management for the modal
  useEffect(() => {
    // Store previous active element
    const previousActiveElement = document.activeElement;

    // Focus the close button when modal opens
    if (closeButtonRef.current) {
      closeButtonRef.current.focus();
    }

    // Handle focus trap inside modal
    const handleTabKey = e => {
      if (e.key === 'Tab') {
        // Find all focusable elements in the modal
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (!focusableElements?.length) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        // If shift+tab on first element, go to last
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
        // If tab on last element, go to first
        else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);

    // Cleanup function to restore focus when modal closes
    return () => {
      document.removeEventListener('keydown', handleTabKey);
      if (previousActiveElement) {
        previousActiveElement.focus();
      }
    };
  }, []);

  // 格式化日期
  const formatDate = dateString => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(isEnglish ? 'en-US' : 'zh-CN', options);
  };

  // 根据当前语言获取课程名称
  const getCourseTitle = () => {
    return isEnglish && certificate.english_course
      ? certificate.english_course
      : certificate.course;
  };

  // 根据当前语言获取课程描述
  const getCourseDescription = () => {
    return isEnglish && certificate.english_description
      ? certificate.english_description
      : certificate.description;
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="certificate-modal-title"
      ref={modalRef}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full overflow-hidden">
        {/* 证书预览 */}
        <div className="relative">
          <button
            className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
            onClick={onClose}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                onClose();
              }
            }}
            aria-label={t('certificatesPage.certificateModal.close')}
            tabIndex="0"
            ref={closeButtonRef}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="max-h-[50vh] overflow-auto">
            <ImageWithFallback
              src={certificate.processedImage || certificate.image}
              alt={`${certificate.name} - ${getCourseTitle()}`}
              fallbackSrc={`data:image/svg+xml;utf8,${encodeURIComponent(`
                <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
                  <rect width="400" height="300" fill="#f8f9fa" stroke="#cccccc" stroke-width="2" />
                  <text x="200" y="150" font-family="Arial, sans-serif" font-size="24" text-anchor="middle" fill="#999">Certificate Preview</text>
                </svg>
              `)}`}
              className="w-full object-contain"
            />
          </div>
        </div>

        {/* 证书详情 */}
        <div className="p-6 bg-gray-50">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 id="certificate-modal-title" className="text-xl font-bold text-gray-900">
                {certificate.name}
              </h3>
              <p className="text-lg text-blue-700 font-medium">{getCourseTitle()}</p>
            </div>
            <VerificationBadge verified={true} className="mt-1" />
          </div>

          <div className="mb-4">
            <p className="text-gray-700">{getCourseDescription()}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-500">{t('certificatesPage.certificateID')}</p>
              <p className="font-mono text-sm">{certificate.certificateId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">{t('certificatesPage.issueDate')}</p>
              <p>{formatDate(certificate.date)}</p>
            </div>
          </div>

          {/* 认证信息 */}
          {certificate.accreditation && (
            <div className="mb-6 p-3 bg-blue-50 rounded-md border border-blue-100">
              <h4 className="text-sm font-medium text-blue-700 mb-1">
                {t('certificatesPage.accreditation')}
              </h4>
              <p className="text-sm text-blue-800">{certificate.accreditation}</p>
            </div>
          )}

          {/* 签名人信息 */}
          {certificate.signatories && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-sm">
              <div>
                <p className="text-gray-500">{t('certificatesPage.signedBy')}</p>
                <p className="font-medium">{certificate.signatories.president}</p>
                <p className="text-gray-600">{certificate.signatories.presidentTitle}</p>
              </div>
              <div>
                <p className="text-gray-500">{t('certificatesPage.signedBy')}</p>
                <p className="font-medium">{certificate.signatories.dean}</p>
                <p className="text-gray-600">{certificate.signatories.deanTitle}</p>
              </div>
            </div>
          )}

          {/* 验证链接 */}
          {certificate.verificationUrl && (
            <div className="mb-6">
              <p className="text-sm text-gray-500">{t('certificatesPage.verification')}</p>
              <a
                href={`https://${certificate.verificationUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                {certificate.verificationUrl} ↗
              </a>
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button
              onClick={() => onDownload(certificate)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onDownload(certificate);
                }
              }}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              aria-label={t('certificatesPage.downloadCertificate')}
              tabIndex="0"
              ref={downloadButtonRef}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              {t('certificatesPage.downloadCertificate')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateModal;
