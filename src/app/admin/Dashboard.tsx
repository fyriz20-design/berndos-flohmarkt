'use client'

import { useState } from 'react'
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

export default function Dashboard({ articles: initialArticles, orders: initialOrders, settings: initialSettings }: {
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

  const [settings, setSettings] = useState<Settings>(initialSettings || {
    paypalClientId: '', bankIban: '', bankBic: '', bankHolder: '', bankName: ''
  })

  function flash(text: string) {
    setMsg(text)
    setTimeout(() => setMsg(''), 3000)
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
    if (!newArticle.title || !newArticle.price) { flash('❌ Bitte Titel und Preis angeben!'); return }
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
        setArticles(prev => [created, ...prev])
        setNewArticle({ title: '', description: '', price: '', stock: '1' })
        setImageFile(null); setImagePreview(''); setShowForm(false)
        flash('✅ Artikel erfolgreich erstellt!')
      } else { flash('❌ Fehler beim Erstellen') }
    } catch { flash('❌ Verbindungsfehler') }
    setLoading(false)
  }

  async function handleUpdateArticle() {
    if (!editingArticle) return
    if (!editForm.title || !editForm.price) { flash('❌ Bitte Titel und Preis angeben!'); return }
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
      const res = await fetch(`/api/articles/${editingArticle.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editForm.title, description: editForm.description, price: parseFloat(editForm.price), stock: parseInt(editForm.stock), imageUrl })
      })
      if (res.ok) {
        const updated = await res.json()
        setArticles(prev => prev.map(a => a.id === updated.id ? updated : a))
        setEditingArticle(null); setEditImageFile(null); setEditImagePreview('')
        flash('✅ Artikel aktualisiert!')
      } else { flash('❌ Fehler beim Aktualisieren') }
    } catch { flash('❌ Verbindungsfehler') }
    setLoading(false)
  }

  async function handleDeleteArticle(id: string) {
    if (!confirm('Artikel wirklich löschen?')) return
    setLoading(true)
    try {
      const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' })
      if (res.ok) { setArticles(prev => prev.filter(a => a.id !== id)); flash('✅ Artikel gelöscht!') }
      else { flash('❌ Fehler beim Löschen') }
    } catch { flash('❌ Verbindungsfehler') }
    setLoading(false)
  }

  async function handleOrderStatus(id: string, status: string) {
    try {
      const res = await fetch(`/api/order/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
        flash('✅ Status aktualisiert!')
      } else { flash('❌ Fehler beim Aktualisieren') }
    } catch { flash('❌ Verbindungsfehler') }
  }

  async function handleDeleteOrder(id: string) {
    if (!confirm('Bestellung wirklich löschen?')) return
    try {
      const res = await fetch(`/api/order/${id}`, { method: 'DELETE' })
      if (res.ok) { setOrders(prev => prev.filter(o => o.id !== id)); flash('✅ Bestellung gelöscht!') }
    } catch { flash('❌ Fehler') }
  }

  async function handleSaveSettings() {
    setLoading(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })
      if (res.ok) { flash('✅ Einstellungen gespeichert!') }
      else { flash('❌ Fehler beim Speichern') }
    } catch { flash('❌ Verbindungsfehler') }
    setLoading(false)
  }

  const statusColors: Record<string, string> = { PENDING: '#f59e0b', PAID: '#10b981', SHIPPED: '#3b82f6', COMPLETED: '#6b7280', CANCELLED: '#ef4444' }
  const statusLabels: Record<string, string> = { PENDING: 'Ausstehend', PAID: 'Bezahlt', SHIPPED: 'Versendet', COMPLETED: 'Abgeschlossen', CANCELLED: 'Storniert' }
  const totalRevenue = orders.filter(o => o.status !== 'CANCELLED').reduce((sum, o) => sum + o.totalAmount, 0)

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", minHeight: '100vh', background: '#f8f7ff', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>⚙️ Admin Dashboard</h1>
            <p style={{ color: '#6b7280', margin: '0.25rem 0 0', fontSize: '0.875rem' }}>Berndos Flohmarkt Verwaltung</p>
          </div>
          <form action={logoutAction}>
            <button type="submit" style={{ padding: '0.5rem 1.25rem', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '999px', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem' }}>Abmelden</button>
          </form>
        </div>

        {msg && (
          <div style={{ padding: '0.875rem 1.25rem', borderRadius: '12px', marginBottom: '1.5rem', background: msg.startsWith('✅') ? '#ecfdf5' : '#fef2f2', color: msg.startsWith('✅') ? '#059669' : '#dc2626', fontWeight: 600, border: `1px solid ${msg.startsWith('✅') ? '#a7f3d0' : '#fecaca'}` }}>
            {msg}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'Artikel online', value: articles.length, icon: '🏷️', color: '#7c3aed' },
            { label: 'Bestellungen', value: orders.length, icon: '📦', color: '#ec4899' },
            { label: 'Gesamtumsatz', value: `${totalRevenue.toFixed(2)} €`, icon: '💶', color: '#10b981' },
            { label: 'Ausstehend', value: orders.filter(o => o.status === 'PENDING').length, icon: '⏳', color: '#f59e0b' },
          ].map((stat) => (
            <div key={stat.label} style={{ background: 'white', borderRadius: '16px', padding: '1.25rem 1.5rem', border: '1px solid #f3e8ff', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: '0.8125rem', color: '#6b7280', marginTop: '0.25rem' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', background: 'white', padding: '0.375rem', borderRadius: '12px', border: '1px solid #f3e8ff', width: 'fit-content' }}>
          {([['articles', '🏷️ Artikel'], ['orders', '📦 Bestellungen'], ['settings', '⚙️ Einstellungen']] as [Tab, string][]).map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)} style={{ padding: '0.5rem 1.25rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', background: tab === key ? 'linear-gradient(135deg, #7c3aed, #a855f7)' : 'transparent', color: tab === key ? 'white' : '#6b7280', transition: 'all 0.2s' }}>
              {label}
            </button>
          ))}
        </div>

        {/* ARTIKEL TAB */}
        {tab === 'articles' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ margin: 0, fontWeight: 700, color: '#1e1b4b' }}>Meine Artikel</h2>
              <button onClick={() => { setShowForm(!showForm); setEditingArticle(null) }} style={{ padding: '0.625rem 1.25rem', background: 'linear-gradient(135deg, #7c3aed, #ec4899)', color: 'white', border: 'none', borderRadius: '999px', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem' }}>
                {showForm ? '✕ Abbrechen' : '+ Neuer Artikel'}
              </button>
            </div>

            {showForm && (
              <div style={formCardStyle}>
                <h3 style={{ margin: '0 0 1.25rem', color: '#1e1b4b', fontWeight: 700 }}>Neuen Artikel anlegen</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>Titel *</label><input style={inputStyle} placeholder="z.B. PlayStation Controller" value={newArticle.title} onChange={e => setNewArticle({ ...newArticle, title: e.target.value })} /></div>
                  <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>Beschreibung</label><textarea style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' } as React.CSSProperties} placeholder="Zustand, Besonderheiten..." value={newArticle.description} onChange={e => setNewArticle({ ...newArticle, description: e.target.value })} /></div>
                  <div><label style={labelStyle}>Preis (€) *</label><input style={inputStyle} type="number" step="0.01" placeholder="29.99" value={newArticle.price} onChange={e => setNewArticle({ ...newArticle, price: e.target.value })} /></div>
                  <div><label style={labelStyle}>Anzahl</label><input style={inputStyle} type="number" min="1" value={newArticle.stock} onChange={e => setNewArticle({ ...newArticle, stock: e.target.value })} /></div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={labelStyle}>Bild hochladen</label>
                    <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} id="imageUpload" />
                    <label htmlFor="imageUpload" style={uploadLabelStyle}>📷 Bild auswählen</label>
                    {imagePreview && (
                      <div style={{ marginTop: '0.75rem', display: 'inline-block', position: 'relative', marginLeft: '1rem' }}>
                        <img src={imagePreview} alt="Vorschau" style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '12px', border: '2px solid #e9d5ff' }} />
                        <button onClick={() => { setImageFile(null); setImagePreview('') }} style={removeImgBtnStyle}>✕</button>
                      </div>
                    )}
                  </div>
                </div>
                <button onClick={handleCreateArticle} disabled={loading} style={{ ...saveBtnStyle, marginTop: '1.25rem', opacity: loading ? 0.7 : 1 }}>{loading ? 'Wird gespeichert...' : '✓ Artikel speichern'}</button>
              </div>
            )}

            {articles.length === 0 ? (
              <div style={{ background: 'white', borderRadius: '16px', padding: '3rem', textAlign: 'center', color: '#6b7280', border: '1px dashed #e9d5ff' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
                <p style={{ fontWeight: 600 }}>Noch keine Artikel. Klicke auf "+ Neuer Artikel".</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {articles.map(article => (
                  <div key={article.id}>
                    <div style={{ background: 'white', borderRadius: editingArticle?.id === article.id ? '16px 16px 0 0' : '16px', padding: '1.25rem', border: '1px solid #f3e8ff', borderBottom: editingArticle?.id === article.id ? 'none' : '1px solid #f3e8ff', display: 'flex', gap: '1rem', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                      {article.imageUrl
                        ? <img src={article.imageUrl} alt={article.title} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '10px', flexShrink: 0, border: '1px solid #f3e8ff' }} />
                        : <div style={{ width: '80px', height: '80px', borderRadius: '10px', background: '#f5f0ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', flexShrink: 0 }}>📷</div>
                      }
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, color: '#1e1b4b', fontSize: '1rem', marginBottom: '0.25rem' }}>{article.title}</div>
                        <div style={{ color: '#6b7280', fontSize: '0.8125rem', marginBottom: '0.5rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{article.description}</div>
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                          <span style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '999px', fontWeight: 700, fontSize: '0.875rem' }}>{article.price.toFixed(2)} €</span>
                          <span style={{ background: '#f5f0ff', color: '#7c3aed', padding: '0.25rem 0.625rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600 }}>Lager: {article.stock}</span>
                          <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{new Date(article.createdAt).toLocaleDateString('de-DE')}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                        <button onClick={() => editingArticle?.id === article.id ? cancelEdit() : startEdit(article)} style={{ padding: '0.5rem 1rem', background: editingArticle?.id === article.id ? '#f3f4f6' : '#ede9fe', color: editingArticle?.id === article.id ? '#6b7280' : '#7c3aed', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '0.8125rem', whiteSpace: 'nowrap' }}>
                          {editingArticle?.id === article.id ? '✕ Schließen' : '✏️ Bearbeiten'}
                        </button>
                        <button onClick={() => handleDeleteArticle(article.id)} disabled={loading} style={{ padding: '0.5rem 1rem', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '0.8125rem', whiteSpace: 'nowrap' }}>
                          🗑️ Löschen
                        </button>
                      </div>
                    </div>

                    {editingArticle?.id === article.id && (
                      <div style={{ background: '#faf5ff', borderRadius: '0 0 16px 16px', padding: '1.5rem', border: '1px solid #e9d5ff', borderTop: '1px dashed #d8b4fe' }}>
                        <h3 style={{ margin: '0 0 1.25rem', color: '#7c3aed', fontWeight: 700, fontSize: '1rem' }}>✏️ Artikel bearbeiten</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                          <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>Titel *</label><input style={inputStyle} value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} /></div>
                          <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>Beschreibung</label><textarea style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' } as React.CSSProperties} value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} /></div>
                          <div><label style={labelStyle}>Preis (€) *</label><input style={inputStyle} type="number" step="0.01" value={editForm.price} onChange={e => setEditForm({ ...editForm, price: e.target.value })} /></div>
                          <div><label style={labelStyle}>Anzahl</label><input style={inputStyle} type="number" min="0" value={editForm.stock} onChange={e => setEditForm({ ...editForm, stock: e.target.value })} /></div>
                          <div style={{ gridColumn: '1 / -1' }}>
                            <label style={labelStyle}>Bild ändern (optional)</label>
                            <input type="file" accept="image/*" onChange={handleEditImageChange} style={{ display: 'none' }} id="editImageUpload" />
                            <label htmlFor="editImageUpload" style={uploadLabelStyle}>📷 Neues Bild wählen</label>
                            {editImagePreview && (
                              <div style={{ marginTop: '0.75rem', display: 'inline-block', position: 'relative', marginLeft: '1rem' }}>
                                <img src={editImagePreview} alt="Vorschau" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '10px', border: '2px solid #e9d5ff' }} />
                              </div>
                            )}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                          <button onClick={handleUpdateArticle} disabled={loading} style={{ ...saveBtnStyle, opacity: loading ? 0.7 : 1 }}>{loading ? 'Wird gespeichert...' : '💾 Änderungen speichern'}</button>
                          <button onClick={cancelEdit} style={{ padding: '0.75rem 1.5rem', background: '#f3f4f6', color: '#6b7280', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem' }}>Abbrechen</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* BESTELLUNGEN TAB */}
        {tab === 'orders' && (
          <div>
            <h2 style={{ margin: '0 0 1rem', fontWeight: 700, color: '#1e1b4b' }}>Bestellungen ({orders.length})</h2>
            {orders.length === 0 ? (
              <div style={{ background: 'white', borderRadius: '16px', padding: '3rem', textAlign: 'center', color: '#6b7280', border: '1px dashed #e9d5ff' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
                <p style={{ fontWeight: 600 }}>Noch keine Bestellungen.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {[...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(order => {
                  let items: any[] = []
                  try { items = JSON.parse(order.itemsJson || '[]') } catch {}
                  return (
                    <div key={order.id} style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', border: '1px solid #f3e8ff', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                        <div>
                          <div style={{ fontWeight: 700, color: '#1e1b4b', fontSize: '1rem' }}>👤 {order.customerName}</div>
                          <div style={{ color: '#6b7280', fontSize: '0.8125rem', marginTop: '0.25rem' }}>📧 {order.customerEmail}</div>
                          <div style={{ color: '#6b7280', fontSize: '0.8125rem' }}>📍 {order.customerAddress}</div>
                          <div style={{ color: '#9ca3af', fontSize: '0.75rem', marginTop: '0.25rem' }}>🕐 {new Date(order.createdAt).toLocaleString('de-DE')}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '1.375rem', fontWeight: 800, color: '#7c3aed' }}>{order.totalAmount.toFixed(2)} €</div>
                          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{order.paymentMethod === 'PAYPAL' ? '💙 PayPal' : '🏦 Überweisung'}</div>
                        </div>
                      </div>
                      {items.length > 0 && (
                        <div style={{ background: '#f8f7ff', borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.8125rem', color: '#374151' }}>
                          <strong style={{ color: '#7c3aed' }}>Bestellte Artikel:</strong>
                          <ul style={{ margin: '0.5rem 0 0', paddingLeft: '1.25rem' }}>
                            {items.map((item: any, i: number) => <li key={i}>{item.title} – {Number(item.price).toFixed(2)} €</li>)}
                          </ul>
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <span style={{ padding: '0.375rem 0.875rem', borderRadius: '999px', fontSize: '0.8125rem', fontWeight: 700, background: (statusColors[order.status] || '#6b7280') + '20', color: statusColors[order.status] || '#6b7280' }}>
                          {statusLabels[order.status] || order.status}
                        </span>
                        <select value={order.status} onChange={e => handleOrderStatus(order.id, e.target.value)} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1.5px solid #e9d5ff', fontSize: '0.875rem', color: '#374151', background: 'white', cursor: 'pointer', fontWeight: 600 }}>
                          <option value="PENDING">⏳ Ausstehend</option>
                          <option value="PAID">✅ Bezahlt</option>
                          <option value="SHIPPED">🚚 Versendet</option>
                          <option value="COMPLETED">🏁 Abgeschlossen</option>
                          <option value="CANCELLED">❌ Storniert</option>
                        </select>
                        <button onClick={() => handleDeleteOrder(order.id)} style={{ marginLeft: 'auto', padding: '0.5rem 1rem', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.8125rem' }}>🗑️ Löschen</button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* EINSTELLUNGEN TAB */}
        {tab === 'settings' && (
          <div style={{ background: 'white', borderRadius: '20px', padding: '1.75rem', border: '1px solid #e9d5ff', boxShadow: '0 4px 20px rgba(124,58,237,0.08)' }}>
            <h2 style={{ margin: '0 0 1.5rem', fontWeight: 700, color: '#1e1b4b' }}>Zahlungsdaten</h2>
            <h3 style={{ color: '#7c3aed', fontWeight: 700, marginBottom: '1rem', fontSize: '1rem' }}>🏦 Bankdaten</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>Kontoinhaber</label><input style={inputStyle} placeholder="Max Mustermann" value={settings.bankHolder} onChange={e => setSettings({ ...settings, bankHolder: e.target.value })} /></div>
              <div><label style={labelStyle}>IBAN</label><input style={inputStyle} placeholder="DE89 3704 0044 ..." value={settings.bankIban} onChange={e => setSettings({ ...settings, bankIban: e.target.value })} /></div>
              <div><label style={labelStyle}>BIC</label><input style={inputStyle} placeholder="COBADEFFXXX" value={settings.bankBic} onChange={e => setSettings({ ...settings, bankBic: e.target.value })} /></div>
              <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>Bankname</label><input style={inputStyle} placeholder="Commerzbank" value={settings.bankName} onChange={e => setSettings({ ...settings, bankName: e.target.value })} /></div>
            </div>
            <h3 style={{ color: '#0070ba', fontWeight: 700, marginBottom: '1rem', fontSize: '1rem' }}>💙 PayPal</h3>
            <div style={{ marginBottom: '2rem' }}>
              <label style={labelStyle}>PayPal E-Mail Adresse</label>
              <input style={inputStyle} placeholder="deine@email.de" value={settings.paypalClientId} onChange={e => setSettings({ ...settings, paypalClientId: e.target.value })} />
              <p style={{ fontSize: '0.8125rem', color: '#9ca3af', marginTop: '0.5rem' }}>Diese E-Mail wird dem Kunden als Zahlungsziel angezeigt.</p>
            </div>
            <button onClick={handleSaveSettings} disabled={loading} style={{ ...saveBtnStyle, opacity: loading ? 0.7 : 1 }}>{loading ? 'Wird gespeichert...' : '💾 Einstellungen speichern'}</button>
          </div>
        )}
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = { display: 'block', marginBottom: '0.375rem', fontWeight: 600, fontSize: '0.875rem', color: '#374151' }
const inputStyle: React.CSSProperties = { width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: '1.5px solid #e9d5ff', fontSize: '0.9375rem', fontFamily: "'Inter', sans-serif", color: '#1e1b4b', outline: 'none', boxSizing: 'border-box', background: '#faf5ff' }
const saveBtnStyle: React.CSSProperties = { padding: '0.75rem 2rem', background: 'linear-gradient(135deg, #7c3aed, #ec4899)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', fontSize: '0.9375rem' }
const formCardStyle: React.CSSProperties = { background: 'white', borderRadius: '20px', padding: '1.75rem', marginBottom: '1.5rem', border: '1px solid #e9d5ff', boxShadow: '0 4px 20px rgba(124,58,237,0.08)' }
const uploadLabelStyle: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', background: '#f5f0ff', color: '#7c3aed', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, border: '1.5px dashed #a855f7', fontSize: '0.875rem' }
const removeImgBtnStyle: React.CSSProperties = { position: 'absolute', top: '-8px', right: '-8px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '22px', height: '22px', cursor: 'pointer', fontSize: '12px', fontWeight: 700 }