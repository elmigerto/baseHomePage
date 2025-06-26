import { Link, Outlet } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'

export default function BoardGame() {
  const { addItem } = useCart()

  return (
    <div className="space-y-4">
      <h2 className="text-xl">Board Game</h2>
      <nav className="flex gap-4">
        <Link to="rules" className="text-blue-500 underline">
          Rules
        </Link>
        <Link to="community" className="text-blue-500 underline">
          Community
        </Link>
        <Link to="updates" className="text-blue-500 underline">
          Updates
        </Link>
      </nav>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() =>
          addItem({ id: 'boardgame', name: 'Awesome Board Game', price: 29.99 })
        }
      >
        Add to Cart
      </button>
      <Outlet />
    </div>
  )
}
