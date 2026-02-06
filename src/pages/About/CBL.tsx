import { useEffect, useState } from "react"
import api from "../../services/api";
import { UPLOADS_URL } from "../../services/api";

type CBL = {
  id: number | null
  file: string | null
  updated_at?: string
}

export default function CBL() {
  const [data, setData] = useState<CBL | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(
          "/?module=cbl&action=read"
        )

        setData(res.data)
      } catch {
        setData(null)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-500">
        Loading document...
      </div>
    )
  }

  if (!data || !data.file) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="card p-6 text-center text-gray-500">
          No Constitution & By-Laws uploaded yet.
        </div>
      </div>
    )
  }

  const fileUrl = `${UPLOADS_URL}/cbl/${data.file}`

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">

      <h1 className="text-3xl font-bold text-pice-navy">
        Constitution & By-Laws
      </h1>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <a
          href={fileUrl}
          target="_blank"
          className="btn-primary"
        >
          View Fullscreen
        </a>

        <a
          href={fileUrl}
          download
          className="btn-secondary"
        >
          Download PDF
        </a>
      </div>

      {/* PDF Viewer */}
      <div className="card p-2 h-[80vh]">

        {/* Desktop iframe */}
        <iframe
          src={fileUrl}
          className="w-full h-full hidden md:block"
          title="CBL PDF"
        />

        {/* Mobile fallback */}
        <div className="md:hidden text-center p-6 space-y-4">
          <p className="text-gray-600">
            PDF preview may be limited on mobile.
          </p>

          <a
            href={fileUrl}
            className="btn-primary"
            target="_blank"
          >
            Open Document
          </a>
        </div>

      </div>

      {data.updated_at && (
        <p className="text-sm text-gray-500">
          Last updated: {data.updated_at}
        </p>
      )}

    </div>
  )
}
