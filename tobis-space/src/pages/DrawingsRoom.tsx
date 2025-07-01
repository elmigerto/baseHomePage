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
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber"
import { Html, MapControls } from "@react-three/drei"
import {
  DoubleSide,
  Mesh,
  RepeatWrapping,
  TextureLoader,
  Vector3,
} from "three"
import { Link } from "react-router-dom"
import drawings from "../files/drawings"
import wallImg from "../assets/drawings/wall.png"

const SEGMENT_SIZE = 10
const BASE_SEGMENTS = 5
const BASE_SHOW_RANGE = (SEGMENT_SIZE * BASE_SEGMENTS) / 2
const INITIAL_RANGE = BASE_SHOW_RANGE * 2

function shuffle<T>(array: T[]): T[] {
  const copy = array.slice()
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

interface Placement {
  x: number
  y: number
  width: number
  height: number
  key: string
}

const GRID_STEP = 5

function randomSize() {
  return (2 + Math.random() * 2) * 2
}

function randomGridPosition(
  camX = 0,
  camY = 0,
  used?: Set<string>,
  range = BASE_SHOW_RANGE,
) {
  let attempts = 0
  let currentRange = range
  while (attempts < 100) {
    const gridX = Math.round(
      (camX + (Math.random() - 0.5) * currentRange) / GRID_STEP,
    )
    const gridY = Math.round(
      (camY + (Math.random() - 0.5) * currentRange) / GRID_STEP,
    )
    const key = `${gridX}:${gridY}`
    if (!used || !used.has(key)) {
      used?.add(key)
      const jitterX = (Math.random() - 0.5) * GRID_STEP * 0.3
      const jitterY = (Math.random() - 0.5) * GRID_STEP * 0.3
      return {
        x: gridX * GRID_STEP + jitterX,
        y: gridY * GRID_STEP + jitterY,
        key,
      }
    }
    attempts += 1
    if (attempts % 20 === 0) {
      currentRange *= 1.5
    }
  }
  const gridX = Math.round(camX / GRID_STEP)
  const gridY = Math.round(camY / GRID_STEP)
  const key = `${gridX}:${gridY}`
  used?.add(key)
  return { x: gridX * GRID_STEP, y: gridY * GRID_STEP, key }
}


const CAMERA_DISTANCE = 5
const MOVE_STEP = 0.5
const MIN_ZOOM = 0.5
const MAX_ZOOM = 2

function ArtPlane({
  texture,
  width,
  height,
  ...props
}: {
  texture: string
  width: number
  height: number
} & JSX.IntrinsicElements['mesh']) {
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
}: {
  controlsRef: React.RefObject<any>
  move: (dx: number, dy: number) => void
  zoom: number
}) {
  const textures = useLoader(TextureLoader, drawings.map((d) => d.image))
  const wallTexture = useLoader(TextureLoader, wallImg)
  const { size, gl } = useThree()
  const showRange = BASE_SHOW_RANGE / zoom
  let seg = Math.ceil((showRange * 2) / SEGMENT_SIZE)
  if (seg % 2 === 0) seg += 1
  const segments = Math.max(BASE_SEGMENTS, seg)
  const half = Math.floor(segments / 2)
  const wallCount = segments * segments
  const pointerRef = useRef<{ x: number; y: number }>({ x: -1, y: -1 })
  const usedPositions = useRef<Set<string>>(new Set())
  const [positions, setPositions] = useState<Placement[]>([])
  const [mapping, setMapping] = useState<number[]>([])
  const unseenRef = useRef<number[]>([])

  useEffect(() => {
    unseenRef.current = shuffle(
      Array.from({ length: drawings.length }, (_, i) => i),
    )

    const initial = drawings.map(() => {
      const { x, y, key } = randomGridPosition(
        0,
        0,
        usedPositions.current,
        INITIAL_RANGE,
      )
      return { x, y, width: randomSize(), height: randomSize(), key }
    })
    setPositions(initial)
    setMapping(initial.map(() => nextIndex()))
  }, [])

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
    gl.domElement.addEventListener('mousemove', handleMove)
    gl.domElement.addEventListener('mouseleave', handleLeave)
    return () => {
      gl.domElement.removeEventListener('mousemove', handleMove)
      gl.domElement.removeEventListener('mouseleave', handleLeave)
    }
  }, [gl])

  function nextIndex() {
    if (unseenRef.current.length === 0) {
      unseenRef.current = shuffle(
        Array.from({ length: drawings.length }, (_, i) => i),
      )
    }
    return unseenRef.current.pop() ?? 0
  }

  useFrame(() => {
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

    const camX = controls.target.x
    const camY = controls.target.y
    const removeRange = showRange

    setPositions((prev) => {
      let changed = false
      const next = [...prev]
      const nextMapping = [...mapping]
      for (let i = 0; i < next.length; i++) {
        const p = next[i]
        if (
          Math.abs(p.x - camX) > removeRange ||
          Math.abs(p.y - camY) > removeRange
        ) {
          usedPositions.current.delete(p.key)
          const { x, y, key } = randomGridPosition(
            camX,
            camY,
            usedPositions.current,
            showRange,
          )
          next[i] = {
            x,
            y,
            width: randomSize(),
            height: randomSize(),
            key,
          }
          nextMapping[i] = nextIndex()
          changed = true
        }
      }
      if (changed) {
        setMapping(nextMapping)
        return next
      }
      return prev
    })
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
      {positions.map((rand, index) => {
        const drawingIndex = mapping[index]
        return (
          <ArtPlane
            key={`${index}-${drawingIndex}`}
            position={[rand.x, rand.y, 0.1]}
            rotation={[0, 0, 0]}
            texture={textures[drawingIndex]}
            width={rand.width}
            height={rand.height}
          />
        )
      })}
    </group>
  )
}

export default function DrawingsRoom() {
  const controlsRef = useRef<any>(null)
  const [zoom, setZoom] = useState(1)
  const moveInterval = useRef<NodeJS.Timeout | null>(null)
  const autoMoveInterval = useRef<NodeJS.Timeout | null>(null)
  const lastInteraction = useRef(Date.now())

  const IDLE_DELAY = 1000

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
    const dx = Math.cos(angle) * MOVE_STEP
    const dy = Math.sin(angle) * MOVE_STEP
    autoMoveInterval.current = setInterval(() => move(dx, dy), 200)
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
      move(dx, dy)
      moveInterval.current = setInterval(() => move(dx, dy), 100)
    },
    [move],
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
    const events = [
      'mousemove',
      'keydown',
      'mousedown',
      'touchstart',
      'wheel',
    ] as const
    events.forEach((e) => window.addEventListener(e, markInteraction))
    return () => {
      clearInterval(checkIdle)
      events.forEach((e) => window.removeEventListener(e, markInteraction))
      stopRandomMove()
    }
  }, [markInteraction, startRandomMove, stopRandomMove])

  return (
    <div className="min-h-screen w-screen bg-gray-200">
      <header className="fixed top-4 left-4 z-10 flex items-center gap-4">
        <Link to="/drawings/gallery" className="text-blue-500 underline flex items-center">
          <FontAwesomeIcon icon={faArrowLeft} className="mr-1" /> Back to gallery
        </Link>
        <h2 className="page-title text-white">Virtual Room</h2>
      </header>

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
                <span>Loading virtual room...</span>
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
          />
          <ambientLight intensity={0.8} />
          <GalleryScene controlsRef={controlsRef} move={move} zoom={zoom} />
        </Suspense>
      </Canvas>
      <div className="fixed bottom-4 right-4 z-20 flex flex-col items-center space-y-2 text-white">
        <div className="flex gap-2 items-center">
          <button
            aria-label="Zoom in"
            className="bg-gray-700/40 p-2 rounded hover:bg-gray-700/60"
            onClick={() => applyZoom(zoom + 0.1)}
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
          <button
            aria-label="Reset zoom"
            className="bg-gray-700/40 p-2 rounded hover:bg-gray-700/60"
            onClick={() => applyZoom(1)}
          >
            <FontAwesomeIcon icon={faRotateLeft} />
          </button>
          <button
            aria-label="Zoom out"
            className="bg-gray-700/40 p-2 rounded hover:bg-gray-700/60"
            onClick={() => applyZoom(zoom - 0.1)}
          >
            <FontAwesomeIcon icon={faMinus} />
          </button>
          <span className="ml-2">{zoom.toFixed(1)}x</span>
        </div>
      </div>

      <button
        aria-label="Move up"
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
        aria-label="Move down"
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
        aria-label="Move left"
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
        aria-label="Move right"
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
