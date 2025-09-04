import { useState, useEffect } from 'react'
import { Clock, CheckCircle, XCircle, Copy, Check, Plus, Minus } from 'lucide-react'
import './BusinessHours.css'

export default function BusinessHours({ value, onChange }) {
  const [businessHours, setBusinessHours] = useState({})
  const [selectedDays, setSelectedDays] = useState([])
  const [bulkTime, setBulkTime] = useState({ 
    open: '09', 
    openMinute: '00',
    openAMPM: 'AM',
    close: '17', 
    closeMinute: '00',
    closeAMPM: 'PM' 
  })

  const days = [
    { key: 'monday', label: 'Monday', color: '#3B82F6' },
    { key: 'tuesday', label: 'Tuesday', color: '#10B981' },
    { key: 'wednesday', label: 'Wednesday', color: '#F59E0B' },
    { key: 'thursday', label: 'Thursday', color: '#8B5CF6' },
    { key: 'friday', label: 'Friday', color: '#EF4444' },
    { key: 'saturday', label: 'Saturday', color: '#06B6D4' },
    { key: 'sunday', label: 'Sunday', color: '#84CC16' }
  ]

  useEffect(() => {
    if (value) {
      try {
        const parsed = JSON.parse(value)
        // Fix any existing 24-hour days with ambiguous format
        const fixed = { ...parsed }
        Object.keys(fixed).forEach(dayKey => {
          const dayHours = fixed[dayKey]
          if (dayHours && dayHours.isOpen !== false) {
            // Check if it's the old 24-hour format (12:00 AM to 12:00 AM)
            if (dayHours.open === '12' && dayHours.openMinute === '00' && dayHours.openAMPM === 'AM' &&
                dayHours.close === '12' && dayHours.closeMinute === '00' && dayHours.closeAMPM === 'AM') {
              // Convert to new clear 24-hour format
              fixed[dayKey] = {
                ...dayHours,
                close: '11',
                closeMinute: '59',
                closeAMPM: 'PM',
                isOpen: true
              }
            }
          }
        })
        setBusinessHours(fixed)
      } catch {
        setBusinessHours({})
      }
    }
  }, [value])

  useEffect(() => {
    if (onChange) {
      onChange(JSON.stringify(businessHours))
    }
  }, [businessHours, onChange])

  const handleDayToggle = (dayKey) => {
    setSelectedDays(prev => 
      prev.includes(dayKey) 
        ? prev.filter(d => d !== dayKey)
        : [...prev, dayKey]
    )
  }

  const applyBulkTime = () => {
    if (selectedDays.length === 0) return

    const updated = { ...businessHours }
    selectedDays.forEach(dayKey => {
      updated[dayKey] = {
        open: bulkTime.open,
        openMinute: bulkTime.openMinute,
        openAMPM: bulkTime.openAMPM,
        close: bulkTime.close,
        closeMinute: bulkTime.closeMinute,
        closeAMPM: bulkTime.closeAMPM,
        isOpen: true
      }
    })
    setBusinessHours(updated)
    setSelectedDays([])
  }

  const toggleDayOpen = (dayKey) => {
    setBusinessHours(prev => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        isOpen: !prev[dayKey]?.isOpen
      }
    }))
  }

  const updateDayTime = (dayKey, field, value) => {
    setBusinessHours(prev => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        [field]: value
      }
    }))
  }

  const copyDayTime = (sourceDay) => {
    const sourceTime = businessHours[sourceDay]
    if (!sourceTime) return

    const updated = { ...businessHours }
    selectedDays.forEach(dayKey => {
      if (dayKey !== sourceDay) {
        updated[dayKey] = { ...sourceTime }
      }
    })
    setBusinessHours(updated)
    setSelectedDays([])
  }

  const isDaySelected = (dayKey) => selectedDays.includes(dayKey)
  const isDayOpen = (dayKey) => businessHours[dayKey]?.isOpen

  const formatTimeDisplay = (dayHours) => {
    if (!dayHours || !dayHours.isOpen) return 'Closed'
    
    // Check if it's a 24-hour day
    if (dayHours.open === '12' && dayHours.openMinute === '00' && dayHours.openAMPM === 'AM' &&
        dayHours.close === '11' && dayHours.closeMinute === '59' && dayHours.closeAMPM === 'PM') {
      return '24 Hours'
    }
    
    // Check if it's the old 24-hour format
    if (dayHours.open === '12' && dayHours.openMinute === '00' && dayHours.openAMPM === 'AM' &&
        dayHours.close === '12' && dayHours.closeMinute === '00' && dayHours.closeAMPM === 'AM') {
      return '24 Hours'
    }
    
    // Regular time format
    return `${dayHours.open}:${dayHours.openMinute} ${dayHours.openAMPM} - ${dayHours.close}:${dayHours.closeMinute} ${dayHours.closeAMPM}`
  }

  return (
    <div className="business-hours-editor">
      {/* Quick Setup */}
      <div className="quick-setup">
        <div className="setup-header">
          <Clock size={20} />
          <h3>Quick Setup</h3>
        </div>
        <p>Select days and set the same time for all</p>
        
        <div className="day-grid">
          {days.map(day => (
            <label key={day.key} className={`day-item ${isDaySelected(day.key) ? 'selected' : ''}`}>
              <input
                type="checkbox"
                checked={isDaySelected(day.key)}
                onChange={() => handleDayToggle(day.key)}
              />
              <span className="day-dot" style={{ backgroundColor: day.color }}></span>
              <span className="day-name">{day.label.slice(0, 3)}</span>
            </label>
          ))}
        </div>

        {selectedDays.length > 0 && (
          <div className="bulk-time-panel">
            <div className="time-inputs">
              <div className="time-group">
                <label>Opening Time</label>
                <div className="time-selector">
                  <select
                    value={bulkTime.open}
                    onChange={(e) => setBulkTime(prev => ({ ...prev, open: e.target.value }))}
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(hour => (
                      <option key={hour} value={hour.toString().padStart(2, '0')}>
                        {hour}
                      </option>
                    ))}
                  </select>
                  <span>:</span>
                  <select
                    value={bulkTime.openMinute}
                    onChange={(e) => setBulkTime(prev => ({ ...prev, openMinute: e.target.value }))}
                  >
                    {Array.from({ length: 60 }, (_, i) => i).map(minute => (
                      <option key={minute} value={minute.toString().padStart(2, '0')}>
                        {minute.toString().padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                  <select
                    value={bulkTime.openAMPM}
                    onChange={(e) => setBulkTime(prev => ({ ...prev, openAMPM: e.target.value }))}
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>

              <div className="time-group">
                <label>Closing Time</label>
                <div className="time-selector">
                  <select
                    value={bulkTime.close}
                    onChange={(e) => setBulkTime(prev => ({ ...prev, close: e.target.value }))}
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(hour => (
                      <option key={hour} value={hour.toString().padStart(2, '0')}>
                        {hour}
                      </option>
                    ))}
                  </select>
                  <span>:</span>
                  <select
                    value={bulkTime.closeMinute}
                    onChange={(e) => setBulkTime(prev => ({ ...prev, closeMinute: e.target.value }))}
                  >
                    {Array.from({ length: 60 }, (_, i) => i).map(minute => (
                      <option key={minute} value={minute.toString().padStart(2, '0')}>
                        {minute.toString().padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                  <select
                    value={bulkTime.closeAMPM}
                    onChange={(e) => setBulkTime(prev => ({ ...prev, closeAMPM: e.target.value }))}
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bulk-actions">
              <button 
                type="button" 
                className="apply-btn"
                onClick={applyBulkTime}
              >
                <Check size={16} />
                Apply to {selectedDays.length} day{selectedDays.length > 1 ? 's' : ''}
              </button>
              <button 
                type="button" 
                className="apply-btn twenty-four-hour"
                onClick={() => {
                  if (selectedDays.length === 0) return
                  const updated = { ...businessHours }
                  selectedDays.forEach(dayKey => {
                    updated[dayKey] = {
                      open: '12',
                      openMinute: '00',
                      openAMPM: 'AM',
                      close: '11',
                      closeMinute: '59',
                      closeAMPM: 'PM',
                      isOpen: true
                    }
                  })
                  setBusinessHours(updated)
                  setSelectedDays([])
                }}
              >
                <Clock size={16} />
                24 Hours
              </button>
              <button 
                type="button" 
                className="clear-btn"
                onClick={() => setSelectedDays([])}
              >
                Clear Selection
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Individual Days */}
      <div className="individual-days">
        <div className="days-header">
          <h3>Individual Settings</h3>
          <p>Customize specific days or copy times</p>
        </div>

        <div className="days-list">
          {days.map(day => {
            const dayHours = businessHours[day.key] || {}
            const isOpen = dayHours.isOpen

            return (
              <div key={day.key} className={`day-card ${isOpen ? 'open' : 'closed'}`}>
                <div className="day-header">
                  <div className="day-info">
                    <div className="day-dot" style={{ backgroundColor: day.color }}></div>
                    <span className="day-name">{day.label}</span>
                  </div>
                  
                  <div className="day-controls">
                    <button
                      type="button"
                      className={`status-btn ${isOpen ? 'open' : 'closed'}`}
                      onClick={() => toggleDayOpen(day.key)}
                    >
                      {isOpen ? (
                        <>
                          <CheckCircle size={16} />
                          Open
                        </>
                      ) : (
                        <>
                          <XCircle size={16} />
                          Closed
                        </>
                      )}
                    </button>

                    {isOpen && (
                      <button
                        type="button"
                        className="copy-btn"
                        onClick={() => copyDayTime(day.key)}
                        title="Copy this time to other selected days"
                      >
                        <Copy size={16} />
                      </button>
                    )}
                  </div>
                </div>

                {isOpen && (
                  <>
                    <div className="time-summary">
                      <span className="time-display">{formatTimeDisplay(dayHours)}</span>
                    </div>
                    <div className="day-times">
                      <div className="time-row">
                        <label>Opening</label>
                        <div className="time-inputs">
                          <select
                            value={dayHours.open || '09'}
                            onChange={(e) => updateDayTime(day.key, 'open', e.target.value)}
                          >
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(hour => (
                              <option key={hour} value={hour.toString().padStart(2, '0')}>
                                {hour}
                              </option>
                            ))}
                          </select>
                          <span>:</span>
                          <select
                            value={dayHours.openMinute || '00'}
                            onChange={(e) => updateDayTime(day.key, 'openMinute', e.target.value)}
                          >
                            {Array.from({ length: 60 }, (_, i) => i).map(minute => (
                              <option key={minute} value={minute.toString().padStart(2, '0')}>
                                {minute.toString().padStart(2, '0')}
                              </option>
                            ))}
                          </select>
                          <select
                            value={dayHours.openAMPM || 'AM'}
                            onChange={(e) => updateDayTime(day.key, 'openAMPM', e.target.value)}
                          >
                            <option value="AM">AM</option>
                            <option value="PM">PM</option>
                          </select>
                        </div>
                      </div>

                      <div className="time-row">
                        <label>Closing</label>
                        <div className="time-inputs">
                          <select
                            value={dayHours.close || '17'}
                            onChange={(e) => updateDayTime(day.key, 'close', e.target.value)}
                          >
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(hour => (
                              <option key={hour} value={hour.toString().padStart(2, '0')}>
                                {hour}
                              </option>
                            ))}
                          </select>
                          <span>:</span>
                          <select
                            value={dayHours.closeMinute || '00'}
                            onChange={(e) => updateDayTime(day.key, 'closeMinute', e.target.value)}
                          >
                            {Array.from({ length: 60 }, (_, i) => i).map(minute => (
                              <option key={minute} value={minute.toString().padStart(2, '0')}>
                                {minute.toString().padStart(2, '0')}
                              </option>
                            ))}
                          </select>
                          <select
                            value={dayHours.closeAMPM || 'PM'}
                            onChange={(e) => updateDayTime(day.key, 'closeAMPM', e.target.value)}
                          >
                            <option value="AM">AM</option>
                            <option value="PM">PM</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {!isOpen && (
                  <div className="closed-message">
                    <XCircle size={16} />
                    <span>Closed for the day</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="help-text">
        <Clock size={16} />
        <span>
          Use Quick Setup to set the same time for multiple days, then customize individual days as needed.
        </span>
      </div>
    </div>
  )
}

