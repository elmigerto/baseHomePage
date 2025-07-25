import { useEffect, useState } from "react"
import { cn } from "../lib/utils"

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



export default function RandomImageStack() {
  const [stacks, setStacks] = useState<CornerStacks>([[], [], [], []])

  useEffect(() => {
    function addImages() {
      setStacks((prev) => {
        const nextStacks = prev.map((stack, index) => {
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
              setStacks(
                (cur) =>
                  cur.map((s, i) =>
                    i === index ? s.filter((it) => it.id !== first.id) : s,
                  ) as CornerStacks,
              )
            }, 1000)
          }
          return next
        }) as CornerStacks

        return nextStacks
      })
    }

    addImages()
    const timer = setInterval(addImages, 3000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 gap-52">
        {stacks.map((stack, index) => (
          <div
            key={index}
            className={cn(
              "relative w-[35vmin] h-[35vmin] max-w-[280px] max-h-[280px]",
              index > 0 && "hidden md:block",
            )}
          >
            {stack.map((img) => (
              <img
                key={img.id}
                src={img.src}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 object-contain transform-gpu max-w-full max-h-full border border-gray-300 dark:border-gray-600 shadow"
                style={{
                  transform: `rotate(${img.angle}deg) scale(${img.leaving ? 0.1 : img.size})`,
                  opacity: img.leaving ? 0 : 1,
                  willChange: "transform, opacity",
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
