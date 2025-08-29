import SEOHead from "../components/SEOHead.jsx"
import SocialSharing from "../components/SocialSharing.jsx"
import FAQ from "../components/FAQ.jsx"

export default function HelpPage() {
  return (
    <>
      <SEOHead 
        title="Help & FAQ"
        description="Share LocalsLocalMarket with friends and find answers to frequently asked questions."
      />
      <main className="container">
        <section style={{ marginTop: '1rem' }}>
          <h2 style={{ marginBottom: '0.5rem' }}>Share LocalsLocalMarket</h2>
          <p className="muted" style={{ marginBottom: '1rem' }}>
            Help others discover local businesses in their community
          </p>
          <SocialSharing 
            title="LocalsLocalMarket - Connect with Local Businesses"
            description="Discover and connect with local businesses in your community. Find products, services, and support local entrepreneurs."
          />
        </section>

        <section style={{ marginTop: '2rem' }}>
          <FAQ />
        </section>
      </main>
    </>
  )
}
