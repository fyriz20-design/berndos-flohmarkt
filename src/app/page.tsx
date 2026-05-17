import ProductList from './ProductList'
export const dynamic = 'force-dynamic'
export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <ProductList initialArticles={[]} />
    </div>
  )
}