'use client'

import { useState, useEffect } from 'react'
import { logoutAction } from './actions'

type Article = {
  id: string
  title: string
  description: string
  price: number
  imageUrl: string | null
  stock: number
  isAvailable: boolean
  createdAt: string
}

type Order = {
  id: string
  customerName: string
  customerEmail: string
  customerAddress: string
  subtotal: number
  shippingCost: number
  totalAmount: number
  paymentMethod: string
  status: string
  createdAt: string
  itemsJson: string
}

type Settings = {
  paypalClientId: string
  bankIban: string
  bankBic: string
  bankHolder: string
  bankName: string
}

type Tab = 'articles' | 'orders' | 'settings'

export default function Dashboard({ articles: initialArticles, orders: initialOrders }: {
  articles: Article[]
  orders: Order[]
  settings: Settings | null
}) {
  const [tab, setTab] = useState<Tab>('articles')
  const [articles, setArticles] = useState<Article[]>(initialArticles || [])
  const [orders, setOrders] = useState<Order[]>(initialOrders || [])
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [newArticle, setNewArticle] = useState({ title: '', description: '', price: '', stock: '1' })
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)
  const [editForm, setEditForm] = useState({ title: '', description: '', price: '', stock: '' })
  const [editImageFile, setEditImageFile] = useState<File | null>(null)
  const [editImagePreview, setEditImagePreview] = useState<string>('')
  const [settings, setSettings] = useState<Settings>({
    paypalClientId: '', bankIban: '', bankBic: '', bankHolder: '', bankName: ''
  })

  useEffect(function() {
    fetch('https://www.berndos-flohmarkt.de/api/settings')
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

  function flash(text: string) {
    setMsg(text)
    setTimeout(function() { setMsg('') }, 3000)
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  function handleEditImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setEditImageFile(file)
    setEditImagePreview(URL.createObjectURL(file))
  }

  function startEdit(article: Article) {
    setEditingArticle(article)
    setEditForm({ title: article.title, description: article.description, price: String(article.price), stock: String(article.stock) })
    setEditImageFile(null)
    setEditImagePreview(article.imageUrl || '')
  }

  function cancelEdit() {
    setEditingArticle(null)
    setEditImageFile(null)
    setEditImagePreview('')
  }

  async function handleCreateArticle() {
    if (!newArticle.title || !newArticle.price) { flash('Bitte Titel und Preis angeben!'); return }
    setLoading(true)
    try {
      let imageUrl = null
      if (imageFile) {
        const formData = new FormData()
        formData.append('file', imageFile)
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
        const uploadData = await uploadRes.json()
        imageUrl = uploadData.imageUrl
      }
      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newArticle.title, description: newArticle.description, price: parseFloat(newArticle.price), stock: parseInt(newArticle.stock), imageUrl })
      })
      if (res.ok) {
        const created = await res.json()
        setArticles(function(prev) { return [created, ...prev] })
        setNewArticle({ title: '', description: '', price: '', stock: '1' })
        setImageFile(null)
        setImagePreview('')
        setShowForm(false)
        flash('Artikel erstellt!')
      } else { flash('Fehler beim Erstellen') }
    } catch(err) { flash('Verbindungsfehler') }
    setLoading(false)
  }

  async function handleUpdateArticle() {
    if (!editingArticle) return
    if (!editForm.title || !editForm.price) { flash('Bitte Titel und Preis angeben!'); return }
    setLoading(true)
    try {
      let imageUrl = editingArticle.imageUrl
      if (editImageFile) {
        const formData = new FormData()
        formData.append('file', editImageFile)
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
        const uploadData = await uploadRes.json()
        imageUrl = uploadData.imageUrl
      }
      const res = await fetch('/api/articles/' + editingArticle.id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editForm.title, description: editForm.description, price: parseFloat(editForm.price), stock: parseInt(editForm.stock), imageUrl })
      })
      if (res.ok) {
        const updated = await res.json()
        setArticles(function(prev) { return prev.map(function(a) { return a.id === updated.id ? updated : a }) })
        setEditingArticle(null)
        setEditImageFile(null)
        setEditImagePreview('')
        flash('Artikel aktualisiert!')
      } else { flash('Fehler beim Aktualisieren') }
    } catch(err) { flash('Verbindungsfehler') }
    setLoading(false)
  }

  async function handleDeleteArticle(id: string) {
    if (!confirm('Artikel wirklich loeschen?')) return
    setLoading(true)
    try {
      const res = await fetch('/api/articles/' + id, { method: 'DELETE' })
      if (res.ok) {
        setArticles(function(prev) { return prev.filter(function(a) { return a.id !== id }) })
        flash('Artikel geloescht!')
      } else { flash('Fehler beim Loeschen') }
    } catch(err) { flash('Verbindungsfehler') }
    setLoading(false)
  }

  async function handleOrderStatus(id: string, status: string) {
    try {
      const res = await fetch('/api/order/' + id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: status })
      })
      if (res.ok) {
        setOrders(function(prev) { return prev.map(function(o) { return o.id === id ? Object.assign({}, o, { status: status }) : o }) })
        flash('Status aktualisiert!')
      } else { flash('Fehler') }
    } catch(err) { flash('Verbindungsfehler') }
  }

  async function handleDeleteOrder(id: string) {
    if (!confirm('Bestellung wirklich loeschen?')) return
    try {
      const res = await fetch('/api/order/' + id, { method: 'DELETE' })
      if (res.ok) {
        setOrders(function(prev) { return prev.filter(function(o) { return o.id !== id }) })
        flash('Bestellung geloescht!')
      }
    } catch(err) { flash('Fehler') }
  }

  async function handleSaveSettings() {
    setLoading(true)
    try {
      const res = await fetch('https://www.berndos-flohmarkt.de/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })
      const data = await res.json()
      if (res.ok) {
        setSettings({
          paypalClientId: data.paypalClientId || '',
          bankIban: data.bankIban || '',
          bankBic: data.bankBic || '',
          bankHolder: data.bankHolder || '',
          bankName: data.bankName || ''
        })
        flash('Einstellungen gespeichert!')
      } else {
        flash('Fehler: ' + (data.error || 'Unbekannt'))
      }
    } catch(err) {
      flash('Verbindungsfehler: ' + String(err))
    }
    setLoading(false)
  }

  const statusColors: Record<string, string> = { PENDING: '#f59e0b', PAID: '#10b981', SHIPPED: '#3b82f6', COMPLETED: '#6b7280', CANCELLED: '#ef4444' }
  const statusLabels: Record<string, string> = { PENDING: 'Ausstehend', PAID: 'Bezahlt', SHIPPED: 'Versendet', COMPLETED: 'Abgeschlossen', CANCELLED: 'Storniert' }
  const totalRevenue = orders.filter(function(o) { return o.status !== 'CANCELLED' }).reduce(function(sum, o) { return sum + o.totalAmount }, 0)

  const lbl: React.CSSProperties = { display: 'block', marginBottom: '0.375rem', fontWeight: 600, fontSize: '0.875rem', color: '#374151' }
  const inp: React.CSSProperties = { width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: '1.5px solid #e9d5ff', fontSize: '0.9375rem', fontFamily: 'Inter, sans-serif', color: '#1e1b4b', outline: 'none', boxSizing: 'border-box' as 'border-box', background: '#faf5ff' }
  const saveBtn: React.CSSProperties = { padding: '0.75rem 2rem', background: 'linear-gradient(135deg, #7c3aed, #ec4899)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', fontSize: '0.9375rem' }

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', minHeight: '100vh', background: '#f8f7ff', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>Admin Dashboard</h1>
            <p style={{ color: '#6b7280', margin: '0.25rem 0 0', fontSize: '0.875rem' }}>Berndos Flohmarkt Verwaltung</p>
          </div>
          <form action={logoutAction}>
            <button type="submit" style={{ padding: '0.5rem 1.25rem', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '999px', fontWeight: 600, cursor: 'pointer' }}>Abmelden</button>
          </form>
        </div>

        {msg && (
          <div style={{ padding: '0.875rem', borderRadius: '12px', marginBottom: '1.5rem', background: msg.includes('Fehler') ? '#fef2f2' : '#ecfdf5', color: msg.includes('Fehler') ? '#dc2626' : '#059669', fontWeight: 600 }}>
            {msg}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'Artikel online', value: articles.length, color: '#7c3aed' },
            { label: 'Bestellungen', value: orders.length, color: '#ec4899' },
            { label: 'Gesamtumsatz', value: totalRevenue.toFixed(2) + ' EUR', color: '#10b981' },
            { label: 'Ausstehend', value: orders.filter(function(o) { return o.status === 'PENDING' }).length, color: '#f59e0b' },
          ].map(function(stat) {
            return (
              <div key={stat.label} style={{ background: 'white', borderRadius: '16px', padding: '1.25rem 1.5rem', border: '1px solid #f3e8ff' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: stat.color }}>{stat.value}</div>
                <div style={{ fontSize: '0.8125rem', color: '#6b7280' }}>{stat.label}</div>
              </div>
            )
          })}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', background: 'white', padding: '0.375rem', borderRadius: '12px', border: '1px solid #f3e8ff', width: 'fit-content' }}>
          {[['articles', 'Artikel'], ['orders', 'Bestellungen'], ['settings', 'Einstellungen']].map(function(item) {
            return (
              <button key={item[0]} onClick={function() { setTab(item[0] as Tab) }} style={{ padding: '0.5rem 1.25rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', background: tab === item[0] ? 'linear-gradient(135deg, #7c3aed, #a855f7)' : 'transparent', color: tab === item[0] ? 'white' : '#6b7280' }}>
                {item[1]}
              </button>
            )
          })}
        </div>

        {tab === 'articles' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ margin: 0, fontWeight: 700, color: '#1e1b4b' }}>Meine Artikel</h2>
              <button onClick={function() { setShowForm(!showForm); setEditingArticle(null) }} style={{ padding: '0.625rem 1.25rem', background: 'linear-gradient(135deg, #7c3aed, #ec4899)', color: 'white', border: 'none', borderRadius: '999px', fontWeight: 700, cursor: 'pointer' }}>
                {showForm ? 'Abbrechen' : '+ Neuer Artikel'}
              </button>
            </div>

            {showForm && (
              <div style={{ background: 'white', borderRadius: '20px', padding: '1.75rem', marginBottom: '1.5rem', border: '1px solid #e9d5ff' }}>
                <h3 style={{ margin: '0 0 1.25rem', color: '#1e1b4b', fontWeight: 700 }}>Neuen Artikel anlegen</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ gridColumn: '1 / -1' }}><label style={lbl}>Titel *</label><input style={inp} placeholder="PlayStation Controller" value={newArticle.title} onChange={function(e) { setNewArticle(Object.assign({}, newArticle, { title: e.target.value })) }} /></div>
                  <div style={{ gridColumn: '1 / -1' }}><label style={lbl}>Beschreibung</label><textarea style={Object.assign({}, inp, { minHeight: '80px' }) as React.CSSProperties} value={newArticle.description} onChange={function(e) { setNewArticle(Object.assign({}, newArticle, { description: e.target.value })) }} /></div>
                  <div><label style={lbl}>Preis (EUR) *</label><input style={inp} type="number" step="0.01" value={newArticle.price} onChange={function(e) { setNewArticle(Object.assign({}, newArticle, { price: e.target.value })) }} /></div>
                  <div><label style={lbl}>Anzahl</label><input style={inp} type="number" min="1" value={newArticle.stock} onChange={function(e) { setNewArticle(Object.assign({}, newArticle, { stock: e.target.value })) }} /></div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={lbl}>Bild</label>
                    <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} id="imgUp" />
                    <label htmlFor="imgUp" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', background: '#f5f0ff', color: '#7c3aed', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, border: '1.5px dashed #a855f7' }}>Bild auswaehlen</label>
                    {imagePreview && <img src={imagePreview} alt="" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '10px', marginLeft: '1rem', verticalAlign: 'middle' }} />}
                  </div>
                </div>
                <button onClick={handleCreateArticle} disabled={loading} style={Object.assign({}, saveBtn, { marginTop: '1.25rem', opacity: loading ? 0.7 : 1 })}>{loading ? 'Speichern...' : 'Artikel speichern'}</button>
              </div>
            )}

            {articles.length === 0 ? (
              <div style={{ background: 'white', borderRadius: '16px', padding: '3rem', textAlign: 'center', color: '#6b7280', border: '1px dashed #e9d5ff' }}>
                <p style={{ fontWeight: 600 }}>Keine Artikel. Klicke auf Neuer Artikel.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {articles.map(function(article) {
                  return (
                    <div key={article.id}>
                      <div style={{ background: 'white', borderRadius: '16px', padding: '1.25rem', border: '1px solid #f3e8ff', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        {article.imageUrl ? <img src={article.imageUrl} alt={article.title} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '10px', flexShrink: 0 }} /> : <div style={{ width: '80px', height: '80px', borderRadius: '10px', background: '#f5f0ff', flexShrink: 0 }} />}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 700, color: '#1e1b4b' }}>{article.title}</div>
                          <div style={{ color: '#6b7280', fontSize: '0.8125rem' }}>{article.description}</div>
                          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
                            <span style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)', color: 'white', padding: '0.2rem 0.75rem', borderRadius: '999px', fontWeight: 700, fontSize: '0.875rem' }}>{article.price.toFixed(2)} EUR</span>
                            <span style={{ background: '#f5f0ff', color: '#7c3aed', padding: '0.2rem 0.625rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600 }}>Lager: {article.stock}</span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                          <button onClick={function() { editingArticle && editingArticle.id === article.id ? cancelEdit() : startEdit(article) }} style={{ padding: '0.5rem 1rem', background: '#ede9fe', color: '#7c3aed', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>Bearbeiten</button>
                          <button onClick={function() { handleDeleteArticle(article.id) }} style={{ padding: '0.5rem 1rem', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>Loeschen</button>
                        </div>
                      </div>
                      {editingArticle && editingArticle.id === article.id && (
                        <div style={{ background: '#faf5ff', borderRadius: '0 0 16px 16px', padding: '1.5rem', border: '1px solid #e9d5ff' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div style={{ gridColumn: '1 / -1' }}><label style={lbl}>Titel</label><input style={inp} value={editForm.title} onChange={function(e) { setEditForm(Object.assign({}, editForm, { title: e.target.value })) }} /></div>
                            <div style={{ gridColumn: '1 / -1' }}><label style={lbl}>Beschreibung</label><textarea style={Object.assign({}, inp, { minHeight: '80px' }) as React.CSSProperties} value={editForm.description} onChange={function(e) { setEditForm(Object.assign({}, editForm, { description: e.target.value })) }} /></div>
                            <div><label style={lbl}>Preis</label><input style={inp} type="number" step="0.01" value={editForm.price} onChange={function(e) { setEditForm(Object.assign({}, editForm, { price: e.target.value })) }} /></div>
                            <div><label style={lbl}>Anzahl</label><input style={inp} type="number" value={editForm.stock} onChange={function(e) { setEditForm(Object.assign({}, editForm, { stock: e.target.value })) }} /></div>
                            <div style={{ gridColumn: '1 / -1' }}>
                              <input type="file" accept="image/*" onChange={handleEditImageChange} style={{ display: 'none' }} id="editImgUp" />
                              <label htmlFor="editImgUp" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', background: '#f5f0ff', color: '#7c3aed', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, border: '1.5px dashed #a855f7' }}>Neues Bild</label>
                              {editImagePreview && <img src={editImagePreview} alt="" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '10px', marginLeft: '1rem', verticalAlign: 'middle' }} />}
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                            <button onClick={handleUpdateArticle} disabled={loading} style={Object.assign({}, saveBtn, { opacity: loading ? 0.7 : 1 })}>Speichern</button>
                            <button onClick={cancelEdit} style={{ padding: '0.75rem 1.5rem', background: '#f3f4f6', color: '#6b7280', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>Abbrechen</button>
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
              <div style={{ display: 'grid', gap: '1rem' }}>
                {orders.slice().sort(function(a, b) { return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() }).map(function(order) {
                  let items: any[] = []
                  try { items = JSON.parse(order.itemsJson || '[]') } catch(e) {}
                  return (
                    <div key={order.id} style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', border: '1px solid #f3e8ff' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                          <div style={{ fontWeight: 700 }}>{order.customerName}</div>
                          <div style={{ color: '#6b7280', fontSize: '0.8125rem' }}>{order.customerEmail}</div>
                          <div style={{ color: '#6b7280', fontSize: '0.8125rem' }}>{order.customerAddress}</div>
                          <div style={{ color: '#9ca3af', fontSize: '0.75rem' }}>{new Date(order.createdAt).toLocaleString('de-DE')}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '1.375rem', fontWeight: 800, color: '#7c3aed' }}>{order.totalAmount.toFixed(2)} EUR</div>
                          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{order.paymentMethod === 'PAYPAL' ? 'PayPal' : 'Ueberweisung'}</div>
                        </div>
                      </div>
                      {items.length > 0 && (
                        <div style={{ background: '#f8f7ff', borderRadius: '10px', padding: '0.75rem', marginBottom: '1rem', fontSize: '0.8125rem' }}>
                          <strong>Artikel:</strong>
                          <ul style={{ margin: '0.5rem 0 0', paddingLeft: '1.25rem' }}>
                            {items.map(function(item: any, i: number) { return <li key={i}>{item.title} - {Number(item.price).toFixed(2)} EUR</li> })}
                          </ul>
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <span style={{ padding: '0.375rem 0.875rem', borderRadius: '999px', fontSize: '0.8125rem', fontWeight: 700, background: (statusColors[order.status] || '#6b7280') + '20', color: statusColors[order.status] || '#6b7280' }}>
                          {statusLabels[order.status] || order.status}
                        </span>
                        <select value={order.status} onChange={function(e) { handleOrderStatus(order.id, e.target.value) }} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1.5px solid #e9d5ff', fontSize: '0.875rem', background: 'white', cursor: 'pointer' }}>
                          <option value="PENDING">Ausstehend</option>
                          <option value="PAID">Bezahlt</option>
                          <option value="SHIPPED">Versendet</option>
                          <option value="COMPLETED">Abgeschlossen</option>
                          <option value="CANCELLED">Storniert</option>
                        </select>
                        <button onClick={function() { handleDeleteOrder(order.id) }} style={{ marginLeft: 'auto', padding: '0.5rem 1rem', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Loeschen</button>
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ gridColumn: '1 / -1' }}><label style={lbl}>Kontoinhaber</label><input style={inp} value={settings.bankHolder} onChange={function(e) { setSettings(Object.assign({}, settings, { bankHolder: e.target.value })) }} /></div>
              <div><label style={lbl}>IBAN</label><input style={inp} value={settings.bankIban} onChange={function(e) { setSettings(Object.assign({}, settings, { bankIban: e.target.value })) }} /></div>
              <div><label style={lbl}>BIC</label><input style={inp} value={settings.bankBic} onChange={function(e) { setSettings(Object.assign({}, settings, { bankBic: e.target.value })) }} /></div>
              <div style={{ gridColumn: '1 / -1' }}><label style={lbl}>Bankname</label><input style={inp} value={settings.bankName} onChange={function(e) { setSettings(Object.assign({}, settings, { bankName: e.target.value })) }} /></div>
            </div>
            <h3 style={{ color: '#0070ba', fontWeight: 700, marginBottom: '1rem', fontSize: '1rem' }}>PayPal</h3>
            <div style={{ marginBottom: '2rem' }}>
              <label style={lbl}>PayPal E-Mail</label>
              <input style={inp} value={settings.paypalClientId} onChange={function(e) { setSettings(Object.assign({}, settings, { paypalClientId: e.target.value })) }} />
            </div>
            <button onClick={handleSaveSettings} disabled={loading} style={Object.assign({}, saveBtn, { opacity: loading ? 0.7 : 1 })}>
              {loading ? 'Wird gespeichert...' : 'Einstellungen speichern'}
            </button>
          </div>
        )}

      </div>
    </div>
  )
}