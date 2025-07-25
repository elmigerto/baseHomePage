import ReactMarkdown from 'react-markdown'
import summary from '../files/boardgame/general/summary.md?raw'
import { useTranslation } from '../contexts/LanguageContext'

export default function BoardGameAbout() {
  const t = useTranslation()
  return (
    <div className="space-y-4">
      <h3 className="subpage-title">{t('boardgame.about')}</h3>
      <article className="prose max-w-none dark:prose-invert">
        <ReactMarkdown>{summary}</ReactMarkdown>
      </article>
    </div>
  )
}
