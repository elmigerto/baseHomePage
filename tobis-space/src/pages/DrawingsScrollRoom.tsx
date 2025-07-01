import { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import drawings from '../files/drawings'
import wallImg from '../assets/drawings/wall.png'
import useDrawingModal from '../hooks/useDrawingModal'

export default function DrawingsScrollRoom() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { open: openModal, modal } = useDrawingModal()
  const [items, setItems] = useState([...drawings])
  const [bgPos, setBgPos] = useState(0)

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

    const onScroll = () => {
      setBgPos(el.scrollLeft)
      if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 200) {
        setItems((prev) => [...prev, ...drawings])
      }
    }

    const interval = setInterval(() => {
      if (!active) return
      el.scrollLeft += step
    }, 20)

    el.addEventListener('scroll', onScroll)
    el.addEventListener('mousedown', stop)
    el.addEventListener('touchstart', stop)

    return () => {
      clearInterval(interval)
      if (restartTimer) clearTimeout(restartTimer)
      el.removeEventListener('scroll', onScroll)
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
        backgroundPositionX: `-${bgPos}px`,
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
          className="grid grid-flow-col auto-cols-max grid-rows-1 sm:grid-rows-2 lg:grid-rows-3 gap-4 overflow-x-scroll scroll-smooth min-h-screen pb-16"
        >
          {items.map((d, idx) => (
            <div key={`${d.id}-${idx}`} className="w-72 flex flex-col items-center px-2">
              <img
                src={d.image}
                alt={d.name}
                className="mb-2 h-72 w-72 cursor-pointer object-contain shadow-2xl"
                onClick={() => openModal(d)}
              />
              <p className="inline-block rounded bg-gray-800/90 px-2 py-0.5 text-sm text-white shadow">
                {d.name}
              </p>
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
        {modal}
      </div>
    </div>
  )
}

