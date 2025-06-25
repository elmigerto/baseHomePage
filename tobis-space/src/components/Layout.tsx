import { Outlet } from 'react-router-dom'
import Header from './Header'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-4">
        <Outlet />
      </main>
      <footer className="p-4 border-t text-center">&copy; 2024 Tobis Space</footer>
    </div>
  )
}
