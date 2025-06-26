import { Link, useNavigate } from "react-router-dom"
import chapters from "../chapters"
import { useCart } from "../contexts/CartContext"

export default function StoryLanding() {
  const { addItem } = useCart()
  const navigate = useNavigate()
  const description =
    "Varan, a farm slave boy, is forced to flee after a single mistake. With his newfound freedom, he must survive in a world of dangerous beasts, powerful summoners, ruthless gangs, and shifting loyalties. Will he become a thief—or dare to reach for a place among the feared summoners? In a world where allies betray and enemies change, one wrong step could cost more than just freedom."
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">The Summoners' Veiled Cards</h2>
      <p>{description}</p>
      <nav className="flex flex-wrap gap-2">
        {chapters.map((ch) => (
          <Link key={ch.slug} to={ch.slug} className="text-blue-500 underline">
            {ch.title}
          </Link>
        ))}
      </nav>
      <select
        className="border rounded p-1"
        onChange={(e) => navigate(e.target.value)}
        defaultValue=""
      >
        <option value="" disabled>
          Select Chapter
        </option>
        {chapters.map((ch) => (
          <option key={ch.slug} value={ch.slug}>
            {ch.title}
          </option>
        ))}
      </select>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => addItem({ id: "story", name: "Great Story", price: 4.99 })}
      >
        Add to Cart
      </button>
    </div>
  )
}
