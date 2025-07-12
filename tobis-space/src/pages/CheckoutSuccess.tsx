import { useTranslation } from '../contexts/LanguageContext'

export default function CheckoutSuccess() {
  const t = useTranslation()
  return <h2 className="page-title">{t('checkout.success')}</h2>
}
