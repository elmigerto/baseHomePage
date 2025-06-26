import { type ReactNode } from 'react'

export default function Card({ children }: { children: ReactNode }) {
  return (
    <div className="card shadow-md hover:shadow-lg transition-shadow p-4 rounded bg-white dark:bg-gray-800">
      {children}
    </div>
  )
}
