import React, { useState } from 'react'
import { 
  LoadingSpinner, 
  LoadingDots, 
  LoadingBar, 
  LoadingCard, 
  LoadingOverlay, 
  LoadingButton 
} from '../components/Loading.jsx'

const LoadingDemo = () => {
  const [showOverlay, setShowOverlay] = useState(false)
  const [loadingStates, setLoadingStates] = useState({
    button1: false,
    button2: false,
    button3: false
  })

  const handleButtonClick = (buttonName) => {
    setLoadingStates(prev => ({ ...prev, [buttonName]: true }))
    setTimeout(() => {
      setLoadingStates(prev => ({ ...prev, [buttonName]: false }))
    }, 2000)
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Loading Components Demo</h1>
      
      <section style={{ marginBottom: '2rem' }}>
        <h2>Loading Spinner</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <strong>Small:</strong>
            <LoadingSpinner size="small" />
          </div>
          <div>
            <strong>Medium:</strong>
            <LoadingSpinner size="medium" />
          </div>
          <div>
            <strong>Large:</strong>
            <LoadingSpinner size="large" />
          </div>
          <div>
            <strong>XLarge:</strong>
            <LoadingSpinner size="xlarge" />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div>
            <strong>Custom Color:</strong>
            <LoadingSpinner size="medium" color="#ff6b6b" />
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2>Loading Dots</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <LoadingDots />
          <LoadingDots color="#ff6b6b" />
        </div>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2>Loading Bar</h2>
        <div style={{ marginBottom: '1rem' }}>
          <LoadingBar />
        </div>
        <div>
          <LoadingBar color="#ff6b6b" />
        </div>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2>Loading Card</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <LoadingCard lines={3} />
          <LoadingCard lines={5} height="0.8rem" />
        </div>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2>Loading Button</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <LoadingButton 
            className="btn btn-primary"
            loading={loadingStates.button1}
            loadingText="Processing..."
            onClick={() => handleButtonClick('button1')}
          >
            Primary Button
          </LoadingButton>
          
          <LoadingButton 
            className="btn btn-secondary"
            loading={loadingStates.button2}
            loadingText="Saving..."
            onClick={() => handleButtonClick('button2')}
          >
            Secondary Button
          </LoadingButton>
          
          <LoadingButton 
            className="btn btn-danger"
            loading={loadingStates.button3}
            loadingText="Deleting..."
            onClick={() => handleButtonClick('button3')}
          >
            Danger Button
          </LoadingButton>
        </div>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2>Loading Overlay</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-primary"
            onClick={() => setShowOverlay(true)}
          >
            Show Overlay
          </button>
          
          <button 
            className="btn btn-secondary"
            onClick={() => setShowOverlay(false)}
          >
            Hide Overlay
          </button>
        </div>
        
        {showOverlay && (
          <LoadingOverlay 
            message="Loading your content..."
            showSpinner={true}
          />
        )}
      </section>

      <section>
        <h2>Non-Overlay Loading</h2>
        <div style={{ 
          border: '1px solid var(--border)', 
          borderRadius: '8px', 
          padding: '2rem',
          textAlign: 'center'
        }}>
          <LoadingOverlay 
            message="Loading content in container..."
            showSpinner={true}
            overlay={false}
          />
        </div>
      </section>
    </div>
  )
}

export default LoadingDemo
