import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from './shared/Button';

function HomePage() {
  const { t } = useTranslation();

  // 模拟数据 - 特色课程
  const featuredCourses = [
    {
      id: 1,
      title: t('homePage.featuredCourses.business.title', '商业管理学士'),
      description: t(
        'homePage.featuredCourses.business.description',
        '培养全球商业领导能力的综合课程'
      ),
      level: t('homePage.courseLevels.undergraduate', '本科'),
      duration: '4年',
      image: '/images/courses/course1.jpg',
    },
    {
      id: 2,
      title: t('homePage.featuredCourses.dataScience.title', '数据科学与人工智能硕士'),
      description: t(
        'homePage.featuredCourses.dataScience.description',
        '掌握前沿技术，引领数字化转型'
      ),
      level: t('homePage.courseLevels.graduate', '研究生'),
      duration: '2年',
      image: '/images/courses/course2.jpg',
    },
    {
      id: 3,
      title: t('homePage.featuredCourses.international.title', '国际关系博士'),
      description: t(
        'homePage.featuredCourses.international.description',
        '深入研究全球政治经济与外交政策'
      ),
      level: t('homePage.courseLevels.doctorate', '博士'),
      duration: '3-5年',
      image: '/images/courses/course3.jpg',
    },
  ];

  // 模拟数据 - 学生评价
  const testimonials = [
    {
      id: 1,
      name: t('homePage.testimonials.student1.name', '张明'),
      role: t('homePage.testimonials.student1.role', '2022届商业管理学士'),
      content: t(
        'homePage.testimonials.student1.content',
        '在SIU的学习经历彻底改变了我的职业轨迹。课程内容与行业实践紧密结合，教授们都拥有丰富的实战经验。毕业后，我立即获得了一家国际企业的工作机会。'
      ),
      image: '/images/testimonials/student1.jpg',
    },
    {
      id: 2,
      name: t('homePage.testimonials.student2.name', '李婷'),
      role: t('homePage.testimonials.student2.role', '2021届数据科学硕士'),
      content: t(
        'homePage.testimonials.student2.content',
        '作为一名国际学生，我在SIU感受到了无与伦比的支持和包容。灵活的学习方式让我能够兼顾家庭和学业，同时结交了来自世界各地的朋友。'
      ),
      image: '/images/testimonials/student2.jpg',
    },
  ];

  // 成就数据
  const achievements = [
    {
      number: '95%',
      text: t('homePage.stats.graduationRate'),
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    },
    {
      number: '120+',
      text: t('homePage.stats.companies'),
      icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    },
    {
      number: '50+',
      text: t('homePage.stats.countries'),
      icon: 'M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9',
    },
    {
      number: '30年',
      text: t('homePage.stats.experience'),
      icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    },
  ];

  // 颜色变量
  const colors = {
    primary: '#3e86cc',
    secondary: '#5d9ad9',
    accent: '#ffc72c',
    light: '#f0f7ff',
  };

  return (
    <div className="bg-white">
      {/* 英雄区域 - 添加背景图片 */}
      <div
        className="relative overflow-hidden"
        style={{
          backgroundImage:
            'linear-gradient(135deg, rgba(62, 134, 204, 0.2) 0%, rgba(31, 90, 152, 0.3) 100%)',
        }}
      >
        <div className="absolute inset-0 z-0 opacity-100">
          <img
            src="/images/background.jpg"
            alt={t('homePage.hero.imageAlt', '校园景色')}
            className="w-full h-full object-cover"
            onError={e => {
              e.target.style.display = 'none';
              e.target.parentNode.style.backgroundColor = 'rgba(62, 134, 204, 0.7)';
            }}
          />
        </div>

        {/* 顶部标签 */}
        <div className="absolute top-0 right-0 lg:right-6 transform translate-y-6 lg:translate-y-12 z-10">
          <div className="bg-white/20 backdrop-blur-md rounded-l-lg py-2 px-4 shadow-lg">
            <div className="text-white font-medium">
              2025年秋季入学申请 <span className="text-yellow-300 font-bold">进行中</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="relative py-20 sm:py-28 lg:py-36 px-4 sm:px-6 lg:px-8">
            <div className="text-center sm:text-left max-w-xl">
              <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-white uppercase bg-white/30 backdrop-blur-sm rounded-full shadow-sm">
                {t('homePage.hero.tagline', '全球认可的在线教育')}
              </span>
              <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl drop-shadow-lg">
                <span className="block xl:inline">{t('homePage.hero.title')}</span>
              </h1>
              <p className="mt-3 text-base text-white sm:mt-5 sm:text-lg sm:max-w-xl md:mt-5 md:text-xl drop-shadow-md">
                {t('homePage.hero.subtitle')}
              </p>
              <div className="mt-8 sm:flex sm:justify-start">
                <div className="rounded-md shadow-lg">
                  <Link
                    to="/courses"
                    className="w-full flex items-center justify-center px-8 py-4 border-2 border-white text-base font-medium rounded-md text-[#3e86cc] bg-white hover:bg-gray-100 transition-colors duration-300 shadow-lg md:py-4 md:text-lg md:px-10"
                  >
                    {t('homePage.hero.explore')}
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Link
                    to="/about"
                    className="w-full flex items-center justify-center px-8 py-4 border-2 border-white text-base font-medium rounded-md text-white bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors duration-300 shadow-lg md:py-4 md:text-lg md:px-10"
                  >
                    {t('header.about')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 下滑箭头 */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-20 animate-bounce hidden md:block">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>

        {/* 波浪形装饰 */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 80">
            <path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,32L80,37.3C160,43,320,53,480,53.3C640,53,800,43,960,37.3C1120,32,1280,32,1360,32L1440,32L1440,80L1360,80C1280,80,1120,80,960,80C800,80,640,80,480,80C320,80,160,80,80,80L0,80Z"
            ></path>
          </svg>
        </div>
      </div>

      {/* 成就统计区域 */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {achievements.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center group hover:-translate-y-1 transition-transform duration-300"
              >
                <div className="mb-4 p-4 rounded-full bg-blue-100 border border-blue-200 group-hover:bg-blue-200 transition-colors duration-300 shadow-md relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-blue-700/20 group-hover:from-blue-500/30 group-hover:to-blue-700/30 transition-colors duration-300"></div>
                  <svg
                    className="h-10 w-10 text-blue-700 relative z-10"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={item.icon}
                    />
                  </svg>
                </div>
                <div className="text-5xl font-bold bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent mb-2 drop-shadow transition-all duration-500 group-hover:tracking-wider">
                  {item.number}
                </div>
                <div className="text-gray-700 font-medium">{item.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 特点部分 */}
      <div className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-blue-800 uppercase bg-blue-100 rounded-full">
              {t('homePage.features.title')}
            </span>
            <h2 className="text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              {t('homePage.features.subtitle')}
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-700 font-medium lg:mx-auto">
              {t('homePage.features.description')}
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="relative p-6 border border-gray-100 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="absolute -top-5 left-5 flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-200">
                  <svg
                    className="h-7 w-7"
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
                <div className="ml-0 mt-8">
                  <h3 className="text-xl leading-6 font-bold text-gray-900 mb-2">
                    {t('homePage.features.globalRecognition.title')}
                  </h3>
                  <p className="text-base text-gray-700 font-medium">
                    {t('homePage.features.globalRecognition.description')}
                  </p>
                </div>
              </div>

              <div className="relative p-6 border border-gray-100 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="absolute -top-5 left-5 flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-200">
                  <svg
                    className="h-7 w-7"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-0 mt-8">
                  <h3 className="text-xl leading-6 font-bold text-gray-900 mb-2">
                    {t('homePage.features.flexibleLearning.title')}
                  </h3>
                  <p className="text-base text-gray-700 font-medium">
                    {t('homePage.features.flexibleLearning.description')}
                  </p>
                </div>
              </div>

              <div className="relative p-6 border border-gray-100 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="absolute -top-5 left-5 flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-200">
                  <svg
                    className="h-7 w-7"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <div className="ml-0 mt-8">
                  <h3 className="text-xl leading-6 font-bold text-gray-900 mb-2">
                    {t('homePage.features.expertFaculty.title')}
                  </h3>
                  <p className="text-base text-gray-700 font-medium">
                    {t('homePage.features.expertFaculty.description')}
                  </p>
                </div>
              </div>

              <div className="relative p-6 border border-gray-100 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="absolute -top-5 left-5 flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-200">
                  <svg
                    className="h-7 w-7"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <div className="ml-0 mt-8">
                  <h3 className="text-xl leading-6 font-bold text-gray-900 mb-2">
                    {t('homePage.features.careerSupport.title')}
                  </h3>
                  <p className="text-base text-gray-700 font-medium">
                    {t('homePage.features.careerSupport.description')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 特色课程部分 */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-blue-800 uppercase bg-blue-100 rounded-full shadow-sm">
              {t('homePage.programs.title')}
            </span>
            <h2 className="text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              {t('homePage.programs.subtitle')}
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-600 lg:mx-auto">
              选择适合您职业目标的专业课程，开启您的学术旅程
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {featuredCourses.map(course => (
              <div
                key={course.id}
                className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200"
              >
                <div className="h-56 bg-gray-200 relative overflow-hidden">
                  <div
                    className="absolute inset-0 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-500"
                    style={{
                      backgroundImage: `url(${course.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundColor:
                        course.id === 1
                          ? 'rgba(41, 121, 255, 0.25)'
                          : course.id === 2
                            ? 'rgba(66, 133, 244, 0.25)'
                            : 'rgba(100, 148, 237, 0.25)',
                      backgroundBlendMode: 'soft-light',
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-900 opacity-40"></div>
                    <h3 className="text-xl font-bold text-white text-center px-4 relative z-10 group-hover:scale-105 transition-transform duration-300 drop-shadow-lg">
                      {course.title}
                    </h3>
                  </div>
                </div>
                <div className="p-7">
                  <p className="text-gray-700 mb-4">{course.description}</p>
                  <div className="flex justify-between text-sm text-gray-500 mb-5">
                    <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full font-medium border border-blue-100">
                      {course.level}
                    </span>
                    <span className="inline-block px-3 py-1 bg-gray-50 text-gray-600 rounded-full font-medium border border-gray-200">
                      {course.duration}
                    </span>
                  </div>
                  <Button
                    to="/courses"
                    variant="primary"
                    fullWidth
                    className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
                  >
                    了解更多
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <Button
              to="/courses"
              variant="outline"
              className="inline-flex items-center px-5 py-3 bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-200"
            >
              {t('homePage.programs.viewAll')}
              <svg className="ml-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      {/* 学生评价部分 */}
      <div className="py-24 bg-gray-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-blue-800 uppercase bg-blue-100 rounded-full">
              {t('homePage.testimonials.title')}
            </span>
            <h2 className="text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              {t('homePage.testimonials.subtitle')}
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-700 font-medium lg:mx-auto">
              了解我们的毕业生如何在全球职场中取得成功
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {testimonials.map(testimonial => (
              <div
                key={testimonial.id}
                className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex items-center mb-6">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md ${
                      testimonial.id === 1
                        ? 'bg-gradient-to-br from-blue-500 to-blue-700'
                        : 'bg-gradient-to-br from-indigo-500 to-purple-600'
                    }`}
                  >
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h4 className="text-xl font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-blue-600 font-medium">{testimonial.role}</p>
                  </div>
                </div>
                <div className="relative">
                  <svg
                    className="absolute top-0 left-0 w-8 h-8 text-blue-100 transform -translate-x-6 -translate-y-6"
                    fill="currentColor"
                    viewBox="0 0 32 32"
                  >
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                  </svg>
                  <p className="text-gray-700 font-medium italic relative z-10 leading-relaxed">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                  <div className="mt-4 flex items-center">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
      </div>

      {/* 合作伙伴部分 */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-blue-800 uppercase bg-blue-100 rounded-full">
              企业合作
            </span>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">全球战略合作伙伴</h2>
            <p className="text-gray-700 font-medium max-w-2xl mx-auto">
              我们与行业领先企业合作，为学生提供全球认可的学位和实习机会
            </p>
          </div>
          <div className="flex justify-center items-center flex-wrap gap-8">
            <a href="#" className="h-16 hover:scale-110 transition-transform duration-300">
              <img src="/images/logos/google.svg" alt="Google" className="h-full object-contain" />
            </a>
            <a href="#" className="h-16 hover:scale-110 transition-transform duration-300">
              <img
                src="/images/logos/microsoft.svg"
                alt="Microsoft"
                className="h-full object-contain"
              />
            </a>
            <a href="#" className="h-16 hover:scale-110 transition-transform duration-300">
              <img src="/images/logos/amazon.svg" alt="Amazon" className="h-full object-contain" />
            </a>
            <a href="#" className="h-16 hover:scale-110 transition-transform duration-300">
              <img src="/images/logos/apple.svg" alt="Apple" className="h-full object-contain" />
            </a>
            <a href="#" className="h-16 hover:scale-110 transition-transform duration-300">
              <img src="/images/logos/meta.svg" alt="Meta" className="h-full object-contain" />
            </a>
            <a href="#" className="h-16 hover:scale-110 transition-transform duration-300">
              <img src="/images/logos/ibm.svg" alt="IBM" className="h-full object-contain" />
            </a>
          </div>
        </div>
      </div>

      {/* CTA部分 */}
      <div
        className="relative py-20 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, rgba(62, 134, 204, 0.4) 0%, rgba(31, 90, 152, 0.5) 100%)`,
        }}
      >
        <div className="absolute inset-0 opacity-30">
          <svg className="h-full w-full" viewBox="0 0 800 800">
            <path
              fill="#ffffff"
              d="M769 229L1037 260.9M927 880L731 737 520 660 309 538 40 599 295 764 126.5 879.5 40 599-197 493 102 382-31 229 126.5 79.5-69-63"
            ></path>
            <path fill="#ffffff" d="M-31 229L237 261 390 382 731 737M635 240L795 161"></path>
            <path fill="#ffffff" d="M170 348L-31 229"></path>
            <path fill="#ffffff" d="M520 660L309 538"></path>
            <path fill="#ffffff" d="M898 380.5L827 450.5"></path>
          </svg>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <span className="inline-block px-3 py-1 mb-6 text-xs font-semibold tracking-wider text-blue-800 uppercase bg-white rounded-full shadow-sm">
              {t('homePage.cta.action', '现在就行动')}
            </span>
            <h2 className="text-4xl font-extrabold mb-6 text-white drop-shadow-lg">
              {t('homePage.cta.title')}
            </h2>
            <p className="text-xl max-w-2xl mx-auto mb-10 text-white opacity-90 drop-shadow-md">
              {t('homePage.cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link
                to="/courses/apply"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white rounded-lg shadow-xl text-xl font-bold text-[#3e86cc] bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-colors duration-300"
              >
                {t('homePage.cta.applyNow')}
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white rounded-lg shadow-xl text-xl font-bold text-white bg-white/20 backdrop-blur-sm hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-colors duration-300"
              >
                {t('homePage.cta.contactUs')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
