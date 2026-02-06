import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import api from "../services/api";
export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const [allowed, setAllowed] = useState<"loading" | "yes" | "no">("loading");

  useEffect(() => {
    const check = async () => {
      try {
        const res = await api.get(
          "/?module=auth&action=me",
          {
            withCredentials: true,
          }
        );

        if (res.data.loggedIn) {
          setAllowed("yes");
        } else {
          setAllowed("no");
        }
      } catch {
        setAllowed("no");
      }
    };

    check();
  }, []);

  if (allowed === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-pice-navy border-t-transparent rounded-full animate-spin"></div>
          <span>Checking session...</span>
        </div>
      </div>
    );
  }

  if (allowed === "no") {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
