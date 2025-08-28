import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SupportPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Topics' },
    { id: 'getting-started', name: 'Getting Started' },
    { id: 'account', name: 'Account & Billing' },
    { id: 'technical', name: 'Technical Issues' },
    { id: 'features', name: 'Features & Tools' }
  ];

  const faqs = [
    {
      id: 1,
      category: 'getting-started',
      question: 'How do I create my first shop?',
      answer: 'Creating your first shop is easy! Simply click on "Register Shop" in the header, fill out the required information including your business details, upload some photos, and you\'ll be live in minutes. Our step-by-step wizard will guide you through the entire process.'
    },
    {
      id: 2,
      category: 'getting-started',
      question: 'What information do I need to register my shop?',
      answer: 'You\'ll need your business name, description, contact information, address, business hours, and some photos of your products or services. We also recommend having your business license or registration number handy.'
    },
    {
      id: 3,
      category: 'account',
      question: 'How do I update my shop information?',
      answer: 'You can update your shop information anytime by logging into your dashboard and navigating to the "Settings" section. From there, you can edit your profile, business hours, contact information, and more.'
    },
    {
      id: 4,
      category: 'account',
      question: 'Can I have multiple shops under one account?',
      answer: 'Yes! If you own multiple businesses, you can create separate shop profiles for each one. Each shop will have its own unique URL and can be managed independently from your main dashboard.'
    },
    {
      id: 5,
      category: 'technical',
      question: 'My shop isn\'t showing up in search results. What should I do?',
      answer: 'Make sure your shop profile is complete with all required information, including a detailed description and relevant keywords. Also, ensure your business hours are accurate and your location is properly set. If the issue persists, contact our support team.'
    },
    {
      id: 6,
      category: 'technical',
      question: 'How do I upload photos to my shop?',
      answer: 'You can upload photos through your dashboard in the "Media" section. We support JPG, PNG, and WebP formats. For best results, use high-quality images that showcase your products or services clearly.'
    },
    {
      id: 7,
      category: 'features',
      question: 'Can customers contact me directly through the platform?',
      answer: 'Yes! Customers can contact you through the contact form on your shop page, and you\'ll receive these messages in your dashboard. You can also enable direct messaging for real-time communication.'
    },
    {
      id: 8,
      category: 'features',
      question: 'How do I respond to customer reviews?',
      answer: 'You can respond to customer reviews directly from your dashboard. Navigate to the "Reviews" section, find the review you want to respond to, and click "Reply". Your response will be visible to all visitors.'
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const popularArticles = [
    {
      title: 'Getting Started Guide',
      description: 'Complete guide to setting up your first shop',
      category: 'Getting Started',
      readTime: '5 min read'
    },
    {
      title: 'Optimizing Your Shop Profile',
      description: 'Tips to make your shop more discoverable',
      category: 'Features',
      readTime: '3 min read'
    },
    {
      title: 'Managing Customer Reviews',
      description: 'Best practices for handling customer feedback',
      category: 'Features',
      readTime: '4 min read'
    }
  ];

  return (
    <div className="support-page">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">How Can We Help?</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find answers to common questions, learn how to use our platform, and get the support you need.
          </p>
        </div>

        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for help articles, FAQs, or topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
            />
            <svg className="absolute right-4 top-4 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Quick Help Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Help Center</h3>
            <p className="text-gray-600 mb-4">
              Browse our comprehensive help articles and tutorials
            </p>
            <Link to="#help-center" className="text-purple-600 hover:text-purple-700 font-medium">
              Browse Articles →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">FAQ</h3>
            <p className="text-gray-600 mb-4">
              Find quick answers to frequently asked questions
            </p>
            <Link to="#faq" className="text-purple-600 hover:text-purple-700 font-medium">
              View FAQs →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Contact Support</h3>
            <p className="text-gray-600 mb-4">
              Get in touch with our support team for personalized help
            </p>
            <Link to="/contact" className="text-purple-600 hover:text-purple-700 font-medium">
              Contact Us →
            </Link>
          </div>
        </div>

        {/* Popular Articles */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Popular Help Articles</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {popularArticles.map((article, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm bg-purple-100 text-purple-600 px-2 py-1 rounded">
                    {article.category}
                  </span>
                  <span className="text-sm text-gray-500">{article.readTime}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{article.title}</h3>
                <p className="text-gray-600 mb-4">{article.description}</p>
                <Link to="#" className="text-purple-600 hover:text-purple-700 font-medium">
                  Read Article →
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div id="faq" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600">
                Try adjusting your search terms or category filter.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFaqs.map(faq => (
                <div key={faq.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Contact Support */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8 rounded-lg text-center">
          <h2 className="text-3xl font-bold mb-4">Still Need Help?</h2>
          <p className="text-xl mb-6">
            Our support team is here to help you succeed. Get in touch and we'll respond within 24 hours.
          </p>
          <div className="space-x-4">
            <Link
              to="/contact"
              className="inline-block bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Contact Support
            </Link>
            <a
              href="mailto:support@localslocalmarket.com"
              className="inline-block border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors"
            >
              Email Us
            </a>
          </div>
        </div>

        {/* Support Hours */}
        <div className="mt-12 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Support Hours</h3>
          <p className="text-gray-600">
            Monday - Friday: 9:00 AM - 6:00 PM EST<br />
            Saturday: 10:00 AM - 4:00 PM EST<br />
            Sunday: Closed
          </p>
          <p className="text-sm text-gray-500 mt-2">
            For urgent technical issues, email support@localslocalmarket.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
