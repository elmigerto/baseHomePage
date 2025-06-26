import { useRef } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft, faArrowRight, faCartPlus } from "@fortawesome/free-solid-svg-icons"
import { Link } from "react-router-dom"
import drawings from "../files/drawings"
import { useCart } from "../contexts/CartContext"

export default function DrawingsRoom() {
  const { addItem } = useCart()
  const containerRef = useRef<HTMLDivElement>(null)
  const scroll = (offset: number) => {
    containerRef.current?.scrollBy({ left: offset, behavior: "smooth" })
  }
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Link to="/drawings" className="text-blue-500 underline flex items-center">
          <FontAwesomeIcon icon={faArrowLeft} className="mr-1" /> Back to gallery
        </Link>
        <h2 className="text-xl font-bold">Virtual Room</h2>
      </div>
      <div className="relative">
        <button
          aria-label="Scroll left"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/80 dark:bg-gray-800/80 rounded-full shadow"
          onClick={() => scroll(-300)}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <div
          ref={containerRef}
          className="overflow-x-auto whitespace-nowrap py-4 px-8 snap-x snap-mandatory"
        >
          {drawings.map((art) => (
            <div key={art.id} className="inline-block mx-4 snap-center">
              <img
                src={art.image}
                alt={art.name}
                className="w-64 h-40 object-cover rounded shadow-md mb-2"
              />
              <div className="flex justify-between items-center">
                <span>{art.name}</span>
                <button
                  className="btn px-2 py-1"
                  onClick={() => addItem(art)}
                >
                  <FontAwesomeIcon icon={faCartPlus} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          aria-label="Scroll right"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/80 dark:bg-gray-800/80 rounded-full shadow"
          onClick={() => scroll(300)}
        >
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>
    </div>
  )
}
