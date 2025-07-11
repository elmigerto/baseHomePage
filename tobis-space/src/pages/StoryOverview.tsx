import { Link, useNavigate } from "react-router-dom"
import chapters from "../files/chapters"
import { useTranslation } from "../contexts/LanguageContext"
import coverVeiled from "../files/chapters/images/Cover_Veiled.png"

export default function StoryOverview() {
  const navigate = useNavigate()
  const t = useTranslation()
  const description =
    "Varan, a farm slave boy, is forced to flee after a single mistake. With his newfound freedom, he must survive in a world of dangerous beasts, powerful summoners, ruthless gangs, and shifting loyalties. Will he become a thief—or dare to reach for a place among the feared summoners? In a world where allies betray and enemies change, one wrong step could cost more than just freedom."
  return (
    <div className="space-y-4">
      <h2 className="page-title">The Summoners' Veiled Cards</h2>
      <img
        src={coverVeiled}
        alt="The Summoners' Veiled Cards cover"
        loading="lazy"
        className="w-full max-w-md mx-auto"
      />
      <p>{description}</p>
      <select
        onChange={(e) => navigate(e.target.value)}
        className="border p-2 rounded bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
      >
        <option value="">{t('stories.jump')}</option>
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
