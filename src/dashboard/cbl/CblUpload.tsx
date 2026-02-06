import { useEffect, useState } from "react"
import api from "../../services/api";
import Swal from "sweetalert2"

type CBL = {
  id: number | null
  file: string | null
  updated_at?: string
}

export default function CblUpload() {
  const [current, setCurrent] = useState<CBL | null>(null)
  const [file, setFile] = useState<File | null>(null)

  // LOAD CURRENT FILE
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(
          "/?module=cbl&action=read",
          { withCredentials: true }
        )

        // ensure we always set object or null
        if (res.data && res.data.file) {
          setCurrent(res.data)
        } else {
          setCurrent(null)
        }
      } catch {
        setCurrent(null)
      }
    }

    fetchData()
  }, [])

  // UPLOAD
  const submit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      Swal.fire("Error", "Please select a PDF file", "error")
      return
    }

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await api.post(
        "/?module=cbl&action=update",
        formData,
        { withCredentials: true }
      )

      if (res.data.success) {
        Swal.fire("Success", "CBL uploaded", "success")

        // reload current
        const fresh = await api.get(
          "/?module=cbl&action=read",
          { withCredentials: true }
        )

        setCurrent(fresh.data)
        setFile(null)
      }
    } catch {
      Swal.fire("Error", "Upload failed", "error")
    }
  }

  // DELETE
  const remove = async () => {
    const confirm = await Swal.fire({
      title: "Remove CBL?",
      icon: "warning",
      showCancelButton: true
    })

    if (!confirm.isConfirmed) return

    try {
      await api.get(
        "/?module=cbl&action=delete",
        { withCredentials: true }
      )

      setCurrent(null)
      Swal.fire("Removed", "", "success")
    } catch {
      Swal.fire("Error", "Failed to remove", "error")
    }
  }

  return (
    <div className="max-w-3xl space-y-6">

      <h1 className="text-2xl font-bold text-pice-navy">
        CBL (Constitution & By-Laws)
      </h1>

      {/* CURRENT FILE */}
      {current && current.file ? (
        <div className="card p-4 space-y-3">
          <h3 className="font-semibold">Current File</h3>

          <a
            href={`/pice-backend/uploads/cbl/${current.file}`}
            target="_blank"
            className="text-blue-600 underline"
          >
            View PDF
          </a>

          <div className="text-sm text-gray-500">
            Updated: {current.updated_at}
          </div>

          <button onClick={remove} className="btn-secondary text-red-600">
            Remove File
          </button>
        </div>
      ) : (
        <div className="card p-4 text-gray-500">
          No CBL uploaded yet.
        </div>
      )}

      {/* UPLOAD FORM */}
      <form onSubmit={submit} className="card p-4 space-y-3">
        <input
          type="file"
          accept="application/pdf"
          className="input"
          onChange={e => e.target.files && setFile(e.target.files[0])}
        />

        <button className="btn-primary">
          Upload PDF
        </button>
      </form>
    </div>
  )
}
