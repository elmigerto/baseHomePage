import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCreditCard,
  faTrash,
  faXmark,
} from '@fortawesome/free-solid-svg-icons'
import { useCart } from '../contexts/CartContext'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from '../contexts/LanguageContext'


export default function Cart() {
  const { items, removeItem, clear } = useCart()
  const navigate = useNavigate()
  const t = useTranslation()

  if (items.length === 0) return <p>{t('cart.empty')}</p>

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
            {t('cart.total')} {items.reduce((sum, i) => sum + i.price, 0).toFixed(2)} €
          </strong>
          <button onClick={clear} className="ml-2 text-sm text-red-500">
            <FontAwesomeIcon icon={faTrash} className="mr-1" /> {t('cart.clear')}
          </button>
        </div>
        <button
          onClick={() => navigate('/checkout')}
          className="btn bg-green-600 hover:bg-green-700"
        >
          <FontAwesomeIcon icon={faCreditCard} className="mr-1" /> {t('cart.buy')}
        </button>
      </div>
    </div>
  )
}
