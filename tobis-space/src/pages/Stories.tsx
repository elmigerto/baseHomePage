import { Outlet } from "react-router-dom"

export default function Stories() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl">Stories</h2>
      <p>
        Join the discussion on{' '}
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
      <nav className="flex flex-wrap gap-2">
        {chapters.map((ch) => (
          <Link key={ch.slug} to={ch.slug} className="text-blue-500 underline">
            {ch.title}
          </Link>
        ))}
      </nav>
      <select
        className="border rounded p-1"
        onChange={(e) => navigate(e.target.value)}
        defaultValue=""
      >
        <option value="" disabled>
          Select Chapter
        </option>
        {chapters.map((ch) => (
          <option key={ch.slug} value={ch.slug}>
            {ch.title}
          </option>
        ))}
      </select>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => addItem({ id: 'story', name: 'Great Story', price: 4.99 })}
      >
        Add to Cart
      </button>
      <Outlet />
    </div>
  )
}
