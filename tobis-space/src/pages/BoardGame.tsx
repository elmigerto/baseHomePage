import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { useTranslation } from "../contexts/LanguageContext"
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs"

export default function BoardGame() {
  const t = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()

  const last = location.pathname.split("/").pop() ?? "about"
  const value = last === "boardgame" ? "about" : last

  return (
    <div className="space-y-4">
      <h2 className="page-title">{t("boardgame.title")}</h2>
      <Tabs value={value} onValueChange={(v) => navigate(v)} className="w-full">
        <TabsList className="bg-transparent">
          <TabsTrigger value="about" variant="underline">
            {t("boardgame.about")}
          </TabsTrigger>
          <TabsTrigger value="rules" variant="underline">
            {t("boardgame.rules")}
          </TabsTrigger>
          <TabsTrigger value="community" variant="underline">
            {t("boardgame.community")}
          </TabsTrigger>
          <TabsTrigger value="updates" variant="underline">
            {t("boardgame.updates")}
          </TabsTrigger>
          <TabsTrigger value="buy" variant="underline">
            Buy
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <Outlet />
    </div>
  )
}
