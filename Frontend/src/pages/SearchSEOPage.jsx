import { Link } from "react-router-dom"
import SEOHead from "../components/SEOHead.jsx"
import { Megaphone, Store, Package, Wrench, Rocket, ShieldCheck, Search, FilePlus2 } from "lucide-react"

export default function SearchSEOPage() {
  const pageTitle = "Post Products, Services, and Shops"
  const pageDescription = "Post your products, services, or shop on LocalsLocalMarket. Reach nearby customers, boost local visibility, and start getting inquiries fast."
  const canonicalUrl = "https://localslocalmarket.com/post"

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: pageTitle,
    description: pageDescription,
    url: canonicalUrl,
    about: [
      { "@type": "Thing", name: "Post product" },
      { "@type": "Thing", name: "Post service" },
      { "@type": "Thing", name: "Post shop" }
    ],
    mainEntity: {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How do I post a shop?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Create an account, go to Create Shop, add your details, and publish."
          }
        },
        {
          "@type": "Question",
          name: "Can I post products and services?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. After creating your shop, add product and service listings from your dashboard."
          }
        },
        {
          "@type": "Question",
          name: "Is posting free?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Posting is free. Optional promotional placements may be offered in the future."
          }
        }
      ]
    }
  }

  return (
    <>
      <SEOHead
        title={pageTitle}
        description={pageDescription}
        keywords="post product, post service, post shop, create shop, list services, list products, local marketplace posting, free listing"
        url={canonicalUrl}
        type="article"
        structuredData={structuredData}
      />

      <main className="container" style={{ padding: "2rem 1rem", maxWidth: 1100 }}>
        <header style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: ".75rem" }}>
          <Megaphone size={28} aria-hidden />
          <div>
            <h1 style={{ margin: 0, fontSize: "1.6rem" }}>{pageTitle}</h1>
            <p className="muted" style={{ margin: 0 }}>{pageDescription}</p>
          </div>
        </header>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
          <div className="card" style={{ padding: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".5rem" }}>
              <Store size={20} aria-hidden />
              <h2 style={{ margin: 0, fontSize: "1rem" }}>Post a Shop</h2>
            </div>
            <p className="muted" style={{ marginTop: 0 }}>Create your shop page with photos, address, and contact info.</p>
            <Link to="/shops/create" className="btn btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: ".5rem" }}>
              <FilePlus2 size={16} aria-hidden />
              Create Shop
            </Link>
          </div>

          <div className="card" style={{ padding: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".5rem" }}>
              <Package size={20} aria-hidden />
              <h2 style={{ margin: 0, fontSize: "1rem" }}>Post a Product</h2>
            </div>
            <p className="muted" style={{ marginTop: 0 }}>Add product listings under your shop to reach nearby buyers.</p>
            <Link to="/dashboard" className="btn btn-secondary" style={{ display: "inline-flex", alignItems: "center", gap: ".5rem" }}>
              <Rocket size={16} aria-hidden />
              Go to Dashboard
            </Link>
          </div>

          <div className="card" style={{ padding: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".5rem" }}>
              <Wrench size={20} aria-hidden />
              <h2 style={{ margin: 0, fontSize: "1rem" }}>Post a Service</h2>
            </div>
            <p className="muted" style={{ marginTop: 0 }}>List your services, pricing, and service areas for customers.</p>
            <Link to="/dashboard" className="btn btn-secondary" style={{ display: "inline-flex", alignItems: "center", gap: ".5rem" }}>
              <Rocket size={16} aria-hidden />
              Go to Dashboard
            </Link>
          </div>
        </section>

        <section className="card" style={{ padding: "1rem", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".5rem" }}>
            <Search size={18} aria-hidden />
            <h2 style={{ margin: 0, fontSize: "1rem" }}>Why post on LocalsLocalMarket?</h2>
          </div>
          <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
            <li>Appear in local search for buyers near you</li>
            <li>Share a single shop link across social platforms</li>
            <li>Accept reviews to build trusted reputation</li>
            <li>Free to start; optimized for mobile discovery</li>
          </ul>
        </section>

        <section className="card" style={{ padding: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".5rem" }}>
            <ShieldCheck size={18} aria-hidden />
            <h2 style={{ margin: 0, fontSize: "1rem" }}>Tips to rank higher</h2>
          </div>
          <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
            <li>Use clear titles like “Bakery in Cebu – Custom Cakes & Pastries”</li>
            <li>Add detailed descriptions, categories, and service areas</li>
            <li>Upload high-quality photos (cover and logo)</li>
            <li>Keep your address and contact information accurate</li>
          </ul>
        </section>
      </main>
    </>
  )
}




