import { useLocation, useNavigate } from 'react-router-dom'
import { useCart, type CartItem } from '../contexts/CartContext'

interface Address {
  name: string
  street: string
  city: string
  zip: string
  country: string
}

interface CheckoutItem {
  id: string
  name: string
  price: number
  quantity: number
}

function groupItems(items: CartItem[]): CheckoutItem[] {
  const map = new Map<string, CheckoutItem>()
  for (const item of items) {
    const found = map.get(item.id)
    if (found) {
      found.quantity += 1
    } else {
      map.set(item.id, { ...item, quantity: 1 })
    }
  }
  return Array.from(map.values())
}

async function checkout(items: CheckoutItem[], address: Address) {
  const res = await fetch('/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items, address }),
  })
  const data = await res.json()
  if (data.url) {
    window.location.href = data.url
  }
}

export default function Payment() {
  const { items, clear } = useCart()
  const navigate = useNavigate()
  const { state } = useLocation() as { state: { address?: Address } }
  const address = state?.address

  if (!address) {
    navigate('/checkout')
    return null
  }

  const grouped = groupItems(items)

  const handlePay = async () => {
    await checkout(grouped, address)
    clear()
  }

  const total = grouped.reduce((s, i) => s + i.price * i.quantity, 0)

  return (
    <div className="mx-auto max-w-md space-y-4">
      <h2 className="page-title">Payment</h2>
      <ul className="space-y-2">
        {grouped.map((item) => (
          <li key={item.id} className="flex justify-between">
            <span>
              {item.name} {item.quantity > 1 && `x${item.quantity}`}
            </span>
            <span>{(item.price * item.quantity).toFixed(2)} €</span>
          </li>
        ))}
      </ul>
      <div className="font-bold">Total {total.toFixed(2)} €</div>
      <button onClick={handlePay} className="btn bg-green-600 hover:bg-green-700">
        Pay Now
      </button>
    </div>
  )
}
