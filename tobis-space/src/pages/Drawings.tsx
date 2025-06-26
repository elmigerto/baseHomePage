import { useState } from "react"
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark } from "@fortawesome/free-solid-svg-icons"
import Card from "../components/Card"
import Button from "../components/Button"
import { useCart } from "../contexts/CartContext"
import drawings, { categories } from "../files/drawings"

const allCategory = "all"


export default function Drawings() {
  const [selected, setSelected] = useState<string | null>(null)
  const [filter, setFilter] = useState(allCategory)
  const { addItem, items } = useCart()

  const filtered =
    filter === allCategory
      ? drawings
      : drawings.filter((d) => d.category === filter)

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="page-title">Drawings</h2>
        <Link to="/drawings/room" className="text-blue-500 underline">
          Virtual Room
        </Link>
      </div>
      <select
        className="border rounded p-1 mb-4 bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
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
        {filtered.map((art) => {
          const inCart = items.some((i) => i.id === art.id)
          const canAdd = art.multiple || !inCart
          return (
            <Card
              key={art.id}
              className={inCart ? 'bg-green-200 dark:bg-green-900' : ''}
            >
            {selected === art.id ? (
              <div className="w-48 h-48 flex flex-col items-center justify-center text-center space-y-2">
                <p className="font-semibold">{art.name}</p>
                <p className="text-sm">{art.description}</p>
                <p className="font-bold">{art.price.toFixed(2)} €</p>
                <div className="flex gap-2">
                  <Button
                    onClick={() =>
                      addItem({
                        id: art.id,
                        name: art.name,
                        price: art.price,
                        multiple: art.multiple,
                      })
                    }
                    disabled={!canAdd}
                  >
                    {inCart && !art.multiple ? 'Added' : 'Add to Cart'}
                  </Button>
                  <Button
                    className="bg-gray-300 text-black hover:bg-gray-400"
                    onClick={() => setSelected(null)}
                  >
                    <FontAwesomeIcon icon={faXmark} className="mr-1" /> Close
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <img
                  src={art.image}
                  alt={art.name}
                  className="w-48 h-48 object-contain mb-2 cursor-pointer"
                  onClick={() => setSelected(art.id)}
                />
                <p className="text-center">{art.name}</p>
                {inCart && !art.multiple && (
                  <p className="text-sm text-green-600">Added to cart</p>
                )}
              </>
            )}
          </Card>
          )
        })}
      </div>
    </div>
  )
}
