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
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [addedId, setAddedId] = useState<string | null>(null)

  const filteredAndSorted = useMemo(() => {
    let result = [...articles]

    // Filter by search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(a =>
        a.title.toLowerCase().includes(q) ||
        (a.description && a.description.toLowerCase().includes(q))
      )
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case 'price-asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        result.sort((a, b) => b.price - a.price)
        break
      case 'name-asc':
        result.sort((a, b) => a.title.localeCompare(b.title))
        break
    }

    return result
  }, [initialArticles, searchQuery, sortBy])

  function handleAddToCart(article: Article) {
    addToCart({ id: article.id, title: article.title, price: article.price, imageUrl: article.imageUrl })
    setAddedId(article.id)
    setTimeout(() => setAddedId(null), 1500)
  }

  return (
    <>
      {/* Search & Sort Controls */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        alignItems: 'stretch',
        flexWrap: 'wrap',
        marginBottom: '0.5rem',
      }}>
        {/* Search Input */}
        <div style={{
          flex: '1 1 400px',
          display: 'flex',
          alignItems: 'center',
          background: 'white',
          borderRadius: 'var(--radius-xl)',
          border: '1.5px solid var(--color-border)',
          padding: '0.25rem 0.25rem 0.25rem 1rem',
          boxShadow: 'var(--shadow-sm)',
          transition: 'all var(--transition-normal)',
        }}>
          <span style={{ color: 'var(--color-text-light)', marginRight: '0.75rem', fontSize: '1.1rem' }}>🔍</span>
          <input
            type="text"
            placeholder="Suchen (z. B. Fahrrad, LEGO, Nintendo...)"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'none',
              fontSize: '0.9375rem',
              color: 'var(--color-text)',
              fontFamily: 'inherit',
              padding: '0.625rem 0',
            }}
            id="search-input"
          />
          <button
            className="btn btn-primary"
            style={{
              borderRadius: 'var(--radius-lg)',
              padding: '0.625rem 1.25rem',
              fontSize: '0.875rem',
            }}
            onClick={() => {}}
            id="search-button"
          >
            Suchen
          </button>
        </div>

        {/* Sort + Count */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          background: 'white',
          borderRadius: 'var(--radius-xl)',
          border: '1.5px solid var(--color-border)',
          padding: '0.5rem 1rem',
          boxShadow: 'var(--shadow-sm)',
          flexShrink: 0,
        }}>
          <span style={{
            fontSize: '0.8125rem',
            color: 'var(--color-text-muted)',
            fontWeight: 500,
            whiteSpace: 'nowrap',
          }}>
            <strong style={{ color: 'var(--color-text)', fontWeight: 700 }}>{filteredAndSorted.length}</strong> Artikel
          </span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as SortOption)}
            style={{
              border: '1.5px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '0.4375rem 0.75rem',
              fontSize: '0.8125rem',
              fontFamily: 'inherit',
              color: 'var(--color-text)',
              background: 'white',
              cursor: 'pointer',
              outline: 'none',
            }}
            id="sort-select"
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
      <div style={{ padding: '2.5rem 0 3rem' }}>
        <div className="container" style={{ maxWidth: '1200px' }}>
          {filteredAndSorted.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              color: 'var(--color-text-muted)',
              background: 'var(--color-surface)',
              borderRadius: 'var(--radius-xl)',
              border: '1px dashed var(--color-border)',
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
              <p style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--color-text)' }}>
                Keine Artikel gefunden
              </p>
              <p>Versuche es mit einem anderen Suchbegriff.</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.5rem',
            }}>
              {filteredAndSorted.map((article, index) => (
                <div
                  key={article.id}
                  className="card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    animation: `fadeInUp 0.4s ease-out ${index * 0.05}s both`,
                  }}
                >
                  {/* Image */}
                  <div style={{
                    height: '220px',
                    backgroundColor: 'var(--color-bg-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    position: 'relative',
                  }}>
                    {article.imageUrl ? (
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        onClick={() => setSelectedImage(article.imageUrl)}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          cursor: 'zoom-in',
                          transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                        }}
                        onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.08)')}
                        onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
                      />
                    ) : (
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: 'var(--color-text-light)',
                      }}>
                        <span style={{ fontSize: '2rem', opacity: 0.5 }}>📷</span>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 500 }}>Kein Bild</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="card-content" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    gap: '0.75rem',
                  }}>
                    {/* Title Row */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                    }}>
                      <h3 style={{
                        fontSize: '1.0625rem',
                        fontWeight: 700,
                        color: 'var(--color-text)',
                        lineHeight: 1.3,
                        flex: 1,
                      }}>
                        {article.title}
                      </h3>
                      <span className="price-tag">
                        {article.price.toFixed(2)} €
                      </span>
                    </div>

                    {/* Description */}
                    {article.description && (
                      <p style={{
                        color: 'var(--color-text-muted)',
                        fontSize: '0.875rem',
                        lineHeight: 1.5,
                        flex: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}>
                        {article.description}
                      </p>
                    )}

                    {/* Category badge + Cart button */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: 'auto',
                      paddingTop: '0.5rem',
                    }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <span className="badge badge-primary" style={{ fontSize: '0.6875rem', width: 'fit-content' }}>
                          🏷️ Einzelstück
                        </span>
                        <span style={{ 
                          fontSize: '0.75rem', 
                          fontWeight: 600,
                          color: article.stock > 0 ? (article.stock <= 3 ? '#f59e0b' : '#10b981') : '#ef4444'
                        }}>
                        {'📦 Nur noch ' + article.stock + ' Stück'}
                        </span>
                      </div>
                      <button
                        onClick={() => handleAddToCart(article)}
                        className="btn btn-primary"
                        disabled={article.stock <= 0}
                        style={{
                          padding: '0.5rem 1rem',
                          fontSize: '0.8125rem',
                          borderRadius: 'var(--radius-full)',
                          opacity: article.stock <= 0 ? 0.5 : 1,
                          cursor: article.stock <= 0 ? 'not-allowed' : 'pointer'
                        }}
                        id={`add-to-cart-${article.id}`}
                      >
                        {article.stock <= 0 ? 'Ausverkauft' : (addedId === article.id ? '✓ Hinzugefügt' : '🛒 In den Warenkorb')}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            cursor: 'zoom-out',
            padding: '2rem',
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          <div style={{
            position: 'absolute',
            top: '1.5rem',
            right: '1.5rem',
            color: 'white',
            fontSize: '0.875rem',
            opacity: 0.7,
            fontWeight: 500,
          }}>
            Klicke zum Schließen ✕
          </div>
          <img
            src={selectedImage}
            alt="Vergrößert"
            style={{
              maxWidth: '90%',
              maxHeight: '90vh',
              objectFit: 'contain',
              borderRadius: 'var(--radius-lg)',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5)',
              animation: 'fadeInUp 0.3s ease-out',
            }}
          />
        </div>
      )}
    </>
  )
}
