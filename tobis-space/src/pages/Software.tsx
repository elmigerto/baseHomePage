import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import cvGer from '../files/software/personal/cv_ger.pdf'

export default function Software() {
  return (
    <div className="space-y-4">
      <h2 className="page-title">Software Development</h2>
      <p>
        I build web applications using TypeScript, React, and Node.js. My
        engineering background helps me approach problems analytically while my
        creativity drives user-focused solutions.
      </p>
      <p>
        <a href={cvGer} target="_blank" rel="noreferrer" className="text-blue-500 underline">
          <FontAwesomeIcon icon={faDownload} className="mr-1" /> View my CV
        </a>
      </p>
      <p>
        LinkedIn:{' '}
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
        Interested in working together? Book me via{' '}
        <a href="mailto:elmigerto@gmail.com" className="text-blue-500 underline">
          <FontAwesomeIcon icon={faEnvelope} className="mr-1" /> email
        </a>
        .
      </p>
    </div>
  )
}
