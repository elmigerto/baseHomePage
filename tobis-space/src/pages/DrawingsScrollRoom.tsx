import { useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import drawings from '../files/drawings'
import wallImg from '../assets/drawings/wall.png'

export default function DrawingsScrollRoom() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    let active = true
    const step = 1
    let restartTimer: NodeJS.Timeout | null = null

    const start = () => {
      active = true
    }

    const stop = () => {
      active = false
      if (restartTimer) clearTimeout(restartTimer)
      restartTimer = setTimeout(start, 5000)
    }

    const interval = setInterval(() => {
      if (!active) return
      if (el.scrollLeft >= el.scrollWidth - el.clientWidth) {
        el.scrollTo({ left: 0 })
      } else {
        el.scrollLeft += step
      }
    }, 20)

    el.addEventListener('mousedown', stop)
    el.addEventListener('touchstart', stop)

    return () => {
      clearInterval(interval)
      if (restartTimer) clearTimeout(restartTimer)
      el.removeEventListener('mousedown', stop)
      el.removeEventListener('touchstart', stop)
    }
  }, [])

  const scroll = (dir: number) => {
    containerRef.current?.scrollBy({ left: dir, behavior: 'smooth' })
  }

  return (
    <div
      className="w-full min-h-screen bg-gray-200"
      style={{
        backgroundImage: `url(${wallImg})`,
        backgroundSize: '200px',
        backgroundRepeat: 'repeat',
      }}
    >
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
          className="grid grid-flow-col auto-cols-max grid-rows-1 sm:grid-rows-2 lg:grid-rows-3 gap-2 overflow-x-scroll scroll-smooth min-h-screen pb-16"
        >
          {drawings.map((d) => (
            <div key={d.id} className="w-48 flex flex-col items-center px-1">
              <img src={d.image} alt={d.name} className="h-48 w-48 object-contain mb-1" />
              <p className="text-center text-sm">{d.name}</p>
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
