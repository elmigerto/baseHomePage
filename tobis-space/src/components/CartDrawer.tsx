import Cart from './Cart'

export default function CartDrawer({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-end z-50">
      <div className="bg-white text-black w-80 h-full p-4 shadow-xl overflow-y-auto">
        <button className="mb-2" onClick={onClose}>
          Close
        </button>
        <Cart />
      </div>
    </div>
  )
}
