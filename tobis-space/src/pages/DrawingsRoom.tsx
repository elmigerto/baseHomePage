import { Suspense, useCallback, useEffect, useRef, useState } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowLeft,
  faSpinner,
  faArrowUp,
  faArrowDown,
  faArrowRight,
  faPlus,
  faMinus,
  faRotateLeft,
} from '@fortawesome/free-solid-svg-icons'
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber"
import { Html, MapControls } from "@react-three/drei"
import {
  DoubleSide,
  Mesh,
  TextureLoader,
  RepeatWrapping,
} from "three"
import { Link } from 'react-router-dom'
import drawings from "../files/drawings"
import wallImg from "../assets/drawings/wall.png"

const SEGMENT_SIZE = 10
const SEGMENTS = 5
const HALF = Math.floor(SEGMENTS / 2)
const SHOW_RANGE = (SEGMENT_SIZE * SEGMENTS) / 2
const REMOVE_RANGE = SHOW_RANGE * 1.4

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
}

const GRID_STEP = 6

function randomSize() {
  return (2 + Math.random() * 2) * 2
}

function randomGridPosition(
  camX = 0,
  camY = 0,
  used?: Set<string>,
) {
  for (let i = 0; i < 20; i++) {
    const x =
      Math.round((camX + (Math.random() - 0.5) * SHOW_RANGE) / GRID_STEP) *
      GRID_STEP
    const y =
      Math.round((camY + (Math.random() - 0.5) * SHOW_RANGE) / GRID_STEP) *
      GRID_STEP
    const key = `${x}:${y}`
    if (!used || !used.has(key)) {
      used?.add(key)
      return { x, y }
    }
  }
  return { x: camX, y: camY }
}


const CAMERA_DISTANCE = 5
const MOVE_STEP = 0.5

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
}: {
  controlsRef: React.RefObject<any>
}) {
  const textures = useLoader(TextureLoader, drawings.map((d) => d.image))
  const wallTexture = useLoader(TextureLoader, wallImg)
  const { size, gl } = useThree()
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
      const { x, y } = randomGridPosition(0, 0, usedPositions.current)
      return { x, y, width: randomSize(), height: randomSize() }
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

    setPositions((prev) => {
      let changed = false
      const next = [...prev]
      const nextMapping = [...mapping]
      for (let i = 0; i < next.length; i++) {
        const p = next[i]
        if (
          Math.abs(p.x - camX) > REMOVE_RANGE ||
          Math.abs(p.y - camY) > REMOVE_RANGE
        ) {
          usedPositions.current.delete(`${p.x}:${p.y}`)
          const { x, y } = randomGridPosition(camX, camY, usedPositions.current)
          next[i] = {
            x,
            y,
            width: randomSize(),
            height: randomSize(),
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
    tilesRef.current.forEach((mesh, idx) => {
      const col = (idx % SEGMENTS) - HALF
      const row = Math.floor(idx / SEGMENTS) - HALF
      const baseX = Math.floor(camX / SEGMENT_SIZE) * SEGMENT_SIZE
      const baseY = Math.floor(camY / SEGMENT_SIZE) * SEGMENT_SIZE
      mesh.position.x = baseX + col * SEGMENT_SIZE
      mesh.position.y = baseY + row * SEGMENT_SIZE
    })
  })

  return (
    <group>
      {Array.from({ length: SEGMENTS * SEGMENTS }).map((_, i) => (
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

  const applyZoom = useCallback(
    (next: number) => {
      const clamped = Math.min(2, Math.max(0.5, next))
      setZoom(clamped)
    },
    [],
  )

  const move = useCallback((dx: number, dy: number) => {
    const controls = controlsRef.current
    if (!controls) return
    controls.target.x += dx
    controls.object.position.x += dx
    controls.target.y += dy
    controls.object.position.y += dy
    controls.update()
  }, [])

  useEffect(() => {
    const controls = controlsRef.current
    if (!controls) return
    const cam = controls.object
    cam.zoom = zoom
    cam.updateProjectionMatrix()
    controls.update()
  }, [zoom])

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
            enableZoom={false}
            enablePan
            enableDamping
            dampingFactor={0.1}
          />
          <ambientLight intensity={0.8} />
          <GalleryScene controlsRef={controlsRef} />
        </Suspense>
      </Canvas>
      <div className="fixed bottom-4 right-4 z-20 flex flex-col items-center space-y-2 text-white">
        <div className="flex gap-2">
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
        </div>
        <div className="grid grid-cols-3 gap-1">
          <div />
          <button
            aria-label="Move up"
            className="bg-gray-700/40 p-2 rounded hover:bg-gray-700/60"
            onClick={() => move(0, MOVE_STEP)}
          >
            <FontAwesomeIcon icon={faArrowUp} />
          </button>
          <div />
          <button
            aria-label="Move left"
            className="bg-gray-700/40 p-2 rounded hover:bg-gray-700/60"
            onClick={() => move(-MOVE_STEP, 0)}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <button
            aria-label="Move down"
            className="bg-gray-700/40 p-2 rounded hover:bg-gray-700/60"
            onClick={() => move(0, -MOVE_STEP)}
          >
            <FontAwesomeIcon icon={faArrowDown} />
          </button>
          <button
            aria-label="Move right"
            className="bg-gray-700/40 p-2 rounded hover:bg-gray-700/60"
            onClick={() => move(MOVE_STEP, 0)}
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      </div>
    </div>
  )
}
