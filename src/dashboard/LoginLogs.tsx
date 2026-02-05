import { useEffect, useState } from "react"
import axios from "axios"

type Log = {
  id: number
  username: string
  ip_address: string
  status: string
  created_at: string
}

export default function LoginLogs() {
  const [data, setData] = useState<Log[]>([])

  useEffect(() => {
    axios
      .get("/pice-backend/api/?module=auth&action=logs", {
        withCredentials: true,
      })
      .then(res => setData(res.data))
  }, [])

  return (
    <div className="card p-6">
      <h2 className="text-xl font-bold mb-4">Login History</h2>

      <table className="w-full" style={{ textAlign: "center" }}>
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-center">User</th>
            <th className="p-2">IP</th>
            <th className="p-2">Status</th>
            <th className="p-2">Date</th>
          </tr>
        </thead>

        <tbody>
          {data.map(log => (
            <tr key={log.id} className="border-t">
              <td className="p-2">{log.username}</td>
              <td className="p-2">{log.ip_address}</td>
              <td className="p-2 font-medium">
                {log.status === "success" && (
                    <span className="text-green-700 bg-green-100 px-2 py-1 rounded">
                    SUCCESS
                    </span>
                )}

                {(log.status === "failed" || log.status === "password_change_failed") && (
                    <span className="text-red-700 bg-red-100 px-2 py-1 rounded">
                    {log.status === "failed" ? "FAILED" : "PASSWORD CHANGE FAILED"}
                    </span>
                )}

                {log.status === "password_change" && (
                    <span className="text-blue-700 bg-blue-100 px-2 py-1 rounded">
                    PASSWORD CHANGE
                    </span>
                )}

                {log.status === "logout" && (
                    <span className="text-gray-700 bg-gray-100 px-2 py-1 rounded">
                    LOGOUT
                    </span>
                )}
                </td>

              <td className="p-2">{log.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
