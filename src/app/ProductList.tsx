'use client'
import { useState, useMemo } from 'react'
import { useCart } from '@/components/CartProvider'

interface Article {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string | null;
  stock: number;
  isAvailable: boolean;
  createdAt: any;
}

type SortOption = 'newest' | 'oldest' | 'price-asc' | 'price-desc' | 'name-asc'

export default function ProductList({ initialArticles }: { initialArticles: any[] }) {
  const { addToCart } = useCart()
  const articles = initialArticles as Article[]
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
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
      {/* Search & Sort */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <div style={{ flex: '1 1 300px', display: 'flex', alignItems: 'center', background: 'white', borderRadius: '999px', border: '1.5px solid #e9d5ff', padding: '0.25rem 0.25rem 0.25rem 1.25rem', boxShadow: '0 2px 8px rgba(124,58,237,0.06)' }}>
          <span style={{ color: '#9ca3af', marginRight: '0.5rem', fontSize: '1rem' }}>🔍</span>
          <input
            type="text"
            placeholder="Suchen (z. B. Fahrrad, LEGO, Nintendo...)"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ flex: 1, border: 'none', outline: 'none', background: 'none', fontSize: '0.9375rem', color: '#1e1b4b', fontFamily: 'inherit' }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} style={{ background: '#f3f4f6', border: 'none', borderRadius: '999px', width: '28px', height: '28px', cursor: 'pointer', fontSize: '0.75rem', color: '#6b7280', flexShrink: 0 }}>✕</button>
          )}
          <button style={{ padding: '0.5rem 1.25rem', background: 'linear-gradient(135deg, #7c3aed, #ec4899)', color: 'white', border: 'none', borderRadius: '999px', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', marginLeft: '0.5rem', whiteSpace: 'nowrap' }}>
            Suchen
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
          <span style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 600 }}>
            {filteredAndSorted.length} Artikel
          </span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as SortOption)}
            style={{ padding: '0.5rem 1rem', borderRadius: '10px', border: '1.5px solid #e9d5ff', fontSize: '0.875rem', color: '#374151', background: 'white', cursor: 'pointer', outline: 'none', fontFamily: 'inherit' }}
          >
            <option value="newest">Neueste zuerst</option>
            <option value="oldest">Älteste zuerst</option>
            <option value="price-asc">Preis aufsteigend</option>
            <option value="price-desc">Preis absteigend</option>
            <option value="name-asc">Name A-Z</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      {filteredAndSorted.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#6b7280' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
          <p style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1e1b4b', marginBottom: '0.5rem' }}>Keine Artikel gefunden</p>
          <p>Versuche es mit einem anderen Suchbegriff.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '1.5rem' }}>
          {filteredAndSorted.map((article, index) => (
            <div
              key={article.id}
              style={{
                background: 'white',
                borderRadius: '20px',
                border: '1px solid #f3e8ff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                transition: 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s ease',
                animation: `fadeInUp 0.4s ease-out ${index * 0.06}s both`,
                cursor: 'pointer',
              }}
              onMouseOver={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'
                ;(e.currentTarget as HTMLElement).style.boxShadow = '0 12px 30px rgba(124,58,237,0.12)'
              }}
              onMouseOut={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
                ;(e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'
              }}
            >
              {/* Image */}
              <div
                onClick={() => setSelectedArticle(article)}
                style={{ height: '220px', background: '#f5f0ff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}
              >
                {article.imageUrl ? (
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                    onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                    onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
                  />
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: '#c4b5fd' }}>
                    <span style={{ fontSize: '3rem' }}>📷</span>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 500 }}>Kein Bild</span>
                  </div>
                )}
                {/* Zoom hint */}
                <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'rgba(0,0,0,0.4)', color: 'white', borderRadius: '999px', padding: '0.25rem 0.625rem', fontSize: '0.6875rem', fontWeight: 600, backdropFilter: 'blur(4px)' }}>
                  🔍 Details
                </div>
                {article.stock <= 0 && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: 'white', fontWeight: 800, fontSize: '1.125rem', background: '#ef4444', padding: '0.5rem 1rem', borderRadius: '999px' }}>Ausverkauft</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e1b4b', lineHeight: 1.3, flex: 1, margin: 0 }}>{article.title}</h3>
                  <span style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)', color: 'white', padding: '0.3rem 0.875rem', borderRadius: '999px', fontWeight: 800, fontSize: '0.9375rem', whiteSpace: 'nowrap', flexShrink: 0, boxShadow: '0 2px 8px rgba(124,58,237,0.25)' }}>
                    {article.price.toFixed(2)} €
                  </span>
                </div>

                {article.description && (
                  <p style={{ color: '#6b7280', fontSize: '0.875rem', lineHeight: 1.5, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as React.CSSProperties}>
                    {article.description}
                  </p>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.5rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', background: '#f5f0ff', color: '#7c3aed', padding: '0.25rem 0.625rem', borderRadius: '999px', fontSize: '0.6875rem', fontWeight: 600 }}>
                      🏷️ Einzelstück
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: article.stock > 0 ? (article.stock <= 3 ? '#f59e0b' : '#10b981') : '#ef4444' }}>
                      {article.stock > 0 ? `📦 Noch ${article.stock} verfügbar` : '❌ Ausverkauft'}
                    </span>
                  </div>
                  <button
                    onClick={() => handleAddToCart(article)}
                    disabled={article.stock <= 0}
                    style={{
                      padding: '0.5rem 1rem',
                      background: article.stock <= 0 ? '#e5e7eb' : addedId === article.id ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #7c3aed, #ec4899)',
                      color: article.stock <= 0 ? '#9ca3af' : 'white',
                      border: 'none',
                      borderRadius: '999px',
                      fontWeight: 700,
                      fontSize: '0.8125rem',
                      cursor: article.stock <= 0 ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                      boxShadow: article.stock <= 0 ? 'none' : '0 2px 8px rgba(124,58,237,0.25)',
                      transform: addedId === article.id ? 'scale(1.05)' : 'scale(1)',
                    }}
                  >
                    {article.stock <= 0 ? 'Ausverkauft' : addedId === article.id ? '✓ Hinzugefügt' : '🛒 In den Warenkorb'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Artikel Detail Modal */}
      {selectedArticle && (
        <div
          onClick={() => setSelectedArticle(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem', animation: 'fadeIn 0.2s ease-out' }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: 'white', borderRadius: '24px', maxWidth: '600px', width: '100%', overflow: 'hidden', boxShadow: '0 25px 60px rgba(0,0,0,0.3)', animation: 'fadeInUp 0.3s ease-out', maxHeight: '90vh', overflowY: 'auto' }}
          >
            {selectedArticle.imageUrl && (
              <div style={{ height: '300px', overflow: 'hidden' }}>
                <img src={selectedArticle.imageUrl} alt={selectedArticle.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
            <div style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', gap: '1rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>{selectedArticle.title}</h2>
                <span style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)', color: 'white', padding: '0.375rem 1rem', borderRadius: '999px', fontWeight: 800, fontSize: '1.125rem', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {selectedArticle.price.toFixed(2)} €
                </span>
              </div>
              {selectedArticle.description && (
                <p style={{ color: '#374151', lineHeight: 1.7, marginBottom: '1.5rem', fontSize: '1rem' }}>{selectedArticle.description}</p>
              )}
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <span style={{ background: '#f5f0ff', color: '#7c3aed', padding: '0.375rem 0.875rem', borderRadius: '999px', fontSize: '0.875rem', fontWeight: 600 }}>🏷️ Einzelstück</span>
                <span style={{ background: selectedArticle.stock > 0 ? '#ecfdf5' : '#fef2f2', color: selectedArticle.stock > 0 ? '#10b981' : '#ef4444', padding: '0.375rem 0.875rem', borderRadius: '999px', fontSize: '0.875rem', fontWeight: 600 }}>
                  {selectedArticle.stock > 0 ? `📦 ${selectedArticle.stock} verfügbar` : '❌ Ausverkauft'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={() => { handleAddToCart(selectedArticle); setSelectedArticle(null) }}
                  disabled={selectedArticle.stock <= 0}
                  style={{ flex: 1, padding: '0.875rem', background: selectedArticle.stock <= 0 ? '#e5e7eb' : 'linear-gradient(135deg, #7c3aed, #ec4899)', color: selectedArticle.stock <= 0 ? '#9ca3af' : 'white', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', cursor: selectedArticle.stock <= 0 ? 'not-allowed' : 'pointer' }}
                >
                  {selectedArticle.stock <= 0 ? 'Ausverkauft' : '🛒 In den Warenkorb'}
                </button>
                <button
                  onClick={() => setSelectedArticle(null)}
                  style={{ padding: '0.875rem 1.25rem', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9375rem' }}
                >
                  ✕ Schließen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bild Lightbox */}
      {selectedImage && (
        <div onClick={() => setSelectedImage(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '2rem', animation: 'fadeIn 0.2s ease-out', cursor: 'zoom-out' }}>
          <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', color: 'white', fontSize: '0.875rem', opacity: 0.7 }}>✕ Schließen</div>
          <img src={selectedImage} alt="Vergrößert" style={{ maxWidth: '90%', maxHeight: '90vh', objectFit: 'contain', borderRadius: '16px', boxShadow: '0 25px 60px rgba(0,0,0,0.5)', animation: 'fadeInUp 0.3s ease-out' }} />
        </div>
      )}
    </>
  )
}
