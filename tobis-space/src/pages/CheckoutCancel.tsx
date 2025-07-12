import { useTranslation } from '../contexts/LanguageContext'

export default function CheckoutCancel() {
  const t = useTranslation()
  return <h2 className="page-title">{t('checkout.cancel')}</h2>
}
