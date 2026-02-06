import { useEffect, useState } from "react"
import api from "../services/api";

type FAQ = {
  id: number
  question: string
  answer: string
}

export default function FAQs() {
  // ✅ Load cache safely during initialization (NOT in useEffect)
  const [data, setData] = useState<FAQ[]>(() => {
    const cached = localStorage.getItem("faqs_cache")
    return cached ? JSON.parse(cached) : []
  })

  const [openId, setOpenId] = useState<number | null>(null)

  // ✅ Effect only syncs with server (React 18 safe)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/?module=faqs&action=read")
        setData(res.data)
        localStorage.setItem("faqs_cache", JSON.stringify(res.data))
      } catch (err) {
        console.error("Failed to load FAQs", err)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-pice-navy mb-6">
        Frequently Asked Questions
      </h1>

      <div className="space-y-4">
        {data.map((faq) => (
          <div key={faq.id} className="card p-4">
            <button
              className="w-full text-left font-semibold flex justify-between items-center"
              onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
            >
              <span>{faq.question}</span>
              <span
                className={`transform transition-transform duration-300 ${
                  openId === faq.id ? "rotate-45" : ""
                }`}
              >
                +
              </span>
            </button>

            {/* Animated accordion */}
            <div
              className={`overflow-hidden transition-all duration-300 ${
                openId === faq.id ? "max-h-96 mt-3" : "max-h-0"
              }`}
            >
              <div className="text-gray-600">
                {faq.answer}
              </div>
            </div>
          </div>
        ))}

        {data.length === 0 && (
          <div className="text-center text-gray-500">
            No FAQs available.
          </div>
        )}
      </div>
    </div>
  )
}
