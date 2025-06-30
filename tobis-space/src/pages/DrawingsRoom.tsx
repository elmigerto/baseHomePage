import { Suspense, useEffect, useRef, useState } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { Canvas, useFrame, useLoader } from "@react-three/fiber"
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

const placements: Placement[] = drawings.map(() => ({
  x: (Math.random() - 0.5) * SHOW_RANGE,
  y: (Math.random() - 0.5) * SHOW_RANGE,
  width: 2 + Math.random() * 2,
  height: 2 + Math.random() * 2,
}))

const CAMERA_DISTANCE = 5

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

  const [mapping, setMapping] = useState<number[]>(
    Array.from({ length: placements.length }, () => 0),
  )
  const [positions, setPositions] = useState<Placement[]>(placements)
  const unseenRef = useRef<number[]>([])

  useEffect(() => {
    unseenRef.current = shuffle(
      Array.from({ length: drawings.length }, (_, i) => i),
    )
    setMapping((prev) => prev.map(() => nextIndex()))
  }, [])

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
          next[i] = {
            x: camX + (Math.random() - 0.5) * SHOW_RANGE,
            y: camY + (Math.random() - 0.5) * SHOW_RANGE,
            width: 2 + Math.random() * 2,
            height: 2 + Math.random() * 2,
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
      const controls = controlsRef.current
      if (!controls) return
      const step = 0.5
      if (e.key === 'ArrowUp') {
        controls.target.y += step
        controls.object.position.y += step
      } else if (e.key === 'ArrowDown') {
        controls.target.y -= step
        controls.object.position.y -= step
      } else if (e.key === 'ArrowLeft') {
        controls.target.x -= step
        controls.object.position.x -= step
      } else if (e.key === 'ArrowRight') {
        controls.target.x += step
        controls.object.position.x += step
      }
      controls.update()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

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
    </div>
  )
}
