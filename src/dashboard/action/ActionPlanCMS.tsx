import { useEffect, useState } from "react"
import axios from "axios"
import Swal from "sweetalert2"

export default function ActionPlanCMS() {

  const [current, setCurrent] = useState<any>(null)

  const load = async () => {
    const res = await axios.get("/pice-backend/api/?module=actionplan&action=read")
    setCurrent(res.data)
  }

  useEffect(() => { load() }, [])

  const upload = async (e:any) => {
    const fd = new FormData()
    fd.append("file", e.target.files[0])

    await axios.post(
      "/pice-backend/api/?module=actionplan&action=update",
      fd,
      { withCredentials:true }
    )

    Swal.fire("Uploaded!", "", "success")
    load()
  }

  return (
  <div className="space-y-6 max-w-3xl">

    <h1 className="text-2xl font-bold text-pice-navy">
      Action Plan (PDF)
    </h1>

    <div className="card p-4">
      <input type="file" accept="application/pdf" onChange={upload} />
    </div>

    {current?.file ? (
      <div className="card p-4 space-y-3">

        <a
          href={`/pice-backend/uploads/actionplan/${current.file}`}
          target="_blank"
          className="text-blue-600 underline"
        >
          View Current PDF
        </a>

        <iframe
          src={`/pice-backend/uploads/actionplan/${current.file}`}
          className="w-full h-[600px] border rounded"
        />

      </div>
    ) : (
      <div className="card p-4 text-gray-500">
        No Action Plan uploaded yet.
      </div>
    )}

  </div>)
}
