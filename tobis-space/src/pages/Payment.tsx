import { useLocation, useNavigate } from 'react-router-dom'
import { useCart, type CartItem } from '../contexts/CartContext'

interface Address {
  name: string
  street: string
  city: string
  zip: string
  country: string
}

async function checkout(items: CartItem[], address: Address) {
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

  const handlePay = async () => {
    await checkout(items, address)
    clear()
  }

  return (
    <div className="mx-auto max-w-md space-y-4">
      <h2 className="page-title">Payment</h2>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id} className="flex justify-between">
            <span>{item.name}</span>
            <span>{item.price.toFixed(2)} €</span>
          </li>
        ))}
      </ul>
      <div className="font-bold">
        Total {items.reduce((s, i) => s + i.price, 0).toFixed(2)} €
      </div>
      <button onClick={handlePay} className="btn bg-green-600 hover:bg-green-700">
        Pay Now
      </button>
    </div>
  )
}
