/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react"
import axios from "axios"

export default function Announcements() {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    axios.get("/pice-backend/api/?module=announcements&action=read").then(res => {
      setData(res.data)
    })
  }, [])

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Announcements</h1>

      <div className="space-y-6">
        {data.map(item => (
          <div key={item.id} className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold">{item.title}</h2>
            <p className="mt-2 text-gray-700 whitespace-pre-line">
              {item.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
