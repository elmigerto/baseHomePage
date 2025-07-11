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

const boardgameImages = Object.values(
  import.meta.glob('../files/boardgame/images/**/*.{jpg,JPG,jpeg,JPEG,png}', {
    eager: true,
    import: 'default',
  }),
) as string[]

const allImages = [...chapterImages, ...drawingImages, ...boardgameImages]

interface ImgState {
  id: number
  src: string
  angle: number
  size: number
  x: number
  y: number
  leaving?: boolean
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
      const distance = 400
      const id = Date.now() + Math.random()

      const side = Math.floor(Math.random() * 4)
      const offset = (Math.random() - 0.5) * distance * 2
      let x = 0
      let y = 0
      switch (side) {
        case 0:
          x = -distance
          y = offset
          break
        case 1:
          x = distance
          y = offset
          break
        case 2:
          x = offset
          y = -distance
          break
        default:
          x = offset
          y = distance
      }

      const img: ImgState = {
        id,
        src: randomImage(),
        angle,
        size,
        x,
        y,
      }

      setImages((prev) => {
        const next = [...prev, img]
        if (next.length > 5) {
          const first = next[0]
          next[0] = { ...first, leaving: true }
          setTimeout(() => {
            setImages((cur) => cur.filter((i) => i.id !== first.id))
          }, 1000)
        }
        return next
      })

      requestAnimationFrame(() => {
        setImages((prev) =>
          prev.map((i) => (i.id === id ? { ...i, x: 0, y: 0 } : i)),
        )
      })
    }

    addImage()
    const timer = setInterval(addImage, 3000)
    return () => clearInterval(timer)
  }, [])

  return (
    <>
      {images.map((img) => (
        <img
          key={img.id}
          src={img.src}
          className="absolute left-1/2 top-1/2 pointer-events-none transition-all duration-1000 w-[50vmin] h-[50vmin] max-w-[400px] max-h-[400px] object-contain transform-gpu"
          style={{
            transform: `translate(-50%, -50%) translate(${img.x}px, ${img.y}px) rotate(${img.angle}deg) scale(${img.leaving ? 0.1 : img.size})`,
            opacity: img.leaving ? 0 : 1,
            willChange: 'transform, opacity',
          }}
        />
      ))}
    </>
  )
}
