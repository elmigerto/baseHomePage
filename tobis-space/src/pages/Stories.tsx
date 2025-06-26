import { Link, Outlet } from 'react-router-dom'
import chapters from '../chapters'
import { useCart } from '../contexts/CartContext'

export default function Stories() {
  const { addItem } = useCart()

  return (
    <div className="space-y-4">
      <h2 className="text-xl">Stories</h2>
      <nav className="flex flex-wrap gap-2">
        {chapters.map((ch) => (
          <Link key={ch.slug} to={ch.slug} className="text-blue-500 underline">
            {ch.title}
          </Link>
        ))}
      </nav>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => addItem({ id: 'story', name: 'Great Story', price: 4.99 })}
      >
        Add to Cart
      </button>
      <Outlet />
    </div>
  )
}
