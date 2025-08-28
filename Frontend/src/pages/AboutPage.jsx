import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div className="about-page">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About LocalsLocalMarket</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connecting local businesses with their communities through innovative marketplace solutions.
          </p>
        </div>

        {/* Mission Section */}
        <div className="mb-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-700 mb-4">
                At LocalsLocalMarket, we believe in the power of local commerce. Our mission is to 
                create a vibrant digital marketplace that strengthens the connection between local 
                businesses and their communities.
              </p>
              <p className="text-lg text-gray-700 mb-4">
                We provide innovative tools and platforms that help small businesses thrive in the 
                digital age while maintaining the personal touch that makes local shopping special.
              </p>
              <p className="text-lg text-gray-700">
                By fostering these connections, we're not just building a marketplace—we're building 
                stronger, more resilient communities.
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-100 to-blue-100 p-8 rounded-lg">
              <div className="text-center">
                <div className="text-6xl mb-4">🏪</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Supporting Local Business</h3>
                <p className="text-gray-600">
                  Every transaction helps keep money in your community
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Community First</h3>
              <p className="text-gray-600">
                We prioritize the needs of local communities and businesses, ensuring our platform 
                serves as a bridge between neighbors and local entrepreneurs.
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Innovation</h3>
              <p className="text-gray-600">
                We continuously develop cutting-edge solutions that make local commerce more 
                accessible, efficient, and enjoyable for everyone involved.
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="text-4xl mb-4">🌱</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Sustainability</h3>
              <p className="text-gray-600">
                We're committed to building a sustainable ecosystem that supports local economies 
                and reduces environmental impact through local commerce.
              </p>
            </div>
          </div>
        </div>

        {/* Story Section */}
        <div className="mb-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="bg-gradient-to-br from-green-100 to-blue-100 p-8 rounded-lg">
              <div className="text-center">
                <div className="text-6xl mb-4">📖</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Our Story</h3>
                <p className="text-gray-600">
                  From a small idea to a growing community platform
                </p>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">How It All Started</h2>
              <p className="text-lg text-gray-700 mb-4">
                LocalsLocalMarket was born from a simple observation: local businesses were 
                struggling to compete in an increasingly digital world, while communities were 
                losing the personal connections that make local shopping special.
              </p>
              <p className="text-lg text-gray-700 mb-4">
                Our founders recognized that technology could be used to strengthen, rather than 
                replace, these local connections. They set out to create a platform that would 
                make it easier for local businesses to reach their communities while preserving 
                the personal touch that makes local commerce unique.
              </p>
              <p className="text-lg text-gray-700">
                Today, we're proud to serve communities across the country, helping local 
                businesses thrive and communities stay connected.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-4xl text-white font-bold">JD</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">John Doe</h3>
              <p className="text-gray-600 mb-2">CEO & Founder</p>
              <p className="text-sm text-gray-500">
                Passionate about local commerce and community building
              </p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-4xl text-white font-bold">JS</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Jane Smith</h3>
              <p className="text-gray-600 mb-2">CTO</p>
              <p className="text-sm text-gray-500">
                Technology enthusiast focused on scalable solutions
              </p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-orange-400 to-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-4xl text-white font-bold">MJ</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Mike Johnson</h3>
              <p className="text-gray-600 mb-2">Head of Business Development</p>
              <p className="text-sm text-gray-500">
                Building partnerships and growing our community
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8 rounded-lg">
          <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
          <p className="text-xl mb-6">
            Whether you're a local business owner or a community member, 
            we'd love to have you be part of our growing family.
          </p>
          <div className="space-x-4">
            <Link 
              to="/register" 
              className="inline-block bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Register Your Shop
            </Link>
            <Link 
              to="/contact" 
              className="inline-block border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
