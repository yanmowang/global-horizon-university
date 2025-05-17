import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CommunityForum = () => {
  // 模拟论坛主题数据
  const [forumTopics, setForumTopics] = useState([
    {
      id: 1,
      title: 'Tips for successfully completing online courses',
      author: 'Sarah Johnson',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      date: '2023-08-15',
      replies: 24,
      views: 156,
      category: 'Study Tips',
      excerpt:
        'Online learning requires different strategies than traditional classroom learning. Here are some tips that helped me succeed...',
    },
    {
      id: 2,
      title: 'How to prepare for the Global Business certification exam',
      author: 'Michael Chen',
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
      date: '2023-08-10',
      replies: 18,
      views: 112,
      category: 'Certifications',
      excerpt:
        'I recently passed the Global Business certification with a high score. My preparation included studying these resources...',
    },
    {
      id: 3,
      title: 'Seeking study group for Data Science program',
      author: 'Aisha Patel',
      avatar: 'https://randomuser.me/api/portraits/women/63.jpg',
      date: '2023-08-05',
      replies: 32,
      views: 204,
      category: 'Study Groups',
      excerpt:
        "I'm starting the Data Science program next month and would like to connect with fellow students for a study group...",
    },
    {
      id: 4,
      title: 'Resources for improving academic writing skills',
      author: 'James Wilson',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      date: '2023-08-02',
      replies: 27,
      views: 189,
      category: 'Academic Skills',
      excerpt:
        'Academic writing can be challenging. Here are some resources that have helped me improve my writing skills...',
    },
    {
      id: 5,
      title: 'Career opportunities after completing the Cybersecurity certificate',
      author: 'Emma Rodriguez',
      avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
      date: '2023-07-29',
      replies: 15,
      views: 148,
      category: 'Career Development',
      excerpt:
        "I'm considering the Cybersecurity certificate program and would like to know about job opportunities and career paths...",
    },
  ]);

  // 模拟论坛分类数据
  const categories = [
    { id: 1, name: 'Study Tips', count: 42 },
    { id: 2, name: 'Certifications', count: 37 },
    { id: 3, name: 'Study Groups', count: 28 },
    { id: 4, name: 'Academic Skills', count: 35 },
    { id: 5, name: 'Career Development', count: 31 },
    { id: 6, name: 'Student Life', count: 24 },
    { id: 7, name: 'Technical Support', count: 19 },
  ];

  // 模拟活跃用户数据
  const activeUsers = [
    {
      id: 1,
      name: 'Sarah Johnson',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      posts: 56,
    },
    {
      id: 2,
      name: 'Michael Chen',
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
      posts: 48,
    },
    {
      id: 3,
      name: 'Aisha Patel',
      avatar: 'https://randomuser.me/api/portraits/women/63.jpg',
      posts: 42,
    },
    {
      id: 4,
      name: 'James Wilson',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      posts: 38,
    },
    {
      id: 5,
      name: 'Emma Rodriguez',
      avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
      posts: 35,
    },
  ];

  // 过滤器状态
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest');

  // 处理搜索
  const handleSearch = e => {
    e.preventDefault();
    // 实际应用中这里会调用API进行搜索
    console.log(`Searching for: ${searchQuery}`);
  };

  // 过滤主题
  const filteredTopics = forumTopics.filter(topic => {
    if (selectedCategory !== 'All' && topic.category !== selectedCategory) {
      return false;
    }
    if (searchQuery && !topic.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  // 排序主题
  const sortedTopics = [...filteredTopics].sort((a, b) => {
    if (sortBy === 'latest') {
      return new Date(b.date) - new Date(a.date);
    } else if (sortBy === 'popular') {
      return b.replies - a.replies;
    } else if (sortBy === 'views') {
      return b.views - a.views;
    }
    return 0;
  });

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* 页面标题 */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white text-center">Community Forum</h1>
          <p className="mt-4 text-xl text-gray-200 text-center max-w-3xl mx-auto">
            Connect with fellow students, share knowledge, ask questions, and participate in
            discussions
          </p>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 左侧边栏 */}
          <div className="lg:w-1/4">
            {/* 创建新主题按钮 */}
            <div className="mb-8">
              <Link
                to="/community/new-topic"
                className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg
                  className="h-5 w-5 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create New Topic
              </Link>
            </div>

            {/* 分类 */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
              <ul className="space-y-2">
                <li className="flex justify-between items-center">
                  <button
                    onClick={() => setSelectedCategory('All')}
                    className={`text-base ${selectedCategory === 'All' ? 'font-semibold text-blue-900' : 'text-gray-700 hover:text-blue-900'}`}
                  >
                    All Topics
                  </button>
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs">
                    {forumTopics.length}
                  </span>
                </li>
                {categories.map(category => (
                  <li key={category.id} className="flex justify-between items-center">
                    <button
                      onClick={() => setSelectedCategory(category.name)}
                      className={`text-base ${selectedCategory === category.name ? 'font-semibold text-blue-900' : 'text-gray-700 hover:text-blue-900'}`}
                    >
                      {category.name}
                    </button>
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs">
                      {category.count}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 活跃用户 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Members</h3>
              <ul className="space-y-4">
                {activeUsers.map(user => (
                  <li key={user.id} className="flex items-center">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-10 w-10 rounded-full mr-3"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.posts} posts</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 主内容区 */}
          <div className="lg:w-3/4">
            {/* 搜索和筛选栏 */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <form onSubmit={handleSearch} className="relative w-full sm:w-96">
                <input
                  type="text"
                  placeholder="Search topics..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                <div className="absolute left-3 top-2.5">
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
              </form>
              <div className="flex space-x-2">
                <label htmlFor="sort" className="sr-only">
                  Sort by
                </label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="latest">Latest</option>
                  <option value="popular">Most Replies</option>
                  <option value="views">Most Views</option>
                </select>
              </div>
            </div>

            {/* 主题列表 */}
            <div className="space-y-4">
              {sortedTopics.length > 0 ? (
                sortedTopics.map(topic => (
                  <div
                    key={topic.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <Link
                            to={`/community/topic/${topic.id}`}
                            className="text-xl font-semibold text-blue-900 hover:text-blue-700 mb-2 block"
                          >
                            {topic.title}
                          </Link>
                          <p className="text-gray-600 mb-4">{topic.excerpt}</p>
                          <div className="flex items-center text-sm text-gray-500">
                            <span className="inline-flex bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs font-medium mr-4">
                              {topic.category}
                            </span>
                            <span className="flex items-center mr-4">
                              <svg
                                className="h-4 w-4 mr-1"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                />
                              </svg>
                              {topic.replies} replies
                            </span>
                            <span className="flex items-center">
                              <svg
                                className="h-4 w-4 mr-1"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                              {topic.views} views
                            </span>
                          </div>
                        </div>
                        <div className="ml-4 flex-shrink-0 flex flex-col items-end">
                          <div className="flex items-center mb-2">
                            <img
                              src={topic.avatar}
                              alt={topic.author}
                              className="h-8 w-8 rounded-full mr-2"
                            />
                            <span className="text-sm font-medium text-gray-900">
                              {topic.author}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(topic.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <svg
                    className="h-12 w-12 text-gray-400 mx-auto mb-4"
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
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No topics found</h3>
                  <p className="text-gray-500">
                    {searchQuery
                      ? `No topics matching "${searchQuery}" found.`
                      : 'No topics in this category yet. Be the first to start a discussion!'}
                  </p>
                  <Link
                    to="/community/new-topic"
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Create New Topic
                  </Link>
                </div>
              )}
            </div>

            {/* 分页 */}
            <div className="mt-8 flex justify-center">
              <nav className="flex items-center justify-between">
                <div className="flex-1 flex justify-between sm:hidden">
                  <a
                    href="#"
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Previous
                  </a>
                  <a
                    href="#"
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Next
                  </a>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-center">
                  <div>
                    <nav
                      className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                      aria-label="Pagination"
                    >
                      <a
                        href="#"
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                      >
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
                      </a>
                      <a
                        href="#"
                        aria-current="page"
                        className="z-10 bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                      >
                        1
                      </a>
                      <a
                        href="#"
                        className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                      >
                        2
                      </a>
                      <a
                        href="#"
                        className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                      >
                        3
                      </a>
                      <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                        ...
                      </span>
                      <a
                        href="#"
                        className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                      >
                        8
                      </a>
                      <a
                        href="#"
                        className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                      >
                        9
                      </a>
                      <a
                        href="#"
                        className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                      >
                        10
                      </a>
                      <a
                        href="#"
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                      >
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
                      </a>
                    </nav>
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityForum;
