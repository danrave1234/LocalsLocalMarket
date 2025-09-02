/**
 * Performance monitoring utilities
 */

// Performance metrics tracking
class PerformanceMonitor {
  constructor() {
    this.metrics = new Map()
    this.observers = []
  }

  // Start timing an operation
  startTimer(name) {
    const startTime = performance.now()
    this.metrics.set(name, { startTime, endTime: null, duration: null })
    return startTime
  }

  // End timing an operation
  endTimer(name) {
    const metric = this.metrics.get(name)
    if (metric) {
      metric.endTime = performance.now()
      metric.duration = metric.endTime - metric.startTime
      
      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`⏱️ ${name}: ${metric.duration.toFixed(2)}ms`)
      }
      
      // Notify observers
      this.notifyObservers(name, metric)
    }
  }

  // Get duration for a specific operation
  getDuration(name) {
    const metric = this.metrics.get(name)
    return metric ? metric.duration : null
  }

  // Get all metrics
  getAllMetrics() {
    return Object.fromEntries(this.metrics)
  }

  // Clear all metrics
  clear() {
    this.metrics.clear()
  }

  // Add observer for performance events
  addObserver(callback) {
    this.observers.push(callback)
  }

  // Remove observer
  removeObserver(callback) {
    const index = this.observers.indexOf(callback)
    if (index > -1) {
      this.observers.splice(index, 1)
    }
  }

  // Notify all observers
  notifyObservers(name, metric) {
    this.observers.forEach(callback => {
      try {
        callback(name, metric)
      } catch (error) {
        console.error('Performance observer error:', error)
      }
    })
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor()

// React hook for measuring component render time
export function usePerformanceMonitor(componentName) {
  React.useEffect(() => {
    const startTime = performance.now()
    
    return () => {
      const endTime = performance.now()
      const duration = endTime - startTime
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`🎭 ${componentName} render: ${duration.toFixed(2)}ms`)
      }
    }
  })
}

// Higher-order component for measuring render performance
export function withPerformanceMonitor(WrappedComponent, componentName) {
  return function PerformanceMonitoredComponent(props) {
    usePerformanceMonitor(componentName)
    return <WrappedComponent {...props} />
  }
}

// Utility for measuring async operations
export async function measureAsync(name, asyncFn) {
  performanceMonitor.startTimer(name)
  try {
    const result = await asyncFn()
    performanceMonitor.endTimer(name)
    return result
  } catch (error) {
    performanceMonitor.endTimer(name)
    throw error
  }
}

// Utility for measuring sync operations
export function measureSync(name, syncFn) {
  performanceMonitor.startTimer(name)
  try {
    const result = syncFn()
    performanceMonitor.endTimer(name)
    return result
  } catch (error) {
    performanceMonitor.endTimer(name)
    throw error
  }
}
