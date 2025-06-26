import { Link, Outlet } from "react-router-dom"
import chapters from "../chapters"

export default function Stories() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl">Stories</h2>
      <p>
        Join the discussion on{' '}
        <a
          href="https://discord.gg/ZF9uQWHt"
          target="_blank"
          rel="noreferrer"
          className="text-blue-500 underline"
        >
          Discord
        </a>
        .
      </p>
      <nav className="flex flex-wrap gap-2">
        {chapters.map((ch) => (
          <Link key={ch.slug} to={ch.slug} className="text-blue-500 underline">
            {ch.title}
          </Link>
        ))}
      </nav>
      
      <Outlet />
    </div>
  )
}
