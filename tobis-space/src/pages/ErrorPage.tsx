import { useNavigate } from 'react-router-dom'

export default function ErrorPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-4 gap-4">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p>We encountered an unexpected error.</p>
      <div className="flex gap-4">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Go Back
        </button>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-gray-600 text-white rounded"
        >
          Home
        </button>
      </div>
    </div>
  )
}
