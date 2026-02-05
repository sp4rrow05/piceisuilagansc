import { useEffect, useState } from "react"
import axios from "axios"

export default function FinancialReport() {
  const [file, setFile] = useState("")

  useEffect(() => {
    axios.get("/pice-backend/api/?module=financial&action=read")
      .then(res => setFile(res.data.file))
  }, [])

  return (
  <div className="max-w-5xl mx-auto p-6">
    <h1 className="text-2xl font-bold mb-4">Financial Report</h1>

    {file ? (
      <iframe
        src={`/pice-backend/uploads/financial/${file}`}
        className="w-full h-[80vh] border"
      />
    ) : "No Financial Report uploaded"}
  </div>)
}

