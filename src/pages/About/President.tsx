/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react"
import axios from "axios"

export default function President() {

  const [cover, setCover] = useState("")
  const [sections, setSections] = useState<any[]>([])

  useEffect(() => {
    axios.get("/pice-backend/api/?module=president&action=read")
      .then(res => {
        setCover(res.data.page?.cover_image || "")
        setSections(res.data.sections || [])
      })
  }, [])

  return (
  <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">

    <h1 className="text-3xl font-bold">
      Office of the President
    </h1>

    {cover && (
      <img
        src={`/pice-backend/uploads/president/${cover}`}
        className="w-full rounded shadow"
      />
    )}

    {sections.map((s:any) => (
      <div key={s.id} className="space-y-2">
        <h2 className="text-xl font-semibold">
          {s.subheader}
        </h2>

        <p className="leading-relaxed whitespace-pre-line">
          {s.content}
        </p>
      </div>
    ))}

  </div>)
}
