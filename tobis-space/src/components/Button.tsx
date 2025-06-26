import { type ButtonHTMLAttributes } from 'react'

export default function Button({
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`btn transition-transform hover:-translate-y-0.5 ${className}`}
    />
  )
}
