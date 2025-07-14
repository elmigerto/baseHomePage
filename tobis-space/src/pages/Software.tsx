import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import cvGer from '../files/software/personal/cv_ger.pdf'
import { useTranslation } from '../contexts/LanguageContext'

export default function Software() {
  const t = useTranslation()
  return (
    <div className="space-y-4">
      <h2 className="page-title">{t('software.title')}</h2>
      <p>
        {t('software.p1')}
      </p>
      <p>
        <a href={cvGer} target="_blank" rel="noreferrer" className="text-blue-500 underline">
          <FontAwesomeIcon icon={faDownload} className="mr-1" /> {t('software.viewCv')}
        </a>
      </p>
      <p>
        {t('software.linkedIn')}{' '}
        <a
          href="https://www.linkedin.com/in/tobias-elmiger-7b8708125/"
          target="_blank"
          rel="noreferrer"
          className="text-blue-500 underline"
        >
          https://www.linkedin.com/in/tobias-elmiger-7b8708125/
        </a>
      </p>
      <p>
        {t('software.work')}{' '}
        <a href="mailto:elmigerto@gmail.com" className="text-blue-500 underline">
          <FontAwesomeIcon icon={faEnvelope} className="mr-1" /> {t('software.email')}
        </a>
        .
      </p>
    </div>
  )
}
