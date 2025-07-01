import { useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import drawings from '../files/drawings'

export default function DrawingsScrollRoom() {
  const containerRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: number) => {
    containerRef.current?.scrollBy({ left: dir, behavior: 'smooth' })
  }

  return (
    <div className="w-full min-h-screen bg-gray-200">
      <div className="sticky top-16 z-30 mb-4 flex items-center justify-between gap-4 rounded border border-gray-300 bg-gray-200/70 p-2 backdrop-blur dark:border-gray-600 dark:bg-gray-700/70">
        <h2 className="page-title m-0">Scrolling Room</h2>
        <div className="flex gap-4">
          <Link to="/drawings" className="text-blue-500 underline">
            3D Room
          </Link>
          <Link to="/drawings/gallery" className="text-blue-500 underline">
            Gallery
          </Link>
        </div>
      </div>
      <div className="relative">
        <div
          ref={containerRef}
          className="flex overflow-x-scroll scroll-smooth snap-x snap-mandatory min-h-screen pb-16"
        >
          {drawings.map((d) => (
            <div
              key={d.id}
              className="flex-shrink-0 snap-center w-screen flex flex-col items-center justify-center px-4"
            >
              <img src={d.image} alt={d.name} className="h-80 object-contain mb-2" />
              <p>{d.name}</p>
            </div>
          ))}
        </div>
        <button
          aria-label="Move left"
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-700/40 text-white p-2 rounded hover:bg-gray-700/60"
          onClick={() => scroll(-300)}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <button
          aria-label="Move right"
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-700/40 text-white p-2 rounded hover:bg-gray-700/60"
          onClick={() => scroll(300)}
        >
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>
    </div>
  )
}
