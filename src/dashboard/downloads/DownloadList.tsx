/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import Swal from "sweetalert2";
import { UPLOADS_URL } from "../../services/api";

type Category = "forms" | "reports" | "others";

type Download = {
  id: number;
  title: string;
  description: string;
  file: string;
  category: Category;
  created_at: string;
};

const PAGE_SIZE = 8;

export default function DownloadList() {
  const [data, setData] = useState<Download[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<"all" | Category>("all");
  const [page, setPage] = useState(1);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category>("forms");
  const [file, setFile] = useState<File | null>(null);
  const [oldFile, setOldFile] = useState("");
  const [previewFile, setPreviewFile] = useState<Download | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(
          "/?module=downloads&action=read",
        );
        setData(Array.isArray(res.data) ? res.data : []);
      } catch {
        Swal.fire("Error", "Failed to load downloads.", "error");
      }
    };

    fetchData();
  }, []);

  // Reusable refresh
  const refreshData = async () => {
    try {
      const res = await api.get(
        "/?module=downloads&action=read",
      );
      setData(Array.isArray(res.data) ? res.data : []);
    } catch {
      Swal.fire("Error", "Failed to refresh downloads.", "error");
    }
  };

  const filtered = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        filterCategory === "all" || item.category === filterCategory;

      return matchesSearch && matchesCategory;
    });
  }, [data, search, filterCategory]);

  // const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openAddModal = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setCategory("forms");
    setFile(null);
    setOldFile("");
    setShowModal(true);
  };

  const openEditModal = async (id: number) => {
    try {
      const res = await api.get(
        `/?module=downloads&action=get&id=${id}`,
      );

      setEditingId(id);
      setTitle(res.data.title);
      setDescription(res.data.description);
      setCategory(res.data.category);
      setOldFile(res.data.file);
      setFile(null);
      setShowModal(true);
    } catch {
      Swal.fire("Error", "Failed to load file.", "error");
    }
  };

  const deleteItem = async (id: number) => {
    const result = await Swal.fire({
      title: "Delete file?",
      text: "This file will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await api.get(
        `/?module=downloads&action=delete&id=${id}`,
        { withCredentials: true }
      );
      await refreshData();
      Swal.fire("Deleted!", "File removed.", "success");
    } catch {
      Swal.fire("Error", "Failed to delete file.", "error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    if (file) formData.append("file", file);

    try {
      if (editingId === null) {
        await api.post(
          "/?module=downloads&action=create",
          formData,{ withCredentials: true }
        );
        Swal.fire({
          icon: "success",
          title: "Uploaded!",
          timer: 1200,
          showConfirmButton: false,
        });
      } else {
        formData.append("id", editingId.toString());
        formData.append("oldFile", oldFile);

        await api.post(
          "/?module=downloads&action=update",
          formData,{ withCredentials: true }
        );
        Swal.fire({
          icon: "success",
          title: "Updated!",
          timer: 1200,
          showConfirmButton: false,
        });
      }

      setShowModal(false);
      await refreshData();
    } catch {
      Swal.fire("Error", "Failed to save file.", "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-pice-navy tracking-tight">
            Downloads
          </h1>
          <p className="text-gray-500 text-sm">Manage downloadable files</p>
        </div>

        <button onClick={openAddModal} className="btn-primary">
          ➕ Upload File
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-col md:flex-row gap-4">
        <input
          className="input"
          placeholder="Search..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <select
          className="input md:w-60"
          value={filterCategory}
          onChange={(e) => {
            setFilterCategory(e.target.value as any);
            setPage(1);
          }}
        >
          <option value="all">All Categories</option>
          <option value="forms">Forms</option>
          <option value="reports">Reports</option>
          <option value="others">Others</option>
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((item) => (
              <tr key={item.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{item.title}</td>
                <td className="px-4 py-3">{item.category}</td>
                <td className="px-4 py-3 text-sm">{item.created_at}</td>
                <td className="px-4 py-3 space-x-2">
                  <button
                    onClick={() => setPreviewFile(item)}
                    className="text-green-600"
                  >
                    View
                  </button>

                  <button
                    onClick={() => openEditModal(item.id)}
                    className="text-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
          <div className="card w-full max-w-xl p-6 animate-[modalIn_0.25s_ease-out]">
            <h2 className="text-xl font-bold mb-4">
              {editingId === null ? "Upload File" : "Edit File"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <select
                className="input"
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
              >
                <option value="forms">Forms</option>
                <option value="reports">Reports</option>
                <option value="others">Others</option>
              </select>

              <input
                className="input"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <textarea
                className="input"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              {editingId !== null && oldFile && (
                <div className="text-sm text-gray-500">
                  Current file: <b>{oldFile}</b>
                </div>
              )}

              <input
                type="file"
                className="input"
                onChange={(e) => e.target.files && setFile(e.target.files[0])}
              />

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingId === null ? "Upload" : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FILE PREVIEW MODAL */}
      {previewFile && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-[10000]"
          onClick={() => setPreviewFile(null)}
        >
          <div
            className="bg-white w-full max-w-4xl h-[85vh] rounded-xl shadow-lg overflow-hidden animate-[modalIn_0.25s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center px-4 py-3 border-b">
              <h3 className="font-bold text-lg">{previewFile.title}</h3>
              <button
                onClick={() => setPreviewFile(null)}
                className="text-xl font-bold"
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div className="h-full">
              {(() => {
                const fileUrl = encodeURI(
                  `${UPLOADS_URL}/downloads/${previewFile.file}`,
                );

                const ext = previewFile.file.split(".").pop()?.toLowerCase();

                if (ext === "pdf") {
                  return (
                    <iframe
                      src={fileUrl}
                      className="w-full h-full"
                      title="PDF Preview"
                    />
                  );
                }

                if (["jpg", "jpeg", "png", "webp"].includes(ext || "")) {
                  return (
                    <div className="flex items-center justify-center h-full bg-black">
                      <img src={fileUrl} className="max-w-full max-h-full" />
                    </div>
                  );
                }

                return (
                  <div className="flex flex-col items-center justify-center h-full gap-4">
                    <p className="text-gray-600">
                      This file cannot be previewed in browser.
                    </p>
                    <a href={fileUrl} download className="btn-primary">
                      Download File
                    </a>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
