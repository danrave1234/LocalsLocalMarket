import { useEffect } from 'react'

const PageSpeed = () => {
  useEffect(() => {
    // Preload critical resources
    const preloadLinks = [
      { rel: 'preload', href: '/src/assets/fonts/inter-var.woff2', as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
      { rel: 'preload', href: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css', as: 'style' },
      { rel: 'dns-prefetch', href: 'https://unpkg.com' },
      { rel: 'dns-prefetch', href: 'https://www.googletagmanager.com' },
      // AdSense disabled
    ]

    preloadLinks.forEach(link => {
      const linkElement = document.createElement('link')
      Object.assign(linkElement, link)
      document.head.appendChild(linkElement)
    })

    // Lazy load non-critical resources
    const lazyLoadScripts = [
      'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    ]

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const script = document.createElement('script')
          script.src = entry.target.dataset.src
          script.async = true
          document.head.appendChild(script)
          observer.unobserve(entry.target)
        }
      })
    })

    // Add intersection observer targets for lazy loading
    lazyLoadScripts.forEach(src => {
      const div = document.createElement('div')
      div.dataset.src = src
      div.style.display = 'none'
      document.body.appendChild(div)
      observer.observe(div)
    })

    return () => {
      observer.disconnect()
    }
  }, [])

  return null
}

export default PageSpeed
