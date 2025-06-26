import { NavLink } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useEffect, useState } from 'react'

export default function Header({
  openCart,
}: {
  openCart: () => void
}) {
  const { items } = useCart()
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    if (dark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [dark])
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'text-blue-500' : 'text-gray-700'

  return (
    <header className="p-4 border-b">
      <div className="container mx-auto flex justify-between items-center">
        <nav className="flex gap-4">
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
        <div className="flex items-center gap-4">
          <button onClick={() => setDark(!dark)} className="px-2 py-1 border rounded">
            {dark ? 'Light' : 'Dark'} Mode
          </button>
          <button onClick={openCart} className="relative" aria-label="Cart">
            Cart ({items.length})
          </button>
        </div>
      </div>
    </header>
  )
}
