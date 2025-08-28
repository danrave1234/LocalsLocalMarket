import { useState } from 'react'

export default function PaymentProcessor({ amount, onSuccess, onError }) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('stripe')

  const handlePayment = async () => {
    setIsProcessing(true)
    
    try {
      // Here you would integrate with your actual payment processor
      // For now, we'll simulate a payment process
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simulate successful payment
      const paymentResult = {
        id: 'pay_' + Math.random().toString(36).substr(2, 9),
        amount: amount,
        status: 'succeeded',
        timestamp: new Date().toISOString()
      }
      
      onSuccess(paymentResult)
    } catch (error) {
      onError(error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div style={{ marginTop: '1rem' }}>
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
          Payment Method
        </label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            background: 'var(--card-2)',
            color: 'var(--foreground)'
          }}
        >
          <option value="stripe">Credit/Debit Card (Stripe)</option>
          <option value="paypal">PayPal</option>
          <option value="crypto">Cryptocurrency</option>
        </select>
      </div>

      <button
        onClick={handlePayment}
        disabled={isProcessing}
        style={{
          width: '100%',
          padding: '1rem',
          background: isProcessing ? '#6b7280' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '1.1rem',
          fontWeight: '600',
          cursor: isProcessing ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s'
        }}
      >
        {isProcessing ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '20px',
              height: '20px',
              border: '2px solid transparent',
              borderTop: '2px solid white',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            Processing Payment...
          </div>
        ) : (
          `Pay $${amount}`
        )}
      </button>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      <div style={{ 
        marginTop: '1rem', 
        padding: '1rem', 
        background: 'var(--card-2)', 
        borderRadius: '8px',
        fontSize: '0.875rem',
        color: 'var(--muted)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ color: '#10b981' }}>🔒</span>
          <strong>Secure Payment</strong>
        </div>
        <p style={{ margin: 0, fontSize: '0.8rem' }}>
          Your payment information is encrypted and secure. We use industry-standard SSL encryption to protect your data.
        </p>
      </div>
    </div>
  )
}

// PayPal integration component
export function PayPalButton({ amount, onSuccess, onError }) {
  const [isLoading, setIsLoading] = useState(false)

  const handlePayPalPayment = async () => {
    setIsLoading(true)
    
    try {
      // Here you would integrate with PayPal SDK
      // For now, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      onSuccess({
        id: 'paypal_' + Math.random().toString(36).substr(2, 9),
        amount: amount,
        method: 'paypal',
        status: 'completed'
      })
    } catch (error) {
      onError(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handlePayPalPayment}
      disabled={isLoading}
      style={{
        width: '100%',
        padding: '1rem',
        background: '#0070ba',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1.1rem',
        fontWeight: '600',
        cursor: isLoading ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem'
      }}
    >
      {isLoading ? (
        <>
          <div style={{
            width: '20px',
            height: '20px',
            border: '2px solid transparent',
            borderTop: '2px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          Processing...
        </>
      ) : (
        <>
          <span>PayPal</span>
          <span>•</span>
          <span>${amount}</span>
        </>
      )}
    </button>
  )
}

// Cryptocurrency payment component
export function CryptoPayment({ amount, onSuccess, onError }) {
  const [selectedCrypto, setSelectedCrypto] = useState('bitcoin')
  const [walletAddress, setWalletAddress] = useState('')

  const cryptoOptions = [
    { value: 'bitcoin', label: 'Bitcoin (BTC)', address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh' },
    { value: 'ethereum', label: 'Ethereum (ETH)', address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6' },
    { value: 'usdc', label: 'USDC', address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6' }
  ]

  const selectedOption = cryptoOptions.find(option => option.value === selectedCrypto)

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(selectedOption.address)
    alert('Wallet address copied to clipboard!')
  }

  return (
    <div style={{ marginTop: '1rem' }}>
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
          Select Cryptocurrency
        </label>
        <select
          value={selectedCrypto}
          onChange={(e) => setSelectedCrypto(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            background: 'var(--card-2)',
            color: 'var(--foreground)'
          }}
        >
          {cryptoOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div style={{ 
        padding: '1rem', 
        background: 'var(--card-2)', 
        borderRadius: '8px',
        border: '1px solid var(--border)',
        marginBottom: '1rem'
      }}>
        <div style={{ marginBottom: '0.5rem', fontWeight: '500' }}>
          Send ${amount} worth of {selectedCrypto.toUpperCase()}
        </div>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          padding: '0.75rem',
          background: 'var(--surface)',
          borderRadius: '6px',
          fontSize: '0.875rem',
          fontFamily: 'monospace'
        }}>
          <span style={{ wordBreak: 'break-all' }}>{selectedOption.address}</span>
          <button
            onClick={handleCopyAddress}
            style={{
              background: 'var(--primary)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '0.25rem 0.5rem',
              fontSize: '0.75rem',
              cursor: 'pointer'
            }}
          >
            Copy
          </button>
        </div>
      </div>

      <div style={{ 
        padding: '1rem', 
        background: '#fef3c7', 
        borderRadius: '8px',
        border: '1px solid #f59e0b',
        fontSize: '0.875rem',
        color: '#92400e'
      }}>
        <strong>Important:</strong> Please send the exact amount and include a memo/note with your email address so we can thank you properly!
      </div>
    </div>
  )
}
