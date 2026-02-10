/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react"
import api from "../services/api";
import { UPLOADS_URL } from "../services/api";
export default function Downloads() {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    api.get("/?module=downloads&action=read").then(res => {
      setData(res.data)
    })
  }, [])

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Downloads</h1>

      <div className="space-y-4">
        {data.map(item => (
          <div key={item.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
            <span>{item.title}<br></br><p className="text-sm text-gray-500">{item.description}</p></span>
            <a
              href={`${UPLOADS_URL}/downloads/${item.file}`}
              target="_blank"
              className="bg-pice-navy text-white px-4 py-2 rounded"
            >
              Download
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
