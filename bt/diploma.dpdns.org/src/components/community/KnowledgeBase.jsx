import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const KnowledgeBase = () => {
  // 模拟知识文章数据
  const initialArticles = [
    {
      id: 1,
      title: 'Critical Thinking in Academic Research',
      category: 'Academic Skills',
      author: 'Dr. James Wilson',
      authorTitle: 'Professor of Philosophy',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      date: '2023-08-10',
      excerpt:
        'Critical thinking is a cornerstone of academic excellence. This article explores techniques to enhance critical thinking in research contexts.',
      readTime: '8 min read',
      likes: 145,
      image:
        'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    },
    {
      id: 2,
      title: 'Machine Learning: From Theory to Practice',
      category: 'Data Science',
      author: 'Dr. Maria Chen',
      authorTitle: 'AI Research Director',
      avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
      date: '2023-08-05',
      excerpt:
        'Understanding machine learning principles is essential for practical applications. This guide bridges the gap between theoretical concepts and real-world implementation.',
      readTime: '12 min read',
      likes: 203,
      image:
        'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80',
    },
    {
      id: 3,
      title: 'The Psychology of Effective Learning',
      category: 'Psychology',
      author: 'Dr. Sarah Johnson',
      authorTitle: 'Cognitive Psychologist',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      date: '2023-07-28',
      excerpt:
        'Explore the cognitive processes that facilitate effective learning and memory retention. Apply these insights to enhance your educational journey.',
      readTime: '10 min read',
      likes: 178,
      image:
        'https://images.unsplash.com/photo-1503428593586-e225b39bddfe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    },
    {
      id: 4,
      title: 'Sustainable Business Practices in Global Markets',
      category: 'Business',
      author: 'Prof. Robert Torres',
      authorTitle: 'International Business Consultant',
      avatar: 'https://randomuser.me/api/portraits/men/52.jpg',
      date: '2023-07-22',
      excerpt:
        'Implementing sustainable practices is no longer optional for global businesses. Learn about effective strategies and their long-term benefits.',
      readTime: '9 min read',
      likes: 132,
      image:
        'https://images.unsplash.com/photo-1444653614773-995cb1ef9efa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1176&q=80',
    },
    {
      id: 5,
      title: 'Digital Ethics in the Age of AI',
      category: 'Technology Ethics',
      author: 'Dr. Aisha Patel',
      authorTitle: 'Ethics in Technology Researcher',
      avatar: 'https://randomuser.me/api/portraits/women/63.jpg',
      date: '2023-07-15',
      excerpt:
        'As AI becomes increasingly integrated into our daily lives, ethical considerations around its development and use are more important than ever.',
      readTime: '11 min read',
      likes: 167,
      image:
        'https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1120&q=80',
    },
    {
      id: 6,
      title: 'Advanced Techniques in Academic Writing',
      category: 'Academic Skills',
      author: 'Dr. Elizabeth Brown',
      authorTitle: 'Professor of English Literature',
      avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
      date: '2023-07-08',
      excerpt:
        'Elevate your academic writing with advanced techniques in structure, argumentation, and style that will help your work stand out.',
      readTime: '14 min read',
      likes: 121,
      image:
        'https://images.unsplash.com/photo-1456513080867-f24f12e94d38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1073&q=80',
    },
  ];

  // 模拟知识分类数据
  const categories = [
    { id: 1, name: 'All', count: initialArticles.length },
    { id: 2, name: 'Academic Skills', count: 12 },
    { id: 3, name: 'Data Science', count: 8 },
    { id: 4, name: 'Psychology', count: 7 },
    { id: 5, name: 'Business', count: 10 },
    { id: 6, name: 'Technology Ethics', count: 6 },
    { id: 7, name: 'Research Methods', count: 9 },
    { id: 8, name: 'Career Development', count: 11 },
  ];

  // 状态
  const [articles, setArticles] = useState(initialArticles);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleArticles, setVisibleArticles] = useState(6); // 初始显示6篇文章

  // 处理搜索
  const handleSearch = e => {
    e.preventDefault();
    filterArticles();
  };

  // 过滤文章
  const filterArticles = () => {
    let filtered = initialArticles;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        article =>
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setArticles(filtered);
    setVisibleArticles(6); // 重置可见文章数量
  };

  // 选择分类
  const handleCategorySelect = category => {
    setSelectedCategory(category);
    setSearchQuery('');
    if (category === 'All') {
      setArticles(initialArticles);
    } else {
      setArticles(initialArticles.filter(article => article.category === category));
    }
    setVisibleArticles(6); // 重置可见文章数量
  };

  // 加载更多文章
  const loadMoreArticles = () => {
    setVisibleArticles(prev => prev + 6);
  };

  // 格式化日期
  const formatDate = dateString => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* 页面标题 */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white text-center">Knowledge Base</h1>
          <p className="mt-4 text-xl text-gray-200 text-center max-w-3xl mx-auto">
            Explore articles, research papers, and educational resources contributed by our
            community
          </p>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 搜索和过滤栏 */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <form onSubmit={handleSearch} className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search knowledge base..."
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
            <button
              type="submit"
              className="absolute right-2 top-2 p-1 text-blue-900 hover:text-blue-700"
            >
              Search
            </button>
          </form>

          <Link
            to="/community/knowledge/submit"
            className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Submit Knowledge
          </Link>
        </div>

        {/* 分类标签 */}
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => handleCategorySelect(category.name)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                selectedCategory === category.name
                  ? 'bg-blue-900 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category.name} {category.count > 0 && <span>({category.count})</span>}
            </button>
          ))}
        </div>

        {/* 知识文章网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.length > 0 ? (
            articles.slice(0, visibleArticles).map(article => (
              <div
                key={article.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {article.category}
                    </span>
                    <span className="text-xs text-gray-500">{article.readTime}</span>
                  </div>
                  <Link to={`/community/knowledge/${article.id}`} className="block">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-900 transition-colors duration-200">
                      {article.title}
                    </h3>
                  </Link>
                  <p className="text-gray-600 mb-4 line-clamp-3">{article.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img
                        src={article.avatar}
                        alt={article.author}
                        className="h-8 w-8 rounded-full mr-2"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{article.author}</p>
                        <p className="text-xs text-gray-500">{formatDate(article.date)}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <button className="flex items-center focus:outline-none">
                        <svg
                          className="h-5 w-5 text-red-500 mr-1"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {article.likes}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full bg-white rounded-lg shadow-md p-8 text-center">
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-500 mb-4">
                {searchQuery
                  ? `No articles matching "${searchQuery}" found.`
                  : 'No articles in this category yet.'}
              </p>
              <Link
                to="/community/knowledge/submit"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Submit Knowledge
              </Link>
            </div>
          )}
        </div>

        {/* 加载更多按钮 */}
        {articles.length > visibleArticles && (
          <div className="mt-12 text-center">
            <button
              onClick={loadMoreArticles}
              className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Load More
              <svg
                className="ml-2 -mr-1 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* 号召行动区 */}
      <div className="bg-blue-900 py-16 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Share Your Knowledge</h2>
          <p className="text-xl text-gray-200 mb-10 max-w-3xl mx-auto">
            Join our community of educators, researchers, and lifelong learners. Your expertise can
            help others on their educational journey.
          </p>
          <Link
            to="/community/knowledge/submit"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-blue-900 bg-white hover:bg-gray-100"
          >
            Contribute Now
            <svg
              className="ml-2 -mr-1 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBase;
