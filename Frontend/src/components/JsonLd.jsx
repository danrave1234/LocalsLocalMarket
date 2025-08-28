import { Helmet } from 'react-helmet-async'

const JsonLd = ({ data }) => {
  if (!data) return null

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(data)}
      </script>
    </Helmet>
  )
}

export default JsonLd
