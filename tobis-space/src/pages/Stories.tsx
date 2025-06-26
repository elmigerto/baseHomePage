import { Link, Outlet, useLocation, useParams } from "react-router-dom"
import chapters from "../files/chapters"

export default function Stories() {
  const location = useLocation()
  const { chapterSlug } = useParams()
  const detailTarget = chapterSlug ?? chapters[0].slug
  const isOverview = location.pathname === "/stories" || location.pathname === "/stories/"
  const tabClass = (active: boolean) =>
    active ? "border-b-2 border-blue-500" : "text-blue-500"
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
      <nav className="flex gap-4 border-b">
        <Link to="." className={tabClass(isOverview)}>
          Overview
        </Link>
        <Link to={detailTarget} className={tabClass(!isOverview)}>
          Detail
        </Link>
      </nav>

      <Outlet />
    </div>
  )
}
