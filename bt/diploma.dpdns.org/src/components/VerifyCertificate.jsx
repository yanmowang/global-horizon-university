import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentTextIcon,
  CalendarIcon,
  AcademicCapIcon,
  UserIcon,
  ClockIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { useLocation, Link, useParams } from 'react-router-dom';

const VerifyCertificate = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const params = useParams();

  // 从URL参数获取证书ID
  const paramCertificateId = params.certificateId;
  const queryCertificateId = new URLSearchParams(location.search).get('id');

  const [certificateId, setCertificateId] = useState(
    paramCertificateId || queryCertificateId || ''
  );
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  // 当组件加载或URL参数更改时执行验证
  useEffect(() => {
    if (paramCertificateId || queryCertificateId) {
      const idToVerify = paramCertificateId || queryCertificateId;
      setCertificateId(idToVerify);
      verifyCertificateById(idToVerify);
    }
  }, [paramCertificateId, queryCertificateId]);

  // 实际验证证书的函数
  const verifyCertificateById = async id => {
    if (!id || !id.trim()) {
      setVerificationStatus({
        valid: false,
        message: t('verifyCertificatePage.results.emptyIdError', '请输入有效的证书ID'),
      });
      return;
    }

    try {
      setLoading(true);
      // 重置之前的验证结果
      setVerificationStatus(null);

      // 实际API调用
      const response = await fetch(`/api/certificates/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ certificateNumber: id }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setVerificationStatus({
          valid: true,
          details: {
            id: data.data.certificateNumber,
            name: data.data.recipient,
            course: data.data.program,
            issueDate: new Date(data.data.issueDate).toLocaleDateString(),
            status: data.data.status,
          },
        });
      } else {
        setVerificationStatus({
          valid: false,
          message: data.message || t('verifyCertificatePage.results.invalid'),
        });
      }
    } catch (error) {
      console.error('Error verifying certificate:', error);
      setVerificationStatus({
        valid: false,
        message: t('verifyCertificatePage.results.serverError', '服务器错误，请稍后重试'),
      });
    } finally {
      setLoading(false);
    }
  };

  // 表单提交处理函数
  const verifyCertificate = e => {
    e.preventDefault();
    verifyCertificateById(certificateId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pt-24 pb-12">
      <div className="w-full px-4 py-12 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-blue-600 mb-4 break-words">
            {t('verifyCertificatePage.title', '验证证书')}
          </h1>
          <p className="max-w-3xl mx-auto text-gray-600 break-words">
            {t('verifyCertificatePage.subtitle', '输入证书ID以验证其真实性和有效性')}
          </p>
        </div>

        <div className="bg-blue-500 bg-opacity-80 p-6 rounded-lg shadow-md mb-8 max-w-4xl mx-auto">
          <div className="text-white break-words">
            <h2 className="text-2xl font-bold mb-2 break-words">
              {t('verifyCertificatePage.title', '验证证书')}
            </h2>
            <p className="mb-0 break-words">
              {t('verifyCertificatePage.subtitle', '输入证书ID以验证其真实性和有效性')}
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <div
            className="overflow-hidden shadow-lg rounded-lg border border-blue-200"
            style={{
              background:
                'linear-gradient(135deg, rgba(93, 154, 217, 0.9) 0%, rgba(62, 134, 204, 0.9) 100%)',
            }}
          >
            <div className="px-4 py-5 sm:p-6">
              <form onSubmit={verifyCertificate} className="space-y-6">
                <div>
                  <label htmlFor="certificate-id" className="block text-sm font-medium text-white">
                    {t('verifyCertificatePage.form.certificateIdLabel', '证书编号')}
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <div className="relative flex-grow focus-within:z-10">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DocumentTextIcon className="h-5 w-5 text-gray-600" aria-hidden="true" />
                      </div>
                      <input
                        type="text"
                        name="certificate-id"
                        id="certificate-id"
                        className="focus:ring-[#003087] focus:border-[#003087] block w-full rounded-md pl-10 sm:text-sm border-gray-300"
                        placeholder={t(
                          'verifyCertificatePage.form.certificateIdPlaceholder',
                          '输入证书编号'
                        )}
                        value={certificateId}
                        onChange={e => setCertificateId(e.target.value)}
                      />
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-white">
                    {t('verifyCertificatePage.form.exampleId', '示例: SIU-2023-1234')}
                  </p>
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center items-center py-3 px-5 border border-transparent rounded-md shadow-lg text-lg font-bold text-[#003087] bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-colors duration-200"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#003087]"
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
                        {t('verifyCertificatePage.form.verifyingButton', '验证中...')}
                      </>
                    ) : (
                      <>
                        <MagnifyingGlassIcon
                          className="-ml-1 mr-2 h-5 w-5 text-[#003087]"
                          aria-hidden="true"
                        />
                        {t('verifyCertificatePage.form.verifyButton', '验证证书')}
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* 验证结果 */}
              {verificationStatus && (
                <div className="mt-8">
                  <div
                    className={`rounded-md p-4 ${verificationStatus.valid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}
                  >
                    <div className="flex">
                      <div className="flex-shrink-0">
                        {verificationStatus.valid ? (
                          <CheckCircleIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                        ) : (
                          <XCircleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                        )}
                      </div>
                      <div className="ml-3">
                        <h3
                          className={`text-base font-bold ${verificationStatus.valid ? 'text-green-800' : 'text-red-800'}`}
                        >
                          {verificationStatus.valid
                            ? t('verifyCertificatePage.results.valid', '证书验证成功')
                            : verificationStatus.message ||
                              t('verifyCertificatePage.results.invalid', '证书验证失败')}
                        </h3>
                        <p
                          className={`mt-1 text-sm ${verificationStatus.valid ? 'text-green-700' : 'text-red-700'}`}
                        >
                          {verificationStatus.valid
                            ? t(
                                'verifyCertificatePage.results.validMessage',
                                '此证书已通过验证，是由我们机构颁发的有效证书。'
                              )
                            : t(
                                'verifyCertificatePage.results.invalidMessage',
                                '无法验证此证书，请检查证书ID是否正确。'
                              )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {verificationStatus.valid && verificationStatus.details && (
                    <div className="mt-6 border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-bold text-gray-900 flex items-center">
                        <ShieldCheckIcon className="h-5 w-5 text-blue-600 mr-2" />
                        {t('verifyCertificatePage.results.certificateDetails', '证书详细信息')}
                      </h3>

                      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg overflow-hidden">
                        <div className="px-4 py-5 sm:px-6 bg-blue-100 border-b border-blue-200">
                          <h3 className="text-lg leading-6 font-medium text-blue-900">
                            {verificationStatus.details.name}
                          </h3>
                          <p className="mt-1 max-w-2xl text-sm text-blue-700">
                            {t('verifyCertificatePage.results.certificateId', '证书编号')}:{' '}
                            {verificationStatus.details.id}
                          </p>
                        </div>

                        <div className="px-4 py-5 sm:p-6">
                          <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
                            <div className="flex items-start">
                              <UserIcon className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                              <div>
                                <dt className="text-sm font-medium text-gray-700">
                                  {t('verifyCertificatePage.results.name', '接收者姓名')}
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 font-semibold">
                                  {verificationStatus.details.name}
                                </dd>
                              </div>
                            </div>

                            <div className="flex items-start">
                              <AcademicCapIcon className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                              <div>
                                <dt className="text-sm font-medium text-gray-700">
                                  {t('verifyCertificatePage.results.course', '课程/学位')}
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 font-semibold">
                                  {verificationStatus.details.course}
                                </dd>
                              </div>
                            </div>

                            <div className="flex items-start">
                              <CalendarIcon className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                              <div>
                                <dt className="text-sm font-medium text-gray-700">
                                  {t('verifyCertificatePage.results.issueDate', '发布日期')}
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 font-semibold">
                                  {verificationStatus.details.issueDate}
                                </dd>
                              </div>
                            </div>

                            <div className="flex items-start">
                              <ShieldCheckIcon className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                              <div>
                                <dt className="text-sm font-medium text-gray-700">
                                  {t('verifyCertificatePage.results.status', '状态')}
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                                    {verificationStatus.details.status}
                                  </span>
                                </dd>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 验证说明 */}
          <div
            className="mt-8 overflow-hidden shadow rounded-lg border border-blue-200"
            style={{
              background:
                'linear-gradient(135deg, rgba(93, 154, 217, 0.9) 0%, rgba(62, 134, 204, 0.9) 100%)',
            }}
          >
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-bold text-white mb-3 drop-shadow-md">
                {t('verifyCertificatePage.howItWorks.title', '证书验证说明')}
              </h3>
              <p className="text-white mb-4 drop-shadow">
                {t(
                  'verifyCertificatePage.howItWorks.description',
                  '每个由我们机构颁发的证书都包含一个唯一的标识符，可以通过我们的安全数据库进行验证。此验证系统确保了我们机构颁发的所有证书的真实性。'
                )}
              </p>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="border border-white/30 rounded-md p-4 bg-white/10 backdrop-blur-sm">
                  <h4 className="text-sm font-medium text-white mb-2 drop-shadow">
                    {t('verifyCertificatePage.howItWorks.step1.title', '步骤 1: 输入证书ID')}
                  </h4>
                  <p className="text-xs text-white/90 drop-shadow">
                    {t(
                      'verifyCertificatePage.howItWorks.step1.description',
                      '在证书上找到唯一的证书ID，并在上方的验证框中输入。'
                    )}
                  </p>
                </div>
                <div className="border border-white/30 rounded-md p-4 bg-white/10 backdrop-blur-sm">
                  <h4 className="text-sm font-medium text-white mb-2 drop-shadow">
                    {t('verifyCertificatePage.howItWorks.step2.title', '步骤 2: 查看验证结果')}
                  </h4>
                  <p className="text-xs text-white/90 drop-shadow">
                    {t(
                      'verifyCertificatePage.howItWorks.step2.description',
                      '系统将检查证书的真实性，并显示相关的证书详细信息。'
                    )}
                  </p>
                </div>
              </div>
              <div className="mt-4 text-center">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-5 py-2 border border-white rounded-md text-sm text-[#003087] font-medium bg-white hover:bg-gray-100"
                >
                  {t('verifyCertificatePage.howItWorks.contactUs', '有问题？联系我们')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyCertificate;
