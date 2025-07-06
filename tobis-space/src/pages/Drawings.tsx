import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import Card from "../components/Card"
import Button from "../components/Button"
import { useCart } from "../contexts/CartContext"
import drawings, { categories, type Drawing } from "../files/drawings"
import useDrawingModal from "../hooks/useDrawingModal"

const allCategory = "all"


export default function Drawings() {
  const [filter, setFilter] = useState(allCategory)
  const { open: openModal, modal } = useDrawingModal()
  const { addItem, removeItem, items } = useCart()

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
    const handleClick = () => {
      if (inCart && !art.multiple) removeItem(art.id)
      else
        addItem({ id: art.id, name: art.name, price: art.price, multiple: art.multiple })
    }
    return (
      <Card key={art.id} className={inCart ? "bg-green-200 dark:bg-green-900" : ""}>
        <img
          src={art.image}
          alt={art.name}
          className="mb-2 h-48 w-48 cursor-pointer object-contain"
          onClick={() => openModal(art)}
        />
        <p className="text-center">{art.name}</p>
        <Button className="mt-2" onClick={handleClick}>
          {inCart && !art.multiple ? "Remove" : "Add to Cart"}
        </Button>
      </Card>
    )
  }

  return (
    <div>
      <div className="sticky top-16 z-30 mb-4 flex flex-wrap items-center justify-between gap-2 rounded border border-gray-300 bg-gray-200/70 p-2 backdrop-blur dark:border-gray-600 dark:bg-gray-700/70">
        <div className="flex items-center gap-4">
          <h2 className="page-title m-0">Gallery</h2>
          <Link to="/drawings" className="text-blue-500 underline">
            Scrolling Room
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
      {modal}
    </div>
  )
}

