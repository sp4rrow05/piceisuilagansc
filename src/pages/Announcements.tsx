import { useEffect, useState } from "react"
import api from "../services/api";

export default function Announcements() {
  const [list, setList] = useState<any[]>([])
  const [selected, setSelected] = useState<any | null>(null)

  useEffect(() => {
    api
      .get("/?module=announcements&action=read")
      .then(res => setList(Array.isArray(res.data) ? res.data : []))
  }, [])

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">

      <h1 className="text-3xl font-bold text-pice-navy">
        Announcements
      </h1>

      <div className="grid md:grid-cols-2 gap-4">
        {list.map(a => (
          <div
            key={a.id}
            onClick={() => setSelected(a)}
            className="card p-4 hover:shadow cursor-pointer transition"
          >
            <h3 className="font-semibold">{a.title}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {a.content}
            </p>
          </div>
        ))}
      </div>

      {selected && (
        <Modal item={selected} onClose={() => setSelected(null)} />
      )}

    </div>
  )
}

function Modal({ item, onClose }: any) {
  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-2xl rounded-lg p-6 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">{item.title}</h2>

          <button onClick={onClose} className="text-xl">×</button>
        </div>

        <div className="whitespace-pre-line">
          {item.content}
        </div>
      </div>
    </div>
  )
}
