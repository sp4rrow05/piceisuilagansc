import { useEffect, useState } from "react"
import api from "../../services/api";
import AccomplishmentModal from "../../components/AccomplishmentModal"
import { UPLOADS_URL } from "../../services/api";

export default function Events() {
  const [list, setList] = useState<any[]>([])
  const [selected, setSelected] = useState<any | null>(null)

  useEffect(() => {
    api
      .get("/?module=accomplishments&action=read")
      .then(res => {
        const all = Array.isArray(res.data) ? res.data : []
        setList(all.filter((i: any) => i.category === "events"))
      })
  }, [])

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">

      <h1 className="text-3xl font-bold text-pice-navy">
        Events
      </h1>

      <div className="grid md:grid-cols-3 gap-4">
        {list.map(i => (
          <div
            key={i.id}
            onClick={() => setSelected(i)}
            className="card hover:shadow cursor-pointer"
          >
            <img
              src={`${UPLOADS_URL}/accomplishments/${i.image}`}
              className="h-40 w-full object-cover"
            />

            <div className="p-3">
              <h3 className="font-semibold">{i.title}</h3>
              <p className="text-sm line-clamp-2">
                {i.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <AccomplishmentModal
          item={selected}
          onClose={() => setSelected(null)}
        />
      )}

    </div>
  )
}
