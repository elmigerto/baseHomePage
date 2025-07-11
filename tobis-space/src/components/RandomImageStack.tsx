import { useEffect, useState } from 'react'

const chapterImages = Object.values(
  import.meta.glob('../files/chapters/images/*.{png,jpg,jpeg}', {
    eager: true,
    import: 'default',
  }),
) as string[]

const drawingImages = Object.values(
  import.meta.glob('../files/drawings/**/*.{jpg,JPG,jpeg,JPEG,png}', {
    eager: true,
    import: 'default',
  }),
) as string[]

const allImages = [...chapterImages, ...drawingImages]

interface ImgState {
  id: number
  src: string
  angle: number
  size: number
  x: number
  y: number
}

function randomImage() {
  return allImages[Math.floor(Math.random() * allImages.length)]
}

export default function RandomImageStack() {
  const [images, setImages] = useState<ImgState[]>([])

  useEffect(() => {
    function addImage() {
      const angle = (Math.random() - 0.5) * 10
      const size = 0.9 + Math.random() * 0.2
      const rad = Math.random() * 2 * Math.PI
      const distance = 400
      const id = Date.now() + Math.random()
      const img: ImgState = {
        id,
        src: randomImage(),
        angle,
        size,
        x: Math.cos(rad) * distance,
        y: Math.sin(rad) * distance,
      }
      setImages((prev) => {
        const next = [...prev, img]
        if (next.length > 5) next.shift()
        return next
      })
      setTimeout(() => {
        setImages((prev) =>
          prev.map((i) =>
            i.id === id ? { ...i, x: 0, y: 0 } : i,
          ),
        )
      }, 50)
    }

    addImage()
    const timer = setInterval(addImage, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <>
      {images.map((img) => (
        <img
          key={img.id}
          src={img.src}
          className="absolute left-1/2 top-1/2 w-64 h-64 object-contain pointer-events-none transition-transform duration-300"
          style={{
            transform: `translate(-50%, -50%) translate(${img.x}px, ${img.y}px) rotate(${img.angle}deg) scale(${img.size})`,
          }}
        />
      ))}
    </>
  )
}
