import { type ReactNode } from 'react'

export default function Card({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`card shadow-md hover:shadow-lg transition-shadow p-4 rounded bg-white dark:bg-gray-800 ${className}`}
    >
      {children}
    </div>
  )
}
