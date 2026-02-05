/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Slider from "../components/Slider";

export default function Home() {
  const [accomplishments, setAccomplishments] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const acc = await axios.get(
          "/pice-backend/api/?module=accomplishments&action=read",
        );

        const ann = await axios.get(
          "/pice-backend/api/?module=announcements&action=read",
        );

        const accList = Array.isArray(acc.data)
          ? acc.data
          : Array.isArray(acc.data?.data)
            ? acc.data.data
            : [];

        const annList = Array.isArray(ann.data)
          ? ann.data
          : Array.isArray(ann.data?.data)
            ? ann.data.data
            : [];

        setAccomplishments(accList.slice(0, 3));
        setAnnouncements(annList.slice(0, 3));
      } catch (err) {
        console.error("Home load error", err);
        setAccomplishments([]);
        setAnnouncements([]);
      }
    };

    load();
  }, []);

  return (
    <div>
      <Slider />

      {/* Accomplishments */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex justify-between mb-6">
          <h2 className="text-2xl font-bold">Latest Accomplishments</h2>
          <Link
            to="/accomplishment/projects-programs"
            className="text-pice-navy"
          >
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {accomplishments.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded shadow overflow-hidden"
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

      {/* Announcements */}
      <section className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between mb-6">
            <h2 className="text-2xl font-bold">Latest Announcements</h2>
            <Link to="/announcements" className="text-pice-navy">
              View all →
            </Link>
          </div>

          <div className="space-y-4">
            {announcements.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded shadow">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {item.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
