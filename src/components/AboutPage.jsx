import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const AboutPage = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-white">
      {/* 主要标题区域 */}
      <div className="relative bg-[#003087] py-16">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("/images/general/about-us.jpg")',
            backgroundPosition: 'center top',
            backgroundSize: 'cover',
          }}
        ></div>
        <div className="absolute inset-0 bg-[#003087] opacity-80"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-black sm:text-5xl lg:text-6xl drop-shadow-xl bg-blue-600 p-3 rounded inline-block mx-auto border-2 border-white">
              {t('aboutPage.title')}
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-900 font-medium whitespace-nowrap">
              {t('aboutPage.subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* 学校简介 */}
      <div className="py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div>
              <h2 className="text-base text-[#003087] font-semibold tracking-wide uppercase">
                {t('aboutPage.mission.label')}
              </h2>
              <p className="mt-2 text-3xl font-extrabold text-gray-900">
                {t('aboutPage.mission.title')}
              </p>
              <p className="mt-4 text-lg text-gray-700 font-medium">
                {t('aboutPage.mission.description1')}
              </p>
              <p className="mt-4 text-lg text-gray-700 font-medium">
                {t('aboutPage.mission.description2')}
              </p>
              <div className="mt-8">
                <Link
                  to="/courses"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#003087] hover:bg-blue-900"
                >
                  {t('aboutPage.exploreCourses')}
                </Link>
              </div>
            </div>
            <div className="mt-10 lg:mt-0">
              <div className="aspect-w-5 aspect-h-3 overflow-hidden rounded-lg shadow-lg">
                <img
                  className="object-cover"
                  src="/images/background.svg"
                  alt={t('aboutPage.campusImageAlt')}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 我们的优势 */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-[#003087] font-semibold tracking-wide uppercase">
              {t('aboutPage.advantages.label')}
            </h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900">
              {t('aboutPage.advantages.title')}
            </p>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-700 font-medium">
              {t('aboutPage.advantages.subtitle')}
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-6 py-8">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-[#003087] rounded-md p-3">
                      <svg
                        className="h-6 w-6 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                        />
                      </svg>
                    </div>
                    <h3 className="ml-4 text-xl font-medium text-gray-900">
                      {t('aboutPage.advantages.globalRecognition.title')}
                    </h3>
                  </div>
                  <p className="mt-4 text-base text-gray-700 font-medium">
                    {t('aboutPage.advantages.globalRecognition.description')}
                  </p>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-6 py-8">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-[#003087] rounded-md p-3">
                      <svg
                        className="h-6 w-6 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 14l9-5-9-5-9 5 9 5z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                        />
                      </svg>
                    </div>
                    <h3 className="ml-4 text-xl font-medium text-gray-900">
                      {t('aboutPage.advantages.excellence.title')}
                    </h3>
                  </div>
                  <p className="mt-4 text-base text-gray-700 font-medium">
                    {t('aboutPage.advantages.excellence.description')}
                  </p>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-6 py-8">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-[#003087] rounded-md p-3">
                      <svg
                        className="h-6 w-6 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="ml-4 text-xl font-medium text-gray-900">
                      {t('aboutPage.advantages.network.title')}
                    </h3>
                  </div>
                  <p className="mt-4 text-base text-gray-700 font-medium">
                    {t('aboutPage.advantages.network.description')}
                  </p>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-6 py-8">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-[#003087] rounded-md p-3">
                      <svg
                        className="h-6 w-6 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    </div>
                    <h3 className="ml-4 text-xl font-medium text-gray-900">
                      {t('aboutPage.advantages.security.title')}
                    </h3>
                  </div>
                  <p className="mt-4 text-base text-gray-700 font-medium">
                    {t('aboutPage.advantages.security.description')}
                  </p>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-6 py-8">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-[#003087] rounded-md p-3">
                      <svg
                        className="h-6 w-6 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      </svg>
                    </div>
                    <h3 className="ml-4 text-xl font-medium text-gray-900">
                      {t('aboutPage.advantages.campus.title')}
                    </h3>
                  </div>
                  <p className="mt-4 text-base text-gray-500">
                    {t('aboutPage.advantages.campus.description')}
                  </p>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-6 py-8">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-[#003087] rounded-md p-3">
                      <svg
                        className="h-6 w-6 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <h3 className="ml-4 text-xl font-medium text-gray-900">
                      {t('aboutPage.advantages.support.title')}
                    </h3>
                  </div>
                  <p className="mt-4 text-base text-gray-500">
                    {t('aboutPage.advantages.support.description')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 学校历史 */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-[#003087] font-semibold tracking-wide uppercase">
              {t('aboutPage.history.label')}
            </h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900">
              {t('aboutPage.history.title')}
            </p>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              {t('aboutPage.history.subtitle')}
            </p>
          </div>

          <div className="mt-12">
            <div className="relative">
              <div className="absolute inset-0 h-1/2 bg-gray-50"></div>
              <div className="relative max-w-4xl mx-auto">
                <dl className="rounded-lg bg-white shadow-lg sm:grid sm:grid-cols-3">
                  <div className="flex flex-col p-6 text-center border-b border-gray-100 sm:border-0 sm:border-r">
                    <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">
                      {t('aboutPage.history.foundingYear')}
                    </dt>
                    <dd className="order-1 text-5xl font-extrabold text-[#003087]">1995</dd>
                  </div>
                  <div className="flex flex-col p-6 text-center border-t border-b border-gray-100 sm:border-0 sm:border-l sm:border-r">
                    <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">
                      {t('aboutPage.history.partners')}
                    </dt>
                    <dd className="order-1 text-5xl font-extrabold text-[#003087]">50+</dd>
                  </div>
                  <div className="flex flex-col p-6 text-center border-t border-gray-100 sm:border-0 sm:border-l">
                    <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">
                      {t('aboutPage.history.alumni')}
                    </dt>
                    <dd className="order-1 text-5xl font-extrabold text-[#003087]">25,000+</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          <div className="mt-16">
            <div className="space-y-10">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div
                    className="flex items-center justify-center h-12 w-12 rounded-md bg-[#003087] text-white"
                    style={{ backgroundColor: '#003087', color: 'white' }}
                  >
                    <span className="text-xl font-bold">1</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {t('aboutPage.history.phase1.title')}
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    {t('aboutPage.history.phase1.description')}
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0">
                  <div
                    className="flex items-center justify-center h-12 w-12 rounded-md bg-[#003087] text-white"
                    style={{ backgroundColor: '#003087', color: 'white' }}
                  >
                    <span className="text-xl font-bold">2</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {t('aboutPage.history.phase2.title')}
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    {t('aboutPage.history.phase2.description')}
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0">
                  <div
                    className="flex items-center justify-center h-12 w-12 rounded-md bg-[#003087] text-white"
                    style={{ backgroundColor: '#003087', color: 'white' }}
                  >
                    <span className="text-xl font-bold">3</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {t('aboutPage.history.phase3.title')}
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    {t('aboutPage.history.phase3.description')}
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0">
                  <div
                    className="flex items-center justify-center h-12 w-12 rounded-md bg-[#003087] text-white"
                    style={{ backgroundColor: '#003087', color: 'white' }}
                  >
                    <span className="text-xl font-bold">4</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {t('aboutPage.history.phase4.title')}
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    {t('aboutPage.history.phase4.description')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 联系我们 */}
      <div className="bg-[#003087] py-16" style={{ backgroundColor: '#003087' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-white" style={{ color: 'white' }}>
                {t('aboutPage.contact.title')}
              </h2>
              <p className="mt-4 text-lg text-white" style={{ color: 'white' }}>
                {t('aboutPage.contact.subtitle')}
              </p>
              <div className="mt-8 flex flex-col sm:flex-row">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-[#003087] bg-white hover:bg-gray-50"
                  style={{ backgroundColor: 'white', color: '#003087' }}
                >
                  {t('aboutPage.contact.contactUs')}
                </Link>
                <Link
                  to="/faq"
                  className="mt-3 sm:mt-0 sm:ml-3 inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-900 hover:bg-blue-800"
                >
                  {t('aboutPage.contact.faq')}
                </Link>
              </div>
            </div>
            <div className="mt-10 lg:mt-0 flex justify-center">
              <img
                className="h-auto w-full max-w-md rounded-lg shadow-lg"
                src="/images/founding.jpg"
                alt={t('aboutPage.contact.imageAlt')}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
