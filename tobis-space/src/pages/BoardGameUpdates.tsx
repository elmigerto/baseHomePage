import updateInfo from '../files/boardgame/updates/2024-05-01/update.json'
import updateImg from '../files/boardgame/updates/2024-05-01/image.png'

interface Update {
  date: string
  version: string
  title: string
  description: string
  image: string
}

const updates: Update[] = [
  { ...updateInfo, image: updateImg },
].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

export default function BoardGameUpdates() {
  return (
    <div className="space-y-4">
      <h3 className="subpage-title">Game Updates</h3>
      <ul className="space-y-4">
        {updates.map((u) => (
          <li key={u.version} className="border p-4">
            <p className="text-sm text-gray-500">{u.date}</p>
            <h4 className="font-semibold">
              {u.title} ({u.version})
            </h4>
            <img
              src={u.image}
              alt={u.title}
              loading="lazy"
              className="my-2 w-full max-w-xs"
            />
            <p>{u.description}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
