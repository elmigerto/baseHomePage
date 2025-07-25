import { Suspense, useCallback, useEffect, useRef, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faArrowDown,
  faArrowLeft,
  faArrowRight,
  faArrowUp,
  faMinus,
  faPlus,
  faRotateLeft,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons"
import {
  Canvas,
  useFrame,
  useLoader,
  useThree,
  type ThreeElements,
} from "@react-three/fiber"
import { Html, MapControls } from "@react-three/drei"
import { useTranslation } from "../contexts/LanguageContext"
import {
  DoubleSide,
  Mesh,
  RepeatWrapping,
  TextureLoader,
  Vector3,
  MOUSE,
  TOUCH,
  type Texture,
} from "three"
import { Link } from "react-router-dom"
import drawings from "../files/drawings"
import wallImg from "../assets/drawings/wall.png"

const SEGMENT_SIZE = 10
const BASE_SEGMENTS = 5
const BASE_SHOW_RANGE = (SEGMENT_SIZE * BASE_SEGMENTS) / 2
const GRID_MARGIN = 2

const GRID_STEP = 12

function randomSize() {
  return (2 + Math.random() * 2) * 2
}

const CAMERA_DISTANCE = 10
const MOVE_STEP = 0.5
const RANDOM_MOVE_FACTOR = 0.2
const RANDOM_MOVE_INTERVAL = 100
const MIN_ZOOM = 0.5
const MAX_ZOOM = 2

function ArtPlane({
  texture,
  width,
  height,
  ...props
}: {
  texture: Texture
  width: number
  height: number
} & ThreeElements['mesh']) {
  const ref = useRef<Mesh>(null)
  return (
    <mesh ref={ref} {...props}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} side={DoubleSide} />
    </mesh>
  )
}

function GalleryScene({
  controlsRef,
  move,
  zoom,
  markInteraction,
}: {
  controlsRef: React.RefObject<any>
  move: (dx: number, dy: number) => void
  zoom: number
  markInteraction: () => void
}) {
  const textures = useLoader(TextureLoader, drawings.map((d) => d.image))
  const wallTexture = useLoader(TextureLoader, wallImg)
  const { size, gl } = useThree()
  const showRange = BASE_SHOW_RANGE / zoom
  let seg = Math.ceil((showRange * 2) / SEGMENT_SIZE)
  if (seg % 2 === 0) seg += 1
  const segments = Math.max(BASE_SEGMENTS, seg)
  const wallCount = segments * segments
  const POSITION_JITTER = 1
  const SCALE_JITTER = 0.1
  const pointerRef = useRef<{ x: number; y: number }>({ x: -1, y: -1 })
  interface GridItem {
    x: number
    y: number
    width: number
    height: number
    index: number
    key: string
    gridX: number
    gridY: number
  }
  const itemsRef = useRef<Map<string, GridItem>>(new Map())
  const [items, setItems] = useState<GridItem[]>([])

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const rect = gl.domElement.getBoundingClientRect()
      pointerRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }
    const handleLeave = () => {
      pointerRef.current = { x: -1, y: -1 }
    }
    const handleDown = () => {
      markInteraction()
    }
    gl.domElement.addEventListener('mousemove', handleMove)
    gl.domElement.addEventListener('mouseleave', handleLeave)
    gl.domElement.addEventListener('mousedown', handleDown)
    gl.domElement.addEventListener('touchstart', handleDown)
    return () => {
      gl.domElement.removeEventListener('mousemove', handleMove)
      gl.domElement.removeEventListener('mouseleave', handleLeave)
      gl.domElement.removeEventListener('mousedown', handleDown)
      gl.domElement.removeEventListener('touchstart', handleDown)
    }
  }, [gl, markInteraction])

  const orderRef = useRef<number[]>([])

  function refillOrder() {
    orderRef.current = Array.from({ length: drawings.length }, (_, i) => i)
    for (let i = orderRef.current.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[orderRef.current[i], orderRef.current[j]] = [
        orderRef.current[j],
        orderRef.current[i],
      ]
    }
  }

  function nextIndex() {
    if (orderRef.current.length === 0) {
      refillOrder()
    }
    return orderRef.current.shift() ?? 0
  }

  const ensureGrid = useCallback(() => {
    const controls = controlsRef.current
    if (!controls) return
    const camX = controls.target.x
    const camY = controls.target.y
    const camGridX = Math.round(camX / GRID_STEP)
    const camGridY = Math.round(camY / GRID_STEP)
    const rangeCells = Math.ceil(showRange / GRID_STEP) + GRID_MARGIN
    const newMap = new Map(itemsRef.current)

    for (let gx = camGridX - rangeCells; gx <= camGridX + rangeCells; gx++) {
      for (let gy = camGridY - rangeCells; gy <= camGridY + rangeCells; gy++) {
        const key = `${gx}:${gy}`
        if (!newMap.has(key)) {
          const index = nextIndex()
          const tex = textures[index]
          const scaleFactor = 1 + (Math.random() - 0.5) * SCALE_JITTER * 2
          const width = randomSize() * scaleFactor
          const ratio = tex?.image
            ? tex.image.height / tex.image.width
            : 1
          const jitterX = (Math.random() - 0.5) * POSITION_JITTER * 2
          const jitterY = (Math.random() - 0.5) * POSITION_JITTER * 2
          newMap.set(key, {
            x: gx * GRID_STEP + jitterX,
            y: gy * GRID_STEP + jitterY,
            width,
            height: width * ratio,
            index,
            key,
            gridX: gx,
            gridY: gy,
          })
        }
      }
    }

    const removeCells = rangeCells + GRID_MARGIN
    for (const [key, item] of newMap) {
      if (
        Math.abs(item.gridX - camGridX) > removeCells ||
        Math.abs(item.gridY - camGridY) > removeCells
      ) {
        newMap.delete(key)
      }
    }

    itemsRef.current = newMap
    setItems(Array.from(newMap.values()))
  }, [controlsRef, showRange])

  useEffect(() => {
    ensureGrid()
  }, [ensureGrid])

  useFrame(() => {
    ensureGrid()
    const controls = controlsRef.current
    if (!controls) return

    const pointer = pointerRef.current
    const edge = 50
    const moveStep = 0.2
    if (pointer.x >= 0 && pointer.y >= 0) {
      if (pointer.x < edge) {
        controls.target.x -= moveStep
        controls.object.position.x -= moveStep
      } else if (pointer.x > size.width - edge) {
        controls.target.x += moveStep
        controls.object.position.x += moveStep
      }
      if (pointer.y < edge) {
        controls.target.y += moveStep
        controls.object.position.y += moveStep
      } else if (pointer.y > size.height - edge) {
        controls.target.y -= moveStep
        controls.object.position.y -= moveStep
      }
      controls.update()
    }
  })


  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        move(0, MOVE_STEP)
      } else if (e.key === 'ArrowDown') {
        move(0, -MOVE_STEP)
      } else if (e.key === 'ArrowLeft') {
        move(-MOVE_STEP, 0)
      } else if (e.key === 'ArrowRight') {
        move(MOVE_STEP, 0)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [move])

  wallTexture.wrapS = RepeatWrapping
  wallTexture.wrapT = RepeatWrapping
  wallTexture.repeat.set(1, 1)

  const tilesRef = useRef<Mesh[]>([])

  useFrame(() => {
    const controls = controlsRef.current
    if (!controls) return
    const camX = controls.target.x
    const camY = controls.target.y
    let seg = Math.ceil((showRange * 2) / SEGMENT_SIZE)
    if (seg % 2 === 0) seg += 1
    const segments = Math.max(BASE_SEGMENTS, seg)
    const half = Math.floor(segments / 2)
    tilesRef.current.forEach((mesh, idx) => {
      const col = (idx % segments) - half
      const row = Math.floor(idx / segments) - half
      const baseX = Math.floor(camX / SEGMENT_SIZE) * SEGMENT_SIZE
      const baseY = Math.floor(camY / SEGMENT_SIZE) * SEGMENT_SIZE
      mesh.position.x = baseX + col * SEGMENT_SIZE
      mesh.position.y = baseY + row * SEGMENT_SIZE
    })
    tilesRef.current.length = wallCount
  })

  return (
    <group>
      {Array.from({ length: wallCount }).map((_, i) => (
        <mesh
          key={`wall-${i}`}
          ref={(el) => {
            if (el) tilesRef.current[i] = el
          }}
          rotation={[0, 0, 0]}
          position={[0, 0, 0]}
        >
          <planeGeometry args={[SEGMENT_SIZE, SEGMENT_SIZE]} />
          <meshBasicMaterial map={wallTexture} side={DoubleSide} />
        </mesh>
      ))}
      {items.map((item) => (
        <ArtPlane
          key={item.key}
          position={[item.x, item.y, 0.1]}
          rotation={[0, 0, 0]}
          texture={textures[item.index]}
          width={item.width}
          height={item.height}
        />
      ))}
    </group>
  )
}

export default function DrawingsRoom() {
  const t = useTranslation()
  const controlsRef = useRef<any>(null)
  const [zoom, setZoom] = useState(1)
  const moveInterval = useRef<NodeJS.Timeout | null>(null)
  const autoMoveInterval = useRef<NodeJS.Timeout | null>(null)
  const lastInteraction = useRef(Date.now())

  const IDLE_DELAY = 5000

  const move = useCallback((dx: number, dy: number) => {
    const controls = controlsRef.current
    if (!controls) return
    controls.target.x += dx
    controls.object.position.x += dx
    controls.target.y += dy
    controls.object.position.y += dy
    controls.update()
  }, [])

  const startRandomMove = useCallback(() => {
    if (autoMoveInterval.current) return
    const angle = Math.random() * Math.PI * 2
    const dx = Math.cos(angle) * MOVE_STEP * RANDOM_MOVE_FACTOR
    const dy = Math.sin(angle) * MOVE_STEP * RANDOM_MOVE_FACTOR
    autoMoveInterval.current = setInterval(
      () => move(dx, dy),
      RANDOM_MOVE_INTERVAL,
    )
  }, [move])

  const stopRandomMove = useCallback(() => {
    if (autoMoveInterval.current) {
      clearInterval(autoMoveInterval.current)
      autoMoveInterval.current = null
    }
  }, [])

  const markInteraction = useCallback(() => {
    lastInteraction.current = Date.now()
    stopRandomMove()
  }, [stopRandomMove])

  useEffect(() => {
    startRandomMove()
  }, [startRandomMove])

  const setCameraDistance = useCallback((targetZoom: number) => {
    const controls = controlsRef.current
    if (!controls) return
    const cam = controls.object
    const dir = new Vector3()
      .subVectors(cam.position, controls.target)
      .normalize()
    const distance = CAMERA_DISTANCE / targetZoom
    cam.position.copy(controls.target.clone().add(dir.multiplyScalar(distance)))
    controls.update()
  }, [])

  const applyZoom = useCallback(
    (next: number) => {
      const clamped = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, next))
      setCameraDistance(clamped)
      setZoom(clamped)
    },
    [setCameraDistance],
  )

  const startContinuousMove = useCallback(
    (dx: number, dy: number) => {
      markInteraction()
      move(dx, dy)
      moveInterval.current = setInterval(() => {
        markInteraction()
        move(dx, dy)
      }, 100)
    },
    [move, markInteraction],
  )

  const stopContinuousMove = useCallback(() => {
    if (moveInterval.current) {
      clearInterval(moveInterval.current)
      moveInterval.current = null
    }
  }, [])

  useEffect(() => {
    const controls = controlsRef.current
    if (!controls) return
    const handleChange = () => {
      const cam = controls.object
      const dist = cam.position.distanceTo(controls.target)
      const currentZoom = CAMERA_DISTANCE / dist
      const clamped = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, currentZoom))
      if (clamped !== currentZoom) {
        setCameraDistance(clamped)
      }
      setZoom(clamped)
    }
    controls.addEventListener("change", handleChange)
    return () => {
      controls.removeEventListener("change", handleChange)
    }
  }, [setCameraDistance])

  useEffect(() => {
    drawings.forEach((d) => {
      const img = new Image()
      img.src = d.image
    })
  }, [])

  useEffect(() => {
    const checkIdle = setInterval(() => {
      if (
        !autoMoveInterval.current &&
        Date.now() - lastInteraction.current > IDLE_DELAY
      ) {
        startRandomMove()
      }
    }, 1000)
    const events = ['mousedown', 'touchstart', 'keydown', 'wheel'] as const
    events.forEach((e) => window.addEventListener(e, markInteraction))
    return () => {
      clearInterval(checkIdle)
      events.forEach((e) => window.removeEventListener(e, markInteraction))
      stopRandomMove()
    }
  }, [markInteraction, startRandomMove, stopRandomMove])

  return (
    <div className="w-full h-screen pb-5 bg-gray-200">
      <div className="sticky top-16 z-30 mb-4 flex items-center justify-between gap-4 rounded border border-gray-300 bg-gray-200/70 p-2 backdrop-blur dark:border-gray-600 dark:bg-gray-700/70">
        <h2 className="page-title m-0">{t('drawings.virtualRoom')}</h2>
        <div className="flex gap-2">
          <Link
            to="/drawings/scroll"
            className="btn bg-brand-neon px-6 py-3 text-lg hover:bg-brand"
          >
            {t('drawings.scrollRoom')}
            <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
          </Link>
          <Link
            to="/drawings/gallery"
            className="btn bg-brand-neon px-6 py-3 text-lg hover:bg-brand"
          >
            {t('drawings.gallery')}
            <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
          </Link>
        </div>
      </div>

      <Canvas
        className="w-full h-full"
        style={{ height: "90vh" }}
        camera={{ position: [0, 1.5, CAMERA_DISTANCE] }}
      >
        <Suspense
          fallback={
            <Html center>
              <div className="flex items-center gap-2 text-white">
                <FontAwesomeIcon icon={faSpinner} spin />
                <span>{t('drawings.loading')}</span>
              </div>
            </Html>
          }
        >
          <MapControls
            ref={controlsRef}
            target={[0, 1.5, 0]}
            enableRotate={false}
            enablePan
            enableZoom={false}
            enableDamping
            dampingFactor={0.1}
            mouseButtons={{
              LEFT: MOUSE.PAN,
              MIDDLE: MOUSE.PAN,
              RIGHT: MOUSE.PAN,
            }}
            touches={{ ONE: TOUCH.PAN, TWO: TOUCH.PAN }}
          />
          <ambientLight intensity={0.8} />
          <GalleryScene
            controlsRef={controlsRef}
            move={move}
            zoom={zoom}
            markInteraction={markInteraction}
          />
        </Suspense>
      </Canvas>
      <div className="fixed bottom-4 right-4 z-20 flex flex-col items-center space-y-2 text-white">
        <div className="flex gap-2 items-center">
          <button
            aria-label={t('drawings.zoomIn')}
            className="bg-gray-700/40 p-2 rounded hover:bg-gray-700/60"
            onClick={() => applyZoom(zoom + 0.1)}
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
          <button
            aria-label={t('drawings.resetZoom')}
            className="bg-gray-700/40 p-2 rounded hover:bg-gray-700/60"
            onClick={() => applyZoom(1)}
          >
            <FontAwesomeIcon icon={faRotateLeft} />
          </button>
          <button
            aria-label={t('drawings.zoomOut')}
            className="bg-gray-700/40 p-2 rounded hover:bg-gray-700/60"
            onClick={() => applyZoom(zoom - 0.1)}
          >
            <FontAwesomeIcon icon={faMinus} />
          </button>
          <span className="ml-2">{zoom.toFixed(1)}x</span>
        </div>
      </div>

      <button
        aria-label={t('drawings.moveUp')}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-20 bg-gray-700/40 p-2 rounded hover:bg-gray-700/60 text-white"
        onMouseDown={() => startContinuousMove(0, MOVE_STEP)}
        onMouseUp={stopContinuousMove}
        onMouseLeave={stopContinuousMove}
        onTouchStart={() => startContinuousMove(0, MOVE_STEP)}
        onTouchEnd={stopContinuousMove}
        onTouchCancel={stopContinuousMove}
      >
        <FontAwesomeIcon icon={faArrowUp} />
      </button>
      <button
        aria-label={t('drawings.moveDown')}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-20 bg-gray-700/40 p-2 rounded hover:bg-gray-700/60 text-white"
        onMouseDown={() => startContinuousMove(0, -MOVE_STEP)}
        onMouseUp={stopContinuousMove}
        onMouseLeave={stopContinuousMove}
        onTouchStart={() => startContinuousMove(0, -MOVE_STEP)}
        onTouchEnd={stopContinuousMove}
        onTouchCancel={stopContinuousMove}
      >
        <FontAwesomeIcon icon={faArrowDown} />
      </button>
      <button
        aria-label={t('drawings.moveLeft')}
        className="fixed left-4 top-1/2 -translate-y-1/2 z-20 bg-gray-700/40 p-2 rounded hover:bg-gray-700/60 text-white"
        onMouseDown={() => startContinuousMove(-MOVE_STEP, 0)}
        onMouseUp={stopContinuousMove}
        onMouseLeave={stopContinuousMove}
        onTouchStart={() => startContinuousMove(-MOVE_STEP, 0)}
        onTouchEnd={stopContinuousMove}
        onTouchCancel={stopContinuousMove}
      >
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>
      <button
        aria-label={t('drawings.moveRight')}
        className="fixed right-4 top-1/2 -translate-y-1/2 z-20 bg-gray-700/40 p-2 rounded hover:bg-gray-700/60 text-white"
        onMouseDown={() => startContinuousMove(MOVE_STEP, 0)}
        onMouseUp={stopContinuousMove}
        onMouseLeave={stopContinuousMove}
        onTouchStart={() => startContinuousMove(MOVE_STEP, 0)}
        onTouchEnd={stopContinuousMove}
        onTouchCancel={stopContinuousMove}
      >
        <FontAwesomeIcon icon={faArrowRight} />
      </button>
    </div>
  )
}
