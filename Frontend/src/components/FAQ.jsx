import { useState } from 'react'
import JsonLd from './JsonLd.jsx'

const FAQ = ({ faqs = [] }) => {
  const [openItems, setOpenItems] = useState(new Set())

  const toggleItem = (index) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index)
    } else {
      newOpenItems.add(index)
    }
    setOpenItems(newOpenItems)
  }

  const defaultFaqs = [
    {
      question: "What is LocalsLocalMarket?",
      answer: "LocalsLocalMarket is a platform that connects local businesses with customers in their community. We help you discover amazing local shops, find unique products, and support local entrepreneurs."
    },
    {
      question: "How do I find local shops near me?",
      answer: "You can search for shops using our search bar, browse the map to see shops in your area, or let us use your location to show you the nearest local businesses."
    },
    {
      question: "How can I support local businesses?",
      answer: "You can support local businesses by visiting their shops, purchasing their products, leaving reviews, sharing their information on social media, and recommending them to friends and family."
    },
    {
      question: "Can I add my own business to the platform?",
      answer: "Yes! Local business owners can register and create their shop profile to showcase their products and connect with customers in their community."
    },
    {
      question: "Is LocalsLocalMarket free to use?",
      answer: "Yes, LocalsLocalMarket is completely free for customers to use. We believe in making local business discovery accessible to everyone."
    },
    {
      question: "How do I contact a local business?",
      answer: "Each business profile includes contact information such as phone numbers, email addresses, and physical addresses. You can also use our contact forms to reach out directly."
    },
    {
      question: "Can I leave reviews for businesses?",
      answer: "Yes! After visiting a local business, you can leave reviews and ratings to help other customers make informed decisions and support the business."
    },
    {
      question: "What types of businesses are on the platform?",
      answer: "We feature a wide variety of local businesses including retail shops, restaurants, service providers, artisans, and more. Our goal is to showcase the diverse local business community."
    }
  ]

  const allFaqs = faqs.length > 0 ? faqs : defaultFaqs

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": allFaqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }

  return (
    <div className="faq-container">
      <JsonLd data={structuredData} />
      
      <div className="faq-list">
        {allFaqs.map((faq, index) => (
          <div 
            key={index}
            className={`faq-item ${openItems.has(index) ? 'faq-item-open' : ''}`}
          >
            <button
              onClick={() => toggleItem(index)}
              className="faq-question"
              aria-expanded={openItems.has(index)}
            >
              <span className="question-text">{faq.question}</span>
              <svg 
                className={`faq-icon ${openItems.has(index) ? 'faq-icon-open' : ''}`}
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            <div className={`faq-answer ${openItems.has(index) ? 'faq-answer-open' : ''}`}>
              <div className="answer-content">
                {faq.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FAQ
