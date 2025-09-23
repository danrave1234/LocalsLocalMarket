// Lightweight text sanitizer for rendering user-provided strings safely
// Removes script-y substrings and control characters; preserves plain text
export function sanitizeText(input) {
  if (input == null) return ''
  let value = String(input)
  value = value.replaceAll('\u0000', '').replace(/[\p{Cc}]/gu, '')
  value = value.replace(/<\s*script[^>]*>[\s\S]*?<\s*\/\s*script>/gi, '')
  value = value.replace(/on[a-z]+\s*=/gi, '')
  value = value.replace(/javascript:/gi, '')
  value = value.replace(/vbscript:/gi, '')
  value = value.replace(/<!--([\s\S]*?)-->/g, '')
  return value.trim()
}


