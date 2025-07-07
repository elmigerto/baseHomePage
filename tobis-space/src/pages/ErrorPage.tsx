import { useNavigate } from 'react-router-dom'
import { useTranslation } from '../contexts/LanguageContext'

export default function ErrorPage() {
  const navigate = useNavigate()
  const t = useTranslation()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-4 gap-4">
      <h1 className="text-2xl font-bold">{t('error.title')}</h1>
      <p>{t('error.msg')}</p>
      <div className="flex gap-4">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {t('error.back')}
        </button>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-gray-600 text-white rounded"
        >
          {t('error.home')}
        </button>
      </div>
    </div>
  )
}
