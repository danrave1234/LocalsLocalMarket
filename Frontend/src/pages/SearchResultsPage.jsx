import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchShops } from '../api/shops.js'
import { fetchProducts } from '../api/products.js'
import { searchServices } from '../api/services.js'

const PAGE_SIZE = 20

export default function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState(searchParams.get('type') || 'shops')
  const query = (searchParams.get('q') || '').trim()
  const page = Number(searchParams.get('page') || 0)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [results, setResults] = useState([])
  const [hasMore, setHasMore] = useState(false)

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (value === undefined || value === null || value === '') next.delete(key)
    else next.set(key, value)
    setSearchParams(next, { replace: true })
  }

  // Keep tab param in URL
  useEffect(() => {
    updateParam('type', activeTab)
    // reset page when tab changes
    updateParam('page', 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab])

  useEffect(() => {
    if (!query) {
      setResults([])
      setHasMore(false)
      return
    }

    const load = async () => {
      setLoading(true)
      setError('')
      try {
        if (activeTab === 'shops') {
          // Use backend query if available, otherwise fallback client API
          const resp = await fetchShops({ q: query, page, size: PAGE_SIZE })
          const content = resp?.content || resp || []
          setResults(Array.isArray(content) ? content : [])
          setHasMore((resp?.content?.length || 0) === PAGE_SIZE)
        } else if (activeTab === 'products') {
          const resp = await fetchProducts({ q: query, page, size: PAGE_SIZE })
          const content = resp?.content || resp || []
          setResults(Array.isArray(content) ? content : [])
          setHasMore((resp?.content?.length || 0) === PAGE_SIZE)
        } else {
          // services
          const resp = await searchServices({ q: query, page, size: PAGE_SIZE })
          const content = resp?.content || resp || []
          setResults(Array.isArray(content) ? content : [])
          setHasMore((resp?.content?.length || 0) === PAGE_SIZE)
        }
      } catch (e) {
        setError(e.message || 'Search failed')
        setResults([])
        setHasMore(false)
      } finally {
        setLoading(false)
      }
    }

    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, page, activeTab])

  const onSubmit = (e) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const q = (form.get('q') || '').toString().trim()
    updateParam('q', q)
    updateParam('page', 0)
  }

  const nextPage = () => updateParam('page', page + 1)
  const prevPage = () => updateParam('page', Math.max(0, page - 1))

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <h1 style={{ marginBottom: '1rem' }}>Search Results</h1>
      <form onSubmit={onSubmit} style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
        <input name="q" defaultValue={query} placeholder="Search products, services, shops" className="input" />
        <button className="btn">Search</button>
      </form>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <button className={`btn ${activeTab === 'shops' ? '' : 'outline'}`} onClick={() => setActiveTab('shops')}>Shops</button>
        <button className={`btn ${activeTab === 'products' ? '' : 'outline'}`} onClick={() => setActiveTab('products')}>Products</button>
        <button className={`btn ${activeTab === 'services' ? '' : 'outline'}`} onClick={() => setActiveTab('services')}>Services</button>
      </div>

      {loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="card" style={{ padding: '1rem' }}>
              <div style={{ height: '1.5rem', background: 'var(--border)', borderRadius: '4px', marginBottom: '0.5rem' }}></div>
              <div style={{ height: '1rem', background: 'var(--border)', borderRadius: '4px', width: '70%', marginBottom: '0.5rem' }}></div>
              <div style={{ height: '0.875rem', background: 'var(--border)', borderRadius: '4px', width: '50%' }}></div>
            </div>
          ))}
        </div>
      )}
      {error && <div className="error">{error}</div>}

      {!loading && !error && (
        <ul className="list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
          {results.map((item) => (
            <li key={item.id || item.slug || (item.title + Math.random())} className="card" style={{ padding: '1rem' }}>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>{item.name || item.title}</div>
              {item.description && <div className="muted" style={{ fontSize: 14 }}>{item.description}</div>}
            </li>
          ))}
        </ul>
      )}

      <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
        <button className="btn outline" disabled={page === 0 || loading} onClick={prevPage}>Previous</button>
        <button className="btn" disabled={!hasMore || loading} onClick={nextPage}>Next</button>
      </div>
    </div>
  )
}



