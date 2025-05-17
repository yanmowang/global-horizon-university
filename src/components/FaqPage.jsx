import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// FAQ数据
const faqData = [
  {
    category: '入学申请',
    questions: [
      {
        id: 1,
        question: '如何申请贵校的课程？',
        answer:
          '您可以通过我们的网站在线申请，或者联系我们的招生办公室。申请过程包括填写申请表、提交学术成绩单和其他相关文件。详细信息请访问我们的申请页面或联系招生顾问。',
      },
      {
        id: 2,
        question: '申请需要哪些材料？',
        answer:
          '一般来说，您需要提供以下材料：完整的申请表、学历证书和成绩单的公证副本、语言能力证明（如TOEFL或IELTS成绩）、个人陈述/动机信、推荐信和身份证明文件。具体要求可能因课程而异。',
      },
      {
        id: 3,
        question: '入学申请有截止日期吗？',
        answer:
          '是的，我们的课程有申请截止日期。一般来说，秋季学期的申请截止日期是6月30日，春季学期的申请截止日期是11月30日。但我们建议尽早申请，因为某些热门课程名额有限。',
      },
      {
        id: 4,
        question: '国际学生需要满足哪些额外要求？',
        answer:
          '国际学生除了常规申请材料外，还需要提供英语语言能力证明（如TOEFL或IELTS成绩）、财务证明以及有效护照。某些国家的学生可能还需要提供额外的文件。我们的国际学生办公室可以提供更多帮助。',
      },
    ],
  },
  {
    category: '课程与学位',
    questions: [
      {
        id: 5,
        question: '贵校提供哪些类型的课程和学位？',
        answer:
          '我们提供广泛的本科和硕士课程，涵盖商业管理、技术与计算机、医疗与健康、环境与可持续发展，以及人文与社会科学等领域。我们的课程设计旨在培养学生的全球视野和专业技能。',
      },
      {
        id: 6,
        question: '课程是全日制还是可以兼职学习？',
        answer:
          '我们提供全日制和兼职学习选项，以满足不同学生的需求。全日制学生通常每周参加20-25小时的课程，而兼职学生则可以根据自己的时间安排选择课程。部分课程还提供在线学习选项。',
      },
      {
        id: 7,
        question: '课程的授课语言是什么？',
        answer:
          '我们的大多数课程以英语授课。国际学生需要提供足够的英语水平证明，如TOEFL或IELTS成绩。我们也提供英语语言准备课程，帮助学生提升语言能力。',
      },
      {
        id: 8,
        question: '贵校的证书和学位是否被全球认可？',
        answer:
          '是的，我们的证书和学位获得全球多个国家和地区的认可。我们与国际教育机构合作，确保我们的学术标准符合全球要求，使毕业生能够在世界各地获得就业和继续深造的机会。',
      },
    ],
  },
  {
    category: '费用与奖学金',
    questions: [
      {
        id: 9,
        question: '学费是多少？',
        answer:
          '学费因课程而异。本科课程的年学费约为45,000-65,000元人民币，硕士课程的总学费约为54,000-65,000元人民币。国际学生可能需要支付额外的费用。详细的学费信息请访问我们的费用页面或联系财务办公室。',
      },
      {
        id: 10,
        question: '有哪些奖学金和资助选项？',
        answer:
          '我们提供多种奖学金和资助选项，包括学术优秀奖学金、需求基础资助和特殊才能奖学金。国际学生也可以申请特定的国际学生奖学金。详情请访问我们的奖学金页面，并注意申请截止日期。',
      },
      {
        id: 11,
        question: '如何申请奖学金？',
        answer:
          '奖学金申请通常与入学申请一起进行。学生需要填写单独的奖学金申请表，并可能需要提供额外的文件，如财务需求证明或特殊才能的证明。我们建议尽早申请，因为奖学金名额有限。',
      },
      {
        id: 12,
        question: '是否有分期付款的选项？',
        answer:
          '是的，我们提供学费分期付款选项。学生可以选择按学期或按月支付学费。申请分期付款需要填写相关表格并可能需要支付少量手续费。详情请联系我们的财务办公室。',
      },
    ],
  },
  {
    category: '学生生活',
    questions: [
      {
        id: 13,
        question: '贵校提供住宿吗？',
        answer:
          '是的，我们为学生提供校内宿舍和校外住宿帮助。校内宿舍类型包括单人间、双人间和套房，设施齐全。我们的住宿办公室还可以协助学生寻找校外住宿选项。建议尽早申请校内宿舍，因为名额有限。',
      },
      {
        id: 14,
        question: '有哪些学生社团和活动？',
        answer:
          '我们有丰富多样的学生社团和活动，包括学术社团、文化社团、体育俱乐部和艺术组织等。学生可以参加各种校园活动，如文化节、学术讲座、体育比赛和社区服务等。这些活动有助于学生发展社交网络和领导能力。',
      },
      {
        id: 15,
        question: '贵校有提供何种学生支持服务？',
        answer:
          '我们提供全面的学生支持服务，包括学术指导、职业规划、心理咨询、健康服务、国际学生支持等。我们致力于确保每位学生在学习期间获得必要的支持和指导，帮助他们取得学术成功和个人发展。',
      },
      {
        id: 16,
        question: '校园安全措施如何？',
        answer:
          '我们非常重视校园安全。校园配备24小时安保人员、监控系统和紧急求助电话。学生可以下载我们的校园安全应用，获取安全提醒和紧急联系信息。我们还定期举办安全培训和演习，确保学生了解紧急情况的应对措施。',
      },
    ],
  },
  {
    category: '证书与验证',
    questions: [
      {
        id: 17,
        question: '如何验证证书的真实性？',
        answer:
          '我们的证书采用区块链技术，确保其真实性和安全性。您可以通过我们的在线验证系统，输入证书上的唯一验证码进行验证。此外，您也可以联系我们的证书办公室进行人工验证。',
      },
      {
        id: 18,
        question: '如果证书丢失或损坏，如何申请补发？',
        answer:
          '如果您的证书丢失或损坏，可以通过我们的网站或直接联系证书办公室申请补发。补发证书需要提供身份证明和少量手续费。补发证书通常需要2-4周的处理时间。',
      },
      {
        id: 19,
        question: '毕业后可以获得哪些证书？',
        answer:
          '根据您完成的课程，您可以获得学士学位证书、硕士学位证书或专业证书。所有证书都包含安全特性和唯一验证码，并由校长和相关学院院长签名。部分课程可能还提供国际认证的附加证书。',
      },
      {
        id: 20,
        question: '证书的颁发流程是怎样的？',
        answer:
          '学生完成所有课程要求并通过最终评估后，学校将审核学生的学术记录。审核通过后，证书将在毕业典礼上颁发。无法参加毕业典礼的学生可以安排邮寄或在证书办公室领取。整个过程通常在最终成绩发布后4-6周完成。',
      },
    ],
  },
];

const FaqPage = () => {
  const [activeCategory, setActiveCategory] = useState('入学申请');
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  // 处理问题展开/折叠
  const toggleQuestion = questionId => {
    setExpandedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  // 过滤问题
  const filteredFaqs = searchQuery
    ? faqData
        .map(category => ({
          ...category,
          questions: category.questions.filter(
            q =>
              q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
              q.answer.toLowerCase().includes(searchQuery.toLowerCase())
          ),
        }))
        .filter(category => category.questions.length > 0)
    : faqData;

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">常见问题</h1>
          <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">
            找到您关于入学申请、课程信息和学生生活的问题答案。
          </p>
        </div>

        {/* 搜索框 */}
        <div className="max-w-xl mx-auto mb-12">
          <div className="relative">
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
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white shadow-sm focus:outline-none focus:ring-[#003087] focus:border-[#003087]"
              placeholder="搜索问题..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* 类别选择栏 */}
          {!searchQuery && (
            <div className="lg:w-1/4 mb-8 lg:mb-0 lg:pr-8">
              <div className="bg-white shadow rounded-lg overflow-hidden sticky top-6">
                <div className="px-4 py-5 sm:p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">问题分类</h2>
                  <div className="space-y-1">
                    {faqData.map(category => (
                      <button
                        key={category.category}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                          activeCategory === category.category
                            ? 'bg-[#003087] text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        onClick={() => setActiveCategory(category.category)}
                      >
                        {category.category}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FAQ 内容区域 */}
          <div className={searchQuery ? 'w-full' : 'lg:w-3/4'}>
            {searchQuery ? (
              // 搜索结果
              filteredFaqs.length > 0 ? (
                filteredFaqs.map(category => (
                  <div key={category.category} className="mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">{category.category}</h2>
                    <div className="space-y-4">
                      {category.questions.map(faq => (
                        <div key={faq.id} className="bg-white shadow overflow-hidden sm:rounded-lg">
                          <button
                            className="w-full text-left px-4 py-5 sm:p-6 flex justify-between items-start"
                            onClick={() => toggleQuestion(faq.id)}
                          >
                            <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                            <span className="ml-4 flex-shrink-0">
                              <svg
                                className={`h-5 w-5 transform ${expandedQuestions[faq.id] ? '-rotate-180' : 'rotate-0'}`}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </span>
                          </button>
                          {expandedQuestions[faq.id] && (
                            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                              <p className="text-base text-gray-500">{faq.answer}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
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
                  <h3 className="mt-2 text-lg font-medium text-gray-900">没有找到匹配的问题</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    请尝试其他搜索词，或浏览分类查看所有问题
                  </p>
                </div>
              )
            ) : (
              // 按分类显示
              faqData
                .filter(category => category.category === activeCategory)
                .map(category => (
                  <div key={category.category}>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">{category.category}</h2>
                    <div className="space-y-4">
                      {category.questions.map(faq => (
                        <div key={faq.id} className="bg-white shadow overflow-hidden sm:rounded-lg">
                          <button
                            className="w-full text-left px-4 py-5 sm:p-6 flex justify-between items-start"
                            onClick={() => toggleQuestion(faq.id)}
                          >
                            <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                            <span className="ml-4 flex-shrink-0">
                              <svg
                                className={`h-5 w-5 transform ${expandedQuestions[faq.id] ? '-rotate-180' : 'rotate-0'}`}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </span>
                          </button>
                          {expandedQuestions[faq.id] && (
                            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                              <p className="text-base text-gray-500">{faq.answer}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>

        {/* 联系我们区域 */}
        <div
          className="mt-16 bg-[#003087] rounded-lg shadow-lg overflow-hidden"
          style={{ backgroundColor: '#003087' }}
        >
          <div className="px-6 py-8 sm:p-10">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-white" style={{ color: 'white' }}>
                还有其他问题？
              </h2>
              <p className="mt-4 text-lg text-white max-w-3xl mx-auto" style={{ color: 'white' }}>
                如果您有其他问题或需要更详细的信息，请随时联系我们的支持团队，我们将很乐意为您提供帮助。
              </p>
              <div className="mt-8">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-[#003087] bg-white hover:bg-gray-50"
                  style={{ backgroundColor: 'white', color: '#003087' }}
                >
                  联系我们
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaqPage;
