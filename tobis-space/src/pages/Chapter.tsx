import { Link, useParams } from "react-router-dom"
import { useEffect } from "react"
import chapters from "../files/chapters"

export default function Chapter() {
  const { chapterSlug } = useParams()
  const chapter = chapters.find((c) => c.slug === chapterSlug)
  if (!chapter) return <div>Chapter not found</div>
  const index = chapters.findIndex((c) => c.slug === chapterSlug)
  const prev = index > 0 ? chapters[index - 1] : undefined
  const next = index < chapters.length - 1 ? chapters[index + 1] : undefined
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [chapterSlug])
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">{chapter.title}</h3>
      {chapter.image && (
        <img
          src={chapter.image}
          alt={chapter.title}
          className="w-full max-w-md mx-auto"
        />
      )}
      <pre className="whitespace-pre-wrap">{chapter.content}</pre>
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
    </div>
  )
}
