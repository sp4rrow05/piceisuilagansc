import { useEffect, useState } from "react"
import api from "../../services/api";
import { UPLOADS_URL } from "../../services/api";
import Swal from "sweetalert2"

export default function SliderCMS() {

  const [data, setData] = useState<any[]>([])
  const [show, setShow] = useState(false)

  const [id, setId] = useState<number|null>(null)
  const [title, setTitle] = useState("")
  const [subtitle, setSubtitle] = useState("")
  const [image, setImage] = useState<File|null>(null)
  const [old, setOld] = useState("")

  const load = async () => {
    const res = await api.get("/?module=slider&action=read")
    setData(res.data)
  }

  useEffect(()=>{ load() },[])

  const openAdd = () => {
    setId(null)
    setTitle("")
    setSubtitle("")
    setImage(null)
    setOld("")
    setShow(true)
  }

  const openEdit = (s:any) => {
    setId(s.id)
    setTitle(s.title)
    setSubtitle(s.subtitle)
    setOld(s.image)
    setImage(null)
    setShow(true)
  }

  const save = async (e:any) => {
    e.preventDefault()

    if (!image && !id) {
      Swal.fire("Select image first")
      return
    }

    const fd = new FormData()
    fd.append("title", title)
    fd.append("subtitle", subtitle)

    if (image) fd.append("image", image)
    if (id) fd.append("id", id.toString())

    await api.post(
      `/?module=slider&action=${id?"update":"create"}`,
      fd,
      { withCredentials:true }
    )

    Swal.fire("Saved!")
    setShow(false)
    load()
  }

  const del = async(id:number)=>{
    await api.get(
      `/?module=slider&action=delete&id=${id}`,
      { withCredentials:true }
    )
    load()
  }

  const move = async(id:number, dir:string)=>{
    await api.get(
      `/?module=slider&action=move&id=${id}&dir=${dir}`,
      { withCredentials:true }
    )
    load()
  }

  return (
  <div className="space-y-6">

    <div className="flex justify-between">
      <h1 className="text-2xl font-bold">Slider CMS</h1>

      <button onClick={openAdd} className="btn-primary">
        ➕ Add Slide
      </button>
    </div>

    <div className="card max-h-[75vh] overflow-y-auto">
    <table className="w-full">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-3">Image</th>
          <th className="p-3 text-left">Title</th>
          <th className="p-3">Order</th>
          <th className="p-3">Actions</th>
        </tr>
      </thead>

      <tbody>
      {data.map(s=>(
        <tr key={s.id} className="border-t">
          <td className="p-3">
            <img
              src={`${UPLOADS_URL}/sliders/${s.image}`}
              className="h-20 w-40 object-cover rounded"
            />
          </td>

          <td className="p-3">
            <div className="font-semibold">{s.title}</div>
            <div className="text-sm text-gray-500">{s.subtitle}</div>
          </td>

          <td className="p-3 text-center space-x-2">
            <button onClick={()=>move(s.id,"up")}>⬆</button>
            <button onClick={()=>move(s.id,"down")}>⬇</button>
          </td>

          <td className="p-3 text-center space-x-2">
            <button onClick={()=>openEdit(s)} className="text-blue-600">
              Edit
            </button>

            <button onClick={()=>del(s.id)} className="text-red-600">
              Delete
            </button>
          </td>
        </tr>
      ))}
      </tbody>
    </table>
    </div>


    {/* MODAL */}
    {show && (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="card p-6 w-full max-w-lg">

        <h3 className="font-bold mb-3">
          {id?"Edit Slide":"Add Slide"}
        </h3>

        <form onSubmit={save} className="space-y-3">

          <input
            className="input"
            placeholder="Title"
            value={title}
            onChange={e=>setTitle(e.target.value)}
          />

          <input
            className="input"
            placeholder="Subtitle"
            value={subtitle}
            onChange={e=>setSubtitle(e.target.value)}
          />

          {old && (
            <img
              src={`${UPLOADS_URL}/sliders/${old}`}
              className="h-32 rounded"
            />
          )}

          <input
            type="file"
            className="input"
            onChange={e=>setImage(e.target.files?.[0]||null)}
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={()=>setShow(false)}
              className="btn-secondary"
            >
              Cancel
            </button>

            <button className="btn-primary">Save</button>
          </div>

        </form>

      </div>
    </div>
    )}

  </div>)
}
