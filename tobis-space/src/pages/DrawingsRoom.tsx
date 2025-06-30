import { Suspense, useEffect, useRef } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber"
import { Html, OrbitControls } from "@react-three/drei"
import {
  DoubleSide,
  Group,
  Mesh,
  TextureLoader,
  RepeatWrapping,
} from "three"
import { Link } from 'react-router-dom'
import drawings from "../files/drawings"
import wallImg from "../assets/drawings/wall.png"

const placements = drawings.map(() => ({
  surface: ['left', 'right', 'ceiling'][Math.floor(Math.random() * 3)] as
    | 'left'
    | 'right'
    | 'ceiling',
  offsetY: (Math.random() * 4) - 2,
  offsetZ: (Math.random() - 0.5),
  rotZ: (Math.random() - 0.5) * 0.2,
  width: 2 + Math.random() * 2,
  height: 2 + Math.random() * 2,
}))

const ART_SPACING = 5
const SEGMENT_WIDTH = drawings.length * ART_SPACING
const CAMERA_DISTANCE = 7
const WALL_DISTANCE = 8

function SpinningArt({
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

function GallerySegment({ group }: { group: React.MutableRefObject<Group | null> }) {
  const textures = useLoader(TextureLoader, drawings.map((d) => d.image))
  const wallTexture = useLoader(TextureLoader, wallImg)
  const spacing = ART_SPACING
  const wallDistance = WALL_DISTANCE
  const wallHeight = 5

  wallTexture.wrapS = RepeatWrapping
  wallTexture.wrapT = RepeatWrapping
  wallTexture.repeat.set(SEGMENT_WIDTH / 4, 2)

  const wallCenterX = SEGMENT_WIDTH / 2 - spacing / 2

  return (
    <group ref={group}>
      <mesh position={[wallCenterX, 0, -wallDistance]}>
        <planeGeometry args={[SEGMENT_WIDTH, wallHeight]} />
        <meshBasicMaterial map={wallTexture} side={DoubleSide} />
      </mesh>
      <mesh position={[wallCenterX, 0, wallDistance]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[SEGMENT_WIDTH, wallHeight]} />
        <meshBasicMaterial map={wallTexture} side={DoubleSide} />
      </mesh>
      {drawings.map((art, index) => {
        const rand = placements[index]
        const pos: [number, number, number] = [index * spacing, 0, 0]
        let rot: [number, number, number] = [0, 0, rand.rotZ]

        if (rand.surface === "left") {
          pos[1] = rand.offsetY
          pos[2] = -wallDistance + rand.offsetZ
        } else if (rand.surface === "right") {
          pos[1] = rand.offsetY
          pos[2] = wallDistance + rand.offsetZ
          rot = [0, Math.PI, rand.rotZ]
        } else {
          pos[1] = wallDistance + rand.offsetY
          pos[2] = rand.offsetZ
          rot = [Math.PI / 2, 0, rand.rotZ]
        }

        return (
          <SpinningArt
            key={art.id}
            position={pos}
            rotation={rot}
            texture={textures[index]}
            width={rand.width}
            height={rand.height}
          />
        )
      })}
    </group>
  )
}

export default function DrawingsRoom() {
  const camX = useRef(0)
  const controlsRef = useRef<any>(null)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") camX.current += 0.5
      if (e.key === "ArrowLeft") camX.current -= 0.5
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [])
  function GalleryScene() {
    const { camera } = useThree()
    const controls = controlsRef.current
    const left = useRef<Group | null>(null)
    const center = useRef<Group | null>(null)
    const right = useRef<Group | null>(null)

    useFrame(() => {
      camera.position.set(camX.current, 1.5, -CAMERA_DISTANCE)
      const offset = Math.floor(camera.position.x / SEGMENT_WIDTH)
      if (left.current && center.current && right.current) {
        left.current.position.x = SEGMENT_WIDTH * (offset - 1)
        center.current.position.x = SEGMENT_WIDTH * offset
        right.current.position.x = SEGMENT_WIDTH * (offset + 1)
      }

      if (controls) {
        controls.target.set(camera.position.x, 1.5, -WALL_DISTANCE)
        controls.update()
      }
    })

    return (
      <>
        <GallerySegment group={left} />
        <GallerySegment group={center} />
        <GallerySegment group={right} />
      </>
    )
  }


  return (
    <div className="min-h-screen w-screen bg-gray-200">
      <div className="fixed top-4 left-4 z-10 flex items-center gap-4">
        <Link to="/drawings" className="text-blue-500 underline flex items-center">
          <FontAwesomeIcon icon={faArrowLeft} className="mr-1" /> Back to gallery
        </Link>
        <h2 className="page-title text-white">Virtual Room</h2>
      </div>

        <Canvas
          className="w-full h-full"
          style={{ height: "90vh" }}
          camera={{ position: [0, 1.5, -CAMERA_DISTANCE] }}
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
            minDistance={WALL_DISTANCE - CAMERA_DISTANCE}
            maxDistance={WALL_DISTANCE - CAMERA_DISTANCE}
          />
          <ambientLight intensity={0.8} />
          <GalleryScene />
        </Suspense>
      </Canvas>
    </div>
  )
}
