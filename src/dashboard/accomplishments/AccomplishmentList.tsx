/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react"
import api from "../../services/api";
import Swal from "sweetalert2"
import { UPLOADS_URL } from "../../services/api";

type Category = "projects_programs" | "events"

type Accomplishment = {
  id: number
  title: string
  description: string
  date: string
  image: string
  category: Category
}

const PAGE_SIZE = 6

export default function AccomplishmentList() {
  const [data, setData] = useState<Accomplishment[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  // Filters & UI state
  const [search, setSearch] = useState("")
  const [filterCategory, setFilterCategory] = useState<"all" | Category>("all")
  const [page, setPage] = useState(1)

  // Image viewer
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  // Form states
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")
  const [category, setCategory] = useState<Category>("projects_programs")
  const [image, setImage] = useState<File | null>(null)
  const [oldImage, setOldImage] = useState("")

  // Initial load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(
          "/?module=accomplishments&action=read"
        )
        setData(res.data)
      } catch {
        Swal.fire("Error", "Failed to load accomplishments.", "error")
      }
    }
    fetchData()
  }, [])

  const refreshData = async () => {
    try {
      const res = await api.get(
        "/?module=accomplishments&action=read"
      )
      setData(res.data)
    } catch {
      Swal.fire("Error", "Failed to refresh data.", "error")
    }
  }

  // Filtering + searching
  const filtered = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase())

      const matchesCategory =
        filterCategory === "all" || item.category === filterCategory

      return matchesSearch && matchesCategory
    })
  }, [data, search, filterCategory])

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
    setDescription("")
    setDate("")
    setCategory("projects_programs")
    setImage(null)
    setOldImage("")
    setShowModal(true)
  }

  // Open EDIT modal
  const openEditModal = async (id: number) => {
    try {
      const res = await api.get(
        `/?module=accomplishments&action=get&id=${id}`
      )

      setEditingId(id)
      setTitle(res.data.title)
      setDescription(res.data.description)
      setDate(res.data.date)
      setCategory(res.data.category)
      setOldImage(res.data.image)
      setImage(null)
      setShowModal(true)
    } catch {
      Swal.fire("Error", "Failed to load record.", "error")
    }
  }

  // Delete
  const deleteItem = async (id: number) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This record will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    })

    if (!result.isConfirmed) return

    try {
      await api.get(
        `/?module=accomplishments&action=delete&id=${id}`
      )
      await refreshData()
      Swal.fire("Deleted!", "Record deleted successfully.", "success")
    } catch {
      Swal.fire("Error", "Failed to delete record.", "error")
    }
  }

  // Add or Update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append("title", title)
    formData.append("description", description)
    formData.append("date", date)
    formData.append("category", category)
    if (image) formData.append("image", image)

    try {
      if (editingId === null) {
        await api.post(
          "/?module=accomplishments&action=create",
          formData
        )
        Swal.fire({ icon: "success", title: "Added!", timer: 1200, showConfirmButton: false })
      } else {
        formData.append("id", editingId.toString())
        formData.append("oldImage", oldImage)

        await api.post(
          "/?module=accomplishments&action=update",
          formData
        )
        Swal.fire({ icon: "success", title: "Updated!", timer: 1200, showConfirmButton: false })
      }

      setShowModal(false)
      await refreshData()
    } catch {
      Swal.fire("Error", "Failed to save data.", "error")
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-pice-navy tracking-tight">
            Accomplishments
          </h1>
          <p className="text-gray-500 text-sm">
            Manage projects, programs, and events
          </p>
        </div>

        <button onClick={openAddModal} className="btn-primary">
          ➕ Add New
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-col md:flex-row gap-4">
        <input
          className="input"
          placeholder="Search..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
        />

        <select
          className="input md:w-60"
          value={filterCategory}
          onChange={(e) => {
            setFilterCategory(e.target.value as any)
            setPage(1)
          }}
        >
          <option value="all">All Categories</option>
          <option value="projects_programs">Projects & Programs</option>
          <option value="events">Events</option>
        </select>
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="card p-10 text-center text-gray-500">
          No records found. Click <b>Add New</b> to create one.
        </div>
      )}

      {/* Table */}
      {filtered.length > 0 && (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">Image</th>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((item) => (
                <tr key={item.id} className="border-t hover:bg-gray-50 transition">
                  <td className="px-4 py-3">
                    <img
                      src={`${UPLOADS_URL}/accomplishments/${item.image}`}
                      className="w-16 h-12 object-cover rounded cursor-zoom-in"
                      onClick={() =>
                        setPreviewImage(
                          `/pice-backend/uploads/accomplishments/${item.image}`
                        )
                      }
                    />
                  </td>
                  <td className="px-4 py-3 font-medium">{item.title}</td>
                  <td className="px-4 py-3 text-sm">
                    {item.category === "projects_programs"
                      ? "Projects & Programs"
                      : "Events"}
                  </td>
                  <td className="px-4 py-3 text-sm">{item.date}</td>
                  <td className="px-4 py-3 space-x-2">
                    <button onClick={() => openEditModal(item.id)} className="text-blue-600">
                      Edit
                    </button>
                    <button onClick={() => deleteItem(item.id)} className="text-red-600">
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
                {editingId === null ? "Add Accomplishment" : "Edit Accomplishment"}
              </h2>
              <p className="text-sm text-gray-500">
                Fill in the information below
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <select
                className="input"
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
              >
                <option value="projects_programs">Projects & Programs</option>
                <option value="events">Events</option>
              </select>

              <input className="input" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
              <textarea className="input" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
              <input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} required />

              {/* Image Preview */}
              {editingId !== null && oldImage && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Current Image (click to view)</p>
                  <img
                    src={`${UPLOADS_URL}/accomplishments/${oldImage}`}
                    className="w-full h-40 object-cover rounded cursor-zoom-in"
                    onClick={() =>
                      setPreviewImage(
                        `/pice-backend/uploads/accomplishments/${oldImage}`
                      )
                    }
                  />
                </div>
              )}

              <input type="file" className="input" onChange={(e) => e.target.files && setImage(e.target.files[0])} />

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
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

      {/* FULLSCREEN IMAGE VIEWER */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-[10000]"
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            className="max-w-[90vw] max-h-[90vh] rounded shadow-lg animate-[zoomIn_0.25s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute top-6 right-6 text-white text-3xl font-bold"
            onClick={() => setPreviewImage(null)}
          >
            ×
          </button>
        </div>
      )}
    </div>
  )
}
