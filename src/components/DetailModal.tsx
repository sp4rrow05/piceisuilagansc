type Props = {
  open: boolean
  onClose: () => void
  title: string
  image?: string
  content: string
}

export default function DetailModal({
  open,
  onClose,
  title,
  image,
  content
}: Props) {

  if (!open) return null

  return (
    <div
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-3xl rounded-xl shadow-xl overflow-hidden animate-[modalIn_0.25s_ease-out]"
        onClick={e => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">{title}</h2>

          <button
            onClick={onClose}
            className="text-2xl font-bold text-gray-500 hover:text-black"
          >
            ×
          </button>
        </div>

        {/* BODY */}
        <div className="max-h-[70vh] overflow-y-auto p-5 space-y-4">

          {image && (
            <img
              src={image}
              className="w-full max-h-[350px] object-cover rounded"
            />
          )}

          <div className="whitespace-pre-line text-gray-700 leading-relaxed">
            {content}
          </div>

        </div>

        {/* FOOTER */}
        <div className="p-3 border-t flex justify-end">
          <button onClick={onClose} className="btn-secondary">
            Close
          </button>
        </div>

      </div>
    </div>
  )
}
