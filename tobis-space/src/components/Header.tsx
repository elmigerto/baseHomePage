import { NavLink } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'

export default function Header({
  openCart,
}: {
  openCart: () => void
}) {
  const { items } = useCart()
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'text-blue-500' : 'text-gray-700'

  return (
    <header className="p-4 border-b flex justify-between items-center">
      <nav className="space-x-4">
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
      </nav>
      <button onClick={openCart} className="relative" aria-label="Cart">
        Cart ({items.length})
      </button>
    </header>
  )
}
