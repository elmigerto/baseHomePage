import React from 'react'

export default function BoardGameCommunity() {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">Community Links</h3>
      <ul className="list-disc list-inside">
        <li>
          <a
            href="https://discord.gg/ZF9uQWHt"
            target="_blank"
            rel="noreferrer"
            className="text-blue-500 underline"
          >
            Discord
          </a>
        </li>
        <li>
          <a href="https://www.instagram.com/dragonsboardgames/" target="_blank" rel="noreferrer" className="text-blue-500 underline">Instagram</a>
        </li>
        <li>
          <a href="https://boardgamegeek.com" target="_blank" rel="noreferrer" className="text-blue-500 underline">BoardGameGeek</a>
        </li>
      </ul>
    </div>
  )
}
