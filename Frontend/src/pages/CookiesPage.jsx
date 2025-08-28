import React from 'react';

const CookiesPage = () => {
  return (
    <div className="cookies-page">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Cookie Policy</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Learn about how we use cookies and similar technologies to enhance your experience.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <div className="bg-white p-8 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What Are Cookies?</h2>
            <p className="text-gray-700 mb-4">
              Cookies are small text files that are stored on your device (computer, tablet, or mobile) 
              when you visit our website. They help us provide you with a better experience by remembering 
              your preferences and analyzing how you use our site.
            </p>
            <p className="text-gray-700">
              This Cookie Policy explains what cookies we use, why we use them, and how you can control them.
            </p>
          </div>

          {/* Types of Cookies */}
          <div className="bg-white p-8 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Types of Cookies We Use</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Essential Cookies</h3>
                <p className="text-gray-700 mb-2">
                  These cookies are necessary for the website to function properly. They enable basic 
                  functions like page navigation, access to secure areas, and form submissions.
                </p>
                <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                  <li>Authentication cookies to keep you logged in</li>
                  <li>Security cookies to protect against fraud</li>
                  <li>Session cookies to maintain your browsing session</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Performance Cookies</h3>
                <p className="text-gray-700 mb-2">
                  These cookies help us understand how visitors interact with our website by collecting 
                  and reporting information anonymously.
                </p>
                <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                  <li>Google Analytics cookies to track page views and user behavior</li>
                  <li>Performance monitoring cookies to identify and fix issues</li>
                  <li>Error tracking cookies to improve site reliability</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Functional Cookies</h3>
                <p className="text-gray-700 mb-2">
                  These cookies enable enhanced functionality and personalization, such as remembering 
                  your preferences and settings.
                </p>
                <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                  <li>Language preference cookies</li>
                  <li>Theme and display preference cookies</li>
                  <li>Form auto-fill cookies</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Marketing Cookies</h3>
                <p className="text-gray-700 mb-2">
                  These cookies are used to track visitors across websites to display relevant and 
                  engaging advertisements.
                </p>
                <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                  <li>Social media cookies for sharing and integration</li>
                  <li>Advertising cookies to show relevant ads</li>
                  <li>Retargeting cookies to remind you of our services</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Specific Cookies */}
          <div className="bg-white p-8 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Specific Cookies We Use</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-900">Cookie Name</th>
                    <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-900">Purpose</th>
                    <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-900">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="border border-gray-200 px-4 py-3 text-sm text-gray-700">session_id</td>
                    <td className="border border-gray-200 px-4 py-3 text-sm text-gray-700">Maintains your login session</td>
                    <td className="border border-gray-200 px-4 py-3 text-sm text-gray-700">Session</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-4 py-3 text-sm text-gray-700">_ga</td>
                    <td className="border border-gray-200 px-4 py-3 text-sm text-gray-700">Google Analytics tracking</td>
                    <td className="border border-gray-200 px-4 py-3 text-sm text-gray-700">2 years</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-4 py-3 text-sm text-gray-700">_gid</td>
                    <td className="border border-gray-200 px-4 py-3 text-sm text-gray-700">Google Analytics session tracking</td>
                    <td className="border border-gray-200 px-4 py-3 text-sm text-gray-700">24 hours</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-4 py-3 text-sm text-gray-700">language_pref</td>
                    <td className="border border-gray-200 px-4 py-3 text-sm text-gray-700">Remembers your language preference</td>
                    <td className="border border-gray-200 px-4 py-3 text-sm text-gray-700">1 year</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-4 py-3 text-sm text-gray-700">theme_pref</td>
                    <td className="border border-gray-200 px-4 py-3 text-sm text-gray-700">Remembers your theme preference</td>
                    <td className="border border-gray-200 px-4 py-3 text-sm text-gray-700">1 year</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-4 py-3 text-sm text-gray-700">cookie_consent</td>
                    <td className="border border-gray-200 px-4 py-3 text-sm text-gray-700">Remembers your cookie preferences</td>
                    <td className="border border-gray-200 px-4 py-3 text-sm text-gray-700">1 year</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Third-Party Cookies */}
          <div className="bg-white p-8 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Cookies</h2>
            <p className="text-gray-700 mb-4">
              We may use third-party services that place cookies on your device. These services include:
            </p>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Google Analytics</h3>
                <p className="text-gray-700 text-sm">
                  We use Google Analytics to understand how visitors use our website. Google Analytics 
                  uses cookies to collect information about your use of our site, including your IP address. 
                  This information is transmitted to and stored by Google on servers in the United States.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Social Media Platforms</h3>
                <p className="text-gray-700 text-sm">
                  Our website may include social media features (like Facebook, Twitter, or LinkedIn buttons) 
                  that may place cookies on your device. These cookies are controlled by the respective 
                  social media platforms.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Processors</h3>
                <p className="text-gray-700 text-sm">
                  When you make payments through our platform, our payment processors (like Stripe) may 
                  place cookies to ensure secure transactions and prevent fraud.
                </p>
              </div>
            </div>
          </div>

          {/* Managing Cookies */}
          <div className="bg-white p-8 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Managing Your Cookie Preferences</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Browser Settings</h3>
                <p className="text-gray-700 mb-3">
                  Most web browsers allow you to control cookies through their settings. You can:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>View and delete existing cookies</li>
                  <li>Block cookies from being set</li>
                  <li>Set preferences for different types of cookies</li>
                  <li>Clear cookies when you close your browser</li>
                </ul>
                <p className="text-gray-600 text-sm mt-3">
                  Note: Disabling certain cookies may affect the functionality of our website.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Cookie Consent</h3>
                <p className="text-gray-700 mb-3">
                  When you first visit our website, you'll see a cookie consent banner that allows you to:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Accept all cookies</li>
                  <li>Reject non-essential cookies</li>
                  <li>Customize your cookie preferences</li>
                </ul>
                <p className="text-gray-700 mt-3">
                  You can change your cookie preferences at any time by clicking the "Cookie Settings" 
                  link in our footer.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Opt-Out Links</h3>
                <p className="text-gray-700 mb-3">
                  For third-party cookies, you can opt out directly through the service providers:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li><a href="https://tools.google.com/dlpage/gaoptout" className="text-purple-600 hover:text-purple-700">Google Analytics Opt-out</a></li>
                  <li><a href="https://www.facebook.com/help/cookies" className="text-purple-600 hover:text-purple-700">Facebook Cookie Settings</a></li>
                  <li><a href="https://help.twitter.com/en/rules-and-policies/twitter-cookies" className="text-purple-600 hover:text-purple-700">Twitter Cookie Settings</a></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Updates to Policy */}
          <div className="bg-white p-8 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Updates to This Cookie Policy</h2>
            <p className="text-gray-700 mb-4">
              We may update this Cookie Policy from time to time to reflect changes in our practices 
              or for other operational, legal, or regulatory reasons. We will notify you of any material 
              changes by:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Posting the updated policy on our website</li>
              <li>Updating the "Last updated" date</li>
              <li>Sending email notifications to registered users (for significant changes)</li>
            </ul>
            <p className="text-gray-700 mt-4">
              We encourage you to review this Cookie Policy periodically to stay informed about how 
              we use cookies.
            </p>
          </div>

          {/* Contact Information */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about our use of cookies or this Cookie Policy, please contact us:
            </p>
            <div className="space-y-2 text-gray-700">
              <p><strong>Email:</strong> privacy@localslocalmarket.com</p>
              <p><strong>Address:</strong> 123 Main Street, Suite 100, New York, NY 10001</p>
              <p><strong>Phone:</strong> +1 (555) 123-4567</p>
            </div>
            <p className="text-gray-700 mt-4">
              We will respond to your inquiry within 30 days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiesPage;
