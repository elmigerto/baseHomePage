import { Link, Outlet, useLocation, useParams } from "react-router-dom"
import chapters from "../files/chapters"
import { useTranslation } from "../contexts/LanguageContext"
import ScrollingImage from "../components/ScrollingImage"

const storyImages = Object.values(
  import.meta.glob("../files/chapters/images/*.{png,jpg,jpeg,JPG,JPEG}", {
    eager: true,
    import: "default",
  }),
) as string[]

export default function Stories() {
  const location = useLocation()
  const { chapterSlug } = useParams()
  const detailTarget = chapterSlug ?? chapters[0].slug
  const isOverview = location.pathname === "/stories" || location.pathname === "/stories/"
  const t = useTranslation()
  const tabClass = (active: boolean) =>
    active ? "border-b-2 border-blue-500" : "text-blue-500"
  return (
    <div className="space-y-4">
      <h2 className="page-title">{t('stories.title')}</h2>
      <p>
        {t('stories.join')} {' '}
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
          {t('stories.overview')}
        </Link>
        <Link to={detailTarget} className={tabClass(!isOverview)}>
          {t('stories.detail')}
        </Link>
      </nav>

      <Outlet />
      <ScrollingImage
        key={isOverview ? 'overview' : detailTarget}
        images={storyImages}
      />
    </div>
  )
}
