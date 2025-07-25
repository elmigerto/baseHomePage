import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useTranslation } from '../contexts/LanguageContext'


interface Address {
  salutation: string
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
    salutation: '',
    name: '',
    street: '',
    city: '',
    zip: '',
    country: '',
  })
  const [countries, setCountries] = useState<string[]>([])
  const [errors, setErrors] = useState<Partial<Record<keyof Address, string>>>({})

  if (items.length === 0) return <p>{t('checkout.empty')}</p>

  useEffect(() => {
    fetch('/countries')
      .then((r) => r.json())
      .then((data) => setCountries(data))
      .catch(() =>
        setCountries([
          'Germany',
          'United States',
          'United Kingdom',
          'Canada',
          'Australia',
          'France',
          'Italy',
          'Spain',
          'Switzerland',
          'Austria',
        ])
      )
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setAddress((a) => ({ ...a, [name]: value }))
  }

  const validate = () => {
    const errs: Partial<Record<keyof Address, string>> = {}
    if (!address.salutation) errs.salutation = t('checkout.errors.salutation')
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
      <select
        required
        name="salutation"
        value={address.salutation}
        onChange={handleChange}
        className="rounded border p-2 text-black"
      >
        <option value="">{t('checkout.salutation')}</option>
        <option value="mr">{t('checkout.mr')}</option>
        <option value="ms">{t('checkout.ms')}</option>
      </select>
      {errors.salutation && (
        <p className="text-sm text-red-500">{errors.salutation}</p>
      )}
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
      <div className="flex gap-2">
        <input
          required
          name="city"
          placeholder={t('checkout.city')}
          value={address.city}
          onChange={handleChange}
          className="w-1/2 rounded border p-2 text-black"
        />
        <input
          required
          name="zip"
          placeholder={t('checkout.zip')}
          value={address.zip}
          onChange={handleChange}
          className="w-1/2 rounded border p-2 text-black"
        />
      </div>
      {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
      {errors.zip && <p className="text-sm text-red-500">{errors.zip}</p>}
      <select
        required
        name="country"
        value={address.country}
        onChange={handleChange}
        className="rounded border p-2 text-black"
      >
        <option value="">{t('checkout.country')}</option>
        {countries.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      {errors.country && <p className="text-sm text-red-500">{errors.country}</p>}
      <button type="submit" className="btn bg-green-600 hover:bg-green-700">
        {t('checkout.continue')}
      </button>
    </form>
  )
}
