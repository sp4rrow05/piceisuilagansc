import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

type FAQ = {
  id: number;
  question: string;
  answer: string;
};

export default function FaqList() {
  const [data, setData] = useState<FAQ[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [search, setSearch] = useState("");

  // refresh loader
  const loadData = async () => {
    try {
      const res = await axios.get("/pice-backend/api/?module=faqs&action=read");

      setData(Array.isArray(res.data) ? res.data : []);
    } catch {
      setData([]);
    }
  };

  // initial load (react-18 safe)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "/pice-backend/api/?module=faqs&action=read",
        );

        // 🛡 Ensure we always set an ARRAY
        const result = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
            ? res.data.data
            : [];

        setData(result);
      } catch {
        setData([]); // 🛡 prevent filter crash
        Swal.fire("Error", "Failed to load FAQs", "error");
      }
    };

    fetchData();
  }, []);

  const filtered = Array.isArray(data)
    ? data.filter((item) =>
        item.question.toLowerCase().includes(search.toLowerCase()),
      )
    : [];

  const openAdd = () => {
    setEditingId(null);
    setQuestion("");
    setAnswer("");
    setShowModal(true);
  };

  const openEdit = (faq: FAQ) => {
    setEditingId(faq.id);
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setShowModal(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = new URLSearchParams({
        question,
        answer,
        ...(editingId ? { id: editingId.toString() } : {}),
      });

      const action = editingId === null ? "create" : "update";

      const res = await axios.post(
        `/pice-backend/api/?module=faqs&action=${action}`,
        payload,
        { withCredentials: true },
      );

      if (res.data.error) {
        Swal.fire("Error", res.data.error, "error");
        return;
      }

      Swal.fire(editingId === null ? "Added!" : "Updated!", "", "success");

      setShowModal(false);
      await loadData();
    } catch (err: any) {
      Swal.fire(
        "Error",
        err?.response?.data?.error || "Failed to save FAQ",
        "error",
      );
    }
  };

  const del = async (id: number) => {
    const res = await Swal.fire({
      title: "Delete FAQ?",
      text: "This cannot be undone",
      icon: "warning",
      showCancelButton: true,
    });

    if (!res.isConfirmed) return;

    try {
      const r = await axios.get(
        `/pice-backend/api/?module=faqs&action=delete&id=${id}`,
        { withCredentials: true },
      );

      if (r.data.error) {
        Swal.fire("Error", r.data.error, "error");
        return;
      }

      await loadData();
      Swal.fire("Deleted!", "", "success");
    } catch (err: any) {
      Swal.fire(
        "Error",
        err?.response?.data?.error || "Delete failed",
        "error",
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">FAQs</h1>
        <button className="btn-primary" onClick={openAdd}>
          ➕ Add FAQ
        </button>
      </div>

      <input
        className="input max-w-md"
        placeholder="Search FAQs..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="card overflow-hidden">
        <table className="w-full">
          <tbody>
            {filtered.map((faq) => (
              <tr key={faq.id} className="border-t">
                <td className="p-3">{faq.question}</td>
                <td className="p-3">
                  <button
                    onClick={() => openEdit(faq)}
                    className="text-blue-600 mr-3"
                  >
                    Edit
                  </button>
                  <button onClick={() => del(faq.id)} className="text-red-600">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="card p-6 w-full max-w-lg">
            <form onSubmit={save} className="space-y-4">
              <input
                className="input"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Question"
              />
              <textarea
                className="input"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Answer"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button className="btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
