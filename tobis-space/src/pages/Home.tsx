import { useEffect, useState } from 'react'
import RandomImageStack from '../components/RandomImageStack'

const backgrounds = Object.values(
  import.meta.glob('../files/landing-page/image/*.{png,jpg,jpeg}', {
    eager: true,
    import: 'default',
  }),
) as string[]

export default function Home() {
  const [index, setIndex] = useState(() =>
    Math.floor(Math.random() * backgrounds.length),
  )
  const [fade, setFade] = useState(false)

  useEffect(() => {
    let startTimer: number
    let fadeTimer: number
    function cycle() {
      startTimer = window.setTimeout(() => {
        setFade(true)
        fadeTimer = window.setTimeout(() => {
          setIndex((i) => (i + 1) % backgrounds.length)
          setFade(false)
          cycle()
        }, 100_000)
      }, 5_000)
    }
    cycle()
    return () => {
      clearTimeout(startTimer)
      clearTimeout(fadeTimer)
    }
  }, [])

  const next = (index + 1) % backgrounds.length
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden text-white text-center">
      <img
        src={backgrounds[index]}
        alt="background"
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[100000ms] ${fade ? 'opacity-0' : 'opacity-100'} animate-[spin_120s_linear_infinite]`}
      />
      <img
        src={backgrounds[next]}
        alt="background"
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[100000ms] ${fade ? 'opacity-100' : 'opacity-0'} animate-[spin_120s_linear_infinite]`}
      />
      <RandomImageStack />
    </section>
  )
}
