import React from 'react';

const NewsAndAlumni = () => {
  // Sample news data
  const newsArticles = [
    {
      id: 1,
      title: 'Global Horizon University Hosts International Leadership Webinar',
      date: 'June 15, 2023',
      summary:
        'Our recent webinar on global leadership brought together industry experts and academics from around the world, discussing emerging challenges in an interconnected business landscape.',
      image:
        'https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 2,
      title: 'New Professional Certificate Programs Announced',
      date: 'May 22, 2023',
      summary:
        'Global Horizon University is proud to announce the launch of five new professional certificate programs designed to meet the evolving demands of the global job market.',
      image:
        'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 3,
      title: 'Student Success Rate Reaches New Heights',
      date: 'April 10, 2023',
      summary:
        'Our latest graduate employment survey shows that 93% of Global Horizon University graduates secure relevant employment within six months of completing their studies.',
      image:
        'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    },
  ];

  // Sample alumni data
  const alumniStories = [
    {
      id: 1,
      name: 'Jane Smith',
      program: 'MBA',
      graduationYear: '2018',
      currentRole: 'CEO at TechVision Solutions',
      story:
        'The flexible MBA program at Global Horizon University allowed me to continue working while advancing my education. The knowledge and network I gained were instrumental in my journey to becoming a tech CEO.',
      image:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 2,
      name: 'Michael Zhang',
      program: 'BSc in Computer Science',
      graduationYear: '2019',
      currentRole: 'Senior Software Engineer at GlobalTech',
      story:
        'My degree from GHU prepared me with both theoretical knowledge and practical skills. The project-based learning approach gave me confidence to tackle real-world challenges in the tech industry.',
      image:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 3,
      name: 'Sarah Johnson',
      program: 'Certificate in Digital Marketing',
      graduationYear: '2020',
      currentRole: 'Marketing Director at InnovateNow',
      story:
        'The professional certificate program gave me specialized skills that immediately translated to career advancement. Within months of completing my certificate, I secured a promotion to director level.',
      image:
        'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    },
  ];

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* News Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-900">Latest News</h2>
            <p className="mt-4 text-lg text-gray-600">
              Stay updated with the latest happenings at Global Horizon University
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {newsArticles.map(article => (
              <div
                key={article.id}
                className="bg-white rounded-lg overflow-hidden shadow-md transition duration-300 hover:shadow-lg"
              >
                <img src={article.image} alt={article.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <p className="text-sm text-blue-600 font-medium mb-2">{article.date}</p>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{article.title}</h3>
                  <p className="text-gray-600 mb-4">{article.summary}</p>
                  <button className="text-blue-600 font-medium hover:text-blue-800 transition duration-300">
                    Read More →
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button className="px-6 py-2 border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition duration-300">
              View All News
            </button>
          </div>
        </section>

        {/* Alumni Section */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-900">Alumni Success Stories</h2>
            <p className="mt-4 text-lg text-gray-600">
              Discover how our graduates are making an impact around the world
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {alumniStories.map(alumni => (
              <div
                key={alumni.id}
                className="bg-white rounded-lg overflow-hidden shadow-md transition duration-300 hover:shadow-lg"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={alumni.image}
                    alt={alumni.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{alumni.name}</h3>
                  <p className="text-blue-600 font-medium mb-2">{alumni.currentRole}</p>
                  <div className="mb-4 text-sm text-gray-500">
                    <span>
                      {alumni.program}, Class of {alumni.graduationYear}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">"{alumni.story}"</p>
                  <button className="text-blue-600 font-medium hover:text-blue-800 transition duration-300">
                    Read Full Story →
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button className="px-6 py-2 border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition duration-300">
              View More Alumni Stories
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default NewsAndAlumni;
