import { useEffect, useState } from "react"
import axios from "axios"

export default function ActionPlan() {

  const [file, setFile] = useState<string>("")

  useEffect(() => {
    axios
      .get("/pice-backend/api/?module=actionplan&action=read")
      .then(res => setFile(res.data.file || ""))
  }, [])

  return (
  <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">

    <h1 className="text-3xl font-bold text-pice-navy">
      Action Plan
    </h1>

    {!file && (
      <div className="card p-6 text-gray-500">
        No Action Plan uploaded yet.
      </div>
    )}

    {file && (
      <div className="space-y-4">

        {/* <div className="flex justify-end">
          <a
            href={`/pice-backend/uploads/actionplan/${file}`}
            download
            className="btn-primary"
          >
            Download PDF
          </a>
        </div> */}

        <iframe
          src={`/pice-backend/uploads/actionplan/${file}`}
          className="w-full h-[85vh] border rounded"
        />

      </div>
    )}

  </div>)
}
