import { Link, useNavigate, useParams } from "react-router-dom"
import { useEffect } from "react"
import ReactMarkdown from "react-markdown"
import chapters from "../files/chapters"

export default function Chapter() {
  const { chapterSlug } = useParams()
  const navigate = useNavigate()
  const chapter = chapters.find((c) => c.slug === chapterSlug)
  if (!chapter) return <div>Chapter not found</div>
  const index = chapters.findIndex((c) => c.slug === chapterSlug)
  const prev = index > 0 ? chapters[index - 1] : undefined
  const next = index < chapters.length - 1 ? chapters[index + 1] : undefined
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [chapterSlug])
  const navigation = (
    <div className="flex justify-between">
      {prev && (
        <Link to={`../${prev.slug}`} className="text-blue-500 underline">
          ← {prev.title}
        </Link>
      )}
      {next && (
        <Link to={`../${next.slug}`} className="ml-auto text-blue-500 underline">
          {next.title} →
        </Link>
      )}
    </div>
  )
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">{chapter.title}</h3>
      {navigation}
      <select
        value={chapter.slug}
        onChange={(e) => navigate(`../${e.target.value}`)}
        className="border p-2 rounded"
      >
        {chapters.map((ch) => (
          <option key={ch.slug} value={ch.slug}>
            {ch.title}
          </option>
        ))}
      </select>
      {chapter.image && (
        <img
          src={chapter.image}
          alt={chapter.title}
          className="w-full max-w-md mx-auto"
        />
      )}
      <article className="prose max-w-none dark:prose-invert">
        <ReactMarkdown>{chapter.content}</ReactMarkdown>
      </article>
      {navigation}
    </div>
  )
}
