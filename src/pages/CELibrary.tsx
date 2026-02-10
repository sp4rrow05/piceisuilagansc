import { useEffect, useState } from "react"
import api from "../services/api";
import { UPLOADS_URL } from "../services/api";


type Folder = {
  id: number
  name: string
  parent_id: number | null
}

type FileItem = {
  id: number
  title: string
  filename: string
}

export default function CELibrary() {

  const [folders, setFolders] = useState<Folder[]>([])
  const [files, setFiles] = useState<FileItem[]>([])

  const [current, setCurrent] = useState<number | null>(null)
  const [breadcrumb, setBreadcrumb] = useState<Folder[]>([])

  // LOAD ROOT
  useEffect(() => {
    openFolder(null)
  }, [])

  const openFolder = async (id: number | null) => {
    setCurrent(id)

    const f = await api.get(`/?module=ce&action=folders&parent_id=${id ?? ""}`)
    const fi = await api.get(`/?module=ce&action=files&folder_id=${id ?? ""}`)

    setFolders(Array.isArray(f.data) ? f.data : [])
    setFiles(Array.isArray(fi.data) ? fi.data : [])

    // load breadcrumb path
    const bc = await api.get(`/?module=ce&action=breadcrumb&id=${id ?? ""}`)
    setBreadcrumb(Array.isArray(bc.data) ? bc.data : [])
  }

  const back = () => {
    if (breadcrumb.length > 1) {
      const parent = breadcrumb[breadcrumb.length - 2]
      openFolder(parent.id)
    } else {
      openFolder(null)
    }
  }

  return (
  <div className="max-w-6xl mx-auto p-6 space-y-6">

    <h1 className="text-2xl font-bold">CE Library</h1>

    {/* BREADCRUMBS */}
    <div className="flex gap-2 items-center text-sm">
      {/* <span
        className="cursor-pointer text-blue-600"
        onClick={() => openFolder(null)}
      >
        Root
      </span> */}

      {breadcrumb.map(b => (
        <span key={b.id} className="flex gap-2">
          / 
          <span
            className="cursor-pointer text-blue-600"
            onClick={() => openFolder(b.id)}
          >
            {b.name}
          </span>
        </span>
      ))}
    </div>

    {/* BACK */}
    {current && (
      <button onClick={back} className="btn-secondary">
        ← Back
      </button>
    )}

    {/* FOLDERS */}
    <div className="grid md:grid-cols-4 gap-3">
      {folders.map(f => (
        <div
          key={f.id}
          onClick={() => openFolder(f.id)}
          className="border p-3 rounded cursor-pointer hover:bg-gray-50"
        >
          📁 {f.name}
        </div>
      ))}
    </div>

    {/* FILES */}
    <div className="space-y-2">
      {files.map(f => (
        <div key={f.id} className="border p-3 flex justify-between">
          <span>{f.title}</span>

          <a
            href={`${UPLOADS_URL}/ce_library/${f.filename}`}
            target="_blank"
            className="text-blue-600"
          >
            View
          </a>
        </div>
      ))}
    </div>

  </div>)
}
