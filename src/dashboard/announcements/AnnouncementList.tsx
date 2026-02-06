import { useEffect, useMemo, useState } from "react"
import api from "../../services/api";
import Swal from "sweetalert2"

type Announcement = {
  id: number
  title: string
  content: string
  created_at: string
}

const PAGE_SIZE = 8

export default function AnnouncementList() {
  const [data, setData] = useState<Announcement[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  // Filters & UI
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  // Form states
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  // Initial load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(
          "/?module=announcements&action=read"
        )
        setData(res.data)
      } catch {
        Swal.fire("Error", "Failed to load announcements.", "error")
      }
    }
    fetchData()
  }, [])

  const refreshData = async () => {
    try {
      const res = await api.get(
        "/?module=announcements&action=read"
      )
      setData(res.data)
    } catch {
      Swal.fire("Error", "Failed to refresh list.", "error")
    }
  }

  // Filtering
  const filtered = useMemo(() => {
    return data.filter(
      (item) =>
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.content.toLowerCase().includes(search.toLowerCase())
    )
  }, [data, search])

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  )

  // Open ADD modal
  const openAddModal = () => {
    setEditingId(null)
    setTitle("")
    setContent("")
    setShowModal(true)
  }

  // Open EDIT modal
  const openEditModal = async (id: number) => {
    try {
      const res = await api.get(
        `/?module=announcements&action=get&id=${id}`
      )

      setEditingId(id)
      setTitle(res.data.title)
      setContent(res.data.content)
      setShowModal(true)
    } catch {
      Swal.fire("Error", "Failed to load record.", "error")
    }
  }

  // Delete
  const deleteItem = async (id: number) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This announcement will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    })

    if (!result.isConfirmed) return

    try {
      await api.get(
        `/?module=announcements&action=delete&id=${id}`
      )
      await refreshData()
      Swal.fire("Deleted!", "Announcement deleted.", "success")
    } catch {
      Swal.fire("Error", "Failed to delete announcement.", "error")
    }
  }

  // Add or Update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append("title", title)
    formData.append("content", content)

    try {
      if (editingId === null) {
        await api.post(
          "/?module=announcements&action=create",
          formData
        )
        Swal.fire({ icon: "success", title: "Added!", timer: 1200, showConfirmButton: false })
      } else {
        formData.append("id", editingId.toString())
        await api.post(
          "/?module=announcements&action=update",
          formData
        )
        Swal.fire({ icon: "success", title: "Updated!", timer: 1200, showConfirmButton: false })
      }

      setShowModal(false)
      await refreshData()
    } catch {
      Swal.fire("Error", "Failed to save announcement.", "error")
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-pice-navy tracking-tight">
            Announcements
          </h1>
          <p className="text-gray-500 text-sm">
            Manage public announcements
          </p>
        </div>

        <button onClick={openAddModal} className="btn-primary">
          ➕ Add New
        </button>
      </div>

      {/* Search */}
      <div className="card p-4">
        <input
          className="input"
          placeholder="Search announcements..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
        />
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="card p-10 text-center text-gray-500">
          No announcements yet. Click <b>Add New</b> to create one.
        </div>
      )}

      {/* Table */}
      {filtered.length > 0 && (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((item) => (
                <tr key={item.id} className="border-t hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-medium">{item.title}</td>
                  <td className="px-4 py-3 text-sm">{item.created_at}</td>
                  <td className="px-4 py-3 space-x-2">
                    <button
                      onClick={() => openEditModal(item.id)}
                      className="text-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center p-4 border-t">
            <span className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                className="btn-secondary"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Prev
              </button>
              <button
                className="btn-secondary"
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
          <div className="card w-full max-w-xl p-6 animate-[modalIn_0.25s_ease-out]">
            <div className="border-b pb-3 mb-4">
              <h2 className="text-xl font-bold">
                {editingId === null ? "Add Announcement" : "Edit Announcement"}
              </h2>
              <p className="text-sm text-gray-500">
                Fill in the information below
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                className="input"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <textarea
                className="input"
                placeholder="Content"
                rows={6}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingId === null ? "Save" : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
