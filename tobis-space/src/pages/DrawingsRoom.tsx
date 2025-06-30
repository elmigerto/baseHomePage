import { Suspense, useEffect, useRef, useState } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { Canvas, useFrame, useLoader } from "@react-three/fiber"
import { Html, OrbitControls } from "@react-three/drei"
import {
  DoubleSide,
  Mesh,
  TextureLoader,
  RepeatWrapping,
} from "three"
import { Link } from 'react-router-dom'
import drawings from "../files/drawings"
import wallImg from "../assets/drawings/wall.png"

const ROOM_RADIUS = 12
const WALL_HEIGHT = 5

const SHOW_THRESHOLD = 1.1
const REMOVE_THRESHOLD = 1.4

function shuffle<T>(array: T[]): T[] {
  const copy = array.slice()
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function angleDiff(a: number, b: number) {
  const diff = a - b
  return Math.atan2(Math.sin(diff), Math.cos(diff))
}

const LAYERS = 3
const ROOM_HEIGHT = LAYERS * WALL_HEIGHT
const angleStep = (Math.PI * 2) / drawings.length
const placements = drawings.map((_, i) => ({
  angle: i * angleStep,
  offsetY: Math.random() * ROOM_HEIGHT - ROOM_HEIGHT / 2,
  width: 2 + Math.random() * 2,
  height: 2 + Math.random() * 2,
}))

const CAMERA_DISTANCE = ROOM_RADIUS - 1

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

  const [mapping, setMapping] = useState<(number | null)[]>(
    Array.from({ length: placements.length }, () => null),
  )
  const unseenRef = useRef<number[]>([])

  useEffect(() => {
    unseenRef.current = shuffle(
      Array.from({ length: drawings.length }, (_, i) => i),
    )
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
    const camAngle = controls.getAzimuthalAngle()

    setMapping((prev) => {
      let changed = false
      const next = [...prev]
      for (let i = 0; i < placements.length; i++) {
        const diff = Math.abs(angleDiff(camAngle, placements[i].angle))
        if (diff < SHOW_THRESHOLD) {
          if (next[i] == null) {
            next[i] = nextIndex()
            changed = true
          }
        } else if (diff > REMOVE_THRESHOLD) {
          if (next[i] != null) {
            next[i] = null
            changed = true
          }
        }
      }
      return changed ? next : prev
    })
  })

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const controls = controlsRef.current
      if (!controls) return
      if (e.key === 'ArrowUp') {
        controls.target.y += 0.5
        controls.object.position.y += 0.5
      } else if (e.key === 'ArrowDown') {
        controls.target.y -= 0.5
        controls.object.position.y -= 0.5
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  wallTexture.wrapS = RepeatWrapping
  wallTexture.wrapT = RepeatWrapping
  wallTexture.repeat.set(1, 1)

  const SEGMENTS = 32
  const wallWidth = (2 * Math.PI * ROOM_RADIUS) / SEGMENTS

  return (
    <group>
      {Array.from({ length: LAYERS }).map((_, layer) =>
        Array.from({ length: SEGMENTS }).map((_, i) => {
          const angle = (i / SEGMENTS) * Math.PI * 2
          const x = Math.cos(angle) * ROOM_RADIUS
          const z = Math.sin(angle) * ROOM_RADIUS
          const y = layer * WALL_HEIGHT
          return (
            <mesh
              key={`wall-${layer}-${i}`}
              position={[x, y, z]}
              rotation={[0, -angle - Math.PI / 2, 0]}
            >
              <planeGeometry args={[wallWidth, WALL_HEIGHT]} />
              <meshBasicMaterial map={wallTexture} side={DoubleSide} />
            </mesh>
          )
        }),
      )}
      {placements.map((rand, index) => {
        const drawingIndex = mapping[index]
        if (drawingIndex == null) return null
        const angle = rand.angle
        const x = Math.cos(angle) * ROOM_RADIUS
        const z = Math.sin(angle) * ROOM_RADIUS

        return (
          <ArtPlane
            key={`${index}-${drawingIndex}`}
            position={[x, rand.offsetY, z]}
            rotation={[0, -angle - Math.PI / 2, 0]}
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
          <OrbitControls
            ref={controlsRef}
            enablePan={false}
            enableZoom={false}
            enableDamping
            dampingFactor={0.1}
            rotateSpeed={0.3}
            minDistance={CAMERA_DISTANCE}
            maxDistance={CAMERA_DISTANCE}
          />
          <ambientLight intensity={0.8} />
          <GalleryScene controlsRef={controlsRef} />
        </Suspense>
      </Canvas>
    </div>
  )
}
