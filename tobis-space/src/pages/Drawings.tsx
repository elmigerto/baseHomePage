import { useState } from "react"
import { useCart } from "../contexts/CartContext"
import drawings, { categories } from "../files/drawings"

const allCategory = "all"

type Artwork = (typeof drawings)[number]

export default function Drawings() {
  const { addItem } = useCart()
  const [selected, setSelected] = useState<Artwork | null>(null)
  const [filter, setFilter] = useState(allCategory)

  const filtered =
    filter === allCategory
      ? drawings
      : drawings.filter((d) => d.category === filter)

  return (
    <div>
      <h2 className="text-xl mb-4">Drawings</h2>
      <select
        className="border rounded p-1 mb-4"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      >
        <option value={allCategory}>All</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <div className="flex flex-wrap justify-center gap-4">
        {filtered.map((art) => (
          <div key={art.id} className="border p-2 w-48">
            <img
              src={art.image}
              alt={art.name}
              className="h-32 w-full object-cover mb-2 cursor-pointer"
              onClick={() => setSelected(art)}
            />
            <p className="text-center">{art.name}</p>
            <button
              className="mt-2 w-full btn"
              onClick={() => addItem(art)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white text-black p-4">
            <img
              src={selected.image}
              alt={selected.name}
              className="h-48 w-48 object-cover mb-2"
            />
            <p className="mb-2 text-center">{selected.name}</p>
            <button
              className="btn"
              onClick={() => addItem(selected)}
            >
              Add to Cart
            </button>
            <button className="ml-2 btn bg-gray-300 text-black hover:bg-gray-400" onClick={() => setSelected(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
