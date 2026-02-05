import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"

import slider1 from "../assets/slider1.jpg"
import slider2 from "../assets/slider2.jpg"
import slider3 from "../assets/slider3.jpg"

export default function Slider() {
  const images = [slider1, slider2, slider3]

  return (
    <div className="relative z-0">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 4000 }}
        pagination={{ clickable: true }}
        loop
        className="h-[450px] md:h-[520px]"
      >
        {images.map((img, i) => (
          <SwiperSlide key={i}>
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${img})` }}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-pice-navy/80 to-pice-dark/60 z-10" />

      {/* Text Content */}
      <div className="absolute inset-0 z-20 flex items-center">
        <div className="max-w-7xl mx-auto px-6 text-white">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            PICE ISU – Ilagan Student Chapter
          </h1>
          <p className="text-lg md:text-xl text-pice-gray mb-6">
            Philippine Institute of Civil Engineers
          </p>

          <a
            href="/accomplishment/projects-programs"
            className="inline-block bg-pice-gold text-pice-dark px-6 py-3 rounded font-semibold hover:bg-pice-orange transition"
          >
            View Accomplishments
          </a>
        </div>
      </div>
    </div>
  )
}
