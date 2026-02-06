import { useEffect, useState } from "react"
import api from "../../services/api";
import Swal from "sweetalert2"
import { UPLOADS_URL } from "../../services/api";

export default function FinancialCMS() {
  const [file, setFile] = useState("")

  const load = async () => {
    const res = await api.get("/?module=financial&action=read")
    setFile(res.data.file || "")
  }

  useEffect(() => { load() }, [])

  const upload = async (e:any) => {
    const fd = new FormData()
    fd.append("file", e.target.files[0])

    await api.post(
      "/?module=financial&action=update",
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
          src={`${UPLOADS_URL}/financial/${file}`}
          className="w-full h-[70vh]"
        />
      ) : "No report uploaded"}

      <input type="file" className="mt-4" onChange={upload} />
    </div>
  </div>)
}
