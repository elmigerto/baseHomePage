import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import CartDrawer from './CartDrawer'

export default function Layout() {
  const [cartOpen, setCartOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      <Header openCart={() => setCartOpen(true)} />
      <main className="flex-1 p-4">
        <Outlet />
      </main>
      <footer className="p-4 border-t text-center">&copy; 2024 Tobis Space</footer>
      {cartOpen && <CartDrawer onClose={() => setCartOpen(false)} />}
    </div>
  )
}
