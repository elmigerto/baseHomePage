import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCreditCard,
  faTrash,
  faXmark,
} from '@fortawesome/free-solid-svg-icons'
import { useCart, type CartItem } from '../contexts/CartContext'

async function checkout(items: CartItem[]) {
  const res = await fetch('/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items }),
  })
  const data = await res.json()
  if (data.url) {
    window.location.href = data.url
  }
}

export default function Cart() {
  const { items, removeItem, clear } = useCart()

  if (items.length === 0) return <p>Your cart is empty.</p>

  return (
    <div className="p-4 border rounded bg-gray-100">
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id} className="flex justify-between">
            <span>{item.name}</span>
            <span>{item.price.toFixed(2)} €</span>
            <button onClick={() => removeItem(item.id)} className="ml-2">
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex flex-col space-y-2">
        <div className="flex justify-between">
          <strong>
            Total {items.reduce((sum, i) => sum + i.price, 0).toFixed(2)} €
          </strong>
          <button onClick={clear} className="ml-2 text-sm text-red-500">
            <FontAwesomeIcon icon={faTrash} className="mr-1" /> Clear
          </button>
        </div>
        <button onClick={() => checkout(items)} className="btn bg-green-600 hover:bg-green-700">
          <FontAwesomeIcon icon={faCreditCard} className="mr-1" /> Buy
        </button>
      </div>
    </div>
  )
}
