import { useState } from 'react'
import type { Drawing } from '../files/drawings'
import ImageModal from '../components/ImageModal'

export default function useDrawingModal() {
  const [selected, setSelected] = useState<Drawing | null>(null)
  const modal =
    selected !== null ? (
      <ImageModal art={selected} onClose={() => setSelected(null)} />
    ) : null
  return {
    open: setSelected,
    modal,
  }
}

