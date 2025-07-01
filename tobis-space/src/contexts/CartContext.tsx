import { createContext, useContext, useState, type ReactNode } from 'react'

export interface CartItem {
  id: string
  name: string
  price: number
  multiple?: boolean
}

interface CartContextValue {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const addItem = (item: CartItem) =>
    setItems((prev) => {
      if (!item.multiple && prev.some((i) => i.id === item.id)) {
        return prev
      }
      return [...prev, item]
    })
  const removeItem = (id: string) =>
    setItems((prev) => prev.filter((i) => i.id !== id))
  const clear = () => setItems([])

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clear }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
