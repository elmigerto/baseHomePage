import { Link, Outlet } from 'react-router-dom'

export default function BoardGame() {

  return (
    <div className="space-y-4">
      <h2 className="text-xl">Board Game</h2>
      <nav className="flex gap-4">
        <Link to="about" className="text-blue-500 underline">
          About
        </Link>
        <Link to="rules" className="text-blue-500 underline">
          Rules
        </Link>
        <Link to="community" className="text-blue-500 underline">
          Community
        </Link>
        <Link to="updates" className="text-blue-500 underline">
          Updates
        </Link>
      </nav>
      <Outlet />
    </div>
  )
}
