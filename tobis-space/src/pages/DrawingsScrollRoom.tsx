import { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import drawings, { categories, type Drawing } from '../files/drawings'
import wallImg from '../assets/drawings/wall.png'
import useDrawingModal from '../hooks/useDrawingModal'

function useRowCount() {
  const getRows = () => {
    if (window.matchMedia('(min-width: 1024px)').matches) return 3
    if (window.matchMedia('(min-width: 640px)').matches) return 2
    return 1
  }
  const [rows, setRows] = useState<number>(() => getRows())
  useEffect(() => {
    const update = () => setRows(getRows())
    const mLg = window.matchMedia('(min-width: 1024px)')
    const mSm = window.matchMedia('(min-width: 640px)')
    mLg.addEventListener('change', update)
    mSm.addEventListener('change', update)
    return () => {
      mLg.removeEventListener('change', update)
      mSm.removeEventListener('change', update)
    }
  }, [])
  return rows
}

export default function DrawingsScrollRoom() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { open: openModal, modal } = useDrawingModal()

  type RowItem =
    | { type: 'label'; category: string }
    | { type: 'drawing'; drawing: Drawing }

  const sortedCategories = [...categories].sort()

  const drawingsByCat: Record<string, Drawing[]> = {}
  for (const cat of sortedCategories) {
    drawingsByCat[cat] = drawings
      .filter((d) => d.category === cat)
      .sort((a, b) => a.name.localeCompare(b.name))
  }

  const rows = useRowCount()

  const makeCycle = (start: number) => {
    const arr: RowItem[] = []
    for (let i = 0; i < sortedCategories.length; i++) {
      const cat = sortedCategories[(start + i) % sortedCategories.length]
      arr.push({ type: 'label', category: cat })
      arr.push(
        ...drawingsByCat[cat].map((d) => ({ type: 'drawing', drawing: d }))
      )
    }
    return arr
  }

  const makeRows = () => {
    const sequences = Array.from({ length: rows }, (_, i) => makeCycle(i))
    const maxLen = Math.max(...sequences.map((s) => s.length))
    const result: RowItem[] = []
    for (let col = 0; col < maxLen; col++) {
      for (let row = 0; row < rows; row++) {
        const item = sequences[row][col]
        if (item) result.push(item)
      }
    }
    return result
  }

  const [items, setItems] = useState<RowItem[]>(makeRows())
  const [bgPos, setBgPos] = useState(0)

  useEffect(() => {
    setItems(makeRows())
  }, [rows])

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
        setItems((prev) => [...prev, ...makeRows()])
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
          {items.map((item, idx) =>
            item.type === 'label' ? (
              <div
                key={`label-${item.category}-${idx}`}
                className="flex items-center justify-center w-60 text-lg font-semibold"
              >
                {item.category}
              </div>
            ) : (
              <div
                key={`${item.drawing.id}-${idx}`}
                className="w-60 flex flex-col items-center px-2 pb-10"
              >
                <img
                  src={item.drawing.image}
                  alt={item.drawing.name}
                  className="mb-2 h-60 w-60 cursor-pointer object-contain shadow-lg"
                  onClick={() => openModal(item.drawing)}
                />
                <p className="text-center text-base">{item.drawing.name}</p>
              </div>
            )
          )}
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

