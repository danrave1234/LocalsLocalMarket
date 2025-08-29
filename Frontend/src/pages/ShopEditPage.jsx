import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'
import { fetchShopById, updateShopRequest, fetchCategories } from '../api/shops.js'
import { apiRequest, API_BASE } from '../api/client.js'

export default function ShopEditPage(){
  const { id: slug } = useParams()
  const navigate = useNavigate()
  const { token, user } = useAuth()
  const [shop, setShop] = useState(null)
  const [categories, setCategories] = useState([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: '', description: '', category: '', addressLine: '', phone: '', website: '', email: '',
    facebook: '', instagram: '', twitter: '', lat: '', lng: '', logoPath: '', coverPath: '',
    adsEnabled: false, adsImagePathsJson: '[]'
  })

  useEffect(()=>{
    (async()=>{
      try{
        const cats = await fetchCategories()
        setCategories(cats.categories || [])
      }catch{ /* ignore */ }
      try{
        const s = await fetchShopById(slug)
        setShop(s)
        setForm({
          name: s.name||'', description: s.description||'', category: s.category||'', addressLine: s.addressLine||'',
          phone: s.phone||'', website: s.website||'', email: s.email||'', facebook: s.facebook||'', instagram: s.instagram||'', twitter: s.twitter||'',
          lat: s.lat ?? '', lng: s.lng ?? '', logoPath: s.logoPath||'', coverPath: s.coverPath||'',
          adsEnabled: !!s.adsEnabled, adsImagePathsJson: s.adsImagePathsJson || '[]'
        })
      }catch(e){ setError(e.message) }
    })()
  },[slug])

  const isOwner = shop && user && shop.owner && shop.owner.id === user.id

  const onUpload = async (file) => {
    const fd = new FormData()
    fd.append('file', file)
    const res = await apiRequest('/uploads/image', { method: 'POST', body: fd, token })
    return res.path
  }

  const handleSubmit = async (e)=>{
    e.preventDefault()
    if(!token) { setError('You must be logged in.'); return }
    if(!isOwner){ setError('Forbidden'); return }
    setSaving(true)
    setError('')
    try{
      const payload = {
        name: form.name, description: form.description, category: form.category, addressLine: form.addressLine,
        phone: form.phone, website: form.website, email: form.email, facebook: form.facebook, instagram: form.instagram, twitter: form.twitter,
        lat: form.lat === ''? null : Number(form.lat), lng: form.lng === ''? null : Number(form.lng), logoPath: form.logoPath, coverPath: form.coverPath,
        adsEnabled: !!form.adsEnabled, adsImagePathsJson: form.adsImagePathsJson
      }
      await updateShopRequest(slug, payload, token)
      navigate(`/shops/${slug}`)
    }catch(e){ setError(e.message||'Failed to save') }
    finally{ setSaving(false) }
  }

  if(!shop) return <main className="container"><div className="muted">Loading...</div></main>

  return (
    <main className="container" style={{maxWidth: 900}}>
      <h2>Edit Shop</h2>
      {error && <div style={{background:'var(--error-bg)',color:'var(--error)',padding:'0.75rem',borderRadius:8,marginBottom:12}}>{error}</div>}
      <form onSubmit={handleSubmit} className="card" style={{padding:16}}>
        <div className="form-row">
          <div style={{flex:1}}>
            <label className="muted form-label">Name *</label>
            <input className="input" required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
          </div>
          <div style={{width:260}}>
            <label className="muted form-label">Category</label>
            <select className="input" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
              <option value="">Select category</option>
              {categories.map(c=> <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <label className="muted form-label">Description</label>
        <textarea className="input" rows={3} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} />

        <label className="muted form-label">Address</label>
        <input className="input" value={form.addressLine} onChange={e=>setForm({...form,addressLine:e.target.value})} />

        <div className="form-row">
          <div>
            <label className="muted form-label">Latitude</label>
            <input className="input" type="number" step="0.000001" value={form.lat} onChange={e=>setForm({...form,lat:e.target.value})} />
          </div>
          <div>
            <label className="muted form-label">Longitude</label>
            <input className="input" type="number" step="0.000001" value={form.lng} onChange={e=>setForm({...form,lng:e.target.value})} />
          </div>
        </div>

        <div className="form-row">
          <div>
            <label className="muted form-label">Phone</label>
            <input className="input" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} />
          </div>
          <div>
            <label className="muted form-label">Email</label>
            <input className="input" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
          </div>
          <div>
            <label className="muted form-label">Website</label>
            <input className="input" value={form.website} onChange={e=>setForm({...form,website:e.target.value})} />
          </div>
        </div>

        <div className="form-row">
          <div>
            <label className="muted form-label">Facebook</label>
            <input className="input" value={form.facebook} onChange={e=>setForm({...form,facebook:e.target.value})} />
          </div>
          <div>
            <label className="muted form-label">Instagram</label>
            <input className="input" value={form.instagram} onChange={e=>setForm({...form,instagram:e.target.value})} />
          </div>
          <div>
            <label className="muted form-label">Twitter</label>
            <input className="input" value={form.twitter} onChange={e=>setForm({...form,twitter:e.target.value})} />
          </div>
        </div>

        <div className="form-row">
          <div>
            <label className="muted form-label">Logo</label>
            {form.logoPath && <div style={{marginBottom:8}}><img src={form.logoPath} alt="logo" style={{height:64,borderRadius:8}}/></div>}
            <input type="file" accept="image/*" onChange={async (e)=>{ const f=e.target.files?.[0]; if(!f) return; const path = await onUpload(f); setForm({...form,logoPath:path})}} />
          </div>
          <div>
            <label className="muted form-label">Cover</label>
            {form.coverPath && <div style={{marginBottom:8}}><img src={form.coverPath} alt="cover" style={{height:64,borderRadius:8}}/></div>}
            <input type="file" accept="image/*" onChange={async (e)=>{ const f=e.target.files?.[0]; if(!f) return; const path = await onUpload(f); setForm({...form,coverPath:path})}} />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn" onClick={()=>navigate(-1)}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving? 'Saving...':'Save Changes'}</button>
        </div>
      </form>

      <h3 style={{marginTop:24}}>Advertisements</h3>
      <AdsManager form={form} setForm={setForm} />

      <h3 style={{marginTop:24}}>Manage Products</h3>
      <ProductManager shopId={shop.id} />
    </main>
  )
}

function AdsManager({ form, setForm }){
  const { token } = useAuth()
  const [uploading, setUploading] = useState(false)

  const upload = async(file)=>{
    const fd = new FormData(); fd.append('file', file)
    const res = await apiRequest('/uploads/image', { method:'POST', body: fd, token })
    return res.path
  }

  let images = []
  try{ images = JSON.parse(form.adsImagePathsJson || '[]') } catch { images = [] }

  return (
    <section className="card" style={{padding:16}}>
      <div className="form-row" style={{alignItems:'center'}}>
        <label style={{display:'flex', gap:8, alignItems:'center'}}>
          <input type="checkbox" checked={!!form.adsEnabled} onChange={e=>setForm({...form, adsEnabled: e.target.checked})} />
          Enable Ads Carousel
        </label>
        <label className="btn" style={{marginLeft:'auto'}}>Upload Ad Image
          <input type="file" accept="image/*" style={{display:'none'}} onChange={async(e)=>{const f=e.target.files?.[0]; if(!f) return; setUploading(true); const path=await upload(f); const arr=[...images, path]; setForm({...form, adsImagePathsJson: JSON.stringify(arr)}); setUploading(false)}} />
        </label>
      </div>
      {uploading && <div className="muted">Uploading...</div>}
      <div style={{display:'flex', gap:8, flexWrap:'wrap', marginTop:8}}>
        {images.map((p, i)=> (
          <div key={i} className="card" style={{padding:4, position:'relative'}}>
            <img src={p} alt="ad" style={{height:64}}/>
            <button type="button" className="btn" style={{position:'absolute', top:4, right:4}} onClick={()=>{
              const arr = images.filter((_,idx)=> idx!==i)
              setForm({...form, adsImagePathsJson: JSON.stringify(arr)})
            }}>✕</button>
          </div>
        ))}
      </div>
      <p className="muted" style={{marginTop:8}}>Ads are saved with Save Changes above.</p>
    </section>
  )
}

function ProductManager({ shopId }){
  const { token } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [newItem, setNewItem] = useState({ title:'', description:'', price:'', category:'', stockCount:'', images: [] })

  const load = async()=>{
    setLoading(true)
    setError('')
    try{
      const res = await fetch(`${API_BASE}/products?shopId=${shopId}`)
      const data = await res.json()
      const list = Array.isArray(data) ? data : (data.content||[])
      setProducts(list)
    }catch(e){ setError(e.message)} finally{ setLoading(false)}
  }
  useEffect(()=>{ load() },[shopId])

  const upload = async(file)=>{
    const fd = new FormData(); fd.append('file', file)
    const res = await apiRequest('/uploads/image', { method:'POST', body: fd, token })
    return res.path
  }
  const create = async()=>{
    try{
      const imagePathsJson = JSON.stringify(newItem.images)
      await apiRequest('/products', { method:'POST', token, body:{ shopId, title:newItem.title, description:newItem.description, price: Number(newItem.price), stockCount: newItem.stockCount===''? 0 : Number(newItem.stockCount), imagePathsJson, category: newItem.category }})
      setNewItem({ title:'', description:'', price:'', category:'', images: [] })
      await load()
    }catch(e){ setError(e.message) }
  }
  const update = async(p, patch)=>{
    try{
      const merged = { ...p, ...patch }
      const body = { title: merged.title, description: merged.description, price: merged.price, imagePathsJson: merged.imagePathsJson, category: merged.category }
      await apiRequest(`/products/${p.id}`, { method:'PATCH', token, body })
      await load()
    }catch(e){ setError(e.message) }
  }
  const remove = async(id)=>{
    try{
      await apiRequest(`/products/${id}`, { method:'DELETE', token })
      await load()
    }catch(e){ setError(e.message) }
  }

  return (
    <section className="card" style={{padding:16}}>
      {error && <div style={{background:'var(--error-bg)',color:'var(--error)',padding:'0.5rem',borderRadius:8,marginBottom:12}}>{error}</div>}
      <h4 style={{marginTop:0}}>Add Product</h4>
      <div className="form-row">
        <input className="input" placeholder="Title" value={newItem.title} onChange={e=>setNewItem({...newItem,title:e.target.value})} />
        <input className="input" type="number" step="0.01" placeholder="Price" value={newItem.price} onChange={e=>setNewItem({...newItem,price:e.target.value})} />
        <input className="input" type="number" step="1" placeholder="Stock" value={newItem.stockCount} onChange={e=>setNewItem({...newItem,stockCount:e.target.value})} />
        <input className="input" placeholder="Category" value={newItem.category} onChange={e=>setNewItem({...newItem,category:e.target.value})} />
      </div>
      <textarea className="input" rows={2} placeholder="Description" value={newItem.description} onChange={e=>setNewItem({...newItem,description:e.target.value})} />
      <div style={{marginTop:8}}>
        <label className="btn">Upload Image<input type="file" accept="image/*" onChange={async(e)=>{const f=e.target.files?.[0]; if(!f) return; const path=await upload(f); setNewItem({...newItem, images:[...newItem.images, path]})}} style={{display:'none'}}/></label>
        <div style={{display:'flex', gap:8, marginTop:8, flexWrap:'wrap'}}>
          {newItem.images.map((p,i)=> (
            <div key={i} className="card" style={{padding:4}}>
              <img src={p} alt="img" style={{height:56}}/>
            </div>
          ))}
        </div>
      </div>
      <div className="form-actions">
        <button className="btn btn-primary" onClick={create}>Add Product</button>
      </div>

      <h4>Existing Products</h4>
      {loading ? <div className="muted">Loading...</div> : (
        products.length===0 ? <div className="muted">No products yet.</div> : (
          <div style={{display:'grid', gap:12}}>
            {products.map(p=> (
              <div key={p.id} className="card" style={{padding:12, display:'grid', gap:8}}>
                <div className="form-row">
                  <input className="input" value={p.title||''} onChange={e=>update(p,{ title: e.target.value })} />
                  <input className="input" type="number" step="0.01" value={p.price??0} onChange={e=>update(p,{ price: Number(e.target.value) })} />
                  <input className="input" type="number" step="1" value={p.stockCount??0} onChange={e=>update(p,{ stockCount: Number(e.target.value) })} />
                </div>
                <textarea className="input" rows={2} value={p.description||''} onChange={e=>update(p,{ description: e.target.value })} />
                <div className="form-row">
                  <input className="input" value={p.category||''} onChange={e=>update(p,{ category: e.target.value })} />
                  <button className="btn" onClick={()=>remove(p.id)}>Delete</button>
                </div>
                <div>
                  <div className="form-row" style={{alignItems:'center'}}>
                    <label className="btn">Upload Image<input type="file" accept="image/*" onChange={async(e)=>{const f=e.target.files?.[0]; if(!f) return; const path=await upload(f); const images = Array.isArray(p.imagePathsJson)? p.imagePathsJson : (p.imagePathsJson? JSON.parse(p.imagePathsJson):[]); images.push(path); await update(p,{ imagePathsJson: JSON.stringify(images) })}} style={{display:'none'}}/></label>
                    <button className="btn" onClick={async()=>{ await apiRequest(`/products/${p.id}/decrement-stock?amount=1`, { method:'POST', token }); await load() }}>Reduce Stock -1</button>
                    <label style={{display:'flex', gap:8, alignItems:'center'}}>
                      <input type="checkbox" checked={!!p.isActive} onChange={async(e)=>{ await update(p,{ isActive: e.target.checked }) }} /> Active
                    </label>
                  </div>
                  <div style={{display:'flex', gap:8, marginTop:8, flexWrap:'wrap'}}>
                    {(Array.isArray(p.imagePathsJson)? p.imagePathsJson : (p.imagePathsJson? JSON.parse(p.imagePathsJson):[])).map((path,idx)=> (
                      <div key={idx} className="card" style={{padding:4}}>
                        <img src={path} alt="img" style={{height:56}}/>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </section>
  )
}