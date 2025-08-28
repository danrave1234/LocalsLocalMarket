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
    <div style={{ marginTop: '2rem' }}>
      <JsonLd data={structuredData} />
      
      <h3 style={{ marginBottom: '1rem' }}>Frequently Asked Questions</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {allFaqs.map((faq, index) => (
          <div 
            key={index}
            style={{
              border: '1px solid var(--border)',
              borderRadius: '8px',
              overflow: 'hidden'
            }}
          >
            <button
              onClick={() => toggleItem(index)}
              style={{
                width: '100%',
                padding: '1rem',
                background: 'var(--surface)',
                border: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '1rem',
                fontWeight: 500,
                color: 'var(--text)',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--card)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--surface)'}
            >
              <span>{faq.question}</span>
              <span style={{ 
                fontSize: '1.5rem', 
                transition: 'transform 0.2s',
                transform: openItems.has(index) ? 'rotate(45deg)' : 'rotate(0deg)'
              }}>
                +
              </span>
            </button>
            
            {openItems.has(index) && (
              <div style={{
                padding: '1rem',
                background: 'var(--card)',
                borderTop: '1px solid var(--border)',
                fontSize: '0.9rem',
                lineHeight: '1.5',
                color: 'var(--text)'
              }}>
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default FAQ
