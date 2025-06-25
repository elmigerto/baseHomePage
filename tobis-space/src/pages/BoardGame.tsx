import { useCart } from '../contexts/CartContext'

export default function BoardGame() {
  const { addItem } = useCart()

  return (
    <div className="space-y-4">
      <h2 className="text-xl">Board Game</h2>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() =>
          addItem({ id: 'boardgame', name: 'Awesome Board Game', price: 29.99 })
        }
      >
        Add to Cart
      </button>
    </div>
  )
}
