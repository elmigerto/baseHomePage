import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBookOpen,
  faDiceD20,
  faHome,
  faPaintBrush,
  faCode,
  faShoppingCart,
  faSun,
  faMoon,
  faUser,
} from '@fortawesome/free-solid-svg-icons'
import { NavLink } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useTheme } from '../contexts/ThemeContext'
import { useLanguage, useTranslation } from '../contexts/LanguageContext'

export default function Header({
  openCart,
}: {
  openCart: () => void
}) {
  const { items } = useCart()
  const { dark, toggle } = useTheme()
  const { lang, setLang } = useLanguage()
  const t = useTranslation()
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'text-brand-neon' : 'text-gray-700 dark:text-gray-300'

  return (
    <header className="sticky top-0 z-40 bg-gray-100/90 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 backdrop-blur border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="container mx-auto flex justify-between items-center p-4">
        <nav className="flex gap-4 text-sm sm:text-base">
          <NavLink to="/" className={linkClass} end>
            <FontAwesomeIcon icon={faHome} className="mr-1" /> {t('nav.home')}
          </NavLink>
          <NavLink to="/boardgame" className={linkClass}>
            <FontAwesomeIcon icon={faDiceD20} className="mr-1" /> {t('nav.boardgame')}
          </NavLink>
          <NavLink to="/stories" className={linkClass}>
            <FontAwesomeIcon icon={faBookOpen} className="mr-1" /> {t('nav.stories')}
          </NavLink>
          <NavLink to="/drawings" className={linkClass}>
            <FontAwesomeIcon icon={faPaintBrush} className="mr-1" /> {t('nav.drawings')}
          </NavLink>
          <NavLink to="/software" className={linkClass}>
            <FontAwesomeIcon icon={faCode} className="mr-1" /> {t('nav.software')}
          </NavLink>
          <NavLink to="/about" className={linkClass}>
            <FontAwesomeIcon icon={faUser} className="mr-1" /> {t('nav.about')}
          </NavLink>
        </nav>
        <div className="flex items-center gap-4">
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="p-1 rounded transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {dark ? (
              <FontAwesomeIcon icon={faSun} />
            ) : (
              <FontAwesomeIcon icon={faMoon} />
            )}
          </button>
          <button onClick={openCart} className="relative" aria-label="Cart">
            <FontAwesomeIcon icon={faShoppingCart} className="mr-1" />
            {items.reduce((n, i) => n + i.quantity, 0)}
          </button>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as any)}
            className="rounded border bg-white p-1 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="en">EN</option>
            <option value="de">DE</option>
          </select>
        </div>
      </div>
    </header>
  )
}
