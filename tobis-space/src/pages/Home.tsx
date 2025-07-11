import SineBackground from '../components/SineBackground'
import RandomImageStack from '../components/RandomImageStack'
import { useTranslation } from '../contexts/LanguageContext'

export default function Home() {
  const t = useTranslation()
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-night to-brand-dark text-white text-center">
      <SineBackground />
      <RandomImageStack />
      <h1 className="relative z-10 text-4xl sm:text-6xl font-bold">
        {t('home.title')}
      </h1>
    </section>
  )
}
