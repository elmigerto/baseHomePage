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
            Home
          </NavLink>
          <NavLink to="/boardgame" className={linkClass}>
            Board Game
          </NavLink>
          <NavLink to="/stories" className={linkClass}>
            Stories
          </NavLink>
          <NavLink to="/drawings" className={linkClass}>
            Drawings
          </NavLink>
          <NavLink to="/about" className={linkClass}>
            About
          </NavLink>
        </nav>
        <div className="flex items-center gap-4">
          <button onClick={toggle} aria-label="Toggle theme" className="p-1 rounded transition-colors hover:bg-gray-200 dark:hover:bg-gray-700">
            {dark ? '☀️' : '🌙'}
          </button>
          <button onClick={openCart} className="relative" aria-label="Cart">
            Cart ({items.length})
          </button>
        </div>
      </div>
    </header>
  )
}
