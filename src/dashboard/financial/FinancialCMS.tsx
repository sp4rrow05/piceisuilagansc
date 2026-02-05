import { useEffect, useState } from "react"
import axios from "axios"
import Swal from "sweetalert2"

export default function FinancialCMS() {
  const [file, setFile] = useState("")

  const load = async () => {
    const res = await axios.get("/pice-backend/api/?module=financial&action=read")
    setFile(res.data.file || "")
  }

  useEffect(() => { load() }, [])

  const upload = async (e:any) => {
    const fd = new FormData()
    fd.append("file", e.target.files[0])

    await axios.post(
      "/pice-backend/api/?module=financial&action=update",
      fd,
      { withCredentials:true }
    )

    Swal.fire("Uploaded!", "", "success")
    load()
  }

  return (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold">Financial Report CMS</h1>

    <div className="card p-4">
      {file ? (
        <iframe
          src={`/pice-backend/uploads/financial/${file}`}
          className="w-full h-[70vh]"
        />
      ) : "No report uploaded"}

      <input type="file" className="mt-4" onChange={upload} />
    </div>
  </div>)
}
