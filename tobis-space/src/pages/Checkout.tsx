import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useTranslation } from '../contexts/LanguageContext'


interface Address {
  name: string
  street: string
  city: string
  zip: string
  country: string
}

export default function Checkout() {
  const { items } = useCart()
  const navigate = useNavigate()
  const t = useTranslation()
  const [address, setAddress] = useState<Address>({
    name: '',
    street: '',
    city: '',
    zip: '',
    country: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof Address, string>>>({})

  if (items.length === 0) return <p>{t('checkout.empty')}</p>

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setAddress((a) => ({ ...a, [name]: value }))
  }

  const validate = () => {
    const errs: Partial<Record<keyof Address, string>> = {}
    if (!address.name.trim()) errs.name = t('checkout.errors.name')
    if (!address.street.trim()) errs.street = t('checkout.errors.street')
    if (!address.city.trim()) errs.city = t('checkout.errors.city')
    if (!/^\d{4,}$/.test(address.zip.trim())) errs.zip = t('checkout.errors.zip')
    if (!address.country) errs.country = t('checkout.errors.country')
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      navigate('/payment', { state: { address } })
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex max-w-md flex-col space-y-4"
    >
      <h2 className="page-title">{t('checkout.title')}</h2>
      <input
        required
        name="name"
        placeholder={t('checkout.name')}
        value={address.name}
        onChange={handleChange}
        className="rounded border p-2 text-black"
      />
      {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      <input
        required
        name="street"
        placeholder={t('checkout.street')}
        value={address.street}
        onChange={handleChange}
        className="rounded border p-2 text-black"
      />
      {errors.street && <p className="text-sm text-red-500">{errors.street}</p>}
      <input
        required
        name="city"
        placeholder={t('checkout.city')}
        value={address.city}
        onChange={handleChange}
        className="rounded border p-2 text-black"
      />
      {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
      <input
        required
        name="zip"
        placeholder={t('checkout.zip')}
        value={address.zip}
        onChange={handleChange}
        className="rounded border p-2 text-black"
      />
      {errors.zip && <p className="text-sm text-red-500">{errors.zip}</p>}
      <select
        required
        name="country"
        value={address.country}
        onChange={handleChange}
        className="rounded border p-2 text-black"
      >
        <option value="">{t('checkout.country')}</option>
        <option value="Germany">Germany</option>
        <option value="United States">United States</option>
        <option value="United Kingdom">United Kingdom</option>
        <option value="Canada">Canada</option>
        <option value="Australia">Australia</option>
      </select>
      {errors.country && <p className="text-sm text-red-500">{errors.country}</p>}
      <button type="submit" className="btn bg-green-600 hover:bg-green-700">
        {t('checkout.continue')}
      </button>
    </form>
  )
}
