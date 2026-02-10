/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react"
import api from "../../services/api";
import Swal from "sweetalert2"
import { UPLOADS_URL } from "../../services/api";

export default function ChairpersonCMS() {

  const [cover, setCover] = useState("")
  const [sections, setSections] = useState<any[]>([])

  const [subheader, setSubheader] = useState("")
  const [content, setContent] = useState("")
  const [editing, setEditing] = useState<number | null>(null)

  // ─────────────────────────────────────────────
  // ✅ SAFE INITIAL LOAD
  // ─────────────────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(
          "/?module=chairperson&action=read"
        )

        setCover(res.data.page?.cover_image || "")
        setSections(Array.isArray(res.data.sections) ? res.data.sections : [])

      } catch (err) {
        console.error(err)
        Swal.fire("Error", "Failed to load chairperson page", "error")
      }
    }

    fetchData()
  }, [])

  // reusable refresh
  const reload = async () => {
    try {
      const res = await api.get(
        "/?module=chairperson&action=read"
      )

      setCover(res.data.page?.cover_image || "")
      setSections(Array.isArray(res.data.sections) ? res.data.sections : [])

    } catch {
      Swal.fire("Error", "Failed to refresh data", "error")
    }
  }

  // ─────────────────────────────────────────────
  // UPLOAD COVER
  // ─────────────────────────────────────────────
  const uploadCover = async (e: any) => {
    const file = e.target.files?.[0]
    if (!file) return

    const fd = new FormData()
    fd.append("image", file)

    try {
      await api.post(
        "/?module=chairperson&action=cover_update",
        fd,
        { withCredentials: true }
      )

      Swal.fire("Updated!", "", "success")
      reload()

    } catch {
      Swal.fire("Error", "Upload failed", "error")
    }
  }

  // ─────────────────────────────────────────────
  // SAVE SECTION
  // ─────────────────────────────────────────────
  const saveSection = async (e: any) => {
    e.preventDefault()

    const fd = new FormData()
    fd.append("subheader", subheader)
    fd.append("content", content)

    try {
      if (editing) {
        fd.append("id", editing.toString())

        await api.post(
          "/?module=chairperson&action=section_update",
          fd,
          { withCredentials: true }
        )
      } else {
        await api.post(
          "/?module=chairperson&action=section_create",
          fd,
          { withCredentials: true }
        )
      }

      Swal.fire("Saved!", "", "success")

      setSubheader("")
      setContent("")
      setEditing(null)

      reload()

    } catch {
      Swal.fire("Error", "Failed to save section", "error")
    }
  }

  // ─────────────────────────────────────────────
  // EDIT
  // ─────────────────────────────────────────────
  const edit = (s: any) => {
    setEditing(s.id)
    setSubheader(s.subheader)
    setContent(s.content)
  }

  // ─────────────────────────────────────────────
  // DELETE
  // ─────────────────────────────────────────────
  const del = async (id: number) => {
    try {
      await api.get(
        `/?module=chairperson&action=section_delete&id=${id}`,
        { withCredentials: true }
      )

      Swal.fire("Deleted!", "", "success")
      reload()

    } catch {
      Swal.fire("Error", "Failed to delete", "error")
    }
  }

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────
  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold">
        Office of the Department Chairperson
      </h1>

      {/* COVER */}
      <div className="card p-4">
        <h3 className="font-semibold mb-2">Cover Photo</h3>

        {cover && (
          <img
            src={`${UPLOADS_URL}/chairperson/${cover}`}
            className="w-full h-60 object-cover mb-3 rounded"
          />
        )}

        <input type="file" onChange={uploadCover} />
      </div>

      {/* SECTION FORM */}
      <div className="card p-4">
        <form onSubmit={saveSection} className="space-y-3">

          <input
            className="input"
            placeholder="Subheader"
            value={subheader}
            onChange={e => setSubheader(e.target.value)}
          />

          <textarea
            className="input h-32"
            placeholder="Content"
            value={content}
            onChange={e => setContent(e.target.value)}
          />

          <button className="btn-primary">
            {editing ? "Update" : "Add"} Section
          </button>

        </form>
      </div>

      {/* LIST */}
      <div className="card">
        {sections.length === 0 && (
          <div className="p-4 text-gray-500">
            No sections added yet.
          </div>
        )}

        {sections.map(s => (
          <div key={s.id} className="p-4 border-b">
            <h4 className="font-bold">{s.subheader}</h4>

            <p className="text-sm mt-2 whitespace-pre-line">
              {s.content}
            </p>

            <div className="mt-2 space-x-2">
              <button
                onClick={() => edit(s)}
                className="text-blue-600"
              >
                Edit
              </button>

              <button
                onClick={() => del(s.id)}
                className="text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
