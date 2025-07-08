import { createContext, useContext, useState, type ReactNode } from 'react'

export interface CartItem {
  id: string
  name: string
  price: number
  multiple?: boolean
  quantity: number
}

interface CartItemInput {
  id: string
  name: string
  price: number
  multiple?: boolean
}

interface CartContextValue {
  items: CartItem[]
  addItem: (item: CartItemInput) => void
  removeItem: (id: string) => void
  decreaseItem: (id: string) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const addItem = (item: CartItemInput) =>
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      if (existing) {
        if (!item.multiple) return prev
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
        )
      }
      return [...prev, { ...item, quantity: 1 }]
    })

  const decreaseItem = (id: string) =>
    setItems((prev) => {
      const existing = prev.find((i) => i.id === id)
      if (!existing) return prev
      if (existing.quantity <= 1) {
        return prev.filter((i) => i.id !== id)
      }
      return prev.map((i) =>
        i.id === id ? { ...i, quantity: i.quantity - 1 } : i,
      )
    })

  const removeItem = (id: string) =>
    setItems((prev) => prev.filter((i) => i.id !== id))

  const clear = () => setItems([])

  return (
    <CartContext.Provider
      value={{ items, addItem, decreaseItem, removeItem, clear }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
