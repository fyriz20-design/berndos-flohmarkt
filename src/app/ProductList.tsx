'use client'
import { useState, useMemo } from 'react'
import { useCart } from '@/components/CartProvider'

interface Article {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string | null;
  imagesJson?: string;
  stock: number;
  isAvailable: boolean;
  createdAt: any;
}

type SortOption = 'newest' | 'oldest' | 'price-asc' | 'price-desc' | 'name-asc'

export default function ProductList({ initialArticles }: { initialArticles: any[] }) {
  const { addToCart } = useCart()
  const articles = initialArticles as Article[]
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [modalImageIndex, setModalImageIndex] = useState(0)
  const [cardImageIndices, setCardImageIndices] = useState<Record<string, number>>({})
  const [searchQuery, setSearchQuery] = useState('')

  function getImages(article: Article): string[] {
    let imgs: string[] = []
    try { imgs = article.imagesJson ? JSON.parse(article.imagesJson) : [] } catch(e) {}
    if (!imgs.length && article.imageUrl) imgs = [article.imageUrl]
    return imgs
  }

  function cardImg(id: string, delta: number, total: number, e: React.MouseEvent) {
    e.stopPropagation()
    setCardImageIndices(prev => {
      const cur = prev[id] || 0
      return { ...prev, [id]: (cur + delta + total) % total }
    })
  }
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [addedId, setAddedId] = useState<string | null>(null)

  const filteredAndSorted = useMemo(() => {
    let result = [...articles]
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(a =>
        a.title.toLowerCase().includes(q) ||
        (a.description && a.description.toLowerCase().includes(q))
      )
    }
    switch (sortBy) {
      case 'newest': result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break
      case 'oldest': result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()); break
      case 'price-asc': result.sort((a, b) => a.price - b.price); break
      case 'price-desc': result.sort((a, b) => b.price - a.price); break
      case 'name-asc': result.sort((a, b) => a.title.localeCompare(b.title)); break
    }
    return result
  }, [articles, searchQuery, sortBy])

  function handleAddToCart(article: Article) {
    addToCart({ id: article.id, title: article.title, price: article.price, imageUrl: article.imageUrl })
    setAddedId(article.id)
    setTimeout(() => setAddedId(null), 1500)
  }

  return (
    <>
      {/* Header row */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.125rem', flexWrap: 'wrap' }}>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.375rem, 4vw, 1.75rem)', fontWeight: 700, color: '#1c1917', margin: 0 }}>
            Alle Artikel
          </h2>
          <span style={{ background: 'linear-gradient(135deg, #6d28d9, #ec4899)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '999px', fontFamily: "'DM Sans', sans-serif", fontSize: '0.8125rem', fontWeight: 700 }}>
            {filteredAndSorted.length}
          </span>
        </div>

        {/* Search & Sort */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'stretch' }}>
          <div style={{ flex: '1 1 280px', display: 'flex', alignItems: 'center', background: 'white', borderRadius: '999px', border: '1.5px solid var(--color-border)', padding: '0.25rem 0.375rem 0.25rem 1.125rem', boxShadow: '0 2px 6px rgba(120,80,20,0.06)' }}>
            <span style={{ color: '#a8a29e', marginRight: '0.5rem', fontSize: '1rem', flexShrink: 0 }}>🔍</span>
            <input
              type="text"
              placeholder="Suchen... (Fahrrad, LEGO, Nintendo...)"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ flex: 1, border: 'none', outline: 'none', background: 'none', fontFamily: "'DM Sans', sans-serif", fontSize: 'max(16px, 0.9375rem)', color: '#1c1917', minWidth: 0 }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} style={{ background: '#f5f0ff', border: 'none', borderRadius: '999px', width: '28px', height: '28px', cursor: 'pointer', color: '#6d28d9', fontWeight: 700, fontSize: '0.875rem', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            )}
            <button style={{ padding: '0.5rem 1.125rem', background: 'linear-gradient(135deg, #6d28d9, #a855f7)', color: 'white', border: 'none', borderRadius: '999px', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', marginLeft: '0.375rem', whiteSpace: 'nowrap', flexShrink: 0 }}>
              Suchen
            </button>
          </div>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as SortOption)}
            style={{ padding: '0.625rem 1rem', borderRadius: '999px', border: '1.5px solid var(--color-border)', fontFamily: "'DM Sans', sans-serif", fontSize: '0.875rem', color: '#78716c', background: 'white', cursor: 'pointer', outline: 'none', flexShrink: 0, boxShadow: '0 2px 6px rgba(120,80,20,0.06)' }}
          >
            <option value="newest">Neueste zuerst</option>
            <option value="oldest">Älteste zuerst</option>
            <option value="price-asc">Preis ↑</option>
            <option value="price-desc">Preis ↓</option>
            <option value="name-asc">Name A-Z</option>
          </select>
        </div>
      </div>

      {/* Empty state */}
      {filteredAndSorted.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#78716c' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🔍</div>
          <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.375rem', fontWeight: 700, color: '#1c1917', marginBottom: '0.5rem' }}>Nichts gefunden</p>
          <p style={{ fontFamily: "'DM Sans', sans-serif" }}>Versuche einen anderen Suchbegriff.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(240px, 30vw, 300px), 1fr))', gap: 'clamp(1rem, 3vw, 1.75rem)' }}>
          {filteredAndSorted.map((article, index) => (
            <div
              key={article.id}
              style={{
                background: 'linear-gradient(145deg, #ffffff 0%, #fdfaf5 100%)',
                borderRadius: 'clamp(16px, 3vw, 24px)',
                border: '1px solid rgba(231, 224, 213, 0.8)',
                boxShadow: '0 2px 10px rgba(120,80,20,0.06), 0 1px 2px rgba(120,80,20,0.04)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease',
                animation: `fadeInUp 0.45s ease-out ${index * 0.07}s both`,
                cursor: 'pointer',
              }}
              onMouseOver={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-5px) rotate(0.3deg)'
                ;(e.currentTarget as HTMLElement).style.boxShadow = '0 20px 50px rgba(109,40,217,0.14), 0 4px 12px rgba(109,40,217,0.08)'
              }}
              onMouseOut={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0) rotate(0deg)'
                ;(e.currentTarget as HTMLElement).style.boxShadow = '0 2px 10px rgba(120,80,20,0.06), 0 1px 2px rgba(120,80,20,0.04)'
              }}
            >
              {/* Image Slider */}
              {(() => {
                const imgs = getImages(article)
                const curIdx = cardImageIndices[article.id] || 0
                const curImg = imgs[curIdx] || null
                return (
                  <div
                    onClick={() => { setSelectedArticle(article); setModalImageIndex(curIdx) }}
                    style={{ height: 'clamp(180px, 25vw, 240px)', background: 'linear-gradient(135deg, #f5f0ff, #fef9ef)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}
                  >
                    {curImg ? (
                      <img
                        src={curImg}
                        alt={article.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.3s ease' }}
                      />
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: '#c4b5fd' }}>
                        <span style={{ fontSize: '3rem' }}>📷</span>
                        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.8125rem', fontWeight: 500 }}>Kein Bild</span>
                      </div>
                    )}

                    {/* Prev/Next Buttons – nur wenn mehrere Bilder */}
                    {imgs.length > 1 && (
                      <>
                        <button
                          onClick={e => cardImg(article.id, -1, imgs.length, e)}
                          style={{ position: 'absolute', left: '0.4rem', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.82)', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 6px rgba(0,0,0,0.18)', backdropFilter: 'blur(4px)', zIndex: 2, padding: 0, lineHeight: 1 }}>‹</button>
                        <button
                          onClick={e => cardImg(article.id, 1, imgs.length, e)}
                          style={{ position: 'absolute', right: '0.4rem', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.82)', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 6px rgba(0,0,0,0.18)', backdropFilter: 'blur(4px)', zIndex: 2, padding: 0, lineHeight: 1 }}>›</button>
                        {/* Dots */}
                        <div style={{ position: 'absolute', bottom: '0.5rem', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '5px', zIndex: 2 }}>
                          {imgs.map((_, di) => (
                            <button
                              key={di}
                              onClick={e => { e.stopPropagation(); setCardImageIndices(prev => ({ ...prev, [article.id]: di })) }}
                              style={{ width: di === curIdx ? '16px' : '7px', height: '7px', borderRadius: '999px', background: di === curIdx ? '#7c3aed' : 'rgba(255,255,255,0.75)', border: 'none', padding: 0, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}
                            />
                          ))}
                        </div>
                      </>
                    )}

                    {/* Detail badge */}
                    <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)', borderRadius: '999px', padding: '0.25rem 0.625rem', fontFamily: "'DM Sans', sans-serif", fontSize: '0.6875rem', fontWeight: 600, color: '#6d28d9', border: '1px solid rgba(109,40,217,0.15)', zIndex: 2 }}>
                      🔍 Details
                    </div>
                    {article.stock <= 0 && (
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(28,25,23,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(2px)', zIndex: 3 }}>
                        <span style={{ fontFamily: "'DM Sans', sans-serif", color: 'white', fontWeight: 800, fontSize: '1rem', background: '#dc2626', padding: '0.5rem 1.25rem', borderRadius: '999px' }}>Ausverkauft</span>
                      </div>
                    )}
                  </div>
                )
              })()}

              {/* Content */}
              <div style={{ padding: 'clamp(1rem, 3vw, 1.375rem)', display: 'flex', flexDirection: 'column', flex: 1, gap: '0.875rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1rem, 2.5vw, 1.125rem)', fontWeight: 700, color: '#1c1917', lineHeight: 1.3, flex: 1, margin: 0 }}>
                    {article.title}
                  </h3>
                  <span style={{ background: 'linear-gradient(135deg, #6d28d9, #ec4899)', color: 'white', padding: '0.3125rem 0.875rem', borderRadius: '999px', fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: '0.9375rem', whiteSpace: 'nowrap', flexShrink: 0, boxShadow: '0 3px 10px rgba(109,40,217,0.3)' }}>
                    {article.price.toFixed(2)} €
                  </span>
                </div>

                {article.description && (
                  <p style={{ fontFamily: "'DM Sans', sans-serif", color: '#78716c', fontSize: '0.875rem', lineHeight: 1.6, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as React.CSSProperties}>
                    {article.description}
                  </p>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid rgba(231,224,213,0.6)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', background: 'rgba(245,158,11,0.1)', color: '#d97706', padding: '0.2rem 0.625rem', borderRadius: '999px', fontFamily: "'DM Sans', sans-serif", fontSize: '0.6875rem', fontWeight: 600, border: '1px solid rgba(245,158,11,0.2)', width: 'fit-content' }}>
                      🏷️ Einzelstück
                    </span>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.75rem', fontWeight: 600, color: article.stock > 0 ? (article.stock <= 3 ? '#d97706' : '#059669') : '#dc2626' }}>
                      {article.stock > 0 ? `📦 Noch ${article.stock} verfügbar` : '❌ Ausverkauft'}
                    </span>
                  </div>

                  <button
                    onClick={() => handleAddToCart(article)}
                    disabled={article.stock <= 0}
                    style={{
                      padding: '0.5rem 1rem',
                      background: article.stock <= 0 ? '#e7e5e4' : addedId === article.id ? 'linear-gradient(135deg, #059669, #10b981)' : 'linear-gradient(135deg, #6d28d9, #ec4899)',
                      color: article.stock <= 0 ? '#a8a29e' : 'white',
                      border: 'none',
                      borderRadius: '999px',
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 700,
                      fontSize: '0.8125rem',
                      cursor: article.stock <= 0 ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                      boxShadow: article.stock <= 0 ? 'none' : addedId === article.id ? '0 4px 12px rgba(5,150,105,0.3)' : '0 4px 12px rgba(109,40,217,0.3)',
                      transform: addedId === article.id ? 'scale(1.05)' : 'scale(1)',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}
                  >
                    {article.stock <= 0 ? 'Ausverkauft' : addedId === article.id ? '✓ Hinzugefügt' : '🛒 Kaufen'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===== ARTIKEL DETAIL MODAL ===== */}
      {selectedArticle && (
        <div
          onClick={() => setSelectedArticle(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(28,25,23,0.75)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem', animation: 'fadeIn 0.25s ease-out' }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: 'linear-gradient(145deg, #ffffff, #fdfaf5)', borderRadius: 'clamp(20px, 4vw, 32px)', maxWidth: '600px', width: '100%', overflow: 'hidden', boxShadow: '0 30px 80px rgba(28,25,23,0.35)', animation: 'scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1)', maxHeight: '90vh', overflowY: 'auto', border: '1px solid rgba(231,224,213,0.5)' }}
          >
            {(() => {
              let images: string[] = []
              try { images = selectedArticle.imagesJson ? JSON.parse(selectedArticle.imagesJson) : [] } catch(e) {}
              if (!images.length && selectedArticle.imageUrl) images = [selectedArticle.imageUrl]
              if (!images.length) return null
              const current = images[modalImageIndex] || images[0]
              return (
                <div>
                  <div style={{ height: 'clamp(220px, 40vw, 320px)', overflow: 'hidden', position: 'relative' }}>
                    <img src={current} alt={selectedArticle.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.25s ease' }} />
                    {images.length > 1 && (
                      <>
                        <button onClick={e => { e.stopPropagation(); setModalImageIndex(i => (i - 1 + images.length) % images.length) }} style={{ position: 'absolute', left: '0.625rem', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.85)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', backdropFilter: 'blur(4px)' }}>‹</button>
                        <button onClick={e => { e.stopPropagation(); setModalImageIndex(i => (i + 1) % images.length) }} style={{ position: 'absolute', right: '0.625rem', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.85)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', backdropFilter: 'blur(4px)' }}>›</button>
                        <div style={{ position: 'absolute', bottom: '0.625rem', right: '0.75rem', background: 'rgba(0,0,0,0.45)', color: 'white', borderRadius: '999px', padding: '0.2rem 0.625rem', fontSize: '0.75rem', fontWeight: 600 }}>{modalImageIndex + 1} / {images.length}</div>
                      </>
                    )}
                  </div>
                  {images.length > 1 && (
                    <div style={{ display: 'flex', gap: '0.375rem', padding: '0.625rem 1rem', background: '#f8f7ff', overflowX: 'auto' }}>
                      {images.map((url, i) => (
                        <img key={i} src={url} alt="" onClick={e => { e.stopPropagation(); setModalImageIndex(i) }} style={{ width: '52px', height: '52px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0, cursor: 'pointer', border: i === modalImageIndex ? '2.5px solid #7c3aed' : '2.5px solid transparent', opacity: i === modalImageIndex ? 1 : 0.6, transition: 'all 0.2s' }} />
                      ))}
                    </div>
                  )}
                </div>
              )
            })()}
            <div style={{ padding: 'clamp(1.25rem, 4vw, 2rem)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', gap: '1rem' }}>
                <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.375rem, 4vw, 1.75rem)', fontWeight: 700, color: '#1c1917', margin: 0 }}>
                  {selectedArticle.title}
                </h2>
                <span style={{ background: 'linear-gradient(135deg, #6d28d9, #ec4899)', color: 'white', padding: '0.4rem 1.125rem', borderRadius: '999px', fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: '1.125rem', whiteSpace: 'nowrap', flexShrink: 0, boxShadow: '0 4px 14px rgba(109,40,217,0.35)' }}>
                  {selectedArticle.price.toFixed(2)} €
                </span>
              </div>
              {selectedArticle.description && (
                <p style={{ fontFamily: "'DM Sans', sans-serif", color: '#78716c', lineHeight: 1.75, marginBottom: '1.5rem', fontSize: '1rem' }}>
                  {selectedArticle.description}
                </p>
              )}
              <div style={{ display: 'flex', gap: '0.625rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <span style={{ background: 'rgba(245,158,11,0.1)', color: '#d97706', padding: '0.375rem 0.875rem', borderRadius: '999px', fontFamily: "'DM Sans', sans-serif", fontSize: '0.875rem', fontWeight: 600, border: '1px solid rgba(245,158,11,0.2)' }}>🏷️ Einzelstück</span>
                <span style={{ background: selectedArticle.stock > 0 ? '#ecfdf5' : '#fef2f2', color: selectedArticle.stock > 0 ? '#059669' : '#dc2626', padding: '0.375rem 0.875rem', borderRadius: '999px', fontFamily: "'DM Sans', sans-serif", fontSize: '0.875rem', fontWeight: 600 }}>
                  {selectedArticle.stock > 0 ? `📦 ${selectedArticle.stock} verfügbar` : '❌ Ausverkauft'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => { handleAddToCart(selectedArticle); setSelectedArticle(null) }}
                  disabled={selectedArticle.stock <= 0}
                  style={{ flex: 1, minWidth: '140px', padding: '0.875rem', background: selectedArticle.stock <= 0 ? '#e7e5e4' : 'linear-gradient(135deg, #6d28d9, #ec4899)', color: selectedArticle.stock <= 0 ? '#a8a29e' : 'white', border: 'none', borderRadius: '14px', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '1rem', cursor: selectedArticle.stock <= 0 ? 'not-allowed' : 'pointer', boxShadow: selectedArticle.stock <= 0 ? 'none' : '0 4px 14px rgba(109,40,217,0.35)' }}
                >
                  {selectedArticle.stock <= 0 ? 'Ausverkauft' : '🛒 In den Warenkorb'}
                </button>
                <button
                  onClick={() => setSelectedArticle(null)}
                  style={{ padding: '0.875rem 1.25rem', background: '#f5f0ee', color: '#78716c', border: 'none', borderRadius: '14px', fontFamily: "'DM Sans', sans-serif", fontWeight: 600, cursor: 'pointer', fontSize: '0.9375rem' }}
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
