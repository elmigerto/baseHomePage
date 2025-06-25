import { useCart } from '../contexts/CartContext'

export default function Stories() {
  const { addItem } = useCart()

  return (
    <div className="space-y-4">
      <h2 className="text-xl">Stories</h2>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() =>
          addItem({ id: 'story', name: 'Great Story', price: 4.99 })
        }
      >
        Add to Cart
      </button>
    </div>
  )
}
