import SineBackground from '../components/SineBackground'

export default function Home() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-night to-brand-dark text-white text-center">
      <SineBackground />
      <h1 className="relative z-10 text-4xl sm:text-6xl font-bold">
        Welcome to Tobi's Space
      </h1>
    </section>
  )
}
