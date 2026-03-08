import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../assets/styles/certificate.css';

const CertificateWall = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const isEnglish = currentLanguage === 'en' || currentLanguage.startsWith('en-');

  // 模拟证书数据
  const initialCertificates = [
    {
      id: 'GHU-BA-2023-123456',
      name: 'Sarah Johnson',
      program: 'Bachelor of Computer Science',
      country: 'United States',
      flag: '🇺🇸',
      issueDate: '2023-08-15',
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      achievements: ['Cum Laude', 'Capstone Excellence Award'],
    },
    {
      id: 'GHU-MA-2023-654321',
      name: 'Michael Chen',
      program: 'Master of Business Administration',
      country: 'Singapore',
      flag: '🇸🇬',
      issueDate: '2023-08-10',
      image: 'https://randomuser.me/api/portraits/men/22.jpg',
      achievements: ["Dean's List", 'Leadership Award'],
    },
    {
      id: 'GHU-PHD-2023-789012',
      name: 'Aisha Patel',
      program: 'Doctor of Philosophy in Data Science',
      country: 'India',
      flag: '🇮🇳',
      issueDate: '2023-08-05',
      image: 'https://randomuser.me/api/portraits/women/63.jpg',
      achievements: ['Research Excellence', 'Outstanding Dissertation'],
    },
    {
      id: 'GHU-PC-2023-345678',
      name: 'James Wilson',
      program: 'Professional Certificate in Cybersecurity',
      country: 'United Kingdom',
      flag: '🇬🇧',
      issueDate: '2023-08-02',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      achievements: ['Top Performer'],
    },
    {
      id: 'GHU-BA-2023-901234',
      name: 'Emma Rodriguez',
      program: 'Bachelor of Arts in International Relations',
      country: 'Mexico',
      flag: '🇲🇽',
      issueDate: '2023-07-29',
      image: 'https://randomuser.me/api/portraits/women/28.jpg',
      achievements: ['Honors Program', 'Study Abroad Excellence'],
    },
    {
      id: 'GHU-MS-2023-567890',
      name: 'David Kim',
      program: 'Master of Science in Artificial Intelligence',
      country: 'South Korea',
      flag: '🇰🇷',
      issueDate: '2023-07-25',
      image: 'https://randomuser.me/api/portraits/men/42.jpg',
      achievements: ['Research Publication Award'],
    },
    {
      id: 'GHU-PC-2023-234567',
      name: 'Olivia Müller',
      program: 'Professional Certificate in Digital Marketing',
      country: 'Germany',
      flag: '🇩🇪',
      issueDate: '2023-07-20',
      image: 'https://randomuser.me/api/portraits/women/52.jpg',
      achievements: ['Campaign Excellence'],
    },
    {
      id: 'GHU-BA-2023-890123',
      name: 'Mohammed Al-Farsi',
      program: 'Bachelor of Business Administration',
      country: 'United Arab Emirates',
      flag: '🇦🇪',
      issueDate: '2023-07-15',
      image: 'https://randomuser.me/api/portraits/men/59.jpg',
      achievements: ['Business Innovation Challenge Winner'],
    },
    {
      id: 'GHU-MA-2023-456789',
      name: 'Fatima Zahra',
      program: 'Master of Arts in Educational Leadership',
      country: 'Morocco',
      flag: '🇲🇦',
      issueDate: '2023-07-10',
      image: 'https://randomuser.me/api/portraits/women/36.jpg',
      achievements: ['Educational Reform Project Award'],
    },
    {
      id: 'GHU-PHD-2023-012345',
      name: 'Carlos Mendoza',
      program: 'Doctor of Philosophy in Environmental Science',
      country: 'Brazil',
      flag: '🇧🇷',
      issueDate: '2023-07-05',
      image: 'https://randomuser.me/api/portraits/men/67.jpg',
      achievements: ['Sustainability Research Award', 'Field Work Excellence'],
    },
    {
      id: 'GHU-PC-2023-678901',
      name: 'Liu Wei',
      program: 'Professional Certificate in Project Management',
      country: 'China',
      flag: '🇨🇳',
      issueDate: '2023-07-01',
      image: 'https://randomuser.me/api/portraits/men/79.jpg',
      achievements: ['PMP Excellence'],
    },
    {
      id: 'GHU-BA-2023-345678',
      name: 'Grace Okafor',
      program: 'Bachelor of Science in Nursing',
      country: 'Nigeria',
      flag: '🇳🇬',
      issueDate: '2023-06-25',
      image: 'https://randomuser.me/api/portraits/women/75.jpg',
      achievements: ['Clinical Excellence Award'],
    },
  ];

  // 统计数据
  const stats = {
    totalCertificates: 8742,
    countriesRepresented: 124,
    averageSatisfaction: 4.8,
    topPrograms: [
      'Business Administration',
      'Computer Science',
      'Data Science',
      'Project Management',
      'Digital Marketing',
    ],
  };

  // 状态
  const [certificates, setCertificates] = useState(initialCertificates);
  const [filteredCertificates, setFilteredCertificates] = useState(initialCertificates);
  const [verifyId, setVerifyId] = useState('');
  const [verifyResult, setVerifyResult] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('All');
  const [isVerifying, setIsVerifying] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [selectedCertificateData, setSelectedCertificateData] = useState(null);

  // 所有可用的项目类型
  const programTypes = [
    'All',
    'Bachelor',
    'Master',
    'Doctor of Philosophy',
    'Professional Certificate',
  ];

  // 处理证书验证
  const handleVerify = e => {
    e.preventDefault();
    if (!verifyId.trim()) return;

    setIsVerifying(true);

    // 模拟API调用延迟
    setTimeout(() => {
      const foundCertificate = initialCertificates.find(cert => cert.id === verifyId);

      if (foundCertificate) {
        setVerifyResult({
          valid: true,
          certificate: foundCertificate,
        });
      } else {
        setVerifyResult({
          valid: false,
          message: t('certificateWall.notFound'),
        });
      }

      setIsVerifying(false);
    }, 1000);
  };

  // 处理搜索和过滤
  useEffect(() => {
    let results = initialCertificates;

    // 按程序类型过滤
    if (selectedProgram !== 'All') {
      results = results.filter(cert => cert.program.includes(selectedProgram));
    }

    // 按姓名或证书ID搜索
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        cert =>
          cert.name.toLowerCase().includes(query) ||
          cert.id.toLowerCase().includes(query) ||
          cert.program.toLowerCase().includes(query) ||
          cert.country.toLowerCase().includes(query)
      );
    }

    setFilteredCertificates(results);
  }, [searchQuery, selectedProgram]);

  // 格式化日期
  const formatDate = dateString => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(isEnglish ? 'en-US' : 'zh-CN', options);
  };

  // 处理查看证书详情
  const handleViewCertificate = (certificate) => {
    setSelectedCertificateData(certificate);
    setShowCertificateModal(true);
  };

  // 证书模态框组件
  const CertificateModal = ({ certificate, onClose }) => {
    if (!certificate) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="certificate-display">
            {/* 高质量证书模板 */}
            <div className="certificate-template border-8 border-gold bg-cream p-8 rounded-lg shadow-lg">
              <div className="border-4 border-gold p-6 flex flex-col items-center">
                {/* 学校校徽 */}
                <div className="mb-4">
                  <img 
                    src="/images/logo/logo.svg" 
                    alt="University Logo" 
                    className="h-24 w-auto"
                  />
                </div>
                
                <div className="text-center mb-4">
                  <div className="bg-blue-900 text-gold py-2 px-8 rounded-full inline-block mb-2">
                    <h2 className="text-2xl font-bold">STRATFORD INTERNATIONAL UNIVERSITY</h2>
                  </div>
                  <p className="text-xl text-gray-600">{t('certificateWall.officialCertificate')}</p>
                </div>

                <div className="flex justify-center items-center my-3">
                  <div className="w-16 h-1 bg-gold rounded-full"></div>
                  <div className="w-3 h-3 bg-blue-900 rounded-full mx-2"></div>
                  <div className="w-16 h-1 bg-gold rounded-full"></div>
                </div>

                <div className="my-4 text-center">
                  <h3 className="text-2xl font-bold text-gray-800">{t('certificateWall.certifies')}</h3>
                  <h2 className="text-4xl font-bold text-blue-900 my-4">{certificate.name}</h2>
                  <p className="text-xl text-gray-600">{t('certificateWall.hasCompleted')}</p>
                  <h3 className="text-3xl font-bold text-gold my-4">{certificate.program}</h3>
                  <p className="text-lg text-gray-600">
                    {t('certificateWall.issuedOn')} {formatDate(certificate.issueDate)}
                  </p>
                </div>

                <div className="flex justify-center items-center gap-12 mt-8 w-full">
                  <div className="flex flex-col items-center">
                    {/* 校长签名 */}
                    <div className="w-32 h-16 mb-2">
                      <img 
                        src="/images/signatures/president.svg" 
                        alt="President Signature" 
                        className="w-full h-full"
                      />
                    </div>
                    <div className="w-32 h-0.5 bg-gray-800 mb-1"></div>
                    <p className="text-sm text-gray-600">{t('certificateWall.presidentSignature')}</p>
                  </div>
                  
                  <div className="relative">
                    <div className="certificate-seal">
                      <div className="w-24 h-24 rounded-full border-4 border-gold flex items-center justify-center bg-gold bg-opacity-10">
                        <span className="text-2xl font-bold text-gold">SIU</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    {/* 院长签名 */}
                    <div className="w-32 h-16 mb-2">
                      <img 
                        src="/images/signatures/director.svg" 
                        alt="Dean Signature" 
                        className="w-full h-full"
                      />
                    </div>
                    <div className="w-32 h-0.5 bg-gray-800 mb-1"></div>
                    <p className="text-sm text-gray-600">{t('certificateWall.deanSignature')}</p>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500">{t('certificateWall.verifyAt')}</p>
                  <p className="text-sm font-mono bg-gray-100 px-2 py-1 rounded mt-1">{certificate.id}</p>
                </div>
                
                {/* 装饰性角落元素 */}
                <div className="certificate-corner certificate-corner-top-left"></div>
                <div className="certificate-corner certificate-corner-top-right"></div>
                <div className="certificate-corner certificate-corner-bottom-left"></div>
                <div className="certificate-corner certificate-corner-bottom-right"></div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <button 
              className="bg-blue-900 text-white px-6 py-2 rounded-md hover:bg-blue-800 transition"
              onClick={onClose}
            >
              {t('certificateWall.close')}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* 页面标题 */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white text-center">
            {t('certificateWall.title')}
          </h1>
          <p className="mt-4 text-xl text-gray-200 text-center max-w-3xl mx-auto">
            {t('certificateWall.subtitle')}
          </p>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col space-y-8">
          {/* 统计信息面板 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {t('certificateWall.statsTitle')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">{t('certificateWall.totalCertificates')}</p>
                <p className="text-3xl font-bold text-blue-900">{stats.totalCertificates.toLocaleString()}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">{t('certificateWall.countriesRepresented')}</p>
                <p className="text-3xl font-bold text-purple-900">{stats.countriesRepresented}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">{t('certificateWall.averageSatisfaction')}</p>
                <p className="text-3xl font-bold text-green-900">{stats.averageSatisfaction}/5</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">{t('certificateWall.topProgram')}</p>
                <p className="text-xl font-bold text-yellow-900 truncate">{stats.topPrograms[0]}</p>
              </div>
            </div>
          </div>

          {/* 搜索和过滤区域 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0 md:space-x-4">
              <div className="relative w-full md:w-auto">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder={t('certificateWall.searchPlaceholder')}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="w-full md:w-auto">
                <select
                  className="block w-full md:w-auto border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={selectedProgram}
                  onChange={(e) => setSelectedProgram(e.target.value)}
                >
                  {programTypes.map((type) => (
                    <option key={type} value={type}>
                      {type === 'All' ? t('certificateWall.allPrograms') : type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 证书验证工具 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {t('certificateWall.verifyTitle')}
            </h2>
            <form onSubmit={handleVerify} className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder={t('certificateWall.verifyPlaceholder')}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={verifyId}
                onChange={(e) => setVerifyId(e.target.value)}
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                disabled={isVerifying}
              >
                {isVerifying ? (
                  <span className="flex items-center justify-center">
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
                    {t('certificateWall.verifying')}
                  </span>
                ) : (
                  t('certificateWall.verify')
                )}
              </button>
            </form>

            {/* 验证结果 */}
            {verifyResult && (
              <div
                className={`mt-4 p-4 rounded-md ${
                  verifyResult.valid
                    ? 'bg-green-100 border border-green-200'
                    : 'bg-red-100 border border-red-200'
                }`}
              >
                {verifyResult.valid ? (
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <svg
                        className="h-5 w-5 text-green-500 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-green-800 font-medium">
                        {t('certificateWall.validCertificate')}
                      </span>
                    </div>
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">{t('certificateWall.recipient')}</p>
                        <p className="font-medium">{verifyResult.certificate.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{t('certificateWall.program')}</p>
                        <p className="font-medium">{verifyResult.certificate.program}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{t('certificateWall.issueDate')}</p>
                        <p className="font-medium">{formatDate(verifyResult.certificate.issueDate)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{t('certificateWall.country')}</p>
                        <p className="font-medium">
                          {verifyResult.certificate.flag} {verifyResult.certificate.country}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleViewCertificate(verifyResult.certificate)}
                      className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors w-full md:w-auto"
                    >
                      {t('certificateWall.viewCertificate')}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <svg
                      className="h-5 w-5 text-red-500 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    <span className="text-red-800">{verifyResult.message}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 证书展示区域 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {t('certificateWall.recentCertificates')}
            </h2>
            
            {filteredCertificates.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">{t('certificateWall.noResults')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCertificates.map((certificate) => (
                  <div
                    key={certificate.id}
                    className="border border-gray-200 rounded-lg overflow-hidden transition-all hover:shadow-lg"
                  >
                    <div className="p-5 flex flex-col h-full">
                      <div className="flex items-center mb-4">
                        <img
                          src={certificate.image}
                          alt={certificate.name}
                          className="h-12 w-12 rounded-full object-cover mr-4"
                        />
                        <div>
                          <h3 className="font-medium text-gray-900">{certificate.name}</h3>
                          <p className="text-sm text-gray-500">
                            {certificate.flag} {certificate.country}
                          </p>
                        </div>
                      </div>
                      <div className="mb-4 flex-grow">
                        <p className="text-sm text-gray-500">{t('certificateWall.program')}</p>
                        <p className="font-medium">{certificate.program}</p>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">{t('certificateWall.issueDate')}</p>
                          <p className="text-sm">{formatDate(certificate.issueDate)}</p>
                        </div>
                        {certificate.achievements && certificate.achievements.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-500">{t('certificateWall.achievements')}</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {certificate.achievements.map((achievement, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                >
                                  {achievement}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="mt-4">
                        <button
                          onClick={() => handleViewCertificate(certificate)}
                          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                        >
                          {t('certificateWall.viewCertificate')}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 证书查看模态框 */}
      {showCertificateModal && (
        <CertificateModal 
          certificate={selectedCertificateData} 
          onClose={() => setShowCertificateModal(false)} 
        />
      )}

      {/* 添加一些自定义CSS，用于证书模板显示 */}
      <style jsx="true">{`
        .certificate-template {
          position: relative;
          background-color: #fffef0;
          max-width: 800px;
          margin: 0 auto;
        }
        
        .border-gold {
          border-color: #D4A017;
        }
        
        .bg-cream {
          background-color: #FFFEF0;
        }
        
        .text-gold {
          color: #D4A017;
        }
        
        .bg-blue-900 {
          background-color: #003087;
        }
      `}</style>
    </div>
  );
};

export default CertificateWall;
