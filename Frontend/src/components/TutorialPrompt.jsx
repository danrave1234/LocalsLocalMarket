import { useEffect, useState } from 'react'
import { useTutorial } from '../contexts/TutorialContext'
import { X, PlayCircle, MousePointer2 } from 'lucide-react'

const backdropStyle = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 1300,
  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
}

const modalStyle = {
  width: 'min(520px, 100%)', background: 'var(--card)', border: '1px solid var(--border)',
  borderRadius: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', overflow: 'hidden'
}

const headerStyle = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem',
  borderBottom: '1px solid var(--border)'
}

const bodyStyle = { padding: '1rem' }
const actionsStyle = {
  display: 'flex', gap: '0.5rem', padding: '1rem', borderTop: '1px solid var(--border)'
}

export default function TutorialPrompt() {
  const { shouldPrompt, setShouldPrompt, startTutorial } = useTutorial()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setIsOpen(!!shouldPrompt)
  }, [shouldPrompt])

  if (!isOpen) return null

  const handleStart = () => {
    setIsOpen(false)
    setShouldPrompt(false)
    try { localStorage.removeItem('tutorial_prompt_dismissed') } catch {}
    startTutorial()
  }

  const handleDismiss = () => {
    setIsOpen(false)
    setShouldPrompt(false)
    try { localStorage.setItem('tutorial_prompt_dismissed', '1') } catch {}
  }

  return (
    <div style={backdropStyle} onClick={handleDismiss}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MousePointer2 size={18} />
            <span style={{ fontWeight: 600 }}>Take a quick tour?</span>
          </div>
          <button
            onClick={handleDismiss}
            style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '1.1rem' }}
            aria-label="Dismiss tutorial prompt"
          >
            <X size={16} />
          </button>
        </div>
        <div style={bodyStyle}>
          <p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.5 }}>
            We can show you where the search bar, interactive map, and shop cards are, and how to use them.
          </p>
        </div>
        <div style={actionsStyle}>
          <button
            onClick={handleDismiss}
            className="btn btn-secondary"
            style={{ flex: 1 }}
          >
            No thanks
          </button>
          <button
            onClick={handleStart}
            className="btn btn-primary"
            style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            <PlayCircle size={16} />
            Start tutorial
          </button>
        </div>
      </div>
    </div>
  )
}


