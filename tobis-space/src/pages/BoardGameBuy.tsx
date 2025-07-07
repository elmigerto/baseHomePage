import Button from '../components/Button'
import Card from '../components/Card'
import { useCart } from '../contexts/CartContext'

export default function BoardGameBuy() {
  const { items, addItem, removeItem } = useCart()
  const id = 'boardgame-core'
  const name = "The Dragon's Tweak"
  const price = 49.99
  const inCart = items.some((i) => i.id === id)

  return (
    <div className="space-y-4">
      <h3 className="subpage-title">Buy the Game</h3>
      <Card className="max-w-sm">
        <div className="space-y-2">
          <p className="font-semibold">{name}</p>
          <p>A modular strategy game of summoning dragons.</p>
          <p className="font-bold">{price.toFixed(2)} €</p>
          {inCart ? (
            <Button onClick={() => removeItem(id)} className="bg-red-600 hover:bg-red-700">
              Remove from Cart
            </Button>
          ) : (
            <Button
              onClick={() => addItem({ id, name, price })}
              className="bg-green-600 hover:bg-green-700"
            >
              Add to Cart
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
}
