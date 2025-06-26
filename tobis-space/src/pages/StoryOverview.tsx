import { Link, useNavigate } from "react-router-dom"
import chapters from "../files/chapters"

export default function StoryOverview() {
  const navigate = useNavigate()
  const description =
    "Varan, a farm slave boy, is forced to flee after a single mistake. With his newfound freedom, he must survive in a world of dangerous beasts, powerful summoners, ruthless gangs, and shifting loyalties. Will he become a thief—or dare to reach for a place among the feared summoners? In a world where allies betray and enemies change, one wrong step could cost more than just freedom."
  return (
    <div className="space-y-4">
      <h2 className="page-title">The Summoners' Veiled Cards</h2>
      <p>{description}</p>
      <select
        onChange={(e) => navigate(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="">Jump to chapter</option>
        {chapters.map((ch) => (
          <option key={ch.slug} value={ch.slug}>
            {ch.title}
          </option>
        ))}
      </select>
      <ul className="space-y-1">
        {chapters.map((ch) => (
          <li key={ch.slug}>
            <Link to={ch.slug} className="text-blue-500 underline block">
              {ch.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
