import { useMemo } from 'react'
import SineBackground from '../components/SineBackground'
import RandomImageStack from '../components/RandomImageStack'

const backgrounds = Object.values(
  import.meta.glob('../files/landing-page/image/*.{png,jpg,jpeg}', {
    eager: true,
    import: 'default',
  }),
) as string[]

export default function Home() {
  const background = useMemo(
    () => backgrounds[Math.floor(Math.random() * backgrounds.length)],
    [],
  )
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden text-white text-center">
      <img
        src={background}
        alt="background"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <SineBackground />
      <RandomImageStack />
    </section>
  )
}
