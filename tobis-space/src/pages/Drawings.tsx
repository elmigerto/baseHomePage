import { useCart } from '../contexts/CartContext'

const artworks = [
  { id: 'drawing1', name: 'Drawing 1', price: 9.99 },
  { id: 'drawing2', name: 'Drawing 2', price: 9.99 },
]

export default function Drawings() {
  const { addItem } = useCart()

  return (
    <div>
      <h2 className="text-xl mb-4">Drawings</h2>
      <div className="grid grid-cols-2 gap-4">
        {artworks.map((art) => (
          <div key={art.id} className="border p-2">
            <div className="h-24 bg-gray-200 mb-2" />
            <p>{art.name}</p>
            <button
              className="mt-2 px-2 py-1 bg-blue-500 text-white rounded"
              onClick={() => addItem(art)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
