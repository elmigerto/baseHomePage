import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import CartDrawer from './CartDrawer'

export default function Layout() {
  const [cartOpen, setCartOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <Header openCart={() => setCartOpen(true)} />
      <main className="flex-1 p-4 container mx-auto w-full">
        <Outlet />
      </main>
      <footer className="p-4 border-t border-gray-300 dark:border-gray-700 text-center">
        &copy; 2024 Tobis Space
      </footer>
      {cartOpen && <CartDrawer onClose={() => setCartOpen(false)} />}
    </div>
  )
}
