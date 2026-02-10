import { useEffect, useState } from "react"
import api, { UPLOADS_URL } from "../../services/api"
import Swal from "sweetalert2"

export default function CELibraryCMS() {

  const [folders, setFolders] = useState<any[]>([])
  const [files, setFiles] = useState<any[]>([])

  const [current, setCurrent] = useState<number | null>(null)
  const [breadcrumbs, setBreadcrumbs] = useState<any[]>([])

  const [name, setName] = useState("")
  const [search, setSearch] = useState("")

  const [preview, setPreview] = useState<any>(null)

  /* ================= FOLDERS ================= */

  const loadFolders = async (parent_id: number | null = null) => {
    const res = await api.get(
      `/?module=ce&action=folders&parent_id=${parent_id ?? ""}`
    )

    setFolders(res.data)
  }

  const openFolder = async (f: any) => {
    setCurrent(f.id)

    setBreadcrumbs(prev => [...prev, f])

    await loadFolders(f.id)
    await loadFiles(f.id)
  }

  const goBack = async () => {
    const newCrumbs = [...breadcrumbs]
    newCrumbs.pop()

    const parent = newCrumbs.length
      ? newCrumbs[newCrumbs.length - 1]
      : null

    setBreadcrumbs(newCrumbs)
    setCurrent(parent ? parent.id : null)

    await loadFolders(parent ? parent.id : null)

    if (parent) await loadFiles(parent.id)
    else setFiles([])
  }

  useEffect(() => {
    loadFolders(null)
  }, [])

  const createFolder = async () => {

    if (!name) {
      Swal.fire("Enter folder name")
      return
    }

    const fd = new FormData()
    fd.append("name", name)

    if (current)
      fd.append("parent_id", current.toString())

    await api.post("/?module=ce&action=create_folder", fd)

    setName("")
    loadFolders(current)
  }

  const deleteFolder = async (id: number) => {

    const c = await Swal.fire({
      title: "Delete folder?",
      showCancelButton: true,
      icon: "warning"
    })

    if (!c.isConfirmed) return

    const res = await api.get(
      `/?module=ce&action=delete_folder&id=${id}`
    )

    if (res.data.error)
      Swal.fire(res.data.error)
    else
      loadFolders(current)
  }

  /* ================= FILES ================= */

  const loadFiles = async (id: number) => {

    const res = await api.get(
      `/?module=ce&action=files&folder_id=${id}&search=${search}`
    )

    setFiles(res.data)
  }

  const upload = async (file: File) => {

    if (!current) {
      Swal.fire("Select folder first")
      return
    }

    const fd = new FormData()
    fd.append("folder_id", current.toString())
    fd.append("file", file)

    await api.post("/?module=ce&action=upload", fd)

    loadFiles(current)
  }

  const drop = (e: any) => {
    e.preventDefault()
    upload(e.dataTransfer.files[0])
  }

  const delFile = async (id: number) => {

    const c = await Swal.fire({
      title: "Delete this file?",
      icon: "warning",
      showCancelButton: true,
    })

    if (!c.isConfirmed) return

    const res = await api.get(
      `/?module=ce&action=file_delete&id=${id}`
    )

    if (res.data.error) {
      Swal.fire("Error", res.data.error, "error")
      return
    }

    Swal.fire("Deleted", "", "success")

    loadFiles(current!)
  }

  /* ================= UI ================= */

  return (
  <div className="grid grid-cols-3 gap-6">

  {/* ===== FOLDERS ===== */}
  <div className="card p-4">

    <h3 className="font-bold mb-3">Folders</h3>

    {/* BREADCRUMBS */}
    <div className="mb-3 text-sm space-x-2">
      <span
        className="cursor-pointer text-blue-600"
        onClick={() => {
          setBreadcrumbs([])
          setCurrent(null)
          loadFolders(null)
          setFiles([])
        }}
      >
        Root
      </span>

      {breadcrumbs.map((b, i) => (
        <span key={i}>
          / <span className="font-semibold">{b.name}</span>
        </span>
      ))}
    </div>

    {/* BACK */}
    {current && (
      <button
        onClick={goBack}
        className="btn-secondary mb-2"
      >
        ⬅ Back
      </button>
    )}

    <input
      className="input mb-2"
      value={name}
      onChange={e => setName(e.target.value)}
      placeholder="New folder / subfolder"
    />

    <button
      onClick={createFolder}
      className="btn-primary mb-4"
    >
      Create Here
    </button>

    {folders.map(f => (
      <div
        key={f.id}
        className="flex justify-between border p-2 mb-2"
      >
        <span
          onClick={() => openFolder(f)}
          className="cursor-pointer"
        >
          📁 {f.name}
        </span>

        <button onClick={() => deleteFolder(f.id)}>
          🗑
        </button>
      </div>
    ))}

  </div>


  {/* ===== FILES ===== */}
  <div className="col-span-2 card p-4">

  <h3 className="font-bold mb-3">Files</h3>

  <input
    className="input mb-2"
    placeholder="Search..."
    value={search}
    onChange={e => setSearch(e.target.value)}
  />

  <div
    onDrop={drop}
    onDragOver={e => e.preventDefault()}
    className="border-dashed border-2 p-6 text-center mb-3"
  >
    Drag & Drop files here
  </div>

  {files.map(f => (
    <div key={f.id} className="flex justify-between border p-2">

      <span onClick={() => setPreview(f)}>
        📄 {f.title}
      </span>

      <div className="space-x-2">
        <a
          href={`${UPLOADS_URL}/ce_library/${f.filename}`}
          target="_blank"
        >
          View
        </a>

        <button onClick={() => delFile(f.id)}>
          Delete
        </button>
      </div>

    </div>
  ))}

  </div>


  {/* ===== PREVIEW ===== */}
  {preview && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center">

    <div className="bg-white p-4 w-[800px] h-[90vh]">

      <h3 className="font-bold mb-2">{preview.title}</h3>

      {preview.filetype === "pdf" ? (
        <iframe
          src={`${UPLOADS_URL}/ce_library/${preview.filename}`}
          className="w-full h-[80vh]"
        />
      ) : (
        <a
          href={`${UPLOADS_URL}/ce_library/${preview.filename}`}
        >
          Download
        </a>
      )}

      <button onClick={() => setPreview(null)}>
        Close
      </button>

    </div>
  </div>
  )}

  </div>)
}
