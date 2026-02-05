import { useEffect, useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import Slider from "../components/Slider"
import DetailModal from "../components/DetailModal"

export default function Home() {

  const [accomplishments, setAccomplishments] = useState<any[]>([])
  const [announcements, setAnnouncements] = useState<any[]>([])

  const [selected, setSelected] = useState<any | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const acc = await axios.get("/pice-backend/api/?module=accomplishments&action=read")
        const ann = await axios.get("/pice-backend/api/?module=announcements&action=read")

        setAccomplishments(Array.isArray(acc.data) ? acc.data.slice(0,3) : [])
        setAnnouncements(Array.isArray(ann.data) ? ann.data.slice(0,3) : [])

      } catch {
        setAccomplishments([])
        setAnnouncements([])
      }
    }

    load()
  }, [])

  return (
  <div>

    <Slider />

    {/* ================= ACCOMPLISHMENTS ================= */}
    <section className="max-w-7xl mx-auto px-6 py-12">

      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Latest Accomplishments</h2>

        <Link to="/accomplishment/projects-programs" className="text-pice-navy">
          View all →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {accomplishments.map(item => (

          <div
            key={item.id}
            className="bg-white rounded shadow overflow-hidden cursor-pointer hover:shadow-lg transition"
            onClick={() => setSelected({
              title: item.title,
              image: `/pice-backend/uploads/accomplishments/${item.image}`,
              content: item.description
            })}
          >

            <img
              src={`/pice-backend/uploads/accomplishments/${item.image}`}
              className="h-40 w-full object-cover"
            />

            <div className="p-4">
              <h3 className="font-semibold">{item.title}</h3>

              <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                {item.description}
              </p>
            </div>

          </div>

        ))}

      </div>
    </section>


    {/* ================= ANNOUNCEMENTS ================= */}
    <section className="bg-gray-100 py-12">

      <div className="max-w-7xl mx-auto px-6">

        <div className="flex justify-between mb-6">
          <h2 className="text-2xl font-bold">Latest Announcements</h2>

          <Link to="/announcements" className="text-pice-navy">
            View all →
          </Link>
        </div>

        <div className="space-y-4">

          {announcements.map(item => (

            <div
              key={item.id}
              className="bg-white p-4 rounded shadow cursor-pointer hover:bg-gray-50"
              onClick={() => setSelected({
                title: item.title,
                content: item.content
              })}
            >

              <h3 className="font-semibold">{item.title}</h3>

              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {item.content}
              </p>

            </div>

          ))}

        </div>
      </div>
    </section>


    {/* ========== MODAL ========== */}
    <DetailModal
      open={!!selected}
      onClose={() => setSelected(null)}
      title={selected?.title}
      image={selected?.image}
      content={selected?.content}
    />

  </div>)
}
