/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react"
import axios from "axios"

export default function Events() {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    axios.get("/pice-backend/api/?module=accomplishments&action=read").then(res => {
      setData(res.data.filter((x: any) => x.category === "events"))
    })
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Events</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.map(item => (
          <div key={item.id} className="bg-white rounded shadow overflow-hidden">
            <img
              src={`/pice-backend/uploads/accomplishments/${item.image}`}
              className="h-48 w-full object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg">{item.title}</h3>
              <p className="text-sm text-gray-600 mt-2">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
