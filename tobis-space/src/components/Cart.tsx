import { useCart } from '../contexts/CartContext'

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
            <button onClick={() => removeItem(item.id)}>X</button>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex justify-between">
        <strong>
          Total {items.reduce((sum, i) => sum + i.price, 0).toFixed(2)} €
        </strong>
        <button onClick={clear} className="ml-2 text-sm text-red-500">
          Clear
        </button>
      </div>
    </div>
  )
}
