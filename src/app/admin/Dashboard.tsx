'use client'
import { useState, useEffect } from 'react'
import { logoutAction } from './actions'

type Article = { id: string; title: string; description: string; price: number; imageUrl: string | null; stock: number; isAvailable: boolean; createdAt: string }
type Order = { id: string; customerName: string; customerEmail: string; customerAddress: string; subtotal: number; shippingCost: number; totalAmount: number; paymentMethod: string; status: string; createdAt: string; itemsJson: string }
type Settings = { paypalClientId: string; bankIban: string; bankBic: string; bankHolder: string; bankName: string }
type Tab = 'articles' | 'orders' | 'settings'

export default function Dashboard({ articles: initialArticles, orders: initialOrders }: { articles: Article[]; orders: Order[]; settings: Settings | null }) {
  const [tab, setTab] = useState<Tab>('articles')
  const [articles, setArticles] = useState<Article[]>(initialArticles || [])
  const [orders, setOrders] = useState<Order[]>(initialOrders || [])
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState('')
  const [newArticle, setNewArticle] = useState({ title: '', description: '', price: '', stock: '1' })
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)
  const [editForm, setEditForm] = useState({ title: '', description: '', price: '', stock: '' })
  const [editImageFile, setEditImageFile] = useState<File | null>(null)
  const [editImagePreview, setEditImagePreview] = useState('')
  const [settings, setSettings] = useState<Settings>({ paypalClientId: '', bankIban: '', bankBic: '', bankHolder: '', bankName: '' })

  useEffect(function() {
    fetch('/api/articles').then(function(r){return r.json()}).then(function(d){if(Array.isArray(d))setArticles(d)}).catch(console.error)
    fetch('/api/order').then(function(r){return r.json()}).then(function(d){if(Array.isArray(d))setOrders(d)}).catch(console.error)
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
      let imageUrl = null
      if (imageFile) {
        const fd = new FormData()
        fd.append('file', imageFile)
        imageUrl = (await (await fetch('/api/upload', { method: 'POST', body: fd })).json()).imageUrl
      }
      const res = await fetch('/api/articles', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: newArticle.title, description: newArticle.description, price: parseFloat(newArticle.price), stock: parseInt(newArticle.stock), imageUrl: imageUrl }) })
      if (res.ok) {
        const c = await res.json()
        setArticles(function(p) { return [c, ...p] })
        setNewArticle({ title: '', description: '', price: '', stock: '1' })
        setImageFile(null)
        setImagePreview('')
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
      let imageUrl = editingArticle.imageUrl
      if (editImageFile) {
        const fd = new FormData()
        fd.append('file', editImageFile)
        imageUrl = (await (await fetch('/api/upload', { method: 'POST', body: fd })).json()).imageUrl
      }
      const res = await fetch('/api/articles/' + editingArticle.id, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: editForm.title, description: editForm.description, price: parseFloat(editForm.price), stock: parseInt(editForm.stock), imageUrl: imageUrl }) })
      if (res.ok) {
        const u = await res.json()
        setArticles(function(p) { return p.map(function(a) { return a.id === u.id ? u : a }) })
        setEditingArticle(null)
        setEditImageFile(null)
        setEditImagePreview('')
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
    <div style={{ fontFamily: 'Inter, sans-serif', minHeight: '100vh', background: '#f8f7ff', padding: '1rem' }}>
      <style>{`
        .art-card { background: white; padding: 1rem; border: 1px solid #f3e8ff; }
        .art-inner { display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap; }
        .art-img { width: 72px; height: 72px; object-fit: cover; border-radius: 10px; flex-shrink: 0; }
        .art-placeholder { width: 72px; height: 72px; border-radius: 10px; background: #f5f0ff; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; }
        .art-info { flex: 1; min-width: 150px; }
        .art-btns { display: flex; gap: 0.5rem; width: 100%; margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid #f3e8ff; }
        .btn-edit { flex: 1; min-height: 48px; font-size: 0.9rem; font-weight: 700; border: none; border-radius: 10px; cursor: pointer; background: #ede9fe; color: #7c3aed; }
        .btn-del { min-width: 90px; min-height: 48px; font-size: 0.9rem; font-weight: 700; border: none; border-radius: 10px; cursor: pointer; background: #fee2e2; color: #ef4444; padding: 0.5rem; }
        @media (min-width: 640px) {
          .art-inner { flex-wrap: nowrap; }
          .art-btns { width: auto; margin-top: 0; padding-top: 0; border-top: none; flex-shrink: 0; }
          .btn-edit { flex: none; padding: 0.5rem 0.875rem; min-height: auto; font-size: 0.8125rem; }
          .btn-del { min-width: 90px; min-height: 48px; font-size: 0.9rem; font-weight: 700; border: none; border-radius: 10px; cursor: pointer; background: #fee2e2; color: #ef4444; padding: 0.5rem; }
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
            { label: 'Umsatz', value: totalRevenue.toFixed(2) + ' EUR', color: '#10b981' },
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
        <div style={{ display: 'flex', gap: '0.375rem', marginBottom: '1.25rem', background: 'white', padding: '0.375rem', borderRadius: '12px', border: '1px solid #f3e8ff', width: 'fit-content', maxWidth: '100%' }}>
          {(['articles', 'orders', 'settings'] as Tab[]).map(function(key) {
            return (
              <button key={key} onClick={function() { setTab(key) }} style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.8125rem', background: tab === key ? 'linear-gradient(135deg, #7c3aed, #a855f7)' : 'transparent', color: tab === key ? 'white' : '#6b7280', whiteSpace: 'nowrap' }}>
                {key === 'articles' ? 'Artikel' : key === 'orders' ? 'Bestellungen' : 'Einstellungen'}
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
                    <div><label style={lbl}>Preis (EUR) *</label><input style={inp} type="number" step="0.01" value={newArticle.price} onChange={function(e) { setNewArticle(Object.assign({}, newArticle, { price: e.target.value })) }} /></div>
                    <div><label style={lbl}>Anzahl</label><input style={inp} type="number" min="1" value={newArticle.stock} onChange={function(e) { setNewArticle(Object.assign({}, newArticle, { stock: e.target.value })) }} /></div>
                  </div>
                  <div>
                    <label style={lbl}>Bild</label>
                    <input type="file" accept="image/*" onChange={function(e) { const f = e.target.files && e.target.files[0]; if (f) { setImageFile(f); setImagePreview(URL.createObjectURL(f)) } }} style={{ display: 'none' }} id="imgUp" />
                    <label htmlFor="imgUp" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1rem', background: '#f5f0ff', color: '#7c3aed', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, border: '1.5px dashed #a855f7', fontSize: '0.875rem' }}>Bild waehlen</label>
                    {imagePreview && <img src={imagePreview} alt="" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '10px', marginLeft: '0.75rem', verticalAlign: 'middle' }} />}
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
                      <div className="art-card" style={{ borderRadius: editingArticle && editingArticle.id === article.id ? '16px 16px 0 0' : '16px', borderBottom: editingArticle && editingArticle.id === article.id ? 'none' : undefined }}>
                        <div className="art-inner">
                          {article.imageUrl ? <img className="art-img" src={article.imageUrl} alt={article.title} /> : <div className="art-placeholder">📷</div>}
                          <div className="art-info">
                            <div style={{ fontWeight: 700, color: '#1e1b4b', fontSize: '0.9375rem', marginBottom: '0.2rem' }}>{article.title}</div>
                            <div style={{ color: '#6b7280', fontSize: '0.8125rem', marginBottom: '0.375rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{article.description}</div>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                              <span style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)', color: 'white', padding: '0.2rem 0.625rem', borderRadius: '999px', fontWeight: 700, fontSize: '0.8125rem' }}>{article.price.toFixed(2)} EUR</span>
                              <span style={{ background: '#f5f0ff', color: '#7c3aed', padding: '0.2rem 0.5rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600 }}>Lager: {article.stock}</span>
                            </div>
                          </div>
                          <div className="art-btns">
                            <button className="btn-edit" onClick={function() { if (editingArticle && editingArticle.id === article.id) { setEditingArticle(null) } else { setEditingArticle(article); setEditForm({ title: article.title, description: article.description, price: String(article.price), stock: String(article.stock) }); setEditImagePreview(article.imageUrl || '') } }}>Bearbeiten</button>
                            <button className="btn-del" onClick={function() { handleDeleteArticle(article.id) }} disabled={loading}>Loeschen</button>
                          </div>
                        </div>
                      </div>
                      {editingArticle && editingArticle.id === article.id && (
                        <div style={{ background: '#faf5ff', borderRadius: '0 0 16px 16px', padding: '1.25rem', border: '1px solid #e9d5ff', borderTop: '1px dashed #d8b4fe' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                            <div><label style={lbl}>Titel *</label><input style={inp} value={editForm.title} onChange={function(e) { setEditForm(Object.assign({}, editForm, { title: e.target.value })) }} /></div>
                            <div><label style={lbl}>Beschreibung</label><textarea style={Object.assign({}, inp, { minHeight: '80px' }) as React.CSSProperties} value={editForm.description} onChange={function(e) { setEditForm(Object.assign({}, editForm, { description: e.target.value })) }} /></div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                              <div><label style={lbl}>Preis (EUR)</label><input style={inp} type="number" step="0.01" value={editForm.price} onChange={function(e) { setEditForm(Object.assign({}, editForm, { price: e.target.value })) }} /></div>
                              <div><label style={lbl}>Anzahl</label><input style={inp} type="number" value={editForm.stock} onChange={function(e) { setEditForm(Object.assign({}, editForm, { stock: e.target.value })) }} /></div>
                            </div>
                            <div>
                              <input type="file" accept="image/*" onChange={function(e) { const f = e.target.files && e.target.files[0]; if (f) { setEditImageFile(f); setEditImagePreview(URL.createObjectURL(f)) } }} style={{ display: 'none' }} id="editImgUp" />
                              <label htmlFor="editImgUp" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1rem', background: '#f5f0ff', color: '#7c3aed', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, border: '1.5px dashed #a855f7', fontSize: '0.875rem' }}>Neues Bild</label>
                              {editImagePreview && <img src={editImagePreview} alt="" style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '10px', marginLeft: '0.75rem', verticalAlign: 'middle' }} />}
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



