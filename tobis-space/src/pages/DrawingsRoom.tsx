import { Suspense, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { Html, OrbitControls } from '@react-three/drei'
import { DoubleSide, Group, Mesh, TextureLoader } from 'three'
import { Link } from 'react-router-dom'
import drawings from '../files/drawings'

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
  const spacing = ART_SPACING
  const wallDistance = 8
  return (
    <group ref={group}>
      {drawings.map((art, index) => {
        const rand = placements[index]
        const pos: [number, number, number] = [index * spacing, 0, 0]
        let rot: [number, number, number] = [0, 0, rand.rotZ]

        if (rand.surface === 'left') {
          pos[1] = rand.offsetY
          pos[2] = -wallDistance + rand.offsetZ
        } else if (rand.surface === 'right') {
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
  function GalleryScene() {
    const left = useRef<Group | null>(null)
    const center = useRef<Group | null>(null)
    const right = useRef<Group | null>(null)

    const segmentWidth = drawings.length * ART_SPACING

    useFrame(({ camera }) => {
      const offset = Math.floor(camera.position.x / segmentWidth)
      if (left.current && center.current && right.current) {
        left.current.position.x = segmentWidth * (offset - 1)
        center.current.position.x = segmentWidth * offset
        right.current.position.x = segmentWidth * (offset + 1)
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

        <Canvas className="w-full h-full" style={{ height: '90vh' }}   camera={{ position: [0, 1.5, 0.001] }} >
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
            enablePan={false}
            enableZoom={false}
            target={[0, 1.5, 0]}
            minDistance={0.001}
            maxDistance={0.001}
          />
          <ambientLight intensity={0.8} />
          <GalleryScene />
        </Suspense>
      </Canvas>
    </div>
  )
}
