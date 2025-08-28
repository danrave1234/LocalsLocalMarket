import React from 'react';

const TermsPage = () => {
  return (
    <div className="terms-page">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Please read these terms carefully before using our services.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Agreement */}
          <div className="bg-white p-8 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Agreement to Terms</h2>
            <p className="text-gray-700 mb-4">
              These Terms of Service ("Terms") govern your use of the LocalsLocalMarket website and services 
              operated by LocalsLocalMarket ("we," "our," or "us").
            </p>
            <p className="text-gray-700">
              By accessing or using our services, you agree to be bound by these Terms. If you disagree with 
              any part of these terms, then you may not access our services.
            </p>
          </div>

          {/* Description of Service */}
          <div className="bg-white p-8 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Description of Service</h2>
            <p className="text-gray-700 mb-4">
              LocalsLocalMarket is a platform that connects local businesses with their communities. Our 
              services include:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Business profile creation and management</li>
              <li>Product and service listings</li>
              <li>Customer reviews and ratings</li>
              <li>Communication tools between businesses and customers</li>
              <li>Analytics and business insights</li>
              <li>Marketing and promotional features</li>
            </ul>
          </div>

          {/* User Accounts */}
          <div className="bg-white p-8 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">User Accounts</h2>
            <p className="text-gray-700 mb-4">
              When you create an account with us, you must provide accurate, complete, and current information. 
              You are responsible for:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use</li>
              <li>Ensuring your account information remains accurate and up-to-date</li>
            </ul>
            <p className="text-gray-700">
              We reserve the right to terminate accounts that violate these Terms or are inactive for extended periods.
            </p>
          </div>

          {/* Acceptable Use */}
          <div className="bg-white p-8 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceptable Use</h2>
            <p className="text-gray-700 mb-4">
              You agree to use our services only for lawful purposes and in accordance with these Terms. 
              You agree not to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe upon the rights of others</li>
              <li>Upload or transmit harmful, offensive, or inappropriate content</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt our services</li>
              <li>Use our services for spam or unsolicited communications</li>
              <li>Impersonate another person or entity</li>
              <li>Engage in fraudulent or deceptive practices</li>
            </ul>
          </div>

          {/* Business Listings */}
          <div className="bg-white p-8 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Business Listings and Content</h2>
            <p className="text-gray-700 mb-4">
              When creating business listings, you agree to:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Provide accurate and truthful information about your business</li>
              <li>Maintain up-to-date business hours, contact information, and descriptions</li>
              <li>Use only content that you own or have permission to use</li>
              <li>Not misrepresent your business or services</li>
              <li>Comply with all applicable laws and regulations</li>
            </ul>
            <p className="text-gray-700">
              We reserve the right to review, edit, or remove any content that violates these Terms or 
              is otherwise inappropriate.
            </p>
          </div>

          {/* Intellectual Property */}
          <div className="bg-white p-8 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Intellectual Property</h2>
            <p className="text-gray-700 mb-4">
              Our services and their original content, features, and functionality are owned by LocalsLocalMarket 
              and are protected by international copyright, trademark, patent, trade secret, and other 
              intellectual property laws.
            </p>
            <p className="text-gray-700">
              You retain ownership of content you submit to our platform, but you grant us a non-exclusive, 
              worldwide, royalty-free license to use, display, and distribute your content in connection 
              with our services.
            </p>
          </div>

          {/* Privacy */}
          <div className="bg-white p-8 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Privacy</h2>
            <p className="text-gray-700">
              Your privacy is important to us. Please review our Privacy Policy, which also governs your 
              use of our services, to understand our practices regarding the collection and use of your 
              personal information.
            </p>
          </div>

          {/* Payment Terms */}
          <div className="bg-white p-8 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Terms</h2>
            <p className="text-gray-700 mb-4">
              Some features of our services may require payment. By subscribing to paid services, you agree to:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Pay all fees in advance</li>
              <li>Provide accurate billing information</li>
              <li>Authorize us to charge your payment method</li>
              <li>Pay any applicable taxes</li>
            </ul>
            <p className="text-gray-700">
              Subscription fees are non-refundable except as required by law. We may change our pricing 
              with 30 days' notice.
            </p>
          </div>

          {/* Termination */}
          <div className="bg-white p-8 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Termination</h2>
            <p className="text-gray-700 mb-4">
              We may terminate or suspend your account and access to our services immediately, without 
              prior notice, for any reason, including breach of these Terms.
            </p>
            <p className="text-gray-700">
              Upon termination, your right to use our services will cease immediately. We may delete 
              your account and data, though some information may be retained as required by law.
            </p>
          </div>

          {/* Disclaimers */}
          <div className="bg-white p-8 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Disclaimers</h2>
            <p className="text-gray-700 mb-4">
              Our services are provided "as is" and "as available" without warranties of any kind. 
              We disclaim all warranties, express or implied, including:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Warranties of merchantability and fitness for a particular purpose</li>
              <li>Warranties that our services will be uninterrupted or error-free</li>
              <li>Warranties regarding the accuracy or reliability of information</li>
              <li>Warranties that defects will be corrected</li>
            </ul>
            <p className="text-gray-700">
              We do not guarantee the quality, safety, or legality of any business listings or services 
              offered by third parties on our platform.
            </p>
          </div>

          {/* Limitation of Liability */}
          <div className="bg-white p-8 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitation of Liability</h2>
            <p className="text-gray-700 mb-4">
              In no event shall LocalsLocalMarket be liable for any indirect, incidental, special, 
              consequential, or punitive damages, including loss of profits, data, or use, arising out 
              of or relating to your use of our services.
            </p>
            <p className="text-gray-700">
              Our total liability to you for any claims arising from these Terms or your use of our 
              services shall not exceed the amount you paid us in the 12 months preceding the claim.
            </p>
          </div>

          {/* Indemnification */}
          <div className="bg-white p-8 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Indemnification</h2>
            <p className="text-gray-700">
              You agree to indemnify and hold harmless LocalsLocalMarket and its officers, directors, 
              employees, and agents from any claims, damages, losses, or expenses arising out of your 
              use of our services, violation of these Terms, or violation of any rights of another party.
            </p>
          </div>

          {/* Governing Law */}
          <div className="bg-white p-8 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Governing Law</h2>
            <p className="text-gray-700">
              These Terms shall be governed by and construed in accordance with the laws of the State 
              of New York, without regard to its conflict of law provisions. Any disputes arising from 
              these Terms or your use of our services shall be resolved in the courts of New York.
            </p>
          </div>

          {/* Changes to Terms */}
          <div className="bg-white p-8 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to Terms</h2>
            <p className="text-gray-700 mb-4">
              We reserve the right to modify these Terms at any time. We will notify users of significant 
              changes by:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Posting the updated Terms on our website</li>
              <li>Sending email notifications to registered users</li>
              <li>Updating the "Last updated" date</li>
            </ul>
            <p className="text-gray-700">
              Your continued use of our services after changes become effective constitutes acceptance 
              of the new Terms.
            </p>
          </div>

          {/* Severability */}
          <div className="bg-white p-8 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Severability</h2>
            <p className="text-gray-700">
              If any provision of these Terms is found to be unenforceable or invalid, that provision 
              will be limited or eliminated to the minimum extent necessary so that these Terms will 
              otherwise remain in full force and effect.
            </p>
          </div>

          {/* Contact Information */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="space-y-2 text-gray-700">
              <p><strong>Email:</strong> legal@localslocalmarket.com</p>
              <p><strong>Address:</strong> 123 Main Street, Suite 100, New York, NY 10001</p>
              <p><strong>Phone:</strong> +1 (555) 123-4567</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
