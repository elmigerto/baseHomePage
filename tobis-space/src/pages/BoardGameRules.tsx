import  { useState } from "react"
import ReactMarkdown from "react-markdown"
import rulesDe from "../files/boardgame/manual/dragon-boardgame-rules.md?raw"
import rulesEn from "../files/boardgame/manual/dragon-boardgame-rules.en.md?raw"

export default function BoardGameRules() {
  const [lang, setLang] = useState<"de" | "en">("de")

  const current = lang === "de" ? rulesDe : rulesEn

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold">Rules</h3>
        <button
          className={`px-2 py-1 text-sm border rounded ${lang === "de" ? "bg-blue-500 text-white" : ""}`}
          onClick={() => setLang("de")}
        >
          DE
        </button>
        <button
          className={`px-2 py-1 text-sm border rounded ${lang === "en" ? "bg-blue-500 text-white" : ""}`}
          onClick={() => setLang("en")}
        >
          EN
        </button>
      </div>
      <article className="prose max-w-none">
        <ReactMarkdown>{current}</ReactMarkdown>
      </article>
    </div>
  )
}
