import { useParams } from "react-router-dom"
import chapters from "../chapters"

export default function Chapter() {
  const { chapterSlug } = useParams()
  const chapter = chapters.find((c) => c.slug === chapterSlug)
  if (!chapter) return <div>Chapter not found</div>
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">{chapter.title}</h3>
      {chapter.image && (
        <img src={chapter.image} alt={chapter.title} className="max-w-full" />
      )}
      <pre className="whitespace-pre-wrap">{chapter.content}</pre>
    </div>
  )
}
