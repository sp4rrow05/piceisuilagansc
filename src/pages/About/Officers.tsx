import { useEffect, useState } from "react"
import api from "../../services/api";
import { UPLOADS_URL } from "../../services/api";

type Officer = {
  id: number
  name: string
  position: string
  group_name: string
  photo: string | null
}

const placeholder = "/images/user-placeholder.jpg"

export default function Officers() {
  const [officers, setOfficers] = useState<Officer[]>([])

  useEffect(() => {
    api
      .get("/?module=officers&action=read")
      .then(res => setOfficers(res.data))
  }, [])

  // GROUP THEM BY group_name
  const groups = officers.reduce((acc: any, cur) => {
    acc[cur.group_name] = acc[cur.group_name] || []
    acc[cur.group_name].push(cur)
    return acc
  }, {})
  

  const renderCard = (o: Officer) => (
    <div
      key={o.id}
      className="bg-white rounded-lg shadow text-center p-4 hover:shadow-lg transition"
    >
      <img
        src={
          o.photo
            ? `${UPLOADS_URL}/officers/${o.photo}`
            : placeholder
        }
        className="w-32 h-32 object-cover rounded-full mx-auto mb-3 border"
      />

      <h3 className="font-bold">{o.name || "—"}</h3>
      {(o.group_name !== "creatives" && o.group_name !== "events" && o.group_name !== "membership") && (
        <p className="text-sm text-gray-600">{o.position}</p>
      )}
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">

      <h1 className="text-3xl font-bold text-pice-navy">
        The PICE-ISU-I SC Officers
      </h1>

      {/* ============ EXECUTIVE OFFICERS ============ */}
      {groups["executive"] && (
        <section>
          <h2 className="text-xl font-semibold mb-4">
            Executive Officers
          </h2>

          <div className="grid md:grid-cols-4 gap-4">
            {groups["executive"].map(renderCard)}
          </div>
        </section>
      )}

      {/* ============ BOARD OF DIRECTORS ============ */}
      {groups["board"] && (
        <section>
          <h2 className="text-xl font-semibold mb-4">
            Board of Directors
          </h2>

          <div className="grid md:grid-cols-4 gap-4">
            {groups["board"].map(renderCard)}
          </div>
        </section>
      )}

      {/* ============ COMMITTEES ============ */}
      {groups["membership"] && (
        <section>
          <h2 className="text-xl font-semibold mb-4">
            Committee on Membership
          </h2>

          <div className="grid md:grid-cols-4 gap-4">
            {groups["membership"].map(renderCard)}
          </div>
        </section>
      )}
      {groups["events"] && (
        <section>
          <h2 className="text-xl font-semibold mb-4">
            Committee on Events
          </h2>

          <div className="grid md:grid-cols-4 gap-4">
            {groups["events"].map(renderCard)}
          </div>
        </section>
      )}
      {groups["creatives"] && (
        <section>
          <h2 className="text-xl font-semibold mb-4">
            Committee on Creatives
          </h2>

          <div className="grid md:grid-cols-4 gap-4">
            {groups["creatives"].map(renderCard)}
          </div>
        </section>
      )}

      {/* ============ YEAR REPRESENTATIVES ============ */}
      {groups["year_reps"] && (
        <section>
          <h2 className="text-xl font-semibold mb-4">
            Year Representatives
          </h2>

          <div className="grid md:grid-cols-5 gap-4">
            {groups["year_reps"].map(renderCard)}
          </div>
        </section>
      )}

    </div>
  )
}
