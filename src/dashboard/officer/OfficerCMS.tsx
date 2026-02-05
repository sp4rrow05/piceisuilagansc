import { useEffect, useState } from "react"
import axios from "axios"
import Swal from "sweetalert2"
import Pagination from "../../components/Pagination"

type Officer = {
  id: number
  name: string
  position: string
  group_name: string
  photo: string | null
  sort_order: number
}

const PAGE_SIZE = 7

export default function OfficersCMS() {

  const [data, setData] = useState<Officer[]>([])
  const [show, setShow] = useState(false)

  const [id, setId] = useState<number | null>(null)
  const [name, setName] = useState("")
  const [position, setPosition] = useState("")
  const [group, setGroup] = useState("Executive Officers")
  const [photo, setPhoto] = useState<File | null>(null)
  const [oldPhoto, setOldPhoto] = useState("")

  const [page, setPage] = useState(1)

  const groups = [
    "Executive Officers",
    "Board of Directors",
    "Committees",
    "Year Representatives",
  ]

  const load = async () => {
    const res = await axios.get(
      "/pice-backend/api/?module=officers&action=read"
    )

    const list = Array.isArray(res.data) ? res.data : []
    setData(list)

    // reset page if overflow
    const max = Math.max(1, Math.ceil(list.length / PAGE_SIZE))
    if (page > max) setPage(max)
  }

  useEffect(() => {
    load()
  }, [])

  // ================= PAGINATION LOGIC =================

  const totalPages = Math.max(1, Math.ceil(data.length / PAGE_SIZE))

  const paginated = data.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  )

  // ================= CRUD =================

  const openAdd = () => {
    setId(null)
    setName("")
    setPosition("")
    setGroup("Executive Officers")
    setPhoto(null)
    setOldPhoto("")
    setShow(true)
  }

  const openEdit = (o: Officer) => {
    setId(o.id)
    setName(o.name)
    setPosition(o.position)
    setGroup(o.group_name)
    setOldPhoto(o.photo || "")
    setPhoto(null)
    setShow(true)
  }

  const save = async (e: any) => {
    e.preventDefault()

    const fd = new FormData()
    fd.append("name", name)
    fd.append("position", position)
    fd.append("group_name", group)

    if (photo) fd.append("photo", photo)
    if (id) fd.append("id", id.toString())
    if (oldPhoto) fd.append("oldPhoto", oldPhoto)

    await axios.post(
      `/pice-backend/api/?module=officers&action=${id ? "update" : "create"}`,
      fd,
      { withCredentials: true }
    )

    Swal.fire("Saved!", "", "success")

    setShow(false)
    load()
  }

  const del = async (id: number) => {
    const c = await Swal.fire({
      title: "Delete officer?",
      icon: "warning",
      showCancelButton: true,
    })

    if (!c.isConfirmed) return

    await axios.get(
      `/pice-backend/api/?module=officers&action=delete&id=${id}`,
      { withCredentials: true }
    )

    load()
  }

  const move = async (id: number, dir: "up" | "down") => {
    await axios.get(
      `/pice-backend/api/?module=officers&action=move&id=${id}&dir=${dir}`,
      { withCredentials: true }
    )
    load()
  }

  // ================= UI =================

  return (
  <div className="space-y-6">

    <div className="flex justify-between">
      <h1 className="text-2xl font-bold">Officers CMS</h1>

      <button onClick={openAdd} className="btn-primary">
        ➕ Add Officer
      </button>
    </div>

    {/* ========== TABLE WITH LOCAL SCROLL ========== */}
    <div className="card">

      {/* 👇 SCROLL ONLY TABLE BODY */}
      <div className="overflow-y-auto">
        <table className="w-full">

          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="p-3">Photo</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Position</th>
              <th className="p-3">Group</th>
              <th className="p-3">Order</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
          {paginated.map(o => (
            <tr key={o.id} className="border-t">
              <td className="p-3 text-center">
                <img
                  src={
                    o.photo
                      ? `/pice-backend/uploads/officers/${o.photo}`
                      : "/images/user-placeholder.jpg"
                  }
                  className="w-14 h-14 object-cover rounded-full border"
                />
              </td>

              <td className="p-3">{o.name}</td>
              <td className="p-3">{o.position}</td>
              <td className="p-3 text-center text-sm">{o.group_name}</td>

              <td className="p-3 space-x-2 text-center">
                <button onClick={() => move(o.id, "up")}>⬆</button>
                <button onClick={() => move(o.id, "down")}>⬇</button>
              </td>

              <td className="p-3 space-x-2 text-center">
                <button
                  onClick={() => openEdit(o)}
                  className="text-blue-600"
                >
                  Edit
                </button>

                <button
                  onClick={() => del(o.id)}
                  className="text-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          </tbody>

        </table>
      </div>

      {/* 👇 PAGINATION OUTSIDE SCROLL */}
      <Pagination
        page={page}
        total={totalPages}
        setPage={setPage}
      />

    </div>

    {/* ===== MODAL (UNCHANGED) ===== */}
    {show && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
        <div className="card p-6 w-full max-w-lg">
          <h3 className="font-bold mb-4">
            {id ? "Edit Officer" : "Add Officer"}
          </h3>

          <form onSubmit={save} className="space-y-3">

            <input
              className="input"
              placeholder="Name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />

            <input
              className="input"
              placeholder="Position"
              value={position}
              onChange={e => setPosition(e.target.value)}
              required
            />

            <select
              className="input"
              value={group}
              onChange={e => setGroup(e.target.value)}
            >
              {groups.map(g => (
                <option key={g}>{g}</option>
              ))}
            </select>

            {oldPhoto && (
              <img
                src={`/pice-backend/uploads/officers/${oldPhoto}`}
                className="w-24 h-24 object-cover rounded"
              />
            )}

            <input
              type="file"
              className="input"
              onChange={e =>
                e.target.files && setPhoto(e.target.files[0])
              }
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShow(false)}
              >
                Cancel
              </button>

              <button className="btn-primary">
                Save
              </button>
            </div>

          </form>
        </div>
      </div>
    )}

  </div>)
}
