import { useState } from 'react'
import { useCart } from '../contexts/CartContext'

const artworks = [
  { id: 'drawing1', name: 'Drawing 1', price: 9.99 },
  { id: 'drawing2', name: 'Drawing 2', price: 9.99 },
]

export default function Drawings() {
  const { addItem } = useCart()
  const [selected, setSelected] = useState<typeof artworks[0] | null>(null)

  return (
    <div>
      <h2 className="text-xl mb-4">Drawings</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {artworks.map((art) => (
          <div
            key={art.id}
            className="border p-2 transform transition-transform hover:rotate-[-1deg] hover:scale-105"
          >
            <div
              className="h-24 bg-gray-200 dark:bg-gray-700 mb-2 cursor-pointer"
              onClick={() => setSelected(art)}
            />
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
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-4">
            <div className="h-48 w-48 bg-gray-200 dark:bg-gray-700 mb-2" />
            <p className="mb-2">{selected.name}</p>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => addItem(selected)}
            >
              Add to Cart
            </button>
            <button className="ml-2" onClick={() => setSelected(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
