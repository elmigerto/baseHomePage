import React from "react"
import rulesText from "../boardgame/manual/dragon-boardgame-rules.md?raw"

export default function BoardGameRules() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Rules</h3>
      <pre className="whitespace-pre-wrap">{rulesText}</pre>
    </div>
  )
}
