import { useTranslation } from '../contexts/LanguageContext'

export default function About() {
  const t = useTranslation()
  return (
    <div className="space-y-4">
      <h2 className="page-title">{t('about.title')}</h2>
      <p>{t('about.p1')}</p>
      <p>{t('about.p2')}</p>
      <p>
        {t('about.p3')}{' '}
        <a
          href="https://discord.gg/ZF9uQWHt"
          target="_blank"
          rel="noreferrer"
          className="text-blue-500 underline"
        >
          https://discord.gg/ZF9uQWHt
        </a>
      </p>
    </div>
  )
}
