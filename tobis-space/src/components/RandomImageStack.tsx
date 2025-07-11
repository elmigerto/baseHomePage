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
  leaving?: boolean
}

type CornerStacks = [ImgState[], ImgState[], ImgState[], ImgState[]]

function randomImage() {
  return allImages[Math.floor(Math.random() * allImages.length)]
}

function cornerClass(corner: number) {
  switch (corner) {
    case 0:
      return "top-0 left-0"
    case 1:
      return "top-0 right-0"
    case 2:
      return "bottom-0 left-0"
    default:
      return "bottom-0 right-0"
  }
}

export default function RandomImageStack() {
  const [stacks, setStacks] = useState<CornerStacks>([[], [], [], []])

  useEffect(() => {
    function addImages() {
      setStacks((prev) =>
        prev.map((stack, index) => {
          const id = Date.now() + Math.random()
          const img: ImgState = {
            id,
            src: randomImage(),
            angle: (Math.random() - 0.5) * 10,
            size: 0.9 + Math.random() * 0.2,
          }
          const next = [...stack, img]
          if (next.length > 5) {
            const first = next[0]
            next[0] = { ...first, leaving: true }
            setTimeout(() => {
              setStacks((cur) =>
                cur.map((s, i) =>
                  i === index ? s.filter((it) => it.id !== first.id) : s,
                ),
              )
            }, 1000)
          }
          return next
        }),
      )
    }

    addImages()
    const timer = setInterval(addImages, 3000)
    return () => clearInterval(timer)
  }, [])

  return (
    <>
      {stacks.map((stack, index) =>
        stack.map((img) => (
          <img
            key={img.id}
            src={img.src}
            className={`absolute pointer-events-none transition-all duration-1000 w-[50vmin] h-[50vmin] max-w-[400px] max-h-[400px] object-contain transform-gpu ${cornerClass(index)}`}
            style={{
              transform: `rotate(${img.angle}deg) scale(${img.leaving ? 0.1 : img.size})`,
              opacity: img.leaving ? 0 : 1,
              willChange: 'transform, opacity',
            }}
          />
        )),
      )}
    </>
  )
}
