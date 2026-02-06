import { useState } from "react"
import api from "../services/api";
import Swal from "sweetalert2"

export default function Account() {
  const [oldPassword, setOld] = useState("")
  const [newPassword, setNew] = useState("")

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()

  
    const res = await api.post(
      "/?module=auth&action=change_password",
      new URLSearchParams({
        oldPassword,
        newPassword
      }),
      { withCredentials: true }
    )

    if (res.data.success) {
      Swal.fire("Success", "Password changed", "success")
      setOld("")
      setNew("")
    } else {
      Swal.fire("Error", res.data.message, "error")
    }
  }

  return (
    <div className="card p-6 max-w-lg">
      <h2 className="text-xl font-bold mb-4">Change Password</h2>

      <form onSubmit={submit} className="space-y-4">
        <input
          type="password"
          className="input"
          placeholder="Old Password"
          value={oldPassword}
          onChange={e => setOld(e.target.value)}
        />

        <input
          type="password"
          className="input"
          placeholder="New Password"
          value={newPassword}
          onChange={e => setNew(e.target.value)}
        />

        <button className="btn-primary">Update Password</button>
      </form>
    </div>
  )
}
