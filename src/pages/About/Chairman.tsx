/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react"
import api from "../../services/api";
import { UPLOADS_URL } from "../../services/api";

export default function Chairman() {

  const [cover, setCover] = useState("")
  const [sections, setSections] = useState<any[]>([])

  useEffect(() => {
    api.get("/?module=chairman&action=read")
      .then(res => {
        setCover(res.data.page?.cover_image || "")
        setSections(res.data.sections || [])
      })
  }, [])

  return (
  <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">

    <h1 className="text-3xl font-bold">
      Office of the Executive Officer
    </h1>

    {cover && (
      <img
        src={`${UPLOADS_URL}/chairman/${cover}`}
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
