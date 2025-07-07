import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMinus, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons"
import Button from "./Button"
import { useCart } from "../contexts/CartContext"
import type { Drawing } from "../files/drawings"

export default function ImageModal({ art, onClose }: { art: Drawing; onClose: () => void }) {
  const { addItem, removeItem, items } = useCart()
  const [zoom, setZoom] = useState(1)
  const handleZoomIn = () => setZoom((z) => Math.min(3, z + 0.25))
  const handleZoomOut = () => setZoom((z) => Math.max(1, z - 0.25))
  const inCart = items.some((i) => i.id === art.id)
  const canAdd = art.multiple || !inCart
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="relative max-w-md w-full rounded bg-white p-4 text-black dark:bg-gray-800 dark:text-white">
        <button
          aria-label="Close"
          className="absolute right-2 top-2 text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white"
          onClick={onClose}
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
        <div className="mb-2 flex justify-center overflow-auto" style={{ maxHeight: "60vh" }}>
          <img
            src={art.image}
            alt={art.name}
            loading="lazy"
            className="cursor-zoom-in object-contain"
            style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}
            onClick={handleZoomIn}
            onWheel={(e) => {
              e.preventDefault()
              if (e.deltaY < 0) handleZoomIn()
              else handleZoomOut()
            }}
          />
        </div>
        <div className="mb-2 flex justify-center gap-2">
          <button
            aria-label="Zoom in"
            className="rounded bg-gray-200 p-1 text-black hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            onClick={handleZoomIn}
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
          <button
            aria-label="Zoom out"
            className="rounded bg-gray-200 p-1 text-black hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            onClick={handleZoomOut}
          >
            <FontAwesomeIcon icon={faMinus} />
          </button>
        </div>
        <h3 className="text-center text-lg font-semibold">{art.name}</h3>
        <p className="mb-1 text-center">{art.description}</p>
        <p className="mb-2 text-center font-bold">{art.price.toFixed(2)} €</p>
        <div className="flex justify-center gap-2">
          {inCart && !art.multiple ? (
            <Button onClick={() => removeItem(art.id)}>Remove</Button>
          ) : (
            <Button
              onClick={() =>
                addItem({ id: art.id, name: art.name, price: art.price, multiple: art.multiple })
              }
              disabled={!canAdd}
            >
              Add to Cart
            </Button>
          )}
          <Button className="bg-gray-300 text-black hover:bg-gray-400" onClick={onClose}>
            <FontAwesomeIcon icon={faXmark} className="mr-1" /> Close
          </Button>
        </div>
      </div>
    </div>
  )
}
