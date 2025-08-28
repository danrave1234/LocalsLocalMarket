import { useState } from 'react'
import { Link } from 'react-router-dom'
import PaymentProcessor from '../components/PaymentProcessor.jsx'

export default function DonationsPage() {
  const [selectedAmount, setSelectedAmount] = useState('')
  const [customAmount, setCustomAmount] = useState('')
  const [donorName, setDonorName] = useState('')
  const [donorEmail, setDonorEmail] = useState('')
  const [donorMessage, setDonorMessage] = useState('')

  const presetAmounts = [
    { value: '5', label: '$5', description: 'Support our mission' },
    { value: '10', label: '$10', description: 'Help us grow' },
    { value: '25', label: '$25', description: 'Make a difference' },
    { value: '50', label: '$50', description: 'Community champion' },
    { value: '100', label: '$100', description: 'Local hero' }
  ]

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount)
    setCustomAmount('')
  }

  const handleCustomAmountChange = (e) => {
    setCustomAmount(e.target.value)
    setSelectedAmount('')
  }

  const [showPayment, setShowPayment] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  const handleDonation = (e) => {
    e.preventDefault()
    const amount = customAmount || selectedAmount
    if (!amount || amount <= 0) {
      alert('Please select or enter a valid donation amount')
      return
    }
    
    setShowPayment(true)
  }

  const handlePaymentSuccess = (paymentResult) => {
    setPaymentSuccess(true)
    setShowPayment(false)
    // Here you would typically send the donation data to your backend
    console.log('Payment successful:', paymentResult)
  }

  const handlePaymentError = (error) => {
    alert('Payment failed. Please try again.')
    console.error('Payment error:', error)
  }

  return (
    <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Support LocalsLocalMarket
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--muted)', maxWidth: '600px', margin: '0 auto' }}>
          Help us build a stronger local community by supporting our platform. Your donations help us maintain and improve our services for local businesses and customers.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        <div style={{ background: 'var(--card)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--foreground)' }}>Why Donate?</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span style={{ color: '#10b981' }}>✓</span>
              Support local businesses
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span style={{ color: '#10b981' }}>✓</span>
              Platform development
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span style={{ color: '#10b981' }}>✓</span>
              Community features
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span style={{ color: '#10b981' }}>✓</span>
              Server maintenance
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: '#10b981' }}>✓</span>
              Customer support
            </li>
          </ul>
        </div>

        <div style={{ background: 'var(--card)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--foreground)' }}>Your Impact</h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ textAlign: 'center', padding: '1rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '8px', color: 'white' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>500+</div>
              <div>Local Businesses Supported</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', borderRadius: '8px', color: 'white' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>10,000+</div>
              <div>Happy Customers</div>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleDonation} style={{ background: 'var(--card)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
        <h3 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Make a Donation</h3>
        
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', marginBottom: '1rem', fontWeight: '500' }}>Select Amount</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            {presetAmounts.map((amount) => (
              <button
                key={amount.value}
                type="button"
                onClick={() => handleAmountSelect(amount.value)}
                style={{
                  padding: '1rem',
                  border: selectedAmount === amount.value ? '2px solid #667eea' : '1px solid var(--border)',
                  borderRadius: '8px',
                  background: selectedAmount === amount.value ? 'rgba(102, 126, 234, 0.1)' : 'var(--card-2)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>{amount.label}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>{amount.description}</div>
              </button>
            ))}
          </div>
          
          <div style={{ marginTop: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Or enter custom amount</label>
            <input
              type="number"
              value={customAmount}
              onChange={handleCustomAmountChange}
              placeholder="Enter amount"
              min="1"
              step="0.01"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                background: 'var(--card-2)',
                color: 'var(--foreground)'
              }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Name (Optional)</label>
            <input
              type="text"
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              placeholder="Your name"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                background: 'var(--card-2)',
                color: 'var(--foreground)'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Email (Optional)</label>
            <input
              type="email"
              value={donorEmail}
              onChange={(e) => setDonorEmail(e.target.value)}
              placeholder="your@email.com"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                background: 'var(--card-2)',
                color: 'var(--foreground)'
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Message (Optional)</label>
          <textarea
            value={donorMessage}
            onChange={(e) => setDonorMessage(e.target.value)}
            placeholder="Share why you're supporting us..."
            rows="3"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              background: 'var(--card-2)',
              color: 'var(--foreground)',
              resize: 'vertical'
            }}
          />
        </div>

        {!showPayment ? (
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '1rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            Continue to Payment
          </button>
        ) : (
          <PaymentProcessor
            amount={customAmount || selectedAmount}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        )}

        {!showPayment && (
          <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.875rem', color: 'var(--muted)' }}>
            Your donation is secure and will be processed through our trusted payment partner.
          </p>
        )}
              </form>

        {paymentSuccess && (
          <div style={{ 
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            padding: '2rem',
            borderRadius: '12px',
            textAlign: 'center',
            marginTop: '2rem'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
            <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>Thank You!</h3>
            <p style={{ margin: 0, opacity: 0.9 }}>
              Your donation of ${customAmount || selectedAmount} has been received. 
              We're grateful for your support in helping us build a stronger local community!
            </p>
            <div style={{ marginTop: '1rem' }}>
              <button
                onClick={() => {
                  setPaymentSuccess(false)
                  setSelectedAmount('')
                  setCustomAmount('')
                  setDonorName('')
                  setDonorEmail('')
                  setDonorMessage('')
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Make Another Donation
              </button>
            </div>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link to="/" style={{ color: 'var(--muted)', textDecoration: 'none' }}>
            ← Back to Home
          </Link>
        </div>
    </div>
  )
}
