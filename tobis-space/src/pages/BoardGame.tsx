import { Link, Outlet } from 'react-router-dom'
import { useTranslation } from '../contexts/LanguageContext'

export default function BoardGame() {
  const t = useTranslation()
  return (
    <div className="space-y-4">
      <h2 className="page-title">{t('boardgame.title')}</h2>
      <nav className="flex gap-4">
        <Link to="about" className="text-blue-500 underline">
          {t('boardgame.about')}
        </Link>
        <Link to="rules" className="text-blue-500 underline">
          {t('boardgame.rules')}
        </Link>
        <Link to="community" className="text-blue-500 underline">
          {t('boardgame.community')}
        </Link>
        <Link to="updates" className="text-blue-500 underline">
          {t('boardgame.updates')}

        </Link>
        <Link to="buy" className="text-blue-500 underline">
          Buy
        </Link>
      </nav>
      <Outlet />
    </div>
  )
}
