import { useMemo, useState } from 'react'
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark } from "@fortawesome/free-solid-svg-icons"
import Card from "../components/Card"
import Button from "../components/Button"
import { useCart } from "../contexts/CartContext"
import drawings, { categories, type Drawing } from '../files/drawings'

const allCategory = "all"


export default function Drawings() {
  const [selected, setSelected] = useState<string | null>(null)
  const [filter, setFilter] = useState(allCategory)
  const { addItem, items } = useCart()

  const sortedCategories = useMemo(() => [...categories].sort(), [])
  const drawingsByCat = useMemo(() => {
    const map: Record<string, Drawing[]> = {}
    for (const cat of sortedCategories) {
      map[cat] = drawings
        .filter((d) => d.category === cat)
        .sort((a, b) => a.name.localeCompare(b.name))
    }
    return map
  }, [])

  const filtered =
    filter === allCategory
      ? sortedCategories.flatMap((cat) => drawingsByCat[cat])
      : drawingsByCat[filter] ?? []
  const showHeaders = filter === allCategory

  const renderCard = (art: Drawing) => {
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
  }

  return (
    <div>
      <div className="sticky top-16 z-30 mb-4 flex flex-wrap items-center justify-between gap-2 rounded border border-gray-300 bg-gray-200/70 p-2 backdrop-blur dark:border-gray-600 dark:bg-gray-700/70">
        <div className="flex items-center gap-4">
          <h2 className="page-title m-0">Gallery</h2>
          <Link to="/drawings" className="text-blue-500 underline">
            Virtual Room
          </Link>
        </div>
        <select
          className="border rounded p-1 bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value={allCategory}>All</option>
          {sortedCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      {showHeaders ? (
        sortedCategories.map((cat) => (
          <section key={cat} className="mb-6">
            <h3 className="mb-2 text-lg font-semibold">{cat}</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {drawingsByCat[cat].map(renderCard)}
            </div>
          </section>
        ))
      ) : (
        <div className="flex flex-wrap justify-center gap-4">
          {filtered.map(renderCard)}
        </div>
      )}
    </div>
  )
}
