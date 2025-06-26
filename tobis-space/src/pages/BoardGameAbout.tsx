import ReactMarkdown from 'react-markdown'
import summary from '../files/boardgame/general/summary.md?raw'

export default function BoardGameAbout() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">About the Game</h3>
      <article className="prose max-w-none dark:prose-invert">
        <ReactMarkdown>{summary}</ReactMarkdown>
      </article>
    </div>
  )
}
