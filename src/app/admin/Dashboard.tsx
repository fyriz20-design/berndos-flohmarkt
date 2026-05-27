'use client'
import { useState, useEffect, useRef } from 'react'
import { logoutAction } from './actions'

type Article = { id: string; title: string; description: string; price: number; imageUrl: string | null; imagesJson: string; stock: number; isAvailable: boolean; createdAt: string }
type Order = { id: string; customerName: string; customerEmail: string; customerAddress: string; subtotal: number; shippingCost: number; totalAmount: number; paymentMethod: string; status: string; createdAt: string; itemsJson: string }
type Settings = { paypalClientId: string; bankIban: string; bankBic: string; bankHolder: string; bankName: string }
type Tab = 'articles' | 'orders' | 'settings' | 'analytics'
type Analytics = { total: number; today: number; week: number; month: number; daily: { date: string; count: number }[] }

export default function Dashboard({ articles: initialArticles, orders: initialOrders }: { articles: Article[]; orders: Order[]; settings: Settings | null }) {
  const [tab, setTab] = useState<Tab>('articles')
  const [articles, setArticles] = useState<Article[]>(initialArticles || [])
  const [orders, setOrders] = useState<Order[]>(initialOrders || [])
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [newArticle, setNewArticle] = useState({ title: '', description: '', price: '', stock: '1' })
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)
  const [editForm, setEditForm] = useState({ title: '', description: '', price: '', stock: '' })
  const [editImageFiles, setEditImageFiles] = useState<File[]>([])
  const [editImagePreviews, setEditImagePreviews] = useState<string[]>([])
  const [editExistingImages, setEditExistingImages] = useState<string[]>([])
  const [settings, setSettings] = useState<Settings>({ paypalClientId: '', bankIban: '', bankBic: '', bankHolder: '', bankName: '' })
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [isMobile, setIsMobile] = useState(true)
  const imgInputRef = useRef<HTMLInputElement>(null)
  const editImgInputRef = useRef<HTMLInputElement>(null)
  useEffect(function() {
    function check() { setIsMobile(window.innerWidth < 640) }
    check()
    window.addEventListener('resize', check)
    return function() { window.removeEventListener('resize', check) }
  }, [])

  useEffect(function() {
    fetch('/api/articles').then(function(r){return r.json()}).then(function(d){if(Array.isArray(d))setArticles(d)}).catch(console.error)
    fetch('/api/order').then(function(r){return r.json()}).then(function(d){if(Array.isArray(d))setOrders(d)}).catch(console.error)
  }, [])

  useEffect(function() {
    fetch('/api/analytics').then(function(r){return r.json()}).then(function(d){if(!d.error)setAnalytics(d)}).catch(console.error)
  }, [])

  useEffect(function() {
    fetch('/api/settings')
      .then(function(r) { return r.json() })
      .then(function(data) {
        if (data && !data.error) {
          setSettings({
            paypalClientId: data.paypalClientId || '',
            bankIban: data.bankIban || '',
            bankBic: data.bankBic || '',
            bankHolder: data.bankHolder || '',
            bankName: data.bankName || ''
          })
        }
      })
      .catch(function(e) { console.error(e) })
  }, [])

  function flash(text: string) { setMsg(text); setTimeout(function() { setMsg('') }, 3000) }

  async function handleCreateArticle() {
    if (!newArticle.title || !newArticle.price) { flash('Titel und Preis angeben!'); return }
    setLoading(true)
    try {
      const uploadedUrls: string[] = []
      for (const file of imageFiles) {
        const fd = new FormData()
        fd.append('file', file)
        const result = await (await fetch('/api/upload', { method: 'POST', body: fd })).json()
        if (result.imageUrl) uploadedUrls.push(result.imageUrl)
      }
      const res = await fetch('/api/articles', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: newArticle.title, description: newArticle.description, price: parseFloat(newArticle.price), stock: parseInt(newArticle.stock), imageUrl: uploadedUrls[0] || null, imagesJson: JSON.stringify(uploadedUrls) }) })
      if (res.ok) {
        const c = await res.json()
        setArticles(function(p) { return [c, ...p] })
        setNewArticle({ title: '', description: '', price: '', stock: '1' })
        setImageFiles([])
        setImagePreviews([])
        setShowForm(false)
        flash('Artikel erstellt!')
      } else { flash('Fehler beim Erstellen') }
    } catch(e) { flash('Verbindungsfehler') }
    setLoading(false)
  }

  async function handleUpdateArticle() {
    if (!editingArticle || !editForm.title || !editForm.price) { flash('Pflichtfelder ausfuellen'); return }
    setLoading(true)
    try {
      const newUrls: string[] = []
      for (const file of editImageFiles) {
        const fd = new FormData()
        fd.append('file', file)
        const result = await (await fetch('/api/upload', { method: 'POST', body: fd })).json()
        if (result.imageUrl) newUrls.push(result.imageUrl)
      }
      const allUrls = [...editExistingImages, ...newUrls]
      const res = await fetch('/api/articles/' + editingArticle.id, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: editForm.title, description: editForm.description, price: parseFloat(editForm.price), stock: parseInt(editForm.stock), imageUrl: allUrls[0] || null, imagesJson: JSON.stringify(allUrls) }) })
      if (res.ok) {
        const u = await res.json()
        setArticles(function(p) { return p.map(function(a) { return a.id === u.id ? u : a }) })
        setEditingArticle(null)
        setEditImageFiles([])
        setEditImagePreviews([])
        setEditExistingImages([])
        flash('Artikel aktualisiert!')
      } else { flash('Fehler') }
    } catch(e) { flash('Verbindungsfehler') }
    setLoading(false)
  }

  async function handleDeleteArticle(id: string) {
    if (!confirm('Artikel loeschen?')) return
    setLoading(true)
    const res = await fetch('/api/articles/' + id, { method: 'DELETE' })
    if (res.ok) { setArticles(function(p) { return p.filter(function(a) { return a.id !== id }) }); flash('Geloescht!') } else flash('Fehler')
    setLoading(false)
  }

  async function handleOrderStatus(id: string, status: string) {
    const res = await fetch('/api/order/' + id, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: status }) })
    if (res.ok) { setOrders(function(p) { return p.map(function(o) { return o.id === id ? Object.assign({}, o, { status: status }) : o }) }); flash('Status aktualisiert!') }
  }

  async function handleDeleteOrder(id: string) {
    if (!confirm('Bestellung loeschen?')) return
    const res = await fetch('/api/order/' + id, { method: 'DELETE' })
    if (res.ok) { setOrders(function(p) { return p.filter(function(o) { return o.id !== id }) }); flash('Geloescht!') }
  }

  async function handleSaveSettings() {
    setLoading(true)
    try {
      const res = await fetch('/api/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings) })
      const data = await res.json()
      if (res.ok) {
        setSettings({ paypalClientId: data.paypalClientId || '', bankIban: data.bankIban || '', bankBic: data.bankBic || '', bankHolder: data.bankHolder || '', bankName: data.bankName || '' })
        flash('Gespeichert!')
      } else { flash('Fehler: ' + (data.error || '')) }
    } catch(e) { flash('Fehler: ' + String(e)) }
    setLoading(false)
  }

  const statusColors: Record<string, string> = { PENDING: '#f59e0b', PAID: '#10b981', SHIPPED: '#3b82f6', COMPLETED: '#6b7280', CANCELLED: '#ef4444' }
  const statusLabels: Record<string, string> = { PENDING: 'Ausstehend', PAID: 'Bezahlt', SHIPPED: 'Versendet', COMPLETED: 'Abgeschlossen', CANCELLED: 'Storniert' }
  const totalRevenue = orders.filter(function(o) { return o.status !== 'CANCELLED' }).reduce(function(s, o) { return s + o.totalAmount }, 0)
  const lbl: React.CSSProperties = { display: 'block', marginBottom: '0.375rem', fontWeight: 600, fontSize: '0.875rem', color: '#374151' }
  const inp: React.CSSProperties = { width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: '1.5px solid #e9d5ff', fontSize: '0.9375rem', fontFamily: 'inherit', color: '#1e1b4b', outline: 'none', boxSizing: 'border-box' as const, background: '#faf5ff' }
  const saveBtn: React.CSSProperties = { padding: '0.75rem 2rem', background: 'linear-gradient(135deg, #7c3aed, #ec4899)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', fontSize: '0.9375rem' }

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', minHeight: '100vh', background: '#f8f7ff', padding: '1rem', overflowX: 'hidden' as const }}>
      <style>{`
        .art-card { background: white; padding: 1rem; border: 1px solid #f3e8ff; box-sizing: border-box; width: 100%; overflow: hidden; }
        .art-inner { display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap; }
        .art-img { width: 64px; height: 64px; object-fit: cover; border-radius: 10px; flex-shrink: 0; }
        .art-placeholder { width: 64px; height: 64px; border-radius: 10px; background: #f5f0ff; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; }
        .art-info { flex: 1; min-width: 0; overflow: hidden; }
        .art-info-title { font-weight: 700; color: #1e1b4b; font-size: 0.9375rem; margin-bottom: 0.2rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .art-info-desc { color: #6b7280; font-size: 0.8125rem; margin-bottom: 0.375rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .art-btns { display: grid; grid-template-columns: 1fr 1fr; box-sizing: border-box; gap: 0.5rem; width: 100%; margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid #f3e8ff; }
        .btn-edit { min-height: 44px; font-size: 0.875rem; font-weight: 700; border: none; border-radius: 10px; cursor: pointer; background: #ede9fe; color: #7c3aed; padding: 0.5rem; }
        .btn-del { min-height: 44px; font-size: 0.875rem; font-weight: 700; border: none; border-radius: 10px; cursor: pointer; background: #fee2e2; color: #ef4444; padding: 0.5rem; }
        .tab-bar { display: flex; gap: 0.375rem; margin-bottom: 1.25rem; background: white; padding: 0.375rem; border-radius: 12px; border: 1px solid #f3e8ff; width: 100%; overflow-x: auto; scrollbar-width: none; -ms-overflow-style: none; }
        .tab-bar::-webkit-scrollbar { display: none; }
        .tab-btn { padding: 0.5rem 0.7rem; border-radius: 8px; border: none; cursor: pointer; font-weight: 600; font-size: 0.8rem; white-space: nowrap; flex-shrink: 0; }
        .img-grid { display: flex; gap: 0.5rem; flex-wrap: wrap; padding-top: 0.5rem; }
        .img-item { position: relative; display: inline-block; flex-shrink: 0; }
        .img-thumb { width: 68px; height: 68px; object-fit: cover; border-radius: 8px; display: block; }
        .img-del { position: absolute; top: -7px; right: -7px; background: #ef4444; color: white; border: none; border-radius: 50%; width: 20px; height: 20px; cursor: pointer; font-size: 11px; font-weight: 700; line-height: 1; display: flex; align-items: center; justify-content: center; padding: 0; touch-action: manipulation; }
        .img-add-lbl { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.625rem 1rem; background: #f5f0ff; color: #7c3aed; border-radius: 10px; cursor: pointer; font-weight: 600; border: 1.5px dashed #a855f7; font-size: 0.875rem; touch-action: manipulation; }
        @media (min-width: 640px) {
          .art-inner { flex-wrap: nowrap; }
          .art-img { width: 72px; height: 72px; }
          .art-placeholder { width: 72px; height: 72px; }
          .art-btns { width: auto; margin-top: 0; padding-top: 0; border-top: none; flex-shrink: 0; }
          .btn-edit { min-height: auto; font-size: 0.8125rem; }
          .btn-del { min-height: auto; font-size: 0.8125rem; }
          .tab-btn { font-size: 0.8125rem; padding: 0.5rem 0.75rem; }
        }
      `}</style>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(1.25rem, 4vw, 1.75rem)', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>Admin Dashboard</h1>
            <p style={{ color: '#6b7280', margin: '0.25rem 0 0', fontSize: '0.875rem' }}>Berndos Flohmarkt</p>
          </div>
          <form action={logoutAction}>
            <button type="submit" style={{ padding: '0.5rem 1.25rem', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '999px', fontWeight: 600, cursor: 'pointer' }}>Abmelden</button>
          </form>
        </div>
        {msg && <div style={{ padding: '0.875rem', borderRadius: '12px', marginBottom: '1rem', background: msg.includes('Fehler') ? '#fef2f2' : '#ecfdf5', color: msg.includes('Fehler') ? '#dc2626' : '#059669', fontWeight: 600 }}>{msg}</div>}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'Artikel', value: articles.length, color: '#7c3aed' },
            { label: 'Bestellungen', value: orders.length, color: '#ec4899' },
            { label: 'Umsatz', value: totalRevenue.toFixed(2) + ' €', color: '#10b981' },
            { label: 'Ausstehend', value: orders.filter(function(o) { return o.status === 'PENDING' }).length, color: '#f59e0b' },
          ].map(function(s) {
            return (
              <div key={s.label} style={{ background: 'white', borderRadius: '14px', padding: '1rem', border: '1px solid #f3e8ff' }}>
                <div style={{ fontSize: '1.375rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '0.8125rem', color: '#6b7280' }}>{s.label}</div>
              </div>
            )
          })}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, auto)', gap: '0.375rem', marginBottom: '1.25rem', background: 'white', padding: '0.375rem', borderRadius: '12px', border: '1px solid #f3e8ff', width: isMobile ? '100%' : 'fit-content' }}>
          {(['articles', 'orders', 'analytics', 'settings'] as Tab[]).map(function(key) {
            return (
              <button key={key} onClick={function() { setTab(key) }} style={{ padding: '0.625rem 0.5rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: isMobile ? '0.8125rem' : '0.8125rem', background: tab === key ? 'linear-gradient(135deg, #7c3aed, #a855f7)' : 'transparent', color: tab === key ? 'white' : '#6b7280', whiteSpace: 'nowrap', textAlign: 'center' as const }}>
                {key === 'articles' ? 'Artikel' : key === 'orders' ? 'Bestellungen' : key === 'analytics' ? '👁 Besucher' : 'Einstellungen'}
              </button>
            )
          })}
        </div>

        {tab === 'articles' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ margin: 0, fontWeight: 700, color: '#1e1b4b', fontSize: 'clamp(1.125rem, 3vw, 1.375rem)' }}>Meine Artikel</h2>
              <button onClick={function() { setShowForm(!showForm); setEditingArticle(null) }} style={{ padding: '0.625rem 1rem', background: 'linear-gradient(135deg, #7c3aed, #ec4899)', color: 'white', border: 'none', borderRadius: '999px', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem' }}>
                {showForm ? 'Abbrechen' : '+ Neuer Artikel'}
              </button>
            </div>
            {showForm && (
              <div style={{ background: 'white', borderRadius: '18px', padding: '1.5rem', marginBottom: '1.25rem', border: '1px solid #e9d5ff' }}>
                <h3 style={{ margin: '0 0 1rem', color: '#1e1b4b', fontWeight: 700 }}>Neuen Artikel anlegen</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                  <div><label style={lbl}>Titel *</label><input style={inp} placeholder="PlayStation Controller" value={newArticle.title} onChange={function(e) { setNewArticle(Object.assign({}, newArticle, { title: e.target.value })) }} /></div>
                  <div><label style={lbl}>Beschreibung</label><textarea style={Object.assign({}, inp, { minHeight: '80px' }) as React.CSSProperties} value={newArticle.description} onChange={function(e) { setNewArticle(Object.assign({}, newArticle, { description: e.target.value })) }} /></div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                    <div><label style={lbl}>Preis (€) *</label><input style={inp} type="number" step="0.01" value={newArticle.price} onChange={function(e) { setNewArticle(Object.assign({}, newArticle, { price: e.target.value })) }} /></div>
                    <div><label style={lbl}>Anzahl</label><input style={inp} type="number" min="1" value={newArticle.stock} onChange={function(e) { setNewArticle(Object.assign({}, newArticle, { stock: e.target.value })) }} /></div>
                  </div>
                  <div>
                    <label style={lbl}>Bilder (mehrere möglich)</label>
                    <input
                      ref={imgInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      style={{ display: 'none' }}
                      onChange={function(e) {
                        const files = Array.from(e.target.files || [])
                        if (files.length) {
                          setImageFiles(function(p) { return [...p, ...files] })
                          setImagePreviews(function(p) { return [...p, ...files.map(function(f) { return URL.createObjectURL(f) })] })
                        }
                        e.target.value = ''
                      }}
                    />
                    <button
                      type="button"
                      onClick={function() { imgInputRef.current && imgInputRef.current.click() }}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', background: '#f5f0ff', color: '#7c3aed', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, border: '1.5px dashed #a855f7', fontSize: '0.9375rem', width: '100%', justifyContent: 'center', minHeight: '52px', touchAction: 'manipulation' }}
                    >
                      📷 {imagePreviews.length > 0 ? `${imagePreviews.length} Bild${imagePreviews.length > 1 ? 'er' : ''} – weitere hinzufügen` : 'Bilder auswählen'}
                    </button>
                    {imagePreviews.length > 0 && (
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', paddingTop: '0.625rem' }}>
                        {imagePreviews.map(function(preview, i) {
                          return (
                            <div key={i} style={{ position: 'relative', display: 'inline-block', flexShrink: 0 }}>
                              <img src={preview} alt="" style={{ width: '72px', height: '72px', objectFit: 'cover', borderRadius: '8px', display: 'block', border: '2px solid #e9d5ff' }} />
                              <button type="button" onClick={function() { setImageFiles(function(p) { return p.filter(function(_, idx) { return idx !== i }) }); setImagePreviews(function(p) { return p.filter(function(_, idx) { return idx !== i }) }) }} style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#ef4444', color: 'white', border: '2px solid white', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, touchAction: 'manipulation' }}>✕</button>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
                <button onClick={handleCreateArticle} disabled={loading} style={Object.assign({}, saveBtn, { marginTop: '1rem', opacity: loading ? 0.7 : 1, width: '100%' })}>{loading ? 'Speichern...' : 'Artikel speichern'}</button>
              </div>
            )}
            {articles.length === 0 ? (
              <div style={{ background: 'white', borderRadius: '16px', padding: '3rem', textAlign: 'center', color: '#6b7280', border: '1px dashed #e9d5ff' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
                <p style={{ fontWeight: 600 }}>Keine Artikel vorhanden.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '0.875rem' }}>
                {articles.map(function(article) {
                  return (
                    <div key={article.id}>
                      <div style={{ background: 'white', padding: '1rem', border: '1px solid #f3e8ff', boxSizing: 'border-box' as const, width: '100%', overflow: 'hidden', borderRadius: editingArticle && editingArticle.id === article.id ? '16px 16px 0 0' : '16px', borderBottom: editingArticle && editingArticle.id === article.id ? 'none' : undefined }}>
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: isMobile ? 'wrap' : 'nowrap' as const }}>
                          {article.imageUrl
                            ? <img src={article.imageUrl} alt={article.title} style={{ width: '64px', height: '64px', objectFit: 'cover' as const, borderRadius: '10px', flexShrink: 0 }} />
                            : <div style={{ width: '64px', height: '64px', borderRadius: '10px', background: '#f5f0ff', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>📷</div>}
                          <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                            <div style={{ fontWeight: 700, color: '#1e1b4b', fontSize: '0.9375rem', marginBottom: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{article.title}</div>
                            <div style={{ color: '#6b7280', fontSize: '0.8125rem', marginBottom: '0.375rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{article.description}</div>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                              <span style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)', color: 'white', padding: '0.2rem 0.625rem', borderRadius: '999px', fontWeight: 700, fontSize: '0.8125rem', whiteSpace: 'nowrap' }}>{article.price.toFixed(2)} EUR</span>
                              <span style={{ background: '#f5f0ff', color: '#7c3aed', padding: '0.2rem 0.5rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, whiteSpace: 'nowrap' }}>Lager: {article.stock}</span>
                            </div>
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', width: '100%', marginTop: isMobile ? '0.75rem' : 0, paddingTop: isMobile ? '0.75rem' : 0, borderTop: isMobile ? '1px solid #f3e8ff' : 'none', flexShrink: 0 }}>
                            <button style={{ minHeight: '44px', fontSize: '0.875rem', fontWeight: 700, border: 'none', borderRadius: '10px', cursor: 'pointer', background: '#ede9fe', color: '#7c3aed', padding: '0.5rem' }} onClick={function() { if (editingArticle && editingArticle.id === article.id) { setEditingArticle(null) } else { setEditingArticle(article); setEditForm({ title: article.title, description: article.description, price: String(article.price), stock: String(article.stock) }); setEditImageFiles([]); setEditImagePreviews([]); let existing: string[] = []; try { existing = article.imagesJson ? JSON.parse(article.imagesJson) : [] } catch(e) {}; if (!existing.length && article.imageUrl) existing = [article.imageUrl]; setEditExistingImages(existing) } }}>Bearbeiten</button>
                            <button style={{ minHeight: '44px', fontSize: '0.875rem', fontWeight: 700, border: 'none', borderRadius: '10px', cursor: 'pointer', background: '#fee2e2', color: '#ef4444', padding: '0.5rem' }} onClick={function() { handleDeleteArticle(article.id) }} disabled={loading}>Löschen</button>
                          </div>
                        </div>
                      </div>
                      {editingArticle && editingArticle.id === article.id && (
                        <div style={{ background: '#faf5ff', borderRadius: '0 0 16px 16px', padding: '1.25rem', border: '1px solid #e9d5ff', borderTop: '1px dashed #d8b4fe' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                            <div><label style={lbl}>Titel *</label><input style={inp} value={editForm.title} onChange={function(e) { setEditForm(Object.assign({}, editForm, { title: e.target.value })) }} /></div>
                            <div><label style={lbl}>Beschreibung</label><textarea style={Object.assign({}, inp, { minHeight: '80px' }) as React.CSSProperties} value={editForm.description} onChange={function(e) { setEditForm(Object.assign({}, editForm, { description: e.target.value })) }} /></div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                              <div><label style={lbl}>Preis (€)</label><input style={inp} type="number" step="0.01" value={editForm.price} onChange={function(e) { setEditForm(Object.assign({}, editForm, { price: e.target.value })) }} /></div>
                              <div><label style={lbl}>Anzahl</label><input style={inp} type="number" value={editForm.stock} onChange={function(e) { setEditForm(Object.assign({}, editForm, { stock: e.target.value })) }} /></div>
                            </div>
                            <div>
                              <label style={lbl}>Bilder</label>
                              {editExistingImages.length > 0 && (
                                <div className="img-grid" style={{ marginBottom: '0.625rem' }}>
                                  {editExistingImages.map(function(url, i) {
                                    return (
                                      <div key={i} className="img-item">
                                        <img src={url} alt="" className="img-thumb" style={{ border: '2px solid #a855f7' }} />
                                        <button type="button" className="img-del" onClick={function() { setEditExistingImages(function(p) { return p.filter(function(_, idx) { return idx !== i }) }) }}>✕</button>
                                      </div>
                                    )
                                  })}
                                </div>
                              )}
                              <input
                                ref={editImgInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                style={{ display: 'none' }}
                                onChange={function(e) {
                                  const files = Array.from(e.target.files || [])
                                  if (files.length) {
                                    setEditImageFiles(function(p) { return [...p, ...files] })
                                    setEditImagePreviews(function(p) { return [...p, ...files.map(function(f) { return URL.createObjectURL(f) })] })
                                  }
                                  e.target.value = ''
                                }}
                              />
                              <button
                                type="button"
                                onClick={function() { editImgInputRef.current && editImgInputRef.current.click() }}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', background: '#f5f0ff', color: '#7c3aed', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, border: '1.5px dashed #a855f7', fontSize: '0.9375rem', width: '100%', justifyContent: 'center', minHeight: '52px', touchAction: 'manipulation' }}
                              >
                                📷 {editImagePreviews.length > 0 ? `${editImagePreviews.length} neu – weitere hinzufügen` : 'Neue Bilder hinzufügen'}
                              </button>
                              {editImagePreviews.length > 0 && (
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', paddingTop: '0.625rem' }}>
                                  {editImagePreviews.map(function(preview, i) {
                                    return (
                                      <div key={i} style={{ position: 'relative', display: 'inline-block', flexShrink: 0 }}>
                                        <img src={preview} alt="" style={{ width: '72px', height: '72px', objectFit: 'cover', borderRadius: '8px', display: 'block', border: '2px dashed #e9d5ff' }} />
                                        <button type="button" onClick={function() { setEditImageFiles(function(p) { return p.filter(function(_, idx) { return idx !== i }) }); setEditImagePreviews(function(p) { return p.filter(function(_, idx) { return idx !== i }) }) }} style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#ef4444', color: 'white', border: '2px solid white', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, touchAction: 'manipulation' }}>✕</button>
                                      </div>
                                    )
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '0.625rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                            <button onClick={handleUpdateArticle} disabled={loading} style={Object.assign({}, saveBtn, { opacity: loading ? 0.7 : 1, flex: 1 })}>{loading ? 'Speichern...' : 'Speichern'}</button>
                            <button onClick={function() { setEditingArticle(null) }} style={{ padding: '0.75rem 1.25rem', background: '#f3f4f6', color: '#6b7280', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>Abbrechen</button>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {tab === 'orders' && (
          <div>
            <h2 style={{ margin: '0 0 1rem', fontWeight: 700, color: '#1e1b4b' }}>Bestellungen ({orders.length})</h2>
            {orders.length === 0 ? (
              <div style={{ background: 'white', borderRadius: '16px', padding: '3rem', textAlign: 'center', color: '#6b7280' }}>Keine Bestellungen.</div>
            ) : (
              <div style={{ display: 'grid', gap: '0.875rem' }}>
                {orders.slice().sort(function(a, b) { return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() }).map(function(order) {
                  let items: any[] = []
                  try { items = JSON.parse(order.itemsJson || '[]') } catch(e) {}
                  return (
                    <div key={order.id} style={{ background: 'white', borderRadius: '16px', padding: '1.25rem', border: '1px solid #f3e8ff' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.875rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                        <div>
                          <div style={{ fontWeight: 700, color: '#1e1b4b' }}>{order.customerName}</div>
                          <div style={{ color: '#6b7280', fontSize: '0.8125rem' }}>{order.customerEmail}</div>
                          <div style={{ color: '#6b7280', fontSize: '0.8125rem' }}>{order.customerAddress}</div>
                          <div style={{ color: '#9ca3af', fontSize: '0.75rem' }}>{new Date(order.createdAt).toLocaleString('de-DE')}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#7c3aed' }}>{order.totalAmount.toFixed(2)} EUR</div>
                          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{order.paymentMethod === 'PAYPAL' ? 'PayPal' : 'Ueberweisung'}</div>
                        </div>
                      </div>
                      {items.length > 0 && (
                        <div style={{ background: '#f8f7ff', borderRadius: '10px', padding: '0.75rem', marginBottom: '0.875rem', fontSize: '0.8125rem' }}>
                          <strong style={{ color: '#7c3aed' }}>Artikel:</strong>
                          <ul style={{ margin: '0.375rem 0 0', paddingLeft: '1.25rem' }}>
                            {items.map(function(item: any, i: number) { return <li key={i}>{item.title} - {Number(item.price).toFixed(2)} EUR</li> })}
                          </ul>
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: '0.625rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <span style={{ padding: '0.3rem 0.75rem', borderRadius: '999px', fontSize: '0.8125rem', fontWeight: 700, background: (statusColors[order.status] || '#6b7280') + '20', color: statusColors[order.status] || '#6b7280' }}>
                          {statusLabels[order.status] || order.status}
                        </span>
                        <select value={order.status} onChange={function(e) { handleOrderStatus(order.id, e.target.value) }} style={{ padding: '0.4rem 0.75rem', borderRadius: '8px', border: '1.5px solid #e9d5ff', fontSize: '0.875rem', background: 'white', cursor: 'pointer', flex: 1, minWidth: '140px' }}>
                          <option value="PENDING">Ausstehend</option>
                          <option value="PAID">Bezahlt</option>
                          <option value="SHIPPED">Versendet</option>
                          <option value="COMPLETED">Abgeschlossen</option>
                          <option value="CANCELLED">Storniert</option>
                        </select>
                        <button onClick={function() { handleDeleteOrder(order.id) }} style={{ padding: '0.5rem 0.875rem', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Loeschen</button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {tab === 'analytics' && (
          <div>
            <h2 style={{ margin: '0 0 1rem', fontWeight: 700, color: '#1e1b4b' }}>Besucherstatistik</h2>
            {!analytics ? (
              <div style={{ background: 'white', borderRadius: '16px', padding: '3rem', textAlign: 'center', color: '#6b7280' }}>Lade Daten...</div>
            ) : (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  {[
                    { label: 'Gesamt', value: analytics.total, color: '#7c3aed', icon: '👁' },
                    { label: 'Heute', value: analytics.today, color: '#ec4899', icon: '📅' },
                    { label: '7 Tage', value: analytics.week, color: '#10b981', icon: '📆' },
                    { label: '30 Tage', value: analytics.month, color: '#3b82f6', icon: '🗓' },
                  ].map(function(s) {
                    return (
                      <div key={s.label} style={{ background: 'white', borderRadius: '14px', padding: '1rem', border: '1px solid #f3e8ff', textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{s.icon}</div>
                        <div style={{ fontSize: '1.625rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                        <div style={{ fontSize: '0.8125rem', color: '#6b7280' }}>{s.label}</div>
                      </div>
                    )
                  })}
                </div>
                <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', border: '1px solid #f3e8ff' }}>
                  <h3 style={{ margin: '0 0 1rem', fontWeight: 700, color: '#1e1b4b', fontSize: '0.9375rem' }}>Letzte 30 Tage</h3>
                  {(() => {
                    const maxVal = Math.max(...analytics.daily.map(function(d) { return d.count }), 1)
                    const last14 = analytics.daily.slice(-14)
                    return (
                      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '120px', overflowX: 'auto' }}>
                        {last14.map(function(d) {
                          const h = Math.max((d.count / maxVal) * 100, d.count > 0 ? 6 : 2)
                          const dateLabel = new Date(d.date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })
                          return (
                            <div key={d.date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', minWidth: '28px' }} title={dateLabel + ': ' + d.count + ' Besucher'}>
                              <div style={{ fontSize: '0.625rem', color: '#9ca3af', fontWeight: 600 }}>{d.count > 0 ? d.count : ''}</div>
                              <div style={{ width: '100%', height: h + '%', background: 'linear-gradient(180deg, #7c3aed, #a855f7)', borderRadius: '4px 4px 0 0', minHeight: '2px', transition: 'height 0.3s' }} />
                              <div style={{ fontSize: '0.5625rem', color: '#9ca3af', transform: 'rotate(-40deg)', whiteSpace: 'nowrap', transformOrigin: 'center top' }}>{dateLabel}</div>
                            </div>
                          )
                        })}
                      </div>
                    )
                  })()}
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'settings' && (
          <div style={{ background: 'white', borderRadius: '20px', padding: '1.75rem', border: '1px solid #e9d5ff' }}>
            <h2 style={{ margin: '0 0 1.5rem', fontWeight: 700, color: '#1e1b4b' }}>Zahlungsdaten</h2>
            <h3 style={{ color: '#7c3aed', fontWeight: 700, marginBottom: '1rem', fontSize: '1rem' }}>Bankdaten</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              <div><label style={lbl}>Kontoinhaber</label><input style={inp} value={settings.bankHolder} onChange={function(e) { setSettings(Object.assign({}, settings, { bankHolder: e.target.value })) }} /></div>
              <div><label style={lbl}>IBAN</label><input style={inp} value={settings.bankIban} onChange={function(e) { setSettings(Object.assign({}, settings, { bankIban: e.target.value })) }} /></div>
              <div><label style={lbl}>BIC</label><input style={inp} value={settings.bankBic} onChange={function(e) { setSettings(Object.assign({}, settings, { bankBic: e.target.value })) }} /></div>
              <div><label style={lbl}>Bankname</label><input style={inp} value={settings.bankName} onChange={function(e) { setSettings(Object.assign({}, settings, { bankName: e.target.value })) }} /></div>
            </div>
            <h3 style={{ color: '#0070ba', fontWeight: 700, marginBottom: '1rem', fontSize: '1rem' }}>PayPal</h3>
            <div style={{ marginBottom: '2rem' }}>
              <label style={lbl}>PayPal E-Mail Adresse</label>
              <input style={inp} value={settings.paypalClientId} onChange={function(e) { setSettings(Object.assign({}, settings, { paypalClientId: e.target.value })) }} />
            </div>
            <button onClick={handleSaveSettings} disabled={loading} style={Object.assign({}, saveBtn, { opacity: loading ? 0.7 : 1, width: '100%' })}>
              {loading ? 'Wird gespeichert...' : 'Einstellungen speichern'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}



// 05/17/2026 04:02:51



