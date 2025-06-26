import Cart from './Cart'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

export default function CartDrawer({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-end z-50">
      <div className="bg-white text-black dark:bg-gray-800 dark:text-white h-full w-full max-w-xs sm:w-80 p-4 shadow-xl overflow-y-auto transition-transform">
        <button
          className="mb-2 btn bg-gray-300 text-black hover:bg-gray-400"
          onClick={onClose}
        >
          <FontAwesomeIcon icon={faXmark} className="mr-1" /> Close
        </button>
        <Cart />
      </div>
    </div>
  )
}
