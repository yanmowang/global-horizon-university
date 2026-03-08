import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from './shared/Button';

// 模拟课程数据
const coursesData = [
  {
    id: 1,
    titleKey: 'coursesPage.courses.mba.title',
    categoryKey: 'coursesPage.categories.business',
    levelKey: 'coursesPage.levels.masters',
    duration: '24',
    price: '¥58,000',
    image: '/images/courses/course1.jpg',
    descriptionKey: 'coursesPage.courses.mba.description',
    highlightsKeys: [
      'coursesPage.courses.mba.highlights.1',
      'coursesPage.courses.mba.highlights.2',
      'coursesPage.courses.mba.highlights.3',
      'coursesPage.courses.mba.highlights.4',
      'coursesPage.courses.mba.highlights.5',
    ],
  },
  {
    id: 2,
    titleKey: 'coursesPage.courses.ai.title',
    categoryKey: 'coursesPage.categories.technology',
    levelKey: 'coursesPage.levels.masters',
    duration: '18',
    price: '¥62,000',
    image: '/images/courses/course2.jpg',
    descriptionKey: 'coursesPage.courses.ai.description',
    highlightsKeys: [
      'coursesPage.courses.ai.highlights.1',
      'coursesPage.courses.ai.highlights.2',
      'coursesPage.courses.ai.highlights.3',
      'coursesPage.courses.ai.highlights.4',
      'coursesPage.courses.ai.highlights.5',
    ],
  },
  {
    id: 3,
    titleKey: 'coursesPage.courses.health.title',
    categoryKey: 'coursesPage.categories.healthcare',
    levelKey: 'coursesPage.levels.masters',
    duration: '24',
    price: '¥56,000',
    image: '/images/courses/course3.jpg',
    descriptionKey: 'coursesPage.courses.health.description',
    highlightsKeys: [
      'coursesPage.courses.health.highlights.1',
      'coursesPage.courses.health.highlights.2',
      'coursesPage.courses.health.highlights.3',
      'coursesPage.courses.health.highlights.4',
      'coursesPage.courses.health.highlights.5',
    ],
  },
  {
    id: 4,
    titleKey: 'coursesPage.courses.finance.title',
    categoryKey: 'coursesPage.categories.business',
    levelKey: 'coursesPage.levels.masters',
    duration: '18',
    price: '¥65,000',
    image: '/images/courses/course4.jpg',
    descriptionKey: 'coursesPage.courses.finance.description',
    highlightsKeys: [
      'coursesPage.courses.finance.highlights.1',
      'coursesPage.courses.finance.highlights.2',
      'coursesPage.courses.finance.highlights.3',
      'coursesPage.courses.finance.highlights.4',
      'coursesPage.courses.finance.highlights.5',
    ],
  },
  {
    id: 5,
    titleKey: 'coursesPage.courses.environment.title',
    categoryKey: 'coursesPage.categories.environment',
    levelKey: 'coursesPage.levels.masters',
    duration: '24',
    price: '¥54,000',
    image: '/images/courses/course5.jpg',
    descriptionKey: 'coursesPage.courses.environment.description',
    highlightsKeys: [
      'coursesPage.courses.environment.highlights.1',
      'coursesPage.courses.environment.highlights.2',
      'coursesPage.courses.environment.highlights.3',
      'coursesPage.courses.environment.highlights.4',
      'coursesPage.courses.environment.highlights.5',
    ],
  },
  {
    id: 6,
    titleKey: 'coursesPage.courses.culture.title',
    categoryKey: 'coursesPage.categories.humanities',
    levelKey: 'coursesPage.levels.bachelors',
    duration: '36',
    price: '¥45,000/年',
    image: '/images/courses/course6.jpg',
    descriptionKey: 'coursesPage.courses.culture.description',
    highlightsKeys: [
      'coursesPage.courses.culture.highlights.1',
      'coursesPage.courses.culture.highlights.2',
      'coursesPage.courses.culture.highlights.3',
      'coursesPage.courses.culture.highlights.4',
      'coursesPage.courses.culture.highlights.5',
    ],
  },
];

const CoursesPage = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');

  // Generate localized course data
  const localizedCoursesData = coursesData.map(course => ({
    ...course,
    title: t(course.titleKey),
    category: t(course.categoryKey),
    level: t(course.levelKey),
    description: t(course.descriptionKey),
    highlights: course.highlightsKeys.map(key => t(key)),
  }));

  // 提取所有课程分类
  const categories = ['all', ...new Set(localizedCoursesData.map(course => course.category))];

  // 提取所有课程级别
  const levels = ['all', ...new Set(localizedCoursesData.map(course => course.level))];

  // 筛选课程
  const filteredCourses = localizedCoursesData.filter(course => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;

    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 页面标题 */}
        <div className="bg-white pt-16 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
                {t('coursesPage.title')}
              </h1>
              <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-900 sm:mt-4">
                {t('coursesPage.subtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* 筛选器部分 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              {/* 搜索 */}
              <div className="sm:col-span-6 md:col-span-2">
                <label htmlFor="search" className="block text-sm font-medium text-gray-900">
                  {t('coursesPage.filters.searchLabel')}
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="search"
                    id="search"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder={t('coursesPage.filters.searchPlaceholder')}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* 分类筛选 */}
              <div className="sm:col-span-6 md:col-span-2">
                <label htmlFor="category" className="block text-sm font-medium text-gray-900">
                  {t('coursesPage.filters.categoryLabel')}
                </label>
                <div className="mt-1">
                  <select
                    id="category"
                    name="category"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}
                  >
                    <option value="">{t('coursesPage.filters.allCategories')}</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === 'all' ? t('coursesPage.filters.allCategories') : category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 级别筛选 */}
              <div className="sm:col-span-6 md:col-span-2">
                <label htmlFor="level" className="block text-sm font-medium text-gray-900">
                  {t('coursesPage.filters.levelLabel')}
                </label>
                <div className="mt-1">
                  <select
                    id="level"
                    name="level"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={selectedLevel}
                    onChange={e => setSelectedLevel(e.target.value)}
                  >
                    <option value="">{t('coursesPage.filters.allLevels')}</option>
                    {levels.map(level => (
                      <option key={level} value={level}>
                        {level === 'all' ? t('coursesPage.filters.allLevels') : level}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 课程列表 */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map(course => (
            <div
              key={course.id}
              className="bg-white overflow-hidden shadow-md rounded-lg flex flex-col"
            >
              <div className="h-48 overflow-hidden">
                <img className="w-full h-full object-cover" src={course.image} alt={course.title} />
              </div>
              <div className="p-6 flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{course.title}</h3>
                    <p className="mt-1 text-sm text-gray-700 font-medium">{course.category}</p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-[#003087]">
                    {course.level}
                  </span>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <svg
                        className="h-5 w-5 text-gray-600 mr-1"
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
                      <span>
                        {course.duration} {t('coursesPage.monthsUnit')}
                      </span>
                    </div>
                    <span className="font-medium text-[#003087]">{course.price}</span>
                  </div>
                </div>
                <p className="mt-3 text-sm text-gray-700 font-medium line-clamp-3">
                  {course.description}
                </p>
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-900">
                    {t('coursesPage.highlightsLabel')}：
                  </h4>
                  <ul className="mt-2 space-y-1">
                    {course.highlights.slice(0, 3).map((highlight, index) => (
                      <li key={index} className="flex items-start">
                        <svg
                          className="h-5 w-5 text-green-600 mr-1 flex-shrink-0"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          style={{ color: '#047857' }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-sm text-gray-800">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50">
                <Button to={`/courses/${course.id}`} variant="primary" fullWidth>
                  {t('coursesPage.viewDetails')}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* 如果没有找到匹配的课程 */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">{t('coursesPage.noCourses')}</h3>
            <p className="mt-1 text-sm text-gray-500">{t('coursesPage.tryDifferentSearch')}</p>
            <div className="mt-6">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#003087] hover:bg-blue-900 focus:outline-none"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedLevel('all');
                }}
              >
                {t('coursesPage.resetFilters')}
              </button>
            </div>
          </div>
        )}

        {/* 联系我们部分 */}
        <div className="mt-16 bg-[#003087] rounded-lg shadow-xl overflow-hidden">
          <div className="pt-10 pb-12 px-6 sm:pt-16 sm:px-16 lg:py-16 lg:pr-0 xl:py-20 xl:px-20">
            <div className="lg:self-center">
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                <span className="block text-white font-bold">
                  {t('coursesPage.contactSection.title')}
                </span>
              </h2>
              <p className="mt-4 text-lg leading-6 text-white opacity-90">
                {t('coursesPage.contactSection.description')}
              </p>
              <Link
                to="/contact"
                className="mt-8 bg-white border border-transparent rounded-md shadow-lg py-3 px-6 inline-flex items-center text-xl font-bold text-[#003087] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-colors"
              >
                {t('coursesPage.contactSection.button')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
