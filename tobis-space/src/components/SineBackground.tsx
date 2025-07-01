import type { SVGProps } from "react"

export default function SineBackground(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 1440 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 h-full w-full text-brand-dark"
      {...props}
    >
      <path
        d="M0 160c48-32 96-64 144-64s96 32 144 48 96 16 144-16 96-96 144-96 96 64 144 96 96 32 144 16 96-48 144-48 96 32 144 48v224H0Z"
        fill="currentColor"
        fillOpacity="0.15"
      />
    </svg>
  )
}
