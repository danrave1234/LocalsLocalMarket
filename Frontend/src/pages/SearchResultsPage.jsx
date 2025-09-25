import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchShops, fetchShopById, fetchShopsMeta } from '../api/shops.js'
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
      const shopMetaCache = new Map()
      const getShopMeta = async (sid) => {
        if (!sid) return null
        if (shopMetaCache.has(sid)) return shopMetaCache.get(sid)
        return null
      }
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
          let content = resp?.content || resp || []
          content = Array.isArray(content) ? content : []
          // Attempt to sort by each product's shop showcase priority when available
          // Note: assumes each product has shopId; fallback to current order if not resolvable
          // Batch prefetch meta for unique shopIds
          const productShopIds = Array.from(new Set(content.map(p => p.shopId || p.shop?.id).filter(Boolean)))
          if (productShopIds.length) {
            try {
              const metas = await fetchShopsMeta(productShopIds)
              metas.forEach(m => shopMetaCache.set(m.id, m))
            } catch {}
          }
          const withPriority = await Promise.all(content.map(async (p) => {
            const sid = p.shopId || p.shop?.id
            if (!sid) return { item: p, priority: 0 }
            try {
              const shopMeta = shopMetaCache.get(sid)
              const pr = (shopMeta?.showcasePriority || 'products') === 'products' ? 1 : 0
              return { item: p, priority: pr }
            } catch { return { item: p, priority: 0 } }
          }))
          withPriority.sort((a, b) => b.priority - a.priority)
          setResults(withPriority.map(x => x.item))
          setHasMore((resp?.content?.length || 0) === PAGE_SIZE)
        } else {
          // services
          const resp = await searchServices({ q: query, page, size: PAGE_SIZE })
          let content = resp?.content || resp || []
          content = Array.isArray(content) ? content : []
          const serviceShopIds = Array.from(new Set(content.map(s => s.shopId || s.shop?.id).filter(Boolean)))
          if (serviceShopIds.length) {
            try {
              const metas = await fetchShopsMeta(serviceShopIds)
              metas.forEach(m => shopMetaCache.set(m.id, m))
            } catch {}
          }
          const withPriority = await Promise.all(content.map(async (s) => {
            const sid = s.shopId || s.shop?.id
            if (!sid) return { item: s, priority: 0 }
            try {
              const shopMeta = shopMetaCache.get(sid)
              const pr = (shopMeta?.showcasePriority || 'products') === 'services' ? 1 : 0
              return { item: s, priority: pr }
            } catch { return { item: s, priority: 0 } }
          }))
          withPriority.sort((a, b) => b.priority - a.priority)
          setResults(withPriority.map(x => x.item))
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
          {results.map((item) => {
            const isProduct = !!item.price && (activeTab === 'products')
            const isService = !!item.price && (activeTab === 'services')
            const shop = item.shop || {}
            const shopLogo = shop.logoPath
            const pref = (shop.showcasePriority || '').toLowerCase()
            const prefLabel = pref === 'services' ? 'Prefers Services' : (pref === 'products' ? 'Prefers Products' : '')
            return (
              <li key={item.id || item.slug || (item.title + Math.random())} className="card" style={{ padding: '1rem' }}>
                {isProduct || isService ? (
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                    {shopLogo ? (
                      <img src={shopLogo} alt={shop.name || 'Shop'} style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--border)' }} />
                    )}
                    <div style={{ fontWeight: 600 }}>{shop.name || 'Shop'}</div>
                    {prefLabel && (
                      <span className="chip" style={{ marginLeft: 'auto' }}>{prefLabel}</span>
                    )}
                  </div>
                ) : null}
                <div style={{ fontWeight: 600, marginBottom: 4 }}>{item.name || item.title}</div>
                {item.description && <div className="muted" style={{ fontSize: 14 }}>{item.description}</div>}
              </li>
            )
          })}
        </ul>
      )}

      <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
        <button className="btn outline" disabled={page === 0 || loading} onClick={prevPage}>Previous</button>
        <button className="btn" disabled={!hasMore || loading} onClick={nextPage}>Next</button>
      </div>
    </div>
  )
}



