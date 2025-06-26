import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBookOpen,
  faDiceD20,
  faHome,
  faPaintBrush,
  faShoppingCart,
  faSun,
  faMoon,
  faUser,
} from '@fortawesome/free-solid-svg-icons'
import { NavLink } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useTheme } from '../contexts/ThemeContext'

export default function Header({
  openCart,
}: {
  openCart: () => void
}) {
  const { items } = useCart()
  const { dark, toggle } = useTheme()
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'text-brand dark:text-brand-light' : 'text-gray-700 dark:text-gray-300'

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-800/80 backdrop-blur border-b shadow-sm">
      <div className="container mx-auto flex justify-between items-center p-4">
        <nav className="flex gap-4 text-sm sm:text-base">
          <NavLink to="/" className={linkClass} end>
            <FontAwesomeIcon icon={faHome} className="mr-1" /> Home
          </NavLink>
          <NavLink to="/boardgame" className={linkClass}>
            <FontAwesomeIcon icon={faDiceD20} className="mr-1" /> Board Game
          </NavLink>
          <NavLink to="/stories" className={linkClass}>
            <FontAwesomeIcon icon={faBookOpen} className="mr-1" /> Stories
          </NavLink>
          <NavLink to="/drawings" className={linkClass}>
            <FontAwesomeIcon icon={faPaintBrush} className="mr-1" /> Drawings
          </NavLink>
          <NavLink to="/about" className={linkClass}>
            <FontAwesomeIcon icon={faUser} className="mr-1" /> About
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
            {items.length}
          </button>
        </div>
      </div>
    </header>
  )
}
