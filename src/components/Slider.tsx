import { useEffect, useState } from "react"
import api from "../services/api";
import { UPLOADS_URL } from "../services/api";
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Pagination } from "swiper/modules"

import "swiper/css"
import "swiper/css/pagination"

type Slide = {
  id: number
  image: string
  title: string
  subtitle: string
  button_text?: string
  button_link?: string
}

export default function Slider() {

  const [slides, setSlides] = useState<Slide[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(
          "/?module=slider&action=read"
        )

        setSlides(Array.isArray(res.data) ? res.data : [])
      } catch (err) {
        console.error("Slider load failed", err)
        setSlides([])
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])


  if (loading) {
    return (
      <div className="h-[450px] md:h-[520px] flex items-center justify-center bg-gray-100">
        Loading...
      </div>
    )
  }


  // ========== NO SLIDES FALLBACK ==========
  if (slides.length === 0) {
    return (
      <div className="relative h-[450px] md:h-[520px] bg-pice-navy text-white flex items-center">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            PICE ISU – Ilagan Student Chapter
          </h1>

          <p className="text-lg md:text-xl text-pice-gray mb-6">
            Philippine Institute of Civil Engineers
          </p>

          <p className="text-lg md:text-xl text-pice-gold">
            By the students, Of the students, For the students
          </p>
        </div>
      </div>
    )
  }


  // ========== MAIN SLIDER ==========
  return (
    <div className="relative z-0">

      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 4000 }}
        pagination={{ clickable: true }}
        loop
        className="h-[450px] md:h-[520px]"
      >

        {slides.map((s) => (
          <SwiperSlide key={s.id}>

            <div
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: `url(${UPLOADS_URL}/sliders/${s.image})`
              }}
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-pice-navy/80 to-pice-dark/60 z-10" />

            {/* Text */}
            <div className="absolute inset-0 z-20 flex items-center">
              <div className="max-w-7xl mx-auto px-6 text-white">

                {/* <h1 className="text-3xl md:text-5xl font-bold mb-4">
                  {s.title}
                </h1> */}
                

                {s.subtitle && (
                  <p className="text-lg md:text-xl text-pice-gray mb-6">
                    {s.subtitle}
                  </p>
                )}

                {s.button_text && s.button_link && (
                  <a
                    href={s.button_link}
                    className="inline-block bg-pice-gold text-pice-dark px-6 py-3 rounded font-semibold hover:bg-pice-orange transition"
                  >
                    {s.button_text}
                  </a>
                )}

              </div>
            </div>

          </SwiperSlide>
        ))}

      </Swiper>
      {/* Overlay */} 
      <div className="absolute inset-0 bg-gradient-to-r from-pice-navy/20 to-pice-dark/10 z-10" /> 
        {/* Text Content */} 
        <div className="absolute inset-0 z-20 flex items-center"> 
          <div className="max-w-7xl mx-auto px-6 text-white"> 
            <h1 className="text-3xl md:text-5xl font-bold mb-4"> PICE ISU – Ilagan Student Chapter </h1> 
            <p className="text-lg md:text-xl text-pice-gray mb-6"> Philippine Institute of Civil Engineers </p> 
            <p className="text-lg md:text-xl text-pice-gold mb-6"> By the students, Of the students, For the students </p> 
          </div>
        </div>
      </div>
  )
}
