// Simple logger utility to avoid build-time import errors and provide consistent logging
// Usage: import { logger } from '../utils/logger.js'

let isDev = false
try {
  // import.meta is available in Vite/browser ESM
  // Guarded access to avoid syntax/runtime issues in other environments
  // eslint-disable-next-line no-undef
  isDev = !!(import.meta && import.meta.env && import.meta.env.DEV)
} catch (_) {
  isDev = false
}

export const logger = {
  info: (...args) => {
    try { console.info(...args) } catch { /* noop */ }
  },
  warn: (...args) => {
    try { console.warn(...args) } catch { /* noop */ }
  },
  error: (...args) => {
    try { console.error(...args) } catch { /* noop */ }
  },
  debug: (...args) => {
    try {
      if (isDev) console.debug(...args)
    } catch { /* noop */ }
  }
}
