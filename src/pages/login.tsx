/* eslint-disable @typescript-eslint/no-explicit-any */
import { Eye, EyeOff, User, Lock } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";


export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false)


  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("handleLogin called", { username });
    console.log("login handler running", {
      password: password ? "******" : "",
    });
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("username", username)
      formData.append("password", password)

      const res = await axios.post(
        "/pice-backend/api/?module=auth&action=login",
        formData,
        { withCredentials: true }
      )


      console.log(res);
      if (res.data.success) {
        console.log("login success, navigating to /dashboard");
        navigate("/dashboard", { replace: true });
      } else {
        setShake(true)
        setTimeout(() => setShake(false), 500)
        Swal.fire("Login failed", "Invalid credentials", "error");
      }
    } catch (err: any) {
      
      console.error("login error", err);
      const msg = err?.response?.data?.message || "Server error";
      Swal.fire("Error", msg, "error");
    }finally {
      setLoading(false)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pice-navy to-blue-900">
      <div className={`bg-white w-full max-w-md p-8 rounded-xl shadow-2xl transition ${shake ? "animate-shake" : ""}`}>
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <img src="/pice-logo.png" alt="PICE Logo" className="h-24 mb-3" />
          <h1 className="text-xl font-bold text-pice-navy">PICE ISU Ilagan</h1>
          <p className="text-sm text-gray-500">Admin Dashboard Login</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <input
              className="input pl-10"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <User
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="input pl-10 pr-10"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Lock
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-pice-navy transition"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pice-gold text-pice-navy font-semibold py-2 rounded flex justify-center items-center gap-2 hover:opacity-90 transition disabled:opacity-70"
          >
            {loading ? (
              <>
                <span className="w-5 h-5 border-2 border-pice-navy border-t-transparent rounded-full animate-spin"></span>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
