import { Helmet } from 'react-helmet-async'

const SEOHead = ({ 
  title, 
  description, 
  keywords, 
  image, 
  url, 
  type = 'website',
  structuredData = null 
}) => {
  const defaultTitle = 'LocalsLocalMarket - Connect with Local Businesses'
  const defaultDescription = 'Discover and connect with local businesses in your community. Find products, services, and support local entrepreneurs on LocalsLocalMarket.'
  const defaultImage = 'https://localslocalmarket.com/og-image.svg'
  const defaultUrl = 'https://localslocalmarket.com'
  
  const finalTitle = title ? `${title} | LocalsLocalMarket` : defaultTitle
  const finalDescription = description || defaultDescription
  const finalImage = image || defaultImage
  const finalUrl = url || defaultUrl

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={finalUrl} />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={finalUrl} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:site_name" content="LocalsLocalMarket" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalImage} />
      <meta name="twitter:site" content="@localslocalmarket" />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  )
}

export default SEOHead
