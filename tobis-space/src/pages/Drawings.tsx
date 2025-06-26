import { useState } from "react"
import { useCart } from "../contexts/CartContext"
import img1 from "../chapters/images/Chapter1.png"
import img2 from "../chapters/images/Chapter2.png"
import img3 from "../chapters/images/Chapter3.png"
import img4 from "../chapters/images/Chapter4.png"

const artworks = [
  { id: "drawing1", name: "Drawing 1", price: 9.99, image: img1 },
  { id: "drawing2", name: "Drawing 2", price: 9.99, image: img2 },
  { id: "drawing3", name: "Drawing 3", price: 9.99, image: img3 },
  { id: "drawing4", name: "Drawing 4", price: 9.99, image: img4 },
]

export default function Drawings() {
  const { addItem } = useCart()
  const [selected, setSelected] = useState<typeof artworks[0] | null>(null)

  return (
    <div>
      <h2 className="text-xl mb-4">Drawings</h2>
      <div className="flex flex-wrap justify-center gap-4">
        {artworks.map((art) => (
          <div key={art.id} className="border p-2 w-48">
            <img
              src={art.image}
              alt={art.name}
              className="h-32 w-full object-cover mb-2 cursor-pointer"
              onClick={() => setSelected(art)}
            />
            <p className="text-center">{art.name}</p>
            <button
              className="mt-2 px-2 py-1 bg-blue-500 text-white rounded w-full"
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
