import { useState, useEffect } from 'react'
import { Clock, X, Sun, Moon } from 'lucide-react'
import './BusinessHours.css'

const BusinessHours = ({ value, onChange, disabled = false }) => {
  const defaultBusinessHours = {
    monday: { open: '9:00 AM', close: '6:00 PM', closed: false },
    tuesday: { open: '9:00 AM', close: '6:00 PM', closed: false },
    wednesday: { open: '9:00 AM', close: '6:00 PM', closed: false },
    thursday: { open: '9:00 AM', close: '6:00 PM', closed: false },
    friday: { open: '9:00 AM', close: '6:00 PM', closed: false },
    saturday: { open: '10:00 AM', close: '4:00 PM', closed: false },
    sunday: { open: '10:00 AM', close: '4:00 PM', closed: true }
  }

  const [businessHours, setBusinessHours] = useState(defaultBusinessHours)

  useEffect(() => {
    console.log('BusinessHours component - value received:', value)
    console.log('BusinessHours component - value type:', typeof value)
    console.log('BusinessHours component - value length:', value ? value.length : 'undefined')
    
    if (value && value !== '') {
      try {
        const parsed = typeof value === 'string' ? JSON.parse(value) : value
        console.log('BusinessHours component - parsed hours:', parsed)
        console.log('BusinessHours component - parsed type:', typeof parsed)
        console.log('BusinessHours component - monday data:', parsed.monday)
        
        // Validate and sanitize the parsed data
        const sanitized = {}
        Object.keys(defaultBusinessHours).forEach(day => {
          if (parsed[day] && typeof parsed[day] === 'object') {
            sanitized[day] = {
              open: parsed[day].open || defaultBusinessHours[day].open,
              close: parsed[day].close || defaultBusinessHours[day].close,
              closed: parsed[day].closed !== undefined ? parsed[day].closed : defaultBusinessHours[day].closed
            }
          } else {
            sanitized[day] = { ...defaultBusinessHours[day] }
          }
        })
        
        console.log('BusinessHours component - sanitized hours:', sanitized)
        setBusinessHours(sanitized)
      } catch (error) {
        console.error('Failed to parse business hours:', error)
        console.log('Using default business hours instead')
        setBusinessHours(defaultBusinessHours)
        onChange(JSON.stringify(defaultBusinessHours))
      }
    } else {
      console.log('BusinessHours component - no value, using defaults')
      setBusinessHours(defaultBusinessHours)
      onChange(JSON.stringify(defaultBusinessHours))
    }
  }, [value, onChange])

  const handleDayChange = (day, field, newValue) => {
    const updatedHours = {
      ...businessHours,
      [day]: {
        ...businessHours[day],
        [field]: newValue
      }
    }
    setBusinessHours(updatedHours)
    onChange(JSON.stringify(updatedHours))
  }

  const toggleDayClosed = (day) => {
    const updatedHours = {
      ...businessHours,
      [day]: {
        ...businessHours[day],
        closed: !businessHours[day].closed
      }
    }
    setBusinessHours(updatedHours)
    onChange(JSON.stringify(updatedHours))
  }

  const parseTime = (timeStr) => {
    console.log('parseTime called with:', timeStr)
    
    // Handle null, undefined, or empty strings
    if (!timeStr || typeof timeStr !== 'string') {
      console.log('parseTime: invalid input, returning default')
      return { hour: 9, minute: 0, ampm: 'AM' }
    }
    
    // Try to parse 12-hour format first (e.g., "9:00 AM")
    let match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
    if (match) {
      const result = {
        hour: parseInt(match[1]),
        minute: parseInt(match[2]),
        ampm: match[3].toUpperCase()
      }
      console.log('parseTime: parsed 12-hour format successfully:', result)
      return result
    }
    
    // Try to parse 24-hour format (e.g., "09:00") and convert to 12-hour
    match = timeStr.match(/^(\d{1,2}):(\d{2})$/)
    if (match) {
      let hour = parseInt(match[1])
      const minute = parseInt(match[2])
      let ampm = 'AM'
      
      if (hour === 0) {
        hour = 12
        ampm = 'AM'
      } else if (hour === 12) {
        ampm = 'PM'
      } else if (hour > 12) {
        hour = hour - 12
        ampm = 'PM'
      }
      
      const result = { hour, minute, ampm }
      console.log('parseTime: converted 24-hour to 12-hour format:', result)
      return result
    }
    
    // Try to parse just numbers (e.g., "9", "18") and assume minutes are 0
    match = timeStr.match(/^(\d{1,2})$/)
    if (match) {
      let hour = parseInt(match[1])
      let ampm = 'AM'
      
      if (hour === 0) {
        hour = 12
        ampm = 'AM'
      } else if (hour === 12) {
        ampm = 'PM'
      } else if (hour > 12) {
        hour = hour - 12
        ampm = 'PM'
      }
      
      const result = { hour, minute: 0, ampm }
      console.log('parseTime: parsed single number format:', result)
      return result
    }
    
    console.log('parseTime: no valid format found, returning default')
    // Fallback for any other format
    return { hour: 9, minute: 0, ampm: 'AM' }
  }

  const formatTime = (hour, minute, ampm) => {
    return `${hour}:${minute.toString().padStart(2, '0')} ${ampm}`
  }

  const days = [
    { key: 'monday', label: 'Monday', icon: '🌅' },
    { key: 'tuesday', label: 'Tuesday', icon: '🌅' },
    { key: 'wednesday', label: 'Wednesday', icon: '🌅' },
    { key: 'thursday', label: 'Thursday', icon: '🌅' },
    { key: 'friday', label: 'Friday', icon: '🌅' },
    { key: 'saturday', label: 'Saturday', icon: '🌅' },
    { key: 'sunday', label: 'Sunday', icon: '🌅' }
  ]

  return (
    <div className="business-hours-editor">
      <div className="business-hours-header">
        <div className="header-content">
          <Clock className="business-hours-icon" size={24} />
          <div className="header-text">
            <h4 className="business-hours-title">Business Hours</h4>
            <p className="business-hours-subtitle">Set your operating hours for each day</p>
          </div>
        </div>
      </div>
      
      <div className="business-hours-grid">
        {days.map(({ key, label, icon }) => {
          const dayHours = businessHours[key]
          const openTime = parseTime(dayHours.open)
          const closeTime = parseTime(dayHours.close)
          
          console.log(`Rendering ${key}:`, { dayHours, openTime, closeTime })
          
          return (
            <div key={key} className={`business-hours-day ${dayHours.closed ? 'closed' : 'open'}`}>
              <div className="day-header">
                <div className="day-info">
                  <span className="day-icon">{icon}</span>
                  <span className="day-name">{label}</span>
                </div>
                <label className="day-toggle">
                  <input
                    type="checkbox"
                    checked={!dayHours.closed}
                    onChange={() => toggleDayClosed(key)}
                    disabled={disabled}
                    className="day-checkbox"
                  />
                  <span className="toggle-label">
                    {dayHours.closed ? 'Closed' : 'Open'}
                  </span>
                </label>
              </div>
              
              {!dayHours.closed && (
                <div className="time-inputs">
                  <div className="time-input-group">
                    <label className="time-label">
                      <Sun size={16} />
                      <span>Open</span>
                    </label>
                    <div className="time-input-12h">
                      <input
                        type="number"
                        min="1"
                        max="12"
                        value={openTime.hour}
                        onChange={(e) => {
                          const hour = parseInt(e.target.value) || 1
                          const newTime = formatTime(hour, openTime.minute, openTime.ampm)
                          handleDayChange(key, 'open', newTime)
                        }}
                        disabled={disabled}
                        className="time-input-hour"
                      />
                      <span className="time-separator">:</span>
                      <input
                        type="number"
                        min="0"
                        max="59"
                        value={openTime.minute}
                        onChange={(e) => {
                          const minute = parseInt(e.target.value) || 0
                          const newTime = formatTime(openTime.hour, minute, openTime.ampm)
                          handleDayChange(key, 'open', newTime)
                        }}
                        disabled={disabled}
                        className="time-input-minute"
                      />
                      <select
                        value={openTime.ampm}
                        onChange={(e) => {
                          const ampm = e.target.value
                          const newTime = formatTime(openTime.hour, openTime.minute, ampm)
                          handleDayChange(key, 'open', newTime)
                        }}
                        disabled={disabled}
                        className="time-input-ampm"
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="time-input-group">
                    <label className="time-label">
                      <Moon size={16} />
                      <span>Close</span>
                    </label>
                    <div className="time-input-12h">
                      <input
                        type="number"
                        min="1"
                        max="12"
                        value={closeTime.hour}
                        onChange={(e) => {
                          const hour = parseInt(e.target.value) || 1
                          const newTime = formatTime(hour, closeTime.minute, closeTime.ampm)
                          handleDayChange(key, 'close', newTime)
                        }}
                        disabled={disabled}
                        className="time-input-hour"
                      />
                      <span className="time-separator">:</span>
                      <input
                        type="number"
                        min="0"
                        max="59"
                        value={closeTime.minute}
                        onChange={(e) => {
                          const minute = parseInt(e.target.value) || 0
                          const newTime = formatTime(closeTime.hour, minute, closeTime.ampm)
                          handleDayChange(key, 'close', newTime)
                        }}
                        disabled={disabled}
                        className="time-input-minute"
                      />
                      <select
                        value={closeTime.ampm}
                        onChange={(e) => {
                          const ampm = e.target.value
                          const newTime = formatTime(closeTime.hour, closeTime.minute, ampm)
                          handleDayChange(key, 'close', newTime)
                        }}
                        disabled={disabled}
                        className="time-input-ampm"
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
              
              {dayHours.closed && (
                <div className="closed-indicator">
                  <X size={18} />
                  <span>Closed for the day</span>
                </div>
              )}
            </div>
          )
        })}
      </div>
      
      <div className="business-hours-help">
        <div className="help-content">
          <Clock size={16} />
          <div>
            <p className="help-title">Quick Setup Tips</p>
            <p className="help-text">
              • Check the box to set a day as open • Use 12-hour format with AM/PM • 
              Set consistent hours for weekdays and adjust for weekends
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BusinessHours
