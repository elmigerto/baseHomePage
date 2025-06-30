import { Suspense, useRef } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { Canvas, useLoader } from "@react-three/fiber"
import { Html, OrbitControls } from "@react-three/drei"
import { DoubleSide, Mesh, TextureLoader, RepeatWrapping } from "three"
import { Link } from 'react-router-dom'
import drawings from "../files/drawings"
import wallImg from "../assets/drawings/wall.png"

const ROOM_RADIUS = 8
const WALL_HEIGHT = 5

const angleStep = (Math.PI * 2) / drawings.length
const placements = drawings.map((_, i) => ({
  angle: i * angleStep,
  offsetY: Math.random() * 2 - 1,
  width: 2 + Math.random() * 2,
  height: 2 + Math.random() * 2,
}))

const CAMERA_DISTANCE = ROOM_RADIUS - 3

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

function GalleryScene() {
  const textures = useLoader(TextureLoader, drawings.map((d) => d.image))
  const wallTexture = useLoader(TextureLoader, wallImg)

  wallTexture.wrapS = RepeatWrapping
  wallTexture.wrapT = RepeatWrapping
  wallTexture.repeat.set(8, 2)

  return (
    <group>
      <mesh>
        <cylinderGeometry args={[ROOM_RADIUS, ROOM_RADIUS, WALL_HEIGHT, 64, 1, true]} />
        <meshBasicMaterial map={wallTexture} side={DoubleSide} />
      </mesh>
      {drawings.map((art, index) => {
        const rand = placements[index]
        const angle = rand.angle
        const x = Math.cos(angle) * ROOM_RADIUS
        const z = Math.sin(angle) * ROOM_RADIUS

        return (
          <ArtPlane
            key={art.id}
            position={[x, rand.offsetY, z]}
            rotation={[0, -angle, 0]}
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
  const controlsRef = useRef<any>(null)

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
          <GalleryScene />
        </Suspense>
      </Canvas>
    </div>
  )
}
