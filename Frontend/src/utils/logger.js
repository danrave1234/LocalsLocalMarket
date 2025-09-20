const shouldLog = !import.meta.env.PROD || import.meta.env.VITE_ENABLE_LOGS === 'true'

const format = (level, args) => [
  `[LLM:${level}]`,
  ...args
]

export const logger = {
  info: (...args) => { if (shouldLog) console.info(...format('INFO', args)) },
  warn: (...args) => { if (shouldLog) console.warn(...format('WARN', args)) },
  error: (...args) => { console.error(...format('ERROR', args)) },
  debug: (...args) => { if (shouldLog) console.debug(...format('DEBUG', args)) },
}


