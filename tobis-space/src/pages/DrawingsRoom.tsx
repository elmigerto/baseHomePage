import { Suspense, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { Html, MapControls } from '@react-three/drei'
import { DoubleSide, Group, TextureLoader } from 'three'
import { Link } from 'react-router-dom'
import drawings from '../files/drawings'

const placements = drawings.map(() => ({
  offsetY: (Math.random() - 0.5) * 0.5,
  offsetZ: (Math.random() - 0.5) * 0.2,
  rotZ: (Math.random() - 0.5) * 0.2,
}))

function GallerySegment({ group }: { group: React.MutableRefObject<Group | null> }) {
  const textures = useLoader(TextureLoader, drawings.map((d) => d.image))
  const spacing = 6
  return (
    <group ref={group}>
      {drawings.map((art, index) => {
        const rand = placements[index]
        return (
          <>
            <mesh
              key={`${art.id}-left`}
              position={[index * spacing, rand.offsetY, -5 + rand.offsetZ]}
              rotation={[0, Math.PI / 2, rand.rotZ]}
            >
              <planeGeometry args={[3, 3]} />
              <meshBasicMaterial map={textures[index]} side={DoubleSide} />
            </mesh>
            <mesh
              key={`${art.id}-right`}
              position={[index * spacing, rand.offsetY, 5 + rand.offsetZ]}
              rotation={[0, -Math.PI / 2, -rand.rotZ]}
            >
              <planeGeometry args={[3, 3]} />
              <meshBasicMaterial map={textures[index]} side={DoubleSide} />
            </mesh>
            <mesh
              key={`${art.id}-ceiling`}
              position={[index * spacing, 5 + rand.offsetY, rand.offsetZ]}
              rotation={[Math.PI / 2, 0, rand.rotZ]}
            >
              <planeGeometry args={[3, 3]} />
              <meshBasicMaterial map={textures[index]} side={DoubleSide} />
            </mesh>
          </>
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

    const segmentWidth = drawings.length * 6

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
    <div className="min-h-screen">
      <div className="mb-2 flex items-center gap-4">
        <Link to="/drawings" className="text-blue-500 underline flex items-center">
          <FontAwesomeIcon icon={faArrowLeft} className="mr-1" /> Back to gallery
        </Link>
        <h2 className="text-xl font-bold">Virtual Room</h2>
      </div>
      <Canvas className="w-full h-[calc(100vh-6rem)]">
        <Suspense
          fallback={
            <Html center>
              <FontAwesomeIcon icon={faSpinner} spin size="2x" />
            </Html>
          }
        >
          <MapControls enableDamping />
          <ambientLight intensity={0.8} />
          <GalleryScene />
        </Suspense>
      </Canvas>
    </div>
  )
}
